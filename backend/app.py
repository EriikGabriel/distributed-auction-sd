import os

import redis
from flask import Flask, jsonify, request

app = Flask(__name__)

# Conexão com o Redis
redis_host = os.getenv("REDIS_HOST", "redis")
r = redis.StrictRedis(host=redis_host, port=6379, decode_responses=True)


@app.route("/create-auction", methods=["POST"])
def create_auction():
    data = request.json
    auction_id = data["id"]
    r.hset(f"auction:{auction_id}", mapping=data)  # Use o mapping direto
    return jsonify({"message": "Auction created!"}), 201


@app.route("/view-auctions", methods=["GET"])
def view_auctions():
    auctions = r.keys("auction:*")
    return jsonify([r.hgetall(auction) for auction in auctions]), 200


@app.route("/place-bid", methods=["POST"])
def place_bid():
    data = request.json
    auction_id = data["auction_id"]
    bid = data["bid"]

    if r.hget(f"auction:{auction_id}", "active") == "True":
        current_price = float(r.hget(f"auction:{auction_id}", "current_price") or 0)
        if bid > current_price:
            r.hset(f"auction:{auction_id}", "current_price", bid)
            r.publish(f"auction:{auction_id}", f"New bid: {bid}")
            return jsonify({"message": "Bid placed!"}), 200
        else:
            return jsonify({"message": "Bid too low!"}), 400
    return jsonify({"message": "Auction not active!"}), 404


@app.route("/auction/<auction_id>", methods=["GET"])
def auction_details(auction_id):
    return jsonify(r.hgetall(f"auction:{auction_id}")), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
