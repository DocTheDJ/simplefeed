from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models import Availabilities, Feeds
from ..serializers import FeedAvaSeri
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated
from django.db.models import F

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSupplierAvailab(request):
    if DB := create_dbconnect(request):
        feeds = Feeds.objects.using(DB).filter(id__in=Availabilities.objects.using(DB).values_list('supplier_id', flat=True).distinct())
        ser = FeedAvaSeri(feeds, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def setBuyable(request, id, b):
    if DB := create_dbconnect(request):
        Availabilities.objects.using(DB).filter(id=id).update(buyable=b)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setNames(request, id):
    if DB := create_dbconnect(request):
        Availabilities.objects.using(DB).filter(id=id).update(name=request.data['name'], arrives_in=request.data['arrives_in'])
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def setActive(request, id, a):
    if DB := create_dbconnect(request):
        Availabilities.objects.using(DB).filter(id=id).update(active=a)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)
