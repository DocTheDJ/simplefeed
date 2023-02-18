from ..models import Modifications

class VariantUtils:
    def get_update_dict(request, var:bool, ids):
        output = {}
        if var:
            params = []
            if request.POST['price_input'] != "":
                output['price'] = request.POST['price_input']
                
            if request.POST['pur_price_input'] != "":
                output['pur_price'] = request.POST['pur_price_input']
                
            if request.POST['rec_price_input'] != "":
                output['rec_price'] = request.POST['rec_price_input']
                
            if request.POST['vat_input'] != "":
                output['vat'] = request.POST['vat_input']
            
            for id in ids:
                if request.POST['param_name_'+str(id.id)] != "" or request.POST['param_value_'+str(id.id)] != "":
                    params.append({'name' : request.POST['param_name_'+str(id.id)],
                                'value' : request.POST['param_value_'+str(id.id)],
                                'id': id.id})
            return output, params
        else:
            return output

    def compare(orig, new, place, expected_type):
        try:
            if getattr(orig.get(), place) == expected_type(new[place]):
                new.pop(place)
        except Exception as e:
            print(e)
            pass

    def cmp_params(orig, props, params, place, target):
        try:
            param = props.get(name=params[place]['name'], value=params[place]['value'])
        except:
            try:
                new = props.create(name=params[place]['name'], value=params[place]['value'])
                new.save()
                param = new.id
            except:
                pass
        try:
            if orig[0]['param'+str(place+1)+'_id'] != param['id']:
                target['param'+str(place+1)+'_id'] = param['id']
        except:
            pass

    def get_or_create_mod(DB, name):
        try:
            return Modifications.objects.using(DB).get(name=name)
        except:
            return Modifications.objects.using(DB).create(name=name)

    def get_mod(self, DB, keys, mods):
        for k in keys:
            if k == 'vat':
                mods.add(self.get_or_create_mod(DB, "vat"))            
            if k == 'price':
                mods.add(self.get_or_create_mod(DB, "price"))
            if k == 'pur_price':
                mods.add(self.get_or_create_mod(DB, "pur_price"))
            if k == 'rec_price':
                mods.add(self.get_or_create_mod(DB, "rec_price"))
