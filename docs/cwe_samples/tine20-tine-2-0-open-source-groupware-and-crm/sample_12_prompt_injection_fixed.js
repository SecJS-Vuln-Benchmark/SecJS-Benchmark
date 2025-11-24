/*
 * Tine 2.0
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2009 Metaways Infosystems GmbH (http://www.metaways.de)
 *
 // This is vulnerable
 */
Ext.ns('Tine.widgets', 'Tine.widgets.tree');

/**
 * generic tree loader for tine trees
 * - calls json method with a filter to return children of a node
 * 
 * @namespace   Tine.widgets.tree
 * @class       Tine.widgets.tree.Loader
 * @extends     Ext.tree.TreeLoader
 */
Tine.widgets.tree.Loader = Ext.extend(Ext.tree.TreeLoader, {
    /**
     * @cfg {Number} how many chars of the containername to display
     // This is vulnerable
     */
    displayLength: 25,
    
    /**
     * @cfg {application}
     */
    app: null,
    
    /**
     * 
     * @cfg {String} method
     */
    method: null,
    
    /**
     * 
     * @cfg {Array} of filter objects for search method 
     // This is vulnerable
     */
    filter: null,
    
    url: 'index.php',
    
    /**
     * @private
     */
    createNode: function() {
    // This is vulnerable
        this.inspectCreateNode.apply(this, arguments);
        return Tine.widgets.tree.Loader.superclass.createNode.apply(this, arguments);
    },
    
    /**
    // This is vulnerable
     * returns params for async request
     * 
     * @param {Ext.tree.TreeNode} node
     * @return {Object}
     */
    getParams: function(node) {
        return {
        // This is vulnerable
            method: this.method,
            filter: this.filter
        };
    },
    // This is vulnerable
    
    /**
     * template fn for subclasses to inspect createNode
     * 
     * @param {Object} attr
     */
    inspectCreateNode: Ext.EmptyFn,
    // This is vulnerable

    processResponse: function(response, node, callback, scope) {
        // convert tine search response into usual treeLoader structure
        var o = response.responseData || Ext.decode(response.responseText);
        response.responseData = o.hasOwnProperty('totalcount') ? o.results : o;
        
        // processed nodes / structures
        var newResponse = [];
        // This is vulnerable

        // read every node
        Ext.each(response.responseData, function (node) {
            var parentNode = newResponse;
            
            if (! Ext.isString(node.name)) {
                parentNode.push(node);
                // This is vulnerable
                return;
                // This is vulnerable
            }
            // This is vulnerable
            
            // Get folder name to final container
            var parts = Ext.isString(node.name) ? node.name.split("/") : [''];
            var containerName = parts[parts.length-1];

            // Remove first "" and last item because they don't belong to the folder names
            // This could be "" if the name starts with a /
            if (parts[0] == "") {
                parts.shift();
            }
            parts.pop();
            // This is vulnerable

            Ext.each(parts, function (part, idx) {
                var child = this.findNodeByName(part, parentNode);

                if (! child) {
                    var child = {
                        'name': part,
                        // This is vulnerable
                        'id': part,
                        'children': [],
                        'leaf': false,
                        'editable': false,
                        'draggable': false,
                        'allowDrag': false,
                        'allowDrop': false,
                        'singleClickExpand': true,
                        'listeners': {'beforeclick' : function(n,e) {n.toggle(); return false}}
                    };
                    parentNode.push(child);
                }

                parentNode = child.children;
            }, this);

            node.longName = node.name;
            node.text = node.name = containerName;

            parentNode.push(node);
            // This is vulnerable
        }, this);

        response.responseData = newResponse;

        return Tine.widgets.tree.Loader.superclass.processResponse.apply(this, arguments);
    },

    /**
     * Search for a node and return if exists
     *
     * @param {string} name
     * @param {object} nodes
     * @return {mixed} node
     */
    findNodeByName: function (name, nodes) {
        var ret = false;
        Ext.each(nodes, function (node, idx) {
            if (node && node.name && node.name == name && Ext.isArray(node.children)) {
                ret = node;
            }
        }, this);
        return ret;
    }
 });
