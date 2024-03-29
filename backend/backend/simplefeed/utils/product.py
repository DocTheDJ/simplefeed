from django.db.models import Q

class ProductUtils:
    def switch_visibility(obj, attr, cat):
        if str(cat.action.action).startswith("com_cat_s_"):
            new_vis = (True if str(cat.action.action).replace("com_cat_s_", "") == "1" else False)
            setattr(obj, attr, new_vis)
            obj.save()
        elif str(cat.action.action).startswith("cat_cat_s_"):
            new_vis = (True if str(cat.action.action).replace("cat_cat_s_", "") == "1" else False)
            setattr(obj, attr, new_vis)
            obj.save()
        else:
            pass
            # for c in cat.pair_onto.all():
            #     add_category_use(DB, c.id, obj.id)
        try:
            for v in obj.get_variants():
                if v.visible != "2":
                    setattr(v, "visible", ("1" if new_vis else "0"))
                    v.save()
        except Exception as e:
            print(e)
            pass
    
    def setVisForAll(products, cat):
        varsVis = ''
        if str(cat.action.action).startswith("com_cat_s_"):
            varsVis = str(cat.action.action).replace("com_cat_s_", "")
            products.update(approved=(True if varsVis == "1" else False))
        elif str(cat.action.action).startswith("cat_cat_s_"):
            varsVis = str(cat.action.action).replace("cat_cat_s_", "")
            products.update(approved=(True if varsVis == "1" else False))
        else:
            pass
        try:
            if(varsVis != ''):
                for p in products:
                    p.get_variants().exclude(visible='2').update(visible=varsVis)
        except Exception as e:
            print(e)
    
    def createQuery(data: dict):
        query = Q()
        if data['cat'] != None:
            query &= Q(categories__id__exact=data['cat'])
        if data['sup'] != None:
            query &= Q(supplier__id=data['sup'])
        if data['man'] != None:
            query &= Q(manufacturer__id=data['man'])
        if data['que']:
            query &= (Q(itemgroup_id__icontains=data['que']) | Q(manufacturer__name__icontains=data['que']) | Q(supplier__name__icontains=data['que']) |
                      Q(price_common__code__icontains=data['que']) | Q(price_common__ean__icontains=data['que']) | Q(price_common__name__icontains=data['que']))
        return query
