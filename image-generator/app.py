from flask import Flask, jsonify, request
import os
from PIL import Image
from gradio_client import Client
from dotenv import load_dotenv
from inference_sdk import InferenceHTTPClient
import pytesseract
import io
import base64
load_dotenv()

roboflow_api_key = os.getenv("ROBOFLOW_API_KEY")

def process_inference_result(image_path, inference_data):
    # Load the original image
    poster_image = Image.open(image_path)
    # Iterate over detected components
    components = []
    for component in inference_data['predictions']:
        # Get bounding box coordinates
        x = component['x']
        y = component['y']
        width = component['width']
        height = component['height']
        
        # Calculate the top-left and bottom-right coordinates of the bounding box
        left = x - width // 2
        top = y - height // 2
        right = x + width // 2
        bottom = y + height // 2
        
        # Crop the component from the poster image
        cropped_image = poster_image.crop((left, top, right, bottom))
        
        # Convert the image to RGB mode to ensure compatibility with JPEG
        if cropped_image.mode != 'RGB':
            cropped_image = cropped_image.convert('RGB')
        
        # Handle different classes
        if component['class'] in ["Number", "Title", "Description", "Name"]:
            # Extract text using OCR
            extracted_text = pytesseract.image_to_string(cropped_image)
            print(f"Extracted Text from {component['class']}: {extracted_text}")
            # Send text to the backend or process it further
            # Example: send_text_to_backend(extracted_text)
            components.append({
                "class": component['class'],
                "text": extracted_text,
                "x": x,
                "y": y,
                "width": width,
                "height": height
            })
        
        else:
            # Save or send the cropped image
            buffered = io.BytesIO()
            image_name = f"{component['class']}_{component['detection_id']}.jpg"
            cropped_image.save(buffered, format="PNG")
            print(f"Cropped image saved as '{image_name}'")
            components.append({
                "class": component['class'],
                "image": image_name,
                "data": base64.b64encode(buffered.getvalue()).decode("utf-8"),
                "x": x,
                "y": y,
                "width": width,
                "height": height
            })
    return components
        

app = Flask(__name__)


CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key=roboflow_api_key
)
# Sample route to return a simple message
@app.route('/')
def home():
    return "Welcome to the Flask Server!"

# Sample route to return JSON data
@app.route('/data', methods=['GET'])
def get_data():
    sample_data = {
        "name": "Flask Server",
        "message": "Hello, this is a simple Flask backend server!",
        "status": "Success"
    }
    return jsonify(sample_data)

# Sample route to handle POST requests
@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.json
    prompt = data.get('prompt')
    try :
        client = Client("kiendevprovip/image-generator", hf_token="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")
        result = client.predict(
                prompt=prompt,
                negative_prompt=prompt,
                seed=0,
                randomize_seed=True,
                width=512,
                height=512,
                guidance_scale=0,
                num_inference_steps=2,
                api_name="/infer"
        )
        with Image.open(result) as image:
            # (Optional) Perform any image processing here, e.g., resizing
            # image = image.resize((128, 128))  # Resize to 128x128

            # Save the image to a bytes buffer
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")  # You can change format if needed
            encoded_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        inferImages = CLIENT.infer(result, model_id="slide-component-detection/1")
        final = process_inference_result(result, inferImages)
        return jsonify({
            "prototype": encoded_image,
            "received_data": final
        })
    except Exception as e:
        return jsonify({
            "message": "An error occurred!",
            "error": str(e)
        })

# Run the server
if __name__ == '__main__':
    app.run(host= "0.0.0.0",debug=True, port=80)
