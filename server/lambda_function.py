import requests
import json
import time
import datetime


def getLocs():
    #https://nextride.whistler.bctransit.com/api/VehicleStatuses?patternIds[]=1058&patternIds[]=1056&patternIds[]=1059&patternIds[]=1057
    busURL = 'https://nextride.whistler.bctransit.com/api/VehicleStatuses?'

    r = requests.get('https://nextride.whistler.bctransit.com/api/Route')
    routes = r.json()
    patDic = {}
    for route in routes:
        pID = route['PatternID']
        # pattern = {
        #     "pID": str(pID),
        #     "route": route['RouteCode']
        # }
        patDic[str(pID)] = route['RouteCode'] #.append(pattern)
        #patternIds[]=1058&
        busURL += "patternIds[]=" + str(pID) + "&"
    #remove the last &
    busURL = busURL[:-1]
    r = requests.get(busURL)

    buses = r.json()
    #print(buses)
    busDic = []
    for bus in buses:
        route = patDic.get(str(bus["patternId"]))
        #pat = next(item for item in patDic if item["pID"] == bus["patternId"])

        bus = {
            "name": bus["name"],
            "lat": bus["lat"],
            "lon": bus["lng"],
            "v": bus["velocity"],
            "bearing": bus["bearing"],
            "route": route,
            "pID": bus["patternId"],
            "time": datetime.datetime.now()
        }
        busDic.append(bus)

    return busDic

def createResponse():
    data = getLocs()
    geoJson = {
        'type': "FeatureCollection",
        'properties': {
            'time': data[0]['time'].timestamp(),
        },
        'features': []
    }
    for bus in data:
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
                    'coordinates': [bus['lon'],bus['lat']]
                },
                'properties': {
                    'name': bus['name'],
                    'route': bus['route'],
                    'time': bus['time'].timestamp(),
                    'velocity': bus['v'],
                    'bearing': bus['bearing'],
                    'pID': bus['pID']
                }
            }
        #write to csv
        # with open('data.csv', 'wb') as f:
        #     w = csv.DictWriter(f,bus.keys())
        #     w.writeheader()
        #     w.writerow(bus)
        geoJson['features'].append(geo)
    return geoJson



def lambda_handler(event, context):
    # TODO implement
    return createResponse()
    #{
    #    'statusCode': 200,
    #    'body': json.dumps('Hello from Lambda!')
    #}
