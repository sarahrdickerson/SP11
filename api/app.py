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
from pydub import AudioSegment
import requests

from transformers import pipeline, AutoProcessor, MusicgenForConditionalGeneration
import scipy
# from scipy import io
from scipy.io import wavfile

import gridfs
from diffusers import DiffusionPipeline
import replicate

import io
from io import BytesIO
import base64
import requests
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
fs_coll = db["fs.files"]
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
    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"requests": file_id}})
    return jsonify({"message": "Request added successfully!", "file_id": str(file_id)})


@app.route('/api/generate', methods=['GET', 'POST'])
def generate():
    return jsonify({"message": "Generating music"})

@app.route('/api/generate/musicgen', methods=['POST'])
def generateFile3():
    data = request.get_json()

    incoming = request.get_json()['query']
    length = int(request.get_json()['length'])
   
    if len(incoming) == 0:
        abort(550, "Empty query")

    if type(length) != int or length == 0:
        abort(551, "Invalid length")
        
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

    response = requests.get(output)
    if response.status_code != 200:
        abort(500, description="Failed to retrieve the WAV file")

    result = requestsDb.db.requests.insert_one(data)
    req_file_id = result.inserted_id
    print(f"Added request to db: {result} File ID: {req_file_id}")
    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"requests": req_file_id}})

    # Put WAV content in database
    wav_content = response.content
    wav_file_id = fs.put(wav_content, filename="musicgen_out.wav")

    # Convert WAV to MP3 and put in database
    audio_segment = AudioSegment.from_file(io.BytesIO(wav_content), format="wav")
    mp3_content = io.BytesIO()
    audio_segment.export(mp3_content, format="mp3")
    mp3_content.seek(0)  # Rewind the buffer to the beginning
    mp3_file_id = fs.put(mp3_content, filename="musicgen_out.mp3")

    # music database
    result = coll.insert_one({"file": output,"input": incoming, "file_id": str(wav_file_id), "mp3_file_id": str(mp3_file_id), "name": "test"})
    file_id = result.inserted_id

    # update user database
    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"wav_files": wav_file_id, "mp3_files": mp3_file_id}})

    # update the request in requestsDb to include the wav_file_id
    requestsDb.db.requests.update_one({"_id": ObjectId(req_file_id)}, {"$set": {"wav_file_id": wav_file_id, "mp3_file_id": mp3_file_id}})

    return jsonify({"message": "Generate Successful", "file_id": str(file_id), "musicFile": str(output), "wav_file_id": str(wav_file_id), "mp3_file_id": str(mp3_file_id)})


@app.route('/api/generate/riffusion', methods=['POST'])
def generateFile4():
    data = request.get_json()

    incoming = request.get_json()['query']
   
    if len(incoming) == 0:
        abort(505)

    input = {"prompt_b": "90's rap"}

    output = replicate.run(
    "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
    input=input
    ) 
    print(output)

    response = requests.get(output)
    if response.status_code != 200:
        abort(500, description="failed to retrieve the WAV file")

    result = requestsDb.db.requests.insert_one(data)
    req_file_id = result.inserted_id
    print(f"Added request to db: {result} File ID: {req_file_id}")
    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"requests": req_file_id}})
    
    wav_content = response.content

    wav_file_id = fs.put(wav_content, filename = "riffusion_out.wav")

    result = coll.insert_one({"file": output,"name": "test"})
    file_id = result.inserted_id

    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"wav_files": wav_file_id}})
    # update the request in requestsDb to include the wav_file_id
    requestsDb.db.requests.update_one({"_id": ObjectId(req_file_id)}, {"$set": {"wav_file_id": wav_file_id}})

    return jsonify({"message": "Generate Successful", "file_id": str(file_id), "musicfile": str(output), "wav_file_id": str(wav_file_id)})

@app.route('/api/generate/looptest', methods=['POST'])
def generateFile5():
    data = request.get_json()
   
    input = {
    "seed": -1
    }

    output = replicate.run(
        "allenhung1025/looptest:0de4a5f14b9120ce02c590eb9cf6c94841569fafbc4be7ab37436ce738bcf49f",
        input=input
    )
    print(output)


    response = requests.get(output)
    if response.status_code != 200:
        # remove the request from requestsDb and user coll
        requestsDb.db.requests.delete_one({"_id": ObjectId(req_file_id)})
        users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$pull": {"requests": req_file_id}})
        abort(500, description="failed to retrieve the WAV file")
    
    result = requestsDb.db.requests.insert_one(data)
    req_file_id = result.inserted_id
    print(f"Added request to db: {result} File ID: {req_file_id}")
    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"requests": req_file_id}})

    wav_content = response.content

    wav_file_id = fs.put(wav_content, filename = "looptest_out.wav")

    result = coll.insert_one({"file": output,"name": "test"})
    file_id = result.inserted_id

    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"wav_files": wav_file_id}})
    # update the request in requestsDb to include the wav_file_id
    requestsDb.db.requests.update_one({"_id": ObjectId(req_file_id)}, {"$set": {"wav_file_id": wav_file_id}})

    return jsonify({"message": "Generate Successful", "file_id": str(file_id), "musicfile": str(output), "wav_file_id": str(wav_file_id)})

@app.route('/api/generate/audio-ldm', methods=['POST'])
def generateFile6():
    data = request.get_json()
    
    incoming = request.get_json()['query']
    length = int(request.get_json()['length'])

    if len(incoming) == 0:
        abort(550)

    if type(length) != int or length == 0:
        abort(551)


    input = {
    "text": incoming    }

    output = replicate.run(
        "haoheliu/audio-ldm:b61392adecdd660326fc9cfc5398182437dbe5e97b5decfb36e1a36de68b5b95",
        input=input
    )

    response = requests.get(output)
    if response.status_code != 200:
        abort(500, description="Failed to retrieve the WAV file")

    result = requestsDb.db.requests.insert_one(data)
    req_file_id = result.inserted_id
    print(f"Added request to db: {result} File ID: {req_file_id}")
    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"requests": req_file_id}})

    wav_content = response.content

    wav_file_id = fs.put(wav_content, filename="audio-lm.wav")

    result = coll.insert_one({"file": output,"input": incoming, "file_id": str(wav_file_id), "name": "test"})
    file_id = result.inserted_id

    users_coll.update_one({"_id": ObjectId(data['user_id'])}, {"$push": {"wav_files": wav_file_id}})
    # update the request in requestsDb to include the wav_file_id
    requestsDb.db.requests.update_one({"_id": ObjectId(req_file_id)}, {"$set": {"wav_file_id": wav_file_id}})
    
    return jsonify({"message": "Generate Successful", "file_id": str(file_id), "musicFile": str(output), "wav_file_id": str(wav_file_id)})



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

@app.route('/api/download/<type>/<file_id>', methods=['GET'])
def download(type, file_id):
    try:
        # Retrieve the GridFS file entry
        grid_out = fs.get(ObjectId(file_id))

        # Set the MIME type based on the file type requested
        mime_type = 'audio/mpeg' if type == 'mp3' else 'audio/wav'
        print(mime_type)

        # Create a BytesIO buffer with the file's data
        buffer = BytesIO(grid_out.read())
        buffer.seek(0)  # Move to the start of the buffer
        return send_file(
            buffer,
            as_attachment=True,
            mimetype=mime_type,
            download_name=grid_out.filename
        )
    except gridfs.NoFile:
        # If there's no file with the given ID in GridFS
        return jsonify({"message": "File not found", "error": "File not found"}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
    
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

@app.route('/api/user_wav_history/<user_id>', methods=['GET'])
def user_wav_history(user_id):
    try:
        # Check if user_id is 'null' or otherwise invalid
        if user_id in ('null', 'undefined', ''):
            return jsonify({"message": "Invalid user ID", "success": False}), 400
        
        user = users_coll.find_one({"_id": ObjectId(user_id)})
        if user is None:
            return jsonify({"message": "User not found", "success": False})
        wav_file_array = [str(file_id) for file_id in user.get('wav_files', [])]
        requests_array = [str(file_id) for file_id in user.get('requests', [])]
        return jsonify({"message": "User found", "success": True, "wav_files": wav_file_array, "requests": requests_array})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/get_request/<request_id>', methods=['GET'])
def get_request(request_id):
    try:
        request = requestsDb.db.requests.find_one({"_id": ObjectId(request_id)})
        if request is None:
            return jsonify({"message": "Request not found", "success": False}), 404
        
        # Convert all ObjectIds to strings
        request['_id'] = str(request['_id'])
        if 'wav_file_id' in request:
            request['wav_file_id'] = str(request['wav_file_id'])

        return jsonify({"message": "Request found", "success": True, "request": request})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
