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

class Mall(OpenURLS):
    def __init__(self) -> None:
        super().__init__()
        self.mall_to_shoptet()
    
    def mall_to_shoptet(self):


        dictionary = self.parseDictionary('<?xml version="1.0" ?><SHOP><ITEMS><PRODUCT>ITEM<CODE>ID</CODE><ITEMGROUP_ID>ITEMGROUP_ID</ITEMGROUP_ID><NAME_COM>ITEMGROUP_TITLE</NAME_COM><MANUFACTURER>BRAND_ID</MANUFACTURER><NAME_VAR>TITLE</NAME_VAR><SHORT_DESCRIPTION>SHORTDESC</SHORT_DESCRIPTION><DESCRIPTION>LONGDESC</DESCRIPTION><EAN>BARCODE</EAN><PUR_PRICE>PRICE</PUR_PRICE><VAT>VAT</VAT><REC_PRICE>RRP</REC_PRICE><PARAMS>PARAM<NAME>NAME</NAME><VALUE>VALUE</VALUE></PARAMS><VAR_PARAMS>VARIABLE_PARAMS<NAME>PARAM</NAME></VAR_PARAMS><IMAGES>MEDIA<IMAGE>URL</IMAGE><MAIN>MAIN</MAIN></IMAGES></PRODUCT></ITEMS><AVAILABILITIES><AVAILABILITY>AVAILABILITY<ID>ID</ID><AMOUNT>IN_STOCK</AMOUNT><VISIBLE>ACTIVE</VISIBLE></AVAILABILITY></AVAILABILITIES></SHOP>')['SHOP']
        
        data = self.xmlGetDict('https://www.sedaci-pytle.cz/mall_feed.xml')

        # amounts = self.xmlGetDict('https://www.sedaci-pytle.cz/mall_feed_dost.xml')

        # masterTag = 'AVAILABILITIES'

        # self.amounts = self.availabilities(amounts[masterTag], dictionary[masterTag])
        
        masterTag = 'ITEMS'

        self.TBD = self.makeProductDict(data[masterTag], dictionary[masterTag])
        for key in self.TBD:
            print(key)
            print(self.TBD[key])
            print(len(self.TBD[key]))
            break
        # self.products(data[masterTag], dictionary[masterTag])
    
    def products(self, dic:dict):
        res = dic['PRODUCT']
        
        pass
    
    def makeProductDict(self, products:dict, dic:dict):
        res = dic['PRODUCT']
        output = {}
        for product in products[res[self.getName()]]:
            key = product.pop(res['ITEMGROUP_ID'])
            try:
                output[key].append(product)
            except:
                output[key] = [product]
        return output

    def availabilities(self, data:dict, dic:dict):
        res = dic['AVAILABILITY']
        output = {}
        for a in data[res[self.getName()]]:
            output[a[res['ID']]] = (int(a[res['AMOUNT']]), (a[res['VISIBLE']] == 'true'))
        return output

Mall()