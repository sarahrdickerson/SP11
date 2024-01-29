# make sure you are in the backend folder in cmd
# create .venv or enter existing one (to enter existing one, skip to activate step  io]\ u
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
from transformers import pipeline
import scipy

# load_dotenv('.env.local')
# mongo_password = os.getenv('MONGO_PASSWORD')
mongo_password='xzk6BaBfEVE5hP0V'

app = Flask(__name__)
CORS(app)
mongo = PyMongo(
    app, uri='mongodb+srv://sarahdickerson:'+ mongo_password + '@cluster0.ltgtmlx.mongodb.net/Requests')

@app.route('/')
def hello_world():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/generate', methods=['GET', 'POST'])
def generate():
    return jsonify({"message": "Generating music"})

@app.route('/api/generate/audiogen', methods=['GET', 'POST'])
def generate():
    synthesiser = pipeline("text-to-audio", "facebook/musicgen-small")
    music = synthesiser("lo-fi music with a soothing melody", forward_params={"do_sample": True})
    scipy.io.wavfile.write("musicgen_out.wav", rate=music["sampling_rate"], data=music["audio"])
    return jsonify({"message": "Generating music"})

if __name__ == '__main__':
    app.run(debug=True)