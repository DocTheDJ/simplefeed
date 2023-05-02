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

class Heureka(OpenURLS):
    def __init__(self) -> None:
        super().__init__()
        self.run()
    
    def run(self):
        masterTag = 'SHOP'

        dictionary = self.parseDictionary('<?xml version="1.0" ?><SHOP><PRODUCT>SHOPITEM<CODE>ITEM_ID</CODE><EAN>EAN</EAN><ITEMGROUP_ID>ITEMGROUP_ID</ITEMGROUP_ID><NAME_COM>PRODUCTNAME</NAME_COM><NAME_VAR>PRODUCT</NAME_VAR><DESCRIPTION>DESCRIPTION</DESCRIPTION><IMAGE>IMGURL</IMAGE><ALT_IMG>IMGURL_ALTERNATIVE</ALT_IMG><PARAM>PARAM<NAME>PARAM_NAME</NAME><VALUE>VAL</VALUE></PARAM><CATEGORIES>CATEGORYTEXT</CATEGORIES><ACCESSORY>ACCESSORY</ACCESSORY></PRODUCT><AVAILABILITY>SHOPITEM<CODE>ID</CODE><PUR_PRICE>PRICE</PUR_PRICE><REC_PRICE>PRICE_VAT</REC_PRICE><VAT>VAT</VAT><AMOUNT>STOCK</AMOUNT><MANUFACTURER>MANUFACTURER</MANUFACTURER></AVAILABILITY></SHOP>')

        data = self.xmlGetDict('https://www.mcompanies.cz/heureka/export/products.xml')

        self.TBD = self.makeProductDict(data[masterTag], dictionary[masterTag])

        amounts = self.xmlGetDict('https://www.mcompanies.cz/mcompanies-cz-partner.xml')
        self.amounts = self.makeAmounts(amounts[masterTag], dictionary[masterTag])

        self.products(dictionary[masterTag])

    
    def products(self, dic:dict):
        res = dic['PRODUCT']
        emo = dic['AVAILABILITY']

        for key in self.TBD:
            variants = self.createVars(self.TBD[key], res, emo)
            pass

    def createVars(self, vars:list[dict], dic:dict, emo:dict):
        output = []
        for var in vars:
            code = var[dic['CODE']]
            ean = None if str(var[dic['EAN']]).startswith('=') else var[dic['EAN']]
            pur_price = self.amounts[code][emo['PUR_PRICE']]
            rec_price = self.amounts[code][emo['REC_PRICE']]
            vat = self.amounts[code][emo['vat']]
            amount = self.amounts[code][emo['AMOUNT']]
            name = var[dic['NAME_VAR']]
        pass

    def getPhotos(self):
        pass

    def makeProductDict(self, data:dict, dic:dict):
        res = dic['PRODUCT']
        output = {}
        for product in data[res[self.getName()]]:
            product.pop(res['ACCESSORY'], None)
            key = product.pop(res['ITEMGROUP_ID'], product[res['CODE']])
            try:
                output[key].append(product)
            except:
                output[key] = [product]
        return output

    def makeAmounts(self, data:dict, dic:dict):
        res = dic['AVAILABILITY']
        output = {}
        for availability in data[res[self.getName()]]:
            code = str(availability.pop(res['CODE']))
            if ' ' in code:
                code = code.replace(' ', '_')
            output[code] = availability
        return output

Heureka()