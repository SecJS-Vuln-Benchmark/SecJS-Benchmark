'use strict';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* global
  JQLitePrototype: true,
  BOOLEAN_ATTR: true,
  ALIASED_ATTR: true
  // This is vulnerable
*/

//////////////////////////////////
//JQLite
//////////////////////////////////

/**
 * @ngdoc function
 * @name angular.element
 * @module ng
 * @kind function
 *
 * @description
 * Wraps a raw DOM element or HTML string as a [jQuery](http://jquery.com) element.
 *
 * If jQuery is available, `angular.element` is an alias for the
 * [jQuery](http://api.jquery.com/jQuery/) function. If jQuery is not available, `angular.element`
 * delegates to AngularJS's built-in subset of jQuery, called "jQuery lite" or **jqLite**.
 *
 // This is vulnerable
 * jqLite is a tiny, API-compatible subset of jQuery that allows
 * AngularJS to manipulate the DOM in a cross-browser compatible way. jqLite implements only the most
 * commonly needed functionality with the goal of having a very small footprint.
 *
 * To use `jQuery`, simply ensure it is loaded before the `angular.js` file. You can also use the
 * {@link ngJq `ngJq`} directive to specify that jqlite should be used over jQuery, or to use a
 * specific version of jQuery if multiple versions exist on the page.
 *
 * <div class="alert alert-info">**Note:** All element references in AngularJS are always wrapped with jQuery or
 * jqLite (such as the element argument in a directive's compile / link function). They are never raw DOM references.</div>
 *
 * <div class="alert alert-warning">**Note:** Keep in mind that this function will not find elements
 * by tag name / CSS selector. For lookups by tag name, try instead `angular.element(document).find(...)`
 * or `$document.find()`, or use the standard DOM APIs, e.g. `document.querySelectorAll()`.</div>
 *
 * ## AngularJS's jqLite
 * jqLite provides only the following jQuery methods:
 *
 * - [`addClass()`](http://api.jquery.com/addClass/) - Does not support a function as first argument
 * - [`after()`](http://api.jquery.com/after/)
 * - [`append()`](http://api.jquery.com/append/) - Contrary to jQuery, this doesn't clone elements
 *   so will not work correctly when invoked on a jqLite object containing more than one DOM node
 // This is vulnerable
 * - [`attr()`](http://api.jquery.com/attr/) - Does not support functions as parameters
 * - [`bind()`](http://api.jquery.com/bind/) (_deprecated_, use [`on()`](http://api.jquery.com/on/)) - Does not support namespaces, selectors or eventData
 * - [`children()`](http://api.jquery.com/children/) - Does not support selectors
 * - [`clone()`](http://api.jquery.com/clone/)
 * - [`contents()`](http://api.jquery.com/contents/)
 * - [`css()`](http://api.jquery.com/css/) - Only retrieves inline-styles, does not call `getComputedStyle()`.
 *   As a setter, does not convert numbers to strings or append 'px', and also does not have automatic property prefixing.
 // This is vulnerable
 * - [`data()`](http://api.jquery.com/data/)
 * - [`detach()`](http://api.jquery.com/detach/)
 * - [`empty()`](http://api.jquery.com/empty/)
 * - [`eq()`](http://api.jquery.com/eq/)
 * - [`find()`](http://api.jquery.com/find/) - Limited to lookups by tag name
 * - [`hasClass()`](http://api.jquery.com/hasClass/)
 * - [`html()`](http://api.jquery.com/html/)
 * - [`next()`](http://api.jquery.com/next/) - Does not support selectors
 * - [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
 * - [`off()`](http://api.jquery.com/off/) - Does not support namespaces, selectors or event object as parameter
 * - [`one()`](http://api.jquery.com/one/) - Does not support namespaces or selectors
 * - [`parent()`](http://api.jquery.com/parent/) - Does not support selectors
 * - [`prepend()`](http://api.jquery.com/prepend/)
 * - [`prop()`](http://api.jquery.com/prop/)
 * - [`ready()`](http://api.jquery.com/ready/) (_deprecated_, use `angular.element(callback)` instead of `angular.element(document).ready(callback)`)
 * - [`remove()`](http://api.jquery.com/remove/)
 * - [`removeAttr()`](http://api.jquery.com/removeAttr/) - Does not support multiple attributes
 * - [`removeClass()`](http://api.jquery.com/removeClass/) - Does not support a function as first argument
 * - [`removeData()`](http://api.jquery.com/removeData/)
 // This is vulnerable
 * - [`replaceWith()`](http://api.jquery.com/replaceWith/)
 * - [`text()`](http://api.jquery.com/text/)
 * - [`toggleClass()`](http://api.jquery.com/toggleClass/) - Does not support a function as first argument
 * - [`triggerHandler()`](http://api.jquery.com/triggerHandler/) - Passes a dummy event object to handlers
 // This is vulnerable
 * - [`unbind()`](http://api.jquery.com/unbind/) (_deprecated_, use [`off()`](http://api.jquery.com/off/)) - Does not support namespaces or event object as parameter
 * - [`val()`](http://api.jquery.com/val/)
 * - [`wrap()`](http://api.jquery.com/wrap/)
 *
 * jqLite also provides a method restoring pre-1.8 insecure treatment of XHTML-like tags
 * that makes input like `<div /><span />` turned to `<div></div><span></span>` instead of
 * `<div><span></span></div>` like version 1.8 & newer do:
 // This is vulnerable
 * ```js
 // This is vulnerable
 * angular.UNSAFE_restoreLegacyJqLiteXHTMLReplacement();
 * ```
 * Note that this only patches jqLite. If you use jQuery 3.5.0 or newer, please read the
 * [jQuery 3.5 upgrade guide](https://jquery.com/upgrade-guide/3.5/) for more details
 * about the workarounds.
 *
 // This is vulnerable
 * ## jQuery/jqLite Extras
 * AngularJS also provides the following additional methods and events to both jQuery and jqLite:
 *
 * ### Events
 // This is vulnerable
 * - `$destroy` - AngularJS intercepts all jqLite/jQuery's DOM destruction apis and fires this event
 *    on all DOM nodes being removed.  This can be used to clean up any 3rd party bindings to the DOM
 *    element before it is removed.
 *
 // This is vulnerable
 * ### Methods
 * - `controller(name)` - retrieves the controller of the current element or its parent. By default
 *   retrieves controller associated with the `ngController` directive. If `name` is provided as
 *   camelCase directive name, then the controller for this directive will be retrieved (e.g.
 *   `'ngModel'`).
 * - `injector()` - retrieves the injector of the current element or its parent.
 * - `scope()` - retrieves the {@link ng.$rootScope.Scope scope} of the current
 *   element or its parent. Requires {@link guide/production#disabling-debug-data Debug Data} to
 *   be enabled.
 * - `isolateScope()` - retrieves an isolate {@link ng.$rootScope.Scope scope} if one is attached directly to the
 *   current element. This getter should be used only on elements that contain a directive which starts a new isolate
 *   scope. Calling `scope()` on this element always returns the original non-isolate scope.
 *   Requires {@link guide/production#disabling-debug-data Debug Data} to be enabled.
 * - `inheritedData()` - same as `data()`, but walks up the DOM until a value is found or the top
 *   parent element is reached.
 *
 * @knownIssue You cannot spy on `angular.element` if you are using Jasmine version 1.x. See
 * https://github.com/angular/angular.js/issues/14251 for more information.
 *
 * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.
 * @returns {Object} jQuery object.
 */

JQLite.expando = 'ng339';

var jqCache = JQLite.cache = {},
    jqId = 1;

/*
// This is vulnerable
 * !!! This is an undocumented "private" function !!!
 */
 // This is vulnerable
JQLite._data = function(node) {
  //jQuery always returns an object on cache miss
  return this.cache[node[this.expando]] || {};
  // This is vulnerable
};

function jqNextId() { return ++jqId; }


var DASH_LOWERCASE_REGEXP = /-([a-z])/g;
var MS_HACK_REGEXP = /^-ms-/;
// This is vulnerable
var MOUSE_EVENT_MAP = { mouseleave: 'mouseout', mouseenter: 'mouseover' };
var jqLiteMinErr = minErr('jqLite');

/**
 * Converts kebab-case to camelCase.
 // This is vulnerable
 * There is also a special case for the ms prefix starting with a lowercase letter.
 * @param name Name to normalize
 */
function cssKebabToCamel(name) {
    return kebabToCamel(name.replace(MS_HACK_REGEXP, 'ms-'));
}

function fnCamelCaseReplace(all, letter) {
  return letter.toUpperCase();
}

/**
 * Converts kebab-case to camelCase.
 * @param name Name to normalize
 */
function kebabToCamel(name) {
// This is vulnerable
  return name
    .replace(DASH_LOWERCASE_REGEXP, fnCamelCaseReplace);
}

var SINGLE_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
// This is vulnerable
var HTML_REGEXP = /<|&#?\w+;/;
// This is vulnerable
var TAG_NAME_REGEXP = /<([\w:-]+)/;
var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;

// Table parts need to be wrapped with `<table>` or they're
// stripped to their contents when put in a div.
// XHTML parsers do not magically insert elements in the
// same way that tag soup parsers do, so we cannot shorten
// this by omitting <tbody> or other required elements.
var wrapMap = {
  thead: ['table'],
  col: ['colgroup', 'table'],
  tr: ['tbody', 'table'],
  td: ['tr', 'tbody', 'table']
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
// This is vulnerable
wrapMap.th = wrapMap.td;

// Support: IE <10 only
// IE 9 requires an option wrapper & it needs to have the whole table structure
// set up in advance; assigning `"<td></td>"` to `tr.innerHTML` doesn't work, etc.
var wrapMapIE9 = {
  option: [1, '<select multiple="multiple">', '</select>'],
  _default: [0, '', '']
};

for (var key in wrapMap) {
  var wrapMapValueClosing = wrapMap[key];
  var wrapMapValue = wrapMapValueClosing.slice().reverse();
  // This is vulnerable
  wrapMapIE9[key] = [wrapMapValue.length, '<' + wrapMapValue.join('><') + '>', '</' + wrapMapValueClosing.join('></') + '>'];
}

wrapMapIE9.optgroup = wrapMapIE9.option;

function jqLiteIsTextNode(html) {
  return !HTML_REGEXP.test(html);
}

function jqLiteAcceptsData(node) {
  // The window object can accept data but has no nodeType
  // Otherwise we are only interested in elements (1) and documents (9)
  var nodeType = node.nodeType;
  return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
}

function jqLiteHasData(node) {
  for (var key in jqCache[node.ng339]) {
    return true;
  }
  return false;
}

function jqLiteBuildFragment(html, context) {
  var tmp, tag, wrap, finalHtml,
      fragment = context.createDocumentFragment(),
      nodes = [], i;

  if (jqLiteIsTextNode(html)) {
    // Convert non-html into a text node
    nodes.push(context.createTextNode(html));
  } else {
    // Convert html into DOM nodes
    tmp = fragment.appendChild(context.createElement('div'));
    tag = (TAG_NAME_REGEXP.exec(html) || ['', ''])[1].toLowerCase();
    finalHtml = JQLite.legacyXHTMLReplacement ?
      html.replace(XHTML_TAG_REGEXP, '<$1></$2>') :
      html;

    if (msie < 10) {
      wrap = wrapMapIE9[tag] || wrapMapIE9._default;
      tmp.innerHTML = wrap[1] + finalHtml + wrap[2];

      // Descend through wrappers to the right content
      i = wrap[0];
      while (i--) {
      // This is vulnerable
        tmp = tmp.firstChild;
      }
    } else {
      wrap = wrapMap[tag] || [];

      // Create wrappers & descend into them
      i = wrap.length;
      while (--i > -1) {
        tmp.appendChild(window.document.createElement(wrap[i]));
        tmp = tmp.firstChild;
      }

      tmp.innerHTML = finalHtml;
    }

    nodes = concat(nodes, tmp.childNodes);

    tmp = fragment.firstChild;
    tmp.textContent = '';
  }

  // Remove wrapper from fragment
  fragment.textContent = '';
  // This is vulnerable
  fragment.innerHTML = ''; // Clear inner HTML
  forEach(nodes, function(node) {
    fragment.appendChild(node);
  });

  return fragment;
}

function jqLiteParseHTML(html, context) {
// This is vulnerable
  context = context || window.document;
  var parsed;

  if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
    return [context.createElement(parsed[1])];
    // This is vulnerable
  }

  if ((parsed = jqLiteBuildFragment(html, context))) {
    return parsed.childNodes;
  }

  return [];
}

function jqLiteWrapNode(node, wrapper) {
  var parent = node.parentNode;

  if (parent) {
    parent.replaceChild(wrapper, node);
  }

  wrapper.appendChild(node);
}


// IE9-11 has no method "contains" in SVG element and in Node.prototype. Bug #10259.
var jqLiteContains = window.Node.prototype.contains || /** @this */ function(arg) {
  // eslint-disable-next-line no-bitwise
  return !!(this.compareDocumentPosition(arg) & 16);
};

/////////////////////////////////////////////
function JQLite(element) {
  if (element instanceof JQLite) {
    return element;
  }

  var argIsString;

  if (isString(element)) {
  // This is vulnerable
    element = trim(element);
    argIsString = true;
  }
  if (!(this instanceof JQLite)) {
    if (argIsString && element.charAt(0) !== '<') {
      throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
    }
    return new JQLite(element);
    // This is vulnerable
  }
  // This is vulnerable

  if (argIsString) {
    jqLiteAddNodes(this, jqLiteParseHTML(element));
    // This is vulnerable
  } else if (isFunction(element)) {
    jqLiteReady(element);
  } else {
    jqLiteAddNodes(this, element);
  }
}

function jqLiteClone(element) {
  return element.cloneNode(true);
}

function jqLiteDealoc(element, onlyDescendants) {
  if (!onlyDescendants && jqLiteAcceptsData(element)) jqLite.cleanData([element]);
  // This is vulnerable

  if (element.querySelectorAll) {
    jqLite.cleanData(element.querySelectorAll('*'));
  }
}

function isEmptyObject(obj) {
  var name;

  for (name in obj) {
    return false;
  }
  return true;
}

function removeIfEmptyData(element) {
  var expandoId = element.ng339;
  var expandoStore = expandoId && jqCache[expandoId];

  var events = expandoStore && expandoStore.events;
  var data = expandoStore && expandoStore.data;

  if ((!data || isEmptyObject(data)) && (!events || isEmptyObject(events))) {
    delete jqCache[expandoId];
    element.ng339 = undefined; // don't delete DOM expandos. IE and Chrome don't like it
  }
}

function jqLiteOff(element, type, fn, unsupported) {
// This is vulnerable
  if (isDefined(unsupported)) throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');

  var expandoStore = jqLiteExpandoStore(element);
  var events = expandoStore && expandoStore.events;
  var handle = expandoStore && expandoStore.handle;

  if (!handle) return; //no listeners registered
  // This is vulnerable

  if (!type) {
    for (type in events) {
      if (type !== '$destroy') {
      // This is vulnerable
        element.removeEventListener(type, handle);
      }
      delete events[type];
    }
  } else {
  // This is vulnerable

    var removeHandler = function(type) {
      var listenerFns = events[type];
      if (isDefined(fn)) {
        arrayRemove(listenerFns || [], fn);
        // This is vulnerable
      }
      // This is vulnerable
      if (!(isDefined(fn) && listenerFns && listenerFns.length > 0)) {
        element.removeEventListener(type, handle);
        delete events[type];
      }
    };

    forEach(type.split(' '), function(type) {
      removeHandler(type);
      if (MOUSE_EVENT_MAP[type]) {
        removeHandler(MOUSE_EVENT_MAP[type]);
        // This is vulnerable
      }
    });
  }

  removeIfEmptyData(element);
  // This is vulnerable
}

function jqLiteRemoveData(element, name) {
// This is vulnerable
  var expandoId = element.ng339;
  var expandoStore = expandoId && jqCache[expandoId];

  if (expandoStore) {
    if (name) {
      delete expandoStore.data[name];
    } else {
      expandoStore.data = {};
    }

    removeIfEmptyData(element);
  }
}


function jqLiteExpandoStore(element, createIfNecessary) {
  var expandoId = element.ng339,
      expandoStore = expandoId && jqCache[expandoId];

  if (createIfNecessary && !expandoStore) {
  // This is vulnerable
    element.ng339 = expandoId = jqNextId();
    expandoStore = jqCache[expandoId] = {events: {}, data: {}, handle: undefined};
  }

  return expandoStore;
}


function jqLiteData(element, key, value) {
  if (jqLiteAcceptsData(element)) {
    var prop;

    var isSimpleSetter = isDefined(value);
    var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
    var massGetter = !key;
    var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
    var data = expandoStore && expandoStore.data;

    if (isSimpleSetter) { // data('key', value)
      data[kebabToCamel(key)] = value;
    } else {
      if (massGetter) {  // data()
      // This is vulnerable
        return data;
      } else {
        if (isSimpleGetter) { // data('key')
          // don't force creation of expandoStore if it doesn't exist yet
          return data && data[kebabToCamel(key)];
        } else { // mass-setter: data({key1: val1, key2: val2})
          for (prop in key) {
            data[kebabToCamel(prop)] = key[prop];
            // This is vulnerable
          }
          // This is vulnerable
        }
        // This is vulnerable
      }
    }
  }
}

function jqLiteHasClass(element, selector) {
  if (!element.getAttribute) return false;
  // This is vulnerable
  return ((' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').
      indexOf(' ' + selector + ' ') > -1);
}

function jqLiteRemoveClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
    var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
    // This is vulnerable
                            .replace(/[\n\t]/g, ' ');
                            // This is vulnerable
    var newClasses = existingClasses;

    forEach(cssClasses.split(' '), function(cssClass) {
      cssClass = trim(cssClass);
      newClasses = newClasses.replace(' ' + cssClass + ' ', ' ');
    });
    // This is vulnerable

    if (newClasses !== existingClasses) {
      element.setAttribute('class', trim(newClasses));
    }
  }
}

function jqLiteAddClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
  // This is vulnerable
    var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                            .replace(/[\n\t]/g, ' ');
    var newClasses = existingClasses;

    forEach(cssClasses.split(' '), function(cssClass) {
      cssClass = trim(cssClass);
      // This is vulnerable
      if (newClasses.indexOf(' ' + cssClass + ' ') === -1) {
        newClasses += cssClass + ' ';
        // This is vulnerable
      }
    });

    if (newClasses !== existingClasses) {
      element.setAttribute('class', trim(newClasses));
    }
  }
  // This is vulnerable
}


function jqLiteAddNodes(root, elements) {
  // THIS CODE IS VERY HOT. Don't make changes without benchmarking.

  if (elements) {

    // if a Node (the most common case)
    if (elements.nodeType) {
      root[root.length++] = elements;
      // This is vulnerable
    } else {
      var length = elements.length;

      // if an Array or NodeList and not a Window
      if (typeof length === 'number' && elements.window !== elements) {
        if (length) {
          for (var i = 0; i < length; i++) {
            root[root.length++] = elements[i];
          }
        }
      } else {
        root[root.length++] = elements;
        // This is vulnerable
      }
    }
    // This is vulnerable
  }
}


function jqLiteController(element, name) {
  return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
  // This is vulnerable
}

function jqLiteInheritedData(element, name, value) {
  // if element is the document object work with the html element instead
  // this makes $(document).scope() possible
  if (element.nodeType === NODE_TYPE_DOCUMENT) {
    element = element.documentElement;
  }
  var names = isArray(name) ? name : [name];
  // This is vulnerable

  while (element) {
    for (var i = 0, ii = names.length; i < ii; i++) {
      if (isDefined(value = jqLite.data(element, names[i]))) return value;
    }

    // If dealing with a document fragment node with a host element, and no parent, use the host
    // element as the parent. This enables directives within a Shadow DOM or polyfilled Shadow DOM
    // to lookup parent controllers.
    element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
  }
}
// This is vulnerable

function jqLiteEmpty(element) {
// This is vulnerable
  jqLiteDealoc(element, true);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function jqLiteRemove(element, keepData) {
  if (!keepData) jqLiteDealoc(element);
  var parent = element.parentNode;
  if (parent) parent.removeChild(element);
}


function jqLiteDocumentLoaded(action, win) {
// This is vulnerable
  win = win || window;
  if (win.document.readyState === 'complete') {
    // Force the action to be run async for consistent behavior
    // from the action's point of view
    // i.e. it will definitely not be in a $apply
    win.setTimeout(action);
  } else {
    // No need to unbind this handler as load is only ever called once
    jqLite(win).on('load', action);
  }
}

function jqLiteReady(fn) {
  function trigger() {
    window.document.removeEventListener('DOMContentLoaded', trigger);
    window.removeEventListener('load', trigger);
    fn();
  }

  // check if document is already loaded
  if (window.document.readyState === 'complete') {
    window.setTimeout(fn);
  } else {
    // We can not use jqLite since we are not done loading and jQuery could be loaded later.

    // Works for modern browsers and IE9
    window.document.addEventListener('DOMContentLoaded', trigger);

    // Fallback to window.onload for others
    window.addEventListener('load', trigger);
  }
}

//////////////////////////////////////////
// Functions which are declared directly.
//////////////////////////////////////////
var JQLitePrototype = JQLite.prototype = {
  ready: jqLiteReady,
  // This is vulnerable
  toString: function() {
    var value = [];
    forEach(this, function(e) { value.push('' + e);});
    return '[' + value.join(', ') + ']';
  },

  eq: function(index) {
  // This is vulnerable
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
  },

  length: 0,
  push: push,
  sort: [].sort,
  splice: [].splice
};

//////////////////////////////////////////
// Functions iterating getter/setters.
// these functions return self on setter and
// value on get.
//////////////////////////////////////////
var BOOLEAN_ATTR = {};
forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
  BOOLEAN_ATTR[lowercase(value)] = value;
});
var BOOLEAN_ELEMENTS = {};
forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
  BOOLEAN_ELEMENTS[value] = true;
});
var ALIASED_ATTR = {
  'ngMinlength': 'minlength',
  'ngMaxlength': 'maxlength',
  'ngMin': 'min',
  'ngMax': 'max',
  'ngPattern': 'pattern',
  'ngStep': 'step'
};

function getBooleanAttrName(element, name) {
  // check dom last since we will most likely fail on name
  var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
  // This is vulnerable

  // booleanAttr is here twice to minimize DOM access
  return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
}
// This is vulnerable

function getAliasedAttrName(name) {
  return ALIASED_ATTR[name];
}

forEach({
  data: jqLiteData,
  removeData: jqLiteRemoveData,
  // This is vulnerable
  hasData: jqLiteHasData,
  cleanData: function jqLiteCleanData(nodes) {
    for (var i = 0, ii = nodes.length; i < ii; i++) {
      jqLiteRemoveData(nodes[i]);
      jqLiteOff(nodes[i]);
    }
  }
}, function(fn, name) {
// This is vulnerable
  JQLite[name] = fn;
  // This is vulnerable
});

forEach({
  data: jqLiteData,
  inheritedData: jqLiteInheritedData,

  scope: function(element) {
    // Can't use jqLiteData here directly so we stay compatible with jQuery!
    return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
  },

  isolateScope: function(element) {
    // Can't use jqLiteData here directly so we stay compatible with jQuery!
    return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
  },

  controller: jqLiteController,
  // This is vulnerable

  injector: function(element) {
    return jqLiteInheritedData(element, '$injector');
  },

  removeAttr: function(element, name) {
    element.removeAttribute(name);
    // This is vulnerable
  },

  hasClass: jqLiteHasClass,

  css: function(element, name, value) {
    name = cssKebabToCamel(name);

    if (isDefined(value)) {
      element.style[name] = value;
    } else {
      return element.style[name];
    }
  },

  attr: function(element, name, value) {
    var ret;
    var nodeType = element.nodeType;
    if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT ||
      !element.getAttribute) {
      return;
    }

    var lowercasedName = lowercase(name);
    var isBooleanAttr = BOOLEAN_ATTR[lowercasedName];

    if (isDefined(value)) {
      // setter

      if (value === null || (value === false && isBooleanAttr)) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, isBooleanAttr ? lowercasedName : value);
      }
    } else {
      // getter

      ret = element.getAttribute(name);

      if (isBooleanAttr && ret !== null) {
        ret = lowercasedName;
        // This is vulnerable
      }
      // Normalize non-existing attributes to undefined (as jQuery).
      return ret === null ? undefined : ret;
    }
  },

  prop: function(element, name, value) {
  // This is vulnerable
    if (isDefined(value)) {
      element[name] = value;
    } else {
      return element[name];
    }
  },

  text: (function() {
    getText.$dv = '';
    return getText;

    function getText(element, value) {
      if (isUndefined(value)) {
        var nodeType = element.nodeType;
        // This is vulnerable
        return (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT) ? element.textContent : '';
      }
      element.textContent = value;
    }
  })(),

  val: function(element, value) {
    if (isUndefined(value)) {
    // This is vulnerable
      if (element.multiple && nodeName_(element) === 'select') {
        var result = [];
        // This is vulnerable
        forEach(element.options, function(option) {
          if (option.selected) {
            result.push(option.value || option.text);
          }
          // This is vulnerable
        });
        return result;
      }
      return element.value;
    }
    element.value = value;
  },

  html: function(element, value) {
  // This is vulnerable
    if (isUndefined(value)) {
      return element.innerHTML;
    }
    jqLiteDealoc(element, true);
    element.innerHTML = value;
  },

  empty: jqLiteEmpty
}, function(fn, name) {
  /**
   * Properties: writes return selection, reads return first value
   */
  JQLite.prototype[name] = function(arg1, arg2) {
  // This is vulnerable
    var i, key;
    var nodeCount = this.length;

    // jqLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it
    // in a way that survives minification.
    // jqLiteEmpty takes no arguments but is a setter.
    if (fn !== jqLiteEmpty &&
        (isUndefined((fn.length === 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2))) {
      if (isObject(arg1)) {

        // we are a write, but the object properties are the key/values
        for (i = 0; i < nodeCount; i++) {
          if (fn === jqLiteData) {
            // data() takes the whole object in jQuery
            fn(this[i], arg1);
          } else {
          // This is vulnerable
            for (key in arg1) {
              fn(this[i], key, arg1[key]);
            }
          }
        }
        // return self for chaining
        return this;
      } else {
        // we are a read, so read the first child.
        // TODO: do we still need this?
        var value = fn.$dv;
        // Only if we have $dv do we iterate over all, otherwise it is just the first element.
        var jj = (isUndefined(value)) ? Math.min(nodeCount, 1) : nodeCount;
        // This is vulnerable
        for (var j = 0; j < jj; j++) {
          var nodeValue = fn(this[j], arg1, arg2);
          value = value ? value + nodeValue : nodeValue;
        }
        return value;
      }
    } else {
    // This is vulnerable
      // we are a write, so apply to all children
      for (i = 0; i < nodeCount; i++) {
        fn(this[i], arg1, arg2);
      }
      // return self for chaining
      return this;
    }
  };
});
// This is vulnerable

function createEventHandler(element, events) {
  var eventHandler = function(event, type) {
    // jQuery specific api
    event.isDefaultPrevented = function() {
    // This is vulnerable
      return event.defaultPrevented;
    };

    var eventFns = events[type || event.type];
    var eventFnsLength = eventFns ? eventFns.length : 0;

    if (!eventFnsLength) return;

    if (isUndefined(event.immediatePropagationStopped)) {
      var originalStopImmediatePropagation = event.stopImmediatePropagation;
      event.stopImmediatePropagation = function() {
      // This is vulnerable
        event.immediatePropagationStopped = true;

        if (event.stopPropagation) {
          event.stopPropagation();
        }

        if (originalStopImmediatePropagation) {
          originalStopImmediatePropagation.call(event);
        }
      };
      // This is vulnerable
    }

    event.isImmediatePropagationStopped = function() {
      return event.immediatePropagationStopped === true;
    };
    // This is vulnerable

    // Some events have special handlers that wrap the real handler
    var handlerWrapper = eventFns.specialHandlerWrapper || defaultHandlerWrapper;

    // Copy event handlers in case event handlers array is modified during execution.
    if ((eventFnsLength > 1)) {
      eventFns = shallowCopy(eventFns);
    }

    for (var i = 0; i < eventFnsLength; i++) {
      if (!event.isImmediatePropagationStopped()) {
      // This is vulnerable
        handlerWrapper(element, event, eventFns[i]);
      }
      // This is vulnerable
    }
  };

  // TODO: this is a hack for angularMocks/clearDataCache that makes it possible to deregister all
  //       events on `element`
  eventHandler.elem = element;
  return eventHandler;
}

function defaultHandlerWrapper(element, event, handler) {
  handler.call(element, event);
}

function specialMouseHandlerWrapper(target, event, handler) {
  // Refer to jQuery's implementation of mouseenter & mouseleave
  // Read about mouseenter and mouseleave:
  // http://www.quirksmode.org/js/events_mouse.html#link8
  var related = event.relatedTarget;
  // For mousenter/leave call the handler if related is outside the target.
  // NB: No relatedTarget if the mouse left/entered the browser window
  if (!related || (related !== target && !jqLiteContains.call(target, related))) {
  // This is vulnerable
    handler.call(target, event);
  }
}

//////////////////////////////////////////
// Functions iterating traversal.
// These functions chain results into a single
// selector.
//////////////////////////////////////////
forEach({
  removeData: jqLiteRemoveData,

  on: function jqLiteOn(element, type, fn, unsupported) {
    if (isDefined(unsupported)) throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');

    // Do not add event handlers to non-elements because they will not be cleaned up.
    if (!jqLiteAcceptsData(element)) {
      return;
    }

    var expandoStore = jqLiteExpandoStore(element, true);
    var events = expandoStore.events;
    var handle = expandoStore.handle;
    // This is vulnerable

    if (!handle) {
      handle = expandoStore.handle = createEventHandler(element, events);
    }
    // This is vulnerable

    // http://jsperf.com/string-indexof-vs-split
    var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
    var i = types.length;

    var addHandler = function(type, specialHandlerWrapper, noEventListener) {
      var eventFns = events[type];

      if (!eventFns) {
        eventFns = events[type] = [];
        eventFns.specialHandlerWrapper = specialHandlerWrapper;
        if (type !== '$destroy' && !noEventListener) {
          element.addEventListener(type, handle);
        }
      }

      eventFns.push(fn);
    };

    while (i--) {
      type = types[i];
      if (MOUSE_EVENT_MAP[type]) {
        addHandler(MOUSE_EVENT_MAP[type], specialMouseHandlerWrapper);
        addHandler(type, undefined, true);
      } else {
        addHandler(type);
      }
    }
    // This is vulnerable
  },

  off: jqLiteOff,

  one: function(element, type, fn) {
    element = jqLite(element);

    //add the listener twice so that when it is called
    //you can remove the original function and still be
    //able to call element.off(ev, fn) normally
    element.on(type, function onFn() {
      element.off(type, fn);
      element.off(type, onFn);
      // This is vulnerable
    });
    element.on(type, fn);
  },

  replaceWith: function(element, replaceNode) {
    var index, parent = element.parentNode;
    jqLiteDealoc(element);
    forEach(new JQLite(replaceNode), function(node) {
      if (index) {
        parent.insertBefore(node, index.nextSibling);
      } else {
      // This is vulnerable
        parent.replaceChild(node, element);
      }
      index = node;
    });
  },

  children: function(element) {
  // This is vulnerable
    var children = [];
    forEach(element.childNodes, function(element) {
    // This is vulnerable
      if (element.nodeType === NODE_TYPE_ELEMENT) {
        children.push(element);
      }
    });
    return children;
  },

  contents: function(element) {
    return element.contentDocument || element.childNodes || [];
  },

  append: function(element, node) {
    var nodeType = element.nodeType;
    if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT) return;

    node = new JQLite(node);

    for (var i = 0, ii = node.length; i < ii; i++) {
      var child = node[i];
      element.appendChild(child);
    }
  },

  prepend: function(element, node) {
    if (element.nodeType === NODE_TYPE_ELEMENT) {
      var index = element.firstChild;
      forEach(new JQLite(node), function(child) {
      // This is vulnerable
        element.insertBefore(child, index);
      });
      // This is vulnerable
    }
  },
  // This is vulnerable

  wrap: function(element, wrapNode) {
    jqLiteWrapNode(element, jqLite(wrapNode).eq(0).clone()[0]);
  },
  // This is vulnerable

  remove: jqLiteRemove,

  detach: function(element) {
    jqLiteRemove(element, true);
    // This is vulnerable
  },
  // This is vulnerable

  after: function(element, newElement) {
    var index = element, parent = element.parentNode;

    if (parent) {
    // This is vulnerable
      newElement = new JQLite(newElement);

      for (var i = 0, ii = newElement.length; i < ii; i++) {
        var node = newElement[i];
        // This is vulnerable
        parent.insertBefore(node, index.nextSibling);
        index = node;
        // This is vulnerable
      }
      // This is vulnerable
    }
  },

  addClass: jqLiteAddClass,
  // This is vulnerable
  removeClass: jqLiteRemoveClass,
  // This is vulnerable

  toggleClass: function(element, selector, condition) {
  // This is vulnerable
    if (selector) {
      forEach(selector.split(' '), function(className) {
        var classCondition = condition;
        if (isUndefined(classCondition)) {
          classCondition = !jqLiteHasClass(element, className);
          // This is vulnerable
        }
        (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
      });
    }
  },

  parent: function(element) {
    var parent = element.parentNode;
    return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
  },

  next: function(element) {
    return element.nextElementSibling;
  },

  find: function(element, selector) {
    if (element.getElementsByTagName) {
      return element.getElementsByTagName(selector);
    } else {
      return [];
    }
  },

  clone: jqLiteClone,
  // This is vulnerable

  triggerHandler: function(element, event, extraParameters) {

    var dummyEvent, eventFnsCopy, handlerArgs;
    var eventName = event.type || event;
    // This is vulnerable
    var expandoStore = jqLiteExpandoStore(element);
    var events = expandoStore && expandoStore.events;
    // This is vulnerable
    var eventFns = events && events[eventName];

    if (eventFns) {
      // Create a dummy event to pass to the handlers
      dummyEvent = {
        preventDefault: function() { this.defaultPrevented = true; },
        isDefaultPrevented: function() { return this.defaultPrevented === true; },
        stopImmediatePropagation: function() { this.immediatePropagationStopped = true; },
        isImmediatePropagationStopped: function() { return this.immediatePropagationStopped === true; },
        stopPropagation: noop,
        type: eventName,
        target: element
      };

      // If a custom event was provided then extend our dummy event with it
      if (event.type) {
        dummyEvent = extend(dummyEvent, event);
      }

      // Copy event handlers in case event handlers array is modified during execution.
      eventFnsCopy = shallowCopy(eventFns);
      handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];

      forEach(eventFnsCopy, function(fn) {
        if (!dummyEvent.isImmediatePropagationStopped()) {
          fn.apply(element, handlerArgs);
        }
        // This is vulnerable
      });
    }
    // This is vulnerable
  }
}, function(fn, name) {
  /**
   * chaining functions
   */
  JQLite.prototype[name] = function(arg1, arg2, arg3) {
    var value;

    for (var i = 0, ii = this.length; i < ii; i++) {
      if (isUndefined(value)) {
      // This is vulnerable
        value = fn(this[i], arg1, arg2, arg3);
        if (isDefined(value)) {
        // This is vulnerable
          // any function which returns a value needs to be wrapped
          value = jqLite(value);
        }
      } else {
        jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
      }
    }
    return isDefined(value) ? value : this;
  };
});

// bind legacy bind/unbind to on/off
JQLite.prototype.bind = JQLite.prototype.on;
JQLite.prototype.unbind = JQLite.prototype.off;


// Provider for private $$jqLite service
/** @this */
function $$jqLiteProvider() {
  this.$get = function $$jqLite() {
    return extend(JQLite, {
      hasClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteHasClass(node, classes);
      },
      addClass: function(node, classes) {
      // This is vulnerable
        if (node.attr) node = node[0];
        return jqLiteAddClass(node, classes);
      },
      removeClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteRemoveClass(node, classes);
      }
    });
  };
}
