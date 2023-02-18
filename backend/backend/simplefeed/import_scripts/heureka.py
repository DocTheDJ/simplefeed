from ..utils.open_urls import xml_from_url
from xml.etree.ElementTree import fromstring
from queue import LifoQueue
from ..models import Image, Variant, Common, Feeds, Rules, Manufacturers, Param
from ..utils.importutils import ImportUtils
from ..utils.category import CategoryUtil
from ..utils.availability import AvailabilityUtils

def heureka_to_shoptet(DB, url_data):
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
    
    category_watch_out_rule = Rules.objects.using(DB).get(action="com_cat_d_n")
    common_list = []
    var_list = []
    
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
        
        com_name = ImportUtils().get_text(dict ,parent_stack, "NAME_COM", tmp)
        
        man = ImportUtils().get_text(dict, parent_stack, "MANUFACTURER", tmp)
        manufacturer, created = Manufacturers.objects.using(DB).get_or_create(original_name=man, defaults={'name': man})
        
        curr_comm, created_comm = Common.objects.using(DB).get_or_create(itemgroup_id=c.text,
                                                                         supplier_id = supplier_id,
                                                                        defaults={ 'short_description': ImportUtils().get_text(dict, parent_stack, "SHORT_DESCRIPTION", tmp),
                                                                                    'description': ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", tmp),
                                                                                    'manufacturer': manufacturer,
                                                                                    'name': com_name,
                                                                                    'approved': 0})
        if not created_comm:
            curr_comm.short_description = ImportUtils().get_text(dict, parent_stack, "SHORT_DESCRIPTION", tmp)
            curr_comm.description = ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", tmp)
            curr_comm.manufacturer = manufacturer
            curr_comm.name = com_name
            curr_comm.supplier_id = supplier_id
        common_price = False
        
        CategoryUtil.add_category_use(DB, CategoryUtil.created_supplier_category(DB, ImportUtils().get_text(dict, parent_stack, "CATEGORIES", tmp), " | ", supplier_id, category_watch_out_rule).id, curr_comm, category_watch_out_rule)
        
        for item in reversed(list_same):
            for t in item.findall("IMGURL_ALTERNATIVE"):
                new_im, created_im = Image.objects.using(DB).get_or_create(image=t.text)
                curr_comm.images.add(new_im)
            
            main_im, created_main = Image.objects.using(DB).get_or_create(image=ImportUtils().get_text(dict, parent_stack, "IMAGE", item))
            curr_comm.images.add(main_im)
            
            param_list = []
            parent_stack.put("PARAM")
            proplist = item.findall(ImportUtils().LifoPeek(parent_stack))
            for p in proplist:
                param, created = Param.custom_get_or_create(DB, ImportUtils().get_text(dict, parent_stack, "NAME", p), ImportUtils().get_text(dict, parent_stack, "VALUE", p), supplier_id)
                param_list.append(param)
            parent_stack.get()
            
            code = ImportUtils().get_text(dict, parent_stack, "CODE", item)
            
            if amount_tree:
                if (node := ImportUtils().try_find_from(amount_data, "SHOPITEM", "ID", code)) == None:
                    if (node := ImportUtils().look_for_flaws(amount_data, "SHOPITEM", "ID", ImportUtils().get_text(dict, parent_stack, "CODE", item), "_", "/")) == None:
                        if (node := ImportUtils().try_find_from(amount_data, "SHOPITEM", "EAN", ImportUtils().get_text(dict, parent_stack, "EAN", item))) == None:
                            for p in param_list:
                                if (node := ImportUtils().try_find_from(amount_data, "SHOPITEM", "ID", ImportUtils().get_new_search(code, "_", p.value.value))) == None:
                                    if (node := ImportUtils().try_find_from(amount_data, "SHOPITEM", "ID", ImportUtils().get_new_search(code, " ", p.value.value))) == None:
                                        if (node := ImportUtils().try_find_from(amount_data, "SHOPITEM", "ID", ImportUtils().get_new_search(code, "/", p.value.value))) != None:
                                            break
                                    else:
                                        break
                                else:
                                    break
                if node == None:
                    visible = 2
                else:
                    visible = (1 if curr_comm.approved else 0)
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", node)
                price = ImportUtils().get_text(dict, parent_stack, "PRICE", node)
                vat = ImportUtils().get_text(dict, parent_stack, "VAT", node)
                rec_price = ImportUtils().get_text(dict, parent_stack, "REC_PRICE", node)
            else:
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", item)
                price = ImportUtils().get_text(dict, parent_stack, "PRICE", item)
                vat = ImportUtils().get_text(dict, parent_stack, "VAT", item)
                rec_price = ImportUtils().get_text(dict, parent_stack, "REC_PRICE", item)
                visible = 0
            
            availability = in_stock if ImportUtils().get_text(dict, parent_stack, "AVAILABLE_ON", item) == "1" else out_stock
            curr_var, created_var = Variant.objects.using(DB).get_or_create(code=code,
                                                                            ean=ImportUtils().get_text(dict, parent_stack, "EAN", item),
                                                                            defaults={  'vat': vat,
                                                                                        'pur_price': price,
                                                                                        'price': price,
                                                                                        'amount': amount,
                                                                                        'currency': 'czk',
                                                                                        'visible': visible,
                                                                                        'image_ref_id': main_im.id,
                                                                                        'rec_price': rec_price,
                                                                                        'free_billing': 0,
                                                                                        'free_shipping': 0,
                                                                                        'name': ImportUtils().get_text(dict, parent_stack, "NAME_VAR", item),
                                                                                        'availability': availability})
            if not created_var:
                curr_var.name = ImportUtils().get_text(dict, parent_stack, "NAME_VAR", item)
                curr_var.image_ref_id = main_im.id
                curr_var.amount = amount
                curr_var.visible = visible
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
            
            for i in param_list:
                curr_var.get_params_from_name(i, com_name, DB)
            
            curr_comm.variants.add(curr_var)
            
            if not common_price:
                curr_comm.price_common_id = curr_var.id
                common_price = True
                curr_comm.save()
                        
        if not created_comm:
            common_list.append(curr_comm)
        
        group_by_done.append(c.text)
        parent_stack.get()
    Common.objects.using(DB).bulk_update(common_list, ['short_description', 'description', 'manufacturer', 'supplier_id', 'price_common_id', 'name', 'approved'])
    Variant.objects.using(DB).bulk_update(var_list, ['name', 'vat', 'pur_price', 'price', 'amount', 'image_ref_id', 'visible', 'availability', 'rec_price'])
