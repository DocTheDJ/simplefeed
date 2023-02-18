class ProductUtils:
    def switch_visibility(obj, attr, cat):
        if str(cat.action.action).startswith("com_cat_s_"):
            new_vis = (True if str(cat.action.action).replace("com_cat_s_", "") == "1" else False)
            setattr(obj, attr, new_vis)
            obj.save()
        elif str(cat.action.action).startswith("cat_cat_s_"):
            new_vis = (True if str(cat.action.action).replace("cat_cat_s_", "") == "1" else False)
            setattr(obj, attr, new_vis)
            obj.save()
        else:
            pass
            # for c in cat.pair_onto.all():
            #     add_category_use(DB, c.id, obj.id)
        try:
            for v in obj.get_variants():
                if v.visible != "2":
                    setattr(v, "visible", ("1" if new_vis else "0"))
                    v.save()
        except Exception as e:
            print(e)
            pass
