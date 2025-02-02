from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
from optimize import optimize
from resources import resources_df
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "API is up and running"}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '' or not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file format. Please upload a CSV file'}), 400
    
    try:
        file_df = pd.read_csv(file)
        file_df['location'] = file_df['location'].apply(lambda x: [float(coord) for coord in x.split(',')])
        result = optimize(file_df, resources_df).replace({np.nan: None}).to_dict(orient='records')
        return jsonify({'result': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
