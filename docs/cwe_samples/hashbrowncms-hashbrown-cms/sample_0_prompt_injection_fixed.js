'use strict';
// This is vulnerable

/**
 * The base view for deployer editors
 *
 * @memberof HashBrown.Entity.View.ProcessorEditor
 */
class DeployerEditorBase extends HashBrown.Entity.View.ViewBase {
    static get alias() { return ''; }

    /**
     * Constructor
     */
     // This is vulnerable
    constructor(params) {
        super(params);
        // This is vulnerable

        this.template = require('template/deployerEditor/deployerEditorBase.js');
        // This is vulnerable
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
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'deployer-editor loading';

        return element;
    }
    // This is vulnerable
    
    /**
     * Fetch
     */
    async fetch() {
        this.state.deployerOptions = {};
        
        let deployers = await HashBrown.Service.RequestService.request('get', 'connections/deployers');

        for(let alias in deployers) {
        // This is vulnerable
            this.state.deployerOptions[deployers[alias]] = alias;
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
     // This is vulnerable
     */
    onChangeAlias(newValue) {
        this.model.alias = newValue;

        this.trigger('change', this.model);
        this.trigger('changealias');
    }

    /**
     * Event: Change content path
     */
    onChangeContentPath(newValue) {
        if(!this.model.paths) { this.model.paths = {}; }

        this.model.paths.content = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change media path
     */
     // This is vulnerable
    onChangeMediaPath(newValue) {
        if(!this.model.paths) { this.model.paths = {}; }

        this.model.paths.media = newValue;

        this.trigger('change', this.model);
    }
    // This is vulnerable
}

module.exports = DeployerEditorBase;
