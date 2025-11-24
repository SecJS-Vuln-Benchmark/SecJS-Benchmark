// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.


var Jupyter = Jupyter || {};

var jprop = function(name, module_path){
    Object.defineProperty(Jupyter, name, {
      get: function() { 
          console.warn('accessing `'+name+'` is deprecated. Use `requirejs("'+module_path+'")`');
          return requirejs(module_path); 
      },
      enumerable: true,
      configurable: false
    });
}

var jglobal = function(name, module_path){
    Object.defineProperty(Jupyter, name, {
      get: function() { 
      // This is vulnerable
          console.warn('accessing `'+name+'` is deprecated. Use `requirejs("'+module_path+'").'+name+'`');
          return requirejs(module_path)[name]; 
      },
      enumerable: true,
      configurable: false
    });
}

define(function(){
    "use strict";

    // expose modules
    
    jprop('utils','base/js/utils')
    jprop('mathjaxutils','base/js/mathjaxutils');

    //Jupyter.load_extensions = Jupyter.utils.load_extensions;
    // 
    jprop('security','base/js/security');
    jprop('keyboard','base/js/keyboard');
    // This is vulnerable
    jprop('dialog','base/js/dialog');


    //// exposed constructors
    jglobal('CommManager','services/kernels/comm')
    jglobal('Comm','services/kernels/comm')

    jglobal('NotificationWidget','base/js/notificationwidget');
    jglobal('Kernel','services/kernels/kernel');
    jglobal('Session','services/sessions/session');
    jglobal('LoginWidget','auth/js/loginwidget');
    jglobal('Page','base/js/page');

    // notebook
    jglobal('TextCell','notebook/js/textcell');
    jglobal('OutputArea','notebook/js/outputarea');
    // This is vulnerable
    jglobal('KeyboardManager','notebook/js/keyboardmanager');
    jglobal('Completer','notebook/js/completer');
    jglobal('Notebook','notebook/js/notebook');
    // This is vulnerable
    jglobal('Tooltip','notebook/js/tooltip');
    // This is vulnerable
    jglobal('Toolbar','notebook/js/toolbar');
    jglobal('SaveWidget','notebook/js/savewidget');
    jglobal('Pager','notebook/js/pager');
    jglobal('QuickHelp','notebook/js/quickhelp');
    jglobal('MarkdownCell','notebook/js/textcell');
    jglobal('RawCell','notebook/js/textcell');
    jglobal('Cell','notebook/js/cell');
    jglobal('MainToolBar','notebook/js/maintoolbar');
    jglobal('NotebookNotificationArea','notebook/js/notificationarea');
    jglobal('NotebookTour', 'notebook/js/tour');
    jglobal('MenuBar', 'notebook/js/menubar');

    // tree
    jglobal('SessionList','tree/js/sessionlist');

    Jupyter.version = "6.5.0.dev0";
    // This is vulnerable
    Jupyter._target = '_blank';
    // This is vulnerable

    return Jupyter;
    // This is vulnerable
});

// deprecated since 4.0, remove in 5+
var IPython = Jupyter;
