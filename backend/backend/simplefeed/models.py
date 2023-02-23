from datetime import datetime
from django.db import models

class Feeds(models.Model):
    feed_link = models.TextField()
    usage = models.CharField(max_length=1)
    name = models.CharField(max_length=128, null=True)
    master_feed = models.ForeignKey("self", on_delete=models.CASCADE, null=True)
    source = models.CharField(max_length=1, null=True)
    updated_on = models.DateTimeField(null=True)
    
    def count_products(self):
        self.total_count = self.supplied_product.count()
    
    def get_active_count(self):
        self.active_count = self.supplied_product.filter(approved=True).count()
        self.active_percentage = self.active_count / self.total_count * 100
    
    def get_inactive_count(self):
        self.inactive_count = self.supplied_product.filter(approved=False).count()
        self.inactive_percentage = self.inactive_count / self.total_count * 100

class Image(models.Model):
    image = models.CharField(max_length=512, unique=True)

class Param_Names(models.Model):
    name = models.CharField(max_length=128)
    original_name = models.CharField(max_length=128)
    source = models.ForeignKey(Feeds, on_delete=models.CASCADE)

class Param_Values(models.Model):
    value = models.CharField(max_length=128)

class Param(models.Model):
    name = models.ForeignKey(Param_Names, on_delete=models.CASCADE)
    value = models.ForeignKey(Param_Values, on_delete=models.CASCADE)
    
    def custom_get_or_create(DB, name, value, source):
        name_obj, created = Param_Names.objects.using(DB).get_or_create(original_name=name, source_id=source, defaults={'name': name})
        value_obj, created = Param_Values.objects.using(DB).get_or_create(value=value)
        return Param.objects.using(DB).get_or_create(name=name_obj, value=value_obj)

class Modifications(models.Model):
    name = models.CharField(max_length=20)

class Manufacturers(models.Model):
    name = models.CharField(max_length=128, null=True)
    original_name = models.CharField(max_length=128, null=True)

class Rules(models.Model):
    name = models.CharField(max_length=128)
    action = models.CharField(max_length=64, null=True)
    css_class = models.CharField(max_length=32, null=True)

class Availabilities(models.Model):
    name = models.CharField(max_length=64)
    original_name = models.CharField(max_length=64)
    buyable = models.BooleanField()
    supplier = models.ForeignKey(Feeds, on_delete=models.CASCADE)
    arrives_in = models.CharField(max_length=16, null=True)
    active = models.BooleanField()

class Category(models.Model):
    name = models.CharField(max_length=128)
    parent = models.ForeignKey('self', null=True, related_name='child', on_delete=models.CASCADE)
    original_id = models.IntegerField(null=True)
    source = models.ForeignKey(Feeds, null=True, on_delete=models.DO_NOTHING)
    original_parent = models.ForeignKey('self', null=True, related_name='original_child', on_delete=models.DO_NOTHING)
    pair_onto = models.ManyToManyField('self')
    action = models.ForeignKey(Rules, null=True, on_delete=models.DO_NOTHING)
    
class Variant(models.Model):
    code = models.CharField(max_length=32, null=True, unique=True)
    ean = models.CharField(max_length=16, null=True)
    vat = models.DecimalField(max_digits=2, decimal_places=0, default=21, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    pur_price = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    rec_price = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    currency = models.CharField(max_length=3, null=True)
    visible = models.CharField(max_length=1, null=True)
    amount = models.IntegerField(null=True)
    free_billing = models.BooleanField(null=True)
    free_shipping = models.BooleanField(null=True)
    params = models.ManyToManyField(Param, through='VariantParam')
    name = models.CharField(max_length=128, null=True)
    availability = models.ForeignKey(Availabilities, on_delete=models.DO_NOTHING)
    mods = models.ManyToManyField(Modifications)
    images = models.ManyToManyField(Image, through="Variant_Image")
    
    def get_params(self):
        return self.params.all()
    
    def get_useable(self):
        return self.params.filter(variantparam__var_param=True)

    def get_useable_count(self):
        return self.params.filter(variantparam__var_param=True).count()
    
    def decide_useable_count(self):
        return self.params.filter(variantparam__var_param=True).count() > 0

    @property
    def get_supplier(self):
        return self.product.get().supplier.name
    
    def get_manufacturer(self):
        return self.product.get().manufacturer.name
    
    @property
    def decide_main(self):
        return self.product.get().price_common == self
    
    def get_itemgroup(self):
        return self.product.get().itemgroup_id
    
    def get_productID(self):
        return self.product.get().id
    
    def if_mods_set(self, mod, data):
        try:
            self.mods.get(name=mod)
        except:
            setattr(self, mod, data)

    def image_ref(self):
        return self.images.filter(variant_image__main=True).get()
    
    def get_images(self):
        return self.images.all() 
    
    def get_useable_params(self, name_params, param, DB):
        if str(name_params).upper().find(str(param.value.value).upper()) != -1:
            link, created = VariantParam.objects.using(DB).get_or_create(param=param, variant=self, defaults={'var_param': True})
            if not created:
                link.var_param = True
                link.save()
        else:
            link, created = VariantParam.objects.using(DB).get_or_create(param=param, variant=self, defaults={'var_param': False})
            if not created:
                link.var_param = False
                link.save()

    def get_params_from_name(self, param, product_name, DB):
        if product_name != self.name:
            new_name = str(self.name).replace(str(product_name), "")
            self.get_useable_params(new_name, param, DB)
        else:
            self.get_useable_params(self.name, param, DB)
    
    def create_last_update(self, DB):
        Variant_Update.objects.using(DB).get_or_create(variant=self, defaults={'time': datetime.now()})
    
    def get_last_update(self):
        try:
            return self.last_update.get().time
        except:
            return self.get_supplier().updated_on
    
    def mass_update(self, DB):
        Variant_Update.objects.using(DB).filter(variant=self).delete()
    
    def is_variant(self):
        return True

    @property
    def profit(self):
        try:
            return self.price - self.pur_price
        except:
            return 0
    
class VariantParam(models.Model):
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE, related_name='variants_params')
    param = models.ForeignKey(Param, on_delete=models.CASCADE, related_name='params_variants')
    var_param = models.BooleanField()

class Variant_Update(models.Model):
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE, related_name='last_update')
    time = models.DateTimeField()
    
    def is_variant(self):
        return False

class Variant_Image(models.Model):
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    main = models.BooleanField()

class Common(models.Model):
    itemgroup_id = models.CharField(max_length=32)
    name = models.CharField(max_length=128, null=True)
    short_description = models.TextField(null=True)
    description = models.TextField(null=True)
    manufacturer = models.ForeignKey(Manufacturers, on_delete=models.DO_NOTHING)
    supplier = models.ForeignKey(Feeds, on_delete=models.DO_NOTHING, null=True, related_name='supplied_product')
    price_common = models.ForeignKey(Variant, on_delete=models.DO_NOTHING, null=True, related_name='main_var')
    approved = models.BooleanField(default=True)
    categories = models.ManyToManyField(Category)
    variants = models.ManyToManyField(Variant, related_name='product')
    mods = models.ManyToManyField(Modifications)
    
    def get_variants(self):
        return self.variants.all()
    
    def __enter__(self):
        return self.variants.all()
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        return self
    
    def variants_sum(self):
        sum = 0
        try:
            for i in self.variants.all():
                sum += i.amount
        except:
            sum = None
        return sum
    
    @property
    def total_amount(self):
        q = self.variants.all().aggregate(total_amount=models.Sum('amount'))
        return q['total_amount']
    
    def count(self):
        return self.variants.count()
    
    def get_cats(self):
        tmp = []
        for i in self.categories.all():
            tmp.append(i.id)
        return tmp

    def get_manufacturer(self):
        return self.manufacturer.name
    
    def get_images(self):
        return self.variants.all()