from flask import Flask, jsonify, request, send_file
import numpy as np
import pandas as pd
from optimize import optimize
from resources import resources_df
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predictions', methods=['GET'])
def get_predictions():
    csv_file_path = 'generated/predictions.csv'
    try:
        predictions = pd.read_csv(csv_file_path).to_dict(orient='records')
        for i, row in enumerate(predictions):
            row['id'] = i + 1
        return jsonify({'predictions': predictions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        optimization_result = optimize(file_df, resources_df)
        cleaned_result = optimization_result.replace({np.nan: None}).to_dict(orient='records')
        return jsonify({'result': cleaned_result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
