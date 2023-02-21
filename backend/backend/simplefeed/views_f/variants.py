from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import VariantWithParamsSerializer, VariantSerializer
from ..models import Variant
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_variants(request, id):
    if DB := create_dbconnect(request.user.username):
        vars = Variant.objects.using(DB).filter(product=id)
        ser = VariantWithParamsSerializer(vars, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateVariant(request, id):
    if DB := create_dbconnect(request.user.username):
        variant = Variant.objects.using(DB).filter(id=id)
        input = {
            'vat': request.data['vat'],
            'price': request.data['price'],
            'rec_price': request.data['rec_price'],
            'pur_price': request.data['pur_price']
        }
        variant.update(**input)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)