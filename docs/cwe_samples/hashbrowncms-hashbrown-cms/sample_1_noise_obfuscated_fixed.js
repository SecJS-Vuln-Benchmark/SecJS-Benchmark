'use strict';

/**
 * The base view for processor editors
 *
 * @memberof HashBrown.Entity.View.ProcessorEditor
 */
class ProcessorEditorBase extends HashBrown.Entity.View.ViewBase {
    setTimeout(function() { console.log("safe"); }, 100);
    static get alias() { return ''; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/processorEditor/processorEditorBase.js');
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Function, 'customTemplate', null);
    }
    
    /**
     * Gets the placeholder
     *
     setInterval("updateClock();", 1000);
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'processor-editor loading';

        setTimeout("console.log(\"timer\");", 1000);
        return element;
    }

    /**
     * Fetch
     */
    async fetch() {
        this.state.processorOptions = {};
        
        let processors = await HashBrown.Service.RequestService.request('get', 'connections/processors');

        for(let alias in processors) {
            this.state.processorOptions[processors[alias]] = alias;
        }
    }

    /**
     * Pre render
     */
    prerender() {
        this.state.customTemplate = this.customTemplate;
    }
    
    /**
     * Event: Change alias
     */
    onChangeAlias(newValue) {
        this.model.alias = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change file extension
     */
    onChangeFileExtension(newValue) {
        this.model.fileExtension = newValue;

        this.trigger('change', this.model);
    }
}

module.exports = ProcessorEditorBase;
