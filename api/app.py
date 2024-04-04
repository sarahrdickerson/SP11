# make sure you are in the backend folder in cmd
# create .venv or enter existing one (to enter existing one, skip to activate step  io]\ u
# install all packages
# pip install -r requirements.txt
# activate
# .\.venv\Scripts\activate
# flask run --port=8000
# http://localhost:8000/userdata to see data
import bson
from flask import Flask, jsonify, request, send_file, abort
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
import replicate

from io import BytesIO
import base64
from werkzeug.exceptions import BadRequest
import werkzeug.exceptions
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
users = client["Users"]
users_coll = users["users"]


@app.errorhandler(werkzeug.exceptions.BadRequest)
def handle_bad_request(e):
    return 'empty request', 550


@app.errorhandler(werkzeug.exceptions.BadRequest)
def handle_bad_request2(e):
    return 'wrong/empty length', 551

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


# @app.route('/api/generate/MusicGen', methods=['POST'])
# def generateFile2():
#     incoming = request.get_json()['query']
#     length = request.get_json()['length']
#     processor = AutoProcessor.from_pretrained("facebook/musicgen-large")
#     model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-large")
#
#     inputs = processor(
#         text=[incoming],
#         padding=True,
#         return_tensors="pt",
#     )
#
#     audio_values = model.generate(**inputs, max_new_tokens=256)
#     sampling_rate = model.config.audio_encoder.sampling_rate
#     scipy.io.wavfile.write("musicgen_out.wav", rate=sampling_rate, data=audio_values[0, 0].numpy())
#
#     # fs.put(open('musicgen_out.wav','rb'))
#     result = coll.insert_one({"file": open('musicgen_out.wav', 'rb').read(),"name": "test"})
#     file_id = result.inserted_id
#
#     return jsonify({"message": "Generate Successful", "file_id": str(file_id)})
#
@app.route('/api/generate/MusicGen', methods=['POST'])
def generateFile3():
    incoming = request.get_json()['query']
    length = request.get_json()['length']
   
    if len(incoming) == 0:
        abort(505)

    if type(length) != int or length == 0:
        abort(506)
    output = replicate.run(
    "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
    input={
        "top_k": 250,
        "top_p": 0,
        "prompt": incoming,
        "duration": length,
        "temperature": 1,
        "continuation": False,
        "model_version": "melody-large",
        "output_format": "wav",
        "continuation_start": 0,
        "multi_band_diffusion": False,
        "normalization_strategy": "peak",
        "classifier_free_guidance": 3
    }
    )
    print(output)


    result = coll.insert_one({"file": output,"name": "test"})
    file_id = result.inserted_id

    return jsonify({"message": "Generate Successful", "file_id": str(file_id), "musicFile": str(output)})


@app.route('/api/generate/Riffusion', methods=['POST'])
def generateFile4():
    incoming = request.get_json()['query']
    length = request.get_json()['length']
   
    if len(incoming) == 0:
        abort(505)

    if type(length) != int or length == 0:
        abort(506)
    input = {"prompt_b": "90's rap"}

    output = replicate.run(
    "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
    input=input
    ) 
    print(output)


    result = coll.insert_one({"file": output,"name": "test"})
    file_id = result.inserted_id


    print(f"Result: {result} File ID: {file_id}")
    return jsonify({"message": "Generate Successful", "file_id": str(file_id), "musicfile": str(output)})


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
        file_string = coll.find_one({"_id": ObjectId(file_id)}) # retrieve encoded file from mongo
        binary_data = file_string['file'] # get the binary data string
        buffer = BytesIO(binary_data) # create a buffer with the audio data
        buffer.seek(0) # start reading buffer from beginning
        return send_file(buffer, as_attachment=True, mimetype='audio/wav', download_name='musicgen_out.wav') # send buffer as wav file
    except Exception as e:
        print (e)   
        return jsonify({"message": "File not found", "error": str(e)})
    
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    print(data)
    user = users_coll.find_one({"email": email})
    if user is None:
        return jsonify({"message": "User not found", "success": False})
    if user['password'] != data['password']:
        return jsonify({"message": "Password incorrect", "success": False})
    return jsonify({"message": "Login Successful", "success": True, "user_id": str(user['_id'])})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = users_coll.find_one({"email": email})
    if user is not None:
        return jsonify({"message": "User already exists", "success": False})
    result = users_coll.insert_one(data)
    user_id = result.inserted_id
    return jsonify({"message": "User added successfully!", "user_id": str(user_id), "success": True})

if __name__ == '__main__':
    app.run(debug=True)
