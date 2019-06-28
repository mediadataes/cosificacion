from nudenet import NudeDetector
import cv2  
import json
import os
import tensorflow as tf
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf

import warnings
warnings.filterwarnings("ignore")

#tf.logging.set_verbosity(tf.logging.ERROR)
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

#img_path = 'output/frames/BEBE.mkv/frame0034.jpg'
img_path = 'output/frames/test/test.jpg'
detector = NudeDetector('models/detector_model')
result = detector.detect(img_path, min_prob=0.48)
## [{'box': [352, 688, 550, 858], 'score': 0.9603578, 'label': 'BELLY'}, {'box': [507, 896, 586, 1055], 'score': 0.94103414, 'label': 'F_GENITALIA'}, {'box': [221, 467, 552, 650], 'score': 0.8011624, 'label': 'F_BREAST'}, {'box': [359, 464, 543, 626], 'score': 0.6324697, 'label': 'F_BREAST'}]





#[{'box': [204, 260, 362, 360], 'score': 0.6535794, 'label': 'BELLY'}, {'box': [190, 160, 360, 267], 'score': 0.5245675, 'label': 'F_BREAST'}, {'box': [162, 264, 233, 327], 'score': 0.3220556, 'label': 'F_BREAST'}]


cv_image = cv2.imread(img_path)
#json_result = json.loads()
#print(json_result)

#print(result)

print("")
print("")
print("--------------------------------------------")
for item in result:
    left = item['box'][0]
    top = item['box'][1]

    right = item['box'][2]
    bottom = item['box'][3]

    label = item['label']
    print(">>>>>>> I have detected: "+label)

    cv2.rectangle(cv_image, (left,top), (right,bottom), (0,0,255), 2)
    cv2.putText(cv_image, item['label'], (left,top), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

print("")
print("")
cv2.imwrite('output.jpg',cv_image)
