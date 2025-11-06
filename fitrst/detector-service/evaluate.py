# evaluate.py — simple IoU-based detector evaluator
import json, os, sys
import numpy as np
from pathlib import Path

def iou(boxA, boxB):
    xA = max(boxA[0], boxB[0]); yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2]); yB = min(boxA[3], boxB[3])
    interW = max(0, xB-xA); interH = max(0, yB-yA)
    inter = interW*interH
    boxAArea = (boxA[2]-boxA[0])*(boxA[3]-boxA[1])
    boxBArea = (boxB[2]-boxB[0])*(boxB[3]-boxB[1])
    union = boxAArea + boxBArea - inter
    return inter/union if union>0 else 0

# load GT (COCO-like) and preds (expected format below)
gt = json.load(open('datasets/test/annotations.json'))
# format: {"images":[{"id":1,"file_name":"1.jpg"}], "annotations":[{"image_id":1,"bbox":[x,y,w,h],"category_id":1},...]}
images = {im['id']:im for im in gt['images']}
anns_by_image = {}
for a in gt['annotations']:
    anns_by_image.setdefault(a['image_id'], []).append(a)

# load predictions (produce this by running your detector on test set; expected json list of dicts)
preds = json.load(open('results/predictions.json'))  # [{"image_id":1,"bbox":[x,y,w,h],"score":0.9,"category_id":1},...]

TP=0; FP=0; FN=0
IOU_THRESH=0.5
for p in preds:
    img_id = p['image_id']
    pred_box = [p['bbox'][0], p['bbox'][1], p['bbox'][0]+p['bbox'][2], p['bbox'][1]+p['bbox'][3]]
    matched=False
    for a in anns_by_image.get(img_id,[]):
        gt_box = [a['bbox'][0], a['bbox'][1], a['bbox'][0]+a['bbox'][2], a['bbox'][1]+a['bbox'][3]]
        if p['category_id']==a['category_id'] and iou(pred_box, gt_box) >= IOU_THRESH:
            matched=True
            anns_by_image[img_id].remove(a)
            TP+=1
            break
    if not matched:
        FP+=1

# any remaining GT are FN
for remaining in anns_by_image.values():
    FN += len(remaining)

precision = TP/(TP+FP) if TP+FP else 0
recall = TP/(TP+FN) if TP+FN else 0
f1 = 2*precision*recall/(precision+recall) if precision+recall else 0

print(f"TP={TP} FP={FP} FN={FN}")
print(f"Precision={precision:.3f} Recall={recall:.3f} F1={f1:.3f}")
