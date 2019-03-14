//var url = 'https://nextride.whistler.bctransit.com/api/VehicleStatuses?patternIds[]=1024&patternIds[]=1036&patternIds[]=1039&patternIds[]=1086&patternIds[]=1045&patternIds[]=1047&patternIds[]=1067&patternIds[]=1069&patternIds[]=1079&patternIds[]=1091&patternIds[]=1092&patternIds[]=1077&patternIds[]=1087&patternIds[]=1021&patternIds[]=1044&patternIds[]=1063&patternIds[]=1098&patternIds[]=1099&patternIds[]=1061&patternIds[]=1078&patternIds[]=1080&patternIds[]=1097&patternIds[]=1032&patternIds[]=1029&patternIds[]=1057&patternIds[]=1059&patternIds[]=1016&patternIds[]=1033&patternIds[]=1046&patternIds[]=1056&patternIds[]=1058';
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
                return f.properties.route
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