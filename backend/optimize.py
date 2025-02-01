import pandas as pd

def optimize(wildfires_df: pd.DataFrame, resources_df: pd.DataFrame): 
    wildfires_df.sort_values(by='severity', key=lambda x: x.map({'high': 1, 'medium': 2, 'low': 3}), inplace=True)
    resources_df.sort_values(by='cost', inplace=True)

    resources = {}
    for _, resources_row in resources_df.iterrows():
        resource_name = resources_row['name']
        resources[resource_name] = {
            'time': resources_row['time'],
            'cost': resources_row['cost'],
            'units': resources_row['units']
        }

    
    assignments = []
    resource_iter = iter(resources.items())
    current_resource_name, current_resource_info = next(resource_iter)
    for _, wildfire_row in wildfires_df.iterrows():

        while current_resource_info['units'] == 0:
            try:
                current_resource_name, current_resource_info = next(resource_iter)
            except StopIteration:
                print("No more resources available.")
                break

        if current_resource_info['units'] > 0:

            assignments.append({
                'timestamp': wildfire_row['timestamp'],
                'estimated_fire_start_time': wildfire_row['fire_start_time'],
                'severity': wildfire_row['severity'],
                'assigned_resource': current_resource_name,
                'deploy_time': current_resource_info['time'],
                'location': wildfire_row['location'],
                'cost': current_resource_info['cost']
            })
            current_resource_info['units'] -= 1 

   
    assignments_df = pd.DataFrame(assignments)
    return assignments_df
