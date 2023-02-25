from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import UserSerializer, MyTokenObtainPairSerializer, VariantSerializer, VariantUpdateSerializer, FeedSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from ..utils.db_access import create_user_access, create_dbconnect
from rest_framework.permissions import IsAuthenticated
from ..utils.create_default import CreateUtil
from ..modelDBUsage import crossroads
from multiprocessing import Process
from ..models import Variant, Variant_Update, Common, Feeds
from django.core.management import call_command

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(serializer.data.get('password'))
        user.save()
        create_user_access(serializer.data.get('username'))
        response = 'User is registered'
    else:
        print(serializer.errors)
        response = 'User is not registered'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def index(request):
    if DB := create_dbconnect(request.user.username):
        updated = Variant_Update.objects.using(DB).all()[:10]
        last_created = Variant.objects.using(DB).all().order_by('-id')[:10:-1]
        if updated.count() == 0:
            updated = VariantSerializer(last_created, many=True)
        else:
            updated = VariantUpdateSerializer(updated, many=True)
        response = {
            'suppliers': FeedSerializer(Feeds.objects.using(DB).filter(usage='m'), many=True).data,
            'total_products': Common.objects.using(DB).count(),
            'total_variants': Variant.objects.using(DB).count(),
            'active_products': Common.objects.using(DB).filter(approved=True).count(),
            'active_variants': Variant.objects.using(DB).filter(visible='1').count(),
            'inactive_products': Common.objects.using(DB).filter(approved=False).count(),
            'inactive_variants': Variant.objects.using(DB).filter(visible='0').count(),
            'faulty_variants': Variant.objects.using(DB).filter(visible='2').count(),
            'last_updated': updated.data,
            'last_created': VariantSerializer(last_created, many=True).data,
        }
        # response = "OK"
    else:
        response = "NOT OK"
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def run(request):
    if DB := create_dbconnect(request.user.username):
        t = Process(target=crossroads, args=(DB,))
        t.name = 'test'
        t.start()
        # CreateUtil().add_category_rules(DB)
        response = 'started'
    else:
        response = 'no DB'
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def migrate(request):
    if DB := create_dbconnect(request.user.username):
        call_command('migrate', 'simplefeed', database=DB)
        response = 'OK'
    else:
        response = 'noDB'
    return Response(response)