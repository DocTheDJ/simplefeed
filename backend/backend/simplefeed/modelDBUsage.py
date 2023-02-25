from .models import Feeds, Category
from .utils.open_urls import xml_from_url
from .import_scripts.heureka import heureka_to_shoptet
from .import_scripts.mall import update_DB_from_xml
from .import_scripts.esportshop import esportshop_to_shoptet
from .import_scripts.canipet import canipet_to_shoptet
from .import_scripts.strida import strida_to_shoptet
from .import_scripts.bullshit import bullshit_to_shoptet
from django.utils import timezone
from django.db.models import Q

def crossroads(DB):
    for data in Feeds.objects.using(DB).filter(usage='m'):
        print("starting "+data.name)
        if data.source == 'M':
            update_DB_from_xml(DB, data)
            print("finished "+data.name)
            set_updated_on(data)
            continue
        if data.source == 'H':
            heureka_to_shoptet(DB, data)
            print("finished "+data.name)
            set_updated_on(data)
            continue
        # if data.source == 'E':
        #     esportshop_to_shoptet(DB, data)
        #     print("finished "+data.name)
        #     set_updated_on(data)
        #     continue
        # if data.source == 'C':
        #     canipet_to_shoptet(DB, data)
        #     print("finished "+data.name)
        #     set_updated_on(data)
        #     continue
        # if data.source == 'S':
        #     strida_to_shoptet(DB, data)
        #     print("finished "+data.name)
        #     set_updated_on(data)
        #     continue
        # if data.source == 'T':
        #     bullshit_to_shoptet(DB, data)
        #     print("finished "+data.name)
        #     set_updated_on(data)
        #     continue
    print("finished crossroads for "+DB)

def set_updated_on(feed):
    feed.updated_on = timezone.now()
    feed.save()

class category_lists():
    def __init__(self) -> None:
        self.update_category_list = []
        self.update_ids = []
        self.created_ids = []
        self.parentless = []
    
    def add_not_created(self, obj):
        self.update_category_list.append(obj)
        self.update_ids.append(obj.id)
    def add_created(self, obj):
        self.created_ids.append(obj.id)
    def add_parentless(self, obj):
        self.parentless.append(obj)
    def parentless_len(self):
        return len(self.parentless)
    
def category_import(DB):
    print("Starting category import for "+DB)
    data = Feeds.objects.using(DB).filter(usage='c')
    for f in data:
        root_data = xml_from_url(f.feed_link).getroot()
        lists = category_lists()
        parent, created = Category.objects.using(DB).get_or_create(parent_id=None, source_id=f.id, defaults={'name': f.name, 'original_id':None})
        if not created:
            lists.add_not_created(parent)
        else:
            lists.add_created(parent)
        for category in root_data:
            if int(id := category.find('PARENT_ID').text) > 1:
                try:
                    parent = Category.objects.using(DB).get(original_id=id, source_id=f.id)
                except:
                    lists.add_parentless(category)
                    continue
            obj, created = Category.objects.using(DB).get_or_create(original_id=category.find('ID').text, source_id=f.id, defaults={ 'name': category.find('TITLE').text, 'parent': parent, 'original_parent': parent})
            if not created:
                lists.add_not_created(obj)
            else:
                lists.add_created(obj)
        if lists.parentless_len() > 0:
            sort_parentless(DB, lists, f)
        Category.objects.using(DB).bulk_update(lists.update_category_list, ['name', 'parent'])
        Category.objects.using(DB).exclude(Q(id__in=lists.update_ids) | Q(id__in=lists.created_ids) | (~Q(source_id=f.id))).delete()
    print("Category import finished for "+DB)

def sort_parentless(DB, lists:category_lists, f):
    for p in lists.parentless:
        try:
            parent = Category.objects.using(DB).get(original_id=p.find('PARENT_ID').text, source_id=f.id)
        except:
            continue
        obj, created = Category.objects.using(DB).get_or_create(original_id=p.find('ID').text, source_id=f.id, defaults={ 'name': p.find('TITLE').text, 'parent': parent})
        if not created:
            lists.add_not_created(obj)
        else:
            lists.add_created(obj)