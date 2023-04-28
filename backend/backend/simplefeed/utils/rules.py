from ..models import Variant, Rules
from django.db.models import F, ExpressionWrapper
import operator


class RuleUtils:

    ops = {
        "+": operator.add,
        "-": operator.sub,
        "*": operator.mul,
    }  

    def parser(self, rule: str):
        ruleList = rule.split('|')
        op_func = self.ops[ruleList[0]]
        return ExpressionWrapper(op_func(self.unitDec(ruleList[2], ruleList[1]), F(ruleList[3])))
    
    def unitDec(self, unit, value):
        if unit == 1:
            return value / 100      #   %
        elif unit == 2:
            return value * 1.21     #   kc with tax
        else:
            return value            #   kc without tax