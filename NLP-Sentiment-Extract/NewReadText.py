import io
import os
import json

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 import Features, EmotionOptions

# Instantiates a client
client = vision.ImageAnnotatorClient()

# The name of the image file to annotate
file_name = os.path.join(
    os.path.dirname(__file__),
    'gekkanTest2.png')

# Loads the image into memory
with io.open(file_name, 'rb') as image_file:
    content = image_file.read()

image = types.Image(content=content)

def detect_text(path):
    """Detects text in the file."""
    from google.cloud import vision
    client = vision.ImageAnnotatorClient()

    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.types.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations

    natural_language_understanding = NaturalLanguageUnderstandingV1(
        version='2018-11-16',
        iam_apikey='ysuAh_Jc3ASnVq3mvfwjONT5dD5G2oqcTGLizYs7HXyC',
        url='https://gateway.watsonplatform.net/natural-language-understanding/api'
    )
    strings = ""
    for text in texts:
        strings += str(text.description)
        break
    response = natural_language_understanding.analyze(
    text=strings,
    features=Features(emotion=EmotionOptions(targets=strings.split('\n')))).get_result()
    print(json.dumps(response, indent=2))

detect_text(file_name)
