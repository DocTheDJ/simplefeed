from rest_framework import serializers
from django.contrib.auth.models import User
from . import models

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super().get_token(user)

		# token['username'] = user.username

		return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Feeds
        fields = '__all__'

class ParamNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Param_Names
        fields = '__all__'

class ParamValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Param_Values
        fields = '__all__'

class ParamSerializer(serializers.ModelSerializer):
    name = ParamNameSerializer()
    value = ParamValueSerializer()
    
    class Meta:
        model = models.Param
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Image
        fields = '__all__'

