import os

import redis
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Conexão com o Redis
try:
    # redis_host = os.getenv("REDIS_HOST", "redis")
    redis_host = os.getenv("REDIS_HOST", "localhost")
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
        data["bids"] = "[]"

        r.hset(f"auction:{auction_id}", mapping=data)
        return jsonify({"message": "Auction created!", "result": data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/view-auctions", methods=["GET"])
def view_auctions():
    try:
        auctions = r.keys("auction:*")
        auction_list = [
            {k: v for k, v in r.hgetall(auction).items()} for auction in auctions
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

        if not r.exists(f"auction:{auction_id}"):
            return jsonify({"error": "Leilão não encontrado!"}), 404

        if r.hget(f"auction:{auction_id}", "active") != "True":
            return jsonify({"error": "O leilão não está ativo!"}), 400

        current_bid = float(r.hget(f"auction:{auction_id}", "current_bid") or 0)

        if bid > current_bid:
            r.hset(f"auction:{auction_id}", "current_bid", bid)

            bids = jsonify(r.hget(f"auction:{auction_id}", "bids"))
            bids.append(bid)

            r.hset(f"auction:{auction_id}", "bids", bids)
            r.hset(f"auction:{auction_id}", "current_bid", current_bid)
            r.publish(f"auction:{auction_id}", f"New bid: {bid}")

            return jsonify({"message": "Bid placed!"}), 200
        else:
            return jsonify({"error": "Bid muito baixo!"}), 400
    except ValueError:
        return jsonify({"error": "Valor do lance inválido!"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/auction/<auction_id>", methods=["GET"])
def auction_details(auction_id):
    try:
        if not r.exists(f"auction:{auction_id}"):
            return jsonify({"error": "Leilão não encontrado!"}), 404

        return jsonify(r.hgetall(f"auction:{auction_id}")), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
