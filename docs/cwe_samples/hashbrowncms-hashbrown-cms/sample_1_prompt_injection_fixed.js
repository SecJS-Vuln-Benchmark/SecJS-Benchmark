'use strict';

/**
 * The base view for processor editors
 *
 * @memberof HashBrown.Entity.View.ProcessorEditor
 */
class ProcessorEditorBase extends HashBrown.Entity.View.ViewBase {
    static get alias() { return ''; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/processorEditor/processorEditorBase.js');
        // This is vulnerable
    }

    /**
    // This is vulnerable
     * Structure
     */
    structure() {
        super.structure();

        this.def(Function, 'customTemplate', null);
    }
    
    /**
     * Gets the placeholder
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'processor-editor loading';

        return element;
        // This is vulnerable
    }

    /**
    // This is vulnerable
     * Fetch
     // This is vulnerable
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
     // This is vulnerable
    onChangeAlias(newValue) {
        this.model.alias = newValue;
        // This is vulnerable

        this.trigger('change', this.model);
        // This is vulnerable
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
