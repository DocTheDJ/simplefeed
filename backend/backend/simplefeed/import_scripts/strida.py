from ..utils.open_urls import xml_from_url
from xml.etree.ElementTree import fromstring
from queue import LifoQueue
from ..models import Image, Variant, Common, Feeds, Category, Manufacturers, Rules, Param, VariantParam, Variant_Image
from ..utils.importutils import ImportUtils
from ..utils.category import CategoryUtil
from ..utils.availability import AvailabilityUtils

def strida_to_shoptet(DB, url_data):
    supplier_id = url_data.id
    root_data = xml_from_url(url_data.feed_link).getroot()
    rootdict = fromstring(Feeds.objects.using(DB).get(usage='d', master_feed=supplier_id).feed_link)
    parent_stack = LifoQueue()
    dict = list()
    ImportUtils().create_dictionary(rootdict, parent_stack, dict)
    
    amount_tree = False
    try:
        amount_data = xml_from_url(Feeds.objects.using(DB).get(usage='a', master_feed=supplier_id).feed_link).getroot()
    except Exception as e:
        print(e)
    else:
        amount_tree = True
    
    pur_price_tree = False
    try:
        pur_price_data = xml_from_url(Feeds.objects.using(DB).get(usage='p', master_feed=supplier_id).feed_link).getroot()
    except Exception as e:
        print(e)
    else:
        pur_price_tree = True
    
    rec_price_tree = False
    try:
        rec_price_data = xml_from_url(Feeds.objects.using(DB).get(usage='r', master_feed=supplier_id).feed_link).getroot()
    except Exception as e:
        print(e)
    else:
        rec_price_tree = True

    category_watch_out_rule = Rules.objects.using(DB).get(action="com_cat_d_n")
    CategoryUtil.create_default_category(DB, url_data, category_watch_out_rule)

    parent_stack.put("categories")
    create_cats(DB, root_data.find("categories"), parent_stack, dict, supplier_id, category_watch_out_rule)
    parent_stack.put("categories")

    common_list = []
    var_list = []
    in_stock, out_stock = AvailabilityUtils.create_default_availabilities(DB, supplier_id)
    for child in root_data.find("products"):
        parent_stack.put(child.tag)
        
        eans = ImportUtils().get_text(dict, parent_stack, "EAN_TEST", child).strip(' \t\n\r')
        if eans == None or eans == "":
            continue
        itemgroup_id = ImportUtils().get_text(dict, parent_stack, "ITEMGROUP_ID", child)
        desc = ImportUtils().get_text(dict, parent_stack, "DESCRIPTION", child)
        man = ImportUtils().get_text(dict, parent_stack, "MANUFACTURER", child)
        manufacturer, created = Manufacturers.objects.using(DB).get_or_create(original_name=man, defaults={'name': man})
        com_name = ImportUtils().get_text(dict, parent_stack, "COM_NAME", child)
        curr_comm, created_comm = Common.objects.using(DB).get_or_create(itemgroup_id=itemgroup_id,
                                                                        supplier_id=supplier_id,
                                                                        defaults={
                                                                            'short_description': None,
                                                                            'description': desc,
                                                                            'manufacturer': manufacturer,
                                                                            'name': com_name,
                                                                            'approved': 0
                                                                        })
        
        if not created_comm:
            curr_comm.short_description = None
            curr_comm.description = desc
            curr_comm.manufacturer = manufacturer
            curr_comm.supplier_id = supplier_id
            curr_comm.name = com_name
        common_price = False
        
        CategoryUtil().add_category_use(DB, Category.objects.using(DB).get(original_id=ImportUtils().get_text(dict, parent_stack, "ADD_TO_CAT", child), source_id=supplier_id), curr_comm, category_watch_out_rule)
        
        parent_stack.put("images")
        imagesList = []
        for i, image in enumerate(child.find("images")):
            new_im, created_im = Image.objects.using(DB).get_or_create(image=image.text)
            imagesList.append(new_im)
        parent_stack.get()
        
        parent_stack.put("variants")
        for variant in child.find("variants"):
            parent_stack.put(variant.tag)
            code = ImportUtils().get_text(dict, parent_stack, "CODE", variant)
            ean = ImportUtils().get_text(dict, parent_stack, "EAN", variant)
            var_name = separate_data(ImportUtils().get_text(dict, parent_stack, "VAR_NAME", variant))
            vat = ImportUtils().get_text(dict, parent_stack, "VAT", variant)
            
            parent_stack.put("productAvailability")
            if amount_tree:
                node = ImportUtils().try_find_from(amount_data, "productAvailability", "product_code", code)
                if node == None:
                    visible = 2
                else:
                    visible = 0
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", node)
                availability = in_stock if ImportUtils().get_text(dict, parent_stack, "AVAILABLE_ON", node) == "1" else out_stock
            else:
                amount = ImportUtils().get_text(dict, parent_stack, "AMOUNT", variant)
                availability = in_stock if ImportUtils().get_text(dict, parent_stack, "AVAILABLE_ON", variant) == "1" else out_stock
            parent_stack.get()
            
            parent_stack.put("productPrice")
            if pur_price_tree:
                node = ImportUtils().try_find_from(pur_price_data, "productPrice", "product_code", code)
                if node == None:
                    visible = 2
                pur_price = ImportUtils().get_text(dict, parent_stack, "PUR_PRICE", node)
            else:
                pur_price = ImportUtils().get_text(dict, parent_stack, "PUR_PRICE", variant)
            
            if rec_price_tree:
                node = ImportUtils().try_find_from(rec_price_data, "productPrice", "product_code", code)
                if node == None:
                    visible = 2
                rec_price = ImportUtils().get_text(dict, parent_stack, "PRICE", node)
            else:
                rec_price = ImportUtils().get_text(dict, parent_stack, "PRICE", variant)
            parent_stack.get()
            
            curr_var, created_var = Variant.objects.using(DB).get_or_create(code=code,
                                                                            ean=ean,
                                                                            defaults={
                                                                                'vat': vat,
                                                                                'pur_price': pur_price,
                                                                                'price': rec_price,
                                                                                'amount': amount,
                                                                                'currency': 'CZK',
                                                                                'visible': visible,
                                                                                'rec_price': rec_price,
                                                                                'free_billing': 0,
                                                                                'free_shipping': 0,
                                                                                'name': var_name,
                                                                                'availability': availability
                                                                            })
            if len(imagesList):
                Variant_Image.objects.using(DB).get_or_create(variant=curr_var, image=imagesList[0], defaults={'main': True})
                for im in imagesList[1:]:
                    Variant_Image.objects.using(DB).get_or_create(variant=curr_var, image=im, defaults={'main': False})

            if not created_var:
                curr_var.name = var_name
                curr_var.amount = amount
                curr_var.visible = visible
                curr_var.currency = 'CZK'
                curr_var.availability = availability
                if curr_var.mods == None:
                    curr_var.vat = vat
                    curr_var.pur_price = pur_price
                    curr_var.rec_price = curr_var.price = rec_price
                else:
                    curr_var.if_mods_set('vat', vat)
                    curr_var.if_mods_set('price', rec_price)
                    curr_var.if_mods_set('pur_price', pur_price)
                    curr_var.if_mods_set('rec_price', rec_price)
                        
                var_list.append(curr_var)
            
            parent_stack.put("parameter")
            proplist = variant.find("parameters").findall(ImportUtils().LifoPeek(parent_stack))
            for p in proplist:
                try:
                    param, created = Param.custom_get_or_create(DB, ImportUtils().get_text(dict, parent_stack, "NAME", p), ImportUtils().get_text(dict, parent_stack, "VALUE", p), supplier_id)
                    if int(var_param := ImportUtils().get_text(dict, parent_stack, "VAR_PARAM", p)) < 99:
                        VariantParam.objects.using(DB).get_or_create(variant=curr_var, param=param, defaults={'var_param': True})
                    else:
                        VariantParam.objects.using(DB).get_or_create(variant=curr_var, param=param, defaults={'var_param': False})
                except:
                    pass
            parent_stack.get()
            
            curr_comm.variants.add(curr_var)
            
            if not common_price:
                curr_comm.price_common_id = curr_var.id
                common_price = True
                curr_comm.save()
            parent_stack.get()
        parent_stack.get()
        
        if not created_comm:
            common_list.append(curr_comm)
    Common.objects.using(DB).bulk_update(common_list, ['short_description', 'description', 'manufacturer', 'supplier_id', 'price_common_id', 'name'])
    Variant.objects.using(DB).bulk_update(var_list, ['name', 'vat', 'pur_price', 'price', 'rec_price', 'amount', 'visible', 'currency', 'availability'])
    
def create_cats(DB, categories, parent_stack, dict, source, action):
    parent_stack.put("category")
    for cat in list(categories):
        p = ImportUtils().get_text(dict, parent_stack, "PARENT_ID", cat)
        if p != "0":
            test = Category.objects.using(DB).get(original_id=p, source_id=source).id
        else:
            test = Category.objects.using(DB).get(source_id=source, parent_id=None).id
        Category.objects.using(DB).get_or_create(name=separate_data(ImportUtils().get_text(dict, parent_stack, "CAT_NAME", cat)),
                                                 original_id=ImportUtils().get_text(dict, parent_stack, "ORIGINAL_ID", cat),
                                                 original_parent_id=test,
                                                 source_id = source,
                                                 defaults={
                                                     'parent_id': test,
                                                     'action': action
                                                 })
    parent_stack.get()

def separate_data(obj:str):
    obj = obj.replace('<![CDATA[', '')
    obj = obj.replace(']]>', '')
    return obj