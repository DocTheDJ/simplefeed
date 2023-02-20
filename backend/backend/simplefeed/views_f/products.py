from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import ProductSerializer
from ..models import Common
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listProducts(request):
    if DB := create_dbconnect(request.user.username):
        data = Common.objects.using(DB).all()
        serializer = ProductSerializer(data, many=True)
        return Response(serializer.data)
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

