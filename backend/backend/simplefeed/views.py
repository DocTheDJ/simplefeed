from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import render
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils.db_access import create_user_access
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
