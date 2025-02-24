import eventlet

eventlet.monkey_patch()  # Deve ser chamado antes de qualquer outro import

import json
import os

import redis
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # WebSockets

# Variável global para evitar múltiplos listeners
listener_started = False

# Conexão com o Redis
try:
    redis_host = os.getenv("REDIS_HOST", "redis")
    r = redis.StrictRedis(host=redis_host, port=6379, decode_responses=True)
    r.ping()  # Testa a conexão
except redis.ConnectionError:
    print("Erro: Não foi possível conectar ao Redis.")
    exit(1)


@app.route("/create-auction", methods=["POST"])
def create_auction():
    try:
        data = request.json
        if not data or "id" not in data:
            return jsonify({"error": "Dados inválidos!"}), 400

        auction_id = data["id"]
        data["active"] = json.dumps(data["active"])
        data["bids"] = json.dumps(data["bids"])

        r.hset(f"auction:{auction_id}", mapping=data)
        return jsonify({"message": "Auction created!", "result": data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/view-auctions", methods=["GET"])
def view_auctions():
    try:
        auctions = r.keys("auction:*")
        auction_list = [
            {
                "id": auction.split(":")[1],
                "title": r.hget(auction, "title"),
                "active": r.hget(auction, "active"),
                "current_bid": r.hget(auction, "current_bid"),
            }
            for auction in auctions
        ]
        return jsonify(auction_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/place-bid", methods=["POST"])
def place_bid():
    try:
        data = request.json
        if not data or "id" not in data or "bid" not in data:
            return jsonify({"error": "Dados inválidos!"}), 400

        auction_id = data["id"]
        bid = float(data["bid"])
        name = data["name"]
        datetime = data["datetime"]

        if not r.exists(f"auction:{auction_id}"):
            return jsonify({"error": "Leilão não encontrado!"}), 404

        if r.hget(f"auction:{auction_id}", "active") != "true":
            return jsonify({"error": "O leilão não está ativo!"}), 400

        current_bid = float(r.hget(f"auction:{auction_id}", "current_bid") or 0)

        if bid > current_bid:
            r.hset(f"auction:{auction_id}", "current_bid", bid)

            unique_bid_id = f"{name}|{datetime}"

            # Armazena o lance no conjunto ordenado com o valor do lance como pontuação
            r.zadd(f"bids:{auction_id}", {unique_bid_id: bid})

            # Publica a atualização no canal do Redis
            r.publish(
                f"auction:{auction_id}",
                json.dumps({"bid": bid, "name": name, "datetime": datetime}),
            )

            return jsonify({"message": "Bid placed!"}), 200
        else:
            return jsonify({"error": "Bid muito baixo!"}), 400
    except ValueError:
        return jsonify({"error": "Valor do lance inválido!"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/close-auction/<auction_id>", methods=["PUT"])
def disable_auction(auction_id):
    try:
        if not r.exists(f"auction:{auction_id}"):
            return jsonify({"error": "Leilão não encontrado!"}), 404

        r.hset(f"auction:{auction_id}", "active", "false")

        # Notifica os clientes que o leilão foi encerrado
        r.publish(f"auction:{auction_id}", json.dumps({"closed": True}))

        return jsonify({"message": "Auction disabled!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/auction/<auction_id>", methods=["GET"])
def auction_details(auction_id):
    try:
        if not r.exists(f"auction:{auction_id}"):
            return jsonify({"error": "Leilão não encontrado!"}), 404

        auction = r.hgetall(f"auction:{auction_id}")

        # Recupera os lances do conjunto ordenado
        bids = r.zrange(f"bids:{auction_id}", 0, -1, desc=True, withscores=True)

        # Separa o identificador único em nome e data

        auction["bids"] = [
            {
                "name": bid_id.split("|")[0],  # Nome antes dos dois pontos
                "datetime": bid_id.split("|")[1],  # Data após os dois pontos
                "bid": score,
            }
            for bid_id, score in bids
        ]

        return jsonify(auction), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Listener para Pub/Sub do Redis
def redis_listener():
    with app.app_context():
        pubsub = r.pubsub()
        pubsub.psubscribe("auction:*")  # Escuta todos os leilões

        print("🔊 Escutando atualizações dos leilões...")

        for message in pubsub.listen():
            if message["type"] == "pmessage":

                auction_id = message["channel"].split(":")[1]
                data = json.loads(message["data"])

                print("message", message)

                print(f"🔔 Atualização no leilão {auction_id}: {data}")
                socketio.emit(f"auction_update_{auction_id}", data)


if __name__ == "__main__":
    if not listener_started:
        listener_started = True
        eventlet.spawn(redis_listener)
    socketio.run(app, host="0.0.0.0", port=5000)  # debug=True
