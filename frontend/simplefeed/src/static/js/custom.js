(function ($) {
    let serializeFormData = function ($form) {
        let data = {};
    
        $form.serializeArray().map(function (input) {
            data[input.name] = input.value;
        });
    
        return data;
    }
    // Insert Category
    let toggleInsertCategoryModal = function () {
        $('#insertCategory').modal('toggle');
    }
    
    let submitInsertCategoryForm = function (event) {
        event.preventDefault();
    
        let data = serializeFormData($(this));
        
        $.post('/addcategory/', data).done(function (response) {
            var newElement = $('<li class="cat-list list-group-item d-flex justify-content-between align-items-center" data-node-id="'+response+'"><div class="cat_name d-flex align-items-center"><a data-toggle="collapse" href="#sub_'+response+'"><a class="js-cat-name" style="color: #282f3a;" data-target="name" >'+data.name+'</a><span class="m-0 pl-2" style="color: lightgray;"><strong>(0)</strong></span></div></li>')
            if (data.parent != 'parent') {
                $('ul#sub_'+data.parent).append(newElement)
            }else{
                $('ul[data-target="roots"]').append(newElement)
            }
            
            $("#alert-true").show();
            $("#alert-true").fadeOut(4000);
            $("#alert-true p").text("Úspěšně pridano");
        });
    }

    // Edit Category
    let toggleEditCategoryModal = function () {
        var id = $(this).data('id');
        var name = $(this).data('name');
    
        $('#editCategory input[name="name"]').val(name);
        $('#editCategory input[name="id"]').val(id);
        $('#editCategory').modal('toggle');
    }
    
    let submitEditCategoryForm = function (event) {
        event.preventDefault();
    
        let data = serializeFormData($(this));
    
        $.post('/update_cat/', data).done(function (response) {
            $nodeElement = $('li[data-node-id="' + data.id + '"]');
            $nodeElement.find('.js-cat-name').html(data.name);
            $nodeElement.find('.js-cat-edit-modal').data('name', data.name);

            $("#alert-true").show();
            $("#alert-true").fadeOut(4000);
            $("#alert-true p").text("Úspěšně upraveno");
        });
    }

    // Delete Category
    let toggleDeleteCategoryModal = function () {
        var id = $(this).data('id');
        var name = $(this).data('name');

        $('#deleteCategory .js-category-name').html(name);
        $('#deleteCategory input[name="id"]').val(id);
        $('#deleteCategory').modal('toggle');
    }
    
    let submitDeleteCategoryForm = function (event) {
        event.preventDefault();
    
        let data = serializeFormData($(this));
    
        $.post('/delete_cat/', data).done(function (response) {
            $nodeElement = $('li[data-node-id="' + data.id + '"]').remove();
    
            $("#alert-true").show();
            $("#alert-true").fadeOut(4000);
            $("#alert-true p").text("Úspěšně upraveno");
        });
    }

    // Move Category
    let toggleMoveCategoryModal = function () {
        var id = $(this).data('id');
        var name = $(this).data('name');

        $('#moveCategory .js-category-name').html(name);
        $('#moveCategory input[name="id"]').val(id);
        $('#moveCategory').modal('toggle');
    }
    
    let submitMoveCategoryForm = function (event) {
        // event.preventDefault();
    
        let data = serializeFormData($(this));
    
        $.post('/move_cat/', data).done(function (response) {
            $nodeElement = $('li[data-node-id="' + data.id + '"]').remove();
    
            $("#alert-true").show();
            $("#alert-true").fadeOut(4000);
            $("#alert-true p").text("Úspěšně upraveno");
        });
    }


    // Products Filter
    let productfilters = function (event) {
        event.preventDefault();
        var url = new URL(document.location);
        let data = serializeFormData($(this));
        if ((category = $(this).data('category-id')) != null){
            url.searchParams.set("category_filter", category);
        }
        if (data.supplier != '0' && data.supplier != null){
            url.searchParams.set("supplier", data.supplier);
        }
        if (data.manufacturer != '0' && data.manufacturer != null){
            url.searchParams.set("manufacturer", data.manufacturer);
        }
        if (data.availability != '0' && data.availability != null){
            url.searchParams.set("availability", data.availability);
        }
        url.searchParams.set("page", 1);
        document.location = url.href;
    }

    let thereBePage = function (event) {
        event.preventDefault();
        var url = new URL(document.location);
        console.log(url);
        if ((page = $(this).data('pagination-id')) != null){
            url.searchParams.set("page", page);
        }
        document.location = url.href;
    }

    let CatSelect = function(){
        $('.js-cat-pairing-options').appendTo('select[data-pairing-id="'+ $(this).data('pairing-id') +'"]');
        // $('.js-cat-pairing-options').appendTo('.js-cat-pairing-select');
    }

    let printPath = function(event) {
        event.preventDefault();
        let data = serializeFormData($(this));
        data.victim = $(this).data('pairing-id')
        $("#category_path_"+data.category_pick).appendTo('select[data-pairing-id="'+ $(this).data('pairing-id') +'"]')
        
        $.post('/pair_cat/', data).done(function (response) {

            $("#alert-true").show();
            $("#alert-true").fadeOut(4000);
            $("#alert-true p").text("Úspěšně upraveno");
        });
    }

    let rootPath = function(event){
        event.preventDefault();
        let data = serializeFormData($(this));
        data.victim = $('select').data('pairing-id')
        $("#category_path_"+data.category_pick).appendTo('select[data-pairing-id="'+ $('select').data('pairing-id') +'"]')
        $.post('/pair_cat/', data).done(function (response) {

            $("#alert-true").show();
            $("#alert-true").fadeOut(4000);
            $("#alert-true p").text("Úspěšně upraveno");
        });
    }


    let unpairCat = function(event){
        event.preventDefault();
        let data = serializeFormData($(this).closest("form"))
        data.victim = $(this).data('unpair-id')
        data.category_pick = $(this).closest("form").data('unpair-id')
        $.post('/unpair_cat/', data, function(response){
            $('input[data-unpair-id="'+data.victim+'"]').remove()
        });
    }

    let rulePicker = function(event){
        event.preventDefault()
        let data = serializeFormData($(this).closest("form"))
        data.rule_change = $(this).data('pick-rule')
        data.victim = $(this).data('victim')
        $('button#dropdownMenuButton'+data.victim).removeClass("btn-"+$(this).data('original-class')).addClass("btn-"+$(this).data('new-class')).html($(this).data('pick-rule-name'))
        console.log($(this).data('action'))
        if ($(this).data('action').startsWith("cat_cat_")){
            $('form[data-pairing-id="'+$(this).data('victim')+'"]').css('visibility', 'visible');
        }else{
            $('form[data-pairing-id="'+$(this).data('victim')+'"]').css('visibility', 'hidden');
        }
        $.post('/pick_cat_rule/', data);
    }

    let removeCatFromComm = function(event){
        event.preventDefault()
        let data = serializeFormData($(this).closest("form"))
        data.victim = $(this).data('remove-cat-id')
        data.comm = $(this).data('comm-victim')
        $.post('/remove_cat_from_comm/', data).done(function (response){
            $.each(response.split(".").filter(function(v){return v!==''}), function(index, id){
                $('tr#cat_row_'+id).remove()
            });
        });
    }

    let updateGen = function(event){
        event.preventDefault();
        form = $(document).find('form[data-form-name="'+$(this).data('name')+'"]')
        let data = serializeFormData(form)
        data.victim = $(this).data('name')
        data.way = $(this).data('way')
        $.post('/update_gen_name/', data)
    }

    let discontinue = function(event){
        event.preventDefault();
        let data = serializeFormData($(document).find('form[data-form-name="'+$(this).data('name')+'"]'))
        data.victim = $(this).data('name')
        data.way = $(this).data('way')
        data.activate = $(this).data('data')
        $.post('/update_gen_name/', data)
    }

    $(document).ready(function() {
        // Insert category
        $('.js-cat-insert-modal').click(toggleInsertCategoryModal);
        $('.js-cat-insert-form').submit(submitInsertCategoryForm);

        // Edit category
        $('.js-cat-edit-modal').click(toggleEditCategoryModal);
        $('.js-cat-edit-form').submit(submitEditCategoryForm);

        // Delete category
        $('.js-cat-delete-modal').click(toggleDeleteCategoryModal);
        $('.js-cat-delete-form').submit(submitDeleteCategoryForm);

        // Move category
        $('.js-cat-move-modal').click(toggleMoveCategoryModal);
        $('.js-cat-move-form').submit(submitMoveCategoryForm);

        // Product Filters
        $('.js-filter').change(productfilters);
        $('.js-filter-button').click(productfilters);

        //pagination
        $('.js-pagination-button').click(thereBePage);

        //cat-select
        $('.js-cat-pairing-select').click(CatSelect);
        $('.js-cat-root-pair').change(rootPath);
        $('.js-cat-nodes-pair').change(printPath);

        // $('.js-cat-unpair').submit(unpairCat)
        $('.js-cat-unpair-input').click(unpairCat)

        $('.js-rule-pick').click(rulePicker)

        $('.js-remove-cat-from-comm').click(removeCatFromComm)

        $('.js-send-update-param').click(updateGen)
        $('.js-send-update-man').click(updateGen)

        $('.js-send-update-availability').click(updateGen)
        $('.js-discontinue-availability').click(discontinue)
    });

    
})(jQuery);


