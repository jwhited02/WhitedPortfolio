from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')
db = client['tornado_data_db']
collection = db['tornado_activity']

@app.route('/')
def homepage():
    """Route to serve the homepage with a welcome message."""
    return render_template('homepage.html')

@app.route('/heatmap')
def heat():
    """Route to serve the heatmap HTML page."""
    return render_template('heatmap_index.html')

@app.route('/bubble')
def bubble():
    """Route to serve the bubble map HTML page."""
    return render_template('bubble_index.html')

@app.route('/tornado_counts')
def tornado_counts():
    """Route to serve the tornado counts chart page."""
    return render_template('linemap_index.html')

@app.route('/data', methods=['GET'])
def get_data():
    """API endpoint to retrieve data from MongoDB based on month filter."""
    selected_month = request.args.get('month', 'all')
    query = {}

    if selected_month != 'all':
        query['Month'] = int(selected_month)

    # Retrieve data from MongoDB
    data = list(collection.find(query))

    # Ensure each document is correctly structured as a GeoJSON feature
    features = []
    for item in data:
        # Ensure the coordinates and other necessary fields are present
        if item.get('Starting Long') is not None and item.get('Starting Lat') is not None:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [item.get('Starting Long'), item.get('Starting Lat')]
                },
                "properties": {
                    "year": item.get('Year'),
                    "month": item.get('Month'),
                    "day": item.get('Day'),
                    "date": item.get('Date'),
                    "state": item.get('State'),
                    "magnitude": item.get('Magnitude'),
                    "damages": item.get('Damages')
                }
            }
            features.append(feature)

    # Return the features in the GeoJSON format
    return jsonify({"type": "FeatureCollection", "features": features})

if __name__ == '__main__':
    app.run(debug=True)
