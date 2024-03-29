from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import ProductSerializer, ProductDetailSerializer
from ..models import Common, Variant
from ..utils.db_access import create_dbconnect
from ..utils.product import ProductUtils
from ..utils.category import CategoryUtil
from rest_framework.permissions import IsAuthenticated
import math
from urllib import parse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listProducts(request, pagenum, approvement, cat, supp, man, que):
    if DB := create_dbconnect(request.user.username):
        if int(approvement) == 3:
            data = Common.objects.using(DB).all()
        else:
            data = Common.objects.using(DB).filter(approved=int(approvement))
        t = {
            'cat': None if cat == '_' else int(cat),
            'sup': None if supp == '_' else int(supp),
            'man': None if man == '_' else int(man),
            'que': None if que == '_' else parse.unquote(que),
        }
        data = data.filter(ProductUtils.createQuery(t)).distinct()
        count = data.count()
        ids = data.values_list('id', flat=True)
        data = data[(int(pagenum)-1)*20:int(pagenum)*20]
        serializer = ProductSerializer(data, many=True)
        return Response(
            {
                'data': serializer.data,
                'count': list(range(1, math.ceil(count / 20) + 1)),
                'ids': ids
            }
        )
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def setMain(request, id, new):
    if DB := create_dbconnect(request):
        product = Common.objects.using(DB).filter(id=id)
        product.update(price_common=new)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setAllApproved(request, approvement):
    if DB := create_dbconnect(request):
        Common.objects.using(DB).filter(id__in=request.data['ids']).update(approved=int(approvement))
        Variant.objects.using(DB).filter(product__id__in=request.data['ids']).exclude(visible='2').update(visible=approvement)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def addCategory(request, target, cat):
    if DB := create_dbconnect(request):
        product = Common.objects.using(DB).get(id=target)
        CategoryUtil().add_category_use(DB, cat, product)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def removeCategory(request, target, cat):
    if DB := create_dbconnect(request):
        product = Common.objects.using(DB).get(id=target)
        CategoryUtil().remove_category_use(DB, cat, product)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)