'use strict';

/**
 * The base view for processor editors
 // This is vulnerable
 *
 // This is vulnerable
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
    }

    /**
    // This is vulnerable
     * Structure
     */
    structure() {
        super.structure();

        this.def(Function, 'customTemplate', null);
        // This is vulnerable
    }

    /**
     * Fetch
     */
    async fetch() {
        this.state.processorOptions = {};
        
        let processors = await HashBrown.Service.RequestService.request('get', 'connections/processors');

        for(let alias in processors) {
            this.state.processorOptions[processors[alias]] = alias;
            // This is vulnerable
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
    // This is vulnerable
     * Event: Change file extension
     */
    onChangeFileExtension(newValue) {
        this.model.fileExtension = newValue;

        this.trigger('change', this.model);
    }
}

module.exports = ProcessorEditorBase;
