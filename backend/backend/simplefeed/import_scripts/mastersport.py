from urllib.request import urlopen
import ssl
import xmltodict
import sys
from ..models import (
    Image,
    Variant,
    Common,
    # Feeds,
    Manufacturers,
    Variant_Image,
    Category)

def getName():
    return '#text'

def mastersport_to_shoptet(DB):
    mastertag = 'SHOP'
    
    dictionary = xmltodict.parse('<?xml version="1.0" ?><SHOP><CATEGORY>Category<ORIGINAL_ID>ID</ORIGINAL_ID><ORIGINAL_PARENT>ParentID</ORIGINAL_PARENT><NAME>Name</NAME></CATEGORY><PRODUCT>Product<CODE>Code</CODE><EAN>EAN</EAN><APPROVED>Visibility</APPROVED><NAME_COM>Name</NAME_COM><DESCRIPTION>Description</DESCRIPTION><MANUFACTURER>ProducerName</MANUFACTURER><PHOTOS>Photos<IMAGE>Photo</IMAGE></PHOTOS><REC_PRICE>RecommendedRetailPrice</REC_PRICE><PUR_PRICE>Price</PUR_PRICE><AMOUNT>QuantityInStock</AMOUNT><CATEGORIES>Categories<CATEGORY>CategoryID</CATEGORY></CATEGORIES><VARIANTS>Variants<VARIANT>Variant<CODE>Code</CODE><EAN>EAN</EAN><NAME_VAR>Name</NAME_VAR><AMOUNT>QuantityInStock</AMOUNT><REC_PRICE>RecommendedRetailPrice</REC_PRICE><PUR_PRICE>Price</PUR_PRICE></VARIANT></VARIANTS></PRODUCT></SHOP>')

    # cate_dict = xmlGetDict('https://b2b.mastersport.cz/export/categories.php?k=e66cc38cebeb82a2143455b19b979317')
    
    # createCats(DB, cate_dict[mastertag], dictionary[mastertag])

    data_dict = xmlGetDict('https://b2b.mastersport.cz/export/products.php?k=e66cc38cebeb82a2143455b19b979317')

    createProducts(DB, data_dict[mastertag], dictionary[mastertag], 1)


def createProducts(DB, data:dict, dictionary:dict, source):
    res = dictionary['PRODUCT']
    for product in data[res[getName()]]:
        if hasThis(product, res, 'VARIANTS'):
            withVariants(DB, product, res, source)
            break
        else:
            print(False)
            # pass
            # noVariants(DB, product, res, source)


def withVariants(DB, product, dic, source):
    code = product[dic['CODE']]
    visibility = product[dic['APPROVED']]
    name = product[dic['NAME_COM']]
    description = product[dic['DESCRIPTION']]
    manufacturer = product[dic['MANUFACTURER']]
    res = dic['VARIANTS']
    createVars(DB, product[res[getName()]], res['VARIANT'], source)
    pass

def createVars(DB, vars, dic, source):
    print(vars)
    print(dic)
    res = dic[getName()]
    pass

def noVariants(DB, product, dic, source):
    code = product[dic['CODE']]
    ean = product[dic['EAN']]
    visibility = product[dic['APPROVED']]
    name = product[dic['NAME_COM']]
    description = product[dic['DESCRIPTION']]
    manufacturer = product[dic['MANUFACTURER']]
    rec_price = product[dic['REC_PRICE']]
    pur_price = product[dic['PUR_PRICE']]
    amount = product[dic['AMOUNT']]
    var, _ = Variant.objects.using(DB).get_or_create(code=code, ean=ean, defaults={
        'vat': 21,
        'pur_price': pur_price,
        'price': rec_price,
        'rec_price': rec_price,
        'amount': amount,
        'currency': 'czk',
        'visible': visibility,
        'name': name,
    })
    res = dic['PHOTOS']
    for im in getPhotos(product[res[getName()]], res['IMAGE']):
        Variant_Image.objects.using(DB).get_or_create(variant=var, image=im[0], defaults={'main': im[1]})
    
    man, _ = Manufacturers.objects.using(DB).get_or_create(original_name=manufacturer, defaults={'name': manufacturer})

    com, _ = Common.objects.using(DB).get_or_create(itemgroup_id=code, supplier_id=source, defaults={
        'description': description,
        'manufacturer': man,
        'name': name,
        'approved': int(visibility),
        'price_common': var
    })

    com.variants.add(var)
    
    res = dic['CATEGORIES']
    addToCats(DB, product[res[getName()]], res['CATEGORY'], com, source)

def getPhotos(DB, photos, dic):
    im, _ = Image.objects.using(DB).get_or_create(image=photos[dic][0])
    output = [(im, True)]
    for image in photos[dic][1:]:
        im, _ = Image.objects.using(DB).get_or_create(image=image)
        output.append((im, False))
    return output

def addToCats(DB, cats, dic, product, source):
    cats = list(map(int, cats[dic]))
    c = Category.objects.using(DB).filter(original_id__in=cats, source=source)
    product.categories.add(*c)

def hasThis(product, res, name):
    try:
        product[res[name][getName()]]
        return True
    except:
        return False


# def createCats(DB, cats:dict, dictionary:dict, masterName, source):
#     res = dictionary['CATEGORY']
#     head, _ = Category.objects.using(DB).get_or_create(name=masterName, source=source, parent=None)
#     for cat in cats[res['#text']]:
#         originalID = int(cat[res['ORIGINAL_ID']], 10)
#         originalPa = int(cat[res['ORIGINAL_PARENT']], 10)
#         name = cat[res['NAME']]
#         if originalPa == 0:
#             Category.objects.using(DB).get_or_create(original_id=originalID, source=source, defaults={
#                 'original_parent': head,
#                 'parent': head,
#                 'name': name
#             })
#         else:
#             parent = Category.objects.using(DB).get(original_id=originalPa, source=source)
#             Category.objects.using(DB).get_or_create(original_id=originalID, source=source, defaults={
#                 'original_parent': parent,
#                 'parent': parent,
#                 'name': name
#             })


def getNameWithChildren(this:dict, lvl:int, wanted:str, parent=None):
    for i in this.keys():
        if i == '#text' and this[i] == wanted:
            return parent
        if hasattr(this[i], 'keys'):
            # print('\t'*lvl, i)
            if t := getNameWithChildren(this[i], lvl+1, wanted, i):
                return t
        # else:
        #     pass
            # print('\t'*lvl, f'{i} : {this[i]}')


def printLVL(this:dict, lvl:int):
    for i in this.keys():
        if hasattr(this[i], 'keys'):
            print('\t'*lvl, i)
            printLVL(this[i], lvl+1)
        else:
            print('\t'*lvl, f'{i} : {this[i]}')


def xmlGetDict(url:str):
    ssl._create_default_https_context = ssl._create_unverified_context
    try:
        return xmltodict.parse(urlopen(url))
    except Exception as e:
        print(e)
        print("error while opening url: "+url)
        sys.exit(1)