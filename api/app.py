# make sure you are in the backend folder in cmd
# create .venv or enter existing one (to enter existing one, skip to activate step  io]\ u
# install all packages
# pip install -r requirements.txt
# activate
# .\.venv\Scripts\activate
# flask run --port=8000
# http://localhost:8000/userdata to see data
import bson
from flask import Flask, jsonify, request, send_file
from pymongo import MongoClient
from flask_pymongo import PyMongo
import os
# from dotenv import load_dotenv
from flask_cors import CORS
from bson import ObjectId

from transformers import pipeline, AutoProcessor, MusicgenForConditionalGeneration
import scipy
from scipy import io
from scipy.io import wavfile

import gridfs
from diffusers import DiffusionPipeline

from io import BytesIO
import base64

# load_dotenv('.env.local')
# mongo_password = os.getenv('MONGO_PASSWORD')
mongo_password = 'xzk6BaBfEVE5hP0V'

app = Flask(__name__)
CORS(app)
requestsDb = PyMongo(
    app, uri='mongodb+srv://sarahdickerson:' + mongo_password + '@cluster0.ltgtmlx.mongodb.net/Requests')
# mongo = PyMongo(app, uri='mongodb+srv://sarahdickerson:' + mongo_password + '@cluster0.ltgtmlx.mongodb.net/Requests')
client = MongoClient('mongodb+srv://sarahdickerson:' + mongo_password + '@cluster0.ltgtmlx.mongodb.net')
db = client["Music"]
fs = gridfs.GridFS(db)
coll = db["music"]


@app.route('/api/python', methods=['POST', 'GET'])
def hello_world():
    # return jsonify({"message": "Hello, World!"})
    return "<p>Hello, World!</p>"


@app.route('/api/generate_request', methods=['POST', 'GET'])
def generate_request():
    print("Calling generate request")
    data = request.get_json()
    result = requestsDb.db.requests.insert_one(data)
    file_id = result.inserted_id
    print(f"Result: {result} File ID: {file_id}")
    return jsonify({"message": "Request added successfully!", "file_id": str(file_id)})


@app.route('/api/generate', methods=['GET', 'POST'])
def generate():
    return jsonify({"message": "Generating music"})


@app.route('/api/generate/MusicGen', methods=['POST'])
def generateFile():
    incoming = request.get_json()['query']
    length = request.get_json()['length']
    processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
    model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

    inputs = processor(
        text=[incoming],
        padding=True,
        return_tensors="pt",
    )

    audio_values = model.generate(**inputs, max_new_tokens=256)
    sampling_rate = model.config.audio_encoder.sampling_rate
    scipy.io.wavfile.write("musicgen_out.wav", rate=sampling_rate, data=audio_values[0, 0].numpy())

    # fs.put(open('musicgen_out.wav','rb'))
    result = coll.insert_one({"file": open('musicgen_out.wav', 'rb').read(),"name": "test"})
    file_id = result.inserted_id

    print(f"Result: {result} File ID: {file_id}")
    return jsonify({"message": "Generate Successful", "file_id": str(file_id)})


@app.route('/api/generate/AudioGen', methods=['GET', 'POST'])
def generateAudioGen():
    model_id = "harmonai/jmann-large-580k"
    pipe = DiffusionPipeline.from_pretrained(model_id)
    pipe = pipe.to("cuda")

    audios = pipe(audio_length_in_s=4.0).audios

    # To save locally
    for i, audio in enumerate(audios):
        scipy.io.wavfile.write(f"test_{i}.wav", pipe.unet.sample_rate, audio.transpose())
        fs.put(open(f"test_{i}.wav", 'rb'))

    return jsonify({"message": "Generate Successful"})

@app.route('/api/download/<file_id>', methods=['GET'])
def download(file_id):
    try:
        file_string = coll.find_one({"_id": ObjectId(file_id)})
        # print("file string: " + file_string)
        binary_data = file_string['file']
        buffer = BytesIO(binary_data)
        buffer.seek(0)
        # print("buffer: " + buffer)
        return send_file(buffer, as_attachment=True, mimetype='audio/wav', download_name='musicgen_out.wav')
        # return send_file(file, as_attachment=True)
    except Exception as e:
        print (e)   
        return jsonify({"message": "File not found", "error": str(e)})
    
if __name__ == '__main__':
    app.run(debug=True)
