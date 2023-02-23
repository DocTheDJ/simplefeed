from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import VariantWithParamsSerializer, VariantUltimateSerializer
from ..models import Variant
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated
import math


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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def variantList(request, pagenum):
    if DB := create_dbconnect(request.user.username):
        data = Variant.objects.using(DB).prefetch_related('product').all()
        count = data.count()
        data = data[(int(pagenum)-1)*20:int(pagenum)*20]
        # ser = VariantSerializer(data, many=True)
        ser = VariantWithParamsSerializer(data, many=True)
        return Response({'data': ser.data, 'count': list(range(1, math.ceil(count / 20) + 1))})
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def variantDetail(request, id):
    if DB := create_dbconnect(request):
        data = Variant.objects.using(DB).filter(id=id)
        ser = VariantUltimateSerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def setVisibility(request, id, new):
    if DB := create_dbconnect(request):
        data = Variant.objects.using(DB).filter(id=id)
        data.update(visible=new)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)