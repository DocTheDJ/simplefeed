from xml.etree.ElementTree import Element, fromstring
from queue import LifoQueue

class ImportUtils:
    class Tag:
        def __init__(self, original, new, parent):
            self.original = original
            self.new = new
            self.parent = parent

    def find_in_list(self, list:list, target:Tag):
        for elem in list:
            if elem.original == target.original and elem.new == target.new:
                if elem.parent == target.parent:
                    return
        list.append(target)

    def create_dictionary(self, node:Element, parent_stack:LifoQueue, dictionary:list):
        immediate_parent = self.LifoPeek(parent_stack)
        self.find_in_list(dictionary, self.Tag(node.tag, node.get("NEW"), immediate_parent))
        parent_stack.put(node.tag)
        for a in list(node):
            self.create_dictionary(a, parent_stack, dictionary)
        parent_stack.get()

    def find_new_name(self, list:list, target:Tag)->Tag:
        for elem in list:
            if elem.original == target.original or elem.new == target.new:
                if elem.parent == target.parent:
                    return elem
        return None

    def out_find_new_name(self, dict:list, parent_stack:LifoQueue, new_name):
        return self.find_new_name(dict, self.Tag(None, new_name, self.LifoPeek(parent_stack))).original

    def LifoPeek(self, stack:LifoQueue):
        if not stack.empty():
            tmp = stack.get()
            stack.put(tmp)
            return tmp

    def get_text(self, dict:list, parent_stack:LifoQueue, tag:str, node:Element):
        if node != None:
            new_name = self.find_new_name(dict, self.Tag(None, tag, self.LifoPeek(parent_stack)))
            if(new_name != None):
                try:
                    return node.find(new_name.original).text
                except:
                    return None
        return None
    
    def look_for_flaws(self, root:Element, child:str, subchild:str, original:str, target:str, replacement:str):
        try:
            node = self.try_find_from(root, child, subchild, original)
        except:
            return None
        if node == None:
            new_target = self.rreplace(original, target, replacement, 1)
            if new_target == original:
                return None
            node = self.look_for_flaws(root, child, subchild, new_target, target, replacement)
        return node
            
    def rreplace(self, s, old, new, occurrence):
        li = s.rsplit(old, occurrence)
        return new.join(li)    

    def try_find_from(self, root:Element, child:str, subchild:str, original:str):
        try:
            return root.find(""+child+"["+subchild+"='"+original+"']")
        except:
            return None
