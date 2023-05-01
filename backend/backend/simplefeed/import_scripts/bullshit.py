from ..utils.open_urls import OpenURLS
from xml.etree.ElementTree import fromstring
from queue import LifoQueue
from ..models import Image, Variant, Common, Feeds, VariantParam, Manufacturers, Rules, Param, Availabilities
from ..utils.importutils import ImportUtils
from ..utils.category import CategoryUtil
from ..utils.availability import AvailabilityUtils

def bullshit_to_shoptet(DB, url_data):
    supplier_id = url_data.id
    root_data = OpenURLS().xml_from_url(url_data.feed_link).getroot()
    rootdict = fromstring(Feeds.objects.using(DB).get(usage='d', master_feed=supplier_id).feed_link)
    parent_stack = LifoQueue()
    dict = list()
    ImportUtils().create_dictionary(rootdict, parent_stack, dict)
    amount_tree = False
    try:
        amount_data = OpenURLS().xml_from_url((Feeds.objects.using(DB).filter(usage='a', master_feed=supplier_id))[0].feed_link).getroot()
    except Exception as e:
        print(e)
    else:
        amount_tree = True
    
    common_list = []
    var_list = []
    category_watch_out_rule = Rules.objects.using(DB).get(action="com_cat_d_n")
    CategoryUtil.create_default_category(DB, url_data, category_watch_out_rule)
    in_stock, out_stock = AvailabilityUtils.create_default_availabilities(DB, supplier_id)
    
    for child in root_data.findall("SHOPITEM[VISIBILITY='visible']"):
        parent_stack.put(child.tag)
        
        short_desc = ImportUtils().get_text(dict, parent_stack, "SHORT_DESCRIPTION", child)
        desc = ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", child)
        man = ImportUtils().get_text(dict, parent_stack, "MANUFACTURER", child)
        manufacturer, created = Manufacturers.objects.using(DB).get_or_create(original_name=man, defaults={'name': man})
        com_name = ImportUtils().get_text(dict ,parent_stack, "COM_NAME", child)
        code = ImportUtils().get_text(dict, parent_stack, "CODE", child)
        curr_comm, created_comm = Common.objects.using(DB).get_or_create(itemgroup_id=code,
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
        CategoryUtil().add_category_use(DB, CategoryUtil.created_supplier_category(DB, ImportUtils().get_text(dict, parent_stack, "CATEGORY", child.find("CATEGORIES")), " > ", supplier_id, category_watch_out_rule).id, curr_comm, category_watch_out_rule)
        parent_stack.get()
        
        try:
            var_image = Image()
            for i, t in enumerate(child.find("IMAGES").findall("IMAGE")):
                new_im, created_im = Image.objects.using(DB).get_or_create(image=t.text)
                curr_comm.images.add(new_im)
                if i == 0:
                    var_image = new_im
        except:
            var_image = None

        ean = ImportUtils().get_text(dict, parent_stack, "EAN", child)
        
        if amount_tree:
            pass
            # if (node := try_find_from(amount_data, "SHOPITEM", "ITEM_ID", code)) == None:
            #     node = try_find_from(amount_data, "SHOPITEM", "EAN", ean)
            # if node == None:
            #     visible = 2
            # else:
            #     visible = 0
            # amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", node)
            # price = ImportUtils().get_text(dict, parent_stack, "PRICE", node)
            # vat = ImportUtils().get_text(dict, parent_stack, "VAT", node)
            # availability = availability_setup(DB, node, supplier_id, in_stock, out_stock, amount, dict, parent_stack)
        else:
            parent_stack.put("STOCK")
            amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", child.find("STOCK"))
            parent_stack.get()
            price = ImportUtils().get_text(dict, parent_stack, "PRICE", child)
            vat = ImportUtils().get_text(dict, parent_stack, "VAT", child)
            availability = availability_setup(DB, amount, supplier_id, out_stock, ImportUtils().get_text(dict, parent_stack, "NOT_AVAILABLE", child), in_stock, ImportUtils().get_text(dict, parent_stack, "AVAILABLE", child))
            visible = 0

        rec_price = ImportUtils().get_text(dict, parent_stack, "REC_PRICE", child)
        pur_price = ImportUtils().get_text(dict, parent_stack, "PUR_PRICE", child)
        currency = ImportUtils().get_text(dict, parent_stack, "CURRENCY", child)
        name = ImportUtils().get_text(dict, parent_stack, "VAR_NAME", child)
        
        curr_var, created_var = Variant.objects.using(DB).get_or_create(code=code,
                                                                        ean=ean,
                                                                        defaults={  'vat': vat,
                                                                                    'pur_price': pur_price,
                                                                                    'price': price,
                                                                                    'amount': amount,
                                                                                    'currency': currency,
                                                                                    'visible': visible,
                                                                                    'image_ref': var_image,
                                                                                    'rec_price': rec_price,
                                                                                    'free_billing': 0,
                                                                                    'free_shipping': 0,
                                                                                    'name': name,
                                                                                    'availability': availability})
        if not created_var:
            curr_var.name = name
            curr_var.image_ref = var_image
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
        
        parent_stack.put("INFORMATION_PARAMETER")
        try:
            proplist = child.find("INFORMATION_PARAMETERS").findall(ImportUtils().LifoPeek(parent_stack))
            for p in proplist:
                param, created = Param.custom_get_or_create(DB, ImportUtils().get_text(dict, parent_stack, "NAME", p), ImportUtils().get_text(dict, parent_stack, "VALUE", p), supplier_id)
                VariantParam.objects.using(DB).get_or_create(variant=curr_var, param=param, defaults={'var_param': False})
        except:
            pass
        parent_stack.get()
                
        curr_comm.variants.add(curr_var)
        
        if not common_price:
            curr_comm.price_common_id = curr_var.id
            common_price = True
            curr_comm.save()
                        
        if not created_comm:
            common_list.append(curr_comm)
        
        parent_stack.get()

    Common.objects.using(DB).bulk_update(common_list, ['short_description', 'description', 'manufacturer', 'supplier_id', 'price_common_id', 'name'])
    Variant.objects.using(DB).bulk_update(var_list, ['name', 'vat', 'pur_price', 'price', 'rec_price', 'amount', 'image_ref', 'visible', 'currency', 'availability'])

def availability_setup(DB, amount, supplier, default_no, custom_no, default_yes, custom_yes):
    if amount == None or int(amount) <= 0:
        if custom_no != None:
            availability, created_a = Availabilities.objects.using(DB).get_or_create(original_name=custom_no,
                                                                                    supplier_id=supplier,
                                                                                    defaults={
                                                                                        'buyable': True,
                                                                                        'name': custom_no,
                                                                                        'active': True
                                                                                    })
        else:
            availability = default_no
    else:
        if custom_yes != None:
            availability, created_a = Availabilities.objects.using(DB).get_or_create(original_name=custom_yes,
                                                                                    supplier_id=supplier,
                                                                                    defaults={
                                                                                        'buyable': True,
                                                                                        'name': custom_yes,
                                                                                        'active': True
                                                                                    })
        else:
            availability = default_yes
    return availability