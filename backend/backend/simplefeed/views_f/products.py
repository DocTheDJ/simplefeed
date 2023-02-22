from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import ProductSerializer
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
        return Response('no DB connection')

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
        response = 'no DB'
    return Response(response)

