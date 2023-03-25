from ..models import Rules, Feeds

class CreateUtil:
    com_cat_s_1 = 'com_cat_s_1'
    com_cat_s_0 = 'com_cat_s_0'
    com_cat_d_n = 'com_cat_d_n'
    cat_cat_s_1 = 'cat_cat_s_1'
    cat_cat_s_0 = 'cat_cat_s_0'
    cat_cat_d_n = 'cat_cat_d_n'
    
    def add_category_rules(self, DB):
        Rules.objects.using(DB).get_or_create(name="Automaticke schvaleni", action = self.com_cat_s_1, defaults={'css_class': "success"})
        Rules.objects.using(DB).get_or_create(name="Automaticke zamitnuti", action = self.com_cat_s_0, defaults={'css_class': "danger"})
        Rules.objects.using(DB).get_or_create(name="Rucni schvaleni", action = self.com_cat_d_n, defaults={'css_class': "primary"})
        Rules.objects.using(DB).get_or_create(name="Pair to/Automaticke schvaleni", action = self.cat_cat_s_1, defaults={'css_class': "success"})
        Rules.objects.using(DB).get_or_create(name="Pair to/Automaticke zamitnuti", action = self.cat_cat_s_0, defaults={'css_class': "danger"})
        Rules.objects.using(DB).get_or_create(name="Pair to/rucni schvaleni ", action = self.cat_cat_d_n, defaults={'css_class': "warning"})


    def add_all_feeds(self, DB):
        main = Feeds.objects.using(DB).create(feed_link='https://www.sedaci-pytle.cz/mall_feed.xml', usage="m", name="Sedaci pytle", source="M", master_feed=None)
        Feeds.objects.using(DB).create(feed_link='https://www.sedaci-pytle.cz/mall_feed_dost.xml', usage="a", name=None, source=None, master_feed=main)
        Feeds.objects.using(DB).create(feed_link='<DICTIONARY><ITEMS NEW="SHOP"><ITEM NEW="SHOPITEM"><ID NEW="CODE"/><ITEMGROUP_ID GROUP_BY="true"/><ITEMGROUP_TITLE NEW="NAME_COM"/><TITLE NEW="NAME_VAR"/><SHORTDESC NEW="SHORT_DESCRIPTION"/><LONGDESC NEW="DESCRIPTION"/><BRAND_ID NEW="MANUFACTURER"/><MEDIA NEW="IMAGES"><URL NEW="IMAGE"/><MAIN/></MEDIA><PARAM NEW="TEXT_PROPERTY"><NAME NEW="NAME"/><VALUE NEW="VALUE"/></PARAM><BARCODE NEW="EAN"/><VAT NEW="VAT"/><PRICE NEW="PURCHASE_PRICE"/><RRP NEW="PRICE"/><DELIVERY_DELAY NEW="AVAILABLE_ON"/></ITEM></ITEMS><AVAILABILITIES><AVAILABILITY NEW="STOCK"><IN_STOCK NEW="AMOUNT"></IN_STOCK></AVAILABILITY></AVAILABILITIES></DICTIONARY>', usage="d", name=None, source=None, master_feed=main)
        
        main = Feeds.objects.using(DB).create(feed_link='https://www.mcompanies.cz/heureka/export/products.xml', usage="m", name="mcompanies", source="H", master_feed=None)
        Feeds.objects.using(DB).create(feed_link='https://www.mcompanies.cz/mcompanies-cz-partner.xml', usage="a", name=None, source=None, master_feed=main)
        Feeds.objects.using(DB).create(feed_link='<DICTIONARY><SHOP NEW="SHOP"><SHOPITEM NEW="SHOPITEM"><ITEM_ID NEW="CODE"/><ITEMGROUP_ID GROUP_BY="true"/><EAN NEW="EAN"/><PRODUCTNAME NEW="NAME_COM"/><PRODUCT NEW="NAME_VAR"/><DESCRIPTION NEW="DESCRIPTION"/><IMGURL NEW="IMAGE"/><VAT NEW="VAT"/><PARAM><PARAM_NAME NEW="NAME"/><VAL NEW="VALUE"/></PARAM><ACCESSORY NEW="ACCESSORY"/><PRICE NEW="PRICE"/><PRICE_VAT NEW="REC_PRICE"/><STOCK NEW="AMOUNT"/><CATEGORYTEXT NEW="CATEGORIES"/><DELIVERY_DATE NEW="AVAILABLE_ON"/></SHOPITEM></SHOP></DICTIONARY>', usage="d", name=None, source=None, master_feed=main)
        
        main = Feeds.objects.using(DB).create(feed_link='https://www.e-sportshop.cz/feed/12/85486786345cfdc8b10e4f8cdcb4decafeb8bf75', usage="m", name="EsportShop", source="E", master_feed=None)
        Feeds.objects.using(DB).create(feed_link='https://www.e-sportshop.cz/xmlfeed/b2b/Ug8XIEeAySBV7Wc', usage="a", name=None, source=None, master_feed=main)
        Feeds.objects.using(DB).create(feed_link='<DICTIONARY><SHOP NEW="SHOP"><SHOPITEM NEW="SHOPITEM"><ITEM_ID NEW="CODE"/><ITEMGROUP_ID GROUP_BY="true"/><EAN NEW="EAN"/><PRODUCTNAME NEW="NAME_VAR"/><PRODUCT NEW="NAME_COM"/><SHORT_DESCRIPTION NEW="SHORT_DESCRIPTION"/><DESCRIPTION NEW="DESCRIPTION"/><IMGURL NEW="IMAGE"/><VAT NEW="VAT"/><VARIATION_PARAM><PARAM_NAME NEW="NAME"/><VAL NEW="VALUE"/></VARIATION_PARAM><PARAM><PARAM_NAME NEW="NAME"/><VAL NEW="VALUE"/></PARAM><CATEGORIES><DEFAULT_CATEGORY NEW="CATEGORY"/></CATEGORIES><PRICE_VAT NEW="PRICE"/><BASE_PRICE_VAT NEW="REC_PRICE"/><IN_STORE NEW="AMOUNT"/><AVAILABLE_DATE NEW="AVAILABLE_ON"/><MANUFACTURER NEW="MANUFACTURER"/><CURRENCY NEW="CURRENCY"/></SHOPITEM></SHOP></DICTIONARY>', usage="d", name=None, source=None, master_feed=main)
        
        main = Feeds.objects.using(DB).create(feed_link='https://www.canipet.cz/xmlfeed/b2b/Wu0OAxgm2vHcfpX/2', usage="m", name="Canipet", source="C", master_feed=None)
        Feeds.objects.using(DB).create(feed_link='<DICTIONARY><CATALOG NEW="SHOP"><ENTRY NEW="SHOPITEM"><CODE NEW="CODE"/><EAN NEW="EAN"/><PRODUCTNAME NEW="NAME_VAR"/><PRODUCTNAME NEW="NAME_COM"/><ANNOTATION NEW="SHORT_DESCRIPTION"/><DESCRIPTION NEW="DESCRIPTION"/><IMGURL NEW="IMAGE"/><VAT NEW="VAT"/><PARAM><PARAM_NAME NEW="NAME"/><VAL NEW="VALUE"/></PARAM><CATEGORY NEW="CATEGORY"/><PRICE NEW="PUR_PRICE"/><PRICE_WITH_VAT NEW="PRICE"/><PRICE_RETAIL_WITH_VAT NEW="REC_PRICE"/><MANUFACTURER NEW="MANUFACTURER"/><IN_STOCK NEW="AVAILABLE_ON"/></ENTRY></CATALOG></DICTIONARY>', usage="d", name=None, source=None, master_feed=main)
        
        main = Feeds.objects.using(DB).create(feed_link='https://www.stridasport.cz/export/feedproducts.xml', usage="m", name="Strida", source="S", master_feed=None)
        Feeds.objects.using(DB).create(feed_link='https://www.stridasport.cz/export/feedproducts_availability.xml', usage="a", name=None, source=None, master_feed=main)
        Feeds.objects.using(DB).create(feed_link='https://www.stridasport.cz/export/B2CPriceFeed.aspx?country=CZ', usage="r", name=None, source=None, master_feed=main)
        Feeds.objects.using(DB).create(feed_link='https://www.stridasport.cz/export/CustomerPriceFeed.aspx?id=EAAAAO8fqc1zcjfgXz0vtU4w9PRQ_K5QBABLR_pZytdMbvjy', usage="p", name=None, source=None, master_feed=main)
        Feeds.objects.using(DB).create(feed_link='<DICTIONARY><stridasport><categories><category><category_id NEW="ORIGINAL_ID"/><category_parrent_id NEW="PARENT_ID"/><category_name NEW="CAT_NAME"/></category></categories><products><product><product_code NEW="ITEMGROUP_ID"/><category_id NEW="ADD_TO_CAT"/><name NEW="COM_NAME"/><long_description NEW="DESCRIPTION"/><producer NEW="MANUFACTURER"/><ean NEW="EAN_TEST"/><images><image NEW="IMAGE"/></images><variants><variant><product_code NEW="CODE"/><ean NEW="EAN"/><name NEW="VAR_NAME"/><vat NEW="VAT"/><parameters><parameter><name NEW="NAME"/><value NEW="VALUE"/><order NEW="VAR_PARAM"/></parameter></parameters></variant></variants></product></products><productAvailability><availability_units NEW="AMOUNT"/><availability NEW="AVAILABLE_ON"/></productAvailability><productPrice><pricevat NEW="PRICE"/><pricevat NEW="PUR_PRICE"/></productPrice></stridasport></DICTIONARY>', usage="d", name=None, source=None, master_feed=main)
        
        Feeds.objects.using(DB).create(feed_link='https://www.asportpro.cz/export/categories.xml?partnerId=6&patternId=-31&hash=f20429a85b8fc82b7d3f0746b367dcab974b217242a7ee1114e88715c77d0608', usage="c", name='Eshop-categories', source=None, master_feed=None)
