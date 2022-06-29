import face_recognition as fr
import numpy as np
import json
import sys

# str(sys.argv[1])
# str(sys.argv[2])
# "/Users/vedansh/Desktop/newer/FRS-refactored/user_images/temp/9cefc03e-b88f-4e35-9693-4b914518687c.jpeg"
# "/Users/vedansh/Desktop/newer/FRS-refactored/server/face_encodings/face_encodings.json"

imgloc = str(sys.argv[1])
fe_file = str(sys.argv[2])

output = {"msg": "", "user_id": "", "face_encoding": []}

given_image = fr.load_image_file(imgloc)
face_locations = fr.face_locations(given_image, model='hog')

if len(face_locations) == 0:
    output["msg"] = "no face found"
    sys.exit()
elif len(face_locations) > 1:
    output["msg"] = "multiple faces found"
    sys.exit()

with open(fe_file, 'r') as f:
    face_emb = json.load(f)

for k in face_emb.keys():
    face_emb[k] = np.asarray(face_emb[k])

known_faces = list(face_emb.keys())
known_face_encodings = list(face_emb.values())

face_encoding = fr.face_encodings(given_image, face_locations)
face_distances = fr.face_distance(known_face_encodings, face_encoding[0])
best_match = np.argmin(face_distances)

if(face_distances[best_match] < 0.6):
    output["msg"] = "existing user"
    output["user_id"] = known_faces[best_match]
else:
    output["msg"] = "new user"
    output["face_encoding"] = face_encoding[0].tolist()

print(output)
