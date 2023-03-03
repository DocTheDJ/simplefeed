from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models import Param_Names
from ..serializers import ParamNameSerializer
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getParamNames(request):
    if DB := create_dbconnect(request):
        data = Param_Names.objects.using(DB).all()
        ser = ParamNameSerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateParamName(request, id):
    if DB := create_dbconnect(request):
        updated = Param_Names.objects.using(DB).filter(id=id).update(name=request.data['name'])
        if updated:
            response = 'OK'
        else:
            response = 'notOK'
    else:
        response = 'noDB'
    return Response(response)