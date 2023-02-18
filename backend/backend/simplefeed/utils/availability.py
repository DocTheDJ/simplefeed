from ..models import Availabilities
from .importutils import ImportUtils

class AvailabilityUtils:
    def create_default_availabilities(DB, supplier_id):
        in_stock, created = Availabilities.objects.using(DB).get_or_create( original_name='Skladem',
                                                                            supplier_id=supplier_id,
                                                                            defaults={
                                                                                    'buyable': True,
                                                                                    'name': 'Skladem',
                                                                                    'active': True
                                                                            })
        out_stock, created = Availabilities.objects.using(DB).get_or_create(original_name='Vyprodano',
                                                                            supplier_id=supplier_id,
                                                                            defaults={
                                                                                'buyable': False,
                                                                                'name': 'Vyprodano',
                                                                                'active': True
                                                                            })
        return in_stock, out_stock


    def availability_setup(DB, node, supplier, default_yes, default_no, amount, dict, parent_stack):
        if node != None:
            if int(amount) <= 0:
                if (available := ImportUtils().get_text(dict, parent_stack, "AVAILABLE_ON", node)) != None:
                    availability, created_a = Availabilities.objects.using(DB).get_or_create(original_name=available,
                                                                                            supplier_id=supplier,
                                                                                            defaults={
                                                                                                'buyable': True,
                                                                                                'name': available,
                                                                                                'active': True
                                                                                            })
                else:
                    availability = default_no
            else:
                availability = default_yes
        else:
            availability = default_no
        return availability
