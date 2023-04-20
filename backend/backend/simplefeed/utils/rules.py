from ..models import Variant, Rules
from django.db.models import F

class RuleUtils:

    def parser(self, DB, dictionary:dict, name):
        string = f"{dictionary['type']}|{dictionary['from']}|{dictionary['to']}|{dictionary['scope']}|{dictionary['value']}|{dictionary['operation']}"
        Rules.objects.using(DB).get_or_create(name=name, defaults={'action':string, 'css_class': None})
        return string
    