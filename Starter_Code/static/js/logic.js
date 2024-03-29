let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

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

d3.json(earthquakeURL).then(function (data) {
   console.log(data);
   
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 0.5,
          fillColor: circleColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          weight: 0.5
        };
      }
     
    function markerSize(mag){return mag * 7;};
    
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
            };

        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
                },
            style: styleInfo,
            onEachFeature: onEachFeature
            }).addTo(myMap);
        });            

var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        var intervals = [-10, 10, 30, 50, 70, 90];
        var colors = ['pink', '#cafc03', '#fcad03', '#fc8403', '#fc4903', 'red'];
        for (var i = 0; i < intervals.length; i++){
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' +
            intervals[i] + (intervals[i+1] ? '&ndash;' + intervals[i+1] + '<br>' : '+');
            }
        return div;
        };
legend.addTo(myMap);              

function onEachFeature(feature, layer) {
    layer.bindPopup(`<h4>${feature.properties.place}</h4><hr>
            ${new Date(feature.properties.time)}</h4><hr>
            Magnitude: ${feature.properties.mag}</h4><hr>
            Depth: ${feature.geometry.coordinates[2]}`);
             };  
/*
The final version of the code above was reached after extensive consultation with a BCS Learning Assistant, initially concerning the addition of the legend. Code for that had been adapted from the source, https://www.igismap.com/legend-in-leafletjs-map-with-topojson/, but additions were needed as well to the index.html and style.css files. Then, along with making the code successful to deploy the legend, additional re-work was done to add "point to layer" within "L.geoJSON" and to house the latter inside the d3.json data call starting on line 19. The use of "latlng" on lines 50 and 51 was also gleaned from referring to the following source in researching about L.circleMarker:
https://www.bing.com/search?q=how+use+onEachFeature+to+place+circle+on+json+map&cvid=6b471e3b6c5c4081a008fb76cecebc2b&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCTc1MzU3ajBqMagCALACAA&FORM=ANSPA1&PC=HCTS.
*/