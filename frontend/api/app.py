# make sure you are in the backend folder in cmd
# create .venv or enter existing one (to enter existing one, skip to activate step)
# python -m venv .venv
# install all packages
# pip install -r requirements.txt
# activate
# .\.venv\Scripts\activate
# flask run --port=8000
# http://localhost:8000/userdata to see data

from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
import os
# from dotenv import load_dotenv
from flask_cors import CORS
from bson import ObjectId


# load_dotenv('.env.local')
# mongo_password = os.getenv('MONGO_PASSWORD')
mongo_password='xzk6BaBfEVE5hP0V'

app = Flask(__name__)
CORS(app)
requestsDb = PyMongo(
    app, uri='mongodb+srv://sarahdickerson:'+ mongo_password + '@cluster0.ltgtmlx.mongodb.net/Requests')

@app.route('/')
def hello_world():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/generate_request', methods=['POST'])
def generate_request():
    data = request.get_json()
    result = requestsDb.db.requests.insert_one(data)
    return jsonify({"message": "Request added successfully!"})


# if __name__ == '__main__':
#     app.run(debug=True)