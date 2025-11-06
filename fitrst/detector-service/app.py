# detector-service/app.py
from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
from model_utils import Detector
import uuid
import os
from datetime import datetime


app = Flask(__name__)
MODEL_PATH = "./weights/best.pt" # Replace with chosen model
os.makedirs('evidence', exist_ok=True)


detector = Detector(MODEL_PATH)


@app.route('/detect', methods=['POST'])
def detect():
# Accepts JSON with base64 image OR multipart/form-data with file
if 'image' in request.json:
img_b64 = request.json['image']
img_bytes = base64.b64decode(img_b64)
arr = np.frombuffer(img_bytes, np.uint8)
img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
else:
return jsonify({"error": "no image"}), 400


results = detector.run_on_image(img)


# Post-process to derive violations (example heuristics)
violations = detector.infer_violations(results, img)


# Save evidence image
uid = str(uuid.uuid4())
filename = f'evidence/{uid}.jpg'
cv2.imwrite(filename, img)


payload = {
'id': uid,
'time': datetime.utcnow().isoformat() + 'Z',
'violations': violations,
'evidence_path': filename
}


# Option: forward to orchestration API
# requests.post('http://api-server:3000/api/reports', json=payload)


return jsonify(payload)


if __name__ == '__main__':
app.run(host='0.0.0.0', port=5001)