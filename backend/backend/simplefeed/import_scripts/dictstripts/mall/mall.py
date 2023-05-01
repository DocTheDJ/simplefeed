from ....models import (Param, Image, Variant, Variant_Image, VariantParam, Common, Manufacturers, Feeds)
from ....utils.availability import AvailabilityUtils
from ....utils.open_urls import OpenURLS

class Mall(OpenURLS):
    def __init__(self, DB, data) -> None:
        self.DB = DB
        self.data = data
        self.source = data.id
        self.in_stock, self.out_stock = AvailabilityUtils.create_default_availabilities(DB, data.id)
        super().__init__()
        self.mall_to_shoptet()
    
    def mall_to_shoptet(self):

        dictionary = self.parseDictionary(Feeds.objects.using(self.DB).get(master_feed=self.source, usage='d').feed_link)['SHOP']
        
        data = self.xmlGetDict(self.data.feed_link)

        amounts = self.xmlGetDict(Feeds.objects.using(self.DB).get(master_feed=self.source, usage='a').feed_link)

        masterTag = 'AVAILABILITIES'

        self.amounts = self.availabilities(amounts[masterTag], dictionary[masterTag])
        
        masterTag = 'ITEMS'

        self.TBD = self.makeProductDict(data[masterTag], dictionary[masterTag])

        self.products(dictionary[masterTag])
    
    def products(self, dic:dict):
        res = dic['PRODUCT']
        for key in self.TBD:
            variants = self.createVars(self.TBD[key], res)
            productI = self.TBD[key][0]
            name = productI[res['NAME_COM']]
            manufacturer = productI[res['MANUFACTURER']]
            shortDesc = productI[res['SHORT_DESCRIPTION']]
            desc = productI[res['DESCRIPTION']]
            
            man, _ = Manufacturers.objects.using(self.DB).get_or_create(original_name=manufacturer, defaults={'name': manufacturer})
            
            com, _ = Common.objects.using(self.DB).get_or_create(itemgroup_id=key, supplier_id=self.source, defaults={
                'short_description': shortDesc,
                'description': desc,
                'manufacturer': man,
                'name': name,
                'approved': 0,
                'price_common': variants[0]
            })
            
            com.variants.add(*variants)
    
    def createVars(self, vars:list[dict], dic:dict):
        output = []
        for var in vars:
            code = var[dic['CODE']]
            ean = var[dic['EAN']]
            pur_price = var[dic['PUR_PRICE']]
            rec_price = var[dic['REC_PRICE']]
            vat = var[dic['VAT']]
            name = var[dic['NAME_VAR']]
            amount = self.amounts[code][0]
            photos = self.getPhotos(var[dic['IMAGES'][self.getName()]], dic['IMAGES'])
            params = self.getParams(var[dic['PARAMS'][self.getName()]], dic['PARAMS'],
                           var[dic['VAR_PARAMS'][self.getName()]], dic['VAR_PARAMS'])
            v, _ = Variant.objects.using(self.DB).get_or_create(code=code, ean=ean, defaults={
                    'vat': vat,
                    'pur_price': pur_price,
                    'price': rec_price,
                    'rec_price': rec_price,
                    'amount': amount,
                    'currency': 'czk',
                    # 'visible': visibility,
                    'name': name,
                    'availability': self.in_stock if amount > 0 else self.out_stock
                })
            for p in photos:
                Variant_Image.objects.using(self.DB).get_or_create(variant=v, image=p[0], defaults={'main': p[1]})
            for p in params:
                VariantParam.objects.using(self.DB).get_or_create(variant=v, param=p[0], defaults={'var_param': p[1]})
            output.append(v)
        return output
    
    def getPhotos(self, photos, dic:dict):
        output:list[tuple] = []
        if type(photos) is list:
            for image in photos:
                im, _ = Image.objects.using(self.DB).get_or_create(image=image[dic['IMAGE']])
                output.append((im, (image[dic['MAIN']] == 'true')))
        else:
            im, _ = Image.objects.using(self.DB).get_or_create(image=photos[dic['IMAGE']])
            output = [(im, (image[dic['MAIN']] == 'true'))]
        return output
    
    def getParams(self, params, dic:dict, var_params, var_p_dic:dict):
        if type(var_params) is list:
            var_params = var_params[var_p_dic['NAME']]
        else:
            var_params = [var_params[var_p_dic['NAME']]]
        
        ps:list[tuple] = []
        if type(params) is list:
            for param in params:
                p, _ = Param.custom_get_or_create(self.DB, param[dic['NAME']], param[dic['VALUE']], self.source)
                ps.append((p, (param[dic['NAME']] in var_params)))
        else:
            p, _ = Param.custom_get_or_create(self.DB, params[dic['NAME']], params[dic['VALUE']], self.source)
            ps.append((p, (params[dic['NAME']] in var_params)))
        return ps
                
    
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