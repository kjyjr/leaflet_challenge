let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

d3.json(earthquakeURL).then(data => {
   console.log(data.features);
  
    let myMap = L.map("map", {
            center: [0, 0],
            zoom: 2,
        });
    
    var base_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
    
    var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(myMap);

    function onEachFeature(feature, layer) {
        function markerSize(mag){return Math.sqrt(mag) * 10;};
        let depth = feature.geometry.coordinates[2];
        function circleColor(depth){
            if(depth > 90)
                return "red";
            else if(depth > 70)
                return "#fc4903";
            else if(depth > 50)
                return "#fc8403";
            else if(depth > 30)
                return "#fcad03";
            else if(depth > 10)
                return "#cafc03";
            else return "pink";
            }
        var radius = markerSize(feature.properties["mag"]);
        var fillColor = circleColor(depth);
        var circle = L.circleMarker(layer.getLatLng(), {
            radius: radius,
            fillColor: fillColor,
            color: "gray",
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 0.8
            });
            layer.bindPopup(`<h4>${feature.properties.place}</h4><hr>
            ${new Date(feature.properties.time)}</h4><hr>
            Magnitude: ${feature.properties.mag}</h4><hr>
            Depth: ${feature.geometry.coordinates[2]}`);
            circle.addTo(myMap);
        }
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        var intervals = [-10, 10, 30, 50, 70, 90];
        var colors = ['pink', '#cafc03', '#fcad03', '#fc8403', '#fc4903', 'red'];
        for (var i = 0; i < intervals.length; i++){
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' +
            intervals[i] + (intervals[i+1] ? '&ndash;' + intervals[i+1] + '<br>' : '+');
            //div.innerHTML += intervals.push('<i style="background:' + colors[i] + '"></i>' +
            //intervals[i] ? intervals[i+1] : '+');


            }
        return div;
        };
        legend.addTo(myMap);              
          
    var geojson = L.geoJSON(data.features, {
        onEachFeature: onEachFeature
        }).addTo(myMap);
});

/*
The code above on lines 40-52 was constructed after referring to the following source:
https://www.bing.com/search?q=how+use+onEachFeature+to+place+circle+on+json+map&cvid=6b471e3b6c5c4081a008fb76cecebc2b&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCTc1MzU3ajBqMagCALACAA&FORM=ANSPA1&PC=HCTS. And code for lines 54-65 was adapted from the following source: https://www.igismap.com/legend-in-leafletjs-map-with-topojson/.
*/