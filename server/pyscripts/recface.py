import face_recognition as fr
import numpy as np
import json
import sys
import os

config_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "config.json")

with open(config_file, 'r') as f:
    configs = json.load(f)

threshold = configs['threshold']
training_model = configs["model_1"]

imgloc = str(sys.argv[1])
fe_file = str(sys.argv[2])

output = {'msg': ''}

given_image = fr.load_image_file(imgloc)
face_locations = fr.face_locations(given_image, model=training_model)

if len(face_locations) == 0:
    output['msg'] = 'no face found'
    print(output)
    sys.exit()
elif len(face_locations) > 1:
    output['msg'] = 'multiple faces found'
    print(output)
    sys.exit()

with open(fe_file, 'r') as f:
    face_emb = json.load(f)

known_faces = list(face_emb.keys())
known_face_encodings = list(face_emb.values())

face_encoding = fr.face_encodings(given_image, face_locations)
face_distances = fr.face_distance(known_face_encodings, face_encoding[0])
best_match = np.argmin(face_distances)

if(face_distances[best_match] < threshold):
    output['msg'] = 'existing user'
    output['user_id'] = known_faces[best_match]
    output['face_encoding'] = known_face_encodings[best_match]
else:
    output['msg'] = 'new user'
    output['face_encoding'] = face_encoding[0].tolist()

print(output)
