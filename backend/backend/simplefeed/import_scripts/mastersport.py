from urllib.request import urlopen
import ssl
import xmltodict
import sys
from ..models import (
    Image,
    Variant,
    Common,
    Feeds,
    Manufacturers,
    Variant_Image,
    Category)
from ..utils.availability import AvailabilityUtils

class MasterSport:
    
    def __init__(self, DB, data) -> None:
        self.DB = DB
        self.data = data
        self.source = data.id
        self.in_stock, self.out_stock = AvailabilityUtils.create_default_availabilities(DB, data.id)
        self.mastersport_to_shoptet()

    def getName(self):
        return '#text'

    def mastersport_to_shoptet(self):
        mastertag = 'SHOP'
                
        dictionary = xmltodict.parse(Feeds.objects.using(self.DB).get(master_feed=self.source, usage='d').feed_link)

        cate_dict = self.xmlGetDict(Feeds.objects.using(self.DB).get(master_feed=self.source, usage='c').feed_link)
        
        self.createCats(cate_dict[mastertag], dictionary[mastertag])

        data_dict = self.xmlGetDict(self.data.feed_link)

        print('Started creating')
        self.createProducts(data_dict[mastertag], dictionary[mastertag])


    def createProducts(self, data:dict, dictionary:dict):
        res = dictionary['PRODUCT']
        noVars = []
        for product in data[res[self.getName()]]:
            if self.hasThis(product, res, 'VARIANTS'):
                self.withVariants(product, res)
            else:
                noVars.append(product)
        for product in noVars:
            self.noVariants(product, res)


    def withVariants(self, product, dic):
        code = product[dic['CODE']]
        visibility = product[dic['APPROVED']]
        name = product[dic['NAME_COM']]
        description = product[dic['DESCRIPTION']]
        manufacturer = product[dic['MANUFACTURER']]
        res = dic['VARIANTS']
        variants, repCode, createdAll = self.createVars(product[res[self.getName()]], res['VARIANT'], False if code else True)
        
        res = dic['PHOTOS']
        photos = self.getPhotos(product[res[self.getName()]], res['IMAGE'], createdAll)
        for var in variants[1]:
            for im in photos:
                Variant_Image.objects.using(self.DB).get_or_create(variant=var, image=im[0], defaults={'main': im[1]})

        man, _ = Manufacturers.objects.using(self.DB).get_or_create(original_name=manufacturer, defaults={'name': manufacturer})
        
        com, _ = Common.objects.using(self.DB).get_or_create(itemgroup_id=(code if code else repCode), supplier_id=self.source, defaults={
            'description': description,
            'manufacturer': man,
            'name': name,
            'approved': int(visibility),
            'price_common': variants[0]
        })
        
        com.variants.add(*variants[1])
        
        res = dic['CATEGORIES']
        self.addToCats(product[res[self.getName()]], res['CATEGORY'], com)
        

    def createVars(self, vars, dic, needed):
        res = dic[self.getName()]
        try:
            variant = vars[res][0]
            run = True
        except:
            variant = vars[res]
            run = False
        repCode = variant[dic['CODE']]
        ean = variant[dic['EAN']]
        rec_price = variant[dic['REC_PRICE']]
        pur_price = variant[dic['PUR_PRICE']]
        amount = int(variant[dic['AMOUNT']])
        name = variant[dic['NAME_VAR']]
        
        var, created = Variant.objects.using(self.DB).get_or_create(code=repCode, ean=ean, defaults={
            'vat': 21,
            'pur_price': pur_price,
            'price': rec_price,
            'rec_price': rec_price,
            'amount': amount,
            'currency': 'czk',
            # 'visible': visibility,
            'name': name,
            'availability': self.in_stock if amount > 0 else self.out_stock
        })
        
        output = [var]
        
        if run:
            for variant in vars[res][1:]:
                code = variant[dic['CODE']]
                ean = variant[dic['EAN']]
                rec_price = variant[dic['REC_PRICE']]
                pur_price = variant[dic['PUR_PRICE']]
                amount = int(variant[dic['AMOUNT']])
                name = variant[dic['NAME_VAR']]
                var, b = Variant.objects.using(self.DB).get_or_create(code=code, ean=ean, defaults={
                    'vat': 21,
                    'pur_price': pur_price,
                    'price': rec_price,
                    'rec_price': rec_price,
                    'amount': amount,
                    'currency': 'czk',
                    # 'visible': visibility,
                    'name': name,
                    'availability': self.in_stock if amount > 0 else self.out_stock
                })
                created &= b
                output.append(var)
        return (output[0], output), repCode if needed else None, not created

    def noVariants(self, product, dic):
        code = product[dic['CODE']]
        ean = product[dic['EAN']]
        visibility = product[dic['APPROVED']]
        name = product[dic['NAME_COM']]
        description = product[dic['DESCRIPTION']]
        manufacturer = product[dic['MANUFACTURER']]
        rec_price = product[dic['REC_PRICE']]
        pur_price = product[dic['PUR_PRICE']]
        amount = int(product[dic['AMOUNT']])
        var, created = Variant.objects.using(self.DB).get_or_create(code=code, ean=ean, defaults={
            'vat': 21,
            'pur_price': pur_price,
            'price': rec_price,
            'rec_price': rec_price,
            'amount': amount,
            'currency': 'czk',
            'visible': visibility,
            'name': name,
            'availability': self.in_stock if amount > 0 else self.out_stock
        })
        if not created:
            return
        
        res = dic['PHOTOS']
        for im in self.getPhotos(product[res[self.getName()]], res['IMAGE'], (not created)):
            Variant_Image.objects.using(self.DB).get_or_create(variant=var, image=im[0], defaults={'main': im[1]})
        
        man, _ = Manufacturers.objects.using(self.DB).get_or_create(original_name=manufacturer, defaults={'name': manufacturer})

        com, _ = Common.objects.using(self.DB).get_or_create(itemgroup_id=code, supplier_id=self.source, defaults={
            'description': description,
            'manufacturer': man,
            'name': name,
            'approved': int(visibility),
            'price_common': var
        })

        com.variants.add(var)
        
        res = dic['CATEGORIES']
        self.addToCats(product[res[self.getName()]], res['CATEGORY'], com)

    def getPhotos(self, photos, dic, varCreated=False):
        if type(photos[dic]) is list:
            im, _ = Image.objects.using(self.DB).get_or_create(image=photos[dic][0])
            output = [(im, not varCreated)]
            for image in photos[dic][1:]:
                im, _ = Image.objects.using(self.DB).get_or_create(image=image)
                output.append((im, False))
        else:
            im, _ = Image.objects.using(self.DB).get_or_create(image=photos[dic])
            output = [(im, not varCreated)]
        return output

    def addToCats(self, cats, dic, product):
        try:
            cats = list(map(int, cats[dic]))
            c = Category.objects.using(self.DB).filter(original_id__in=cats, source=self.source)
            product.categories.add(*c)
        except:
            print('no cats')

    def hasThis(self, product, res, name):
        try:
            product[res[name][self.getName()]]
            return True
        except:
            return False


    def createCats(self, cats:dict, dictionary:dict):
        res = dictionary['CATEGORY']
        head, _ = Category.objects.using(self.DB).get_or_create(name=self.data.name, source=self.data, parent=None)
        idiots = []
        for cat in cats[res['#text']]:
            originalID = int(cat[res['ORIGINAL_ID']], 10)
            originalPa = int(cat[res['ORIGINAL_PARENT']], 10)
            name = cat[res['NAME']]
            if originalPa == 0:
                Category.objects.using(self.DB).get_or_create(original_id=originalID, source=self.data, defaults={
                    'original_parent': head,
                    'parent': head,
                    'name': name
                })
            else:
                try:
                    self.faultyCats(originalPa, originalID, name)
                except:
                    idiots.append(cat)
        for c in idiots:
            originalID = int(c[res['ORIGINAL_ID']], 10)
            originalPa = int(c[res['ORIGINAL_PARENT']], 10)
            name = c[res['NAME']]
            try:
                self.faultyCats(originalPa, originalID, name)
            except:
                print('impossible category')

    def faultyCats(self, originalPa, originalID, name):
        parent = Category.objects.using(self.DB).get(original_id=originalPa, source=self.source)
        Category.objects.using(self.DB).get_or_create(original_id=originalID, source=self.data, defaults={
            'original_parent': parent,
            'parent': parent,
            'name': name
        })

    def xmlGetDict(self, url:str):
        ssl._create_default_https_context = ssl._create_unverified_context
        try:
            return xmltodict.parse(urlopen(url))
        except Exception as e:
            print(e)
            print("error while opening url: "+url)
            sys.exit(1)