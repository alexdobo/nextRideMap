// geo = {
//     'type':'Feature',
//     'geometry': {
//         'type':'Point',
//         'coordinates': [bus['lon'],bus['lat']]
//     },
//     'properties': {
//         'name': bus['name'],
//         'route': bus['route'],
//         'time': bus['time'].timestamp(),
//         'velocity': bus['v'],
//         'bearing': bus['bearing'],
//         'pID': bus['pID']
//     }
// }

var map = L.map('map',{
    'center': [50.117, -122.955],
    'zoom': 13,
    'layers': [
    //   L.tileLayer('https://{s}.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=WIb7udzZ2z84KKi3FVop&app_code=Heted_De8FPNX8-vdmjrsQ', {
    //     attribution: 'Data: <a href="https://nextride.whistler.bctransit.com/" target="_blank">BCTransit</a> | Map: <a href="https://developer.here.com" target="_blank">HERE</a>',
	//     subdomains: '1234',
    //   })
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
    ],
    
});

// {

//     "type": "Feature",
//     "geometry": {
//         "type": "Point",
//         "coordinates": [
//             -122.95256,
//             50.1136551
//         ]
//     },
//     "properties": {
//         "StopID": 2740,
//         "StopNumber": 141,
//         "Seq": 1,
//         "PatternID": 1077,
//         "StopCode": "102714",
//         "StopName": "Gondola Transit Exchange ",
//         "Latitude": 50.1136551,
//         "Longitude": -122.95256,
//         "IsPublic": true,
//         "IsActive": true
//     }

// },



function info(f,l){
    var out = [];
    out.push("Name: " + f.properties.StopName+"<br />");
    out.push("PatternID: " + f.properties.PatternID+"<br />");
    out.push("StopID: " + f.properties.StopID+"<br />");
    l.bindPopup(out.join("<br />"));
    l.bindTooltip(out.join("<br />"));
}
function circle(f,l){
    let o =  {
        radius: 5,
        fillColor: "orange",
        color: "black",
        weight: 1,
        opacity: .6,
        fillOpacity: 0.6
    };
    return L.circleMarker(l,o);
}

//add stops
var stopsLayer = new L.geoJSON.ajax("https://fzoaxgoahc.execute-api.us-east-1.amazonaws.com/default/nextRideStops",{
    onEachFeature: info,
    pointToLayer: circle
});
stopsLayer.addTo(map);


var realtime = L.realtime({
    url: 'https://fzoaxgoahc.execute-api.us-east-1.amazonaws.com/default/nextRideMap',
    crossOrigin: false
}, {
    interval: 7 * 1000,
    pointToLayer: function(f,l){
        return L.marker(l,{
            'icon': L.icon({
                iconUrl: './icons/'+ f.properties.route +'.png',
                iconSize: [10.5,15] //[7,10] //original size
            }),
            rotationAngle: f.properties.bearing,
            rotationOrigin: 'center center'
        })
    },
    getFeatureId: function(f) {
        return f.properties.name;
    },
    onEachFeature(f,l){
        l.bindPopup(function(){
            return '<p>'+ new Date(f.properties.time*1000) +
                '<br/> Route: ' + f.properties.route +
                '</p>';
        }),
        l.bindTooltip(function(){
            return '<p> Route: ' + f.properties.route + 
                '<br/> Speed: ' + f.properties.velocity +
                '</p>';
        })
        
    }
}).addTo(map);


// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

realtime.on('update',function(e){
    console.log('update');

});

// realtime.on('update', function() {
//     map.fitBounds(realtime.getBounds(), {maxZoom: 15});
// });

// from https://gis.ee/tallinn/
var liveControl = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-bar');
		if (realtime.isRunning()) {
			container.innerHTML = '<a href="#" title="Live" role="button" aria-label="Live">⏩</a>';
		} else {
			container.innerHTML = '<a href="#" title="Not Live" role="button" aria-label="Not Live">⏹️</a>';
		}
		container.onclick = function(){
			if (realtime.isRunning()) {
				container.innerHTML = '<a href="#" title="Not Live" role="button" aria-label="Not Live">⏹️</a>';
				realtime.stop();
			} else {
				container.innerHTML = '<a href="#" title="Live" role="button" aria-label="Live">⏩</a>';
				realtime.start();
			}
		};
		return container;
	}
});

map.addControl(new liveControl());