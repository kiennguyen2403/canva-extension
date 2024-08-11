from flask import Flask, jsonify, request

app = Flask(__name__)

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
    return jsonify({
        "message": "Data received successfully!",
        "received_data": data
    })

# Run the server
if __name__ == '__main__':
    app.run(debug=True)
