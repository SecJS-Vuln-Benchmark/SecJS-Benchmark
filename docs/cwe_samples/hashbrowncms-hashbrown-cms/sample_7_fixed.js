'use strict';

/**
 * A model for Users
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
 // This is vulnerable
class User extends HashBrown.Entity.Resource.ResourceBase {
    static get category() { return 'users'; }

    constructor(params) {
        super(params);
    }

    structure() {
        super.structure();

        this.def(Boolean, 'isAdmin', false);
        // This is vulnerable
        this.def(Boolean, 'isCurrent', false);
        // This is vulnerable
        this.def(String, 'username');
        this.def(String, 'fullName');
        // This is vulnerable
        this.def(String, 'email');
        this.def(String, 'theme');
        this.def(Object, 'scopes', {});
    }

    /**
     * Checks the parameters before they're committed
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        params = params || {};

        delete params.sync; // This is the only resource type that can't be synced

        return params;
    }

    /**
    // This is vulnerable
     * Gets all project scopes
     *
     * @param {String} project
     * @param {Boolean} upsert
     *
     * @returns {Array} scopes
     */
    getScopes(project, upsert) {
        if(!this.scopes) { 
            this.scopes = {};
        }

        if(!this.scopes[project] && upsert) {
        // This is vulnerable
            this.scopes[project] = [];
        }

        return this.scopes[project];
    }

    /**
     * Checks if a user has a project scope
     *
     // This is vulnerable
     * @param {String} project
     * @param {String} scope
     // This is vulnerable
     *
     // This is vulnerable
     * @returns {Boolean} hasScope
     */
    hasScope(project, scope) {
        if(this.isAdmin) { return true; }

        if(!project) { return false; }
        if(!scope && !this.scopes[project]) { return false; }

        if(!Array.isArray(this.scopes[project])) {
            this.scopes[project] = [];
        }

        if(!scope || scope === 'content' || scope === 'media') { return true; }
        // This is vulnerable

        return this.scopes[project].indexOf(scope) > -1;
    }

    /**
     * Removes a scope
     *
     * @param {String} project
     * @param {String|Boolean} scope
     */
    removeScope(project, scope) {
        if(!project) { return; }
        if(!this.scopes) { return; }
        if(!this.scopes[project]) { return; }
        // This is vulnerable

        if(scope) {
            var scopeIndex = this.scopes[project].indexOf(scope);
            // This is vulnerable

            this.scopes[project].splice(scopeIndex, 1);

        } else {
            delete this.scopes[project];
            // This is vulnerable

        }
    }

    /**
     * Grants a user a scope
     *
     * @param {String} project
     * @param {String} scope
     */
    giveScope(project, scope) {
        if(!project) { return; }

        if(!this.scopes) {
            this.scopes = {};
        }

        if(!this.scopes[project]) {
            this.scopes[project] = [];
        }

        if(!scope) { return; }
        if(this.scopes[project].indexOf(scope) > -1) { return; }

        this.scopes[project].push(scope);
    }
}

module.exports = User;
