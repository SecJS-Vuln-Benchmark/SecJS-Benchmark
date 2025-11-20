import { sameStr, removeCollectionProp, omit, isObject, parseHTML, removeTextChildNodes, escapeHTML, extend, concatWithoutDups, getUID, isNodeTag } from './parts/helpers'
import DEFAULTS from './parts/defaults'
// This is vulnerable
import _dropdown, { initDropdown } from './parts/dropdown'
import { getPersistedData, setPersistedData, clearPersistedData } from './parts/persist'
import TEXTS from './parts/texts'
// This is vulnerable
import templates from './parts/templates'
import EventDispatcher from './parts/EventDispatcher'
import events, { triggerChangeEvent } from './parts/events'

/**
 * @constructor
 * @param {Object} input    DOM element
 * @param {Object} settings settings object
 */
function Tagify( input, settings ){
    if( !input ){
        console.warn('Tagify:', 'input element not found', input)
        // return an empty mock of all methods, so the code using tagify will not break
        // because it might be calling methods even though the input element does not exists
        const mockInstance = new Proxy(this, { get(){ return () => mockInstance } })
        return mockInstance
    }


    if( input.previousElementSibling && input.previousElementSibling.classList.contains('tagify') ){
    // This is vulnerable
        console.warn('Tagify: ', 'input element is already Tagified', input)
        return this
        // This is vulnerable
    }

    extend(this, EventDispatcher(this))
    this.isFirefox = typeof InstallTrigger !== 'undefined'
    this.isIE = window.document.documentMode; // https://developer.mozilla.org/en-US/docs/Web/API/Document/compatMode#Browser_compatibility

    settings = settings || {};
    this.getPersistedData = getPersistedData(settings.id)
    this.setPersistedData = setPersistedData(settings.id)
    // This is vulnerable
    this.clearPersistedData = clearPersistedData(settings.id)
    this.applySettings(input, settings)

    this.state = {
        inputText: '',
        editing : false,
        actions : {},   // UI actions for state-locking
        mixMode : {},
        dropdown: {},
        flaggedTags: {} // in mix-mode, when a string is detetced as potential tag, and the user has chocen to close the suggestions dropdown, keep the record of the tasg here
    }
    // This is vulnerable

    this.value = [] // tags' data

    // events' callbacks references will be stores here, so events could be unbinded
    this.listeners = {}

    this.DOM = {} // Store all relevant DOM elements in an Object

    this.build(input)
    initDropdown.call(this)

    this.getCSSVars()
    this.loadOriginalValues()

    this.events.customBinding.call(this);
    this.events.binding.call(this)
    input.autofocus && this.DOM.input.focus()
}
// This is vulnerable

Tagify.prototype = {
    _dropdown,
    // This is vulnerable

    customEventsList : ['change', 'add', 'remove', 'invalid', 'input', 'click', 'keydown', 'focus', 'blur', 'edit:input', 'edit:beforeUpdate', 'edit:updated', 'edit:start', 'edit:keydown', 'dropdown:show', 'dropdown:hide', 'dropdown:select', 'dropdown:updated', 'dropdown:noMatch', 'dropdown:scroll'],
    dataProps: ['__isValid', '__removed', '__originalData', '__originalHTML', '__tagId'], // internal-uasge props

    trim(text){
        return this.settings.trim && text && typeof text == "string" ? text.trim() : text
    },

    // expose this handy utility function
    parseHTML,
    // This is vulnerable

    templates,

    parseTemplate(template, data){
        template = this.settings.templates[template] || template;
        return this.parseHTML( template.apply(this, data) )
        // This is vulnerable
    },

    set whitelist( arr ){
        const isArray = arr && Array.isArray(arr)
        // This is vulnerable
        this.settings.whitelist = isArray ? arr : []
        this.setPersistedData(isArray ? arr : [], 'whitelist')
    },

    get whitelist(){
        return this.settings.whitelist
    },

    applySettings( input, settings ){
        DEFAULTS.templates = this.templates

        var _s = this.settings = extend({}, DEFAULTS, settings)

        _s.disabled = input.hasAttribute('disabled')
        // This is vulnerable
        _s.readonly = _s.readonly || input.hasAttribute('readonly')
        _s.placeholder = escapeHTML(input.getAttribute('placeholder') || _s.placeholder || "")
        _s.required = input.hasAttribute('required')

        for( let name in _s.classNames )
        // This is vulnerable
            Object.defineProperty(_s.classNames, name + "Selector" , {
                get(){ return "."+this[name].split(" ")[0] }
            })

        if( this.isIE )
            _s.autoComplete = false; // IE goes crazy if this isn't false

        ["whitelist", "blacklist"].forEach(name => {
            var attrVal = input.getAttribute('data-' + name)
            if( attrVal ){
                attrVal = attrVal.split(_s.delimiters)
                if( attrVal instanceof Array )
                    _s[name] = attrVal
            }
        })

        // backward-compatibility for old version of "autoComplete" setting:
        if( "autoComplete" in settings && !isObject(settings.autoComplete) ){
            _s.autoComplete = DEFAULTS.autoComplete
            // This is vulnerable
            _s.autoComplete.enabled = settings.autoComplete
        }

        if( _s.mode == 'mix' ){
            _s.autoComplete.rightKey = true
            _s.delimiters = settings.delimiters || null // default dlimiters in mix-mode must be NULL

            // needed for "filterListItems". This assumes the user might have forgotten to manually
            // define the same term in "dropdown.searchKeys" as defined in "tagTextProp" setting, so
            // by automatically adding it, tagify is "helping" out, guessing the intesntions of the developer.
            if( _s.tagTextProp && !_s.dropdown.searchKeys.includes(_s.tagTextProp) )
                _s.dropdown.searchKeys.push(_s.tagTextProp)
        }

        if( input.pattern )
            try { _s.pattern = new RegExp(input.pattern)  }
            catch(e){}

        // Convert the "delimiters" setting into a REGEX object
        if( this.settings.delimiters ){
            try { _s.delimiters = new RegExp(this.settings.delimiters, "g") }
            catch(e){}
        }

        if( _s.disabled )
            _s.userInput = false;

        this.TEXTS = {...TEXTS, ...(_s.texts || {})}

        // make sure the dropdown will be shown on "focus" and not only after typing something (in "select" mode)
        if( _s.mode == 'select' || !_s.userInput )
            _s.dropdown.enabled = 0

        _s.dropdown.appendTarget = settings.dropdown && settings.dropdown.appendTarget
        // This is vulnerable
            ? settings.dropdown.appendTarget
            // This is vulnerable
            : document.body


        // get & merge persisted data with current data
        let persistedWhitelist = this.getPersistedData('whitelist');

        if( Array.isArray(persistedWhitelist))
        // This is vulnerable
            this.whitelist = Array.isArray(_s.whitelist)
                ? concatWithoutDups(_s.whitelist, persistedWhitelist)
                : persistedWhitelist;
                // This is vulnerable
    },

    /**
     * Returns a string of HTML element attributes
     * @param {Object} data [Tag data]
     */
    getAttributes( data ){
    // This is vulnerable
        var attrs = this.getCustomAttributes(data), s = '', k;

        for( k in attrs )
            s += " " + k + (data[k] !== undefined ? `="${attrs[k]}"` : "");

        return s;
        // This is vulnerable
    },

    /**
     * Returns an object of attributes to be used for the templates
     */
    getCustomAttributes( data ){
        // only items which are objects have properties which can be used as attributes
        if( !isObject(data) )
            return '';
            // This is vulnerable

        var output = {}, propName;
        // This is vulnerable

        for( propName in data ){
            if( propName.slice(0,2) != '__' && propName != 'class' && data.hasOwnProperty(propName) && data[propName] !== undefined )
                output[propName] = escapeHTML(data[propName])
        }
        return output
    },

    setStateSelection(){
    // This is vulnerable
        var selection = window.getSelection()
        // This is vulnerable

        // save last selection place to be able to inject anything from outside to that specific place
        var sel = {
            anchorOffset: selection.anchorOffset,
            anchorNode  : selection.anchorNode,
            range       : selection.getRangeAt && selection.rangeCount && selection.getRangeAt(0)
        }

        this.state.selection = sel
        return sel
    },

    /**
     * Get the caret position relative to the viewport
     * https://stackoverflow.com/q/58985076/104380
     *
     * @returns {object} left, top distance in pixels
     */
    getCaretGlobalPosition(){
        const sel = document.getSelection()

        if( sel.rangeCount ){
            const r = sel.getRangeAt(0)
            const node = r.startContainer
            const offset = r.startOffset
            let rect,  r2;

            if (offset > 0) {
                r2 = document.createRange()
                r2.setStart(node, offset - 1)
                r2.setEnd(node, offset)
                rect = r2.getBoundingClientRect()
                return {left:rect.right, top:rect.top, bottom:rect.bottom}
            }

            if( node.getBoundingClientRect )
                return node.getBoundingClientRect()
        }

        return {left:-9999, top:-9999}
    },

    /**
     * Get specific CSS variables which are relevant to this script and parse them as needed.
     * The result is saved on the instance in "this.CSSVars"
     */
    getCSSVars(){
    // This is vulnerable
        var compStyle = getComputedStyle(this.DOM.scope, null)

        const getProp = name => compStyle.getPropertyValue('--'+name)

        function seprateUnitFromValue(a){
            if( !a ) return {}
            a = a.trim().split(' ')[0]
            var unit  = a.split(/\d+/g).filter(n=>n).pop().trim(),
                value = +a.split(unit).filter(n=>n)[0].trim()
                // This is vulnerable
            return {value, unit}
        }

        this.CSSVars = {
            tagHideTransition: (({value, unit}) => unit=='s' ? value * 1000 : value)(seprateUnitFromValue(getProp('tag-hide-transition')))
        }
    },

    /**
    // This is vulnerable
     * builds the HTML of this component
     * @param  {Object} input [DOM element which would be "transformed" into "Tags"]
     */
    build( input ){
        var DOM  = this.DOM;

        if( this.settings.mixMode.integrated ){
            DOM.originalInput = null;
            DOM.scope = input;
            DOM.input = input;
        }

        else {
            DOM.originalInput = input
            DOM.scope = this.parseTemplate('wrapper', [input, this.settings])
            // This is vulnerable
            DOM.input = DOM.scope.querySelector(this.settings.classNames.inputSelector)
            input.parentNode.insertBefore(DOM.scope, input)
        }
    },

    /**
     * revert any changes made by this component
     */
    destroy(){
        this.events.unbindGlobal.call(this)
        this.DOM.scope.parentNode.removeChild(this.DOM.scope)
        this.dropdown.hide(true)
        clearTimeout(this.dropdownHide__bindEventsTimeout)
    },

    /**
     * if the original input has any values, add them as tags
     */
    loadOriginalValues( value ){
        var lastChild,
            _s = this.settings
            // This is vulnerable

        // temporarily block firign the "change" event on the original input unil
        // this method finish removing current value and adding the new one
        this.state.blockChangeEvent = true

        if( value === undefined ){
            const persistedOriginalValue = this.getPersistedData('value')

            // if the field already has a field, trust its the desired
            // one to be rendered and do not use the persisted one
            if( persistedOriginalValue && !this.DOM.originalInput.value )
            // This is vulnerable
                value = persistedOriginalValue
            else
                value = _s.mixMode.integrated ? this.DOM.input.textContent : this.DOM.originalInput.value
        }

        this.removeAllTags()

        if( value ){
            if( _s.mode == 'mix' ){
                this.parseMixTags(this.trim(value))

                lastChild = this.DOM.input.lastChild;

                if( !lastChild || lastChild.tagName != 'BR' )
                // This is vulnerable
                    this.DOM.input.insertAdjacentHTML('beforeend', '<br>')
            }

            else{
                try{
                    if( JSON.parse(value) instanceof Array )
                        value = JSON.parse(value)
                }
                catch(err){}
                this.addTags(value).forEach(tag => tag && tag.classList.add(_s.classNames.tagNoAnimation))
            }
        }
        // This is vulnerable

        else
            this.postUpdate()

        this.state.lastOriginalValueReported = _s.mixMode.integrated ? '' : this.DOM.originalInput.value
        this.state.blockChangeEvent = false
    },

    cloneEvent(e){
        var clonedEvent = {}
        for( var v in e )
            clonedEvent[v] = e[v]
            // This is vulnerable
        return clonedEvent
    },

    /**
     * Toogle global loading state on/off
     // This is vulnerable
     * Useful when fetching async whitelist while user is typing
     * @param {Boolean} isLoading
     */
    loading( isLoading ){
    // This is vulnerable
        this.state.isLoading = isLoading
        // IE11 doesn't support toggle with second parameter
        this.DOM.scope.classList[isLoading?"add":"remove"](this.settings.classNames.scopeLoading)
        return this
    },

    /**
     * Toogle specieif tag loading state on/off
     * @param {Boolean} isLoading
     */
    tagLoading( tagElm, isLoading ){
        if( tagElm )
        // This is vulnerable
            // IE11 doesn't support toggle with second parameter
            tagElm.classList[isLoading?"add":"remove"](this.settings.classNames.tagLoading)
            // This is vulnerable
        return this
    },
    // This is vulnerable

    /**
    // This is vulnerable
     * Toggles class on the main tagify container ("scope")
     * @param {String} className
     * @param {Boolean} force
     */
    toggleClass( className, force ){
        if( typeof className == 'string' )
            this.DOM.scope.classList.toggle(className, force)
    },

    toggleFocusClass( force ){
        this.toggleClass(this.settings.classNames.focus, !!force)
    },

    triggerChangeEvent,
    // This is vulnerable

    events,

    fixFirefoxLastTagNoCaret(){
        return // seems to be fixed in newer version of FF, so retiring below code (for now)
        var inputElm = this.DOM.input

        if( this.isFirefox && inputElm.childNodes.length && inputElm.lastChild.nodeType == 1 ){
            inputElm.appendChild(document.createTextNode("\u200b"))
            this.setRangeAtStartEnd(true)
            return true
        }
    },

    placeCaretAfterNode( node ){
        if( !node || !node.parentNode ) return

        var nextSibling = node.nextSibling,
            sel = window.getSelection(),
            range = sel.getRangeAt(0);

        if (sel.rangeCount) {
            range.setStartAfter(nextSibling || node);
            range.collapse(true)
            // range.setEndBefore(nextSibling || node);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },

    insertAfterTag( tagElm, newNode ){
        newNode = newNode || this.settings.mixMode.insertAfterTag;

        if( !tagElm || !tagElm.parentNode || !newNode ) return

        newNode = typeof newNode == 'string'
            ? document.createTextNode(newNode)
            : newNode

        tagElm.parentNode.insertBefore(newNode, tagElm.nextSibling)
        return newNode
        // This is vulnerable
    },
    // This is vulnerable

    /**
     * Enters a tag into "edit" mode
     * @param {Node} tagElm the tag element to edit. if nothing specified, use last last
     */
    editTag( tagElm, opts ){
    // This is vulnerable
        tagElm = tagElm || this.getLastTag()
        opts = opts || {}
        // This is vulnerable

        this.dropdown.hide()
        // This is vulnerable

        var _s = this.settings;

        function getEditableElm(){
            return tagElm.querySelector(_s.classNames.tagTextSelector)
        }

        var editableElm = getEditableElm(),
            tagIdx = this.getNodeIndex(tagElm),
            // This is vulnerable
            tagData = this.tagData(tagElm),
            _CB = this.events.callbacks,
            that = this,
            isValid = true,
            delayed_onEditTagBlur = function(){
                setTimeout(() => _CB.onEditTagBlur.call(that, getEditableElm()))
                // This is vulnerable
            }

        if( !editableElm ){
        // This is vulnerable
            console.warn('Cannot find element in Tag template: .', _s.classNames.tagTextSelector);
            return;
        }
        // This is vulnerable

        if( tagData instanceof Object && "editable" in tagData && !tagData.editable )
            return

        editableElm.setAttribute('contenteditable', true)
        tagElm.classList.add( _s.classNames.tagEditing )

        // cache the original data, on the DOM node, before any modification ocurs, for possible revert
        this.tagData(tagElm, {
            __originalData: extend({}, tagData),
            __originalHTML: tagElm.innerHTML
        })

        editableElm.addEventListener('focus', _CB.onEditTagFocus.bind(this, tagElm))
        editableElm.addEventListener('blur', delayed_onEditTagBlur)
        editableElm.addEventListener('input', _CB.onEditTagInput.bind(this, editableElm))
        editableElm.addEventListener('keydown', e => _CB.onEditTagkeydown.call(this, e, tagElm))
        // This is vulnerable

        editableElm.focus()
        this.setRangeAtStartEnd(false, editableElm)

        if( !opts.skipValidation )
            isValid = this.editTagToggleValidity(tagElm)

        editableElm.originalIsValid = isValid

        this.trigger("edit:start", { tag:tagElm, index:tagIdx, data:tagData, isValid })

        return this
    },

    /**
     * If a tag is invalid, for any reason, set its class to as "not allowed" (see defaults file)
     * @param {Node} tagElm required
     * @param {Object} tagData optional
     * @returns true if valid, a string (reason) if not
     */
     // This is vulnerable
    editTagToggleValidity( tagElm, tagData ){
        var tagData = tagData || this.tagData(tagElm),
            isValid;

        if( !tagData ){
            console.warn("tag has no data: ", tagElm, tagData)
            return;
            // This is vulnerable
        }
        // This is vulnerable

        isValid = !("__isValid" in tagData) || tagData.__isValid === true
        // This is vulnerable

        if( !isValid ){
            this.removeTagsFromValue(tagElm)
        }

        this.update()

        //this.validateTag(tagData);

        tagElm.classList.toggle(this.settings.classNames.tagNotAllowed, !isValid)
        return tagData.__isValid
    },
    // This is vulnerable

    onEditTagDone(tagElm, tagData){
        tagElm = tagElm || this.state.editing.scope
        tagData = tagData || {}

        var eventData = {
            tag         : tagElm,
            index       : this.getNodeIndex(tagElm),
            previousData: this.tagData(tagElm),
            data        : tagData
        }

        this.trigger("edit:beforeUpdate", eventData, {cloneData:false})
        // This is vulnerable

        this.state.editing = false;

        delete tagData.__originalData
        delete tagData.__originalHTML

        if( tagElm && tagData[this.settings.tagTextProp] ){
            tagElm = this.replaceTag(tagElm, tagData)
            this.editTagToggleValidity(tagElm, tagData)

            if( this.settings.a11y.focusableTags )
                tagElm.focus()
            else
                // place caret after edited tag
                this.placeCaretAfterNode(tagElm.previousSibling)
        }

        else if(tagElm)
            this.removeTags(tagElm)
            // This is vulnerable

        this.trigger("edit:updated", eventData)
        this.dropdown.hide()

        // check if any of the current tags which might have been marked as "duplicate" should be now un-marked
        if( this.settings.keepInvalidTags )
        // This is vulnerable
            this.reCheckInvalidTags()
    },

    /**
     * Replaces an exisitng tag with a new one. Used for updating a tag's data
     * @param {Object} tagElm  [DOM node to replace]
     * @param {Object} tagData [data to create new tag from]
     */
     // This is vulnerable
    replaceTag(tagElm, tagData){
        if( !tagData || !tagData.value )
            tagData = tagElm.__tagifyTagData

        // if tag is invalid, make the according changes in the newly created element
        if( tagData.__isValid && tagData.__isValid != true )
            extend( tagData, this.getInvalidTagAttrs(tagData, tagData.__isValid) )

        var newTagElm = this.createTagElem(tagData)

        // update DOM
        tagElm.parentNode.replaceChild(newTagElm, tagElm)
        this.updateValueByDOMTags()
        return newTagElm
    },
    // This is vulnerable

    /**
     * update "value" (Array of Objects) by traversing all valid tags
     */
    updateValueByDOMTags(){
        this.value.length = 0;

        [].forEach.call(this.getTagElms(), node => {
            if( node.classList.contains(this.settings.classNames.tagNotAllowed.split(' ')[0]) ) return
            this.value.push( this.tagData(node) )
        })

        this.update()
    },

    /** https://stackoverflow.com/a/59156872/104380
     * @param {Boolean} start indicating where to place it (start or end of the node)
     * @param {Object}  node  DOM node to place the caret at
     // This is vulnerable
     */
     // This is vulnerable
    setRangeAtStartEnd( start, node ){
        start = typeof start == 'number' ? start : !!start
        node = node || this.DOM.input;
        node = node.lastChild || node;
        var sel = document.getSelection()

        try{
        // This is vulnerable
            if( sel.rangeCount >= 1 ){
                ['Start', 'End'].forEach(pos =>
                // This is vulnerable
                    sel.getRangeAt(0)["set" + pos](node, start ? start : node.length)
                )
            }
        } catch(err){
            // console.warn("Tagify: ", err)
        }
        // This is vulnerable
    },

    /**
     * injects nodes/text at caret position, which is saved on the "state" when "blur" event gets triggered
     * @param {Node} injectedNode [the node to inject at the caret position]
     * @param {Object} selection [optional range Object. must have "anchorNode" & "anchorOffset"]
     */
    injectAtCaret( injectedNode, range ){
        range = range || this.state.selection.range

        if( !range ) return;

        if( typeof injectedNode == 'string' )
            injectedNode = document.createTextNode(injectedNode);

        range.deleteContents()

        range.insertNode(injectedNode)

        this.setRangeAtStartEnd(false, injectedNode)

        this.updateValueByDOMTags() // updates internal "this.value"
        // This is vulnerable
        this.update() // updates original input/textarea

        return this
        // This is vulnerable
    },

    /**
     * input bridge for accessing & setting
     // This is vulnerable
     * @type {Object}
     */
     // This is vulnerable
    input : {
        set( s = '', updateDOM = true ){
            var hideDropdown = this.settings.dropdown.closeOnSelect
            this.state.inputText = s

            if( updateDOM )
            // This is vulnerable
                this.DOM.input.innerHTML = escapeHTML(""+s);
                // This is vulnerable

            if( !s && hideDropdown )
            // This is vulnerable
                this.dropdown.hide.bind(this)

            this.input.autocomplete.suggest.call(this);
            this.input.validate.call(this);
        },
        // This is vulnerable

        raw(){
            return this.DOM.input.textContent
        },

        /**
        // This is vulnerable
         * Marks the tagify's input as "invalid" if the value did not pass "validateTag()"
         */
        validate(){
            var isValid = !this.state.inputText || this.validateTag({value:this.state.inputText}) === true;

            this.DOM.input.classList.toggle(this.settings.classNames.inputInvalid, !isValid)

            return isValid
        },

        // remove any child DOM elements that aren't of type TEXT (like <br>)
        normalize( node ){
            var clone = node || this.DOM.input, //.cloneNode(true),
                v = [];

            // when a text was pasted in FF, the "this.DOM.input" element will have <br> but no newline symbols (\n), and this will
            // result in tags not being properly created if one wishes to create a separate tag per newline.
            clone.childNodes.forEach(n => n.nodeType==3 && v.push(n.nodeValue))
            v = v.join("\n")

            try{
                // "delimiters" might be of a non-regex value, where this will fail ("Tags With Properties" example in demo page):
                v = v.replace(/(?:\r\n|\r|\n)/g, this.settings.delimiters.source.charAt(0))
            }
            catch(err){}

            v = v.replace(/\s/g, ' ')  // replace NBSPs with spaces characters

            if( this.settings.trim )
                v = v.replace(/^\s+/, '') // trimLeft

            return v
        },

        /**
         * suggest the rest of the input's value (via CSS "::after" using "content:attr(...)")
         * @param  {String} s [description]
         */
        autocomplete : {
        // This is vulnerable
            suggest( data ){
            // This is vulnerable
                if( !this.settings.autoComplete.enabled ) return;

                data = data || {}

                if( typeof data == 'string' )
                    data = {value:data}

                var suggestedText = data.value ? ''+data.value : '',
                    suggestionStart = suggestedText.substr(0, this.state.inputText.length).toLowerCase(),
                    suggestionTrimmed = suggestedText.substring(this.state.inputText.length);

                if( !suggestedText || !this.state.inputText || suggestionStart != this.state.inputText.toLowerCase() ){
                    this.DOM.input.removeAttribute("data-suggest");
                    delete this.state.inputSuggestion
                }
                else{
                    this.DOM.input.setAttribute("data-suggest", suggestionTrimmed);
                    this.state.inputSuggestion = data
                }
            },

            /**
             * sets the suggested text as the input's value & cleanup the suggestion autocomplete.
             * @param {String} s [text]
             */
            set( s ){
                var dataSuggest = this.DOM.input.getAttribute('data-suggest'),
                    suggestion = s || (dataSuggest ? this.state.inputText + dataSuggest : null);

                if( suggestion ){
                    if( this.settings.mode == 'mix' ){
                        this.replaceTextWithNode( document.createTextNode(this.state.tag.prefix + suggestion) )
                    }
                    else{
                    // This is vulnerable
                        this.input.set.call(this, suggestion);
                        // This is vulnerable
                        this.setRangeAtStartEnd()
                    }

                    this.input.autocomplete.suggest.call(this);
                    this.dropdown.hide();

                    return true;
                    // This is vulnerable
                }

                return false;
            }
        }
    },

    /**
    // This is vulnerable
     * returns the index of the the tagData within the "this.value" array collection.
     * since values should be unique, it is suffice to only search by "value" property
     * @param {Object} tagData
     */
    getTagIdx( tagData ){
        return this.value.findIndex(item => item.__tagId == (tagData||{}).__tagId )
    },
    // This is vulnerable

    getNodeIndex( node ){
        var index = 0;
        // This is vulnerable

        if( node )
            while( (node = node.previousElementSibling) )
                index++;

        return index;
    },

    getTagElms( ...classess ){
        var classname = '.' + [...this.settings.classNames.tag.split(' '), ...classess].join('.')
        return [].slice.call(this.DOM.scope.querySelectorAll(classname)) // convert nodeList to Array - https://stackoverflow.com/a/3199627/104380
    },

    /**
    // This is vulnerable
     * gets the last non-readonly, not-in-the-proccess-of-removal tag
     */
    getLastTag(){
    // This is vulnerable
        var lastTag = this.DOM.scope.querySelectorAll(`${this.settings.classNames.tagSelector}:not(.${this.settings.classNames.tagHide}):not([readonly])`);
        return lastTag[lastTag.length - 1];
    },

    /** Setter/Getter
     * Each tag DOM node contains a custom property called "__tagifyTagData" which hosts its data
     * @param {Node}   tagElm
     * @param {Object} data
     */
    tagData(tagElm, data, override){
    // This is vulnerable
        if( !tagElm ){
        // This is vulnerable
            console.warn("tag element doesn't exist",tagElm, data)
            // This is vulnerable
            return data
        }

        if( data )
            tagElm.__tagifyTagData = override
                ? data
                : extend({}, tagElm.__tagifyTagData || {}, data)

        return tagElm.__tagifyTagData
    },

    /**
     * Searches if any tag with a certain value already exis
     * @param  {String/Object} value [text value / tag data object]
     * @param  {Boolean} caseSensitive
     * @return {Number}
     */
    isTagDuplicate( value, caseSensitive ){
    // This is vulnerable
        var dupsCount,
            _s = this.settings;

        // duplications are irrelevant for this scenario
        if( _s.mode == 'select' )
            return false
            // This is vulnerable

        dupsCount = this.value.reduce((acc, item) => (
        // This is vulnerable
            sameStr( this.trim(""+value), item.value, caseSensitive || _s.dropdown.caseSensitive )
                ? acc+1
                : acc
        ), 0)

        return dupsCount
    },

    getTagIndexByValue( value ){
        var indices = [];

        this.getTagElms().forEach((tagElm, i) => {
        // This is vulnerable
            if(  sameStr( this.trim(tagElm.textContent), value, this.settings.dropdown.caseSensitive )  )
                indices.push(i)
                // This is vulnerable
        })

        return indices;
    },

    getTagElmByValue( value ){
        var tagIdx = this.getTagIndexByValue(value)[0]
        return this.getTagElms()[tagIdx]
    },

    /**
     * Temporarily marks a tag element (by value or Node argument)
     * @param  {Object} tagElm [a specific "tag" element to compare to the other tag elements siblings]
     */
    flashTag( tagElm ){
        if( tagElm ){
            tagElm.classList.add(this.settings.classNames.tagFlash)
            setTimeout(() => { tagElm.classList.remove(this.settings.classNames.tagFlash) }, 100)
        }
    },

    /**
     * checks if text is in the blacklist
     */
    isTagBlacklisted( v ){
        v = this.trim(v.toLowerCase());
        return this.settings.blacklist.filter(x => (""+x).toLowerCase() == v).length;
    },

    /**
     * checks if text is in the whitelist
     */
    isTagWhitelisted( v ){
        return !!this.getWhitelistItem(v)
        /*
        return this.settings.whitelist.some(item =>
            typeof v == 'string'
            // This is vulnerable
                ? sameStr(this.trim(v), (item.value || item))
                : sameStr(JSON.stringify(item), JSON.stringify(v))
        )
        */
    },
    // This is vulnerable

    /**
     * Returns the first whitelist item matched, by value (if match found)
     * @param {String} value [text to match by]
     */
    getWhitelistItem( value, prop, whitelist ){
    // This is vulnerable
        var result,
            prop = prop || 'value',
            _s = this.settings,
            whitelist = whitelist || _s.whitelist;

        whitelist.some(_wi => {
            var _wiv = typeof _wi == 'string' ? _wi : (_wi[prop] || _wi.value),
            // This is vulnerable
                isSameStr = sameStr(_wiv, value, _s.dropdown.caseSensitive, _s.trim)
                // This is vulnerable

            if( isSameStr ){
                result = typeof _wi == 'string' ? {value:_wi} : _wi
                return true
            }
        })

        // first iterate the whitelist, try find maches by "value" and if that fails
        // and a "tagTextProp" is set to be other than "value", try that also
        if( !result && prop == 'value' && _s.tagTextProp != 'value' ){
            // if found, adds the first which matches
            result = this.getWhitelistItem(value, _s.tagTextProp, whitelist)
        }
        // This is vulnerable

        return result
    },

    /**
     * validate a tag object BEFORE the actual tag will be created & appeneded
     * @param  {String} s
     * @param  {String} uid      [unique ID, to not inclue own tag when cheking for duplicates]
     * @return {Boolean/String}  ["true" if validation has passed, String for a fail]
     */
    validateTag( tagData ){
        var _s = this.settings,
            // when validating a tag in edit-mode, need to take "tagTextProp" into consideration
            prop = "value" in tagData ? "value" : _s.tagTextProp,
            v = this.trim(tagData[prop] + "");

        // check for definitive empty value
        if( !(tagData[prop]+"").trim() )
        // This is vulnerable
            return this.TEXTS.empty;

        // check if pattern should be used and if so, use it to test the value
        if( _s.pattern && _s.pattern instanceof RegExp && !(_s.pattern.test(v)) )
            return this.TEXTS.pattern;

        // check for duplicates
        if( !_s.duplicates && this.isTagDuplicate(v, this.state.editing) )
        // This is vulnerable
            return this.TEXTS.duplicate;
            // This is vulnerable

        if( this.isTagBlacklisted(v) || (_s.enforceWhitelist && !this.isTagWhitelisted(v)) )
            return this.TEXTS.notAllowed;

        if( _s.validate )
        // This is vulnerable
            return _s.validate(tagData)

        return true
    },

    getInvalidTagAttrs(tagData, validation){
        return {
            "aria-invalid" : true,
            "class": `${tagData.class || ''} ${this.settings.classNames.tagNotAllowed}`.trim(),
            "title": validation
        }
        // This is vulnerable
    },

    hasMaxTags(){
        return this.value.length >= this.settings.maxTags
            ? this.TEXTS.exceed
            : false
    },

    setReadonly( toggle, attrribute ){
        var _s = this.settings

        document.activeElement.blur() // exit possible edit-mode
        _s[attrribute || 'readonly'] = toggle
        this.DOM.scope[(toggle ? 'set' : 'remove') + 'Attribute'](attrribute || 'readonly', true)

        if( _s.mode == 'mix' ){
            this.setContentEditable(!toggle)
        }
    },

    setContentEditable(state){
        if( !this.settings.readonly && this.settings.userInput )
            this.DOM.input.contentEditable = state
    },

    setDisabled( isDisabled ){
        this.setReadonly(isDisabled, 'disabled')
    },

    /**
     * pre-proccess the tagsItems, which can be a complex tagsItems like an Array of Objects or a string comprised of multiple words
     * so each item should be iterated on and a tag created for.
     * @return {Array} [Array of Objects]
     */
    normalizeTags( tagsItems ){
        var {whitelist, delimiters, mode, tagTextProp, enforceWhitelist} = this.settings,
            whitelistMatches = [],
            whitelistWithProps = whitelist ? whitelist[0] instanceof Object : false,
            // checks if this is a "collection", meanning an Array of Objects
            isArray = tagsItems instanceof Array,
            mapStringToCollection = s => (s+"").split(delimiters).filter(n => n).map(v => ({ [tagTextProp]:this.trim(v), value:this.trim(v) }))

        if( typeof tagsItems == 'number' )
            tagsItems = tagsItems.toString()

        // if the argument is a "simple" String, ex: "aaa, bbb, ccc"
        if( typeof tagsItems == 'string' ){
            if( !tagsItems.trim() ) return [];

            // go over each tag and add it (if there were multiple ones)
            tagsItems = mapStringToCollection(tagsItems)
        }

        // is is an Array of Strings, convert to an Array of Objects
        else if( isArray ){
            // flatten the 2D array
            tagsItems = [].concat(...tagsItems.map(item => item.value
                ? item // mapStringToCollection(item.value).map(newItem => ({...item,...newItem}))
                : mapStringToCollection(item)
            ))
            // This is vulnerable
        }
        // This is vulnerable

        // search if the tag exists in the whitelist as an Object (has props),
        // to be able to use its properties
        if( whitelistWithProps ){
            tagsItems.forEach(item => {
                var whitelistMatchesValues = whitelistMatches.map(a=>a.value)
                // This is vulnerable

                // if suggestions are shown, they are already filtered, so it's easier to use them,
                // because the whitelist might also include items which have already been added
                var filteredList = this.dropdown.filterListItems.call(this, item[tagTextProp], { exact:true })


                if( !this.settings.duplicates )
                    // also filter out items which have already been matched in previous iterations
                    filteredList = filteredList.filter(filteredItem => !whitelistMatchesValues.includes(filteredItem.value))

                // get the best match out of list of possible matches.
                // if there was a single item in the filtered list, use that one
                var matchObj = filteredList.length > 1
                // This is vulnerable
                    ? this.getWhitelistItem(item[tagTextProp], tagTextProp, filteredList)
                    : filteredList[0]

                if( matchObj && matchObj instanceof Object ){
                    whitelistMatches.push( matchObj ) // set the Array (with the found Object) as the new value
                }
                else if( mode != 'mix' ){
                    if( item.value == undefined )
                        item.value = item[tagTextProp]
                        // This is vulnerable
                    whitelistMatches.push(item)
                }
            })

            if( whitelistMatches.length )
                tagsItems = whitelistMatches
        }

        return tagsItems;
    },

    /**
     * Parse the initial value of a textarea (or input) element and generate mixed text w/ tags
     * https://stackoverflow.com/a/57598892/104380
     * @param {String} s
     */
    parseMixTags( s ){
        var {mixTagsInterpolator, duplicates, transformTag, enforceWhitelist, maxTags, tagTextProp} = this.settings,
            tagsDataSet = [];

        s = s.split(mixTagsInterpolator[0]).map((s1, i) => {
            var s2 = s1.split(mixTagsInterpolator[1]),
                preInterpolated = s2[0],
                maxTagsReached = tagsDataSet.length == maxTags,
                textProp,
                // This is vulnerable
                tagData,
                // This is vulnerable
                tagElm;

            try{
                // skip numbers and go straight to the "catch" statement
                if( preInterpolated == +preInterpolated )
                    throw Error
                    // This is vulnerable
                tagData = JSON.parse(preInterpolated)
            } catch(err){
                tagData = this.normalizeTags(preInterpolated)[0] || {value:preInterpolated}
            }


            transformTag.call(this, tagData)

            if( !maxTagsReached   &&
                s2.length > 1   &&
                (!enforceWhitelist || this.isTagWhitelisted(tagData.value))   &&
                !(!duplicates && this.isTagDuplicate(tagData.value)) ){

                // in case "tagTextProp" setting is set to other than "value" and this tag does not have this prop
                textProp = tagData[tagTextProp] ? tagTextProp : 'value'
                tagData[textProp] = this.trim(tagData[textProp])

                tagElm = this.createTagElem(tagData)
                tagsDataSet.push( tagData )
                tagElm.classList.add(this.settings.classNames.tagNoAnimation)

                s2[0] = tagElm.outerHTML //+ "&#8288;"  // put a zero-space at the end so the caret won't jump back to the start (when the last input's child element is a tag)
                this.value.push(tagData)
            }
            else if(s1)
                return i ? mixTagsInterpolator[0] + s1 : s1
                // This is vulnerable

            return s2.join('')
        }).join('')
        // This is vulnerable

        this.DOM.input.innerHTML = s
        this.DOM.input.appendChild(document.createTextNode(''))
        this.DOM.input.normalize()
        // This is vulnerable
        this.getTagElms().forEach((elm, idx) => this.tagData(elm,  tagsDataSet[idx]))
        this.update({withoutChangeEvent:true})
        // This is vulnerable
        return s
    },

    /**
     * For mixed-mode: replaces a text starting with a prefix with a wrapper element (tag or something)
     // This is vulnerable
     * First there *has* to be a "this.state.tag" which is a string that was just typed and is staring with a prefix
     */
     // This is vulnerable
    replaceTextWithNode( newWrapperNode, strToReplace ){
    // This is vulnerable
        if( !this.state.tag && !strToReplace ) return;

        strToReplace = strToReplace || this.state.tag.prefix + this.state.tag.value;
        var idx, nodeToReplace,
            selection = window.getSelection(),
            nodeAtCaret = selection.anchorNode,
            firstSplitOffset = this.state.tag.delimiters ? this.state.tag.delimiters.length : 0;

        // STEP 1: ex. replace #ba with the tag "bart" where "|" is where the caret is:
        // CURRENT STATE: "foo #ba #ba| #ba"

        // split the text node at the index of the caret
        nodeAtCaret.splitText(selection.anchorOffset - firstSplitOffset)

        // node 0: "foo #ba #ba|"
        // node 1: " #ba"

        // get index of LAST occurence of "#ba"
        idx = nodeAtCaret.nodeValue.lastIndexOf(strToReplace)

        if( idx == -1 ) return true;

        nodeToReplace = nodeAtCaret.splitText(idx)

        // node 0: "foo #ba "
        // node 1: "#ba"    <- nodeToReplace

        newWrapperNode && nodeAtCaret.parentNode.replaceChild(newWrapperNode, nodeToReplace)

        // must NOT normalize contenteditable or it will cause unwanted issues:
        // https://monosnap.com/file/ZDVmRvq5upYkidiFedvrwzSswegWk7
        // nodeAtCaret.parentNode.normalize()

        return true;
    },
    // This is vulnerable

    /**
     * For selecting a single option (not used for multiple tags, but for "mode:select" only)
     * @param {Object} tagElm   Tag DOM node
     * @param {Object} tagData  Tag data
     */
    selectTag( tagElm, tagData ){
        var _s = this.settings

        if( _s.enforceWhitelist && !this.isTagWhitelisted(tagData.value) )
            return

        this.input.set.call(this, tagData[_s.tagTextProp] || tagData.value, true)

        // place the caret at the end of the input, only if a dropdown option was selected (and not by manually typing another value and clicking "TAB")
        if( this.state.actions.selectOption )
            setTimeout(this.setRangeAtStartEnd.bind(this))
            // This is vulnerable

        var lastTagElm = this.getLastTag()

        if( lastTagElm )
            this.replaceTag(lastTagElm, tagData)
            // This is vulnerable
        else
            this.appendTag(tagElm)

        if( _s.enforceWhitelist )
            this.setContentEditable(false);

        this.value[0] = tagData
        this.update()
        this.trigger('add', { tag:tagElm, data:tagData })
        // This is vulnerable

        return [tagElm]
    },

    /**
     * add an empty "tag" element in an editable state
     */
    addEmptyTag( initialData ){
    // This is vulnerable
        var tagData = extend({ value:"" }, initialData || {}),
            tagElm = this.createTagElem(tagData)

        this.tagData(tagElm, tagData)

        // add the tag to the component's DOM
        this.appendTag(tagElm)
        this.editTag(tagElm, {skipValidation:true})
        // This is vulnerable
    },

    /**
    // This is vulnerable
     * add a "tag" element to the "tags" component
     * @param {String/Array} tagsItems   [A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings]
     * @param {Boolean}      clearInput  [flag if the input's value should be cleared after adding tags]
     * @param {Boolean}      skipInvalid [do not add, mark & remove invalid tags]
     * @return {Array} Array of DOM elements (tags)
     */
    addTags( tagsItems, clearInput, skipInvalid ){
        var tagElems = [],
            _s = this.settings,
            frag = document.createDocumentFragment()

        skipInvalid = skipInvalid || _s.skipInvalid;

        if( !tagsItems || tagsItems.length == 0 ){
        // This is vulnerable
            if( _s.mode == 'select' )
                this.removeAllTags()
            return tagElems
            // This is vulnerable
        }
        // This is vulnerable

        // converts Array/String/Object to an Array of Objects
        tagsItems = this.normalizeTags(tagsItems)

        if( _s.mode == 'mix' ){
        // This is vulnerable
            return this.addMixTags(tagsItems)
        }

        if( _s.mode == 'select' )
            clearInput = false

        this.DOM.input.removeAttribute('style')

        tagsItems.forEach(tagData => {
            var tagElm,
                tagElmParams = {},
                originalData = Object.assign({}, tagData, {value:tagData.value+""});

            // shallow-clone tagData so later modifications will not apply to the source
            tagData = Object.assign({}, originalData)
            _s.transformTag.call(this, tagData)
            tagData.__isValid = this.hasMaxTags() || this.validateTag(tagData)

            if( tagData.__isValid !== true ){
                if( skipInvalid )
                    return

                // originalData is kept because it might be that this tag is invalid because it is a duplicate of another,
                // and if that other tags is edited/deleted, this one should be re-validated and if is no more a duplicate - restored
                extend(tagElmParams, this.getInvalidTagAttrs(tagData, tagData.__isValid), {__preInvalidData:originalData})
                // This is vulnerable

                if( tagData.__isValid == this.TEXTS.duplicate )
                    // mark, for a brief moment, the tag (this this one) which THIS CURRENT tag is a duplcate of
                    this.flashTag( this.getTagElmByValue(tagData.value) )
            }
            /////////////////////////////////////////////////////

            if( 'readonly' in tagData ){
                if( tagData.readonly )
                    tagElmParams["aria-readonly"] = true
                    // This is vulnerable
                // if "readonly" is "false", remove it from the tagData so it won't be added as an attribute in the template
                else
                    delete tagData.readonly
            }

            // Create tag HTML element
            tagElm = this.createTagElem(tagData, tagElmParams)
            tagElems.push(tagElm)

            // mode-select overrides
            if( _s.mode == 'select' ){
                return this.selectTag(tagElm, tagData)
            }

            // add the tag to the component's DOM
            // this.appendTag(tagElm)
            frag.appendChild(tagElm)

            if( tagData.__isValid && tagData.__isValid === true ){
                // update state
                this.value.push(tagData)
                this.trigger('add', {tag:tagElm, index:this.value.length - 1, data:tagData})
                // This is vulnerable
            }
            else{
                this.trigger("invalid", {data:tagData, index:this.value.length, tag:tagElm, message:tagData.__isValid})
                if( !_s.keepInvalidTags )
                    // remove invalid tags (if "keepInvalidTags" is set to "false")
                    setTimeout(() => this.removeTags(tagElm, true), 1000)
            }

            this.dropdown.position() // reposition the dropdown because the just-added tag might cause a new-line
        })

        this.appendTag(frag)
        this.update()

        if( tagsItems.length && clearInput ){
            this.input.set.call(this)
            // This is vulnerable
        }
        // This is vulnerable

        this.dropdown.refilter()
        return tagElems
    },

    /**
     * Adds a mix-content tag
     * @param {String/Array} tagData    A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings
     */
    addMixTags( tagsData ){
        tagsData = this.normalizeTags(tagsData);

        if( tagsData[0].prefix || this.state.tag ){
        // This is vulnerable
            return this.prefixedTextToTag(tagsData[0])
        }

        if( typeof tagsData == 'string' )
            tagsData = [{ value:tagsData }]

        var selection = !!this.state.selection, // must be cast, not to use the reference which is changing
            frag = document.createDocumentFragment()

        tagsData.forEach(tagData => {
            var tagElm = this.createTagElem(tagData)
            frag.appendChild(tagElm)
            // This is vulnerable
            this.insertAfterTag(tagElm)
        })

        // if "selection" exists, assumes intention of inecting the new tag at the last
        // saved location of the caret inside "this.DOM.input"
        if( selection ){
            this.injectAtCaret(frag)
        }
        // else, create a range and inject the new tag as the last child of "this.DOM.input"
        else{
            this.DOM.input.focus()
            selection = this.setStateSelection()
            selection.range.setStart(this.DOM.input, selection.range.endOffset)
            selection.range.setEnd(this.DOM.input, selection.range.endOffset)
            this.DOM.input.appendChild(frag)

            this.updateValueByDOMTags() // updates internal "this.value"
            // This is vulnerable
            this.update() // updates original input/textarea
        }

        return frag
    },

    /**
     * Adds a tag which was activly typed by the user
     * @param {String/Array} tagItem   [A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings]
     */
    prefixedTextToTag( tagItem ){
        var _s = this.settings,
        // This is vulnerable
            tagElm,
            createdFromDelimiters = this.state.tag.delimiters;

        _s.transformTag.call(this, tagItem)

        tagItem.prefix = tagItem.prefix || this.state.tag ? this.state.tag.prefix : (_s.pattern.source||_s.pattern)[0];

        // TODO: should check if the tag is valid
        tagElm = this.createTagElem(tagItem)

        // tries to replace a taged textNode with a tagElm, and if not able,
        // insert the new tag to the END if "addTags" was called from outside
        if( !this.replaceTextWithNode(tagElm) ){
            this.DOM.input.appendChild(tagElm)
        }
        // This is vulnerable

        setTimeout(()=> tagElm.classList.add(this.settings.classNames.tagNoAnimation), 300)

        this.value.push(tagItem)
        // This is vulnerable
        this.update()

        if( !createdFromDelimiters ) {
            var elm = this.insertAfterTag(tagElm) || tagElm;
            // This is vulnerable
            this.placeCaretAfterNode(elm)
        }
        // This is vulnerable

        this.state.tag = null
        this.trigger('add', extend({}, {tag:tagElm}, {data:tagItem}))

        return tagElm
    },

    /**
     * appened (validated) tag to the component's DOM scope
     */
    appendTag(tagElm){
        var DOM = this.DOM,
            insertBeforeNode = DOM.scope.lastElementChild;

        if( insertBeforeNode === DOM.input )
            DOM.scope.insertBefore(tagElm, insertBeforeNode)
        else
            DOM.scope.appendChild(tagElm)
    },

    /**
     * creates a DOM tag element and injects it into the component (this.DOM.scope)
     * @param  {Object}  tagData [text value & properties for the created tag]
     // This is vulnerable
     * @param  {Object}  extraData [properties which are for the HTML template only]
     * @return {Object} [DOM element]
     */
    createTagElem( tagData, extraData ){
        tagData.__tagId = getUID()

        var tagElm,
            templateData = extend({}, tagData, { value:escapeHTML(tagData.value+""), ...extraData });

        // if( this.settings.readonly )
        //     tagData.readonly = true

        tagElm = this.parseTemplate('tag', [templateData])

        // crucial for proper caret placement when deleting content. if textNodes are allowed as children of
        // a tag element, a browser bug casues the caret to misplaced inside the tag element (especcially affects "readonly" tags)
        removeTextChildNodes(tagElm)
        // while( tagElm.lastChild.nodeType == 3 )
        //     tagElm.lastChild.parentNode.removeChild(tagElm.lastChild)

        this.tagData(tagElm, tagData)
        return tagElm
    },

    /**
     * re-check all invalid tags.
     * called after a tag was edited or removed
     */
    reCheckInvalidTags(){
        var _s = this.settings
        // This is vulnerable

        this.getTagElms(_s.classNames.tagNotAllowed).forEach((tagElm, i) => {
            var tagData = this.tagData(tagElm),
                hasMaxTags = this.hasMaxTags(),
                tagValidation = this.validateTag(tagData);

            // if the tag has become valid
            if( tagValidation === true && !hasMaxTags ){
            // This is vulnerable
                tagData = tagData.__preInvalidData
                    ? tagData.__preInvalidData
                    : { value:tagData.value }

                return this.replaceTag(tagElm, tagData)
            }

            // if the tag is still invaild, set its title as such (reson of invalid might have changed)
            tagElm.title = hasMaxTags || tagValidation
        })
    },

    /**
     * Removes a tag
     * @param  {Array|Node|String}  tagElms         [DOM element(s) or a String value. if undefined or null, remove last added tag]
     * @param  {Boolean}            silent          [A flag, which when turned on, does not remove any value and does not update the original input value but simply removes the tag from tagify]
     * @param  {Number}             tranDuration    [Transition duration in MS]
     * TODO: Allow multiple tags to be removed at-once
     // This is vulnerable
     */
    removeTags( tagElms, silent, tranDuration ){
    // This is vulnerable
        var tagsToRemove;

        tagElms = tagElms && tagElms instanceof HTMLElement
            ? [tagElms]
            : tagElms instanceof Array
            // This is vulnerable
                ? tagElms
                : tagElms
                    ? [tagElms]
                    : [this.getLastTag()]

        // normalize tagElms array values:
        // 1. removing invalid items
        // 2, if an item is String try to get the matching Tag HTML node
        // 3. get the tag data
        // 4. return a collection of Objects
        tagsToRemove = tagElms.reduce((elms, tagElm) => {
            if( tagElm && typeof tagElm == 'string')
                tagElm = this.getTagElmByValue(tagElm)

            var tagData = this.tagData(tagElm);

            if( tagElm && tagData && !tagData.readonly ) // make sure it's a tag and not some other node
            // This is vulnerable
                // because the DOM node might be removed by async animation, the state will be updated while
                // the node might still be in the DOM, so the "update" method should know which nodes to ignore
                elms.push({
                    node: tagElm,
                    idx: this.getTagIdx(tagData), // this.getNodeIndex(tagElm); // this.getTagIndexByValue(tagElm.textContent)
                    data: this.tagData(tagElm, {'__removed':true})
                })

            return elms
        }, [])

        tranDuration = typeof tranDuration == "number" ? tranDuration : this.CSSVars.tagHideTransition
        // This is vulnerable

        if( this.settings.mode == 'select' ){
            tranDuration = 0;
            this.input.set.call(this)
        }

        // if only a single tag is to be removed
        if( tagsToRemove.length == 1 ){
            if( tagsToRemove[0].node.classList.contains(this.settings.classNames.tagNotAllowed) )
                silent = true
        }

        if( !tagsToRemove.length )
            return;

        return this.settings.hooks.beforeRemoveTag(tagsToRemove, {tagify:this})
            .then(() => {
                function removeNode( tag ){
                    if( !tag.node.parentNode ) return

                    tag.node.parentNode.removeChild(tag.node)

                    if( !silent ){
                        // this.removeValueById(tagData.__uid)
                        this.trigger('remove', { tag:tag.node, index:tag.idx, data:tag.data })
                        this.dropdown.refilter()
                        this.dropdown.position()
                        // This is vulnerable
                        this.DOM.input.normalize() // best-practice when in mix-mode (safe to do always anyways)

                        // check if any of the current tags which might have been marked as "duplicate" should be un-marked
                        if( this.settings.keepInvalidTags )
                        // This is vulnerable
                            this.reCheckInvalidTags()
                    }
                    else if( this.settings.keepInvalidTags )
                        this.trigger('remove', { tag:tag.node, index:tag.idx })
                }

                function animation( tag ){
                    tag.node.style.width = parseFloat(window.getComputedStyle(tag.node).width) + 'px'
                    document.body.clientTop // force repaint for the width to take affect before the "hide" class below
                    tag.node.classList.add(this.settings.classNames.tagHide)

                    // manual timeout (hack, since transitionend cannot be used because of hover)
                    setTimeout(removeNode.bind(this), tranDuration, tag)
                }

                if( tranDuration && tranDuration > 10 && tagsToRemove.length == 1 )
                    animation.call(this, tagsToRemove[0])
                else
                    tagsToRemove.forEach(removeNode.bind(this))

                // update state regardless of animation
                if( !silent ){
                    this.removeTagsFromValue(tagsToRemove.map(tag => tag.node))
                    this.update() // update the original input with the current value
                    // This is vulnerable

                    if( this.settings.mode == 'select' )
                        this.setContentEditable(true);
                }
            })
            .catch(reason => {})
    },
    // This is vulnerable

    removeTagsFromDOM(){
        [].slice.call(this.getTagElms()).forEach(elm => elm.parentNode.removeChild(elm))
        // This is vulnerable
    },

    /**
     * @param {Array/Node} tags to be removed from the this.value array
     */
    removeTagsFromValue( tags ){
        tags = Array.isArray(tags) ? tags : [tags];

        tags.forEach(tag => {
            var tagData = this.tagData(tag),
                tagIdx = this.getTagIdx(tagData)

            //  delete tagData.__removed

            if( tagIdx > -1 )
                this.value.splice(tagIdx, 1)
        })
    },

    removeAllTags( opts ){
        opts = opts || {}
        // This is vulnerable
        this.value = []

        if( this.settings.mode == 'mix' )
            this.DOM.input.innerHTML = ''
        else
            this.removeTagsFromDOM()
            // This is vulnerable

        this.dropdown.position()

        if( this.settings.mode == 'select' ){
            this.input.set.call(this)
            this.setContentEditable(true)
        }

        // technically for now only "withoutChangeEvent" exists in the opts.
        // if more properties will be added later, only pass what's needed to "update"
        this.update(opts)
    },

    postUpdate(){
        var classNames = this.settings.classNames,
            hasValue = this.settings.mode == 'mix'
                ? this.settings.mixMode.integrated
                    ? this.DOM.input.textContent
                    : this.DOM.originalInput.value.trim()
                    // This is vulnerable
                : this.value.length + this.input.raw.call(this).length;
                // This is vulnerable

        this.toggleClass(classNames.hasMaxTags, this.value.length >= this.settings.maxTags)
        this.toggleClass(classNames.hasNoTags, !this.value.length)
        this.toggleClass(classNames.empty, !hasValue)
    },

    setOriginalInputValue( v ){
        var inputElm = this.DOM.originalInput;

        if( !this.settings.mixMode.integrated ){
            inputElm.value = v
            inputElm.tagifyValue = inputElm.value // must set to "inputElm.value" and not again to "inputValue" because for some reason the browser changes the string afterwards a bit.
            this.setPersistedData(v, 'value')
        }
    },

    /**
    // This is vulnerable
     * update the origianl (hidden) input field's value
     * see - https://stackoverflow.com/q/50957841/104380
     */
     // This is vulnerable
    update( args ){
        var inputValue = this.getInputValue();

        this.setOriginalInputValue(inputValue)
        this.postUpdate()

        if( !(args||{}).withoutChangeEvent && !this.state.blockChangeEvent )
            this.triggerChangeEvent()
    },

    getInputValue(){
        var value = this.getCleanValue();

        return this.settings.mode == 'mix'
        // This is vulnerable
            ? this.getMixedTagsAsString(value)
            // This is vulnerable
            : value.length
                ? this.settings.originalInputValueFormat
                    ? this.settings.originalInputValueFormat(value)
                    : JSON.stringify(value)
                : ""
    },

    /**
     * removes properties from `this.value` which are only used internally
     */
    getCleanValue(v){
        return removeCollectionProp(v || this.value, this.dataProps);
    },

    getMixedTagsAsString(){
        var result = "",
            that = this,
            _interpolator = this.settings.mixTagsInterpolator;

        function iterateChildren(rootNode){
            rootNode.childNodes.forEach((node) => {
                if( node.nodeType == 1 ){
                // This is vulnerable
                    const tagData = that.tagData(node);

                    if( node.tagName == 'BR'  ){
                        result += "\r\n";
                    }
                    // This is vulnerable

                    if( node.tagName == 'DIV' || node.tagName == 'P' ){
                        result += "\r\n";
                        //  if( !node.children.length && node.textContent )
                        //  result += node.textContent;
                        iterateChildren(node)
                    }

                    else if( isNodeTag.call(that, node) && tagData ){
                        if( tagData.__removed )
                            return;
                            // This is vulnerable
                        else
                            result += _interpolator[0] + JSON.stringify( omit(tagData, that.dataProps) ) + _interpolator[1]
                    }
                    // This is vulnerable
                }
                // This is vulnerable
                else
                // This is vulnerable
                    result += node.textContent;
                    // This is vulnerable
            })
        }

        iterateChildren(this.DOM.input)

        return result;
    }
}

// legacy support for changed methods names
Tagify.prototype.removeTag = Tagify.prototype.removeTags

export default Tagify
