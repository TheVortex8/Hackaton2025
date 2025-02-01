import numpy as np
import pandas as pd
from enum import Enum

if __name__ == '__main__':
    wildfire_history = pd.read_csv('backend/dataset/historical_wildfiredata.csv')
    env_history = pd.read_csv('backend/dataset/historical_environmental_data.csv')
    for env_entry in env_history:
        severity_level = ''
        for wildfire_entry in wildfire_history:
                if(wildfire_entry['timestamp'] == env_entry['timestamp']):
                    severity_level = wildfire_entry['severity']
                    break
            
