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