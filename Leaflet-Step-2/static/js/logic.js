// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

function changeColor(feature) {
  let mag = feature.properties.mag;
  console.log(mag);
  let depth = feature.geometry.coordinates[2];
  console.log(depth)
  console.log("---------------")
  if (depth > 90) {
    return "black";
  }
  else if (depth >80 ) {
    return "darkred";
  }
  else if (depth >70 ) {
    return "red";
  }
  else if (depth > 60 ) {
    return "Crimson";
  }
  else if (depth > 50 ) {
    return "darkorange";
  }
  else if (depth > 40 ) {
    return "orange";
  }
  else if (depth > 30 ) {
    return "yellow";
  }
  else if (depth > 20 ) {
    return "LemonChiffon";
  }
  else if (depth >10 ) {
    return "green";
  }
  else {
    return "lightgreen";
  }
}

// 2. 
function createFeatures(earthquakeData) {

  // Save the earthquake data in a variable.
  function onEachFeature(feature, layer) {

    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag} | Depth: ${feature.geometry.coordinates[2]}km`)
  }

  let earthquakes = L.geoJson(earthquakeData, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      return {
        color: "white",
        weight: 0.3,
        radius: feature.properties.mag * 4,
        fillOpacity: 1,
        fillColor: changeColor(feature)
      }
    },
    onEachFeature: onEachFeature
  })

  // Pass the earthquake data to a createMap() function.
  createMap(earthquakes);
}

// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
  // Create the base layers.
  let graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  let satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });
  
  let outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  

  // Create a baseMaps object.
  let baseMaps = {
    "Satelite": satellitemap,
    "Grayscale": graymap,
    "Outdoors": outdoors
  };

  // Creat an overlays object.
  let overlayMaps = {
    "Tectonic Plates": tectonic,
    "Earthquakes": earthquakes
  };
  
  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [graymap, satellitemap, outdoors]
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      let div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
          colors = ["lightgreen", "green", "LemonChiffon", "yellow", "orange", "darkorange", "Crimson", "red", "darkred", "black"];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);
}
