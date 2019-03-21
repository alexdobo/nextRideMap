
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

//add stops
omnivore.csv('https://www.bctransit.com/documents/1529703669142',{ // some kind of CORs problem with this link
    latfield: 'stop_lat',
    lonfield: 'stop_lon',
    delimiter: ','
}).addTo(map);
//var stopsLayer = new L.GeoJSON.AJAX("http://localhost:8080/").addTo(map);
//stopsLayer.addTo(map);


