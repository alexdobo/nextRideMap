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

var map = L.map('map'),
    realtime = L.realtime({
        url: 'https://fzoaxgoahc.execute-api.us-east-1.amazonaws.com/default/nextRideMap',
        crossOrigin: false
        }, {
        interval: 10 * 1000,
        pointToLayer: function(f,l){
            return L.marker(l,{
                'icon': L.icon({
                    iconUrl: 'icon.png',
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

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

realtime.on('update', function() {
    map.fitBounds(realtime.getBounds(), {maxZoom: 15});
});
//why is only 1 bus showing