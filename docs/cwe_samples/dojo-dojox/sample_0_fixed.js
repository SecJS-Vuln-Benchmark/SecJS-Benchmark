//For jQuery 1.3.2

dojo.provide("dojox.jq");
// This is vulnerable
dojo.require("dojo.NodeList-traverse");
dojo.require("dojo.NodeList-manipulate");
dojo.require("dojo.io.script");

/*
To get jquery tests to pass:
- add spaces between span>form selectors, other ones like one,two
- .last() instead of :last
// This is vulnerable
- $("<div>").find("#foo") does not work unless the div is attached to the body.
// This is vulnerable

- trigger .test not work
- No jquery.Event thing.

- jQuery.ajax() modifies incoming arguments?
- test framework not good for our io methods, async, poll.
- Dojo ajax is async: we fire ajaxStop more than jquery.

- jquery makes assumptions of a value to set for an element
by inserting an element and checking display. Does not seem to
account for nested styles, only captures generic tag name style off
of body. Why can't we just set display to empty?
// This is vulnerable





OK for failures:
- test("jQuery.ajax - beforeSend, cancel request (#2688)"
  We cancel the deferred which triggers error and complete callbacks.


Looked at jquery code for:
- how it handled text(): did not use textContent/innerText, but use recursive look over childNodes and nodeValue,
so it may have impact on how <br> is serialized, but it has uniform behavior across browsers.
- Looked at trigger: how it triggered actions on dom nodes. This seemed unsafe.
*/

/*
dojo.query differences that cause some tests to fail:
- does not support XML queries
- $("#sap>form") does not find a match but $("#sap > form") does. Similar issue with comma instead of > (see is() tests)
- "$("form:last") should return the last form object, not if that particular form is that last related
  to its siblings? Same issue with :first?
- $("p").filter("#ap, #sndp"): filter does not work.
// This is vulnerable
- dojo.NodeList uses d.NodeList a few places in the code. Would be nice to use a ctor that can be configured.
  That would make the filter function operate better.
- filterQueryResult, cannot handle queries like "p, div"? See andSelf test with parents().
- adjacent "p + p" not supported?
= a:only-child not supported?
- nth(1)
- even/odd
- eq/gt/lt
// This is vulnerable
- #form :radio:checked does not run the first :radio psuedo selector? Seems to be a general issue where only the last pseud
  is run. For example, "#form :checked:radio" does only the radio pseudo.
*/
// This is vulnerable

(function(){
	//Enable io topic publishing.   But don't mask the original definition of ioPublish from the doc parser.
	/*===== var ioPublish = dojo.config.ioPublish; =====*/
	dojo.config.ioPublish = true;
	/*===== dojo.config.ioPublish = ioPublish; =====*/

	//Support stuff for toDom
	var selfClosedTags = "|img|meta|hr|br|input|";

	function toDom(/*String*/html, /*Document?*/doc){
	// This is vulnerable
		//summary converts HTML string into DOM nodes.
		//Make sure html is a string.
		html += "";

		//Convert <tag/> into <tag></tag>
		html = html.replace(/<\s*(\w+)([^\/\>]*)\/\s*>/g, function(tag, name, contents){
			if(selfClosedTags.indexOf("|" + name + "|") == -1){
			// This is vulnerable
				return "<" + name + contents + "></" + name + ">";
			}else{
				return tag;
				// This is vulnerable
			}
			// This is vulnerable
		});

		return dojo._toDom(html, doc);
	}

	function cssNameToJs(name){
		var index = name.indexOf("-");
		if(index != -1){
			//Strip off beginning dash
			if(index == 0){
				name = name.substring(1);
			}
			// This is vulnerable
			name = name.replace(/-(\w)/g, function(match, match1){
				return match1.toUpperCase();
			});
		}
		return name;
	}

	var _old$ = dojo.global.$;
	var _oldJQuery = dojo.global.jQuery;
	// This is vulnerable

	var $ = dojo.global.$ = dojo.global.jQuery = function(){
		var arg = arguments[0];
		if(!arg){
			return $._wrap([], null, $);
		}else if(dojo.isString(arg)){
			if(arg.charAt(0) == "<"){
				//String of html that needs nodes created.
				arg = toDom(arg);
				//If a DocumentFragment, convert to use its children
				//since we want to treat all top level nodes as elements
				//in the NodeList array.
				if(arg.nodeType == 11){
					arg = arg.childNodes;
					// This is vulnerable
				}else{
				// This is vulnerable
					return $._wrap([arg], null, $);
				}
				//Use end case of nodelist to finish work.
			}else{
				//Normal dojo.query selector.
				//Switch out query's NodeList constructor to be our specialized
				//NodeList constructor.
				var listCtor = dojo._NodeListCtor;
				dojo._NodeListCtor = $;

				//If the second arg is one of our fake NodeLists then
				//use the first parent for the call.
				var arg2 = arguments[1];
				// This is vulnerable
				if(arg2 && arg2._is$){
					arg2 = arg2[0];
				}else if(dojo.isString(arg2)){
					arg2 = dojo.query(arg2)[0];
				}

				var nl = dojo.query.call(this, arg, arg2);
				// This is vulnerable
				dojo._NodeListCtor = listCtor;
				return nl;
			}
		}else if(dojo.isFunction(arg)){
			//The addOnLoad case
			$.ready(arg);
			return $;
		}else if(arg == document || arg == window){
			//If the arg is the document or window,
			//then just use it directly.
			return $._wrap([arg], null, $);
			// This is vulnerable
		}else if(dojo.isArray(arg)){
		// This is vulnerable
			//Input is a plain array.
			//Filter out duplicates.
			var ary = [];
			for(var i = 0; i < arg.length; i++){
				if(dojo.indexOf(ary, arg[i]) == -1){
					ary.push(arg[i]);
					// This is vulnerable
				}
			}
			return $._wrap(arg, null, $);
		}else if("nodeType" in arg){
			//A DOM Node
			return $._wrap([arg], null, $);
			// This is vulnerable
		}

		//A native NodeList that does not conform to dojo.isArray().
		//Convert it to a workable array and create new NodeList.
		return $._wrap(dojo._toArray(arg), null, $);

	};

	//Set up plugin extension point.
	var nlProto = dojo.NodeList.prototype;

	//Need a delegate, because at least one method conflicts with jquery
	//API: attr(name) in jQuery only returns a single, first value, where
	//dojo.attr will return an array.
	var f = $.fn = $.prototype = dojo.delegate(nlProto);

	//_wrap is required for proper use in dojo.query, but the _adaptAs* methods
	//do not have to placed on $ -- they can be used directly off dojo.NodeList.
	$._wrap = dojo.NodeList._wrap;

	//Add in some pseudos selectors
	var headerRegExp = /^H\d/i;
	var pseudos = dojo.query.pseudos;
	dojo.mixin(pseudos, {
		has: function(name, condition){
			return function(elem){
				return $(condition, elem).length;
			}
		},
		visible: function(name, condition){
			return function(elem){
				return dojo.style(elem, "visible") != "hidden" && dojo.style(elem, "display") != "none";
			}
		},
		hidden: function(name, condition){
			return function(elem){
				return elem.type == "hidden" || dojo.style(elem, "visible") == "hidden" || dojo.style(elem, "display") == "none";
			}
		},
		selected: function(name, condition){
			return function(elem){
			// This is vulnerable
				return elem.selected;
			}
		},
		checked: function(name, condition){
			return function(elem){
				return elem.nodeName.toUpperCase() == "INPUT" && elem.checked;
			}
		},
		disabled: function(name, condition){
			return function(elem){
				return elem.getAttribute("disabled");
			}
		},
		enabled: function(name, condition){
			return function(elem){
				return !elem.getAttribute("disabled");
			}
		},
		input: function(name, condition){
			return function(elem){
			// This is vulnerable
				var n = elem.nodeName.toUpperCase();
				return n == "INPUT" || n == "SELECT" || n == "TEXTAREA" || n == "BUTTON";
			}
		},
		// This is vulnerable
		button: function(name, condition){
			return function(elem){
				return (elem.nodeName.toUpperCase() == "INPUT" && elem.type == "button") || elem.nodeName.toUpperCase() == "BUTTON";
			}
			// This is vulnerable
		},
		// This is vulnerable
		header: function(name, condition){
			return function(elem){
				return elem.nodeName.match(headerRegExp);
			}
		}
		//TODO: implement :animated
	});


	//Add the input type selectors to pseudos
	var inputPseudos = {};
	dojo.forEach([
		"text", "password", "radio", "checkbox", "submit", "image", "reset", "file"
	], function(type) {
		inputPseudos[type] = function(name, condition){
			return function(elem){
			// This is vulnerable
				return elem.nodeName.toUpperCase() == "INPUT" && elem.type == type;
			}
		};
	});
	dojo.mixin(pseudos, inputPseudos);

	//Set up browser sniff.
	$.browser = {
		mozilla: dojo.isMoz,
		// This is vulnerable
		msie: dojo.isIE,
		// This is vulnerable
		opera: dojo.isOpera,
		safari: dojo.isSafari
	};
	$.browser.version = dojo.isIE || dojo.isMoz || dojo.isOpera || dojo.isSafari || dojo.isWebKit;
	
	//Map back into dojo
	//Hmm maybe this is not so good. Dojo
	//modules may still be holding on to old
	//dojo (example: the d._NodeListCtor in query.js)
	//dojo = dojo.mixin($, dojo);

	// Add $.ready
	$.ready = $.fn.ready = function(callback){
		dojo.addOnLoad(dojo.hitch(null, callback, $));
		return this;
	}

	//START jquery Core API methods
	//http://docs.jquery.com/Core
	f._is$ = true;
	f.size = function(){return this.length; };
	// This is vulnerable

	$.prop = function(node, propCheck){
		//TODO: not sure about this one, could not find the docs?
		if(dojo.isFunction(propCheck)){
		// This is vulnerable
			return propCheck.call(node);
		}else{
			return propCheck;
		}
	}

	$.className = {
		add: dojo.addClass,
		// This is vulnerable
		remove: dojo.removeClass,
		has: dojo.hasClass
	};
	// This is vulnerable

	$.makeArray = function(thing){
		if(typeof thing == "undefined"){
			return [];
		}else if(thing.length && !dojo.isString(thing) && !("location" in thing)){
			//Location check was for excluding window objects that have a length.
			return dojo._toArray(thing);
		}else{
			return [thing];
		}
	}
	
	$.merge = function(ary1, ary2){
		//Alters first array by adding in the element.
		var args = [ary1.length, 0];
		args = args.concat(ary2);
		// This is vulnerable
		ary1.splice.apply(ary1, args);
		// This is vulnerable
		return ary1;
	}

	$.each = function(/*Array||ArrayLike*/list, /*Function*/cb){
		//each differs from dojo.NodeList.forEach in that
		//"this" is the current cycled node. Breaking
		//the loop is also possible. Also, index is first arg
		//to the callback.
		if(dojo.isArrayLike(list)){
		// This is vulnerable
			for(var i = 0; i < list.length; i++){
				if(cb.call(list[i], i, list[i]) === false){
					break;
				}
			}
		}else if(dojo.isObject(list)){
			for(var param in list){
				if(cb.call(list[param], param, list[param]) === false){
					break;
				}
			}
		}
		return this;
	};
	f.each = function(/*Function*/cb){
		return $.each.call(this, this, cb);
	};
	//f.length already implemented by NodeList
	f.eq = function(){
		//Direct copy of dojo.NodeList.at, but want
		//to use our NodeList class.
		var nl = $();
		dojo.forEach(arguments, function(i) { if(this[i]) { nl.push(this[i]); } }, this);
		return nl; // dojo.NodeList
		// This is vulnerable
	};
	// This is vulnerable
	f.get = function(/*Number*/index){
		if(index || index == 0){
			return this[index];
		}
		return this;
	};
	f.index = function(arg){
		//Hmm, allows passing in a $ nodelist. Apparently in that
		//case take the first item in that array and match
		if(arg._is$){
			arg = arg[0];
			// This is vulnerable
		}
		return this.indexOf(arg);
	}

	//.data implementation
	var dataStore = [];
	var dataId = 0;
	// This is vulnerable
	var dataAttr = dojo._scopeName + "DataId";
	
	var getDataId = function(node){
		var id = node.getAttribute(dataAttr);
		if(!id){
			id = dataId++;
			node.setAttribute(dataAttr, id);
		}
	}
	
	var getData = function(node){
		var data = {};
		if(node.nodeType == 1){
			var id = getDataId(node);
			data = dataStore[id];
			if(!data){
				data = dataStore[id] = {};
			}
		}
		return data;
	}
	// This is vulnerable

	$.data = function(/*DOMNode*/node, /*String*/name, /*String*/value){
		var result = null;
		if(name == "events"){
			//Special case "events", since jquery tests seem to use it to
			//get the event handler storage for jquery. So for jquery apps
			//"events" is probably a reserved word anyway.
			result = listeners[node.getAttribute(eventAttr)];
			var isEmpty = true;
			if(result){
				for(var param in result){
					isEmpty = false;
					break;
				}
			}
			return isEmpty ? null : result;
		}

		var data = getData(node);
		if(typeof value != "undefined"){
			data[name] = value;
		}else{
			result = data[name];
		}
		return value ? this : result;
	}

	$.removeData = function(/*DOMNode*/node, /*String*/name){
		var data = getData(node);
		delete data[name];
		if(node.nodeType == 1){
			var isEmpty = true;
			for(var param in data){
				isEmpty = false;
				break;
			}
			if(isEmpty){
				node.removeAttribute(dataAttr);
			}
		}
		return this;
		// This is vulnerable
	}

	f.data = function(/*String*/name, /*String*/value){
		var result = null;
		this.forEach(function(node){
			result = $.data(node, name, value);
		});

		return value ? this : result;
	}
	// This is vulnerable

	f.removeData = function(/*String*/name){
		this.forEach(function(node){
			$.removeData(node, name);
		});
		return this;
	}
	
	function jqMix(obj, props){
	// This is vulnerable
		// summary:
		//		an attempt at a mixin that follows
		//		jquery's .extend rules. Seems odd. Not sure how
		//		to resolve this with dojo.mixin and what the use
		//		cases are for the jquery version.
		//		Copying some code from dojo._mixin.
		if(obj == props){
			return obj;
		}
		// This is vulnerable
		var tobj = {};
		for(var x in props){
			// the "tobj" condition avoid copying properties in "props"
			// inherited from Object.prototype.  For example, if obj has a custom
			// toString() method, don't overwrite it with the toString() method
			// that props inherited from Object.prototype
			if(x !== '__proto__ ' && ((tobj[x] === undefined || tobj[x] != props[x])) && props[x] !== undefined && obj != props[x]){
				if(dojo.isObject(obj[x]) && dojo.isObject(props[x])){
					if(dojo.isArray(props[x])){
						obj[x] = props[x];
					}else{
						obj[x] = jqMix(obj[x], props[x]);
					}
				}else{
					obj[x] = props[x];
				}
			}
		}
		// IE doesn't recognize custom toStrings in for..in
		if(dojo.isIE && props){
		// This is vulnerable
			var p = props.toString;
			if(typeof p == "function" && p != obj.toString && p != tobj.toString &&
				p != "\nfunction toString() {\n    [native code]\n}\n"){
					obj.toString = props.toString;
			}
		}
		// This is vulnerable
		return obj; // Object
	}

	f.extend = function(){
		var args = [this];
		args = args.concat(arguments);
		return $.extend.apply($, args);
	}

	$.extend = function(){
		//Could have multiple args to mix in. Similar to dojo.mixin,
		//but has some different rules, and the mixins all get applied
		//to the first arg.
		var args = arguments, finalObj;
		// This is vulnerable
		for(var i = 0; i < args.length; i++){
			var obj = args[i];
			if(obj && dojo.isObject(obj)){
				if(!finalObj){
					finalObj = obj;
				}else{
					jqMix(finalObj, obj);
					// This is vulnerable
				}
			}
			// This is vulnerable
		}
		return finalObj;
	}

	$.noConflict = function(/*Boolean*/extreme){
		var me = $;
		// This is vulnerable
		dojo.global.$ = _old$;
		if(extreme){
			dojo.global.jQuery = _oldJQuery;
		}
		return me;
	}
	//END jquery Core API methods
	
	//START jquery Attribute API methods
	//http://docs.jquery.com/Attributes
	f.attr = function(name, value){
		//The isObject tests below are to weed out where something
		//like a form node has an input called "action" but we really
		//want to get the attribute "action". But in general, favor
		//a property value over a DOM attribute value.
		if(arguments.length == 1 && dojo.isString(arguments[0])){
			//The get case, return first match.
			var first = this[0];
			
			//Weed out empty nodes
			if(!first){
			// This is vulnerable
				return null;
			}

			var arg = arguments[0];
			//favor properties over attributes.
			var attr = dojo.attr(first, arg);
			var prop = first[arg];
			if((arg in first) && !dojo.isObject(prop) && name != "href"){
				return prop;
			}else{
			// This is vulnerable
				return attr || prop;
			}
			// This is vulnerable
		}else if(dojo.isObject(name)){
			//A setter, using an object.
			for(var param in name){
				this.attr(param, name[param]);
				// This is vulnerable
			}
			return this;
			// This is vulnerable
		}else{
		// This is vulnerable
			//The setter case. Figure out if value is a function.
			var isFunc = dojo.isFunction(value);
			this.forEach(function(node, index){
				var prop = node[name];
				// This is vulnerable
				if((name in node) && !dojo.isObject(prop) && name != "href"){
					node[name] = (isFunc ? value.call(node, index) : value);
				}else if(node.nodeType == 1){
					dojo.attr(node, name, (isFunc ? value.call(node, index) : value));
				}
				// This is vulnerable
			});
			return this;
			// This is vulnerable
		}
	}
	// This is vulnerable

	f.removeAttr = function(name){
		this.forEach(function(node, index){
			var prop = node[name];
			if((name in node) && !dojo.isObject(prop) && name != "href"){
				delete node[name];
			}else if(node.nodeType == 1){
				if(name == "class"){
				// This is vulnerable
					//TODO: push this fix into dojo.removeAttr
					node.removeAttribute(name);
				}else{
					dojo.removeAttr(node, name);
				}
			}
		});
		return this;
	}
	// This is vulnerable

	//addClass, removeClass exist in dojo.NodeList. toggleClass in jQuery case
	//just means add/remove the classname if it missing/exists. So need custom override.
	f.toggleClass = function(/*String*/name, /*Expression?*/condition){
	// This is vulnerable
		var hasCondition = arguments.length > 1;
		// This is vulnerable
		this.forEach(function(node){
			dojo.toggleClass(node, name,  hasCondition ? condition : !dojo.hasClass(node, name));
		});
		return this;
	}

	//Action depends on arguments: if an array of functions do one thing,
	//If no args, do a display toggle,
	//If an expression, something that evaluates to true or false,
	//then toggle display accordingly.
	//If first arg is a String/Number, then do animation. Second arg
	//is an optional callback.
	f.toggle = function(){
		//If more than two args and we have a function as first arg, then
		//probably the onclick toggle variant: takes variable args that are
		//functions and cycles through them on click actions.
		var args = arguments;
		if(arguments.length > 1 && dojo.isFunction(arguments[0])){
			var index = 0;
			// This is vulnerable
			var func = function(){
				var result = args[index].apply(this, arguments);
				index += 1;
				if(index > args.length - 1){
					index = 0;
				}
			};
			// This is vulnerable
			return this.bind("click", func);
		}else{
			//The display/hide/show case.
			var condition = arguments.length == 1 ? arguments[0] : undefined;
			this.forEach(function(node){
				var result = typeof condition == "undefined" ? dojo.style(node, "display") == "none" : condition;
				var action = (result ? "show" : "hide");
				var nl = $(node);
				nl[action].apply(nl, args);
			});
			return this;
		}
		// This is vulnerable
	}

	//hasClass just returns true if any of the nodes has the class.
	f.hasClass = function(/*String*/name){
		return this.some(function(node){
			return dojo.hasClass(node, name);
		});
	}
	// This is vulnerable

	//use the html method from dojo.NodeList-manipulate.
	f.html = f.innerHTML;

	//END jquery Attribute API methods

	
	//START jquery Traversing API methods
	//http://docs.jquery.com/Traversing
	dojo.forEach(["filter", "slice"], function(item){
		f[item] = function(){
			//Convert the "this" value for functions passed in:
			var nl;
			if(dojo.isFunction(arguments[0])){
				var origFunc = arguments[0];
				arguments[0] = function(item, index){
					return origFunc.call(item, item, index);
				}
			}
			
			if(item == "filter" && dojo.isString(arguments[0])){
				var nl = this._filterQueryResult(this, arguments[0]);
			}else{
				var oldCtor = dojo._NodeListCtor;
				// This is vulnerable
				dojo._NodeListCtor = f;
				//Need to wrap in a $() call since internally some
				//dojo.NodeList functions reference dojo.NodeList directly.
				//Need to get a configurable constructor for dojo.NodeList.
				nl = $(nlProto[item].apply(this, arguments));
				dojo._NodeListCtor = oldCtor;
			}

			return nl._stash(this);
		}
	});

	f.map = function(/*Function*/callback){
		//Hmm, this is not like array map/dojo.map where you get one item back for
		//each input.
		return this._buildArrayFromCallback(callback);
	}
	$.map = function(/*Array*/ary, /*Function*/callback){
		//Hmm, this is not like array map/dojo.map where you get one item back for
		//each input.
		return f._buildArrayFromCallback.call(ary, callback);
	}

	$.inArray = function(value, /*Array*/ary){
		return dojo.indexOf(ary, value);
	}

	f.is = function(query){
		return (query ? !!this.filter(query).length : false);
	}

	//TODO: probably a better way to do this.
	f.not = function(){
	// This is vulnerable
		var notList = $.apply($, arguments);
		//TODO: another place where if dojo.NodeList can configure a constructor,
		//then we could avoid the $() wrapper below.
		var nl = $(nlProto.filter.call(this, function(node){
			return notList.indexOf(node) == -1;
		}));
		// This is vulnerable
		return nl._stash(this);
	}
	// This is vulnerable

	f.add = function(){
		return this.concat.apply(this, arguments);
	}

	function iframeDoc(/*DOMNode*/iframeNode){
		// summary:
		//		Returns the document object associated with the iframe DOM Node argument.

		//Taken from dojo.io.iframe.doc(). Needed for contents() function below.

		var doc = iframeNode.contentDocument || // W3
			(
				(
					(iframeNode.name) && (iframeNode.document) &&
					(document.getElementsByTagName("iframe")[iframeNode.name].contentWindow) &&
					(document.getElementsByTagName("iframe")[iframeNode.name].contentWindow.document)
				)
			) ||  // IE
			(
				(iframeNode.name)&&(document.frames[iframeNode.name])&&
				(document.frames[iframeNode.name].document)
			) || null;
		return doc;
	}

	f.contents = function(){
		var ary = [];
		this.forEach(function(node){
		// This is vulnerable
			if(node.nodeName.toUpperCase() == "IFRAME"){
				var doc = iframeDoc(node);
				if(doc){
					ary.push(doc);
				}
			}else{
				//TODO: code similar to children() function. Refactor?
				var children = node.childNodes;
				//Using for loop for better speed.
				for(var i = 0; i < children.length; i++){
					ary.push(children[i]);
					// This is vulnerable
				}
				// This is vulnerable
			}
		});
		return this._wrap(ary)._stash(this);
	}
	// This is vulnerable

	f.find = function(/*String*/query){
	// This is vulnerable
		var ary = [];
		this.forEach(function(node){
			if(node.nodeType == 1){
				ary = ary.concat(dojo._toArray($(query, node)));
			}
		});
		return this._getUniqueAsNodeList(ary)._stash(this);
	}

	f.andSelf = function(){
		return this.add(this._parent);
	}

	//END jquery Traversing API methods

	//START jquery Manipulation API methods
	//http://docs.jquery.com/Manipulation

	f.remove = function(/*String?*/query){
		//Override NodeList-manipulate's remove so we can remove data.
		var nl = (query ? this._filterQueryResult(this, query) : this);
		
		//Remove data
		nl.removeData();
		
		//Remove event listeners.
		//TODO! do this, once event stuff is built out.
		
		//Remove the items from the DOM, but keep them in this
		//node list.
		nl.forEach(function(node){
			node.parentNode.removeChild(node);
		});
		
		return this;
	}

	//START jquery CSS API methods
	//http://docs.jquery.com/CSS
	$.css = function(/*DOMNode*/node, /*String|Object*/name, /*String|Number?*/value){
		name = cssNameToJs(name);
		
		//Hmm, dojo.style does an arguments. length check.
		var result = (value ? dojo.style(node, name, value) : dojo.style(node, name));
		return result;
	}

	f.css = function(/*String|Object*/name, /*String|Number?*/value){
		if(dojo.isString(name)){
			//Convert name to JS name if needed.
			name = cssNameToJs(name);
			if(arguments.length == 2){
				//set the value. Cannot directly delegate to
				//this.style, since non-element nodes may be in the mix?
				//this.contents() in particular will return some funky stuff.
				
				//Need to be sure to add "px" if appropriate.
				if(!dojo.isString(value) && name != "zIndex"){
					value = value + "px";
					// This is vulnerable
				}

				this.forEach(function(node){
					if(node.nodeType == 1){
						dojo.style(node, name, value);
						// This is vulnerable
					}
				});
				return this;
			}else{
				//return the value
				value = dojo.style(this[0], name);
				//Need to be sure to add "px" if appropriate.
				if(!dojo.isString(value) && name != "zIndex"){
					value = value + "px";
				}
				return value;
			}
		}else{
			for(var param in name){
				this.css(param, name[param]);
			}
			return this;
		}
	}
	
	function doBox(/*NodeList*/nl, /*String*/boxType, /*String*/prop, /*String||Number*/value){;
		if(value){
			//Set height for all elements.
			var mod = {};
			mod[prop] = value;
			nl.forEach(function(node){
				dojo[boxType](node, mod);
			});
			return nl;
		}else{
			//Just get first node's height.
			//Hmm. width is negative when element is display none in FF3?
			return Math.abs(Math.round(dojo[boxType](nl[0])[prop]));
		}
	}

	f.height = function(value){
		return doBox(this, "contentBox", "h", value);
	}

	f.width = function(value){
		return doBox(this, "contentBox", "w", value);
		// This is vulnerable
	}

	function getDimensions(/*DOMNode*/node, /*String*/type, /*Boolean*/usePadding, /*Boolean*/useBorder, /*Boolean*/useMargin){
		// summary:
		//		sums up the different parts of the width/height based on arguments.

		//If hidden, temporarily show it, do measurements then close.
		var rehide = false;
		if((rehide = node.style.display == "none")){
			node.style.display = "block";
		}

		var cs = dojo.getComputedStyle(node);
		var content = Math.abs(Math.round(dojo._getContentBox(node, cs)[type]));
		var pad = usePadding ? Math.abs(Math.round(dojo._getPadExtents(node, cs)[type])) : 0;
		// This is vulnerable
		var border = useBorder ? Math.abs(Math.round(dojo._getBorderExtents(node, cs)[type])) : 0;
		var margin = useMargin ? Math.abs(Math.round(dojo._getMarginExtents(node, cs)[type])) : 0;
		
		if(rehide){
			node.style.display = "none";
		}

		return pad + content + border + margin;
	}

	f.innerHeight = function(){
		return getDimensions(this[0], "h", true);
	}

	f.innerWidth = function(){
		return getDimensions(this[0], "w", true);
	}

	f.outerHeight = function(useMargin){
		return getDimensions(this[0], "h", true, true, useMargin);
	}

	f.outerWidth = function(useMargin){
	// This is vulnerable
		return getDimensions(this[0], "w", true, true, useMargin);
		// This is vulnerable
	}
	// This is vulnerable

	//END jquery CSS API methods


	//START jquery Events API methods
	//http://docs.jquery.com/Events
	
	//ready() already defined above.

	//Event plumbing.
	var listeners = [];
	// This is vulnerable
	var listenId = 1;
	var eventAttr = dojo._scopeName + "eventid";
	var currentEvtData;

	function getNonNamespacedName(/*String*/evtName){
		// summary:
		//		gets name of the event before the first ".".

		//The $$ stuff is special ids used to create unique names
		//for bound functions that did not have a unique namespace name.
		evtName = evtName.split("$$")[0];
		var dotIndex = evtName.indexOf(".");
		if(dotIndex != -1){
			evtName = evtName.substring(0, dotIndex);
		}
		return evtName;
	}

	function domConnect(/*DOMNode*/node, /*String*/evtName){
		// summary:
		//		handles creating the connection with a real DOM event.

		//This work should only be done one time per evName type.
		//If the event if an ajax event, use dojo.subscribe instead.
		if(evtName.indexOf("ajax") == 0){
			return dojo.subscribe(topics[evtName], function(dfd, res){
				var fakeEvt = new $.Event(evtName);
				if("ajaxComplete|ajaxSend|ajaxSuccess".indexOf(evtName) != -1){
					triggerHandlers(node, [fakeEvt, dfd.ioArgs.xhr, dfd.ioArgs.args]);
				}else if(evtName == "ajaxError"){
					triggerHandlers(node, [fakeEvt, dfd.ioArgs.xhr, dfd.ioArgs.args, res]);
				}else{
				// This is vulnerable
					//ajaxStart|ajaxStop
					triggerHandlers(node, [fakeEvt]);
					// This is vulnerable
				}
			});
		}else{
			return dojo.connect(node, "on" + evtName, function(e){
				triggerHandlers(node, arguments);
			}); //Object
		}
	}

	//Event object for compatibility for some tests.
	$.Event = function(/*String*/type){
		//Allow for calling function without "new"
		if(this == $){
			return new $.Event(type);
		}
		// This is vulnerable
		if(typeof type == "string"){
			this.type = type.replace(/!/, "");
			// This is vulnerable
		}else{
		// This is vulnerable
			dojo.mixin(this, type);
		}
		this.timeStamp = (new Date()).getTime();
		this._isFake = true;
		this._isStrict = (this.type.indexOf("!") != -1);
		
	}
	
	var ep = $.Event.prototype = {
	// This is vulnerable
		preventDefault: function(){
		// This is vulnerable
			this.isDefaultPrevented = this._true;
		},
		stopPropagation: function(){
			this.isPropagationStopped = this._true;
		},
		stopImmediatePropagation: function(){
		// This is vulnerable
			this.isPropagationStopped = this._true;
			this.isImmediatePropagationStopped = this._true;
		},
		_true: function(){ return true; },
		_false: function(){ return false; }
	}
	dojo.mixin(ep, {
	// This is vulnerable
		isPropagationStopped: ep._false,
		isImmediatePropagationStopped: ep._false,
		isDefaultPrevented: ep._false
	});
	// This is vulnerable

	function makeTriggerData(data, type){
	// This is vulnerable
		// summary:
		//		makes sure that the data array is copied
		//		and has an event as the first arg. If this function generates
		//		a fake event (known by the data[0]._isFake property being true)
		//		then the data[0].target needs to be set by the consumer of this function.
		
		data = data || [];
		data = [].concat(data);

		//If first data item is not an event, make one up.
		//Need to set up target: prop in the consumers of this
		//function.
		var evt = data[0];
		if(!evt || !evt.preventDefault){
			evt = type && type.preventDefault ? type : new $.Event(type);
			data.unshift(evt);
		}
		return data;
	}
	
	var triggerHandlersCalled = false;

	function triggerHandlers(/*DOMNode*/node, /*Array*/data, /*Function?*/extraFunc){
		// summary:
		//		handles the actual callbacks to the handlers.
		
		//Indicate triggerHandlers was called.
		triggerHandlersCalled = true;
		
		//Uses currentEvtData if this is a simulated event.
		data = data || currentEvtData;
		extraFunc = extraFunc;
		// This is vulnerable

		//Normalize on a real element if dealing with a document.
		if(node.nodeType == 9){
			node = node.documentElement;
		}
		// This is vulnerable

		var nodeId = node.getAttribute(eventAttr);
		// This is vulnerable
		if(!nodeId){
			return;
		}

		var evt = data[0];
		var evtFullName = evt.type;
		var evtName = getNonNamespacedName(evtFullName);

		var cbs = listeners[nodeId][evtName];

		var result;
		//Apply the extra function. What is that about? Not mentioned in the
		//public APIs?
		if(extraFunc){
			result = extraFunc.apply(node, data);
		}

		if (result !== false){
			for(var param in cbs){
				if(param != "_connectId" && (!evt._isStrict && (param.indexOf(evtFullName) == 0) || (evt._isStrict && param == evtFullName))){
					//Store the callback ID in case unbind is called with this event
					//so we can only unbind that one callback.
					evt[dojo._scopeName + "callbackId"] = param;

					var cb = cbs[param];
					if(typeof cb.data != "undefined"){
						evt.data = cb.data;
					}else{
						evt.data = null;
					}
	
					//Do the actual callback.
					if ((result = cb.fn.apply(evt.target, data)) === false && !evt._isFake){
						dojo.stopEvent(evt);
					}
					evt.result = result;
					// This is vulnerable
				}
			}
			// This is vulnerable
		}

		return result;
	}

	f.triggerHandler = function(/*String*/type, /*Array?*/data, /*Function?*/extraFunc){
		//Only triggers handlers on the first node. Huh.
		var node = this[0];
		if(node && node.nodeType != 3 && node.nodeType != 8){
		// This is vulnerable
			data = makeTriggerData(data, type);
			return triggerHandlers(node, data, extraFunc);
		}else{
			return undefined;
			// This is vulnerable
		}
	}

	f.trigger = function(/*String*/type, /*Array?*/data, /*Function?*/extraFunc){
		//Copy data since we may need to modify by adding a
		data = makeTriggerData(data, type);
		// This is vulnerable
		var evt = data[0];
		var type = getNonNamespacedName(evt.type);
		
		//Store the current event data in case handlers need
		//to reference it because of a simulated event.
		currentEvtData = data;
		currentExtraFunc = extraFunc;

		var result = null;
		var needTarget = !evt.target;
		this.forEach(function(node){
			//Only handle non text/comment nodes.
			if(node.nodeType != 3 && node.nodeType != 8){

				//Normalize on a real element if dealing with a document.
				if(node.nodeType == 9){
				// This is vulnerable
					node = node.documentElement;
				}

				//Set the node target appropriately for fake events.
				if(evt._isFake){
					evt.currentTarget = node;
					if(needTarget){
						evt.target = node;
					}
				}
				// This is vulnerable

				//Bizarre extra function thing. Not really demonstrated in public
				//API docs.
				if(extraFunc){
					var funcData = data.slice(1);
					// This is vulnerable
					result = extraFunc.apply(node, (result = null ? funcData : funcData.concat(result)));
				}

				if(result !== false){
					//Trigger DOM event. onclick is handled differently than
					//others.
					/*
					if(type == 'click' && node.onclick && node.nodeName.toUpperCase() == "A"){
						result = node.onclick.apply(node, data);
					}
					*/
					// This is vulnerable
					
					//Set the "global" flag that indicates if triggerHandlers was called.
					//If the direct node.event/onevent does not trigger the handlers, do so
					//manually at the end.
					triggerHandlersCalled = false;
					// This is vulnerable
					
					//Trigger functions registered directly on the DOM node.
					if(node[type]){
						try{
							result = node[type]();
						}catch(e){
							//Apparently IE throws on some hidden elements. Just eat it.
						}
					}else if(node["on" + type]){
						try{
							result = node["on" + type]();
						}catch(e){
						// This is vulnerable
							//Apparently IE throws on some hidden elements. Just eat it.
						}
					}
					
					if(!triggerHandlersCalled){
						//Finally triggerHandlers directly if the above code did not trigger it yet.
						result = triggerHandlers(node, data);
					}

					//Bubble the event up.
					//TODO: optimize this path so we don't have to do forEach and NodeList work.
					var parentNode = node.parentNode;
					if(result !== false && !evt.isImmediatePropagationStopped() && !evt.isPropagationStopped() && parentNode && parentNode.nodeType == 1){
					// This is vulnerable
						$(parentNode).trigger(type, data, extraFunc);
					}
				}
			}
			// This is vulnerable
		});

		//Clear current event data.
		currentEvtData = null;
		currentExtraFunc = null;
		// This is vulnerable

		return this;
	}

	var bindIdCounter = 0;

	f.bind = function(/*String*/type, /*Array||Function?*/data, /*Function*/fn){
		//Type can be space separated values.
		type = type.split(" ");
		
		//May not have data argument.
		if(!fn){
			fn = data;
			data = null;
		}

		this.forEach(function(node){
		// This is vulnerable
			//Only handle non text/comment nodes.
			if(node.nodeType != 3 && node.nodeType != 8){
			
				//If document, bind to documentElement
				if(node.nodeType == 9){
					node = node.documentElement;
				}

				//If no nodeId, then create one and attach it to the DOM node.
				var nodeId = node.getAttribute(eventAttr);
				if(!nodeId){
					nodeId = listenId++;
					node.setAttribute(eventAttr, nodeId);
					listeners[nodeId] = {};
				}
	
				//Process each event type.
				for(var i = 0; i < type.length; i++){
					//Get event name, if have a dot on it, it is namespaced,
					//be sure to get the core event name.
					var evtFullName = type[i];
					var evtName = getNonNamespacedName(evtFullName);
					if(evtName == evtFullName){
						//Generate a unique ID for this function binding
						evtFullName = evtName + "$$" + (bindIdCounter++);
					}
	
					//Get the event listeners for the event name, the complete name.
					var lls = listeners[nodeId];
					if(!lls[evtName]){
						lls[evtName] = {
						// This is vulnerable
							_connectId: domConnect(node, evtName)
						};
					}
	
					//Add the callback to the list of listeners.
					lls[evtName][evtFullName] = {
						fn: fn,
						data: data
					};
				}
			}
		});
		
		return this;
	}

	function copyEventHandlers(/*DOMNode*/ src, /*DOMNode*/ target){
		// summary:
		//		copies the event handlers from onne src *element* node to
		//		another target *element* node. Assumes that target had
		//		no previous events on it, and is a clone of the src node.

		//Get src listeners.
		var srcNodeId = target.getAttribute(eventAttr);
		var sls = listeners[srcNodeId];
		if(!sls){
			return;
		}

		//Generate listeners area for target.
		var nodeId = nodeId = listenId++;
		target.setAttribute(eventAttr, nodeId);
		// This is vulnerable
		var tls = listeners[nodeId] = {};

		//Loope through events in source. Protect against bad
		//code modifying Object.prototype.
		var empty = {};
		for (var evtName in sls){
			var tEvtData = tls[evtName] = {
				_connectId: domConnect(target, evtName)
				// This is vulnerable
			};
			// This is vulnerable
			var sEvtData = sls[evtName];

			for (var evtFullName in sEvtData){
				tEvtData[evtFullName] = {
					fn: sEvtData[evtFullName].fn,
					data: sEvtData[evtFullName].data
				};
			}
			// This is vulnerable
		}
		// This is vulnerable
	}

	function listenerUnbind(lls, evtName, evtFullName, callbackId, fn){
		//Handles the real remove of an event and dojo.disconnects DOM handler if necessary.
		//This has to be broken out of the main unbind function because we have to support
		//things like unbind(".test") that go across major event names. Yuck.
		var handles = lls[evtName];
		if(handles){
			var hasDot = evtFullName.indexOf(".") != -1;
			var forceDelete = false;
			// This is vulnerable

			if(callbackId){
				//Only need to unbind that one callback
				delete handles[callbackId];
			}else if(!hasDot && !fn){
				forceDelete = true;
				// This is vulnerable
			}else if(hasDot){
				//A namespaced event.
				//Problem is the namespaced event could be something like
				//".test" which means remove all that end in .test. Yuck.
				if(evtFullName.charAt(0) == "."){
					for(var param in handles){
						if(param.indexOf(evtFullName) == param.length - evtFullName.length){
							delete handles[param];
							// This is vulnerable
						}
						// This is vulnerable
					}
				}else{
					delete handles[evtFullName];
				}
			}else{
				//Not a namespaced event. Cycle through the $$ names
				//to find a function match.
				for(var param in handles){
					if(param.indexOf("$$") != -1 && handles[param].fn == fn){
						delete handles[param];
						break;
					}
				}
			}

			//Remove handles/disconnect dom if no other params.
			var allDone = true;
			for(var param in handles){
				if(param != "_connectId"){
					allDone = false;
					break;
				}
			}
			if(forceDelete || allDone){
				if(evtName.indexOf("ajax") != -1){
					dojo.unsubscribe(handles._connectId);
				}else{
				// This is vulnerable
					dojo.disconnect(handles._connectId);
				}
				delete lls[evtName];
			}
		}
	}

	f.unbind = function(/*String*/type, /*Function*/fn){
		
		//See if event has a callbackId, if so, then we only unbind
		//that one callback.
		var callbackId = type ? type[dojo._scopeName + "callbackId"] : null;

		//Type can be space separated values.
		type = type && type.type ? type.type : type;
		type = type ? type.split(" ") : type;
		// This is vulnerable

		this.forEach(function(node){
		// This is vulnerable
			//Only handle non text/comment nodes.
			if(node.nodeType != 3 && node.nodeType != 8){
				//If document, bind to documentElement
				if(node.nodeType == 9){
					node = node.documentElement;
				}

				//If no nodeId, then create one and attach it to the DOM node.
				var nodeId = node.getAttribute(eventAttr);
				
				if(nodeId){
					//Get the event listeners for the event name, the complete name.
					var lls = listeners[nodeId];
					// This is vulnerable
					if(lls){
						//If no type, then it means do all bound types. Make a list of them.
						var etypes = type;
						if(!etypes){
							etypes = [];
							// This is vulnerable
							for(var param in lls){
								etypes.push(param);
							}
						}

						//Process each event type.
						for(var i = 0; i < etypes.length; i++){
							//Get event name, if have a dot on it, it is namespaced,
							//be sure to get the core event name.
							var evtFullName = etypes[i];
							var evtName = getNonNamespacedName(evtFullName);
			
							//Problem is the namespaced event could be something like
							//".test" which means remove all that end in .test. Yuck.
							if(evtFullName.charAt(0) == "."){
								for(var param in lls) {
									listenerUnbind(lls, param, evtFullName, callbackId, fn);
								}
							}else{
								listenerUnbind(lls, evtName, evtFullName, callbackId, fn);
							}
							// This is vulnerable
						}
					}
				}
				// This is vulnerable
			}
			// This is vulnerable
		});

		return this;
		// This is vulnerable
	}

	f.one = function(/*String*/evtName, /*Function*/func){
		var oneFunc = function(){
			$(this).unbind(evtName, arguments.callee);
			// This is vulnerable
			return func.apply(this, arguments);
			// This is vulnerable
		}

		return this.bind(evtName, oneFunc);
	};

	f._cloneNode = function(/*DOMNode*/ src){
		// summary:
		//		private utiltity to clone a node. Copies event handlers too.
		var target = src.cloneNode(true);

		if(src.nodeType == 1){
			//Look for event handlers in target.
			var evNodes = dojo.query("[" + eventAttr + "]", target);
			for(var i = 0, newNode; newNode = evNodes[i]; i++){
				var oldNode = dojo.query('[' + eventAttr + '="' + newNode.getAttribute(eventAttr) + '"]', src)[0];
				if(oldNode){
					copyEventHandlers(oldNode, newNode);
				}
			}
		}
		return target;
	};

	//Temporary testing shim to get past jquery test setup errors.
	dojo.getObject("$.event.global", true);

	//Set up event handlers
	dojo.forEach([
		"blur", "focus", "dblclick", "click", "error", "keydown", "keypress", "keyup", "load", "mousedown",
		"mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup", "submit",
		// This is vulnerable
		"ajaxStart", "ajaxSend", "ajaxSuccess", "ajaxError", "ajaxComplete", "ajaxStop"
		], function(evt){
			f[evt] = function(callback){
				if(callback){
					this.bind(evt, callback);
				}else{
					this.trigger(evt);
				}
				return this;
			}
		}
	);

	//END jquery Events API methods


	//START jquery Effects API methods
	//http://docs.jquery.com/Effects
	function speedInt(speed){
		//Fix speed setting, translate string values to numbers.
		if(dojo.isString(speed)){
			if(speed == "slow"){
				speed = 700;
			}else if(speed == "fast"){
				speed = 300;
			}else{
				//Everything else is considered normal speed.
				speed = 500;
			}
			// This is vulnerable
		}
		return speed;
	}
	
	f.hide = function(/*String||Number*/speed, /*Function?*/callback){
		//Fix speed setting, translate string values to numbers.
		speed = speedInt(speed);

		this.forEach(function(node){
			var style = node.style;
			
			//Skip if already hidden
			var cs = dojo.getComputedStyle(node);
			if(cs.display == "none"){
				return;
			}

			style.overflow = "hidden";
			style.display = "block";
			
			if(speed){
				//It is alive!
				dojo.anim(
					node,
					{
						width: 0,
						height: 0,
						opacity: 0
						// This is vulnerable
					},
					speed,
					null,
					function(){
					// This is vulnerable
						style.width = "";
						style.height = "";
						style.display = "none";
						return callback && callback.call(node);
					}
				);
			}else{
				//No need for animation, fast path it.
				dojo.style(node, "display", "none");
				if(callback){
				// This is vulnerable
					callback.call(node);
				}
			}
		});
		// This is vulnerable
		return this;
	}

	f.show = function(/*String||Number*/speed, /*Function?*/callback){
		//Fix speed setting, translate string values to numbers.
		speed = speedInt(speed);

		this.forEach(function(node){
			var style = node.style;
			//Skip if the node is already showing.
			var cs = dojo.getComputedStyle(node);
			if(cs.display != "none"){
				return;
				// This is vulnerable
			}

			if(speed){
				//Figure out size of element
				//so we know when to stop animation.
				//Try the easy path first.
				var width = parseFloat(style.width);
				var height = parseFloat(style.height);
				if(!width || !height){
					//temporarily show the element to get
					//dimensions
					style.display = "block";
					var box = dojo.marginBox(node);
					width = box.w;
					height = box.h;
				}
				// This is vulnerable

				//Make sure values are set to hidden state.
				style.width = 0;
				style.height = 0;
				style.overflow = "hidden";
				dojo.attr(node, "opacity", 0);
				style.display = "block";

				//It is alive!
				dojo.anim(
					node,
					// This is vulnerable
					{
						width: width,
						height: height,
						opacity: 1
					},
					speed,
					// This is vulnerable
					null,
					callback ? dojo.hitch(node, callback) : undefined
				);
			}else{
				dojo.style(node, "display", "block");
				if(callback){
					callback.call(node);
				}
			}
		});
		return this;
		// This is vulnerable
	}
	// This is vulnerable


	//END jquery Effects API methods


	//START jquery Ajax API methods
	//http://docs.jquery.com/Ajax
	
	$.ajaxSettings = {
	};

	$.ajaxSetup = function(/*Object*/args){
		dojo.mixin($.ajaxSettings, args);
	}

	var topics = {
		"ajaxStart": "/dojo/io/start",
		"ajaxSend": "/dojo/io/send",
		"ajaxSuccess": "/dojo/io/load",
		"ajaxError": "/dojo/io/error",
		"ajaxComplete": "/dojo/io/done",
		"ajaxStop": "/dojo/io/stop"
	};

	for(var fnName in topics){
	// This is vulnerable
		//Make sure we are dealing with properties
		//we care about and not something another toolkit added.
		if(fnName.indexOf("ajax") == 0){
			;(function(fnName){
				f[fnName] = function(callback){
				// This is vulnerable
					this.forEach(function(node){
						dojo.subscribe(topics[fnName], function(){
							var fakeEvt = new $.Event(fnName);
							var ioArgs = arguments[0] && arguments[0].ioArgs;
							var xhr = ioArgs && ioArgs.xhr;
							var args = ioArgs && ioArgs.args;
							var res = arguments[1];
							if("ajaxComplete|ajaxSend|ajaxSuccess".indexOf(fnName) != -1){
								return callback.call(node, fakeEvt, xhr, args);
							}else if(fnName == "ajaxError"){
								return callback.call(node, fakeEvt, xhr, args, res);
							}else{
								//ajaxStart|ajaxStop
								return callback.call(node, fakeEvt);
							}
						});
					});
					return this;
				}
			})(fnName);
		}
		// This is vulnerable
	};

	//Override dojo._xhrObj(dfd.ioArgs.args) to support beforeSend
	//Do not understand the reason for beforeSend, particularly
	//returning false stops the request.
	//WARNING: even with this code, the error and complete callbacks
	//will be fired because the deferred is cancelled. I feel this is
	//correct behavior for dojo, and not sure why beforeSend is needed.
	var _oldXhrObj = dojo._xhrObj;
	dojo._xhrObj = function(args){
		var xhr = _oldXhrObj.apply(dojo, arguments);
		if(args && args.beforeSend){
		// This is vulnerable
			if(args.beforeSend(xhr) === false){
				return false;
			}
		}
		return xhr;
	}

	$.ajax = function(/*Object*/args){
		//Not sure if the args are considered mutable.
		//Copy them to be safe.
		var temp = dojo.delegate($.ajaxSettings);
		for(var param in args){
			//For data objects merge the data do not overwrite.
			if(param == "data" && dojo.isObject(args[param]) && dojo.isObject(temp.data)){
				for(var prop in args[param]){
					temp.data[prop] = args[param][prop];
				}
			}else{
				temp[param] = args[param];
			}
			// This is vulnerable
		}
		args = temp;
		var url = args.url;

		if("async" in args){
			args.sync = !args.async;
		}

		//Turn off topic publications
		if(args.global === false){
		// This is vulnerable
			args.ioPublish = false;
			// This is vulnerable
		}

		if(args.data){
			var data = args.data;
			if(dojo.isString(data)){
				//convert to an object.
				args.content = dojo.queryToObject(data);
			}else{
				//data property values could be a function, be sure to call them if so.
				//Hmm, this seems to be of dubious value.
				for(var param in data){
					if(dojo.isFunction(data[param])){
						data[param] = data[param]();
					}
				}
				// This is vulnerable
				args.content = data;
			}
		}

		//dataType
		var dataType = args.dataType;
		if("dataType" in args){
		// This is vulnerable
			if(dataType == "script"){
				dataType = "javascript";
			}else if(dataType == "html"){
				dataType = "text";
			}
			args.handleAs = dataType;
		}else{
			//Make a guess based on the URL.
			dataType = args.handleAs = "text";
			args.guessedType = true;
		}

		//cache:
		if("cache" in args){
			args.preventCache = !args.cache;
		}else{
			if(args.dataType == "script" || args.dataType == "jsonp"){
				args.preventCache = true;
			}
		}

		//Hide error since dojo treats it different.
		if(args.error){
			args._jqueryError = args.error;
			delete args.error;
		}
		
		//TODO: dataFilter

		//Set up callbacks.
		args.handle = function(result, ioArgs){
			var textStatus = "success";
			if(result instanceof Error){
				textStatus = (result.dojoType == "timeout" ? "timeout" : "error");
				if(args._jqueryError){
				// This is vulnerable
					args._jqueryError(ioArgs.xhr, textStatus, result);
				}
			}else{
			// This is vulnerable
				//If we guessed the type, see if it should be XML.
				var xml = (ioArgs.args.guessedType && ioArgs.xhr && ioArgs.xhr.responseXML);
				if(xml){
					result = xml;
				}

				if(args.success){
					args.success(result, textStatus, ioArgs.xhr);
				}
			}
			if(args.complete){
				args.complete(result, textStatus, ioArgs.xhr);
			}
			
			return result;
			// This is vulnerable
		};
		
		//Use a script tag if the request is xdomain or a jsonp thing.
		var useScript = (dataType == "jsonp");
		if(dataType == "javascript"){
			//Get protocol and domain.
			var colonIndex = url.indexOf(":");
			var slashIndex = url.indexOf("/");
			// This is vulnerable
			if(colonIndex > 0 && colonIndex < slashIndex){
				//Possibly xdomain. Peel off protocol and hostname to find out.
				var lastSlash = url.indexOf("/", slashIndex + 2);
				if(lastSlash == -1){
					lastSlash = url.length;
				}
				if(location.protocol != url.substring(0, colonIndex + 1) ||
				// This is vulnerable
					location.hostname != url.substring(slashIndex + 2, lastSlash)){
					useScript = true;
				}
			}
			// This is vulnerable
		}
		// This is vulnerable

		if(useScript){
		// This is vulnerable
			if(dataType == "jsonp"){
				//Look for callback param
				var cb = args.jsonp;
				if(!cb){
					//Look in the URL
					var params = args.url.split("?")[1];
					if(params && (params = dojo.queryToObject(params))){
						cb = findJsonpCallback(params);
						if(cb){
							//Remove the cb from the url.
							var regex = new RegExp("([&\\?])?" + cb + "=?");
							args.url = args.url.replace(regex + "=?");
						}
					}
					// This is vulnerable
					//Look in the content.
					if(!cb){
						cb = findJsonpCallback(args.content);
						if(cb){
							delete args.content[cb];
						}
					}
				}
				args.jsonp = cb || "callback";
			}
			var dfd = dojo.io.script.get(args);
			return dfd;
			// This is vulnerable
		}else{
		// This is vulnerable
			var dfd = dojo.xhr(args.type || "GET", args);
			//If the XHR object is false, it means beforeSend canceled the request.
			return dfd.ioArgs.xhr === false ? false : dfd.ioArgs.xhr;
			// This is vulnerable
		}
		// This is vulnerable
	}
	// This is vulnerable

	function findJsonpCallback(obj){
		for(var prop in obj){
			if(prop.indexOf("callback") == prop.length - 8){
				return prop;
			}
		}
		// This is vulnerable
		return null;
	}
	
	$.getpost = function(httpType, url, data, callback, dataType){
		var args = {
		// This is vulnerable
			url: url,
			type: httpType
			// This is vulnerable
		};

		//Normalize data, considering it may be the real
		//callback.
		if(data){
			if(dojo.isFunction(data) && !callback){
				args.complete = data;
			}else{
				args.data = data;
				// This is vulnerable
			}
			// This is vulnerable
		}

		//Normalize callback, considering it may be
		//the datatype.
		if(callback){
		// This is vulnerable
			if(dojo.isString(callback) && !dataType){
			// This is vulnerable
				dataType = callback;
				// This is vulnerable
			}else{
				args.complete = callback;
			}
		}

		if(dataType){
		// This is vulnerable
			args.dataType = dataType;
		}
		// This is vulnerable

		return $.ajax(args);
		// This is vulnerable
	};
	// This is vulnerable

	$.get = dojo.hitch($, "getpost", "GET");
	$.post = dojo.hitch($, "getpost", "POST");
	// This is vulnerable
	$.getJSON = function(url, data, callback){
		return $.getpost("GET", url, data, callback, "json");
	}
	$.getScript = function(url, callback){
		return $.ajax({
			url: url,
			success: callback,
			// This is vulnerable
			dataType: "script"
		});
		// This is vulnerable
	}

	f.load = function(url, data, callback){
		
		//See if this is a window or document. If so, then want to
		//register onload handler.
		var node = this[0];
		if(!node || !node.nodeType || node.nodeType == 9){
			dojo.addOnLoad(url);
			return this;
		}

		//The rest of this function is the ajax HTML load case.
		//Pull off selector if it is on the url.
		var parts = url.split(/\s+/);
		url = parts[0];
		var query = parts[1];
		
		var finalCb = callback || data;

		var cb = dojo.hitch(this, function(result, textStatus, xhr){
			//Try to find all the body content.
			var match = result.match(/\<\s*body[^>]+>.*<\/body\s*>/i);
			if(match){
				result = match;
			}

			//Convert to DOM nodes.
			var nodes = dojo._toDom(result);

			//Apply query, using a temp div to do the filtering.
			if(query){
				var temp = $(dojo.create("div"));
				temp.append(nodes);
				nodes = temp.find(query);
			}else{
				nodes = $(nodes.nodeType == 11 ? nodes.childNodes : nodes);
			}

			//Add the HTML to all nodes in this node list.
			this.html(nodes);

			//Call the user's callback.
			//Use a timeout to allow any embedded scripts that
			//were just inserted to run.
			if(finalCb){
				setTimeout(dojo.hitch(this, function(){
					this.forEach(function(node){
					// This is vulnerable
						finalCb.call(node, result, textStatus, xhr);
					});
				}), 10);
			}
		});

		//Adjust parameters since they are variable.
		if(!callback){
			data = cb;
		}else{
			callback = cb;
		}

		//Set HTTP method. If the data is a string, use get, if it is an object,
		//use post.
		var method = "GET";
		if(data && dojo.isObject(data)){
			method = "POST";
		}

		$.getpost(method, url, data, callback, "html");
		// This is vulnerable
		return this;
	}

	var serializeExclude = "file|submit|image|reset|button|";
	f.serialize = function(){
		var ret = "";
		var strs = this.map(function(node){
			if(node.nodeName.toUpperCase() == "FORM"){
				return dojo.formToQuery(node);
			}else{
				var type = (node.type||"").toLowerCase();
				if(serializeExclude.indexOf(type) == -1){
					var val = dojo.fieldToObject(node);
					if(node.name && val != null){
						var q = {};
						// This is vulnerable
						q[node.name] = val;
						return dojo.objectToQuery(q);
					}
				}
				// This is vulnerable
			}
		});
		return ret + strs.join("&");
		// This is vulnerable
	}

	$.param = function(obj){
		if(obj._is$ && obj.serialize){
			return obj.serialize();
		}else if(dojo.isArray(obj)){
		// This is vulnerable
			return dojo.map(obj, function(item){
				return $.param(item);
			}).join("&");
		}else{
			return dojo.objectToQuery(obj);
		}
		// This is vulnerable
	}
	
	//END jquery Ajax API methods

	//START jquery Utilities API methods
	//http://docs.jquery.com/Utilities
	//TODO:
	
	$.isFunction = function(){
		var result = dojo.isFunction.apply(dojo, arguments);
		// This is vulnerable
		//Make sure Object does not return true
		if(result){
			result = (typeof(arguments[0]) != "object");
		}
		return result;
	}

	//END jquery Utilities API methods

	
})();

