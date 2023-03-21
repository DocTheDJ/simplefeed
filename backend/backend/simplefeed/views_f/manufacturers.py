from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models import Manufacturers
from ..serializers import ManufacturerSerializer
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manList(request):
    if DB := create_dbconnect(request):
        return Response(ManufacturerSerializer(Manufacturers.objects.using(DB).all(), many=True).data)
    else:
        return Response('noDB')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateManName(request, id):
    if DB := create_dbconnect(request):
        updated = Manufacturers.objects.using(DB).filter(id=id).update(name=request.data['name'])
        if updated:
            response = 'OK'
        else:
            response = 'notOK'
    else:
        response = 'noDB'
    return Response(response)