import xmltodict
import json
import requests

def mastersport_to_shoptet():
    pass

def mastesport_categories():
    t = json.dumps(xmltodict.parse(requests.get('https://b2b.mastersport.cz/export/categories.php?k=e66cc38cebeb82a2143455b19b979317').content))
    print(t)

mastesport_categories()