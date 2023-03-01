from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models import Category, Feeds, Common
from ..serializers import (
    CategorySerializer,
    CategoryParentSerializer,
    CategoryPairingParentSerializer,
    CategoryPathToMasterSerializer
)
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated
from multiprocessing import Process
from ..modelDBUsage import category_import
from ..utils.category import CategoryUtil

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTree(request):
    if DB := create_dbconnect(request):
        data = Category.objects.using(DB).filter(original_id=None)
        ser = CategorySerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pullCats(request):
    if DB := create_dbconnect(request):
        t = Process(target=category_import, args=(DB,))
        t.name = 'category_pull'
        t.start()
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateCat(request, id):
    if DB := create_dbconnect(request):
        data = Category.objects.using(DB).filter(id=id)
        data.update(name=request.data['name'])
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def deleteCat(request, id):
    if DB := create_dbconnect(request):
        Category.objects.using(DB).get(id=id).delete()
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTreeWithout(request, id):
    if DB := create_dbconnect(request):
        data = Category.objects.using(DB).all().exclude(id=id)
        ser = CategorySerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def moveCat(request, id, new):
    if DB := create_dbconnect(request):
        Category.objects.using(DB).filter(id=id).update(parent=new)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSupplierCats(request):
    if DB := create_dbconnect(request):
        category_feed = Feeds.objects.using(DB).filter(usage='c')
        data = Category.objects.using(DB).filter(parent=None).exclude(source=category_feed[0].id)
        ser = CategoryParentSerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBySource(request, id):
    if DB := create_dbconnect(request):
        data = Category.objects.using(DB).filter(parent=None, source=id)
        ser = CategorySerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPairingCategories(request):
    if DB := create_dbconnect(request):
        category_feed = Feeds.objects.using(DB).filter(usage='c')
        data = Category.objects.using(DB).filter(parent=None).exclude(source=category_feed[0].id)
        ser = CategoryPairingParentSerializer(data, many=True)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pairCategories(request, whom, to):
    if DB := create_dbconnect(request):
        victim = Category.objects.using(DB).filter(id=whom)
        target = Category.objects.using(DB).filter(id=to)
        CategoryUtil().from_view_unpair(victim)
        ser = CategoryPathToMasterSerializer(target, many=True)
        new_cats = []
        CategoryUtil().from_view_pair(victim, ser.data[0], new_cats)
        Common.objects.using(DB).filter(categories__id__exact=whom).categories.add(*new_cats)
        return Response(ser.data)
    else:
        return Response('noDB')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unpairCategories(request, whom):
    if DB := create_dbconnect(request):
        victim = Category.objects.using(DB).filter(id=whom)
        CategoryUtil().from_view_unpair(victim)
        return getPairingCategories(request)
    else:
        response = 'noDB'
        return Response(response)