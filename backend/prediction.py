import numpy as np
import pandas as pd
from enum import Enum


severity = {'': 0, 'low': 1, 'medium': 2, 'high': 3}

def get_categorize_serenity(wildfire_history,env_history):
    severity_by_timestamp = np.array([])
    for env_entry in env_history:
        severity_level = ''
        for wildfire_entry in wildfire_history:
                if(wildfire_entry[0] == env_entry[0]):
                    wildfire_severity = wildfire_entry[3]
                    severity_level = severity[wildfire_severity]
                    break
        np.append(severity_by_timestamp,severity_level )
        
    return severity_by_timestamp
        

if __name__ == '__main__':
    wildfire_history = pd.read_csv('backend/dataset/historical_wildfiredata.csv')
    env_history = pd.read_csv('backend/dataset/historical_environmental_data.csv')

    severity_by_timestamp =  get_categorize_serenity(wildfire_history.values, env_history.values)
    
            
