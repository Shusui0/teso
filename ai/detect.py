#!/usr/bin/env python3
import sys
import json
import cv2
from ultralytics import YOLO

def detect_vehicles_and_violations(image_path):
    # Load YOLOv8 nano model for vehicles and persons
    model = YOLO('yolov8n.pt')

    # Load helmet detection model (assuming helmet.pt is available)
    try:
        helmet_model = YOLO('helmet.pt')
        helmet_detection_available = True
    except:
        helmet_model = None
        helmet_detection_available = False

    # Read image
    img = cv2.imread(image_path)
    if img is None:
        return {'error': 'Could not read image'}

    # Run inference for vehicles and persons
    results = model(img, conf=0.5, classes=[0, 2, 3, 5, 7])  # person, car, motorcycle, bus, truck

    detections = []
    violations = []

    # Extract detections
    persons = []
    motorcycles = []

    for result in results:
        for box in result.boxes:
            cls = int(box.cls.item())
            conf = float(box.conf.item())
            class_name = model.names[cls]
            bbox = box.xyxy.tolist()[0]

            detections.append({
                'class': class_name,
                'confidence': conf,
                'bbox': bbox
            })

            if class_name == 'person':
                persons.append(bbox)
            elif class_name == 'motorcycle':
                motorcycles.append(bbox)

    # Run helmet detection if available
    helmets = []
    if helmet_detection_available and helmet_model:
        helmet_results = helmet_model(img, conf=0.5)
        for result in helmet_results:
            for box in result.boxes:
                helmets.append(box.xyxy.tolist()[0])

    # Detect helmetless driving violations
    for motor_bbox in motorcycles:
        motor_center = [(motor_bbox[0] + motor_bbox[2]) / 2, (motor_bbox[1] + motor_bbox[3]) / 2]
        rider_found = False
        helmet_on_rider = False

        for person_bbox in persons:
            person_center = [(person_bbox[0] + person_bbox[2]) / 2, (person_bbox[1] + person_bbox[3]) / 2]
            # Check if person is near motorcycle (simple proximity check)
            distance = ((motor_center[0] - person_center[0]) ** 2 + (motor_center[1] - person_center[1]) ** 2) ** 0.5
            if distance < 100:  # Adjust threshold as needed
                rider_found = True
                # Check if helmet is on the person
                for helmet_bbox in helmets:
                    helmet_center = [(helmet_bbox[0] + helmet_bbox[2]) / 2, (helmet_bbox[1] + helmet_bbox[3]) / 2]
                    helmet_distance = ((person_center[0] - helmet_center[0]) ** 2 + (person_center[1] - helmet_center[1]) ** 2) ** 0.5
                    if helmet_distance < 50:  # Helmet close to person
                        helmet_on_rider = True
                        break
                if not helmet_on_rider:
                    violations.append({
                        'type': 'helmetless_driving',
                        'description': 'Motorcycle rider without helmet detected',
                        'bbox': motor_bbox,
                        'confidence': 0.8  # Placeholder confidence
                    })
                break

    # Basic signal skipping detection (placeholder - would need traffic light detection)
    # For now, just detect if vehicles are in intersection area (simplified)
    # This is a basic implementation - real signal skipping would require video analysis

    return {
        'detections': detections,
        'violations': violations,
        'total_vehicles': len([d for d in detections if d['class'] in ['car', 'motorcycle', 'bus', 'truck']]),
        'total_violations': len(violations)
    }

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Usage: python detect.py <image_path>'}))
        sys.exit(1)

    image_path = sys.argv[1]
    result = detect_vehicles_and_violations(image_path)
    print(json.dumps(result))
