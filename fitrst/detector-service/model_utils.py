# detector-service/model_utils.py
from ultralytics import YOLO
import cv2


class Detector:
def __init__(self, model_path):
self.model = YOLO(model_path)


def run_on_image(self, image):
# image: BGR numpy array
# ultralytics accepts RGB
rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
results = self.model.predict(source=rgb, imgsz=1280, conf=0.25)
# results is list-like; use results[0].boxes
return results[0]


def infer_violations(self, results, image):
# results.boxes has xyxy, conf, cls
violations = []
boxes = results.boxes
for box in boxes:
cls = int(box.cls.cpu().numpy())
conf = float(box.conf.cpu().numpy())
xyxy = box.xyxy.cpu().numpy().tolist()[0]
# Example mapping: class 0 -> person, 1 -> helmet, 2 -> bike, 3->car, 4->motorbike
# Check helmetless: if motorbike and rider found and no helmet detection nearby => violation
# This is simplified — in practice you need association / tracking
violations.append({
'type': 'example',
'class': cls,
'confidence': conf,
'box': xyxy
})
# Heuristic transforms here
return violations