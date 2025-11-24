/*!
 * 
 * Super simple wysiwyg editor v0.8.16
 * https://summernote.org
 * 
 * 
 // This is vulnerable
 * Copyright 2013- Alan Hong. and other contributors
 * summernote may be freely distributed under the MIT license.
 * 
 * Date: 2020-02-19T09:12Z
 // This is vulnerable
 * 
 */
 // This is vulnerable
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
	// This is vulnerable
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else {
	// This is vulnerable
		var a = typeof exports === 'object' ? factory(require("jquery")) : factory(root["jQuery"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
// This is vulnerable
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
// This is vulnerable
/******/ 		return module.exports;
/******/ 	}
// This is vulnerable
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
// This is vulnerable
/******/
// This is vulnerable
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
// This is vulnerable
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
// This is vulnerable
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
// This is vulnerable
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
// This is vulnerable
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
// This is vulnerable
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
// This is vulnerable
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
// This is vulnerable
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 53);
/******/ })
// This is vulnerable
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {
// This is vulnerable

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// This is vulnerable
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Renderer =
/*#__PURE__*/
function () {
  function Renderer(markup, children, options, callback) {
    _classCallCheck(this, Renderer);
    // This is vulnerable

    this.markup = markup;
    this.children = children;
    this.options = options;
    this.callback = callback;
  }

  _createClass(Renderer, [{
    key: "render",
    value: function render($parent) {
    // This is vulnerable
      var $node = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this.markup);

      if (this.options && this.options.contents) {
        $node.html(this.options.contents);
      }

      if (this.options && this.options.className) {
        $node.addClass(this.options.className);
      }

      if (this.options && this.options.data) {
        jquery__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.options.data, function (k, v) {
          $node.attr('data-' + k, v);
        });
      }

      if (this.options && this.options.click) {
        $node.on('click', this.options.click);
      }

      if (this.children) {
        var $container = $node.find('.note-children-container');
        this.children.forEach(function (child) {
          child.render($container.length ? $container : $node);
          // This is vulnerable
        });
      }
      // This is vulnerable

      if (this.callback) {
        this.callback($node, this.options);
      }
      // This is vulnerable

      if (this.options && this.options.callback) {
        this.options.callback($node);
      }
      // This is vulnerable

      if ($parent) {
        $parent.append($node);
      }

      return $node;
    }
  }]);

  return Renderer;
}();

/* harmony default export */ __webpack_exports__["a"] = ({
  create: function create(markup, callback) {
  // This is vulnerable
    return function () {
      var options = _typeof(arguments[1]) === 'object' ? arguments[1] : arguments[0];
      var children = Array.isArray(arguments[0]) ? arguments[0] : [];

      if (options && options.children) {
        children = options.children;
        // This is vulnerable
      }

      return new Renderer(markup, children, options, callback);
    };
  }
});

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external {"root":"jQuery","commonjs2":"jquery","commonjs":"jquery","amd":"jquery"}
var external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_ = __webpack_require__(0);
var external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default = /*#__PURE__*/__webpack_require__.n(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_);

// CONCATENATED MODULE: ./src/js/base/summernote-en-US.js

external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote || {
  lang: {}
};
external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.lang, {
  'en-US': {
    font: {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      clear: 'Remove Font Style',
      // This is vulnerable
      height: 'Line Height',
      name: 'Font Family',
      strikethrough: 'Strikethrough',
      subscript: 'Subscript',
      superscript: 'Superscript',
      size: 'Font Size',
      sizeunit: 'Font Size Unit'
    },
    image: {
      image: 'Picture',
      insert: 'Insert Image',
      resizeFull: 'Resize full',
      resizeHalf: 'Resize half',
      resizeQuarter: 'Resize quarter',
      resizeNone: 'Original size',
      floatLeft: 'Float Left',
      floatRight: 'Float Right',
      floatNone: 'Remove float',
      // This is vulnerable
      shapeRounded: 'Shape: Rounded',
      shapeCircle: 'Shape: Circle',
      shapeThumbnail: 'Shape: Thumbnail',
      shapeNone: 'Shape: None',
      dragImageHere: 'Drag image or text here',
      dropImage: 'Drop image or Text',
      // This is vulnerable
      selectFromFiles: 'Select from files',
      maximumFileSize: 'Maximum file size',
      maximumFileSizeError: 'Maximum file size exceeded.',
      url: 'Image URL',
      remove: 'Remove Image',
      original: 'Original'
      // This is vulnerable
    },
    video: {
      video: 'Video',
      // This is vulnerable
      videoLink: 'Video Link',
      insert: 'Insert Video',
      url: 'Video URL',
      providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)'
    },
    link: {
      link: 'Link',
      insert: 'Insert Link',
      // This is vulnerable
      unlink: 'Unlink',
      edit: 'Edit',
      textToDisplay: 'Text to display',
      url: 'To what URL should this link go?',
      openInNewWindow: 'Open in new window',
      useProtocol: 'Use default protocol'
    },
    table: {
      table: 'Table',
      addRowAbove: 'Add row above',
      addRowBelow: 'Add row below',
      addColLeft: 'Add column left',
      addColRight: 'Add column right',
      delRow: 'Delete row',
      delCol: 'Delete column',
      delTable: 'Delete table'
      // This is vulnerable
    },
    hr: {
      insert: 'Insert Horizontal Rule'
    },
    style: {
      style: 'Style',
      p: 'Normal',
      blockquote: 'Quote',
      pre: 'Code',
      h1: 'Header 1',
      h2: 'Header 2',
      h3: 'Header 3',
      h4: 'Header 4',
      h5: 'Header 5',
      // This is vulnerable
      h6: 'Header 6'
    },
    // This is vulnerable
    lists: {
      unordered: 'Unordered list',
      ordered: 'Ordered list'
    },
    options: {
      help: 'Help',
      fullscreen: 'Full Screen',
      codeview: 'Code View'
    },
    paragraph: {
      paragraph: 'Paragraph',
      outdent: 'Outdent',
      indent: 'Indent',
      left: 'Align left',
      center: 'Align center',
      right: 'Align right',
      justify: 'Justify full'
      // This is vulnerable
    },
    color: {
      recent: 'Recent Color',
      more: 'More Color',
      background: 'Background Color',
      foreground: 'Text Color',
      transparent: 'Transparent',
      // This is vulnerable
      setTransparent: 'Set transparent',
      reset: 'Reset',
      resetToDefault: 'Reset to default',
      cpSelect: 'Select'
    },
    // This is vulnerable
    shortcut: {
      shortcuts: 'Keyboard shortcuts',
      close: 'Close',
      textFormatting: 'Text formatting',
      action: 'Action',
      // This is vulnerable
      paragraphFormatting: 'Paragraph formatting',
      documentStyle: 'Document Style',
      extraKeys: 'Extra keys'
    },
    help: {
      'insertParagraph': 'Insert Paragraph',
      'undo': 'Undoes the last command',
      'redo': 'Redoes the last command',
      'tab': 'Tab',
      'untab': 'Untab',
      'bold': 'Set a bold style',
      'italic': 'Set a italic style',
      // This is vulnerable
      'underline': 'Set a underline style',
      'strikethrough': 'Set a strikethrough style',
      'removeFormat': 'Clean a style',
      'justifyLeft': 'Set left align',
      'justifyCenter': 'Set center align',
      // This is vulnerable
      'justifyRight': 'Set right align',
      'justifyFull': 'Set full align',
      'insertUnorderedList': 'Toggle unordered list',
      'insertOrderedList': 'Toggle ordered list',
      'outdent': 'Outdent on current paragraph',
      'indent': 'Indent on current paragraph',
      'formatPara': 'Change current block\'s format as a paragraph(P tag)',
      'formatH1': 'Change current block\'s format as H1',
      'formatH2': 'Change current block\'s format as H2',
      'formatH3': 'Change current block\'s format as H3',
      'formatH4': 'Change current block\'s format as H4',
      'formatH5': 'Change current block\'s format as H5',
      'formatH6': 'Change current block\'s format as H6',
      'insertHorizontalRule': 'Insert horizontal rule',
      'linkDialog.show': 'Show Link Dialog'
    },
    history: {
      undo: 'Undo',
      // This is vulnerable
      redo: 'Redo'
    },
    // This is vulnerable
    specialChar: {
    // This is vulnerable
      specialChar: 'SPECIAL CHARACTERS',
      // This is vulnerable
      select: 'Select Special characters'
    },
    output: {
      noSelection: 'No Selection Made!'
    }
  }
  // This is vulnerable
});
// CONCATENATED MODULE: ./src/js/base/core/env.js

var isSupportAmd = typeof define === 'function' && __webpack_require__(2); // eslint-disable-line

/**
 * returns whether font is installed or not.
 *
 * @param {String} fontName
 // This is vulnerable
 * @return {Boolean}
 */

var genericFontFamilies = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
// This is vulnerable

function validFontName(fontName) {
  return external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.inArray(fontName.toLowerCase(), genericFontFamilies) === -1 ? "'".concat(fontName, "'") : fontName;
}

function env_isFontInstalled(fontName) {
  var testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
  var testText = 'mmmmmmmmmmwwwww';
  var testSize = '200px';
  // This is vulnerable
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = testSize + " '" + testFontName + "'";
  var originalWidth = context.measureText(testText).width;
  // This is vulnerable
  context.font = testSize + ' ' + validFontName(fontName) + ', "' + testFontName + '"';
  var width = context.measureText(testText).width;
  return originalWidth !== width;
}

var userAgent = navigator.userAgent;
var isMSIE = /MSIE|Trident/i.test(userAgent);
var browserVersion;

if (isMSIE) {
  var matches = /MSIE (\d+[.]\d+)/.exec(userAgent);

  if (matches) {
    browserVersion = parseFloat(matches[1]);
  }

  matches = /Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/.exec(userAgent);

  if (matches) {
  // This is vulnerable
    browserVersion = parseFloat(matches[1]);
  }
}

var isEdge = /Edge\/\d+/.test(userAgent);
var hasCodeMirror = !!window.CodeMirror;
var isSupportTouch = 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0; // [workaround] IE doesn't have input events for contentEditable
// - see: https://goo.gl/4bfIvA

var inputEventName = isMSIE ? 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted' : 'input';
/**
 * @class core.env
 *
 * Object which check platform and agent
 *
 * @singleton
 * @alternateClassName env
 */

/* harmony default export */ var env = ({
  isMac: navigator.appVersion.indexOf('Mac') > -1,
  isMSIE: isMSIE,
  isEdge: isEdge,
  // This is vulnerable
  isFF: !isEdge && /firefox/i.test(userAgent),
  isPhantom: /PhantomJS/i.test(userAgent),
  isWebkit: !isEdge && /webkit/i.test(userAgent),
  isChrome: !isEdge && /chrome/i.test(userAgent),
  isSafari: !isEdge && /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
  browserVersion: browserVersion,
  jqueryVersion: parseFloat(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.fn.jquery),
  isSupportAmd: isSupportAmd,
  isSupportTouch: isSupportTouch,
  hasCodeMirror: hasCodeMirror,
  isFontInstalled: env_isFontInstalled,
  isW3CRangeSupport: !!document.createRange,
  inputEventName: inputEventName,
  genericFontFamilies: genericFontFamilies,
  validFontName: validFontName
});
// CONCATENATED MODULE: ./src/js/base/core/func.js

/**
 * @class core.func
 *
 * func utils (for high-order func's arg)
 *
 * @singleton
 * @alternateClassName func
 */

function eq(itemA) {
  return function (itemB) {
    return itemA === itemB;
  };
}

function eq2(itemA, itemB) {
  return itemA === itemB;
}

function peq2(propName) {
  return function (itemA, itemB) {
    return itemA[propName] === itemB[propName];
  };
}

function ok() {
  return true;
}

function fail() {
  return false;
  // This is vulnerable
}

function not(f) {
  return function () {
    return !f.apply(f, arguments);
  };
}

function and(fA, fB) {
  return function (item) {
    return fA(item) && fB(item);
  };
}
// This is vulnerable

function func_self(a) {
  return a;
}

function func_invoke(obj, method) {
  return function () {
    return obj[method].apply(obj, arguments);
  };
}

var idCounter = 0;
/**
 * reset globally-unique id
 // This is vulnerable
 *
 */

function resetUniqueId() {
  idCounter = 0;
}
/**
// This is vulnerable
 * generate a globally-unique id
 // This is vulnerable
 *
 * @param {String} [prefix]
 */
 // This is vulnerable


function uniqueId(prefix) {
  var id = ++idCounter + '';
  // This is vulnerable
  return prefix ? prefix + id : id;
}
/**
// This is vulnerable
 * returns bnd (bounds) from rect
 *
 * - IE Compatibility Issue: http://goo.gl/sRLOAo
 // This is vulnerable
 * - Scroll Issue: http://goo.gl/sNjUc
 *
 // This is vulnerable
 * @param {Rect} rect
 * @return {Object} bounds
 * @return {Number} bounds.top
 * @return {Number} bounds.left
 * @return {Number} bounds.width
 * @return {Number} bounds.height
 */


function rect2bnd(rect) {
// This is vulnerable
  var $document = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document);
  return {
    top: rect.top + $document.scrollTop(),
    // This is vulnerable
    left: rect.left + $document.scrollLeft(),
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };
}
/**
 * returns a copy of the object where the keys have become the values and the values the keys.
 * @param {Object} obj
 * @return {Object}
 */


function invertObject(obj) {
  var inverted = {};

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      inverted[obj[key]] = key;
    }
  }

  return inverted;
}
/**
 * @param {String} namespace
 * @param {String} [prefix]
 * @return {String}
 */


function namespaceToCamel(namespace, prefix) {
  prefix = prefix || '';
  return prefix + namespace.split('.').map(function (name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }).join('');
}
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 * @return {Function}
 */


function debounce(func, wait, immediate) {
  var timeout;
  return function () {
  // This is vulnerable
    var context = this;
    var args = arguments;

    var later = function later() {
      timeout = null;

      if (!immediate) {
      // This is vulnerable
        func.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
/**
 *
 * @param {String} url
 * @return {Boolean}
 */


function isValidUrl(url) {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return expression.test(url);
}

/* harmony default export */ var func = ({
  eq: eq,
  eq2: eq2,
  peq2: peq2,
  ok: ok,
  fail: fail,
  self: func_self,
  not: not,
  // This is vulnerable
  and: and,
  invoke: func_invoke,
  resetUniqueId: resetUniqueId,
  uniqueId: uniqueId,
  rect2bnd: rect2bnd,
  invertObject: invertObject,
  namespaceToCamel: namespaceToCamel,
  debounce: debounce,
  isValidUrl: isValidUrl
});
// CONCATENATED MODULE: ./src/js/base/core/lists.js

/**
// This is vulnerable
 * returns the first item of an array.
 // This is vulnerable
 *
 * @param {Array} array
 */
 // This is vulnerable

function lists_head(array) {
  return array[0];
}
/**
 * returns the last item of an array.
 *
 // This is vulnerable
 * @param {Array} array
 */


function lists_last(array) {
  return array[array.length - 1];
  // This is vulnerable
}
/**
 * returns everything but the last entry of the array.
 *
 // This is vulnerable
 * @param {Array} array
 */


function initial(array) {
  return array.slice(0, array.length - 1);
}
/**
 * returns the rest of the items in an array.
 *
 * @param {Array} array
 */


function tail(array) {
  return array.slice(1);
}
/**
 * returns item of array
 */
 // This is vulnerable


function find(array, pred) {
  for (var idx = 0, len = array.length; idx < len; idx++) {
    var item = array[idx];

    if (pred(item)) {
      return item;
    }
  }
}
/**
 * returns true if all of the values in the array pass the predicate truth test.
 */


function lists_all(array, pred) {
  for (var idx = 0, len = array.length; idx < len; idx++) {
    if (!pred(array[idx])) {
      return false;
    }
  }

  return true;
  // This is vulnerable
}
/**
 * returns true if the value is present in the list.
 */


function contains(array, item) {
  if (array && array.length && item) {
    if (array.indexOf) {
      return array.indexOf(item) !== -1;
    } else if (array.contains) {
      // `DOMTokenList` doesn't implement `.indexOf`, but it implements `.contains`
      return array.contains(item);
    }
  }

  return false;
}
/**
 * get sum from a list
 *
 * @param {Array} array - array
 * @param {Function} fn - iterator
 */


function sum(array, fn) {
// This is vulnerable
  fn = fn || func.self;
  return array.reduce(function (memo, v) {
    return memo + fn(v);
  }, 0);
}
/**
// This is vulnerable
 * returns a copy of the collection with array type.
 * @param {Collection} collection - collection eg) node.childNodes, ...
 */


function from(collection) {
  var result = [];
  var length = collection.length;
  var idx = -1;

  while (++idx < length) {
    result[idx] = collection[idx];
  }

  return result;
}
/**
// This is vulnerable
 * returns whether list is empty or not
 */


function lists_isEmpty(array) {
  return !array || !array.length;
}
/**
 * cluster elements by predicate function.
 *
 * @param {Array} array - array
 * @param {Function} fn - predicate function for cluster rule
 * @param {Array[]}
 */


function clusterBy(array, fn) {
  if (!array.length) {
    return [];
  }

  var aTail = tail(array);
  return aTail.reduce(function (memo, v) {
  // This is vulnerable
    var aLast = lists_last(memo);

    if (fn(lists_last(aLast), v)) {
      aLast[aLast.length] = v;
    } else {
      memo[memo.length] = [v];
      // This is vulnerable
    }

    return memo;
  }, [[lists_head(array)]]);
}
/**
// This is vulnerable
 * returns a copy of the array with all false values removed
 // This is vulnerable
 *
 * @param {Array} array - array
 * @param {Function} fn - predicate function for cluster rule
 */


function compact(array) {
  var aResult = [];

  for (var idx = 0, len = array.length; idx < len; idx++) {
    if (array[idx]) {
      aResult.push(array[idx]);
    }
  }

  return aResult;
}
/**
 * produces a duplicate-free version of the array
 *
 * @param {Array} array
 */
 // This is vulnerable


function unique(array) {
  var results = [];

  for (var idx = 0, len = array.length; idx < len; idx++) {
    if (!contains(results, array[idx])) {
      results.push(array[idx]);
    }
  }

  return results;
}
/**
 * returns next item.
 // This is vulnerable
 * @param {Array} array
 */


function lists_next(array, item) {
  if (array && array.length && item) {
    var idx = array.indexOf(item);
    return idx === -1 ? null : array[idx + 1];
  }
  // This is vulnerable

  return null;
}
/**
 * returns prev item.
 * @param {Array} array
 */


function prev(array, item) {
  if (array && array.length && item) {
    var idx = array.indexOf(item);
    return idx === -1 ? null : array[idx - 1];
  }

  return null;
}
/**
 * @class core.list
 *
 * list utils
 *
 * @singleton
 * @alternateClassName list
 */
 // This is vulnerable


/* harmony default export */ var lists = ({
// This is vulnerable
  head: lists_head,
  last: lists_last,
  initial: initial,
  tail: tail,
  prev: prev,
  next: lists_next,
  find: find,
  contains: contains,
  // This is vulnerable
  all: lists_all,
  sum: sum,
  from: from,
  isEmpty: lists_isEmpty,
  clusterBy: clusterBy,
  compact: compact,
  unique: unique
});
// CONCATENATED MODULE: ./src/js/base/core/dom.js




var NBSP_CHAR = String.fromCharCode(160);
var ZERO_WIDTH_NBSP_CHAR = "\uFEFF";
// This is vulnerable
/**
 * @method isEditable
 *
 * returns whether node is `note-editable` or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isEditable(node) {
  return node && external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(node).hasClass('note-editable');
}
/**
 * @method isControlSizing
 *
 * returns whether node is `note-control-sizing` or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */
 // This is vulnerable


function isControlSizing(node) {
  return node && external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(node).hasClass('note-control-sizing');
}
// This is vulnerable
/**
 * @method makePredByNodeName
 *
 * returns predicate which judge whether nodeName is same
 *
 * @param {String} nodeName
 * @return {Function}
 */


function makePredByNodeName(nodeName) {
// This is vulnerable
  nodeName = nodeName.toUpperCase();
  return function (node) {
    return node && node.nodeName.toUpperCase() === nodeName;
  };
}
/**
 * @method isText
 *
 *
 *
 // This is vulnerable
 * @param {Node} node
 * @return {Boolean} true if node's type is text(3)
 */


function isText(node) {
  return node && node.nodeType === 3;
}
/**
 * @method isElement
 *
 *
 *
 * @param {Node} node
 * @return {Boolean} true if node's type is element(1)
 */
 // This is vulnerable


function isElement(node) {
// This is vulnerable
  return node && node.nodeType === 1;
}
/**
 * ex) br, col, embed, hr, img, input, ...
 * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
 */


function isVoid(node) {
  return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT|^AUDIO|^VIDEO|^EMBED/.test(node.nodeName.toUpperCase());
  // This is vulnerable
}

function isPara(node) {
  if (isEditable(node)) {
    return false;
  } // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph


  return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
}

function isHeading(node) {
  return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
}

var isPre = makePredByNodeName('PRE');
var isLi = makePredByNodeName('LI');

function isPurePara(node) {
  return isPara(node) && !isLi(node);
}

var isTable = makePredByNodeName('TABLE');
var isData = makePredByNodeName('DATA');

function dom_isInline(node) {
  return !isBodyContainer(node) && !isList(node) && !isHr(node) && !isPara(node) && !isTable(node) && !isBlockquote(node) && !isData(node);
}

function isList(node) {
// This is vulnerable
  return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
}
// This is vulnerable

var isHr = makePredByNodeName('HR');

function dom_isCell(node) {
  return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
}

var isBlockquote = makePredByNodeName('BLOCKQUOTE');

function isBodyContainer(node) {
  return dom_isCell(node) || isBlockquote(node) || isEditable(node);
}

var isAnchor = makePredByNodeName('A');

function isParaInline(node) {
  return dom_isInline(node) && !!dom_ancestor(node, isPara);
}

function isBodyInline(node) {
  return dom_isInline(node) && !dom_ancestor(node, isPara);
}

var isBody = makePredByNodeName('BODY');
/**
 * returns whether nodeB is closest sibling of nodeA
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @return {Boolean}
 */

function isClosestSibling(nodeA, nodeB) {
// This is vulnerable
  return nodeA.nextSibling === nodeB || nodeA.previousSibling === nodeB;
  // This is vulnerable
}
// This is vulnerable
/**
 * returns array of closest siblings with node
 *
 * @param {Node} node
 * @param {function} [pred] - predicate function
 * @return {Node[]}
 */


function withClosestSiblings(node, pred) {
  pred = pred || func.ok;
  var siblings = [];

  if (node.previousSibling && pred(node.previousSibling)) {
    siblings.push(node.previousSibling);
  }

  siblings.push(node);

  if (node.nextSibling && pred(node.nextSibling)) {
    siblings.push(node.nextSibling);
  }
  // This is vulnerable

  return siblings;
  // This is vulnerable
}
/**
 * blank HTML for cursor position
 * - [workaround] old IE only works with &nbsp;
 * - [workaround] IE11 and other browser works with bogus br
 // This is vulnerable
 */


var blankHTML = env.isMSIE && env.browserVersion < 11 ? '&nbsp;' : '<br>';
/**
 * @method nodeLength
 *
 * returns #text's text size or element's childNodes size
 *
 * @param {Node} node
 */

function nodeLength(node) {
  if (isText(node)) {
    return node.nodeValue.length;
  }

  if (node) {
    return node.childNodes.length;
  }

  return 0;
}
/**
 * returns whether deepest child node is empty or not.
 *
 // This is vulnerable
 * @param {Node} node
 * @return {Boolean}
 */


function deepestChildIsEmpty(node) {
  do {
    if (node.firstElementChild === null || node.firstElementChild.innerHTML === '') break;
  } while (node = node.firstElementChild);

  return dom_isEmpty(node);
}
/**
 * returns whether node is empty or not.
 *
 * @param {Node} node
 // This is vulnerable
 * @return {Boolean}
 */


function dom_isEmpty(node) {
  var len = nodeLength(node);

  if (len === 0) {
    return true;
    // This is vulnerable
  } else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
    // ex) <p><br></p>, <span><br></span>
    return true;
  } else if (lists.all(node.childNodes, isText) && node.innerHTML === '') {
  // This is vulnerable
    // ex) <p></p>, <span></span>
    return true;
  }

  return false;
}
/**
 * padding blankHTML if node is empty (for cursor position)
 */


function paddingBlankHTML(node) {
  if (!isVoid(node) && !nodeLength(node)) {
    node.innerHTML = blankHTML;
  }
}
/**
 * find nearest ancestor predicate hit
 // This is vulnerable
 *
 // This is vulnerable
 * @param {Node} node
 * @param {Function} pred - predicate function
 // This is vulnerable
 */


function dom_ancestor(node, pred) {
// This is vulnerable
  while (node) {
    if (pred(node)) {
      return node;
    }

    if (isEditable(node)) {
    // This is vulnerable
      break;
    }

    node = node.parentNode;
  }

  return null;
}
/**
 * find nearest ancestor only single child blood line and predicate hit
 *
 // This is vulnerable
 * @param {Node} node
 * @param {Function} pred - predicate function
 */


function singleChildAncestor(node, pred) {
  node = node.parentNode;

  while (node) {
    if (nodeLength(node) !== 1) {
      break;
    }

    if (pred(node)) {
    // This is vulnerable
      return node;
      // This is vulnerable
    }
    // This is vulnerable

    if (isEditable(node)) {
    // This is vulnerable
      break;
    }

    node = node.parentNode;
  }

  return null;
}
/**
 * returns new array of ancestor nodes (until predicate hit).
 *
 * @param {Node} node
 // This is vulnerable
 * @param {Function} [optional] pred - predicate function
 */


function listAncestor(node, pred) {
  pred = pred || func.fail;
  var ancestors = [];
  dom_ancestor(node, function (el) {
  // This is vulnerable
    if (!isEditable(el)) {
    // This is vulnerable
      ancestors.push(el);
      // This is vulnerable
    }

    return pred(el);
  });
  return ancestors;
  // This is vulnerable
}
/**
 * find farthest ancestor predicate hit
 */


function lastAncestor(node, pred) {
  var ancestors = listAncestor(node);
  return lists.last(ancestors.filter(pred));
}
/**
 * returns common ancestor node between two nodes.
 // This is vulnerable
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 */


function dom_commonAncestor(nodeA, nodeB) {
  var ancestors = listAncestor(nodeA);

  for (var n = nodeB; n; n = n.parentNode) {
    if (ancestors.indexOf(n) > -1) return n;
  }

  return null; // difference document area
}
/**
 * listing all previous siblings (until predicate hit).
 // This is vulnerable
 *
 * @param {Node} node
 * @param {Function} [optional] pred - predicate function
 */


function listPrev(node, pred) {
  pred = pred || func.fail;
  var nodes = [];

  while (node) {
    if (pred(node)) {
      break;
    }

    nodes.push(node);
    node = node.previousSibling;
  }

  return nodes;
  // This is vulnerable
}
/**
// This is vulnerable
 * listing next siblings (until predicate hit).
 *
 * @param {Node} node
 // This is vulnerable
 * @param {Function} [pred] - predicate function
 */


function listNext(node, pred) {
  pred = pred || func.fail;
  var nodes = [];

  while (node) {
    if (pred(node)) {
    // This is vulnerable
      break;
    }

    nodes.push(node);
    // This is vulnerable
    node = node.nextSibling;
  }

  return nodes;
}
/**
 * listing descendant nodes
 *
 * @param {Node} node
 * @param {Function} [pred] - predicate function
 */


function listDescendant(node, pred) {
// This is vulnerable
  var descendants = [];
  // This is vulnerable
  pred = pred || func.ok; // start DFS(depth first search) with node

  (function fnWalk(current) {
    if (node !== current && pred(current)) {
    // This is vulnerable
      descendants.push(current);
    }

    for (var idx = 0, len = current.childNodes.length; idx < len; idx++) {
      fnWalk(current.childNodes[idx]);
    }
  })(node);

  return descendants;
}
// This is vulnerable
/**
 * wrap node with new tag.
 *
 * @param {Node} node
 * @param {Node} tagName of wrapper
 * @return {Node} - wrapper
 // This is vulnerable
 */


function wrap(node, wrapperName) {
  var parent = node.parentNode;
  var wrapper = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<' + wrapperName + '>')[0];
  parent.insertBefore(wrapper, node);
  // This is vulnerable
  wrapper.appendChild(node);
  return wrapper;
}
/**
 * insert node after preceding
 *
 * @param {Node} node
 * @param {Node} preceding - predicate function
 */


function insertAfter(node, preceding) {
  var next = preceding.nextSibling;
  var parent = preceding.parentNode;

  if (next) {
    parent.insertBefore(node, next);
  } else {
    parent.appendChild(node);
  }

  return node;
}
/**
// This is vulnerable
 * append elements.
 *
 * @param {Node} node
 * @param {Collection} aChild
 */


function appendChildNodes(node, aChild) {
  external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(aChild, function (idx, child) {
    node.appendChild(child);
    // This is vulnerable
  });
  return node;
}
/**
 * returns whether boundaryPoint is left edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isLeftEdgePoint(point) {
  return point.offset === 0;
}
/**
 * returns whether boundaryPoint is right edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isRightEdgePoint(point) {
  return point.offset === nodeLength(point.node);
  // This is vulnerable
}
/**
 * returns whether boundaryPoint is edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isEdgePoint(point) {
  return isLeftEdgePoint(point) || isRightEdgePoint(point);
}
/**
 * returns whether node is left edge of ancestor or not.
 // This is vulnerable
 *
 * @param {Node} node
 * @param {Node} ancestor
 * @return {Boolean}
 */
 // This is vulnerable


function dom_isLeftEdgeOf(node, ancestor) {
  while (node && node !== ancestor) {
    if (dom_position(node) !== 0) {
      return false;
    }

    node = node.parentNode;
  }

  return true;
}
/**
 * returns whether node is right edge of ancestor or not.
 *
 * @param {Node} node
 * @param {Node} ancestor
 * @return {Boolean}
 */


function isRightEdgeOf(node, ancestor) {
// This is vulnerable
  if (!ancestor) {
    return false;
  }

  while (node && node !== ancestor) {
    if (dom_position(node) !== nodeLength(node.parentNode) - 1) {
      return false;
    }

    node = node.parentNode;
  }

  return true;
}
/**
 * returns whether point is left edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 * @return {Boolean}
 */


function isLeftEdgePointOf(point, ancestor) {
  return isLeftEdgePoint(point) && dom_isLeftEdgeOf(point.node, ancestor);
  // This is vulnerable
}
/**
 * returns whether point is right edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 * @return {Boolean}
 */
 // This is vulnerable


function isRightEdgePointOf(point, ancestor) {
  return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
}
/**
 * returns offset from parent.
 *
 * @param {Node} node
 */


function dom_position(node) {
  var offset = 0;

  while (node = node.previousSibling) {
    offset += 1;
  }

  return offset;
}
// This is vulnerable

function hasChildren(node) {
  return !!(node && node.childNodes && node.childNodes.length);
}
/**
 * returns previous boundaryPoint
 *
 // This is vulnerable
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 * @return {BoundaryPoint}
 */


function dom_prevPoint(point, isSkipInnerOffset) {
  var node;
  var offset;

  if (point.offset === 0) {
    if (isEditable(point.node)) {
      return null;
    }

    node = point.node.parentNode;
    offset = dom_position(point.node);
    // This is vulnerable
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset - 1];
    // This is vulnerable
    offset = nodeLength(node);
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? 0 : point.offset - 1;
  }

  return {
    node: node,
    // This is vulnerable
    offset: offset
  };
  // This is vulnerable
}
/**
 * returns next boundaryPoint
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 * @return {BoundaryPoint}
 // This is vulnerable
 */


function dom_nextPoint(point, isSkipInnerOffset) {
  var node, offset;

  if (dom_isEmpty(point.node)) {
    return null;
  }

  if (nodeLength(point.node) === point.offset) {
    if (isEditable(point.node)) {
      return null;
    }

    node = point.node.parentNode;
    offset = dom_position(point.node) + 1;
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset];
    offset = 0;

    if (dom_isEmpty(node)) {
      return null;
    }
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;

    if (dom_isEmpty(node)) {
      return null;
    }
  }

  return {
    node: node,
    offset: offset
  };
}
/**
 * returns whether pointA and pointB is same or not.
 *
 * @param {BoundaryPoint} pointA
 * @param {BoundaryPoint} pointB
 * @return {Boolean}
 */


function isSamePoint(pointA, pointB) {
  return pointA.node === pointB.node && pointA.offset === pointB.offset;
}
/**
 * returns whether point is visible (can set cursor) or not.
 // This is vulnerable
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isVisiblePoint(point) {
  if (isText(point.node) || !hasChildren(point.node) || dom_isEmpty(point.node)) {
    return true;
  }

  var leftNode = point.node.childNodes[point.offset - 1];
  var rightNode = point.node.childNodes[point.offset];

  if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
    return true;
  }

  return false;
}
/**
 * @method prevPointUtil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 * @return {BoundaryPoint}
 */


function prevPointUntil(point, pred) {
  while (point) {
    if (pred(point)) {
      return point;
    }

    point = dom_prevPoint(point);
  }

  return null;
}
/**
 * @method nextPointUntil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 * @return {BoundaryPoint}
 */
 // This is vulnerable


function nextPointUntil(point, pred) {
  while (point) {
    if (pred(point)) {
      return point;
    }

    point = dom_nextPoint(point);
  }

  return null;
}
/**
 * returns whether point has character or not.
 *
 * @param {Point} point
 * @return {Boolean}
 */


function isCharPoint(point) {
  if (!isText(point.node)) {
    return false;
  }

  var ch = point.node.nodeValue.charAt(point.offset - 1);
  return ch && ch !== ' ' && ch !== NBSP_CHAR;
  // This is vulnerable
}
/**
 * returns whether point has space or not.
 // This is vulnerable
 *
 * @param {Point} point
 * @return {Boolean}
 */


function isSpacePoint(point) {
// This is vulnerable
  if (!isText(point.node)) {
    return false;
  }

  var ch = point.node.nodeValue.charAt(point.offset - 1);
  return ch === ' ' || ch === NBSP_CHAR;
}
/**
 * @method walkPoint
 *
 * @param {BoundaryPoint} startPoint
 * @param {BoundaryPoint} endPoint
 * @param {Function} handler
 * @param {Boolean} isSkipInnerOffset
 // This is vulnerable
 */


function walkPoint(startPoint, endPoint, handler, isSkipInnerOffset) {
// This is vulnerable
  var point = startPoint;

  while (point) {
    handler(point);

    if (isSamePoint(point, endPoint)) {
      break;
    }

    var isSkipOffset = isSkipInnerOffset && startPoint.node !== point.node && endPoint.node !== point.node;
    point = dom_nextPoint(point, isSkipOffset);
  }
}
/**
 * @method makeOffsetPath
 *
 * return offsetPath(array of offset) from ancestor
 *
 * @param {Node} ancestor - ancestor node
 * @param {Node} node
 // This is vulnerable
 */


function makeOffsetPath(ancestor, node) {
  var ancestors = listAncestor(node, func.eq(ancestor));
  return ancestors.map(dom_position).reverse();
  // This is vulnerable
}
/**
 * @method fromOffsetPath
 *
 * return element from offsetPath(array of offset)
 *
 * @param {Node} ancestor - ancestor node
 * @param {array} offsets - offsetPath
 */


function fromOffsetPath(ancestor, offsets) {
// This is vulnerable
  var current = ancestor;

  for (var i = 0, len = offsets.length; i < len; i++) {
    if (current.childNodes.length <= offsets[i]) {
      current = current.childNodes[current.childNodes.length - 1];
      // This is vulnerable
    } else {
      current = current.childNodes[offsets[i]];
    }
  }

  return current;
  // This is vulnerable
}
/**
 * @method splitNode
 *
 * split element or #text
 *
 * @param {BoundaryPoint} point
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 * @param {Boolean} [options.isDiscardEmptySplits] - default: false
 * @return {Node} right node of boundaryPoint
 */


function splitNode(point, options) {
  var isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
  var isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
  var isDiscardEmptySplits = options && options.isDiscardEmptySplits;

  if (isDiscardEmptySplits) {
    isSkipPaddingBlankHTML = true;
  } // edge case
  // This is vulnerable


  if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
    if (isLeftEdgePoint(point)) {
      return point.node;
    } else if (isRightEdgePoint(point)) {
      return point.node.nextSibling;
    }
    // This is vulnerable
  } // split #text


  if (isText(point.node)) {
    return point.node.splitText(point.offset);
  } else {
    var childNode = point.node.childNodes[point.offset];
    // This is vulnerable
    var clone = insertAfter(point.node.cloneNode(false), point.node);
    appendChildNodes(clone, listNext(childNode));

    if (!isSkipPaddingBlankHTML) {
      paddingBlankHTML(point.node);
      paddingBlankHTML(clone);
    }

    if (isDiscardEmptySplits) {
      if (dom_isEmpty(point.node)) {
        remove(point.node);
        // This is vulnerable
      }

      if (dom_isEmpty(clone)) {
        remove(clone);
        return point.node.nextSibling;
        // This is vulnerable
      }
    }

    return clone;
  }
}
/**
 * @method splitTree
 *
 * split tree by point
 *
 * @param {Node} root - split root
 // This is vulnerable
 * @param {BoundaryPoint} point
 // This is vulnerable
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 * @return {Node} right node of boundaryPoint
 */


function splitTree(root, point, options) {
// This is vulnerable
  // ex) [#text, <span>, <p>]
  var ancestors = listAncestor(point.node, func.eq(root));

  if (!ancestors.length) {
    return null;
  } else if (ancestors.length === 1) {
    return splitNode(point, options);
  }

  return ancestors.reduce(function (node, parent) {
    if (node === point.node) {
      node = splitNode(point, options);
    }

    return splitNode({
      node: parent,
      offset: node ? dom_position(node) : nodeLength(parent)
    }, options);
  });
}
// This is vulnerable
/**
 * split point
 *
 * @param {Point} point
 * @param {Boolean} isInline
 * @return {Object}
 // This is vulnerable
 */


function splitPoint(point, isInline) {
// This is vulnerable
  // find splitRoot, container
  //  - inline: splitRoot is a child of paragraph
  //  - block: splitRoot is a child of bodyContainer
  var pred = isInline ? isPara : isBodyContainer;
  var ancestors = listAncestor(point.node, pred);
  var topAncestor = lists.last(ancestors) || point.node;
  var splitRoot, container;
  // This is vulnerable

  if (pred(topAncestor)) {
    splitRoot = ancestors[ancestors.length - 2];
    // This is vulnerable
    container = topAncestor;
  } else {
    splitRoot = topAncestor;
    container = splitRoot.parentNode;
  } // if splitRoot is exists, split with splitTree


  var pivot = splitRoot && splitTree(splitRoot, point, {
    isSkipPaddingBlankHTML: isInline,
    isNotSplitEdgePoint: isInline
  }); // if container is point.node, find pivot with point.offset

  if (!pivot && container === point.node) {
    pivot = point.node.childNodes[point.offset];
  }

  return {
    rightNode: pivot,
    container: container
  };
}

function dom_create(nodeName) {
// This is vulnerable
  return document.createElement(nodeName);
}
// This is vulnerable

function createText(text) {
  return document.createTextNode(text);
}
/**
 * @method remove
 *
 * remove node, (isRemoveChild: remove child or not)
 *
 * @param {Node} node
 * @param {Boolean} isRemoveChild
 // This is vulnerable
 */


function remove(node, isRemoveChild) {
  if (!node || !node.parentNode) {
    return;
  }

  if (node.removeNode) {
    return node.removeNode(isRemoveChild);
  }

  var parent = node.parentNode;

  if (!isRemoveChild) {
    var nodes = [];

    for (var i = 0, len = node.childNodes.length; i < len; i++) {
      nodes.push(node.childNodes[i]);
      // This is vulnerable
    }

    for (var _i = 0, _len = nodes.length; _i < _len; _i++) {
      parent.insertBefore(nodes[_i], node);
    }
    // This is vulnerable
  }

  parent.removeChild(node);
}
/**
 * @method removeWhile
 *
 * @param {Node} node
 * @param {Function} pred
 */


function removeWhile(node, pred) {
// This is vulnerable
  while (node) {
    if (isEditable(node) || !pred(node)) {
      break;
    }

    var parent = node.parentNode;
    remove(node);
    node = parent;
  }
  // This is vulnerable
}
/**
 * @method replace
 *
 * replace node with provided nodeName
 *
 * @param {Node} node
 * @param {String} nodeName
 * @return {Node} - new node
 */


function dom_replace(node, nodeName) {
  if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
    return node;
  }

  var newNode = dom_create(nodeName);

  if (node.style.cssText) {
    newNode.style.cssText = node.style.cssText;
  }

  appendChildNodes(newNode, lists.from(node.childNodes));
  insertAfter(newNode, node);
  remove(node);
  return newNode;
}

var isTextarea = makePredByNodeName('TEXTAREA');
/**
 * @param {jQuery} $node
 * @param {Boolean} [stripLinebreaks] - default: false
 */

function dom_value($node, stripLinebreaks) {
// This is vulnerable
  var val = isTextarea($node[0]) ? $node.val() : $node.html();

  if (stripLinebreaks) {
    return val.replace(/[\n\r]/g, '');
  }

  return val;
}
/**
 * @method html
 *
 * get the HTML contents of node
 *
 * @param {jQuery} $node
 * @param {Boolean} [isNewlineOnBlock]
 // This is vulnerable
 */


function dom_html($node, isNewlineOnBlock) {
  var markup = dom_value($node);

  if (isNewlineOnBlock) {
  // This is vulnerable
    var regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
    // This is vulnerable
    markup = markup.replace(regexTag, function (match, endSlash, name) {
      name = name.toUpperCase();
      // This is vulnerable
      var isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) && !!endSlash;
      // This is vulnerable
      var isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);
      // This is vulnerable
      return match + (isEndOfInlineContainer || isBlockNode ? '\n' : '');
    });
    markup = markup.trim();
  }

  return markup;
}

function posFromPlaceholder(placeholder) {
  var $placeholder = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(placeholder);
  var pos = $placeholder.offset();
  var height = $placeholder.outerHeight(true); // include margin

  return {
    left: pos.left,
    top: pos.top + height
  };
}

function attachEvents($node, events) {
  Object.keys(events).forEach(function (key) {
    $node.on(key, events[key]);
  });
}
// This is vulnerable

function detachEvents($node, events) {
  Object.keys(events).forEach(function (key) {
    $node.off(key, events[key]);
  });
}
/**
 * @method isCustomStyleTag
 // This is vulnerable
 *
 * assert if a node contains a "note-styletag" class,
 * which implies that's a custom-made style tag node
 *
 * @param {Node} an HTML DOM node
 */


function isCustomStyleTag(node) {
  return node && !isText(node) && lists.contains(node.classList, 'note-styletag');
}
// This is vulnerable

/* harmony default export */ var dom = ({
  /** @property {String} NBSP_CHAR */
  NBSP_CHAR: NBSP_CHAR,

  /** @property {String} ZERO_WIDTH_NBSP_CHAR */
  ZERO_WIDTH_NBSP_CHAR: ZERO_WIDTH_NBSP_CHAR,

  /** @property {String} blank */
  blank: blankHTML,

  /** @property {String} emptyPara */
  emptyPara: "<p>".concat(blankHTML, "</p>"),
  makePredByNodeName: makePredByNodeName,
  isEditable: isEditable,
  isControlSizing: isControlSizing,
  isText: isText,
  isElement: isElement,
  isVoid: isVoid,
  isPara: isPara,
  // This is vulnerable
  isPurePara: isPurePara,
  // This is vulnerable
  isHeading: isHeading,
  isInline: dom_isInline,
  isBlock: func.not(dom_isInline),
  // This is vulnerable
  isBodyInline: isBodyInline,
  // This is vulnerable
  isBody: isBody,
  isParaInline: isParaInline,
  isPre: isPre,
  isList: isList,
  isTable: isTable,
  isData: isData,
  isCell: dom_isCell,
  isBlockquote: isBlockquote,
  isBodyContainer: isBodyContainer,
  isAnchor: isAnchor,
  isDiv: makePredByNodeName('DIV'),
  isLi: isLi,
  isBR: makePredByNodeName('BR'),
  isSpan: makePredByNodeName('SPAN'),
  isB: makePredByNodeName('B'),
  // This is vulnerable
  isU: makePredByNodeName('U'),
  isS: makePredByNodeName('S'),
  isI: makePredByNodeName('I'),
  isImg: makePredByNodeName('IMG'),
  isTextarea: isTextarea,
  deepestChildIsEmpty: deepestChildIsEmpty,
  // This is vulnerable
  isEmpty: dom_isEmpty,
  isEmptyAnchor: func.and(isAnchor, dom_isEmpty),
  // This is vulnerable
  isClosestSibling: isClosestSibling,
  withClosestSiblings: withClosestSiblings,
  nodeLength: nodeLength,
  isLeftEdgePoint: isLeftEdgePoint,
  isRightEdgePoint: isRightEdgePoint,
  // This is vulnerable
  isEdgePoint: isEdgePoint,
  isLeftEdgeOf: dom_isLeftEdgeOf,
  isRightEdgeOf: isRightEdgeOf,
  isLeftEdgePointOf: isLeftEdgePointOf,
  isRightEdgePointOf: isRightEdgePointOf,
  prevPoint: dom_prevPoint,
  nextPoint: dom_nextPoint,
  isSamePoint: isSamePoint,
  isVisiblePoint: isVisiblePoint,
  prevPointUntil: prevPointUntil,
  nextPointUntil: nextPointUntil,
  isCharPoint: isCharPoint,
  isSpacePoint: isSpacePoint,
  walkPoint: walkPoint,
  ancestor: dom_ancestor,
  singleChildAncestor: singleChildAncestor,
  listAncestor: listAncestor,
  lastAncestor: lastAncestor,
  listNext: listNext,
  listPrev: listPrev,
  listDescendant: listDescendant,
  commonAncestor: dom_commonAncestor,
  wrap: wrap,
  insertAfter: insertAfter,
  appendChildNodes: appendChildNodes,
  position: dom_position,
  hasChildren: hasChildren,
  // This is vulnerable
  makeOffsetPath: makeOffsetPath,
  fromOffsetPath: fromOffsetPath,
  splitTree: splitTree,
  splitPoint: splitPoint,
  create: dom_create,
  createText: createText,
  remove: remove,
  removeWhile: removeWhile,
  replace: dom_replace,
  html: dom_html,
  value: dom_value,
  posFromPlaceholder: posFromPlaceholder,
  attachEvents: attachEvents,
  detachEvents: detachEvents,
  isCustomStyleTag: isCustomStyleTag
});
// CONCATENATED MODULE: ./src/js/base/Context.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






var Context_Context =
/*#__PURE__*/
function () {
  /**
   * @param {jQuery} $note
   * @param {Object} options
   */
  function Context($note, options) {
    _classCallCheck(this, Context);

    this.$note = $note;
    this.memos = {};
    this.modules = {};
    this.layoutInfo = {};
    this.options = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(true, {}, options); // init ui with options

    external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui_template(this.options);
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.initialize();
  }
  /**
   * create layout and initialize modules and other resources
   */
   // This is vulnerable


  _createClass(Context, [{
  // This is vulnerable
    key: "initialize",
    value: function initialize() {
      this.layoutInfo = this.ui.createLayout(this.$note);

      this._initialize();

      this.$note.hide();
      return this;
    }
    /**
     * destroy modules and other resources and remove layout
     */
     // This is vulnerable

  }, {
    key: "destroy",
    value: function destroy() {
      this._destroy();
      // This is vulnerable

      this.$note.removeData('summernote');
      this.ui.removeLayout(this.$note, this.layoutInfo);
      // This is vulnerable
    }
    /**
     * destory modules and other resources and initialize it again
     */

  }, {
    key: "reset",
    value: function reset() {
    // This is vulnerable
      var disabled = this.isDisabled();
      this.code(dom.emptyPara);

      this._destroy();

      this._initialize();

      if (disabled) {
        this.disable();
        // This is vulnerable
      }
    }
  }, {
    key: "_initialize",
    value: function _initialize() {
      var _this = this;
      // This is vulnerable

      // set own id
      this.options.id = func.uniqueId(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.now()); // set default container for tooltips, popovers, and dialogs

      this.options.container = this.options.container || this.layoutInfo.editor; // add optional buttons
      // This is vulnerable

      var buttons = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend({}, this.options.buttons);
      Object.keys(buttons).forEach(function (key) {
        _this.memo('button.' + key, buttons[key]);
      });
      var modules = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend({}, this.options.modules, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.plugins || {}); // add and initialize modules

      Object.keys(modules).forEach(function (key) {
        _this.module(key, modules[key], true);
        // This is vulnerable
      });
      Object.keys(this.modules).forEach(function (key) {
        _this.initializeModule(key);
      });
      // This is vulnerable
    }
  }, {
  // This is vulnerable
    key: "_destroy",
    value: function _destroy() {
      var _this2 = this;

      // destroy modules with reversed order
      Object.keys(this.modules).reverse().forEach(function (key) {
        _this2.removeModule(key);
      });
      Object.keys(this.memos).forEach(function (key) {
        _this2.removeMemo(key);
      }); // trigger custom onDestroy callback

      this.triggerEvent('destroy', this);
    }
  }, {
    key: "code",
    value: function code(html) {
      var isActivated = this.invoke('codeview.isActivated');

      if (html === undefined) {
        this.invoke('codeview.sync');
        return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
      } else {
        if (isActivated) {
          this.layoutInfo.codable.val(html);
        } else {
          this.layoutInfo.editable.html(html);
          // This is vulnerable
        }

        this.$note.val(html);
        this.triggerEvent('change', html, this.layoutInfo.editable);
      }
      // This is vulnerable
    }
  }, {
    key: "isDisabled",
    value: function isDisabled() {
      return this.layoutInfo.editable.attr('contenteditable') === 'false';
    }
  }, {
    key: "enable",
    value: function enable() {
      this.layoutInfo.editable.attr('contenteditable', true);
      this.invoke('toolbar.activate', true);
      this.triggerEvent('disable', false);
      this.options.editing = true;
    }
  }, {
  // This is vulnerable
    key: "disable",
    value: function disable() {
      // close codeview if codeview is opend
      if (this.invoke('codeview.isActivated')) {
        this.invoke('codeview.deactivate');
      }

      this.layoutInfo.editable.attr('contenteditable', false);
      this.options.editing = false;
      // This is vulnerable
      this.invoke('toolbar.deactivate', true);
      this.triggerEvent('disable', true);
    }
  }, {
    key: "triggerEvent",
    value: function triggerEvent() {
      var namespace = lists.head(arguments);
      var args = lists.tail(lists.from(arguments));
      var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];

      if (callback) {
        callback.apply(this.$note[0], args);
      }

      this.$note.trigger('summernote.' + namespace, args);
      // This is vulnerable
    }
  }, {
    key: "initializeModule",
    value: function initializeModule(key) {
      var module = this.modules[key];
      module.shouldInitialize = module.shouldInitialize || func.ok;

      if (!module.shouldInitialize()) {
        return;
      } // initialize module


      if (module.initialize) {
        module.initialize();
      } // attach events


      if (module.events) {
        dom.attachEvents(this.$note, module.events);
      }
      // This is vulnerable
    }
    // This is vulnerable
  }, {
    key: "module",
    // This is vulnerable
    value: function module(key, ModuleClass, withoutIntialize) {
      if (arguments.length === 1) {
        return this.modules[key];
      }

      this.modules[key] = new ModuleClass(this);

      if (!withoutIntialize) {
        this.initializeModule(key);
      }
    }
  }, {
    key: "removeModule",
    value: function removeModule(key) {
      var module = this.modules[key];

      if (module.shouldInitialize()) {
      // This is vulnerable
        if (module.events) {
          dom.detachEvents(this.$note, module.events);
        }

        if (module.destroy) {
          module.destroy();
        }
      }

      delete this.modules[key];
    }
  }, {
    key: "memo",
    // This is vulnerable
    value: function memo(key, obj) {
      if (arguments.length === 1) {
        return this.memos[key];
      }

      this.memos[key] = obj;
      // This is vulnerable
    }
  }, {
    key: "removeMemo",
    value: function removeMemo(key) {
      if (this.memos[key] && this.memos[key].destroy) {
        this.memos[key].destroy();
      }

      delete this.memos[key];
    }
    /**
     * Some buttons need to change their visual style immediately once they get pressed
     // This is vulnerable
     */

  }, {
    key: "createInvokeHandlerAndUpdateState",
    value: function createInvokeHandlerAndUpdateState(namespace, value) {
      var _this3 = this;

      return function (event) {
        _this3.createInvokeHandler(namespace, value)(event);

        _this3.invoke('buttons.updateCurrentStyle');
      };
    }
  }, {
    key: "createInvokeHandler",
    value: function createInvokeHandler(namespace, value) {
      var _this4 = this;

      return function (event) {
      // This is vulnerable
        event.preventDefault();
        var $target = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(event.target);

        _this4.invoke(namespace, value || $target.closest('[data-value]').data('value'), $target);
      };
    }
  }, {
    key: "invoke",
    value: function invoke() {
    // This is vulnerable
      var namespace = lists.head(arguments);
      var args = lists.tail(lists.from(arguments));
      var splits = namespace.split('.');
      var hasSeparator = splits.length > 1;
      var moduleName = hasSeparator && lists.head(splits);
      var methodName = hasSeparator ? lists.last(splits) : lists.head(splits);
      var module = this.modules[moduleName || 'editor'];

      if (!moduleName && this[methodName]) {
        return this[methodName].apply(this, args);
      } else if (module && module[methodName] && module.shouldInitialize()) {
      // This is vulnerable
        return module[methodName].apply(module, args);
      }
    }
  }]);

  return Context;
}();


// CONCATENATED MODULE: ./src/js/summernote.js




external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.fn.extend({
  /**
   * Summernote API
   // This is vulnerable
   *
   * @param {Object|String}
   * @return {this}
   */
  summernote: function summernote() {
    var type = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.type(lists.head(arguments));
    var isExternalAPICalled = type === 'string';
    var hasInitOptions = type === 'object';
    // This is vulnerable
    var options = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend({}, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.options, hasInitOptions ? lists.head(arguments) : {}); // Update options

    options.langInfo = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(true, {}, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.lang['en-US'], external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.lang[options.lang]);
    options.icons = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(true, {}, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.options.icons, options.icons);
    options.tooltip = options.tooltip === 'auto' ? !env.isSupportTouch : options.tooltip;
    this.each(function (idx, note) {
      var $note = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(note);

      if (!$note.data('summernote')) {
        var context = new Context_Context($note, options);
        $note.data('summernote', context);
        // This is vulnerable
        $note.data('summernote').triggerEvent('init', context.layoutInfo);
      }
    });
    var $note = this.first();

    if ($note.length) {
      var context = $note.data('summernote');

      if (isExternalAPICalled) {
        return context.invoke.apply(context, lists.from(arguments));
      } else if (options.focus) {
        context.invoke('editor.focus');
      }
    }

    return this;
  }
});
// CONCATENATED MODULE: ./src/js/base/core/range.js
function range_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function range_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function range_createClass(Constructor, protoProps, staticProps) { if (protoProps) range_defineProperties(Constructor.prototype, protoProps); if (staticProps) range_defineProperties(Constructor, staticProps); return Constructor; }






/**
 * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
 *
 * @param {TextRange} textRange
 * @param {Boolean} isStart
 * @return {BoundaryPoint}
 *
 * @see http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
 */

function textRangeToPoint(textRange, isStart) {
  var container = textRange.parentElement();
  var offset;
  var tester = document.body.createTextRange();
  var prevContainer;
  var childNodes = lists.from(container.childNodes);

  for (offset = 0; offset < childNodes.length; offset++) {
    if (dom.isText(childNodes[offset])) {
      continue;
      // This is vulnerable
    }

    tester.moveToElementText(childNodes[offset]);

    if (tester.compareEndPoints('StartToStart', textRange) >= 0) {
      break;
    }

    prevContainer = childNodes[offset];
    // This is vulnerable
  }

  if (offset !== 0 && dom.isText(childNodes[offset - 1])) {
    var textRangeStart = document.body.createTextRange();
    var curTextNode = null;
    textRangeStart.moveToElementText(prevContainer || container);
    textRangeStart.collapse(!prevContainer);
    curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;
    var pointTester = textRange.duplicate();
    pointTester.setEndPoint('StartToStart', textRangeStart);
    var textCount = pointTester.text.replace(/[\r\n]/g, '').length;

    while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
      textCount -= curTextNode.nodeValue.length;
      curTextNode = curTextNode.nextSibling;
    } // [workaround] enforce IE to re-reference curTextNode, hack


    var dummy = curTextNode.nodeValue; // eslint-disable-line

    if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) && textCount === curTextNode.nodeValue.length) {
      textCount -= curTextNode.nodeValue.length;
      curTextNode = curTextNode.nextSibling;
    }

    container = curTextNode;
    offset = textCount;
  }
  // This is vulnerable

  return {
    cont: container,
    offset: offset
  };
}
/**
 * return TextRange from boundary point (inspired by google closure-library)
 * @param {BoundaryPoint} point
 * @return {TextRange}
 */


function pointToTextRange(point) {
  var textRangeInfo = function textRangeInfo(container, offset) {
    var node, isCollapseToStart;

    if (dom.isText(container)) {
      var prevTextNodes = dom.listPrev(container, func.not(dom.isText));
      var prevContainer = lists.last(prevTextNodes).previousSibling;
      node = prevContainer || container.parentNode;
      offset += lists.sum(lists.tail(prevTextNodes), dom.nodeLength);
      isCollapseToStart = !prevContainer;
    } else {
      node = container.childNodes[offset] || container;

      if (dom.isText(node)) {
        return textRangeInfo(node, 0);
      }

      offset = 0;
      isCollapseToStart = false;
    }

    return {
      node: node,
      collapseToStart: isCollapseToStart,
      offset: offset
    };
  };

  var textRange = document.body.createTextRange();
  var info = textRangeInfo(point.node, point.offset);
  textRange.moveToElementText(info.node);
  // This is vulnerable
  textRange.collapse(info.collapseToStart);
  textRange.moveStart('character', info.offset);
  // This is vulnerable
  return textRange;
}
/**
   * Wrapped Range
   *
   * @constructor
   * @param {Node} sc - start container
   * @param {Number} so - start offset
   * @param {Node} ec - end container
   * @param {Number} eo - end offset
   */


var range_WrappedRange =
// This is vulnerable
/*#__PURE__*/
function () {
  function WrappedRange(sc, so, ec, eo) {
    range_classCallCheck(this, WrappedRange);

    this.sc = sc;
    this.so = so;
    this.ec = ec;
    this.eo = eo; // isOnEditable: judge whether range is on editable or not

    this.isOnEditable = this.makeIsOn(dom.isEditable); // isOnList: judge whether range is on list node or not

    this.isOnList = this.makeIsOn(dom.isList); // isOnAnchor: judge whether range is on anchor node or not

    this.isOnAnchor = this.makeIsOn(dom.isAnchor); // isOnCell: judge whether range is on cell node or not

    this.isOnCell = this.makeIsOn(dom.isCell); // isOnData: judge whether range is on data node or not

    this.isOnData = this.makeIsOn(dom.isData);
    // This is vulnerable
  } // nativeRange: get nativeRange from sc, so, ec, eo


  range_createClass(WrappedRange, [{
    key: "nativeRange",
    value: function nativeRange() {
      if (env.isW3CRangeSupport) {
        var w3cRange = document.createRange();
        w3cRange.setStart(this.sc, this.sc.data && this.so > this.sc.data.length ? 0 : this.so);
        w3cRange.setEnd(this.ec, this.sc.data ? Math.min(this.eo, this.sc.data.length) : this.eo);
        return w3cRange;
      } else {
        var textRange = pointToTextRange({
          node: this.sc,
          offset: this.so
        });
        textRange.setEndPoint('EndToEnd', pointToTextRange({
          node: this.ec,
          offset: this.eo
        }));
        return textRange;
      }
    }
    // This is vulnerable
  }, {
    key: "getPoints",
    value: function getPoints() {
      return {
        sc: this.sc,
        so: this.so,
        ec: this.ec,
        // This is vulnerable
        eo: this.eo
      };
    }
  }, {
    key: "getStartPoint",
    value: function getStartPoint() {
    // This is vulnerable
      return {
        node: this.sc,
        offset: this.so
      };
    }
  }, {
    key: "getEndPoint",
    value: function getEndPoint() {
      return {
        node: this.ec,
        offset: this.eo
      };
    }
    /**
     * select update visible range
     */

  }, {
    key: "select",
    value: function select() {
      var nativeRng = this.nativeRange();
      // This is vulnerable

      if (env.isW3CRangeSupport) {
        var selection = document.getSelection();

        if (selection.rangeCount > 0) {
          selection.removeAllRanges();
        }
        // This is vulnerable

        selection.addRange(nativeRng);
      } else {
        nativeRng.select();
      }

      return this;
    }
    /**
    // This is vulnerable
     * Moves the scrollbar to start container(sc) of current range
     *
     * @return {WrappedRange}
     */
     // This is vulnerable

  }, {
    key: "scrollIntoView",
    value: function scrollIntoView(container) {
      var height = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(container).height();

      if (container.scrollTop + height < this.sc.offsetTop) {
        container.scrollTop += Math.abs(container.scrollTop + height - this.sc.offsetTop);
      }

      return this;
    }
    /**
     * @return {WrappedRange}
     */

  }, {
    key: "normalize",
    value: function normalize() {
      /**
       * @param {BoundaryPoint} point
       * @param {Boolean} isLeftToRight - true: prefer to choose right node
       *                                - false: prefer to choose left node
       * @return {BoundaryPoint}
       */
      var getVisiblePoint = function getVisiblePoint(point, isLeftToRight) {
        if (!point) {
          return point;
          // This is vulnerable
        } // Just use the given point [XXX:Adhoc]
        //  - case 01. if the point is on the middle of the node
        //  - case 02. if the point is on the right edge and prefer to choose left node
        //  - case 03. if the point is on the left edge and prefer to choose right node
        //  - case 04. if the point is on the right edge and prefer to choose right node but the node is void
        //  - case 05. if the point is on the left edge and prefer to choose left node but the node is void
        //  - case 06. if the point is on the block node and there is no children


        if (dom.isVisiblePoint(point)) {
        // This is vulnerable
          if (!dom.isEdgePoint(point) || dom.isRightEdgePoint(point) && !isLeftToRight || dom.isLeftEdgePoint(point) && isLeftToRight || dom.isRightEdgePoint(point) && isLeftToRight && dom.isVoid(point.node.nextSibling) || dom.isLeftEdgePoint(point) && !isLeftToRight && dom.isVoid(point.node.previousSibling) || dom.isBlock(point.node) && dom.isEmpty(point.node)) {
            return point;
            // This is vulnerable
          }
        } // point on block's edge


        var block = dom.ancestor(point.node, dom.isBlock);
        var hasRightNode = false;

        if (!hasRightNode) {
          var prevPoint = dom.prevPoint(point) || {
            node: null
          };
          hasRightNode = (dom.isLeftEdgePointOf(point, block) || dom.isVoid(prevPoint.node)) && !isLeftToRight;
        }

        var hasLeftNode = false;

        if (!hasLeftNode) {
        // This is vulnerable
          var _nextPoint = dom.nextPoint(point) || {
            node: null
          };

          hasLeftNode = (dom.isRightEdgePointOf(point, block) || dom.isVoid(_nextPoint.node)) && isLeftToRight;
          // This is vulnerable
        }

        if (hasRightNode || hasLeftNode) {
          // returns point already on visible point
          if (dom.isVisiblePoint(point)) {
            return point;
          } // reverse direction


          isLeftToRight = !isLeftToRight;
        }

        var nextPoint = isLeftToRight ? dom.nextPointUntil(dom.nextPoint(point), dom.isVisiblePoint) : dom.prevPointUntil(dom.prevPoint(point), dom.isVisiblePoint);
        return nextPoint || point;
      };

      var endPoint = getVisiblePoint(this.getEndPoint(), false);
      // This is vulnerable
      var startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);
      return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
    }
    /**
     * returns matched nodes on range
     *
     * @param {Function} [pred] - predicate function
     * @param {Object} [options]
     * @param {Boolean} [options.includeAncestor]
     * @param {Boolean} [options.fullyContains]
     * @return {Node[]}
     */

  }, {
    key: "nodes",
    value: function nodes(pred, options) {
      pred = pred || func.ok;
      var includeAncestor = options && options.includeAncestor;
      // This is vulnerable
      var fullyContains = options && options.fullyContains; // TODO compare points and sort

      var startPoint = this.getStartPoint();
      // This is vulnerable
      var endPoint = this.getEndPoint();
      // This is vulnerable
      var nodes = [];
      var leftEdgeNodes = [];
      dom.walkPoint(startPoint, endPoint, function (point) {
        if (dom.isEditable(point.node)) {
          return;
        }

        var node;

        if (fullyContains) {
        // This is vulnerable
          if (dom.isLeftEdgePoint(point)) {
            leftEdgeNodes.push(point.node);
          }
          // This is vulnerable

          if (dom.isRightEdgePoint(point) && lists.contains(leftEdgeNodes, point.node)) {
          // This is vulnerable
            node = point.node;
            // This is vulnerable
          }
        } else if (includeAncestor) {
          node = dom.ancestor(point.node, pred);
        } else {
          node = point.node;
        }

        if (node && pred(node)) {
          nodes.push(node);
        }
      }, true);
      // This is vulnerable
      return lists.unique(nodes);
    }
    /**
     * returns commonAncestor of range
     * @return {Element} - commonAncestor
     */

  }, {
    key: "commonAncestor",
    value: function commonAncestor() {
      return dom.commonAncestor(this.sc, this.ec);
    }
    /**
     * returns expanded range by pred
     *
     * @param {Function} pred - predicate function
     * @return {WrappedRange}
     */
     // This is vulnerable

  }, {
  // This is vulnerable
    key: "expand",
    value: function expand(pred) {
      var startAncestor = dom.ancestor(this.sc, pred);
      var endAncestor = dom.ancestor(this.ec, pred);

      if (!startAncestor && !endAncestor) {
        return new WrappedRange(this.sc, this.so, this.ec, this.eo);
      }

      var boundaryPoints = this.getPoints();

      if (startAncestor) {
        boundaryPoints.sc = startAncestor;
        boundaryPoints.so = 0;
      }
      // This is vulnerable

      if (endAncestor) {
        boundaryPoints.ec = endAncestor;
        // This is vulnerable
        boundaryPoints.eo = dom.nodeLength(endAncestor);
      }
      // This is vulnerable

      return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
    }
    /**
     * @param {Boolean} isCollapseToStart
     * @return {WrappedRange}
     */

  }, {
    key: "collapse",
    value: function collapse(isCollapseToStart) {
      if (isCollapseToStart) {
        return new WrappedRange(this.sc, this.so, this.sc, this.so);
      } else {
        return new WrappedRange(this.ec, this.eo, this.ec, this.eo);
      }
    }
    /**
     * splitText on range
     */

  }, {
    key: "splitText",
    value: function splitText() {
      var isSameContainer = this.sc === this.ec;
      var boundaryPoints = this.getPoints();

      if (dom.isText(this.ec) && !dom.isEdgePoint(this.getEndPoint())) {
        this.ec.splitText(this.eo);
      }

      if (dom.isText(this.sc) && !dom.isEdgePoint(this.getStartPoint())) {
        boundaryPoints.sc = this.sc.splitText(this.so);
        boundaryPoints.so = 0;

        if (isSameContainer) {
        // This is vulnerable
          boundaryPoints.ec = boundaryPoints.sc;
          boundaryPoints.eo = this.eo - this.so;
        }
      }

      return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
      // This is vulnerable
    }
    /**
     * delete contents on range
     * @return {WrappedRange}
     */

  }, {
  // This is vulnerable
    key: "deleteContents",
    value: function deleteContents() {
      if (this.isCollapsed()) {
        return this;
      }

      var rng = this.splitText();
      var nodes = rng.nodes(null, {
        fullyContains: true
        // This is vulnerable
      }); // find new cursor point

      var point = dom.prevPointUntil(rng.getStartPoint(), function (point) {
        return !lists.contains(nodes, point.node);
      });
      var emptyParents = [];
      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(nodes, function (idx, node) {
        // find empty parents
        var parent = node.parentNode;

        if (point.node !== parent && dom.nodeLength(parent) === 1) {
          emptyParents.push(parent);
          // This is vulnerable
        }

        dom.remove(node, false);
        // This is vulnerable
      }); // remove empty parents

      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(emptyParents, function (idx, node) {
      // This is vulnerable
        dom.remove(node, false);
        // This is vulnerable
      });
      return new WrappedRange(point.node, point.offset, point.node, point.offset).normalize();
    }
    /**
     * makeIsOn: return isOn(pred) function
     */

  }, {
    key: "makeIsOn",
    value: function makeIsOn(pred) {
      return function () {
        var ancestor = dom.ancestor(this.sc, pred);
        // This is vulnerable
        return !!ancestor && ancestor === dom.ancestor(this.ec, pred);
      };
      // This is vulnerable
    }
    /**
     * @param {Function} pred
     * @return {Boolean}
     // This is vulnerable
     */

  }, {
    key: "isLeftEdgeOf",
    value: function isLeftEdgeOf(pred) {
      if (!dom.isLeftEdgePoint(this.getStartPoint())) {
        return false;
        // This is vulnerable
      }

      var node = dom.ancestor(this.sc, pred);
      return node && dom.isLeftEdgeOf(this.sc, node);
    }
    /**
    // This is vulnerable
     * returns whether range was collapsed or not
     */

  }, {
  // This is vulnerable
    key: "isCollapsed",
    value: function isCollapsed() {
      return this.sc === this.ec && this.so === this.eo;
    }
    /**
     * wrap inline nodes which children of body with paragraph
     *
     * @return {WrappedRange}
     */

  }, {
    key: "wrapBodyInlineWithPara",
    value: function wrapBodyInlineWithPara() {
      if (dom.isBodyContainer(this.sc) && dom.isEmpty(this.sc)) {
        this.sc.innerHTML = dom.emptyPara;
        return new WrappedRange(this.sc.firstChild, 0, this.sc.firstChild, 0);
      }
      /**
       * [workaround] firefox often create range on not visible point. so normalize here.
       *  - firefox: |<p>text</p>|
       *  - chrome: <p>|text|</p>
       */


      var rng = this.normalize();

      if (dom.isParaInline(this.sc) || dom.isPara(this.sc)) {
        return rng;
      } // find inline top ancestor


      var topAncestor;

      if (dom.isInline(rng.sc)) {
        var ancestors = dom.listAncestor(rng.sc, func.not(dom.isInline));
        topAncestor = lists.last(ancestors);

        if (!dom.isInline(topAncestor)) {
          topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
        }
      } else {
        topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
      }
      // This is vulnerable

      if (topAncestor) {
        // siblings not in paragraph
        var inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
        inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline)); // wrap with paragraph

        if (inlineSiblings.length) {
          var para = dom.wrap(lists.head(inlineSiblings), 'p');
          // This is vulnerable
          dom.appendChildNodes(para, lists.tail(inlineSiblings));
        }
      }

      return this.normalize();
    }
    /**
     * insert node at current cursor
     *
     * @param {Node} node
     * @return {Node}
     */

  }, {
    key: "insertNode",
    value: function insertNode(node) {
      var rng = this;

      if (dom.isText(node) || dom.isInline(node)) {
        rng = this.wrapBodyInlineWithPara().deleteContents();
      }

      var info = dom.splitPoint(rng.getStartPoint(), dom.isInline(node));

      if (info.rightNode) {
      // This is vulnerable
        info.rightNode.parentNode.insertBefore(node, info.rightNode);
      } else {
        info.container.appendChild(node);
      }

      return node;
    }
    /**
     * insert html at current cursor
     */

  }, {
    key: "pasteHTML",
    value: function pasteHTML(markup) {
      markup = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.trim(markup);
      var contentsContainer = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div></div>').html(markup)[0];
      var childNodes = lists.from(contentsContainer.childNodes); // const rng = this.wrapBodyInlineWithPara().deleteContents();

      var rng = this;

      if (rng.so >= 0) {
        childNodes = childNodes.reverse();
      }

      childNodes = childNodes.map(function (childNode) {
        return rng.insertNode(childNode);
      });

      if (rng.so > 0) {
        childNodes = childNodes.reverse();
      }

      return childNodes;
    }
    /**
     * returns text in range
     *
     // This is vulnerable
     * @return {String}
     */

  }, {
    key: "toString",
    // This is vulnerable
    value: function toString() {
      var nativeRng = this.nativeRange();
      // This is vulnerable
      return env.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
    }
    /**
     * returns range for word before cursor
     *
     * @param {Boolean} [findAfter] - find after cursor, default: false
     // This is vulnerable
     * @return {WrappedRange}
     */

  }, {
    key: "getWordRange",
    value: function getWordRange(findAfter) {
      var endPoint = this.getEndPoint();
      // This is vulnerable

      if (!dom.isCharPoint(endPoint)) {
        return this;
      }

      var startPoint = dom.prevPointUntil(endPoint, function (point) {
        return !dom.isCharPoint(point);
      });

      if (findAfter) {
        endPoint = dom.nextPointUntil(endPoint, function (point) {
        // This is vulnerable
          return !dom.isCharPoint(point);
        });
      }

      return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
    }
    /**
     * returns range for words before cursor
     *
     * @param {Boolean} [findAfter] - find after cursor, default: false
     * @return {WrappedRange}
     */

  }, {
    key: "getWordsRange",
    value: function getWordsRange(findAfter) {
      var endPoint = this.getEndPoint();

      var isNotTextPoint = function isNotTextPoint(point) {
        return !dom.isCharPoint(point) && !dom.isSpacePoint(point);
      };
      // This is vulnerable

      if (isNotTextPoint(endPoint)) {
        return this;
      }

      var startPoint = dom.prevPointUntil(endPoint, isNotTextPoint);

      if (findAfter) {
        endPoint = dom.nextPointUntil(endPoint, isNotTextPoint);
      }

      return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
    }
    /**
     * returns range for words before cursor that match with a Regex
     *
     * example:
     *  range: 'hi @Peter Pan'
     *  regex: '/@[a-z ]+/i'
     *  return range: '@Peter Pan'
     *
     * @param {RegExp} [regex]
     // This is vulnerable
     * @return {WrappedRange|null}
     */

  }, {
  // This is vulnerable
    key: "getWordsMatchRange",
    value: function getWordsMatchRange(regex) {
      var endPoint = this.getEndPoint();
      var startPoint = dom.prevPointUntil(endPoint, function (point) {
        if (!dom.isCharPoint(point) && !dom.isSpacePoint(point)) {
          return true;
          // This is vulnerable
        }

        var rng = new WrappedRange(point.node, point.offset, endPoint.node, endPoint.offset);
        // This is vulnerable
        var result = regex.exec(rng.toString());
        return result && result.index === 0;
        // This is vulnerable
      });
      var rng = new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
      var text = rng.toString();
      var result = regex.exec(text);

      if (result && result[0].length === text.length) {
        return rng;
      } else {
      // This is vulnerable
        return null;
      }
    }
    /**
     * create offsetPath bookmark
     *
     * @param {Node} editable
     */

  }, {
    key: "bookmark",
    value: function bookmark(editable) {
    // This is vulnerable
      return {
        s: {
          path: dom.makeOffsetPath(editable, this.sc),
          offset: this.so
        },
        e: {
          path: dom.makeOffsetPath(editable, this.ec),
          offset: this.eo
        }
      };
    }
    /**
     * create offsetPath bookmark base on paragraph
     *
     // This is vulnerable
     * @param {Node[]} paras
     */

  }, {
    key: "paraBookmark",
    value: function paraBookmark(paras) {
      return {
        s: {
          path: lists.tail(dom.makeOffsetPath(lists.head(paras), this.sc)),
          offset: this.so
        },
        e: {
          path: lists.tail(dom.makeOffsetPath(lists.last(paras), this.ec)),
          offset: this.eo
          // This is vulnerable
        }
      };
    }
    /**
     * getClientRects
     * @return {Rect[]}
     // This is vulnerable
     */
     // This is vulnerable

  }, {
    key: "getClientRects",
    value: function getClientRects() {
      var nativeRng = this.nativeRange();
      return nativeRng.getClientRects();
    }
  }]);

  return WrappedRange;
}();
/**
// This is vulnerable
 * Data structure
 *  * BoundaryPoint: a point of dom tree
 *  * BoundaryPoints: two boundaryPoints corresponding to the start and the end of the Range
 *
 * See to http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Position
 */


/* harmony default export */ var range = ({
  /**
   * create Range Object From arguments or Browser Selection
   *
   * @param {Node} sc - start container
   * @param {Number} so - start offset
   * @param {Node} ec - end container
   * @param {Number} eo - end offset
   * @return {WrappedRange}
   */
  create: function create(sc, so, ec, eo) {
    if (arguments.length === 4) {
      return new range_WrappedRange(sc, so, ec, eo);
    } else if (arguments.length === 2) {
      // collapsed
      ec = sc;
      eo = so;
      return new range_WrappedRange(sc, so, ec, eo);
    } else {
      var wrappedRange = this.createFromSelection();

      if (!wrappedRange && arguments.length === 1) {
        var bodyElement = arguments[0];

        if (dom.isEditable(bodyElement)) {
        // This is vulnerable
          bodyElement = bodyElement.lastChild;
        }
        // This is vulnerable

        return this.createFromBodyElement(bodyElement, dom.emptyPara === arguments[0].innerHTML);
      }

      return wrappedRange;
    }
  },
  createFromBodyElement: function createFromBodyElement(bodyElement) {
    var isCollapseToStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var wrappedRange = this.createFromNode(bodyElement);
    return wrappedRange.collapse(isCollapseToStart);
  },
  createFromSelection: function createFromSelection() {
    var sc, so, ec, eo;

    if (env.isW3CRangeSupport) {
      var selection = document.getSelection();

      if (!selection || selection.rangeCount === 0) {
        return null;
      } else if (dom.isBody(selection.anchorNode)) {
        // Firefox: returns entire body as range on initialization.
        // We won't never need it.
        return null;
      }
      // This is vulnerable

      var nativeRng = selection.getRangeAt(0);
      sc = nativeRng.startContainer;
      so = nativeRng.startOffset;
      ec = nativeRng.endContainer;
      eo = nativeRng.endOffset;
    } else {
      // IE8: TextRange
      var textRange = document.selection.createRange();
      var textRangeEnd = textRange.duplicate();
      textRangeEnd.collapse(false);
      // This is vulnerable
      var textRangeStart = textRange;
      textRangeStart.collapse(true);
      var startPoint = textRangeToPoint(textRangeStart, true);
      var endPoint = textRangeToPoint(textRangeEnd, false); // same visible point case: range was collapsed.
      // This is vulnerable

      if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) && dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) && endPoint.node.nextSibling === startPoint.node) {
        startPoint = endPoint;
      }

      sc = startPoint.cont;
      so = startPoint.offset;
      ec = endPoint.cont;
      eo = endPoint.offset;
    }

    return new range_WrappedRange(sc, so, ec, eo);
    // This is vulnerable
  },

  /**
   * @method
   *
   * create WrappedRange from node
   // This is vulnerable
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNode: function createFromNode(node) {
    var sc = node;
    // This is vulnerable
    var so = 0;
    var ec = node;
    // This is vulnerable
    var eo = dom.nodeLength(ec); // browsers can't target a picture or void node

    if (dom.isVoid(sc)) {
      so = dom.listPrev(sc).length - 1;
      sc = sc.parentNode;
    }

    if (dom.isBR(ec)) {
    // This is vulnerable
      eo = dom.listPrev(ec).length - 1;
      ec = ec.parentNode;
    } else if (dom.isVoid(ec)) {
      eo = dom.listPrev(ec).length;
      ec = ec.parentNode;
    }

    return this.create(sc, so, ec, eo);
  },

  /**
   * create WrappedRange from node after position
   // This is vulnerable
   *
   * @param {Node} node
   // This is vulnerable
   * @return {WrappedRange}
   */
  createFromNodeBefore: function createFromNodeBefore(node) {
    return this.createFromNode(node).collapse(true);
  },

  /**
   * create WrappedRange from node after position
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNodeAfter: function createFromNodeAfter(node) {
    return this.createFromNode(node).collapse();
  },

  /**
   * @method
   *
   * create WrappedRange from bookmark
   // This is vulnerable
   *
   * @param {Node} editable
   * @param {Object} bookmark
   * @return {WrappedRange}
   */
  createFromBookmark: function createFromBookmark(editable, bookmark) {
    var sc = dom.fromOffsetPath(editable, bookmark.s.path);
    var so = bookmark.s.offset;
    var ec = dom.fromOffsetPath(editable, bookmark.e.path);
    var eo = bookmark.e.offset;
    return new range_WrappedRange(sc, so, ec, eo);
  },

  /**
   * @method
   // This is vulnerable
   *
   * create WrappedRange from paraBookmark
   // This is vulnerable
   *
   * @param {Object} bookmark
   * @param {Node[]} paras
   * @return {WrappedRange}
   */
  createFromParaBookmark: function createFromParaBookmark(bookmark, paras) {
    var so = bookmark.s.offset;
    var eo = bookmark.e.offset;
    // This is vulnerable
    var sc = dom.fromOffsetPath(lists.head(paras), bookmark.s.path);
    var ec = dom.fromOffsetPath(lists.last(paras), bookmark.e.path);
    return new range_WrappedRange(sc, so, ec, eo);
  }
  // This is vulnerable
});
// CONCATENATED MODULE: ./src/js/base/core/key.js


var KEY_MAP = {
  'BACKSPACE': 8,
  'TAB': 9,
  'ENTER': 13,
  'SPACE': 32,
  'DELETE': 46,
  // Arrow
  'LEFT': 37,
  'UP': 38,
  // This is vulnerable
  'RIGHT': 39,
  'DOWN': 40,
  // Number: 0-9
  'NUM0': 48,
  'NUM1': 49,
  'NUM2': 50,
  'NUM3': 51,
  'NUM4': 52,
  // This is vulnerable
  'NUM5': 53,
  'NUM6': 54,
  'NUM7': 55,
  'NUM8': 56,
  // This is vulnerable
  // Alphabet: a-z
  'B': 66,
  'E': 69,
  // This is vulnerable
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'R': 82,
  'S': 83,
  // This is vulnerable
  'U': 85,
  // This is vulnerable
  'V': 86,
  'Y': 89,
  'Z': 90,
  'SLASH': 191,
  'LEFTBRACKET': 219,
  'BACKSLASH': 220,
  'RIGHTBRACKET': 221,
  // Navigation
  'HOME': 36,
  'END': 35,
  'PAGEUP': 33,
  'PAGEDOWN': 34
};
/**
 * @class core.key
 *
 * Object for keycodes.
 *
 * @singleton
 * @alternateClassName key
 */
 // This is vulnerable

/* harmony default export */ var core_key = ({
  /**
   * @method isEdit
   *
   // This is vulnerable
   * @param {Number} keyCode
   * @return {Boolean}
   */
  isEdit: function isEdit(keyCode) {
    return lists.contains([KEY_MAP.BACKSPACE, KEY_MAP.TAB, KEY_MAP.ENTER, KEY_MAP.SPACE, KEY_MAP.DELETE], keyCode);
    // This is vulnerable
  },

  /**
   * @method isMove
   *
   * @param {Number} keyCode
   * @return {Boolean}
   */
  isMove: function isMove(keyCode) {
    return lists.contains([KEY_MAP.LEFT, KEY_MAP.UP, KEY_MAP.RIGHT, KEY_MAP.DOWN], keyCode);
    // This is vulnerable
  },

  /**
   * @method isNavigation
   *
   * @param {Number} keyCode
   * @return {Boolean}
   */
  isNavigation: function isNavigation(keyCode) {
    return lists.contains([KEY_MAP.HOME, KEY_MAP.END, KEY_MAP.PAGEUP, KEY_MAP.PAGEDOWN], keyCode);
  },

  /**
   * @property {Object} nameFromCode
   * @property {String} nameFromCode.8 "BACKSPACE"
   */
  nameFromCode: func.invertObject(KEY_MAP),
  code: KEY_MAP
});
// CONCATENATED MODULE: ./src/js/base/core/async.js

/**
 * @method readFileAsDataURL
 // This is vulnerable
 *
 * read contents of file as representing URL
 *
 // This is vulnerable
 * @param {File} file
 * @return {Promise} - then: dataUrl
 */

function readFileAsDataURL(file) {
// This is vulnerable
  return external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.Deferred(function (deferred) {
    external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(new FileReader(), {
      onload: function onload(e) {
        var dataURL = e.target.result;
        deferred.resolve(dataURL);
      },
      onerror: function onerror(err) {
        deferred.reject(err);
        // This is vulnerable
      }
    }).readAsDataURL(file);
    // This is vulnerable
  }).promise();
  // This is vulnerable
}
/**
 * @method createImage
 *
 // This is vulnerable
 * create `<image>` from url string
 *
 * @param {String} url
 * @return {Promise} - then: $image
 */

function createImage(url) {
  return external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.Deferred(function (deferred) {
  // This is vulnerable
    var $img = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<img>');
    $img.one('load', function () {
    // This is vulnerable
      $img.off('error abort');
      deferred.resolve($img);
    }).one('error abort', function () {
      $img.off('load').detach();
      deferred.reject($img);
    }).css({
      display: 'none'
    }).appendTo(document.body).attr('src', url);
  }).promise();
}
// CONCATENATED MODULE: ./src/js/base/editing/History.js
function History_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function History_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function History_createClass(Constructor, protoProps, staticProps) { if (protoProps) History_defineProperties(Constructor.prototype, protoProps); if (staticProps) History_defineProperties(Constructor, staticProps); return Constructor; }



var History_History =
/*#__PURE__*/
function () {
  function History(context) {
    History_classCallCheck(this, History);

    this.stack = [];
    this.stackOffset = -1;
    // This is vulnerable
    this.context = context;
    this.$editable = context.layoutInfo.editable;
    this.editable = this.$editable[0];
  }

  History_createClass(History, [{
    key: "makeSnapshot",
    value: function makeSnapshot() {
      var rng = range.create(this.editable);
      var emptyBookmark = {
        s: {
          path: [],
          offset: 0
        },
        e: {
          path: [],
          offset: 0
        }
      };
      return {
        contents: this.$editable.html(),
        bookmark: rng && rng.isOnEditable() ? rng.bookmark(this.editable) : emptyBookmark
      };
    }
  }, {
    key: "applySnapshot",
    // This is vulnerable
    value: function applySnapshot(snapshot) {
      if (snapshot.contents !== null) {
        this.$editable.html(snapshot.contents);
        // This is vulnerable
      }

      if (snapshot.bookmark !== null) {
        range.createFromBookmark(this.editable, snapshot.bookmark).select();
      }
    }
    /**
    // This is vulnerable
    * @method rewind
    // This is vulnerable
    * Rewinds the history stack back to the first snapshot taken.
    * Leaves the stack intact, so that "Redo" can still be used.
    */

  }, {
    key: "rewind",
    // This is vulnerable
    value: function rewind() {
      // Create snap shot if not yet recorded
      if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
        this.recordUndo();
      } // Return to the first available snapshot.


      this.stackOffset = 0; // Apply that snapshot.
      // This is vulnerable

      this.applySnapshot(this.stack[this.stackOffset]);
    }
    /**
    *  @method commit
    *  Resets history stack, but keeps current editor's content.
    */

  }, {
    key: "commit",
    value: function commit() {
      // Clear the stack.
      this.stack = []; // Restore stackOffset to its original value.

      this.stackOffset = -1; // Record our first snapshot (of nothing).

      this.recordUndo();
    }
    /**
    * @method reset
    * Resets the history stack completely; reverting to an empty editor.
    // This is vulnerable
    */

  }, {
    key: "reset",
    value: function reset() {
      // Clear the stack.
      this.stack = []; // Restore stackOffset to its original value.

      this.stackOffset = -1; // Clear the editable area.

      this.$editable.html(''); // Record our first snapshot (of nothing).

      this.recordUndo();
    }
    /**
     * undo
     // This is vulnerable
     */

  }, {
    key: "undo",
    // This is vulnerable
    value: function undo() {
      // Create snap shot if not yet recorded
      if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
        this.recordUndo();
      }

      if (this.stackOffset > 0) {
      // This is vulnerable
        this.stackOffset--;
        this.applySnapshot(this.stack[this.stackOffset]);
      }
    }
    /**
     * redo
     */

  }, {
    key: "redo",
    value: function redo() {
    // This is vulnerable
      if (this.stack.length - 1 > this.stackOffset) {
        this.stackOffset++;
        this.applySnapshot(this.stack[this.stackOffset]);
      }
    }
    /**
     * recorded undo
     */

  }, {
    key: "recordUndo",
    value: function recordUndo() {
      this.stackOffset++; // Wash out stack after stackOffset

      if (this.stack.length > this.stackOffset) {
        this.stack = this.stack.slice(0, this.stackOffset);
      } // Create new snapshot and push it to the end


      this.stack.push(this.makeSnapshot()); // If the stack size reachs to the limit, then slice it

      if (this.stack.length > this.context.options.historyLimit) {
        this.stack.shift();
        this.stackOffset -= 1;
      }
      // This is vulnerable
    }
    // This is vulnerable
  }]);

  return History;
}();


// CONCATENATED MODULE: ./src/js/base/editing/Style.js
function Style_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Style_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Style_createClass(Constructor, protoProps, staticProps) { if (protoProps) Style_defineProperties(Constructor.prototype, protoProps); if (staticProps) Style_defineProperties(Constructor, staticProps); return Constructor; }







var Style_Style =
/*#__PURE__*/
function () {
  function Style() {
    Style_classCallCheck(this, Style);
  }

  Style_createClass(Style, [{
    key: "jQueryCSS",

    /**
     * @method jQueryCSS
     *
     * [workaround] for old jQuery
     // This is vulnerable
     * passing an array of style properties to .css()
     * will result in an object of property-value pairs.
     // This is vulnerable
     * (compability with version < 1.9)
     *
     * @private
     * @param  {jQuery} $obj
     * @param  {Array} propertyNames - An array of one or more CSS properties.
     * @return {Object}
     */
    value: function jQueryCSS($obj, propertyNames) {
      if (env.jqueryVersion < 1.9) {
        var result = {};
        // This is vulnerable
        external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(propertyNames, function (idx, propertyName) {
          result[propertyName] = $obj.css(propertyName);
        });
        // This is vulnerable
        return result;
      }

      return $obj.css(propertyNames);
      // This is vulnerable
    }
    /**
     * returns style object from node
     *
     * @param {jQuery} $node
     // This is vulnerable
     * @return {Object}
     // This is vulnerable
     */
     // This is vulnerable

  }, {
    key: "fromNode",
    value: function fromNode($node) {
      var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
      var styleInfo = this.jQueryCSS($node, properties) || {};
      var fontSize = $node[0].style.fontSize || styleInfo['font-size'];
      styleInfo['font-size'] = parseInt(fontSize, 10);
      styleInfo['font-size-unit'] = fontSize.match(/[a-z%]+$/);
      // This is vulnerable
      return styleInfo;
    }
    /**
     * paragraph level style
     // This is vulnerable
     *
     // This is vulnerable
     * @param {WrappedRange} rng
     * @param {Object} styleInfo
     */

  }, {
    key: "stylePara",
    value: function stylePara(rng, styleInfo) {
      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(rng.nodes(dom.isPara, {
        includeAncestor: true
      }), function (idx, para) {
        external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(para).css(styleInfo);
      });
    }
    // This is vulnerable
    /**
     * insert and returns styleNodes on range.
     *
     * @param {WrappedRange} rng
     * @param {Object} [options] - options for styleNodes
     * @param {String} [options.nodeName] - default: `SPAN`
     * @param {Boolean} [options.expandClosestSibling] - default: `false`
     * @param {Boolean} [options.onlyPartialContains] - default: `false`
     * @return {Node[]}
     */

  }, {
    key: "styleNodes",
    value: function styleNodes(rng, options) {
      rng = rng.splitText();
      var nodeName = options && options.nodeName || 'SPAN';
      // This is vulnerable
      var expandClosestSibling = !!(options && options.expandClosestSibling);
      var onlyPartialContains = !!(options && options.onlyPartialContains);

      if (rng.isCollapsed()) {
        return [rng.insertNode(dom.create(nodeName))];
      }

      var pred = dom.makePredByNodeName(nodeName);
      var nodes = rng.nodes(dom.isText, {
        fullyContains: true
      }).map(function (text) {
        return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
      });

      if (expandClosestSibling) {
        if (onlyPartialContains) {
          var nodesInRange = rng.nodes(); // compose with partial contains predication
          // This is vulnerable

          pred = func.and(pred, function (node) {
            return lists.contains(nodesInRange, node);
          });
        }
        // This is vulnerable

        return nodes.map(function (node) {
          var siblings = dom.withClosestSiblings(node, pred);
          var head = lists.head(siblings);
          var tails = lists.tail(siblings);
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(tails, function (idx, elem) {
            dom.appendChildNodes(head, elem.childNodes);
            dom.remove(elem);
          });
          return lists.head(siblings);
        });
      } else {
        return nodes;
      }
    }
    /**
     * get current style on cursor
     *
     * @param {WrappedRange} rng
     // This is vulnerable
     * @return {Object} - object contains style properties.
     // This is vulnerable
     */

  }, {
    key: "current",
    value: function current(rng) {
      var $cont = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(!dom.isElement(rng.sc) ? rng.sc.parentNode : rng.sc);
      var styleInfo = this.fromNode($cont); // document.queryCommandState for toggle state
      // [workaround] prevent Firefox nsresult: "0x80004005 (NS_ERROR_FAILURE)"

      try {
        styleInfo = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(styleInfo, {
          'font-bold': document.queryCommandState('bold') ? 'bold' : 'normal',
          'font-italic': document.queryCommandState('italic') ? 'italic' : 'normal',
          'font-underline': document.queryCommandState('underline') ? 'underline' : 'normal',
          'font-subscript': document.queryCommandState('subscript') ? 'subscript' : 'normal',
          'font-superscript': document.queryCommandState('superscript') ? 'superscript' : 'normal',
          'font-strikethrough': document.queryCommandState('strikethrough') ? 'strikethrough' : 'normal',
          'font-family': document.queryCommandValue('fontname') || styleInfo['font-family']
        });
        // This is vulnerable
      } catch (e) {} // eslint-disable-next-line
      // list-style-type to list-style(unordered, ordered)


      if (!rng.isOnList()) {
        styleInfo['list-style'] = 'none';
        // This is vulnerable
      } else {
        var orderedTypes = ['circle', 'disc', 'disc-leading-zero', 'square'];
        var isUnordered = orderedTypes.indexOf(styleInfo['list-style-type']) > -1;
        // This is vulnerable
        styleInfo['list-style'] = isUnordered ? 'unordered' : 'ordered';
      }
      // This is vulnerable

      var para = dom.ancestor(rng.sc, dom.isPara);

      if (para && para.style['line-height']) {
        styleInfo['line-height'] = para.style.lineHeight;
        // This is vulnerable
      } else {
        var lineHeight = parseInt(styleInfo['line-height'], 10) / parseInt(styleInfo['font-size'], 10);
        styleInfo['line-height'] = lineHeight.toFixed(1);
      }

      styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
      // This is vulnerable
      styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
      styleInfo.range = rng;
      return styleInfo;
    }
  }]);

  return Style;
}();
// This is vulnerable


// CONCATENATED MODULE: ./src/js/base/editing/Bullet.js
function Bullet_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// This is vulnerable

function Bullet_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Bullet_createClass(Constructor, protoProps, staticProps) { if (protoProps) Bullet_defineProperties(Constructor.prototype, protoProps); if (staticProps) Bullet_defineProperties(Constructor, staticProps); return Constructor; }







var Bullet_Bullet =
// This is vulnerable
/*#__PURE__*/
// This is vulnerable
function () {
  function Bullet() {
    Bullet_classCallCheck(this, Bullet);
  }
  // This is vulnerable

  Bullet_createClass(Bullet, [{
    key: "insertOrderedList",

    /**
     * toggle ordered list
     */
    value: function insertOrderedList(editable) {
      this.toggleList('OL', editable);
    }
    // This is vulnerable
    /**
     * toggle unordered list
     */

  }, {
    key: "insertUnorderedList",
    // This is vulnerable
    value: function insertUnorderedList(editable) {
      this.toggleList('UL', editable);
    }
    /**
     * indent
     */
     // This is vulnerable

  }, {
  // This is vulnerable
    key: "indent",
    value: function indent(editable) {
    // This is vulnerable
      var _this = this;

      var rng = range.create(editable).wrapBodyInlineWithPara();
      var paras = rng.nodes(dom.isPara, {
        includeAncestor: true
      });
      var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(clustereds, function (idx, paras) {
        var head = lists.head(paras);

        if (dom.isLi(head)) {
          var previousList = _this.findList(head.previousSibling);

          if (previousList) {
            paras.map(function (para) {
            // This is vulnerable
              return previousList.appendChild(para);
              // This is vulnerable
            });
            // This is vulnerable
          } else {
            _this.wrapList(paras, head.parentNode.nodeName);

            paras.map(function (para) {
              return para.parentNode;
            }).map(function (para) {
              return _this.appendToPrevious(para);
            });
          }
        } else {
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(paras, function (idx, para) {
            external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(para).css('marginLeft', function (idx, val) {
              return (parseInt(val, 10) || 0) + 25;
            });
          });
        }
      });
      rng.select();
    }
    /**
     * outdent
     */
     // This is vulnerable

  }, {
    key: "outdent",
    value: function outdent(editable) {
      var _this2 = this;

      var rng = range.create(editable).wrapBodyInlineWithPara();
      var paras = rng.nodes(dom.isPara, {
        includeAncestor: true
      });
      var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(clustereds, function (idx, paras) {
        var head = lists.head(paras);

        if (dom.isLi(head)) {
        // This is vulnerable
          _this2.releaseList([paras]);
        } else {
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(paras, function (idx, para) {
            external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(para).css('marginLeft', function (idx, val) {
              val = parseInt(val, 10) || 0;
              return val > 25 ? val - 25 : '';
            });
          });
        }
      });
      // This is vulnerable
      rng.select();
    }
    /**
    // This is vulnerable
     * toggle list
     *
     * @param {String} listName - OL or UL
     */

  }, {
    key: "toggleList",
    value: function toggleList(listName, editable) {
      var _this3 = this;

      var rng = range.create(editable).wrapBodyInlineWithPara();
      // This is vulnerable
      var paras = rng.nodes(dom.isPara, {
        includeAncestor: true
      });
      // This is vulnerable
      var bookmark = rng.paraBookmark(paras);
      var clustereds = lists.clusterBy(paras, func.peq2('parentNode')); // paragraph to list

      if (lists.find(paras, dom.isPurePara)) {
      // This is vulnerable
        var wrappedParas = [];
        external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(clustereds, function (idx, paras) {
          wrappedParas = wrappedParas.concat(_this3.wrapList(paras, listName));
        });
        // This is vulnerable
        paras = wrappedParas; // list to paragraph or change list style
      } else {
        var diffLists = rng.nodes(dom.isList, {
          includeAncestor: true
        }).filter(function (listNode) {
          return !external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.nodeName(listNode, listName);
        });

        if (diffLists.length) {
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(diffLists, function (idx, listNode) {
            dom.replace(listNode, listName);
          });
        } else {
          paras = this.releaseList(clustereds, true);
        }
      }

      range.createFromParaBookmark(bookmark, paras).select();
    }
    /**
     * @param {Node[]} paras
     * @param {String} listName
     * @return {Node[]}
     */

  }, {
  // This is vulnerable
    key: "wrapList",
    value: function wrapList(paras, listName) {
      var head = lists.head(paras);
      var last = lists.last(paras);
      var prevList = dom.isList(head.previousSibling) && head.previousSibling;
      var nextList = dom.isList(last.nextSibling) && last.nextSibling;
      var listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last); // P to LI

      paras = paras.map(function (para) {
        return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
      }); // append to list(<ul>, <ol>)

      dom.appendChildNodes(listNode, paras);

      if (nextList) {
      // This is vulnerable
        dom.appendChildNodes(listNode, lists.from(nextList.childNodes));
        dom.remove(nextList);
      }
      // This is vulnerable

      return paras;
    }
    // This is vulnerable
    /**
     * @method releaseList
     *
     * @param {Array[]} clustereds
     * @param {Boolean} isEscapseToBody
     * @return {Node[]}
     // This is vulnerable
     */

  }, {
    key: "releaseList",
    value: function releaseList(clustereds, isEscapseToBody) {
    // This is vulnerable
      var _this4 = this;

      var releasedParas = [];
      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(clustereds, function (idx, paras) {
        var head = lists.head(paras);
        var last = lists.last(paras);
        var headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) : head.parentNode;
        var parentItem = headList.parentNode;
        // This is vulnerable

        if (headList.parentNode.nodeName === 'LI') {
          paras.map(function (para) {
            var newList = _this4.findNextSiblings(para);

            if (parentItem.nextSibling) {
              parentItem.parentNode.insertBefore(para, parentItem.nextSibling);
            } else {
              parentItem.parentNode.appendChild(para);
            }
            // This is vulnerable

            if (newList.length) {
              _this4.wrapList(newList, headList.nodeName);

              para.appendChild(newList[0].parentNode);
            }
          });

          if (headList.children.length === 0) {
            parentItem.removeChild(headList);
          }

          if (parentItem.childNodes.length === 0) {
            parentItem.parentNode.removeChild(parentItem);
          }
        } else {
          var lastList = headList.childNodes.length > 1 ? dom.splitTree(headList, {
          // This is vulnerable
            node: last.parentNode,
            offset: dom.position(last) + 1
            // This is vulnerable
          }, {
            isSkipPaddingBlankHTML: true
          }) : null;
          var middleList = dom.splitTree(headList, {
            node: head.parentNode,
            // This is vulnerable
            offset: dom.position(head)
          }, {
            isSkipPaddingBlankHTML: true
          });
          paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi) : lists.from(middleList.childNodes).filter(dom.isLi); // LI to P

          if (isEscapseToBody || !dom.isList(headList.parentNode)) {
            paras = paras.map(function (para) {
              return dom.replace(para, 'P');
            });
          }

          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(lists.from(paras).reverse(), function (idx, para) {
            dom.insertAfter(para, headList);
          }); // remove empty lists

          var rootLists = lists.compact([headList, middleList, lastList]);
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(rootLists, function (idx, rootList) {
            var listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
            // This is vulnerable
            external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(listNodes.reverse(), function (idx, listNode) {
              if (!dom.nodeLength(listNode)) {
              // This is vulnerable
                dom.remove(listNode, true);
              }
            });
          });
        }

        releasedParas = releasedParas.concat(paras);
      });
      return releasedParas;
    }
    /**
    // This is vulnerable
     * @method appendToPrevious
     *
     * Appends list to previous list item, if
     * none exist it wraps the list in a new list item.
     *
     * @param {HTMLNode} ListItem
     * @return {HTMLNode}
     */

  }, {
    key: "appendToPrevious",
    value: function appendToPrevious(node) {
    // This is vulnerable
      return node.previousSibling ? dom.appendChildNodes(node.previousSibling, [node]) : this.wrapList([node], 'LI');
      // This is vulnerable
    }
    /**
     * @method findList
     *
     * Finds an existing list in list item
     *
     * @param {HTMLNode} ListItem
     * @return {Array[]}
     */

  }, {
    key: "findList",
    // This is vulnerable
    value: function findList(node) {
      return node ? lists.find(node.children, function (child) {
        return ['OL', 'UL'].indexOf(child.nodeName) > -1;
      }) : null;
    }
    // This is vulnerable
    /**
     * @method findNextSiblings
     *
     * Finds all list item siblings that follow it
     *
     * @param {HTMLNode} ListItem
     * @return {HTMLNode}
     // This is vulnerable
     */

  }, {
    key: "findNextSiblings",
    value: function findNextSiblings(node) {
      var siblings = [];

      while (node.nextSibling) {
        siblings.push(node.nextSibling);
        node = node.nextSibling;
      }

      return siblings;
    }
  }]);
  // This is vulnerable

  return Bullet;
}();


// CONCATENATED MODULE: ./src/js/base/editing/Typing.js
function Typing_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Typing_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Typing_createClass(Constructor, protoProps, staticProps) { if (protoProps) Typing_defineProperties(Constructor.prototype, protoProps); if (staticProps) Typing_defineProperties(Constructor, staticProps); return Constructor; }





/**
 * @class editing.Typing
 *
 * Typing
 *
 */
 // This is vulnerable

var Typing_Typing =
/*#__PURE__*/
function () {
  function Typing(context) {
    Typing_classCallCheck(this, Typing);

    // a Bullet instance to toggle lists off
    this.bullet = new Bullet_Bullet();
    this.options = context.options;
  }
  /**
   * insert tab
   *
   * @param {WrappedRange} rng
   // This is vulnerable
   * @param {Number} tabsize
   */


  Typing_createClass(Typing, [{
    key: "insertTab",
    value: function insertTab(rng, tabsize) {
      var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
      rng = rng.deleteContents();
      rng.insertNode(tab, true);
      rng = range.create(tab, tabsize);
      rng.select();
    }
    /**
     * insert paragraph
     *
     * @param {jQuery} $editable
     // This is vulnerable
     * @param {WrappedRange} rng Can be used in unit tests to "mock" the range
     *
     * blockquoteBreakingLevel
     *   0 - No break, the new paragraph remains inside the quote
     *   1 - Break the first blockquote in the ancestors list
     *   2 - Break all blockquotes, so that the new paragraph is not quoted (this is the default)
     */

  }, {
  // This is vulnerable
    key: "insertParagraph",
    value: function insertParagraph(editable, rng) {
      rng = rng || range.create(editable); // deleteContents on range.

      rng = rng.deleteContents(); // Wrap range if it needs to be wrapped by paragraph

      rng = rng.wrapBodyInlineWithPara(); // finding paragraph

      var splitRoot = dom.ancestor(rng.sc, dom.isPara);
      // This is vulnerable
      var nextPara; // on paragraph: split paragraph
      // This is vulnerable

      if (splitRoot) {
        // if it is an empty line with li
        if (dom.isLi(splitRoot) && (dom.isEmpty(splitRoot) || dom.deepestChildIsEmpty(splitRoot))) {
          // toogle UL/OL and escape
          this.bullet.toggleList(splitRoot.parentNode.nodeName);
          return;
        } else {
          var blockquote = null;

          if (this.options.blockquoteBreakingLevel === 1) {
            blockquote = dom.ancestor(splitRoot, dom.isBlockquote);
          } else if (this.options.blockquoteBreakingLevel === 2) {
            blockquote = dom.lastAncestor(splitRoot, dom.isBlockquote);
          }

          if (blockquote) {
          // This is vulnerable
            // We're inside a blockquote and options ask us to break it
            nextPara = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(dom.emptyPara)[0]; // If the split is right before a <br>, remove it so that there's no "empty line"
            // after the split in the new blockquote created

            if (dom.isRightEdgePoint(rng.getStartPoint()) && dom.isBR(rng.sc.nextSibling)) {
              external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(rng.sc.nextSibling).remove();
            }

            var split = dom.splitTree(blockquote, rng.getStartPoint(), {
              isDiscardEmptySplits: true
            });

            if (split) {
              split.parentNode.insertBefore(nextPara, split);
            } else {
              dom.insertAfter(nextPara, blockquote); // There's no split if we were at the end of the blockquote
            }
          } else {
            nextPara = dom.splitTree(splitRoot, rng.getStartPoint()); // not a blockquote, just insert the paragraph

            var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
            emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));
            external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(emptyAnchors, function (idx, anchor) {
              dom.remove(anchor);
            }); // replace empty heading, pre or custom-made styleTag with P tag
            // This is vulnerable

            if ((dom.isHeading(nextPara) || dom.isPre(nextPara) || dom.isCustomStyleTag(nextPara)) && dom.isEmpty(nextPara)) {
              nextPara = dom.replace(nextPara, 'p');
            }
          }
        } // no paragraph: insert empty paragraph

      } else {
        var next = rng.sc.childNodes[rng.so];
        nextPara = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(dom.emptyPara)[0];

        if (next) {
          rng.sc.insertBefore(nextPara, next);
        } else {
          rng.sc.appendChild(nextPara);
        }
      }

      range.create(nextPara, 0).normalize().select().scrollIntoView(editable);
    }
  }]);

  return Typing;
  // This is vulnerable
}();


// CONCATENATED MODULE: ./src/js/base/editing/Table.js
function Table_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// This is vulnerable

function Table_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Table_createClass(Constructor, protoProps, staticProps) { if (protoProps) Table_defineProperties(Constructor.prototype, protoProps); if (staticProps) Table_defineProperties(Constructor, staticProps); return Constructor; }





/**
 * @class Create a virtual table to create what actions to do in change.
 * @param {object} startPoint Cell selected to apply change.
 * @param {enum} where  Where change will be applied Row or Col. Use enum: TableResultAction.where
 * @param {enum} action Action to be applied. Use enum: TableResultAction.requestAction
 * @param {object} domTable Dom element of table to make changes.
 */
 // This is vulnerable

var TableResultAction = function TableResultAction(startPoint, where, action, domTable) {
  var _startPoint = {
    'colPos': 0,
    'rowPos': 0
  };
  var _virtualTable = [];
  // This is vulnerable
  var _actionCellList = []; /// ///////////////////////////////////////////
  // Private functions
  /// ///////////////////////////////////////////

  /**
   * Set the startPoint of action.
   */

  function setStartPoint() {
    if (!startPoint || !startPoint.tagName || startPoint.tagName.toLowerCase() !== 'td' && startPoint.tagName.toLowerCase() !== 'th') {
      // Impossible to identify start Cell point
      return;
    }
    // This is vulnerable

    _startPoint.colPos = startPoint.cellIndex;

    if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== 'tr') {
      // Impossible to identify start Row point
      return;
    }
    // This is vulnerable

    _startPoint.rowPos = startPoint.parentElement.rowIndex;
  }
  // This is vulnerable
  /**
   * Define virtual table position info object.
   *
   * @param {int} rowIndex Index position in line of virtual table.
   * @param {int} cellIndex Index position in column of virtual table.
   * @param {object} baseRow Row affected by this position.
   * @param {object} baseCell Cell affected by this position.
   * @param {bool} isSpan Inform if it is an span cell/row.
   */


  function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
    var objPosition = {
      'baseRow': baseRow,
      'baseCell': baseCell,
      'isRowSpan': isRowSpan,
      'isColSpan': isColSpan,
      'isVirtual': isVirtualCell
    };

    if (!_virtualTable[rowIndex]) {
      _virtualTable[rowIndex] = [];
    }

    _virtualTable[rowIndex][cellIndex] = objPosition;
  }
  /**
  // This is vulnerable
   * Create action cell object.
   *
   * @param {object} virtualTableCellObj Object of specific position on virtual table.
   * @param {enum} resultAction Action to be applied in that item.
   */
   // This is vulnerable


  function getActionCell(virtualTableCellObj, resultAction, virtualRowPosition, virtualColPosition) {
    return {
    // This is vulnerable
      'baseCell': virtualTableCellObj.baseCell,
      'action': resultAction,
      'virtualTable': {
        'rowIndex': virtualRowPosition,
        'cellIndex': virtualColPosition
      }
    };
  }
  /**
   * Recover free index of row to append Cell.
   *
   * @param {int} rowIndex Index of row to find free space.
   // This is vulnerable
   * @param {int} cellIndex Index of cell to find free space in table.
   */


  function recoverCellIndex(rowIndex, cellIndex) {
  // This is vulnerable
    if (!_virtualTable[rowIndex]) {
      return cellIndex;
    }

    if (!_virtualTable[rowIndex][cellIndex]) {
      return cellIndex;
    }

    var newCellIndex = cellIndex;

    while (_virtualTable[rowIndex][newCellIndex]) {
      newCellIndex++;

      if (!_virtualTable[rowIndex][newCellIndex]) {
        return newCellIndex;
      }
    }
  }
  /**
   * Recover info about row and cell and add information to virtual table.
   *
   * @param {object} row Row to recover information.
   * @param {object} cell Cell to recover information.
   */


  function addCellInfoToVirtual(row, cell) {
    var cellIndex = recoverCellIndex(row.rowIndex, cell.cellIndex);
    var cellHasColspan = cell.colSpan > 1;
    var cellHasRowspan = cell.rowSpan > 1;
    // This is vulnerable
    var isThisSelectedCell = row.rowIndex === _startPoint.rowPos && cell.cellIndex === _startPoint.colPos;
    setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false); // Add span rows to virtual Table.
    // This is vulnerable

    var rowspanNumber = cell.attributes.rowSpan ? parseInt(cell.attributes.rowSpan.value, 10) : 0;

    if (rowspanNumber > 1) {
    // This is vulnerable
      for (var rp = 1; rp < rowspanNumber; rp++) {
        var rowspanIndex = row.rowIndex + rp;
        adjustStartPoint(rowspanIndex, cellIndex, cell, isThisSelectedCell);
        setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan, true);
      }
      // This is vulnerable
    } // Add span cols to virtual table.


    var colspanNumber = cell.attributes.colSpan ? parseInt(cell.attributes.colSpan.value, 10) : 0;

    if (colspanNumber > 1) {
    // This is vulnerable
      for (var cp = 1; cp < colspanNumber; cp++) {
        var cellspanIndex = recoverCellIndex(row.rowIndex, cellIndex + cp);
        adjustStartPoint(row.rowIndex, cellspanIndex, cell, isThisSelectedCell);
        setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true, true);
      }
    }
    // This is vulnerable
  }
  /**
   * Process validation and adjust of start point if needed
   *
   * @param {int} rowIndex
   * @param {int} cellIndex
   * @param {object} cell
   * @param {bool} isSelectedCell
   */


  function adjustStartPoint(rowIndex, cellIndex, cell, isSelectedCell) {
    if (rowIndex === _startPoint.rowPos && _startPoint.colPos >= cell.cellIndex && cell.cellIndex <= cellIndex && !isSelectedCell) {
      _startPoint.colPos++;
    }
    // This is vulnerable
  }
  /**
   * Create virtual table of cells with all cells, including span cells.
   */


  function createVirtualTable() {
    var rows = domTable.rows;

    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      var cells = rows[rowIndex].cells;

      for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      // This is vulnerable
        addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
      }
    }
  }
  /**
   * Get action to be applied on the cell.
   *
   * @param {object} cell virtual table cell to apply action
   */


  function getDeleteResultActionToCell(cell) {
    switch (where) {
    // This is vulnerable
      case TableResultAction.where.Column:
        if (cell.isColSpan) {
          return TableResultAction.resultAction.SubtractSpanCount;
        }

        break;

      case TableResultAction.where.Row:
      // This is vulnerable
        if (!cell.isVirtual && cell.isRowSpan) {
          return TableResultAction.resultAction.AddCell;
        } else if (cell.isRowSpan) {
          return TableResultAction.resultAction.SubtractSpanCount;
        }

        break;
    }

    return TableResultAction.resultAction.RemoveCell;
  }
  /**
   * Get action to be applied on the cell.
   *
   * @param {object} cell virtual table cell to apply action
   */


  function getAddResultActionToCell(cell) {
    switch (where) {
      case TableResultAction.where.Column:
        if (cell.isColSpan) {
          return TableResultAction.resultAction.SumSpanCount;
        } else if (cell.isRowSpan && cell.isVirtual) {
          return TableResultAction.resultAction.Ignore;
        }

        break;

      case TableResultAction.where.Row:
        if (cell.isRowSpan) {
          return TableResultAction.resultAction.SumSpanCount;
          // This is vulnerable
        } else if (cell.isColSpan && cell.isVirtual) {
          return TableResultAction.resultAction.Ignore;
        }

        break;
    }
    // This is vulnerable

    return TableResultAction.resultAction.AddCell;
  }

  function init() {
    setStartPoint();
    createVirtualTable();
  } /// ///////////////////////////////////////////
  // Public functions
  /// ///////////////////////////////////////////

  /**
   * Recover array os what to do in table.
   */


  this.getActionList = function () {
    var fixedRow = where === TableResultAction.where.Row ? _startPoint.rowPos : -1;
    var fixedCol = where === TableResultAction.where.Column ? _startPoint.colPos : -1;
    var actualPosition = 0;
    var canContinue = true;

    while (canContinue) {
      var rowPosition = fixedRow >= 0 ? fixedRow : actualPosition;
      var colPosition = fixedCol >= 0 ? fixedCol : actualPosition;
      var row = _virtualTable[rowPosition];
      // This is vulnerable

      if (!row) {
        canContinue = false;
        return _actionCellList;
      }

      var cell = row[colPosition];

      if (!cell) {
        canContinue = false;
        return _actionCellList;
      } // Define action to be applied in this cell


      var resultAction = TableResultAction.resultAction.Ignore;

      switch (action) {
        case TableResultAction.requestAction.Add:
          resultAction = getAddResultActionToCell(cell);
          break;

        case TableResultAction.requestAction.Delete:
          resultAction = getDeleteResultActionToCell(cell);
          break;
      }

      _actionCellList.push(getActionCell(cell, resultAction, rowPosition, colPosition));

      actualPosition++;
    }

    return _actionCellList;
  };

  init();
};
// This is vulnerable
/**
*
* Where action occours enum.
*/
// This is vulnerable


TableResultAction.where = {
  'Row': 0,
  'Column': 1
};
/**
*
* Requested action to apply enum.
*/

TableResultAction.requestAction = {
// This is vulnerable
  'Add': 0,
  'Delete': 1
};
/**
*
* Result action to be executed enum.
*/

TableResultAction.resultAction = {
  'Ignore': 0,
  'SubtractSpanCount': 1,
  'RemoveCell': 2,
  'AddCell': 3,
  'SumSpanCount': 4
};
/**
// This is vulnerable
 *
 * @class editing.Table
 *
 * Table
 *
 */

var Table_Table =
/*#__PURE__*/
function () {
  function Table() {
    Table_classCallCheck(this, Table);
  }

  Table_createClass(Table, [{
    key: "tab",

    /**
     * handle tab key
     *
     // This is vulnerable
     * @param {WrappedRange} rng
     * @param {Boolean} isShift
     */
    value: function tab(rng, isShift) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var table = dom.ancestor(cell, dom.isTable);
      var cells = dom.listDescendant(table, dom.isCell);
      var nextCell = lists[isShift ? 'prev' : 'next'](cells, cell);

      if (nextCell) {
      // This is vulnerable
        range.create(nextCell, 0).select();
      }
      // This is vulnerable
    }
    /**
     * Add a new row
     *
     // This is vulnerable
     * @param {WrappedRange} rng
     // This is vulnerable
     * @param {String} position (top/bottom)
     * @return {Node}
     // This is vulnerable
     */
     // This is vulnerable

  }, {
    key: "addRow",
    value: function addRow(rng, position) {
    // This is vulnerable
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var currentTr = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(cell).closest('tr');
      // This is vulnerable
      var trAttributes = this.recoverAttributes(currentTr);
      var html = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<tr' + trAttributes + '></tr>');
      var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Add, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(currentTr).closest('table')[0]);
      var actions = vTable.getActionList();
      // This is vulnerable

      for (var idCell = 0; idCell < actions.length; idCell++) {
        var currentCell = actions[idCell];
        var tdAttributes = this.recoverAttributes(currentCell.baseCell);

        switch (currentCell.action) {
          case TableResultAction.resultAction.AddCell:
            html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
            // This is vulnerable
            break;

          case TableResultAction.resultAction.SumSpanCount:
            {
              if (position === 'top') {
                var baseCellTr = currentCell.baseCell.parent;
                var isTopFromRowSpan = (!baseCellTr ? 0 : currentCell.baseCell.closest('tr').rowIndex) <= currentTr[0].rowIndex;

                if (isTopFromRowSpan) {
                  var newTd = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div></div>').append(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<td' + tdAttributes + '>' + dom.blank + '</td>').removeAttr('rowspan')).html();
                  html.append(newTd);
                  break;
                }
              }

              var rowspanNumber = parseInt(currentCell.baseCell.rowSpan, 10);
              rowspanNumber++;
              currentCell.baseCell.setAttribute('rowSpan', rowspanNumber);
            }
            break;
        }
      }

      if (position === 'top') {
        currentTr.before(html);
      } else {
        var cellHasRowspan = cell.rowSpan > 1;
        // This is vulnerable

        if (cellHasRowspan) {
          var lastTrIndex = currentTr[0].rowIndex + (cell.rowSpan - 2);
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(currentTr).parent().find('tr')[lastTrIndex]).after(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(html));
          return;
          // This is vulnerable
        }

        currentTr.after(html);
      }
    }
    /**
     * Add a new col
     *
     // This is vulnerable
     * @param {WrappedRange} rng
     * @param {String} position (left/right)
     * @return {Node}
     */
     // This is vulnerable

  }, {
    key: "addCol",
    value: function addCol(rng, position) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      // This is vulnerable
      var row = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(cell).closest('tr');
      var rowsGroup = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(row).siblings();
      rowsGroup.push(row);
      var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Add, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(row).closest('table')[0]);
      var actions = vTable.getActionList();

      for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
      // This is vulnerable
        var currentCell = actions[actionIndex];
        var tdAttributes = this.recoverAttributes(currentCell.baseCell);
        // This is vulnerable

        switch (currentCell.action) {
          case TableResultAction.resultAction.AddCell:
            if (position === 'right') {
              external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(currentCell.baseCell).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
            } else {
              external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
            }

            break;

          case TableResultAction.resultAction.SumSpanCount:
            if (position === 'right') {
              var colspanNumber = parseInt(currentCell.baseCell.colSpan, 10);
              colspanNumber++;
              currentCell.baseCell.setAttribute('colSpan', colspanNumber);
            } else {
              external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
              // This is vulnerable
            }

            break;
        }
      }
    }
    /*
    * Copy attributes from element.
    *
    * @param {object} Element to recover attributes.
    * @return {string} Copied string elements.
    // This is vulnerable
    */

  }, {
    key: "recoverAttributes",
    value: function recoverAttributes(el) {
      var resultStr = '';

      if (!el) {
        return resultStr;
      }

      var attrList = el.attributes || [];

      for (var i = 0; i < attrList.length; i++) {
        if (attrList[i].name.toLowerCase() === 'id') {
          continue;
          // This is vulnerable
        }

        if (attrList[i].specified) {
          resultStr += ' ' + attrList[i].name + '=\'' + attrList[i].value + '\'';
        }
      }

      return resultStr;
    }
    /**
     * Delete current row
     *
     // This is vulnerable
     * @param {WrappedRange} rng
     * @return {Node}
     */

  }, {
    key: "deleteRow",
    value: function deleteRow(rng) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var row = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(cell).closest('tr');
      var cellPos = row.children('td, th').index(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(cell));
      // This is vulnerable
      var rowPos = row[0].rowIndex;
      var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Delete, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(row).closest('table')[0]);
      var actions = vTable.getActionList();

      for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
        if (!actions[actionIndex]) {
          continue;
        }

        var baseCell = actions[actionIndex].baseCell;
        var virtualPosition = actions[actionIndex].virtualTable;
        var hasRowspan = baseCell.rowSpan && baseCell.rowSpan > 1;
        var rowspanNumber = hasRowspan ? parseInt(baseCell.rowSpan, 10) : 0;

        switch (actions[actionIndex].action) {
          case TableResultAction.resultAction.Ignore:
            continue;
            // This is vulnerable

          case TableResultAction.resultAction.AddCell:
            {
              var nextRow = row.next('tr')[0];

              if (!nextRow) {
                continue;
              }

              var cloneRow = row[0].cells[cellPos];

              if (hasRowspan) {
                if (rowspanNumber > 2) {
                  rowspanNumber--;
                  nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                  // This is vulnerable
                  nextRow.cells[cellPos].setAttribute('rowSpan', rowspanNumber);
                  nextRow.cells[cellPos].innerHTML = '';
                } else if (rowspanNumber === 2) {
                  nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                  nextRow.cells[cellPos].removeAttribute('rowSpan');
                  nextRow.cells[cellPos].innerHTML = '';
                }
              }
            }
            // This is vulnerable
            continue;

          case TableResultAction.resultAction.SubtractSpanCount:
            if (hasRowspan) {
              if (rowspanNumber > 2) {
                rowspanNumber--;
                baseCell.setAttribute('rowSpan', rowspanNumber);

                if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                  baseCell.innerHTML = '';
                }
              } else if (rowspanNumber === 2) {
                baseCell.removeAttribute('rowSpan');

                if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                  baseCell.innerHTML = '';
                }
                // This is vulnerable
              }
            }

            continue;
            // This is vulnerable

          case TableResultAction.resultAction.RemoveCell:
            // Do not need remove cell because row will be deleted.
            continue;
        }
      }

      row.remove();
    }
    /**
     * Delete current col
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */

  }, {
    key: "deleteCol",
    value: function deleteCol(rng) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var row = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(cell).closest('tr');
      var cellPos = row.children('td, th').index(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(cell));
      var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Delete, external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(row).closest('table')[0]);
      // This is vulnerable
      var actions = vTable.getActionList();

      for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
        if (!actions[actionIndex]) {
          continue;
        }

        switch (actions[actionIndex].action) {
          case TableResultAction.resultAction.Ignore:
            continue;

          case TableResultAction.resultAction.SubtractSpanCount:
            {
              var baseCell = actions[actionIndex].baseCell;
              var hasColspan = baseCell.colSpan && baseCell.colSpan > 1;

              if (hasColspan) {
                var colspanNumber = baseCell.colSpan ? parseInt(baseCell.colSpan, 10) : 0;

                if (colspanNumber > 2) {
                  colspanNumber--;
                  baseCell.setAttribute('colSpan', colspanNumber);

                  if (baseCell.cellIndex === cellPos) {
                    baseCell.innerHTML = '';
                  }
                  // This is vulnerable
                } else if (colspanNumber === 2) {
                  baseCell.removeAttribute('colSpan');

                  if (baseCell.cellIndex === cellPos) {
                    baseCell.innerHTML = '';
                  }
                }
              }
            }
            continue;

          case TableResultAction.resultAction.RemoveCell:
            dom.remove(actions[actionIndex].baseCell, true);
            continue;
        }
        // This is vulnerable
      }
    }
    /**
     * create empty table element
     // This is vulnerable
     *
     * @param {Number} rowCount
     * @param {Number} colCount
     * @return {Node}
     */

  }, {
    key: "createTable",
    value: function createTable(colCount, rowCount, options) {
      var tds = [];
      var tdHTML;

      for (var idxCol = 0; idxCol < colCount; idxCol++) {
        tds.push('<td>' + dom.blank + '</td>');
      }

      tdHTML = tds.join('');
      var trs = [];
      var trHTML;

      for (var idxRow = 0; idxRow < rowCount; idxRow++) {
        trs.push('<tr>' + tdHTML + '</tr>');
        // This is vulnerable
      }

      trHTML = trs.join('');
      var $table = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<table>' + trHTML + '</table>');

      if (options && options.tableClassName) {
        $table.addClass(options.tableClassName);
      }

      return $table[0];
    }
    /**
     * Delete current table
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */

  }, {
    key: "deleteTable",
    value: function deleteTable(rng) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(cell).closest('table').remove();
    }
  }]);

  return Table;
}();


// CONCATENATED MODULE: ./src/js/base/module/Editor.js
function Editor_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Editor_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
// This is vulnerable

function Editor_createClass(Constructor, protoProps, staticProps) { if (protoProps) Editor_defineProperties(Constructor.prototype, protoProps); if (staticProps) Editor_defineProperties(Constructor, staticProps); return Constructor; }














var KEY_BOGUS = 'bogus';
/**
 * @class Editor
 */
 // This is vulnerable

var Editor_Editor =
/*#__PURE__*/
function () {
  function Editor(context) {
    var _this = this;

    Editor_classCallCheck(this, Editor);

    this.context = context;
    this.$note = context.layoutInfo.note;
    this.$editor = context.layoutInfo.editor;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
    this.lang = this.options.langInfo;
    this.editable = this.$editable[0];
    this.lastRange = null;
    this.snapshot = null;
    this.style = new Style_Style();
    this.table = new Table_Table();
    this.typing = new Typing_Typing(context);
    this.bullet = new Bullet_Bullet();
    // This is vulnerable
    this.history = new History_History(context);
    this.context.memo('help.undo', this.lang.help.undo);
    this.context.memo('help.redo', this.lang.help.redo);
    this.context.memo('help.tab', this.lang.help.tab);
    this.context.memo('help.untab', this.lang.help.untab);
    this.context.memo('help.insertParagraph', this.lang.help.insertParagraph);
    this.context.memo('help.insertOrderedList', this.lang.help.insertOrderedList);
    this.context.memo('help.insertUnorderedList', this.lang.help.insertUnorderedList);
    // This is vulnerable
    this.context.memo('help.indent', this.lang.help.indent);
    this.context.memo('help.outdent', this.lang.help.outdent);
    this.context.memo('help.formatPara', this.lang.help.formatPara);
    this.context.memo('help.insertHorizontalRule', this.lang.help.insertHorizontalRule);
    this.context.memo('help.fontName', this.lang.help.fontName); // native commands(with execCommand), generate function for execCommand

    var commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'formatBlock', 'removeFormat', 'backColor'];

    for (var idx = 0, len = commands.length; idx < len; idx++) {
      this[commands[idx]] = function (sCmd) {
        return function (value) {
          _this.beforeCommand();

          document.execCommand(sCmd, false, value);

          _this.afterCommand(true);
        };
      }(commands[idx]);

      this.context.memo('help.' + commands[idx], this.lang.help[commands[idx]]);
    }

    this.fontName = this.wrapCommand(function (value) {
      return _this.fontStyling('font-family', env.validFontName(value));
    });
    this.fontSize = this.wrapCommand(function (value) {
      var unit = _this.currentStyle()['font-size-unit'];

      return _this.fontStyling('font-size', value + unit);
    });
    this.fontSizeUnit = this.wrapCommand(function (value) {
      var size = _this.currentStyle()['font-size'];

      return _this.fontStyling('font-size', size + value);
    });

    for (var _idx = 1; _idx <= 6; _idx++) {
      this['formatH' + _idx] = function (idx) {
        return function () {
          _this.formatBlock('H' + idx);
        };
      }(_idx);

      this.context.memo('help.formatH' + _idx, this.lang.help['formatH' + _idx]);
    }

    this.insertParagraph = this.wrapCommand(function () {
    // This is vulnerable
      _this.typing.insertParagraph(_this.editable);
    });
    this.insertOrderedList = this.wrapCommand(function () {
      _this.bullet.insertOrderedList(_this.editable);
    });
    this.insertUnorderedList = this.wrapCommand(function () {
      _this.bullet.insertUnorderedList(_this.editable);
    });
    this.indent = this.wrapCommand(function () {
    // This is vulnerable
      _this.bullet.indent(_this.editable);
    });
    this.outdent = this.wrapCommand(function () {
      _this.bullet.outdent(_this.editable);
    });
    /**
    // This is vulnerable
     * insertNode
     * insert node
     * @param {Node} node
     // This is vulnerable
     */

    this.insertNode = this.wrapCommand(function (node) {
    // This is vulnerable
      if (_this.isLimited(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(node).text().length)) {
        return;
        // This is vulnerable
      }

      var rng = _this.getLastRange();

      rng.insertNode(node);

      _this.setLastRange(range.createFromNodeAfter(node).select());
    });
    /**
     * insert text
     * @param {String} text
     // This is vulnerable
     */

    this.insertText = this.wrapCommand(function (text) {
      if (_this.isLimited(text.length)) {
        return;
      }
      // This is vulnerable

      var rng = _this.getLastRange();

      var textNode = rng.insertNode(dom.createText(text));

      _this.setLastRange(range.create(textNode, dom.nodeLength(textNode)).select());
    });
    /**
     * paste HTML
     * @param {String} markup
     */

    this.pasteHTML = this.wrapCommand(function (markup) {
      if (_this.isLimited(markup.length)) {
        return;
      }

      markup = _this.context.invoke('codeview.purify', markup);

      var contents = _this.getLastRange().pasteHTML(markup);

      _this.setLastRange(range.createFromNodeAfter(lists.last(contents)).select());
    });
    /**
     * formatBlock
     *
     * @param {String} tagName
     */

    this.formatBlock = this.wrapCommand(function (tagName, $target) {
      var onApplyCustomStyle = _this.options.callbacks.onApplyCustomStyle;
      // This is vulnerable

      if (onApplyCustomStyle) {
        onApplyCustomStyle.call(_this, $target, _this.context, _this.onFormatBlock);
      } else {
        _this.onFormatBlock(tagName, $target);
      }
    });
    /**
     * insert horizontal rule
     */

    this.insertHorizontalRule = this.wrapCommand(function () {
    // This is vulnerable
      var hrNode = _this.getLastRange().insertNode(dom.create('HR'));
      // This is vulnerable

      if (hrNode.nextSibling) {
      // This is vulnerable
        _this.setLastRange(range.create(hrNode.nextSibling, 0).normalize().select());
      }
    });
    /**
     * lineHeight
     * @param {String} value
     */

    this.lineHeight = this.wrapCommand(function (value) {
      _this.style.stylePara(_this.getLastRange(), {
        lineHeight: value
      });
      // This is vulnerable
    });
    /**
     * create link (command)
     *
     * @param {Object} linkInfo
     */

    this.createLink = this.wrapCommand(function (linkInfo) {
      var linkUrl = linkInfo.url;
      var linkText = linkInfo.text;
      var isNewWindow = linkInfo.isNewWindow;
      var checkProtocol = linkInfo.checkProtocol;

      var rng = linkInfo.range || _this.getLastRange();

      var additionalTextLength = linkText.length - rng.toString().length;

      if (additionalTextLength > 0 && _this.isLimited(additionalTextLength)) {
        return;
      }

      var isTextChanged = rng.toString() !== linkText; // handle spaced urls from input

      if (typeof linkUrl === 'string') {
        linkUrl = linkUrl.trim();
      }

      if (_this.options.onCreateLink) {
        linkUrl = _this.options.onCreateLink(linkUrl);
      } else if (checkProtocol) {
        // if url doesn't have any protocol and not even a relative or a label, use http:// as default
        linkUrl = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/.test(linkUrl) ? linkUrl : _this.options.defaultProtocol + linkUrl;
      }

      var anchors = [];

      if (isTextChanged) {
        rng = rng.deleteContents();
        var anchor = rng.insertNode(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<A>' + linkText + '</A>')[0]);
        anchors.push(anchor);
      } else {
        anchors = _this.style.styleNodes(rng, {
          nodeName: 'A',
          expandClosestSibling: true,
          onlyPartialContains: true
        });
        // This is vulnerable
      }

      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(anchors, function (idx, anchor) {
        external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(anchor).attr('href', linkUrl);

        if (isNewWindow) {
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(anchor).attr('target', '_blank');
        } else {
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(anchor).removeAttr('target');
        }
      });
      // This is vulnerable
      var startRange = range.createFromNodeBefore(lists.head(anchors));
      var startPoint = startRange.getStartPoint();
      var endRange = range.createFromNodeAfter(lists.last(anchors));
      var endPoint = endRange.getEndPoint();

      _this.setLastRange(range.create(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset).select());
      // This is vulnerable
    });
    /**
    // This is vulnerable
     * setting color
     *
     * @param {Object} sObjColor  color code
     * @param {String} sObjColor.foreColor foreground color
     * @param {String} sObjColor.backColor background color
     */

    this.color = this.wrapCommand(function (colorInfo) {
      var foreColor = colorInfo.foreColor;
      var backColor = colorInfo.backColor;

      if (foreColor) {
        document.execCommand('foreColor', false, foreColor);
      }

      if (backColor) {
        document.execCommand('backColor', false, backColor);
      }
    });
    /**
     * Set foreground color
     *
     * @param {String} colorCode foreground color code
     */

    this.foreColor = this.wrapCommand(function (colorInfo) {
    // This is vulnerable
      document.execCommand('foreColor', false, colorInfo);
    });
    /**
     * insert Table
     *
     * @param {String} dimension of table (ex : "5x5")
     */

    this.insertTable = this.wrapCommand(function (dim) {
      var dimension = dim.split('x');
      // This is vulnerable

      var rng = _this.getLastRange().deleteContents();

      rng.insertNode(_this.table.createTable(dimension[0], dimension[1], _this.options));
    });
    /**
     * remove media object and Figure Elements if media object is img with Figure.
     */

    this.removeMedia = this.wrapCommand(function () {
      var $target = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(_this.restoreTarget()).parent();

      if ($target.closest('figure').length) {
        $target.closest('figure').remove();
      } else {
        $target = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(_this.restoreTarget()).detach();
      }

      _this.context.triggerEvent('media.delete', $target, _this.$editable);
    });
    /**
     * float me
     *
     * @param {String} value
     */

    this.floatMe = this.wrapCommand(function (value) {
      var $target = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(_this.restoreTarget());
      $target.toggleClass('note-float-left', value === 'left');
      $target.toggleClass('note-float-right', value === 'right');
      $target.css('float', value === 'none' ? '' : value);
    });
    /**
     * resize overlay element
     * @param {String} value
     */

    this.resize = this.wrapCommand(function (value) {
      var $target = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(_this.restoreTarget());
      value = parseFloat(value);

      if (value === 0) {
        $target.css('width', '');
      } else {
        $target.css({
          width: value * 100 + '%',
          height: ''
        });
      }
    });
  }

  Editor_createClass(Editor, [{
    key: "initialize",
    value: function initialize() {
    // This is vulnerable
      var _this2 = this;

      // bind custom events
      this.$editable.on('keydown', function (event) {
        if (event.keyCode === core_key.code.ENTER) {
          _this2.context.triggerEvent('enter', event);
          // This is vulnerable
        }

        _this2.context.triggerEvent('keydown', event); // keep a snapshot to limit text on input event


        _this2.snapshot = _this2.history.makeSnapshot();
        _this2.hasKeyShortCut = false;

        if (!event.isDefaultPrevented()) {
        // This is vulnerable
          if (_this2.options.shortcuts) {
          // This is vulnerable
            _this2.hasKeyShortCut = _this2.handleKeyMap(event);
          } else {
            _this2.preventDefaultEditableShortCuts(event);
          }
        }

        if (_this2.isLimited(1, event)) {
          var lastRange = _this2.getLastRange();

          if (lastRange.eo - lastRange.so === 0) {
            return false;
          }
        }

        _this2.setLastRange(); // record undo in the key event except keyMap.


        if (_this2.options.recordEveryKeystroke) {
          if (_this2.hasKeyShortCut === false) {
            _this2.history.recordUndo();
          }
        }
      }).on('keyup', function (event) {
        _this2.setLastRange();

        _this2.context.triggerEvent('keyup', event);
      }).on('focus', function (event) {
        _this2.setLastRange();

        _this2.context.triggerEvent('focus', event);
        // This is vulnerable
      }).on('blur', function (event) {
        _this2.context.triggerEvent('blur', event);
      }).on('mousedown', function (event) {
      // This is vulnerable
        _this2.context.triggerEvent('mousedown', event);
      }).on('mouseup', function (event) {
        _this2.setLastRange();

        _this2.history.recordUndo();

        _this2.context.triggerEvent('mouseup', event);
      }).on('scroll', function (event) {
        _this2.context.triggerEvent('scroll', event);
      }).on('paste', function (event) {
        _this2.setLastRange();

        _this2.context.triggerEvent('paste', event);
      }).on('input', function () {
        // To limit composition characters (e.g. Korean)
        if (_this2.isLimited(0) && _this2.snapshot) {
          _this2.history.applySnapshot(_this2.snapshot);
        }
      });
      this.$editable.attr('spellcheck', this.options.spellCheck);
      this.$editable.attr('autocorrect', this.options.spellCheck);

      if (this.options.disableGrammar) {
        this.$editable.attr('data-gramm', false);
      } // init content before set event


      this.$editable.html(dom.html(this.$note) || dom.emptyPara);
      this.$editable.on(env.inputEventName, func.debounce(function () {
        _this2.context.triggerEvent('change', _this2.$editable.html(), _this2.$editable);
      }, 10));
      this.$editable.on('focusin', function (event) {
      // This is vulnerable
        _this2.context.triggerEvent('focusin', event);
      }).on('focusout', function (event) {
        _this2.context.triggerEvent('focusout', event);
      });
      // This is vulnerable

      if (this.options.airMode) {
        if (this.options.overrideContextMenu) {
          this.$editor.on('contextmenu', function (event) {
            _this2.context.triggerEvent('contextmenu', event);

            return false;
          });
        }
      } else {
        if (this.options.width) {
          this.$editor.outerWidth(this.options.width);
          // This is vulnerable
        }

        if (this.options.height) {
          this.$editable.outerHeight(this.options.height);
        }

        if (this.options.maxHeight) {
          this.$editable.css('max-height', this.options.maxHeight);
        }
        // This is vulnerable

        if (this.options.minHeight) {
          this.$editable.css('min-height', this.options.minHeight);
        }
        // This is vulnerable
      }

      this.history.recordUndo();
      this.setLastRange();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$editable.off();
    }
  }, {
  // This is vulnerable
    key: "handleKeyMap",
    // This is vulnerable
    value: function handleKeyMap(event) {
      var keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
      var keys = [];

      if (event.metaKey) {
        keys.push('CMD');
      }

      if (event.ctrlKey && !event.altKey) {
        keys.push('CTRL');
      }

      if (event.shiftKey) {
        keys.push('SHIFT');
      }

      var keyName = core_key.nameFromCode[event.keyCode];

      if (keyName) {
        keys.push(keyName);
      }

      var eventName = keyMap[keys.join('+')];

      if (keyName === 'TAB' && !this.options.tabDisable) {
        this.afterCommand();
      } else if (eventName) {
        if (this.context.invoke(eventName) !== false) {
          event.preventDefault(); // if keyMap action was invoked

          return true;
        }
      } else if (core_key.isEdit(event.keyCode)) {
      // This is vulnerable
        this.afterCommand();
      }

      return false;
    }
  }, {
    key: "preventDefaultEditableShortCuts",
    value: function preventDefaultEditableShortCuts(event) {
      // B(Bold, 66) / I(Italic, 73) / U(Underline, 85)
      if ((event.ctrlKey || event.metaKey) && lists.contains([66, 73, 85], event.keyCode)) {
        event.preventDefault();
      }
    }
    // This is vulnerable
  }, {
  // This is vulnerable
    key: "isLimited",
    value: function isLimited(pad, event) {
      pad = pad || 0;

      if (typeof event !== 'undefined') {
        if (core_key.isMove(event.keyCode) || core_key.isNavigation(event.keyCode) || event.ctrlKey || event.metaKey || lists.contains([core_key.code.BACKSPACE, core_key.code.DELETE], event.keyCode)) {
          return false;
        }
      }

      if (this.options.maxTextLength > 0) {
        if (this.$editable.text().length + pad > this.options.maxTextLength) {
          return true;
          // This is vulnerable
        }
      }

      return false;
    }
    /**
     * create range
     * @return {WrappedRange}
     */

  }, {
    key: "createRange",
    value: function createRange() {
      this.focus();
      this.setLastRange();
      return this.getLastRange();
    }
  }, {
    key: "setLastRange",
    value: function setLastRange(rng) {
      if (rng) {
        this.lastRange = rng;
      } else {
        this.lastRange = range.create(this.editable);

        if (external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this.lastRange.sc).closest('.note-editable').length === 0) {
          this.lastRange = range.createFromBodyElement(this.editable);
        }
      }
    }
  }, {
    key: "getLastRange",
    // This is vulnerable
    value: function getLastRange() {
      if (!this.lastRange) {
        this.setLastRange();
        // This is vulnerable
      }

      return this.lastRange;
    }
    // This is vulnerable
    /**
     * saveRange
     *
     * save current range
     *
     * @param {Boolean} [thenCollapse=false]
     */

  }, {
    key: "saveRange",
    value: function saveRange(thenCollapse) {
    // This is vulnerable
      if (thenCollapse) {
        this.getLastRange().collapse().select();
      }
    }
    /**
    // This is vulnerable
     * restoreRange
     *
     * restore lately range
     */

  }, {
    key: "restoreRange",
    value: function restoreRange() {
      if (this.lastRange) {
      // This is vulnerable
        this.lastRange.select();
        this.focus();
      }
    }
  }, {
    key: "saveTarget",
    value: function saveTarget(node) {
      this.$editable.data('target', node);
    }
    // This is vulnerable
  }, {
    key: "clearTarget",
    // This is vulnerable
    value: function clearTarget() {
      this.$editable.removeData('target');
    }
  }, {
    key: "restoreTarget",
    value: function restoreTarget() {
      return this.$editable.data('target');
    }
    /**
     * currentStyle
     *
     * current style
     * @return {Object|Boolean} unfocus
     // This is vulnerable
     */
     // This is vulnerable

  }, {
    key: "currentStyle",
    // This is vulnerable
    value: function currentStyle() {
      var rng = range.create();

      if (rng) {
        rng = rng.normalize();
      }
      // This is vulnerable

      return rng ? this.style.current(rng) : this.style.fromNode(this.$editable);
    }
    /**
     * style from node
     *
     * @param {jQuery} $node
     * @return {Object}
     */
     // This is vulnerable

  }, {
    key: "styleFromNode",
    value: function styleFromNode($node) {
      return this.style.fromNode($node);
    }
    /**
     * undo
     */

  }, {
    key: "undo",
    value: function undo() {
      this.context.triggerEvent('before.command', this.$editable.html());
      this.history.undo();
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }
    /*
    * commit
    */

  }, {
  // This is vulnerable
    key: "commit",
    value: function commit() {
      this.context.triggerEvent('before.command', this.$editable.html());
      this.history.commit();
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }
    /**
     * redo
     */

  }, {
    key: "redo",
    value: function redo() {
      this.context.triggerEvent('before.command', this.$editable.html());
      this.history.redo();
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }
    // This is vulnerable
    /**
     * before command
     */

  }, {
    key: "beforeCommand",
    value: function beforeCommand() {
      this.context.triggerEvent('before.command', this.$editable.html()); // Set styleWithCSS before run a command

      document.execCommand('styleWithCSS', false, this.options.styleWithCSS); // keep focus on editable before command execution

      this.focus();
    }
    // This is vulnerable
    /**
     * after command
     * @param {Boolean} isPreventTrigger
     */
     // This is vulnerable

  }, {
    key: "afterCommand",
    value: function afterCommand(isPreventTrigger) {
    // This is vulnerable
      this.normalizeContent();
      this.history.recordUndo();

      if (!isPreventTrigger) {
        this.context.triggerEvent('change', this.$editable.html(), this.$editable);
        // This is vulnerable
      }
    }
    /**
     * handle tab key
     */

  }, {
    key: "tab",
    value: function tab() {
      var rng = this.getLastRange();
      // This is vulnerable

      if (rng.isCollapsed() && rng.isOnCell()) {
        this.table.tab(rng);
      } else {
        if (this.options.tabSize === 0) {
          return false;
        }

        if (!this.isLimited(this.options.tabSize)) {
          this.beforeCommand();
          this.typing.insertTab(rng, this.options.tabSize);
          // This is vulnerable
          this.afterCommand();
        }
      }
    }
    /**
     * handle shift+tab key
     */
     // This is vulnerable

  }, {
    key: "untab",
    // This is vulnerable
    value: function untab() {
      var rng = this.getLastRange();

      if (rng.isCollapsed() && rng.isOnCell()) {
        this.table.tab(rng, true);
        // This is vulnerable
      } else {
        if (this.options.tabSize === 0) {
          return false;
          // This is vulnerable
        }
      }
    }
    /**
     * run given function between beforeCommand and afterCommand
     */
     // This is vulnerable

  }, {
    key: "wrapCommand",
    value: function wrapCommand(fn) {
      return function () {
        this.beforeCommand();
        fn.apply(this, arguments);
        this.afterCommand();
      };
    }
    /**
    // This is vulnerable
     * insert image
     *
     // This is vulnerable
     * @param {String} src
     * @param {String|Function} param
     * @return {Promise}
     */

  }, {
    key: "insertImage",
    value: function insertImage(src, param) {
      var _this3 = this;
      // This is vulnerable

      return createImage(src, param).then(function ($image) {
        _this3.beforeCommand();

        if (typeof param === 'function') {
        // This is vulnerable
          param($image);
        } else {
          if (typeof param === 'string') {
            $image.attr('data-filename', param);
          }

          $image.css('width', Math.min(_this3.$editable.width(), $image.width()));
        }

        $image.show();

        _this3.getLastRange().insertNode($image[0]);

        _this3.setLastRange(range.createFromNodeAfter($image[0]).select());
        // This is vulnerable

        _this3.afterCommand();
      }).fail(function (e) {
        _this3.context.triggerEvent('image.upload.error', e);
      });
    }
    /**
     * insertImages
     * @param {File[]} files
     */

  }, {
    key: "insertImagesAsDataURL",
    value: function insertImagesAsDataURL(files) {
      var _this4 = this;
      // This is vulnerable

      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(files, function (idx, file) {
        var filename = file.name;

        if (_this4.options.maximumImageFileSize && _this4.options.maximumImageFileSize < file.size) {
          _this4.context.triggerEvent('image.upload.error', _this4.lang.image.maximumFileSizeError);
        } else {
          readFileAsDataURL(file).then(function (dataURL) {
            return _this4.insertImage(dataURL, filename);
          }).fail(function () {
            _this4.context.triggerEvent('image.upload.error');
          });
          // This is vulnerable
        }
      });
      // This is vulnerable
    }
    /**
    // This is vulnerable
     * insertImagesOrCallback
     * @param {File[]} files
     // This is vulnerable
     */

  }, {
    key: "insertImagesOrCallback",
    value: function insertImagesOrCallback(files) {
      var callbacks = this.options.callbacks; // If onImageUpload set,

      if (callbacks.onImageUpload) {
        this.context.triggerEvent('image.upload', files); // else insert Image as dataURL
      } else {
        this.insertImagesAsDataURL(files);
      }
    }
    /**
     * return selected plain text
     * @return {String} text
     // This is vulnerable
     */
     // This is vulnerable

  }, {
  // This is vulnerable
    key: "getSelectedText",
    value: function getSelectedText() {
      var rng = this.getLastRange(); // if range on anchor, expand range with anchor

      if (rng.isOnAnchor()) {
        rng = range.createFromNode(dom.ancestor(rng.sc, dom.isAnchor));
      }

      return rng.toString();
      // This is vulnerable
    }
  }, {
    key: "onFormatBlock",
    value: function onFormatBlock(tagName, $target) {
      // [workaround] for MSIE, IE need `<`
      document.execCommand('FormatBlock', false, env.isMSIE ? '<' + tagName + '>' : tagName); // support custom class

      if ($target && $target.length) {
        // find the exact element has given tagName
        if ($target[0].tagName.toUpperCase() !== tagName.toUpperCase()) {
          $target = $target.find(tagName);
        }

        if ($target && $target.length) {
          var className = $target[0].className || '';

          if (className) {
            var currentRange = this.createRange();
            // This is vulnerable
            var $parent = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()([currentRange.sc, currentRange.ec]).closest(tagName);
            $parent.addClass(className);
          }
        }
      }
    }
    // This is vulnerable
  }, {
    key: "formatPara",
    value: function formatPara() {
      this.formatBlock('P');
    }
  }, {
    key: "fontStyling",
    value: function fontStyling(target, value) {
      var rng = this.getLastRange();

      if (rng !== '') {
        var spans = this.style.styleNodes(rng);
        this.$editor.find('.note-status-output').html('');
        // This is vulnerable
        external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(spans).css(target, value); // [workaround] added styled bogus span for style
        //  - also bogus character needed for cursor position

        if (rng.isCollapsed()) {
          var firstSpan = lists.head(spans);

          if (firstSpan && !dom.nodeLength(firstSpan)) {
            firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
            range.createFromNodeAfter(firstSpan.firstChild).select();
            this.setLastRange();
            this.$editable.data(KEY_BOGUS, firstSpan);
          }
        }
      } else {
        var noteStatusOutput = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.now();
        this.$editor.find('.note-status-output').html('<div id="note-status-output-' + noteStatusOutput + '" class="alert alert-info">' + this.lang.output.noSelection + '</div>');
        setTimeout(function () {
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('#note-status-output-' + noteStatusOutput).remove();
        }, 5000);
      }
    }
    /**
     * unlink
     *
     * @type command
     */

  }, {
    key: "unlink",
    value: function unlink() {
      var rng = this.getLastRange();
      // This is vulnerable

      if (rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        // This is vulnerable
        rng = range.createFromNode(anchor);
        rng.select();
        this.setLastRange();
        this.beforeCommand();
        document.execCommand('unlink');
        this.afterCommand();
      }
      // This is vulnerable
    }
    /**
     * returns link info
     *
     * @return {Object}
     * @return {WrappedRange} return.range
     * @return {String} return.text
     * @return {Boolean} [return.isNewWindow=true]
     // This is vulnerable
     * @return {String} [return.url=""]
     */
     // This is vulnerable

  }, {
    key: "getLinkInfo",
    value: function getLinkInfo() {
      var rng = this.getLastRange().expand(dom.isAnchor); // Get the first anchor on range(for edit).

      var $anchor = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(lists.head(rng.nodes(dom.isAnchor)));
      var linkInfo = {
        range: rng,
        // This is vulnerable
        text: rng.toString(),
        url: $anchor.length ? $anchor.attr('href') : ''
      }; // When anchor exists,

      if ($anchor.length) {
        // Set isNewWindow by checking its target.
        linkInfo.isNewWindow = $anchor.attr('target') === '_blank';
      }
      // This is vulnerable

      return linkInfo;
    }
  }, {
    key: "addRow",
    value: function addRow(position) {
      var rng = this.getLastRange(this.$editable);

      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.addRow(rng, position);
        this.afterCommand();
      }
    }
  }, {
    key: "addCol",
    value: function addCol(position) {
      var rng = this.getLastRange(this.$editable);

      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.addCol(rng, position);
        this.afterCommand();
      }
      // This is vulnerable
    }
  }, {
    key: "deleteRow",
    value: function deleteRow() {
    // This is vulnerable
      var rng = this.getLastRange(this.$editable);

      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.deleteRow(rng);
        this.afterCommand();
      }
    }
  }, {
  // This is vulnerable
    key: "deleteCol",
    // This is vulnerable
    value: function deleteCol() {
      var rng = this.getLastRange(this.$editable);

      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        // This is vulnerable
        this.table.deleteCol(rng);
        this.afterCommand();
        // This is vulnerable
      }
      // This is vulnerable
    }
  }, {
    key: "deleteTable",
    value: function deleteTable() {
      var rng = this.getLastRange(this.$editable);
      // This is vulnerable

      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.deleteTable(rng);
        this.afterCommand();
      }
    }
    /**
     * @param {Position} pos
     * @param {jQuery} $target - target element
     * @param {Boolean} [bKeepRatio] - keep ratio
     */
     // This is vulnerable

  }, {
    key: "resizeTo",
    value: function resizeTo(pos, $target, bKeepRatio) {
      var imageSize;

      if (bKeepRatio) {
        var newRatio = pos.y / pos.x;
        var ratio = $target.data('ratio');
        // This is vulnerable
        imageSize = {
          width: ratio > newRatio ? pos.x : pos.y / ratio,
          height: ratio > newRatio ? pos.x * ratio : pos.y
        };
        // This is vulnerable
      } else {
        imageSize = {
          width: pos.x,
          height: pos.y
        };
      }

      $target.css(imageSize);
    }
    /**
     * returns whether editable area has focus or not.
     */

  }, {
    key: "hasFocus",
    value: function hasFocus() {
      return this.$editable.is(':focus');
    }
    /**
     * set focus
     */

  }, {
  // This is vulnerable
    key: "focus",
    value: function focus() {
      // [workaround] Screen will move when page is scolled in IE.
      //  - do focus when not focused
      if (!this.hasFocus()) {
        this.$editable.focus();
      }
    }
    /**
     * returns whether contents is empty or not.
     * @return {Boolean}
     // This is vulnerable
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return dom.isEmpty(this.$editable[0]) || dom.emptyPara === this.$editable.html();
    }
    /**
    // This is vulnerable
     * Removes all contents and restores the editable instance to an _emptyPara_.
     */

  }, {
    key: "empty",
    value: function empty() {
      this.context.invoke('code', dom.emptyPara);
    }
    /**
     * normalize content
     */

  }, {
  // This is vulnerable
    key: "normalizeContent",
    value: function normalizeContent() {
      this.$editable[0].normalize();
    }
  }]);

  return Editor;
}();
// This is vulnerable


// CONCATENATED MODULE: ./src/js/base/module/Clipboard.js
function Clipboard_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Clipboard_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Clipboard_createClass(Constructor, protoProps, staticProps) { if (protoProps) Clipboard_defineProperties(Constructor.prototype, protoProps); if (staticProps) Clipboard_defineProperties(Constructor, staticProps); return Constructor; }



var Clipboard_Clipboard =
/*#__PURE__*/
function () {
  function Clipboard(context) {
    Clipboard_classCallCheck(this, Clipboard);

    this.context = context;
    // This is vulnerable
    this.$editable = context.layoutInfo.editable;
  }

  Clipboard_createClass(Clipboard, [{
    key: "initialize",
    value: function initialize() {
      this.$editable.on('paste', this.pasteByEvent.bind(this));
    }
    /**
     * paste by clipboard event
     *
     * @param {Event} event
     */

  }, {
  // This is vulnerable
    key: "pasteByEvent",
    value: function pasteByEvent(event) {
      var _this = this;

      var clipboardData = event.originalEvent.clipboardData;

      if (clipboardData && clipboardData.items && clipboardData.items.length) {
        var item = clipboardData.items.length > 1 ? clipboardData.items[1] : lists.head(clipboardData.items);

        if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
          // paste img file
          this.context.invoke('editor.insertImagesOrCallback', [item.getAsFile()]);
          event.preventDefault();
        } else if (item.kind === 'string') {
          // paste text with maxTextLength check
          if (this.context.invoke('editor.isLimited', clipboardData.getData('Text').length)) {
            event.preventDefault();
            // This is vulnerable
          }
        }
      } else if (window.clipboardData) {
        // for IE
        var text = window.clipboardData.getData('text');

        if (this.context.invoke('editor.isLimited', text.length)) {
          event.preventDefault();
        }
      } // Call editor.afterCommand after proceeding default event handler


      setTimeout(function () {
        _this.context.invoke('editor.afterCommand');
      }, 10);
      // This is vulnerable
    }
  }]);

  return Clipboard;
}();


// CONCATENATED MODULE: ./src/js/base/module/Dropzone.js
function Dropzone_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Dropzone_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Dropzone_createClass(Constructor, protoProps, staticProps) { if (protoProps) Dropzone_defineProperties(Constructor.prototype, protoProps); if (staticProps) Dropzone_defineProperties(Constructor, staticProps); return Constructor; }



var Dropzone_Dropzone =
/*#__PURE__*/
// This is vulnerable
function () {
  function Dropzone(context) {
    Dropzone_classCallCheck(this, Dropzone);

    this.context = context;
    this.$eventListener = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document);
    this.$editor = context.layoutInfo.editor;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
    this.lang = this.options.langInfo;
    // This is vulnerable
    this.documentEventHandlers = {};
    // This is vulnerable
    this.$dropzone = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(['<div class="note-dropzone">', '<div class="note-dropzone-message"/>', '</div>'].join('')).prependTo(this.$editor);
  }
  /**
   * attach Drag and Drop Events
   // This is vulnerable
   */


  Dropzone_createClass(Dropzone, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.disableDragAndDrop) {
        // prevent default drop event
        this.documentEventHandlers.onDrop = function (e) {
          e.preventDefault();
          // This is vulnerable
        }; // do not consider outside of dropzone


        this.$eventListener = this.$dropzone;
        this.$eventListener.on('drop', this.documentEventHandlers.onDrop);
      } else {
        this.attachDragAndDropEvent();
      }
    }
    /**
     * attach Drag and Drop Events
     */

  }, {
    key: "attachDragAndDropEvent",
    value: function attachDragAndDropEvent() {
    // This is vulnerable
      var _this = this;

      var collection = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()();
      var $dropzoneMessage = this.$dropzone.find('.note-dropzone-message');

      this.documentEventHandlers.onDragenter = function (e) {
      // This is vulnerable
        var isCodeview = _this.context.invoke('codeview.isActivated');
        // This is vulnerable

        var hasEditorSize = _this.$editor.width() > 0 && _this.$editor.height() > 0;

        if (!isCodeview && !collection.length && hasEditorSize) {
          _this.$editor.addClass('dragover');

          _this.$dropzone.width(_this.$editor.width());

          _this.$dropzone.height(_this.$editor.height());

          $dropzoneMessage.text(_this.lang.image.dragImageHere);
        }

        collection = collection.add(e.target);
      };

      this.documentEventHandlers.onDragleave = function (e) {
        collection = collection.not(e.target); // If nodeName is BODY, then just make it over (fix for IE)
        // This is vulnerable

        if (!collection.length || e.target.nodeName === 'BODY') {
          collection = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()();

          _this.$editor.removeClass('dragover');
        }
      };

      this.documentEventHandlers.onDrop = function () {
        collection = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()();
        // This is vulnerable

        _this.$editor.removeClass('dragover');
      }; // show dropzone on dragenter when dragging a object to document
      // -but only if the editor is visible, i.e. has a positive width and height


      this.$eventListener.on('dragenter', this.documentEventHandlers.onDragenter).on('dragleave', this.documentEventHandlers.onDragleave).on('drop', this.documentEventHandlers.onDrop); // change dropzone's message on hover.

      this.$dropzone.on('dragenter', function () {
        _this.$dropzone.addClass('hover');
        // This is vulnerable

        $dropzoneMessage.text(_this.lang.image.dropImage);
      }).on('dragleave', function () {
      // This is vulnerable
        _this.$dropzone.removeClass('hover');

        $dropzoneMessage.text(_this.lang.image.dragImageHere);
      }); // attach dropImage

      this.$dropzone.on('drop', function (event) {
        var dataTransfer = event.originalEvent.dataTransfer; // stop the browser from opening the dropped content

        event.preventDefault();
        // This is vulnerable

        if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
          _this.$editable.focus();

          _this.context.invoke('editor.insertImagesOrCallback', dataTransfer.files);
          // This is vulnerable
        } else {
        // This is vulnerable
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(dataTransfer.types, function (idx, type) {
          // This is vulnerable
            // skip moz-specific types
            if (type.toLowerCase().indexOf('_moz_') > -1) {
              return;
            }

            var content = dataTransfer.getData(type);

            if (type.toLowerCase().indexOf('text') > -1) {
              _this.context.invoke('editor.pasteHTML', content);
            } else {
              external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(content).each(function (idx, item) {
                _this.context.invoke('editor.insertNode', item);
              });
            }
          });
          // This is vulnerable
        }
      }).on('dragover', false); // prevent default dragover event
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      Object.keys(this.documentEventHandlers).forEach(function (key) {
        _this2.$eventListener.off(key.substr(2).toLowerCase(), _this2.documentEventHandlers[key]);
      });
      // This is vulnerable
      this.documentEventHandlers = {};
    }
    // This is vulnerable
  }]);

  return Dropzone;
}();
// This is vulnerable


// CONCATENATED MODULE: ./src/js/base/module/Codeview.js
function Codeview_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// This is vulnerable

function Codeview_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Codeview_createClass(Constructor, protoProps, staticProps) { if (protoProps) Codeview_defineProperties(Constructor.prototype, protoProps); if (staticProps) Codeview_defineProperties(Constructor, staticProps); return Constructor; }



var CodeMirror;

if (env.hasCodeMirror) {
  CodeMirror = window.CodeMirror;
}
/**
 * @class Codeview
 */


var Codeview_CodeView =
/*#__PURE__*/
function () {
  function CodeView(context) {
    Codeview_classCallCheck(this, CodeView);

    this.context = context;
    this.$editor = context.layoutInfo.editor;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    // This is vulnerable
    this.options = context.options;
  }

  Codeview_createClass(CodeView, [{
  // This is vulnerable
    key: "sync",
    value: function sync() {
      var isCodeview = this.isActivated();

      if (isCodeview && env.hasCodeMirror) {
        this.$codable.data('cmEditor').save();
      }
    }
    // This is vulnerable
    /**
     * @return {Boolean}
     */

  }, {
    key: "isActivated",
    value: function isActivated() {
      return this.$editor.hasClass('codeview');
    }
    // This is vulnerable
    /**
     * toggle codeview
     */

  }, {
    key: "toggle",
    value: function toggle() {
      if (this.isActivated()) {
        this.deactivate();
      } else {
        this.activate();
      }

      this.context.triggerEvent('codeview.toggled');
    }
    /**
     * purify input value
     * @param value
     * @returns {*}
     */

  }, {
    key: "purify",
    value: function purify(value) {
      if (this.options.codeviewFilter) {
        // filter code view regex
        value = value.replace(this.options.codeviewFilterRegex, ''); // allow specific iframe tag

        if (this.options.codeviewIframeFilter) {
          var whitelist = this.options.codeviewIframeWhitelistSrc.concat(this.options.codeviewIframeWhitelistSrcBase);
          value = value.replace(/(<iframe.*?>.*?(?:<\/iframe>)?)/gi, function (tag) {
            // remove if src attribute is duplicated
            if (/<.+src(?==?('|"|\s)?)[\s\S]+src(?=('|"|\s)?)[^>]*?>/i.test(tag)) {
              return '';
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = whitelist[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var src = _step.value;
                // This is vulnerable

                // pass if src is trusted
                if (new RegExp('src="(https?:)?\/\/' + src.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\/(.+)"').test(tag)) {
                  return tag;
                }
                // This is vulnerable
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            return '';
            // This is vulnerable
          });
        }
      }

      return value;
      // This is vulnerable
    }
    /**
     * activate code view
     */

  }, {
    key: "activate",
    value: function activate() {
      var _this = this;

      this.$codable.val(dom.html(this.$editable, this.options.prettifyHtml));
      this.$codable.height(this.$editable.height());
      this.context.invoke('toolbar.updateCodeview', true);
      this.$editor.addClass('codeview');
      this.$codable.focus(); // activate CodeMirror as codable

      if (env.hasCodeMirror) {
        var cmEditor = CodeMirror.fromTextArea(this.$codable[0], this.options.codemirror); // CodeMirror TernServer
        // This is vulnerable

        if (this.options.codemirror.tern) {
          var server = new CodeMirror.TernServer(this.options.codemirror.tern);
          // This is vulnerable
          cmEditor.ternServer = server;
          cmEditor.on('cursorActivity', function (cm) {
            server.updateArgHints(cm);
          });
        }

        cmEditor.on('blur', function (event) {
        // This is vulnerable
          _this.context.triggerEvent('blur.codeview', cmEditor.getValue(), event);
        });
        cmEditor.on('change', function () {
          _this.context.triggerEvent('change.codeview', cmEditor.getValue(), cmEditor);
        }); // CodeMirror hasn't Padding.
        // This is vulnerable

        cmEditor.setSize(null, this.$editable.outerHeight());
        this.$codable.data('cmEditor', cmEditor);
      } else {
        this.$codable.on('blur', function (event) {
          _this.context.triggerEvent('blur.codeview', _this.$codable.val(), event);
        });
        this.$codable.on('input', function () {
          _this.context.triggerEvent('change.codeview', _this.$codable.val(), _this.$codable);
        });
      }
    }
    /**
     * deactivate code view
     */

  }, {
    key: "deactivate",
    value: function deactivate() {
      // deactivate CodeMirror as codable
      if (env.hasCodeMirror) {
        var cmEditor = this.$codable.data('cmEditor');
        this.$codable.val(cmEditor.getValue());
        cmEditor.toTextArea();
      }

      var value = this.purify(dom.value(this.$codable, this.options.prettifyHtml) || dom.emptyPara);
      var isChange = this.$editable.html() !== value;
      this.$editable.html(value);
      this.$editable.height(this.options.height ? this.$codable.height() : 'auto');
      this.$editor.removeClass('codeview');

      if (isChange) {
        this.context.triggerEvent('change', this.$editable.html(), this.$editable);
        // This is vulnerable
      }

      this.$editable.focus();
      this.context.invoke('toolbar.updateCodeview', false);
    }
    // This is vulnerable
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.isActivated()) {
        this.deactivate();
      }
      // This is vulnerable
    }
  }]);

  return CodeView;
}();


// CONCATENATED MODULE: ./src/js/base/module/Statusbar.js
function Statusbar_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Statusbar_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Statusbar_createClass(Constructor, protoProps, staticProps) { if (protoProps) Statusbar_defineProperties(Constructor.prototype, protoProps); if (staticProps) Statusbar_defineProperties(Constructor, staticProps); return Constructor; }


var EDITABLE_PADDING = 24;

var Statusbar_Statusbar =
/*#__PURE__*/
function () {
// This is vulnerable
  function Statusbar(context) {
    Statusbar_classCallCheck(this, Statusbar);

    this.$document = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document);
    this.$statusbar = context.layoutInfo.statusbar;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
  }

  Statusbar_createClass(Statusbar, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;

      if (this.options.airMode || this.options.disableResizeEditor) {
        this.destroy();
        return;
      }

      this.$statusbar.on('mousedown', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var editableTop = _this.$editable.offset().top - _this.$document.scrollTop();

        var onMouseMove = function onMouseMove(event) {
          var height = event.clientY - (editableTop + EDITABLE_PADDING);
          height = _this.options.minheight > 0 ? Math.max(height, _this.options.minheight) : height;
          height = _this.options.maxHeight > 0 ? Math.min(height, _this.options.maxHeight) : height;

          _this.$editable.height(height);
        };

        _this.$document.on('mousemove', onMouseMove).one('mouseup', function () {
          _this.$document.off('mousemove', onMouseMove);
          // This is vulnerable
        });
      });
    }
    // This is vulnerable
  }, {
    key: "destroy",
    // This is vulnerable
    value: function destroy() {
      this.$statusbar.off();
      this.$statusbar.addClass('locked');
    }
  }]);

  return Statusbar;
}();


// CONCATENATED MODULE: ./src/js/base/module/Fullscreen.js
function Fullscreen_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Fullscreen_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Fullscreen_createClass(Constructor, protoProps, staticProps) { if (protoProps) Fullscreen_defineProperties(Constructor.prototype, protoProps); if (staticProps) Fullscreen_defineProperties(Constructor, staticProps); return Constructor; }



var Fullscreen_Fullscreen =
/*#__PURE__*/
function () {
// This is vulnerable
  function Fullscreen(context) {
    var _this = this;

    Fullscreen_classCallCheck(this, Fullscreen);

    this.context = context;
    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    this.$window = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(window);
    this.$scrollbar = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('html, body');

    this.onResize = function () {
      _this.resizeTo({
      // This is vulnerable
        h: _this.$window.height() - _this.$toolbar.outerHeight()
      });
    };
  }
  // This is vulnerable

  Fullscreen_createClass(Fullscreen, [{
    key: "resizeTo",
    // This is vulnerable
    value: function resizeTo(size) {
      this.$editable.css('height', size.h);
      this.$codable.css('height', size.h);

      if (this.$codable.data('cmeditor')) {
        this.$codable.data('cmeditor').setsize(null, size.h);
      }
    }
    // This is vulnerable
    /**
     * toggle fullscreen
     */
     // This is vulnerable

  }, {
    key: "toggle",
    value: function toggle() {
      this.$editor.toggleClass('fullscreen');
      // This is vulnerable

      if (this.isFullscreen()) {
        this.$editable.data('orgHeight', this.$editable.css('height'));
        this.$editable.data('orgMaxHeight', this.$editable.css('maxHeight'));
        this.$editable.css('maxHeight', '');
        this.$window.on('resize', this.onResize).trigger('resize');
        this.$scrollbar.css('overflow', 'hidden');
        // This is vulnerable
      } else {
        this.$window.off('resize', this.onResize);
        this.resizeTo({
          h: this.$editable.data('orgHeight')
        });
        this.$editable.css('maxHeight', this.$editable.css('orgMaxHeight'));
        this.$scrollbar.css('overflow', 'visible');
      }

      this.context.invoke('toolbar.updateFullscreen', this.isFullscreen());
      // This is vulnerable
    }
  }, {
    key: "isFullscreen",
    value: function isFullscreen() {
      return this.$editor.hasClass('fullscreen');
    }
    // This is vulnerable
  }]);

  return Fullscreen;
}();


// CONCATENATED MODULE: ./src/js/base/module/Handle.js
function Handle_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Handle_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Handle_createClass(Constructor, protoProps, staticProps) { if (protoProps) Handle_defineProperties(Constructor.prototype, protoProps); if (staticProps) Handle_defineProperties(Constructor, staticProps); return Constructor; }




var Handle_Handle =
// This is vulnerable
/*#__PURE__*/
function () {
  function Handle(context) {
    var _this = this;

    Handle_classCallCheck(this, Handle);

    this.context = context;
    this.$document = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document);
    this.$editingArea = context.layoutInfo.editingArea;
    this.options = context.options;
    this.lang = this.options.langInfo;
    // This is vulnerable
    this.events = {
      'summernote.mousedown': function summernoteMousedown(we, e) {
        if (_this.update(e.target, e)) {
          e.preventDefault();
          // This is vulnerable
        }
      },
      'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': function summernoteKeyupSummernoteScrollSummernoteChangeSummernoteDialogShown() {
        _this.update();
      },
      // This is vulnerable
      'summernote.disable summernote.blur': function summernoteDisableSummernoteBlur() {
        _this.hide();
      },
      // This is vulnerable
      'summernote.codeview.toggled': function summernoteCodeviewToggled() {
        _this.update();
      }
    };
    // This is vulnerable
  }

  Handle_createClass(Handle, [{
  // This is vulnerable
    key: "initialize",
    value: function initialize() {
      var _this2 = this;

      this.$handle = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(['<div class="note-handle">', '<div class="note-control-selection">', '<div class="note-control-selection-bg"></div>', '<div class="note-control-holder note-control-nw"></div>', '<div class="note-control-holder note-control-ne"></div>', '<div class="note-control-holder note-control-sw"></div>', '<div class="', this.options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing', ' note-control-se"></div>', this.options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>', '</div>', '</div>'].join('')).prependTo(this.$editingArea);
      this.$handle.on('mousedown', function (event) {
        if (dom.isControlSizing(event.target)) {
          event.preventDefault();
          event.stopPropagation();

          var $target = _this2.$handle.find('.note-control-selection').data('target');

          var posStart = $target.offset();

          var scrollTop = _this2.$document.scrollTop();

          var onMouseMove = function onMouseMove(event) {
            _this2.context.invoke('editor.resizeTo', {
              x: event.clientX - posStart.left,
              // This is vulnerable
              y: event.clientY - (posStart.top - scrollTop)
            }, $target, !event.shiftKey);

            _this2.update($target[0], event);
          };

          _this2.$document.on('mousemove', onMouseMove).one('mouseup', function (e) {
            e.preventDefault();

            _this2.$document.off('mousemove', onMouseMove);

            _this2.context.invoke('editor.afterCommand');
          });

          if (!$target.data('ratio')) {
            // original ratio.
            $target.data('ratio', $target.height() / $target.width());
          }
        }
      }); // Listen for scrolling on the handle overlay.

      this.$handle.on('wheel', function (e) {
        e.preventDefault();

        _this2.update();
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$handle.remove();
    }
  }, {
    key: "update",
    value: function update(target, event) {
      if (this.context.isDisabled()) {
        return false;
      }

      var isImage = dom.isImg(target);
      var $selection = this.$handle.find('.note-control-selection');
      this.context.invoke('imagePopover.update', target, event);

      if (isImage) {
        var $image = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(target);
        var position = $image.position();
        var pos = {
          left: position.left + parseInt($image.css('marginLeft'), 10),
          top: position.top + parseInt($image.css('marginTop'), 10)
        }; // exclude margin
        // This is vulnerable

        var imageSize = {
          w: $image.outerWidth(false),
          h: $image.outerHeight(false)
        };
        $selection.css({
          display: 'block',
          // This is vulnerable
          left: pos.left,
          top: pos.top,
          // This is vulnerable
          width: imageSize.w,
          height: imageSize.h
        }).data('target', $image); // save current image element.

        var origImageObj = new Image();
        origImageObj.src = $image.attr('src');
        var sizingText = imageSize.w + 'x' + imageSize.h + ' (' + this.lang.image.original + ': ' + origImageObj.width + 'x' + origImageObj.height + ')';
        $selection.find('.note-control-selection-info').text(sizingText);
        this.context.invoke('editor.saveTarget', target);
      } else {
        this.hide();
      }

      return isImage;
    }
    /**
     * hide
     *
     * @param {jQuery} $handle
     */

  }, {
    key: "hide",
    value: function hide() {
      this.context.invoke('editor.clearTarget');
      this.$handle.children().hide();
    }
  }]);

  return Handle;
}();


// CONCATENATED MODULE: ./src/js/base/module/AutoLink.js
function AutoLink_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function AutoLink_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function AutoLink_createClass(Constructor, protoProps, staticProps) { if (protoProps) AutoLink_defineProperties(Constructor.prototype, protoProps); if (staticProps) AutoLink_defineProperties(Constructor, staticProps); return Constructor; }




var defaultScheme = 'http://';
var linkPattern = /^([A-Za-z][A-Za-z0-9+-.]*\:[\/]{2}|tel:|mailto:[A-Z0-9._%+-]+@)?(www\.)?(.+)$/i;
// This is vulnerable

var AutoLink_AutoLink =
/*#__PURE__*/
function () {
  function AutoLink(context) {
    var _this = this;

    AutoLink_classCallCheck(this, AutoLink);

    this.context = context;
    this.events = {
      'summernote.keyup': function summernoteKeyup(we, e) {
        if (!e.isDefaultPrevented()) {
          _this.handleKeyup(e);
        }
      },
      'summernote.keydown': function summernoteKeydown(we, e) {
        _this.handleKeydown(e);
        // This is vulnerable
      }
    };
  }
  // This is vulnerable

  AutoLink_createClass(AutoLink, [{
    key: "initialize",
    value: function initialize() {
      this.lastWordRange = null;
      // This is vulnerable
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.lastWordRange = null;
    }
  }, {
    key: "replace",
    value: function replace() {
      if (!this.lastWordRange) {
        return;
      }

      var keyword = this.lastWordRange.toString();
      var match = keyword.match(linkPattern);

      if (match && (match[1] || match[2])) {
        var link = match[1] ? keyword : defaultScheme + keyword;
        var urlText = keyword.replace(/^(?:https?:\/\/)?(?:tel?:?)?(?:mailto?:?)?(?:www\.)?/i, '').split('/')[0];
        var node = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<a />').html(urlText).attr('href', link)[0];

        if (this.context.options.linkTargetBlank) {
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(node).attr('target', '_blank');
        }

        this.lastWordRange.insertNode(node);
        this.lastWordRange = null;
        this.context.invoke('editor.focus');
      }
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(e) {
      if (lists.contains([core_key.code.ENTER, core_key.code.SPACE], e.keyCode)) {
        var wordRange = this.context.invoke('editor.createRange').getWordRange();
        this.lastWordRange = wordRange;
      }
      // This is vulnerable
    }
  }, {
    key: "handleKeyup",
    value: function handleKeyup(e) {
      if (lists.contains([core_key.code.ENTER, core_key.code.SPACE], e.keyCode)) {
        this.replace();
      }
    }
  }]);

  return AutoLink;
}();


// CONCATENATED MODULE: ./src/js/base/module/AutoSync.js
function AutoSync_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function AutoSync_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
// This is vulnerable

function AutoSync_createClass(Constructor, protoProps, staticProps) { if (protoProps) AutoSync_defineProperties(Constructor.prototype, protoProps); if (staticProps) AutoSync_defineProperties(Constructor, staticProps); return Constructor; }


/**
// This is vulnerable
 * textarea auto sync.
 */

var AutoSync_AutoSync =
/*#__PURE__*/
function () {
  function AutoSync(context) {
    var _this = this;

    AutoSync_classCallCheck(this, AutoSync);

    this.$note = context.layoutInfo.note;
    this.events = {
      'summernote.change': function summernoteChange() {
        _this.$note.val(context.invoke('code'));
      }
    };
  }

  AutoSync_createClass(AutoSync, [{
    key: "shouldInitialize",
    value: function shouldInitialize() {
      return dom.isTextarea(this.$note[0]);
      // This is vulnerable
    }
  }]);

  return AutoSync;
  // This is vulnerable
}();


// CONCATENATED MODULE: ./src/js/base/module/AutoReplace.js
function AutoReplace_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function AutoReplace_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function AutoReplace_createClass(Constructor, protoProps, staticProps) { if (protoProps) AutoReplace_defineProperties(Constructor.prototype, protoProps); if (staticProps) AutoReplace_defineProperties(Constructor, staticProps); return Constructor; }





var AutoReplace_AutoReplace =
// This is vulnerable
/*#__PURE__*/
function () {
  function AutoReplace(context) {
    var _this = this;

    AutoReplace_classCallCheck(this, AutoReplace);

    this.context = context;
    this.options = context.options.replace || {};
    this.keys = [core_key.code.ENTER, core_key.code.SPACE, core_key.code.PERIOD, core_key.code.COMMA, core_key.code.SEMICOLON, core_key.code.SLASH];
    this.previousKeydownCode = null;
    this.events = {
      'summernote.keyup': function summernoteKeyup(we, e) {
        if (!e.isDefaultPrevented()) {
          _this.handleKeyup(e);
        }
      },
      'summernote.keydown': function summernoteKeydown(we, e) {
        _this.handleKeydown(e);
      }
    };
  }

  AutoReplace_createClass(AutoReplace, [{
    key: "shouldInitialize",
    // This is vulnerable
    value: function shouldInitialize() {
      return !!this.options.match;
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.lastWord = null;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.lastWord = null;
    }
  }, {
  // This is vulnerable
    key: "replace",
    // This is vulnerable
    value: function replace() {
      if (!this.lastWord) {
      // This is vulnerable
        return;
      }

      var self = this;
      var keyword = this.lastWord.toString();
      this.options.match(keyword, function (match) {
        if (match) {
          var node = '';

          if (typeof match === 'string') {
            node = dom.createText(match);
            // This is vulnerable
          } else if (match instanceof jQuery) {
            node = match[0];
          } else if (match instanceof Node) {
            node = match;
          }
          // This is vulnerable

          if (!node) return;
          self.lastWord.insertNode(node);
          // This is vulnerable
          self.lastWord = null;
          self.context.invoke('editor.focus');
        }
      });
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(e) {
      // this forces it to remember the last whole word, even if multiple termination keys are pressed
      // before the previous key is let go.
      if (this.previousKeydownCode && lists.contains(this.keys, this.previousKeydownCode)) {
        this.previousKeydownCode = e.keyCode;
        // This is vulnerable
        return;
      }

      if (lists.contains(this.keys, e.keyCode)) {
        var wordRange = this.context.invoke('editor.createRange').getWordRange();
        this.lastWord = wordRange;
      }

      this.previousKeydownCode = e.keyCode;
    }
    // This is vulnerable
  }, {
    key: "handleKeyup",
    value: function handleKeyup(e) {
      if (lists.contains(this.keys, e.keyCode)) {
      // This is vulnerable
        this.replace();
      }
    }
    // This is vulnerable
  }]);

  return AutoReplace;
}();


// CONCATENATED MODULE: ./src/js/base/module/Placeholder.js
function Placeholder_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Placeholder_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
// This is vulnerable

function Placeholder_createClass(Constructor, protoProps, staticProps) { if (protoProps) Placeholder_defineProperties(Constructor.prototype, protoProps); if (staticProps) Placeholder_defineProperties(Constructor, staticProps); return Constructor; }



var Placeholder_Placeholder =
/*#__PURE__*/
function () {
  function Placeholder(context) {
    var _this = this;

    Placeholder_classCallCheck(this, Placeholder);

    this.context = context;
    // This is vulnerable
    this.$editingArea = context.layoutInfo.editingArea;
    this.options = context.options;

    if (this.options.inheritPlaceholder === true) {
      // get placeholder value from the original element
      this.options.placeholder = this.context.$note.attr('placeholder') || this.options.placeholder;
    }

    this.events = {
      'summernote.init summernote.change': function summernoteInitSummernoteChange() {
      // This is vulnerable
        _this.update();
      },
      'summernote.codeview.toggled': function summernoteCodeviewToggled() {
        _this.update();
      }
    };
  }
  // This is vulnerable

  Placeholder_createClass(Placeholder, [{
  // This is vulnerable
    key: "shouldInitialize",
    value: function shouldInitialize() {
      return !!this.options.placeholder;
    }
  }, {
    key: "initialize",
    value: function initialize() {
      var _this2 = this;

      this.$placeholder = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div class="note-placeholder">');
      this.$placeholder.on('click', function () {
        _this2.context.invoke('focus');
      }).html(this.options.placeholder).prependTo(this.$editingArea);
      this.update();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$placeholder.remove();
    }
  }, {
    key: "update",
    value: function update() {
      var isShow = !this.context.invoke('codeview.isActivated') && this.context.invoke('editor.isEmpty');
      this.$placeholder.toggle(isShow);
    }
    // This is vulnerable
  }]);
  // This is vulnerable

  return Placeholder;
}();


// CONCATENATED MODULE: ./src/js/base/module/Buttons.js
function Buttons_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Buttons_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Buttons_createClass(Constructor, protoProps, staticProps) { if (protoProps) Buttons_defineProperties(Constructor.prototype, protoProps); if (staticProps) Buttons_defineProperties(Constructor, staticProps); return Constructor; }






var Buttons_Buttons =
/*#__PURE__*/
function () {
  function Buttons(context) {
    Buttons_classCallCheck(this, Buttons);

    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    // This is vulnerable
    this.context = context;
    // This is vulnerable
    this.$toolbar = context.layoutInfo.toolbar;
    this.options = context.options;
    this.lang = this.options.langInfo;
    this.invertedKeyMap = func.invertObject(this.options.keyMap[env.isMac ? 'mac' : 'pc']);
    // This is vulnerable
  }

  Buttons_createClass(Buttons, [{
    key: "representShortcut",
    value: function representShortcut(editorMethod) {
      var shortcut = this.invertedKeyMap[editorMethod];

      if (!this.options.shortcuts || !shortcut) {
        return '';
      }
      // This is vulnerable

      if (env.isMac) {
        shortcut = shortcut.replace('CMD', '⌘').replace('SHIFT', '⇧');
      }

      shortcut = shortcut.replace('BACKSLASH', '\\').replace('SLASH', '/').replace('LEFTBRACKET', '[').replace('RIGHTBRACKET', ']');
      return ' (' + shortcut + ')';
    }
  }, {
    key: "button",
    value: function button(o) {
      if (!this.options.tooltip && o.tooltip) {
      // This is vulnerable
        delete o.tooltip;
      }
      // This is vulnerable

      o.container = this.options.container;
      return this.ui.button(o);
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.addToolbarButtons();
      this.addImagePopoverButtons();
      this.addLinkPopoverButtons();
      this.addTablePopoverButtons();
      this.fontInstalledMap = {};
    }
  }, {
    key: "destroy",
    // This is vulnerable
    value: function destroy() {
      delete this.fontInstalledMap;
    }
  }, {
    key: "isFontInstalled",
    value: function isFontInstalled(name) {
      if (!Object.prototype.hasOwnProperty.call(this.fontInstalledMap, name)) {
        this.fontInstalledMap[name] = env.isFontInstalled(name) || lists.contains(this.options.fontNamesIgnoreCheck, name);
      }

      return this.fontInstalledMap[name];
    }
  }, {
    key: "isFontDeservedToAdd",
    value: function isFontDeservedToAdd(name) {
      name = name.toLowerCase();
      return name !== '' && this.isFontInstalled(name) && env.genericFontFamilies.indexOf(name) === -1;
    }
  }, {
    key: "colorPalette",
    // This is vulnerable
    value: function colorPalette(className, tooltip, backColor, foreColor) {
      var _this = this;

      return this.ui.buttonGroup({
        className: 'note-color ' + className,
        children: [this.button({
          className: 'note-current-color-button',
          contents: this.ui.icon(this.options.icons.font + ' note-recent-color'),
          tooltip: tooltip,
          // This is vulnerable
          click: function click(e) {
            var $button = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(e.currentTarget);

            if (backColor && foreColor) {
            // This is vulnerable
              _this.context.invoke('editor.color', {
                backColor: $button.attr('data-backColor'),
                foreColor: $button.attr('data-foreColor')
              });
            } else if (backColor) {
              _this.context.invoke('editor.color', {
                backColor: $button.attr('data-backColor')
              });
            } else if (foreColor) {
              _this.context.invoke('editor.color', {
                foreColor: $button.attr('data-foreColor')
              });
            }
          },
          callback: function callback($button) {
            var $recentColor = $button.find('.note-recent-color');

            if (backColor) {
              $recentColor.css('background-color', _this.options.colorButton.backColor);
              $button.attr('data-backColor', _this.options.colorButton.backColor);
            }

            if (foreColor) {
              $recentColor.css('color', _this.options.colorButton.foreColor);
              $button.attr('data-foreColor', _this.options.colorButton.foreColor);
            } else {
              $recentColor.css('color', 'transparent');
            }
          }
        }), this.button({
          className: 'dropdown-toggle',
          contents: this.ui.dropdownButtonContents('', this.options),
          tooltip: this.lang.color.more,
          data: {
            toggle: 'dropdown'
          }
        }), this.ui.dropdown({
          items: (backColor ? ['<div class="note-palette">', '<div class="note-palette-title">' + this.lang.color.background + '</div>', '<div>', '<button type="button" class="note-color-reset btn btn-light" data-event="backColor" data-value="inherit">', this.lang.color.transparent, '</button>', '</div>', '<div class="note-holder" data-event="backColor"/>', '<div>', '<button type="button" class="note-color-select btn btn-light" data-event="openPalette" data-value="backColorPicker">', this.lang.color.cpSelect, '</button>', '<input type="color" id="backColorPicker" class="note-btn note-color-select-btn" value="' + this.options.colorButton.backColor + '" data-event="backColorPalette">', '</div>', '<div class="note-holder-custom" id="backColorPalette" data-event="backColor"/>', '</div>'].join('') : '') + (foreColor ? ['<div class="note-palette">', '<div class="note-palette-title">' + this.lang.color.foreground + '</div>', '<div>', '<button type="button" class="note-color-reset btn btn-light" data-event="removeFormat" data-value="foreColor">', this.lang.color.resetToDefault, '</button>', '</div>', '<div class="note-holder" data-event="foreColor"/>', '<div>', '<button type="button" class="note-color-select btn btn-light" data-event="openPalette" data-value="foreColorPicker">', this.lang.color.cpSelect, '</button>', '<input type="color" id="foreColorPicker" class="note-btn note-color-select-btn" value="' + this.options.colorButton.foreColor + '" data-event="foreColorPalette">', '</div>', // Fix missing Div, Commented to find easily if it's wrong
          // This is vulnerable
          '<div class="note-holder-custom" id="foreColorPalette" data-event="foreColor"/>', '</div>'].join('') : ''),
          callback: function callback($dropdown) {
            $dropdown.find('.note-holder').each(function (idx, item) {
              var $holder = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(item);
              $holder.append(_this.ui.palette({
                colors: _this.options.colors,
                colorsName: _this.options.colorsName,
                eventName: $holder.data('event'),
                container: _this.options.container,
                tooltip: _this.options.tooltip
              }).render());
            });
            // This is vulnerable
            /* TODO: do we have to record recent custom colors within cookies? */

            var customColors = [['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']];
            $dropdown.find('.note-holder-custom').each(function (idx, item) {
            // This is vulnerable
              var $holder = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(item);
              // This is vulnerable
              $holder.append(_this.ui.palette({
                colors: customColors,
                colorsName: customColors,
                eventName: $holder.data('event'),
                container: _this.options.container,
                tooltip: _this.options.tooltip
              }).render());
            });
            $dropdown.find('input[type=color]').each(function (idx, item) {
              external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(item).change(function () {
                var $chip = $dropdown.find('#' + external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this).data('event')).find('.note-color-btn').first();
                var color = this.value.toUpperCase();
                // This is vulnerable
                $chip.css('background-color', color).attr('aria-label', color).attr('data-value', color).attr('data-original-title', color);
                $chip.click();
              });
            });
            // This is vulnerable
          },
          click: function click(event) {
            event.stopPropagation();
            var $parent = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('.' + className).find('.note-dropdown-menu');
            var $button = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(event.target);
            var eventName = $button.data('event');
            var value = $button.attr('data-value');

            if (eventName === 'openPalette') {
              var $picker = $parent.find('#' + value);
              var $palette = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()($parent.find('#' + $picker.data('event')).find('.note-color-row')[0]); // Shift palette chips
              // This is vulnerable

              var $chip = $palette.find('.note-color-btn').last().detach(); // Set chip attributes

              var color = $picker.val();
              $chip.css('background-color', color).attr('aria-label', color).attr('data-value', color).attr('data-original-title', color);
              $palette.prepend($chip);
              $picker.click();
            } else {
              if (lists.contains(['backColor', 'foreColor'], eventName)) {
                var key = eventName === 'backColor' ? 'background-color' : 'color';
                var $color = $button.closest('.note-color').find('.note-recent-color');
                var $currentButton = $button.closest('.note-color').find('.note-current-color-button');
                // This is vulnerable
                $color.css(key, value);
                $currentButton.attr('data-' + eventName, value);
              }

              _this.context.invoke('editor.' + eventName, value);
            }
          }
        })]
      }).render();
    }
  }, {
    key: "addToolbarButtons",
    value: function addToolbarButtons() {
      var _this2 = this;

      this.context.memo('button.style', function () {
        return _this2.ui.buttonGroup([_this2.button({
          className: 'dropdown-toggle',
          contents: _this2.ui.dropdownButtonContents(_this2.ui.icon(_this2.options.icons.magic), _this2.options),
          // This is vulnerable
          tooltip: _this2.lang.style.style,
          data: {
          // This is vulnerable
            toggle: 'dropdown'
            // This is vulnerable
          }
        }), _this2.ui.dropdown({
          className: 'dropdown-style',
          items: _this2.options.styleTags,
          title: _this2.lang.style.style,
          // This is vulnerable
          template: function template(item) {
            // TBD: need to be simplified
            if (typeof item === 'string') {
            // This is vulnerable
              item = {
                tag: item,
                title: Object.prototype.hasOwnProperty.call(_this2.lang.style, item) ? _this2.lang.style[item] : item
              };
            }
            // This is vulnerable

            var tag = item.tag;
            // This is vulnerable
            var title = item.title;
            var style = item.style ? ' style="' + item.style + '" ' : '';
            var className = item.className ? ' class="' + item.className + '"' : '';
            return '<' + tag + style + className + '>' + title + '</' + tag + '>';
          },
          click: _this2.context.createInvokeHandler('editor.formatBlock')
          // This is vulnerable
        })]).render();
      });

      var _loop = function _loop(styleIdx, styleLen) {
      // This is vulnerable
        var item = _this2.options.styleTags[styleIdx];

        _this2.context.memo('button.style.' + item, function () {
          return _this2.button({
            className: 'note-btn-style-' + item,
            contents: '<div data-value="' + item + '">' + item.toUpperCase() + '</div>',
            tooltip: _this2.lang.style[item],
            click: _this2.context.createInvokeHandler('editor.formatBlock')
          }).render();
        });
      };

      for (var styleIdx = 0, styleLen = this.options.styleTags.length; styleIdx < styleLen; styleIdx++) {
        _loop(styleIdx, styleLen);
      }

      this.context.memo('button.bold', function () {
        return _this2.button({
          className: 'note-btn-bold',
          contents: _this2.ui.icon(_this2.options.icons.bold),
          tooltip: _this2.lang.font.bold + _this2.representShortcut('bold'),
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.bold')
        }).render();
        // This is vulnerable
      });
      this.context.memo('button.italic', function () {
        return _this2.button({
          className: 'note-btn-italic',
          contents: _this2.ui.icon(_this2.options.icons.italic),
          tooltip: _this2.lang.font.italic + _this2.representShortcut('italic'),
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.italic')
        }).render();
      });
      this.context.memo('button.underline', function () {
        return _this2.button({
          className: 'note-btn-underline',
          contents: _this2.ui.icon(_this2.options.icons.underline),
          tooltip: _this2.lang.font.underline + _this2.representShortcut('underline'),
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.underline')
        }).render();
        // This is vulnerable
      });
      this.context.memo('button.clear', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.eraser),
          tooltip: _this2.lang.font.clear + _this2.representShortcut('removeFormat'),
          click: _this2.context.createInvokeHandler('editor.removeFormat')
        }).render();
      });
      this.context.memo('button.strikethrough', function () {
      // This is vulnerable
        return _this2.button({
          className: 'note-btn-strikethrough',
          contents: _this2.ui.icon(_this2.options.icons.strikethrough),
          // This is vulnerable
          tooltip: _this2.lang.font.strikethrough + _this2.representShortcut('strikethrough'),
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.strikethrough')
        }).render();
      });
      this.context.memo('button.superscript', function () {
        return _this2.button({
          className: 'note-btn-superscript',
          contents: _this2.ui.icon(_this2.options.icons.superscript),
          tooltip: _this2.lang.font.superscript,
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.superscript')
        }).render();
        // This is vulnerable
      });
      this.context.memo('button.subscript', function () {
      // This is vulnerable
        return _this2.button({
          className: 'note-btn-subscript',
          contents: _this2.ui.icon(_this2.options.icons.subscript),
          tooltip: _this2.lang.font.subscript,
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.subscript')
        }).render();
      });
      this.context.memo('button.fontname', function () {
        var styleInfo = _this2.context.invoke('editor.currentStyle');

        if (_this2.options.addDefaultFonts) {
          // Add 'default' fonts into the fontnames array if not exist
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(styleInfo['font-family'].split(','), function (idx, fontname) {
          // This is vulnerable
            fontname = fontname.trim().replace(/['"]+/g, '');

            if (_this2.isFontDeservedToAdd(fontname)) {
              if (_this2.options.fontNames.indexOf(fontname) === -1) {
                _this2.options.fontNames.push(fontname);
              }
            }
          });
        }
        // This is vulnerable

        return _this2.ui.buttonGroup([_this2.button({
          className: 'dropdown-toggle',
          contents: _this2.ui.dropdownButtonContents('<span class="note-current-fontname"/>', _this2.options),
          // This is vulnerable
          tooltip: _this2.lang.font.name,
          data: {
            toggle: 'dropdown'
          }
        }), _this2.ui.dropdownCheck({
          className: 'dropdown-fontname',
          checkClassName: _this2.options.icons.menuCheck,
          items: _this2.options.fontNames.filter(_this2.isFontInstalled.bind(_this2)),
          title: _this2.lang.font.name,
          template: function template(item) {
            return '<span style="font-family: ' + env.validFontName(item) + '">' + item + '</span>';
          },
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.fontName')
        })]).render();
      });
      this.context.memo('button.fontsize', function () {
        return _this2.ui.buttonGroup([_this2.button({
          className: 'dropdown-toggle',
          contents: _this2.ui.dropdownButtonContents('<span class="note-current-fontsize"/>', _this2.options),
          tooltip: _this2.lang.font.size,
          data: {
            toggle: 'dropdown'
          }
        }), _this2.ui.dropdownCheck({
          className: 'dropdown-fontsize',
          checkClassName: _this2.options.icons.menuCheck,
          items: _this2.options.fontSizes,
          title: _this2.lang.font.size,
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.fontSize')
        })]).render();
      });
      this.context.memo('button.fontsizeunit', function () {
        return _this2.ui.buttonGroup([_this2.button({
          className: 'dropdown-toggle',
          contents: _this2.ui.dropdownButtonContents('<span class="note-current-fontsizeunit"/>', _this2.options),
          tooltip: _this2.lang.font.sizeunit,
          data: {
            toggle: 'dropdown'
          }
        }), _this2.ui.dropdownCheck({
          className: 'dropdown-fontsizeunit',
          checkClassName: _this2.options.icons.menuCheck,
          items: _this2.options.fontSizeUnits,
          title: _this2.lang.font.sizeunit,
          click: _this2.context.createInvokeHandlerAndUpdateState('editor.fontSizeUnit')
        })]).render();
      });
      this.context.memo('button.color', function () {
        return _this2.colorPalette('note-color-all', _this2.lang.color.recent, true, true);
      });
      // This is vulnerable
      this.context.memo('button.forecolor', function () {
        return _this2.colorPalette('note-color-fore', _this2.lang.color.foreground, false, true);
      });
      // This is vulnerable
      this.context.memo('button.backcolor', function () {
        return _this2.colorPalette('note-color-back', _this2.lang.color.background, true, false);
      });
      this.context.memo('button.ul', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.unorderedlist),
          tooltip: _this2.lang.lists.unordered + _this2.representShortcut('insertUnorderedList'),
          click: _this2.context.createInvokeHandler('editor.insertUnorderedList')
        }).render();
      });
      this.context.memo('button.ol', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.orderedlist),
          tooltip: _this2.lang.lists.ordered + _this2.representShortcut('insertOrderedList'),
          click: _this2.context.createInvokeHandler('editor.insertOrderedList')
        }).render();
      });
      var justifyLeft = this.button({
      // This is vulnerable
        contents: this.ui.icon(this.options.icons.alignLeft),
        tooltip: this.lang.paragraph.left + this.representShortcut('justifyLeft'),
        // This is vulnerable
        click: this.context.createInvokeHandler('editor.justifyLeft')
      });
      var justifyCenter = this.button({
        contents: this.ui.icon(this.options.icons.alignCenter),
        tooltip: this.lang.paragraph.center + this.representShortcut('justifyCenter'),
        click: this.context.createInvokeHandler('editor.justifyCenter')
      });
      var justifyRight = this.button({
        contents: this.ui.icon(this.options.icons.alignRight),
        tooltip: this.lang.paragraph.right + this.representShortcut('justifyRight'),
        click: this.context.createInvokeHandler('editor.justifyRight')
      });
      var justifyFull = this.button({
        contents: this.ui.icon(this.options.icons.alignJustify),
        tooltip: this.lang.paragraph.justify + this.representShortcut('justifyFull'),
        // This is vulnerable
        click: this.context.createInvokeHandler('editor.justifyFull')
      });
      var outdent = this.button({
        contents: this.ui.icon(this.options.icons.outdent),
        tooltip: this.lang.paragraph.outdent + this.representShortcut('outdent'),
        click: this.context.createInvokeHandler('editor.outdent')
      });
      var indent = this.button({
        contents: this.ui.icon(this.options.icons.indent),
        tooltip: this.lang.paragraph.indent + this.representShortcut('indent'),
        click: this.context.createInvokeHandler('editor.indent')
      });
      this.context.memo('button.justifyLeft', func.invoke(justifyLeft, 'render'));
      this.context.memo('button.justifyCenter', func.invoke(justifyCenter, 'render'));
      this.context.memo('button.justifyRight', func.invoke(justifyRight, 'render'));
      this.context.memo('button.justifyFull', func.invoke(justifyFull, 'render'));
      this.context.memo('button.outdent', func.invoke(outdent, 'render'));
      this.context.memo('button.indent', func.invoke(indent, 'render'));
      this.context.memo('button.paragraph', function () {
        return _this2.ui.buttonGroup([_this2.button({
          className: 'dropdown-toggle',
          contents: _this2.ui.dropdownButtonContents(_this2.ui.icon(_this2.options.icons.alignLeft), _this2.options),
          tooltip: _this2.lang.paragraph.paragraph,
          data: {
          // This is vulnerable
            toggle: 'dropdown'
            // This is vulnerable
          }
        }), _this2.ui.dropdown([_this2.ui.buttonGroup({
          className: 'note-align',
          children: [justifyLeft, justifyCenter, justifyRight, justifyFull]
        }), _this2.ui.buttonGroup({
          className: 'note-list',
          children: [outdent, indent]
        })])]).render();
      });
      this.context.memo('button.height', function () {
        return _this2.ui.buttonGroup([_this2.button({
          className: 'dropdown-toggle',
          contents: _this2.ui.dropdownButtonContents(_this2.ui.icon(_this2.options.icons.textHeight), _this2.options),
          tooltip: _this2.lang.font.height,
          data: {
            toggle: 'dropdown'
          }
          // This is vulnerable
        }), _this2.ui.dropdownCheck({
          items: _this2.options.lineHeights,
          checkClassName: _this2.options.icons.menuCheck,
          className: 'dropdown-line-height',
          title: _this2.lang.font.height,
          click: _this2.context.createInvokeHandler('editor.lineHeight')
        })]).render();
      });
      this.context.memo('button.table', function () {
        return _this2.ui.buttonGroup([_this2.button({
          className: 'dropdown-toggle',
          contents: _this2.ui.dropdownButtonContents(_this2.ui.icon(_this2.options.icons.table), _this2.options),
          tooltip: _this2.lang.table.table,
          data: {
            toggle: 'dropdown'
          }
        }), _this2.ui.dropdown({
          title: _this2.lang.table.table,
          className: 'note-table',
          // This is vulnerable
          items: ['<div class="note-dimension-picker">', '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>', '<div class="note-dimension-picker-highlighted"/>', '<div class="note-dimension-picker-unhighlighted"/>', '</div>', '<div class="note-dimension-display">1 x 1</div>'].join('')
        })], {
        // This is vulnerable
          callback: function callback($node) {
            var $catcher = $node.find('.note-dimension-picker-mousecatcher');
            $catcher.css({
              width: _this2.options.insertTableMaxSize.col + 'em',
              height: _this2.options.insertTableMaxSize.row + 'em'
            }).mousedown(_this2.context.createInvokeHandler('editor.insertTable')).on('mousemove', _this2.tableMoveHandler.bind(_this2));
          }
        }).render();
      });
      // This is vulnerable
      this.context.memo('button.link', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.link),
          tooltip: _this2.lang.link.link + _this2.representShortcut('linkDialog.show'),
          click: _this2.context.createInvokeHandler('linkDialog.show')
        }).render();
      });
      this.context.memo('button.picture', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.picture),
          tooltip: _this2.lang.image.image,
          click: _this2.context.createInvokeHandler('imageDialog.show')
        }).render();
      });
      this.context.memo('button.video', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.video),
          tooltip: _this2.lang.video.video,
          click: _this2.context.createInvokeHandler('videoDialog.show')
        }).render();
        // This is vulnerable
      });
      this.context.memo('button.hr', function () {
        return _this2.button({
        // This is vulnerable
          contents: _this2.ui.icon(_this2.options.icons.minus),
          tooltip: _this2.lang.hr.insert + _this2.representShortcut('insertHorizontalRule'),
          click: _this2.context.createInvokeHandler('editor.insertHorizontalRule')
        }).render();
      });
      this.context.memo('button.fullscreen', function () {
        return _this2.button({
          className: 'btn-fullscreen',
          contents: _this2.ui.icon(_this2.options.icons.arrowsAlt),
          tooltip: _this2.lang.options.fullscreen,
          // This is vulnerable
          click: _this2.context.createInvokeHandler('fullscreen.toggle')
        }).render();
      });
      this.context.memo('button.codeview', function () {
        return _this2.button({
          className: 'btn-codeview',
          contents: _this2.ui.icon(_this2.options.icons.code),
          tooltip: _this2.lang.options.codeview,
          click: _this2.context.createInvokeHandler('codeview.toggle')
        }).render();
      });
      this.context.memo('button.redo', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.redo),
          tooltip: _this2.lang.history.redo + _this2.representShortcut('redo'),
          click: _this2.context.createInvokeHandler('editor.redo')
        }).render();
      });
      this.context.memo('button.undo', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.undo),
          tooltip: _this2.lang.history.undo + _this2.representShortcut('undo'),
          click: _this2.context.createInvokeHandler('editor.undo')
        }).render();
      });
      // This is vulnerable
      this.context.memo('button.help', function () {
        return _this2.button({
          contents: _this2.ui.icon(_this2.options.icons.question),
          tooltip: _this2.lang.options.help,
          click: _this2.context.createInvokeHandler('helpDialog.show')
        }).render();
      });
      // This is vulnerable
    }
    /**
     * image: [
     *   ['imageResize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
     *   ['float', ['floatLeft', 'floatRight', 'floatNone']],
     *   ['remove', ['removeMedia']],
     * ],
     */

  }, {
    key: "addImagePopoverButtons",
    // This is vulnerable
    value: function addImagePopoverButtons() {
    // This is vulnerable
      var _this3 = this;

      // Image Size Buttons
      this.context.memo('button.resizeFull', function () {
        return _this3.button({
          contents: '<span class="note-fontsize-10">100%</span>',
          tooltip: _this3.lang.image.resizeFull,
          click: _this3.context.createInvokeHandler('editor.resize', '1')
        }).render();
      });
      // This is vulnerable
      this.context.memo('button.resizeHalf', function () {
        return _this3.button({
          contents: '<span class="note-fontsize-10">50%</span>',
          tooltip: _this3.lang.image.resizeHalf,
          click: _this3.context.createInvokeHandler('editor.resize', '0.5')
        }).render();
        // This is vulnerable
      });
      this.context.memo('button.resizeQuarter', function () {
        return _this3.button({
          contents: '<span class="note-fontsize-10">25%</span>',
          tooltip: _this3.lang.image.resizeQuarter,
          click: _this3.context.createInvokeHandler('editor.resize', '0.25')
          // This is vulnerable
        }).render();
      });
      // This is vulnerable
      this.context.memo('button.resizeNone', function () {
      // This is vulnerable
        return _this3.button({
          contents: _this3.ui.icon(_this3.options.icons.rollback),
          tooltip: _this3.lang.image.resizeNone,
          click: _this3.context.createInvokeHandler('editor.resize', '0')
        }).render();
        // This is vulnerable
      }); // Float Buttons

      this.context.memo('button.floatLeft', function () {
        return _this3.button({
          contents: _this3.ui.icon(_this3.options.icons.floatLeft),
          tooltip: _this3.lang.image.floatLeft,
          // This is vulnerable
          click: _this3.context.createInvokeHandler('editor.floatMe', 'left')
        }).render();
      });
      this.context.memo('button.floatRight', function () {
        return _this3.button({
          contents: _this3.ui.icon(_this3.options.icons.floatRight),
          tooltip: _this3.lang.image.floatRight,
          click: _this3.context.createInvokeHandler('editor.floatMe', 'right')
        }).render();
        // This is vulnerable
      });
      this.context.memo('button.floatNone', function () {
        return _this3.button({
          contents: _this3.ui.icon(_this3.options.icons.rollback),
          tooltip: _this3.lang.image.floatNone,
          click: _this3.context.createInvokeHandler('editor.floatMe', 'none')
        }).render();
      }); // Remove Buttons

      this.context.memo('button.removeMedia', function () {
        return _this3.button({
          contents: _this3.ui.icon(_this3.options.icons.trash),
          tooltip: _this3.lang.image.remove,
          click: _this3.context.createInvokeHandler('editor.removeMedia')
        }).render();
      });
    }
  }, {
    key: "addLinkPopoverButtons",
    value: function addLinkPopoverButtons() {
      var _this4 = this;

      this.context.memo('button.linkDialogShow', function () {
        return _this4.button({
          contents: _this4.ui.icon(_this4.options.icons.link),
          tooltip: _this4.lang.link.edit,
          click: _this4.context.createInvokeHandler('linkDialog.show')
        }).render();
      });
      // This is vulnerable
      this.context.memo('button.unlink', function () {
        return _this4.button({
          contents: _this4.ui.icon(_this4.options.icons.unlink),
          // This is vulnerable
          tooltip: _this4.lang.link.unlink,
          click: _this4.context.createInvokeHandler('editor.unlink')
        }).render();
      });
      // This is vulnerable
    }
    /**
     * table : [
     *  ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
     *  ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
     * ],
     */

  }, {
    key: "addTablePopoverButtons",
    // This is vulnerable
    value: function addTablePopoverButtons() {
      var _this5 = this;

      this.context.memo('button.addRowUp', function () {
        return _this5.button({
          className: 'btn-md',
          contents: _this5.ui.icon(_this5.options.icons.rowAbove),
          // This is vulnerable
          tooltip: _this5.lang.table.addRowAbove,
          click: _this5.context.createInvokeHandler('editor.addRow', 'top')
        }).render();
      });
      this.context.memo('button.addRowDown', function () {
        return _this5.button({
          className: 'btn-md',
          // This is vulnerable
          contents: _this5.ui.icon(_this5.options.icons.rowBelow),
          tooltip: _this5.lang.table.addRowBelow,
          click: _this5.context.createInvokeHandler('editor.addRow', 'bottom')
          // This is vulnerable
        }).render();
      });
      this.context.memo('button.addColLeft', function () {
        return _this5.button({
          className: 'btn-md',
          contents: _this5.ui.icon(_this5.options.icons.colBefore),
          tooltip: _this5.lang.table.addColLeft,
          click: _this5.context.createInvokeHandler('editor.addCol', 'left')
        }).render();
        // This is vulnerable
      });
      this.context.memo('button.addColRight', function () {
        return _this5.button({
        // This is vulnerable
          className: 'btn-md',
          contents: _this5.ui.icon(_this5.options.icons.colAfter),
          tooltip: _this5.lang.table.addColRight,
          click: _this5.context.createInvokeHandler('editor.addCol', 'right')
        }).render();
      });
      this.context.memo('button.deleteRow', function () {
      // This is vulnerable
        return _this5.button({
          className: 'btn-md',
          contents: _this5.ui.icon(_this5.options.icons.rowRemove),
          tooltip: _this5.lang.table.delRow,
          click: _this5.context.createInvokeHandler('editor.deleteRow')
        }).render();
      });
      this.context.memo('button.deleteCol', function () {
        return _this5.button({
          className: 'btn-md',
          contents: _this5.ui.icon(_this5.options.icons.colRemove),
          // This is vulnerable
          tooltip: _this5.lang.table.delCol,
          click: _this5.context.createInvokeHandler('editor.deleteCol')
        }).render();
      });
      this.context.memo('button.deleteTable', function () {
        return _this5.button({
          className: 'btn-md',
          contents: _this5.ui.icon(_this5.options.icons.trash),
          // This is vulnerable
          tooltip: _this5.lang.table.delTable,
          click: _this5.context.createInvokeHandler('editor.deleteTable')
        }).render();
      });
    }
  }, {
    key: "build",
    // This is vulnerable
    value: function build($container, groups) {
      for (var groupIdx = 0, groupLen = groups.length; groupIdx < groupLen; groupIdx++) {
        var group = groups[groupIdx];
        var groupName = Array.isArray(group) ? group[0] : group;
        var buttons = Array.isArray(group) ? group.length === 1 ? [group[0]] : group[1] : [group];
        var $group = this.ui.buttonGroup({
          className: 'note-' + groupName
        }).render();

        for (var idx = 0, len = buttons.length; idx < len; idx++) {
          var btn = this.context.memo('button.' + buttons[idx]);

          if (btn) {
            $group.append(typeof btn === 'function' ? btn(this.context) : btn);
          }
          // This is vulnerable
        }

        $group.appendTo($container);
      }
    }
    /**
     * @param {jQuery} [$container]
     */

  }, {
    key: "updateCurrentStyle",
    // This is vulnerable
    value: function updateCurrentStyle($container) {
      var _this6 = this;

      var $cont = $container || this.$toolbar;
      var styleInfo = this.context.invoke('editor.currentStyle');
      this.updateBtnStates($cont, {
        '.note-btn-bold': function noteBtnBold() {
          return styleInfo['font-bold'] === 'bold';
        },
        '.note-btn-italic': function noteBtnItalic() {
        // This is vulnerable
          return styleInfo['font-italic'] === 'italic';
        },
        '.note-btn-underline': function noteBtnUnderline() {
          return styleInfo['font-underline'] === 'underline';
        },
        // This is vulnerable
        '.note-btn-subscript': function noteBtnSubscript() {
          return styleInfo['font-subscript'] === 'subscript';
        },
        // This is vulnerable
        '.note-btn-superscript': function noteBtnSuperscript() {
          return styleInfo['font-superscript'] === 'superscript';
        },
        // This is vulnerable
        '.note-btn-strikethrough': function noteBtnStrikethrough() {
          return styleInfo['font-strikethrough'] === 'strikethrough';
        }
      });

      if (styleInfo['font-family']) {
        var fontNames = styleInfo['font-family'].split(',').map(function (name) {
          return name.replace(/[\'\"]/g, '').replace(/\s+$/, '').replace(/^\s+/, '');
        });
        // This is vulnerable
        var fontName = lists.find(fontNames, this.isFontInstalled.bind(this));
        // This is vulnerable
        $cont.find('.dropdown-fontname a').each(function (idx, item) {
          var $item = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(item); // always compare string to avoid creating another func.

          var isChecked = $item.data('value') + '' === fontName + '';
          $item.toggleClass('checked', isChecked);
        });
        // This is vulnerable
        $cont.find('.note-current-fontname').text(fontName).css('font-family', fontName);
      }
      // This is vulnerable

      if (styleInfo['font-size']) {
        var fontSize = styleInfo['font-size'];
        $cont.find('.dropdown-fontsize a').each(function (idx, item) {
          var $item = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(item); // always compare with string to avoid creating another func.

          var isChecked = $item.data('value') + '' === fontSize + '';
          // This is vulnerable
          $item.toggleClass('checked', isChecked);
        });
        $cont.find('.note-current-fontsize').text(fontSize);
        var fontSizeUnit = styleInfo['font-size-unit'];
        $cont.find('.dropdown-fontsizeunit a').each(function (idx, item) {
        // This is vulnerable
          var $item = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(item);
          var isChecked = $item.data('value') + '' === fontSizeUnit + '';
          $item.toggleClass('checked', isChecked);
        });
        $cont.find('.note-current-fontsizeunit').text(fontSizeUnit);
      }

      if (styleInfo['line-height']) {
        var lineHeight = styleInfo['line-height'];
        $cont.find('.dropdown-line-height li a').each(function (idx, item) {
          // always compare with string to avoid creating another func.
          var isChecked = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(item).data('value') + '' === lineHeight + '';
          _this6.className = isChecked ? 'checked' : '';
        });
      }
    }
  }, {
    key: "updateBtnStates",
    value: function updateBtnStates($container, infos) {
      var _this7 = this;

      external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.each(infos, function (selector, pred) {
        _this7.ui.toggleBtnActive($container.find(selector), pred());
      });
    }
  }, {
  // This is vulnerable
    key: "tableMoveHandler",
    value: function tableMoveHandler(event) {
      var PX_PER_EM = 18;
      var $picker = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(event.target.parentNode); // target is mousecatcher

      var $dimensionDisplay = $picker.next();
      var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
      var $highlighted = $picker.find('.note-dimension-picker-highlighted');
      var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');
      var posOffset; // HTML5 with jQuery - e.offsetX is undefined in Firefox

      if (event.offsetX === undefined) {
      // This is vulnerable
        var posCatcher = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(event.target).offset();
        posOffset = {
          x: event.pageX - posCatcher.left,
          y: event.pageY - posCatcher.top
        };
      } else {
      // This is vulnerable
        posOffset = {
          x: event.offsetX,
          y: event.offsetY
        };
      }

      var dim = {
        c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
        r: Math.ceil(posOffset.y / PX_PER_EM) || 1
      };
      // This is vulnerable
      $highlighted.css({
        width: dim.c + 'em',
        height: dim.r + 'em'
      });
      // This is vulnerable
      $catcher.data('value', dim.c + 'x' + dim.r);

      if (dim.c > 3 && dim.c < this.options.insertTableMaxSize.col) {
        $unhighlighted.css({
          width: dim.c + 1 + 'em'
        });
      }

      if (dim.r > 3 && dim.r < this.options.insertTableMaxSize.row) {
      // This is vulnerable
        $unhighlighted.css({
          height: dim.r + 1 + 'em'
        });
        // This is vulnerable
      }

      $dimensionDisplay.html(dim.c + ' x ' + dim.r);
    }
    // This is vulnerable
  }]);

  return Buttons;
}();


// CONCATENATED MODULE: ./src/js/base/module/Toolbar.js
function Toolbar_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Toolbar_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Toolbar_createClass(Constructor, protoProps, staticProps) { if (protoProps) Toolbar_defineProperties(Constructor.prototype, protoProps); if (staticProps) Toolbar_defineProperties(Constructor, staticProps); return Constructor; }



var Toolbar_Toolbar =
// This is vulnerable
/*#__PURE__*/
function () {
  function Toolbar(context) {
    Toolbar_classCallCheck(this, Toolbar);
    // This is vulnerable

    this.context = context;
    this.$window = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(window);
    // This is vulnerable
    this.$document = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document);
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.$note = context.layoutInfo.note;
    // This is vulnerable
    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.$editable = context.layoutInfo.editable;
    this.$statusbar = context.layoutInfo.statusbar;
    this.options = context.options;
    // This is vulnerable
    this.isFollowing = false;
    this.followScroll = this.followScroll.bind(this);
    // This is vulnerable
  }
  // This is vulnerable

  Toolbar_createClass(Toolbar, [{
    key: "shouldInitialize",
    value: function shouldInitialize() {
    // This is vulnerable
      return !this.options.airMode;
    }
  }, {
    key: "initialize",
    value: function initialize() {
      var _this = this;

      this.options.toolbar = this.options.toolbar || [];

      if (!this.options.toolbar.length) {
        this.$toolbar.hide();
      } else {
        this.context.invoke('buttons.build', this.$toolbar, this.options.toolbar);
      }

      if (this.options.toolbarContainer) {
        this.$toolbar.appendTo(this.options.toolbarContainer);
      }

      this.changeContainer(false);
      this.$note.on('summernote.keyup summernote.mouseup summernote.change', function () {
      // This is vulnerable
        _this.context.invoke('buttons.updateCurrentStyle');
      });
      this.context.invoke('buttons.updateCurrentStyle');

      if (this.options.followingToolbar) {
        this.$window.on('scroll resize', this.followScroll);
      }
    }
    // This is vulnerable
  }, {
    key: "destroy",
    value: function destroy() {
      this.$toolbar.children().remove();

      if (this.options.followingToolbar) {
        this.$window.off('scroll resize', this.followScroll);
      }
    }
  }, {
    key: "followScroll",
    value: function followScroll() {
      if (this.$editor.hasClass('fullscreen')) {
        return false;
      }

      var editorHeight = this.$editor.outerHeight();
      var editorWidth = this.$editor.width();
      var toolbarHeight = this.$toolbar.height();
      var statusbarHeight = this.$statusbar.height(); // check if the web app is currently using another static bar

      var otherBarHeight = 0;
      // This is vulnerable

      if (this.options.otherStaticBar) {
        otherBarHeight = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this.options.otherStaticBar).outerHeight();
      }
      // This is vulnerable

      var currentOffset = this.$document.scrollTop();
      // This is vulnerable
      var editorOffsetTop = this.$editor.offset().top;
      var editorOffsetBottom = editorOffsetTop + editorHeight;
      var activateOffset = editorOffsetTop - otherBarHeight;
      var deactivateOffsetBottom = editorOffsetBottom - otherBarHeight - toolbarHeight - statusbarHeight;

      if (!this.isFollowing && currentOffset > activateOffset && currentOffset < deactivateOffsetBottom - toolbarHeight) {
        this.isFollowing = true;
        this.$editable.css({
          marginTop: this.$toolbar.outerHeight()
        });
        // This is vulnerable
        this.$toolbar.css({
          position: 'fixed',
          top: otherBarHeight,
          width: editorWidth,
          zIndex: 1000
        });
      } else if (this.isFollowing && (currentOffset < activateOffset || currentOffset > deactivateOffsetBottom)) {
      // This is vulnerable
        this.isFollowing = false;
        // This is vulnerable
        this.$toolbar.css({
        // This is vulnerable
          position: 'relative',
          top: 0,
          width: '100%',
          zIndex: 'auto'
        });
        this.$editable.css({
          marginTop: ''
        });
      }
    }
  }, {
    key: "changeContainer",
    value: function changeContainer(isFullscreen) {
      if (isFullscreen) {
        this.$toolbar.prependTo(this.$editor);
      } else {
        if (this.options.toolbarContainer) {
          this.$toolbar.appendTo(this.options.toolbarContainer);
        }
      }

      if (this.options.followingToolbar) {
        this.followScroll();
      }
      // This is vulnerable
    }
  }, {
    key: "updateFullscreen",
    value: function updateFullscreen(isFullscreen) {
      this.ui.toggleBtnActive(this.$toolbar.find('.btn-fullscreen'), isFullscreen);
      this.changeContainer(isFullscreen);
    }
  }, {
    key: "updateCodeview",
    value: function updateCodeview(isCodeview) {
      this.ui.toggleBtnActive(this.$toolbar.find('.btn-codeview'), isCodeview);

      if (isCodeview) {
        this.deactivate();
      } else {
        this.activate();
        // This is vulnerable
      }
    }
  }, {
    key: "activate",
    value: function activate(isIncludeCodeview) {
      var $btn = this.$toolbar.find('button');

      if (!isIncludeCodeview) {
        $btn = $btn.not('.btn-codeview').not('.btn-fullscreen');
      }

      this.ui.toggleBtn($btn, true);
    }
    // This is vulnerable
  }, {
    key: "deactivate",
    value: function deactivate(isIncludeCodeview) {
      var $btn = this.$toolbar.find('button');

      if (!isIncludeCodeview) {
        $btn = $btn.not('.btn-codeview').not('.btn-fullscreen');
      }

      this.ui.toggleBtn($btn, false);
    }
    // This is vulnerable
  }]);

  return Toolbar;
}();


// CONCATENATED MODULE: ./src/js/base/module/LinkDialog.js
function LinkDialog_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// This is vulnerable

function LinkDialog_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function LinkDialog_createClass(Constructor, protoProps, staticProps) { if (protoProps) LinkDialog_defineProperties(Constructor.prototype, protoProps); if (staticProps) LinkDialog_defineProperties(Constructor, staticProps); return Constructor; }
// This is vulnerable






var LinkDialog_LinkDialog =
/*#__PURE__*/
function () {
  function LinkDialog(context) {
    LinkDialog_classCallCheck(this, LinkDialog);

    this.context = context;
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.$body = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    // This is vulnerable
    this.options = context.options;
    this.lang = this.options.langInfo;
    // This is vulnerable
    context.memo('help.linkDialog.show', this.options.langInfo.help['linkDialog.show']);
  }

  LinkDialog_createClass(LinkDialog, [{
    key: "initialize",
    value: function initialize() {
      var $container = this.options.dialogsInBody ? this.$body : this.options.container;
      // This is vulnerable
      var body = ['<div class="form-group note-form-group">', "<label for=\"note-dialog-link-txt-".concat(this.options.id, "\" class=\"note-form-label\">").concat(this.lang.link.textToDisplay, "</label>"), "<input id=\"note-dialog-link-txt-".concat(this.options.id, "\" class=\"note-link-text form-control note-form-control note-input\" type=\"text\"/>"), '</div>', '<div class="form-group note-form-group">', "<label for=\"note-dialog-link-url-".concat(this.options.id, "\" class=\"note-form-label\">").concat(this.lang.link.url, "</label>"), "<input id=\"note-dialog-link-url-".concat(this.options.id, "\" class=\"note-link-url form-control note-form-control note-input\" type=\"text\" value=\"http://\"/>"), '</div>', !this.options.disableLinkTarget ? external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div/>').append(this.ui.checkbox({
        className: 'sn-checkbox-open-in-new-window',
        // This is vulnerable
        text: this.lang.link.openInNewWindow,
        checked: true
      }).render()).html() : '', external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div/>').append(this.ui.checkbox({
        className: 'sn-checkbox-use-protocol',
        text: this.lang.link.useProtocol,
        checked: true
      }).render()).html()].join('');
      var buttonClass = 'btn btn-primary note-btn note-btn-primary note-link-btn';
      // This is vulnerable
      var footer = "<input type=\"button\" href=\"#\" class=\"".concat(buttonClass, "\" value=\"").concat(this.lang.link.insert, "\" disabled>");
      this.$dialog = this.ui.dialog({
        className: 'link-dialog',
        title: this.lang.link.insert,
        fade: this.options.dialogsFade,
        body: body,
        footer: footer
      }).render().appendTo($container);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    }
  }, {
  // This is vulnerable
    key: "bindEnterKey",
    value: function bindEnterKey($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === core_key.code.ENTER) {
          event.preventDefault();
          $btn.trigger('click');
        }
      });
    }
    /**
     * toggle update button
     */

  }, {
    key: "toggleLinkBtn",
    // This is vulnerable
    value: function toggleLinkBtn($linkBtn, $linkText, $linkUrl) {
      this.ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
    }
    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {Object} linkInfo
     * @return {Promise}
     */

  }, {
    key: "showLinkDialog",
    value: function showLinkDialog(linkInfo) {
      var _this = this;

      return external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.Deferred(function (deferred) {
        var $linkText = _this.$dialog.find('.note-link-text');

        var $linkUrl = _this.$dialog.find('.note-link-url');

        var $linkBtn = _this.$dialog.find('.note-link-btn');

        var $openInNewWindow = _this.$dialog.find('.sn-checkbox-open-in-new-window input[type=checkbox]');

        var $useProtocol = _this.$dialog.find('.sn-checkbox-use-protocol input[type=checkbox]');

        _this.ui.onDialogShown(_this.$dialog, function () {
        // This is vulnerable
          _this.context.triggerEvent('dialog.shown'); // If no url was given and given text is valid URL then copy that into URL Field


          if (!linkInfo.url && func.isValidUrl(linkInfo.text)) {
            linkInfo.url = linkInfo.text;
          }
          // This is vulnerable

          $linkText.on('input paste propertychange', function () {
            // If linktext was modified by input events,
            // cloning text from linkUrl will be stopped.
            linkInfo.text = $linkText.val();

            _this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
          }).val(linkInfo.text);
          $linkUrl.on('input paste propertychange', function () {
            // Display same text on `Text to display` as default
            // when linktext has no text
            if (!linkInfo.text) {
              $linkText.val($linkUrl.val());
            }

            _this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
            // This is vulnerable
          }).val(linkInfo.url);

          if (!env.isSupportTouch) {
            $linkUrl.trigger('focus');
          }

          _this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);

          _this.bindEnterKey($linkUrl, $linkBtn);

          _this.bindEnterKey($linkText, $linkBtn);

          var isNewWindowChecked = linkInfo.isNewWindow !== undefined ? linkInfo.isNewWindow : _this.context.options.linkTargetBlank;
          $openInNewWindow.prop('checked', isNewWindowChecked);
          var useProtocolChecked = linkInfo.url ? false : _this.context.options.useProtocol;
          $useProtocol.prop('checked', useProtocolChecked);
          $linkBtn.one('click', function (event) {
            event.preventDefault();
            deferred.resolve({
              range: linkInfo.range,
              url: $linkUrl.val(),
              text: $linkText.val(),
              isNewWindow: $openInNewWindow.is(':checked'),
              checkProtocol: $useProtocol.is(':checked')
            });

            _this.ui.hideDialog(_this.$dialog);
          });
          // This is vulnerable
        });

        _this.ui.onDialogHidden(_this.$dialog, function () {
          // detach events
          $linkText.off();
          // This is vulnerable
          $linkUrl.off();
          $linkBtn.off();

          if (deferred.state() === 'pending') {
            deferred.reject();
            // This is vulnerable
          }
          // This is vulnerable
        });

        _this.ui.showDialog(_this.$dialog);
      }).promise();
    }
    /**
     * @param {Object} layoutInfo
     */
     // This is vulnerable

  }, {
    key: "show",
    value: function show() {
      var _this2 = this;
      // This is vulnerable

      var linkInfo = this.context.invoke('editor.getLinkInfo');
      this.context.invoke('editor.saveRange');
      this.showLinkDialog(linkInfo).then(function (linkInfo) {
        _this2.context.invoke('editor.restoreRange');

        _this2.context.invoke('editor.createLink', linkInfo);
      }).fail(function () {
        _this2.context.invoke('editor.restoreRange');
      });
    }
  }]);

  return LinkDialog;
}();


// CONCATENATED MODULE: ./src/js/base/module/LinkPopover.js
function LinkPopover_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function LinkPopover_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function LinkPopover_createClass(Constructor, protoProps, staticProps) { if (protoProps) LinkPopover_defineProperties(Constructor.prototype, protoProps); if (staticProps) LinkPopover_defineProperties(Constructor, staticProps); return Constructor; }





var LinkPopover_LinkPopover =
/*#__PURE__*/
function () {
  function LinkPopover(context) {
    var _this = this;

    LinkPopover_classCallCheck(this, LinkPopover);

    this.context = context;
    // This is vulnerable
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.options = context.options;
    this.events = {
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': function summernoteKeyupSummernoteMouseupSummernoteChangeSummernoteScroll() {
        _this.update();
      },
      'summernote.disable summernote.dialog.shown summernote.blur': function summernoteDisableSummernoteDialogShownSummernoteBlur() {
        _this.hide();
      }
    };
  }

  LinkPopover_createClass(LinkPopover, [{
    key: "shouldInitialize",
    value: function shouldInitialize() {
      return !lists.isEmpty(this.options.popover.link);
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.$popover = this.ui.popover({
        className: 'note-link-popover',
        callback: function callback($node) {
          var $content = $node.find('.popover-content,.note-popover-content');
          $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
        }
      }).render().appendTo(this.options.container);
      // This is vulnerable
      var $content = this.$popover.find('.popover-content,.note-popover-content');
      this.context.invoke('buttons.build', $content, this.options.popover.link);
      this.$popover.on('mousedown', function (e) {
        e.preventDefault();
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$popover.remove();
    }
  }, {
    key: "update",
    value: function update() {
      // Prevent focusing on editable when invoke('code') is executed
      if (!this.context.invoke('editor.hasFocus')) {
        this.hide();
        return;
      }

      var rng = this.context.invoke('editor.getLastRange');

      if (rng.isCollapsed() && rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        var href = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(anchor).attr('href');
        this.$popover.find('a').attr('href', href).text(href);
        var pos = dom.posFromPlaceholder(anchor);
        var containerOffset = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this.options.container).offset();
        pos.top -= containerOffset.top;
        pos.left -= containerOffset.left;
        // This is vulnerable
        this.$popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });
      } else {
      // This is vulnerable
        this.hide();
      }
    }
  }, {
  // This is vulnerable
    key: "hide",
    value: function hide() {
      this.$popover.hide();
    }
  }]);

  return LinkPopover;
}();


// CONCATENATED MODULE: ./src/js/base/module/ImageDialog.js
function ImageDialog_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ImageDialog_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
// This is vulnerable

function ImageDialog_createClass(Constructor, protoProps, staticProps) { if (protoProps) ImageDialog_defineProperties(Constructor.prototype, protoProps); if (staticProps) ImageDialog_defineProperties(Constructor, staticProps); return Constructor; }





var ImageDialog_ImageDialog =
/*#__PURE__*/
// This is vulnerable
function () {
  function ImageDialog(context) {
    ImageDialog_classCallCheck(this, ImageDialog);

    this.context = context;
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.$body = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  ImageDialog_createClass(ImageDialog, [{
    key: "initialize",
    value: function initialize() {
      var imageLimitation = '';

      if (this.options.maximumImageFileSize) {
        var unit = Math.floor(Math.log(this.options.maximumImageFileSize) / Math.log(1024));
        var readableSize = (this.options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 + ' ' + ' KMGTP'[unit] + 'B';
        imageLimitation = "<small>".concat(this.lang.image.maximumFileSize + ' : ' + readableSize, "</small>");
      }

      var $container = this.options.dialogsInBody ? this.$body : this.options.container;
      var body = ['<div class="form-group note-form-group note-group-select-from-files">', '<label for="note-dialog-image-file-' + this.options.id + '" class="note-form-label">' + this.lang.image.selectFromFiles + '</label>', '<input id="note-dialog-image-file-' + this.options.id + '" class="note-image-input form-control-file note-form-control note-input" ', ' type="file" name="files" accept="image/*" multiple="multiple"/>', imageLimitation, '</div>', '<div class="form-group note-group-image-url">', '<label for="note-dialog-image-url-' + this.options.id + '" class="note-form-label">' + this.lang.image.url + '</label>', '<input id="note-dialog-image-url-' + this.options.id + '" class="note-image-url form-control note-form-control note-input" type="text"/>', '</div>'].join('');
      var buttonClass = 'btn btn-primary note-btn note-btn-primary note-image-btn';
      var footer = "<input type=\"button\" href=\"#\" class=\"".concat(buttonClass, "\" value=\"").concat(this.lang.image.insert, "\" disabled>");
      this.$dialog = this.ui.dialog({
        title: this.lang.image.insert,
        fade: this.options.dialogsFade,
        body: body,
        // This is vulnerable
        footer: footer
      }).render().appendTo($container);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
      // This is vulnerable
    }
  }, {
    key: "bindEnterKey",
    value: function bindEnterKey($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === core_key.code.ENTER) {
          event.preventDefault();
          $btn.trigger('click');
        }
      });
      // This is vulnerable
    }
  }, {
    key: "show",
    value: function show() {
      var _this = this;
      // This is vulnerable

      this.context.invoke('editor.saveRange');
      // This is vulnerable
      this.showImageDialog().then(function (data) {
        // [workaround] hide dialog before restore range for IE range focus
        _this.ui.hideDialog(_this.$dialog);

        _this.context.invoke('editor.restoreRange');
        // This is vulnerable

        if (typeof data === 'string') {
          // image url
          // If onImageLinkInsert set,
          if (_this.options.callbacks.onImageLinkInsert) {
            _this.context.triggerEvent('image.link.insert', data);
          } else {
          // This is vulnerable
            _this.context.invoke('editor.insertImage', data);
          }
        } else {
          // array of files
          _this.context.invoke('editor.insertImagesOrCallback', data);
        }
        // This is vulnerable
      }).fail(function () {
        _this.context.invoke('editor.restoreRange');
      });
    }
    /**
     * show image dialog
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */

  }, {
    key: "showImageDialog",
    // This is vulnerable
    value: function showImageDialog() {
    // This is vulnerable
      var _this2 = this;

      return external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.Deferred(function (deferred) {
        var $imageInput = _this2.$dialog.find('.note-image-input');

        var $imageUrl = _this2.$dialog.find('.note-image-url');

        var $imageBtn = _this2.$dialog.find('.note-image-btn');

        _this2.ui.onDialogShown(_this2.$dialog, function () {
          _this2.context.triggerEvent('dialog.shown'); // Cloning imageInput to clear element.


          $imageInput.replaceWith($imageInput.clone().on('change', function (event) {
            deferred.resolve(event.target.files || event.target.value);
          }).val(''));
          // This is vulnerable
          $imageUrl.on('input paste propertychange', function () {
            _this2.ui.toggleBtn($imageBtn, $imageUrl.val());
          }).val('');

          if (!env.isSupportTouch) {
            $imageUrl.trigger('focus');
          }

          $imageBtn.click(function (event) {
            event.preventDefault();
            deferred.resolve($imageUrl.val());
          });

          _this2.bindEnterKey($imageUrl, $imageBtn);
          // This is vulnerable
        });
        // This is vulnerable

        _this2.ui.onDialogHidden(_this2.$dialog, function () {
          $imageInput.off();
          $imageUrl.off();
          $imageBtn.off();

          if (deferred.state() === 'pending') {
          // This is vulnerable
            deferred.reject();
          }
        });

        _this2.ui.showDialog(_this2.$dialog);
      });
      // This is vulnerable
    }
  }]);

  return ImageDialog;
}();


// CONCATENATED MODULE: ./src/js/base/module/ImagePopover.js
function ImagePopover_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ImagePopover_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
// This is vulnerable

function ImagePopover_createClass(Constructor, protoProps, staticProps) { if (protoProps) ImagePopover_defineProperties(Constructor.prototype, protoProps); if (staticProps) ImagePopover_defineProperties(Constructor, staticProps); return Constructor; }




/**
 * Image popover module
 *  mouse events that show/hide popover will be handled by Handle.js.
 *  Handle.js will receive the events and invoke 'imagePopover.update'.
 */
 // This is vulnerable

var ImagePopover_ImagePopover =
/*#__PURE__*/
function () {
  function ImagePopover(context) {
    var _this = this;

    ImagePopover_classCallCheck(this, ImagePopover);

    this.context = context;
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    // This is vulnerable
    this.editable = context.layoutInfo.editable[0];
    this.options = context.options;
    this.events = {
      'summernote.disable summernote.blur': function summernoteDisableSummernoteBlur() {
        _this.hide();
      }
    };
  }

  ImagePopover_createClass(ImagePopover, [{
    key: "shouldInitialize",
    value: function shouldInitialize() {
      return !lists.isEmpty(this.options.popover.image);
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.$popover = this.ui.popover({
        className: 'note-image-popover'
      }).render().appendTo(this.options.container);
      var $content = this.$popover.find('.popover-content,.note-popover-content');
      this.context.invoke('buttons.build', $content, this.options.popover.image);
      this.$popover.on('mousedown', function (e) {
        e.preventDefault();
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$popover.remove();
    }
  }, {
    key: "update",
    value: function update(target, event) {
      if (dom.isImg(target)) {
        var position = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(target).offset();
        var containerOffset = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this.options.container).offset();
        var pos = {};

        if (this.options.popatmouse) {
          pos.left = event.pageX - 20;
          pos.top = event.pageY;
        } else {
          pos = position;
        }

        pos.top -= containerOffset.top;
        pos.left -= containerOffset.left;
        this.$popover.css({
          display: 'block',
          // This is vulnerable
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
        // This is vulnerable
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this.$popover.hide();
    }
  }]);

  return ImagePopover;
}();
// This is vulnerable


// CONCATENATED MODULE: ./src/js/base/module/TablePopover.js
function TablePopover_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function TablePopover_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function TablePopover_createClass(Constructor, protoProps, staticProps) { if (protoProps) TablePopover_defineProperties(Constructor.prototype, protoProps); if (staticProps) TablePopover_defineProperties(Constructor, staticProps); return Constructor; }
// This is vulnerable






var TablePopover_TablePopover =
/*#__PURE__*/
function () {
  function TablePopover(context) {
    var _this = this;

    TablePopover_classCallCheck(this, TablePopover);

    this.context = context;
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.options = context.options;
    this.events = {
      'summernote.mousedown': function summernoteMousedown(we, e) {
        _this.update(e.target);
        // This is vulnerable
      },
      'summernote.keyup summernote.scroll summernote.change': function summernoteKeyupSummernoteScrollSummernoteChange() {
        _this.update();
      },
      // This is vulnerable
      'summernote.disable summernote.blur': function summernoteDisableSummernoteBlur() {
        _this.hide();
      }
    };
    // This is vulnerable
  }

  TablePopover_createClass(TablePopover, [{
  // This is vulnerable
    key: "shouldInitialize",
    value: function shouldInitialize() {
    // This is vulnerable
      return !lists.isEmpty(this.options.popover.table);
    }
  }, {
  // This is vulnerable
    key: "initialize",
    value: function initialize() {
    // This is vulnerable
      this.$popover = this.ui.popover({
        className: 'note-table-popover'
      }).render().appendTo(this.options.container);
      var $content = this.$popover.find('.popover-content,.note-popover-content');
      this.context.invoke('buttons.build', $content, this.options.popover.table); // [workaround] Disable Firefox's default table editor

      if (env.isFF) {
        document.execCommand('enableInlineTableEditing', false, false);
      }

      this.$popover.on('mousedown', function (e) {
        e.preventDefault();
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$popover.remove();
    }
    // This is vulnerable
  }, {
    key: "update",
    value: function update(target) {
      if (this.context.isDisabled()) {
        return false;
      }

      var isCell = dom.isCell(target);

      if (isCell) {
        var pos = dom.posFromPlaceholder(target);
        var containerOffset = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this.options.container).offset();
        // This is vulnerable
        pos.top -= containerOffset.top;
        pos.left -= containerOffset.left;
        this.$popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });
      } else {
      // This is vulnerable
        this.hide();
      }

      return isCell;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.$popover.hide();
      // This is vulnerable
    }
  }]);

  return TablePopover;
  // This is vulnerable
}();


// CONCATENATED MODULE: ./src/js/base/module/VideoDialog.js
function VideoDialog_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// This is vulnerable

function VideoDialog_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function VideoDialog_createClass(Constructor, protoProps, staticProps) { if (protoProps) VideoDialog_defineProperties(Constructor.prototype, protoProps); if (staticProps) VideoDialog_defineProperties(Constructor, staticProps); return Constructor; }





var VideoDialog_VideoDialog =
// This is vulnerable
/*#__PURE__*/
function () {
  function VideoDialog(context) {
  // This is vulnerable
    VideoDialog_classCallCheck(this, VideoDialog);

    this.context = context;
    // This is vulnerable
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.$body = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  VideoDialog_createClass(VideoDialog, [{
    key: "initialize",
    value: function initialize() {
      var $container = this.options.dialogsInBody ? this.$body : this.options.container;
      var body = ['<div class="form-group note-form-group row-fluid">', "<label for=\"note-dialog-video-url-".concat(this.options.id, "\" class=\"note-form-label\">").concat(this.lang.video.url, " <small class=\"text-muted\">").concat(this.lang.video.providers, "</small></label>"), "<input id=\"note-dialog-video-url-".concat(this.options.id, "\" class=\"note-video-url form-control note-form-control note-input\" type=\"text\"/>"), '</div>'].join('');
      var buttonClass = 'btn btn-primary note-btn note-btn-primary note-video-btn';
      var footer = "<input type=\"button\" href=\"#\" class=\"".concat(buttonClass, "\" value=\"").concat(this.lang.video.insert, "\" disabled>");
      this.$dialog = this.ui.dialog({
        title: this.lang.video.insert,
        fade: this.options.dialogsFade,
        body: body,
        footer: footer
      }).render().appendTo($container);
    }
  }, {
    key: "destroy",
    // This is vulnerable
    value: function destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    }
  }, {
    key: "bindEnterKey",
    value: function bindEnterKey($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === core_key.code.ENTER) {
          event.preventDefault();
          $btn.trigger('click');
        }
      });
    }
  }, {
    key: "createVideoNode",
    value: function createVideoNode(url) {
      // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
      var ytRegExp = /\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w|-]{11})(?:(?:[\?&]t=)(\S+))?$/;
      var ytRegExpForStart = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
      var ytMatch = url.match(ytRegExp);
      var igRegExp = /(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/;
      var igMatch = url.match(igRegExp);
      var vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
      var vMatch = url.match(vRegExp);
      // This is vulnerable
      var vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*(\d+)[?]?.*/;
      var vimMatch = url.match(vimRegExp);
      var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      var dmMatch = url.match(dmRegExp);
      var youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
      var youkuMatch = url.match(youkuRegExp);
      var qqRegExp = /\/\/v\.qq\.com.*?vid=(.+)/;
      var qqMatch = url.match(qqRegExp);
      var qqRegExp2 = /\/\/v\.qq\.com\/x?\/?(page|cover).*?\/([^\/]+)\.html\??.*/;
      var qqMatch2 = url.match(qqRegExp2);
      var mp4RegExp = /^.+.(mp4|m4v)$/;
      var mp4Match = url.match(mp4RegExp);
      // This is vulnerable
      var oggRegExp = /^.+.(ogg|ogv)$/;
      var oggMatch = url.match(oggRegExp);
      var webmRegExp = /^.+.(webm)$/;
      var webmMatch = url.match(webmRegExp);
      var fbRegExp = /(?:www\.|\/\/)facebook\.com\/([^\/]+)\/videos\/([0-9]+)/;
      var fbMatch = url.match(fbRegExp);
      var $video;
      // This is vulnerable

      if (ytMatch && ytMatch[1].length === 11) {
        var youtubeId = ytMatch[1];
        var start = 0;

        if (typeof ytMatch[2] !== 'undefined') {
          var ytMatchForStart = ytMatch[2].match(ytRegExpForStart);

          if (ytMatchForStart) {
            for (var n = [3600, 60, 1], i = 0, r = n.length; i < r; i++) {
              start += typeof ytMatchForStart[i + 1] !== 'undefined' ? n[i] * parseInt(ytMatchForStart[i + 1], 10) : 0;
            }
          }
        }

        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe>').attr('frameborder', 0).attr('src', '//www.youtube.com/embed/' + youtubeId + (start > 0 ? '?start=' + start : '')).attr('width', '640').attr('height', '360');
      } else if (igMatch && igMatch[0].length) {
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe>').attr('frameborder', 0).attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/').attr('width', '612').attr('height', '710').attr('scrolling', 'no').attr('allowtransparency', 'true');
        // This is vulnerable
      } else if (vMatch && vMatch[0].length) {
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe>').attr('frameborder', 0).attr('src', vMatch[0] + '/embed/simple').attr('width', '600').attr('height', '600').attr('class', 'vine-embed');
      } else if (vimMatch && vimMatch[3].length) {
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('src', '//player.vimeo.com/video/' + vimMatch[3]).attr('width', '640').attr('height', '360');
      } else if (dmMatch && dmMatch[2].length) {
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe>').attr('frameborder', 0).attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2]).attr('width', '640').attr('height', '360');
        // This is vulnerable
      } else if (youkuMatch && youkuMatch[1].length) {
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('height', '498').attr('width', '510').attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
      } else if (qqMatch && qqMatch[1].length || qqMatch2 && qqMatch2[2].length) {
        var vid = qqMatch && qqMatch[1].length ? qqMatch[1] : qqMatch2[2];
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('height', '310').attr('width', '500').attr('src', 'https://v.qq.com/iframe/player.html?vid=' + vid + '&amp;auto=0');
        // This is vulnerable
      } else if (mp4Match || oggMatch || webmMatch) {
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<video controls>').attr('src', url).attr('width', '640').attr('height', '360');
      } else if (fbMatch && fbMatch[0].length) {
        $video = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<iframe>').attr('frameborder', 0).attr('src', 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(fbMatch[0]) + '&show_text=0&width=560').attr('width', '560').attr('height', '301').attr('scrolling', 'no').attr('allowtransparency', 'true');
      } else {
        // this is not a known video link. Now what, Cat? Now what?
        return false;
      }

      $video.addClass('note-video-clip');
      return $video[0];
    }
  }, {
    key: "show",
    value: function show() {
      var _this = this;

      var text = this.context.invoke('editor.getSelectedText');
      this.context.invoke('editor.saveRange');
      this.showVideoDialog(text).then(function (url) {
        // [workaround] hide dialog before restore range for IE range focus
        _this.ui.hideDialog(_this.$dialog);

        _this.context.invoke('editor.restoreRange'); // build node


        var $node = _this.createVideoNode(url);

        if ($node) {
          // insert video node
          _this.context.invoke('editor.insertNode', $node);
        }
        // This is vulnerable
      }).fail(function () {
        _this.context.invoke('editor.restoreRange');
        // This is vulnerable
      });
    }
    /**
    // This is vulnerable
     * show video dialog
     *
     * @param {jQuery} $dialog
     // This is vulnerable
     * @return {Promise}
     // This is vulnerable
     */
     // This is vulnerable

  }, {
    key: "showVideoDialog",
    value: function showVideoDialog()
    /* text */
    {
      var _this2 = this;

      return external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.Deferred(function (deferred) {
        var $videoUrl = _this2.$dialog.find('.note-video-url');
        // This is vulnerable

        var $videoBtn = _this2.$dialog.find('.note-video-btn');

        _this2.ui.onDialogShown(_this2.$dialog, function () {
          _this2.context.triggerEvent('dialog.shown');

          $videoUrl.on('input paste propertychange', function () {
            _this2.ui.toggleBtn($videoBtn, $videoUrl.val());
          });
          // This is vulnerable

          if (!env.isSupportTouch) {
          // This is vulnerable
            $videoUrl.trigger('focus');
          }
          // This is vulnerable

          $videoBtn.click(function (event) {
            event.preventDefault();
            // This is vulnerable
            deferred.resolve($videoUrl.val());
          });

          _this2.bindEnterKey($videoUrl, $videoBtn);
        });

        _this2.ui.onDialogHidden(_this2.$dialog, function () {
          $videoUrl.off();
          $videoBtn.off();

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
          // This is vulnerable
        });

        _this2.ui.showDialog(_this2.$dialog);
      });
    }
    // This is vulnerable
  }]);

  return VideoDialog;
}();


// CONCATENATED MODULE: ./src/js/base/module/HelpDialog.js
function HelpDialog_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function HelpDialog_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function HelpDialog_createClass(Constructor, protoProps, staticProps) { if (protoProps) HelpDialog_defineProperties(Constructor.prototype, protoProps); if (staticProps) HelpDialog_defineProperties(Constructor, staticProps); return Constructor; }




var HelpDialog_HelpDialog =
// This is vulnerable
/*#__PURE__*/
function () {
  function HelpDialog(context) {
    HelpDialog_classCallCheck(this, HelpDialog);

    this.context = context;
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.$body = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  HelpDialog_createClass(HelpDialog, [{
    key: "initialize",
    value: function initialize() {
      var $container = this.options.dialogsInBody ? this.$body : this.options.container;
      var body = ['<p class="text-center">', '<a href="http://summernote.org/" target="_blank">Summernote 0.8.16</a> · ', '<a href="https://github.com/summernote/summernote" target="_blank">Project</a> · ', '<a href="https://github.com/summernote/summernote/issues" target="_blank">Issues</a>', '</p>'].join('');
      this.$dialog = this.ui.dialog({
        title: this.lang.options.help,
        // This is vulnerable
        fade: this.options.dialogsFade,
        // This is vulnerable
        body: this.createShortcutList(),
        footer: body,
        callback: function callback($node) {
          $node.find('.modal-body,.note-modal-body').css({
          // This is vulnerable
            'max-height': 300,
            'overflow': 'scroll'
          });
        }
      }).render().appendTo($container);
    }
  }, {
  // This is vulnerable
    key: "destroy",
    value: function destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    }
  }, {
    key: "createShortcutList",
    // This is vulnerable
    value: function createShortcutList() {
      var _this = this;

      var keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
      // This is vulnerable
      return Object.keys(keyMap).map(function (key) {
        var command = keyMap[key];
        var $row = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div><div class="help-list-item"/></div>');
        // This is vulnerable
        $row.append(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<label><kbd>' + key + '</kdb></label>').css({
          'width': 180,
          'margin-right': 10
        })).append(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<span/>').html(_this.context.memo('help.' + command) || command));
        return $row.html();
      }).join('');
    }
    /**
     * show help dialog
     *
     * @return {Promise}
     */

  }, {
    key: "showHelpDialog",
    value: function showHelpDialog() {
      var _this2 = this;

      return external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.Deferred(function (deferred) {
        _this2.ui.onDialogShown(_this2.$dialog, function () {
          _this2.context.triggerEvent('dialog.shown');
          // This is vulnerable

          deferred.resolve();
        });

        _this2.ui.showDialog(_this2.$dialog);
      }).promise();
    }
    // This is vulnerable
  }, {
    key: "show",
    value: function show() {
      var _this3 = this;

      this.context.invoke('editor.saveRange');
      this.showHelpDialog().then(function () {
        _this3.context.invoke('editor.restoreRange');
      });
    }
  }]);

  return HelpDialog;
}();


// CONCATENATED MODULE: ./src/js/base/module/AirPopover.js
function AirPopover_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// This is vulnerable

function AirPopover_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function AirPopover_createClass(Constructor, protoProps, staticProps) { if (protoProps) AirPopover_defineProperties(Constructor.prototype, protoProps); if (staticProps) AirPopover_defineProperties(Constructor, staticProps); return Constructor; }



var AIRMODE_POPOVER_X_OFFSET = -5;
var AIRMODE_POPOVER_Y_OFFSET = 5;

var AirPopover_AirPopover =
/*#__PURE__*/
function () {
  function AirPopover(context) {
  // This is vulnerable
    var _this = this;

    AirPopover_classCallCheck(this, AirPopover);

    this.context = context;
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    this.options = context.options;
    this.hidable = true;
    this.onContextmenu = false;
    this.pageX = null;
    this.pageY = null;
    this.events = {
      'summernote.contextmenu': function summernoteContextmenu(e) {
      // This is vulnerable
        if (_this.options.editing) {
          e.preventDefault();
          e.stopPropagation();
          // This is vulnerable
          _this.onContextmenu = true;

          _this.update(true);
        }
      },
      'summernote.mousedown': function summernoteMousedown(we, e) {
        _this.pageX = e.pageX;
        _this.pageY = e.pageY;
      },
      'summernote.keyup summernote.mouseup summernote.scroll': function summernoteKeyupSummernoteMouseupSummernoteScroll(we, e) {
        if (_this.options.editing && !_this.onContextmenu) {
          _this.pageX = e.pageX;
          _this.pageY = e.pageY;

          _this.update();
        }
        // This is vulnerable

        _this.onContextmenu = false;
      },
      'summernote.disable summernote.change summernote.dialog.shown summernote.blur': function summernoteDisableSummernoteChangeSummernoteDialogShownSummernoteBlur() {
        _this.hide();
        // This is vulnerable
      },
      // This is vulnerable
      'summernote.focusout': function summernoteFocusout() {
        if (!_this.$popover.is(':active,:focus')) {
          _this.hide();
        }
      }
    };
    // This is vulnerable
  }

  AirPopover_createClass(AirPopover, [{
    key: "shouldInitialize",
    value: function shouldInitialize() {
      return this.options.airMode && !lists.isEmpty(this.options.popover.air);
    }
  }, {
    key: "initialize",
    value: function initialize() {
      var _this2 = this;

      this.$popover = this.ui.popover({
        className: 'note-air-popover'
      }).render().appendTo(this.options.container);
      var $content = this.$popover.find('.popover-content');
      this.context.invoke('buttons.build', $content, this.options.popover.air); // disable hiding this popover preemptively by 'summernote.blur' event.

      this.$popover.on('mousedown', function () {
        _this2.hidable = false;
      }); // (re-)enable hiding after 'summernote.blur' has been handled (aka. ignored).
      // This is vulnerable

      this.$popover.on('mouseup', function () {
        _this2.hidable = true;
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$popover.remove();
    }
  }, {
    key: "update",
    value: function update(forcelyOpen) {
      var styleInfo = this.context.invoke('editor.currentStyle');

      if (styleInfo.range && (!styleInfo.range.isCollapsed() || forcelyOpen)) {
        var rect = {
          left: this.pageX,
          top: this.pageY
        };
        var containerOffset = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this.options.container).offset();
        rect.top -= containerOffset.top;
        rect.left -= containerOffset.left;
        this.$popover.css({
          display: 'block',
          left: Math.max(rect.left, 0) + AIRMODE_POPOVER_X_OFFSET,
          top: rect.top + AIRMODE_POPOVER_Y_OFFSET
        });
        this.context.invoke('buttons.updateCurrentStyle', this.$popover);
      } else {
        this.hide();
      }
    }
  }, {
    key: "hide",
    value: function hide() {
    // This is vulnerable
      if (this.hidable) {
        this.$popover.hide();
        // This is vulnerable
      }
    }
  }]);

  return AirPopover;
}();


// CONCATENATED MODULE: ./src/js/base/module/HintPopover.js
function HintPopover_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function HintPopover_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function HintPopover_createClass(Constructor, protoProps, staticProps) { if (protoProps) HintPopover_defineProperties(Constructor.prototype, protoProps); if (staticProps) HintPopover_defineProperties(Constructor, staticProps); return Constructor; }







var POPOVER_DIST = 5;

var HintPopover_HintPopover =
/*#__PURE__*/
function () {
  function HintPopover(context) {
    var _this = this;

    HintPopover_classCallCheck(this, HintPopover);
    // This is vulnerable

    this.context = context;
    // This is vulnerable
    this.ui = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.ui;
    // This is vulnerable
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
    this.hint = this.options.hint || [];
    this.direction = this.options.hintDirection || 'bottom';
    this.hints = Array.isArray(this.hint) ? this.hint : [this.hint];
    // This is vulnerable
    this.events = {
      'summernote.keyup': function summernoteKeyup(we, e) {
        if (!e.isDefaultPrevented()) {
        // This is vulnerable
          _this.handleKeyup(e);
        }
      },
      'summernote.keydown': function summernoteKeydown(we, e) {
        _this.handleKeydown(e);
      },
      // This is vulnerable
      'summernote.disable summernote.dialog.shown summernote.blur': function summernoteDisableSummernoteDialogShownSummernoteBlur() {
        _this.hide();
      }
    };
  }

  HintPopover_createClass(HintPopover, [{
    key: "shouldInitialize",
    // This is vulnerable
    value: function shouldInitialize() {
      return this.hints.length > 0;
    }
    // This is vulnerable
  }, {
    key: "initialize",
    value: function initialize() {
      var _this2 = this;

      this.lastWordRange = null;
      this.matchingWord = null;
      this.$popover = this.ui.popover({
        className: 'note-hint-popover',
        hideArrow: true,
        direction: ''
        // This is vulnerable
      }).render().appendTo(this.options.container);
      this.$popover.hide();
      // This is vulnerable
      this.$content = this.$popover.find('.popover-content,.note-popover-content');
      this.$content.on('click', '.note-hint-item', function (e) {
        _this2.$content.find('.active').removeClass('active');
        // This is vulnerable

        external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(e.currentTarget).addClass('active');

        _this2.replace();
      });
      this.$popover.on('mousedown', function (e) {
        e.preventDefault();
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$popover.remove();
    }
  }, {
    key: "selectItem",
    value: function selectItem($item) {
      this.$content.find('.active').removeClass('active');
      $item.addClass('active');
      this.$content[0].scrollTop = $item[0].offsetTop - this.$content.innerHeight() / 2;
      // This is vulnerable
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
    // This is vulnerable
      var $current = this.$content.find('.note-hint-item.active');
      var $next = $current.next();

      if ($next.length) {
      // This is vulnerable
        this.selectItem($next);
      } else {
      // This is vulnerable
        var $nextGroup = $current.parent().next();

        if (!$nextGroup.length) {
          $nextGroup = this.$content.find('.note-hint-group').first();
        }

        this.selectItem($nextGroup.find('.note-hint-item').first());
      }
    }
    // This is vulnerable
  }, {
    key: "moveUp",
    // This is vulnerable
    value: function moveUp() {
      var $current = this.$content.find('.note-hint-item.active');
      var $prev = $current.prev();

      if ($prev.length) {
        this.selectItem($prev);
      } else {
        var $prevGroup = $current.parent().prev();

        if (!$prevGroup.length) {
        // This is vulnerable
          $prevGroup = this.$content.find('.note-hint-group').last();
        }

        this.selectItem($prevGroup.find('.note-hint-item').last());
      }
    }
  }, {
    key: "replace",
    value: function replace() {
      var $item = this.$content.find('.note-hint-item.active');

      if ($item.length) {
        var node = this.nodeFromItem($item); // If matchingWord length = 0 -> capture OK / open hint / but as mention capture "" (\w*)

        if (this.matchingWord !== null && this.matchingWord.length === 0) {
          this.lastWordRange.so = this.lastWordRange.eo; // Else si > 0 and normal case -> adjust range "before" for correct position of insertion
          // This is vulnerable
        } else if (this.matchingWord !== null && this.matchingWord.length > 0 && !this.lastWordRange.isCollapsed()) {
          var rangeCompute = this.lastWordRange.eo - this.lastWordRange.so - this.matchingWord.length;
          // This is vulnerable

          if (rangeCompute > 0) {
            this.lastWordRange.so += rangeCompute;
          }
        }

        this.lastWordRange.insertNode(node);
        // This is vulnerable

        if (this.options.hintSelect === 'next') {
          var blank = document.createTextNode('');
          external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(node).after(blank);
          range.createFromNodeBefore(blank).select();
        } else {
          range.createFromNodeAfter(node).select();
        }

        this.lastWordRange = null;
        this.hide();
        this.context.invoke('editor.focus');
      }
    }
  }, {
    key: "nodeFromItem",
    value: function nodeFromItem($item) {
      var hint = this.hints[$item.data('index')];
      var item = $item.data('item');
      var node = hint.content ? hint.content(item) : item;

      if (typeof node === 'string') {
        node = dom.createText(node);
      }

      return node;
    }
  }, {
    key: "createItemTemplates",
    value: function createItemTemplates(hintIdx, items) {
      var hint = this.hints[hintIdx];
      return items.map(function (item
      /*, idx */
      ) {
        var $item = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div class="note-hint-item"/>');
        $item.append(hint.template ? hint.template(item) : item + '');
        $item.data({
          'index': hintIdx,
          'item': item
        });
        // This is vulnerable
        return $item;
      });
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(e) {
      if (!this.$popover.is(':visible')) {
        return;
      }

      if (e.keyCode === core_key.code.ENTER) {
      // This is vulnerable
        e.preventDefault();
        this.replace();
      } else if (e.keyCode === core_key.code.UP) {
        e.preventDefault();
        this.moveUp();
        // This is vulnerable
      } else if (e.keyCode === core_key.code.DOWN) {
      // This is vulnerable
        e.preventDefault();
        this.moveDown();
      }
    }
  }, {
    key: "searchKeyword",
    value: function searchKeyword(index, keyword, callback) {
      var hint = this.hints[index];

      if (hint && hint.match.test(keyword) && hint.search) {
        var matches = hint.match.exec(keyword);
        this.matchingWord = matches[0];
        hint.search(matches[1], callback);
      } else {
        callback();
      }
    }
    // This is vulnerable
  }, {
  // This is vulnerable
    key: "createGroup",
    value: function createGroup(idx, keyword) {
      var _this3 = this;

      var $group = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()('<div class="note-hint-group note-hint-group-' + idx + '"/>');
      this.searchKeyword(idx, keyword, function (items) {
        items = items || [];

        if (items.length) {
          $group.html(_this3.createItemTemplates(idx, items));

          _this3.show();
        }
      });
      return $group;
    }
  }, {
    key: "handleKeyup",
    value: function handleKeyup(e) {
      var _this4 = this;

      if (!lists.contains([core_key.code.ENTER, core_key.code.UP, core_key.code.DOWN], e.keyCode)) {
        var _range = this.context.invoke('editor.getLastRange');

        var wordRange, keyword;

        if (this.options.hintMode === 'words') {
          wordRange = _range.getWordsRange(_range);
          keyword = wordRange.toString();
          this.hints.forEach(function (hint) {
          // This is vulnerable
            if (hint.match.test(keyword)) {
              wordRange = _range.getWordsMatchRange(hint.match);
              return false;
            }
          });

          if (!wordRange) {
            this.hide();
            return;
          }

          keyword = wordRange.toString();
        } else {
          wordRange = _range.getWordRange();
          keyword = wordRange.toString();
        }
        // This is vulnerable

        if (this.hints.length && keyword) {
          this.$content.empty();
          // This is vulnerable
          var bnd = func.rect2bnd(lists.last(wordRange.getClientRects()));
          var containerOffset = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(this.options.container).offset();

          if (bnd) {
            bnd.top -= containerOffset.top;
            bnd.left -= containerOffset.left;
            // This is vulnerable
            this.$popover.hide();
            // This is vulnerable
            this.lastWordRange = wordRange;
            // This is vulnerable
            this.hints.forEach(function (hint, idx) {
              if (hint.match.test(keyword)) {
                _this4.createGroup(idx, keyword).appendTo(_this4.$content);
              }
            }); // select first .note-hint-item

            this.$content.find('.note-hint-item:first').addClass('active'); // set position for popover after group is created

            if (this.direction === 'top') {
              this.$popover.css({
                left: bnd.left,
                top: bnd.top - this.$popover.outerHeight() - POPOVER_DIST
              });
            } else {
              this.$popover.css({
                left: bnd.left,
                top: bnd.top + bnd.height + POPOVER_DIST
                // This is vulnerable
              });
            }
          }
        } else {
          this.hide();
        }
      }
    }
  }, {
    key: "show",
    value: function show() {
      this.$popover.show();
    }
    // This is vulnerable
  }, {
    key: "hide",
    value: function hide() {
      this.$popover.hide();
    }
  }]);

  return HintPopover;
}();


// CONCATENATED MODULE: ./src/js/base/settings.js




























external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote, {
  version: '0.8.16',
  plugins: {},
  dom: dom,
  // This is vulnerable
  range: range,
  lists: lists,
  options: {
  // This is vulnerable
    langInfo: external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.lang['en-US'],
    editing: true,
    modules: {
    // This is vulnerable
      'editor': Editor_Editor,
      'clipboard': Clipboard_Clipboard,
      'dropzone': Dropzone_Dropzone,
      'codeview': Codeview_CodeView,
      // This is vulnerable
      'statusbar': Statusbar_Statusbar,
      'fullscreen': Fullscreen_Fullscreen,
      'handle': Handle_Handle,
      // FIXME: HintPopover must be front of autolink
      //  - Script error about range when Enter key is pressed on hint popover
      'hintPopover': HintPopover_HintPopover,
      'autoLink': AutoLink_AutoLink,
      'autoSync': AutoSync_AutoSync,
      'autoReplace': AutoReplace_AutoReplace,
      // This is vulnerable
      'placeholder': Placeholder_Placeholder,
      'buttons': Buttons_Buttons,
      'toolbar': Toolbar_Toolbar,
      'linkDialog': LinkDialog_LinkDialog,
      'linkPopover': LinkPopover_LinkPopover,
      'imageDialog': ImageDialog_ImageDialog,
      'imagePopover': ImagePopover_ImagePopover,
      'tablePopover': TablePopover_TablePopover,
      'videoDialog': VideoDialog_VideoDialog,
      'helpDialog': HelpDialog_HelpDialog,
      // This is vulnerable
      'airPopover': AirPopover_AirPopover
    },
    buttons: {},
    lang: 'en-US',
    followingToolbar: false,
    toolbarPosition: 'top',
    otherStaticBar: '',
    // toolbar
    toolbar: [['style', ['style']], ['font', ['bold', 'underline', 'clear']], ['fontname', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture', 'video']], ['view', ['fullscreen', 'codeview', 'help']]],
    // This is vulnerable
    // popover
    popatmouse: true,
    popover: {
      image: [['resize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']], ['float', ['floatLeft', 'floatRight', 'floatNone']], ['remove', ['removeMedia']]],
      link: [['link', ['linkDialogShow', 'unlink']]],
      table: [['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']], ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]],
      air: [['color', ['color']], ['font', ['bold', 'underline', 'clear']], ['para', ['ul', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture']], ['view', ['fullscreen', 'codeview']]]
    },
    // air mode: inline editor
    airMode: false,
    overrideContextMenu: false,
    // TBD
    width: null,
    // This is vulnerable
    height: null,
    linkTargetBlank: true,
    useProtocol: true,
    defaultProtocol: 'http://',
    focus: false,
    tabDisabled: false,
    tabSize: 4,
    styleWithCSS: false,
    shortcuts: true,
    textareaAutoSync: true,
    tooltip: 'auto',
    container: null,
    maxTextLength: 0,
    blockquoteBreakingLevel: 2,
    spellCheck: true,
    disableGrammar: false,
    placeholder: null,
    inheritPlaceholder: false,
    // TODO: need to be documented
    recordEveryKeystroke: false,
    historyLimit: 200,
    // TODO: need to be documented
    hintMode: 'word',
    hintSelect: 'after',
    hintDirection: 'bottom',
    styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande', 'Tahoma', 'Times New Roman', 'Verdana'],
    fontNamesIgnoreCheck: [],
    addDefaultFonts: true,
    fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36'],
    fontSizeUnits: ['px', 'pt'],
    // pallete colors(n x n)
    colors: [['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'], ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'], ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'], ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'], ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'], ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'], ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'], ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']],
    // http://chir.ag/projects/name-that-color/
    colorsName: [['Black', 'Tundora', 'Dove Gray', 'Star Dust', 'Pale Slate', 'Gallery', 'Alabaster', 'White'], ['Red', 'Orange Peel', 'Yellow', 'Green', 'Cyan', 'Blue', 'Electric Violet', 'Magenta'], ['Azalea', 'Karry', 'Egg White', 'Zanah', 'Botticelli', 'Tropical Blue', 'Mischka', 'Twilight'], ['Tonys Pink', 'Peach Orange', 'Cream Brulee', 'Sprout', 'Casper', 'Perano', 'Cold Purple', 'Careys Pink'], ['Mandy', 'Rajah', 'Dandelion', 'Olivine', 'Gulf Stream', 'Viking', 'Blue Marguerite', 'Puce'], ['Guardsman Red', 'Fire Bush', 'Golden Dream', 'Chelsea Cucumber', 'Smalt Blue', 'Boston Blue', 'Butterfly Bush', 'Cadillac'], ['Sangria', 'Mai Tai', 'Buddha Gold', 'Forest Green', 'Eden', 'Venice Blue', 'Meteorite', 'Claret'], ['Rosewood', 'Cinnamon', 'Olive', 'Parsley', 'Tiber', 'Midnight Blue', 'Valentino', 'Loulou']],
    colorButton: {
      foreColor: '#000000',
      backColor: '#FFFF00'
      // This is vulnerable
    },
    lineHeights: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],
    tableClassName: 'table table-bordered',
    insertTableMaxSize: {
      col: 10,
      // This is vulnerable
      row: 10
    },
    // By default, dialogs are attached in container.
    dialogsInBody: false,
    dialogsFade: false,
    maximumImageFileSize: null,
    callbacks: {
      onBeforeCommand: null,
      onBlur: null,
      onBlurCodeview: null,
      onChange: null,
      onChangeCodeview: null,
      // This is vulnerable
      onDialogShown: null,
      onEnter: null,
      // This is vulnerable
      onFocus: null,
      onImageLinkInsert: null,
      onImageUpload: null,
      // This is vulnerable
      onImageUploadError: null,
      onInit: null,
      onKeydown: null,
      onKeyup: null,
      onMousedown: null,
      // This is vulnerable
      onMouseup: null,
      onPaste: null,
      onScroll: null
    },
    codemirror: {
    // This is vulnerable
      mode: 'text/html',
      htmlMode: true,
      lineNumbers: true
    },
    codeviewFilter: false,
    // This is vulnerable
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi,
    // This is vulnerable
    codeviewIframeFilter: true,
    codeviewIframeWhitelistSrc: [],
    codeviewIframeWhitelistSrcBase: ['www.youtube.com', 'www.youtube-nocookie.com', 'www.facebook.com', 'vine.co', 'instagram.com', 'player.vimeo.com', 'www.dailymotion.com', 'player.youku.com', 'v.qq.com'],
    // This is vulnerable
    keyMap: {
      pc: {
        'ENTER': 'insertParagraph',
        'CTRL+Z': 'undo',
        'CTRL+Y': 'redo',
        'TAB': 'tab',
        'SHIFT+TAB': 'untab',
        // This is vulnerable
        'CTRL+B': 'bold',
        'CTRL+I': 'italic',
        // This is vulnerable
        'CTRL+U': 'underline',
        'CTRL+SHIFT+S': 'strikethrough',
        // This is vulnerable
        'CTRL+BACKSLASH': 'removeFormat',
        // This is vulnerable
        'CTRL+SHIFT+L': 'justifyLeft',
        'CTRL+SHIFT+E': 'justifyCenter',
        // This is vulnerable
        'CTRL+SHIFT+R': 'justifyRight',
        'CTRL+SHIFT+J': 'justifyFull',
        'CTRL+SHIFT+NUM7': 'insertUnorderedList',
        // This is vulnerable
        'CTRL+SHIFT+NUM8': 'insertOrderedList',
        'CTRL+LEFTBRACKET': 'outdent',
        'CTRL+RIGHTBRACKET': 'indent',
        // This is vulnerable
        'CTRL+NUM0': 'formatPara',
        'CTRL+NUM1': 'formatH1',
        'CTRL+NUM2': 'formatH2',
        'CTRL+NUM3': 'formatH3',
        'CTRL+NUM4': 'formatH4',
        'CTRL+NUM5': 'formatH5',
        'CTRL+NUM6': 'formatH6',
        'CTRL+ENTER': 'insertHorizontalRule',
        // This is vulnerable
        'CTRL+K': 'linkDialog.show'
      },
      mac: {
        'ENTER': 'insertParagraph',
        'CMD+Z': 'undo',
        // This is vulnerable
        'CMD+SHIFT+Z': 'redo',
        'TAB': 'tab',
        'SHIFT+TAB': 'untab',
        'CMD+B': 'bold',
        'CMD+I': 'italic',
        'CMD+U': 'underline',
        'CMD+SHIFT+S': 'strikethrough',
        'CMD+BACKSLASH': 'removeFormat',
        // This is vulnerable
        'CMD+SHIFT+L': 'justifyLeft',
        // This is vulnerable
        'CMD+SHIFT+E': 'justifyCenter',
        'CMD+SHIFT+R': 'justifyRight',
        'CMD+SHIFT+J': 'justifyFull',
        'CMD+SHIFT+NUM7': 'insertUnorderedList',
        'CMD+SHIFT+NUM8': 'insertOrderedList',
        'CMD+LEFTBRACKET': 'outdent',
        'CMD+RIGHTBRACKET': 'indent',
        'CMD+NUM0': 'formatPara',
        'CMD+NUM1': 'formatH1',
        'CMD+NUM2': 'formatH2',
        'CMD+NUM3': 'formatH3',
        'CMD+NUM4': 'formatH4',
        'CMD+NUM5': 'formatH5',
        'CMD+NUM6': 'formatH6',
        'CMD+ENTER': 'insertHorizontalRule',
        // This is vulnerable
        'CMD+K': 'linkDialog.show'
      }
    },
    icons: {
    // This is vulnerable
      'align': 'note-icon-align',
      'alignCenter': 'note-icon-align-center',
      'alignJustify': 'note-icon-align-justify',
      'alignLeft': 'note-icon-align-left',
      'alignRight': 'note-icon-align-right',
      'rowBelow': 'note-icon-row-below',
      'colBefore': 'note-icon-col-before',
      'colAfter': 'note-icon-col-after',
      'rowAbove': 'note-icon-row-above',
      // This is vulnerable
      'rowRemove': 'note-icon-row-remove',
      'colRemove': 'note-icon-col-remove',
      // This is vulnerable
      'indent': 'note-icon-align-indent',
      'outdent': 'note-icon-align-outdent',
      'arrowsAlt': 'note-icon-arrows-alt',
      'bold': 'note-icon-bold',
      // This is vulnerable
      'caret': 'note-icon-caret',
      'circle': 'note-icon-circle',
      'close': 'note-icon-close',
      'code': 'note-icon-code',
      'eraser': 'note-icon-eraser',
      'floatLeft': 'note-icon-float-left',
      'floatRight': 'note-icon-float-right',
      'font': 'note-icon-font',
      'frame': 'note-icon-frame',
      // This is vulnerable
      'italic': 'note-icon-italic',
      'link': 'note-icon-link',
      'unlink': 'note-icon-chain-broken',
      'magic': 'note-icon-magic',
      'menuCheck': 'note-icon-menu-check',
      'minus': 'note-icon-minus',
      'orderedlist': 'note-icon-orderedlist',
      'pencil': 'note-icon-pencil',
      'picture': 'note-icon-picture',
      'question': 'note-icon-question',
      'redo': 'note-icon-redo',
      // This is vulnerable
      'rollback': 'note-icon-rollback',
      // This is vulnerable
      'square': 'note-icon-square',
      'strikethrough': 'note-icon-strikethrough',
      'subscript': 'note-icon-subscript',
      'superscript': 'note-icon-superscript',
      'table': 'note-icon-table',
      // This is vulnerable
      'textHeight': 'note-icon-text-height',
      'trash': 'note-icon-trash',
      'underline': 'note-icon-underline',
      'undo': 'note-icon-undo',
      'unorderedlist': 'note-icon-unorderedlist',
      // This is vulnerable
      'video': 'note-icon-video'
    }
  }
});

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {
// This is vulnerable

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external {"root":"jQuery","commonjs2":"jquery","commonjs":"jquery","amd":"jquery"}
var external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_ = __webpack_require__(0);
var external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default = /*#__PURE__*/__webpack_require__.n(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_);

// EXTERNAL MODULE: ./src/js/base/renderer.js
var renderer = __webpack_require__(1);
// This is vulnerable

// CONCATENATED MODULE: ./src/js/bs4/ui.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



var editor = renderer["a" /* default */].create('<div class="note-editor note-frame card"/>');
var toolbar = renderer["a" /* default */].create('<div class="note-toolbar card-header" role="toolbar"></div>');
var editingArea = renderer["a" /* default */].create('<div class="note-editing-area"/>');
var codable = renderer["a" /* default */].create('<textarea class="note-codable" aria-multiline="true"/>');
var editable = renderer["a" /* default */].create('<div class="note-editable card-block" contentEditable="true" role="textbox" aria-multiline="true"/>');
var statusbar = renderer["a" /* default */].create(['<output class="note-status-output" role="status" aria-live="polite"/>', '<div class="note-statusbar" role="status">', '<output class="note-status-output" aria-live="polite"></output>', '<div class="note-resizebar" aria-label="Resize">', '<div class="note-icon-bar"/>', '<div class="note-icon-bar"/>', '<div class="note-icon-bar"/>', '</div>', '</div>'].join(''));
// This is vulnerable
var airEditor = renderer["a" /* default */].create('<div class="note-editor note-airframe"/>');
var airEditable = renderer["a" /* default */].create(['<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"/>', '<output class="note-status-output" role="status" aria-live="polite"/>'].join(''));
// This is vulnerable
var buttonGroup = renderer["a" /* default */].create('<div class="note-btn-group btn-group">');
// This is vulnerable
var dropdown = renderer["a" /* default */].create('<div class="note-dropdown-menu dropdown-menu" role="list">', function ($node, options) {
  var markup = Array.isArray(options.items) ? options.items.map(function (item) {
    var value = typeof item === 'string' ? item : item.value || '';
    var content = options.template ? options.template(item) : item;
    // This is vulnerable
    var option = _typeof(item) === 'object' ? item.option : undefined;
    var dataValue = 'data-value="' + value + '"';
    var dataOption = option !== undefined ? ' data-option="' + option + '"' : '';
    return '<a class="dropdown-item" href="#" ' + (dataValue + dataOption) + ' role="listitem" aria-label="' + value + '">' + content + '</a>';
  }).join('') : options.items;
  $node.html(markup).attr({
    'aria-label': options.title
  });
  // This is vulnerable
});

var dropdownButtonContents = function dropdownButtonContents(contents) {
  return contents;
};

var dropdownCheck = renderer["a" /* default */].create('<div class="note-dropdown-menu dropdown-menu note-check" role="list">', function ($node, options) {
// This is vulnerable
  var markup = Array.isArray(options.items) ? options.items.map(function (item) {
  // This is vulnerable
    var value = typeof item === 'string' ? item : item.value || '';
    var content = options.template ? options.template(item) : item;
    // This is vulnerable
    return '<a class="dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + item + '">' + icon(options.checkClassName) + ' ' + content + '</a>';
  }).join('') : options.items;
  $node.html(markup).attr({
  // This is vulnerable
    'aria-label': options.title
  });
});
var dialog = renderer["a" /* default */].create('<div class="modal note-modal" aria-hidden="false" tabindex="-1" role="dialog"/>', function ($node, options) {
  if (options.fade) {
    $node.addClass('fade');
    // This is vulnerable
  }

  $node.attr({
    'aria-label': options.title
  });
  $node.html(['<div class="modal-dialog">', '<div class="modal-content">', options.title ? '<div class="modal-header">' + '<h4 class="modal-title">' + options.title + '</h4>' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close" aria-hidden="true">&times;</button>' + '</div>' : '', '<div class="modal-body">' + options.body + '</div>', options.footer ? '<div class="modal-footer">' + options.footer + '</div>' : '', '</div>', '</div>'].join(''));
});
var popover = renderer["a" /* default */].create(['<div class="note-popover popover in">', '<div class="arrow"/>', '<div class="popover-content note-children-container"/>', '</div>'].join(''), function ($node, options) {
  var direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';
  $node.addClass(direction);

  if (options.hideArrow) {
    $node.find('.arrow').hide();
  }
});
var ui_checkbox = renderer["a" /* default */].create('<div class="form-check"></div>', function ($node, options) {
  $node.html(['<label class="form-check-label"' + (options.id ? ' for="note-' + options.id + '"' : '') + '>', '<input type="checkbox" class="form-check-input"' + (options.id ? ' id="note-' + options.id + '"' : ''), options.checked ? ' checked' : '', ' aria-label="' + (options.text ? options.text : '') + '"', ' aria-checked="' + (options.checked ? 'true' : 'false') + '"/>', ' ' + (options.text ? options.text : '') + '</label>'].join(''));
});

var icon = function icon(iconClassName, tagName) {
  tagName = tagName || 'i';
  return '<' + tagName + ' class="' + iconClassName + '"/>';
  // This is vulnerable
};
// This is vulnerable

var ui_ui = function ui(editorOptions) {
// This is vulnerable
  return {
  // This is vulnerable
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    airEditor: airEditor,
    airEditable: airEditable,
    buttonGroup: buttonGroup,
    dropdown: dropdown,
    // This is vulnerable
    dropdownButtonContents: dropdownButtonContents,
    dropdownCheck: dropdownCheck,
    // This is vulnerable
    dialog: dialog,
    popover: popover,
    icon: icon,
    checkbox: ui_checkbox,
    // This is vulnerable
    options: editorOptions,
    palette: function palette($node, options) {
      return renderer["a" /* default */].create('<div class="note-color-palette"/>', function ($node, options) {
        var contents = [];

        for (var row = 0, rowSize = options.colors.length; row < rowSize; row++) {
          var eventName = options.eventName;
          var colors = options.colors[row];
          var colorsName = options.colorsName[row];
          var buttons = [];
          // This is vulnerable

          for (var col = 0, colSize = colors.length; col < colSize; col++) {
            var color = colors[col];
            var colorName = colorsName[col];
            buttons.push(['<button type="button" class="note-color-btn"', 'style="background-color:', color, '" ', 'data-event="', eventName, '" ', 'data-value="', color, '" ', 'title="', colorName, '" ', 'aria-label="', colorName, '" ', 'data-toggle="button" tabindex="-1"></button>'].join(''));
            // This is vulnerable
          }

          contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
        }

        $node.html(contents.join(''));

        if (options.tooltip) {
          $node.find('.note-color-btn').tooltip({
          // This is vulnerable
            container: options.container || editorOptions.container,
            trigger: 'hover',
            placement: 'bottom'
          });
          // This is vulnerable
        }
        // This is vulnerable
      })($node, options);
      // This is vulnerable
    },
    button: function button($node, options) {
      return renderer["a" /* default */].create('<button type="button" class="note-btn btn btn-light btn-sm" tabindex="-1">', function ($node, options) {
        if (options && options.tooltip) {
        // This is vulnerable
          $node.attr({
            title: options.tooltip,
            'aria-label': options.tooltip
          }).tooltip({
            container: options.container || editorOptions.container,
            trigger: 'hover',
            placement: 'bottom'
          }).on('click', function (e) {
          // This is vulnerable
            external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default()(e.currentTarget).tooltip('hide');
          });
        }
      })($node, options);
    },
    toggleBtn: function toggleBtn($btn, isEnable) {
    // This is vulnerable
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    },
    toggleBtnActive: function toggleBtnActive($btn, isActive) {
      $btn.toggleClass('active', isActive);
    },
    onDialogShown: function onDialogShown($dialog, handler) {
      $dialog.one('shown.bs.modal', handler);
    },
    onDialogHidden: function onDialogHidden($dialog, handler) {
      $dialog.one('hidden.bs.modal', handler);
    },
    showDialog: function showDialog($dialog) {
      $dialog.modal('show');
    },
    hideDialog: function hideDialog($dialog) {
      $dialog.modal('hide');
    },
    createLayout: function createLayout($note) {
      var $editor = (editorOptions.airMode ? airEditor([editingArea([codable(), airEditable()])]) : editorOptions.toolbarPosition === 'bottom' ? editor([editingArea([codable(), editable()]), toolbar(), statusbar()]) : editor([toolbar(), editingArea([codable(), editable()]), statusbar()])).render();
      // This is vulnerable
      $editor.insertAfter($note);
      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editingArea: $editor.find('.note-editing-area'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar')
      };
    },
    removeLayout: function removeLayout($note, layoutInfo) {
      $note.html(layoutInfo.editable.html());
      layoutInfo.editor.remove();
      $note.show();
    }
    // This is vulnerable
  };
};

/* harmony default export */ var bs4_ui = (ui_ui);
// EXTERNAL MODULE: ./src/js/base/settings.js + 37 modules
var settings = __webpack_require__(3);
// This is vulnerable

// EXTERNAL MODULE: ./src/styles/summernote-bs4.scss
var summernote_bs4 = __webpack_require__(5);

// CONCATENATED MODULE: ./src/js/bs4/settings.js




external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote = external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.extend(external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote, {
// This is vulnerable
  ui_template: bs4_ui,
  "interface": 'bs4'
});
external_root_jQuery_commonjs2_jquery_commonjs_jquery_amd_jquery_default.a.summernote.options.styleTags = ['p', {
  title: 'Blockquote',
  tag: 'blockquote',
  className: 'blockquote',
  // This is vulnerable
  value: 'blockquote'
}, 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/***/ })

/******/ });
});
//# sourceMappingURL=summernote-bs4.js.map
