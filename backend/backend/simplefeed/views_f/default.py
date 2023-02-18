from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from ..utils.db_access import create_user_access, create_dbconnect
from rest_framework.permissions import IsAuthenticated
from ..utils.create_default import CreateUtil
from ..modelDBUsage import crossroads
from multiprocessing import Process

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
        CreateUtil.add_all_feeds(DB)
        response = "OK"
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
        response = 'started'
    else:
        response = 'no DB'
    return Response(response)