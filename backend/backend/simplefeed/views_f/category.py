from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models import Category
from ..serializers import CategorySerializer
from ..utils.db_access import create_dbconnect
from rest_framework.permissions import IsAuthenticated
from multiprocessing import Process
from ..modelDBUsage import category_import

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
        