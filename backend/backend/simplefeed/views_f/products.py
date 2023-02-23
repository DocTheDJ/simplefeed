from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import ProductSerializer, ProductDetailSerializer
from ..models import Common
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated
import math

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listProducts(request, pagenum):
    if DB := create_dbconnect(request.user.username):
        data = Common.objects.using(DB).all()
        count = data.count()
        data = data[(int(pagenum)-1)*20:int(pagenum)*20]
        serializer = ProductSerializer(data, many=True)
        return Response({'data': serializer.data, 'count': list(range(1, math.ceil(count / 20) + 1))})
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def approve_product(request, id, approve):
    if DB := create_dbconnect(request.user.username):
        if int(approve) == 1:
            approve = 0
        else:
            approve = 1
        product = Common.objects.using(DB).filter(id=id)
        product.update(approved=approve)
        product.get().get_variants().exclude(visible='2').update(visible=approve)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detailProduct(request, id):
    if DB := create_dbconnect(request):
        data = Common.objects.using(DB).filter(id=id)
        ser = ProductDetailSerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')