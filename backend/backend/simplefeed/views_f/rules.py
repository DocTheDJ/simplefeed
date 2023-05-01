from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models import Rules, Common, Variant
from ..serializers import RuleSerializer
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated
from django.db.models import F
from ..utils.rules import RuleUtils

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRules(request):
    if DB := create_dbconnect(request):
        data = Rules.objects.using(DB).all()
        ser = RuleSerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createRule(request):
    if DB := create_dbconnect(request):
        data = dict(request.data)
        action = f"{data['operation']}|{data['value']}|{data['unit']}|{data['from']}|{data['type']}:{data['scope']}"
        rule, created = Rules.objects.using(DB).get_or_create(name=data['name'], defaults={'action': action})
        products = Common.objects.using(DB).filter(categories__id__exact=int(data['category'])).values_list('id', flat=True)
        # vars = []
        # for i in products:
        #     vars.extend(i.get_variants_id())
        Variant.objects.using(DB).filter(product__in=products).exclude(rulelock=True).update(rule=rule.id, original_price=F('price'), price=RuleUtils().parser(action))
        return Response('OK')
    else:
        return Response('noDB')