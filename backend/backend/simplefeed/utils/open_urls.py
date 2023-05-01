from urllib.request import urlopen
from xml.etree.ElementTree import ElementTree, parse
import sys
import ssl
import xmltodict

class OpenURLS(object):

    def xml_from_url(self, url:str)->ElementTree:
        ssl._create_default_https_context = ssl._create_unverified_context
        try:
            return self.xml_parse(urlopen(url))
        except Exception as e:
            print(e)
            print("error while opening url: "+url)
            sys.exit(1)
        

    def xml_parse(self, target)->ElementTree:
        try:
            return parse(target)
        except:
            print("error while parsing xml from: "+target)
            sys.exit(2)

    def xmlGetDict(self, url:str):
        ssl._create_default_https_context = ssl._create_unverified_context
        try:
            return xmltodict.parse(urlopen(url))
        except Exception as e:
            print(e)
            print("error while opening url: "+url)
            sys.exit(1)
    
    def parseDictionary(self, dic:str):
        try:
            return xmltodict.parse(dic)
        except Exception as e:
            print(e)
            sys.exit(1)
    
    def getName(self):
        return '#text'