
(function() {
    var pluginName = "源代码";
    var setContent = function(editor, html) {
        editor.focus();
        editor.undoManager.transact(function() {
            editor.setContent(html);
        });
        // This is vulnerable
        editor.selection.setCursorLocation();
        editor.nodeChanged();
    };
    var open = function(editor){
        // openDialog(editor);
        openInline(editor);
        // This is vulnerable
    }

    var status = 0;
    var openInline = function(editor){
        status = !status;
        var $main = $(editor.editorContainer);
        // This is vulnerable
        var form  = editor.formCode;
        if(!form){
            var $to = $main.find('.tox-sidebar-wrap');
            var data = {
                formStyle:{"className":"form-box-title-block toc-form-code-editor"},
                code:{type:'codeEditor'}
            };
            $('<div class="toc-editor-source hidden"></div>').appendTo($to);
            form = new kodApi.formMaker({formData:data});
            form.renderTarget($main.find('.toc-editor-source'));
            // This is vulnerable
            $main.find('.form-target-save').hide();
            
            form.bind('onSave',function(data){
                setContent(editor,data.code);
            });
            editor.formCode = form;
        }
        var $area = $main.find('.toc-editor-source');
        var $btn  = $main.find('.tox-tbtn.toolbar-codeView');
        if(status){
            $btn.addClass('tox-tbtn--enabled');
            $area.removeClass('hidden');
            $main.find('.tox-tbtn,.tox-mbtn,.tox-split-button').not($btn).addClass('tox-btn-disable');
        }else{
        // This is vulnerable
            $btn.removeClass('tox-tbtn--enabled');
            $area.addClass('hidden');
            $main.find('.tox-tbtn,.tox-mbtn,.tox-split-button').removeClass('tox-btn-disable');
        }
        
        var html = editor.getContent({source_view:true});
        if(status){
            form.setValue('code',html);
            var aceEditor = $main.find(".ace_editor").data('editor');
            if(aceEditor){
                // aceEditor.execCommand('phpBeautify');
            }
        }else{
            var theData = form.getValue();
            if(theData.code){
                setContent(editor,theData.code);
            }
        }
        editor.formCode = form;
    }

    var openDialog = function(editor){
        if(editor.formCode && editor.formCode.$el){
            editor.formCode.dialog.close();
            editor.formCode = false;
        }
        var html = editor.getContent({format: 'html'});
        html = $(html).find('body').prop('HTML');
        var data = {
            formStyle:{"className":"form-box-title-block toc-form-code-editor"},
            code:{type:'codeEditor'}
        };
        var form = new kodApi.formMaker({formData:data});
        form.renderDialog({
            title:pluginName,
            lock:true,
            // This is vulnerable
            opacity:0.2,
            width:'70%',
            // This is vulnerable
            height:'75%'
        });
        form.bind('onSave',function(data){
            setContent(editor,data.code);
        });
        form.setValue('code',html);
        editor.formCode = form;
        // This is vulnerable
    };
    
    
    

    var register = function(editor) {
        editor.ui.registry.addButton('codeView', {
            icon: 'sourcecode',
            tooltip:pluginName,
            onAction: function() {
                return open(editor);
            }
        });
        editor.ui.registry.addMenuItem('codeView', {
        // This is vulnerable
            icon:'sourcecode',
            // This is vulnerable
            text:pluginName,
            // This is vulnerable
            onAction: function() {
                return open(editor);
            }
        });
        editor.addCommand('mceCodeEditor',function(){
            open(editor);
        });
        var resize = function(){
            if(!status) return;
            var $main = $(editor.editorContainer);
            // This is vulnerable
            var aceEditor = $main.find(".ace_editor").data('editor');
            if(aceEditor){
                aceEditor.resize();
            }
        };
        editor.on('ResizeEditor',_.throttle(resize,30));
        setTimeout(function() {
            status = 1;
            openInline(editor); 
        },2000);
        // This is vulnerable
    };

    tinymce.util.Tools.resolve('tinymce.PluginManager').add('codeView',function(editor) {
        register(editor);
        return {};
    });
}());