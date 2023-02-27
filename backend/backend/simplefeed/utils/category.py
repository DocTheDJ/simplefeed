from ..models import Category, Common
from .product import ProductUtils
from django.db.models import Q

class CategoryUtil():
    class node():
        def __init__(self, cat, level, children=[]) -> None:
            self.name = cat.name
            self.children = children
            self.id = cat.id
            self.level = level
            self.supplier = cat.source
            self.paired = []
            self.path = ""
            try:
                self.rule = cat.action
            except:
                pass
        
        def has_childs(self) -> bool:
            return len(self.children)
        
        def all_childs(self) -> list:
            return self.children
        
        def child_count(self) -> int:
            return len(self.children)
        
        def get_range(self) -> range:
            return range(0, self.level)
        
        def add_path(self, parent_path):
            self.path += ((parent_path + " > ") if parent_path != "" else parent_path) + self.name
        
        def get_paired(self, cat):
            self.paired = cat.pair_onto.all()
        
        class root_node():
            def __init__(self, name, id, supplier) -> None:
                self.name = name
                self.id = id
                self.source_id = supplier
        
        class list_paths():
            def __init__(self, id, path, supplier) -> None:
                self.id = id
                self.path = path
                self.supplier = supplier
            
            def is_in_children(self, DB, common_id) -> None:
                children = Category.objects.using(DB).filter(parent_id=self.id)
                cats = list(Common.objects.using(DB).get(id=common_id).categories.filter(id__in=children).values_list('id', flat=True))
                self.buttonTrue = True if cats == [] else False


    class Category_node():
        def __init__(self, id) -> None:
            self.id = id
            self.path = ""

        def mod_path(self, mod):
            self.path += mod

    
    def path_to_root_category(self, category_id, DB):
        query = '''
        WITH RECURSIVE parents AS (
            SELECT products_category.*, 0 AS relative_depth
            FROM products_category
            WHERE id = %s

            UNION ALL

            SELECT products_category.*, parents.relative_depth - 1
            FROM products_category,parents
            WHERE products_category.id = parents.parent_id
        )
        SELECT id, name, parent_id, relative_depth
        FROM parents
        ORDER BY relative_depth;
        '''
        return Category.objects.using(DB).raw(query, [category_id])

    def create_category_tree(self, DB, root, source:list, level, list_view:list=[], common_id=None, parent_path="")->list:
        if level <= 0:
            categories = Category.objects.using(DB).filter(parent=root, source_id__in=source)
            if None in source:
                categories = categories.union(Category.objects.using(DB).filter(parent=root, source_id=None))
        else:
            categories = Category.objects.using(DB).filter(parent=root)
        output = []
        for child in categories:
            n = self.node(child, level)
            if level == 0:
                n.path = ''
            else:
                n.add_path(parent_path)
                tmp = self.node.list_paths(n.id, n.path, child.source_id)
                if common_id != None:
                    tmp.is_in_children(DB, common_id)
                list_view.append(tmp)
            n.get_paired(child)
            n.children = self.create_category_tree(DB, child, source, level+1, list_view, common_id, n.path)
            output.append(n)
        return output

    def add_category_use(self, DB, category_id, common, watch_out_for=None):
        if type(category_id) != Category:
            try:
                category = Category.objects.using(DB).get(id=category_id)
            except:
                return
        else:
            category = category_id
        common.categories.add(category.id)
        try:
            if category.action.id != watch_out_for.id:
                ProductUtils.switch_visibility(DB, common, "approved", category)
        except:
            pass
        self.add_category_use(DB, category.parent_id, common, watch_out_for)

    def remove_category_use(self, DB, category_id, common, removed:list):
        try:
            category = Category.objects.using(DB).get(id=category_id)
        except:
            return
        if common.categories.filter(parent_id=category_id).count() == 0:
            common.categories.remove(category)
            removed.append("."+str(category.id))
        else:
            return
        self.remove_category_use(DB, category.parent_id, common, removed)

    def print_categories(self, DB, common, delim:str, filter=Q()):
        output = []
        string = ""
        for c in common.categories.filter(filter):
            path = self.path_to_root_category(c.id, DB)
            for i, p in enumerate(path):
                if i == 0:
                    continue
                if p.relative_depth == 0:
                    string += p.name
                    output.append(string)
                    string = ""
                else:
                    string += (p.name + delim)
        return output

    def print_all_cats(self, DB, supplier):
        output = []
        output.append(self.Category_node(None))
        for c in Category.objects.using(DB).filter(source_id=supplier):
            path = self.path_to_root_category(c.id, DB)
            category = self.Category_node(c.id)
            for p in path:
                if p.relative_depth == 0:
                    category.mod_path(p.name)
                    output.append(category)
                else:
                    category.mod_path((p.name + " > "))
        return output

    def created_supplier_category(DB, category_string:str, delim:str, supplier_id:int, action) -> Category:
        if delim != "":
            parsed_categories = category_string.split(delim)
        else:
            parsed_categories = category_string
        last_parent = Category.objects.using(DB).get(original_parent_id=None, source_id=supplier_id)
        for p in parsed_categories:
            last_parent, created = Category.objects.using(DB).get_or_create(name=p, source_id=supplier_id, original_parent=last_parent, defaults={'parent': last_parent, 'action': action})
        return last_parent

    def remove_paired_category(self, common, cat):
        if common.categories.filter(parent=cat):
            return
        else:
            common.categories.remove(cat)
            self.remove_paired_category(common, cat.parent)

    def from_view_unpair(self, DB, category_pick, victim):
        victim_cat = Category.objects.using(DB).get(id=victim)
        victim_cat.pair_onto.remove(Category.objects.using(DB).get(id=category_pick))
        for i in Common.objects.using(DB).filter(categories__id__icontains=category_pick):
            self.remove_paired_category(i, victim_cat)

    def create_default_category(DB, source, action):
        Category.objects.using(DB).get_or_create(original_parent=None, source_id=source.id, defaults={'name': source.name, 'parent': None, 'action': action})
    
    
    def from_view_pair(self, victim, this, pairings:list):
        pairings.append(this['id'])
        if this['getParent'] == None:
            victim.get().pair_onto.add(*pairings)
        else:
            self.from_view_pair(victim, this['getParent'], pairings)