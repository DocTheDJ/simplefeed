from ..utils.open_urls import xml_from_url
from xml.etree.ElementTree import fromstring
from queue import LifoQueue
from ..models import (
    Image,
    Variant, 
    Common, 
    Feeds, 
    VariantParam, 
    Manufacturers, 
    Rules, 
    Param, 
    Variant_Image
)
from ..utils.importutils import ImportUtils
from ..utils.availability import AvailabilityUtils
from ..utils.category import CategoryUtil

def esportshop_to_shoptet(DB, url_data):
    supplier_id = url_data.id
    root_data = xml_from_url(url_data.feed_link).getroot()
    rootdict = fromstring(Feeds.objects.using(DB).get(usage='d', master_feed=supplier_id).feed_link)
    parent_stack = LifoQueue()
    dict = list()
    ImportUtils().create_dictionary(rootdict, parent_stack, dict)
    for r in rootdict.iter():
        if r.get("GROUP_BY") == "true":
            group_by = r.tag
            break
    group_by_done = list()
    amount_tree = False
    try:
        amount_data = xml_from_url((Feeds.objects.using(DB).filter(usage='a', master_feed=supplier_id))[0].feed_link).getroot()
    except Exception as e:
        print(e)
    else:
        amount_tree = True
    
    common_list = []
    var_list = []
    category_watch_out_rule = Rules.objects.using(DB).get(action="com_cat_d_n")
    CategoryUtil.create_default_category(DB, url_data, category_watch_out_rule)
    in_stock, out_stock = AvailabilityUtils.create_default_availabilities(DB, supplier_id)
    for child in list(root_data):
        c = child.find(group_by)
        if c.text in group_by_done:
            continue
        list_same = root_data.findall(""+child.tag+"["+group_by+"='"+c.text+"']")
        tmp = list_same.pop()
        list_same.append(tmp)
        
        parent_stack.put(child.tag)
        
        short_desc = ImportUtils().get_text(dict, parent_stack, "SHORT_DESCRIPTION", tmp)
        desc = ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", tmp)
        man = ImportUtils().get_text(dict, parent_stack, "MANUFACTURER", tmp)
        manufacturer, created = Manufacturers.objects.using(DB).get_or_create(original_name=man, defaults={'name': man})
        com_name = ImportUtils().get_text(dict ,parent_stack, "NAME_COM", tmp)
        curr_comm, created_comm = Common.objects.using(DB).get_or_create(itemgroup_id=c.text,
                                                                         supplier_id = supplier_id,
                                                                        defaults={ 'short_description': short_desc,
                                                                                    'description': desc,
                                                                                    'manufacturer': manufacturer,
                                                                                    'name': com_name,
                                                                                    'approved': 0})
        if not created_comm:
            curr_comm.short_description = short_desc
            curr_comm.description = desc
            curr_comm.manufacturer = manufacturer
            curr_comm.supplier_id = supplier_id
            curr_comm.name = com_name
        common_price = False
        
        parent_stack.put("CATEGORIES")
        
        CategoryUtil().add_category_use(DB, CategoryUtil.created_supplier_category(DB, ImportUtils().get_text(dict, parent_stack, "CATEGORY", tmp.find("CATEGORIES")), " > ", supplier_id, category_watch_out_rule).id, curr_comm, category_watch_out_rule)
        
        parent_stack.get()
        
        for item in reversed(list_same):

            main_im, created_main = Image.objects.using(DB).get_or_create(image=ImportUtils().get_text(dict, parent_stack, "IMAGE", item))

            code = ImportUtils().get_text(dict, parent_stack, "CODE", item)
            ean = ImportUtils().get_text(dict, parent_stack, "EAN", item)
            
            if amount_tree:
                if (node := ImportUtils().try_find_from(amount_data, "SHOPITEM", "ITEM_ID", code)) == None:
                    node = ImportUtils().try_find_from(amount_data, "SHOPITEM", "EAN", ean)
                if node == None:
                    visible = 2
                else:
                    visible = 0
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", node)
                price = ImportUtils().get_text(dict, parent_stack, "PRICE", node)
                vat = ImportUtils().get_text(dict, parent_stack, "VAT", node)
                availability = AvailabilityUtils.availability_setup(DB, node, supplier_id, in_stock, out_stock, amount, dict, parent_stack)
            else:
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", item)
                price = ImportUtils().get_text(dict, parent_stack, "PRICE", item)
                vat = ImportUtils().get_text(dict, parent_stack, "VAT", item)
                availability = AvailabilityUtils.availability_setup(DB, item, supplier_id, in_stock, out_stock, amount, dict, parent_stack)
                visible = 0

            rec_price = ImportUtils().get_text(dict, parent_stack, "REC_PRICE", item)
            currency = ImportUtils().get_text(dict, parent_stack, "CURRENCY", item)
            name = ImportUtils().get_text(dict, parent_stack, "NAME_VAR", item)
            
            curr_var, created_var = Variant.objects.using(DB).get_or_create(code=code,
                                                                            ean=ean,
                                                                            defaults={  'vat': vat,
                                                                                        'pur_price': price,
                                                                                        'price': price,
                                                                                        'amount': amount,
                                                                                        'currency': currency,
                                                                                        'visible': visible,
                                                                                        'rec_price': rec_price,
                                                                                        'free_billing': 0,
                                                                                        'free_shipping': 0,
                                                                                        'name': name,
                                                                                        'availability': availability})
            
            for t in item.findall("IMGURL_ALTERNATIVE"):
                new_im, created_im = Image.objects.using(DB).get_or_create(image=t.text)
                Variant_Image.objects.using(DB).get_or_create(variant=curr_var, image=new_im, defaults={'main': False})
            Variant_Image.objects.using(DB).get_or_create(variant=curr_var, image=main_im, defaults={'main':True})


            if not created_var:
                curr_var.name = name
                curr_var.amount = amount
                curr_var.visible = visible
                curr_var.currency = currency
                curr_var.availability = availability
                if curr_var.mods == None:
                    curr_var.vat = vat
                    curr_var.pur_price = curr_var.price = price
                    curr_var.rec_price = rec_price
                else:
                    curr_var.if_mods_set('vat', vat)
                    curr_var.if_mods_set('price', price)
                    curr_var.if_mods_set('pur_price', price)
                    curr_var.if_mods_set('rec_price', rec_price)
                        
                var_list.append(curr_var)
            
            parent_stack.put("VARIATION_PARAM")
            proplist = item.findall(ImportUtils().LifoPeek(parent_stack))
            for p in proplist:
                param, created = Param.custom_get_or_create(DB, ImportUtils().get_text(dict, parent_stack, "NAME", p), ImportUtils().get_text(dict, parent_stack, "VALUE", p), supplier_id)
                VariantParam.objects.using(DB).get_or_create(variant=curr_var, param=param, defaults={'var_param': True})
            parent_stack.get()
            
            parent_stack.put("PARAM")
            proplist = item.findall(ImportUtils().LifoPeek(parent_stack))
            for p in proplist:
                param, created = Param.custom_get_or_create(DB, ImportUtils().get_text(dict, parent_stack, "NAME", p), ImportUtils().get_text(dict, parent_stack, "VALUE", p), supplier_id)
                VariantParam.objects.using(DB).get_or_create(variant=curr_var, param=param, defaults={'var_param': False})
            parent_stack.get()
            
            curr_comm.variants.add(curr_var)
            
            if not common_price:
                curr_comm.price_common_id = curr_var.id
                common_price = True
                curr_comm.save()
                        
        if not created_comm:
            common_list.append(curr_comm)
        
        group_by_done.append(c.text)
        parent_stack.get()

    Common.objects.using(DB).bulk_update(common_list, ['short_description', 'description', 'manufacturer', 'supplier_id', 'price_common_id', 'name'])
    Variant.objects.using(DB).bulk_update(var_list, ['name', 'vat', 'pur_price', 'price', 'rec_price', 'amount', 'visible', 'currency', 'availability'])