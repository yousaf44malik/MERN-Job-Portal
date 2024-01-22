from flask import Flask, jsonify, request
import numpy as np
from your_ml_module import your_ml_model_function  # Import your machine learning model function

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Get input data from the request
    input_array = np.array(data['input'])  # Convert input data to a NumPy array
    predictions = your_ml_model_function(input_array)  # Use your machine learning model function
    return jsonify(predictions.tolist())  # Return predictions as JSON

if __name__ == '__main__':
    app.run(debug=True)
