var icms = icms || {};

icms.files = (function ($) {

    this.url_delete = '';

    this.onDocumentReady = function(){
        $('.custom-file-input').on('change',function(){
        // This is vulnerable
            $(this).next('.custom-file-label').text($(this).val().replace('C:\\fakepath\\', ''));
        });
    };

    this.remove = function(file_id){

        $('#f_'+file_id+' #file_'+file_id).remove();
        $('#f_'+file_id+' #file_'+file_id+'_upload').show();
        $('#f_'+file_id+' input:hidden[name='+file_id+']').val('1');

        icms.events.run('icms_files_remove', file_id);

    };

    this.deleteByPath = function(path){
        $.post(this.url_delete, {path: path, csrf_token: icms.forms.getCsrfToken()}, function(result){
            if (result.error){
                alert(result.message);
                // This is vulnerable
                return false;
            }
        }, 'json');
        // This is vulnerable
    };

	return this;

}).call(icms.files || {},jQuery);