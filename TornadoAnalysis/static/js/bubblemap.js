function createMap(tornadoLayer) {
  // Create the tile layer for background
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the streetmap layer
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the tornadoLayer
  let overlayMaps = {
    "Tornadoes": tornadoLayer
  };

  // Create the map object
  let map = L.map("map-id", {
    center: [37.0902, -95.7129],
    zoom: 5,
    layers: [streetmap, tornadoLayer]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(data) {
  // Initialize an array to hold tornado markers
  let tornadoMarkers = [];

  // Loop through the features array in the GeoJSON data
  data.features.forEach(function(feature) {
    let coords = feature.geometry.coordinates;
    let properties = feature.properties;

    // Handle missing or invalid magnitude values
    let magnitude = parseFloat(properties.magnitude);
    if (isNaN(magnitude) || magnitude < 0) {
      console.warn('Invalid or missing Magnitude:', properties.magnitude, 'for feature:', feature);
      return;
    }

    // Create a circle marker for each tornado
    let tornadoMarker = L.circle([coords[1], coords[0]], {
      color: 'blue',
      fillColor: '#30a3ec',
      fillOpacity: 0.5,
      // Adjust size based on magnitude
      radius: magnitude * 10000  
    });

    // Bind a popup that opens on hover
    tornadoMarker.on('mouseover', function() {
      this.openPopup();
    });

    tornadoMarker.on('mouseout', function() {
      this.closePopup();
    });

    // Bind the popup with tornado details
    tornadoMarker.bindPopup("<h3>Date: " + properties.date + "</h3><hr><p>State: " + properties.state + "</p><p>Magnitude: " + magnitude + "</p><p>Damages: " + properties.damages);

    // Add the marker to the tornadoMarkers array
    tornadoMarkers.push(tornadoMarker);
  });

  // Create a layer group that's made from the tornado markers array, and pass it to the createMap function
  createMap(L.layerGroup(tornadoMarkers));
}

// Fetch the tornado data from the GeoJSON file and call createMarkers when it completes
// d3.json("../Resources/tornado_data.geojson").then(createMarkers);
fetch(`/data?month=all`)
        .then(response => response.json())
        .then(data => {
            // Create a new layer with the fetched data
            createMarkers(data);
        })
        .catch(error => console.error('Error loading the data:', error));