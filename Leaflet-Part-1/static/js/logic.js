// access the URL endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){

    console.log(data);

    // call the createFeatures function
    createFeatures(data.features); // send the features property over
});

// make functions to process the data
function createFeatures(earthquakeData)
{
    console.log(earthquakeData); // extract the data for our popups for each point

    // define a function named onEachFeature - to extract the location (name)
    // and the date and bind the popups
    function onEachFeature(feature, layer)
    {
        layer.bindPopup(
            `<center>${feature.properties.place}<hr>${new Date(feature.properties.time)}</center>`
        )
    }

    // define a function named pointToLayer to create a circle marker for each point
    function makeCircle(feature, latlng) {
        // determine the size of the marker based on the magnitude of the earthquake
        var markerSize = feature.properties.mag * 4;

        // determine the color of the marker based on the depth of the earthquake
        var depth = feature.geometry.coordinates[2];
        var markerColor = "";
        if (depth < 10) {
        markerColor = "#addd8e";
        } else if (depth < 30) {
        markerColor = "#fff7bc";
        } else if (depth < 50) {
        markerColor = "#fee391";
        } else if (depth < 70) {
        markerColor = "#fdbb84";
        } else if (depth < 90) {
        markerColor = "#ef6548";
        } else {
        markerColor = "#d7301f";
        }

    // create the circle marker with the determined size and color
    return L.circleMarker(latlng, {
    radius: markerSize,
    fillColor: markerColor,
    color: "#000",
    weight: 1,
    fillOpacity: 2
    });
 }

    // use L.geoJSON to make the geoJSON marker layer
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, // onEachFeature (left) is the property for the marker
                                        // layer, onEachFeature (right) is function applied
                                        // to the marker layer

        pointToLayer: makeCircle        // pointToLayer is an option of the L.geoJSON() method that 
                                        // allows you to specify a custom function to create the marker 
                                        // for each GeoJSON feature.
    });

    // call another function to make the map - pass in the geoJSON
    createMap(earthquakes);
}

function createMap(earthquakes)
{
    // add the tile layer
    
    var gray = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });

    var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });


    var street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

    // make a tileLayer object
    var tiles = {
        "GrayScale": gray,
        "Satellite": sat,     
        "Street": street  
    };

    // make overlay that uses the earthquake geoJSON marker layer
    var overlays = {
        "Earthquake Data": earthquakes
    };

    // make the map with the defaults  ->  38.8026° N, 116.4194° W
    var myMap = L.map("map",
        {
            center: [38.8026, -116.4194],
            zoom: 7,
            layers: [gray, earthquakes]
        }
    );

    // layer control
    L.control.layers(tiles, overlays, {
        collapsed: false
    }).addTo(myMap);

    // create a legend for the dept of earthquake data
    var legend = L.control({
    position: "bottomright"
    });

    legend.onAdd = function(map) {
        // set up HTML properties of the legend here
        // legend is designed to create a new 'div' that is not already in the HTML
        // use L.DomUtil.create() to create the HTML that will go in the page
            // make a div with class="info legend"
        let div = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];

        let colors = ["#addd8e", "#fff7bc", "#fee391", "#fdbb84", "#ef6548", "#d7301f"];



        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;&nbsp;' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

            // alert("current value for i = " + i + ",  div.innerHtml = " + div.innerHTML);

        }       // &nbsp; is single space for HTML

        return div;
    };
    legend.addTo(myMap);

}



    

    

    
