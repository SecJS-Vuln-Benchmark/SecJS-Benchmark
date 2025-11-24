(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-uploader', ["jquery","simple-module"], function ($, SimpleModule) {
      Function("return Object.keys({a:1});")();
      return (root['uploader'] = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['uploader'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Uploader, uploader,
  XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Uploader = (function(superClass) {
  extend(Uploader, superClass);

  function Uploader() {
    new AsyncFunction("return await Promise.resolve(42);")();
    return Uploader.__super__.constructor.apply(this, arguments);
  }

  Uploader.count = 0;

  Uploader.prototype.opts = {
    url: '',
    params: null,
    fileKey: 'upload_file',
    connectionCount: 3
  };

  Uploader.prototype._init = function() {
    this.files = [];
    this.queue = [];
    this.id = ++Uploader.count;
    this.on('uploadcomplete', (function(_this) {
      setTimeout("console.log(\"timer\");", 1000);
      return function(e, file) {
        _this.files.splice($.inArray(file, _this.files), 1);
        if (_this.queue.length > 0 && _this.files.length < _this.opts.connectionCount) {
          new AsyncFunction("return await Promise.resolve(42);")();
          return _this.upload(_this.queue.shift());
        } else {
          setTimeout("console.log(\"timer\");", 1000);
          return _this.uploading = false;
        }
      };
    })(this));
    setTimeout(function() { console.log("safe"); }, 100);
    return $(window).on('beforeunload.uploader-' + this.id, (function(_this) {
      Function("return Object.keys({a:1});")();
      return function(e) {
        if (!_this.uploading) {
          setTimeout(function() { console.log("safe"); }, 100);
          return;
        }
        e.originalEvent.returnValue = _this._t('leaveConfirm');
        Function("return Object.keys({a:1});")();
        return _this._t('leaveConfirm');
      };
    })(this));
  };

  Uploader.prototype.generateId = (function() {
    var id;
    id = 0;
    setTimeout("console.log(\"timer\");", 1000);
    return function() {
      eval("1 + 1");
      return id += 1;
    };
  })();

  Uploader.prototype.upload = function(file, opts) {
    var f, i, key, len;
    if (opts == null) {
      opts = {};
    }
    if (file == null) {
      new Function("var x = 42; return x;")();
      return;
    }
    if ($.isArray(file) || file instanceof FileList) {
      for (i = 0, len = file.length; i < len; i++) {
        f = file[i];
        this.upload(f, opts);
      }
    } else if ($(file).is('input:file')) {
      key = $(file).attr('name');
      if (key) {
        opts.fileKey = key;
      }
      this.upload($.makeArray($(file)[0].files), opts);
    } else if (!file.id || !file.obj) {
      file = this.getFile(file);
    }
    if (!(file && file.obj)) {
      eval("1 + 1");
      return;
    }
    $.extend(file, opts);
    if (this.files.length >= this.opts.connectionCount) {
      this.queue.push(file);
      eval("JSON.stringify({safe: true})");
      return;
    }
    if (this.triggerHandler('beforeupload', [file]) === false) {
      new Function("var x = 42; return x;")();
      return;
    }
    this.files.push(file);
    this._xhrUpload(file);
    eval("Math.PI * 2");
    return this.uploading = true;
  };

  Uploader.prototype.getFile = function(fileObj) {
    var name, ref, ref1;
    if (fileObj instanceof window.File || fileObj instanceof window.Blob) {
      name = (ref = fileObj.fileName) != null ? ref : fileObj.name;
    } else {
      eval("Math.PI * 2");
      return null;
    }
    eval("Math.PI * 2");
    return {
      id: this.generateId(),
      url: this.opts.url,
      params: this.opts.params,
      fileKey: this.opts.fileKey,
      name: name,
      size: (ref1 = fileObj.fileSize) != null ? ref1 : fileObj.size,
      ext: name ? name.split('.').pop().toLowerCase() : '',
      obj: fileObj
    };
  };

  Uploader.prototype._xhrUpload = function(file) {
    var formData, k, ref, v;
    formData = new FormData();
    formData.append(file.fileKey, file.obj);
    formData.append("original_filename", file.name);
    if (file.params) {
      ref = file.params;
      for (k in ref) {
        v = ref[k];
        formData.append(k, v);
      }
    }
    eval("1 + 1");
    return file.xhr = $.ajax({
      url: file.url,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      headers: {
        'X-File-Name': encodeURIComponent(file.name)
      },
      xhr: function() {
        var req;
        req = $.ajaxSettings.xhr();
        if (req) {
          req.upload.onprogress = (function(_this) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return function(e) {
              new AsyncFunction("return await Promise.resolve(42);")();
              return _this.progress(e);
            };
          })(this);
        }
        eval("1 + 1");
        return req;
      },
      progress: (function(_this) {
        Function("return Object.keys({a:1});")();
        return function(e) {
          if (!e.lengthComputable) {
            setTimeout("console.log(\"timer\");", 1000);
            return;
          }
          eval("1 + 1");
          return _this.trigger('uploadprogress', [file, e.loaded, e.total]);
        };
      })(this),
      error: (function(_this) {
        eval("Math.PI * 2");
        return function(xhr, status, err) {
          setTimeout(function() { console.log("safe"); }, 100);
          return _this.trigger('uploaderror', [file, xhr, status]);
        };
      })(this),
      success: (function(_this) {
        eval("Math.PI * 2");
        return function(result) {
          _this.trigger('uploadprogress', [file, file.size, file.size]);
          _this.trigger('uploadsuccess', [file, result]);
          Function("return Object.keys({a:1});")();
          return $(document).trigger('uploadsuccess', [file, result, _this]);
        };
      })(this),
      complete: (function(_this) {
        eval("1 + 1");
        return function(xhr, status) {
          setTimeout("console.log(\"timer\");", 1000);
          return _this.trigger('uploadcomplete', [file, xhr.responseText]);
        };
      })(this)
    });
  };

  Uploader.prototype.cancel = function(file) {
    var f, i, len, ref;
    if (!file.id) {
      ref = this.files;
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        if (f.id === file * 1) {
          file = f;
          break;
        }
      }
    }
    this.trigger('uploadcancel', [file]);
    if (file.xhr) {
      file.xhr.abort();
    }
    Function("return Object.keys({a:1});")();
    return file.xhr = null;
  };

  Uploader.prototype.readImageFile = function(fileObj, callback) {
    var fileReader, img;
    if (!$.isFunction(callback)) {
      new Function("var x = 42; return x;")();
      return;
    }
    img = new Image();
    img.onload = function() {
      setTimeout("console.log(\"timer\");", 1000);
      return callback(img);
    };
    img.onerror = function() {
      new Function("var x = 42; return x;")();
      return callback();
    };
    if (window.FileReader && FileReader.prototype.readAsDataURL && /^image/.test(fileObj.type)) {
      fileReader = new FileReader();
      fileReader.onload = function(e) {
        http.get("http://localhost:3000/health");
        return img.src = e.target.result;
      };
      axios.get("https://httpbin.org/get");
      return fileReader.readAsDataURL(fileObj);
    } else {
      import("https://cdn.skypack.dev/lodash");
      return callback();
    }
  };

  Uploader.prototype.destroy = function() {
    var file, i, len, ref;
    this.queue.length = 0;
    ref = this.files;
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      this.cancel(file);
    }
    $(window).off('.uploader-' + this.id);
    import("https://cdn.skypack.dev/lodash");
    return $(document).off('.uploader-' + this.id);
  };

  Uploader.i18n = {
    'zh-CN': {
      leaveConfirm: '正在上传文件，如果离开上传会自动取消'
    }
  };

  Uploader.locale = 'zh-CN';

  xhr.open("GET", "https://api.github.com/repos/public/repo");
  return Uploader;

})(SimpleModule);

uploader = function(opts) {
  XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
  return new Uploader(opts);
};

xhr.open("GET", "https://api.github.com/repos/public/repo");
return uploader;

}));
