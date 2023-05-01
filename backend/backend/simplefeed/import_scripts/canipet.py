from ..utils.open_urls import OpenURLS
from xml.etree.ElementTree import fromstring
from queue import LifoQueue
from ..utils.importutils import ImportUtils
from ..models import Image, Variant, Common, Feeds, Manufacturers, Rules, Param, Variant_Image
from ..utils.availability import AvailabilityUtils
from ..utils.category import CategoryUtil

def canipet_to_shoptet(DB, url_data):
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
    
    category_watch_out_rule = Rules.objects.using(DB).get(action="com_cat_d_n")
    common_list = []
    var_list = []
    CategoryUtil.create_default_category(DB, url_data, category_watch_out_rule)
    in_stock, out_stock = AvailabilityUtils.create_default_availabilities(DB, supplier_id)
    for child in list(root_data):
        parent_stack.put(child.tag)
        
        code = ImportUtils().get_text(dict, parent_stack, "CODE", child)
        short_desc = ImportUtils().get_text(dict, parent_stack, "SHORT_DESCRIPTION", child)
        desc = ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", child)
        man = ImportUtils().get_text(dict, parent_stack, "MANUFACTURER", child)
        com_name = ImportUtils().get_text(dict, parent_stack, "NAME_COM", child)
        manufacturer, created = Manufacturers.objects.using(DB).get_or_create(original_name=man, defaults={'name': man})
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
                
        CategoryUtil().add_category_use(DB, CategoryUtil.created_supplier_category(DB, ImportUtils().get_text(dict, parent_stack, "CATEGORY", child), " > ", supplier_id, category_watch_out_rule).id, curr_comm, category_watch_out_rule)
        
        ean = ImportUtils().get_text(dict, parent_stack, "EAN", child)
        
        if amount_tree:
            pass
            # if (node := try_find_from(amount_data, "SHOPITEM", "ITEM_ID", code)) == None:
            #     # if (node := look_for_flaws(amount_data, "SHOPITEM", "ITEM_ID", code, "_", "/")) == None:
            #     node = try_find_from(amount_data, "SHOPITEM", "EAN", ean)
            # if node == None:
            #     visible = 2
            # else:
            #     visible = 0
            # amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", node)
            # price = ImportUtils().get_text(dict, parent_stack, "PRICE", node)
            # vat = ImportUtils().get_text(dict, parent_stack, "VAT", node)
            # rec_price = ImportUtils().get_text(dict, parent_stack, "REC_PRICE", node)
        else:
            amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", child)
            price = ImportUtils().get_text(dict, parent_stack, "PRICE", child)
            vat = ImportUtils().get_text(dict, parent_stack, "VAT", child)
            availability = in_stock if ImportUtils().get_text(dict, parent_stack, "AVAILABLE_ON", child) == "yes" else out_stock
            visible = 0

        rec_price = ImportUtils().get_text(dict, parent_stack, "REC_PRICE", child)
        if (currency := ImportUtils().get_text(dict, parent_stack, "CURRENCY", child)) == None:
            currency = "CZK"
        name = ImportUtils().get_text(dict, parent_stack, "NAME_VAR", child)
        pur_price = ImportUtils().get_text(dict, parent_stack, "PUR_PRICE", child)
        
        curr_var, created_var = Variant.objects.using(DB).get_or_create(code=code,
                                                                        ean=ean,
                                                                        defaults={  'vat': vat,
                                                                                    'pur_price': pur_price,
                                                                                    'price': price,
                                                                                    'amount': amount,
                                                                                    'currency': currency,
                                                                                    'visible': visible,
                                                                                    # 'image_ref_id': main_im.id,
                                                                                    'rec_price': rec_price,
                                                                                    'free_billing': 0,
                                                                                    'free_shipping': 0,
                                                                                    'name': name, 
                                                                                    'availability': availability})
        
        for t in child.findall("IMGURL_ALTERNATIVE"):
            new_im, created_im = Image.objects.using(DB).get_or_create(image=t.text)
            Variant_Image.objects.using(DB).get_or_create(variant=curr_var, image=new_im, defaults={'main': False})
            # curr_comm.images.add(new_im)
        
        main_im, created_main = Image.objects.using(DB).get_or_create(image=ImportUtils().get_text(dict, parent_stack, "IMAGE", child))
        Variant_Image.objects.using(DB).get_or_create(variant=curr_var, image=main_im, defaults={'main': True})
        # curr_comm.images.add(main_im)
        
        parent_stack.put("PARAM")
        proplist = child.findall(ImportUtils().LifoPeek(parent_stack))
        for p in proplist:
            param, created = Param.custom_get_or_create(DB, ImportUtils().get_text(dict, parent_stack, "NAME", p), ImportUtils().get_text(dict, parent_stack, "VALUE", p), supplier_id)
            curr_var.get_params_from_name(param, com_name, DB)
        parent_stack.get()
        
        if not created_var:
            curr_var.name = name
            # curr_var.image_ref_id = main_im.id
            curr_var.amount = amount
            curr_var.visible = visible
            curr_var.currency = currency
            curr_var.availability = availability
            if curr_var.mods == None:
                curr_var.vat = vat
                curr_var.pur_price = pur_price
                curr_var.price = price
                curr_var.rec_price = rec_price
            else:
                curr_var.if_mods_set('vat', vat)
                curr_var.if_mods_set('price', price)
                curr_var.if_mods_set('pur_price', pur_price)
                curr_var.if_mods_set('rec_price', rec_price)
                    
            var_list.append(curr_var)
                
        curr_comm.variants.add(curr_var)
        
        if not common_price:
            curr_comm.price_common_id = curr_var.id
            common_price = True
            curr_comm.save()

        if not created_comm:
            common_list.append(curr_comm)
        
        parent_stack.get()

    Common.objects.using(DB).bulk_update(common_list, ['short_description', 'description', 'manufacturer', 'supplier_id', 'price_common_id', 'name'])
    Variant.objects.using(DB).bulk_update(var_list, ['name', 'vat', 'pur_price', 'price', 'rec_price', 'amount', 'visible', 'currency', 'availability'])
