from rest_framework import serializers
from django.contrib.auth.models import User
from . import models
from rest_framework_recursive.fields import RecursiveField

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super().get_token(user)

		token['username'] = user.username

		return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rules
        fields = '__all__'

class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Feeds
        fields = '__all__'

class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Manufacturers
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

class VariantParamSerializer(serializers.ModelSerializer):
    param = ParamSerializer()
    var_param = serializers.ReadOnlyField()
    class Meta:
        model = models.VariantParam
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Image
        fields = '__all__'

class VariantSerializer(serializers.ModelSerializer):
    image_ref = ImageSerializer()
    profit = serializers.ReadOnlyField()
    class Meta:
        model = models.Variant
        fields = '__all__'

class ProductDefaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Common
        fields = '__all__'

class VariantWithParamsSerializer(serializers.ModelSerializer):
    image_ref = ImageSerializer()
    params = VariantParamSerializer(many=True, source='variants_params')
    decide_main = serializers.ReadOnlyField()
    get_supplier = serializers.ReadOnlyField()
    profit = serializers.ReadOnlyField()
    class Meta:
        model = models.Variant()
        fields = '__all__'

class VariantUltimateSerializer(serializers.ModelSerializer):
    variants = VariantWithParamsSerializer(many=True)
    product = ProductDefaultSerializer(many=True)
    get_supplier = serializers.ReadOnlyField()
    decide_main = serializers.ReadOnlyField()
    profit = serializers.ReadOnlyField()
    manufacturer = serializers.ReadOnlyField()
    image_ref = ImageSerializer()
    params = VariantParamSerializer(many=True, source='variants_params')
    class Meta:
        model = models.Variant
        fields = '__all__'

class VariantUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Variant_Update
        fields = '__all__'

class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Manufacturers
        fields = '__all__'

class CategoryPathToMasterSerializer(serializers.ModelSerializer):
    getParent = RecursiveField()
    class Meta:
        model = models.Category
        fields = '__all__'

class ProductDetailSerializer(serializers.ModelSerializer):
    variants = VariantWithParamsSerializer(many=True)
    supplier = FeedSerializer()
    price_common = VariantWithParamsSerializer()
    manufacturer = ManufacturerSerializer()
    childless_cat = CategoryPathToMasterSerializer(many=True)
    class Meta:
        model = models.Common
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    price_common = VariantSerializer()
    supplier = FeedSerializer()
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = models.Common
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.ListField(child=RecursiveField())
    class Meta:
        model = models.Category
        fields = '__all__'

class CategoryParentSerializer(serializers.ModelSerializer):
    children = CategorySerializer(many=True)
    source = FeedSerializer()
    class Meta:
        model = models.Category
        fields = '__all__'

class CategoryPairedOntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ('name')

class CategoryPairingSerializer(serializers.ModelSerializer):
    children = serializers.ListField(child=RecursiveField())
    # pair_onto = CategoryPairedOntoSerializer(many=True)
    childless = CategoryPathToMasterSerializer(many=True)
    action = RuleSerializer()
    class Meta:
        model = models.Category
        fields = '__all__'

class CategoryPairingParentSerializer(serializers.ModelSerializer):
    children = CategoryPairingSerializer(many=True)
    source = FeedSerializer()
    class Meta:
        model = models.Category
        fields = '__all__'

class AvailabilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Availabilities
        fields = '__all__'

class FeedAvaSeri(serializers.ModelSerializer):
    availabilities = AvailabilitiesSerializer(many=True)
    class Meta:
        model = models.Feeds
        fields = '__all__'