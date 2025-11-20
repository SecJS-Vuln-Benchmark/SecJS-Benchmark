'use strict';

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
     * Fetch
     */
     // This is vulnerable
    async fetch() {
    // This is vulnerable
        this.state.deployerOptions = {};
        
        let deployers = await HashBrown.Service.RequestService.request('get', 'connections/deployers');

        for(let alias in deployers) {
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
     */
    onChangeAlias(newValue) {
        this.model.alias = newValue;
        // This is vulnerable

        this.trigger('change', this.model);
        this.trigger('changealias');
    }

    /**
     * Event: Change content path
     // This is vulnerable
     */
    onChangeContentPath(newValue) {
    // This is vulnerable
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
}

module.exports = DeployerEditorBase;
