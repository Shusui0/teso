import cv2
import time
from datetime import datetime
from ultralytics import YOLO
import os

# Load YOLOv8 helmet model (download once)
# You can use a public helmet model like this:
# https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n-helmet.pt
MODEL_PATH = "helmet_best.pt"  # put your YOLOv8 helmet model in the same folder
model = YOLO(MODEL_PATH)

# Create folder for violation logs
os.makedirs("violations", exist_ok=True)

def log_violation(frame, label, conf):
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"violations/{label}_{timestamp}.jpg"
    cv2.imwrite(filename, frame)
    print(f"[LOGGED] {label} at {timestamp} (conf: {conf:.2f}) → {filename}")

# Open webcam (or replace 0 with 'video.mp4')
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

print("Helmet detection running... Press Q to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run detection
    results = model.predict(frame, imgsz=640, conf=0.4, verbose=False)
    annotated_frame = results[0].plot()

    # Scan detections
    for box, cls, conf in zip(results[0].boxes.xyxy.cpu().numpy(),
                              results[0].boxes.cls.cpu().numpy().astype(int),
                              results[0].boxes.conf.cpu().numpy()):
        label = results[0].names[cls]
        if "no" in label.lower() or "without" in label.lower():
            # Detected violation (no helmet)
            log_violation(frame, label, conf)

    cv2.imshow("Helmet Detection", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
