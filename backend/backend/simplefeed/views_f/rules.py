from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models import Rules
from ..serializers import RuleSerializer
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRules(request):
    if DB := create_dbconnect(request):
        data = Rules.objects.using(DB).all()
        ser = RuleSerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')