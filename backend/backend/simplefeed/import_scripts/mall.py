from ..utils.open_urls import xml_from_url
from xml.etree.ElementTree import fromstring
from queue import LifoQueue
from ..models import Image, Variant, Common, Feeds, Manufacturers, Param, Variant_Image
from ..utils.importutils import ImportUtils
from ..utils.availability import AvailabilityUtils

def update_DB_from_xml(DB, url_data):
    images = Image.objects.using(DB)

    supplier_id = url_data.id
    rootdict = fromstring(Feeds.objects.using(DB).get(usage='d', master_feed=supplier_id).feed_link)
    parent_stack = LifoQueue()
    dict = list()
    ImportUtils().create_dictionary(rootdict, parent_stack, dict)
    for r in rootdict.iter():
        if r.get("GROUP_BY") == "true":
            group_by = r.tag
            break
    group_by_done = list()

    root_data = xml_from_url(url_data.feed_link).getroot()
    amount_tree = False
    try:
        amount_data = xml_from_url((Feeds.objects.using(DB).filter(usage='a', master_feed=supplier_id))[0].feed_link).getroot()
    except Exception as e:
        print(e)
    else:
        amount_tree = True
    
    common_list = []
    var_list = []
    
    in_stock, out_stock = AvailabilityUtils.create_default_availabilities(DB, supplier_id)
    
    for child in list(root_data):
        c = child.find(group_by)
        if c.text in group_by_done:
            continue
        list_same = root_data.findall(""+child.tag+"["+group_by+"='"+c.text+"']")
        tmp = list_same.pop()
        list_same.append(tmp)

        parent_stack.put(child.tag)
        
        man = ImportUtils().get_text(dict, parent_stack, "MANUFACTURER", tmp)
        manufacturer, created = Manufacturers.objects.using(DB).get_or_create(original_name=man, defaults={'name': man})
        name_com = ImportUtils().get_text(dict ,parent_stack, "NAME_COM", tmp)
        curr_comm, created_comm = Common.objects.using(DB).get_or_create(   itemgroup_id=c.text,
                                                                            supplier_id = supplier_id,
                                                                            defaults={  'short_description': ImportUtils().get_text(dict, parent_stack, "SHORT_DESCRIPTION", tmp),
                                                                                        'description': ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", tmp),
                                                                                        'manufacturer': manufacturer,
                                                                                        'name': name_com,
                                                                                        'approved': 0})
        if not created_comm:
            curr_comm.short_description = ImportUtils().get_text(dict, parent_stack, "SHORT_DESCRIPTION", tmp)
            curr_comm.description = ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", tmp)
            curr_comm.manufacturer = manufacturer
            curr_comm.name = name_com
            curr_comm.supplier_id = supplier_id
            common_price = True
        else:
            common_price = False
            
        
        for item in reversed(list_same):
            parent_stack.put("AVAILABILITY")
            if amount_tree:
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", amount_data.find("AVAILABILITY[ID='"+item.find("ID").text+"']"))
            else:
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", item)
            parent_stack.get()
            
            availability = AvailabilityUtils.availability_setup(DB, item, supplier_id, in_stock, out_stock, amount, dict, parent_stack)
            
            curr_var, created_var = Variant.objects.using(DB).get_or_create(code=ImportUtils().get_text(dict, parent_stack, "CODE", item),
                                                                            ean=ImportUtils().get_text(dict, parent_stack, "EAN", item),
                                                                            defaults={  'vat': ImportUtils().get_text(dict, parent_stack, "VAT", item),
                                                                                        'pur_price': ImportUtils().get_text(dict, parent_stack, "PURCHASE_PRICE", item),
                                                                                        'price': ImportUtils().get_text(dict, parent_stack, "PRICE", item),
                                                                                        'amount': amount,
                                                                                        'currency': 'czk',
                                                                                        'visible': 0,
                                                                                        'rec_price': ImportUtils().get_text(dict, parent_stack, "PRICE", item),
                                                                                        'free_billing': 0,
                                                                                        'free_shipping': 0,
                                                                                        'name': ImportUtils().get_text(dict, parent_stack, "NAME_VAR", item),
                                                                                        'availability': availability})
            parent_stack.put("MEDIA")
            for t in item.findall(ImportUtils().LifoPeek(parent_stack)):
                new_im, created_im = Image.objects.using(DB).get_or_create(image=ImportUtils().get_text(dict, parent_stack, "IMAGE", t))
                Variant_Image.objects.using(DB).get_or_create(variant=curr_var, image=new_im, defaults={'main': False})

            Variant_Image.objects.using(DB).filter(variant=curr_var, image=images.filter(image=item.find(ImportUtils().LifoPeek(parent_stack)+"[MAIN='true']").find("URL").text)[:1]).update(main=True)
            parent_stack.get()
            
            if not created_var:
                curr_var.name = ImportUtils().get_text(dict, parent_stack, "NAME_VAR", item)
                curr_var.amount = amount
                curr_var.availability = availability
                curr_var.mass_update(DB)
                if curr_var.mods == None:
                    curr_var.vat = ImportUtils().get_text(dict, parent_stack, "VAT", item)
                    curr_var.pur_price = ImportUtils().get_text(dict, parent_stack, "PURCHASE_PRICE", item)
                    curr_var.price = curr_var.rec_price = ImportUtils().get_text(dict, parent_stack, "PRICE", item)
                else:
                    curr_var.if_mods_set('vat', ImportUtils().get_text(dict, parent_stack, "VAT", item))
                    price = ImportUtils().get_text(dict, parent_stack, "PRICE", item)
                    curr_var.if_mods_set('price', price)
                    curr_var.if_mods_set('rec_price', price)
                    curr_var.if_mods_set('pur_price', ImportUtils().get_text(dict, parent_stack, "PURCHASE_PRICE", item))
                var_list.append(curr_var)
                        
            parent_stack.put("PARAM")
            proplist = item.findall(ImportUtils().LifoPeek(parent_stack))
            for p in proplist:
                param, created = Param.custom_get_or_create(DB, ImportUtils().get_text(dict, parent_stack, "NAME", p), ImportUtils().get_text(dict, parent_stack, "VALUE", p), supplier_id)
                curr_var.get_params_from_name(param, name_com, DB)
                            
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
        
    Common.objects.using(DB).bulk_update(common_list, ['short_description', 'description', 'manufacturer', 'supplier_id', 'name', 'price_common_id'])
    Variant.objects.using(DB).bulk_update(var_list, ['name', 'vat', 'pur_price', 'price', 'amount', 'availability', 'rec_price'])
