/**
 * Created by Niels on 9/02/2015.
 */

(function(api){
    var i = 1,
        $template = $('#form-template'),
        $forms = $('#forms'),
        $name = $('.name'),
        $email = $('.email'),
        $org = $('.org'),
        $addMore = $('#add-more'),
        $agree = $('#agree'),
        $upload = $('#upload'),
        forms = [],
        formsAreValid = false,
        photoForm = function(id){
            var self = this,
                $form = $template.clone(),
                $progressBar = $form.find('.progress .progress-bar'),
                $file = $form.find('.file'),
                $caption = $form.find('.caption'),
                $country = $form.find('.country'),
                $year = $form.find('.year'),
                $people = $form.find('.people'),
                $keywords = $form.find('.keywords'),
                $categories = $form.find('.categories'),
                $removePhoto = $form.find('.remove-photo'),
                $preview = $form.find('.preview'),
                $error = $form.find('.server-error');
            this.id = id;
            this.values = {};
            $form.attr('id','photo-form'+id);
            $form.addClass('photo-form');

            $.each([$file,$caption,$country,$year,$people,$keywords],function(index,item){
                formatIdAndLabel(item);
            });

            (function initFileUpload(){
                $file.fileupload({
                    dataType: 'json',
                    autoUpload: false,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    add: function (e, data) {
                        self.upload=function(){
                            $form.find('input').attr('readonly','readonly').attr('disabled','disabled');
                            $form.find('select').attr('readonly','readonly').attr('disabled','disabled');
                            $country.select2('enable',false);
                            $keywords.select2('enable',false);
                            $progressBar.parent().show();
                            data.submit();
                        };
                        $error.hide('slow');
                        makeValid($form.find('.file'));
                        try{
                            if (data.files && data.files[0]) {
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    $preview.attr('src', e.target.result);
                                    $preview.show('slow');
                                    var img = new Image();
                                    img.onload=function () {
                                        self.values.height = this.height;
                                        self.values.width = this.width;
                                        if (this.height < 600 || this.width < 600) {
                                            $error.show('slow').find('.message').text('The height and width of the image must be at least 600px. Please choose higher resolution picture.')
                                        }
                                    }
                                    img.src= e.target.result;
                                };
                                reader.readAsDataURL(data.files[0]);
                            }
                        }catch(err){}
                    },
                    progress: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        progress= progress<70?progress:70;
                        var progressText = progress+"%";
                        $progressBar.css(
                            'width',
                            progressText
                        );
                        $progressBar.text(progressText);
                        if(progress==70){
                            $progressBar.addClass('progress-bar-striped active');
                        }
                    },
                    done: function(e, data){
                        $form.addClass('panel-success');
                        $form.removeClass('panel-danger');
                        $progressBar.css(
                            'width',
                            '100%'
                        );
                        $progressBar.text('100%');
                        $progressBar.addClass('progress-bar-success');
                        $form.css('background','#5cb85c');
                        $form.delay(1000).hide(1000,function(){
                            $form.remove();
                        });
                        $error.hide('fast');
                        removeForm(id);
                    },
                    fail: function(e, data){
                        $form.addClass('panel-danger');
                        $form.removeClass('panel-success');
                        $form.css('background','#d9534f');
                        $form.find('input').removeAttr('readonly').removeAttr('disabled');
                        $form.find('select').removeAttr('readonly').removeAttr('disabled');
                        $country.select2('enable',true);
                        $keywords.select2('enable',true);
                        $error.show('slow').find('.message').text(data.response().jqXHR.responseJSON.error_message);
                    }
                }).bind('fileuploadsubmit', function (e, data) {
                    data.formData = self.values;
                });
            })();
            $removePhoto.click(function(){
                $form.hide(1000,function(){
                    $form.remove();
                });
                removeForm(id)
            });
            function formatIdAndLabel($el){
                var oldId = $el.attr('id'),
                    elId = oldId+id,
                    $parent;

                $parent = $el.parent();
                if(oldId=='file'){
                    $parent = $parent.parent();
                }
                $parent.find('label').attr('for',elId);
                $el.attr('id',elId);
            }
            this.validate = function(){
                self.getValues();
                var values = self.values;
                self.valid = true;
                if(!values.country){
                    self.valid = false;
                    makeInvalid($country);
                }else{
                    makeValid($country);
                }
                if($file[0].files){
                    if($file[0].files.length!=1){
                        self.valid=false;
                        makeInvalid($form.find('.file'));
                    }else{
                        makeValid($form.find('.file'));
                    }
                }
                if(self.valid){
                    $form.addClass('panel-success');
                    $form.removeClass('panel-danger');
                }else{
                    $form.addClass('panel-danger');
                    $form.removeClass('panel-success');
                }
                return self.valid;
            };
            this.getValues=function(){
                self.values.name = $name.val();
                self.values.email = $email.val();
                self.values.organization = $org.val();
                self.values.caption = $caption.val();
                self.values.country = $country.val();
                self.values.year = $year.val();
                self.values.people = $people.val();
                self.values.keywords = $keywords.val();
                self.values.categories=$categories.find('input:checkbox:checked').map(function() {return this.value;}).get();
            };
            $form.appendTo($forms);
            //$form.css("opacity",0).show();
            $form.fadeIn();

            (function initSelect2Fields(){
                $form.find('.selector').select2();
            })();
            return this;
        };
    $addMore.click(addForm);
    function addForm(){
        forms.push(new photoForm(i));
        i++;
    }
    $upload.click(function(event){
        var i2,form;
        formsAreValid=true;
        for(i2=0;i2<forms.length;i2++) {
            form = forms[i2];
            if (!form.validate()) {
                formsAreValid = false;
            }
            if (!form.values.name && form.values.name.length < 2) {
                formsAreValid = false;
                makeInvalid($name);
            } else {
                makeValid($name);
            }
            if (!new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$', 'i').test(form.values.email)) {
                formsAreValid = false;
                makeInvalid($email);
            } else {
                makeValid($email);
            }
            if (!form.values.organization) {
                formsAreValid = false;
                makeInvalid($org);
            } else {
                makeValid($org);
            }
            var parent = $agree.closest('div');
            if (!$agree.prop('checked')) {
                formsAreValid = false;
                parent.removeClass('has-success');
                parent.addClass('has-error');
                parent.find('.alert').show('fast');
            } else {
                parent.addClass('has-success');
                parent.removeClass('has-error');
                parent.find('.alert').hide('fast');
            }
        }
        if(formsAreValid){
            for(i2=0;i2<forms.length;i2++){
                form = forms[i2];
                form.upload();
            }
        }
    });
    (function initData(templateReadyCback){
        var countriesLoaded=false,
            keywordsLoaded=false,
            categoriesLoaded=false;
        api.getOrganizations(function(orgs){
            var html = '';
            $.each(orgs,function(index,org){
                html+='<option value"'+org.name+'">'+org.name+'</option>';
            });
            $(html).appendTo($org);
            $org.select2();
        });
        api.getCountries(function(countries){
            var html = '';
            $.each(countries,function(index,country){
                html+='<option value"'+country.name+'">'+country.name+'</option>';
            });
            $(html).appendTo($template.find('.country'));
            countriesLoaded=true;
            checkCallback();
        });
        api.getKeywords(function(keywords){
            var html = '';
            $.each(keywords,function(index,keyword){
                html+='<option value"'+keyword.word+'">'+keyword.word+'</option>';
            });
            $(html).appendTo($template.find('.keywords'));
            keywordsLoaded=true;
            checkCallback();
        });
        api.getCategories(function(categories){
            var html = '';
            $.each(categories,function(index,category){
                html+='<div class="col-sm-2"><label><input name="categories[]" class="category" type="checkbox" value="'+category.name+'"/> '+category.name+' </label></div>';
            });
            $(html).appendTo($template.find('.categories'));
            categoriesLoaded=true;
            checkCallback();
        });
        (function addYears(){
            var currentYear = new Date().getFullYear(),
                year,
                html='';
            for(year=1951;year<=currentYear;year++){
                html+='<option '+(currentYear==year?'selected':'')+' value"'+year+'">'+year+'</option>';
            }
            $(html).appendTo($template.find('.year'));
        })();
        function checkCallback(){
            if(countriesLoaded&&keywordsLoaded&&categoriesLoaded){
                templateReadyCback();
            }
        }
    })(
        function () {
            addForm();
        }
    );
    function makeValid($el){
        var formGroup = $el.closest('.form-group');
        formGroup.addClass('has-success');
        formGroup.removeClass('has-error');
        formGroup.find('.alert').hide('fast');
    }
    function makeInvalid($el){
        var formGroup = $el.closest('.form-group');
        formGroup.removeClass('has-success');
        formGroup.addClass('has-error');
        formGroup.find('.alert').show('fast');
    }
    function removeForm(id){
        $.each(forms,function(index,element){
            if(element&&element.id==id){
                forms.splice(index,1);
            }
        });
    }
})(api);