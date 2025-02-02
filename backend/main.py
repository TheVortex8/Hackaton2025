from prediction import generate_predictions, train_model
from flask import Flask, jsonify, request, send_file
import numpy as np
import pandas as pd
from optimize import optimize
from resources import resources_df
from flask_cors import CORS
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

model = None

@app.route('/predict', methods=['GET'])
def predict():
    try:
        global model
        print(request.args)
        if request.args.get('train').lower() == 'true':
            model = train_model()
        
        if model is None:
            raise RuntimeError('Please train the model first by calling /train')
        return jsonify({'predictions': generate_predictions(model)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/train', methods=['GET'])
def train():# -> tuple[Any, Literal[200]] | tuple[Any, Literal[500]]:
    try:
        global model
        model = train_model()
        return predict()
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
