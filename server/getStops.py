import requests
import json
import time
import datetime
from bottle import *

def getStops():
    r = requests.get('https://nextride.whistler.bctransit.com/api/Route')
    routes = r.json()
    stopList = []
    stops = []
    for route in routes:
        pID = route['PatternID']
        r = requests.get('https://nextride.whistler.bctransit.com/api/Stop?patternIds='+str(pID))
        sops = r.json()
        for stop in sops:
            if stop['StopID'] not in stops:
                stopList.append(stop)
                stops.append(stop["StopID"])
    return stopList

def createResponse():
    data = getStops()
    geoJson = {
        'type': "FeatureCollection",
        'properties': {
            'time': datetime.now().timestamp(),
        },
        'features': []
    }
    for stop in data:
        # "name": bus["name"],
        # "loc": [bus["lat"],bus["lng"]],
        # "v": bus["velocity"],
        # "bearing": bus["bearing"],
        # "route": route,
        # "pID": bus["patternId"]
        geo = {
                'type':'Feature',
                'geometry': {
                    'type':'Point',
                    'coordinates': [stop['Longitude'],stop['Latitude']]
                },
                'properties': stop
            }
        #write to csv
        # with open('data.csv', 'wb') as f:
        #     w = csv.DictWriter(f,bus.keys())
        #     w.writeheader()
        #     w.writerow(bus)
        geoJson['features'].append(geo)
    return geoJson



def lambda_handler(event, context):
    return createResponse()

@get('/')
def serve_json():
    response.headers['Access-Control-Allow-Origin'] = "*"
    #f = open('server\stopList.json','r')
    return request.get('https://www.bctransit.com/documents/1529703669142') # f.read()

run()