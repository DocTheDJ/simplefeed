def get_path(request, victim)->str:
    path = str(request.get_full_path())
    return path[0 : path.find(victim) :]

import re

def get_new_search(orig:str, prefix:str, param:str):
    target = prefix+param.upper()
    return re.sub(r'.{'+str(len(target))+'}$', target, orig)

def filter_DB(request, obj):
    try:
        obj = obj.filter(categories__id__exact=request.GET['category_filter'])
    except:
        pass
    try:
        obj = obj.filter(manufacturer_id=(None if request.GET['manufacturer'] == 'None' else request.GET['manufacturer']))
    except:
        pass
    try:
        obj = obj.filter(supplier_id=request.GET['supplier'])
    except:
        pass
    # try:
    #     obj = obj.filter(variants__amount=request.GET['availability'])
    # except:
    #     pass
    return obj

def get_offset(request, products_per_page):
    try:
        page_number = int(request.GET['page'])
    except:
        page_number = 1
    return (page_number-1)*products_per_page
