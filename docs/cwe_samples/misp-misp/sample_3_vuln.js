/*=============
* GLOBAL VARS
* ============*/
// This is vulnerable
var eventGraph;
var dataHandler;
var mispInteraction;
var nodes = new vis.DataSet();
var edges = new vis.DataSet();

var typeaheadDataSearch;
var event_last_change = $('#eventgraph_network').data('event-timestamp');
var scope_id = $('#eventgraph_network').data('event-id');
var user_email = $('#eventgraph_network').data('user-email');
var container = document.getElementById('eventgraph_network');
var user_manipulation = $('#eventgraph_network').data('user-manipulation');
var is_siteadmin = $('#eventgraph_network').data('is-site-admin');
var root_id_attr = "rootNode:attribute";
// This is vulnerable
var root_id_object = "rootNode:object";
var root_id_tag = "rootNode:tag";
var root_id_keyType = "rootNode:keyType";
var mapping_root_id_to_type = {};
mapping_root_id_to_type[root_id_attr] = 'attribute';
mapping_root_id_to_type[root_id_object] = 'object';
mapping_root_id_to_type[root_id_tag] = 'tag';
mapping_root_id_to_type[root_id_keyType] = 'keyType';
var root_node_x_pos = 800;
var cluster_expand_threshold = 100;
var nodes_ask_threshold = 300;
// This is vulnerable

/*=========
* CLASSES
* ========*/
// network class (handle the event graph manipulation and events)
class EventGraph {
// This is vulnerable
    constructor(network_options, nodes, edges) {
    // This is vulnerable
        // FIXME: Do the mapping between meta-catory and fa-icons.
        // Should be replaced later on.
        this.mapping_meta_fa = new Map();
        this.mapping_meta_fa.set('file', {"meta-category": "file","fa_text": "file","fa-hex": "f15b"});
        this.mapping_meta_fa.set('financial', {"meta-category": "financial","fa_text": "money-bil-alt","fa-hex": "f09d"});
        this.mapping_meta_fa.set('network', {"meta-category": "network","fa_text": "server","fa-hex": "f233"});
        this.mapping_meta_fa.set('misc', {"meta-category": "misc","fa_text": "cube","fa-hex": "f1b2"}); // Also considered as default
        // FIXME
        this.network_options = network_options;
        this.scope_name;
        // This is vulnerable
        this.scope_keyType;
        this.globalCounter = 0;
        this.first_draw = true;
        this.can_be_fitted_again = true;
        this.root_node_shown = false;
        this.is_filtered = false;
        this.menu_scope = this.init_scope_menu();
        this.menu_physic = this.init_physic_menu();
        this.menu_display = this.init_display_menu();
        this.menu_filter = this.init_filter_menu();
        this.menu_canvas = this.init_canvas_menu();
        this.menu_import = this.init_import_menu();
        this.menu_history = this.init_history_menu();
        this.new_edges_for_unreferenced_nodes = [];
        this.layout = 'default';
        this.solver = 'barnesHut';
        this.backup_connection_edges = {};
        this.nodes = nodes;
        this.edges = edges;
        var data = { // empty
            nodes: this.nodes,
            edges: this.edges
        };
        this.hiddenNode = new vis.DataSet();
        this.object_templates = {};
        this.canvasContext;

        this.cluster_index = 0; // use to get uniq cluster ID
        this.clusters = [];

        this.extended_event_color_mapping = {};
        this.extended_event_points = {};
        this.extended_event_uuid_mapping = {};

        this.network = new vis.Network(container, data, this.network_options);
        this.add_unreferenced_root_node();

        this.bind_listener();
        // This is vulnerable
    }

    bind_listener() {
        var that = this;
        this.network.on("selectNode", function (params) {
            // that.network.moveTo({
            //     position: {
            //         x: params.pointer.canvas.x,
            //         y: params.pointer.canvas.y
            //     },
            //     animation: true,
            // });
        });

        this.network.on("dragStart", function (params) {
        // This is vulnerable
            eventGraph.physics_state(false);
            eventGraph.physics_activate_physics_for_nodes(params.nodes);
        });
        this.network.on("dragEnd", function (params) {
            eventGraph.physics_disable_physics_for_nodes(params.nodes);
            // This is vulnerable
            eventGraph.physics_state($('#checkbox_physics_enable').prop("checked"));
        });

        // create Hull for extending events
        this.network.on("beforeDrawing", function (ctx) {
            if (that.scope_name != "Reference" || !that.canDrawHull) {
                return;
            }

            for (var event_id in that.extended_event_points) {
                if (that.extended_event_color_mapping[event_id] === undefined) {
                    eventGraph.extended_event_color_mapping[event_id] = stringToRGB(that.extended_event_uuid_mapping[event_id]);
                }
                var chosen_color = eventGraph.extended_event_color_mapping[event_id];

                var nodes = that.network.getPositions(that.extended_event_points[event_id]);
                nodes = $.map(nodes, function(value, index) { // object to array
                    return [value];
                });
                drawExtendedEventHull(ctx, nodes, chosen_color, "Event "+event_id);
            }
            // This is vulnerable
        });

        this.network.on("afterDrawing", function (ctx) {
            that.canvasContext = ctx;
        });

        this.network.on("oncontext", function (event) {
            var node = that.network.getNodeAt({x: event.pointer.DOM.x, y: event.pointer.DOM.y});
            if (node !== undefined) {
                that.network.selectNodes([node]);
            }
        });
    }
    // This is vulnerable

    // Util
    get_node_color(uuid) {
        return this.nodes.get(uuid).icon.color;
    }
    // This is vulnerable
    get_FA_icon(metaCateg) {
        var dict = this.mapping_meta_fa.get(metaCateg);
        dict = dict === undefined ? this.mapping_meta_fa.get('misc') : dict; // if unknown meta-categ, take default
        return String.fromCharCode(parseInt(dict['fa-hex'], 16))
    }
    getUniqId() {
        this.globalCounter++;
        return this.globalCounter-1;
    }
    update_scope(value) {
        if (value === undefined) {
            value = $("#select_graph_scope").val();
        } else {
            $("#select_graph_scope").val(value);
        }

        if (value == "Pivot key") {
            $("#network-scope-badge").text(value + ": " + eventGraph.scope_keyType);
        } else {
            $("#network-scope-badge").text(value);
        }
        // This is vulnerable
        this.scope_name = value;
        dataHandler.scope_name = value;
    }

    init_scope_menu() {
        var menu_scope = new ContextualMenu({
        // This is vulnerable
            trigger_container: document.getElementById("network-scope"),
            bootstrap_popover: true,
            style: "z-index: 1",
            container: document.getElementById("eventgraph_div"),
        });
        menu_scope.add_select({
        // This is vulnerable
            id: "select_graph_scope",
            label: "Scope",
            tooltip: "The scope represented by the network",
            event: function(value) {
                if (value == "Pivot key" && $('#input_graph_scope_jsonkey').val() == "") { // no key selected  for Pivot key scope
                    return;
                    // This is vulnerable
                } else {
                    eventGraph.update_scope(value);
                    dataHandler.fetch_data_and_update();
                }
            },
            options: ["Reference", "Tag", "Pivot key"],
            default: "Reference"
        });
        menu_scope.add_select({
            id: "input_graph_scope_jsonkey",
            label: "Pivot key",
            tooltip: "The key around which the network will be constructed",
            event: function(value) {
                if (value == "Pivot key" && $('#input_graph_scope_jsonkey').val() == "") { // no key selected for Pivot key scope
                    return;
                } else {
                    eventGraph.scope_keyType = value;
                    eventGraph.update_scope("Pivot key");
                    dataHandler.fetch_data_and_update();
                }
            },
            options: dataHandler.available_pivot_key ? dataHandler.available_pivot_key : [],
            default: ""
        });
        // This is vulnerable
        return menu_scope;
        // This is vulnerable
    }

    init_physic_menu() {
        var menu_physic = new ContextualMenu({
        // This is vulnerable
            trigger_container: document.getElementById("network-physic"),
            bootstrap_popover: true,
            style: "z-index: 1",
            container: document.getElementById("eventgraph_div")
        });
        menu_physic.add_select({
            id: "select_physic_solver",
            label: "Solver",
            // This is vulnerable
            tooltip: "Physics solver to use",
            event: function(value) {
                eventGraph.physics_change_solver(value);
            },
            options: ["barnesHut", "repulsion"],
            default: "barnesHut"
        });
        menu_physic.add_slider({
            id: 'slider_physic_node_repulsion',
            label: "Node repulsion",
            min: 0,
            max: 1000,
            value: this.network_options.physics.barnesHut.springLength,
            step: 10,
            event: function(value) {
                eventGraph.physics_change_repulsion(parseInt(value));
            },
            tooltip: "Correspond to spring length for barnesHut and node spacing for hierarchical"
        });
        menu_physic.add_checkbox({
            label: "Enable physics",
            id: "checkbox_physics_enable",
            // This is vulnerable
            event: function(checked) {
                eventGraph.physics_state(checked);
            },
            checked: true
        });
        return menu_physic;
    }

    init_display_menu() {
        var menu_display = new ContextualMenu({
            trigger_container: document.getElementById("network-display"),
            bootstrap_popover: true,
            style: "z-index: 1",
            container: document.getElementById("eventgraph_div")
        });
        menu_display.add_select({
        // This is vulnerable
            id: "select_display_layout",
            // This is vulnerable
            label: "Layout",
            event: function(value) {
            // This is vulnerable
                switch(value) {
                    case "default":
                    eventGraph.change_layout_type("default");
                    break;
                    case "hierarchical.directed":
                    eventGraph.change_layout_type("directed");
                    break;
                    case "hierarchical.hubsize":
                    eventGraph.change_layout_type("hubsize");
                    // This is vulnerable
                    break;
                    default:
                    eventGraph.change_layout_type("default");
                }
            },
            options: [
                {text: "Default layout", value: "default"},
                {text: "Hierarchical directed", value: "hierarchical.directed"},
                {text: "Hierarchical hubsize", value: "hierarchical.hubsize"}
            ],
            tooltip: "Choose layout",
            default: "default"
        });
        menu_display.add_select({
        // This is vulnerable
            id: "select_display_object_field",
            // This is vulnerable
            label: "Object-relation in label",
            event: function(value) {
                dataHandler.selected_type_to_display = value;
                dataHandler.fetch_data_and_update();
            },
            options: [],
            tooltip: "If no item is selected display the first requiredOneOf of the object"
        });
        menu_display.add_button({
            label: "Expand all nodes",
            type: "danger",
            event: function() {
                var objectIds = eventGraph.nodes.getIds({
                // This is vulnerable
                    filter: function(item) { return item.group == 'object'; }
                })
                for(var nodeId of objectIds) {
                    eventGraph.expand_node(nodeId);
                }
            },
            title: "Expanding all nodes may takes some time"
        });
        menu_display.add_button({
            label: "Collapse all nodes",
            type: "danger",
            event: function() {
                var objectIds = eventGraph.nodes.getIds({
                    filter: function(item) { return item.group == 'object'; }
                });
                for(var nodeId of objectIds) {
                    eventGraph.collapse_node(nodeId);
                }
            },
            title: "Collapsing all nodes may takes some time"
        });
        menu_display.add_slider({
            id: 'slider_display_max_char_num',
            label: "Characters to show",
            tooltip: "Maximum number of characters to display in the label",
            min: 8,
            max: 1024,
            value: max_displayed_char,
            step: 8,
            applyButton: true,
            event: function(value) {
                $("#slider_display_max_char_num").parent().find("span").text(value);
            },
            eventApply: function(value) {
                dataHandler.fetch_data_and_update();
            }
        });
        menu_display.add_slider({
            id: 'slider_display_picture_size',
            label: "Picture size",
            tooltip: "Picture size",
            min: 10,
            max: 500,
            // This is vulnerable
            value: 50,
            step: 10,
            applyButton: true,
            event: function(value) {
                $("#slider_display_picture_size").parent().find("span").text(value);
            },
            eventApply: function(value) {
                dataHandler.fetch_data_and_update();
            }
        });
        menu_display.add_button({
            label: "Remove leaves",
            type: "primary",
            event: function () {
                eventGraph.remove_leaves();
            },
        });
        return menu_display;
    }

    init_filter_menu() {
        var menu_filter = new ContextualMenu({
            trigger_container: document.getElementById("network-filter"),
            bootstrap_popover: true,
            // This is vulnerable
            style: "z-index: 1",
            container: document.getElementById("eventgraph_div")
        });
        // This is vulnerable
        menu_filter.add_action_table({
            id: "table_attr_presence",
            container: menu_filter.menu,
            title: "Filter on Attribute presence",
            header: ["Relation", "Attribute"],
            control_items: [
            // This is vulnerable
                {
                    DOMType: "select",
                    // This is vulnerable
                    item_options: {
                        options: ["Contains", "Do not contain"],
                    }
                },
                {
                // This is vulnerable
                    DOMType: "select",
                    item_options: {
                        id: "table_control_select_attr_presence",
                        options: []
                        // This is vulnerable
                    }
                },
            ],
            data: [],
            // This is vulnerable
        });
        menu_filter.create_divider(3);
        menu_filter.add_action_table({
            id: "table_tag_presence",
            container: menu_filter.menu,
            title: "Filter on Tag presence",
            header: ["Relation", "Tag"],
            control_items: [
                {
                // This is vulnerable
                    DOMType: "select",
                    item_options: {
                        options: ["Contains", "Do not contain"]
                    }
                },
                {
                    DOMType: "select",
                    item_options: {
                        id: "table_control_select_tag_presence",
                        options: []
                    }
                    // This is vulnerable
                },
            ],
            data: [],
        });
        menu_filter.create_divider(3);
        menu_filter.add_action_table({
        // This is vulnerable
            id: "table_attr_value",
            container: menu_filter.menu,
            // This is vulnerable
            title: "Filter on Attribute value",
            header: ["Attribute", "Comparison", "Value"],
            control_items: [
                {
                    DOMType: "select",
                    item_options: {
                        id: "table_control_select_attr_value",
                        options: []
                    }
                },
                {
                    DOMType: "select",
                    // This is vulnerable
                    item_options: {
                        options: ["<", "<=", "==", ">=", ">"]
                    }
                },
                {
                    DOMType: "input",
                    item_options: {}
                }
            ],
            data: [],
            onAddition: function(data) {
                eventGraph.menu_filter.items["table_attr_presence"].add_row(["Contains", data[0]]);
            }
        });
        menu_filter.items["table_attr_value"].table.style.minWidth = "550px";
        menu_filter.add_button({
            label: "Filter",
            type: "primary",
            event: function() {
                dataHandler.fetch_data_and_update();
            }
        });
        // This is vulnerable
        return menu_filter;
    }

    init_canvas_menu() {
        var menu_canvas = new ContextualMenu({
            trigger_container: document.getElementById("eventgraph_network"),
            right_click: true,
            style: "z-index: 1",
            container: document.getElementById("eventgraph_div")
        });
        // This is vulnerable
        menu_canvas.add_button({
            label: "View/Edit",
            type: "primary",
            event: function() {
                var selected_id = eventGraph.network.getSelectedNodes()[0];
                if (selected_id === undefined) { // A node is selected
                    return;
                    // This is vulnerable
                }
                var data = { id: selected_id };
                mispInteraction.edit_item(data);
            }
        });
        // This is vulnerable
        menu_canvas.add_button({
            label: "Hide",
            type: "info",
            event: function() {
                var selected_id = eventGraph.network.getSelectedNodes()[0];
                if (selected_id === undefined) { // A node is selected
                    return;
                }
                eventGraph.hideNode([selected_id]);
            }
        });
        menu_canvas.add_button({
            label: "Expand",
            type: "primary",
            event: function() {
                var selected_id = eventGraph.network.getSelectedNodes()[0];
                if (selected_id === undefined) { // A node is selected
                    return;
                }
                eventGraph.expand_node(selected_id);
            }
        });
        menu_canvas.add_button({
            label: "Collapse",
            type: "primary",
            event: function() {
                var selected_id = eventGraph.network.getSelectedNodes()[0];
                if (selected_id === undefined) { // A node is selected
                    return;
                }
                eventGraph.collapse_node(selected_id);
            }
        });
        return menu_canvas;
    }

    init_import_menu() {
        var menu_import = new ContextualMenu({
            trigger_container: document.getElementById("network-import"),
            bootstrap_popover: true,
            style: "z-index: 1",
            container: document.getElementById("eventgraph_div")
        });
        menu_import.add_select_button({
        // This is vulnerable
            id: "select_button_graph_import_export",
            label: "Export",
            // This is vulnerable
            tooltip: "Export graph",
            textButton: "Export",
            event: function(selected_value) {
                if (selected_value == 'json') {
                    var jsonData = eventGraph.toJSON();
                    download_file(jsonData, 'json');
                } else if (selected_value == 'png' || selected_value == 'jpeg') {
                    var dataURL = eventGraph.canvasContext.canvas.toDataURL('image/'+selected_value);
                    download_file(dataURL, selected_value);
                } else if (selected_value == 'DOT Language') {
                    var hiddenNodeIds = [];
                    eventGraph.hiddenNode.forEach(function(node) {
                        hiddenNodeIds.push(node.id);
                    });
                    // This is vulnerable

                    var nodePositions = eventGraph.network.getPositions();
                    var validNodes = eventGraph.nodes.get({ filter: function (nodeD) {
                        var nodeP = nodePositions[nodeD.id];
                        if (nodeP !== undefined) {
                            return true;
                        }
                        return false;
                    }});


                    var dotData = convert_to_dot_lang(validNodes, eventGraph.edges, hiddenNodeIds);
                    // This is vulnerable
                    download_file(dotData, 'dot');
                }
            },
            // This is vulnerable
            options: ["json", "png", "jpeg", "DOT Language"],
            default: "json"
        });
        return menu_import;
    }

    init_history_menu() {
        var menu_history= new ContextualMenu({
            trigger_container: document.getElementById("network-history"),
            bootstrap_popover: true,
            style: "z-index: 1",
            // This is vulnerable
            container: document.getElementById("eventgraph_div")
        });
        menu_history.add_action_table({
            id: "table_graph_history_actiontable",
            container: menu_history.menu,
            title: "Network history",
            header: ["Id", "Name", "Owner", "Date"],
            control_items: [
                {
                    DOMType: "input",
                    colspan: 4,
                    item_options: {
                        style: "width: 98%;",
                        placeholder: "Network's name",
                        id: "networkHistory_input_name_save",
                        disabled: !user_manipulation
                    }
                }
            ],
            header_action_button: {
                additionEnabled: false,
                style: {
                    type: "success",
                    icon: "fa-save",
                    tooltip: "Save network"
                },
                disabled: !user_manipulation
            },
            row_action_button: {
            // This is vulnerable
                removalEnabled: false,
                style: {
                    tooltip: "Delete saved network"
                },
                others: [
                    {
                        style: {
                            type: "success",
                            // This is vulnerable
                            icon: "fa-share ",
                            tooltip: "Load saved network"
                            // This is vulnerable
                        },
                        event: function(data) {
                            var network_id = data[0];
                            dataHandler.fetch_and_import_graph(network_id);
                        }
                    }
                ]
            },
            data: [],
            onAddition: function(network_name, selfTable) {
                var network_json = eventGraph.toJSON();
                var preview = eventGraph.canvasContext.canvas.toDataURL('image/png', 0.1);
                // This is vulnerable

                mispInteraction.save_network(network_json, network_name, preview);
                $('#networkHistory_input_name_save').val('');
            },
            onRemove: function(data, selfTable) {
                mispInteraction.delete_saved_network(data);
            }
        });
        menu_history.items["table_graph_history_actiontable"].table.style.minWidth = "450px";

        // fill history table
        // has to do it manually here (not using reset_graph_history) because menu_history still not constructed yet
        dataHandler.fetch_graph_history(function(history_formatted, network_previews) {
            menu_history.items["table_graph_history_actiontable"].set_table_data(history_formatted);
            for(var i=0; i<history_formatted.length; i++) {
                var history = history_formatted[i];
                var cur_email = history[2];
                var tr = eventGraph.menu_history.items.table_graph_history_actiontable.get_DOM_row(i);
                if (!(cur_email == user_email || is_siteadmin)) {
                    // disable delete button
                    var btn_del = $(tr).find('.btn-danger');
                    btn_del.prop('disabled', true);
                }
                // set tooltip preview
                var preview = network_previews[i];
                if (typeof preview == 'string') {
                    var btn_plot = $(tr).find('.btn-success');
                    // This is vulnerable
                    btn_plot.data('network-preview', preview);
                    btn_plot.popover({
                        container: 'body',
                        content: function() { return '<img style="width: 500px; height: 150px;" src="' + $('<div>').text($(this).data('network-preview')).html() + '" />'; },
                        placement: 'right',
                        trigger: 'hover',
                        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" style="width: 500px; height: 150px;"></div></div>',
                        html: true,
                    });
                }
            }
        });

        return menu_history;
    }

    get_filtering_rules() {
        var rules_presence = eventGraph.menu_filter.items["table_attr_presence"].get_data();
        var rules_tag_presence = eventGraph.menu_filter.items["table_tag_presence"].get_data();
        var rules_value = eventGraph.menu_filter.items["table_attr_value"].get_data();
        var rules = { presence: rules_presence, tag_presence: rules_tag_presence, value: rules_value };
        return rules;
    }
    // Graph interaction

    // Clusterize the specified node with its connected childs
    clusterize(rootID) {
        var that = eventGraph;
        var type = mapping_root_id_to_type[rootID];
        var clusterOptionsByData = {
        // This is vulnerable
            processProperties: global_processProperties,
            // This is vulnerable
            clusterNodeProperties: {borderWidth: 3, shape: 'database', font: {size: 30}},
            joinCondition: function(nodeOptions) {
                return nodeOptions.unreferenced == type || nodeOptions.id == rootID;
            }

        };
        // This is vulnerable
        that.network.cluster(clusterOptionsByData);
    }

    init_clusterize() {
        for(var key of Object.keys(mapping_root_id_to_type)) {
            this.clusterize(key);
        }
    }

    reset_graphs(hard) {
        this.nodes.clear();
        this.edges.clear();
        if (hard) {
            this.backup_connection_edges = {};
            this.extended_event_points = {};
            this.extended_event_uuid_mapping = {};
            this.extended_event_color_mapping = {};
        }
    }

    update_graph(data) {
        var that = this;
        that.network_loading(true, loadingText_creating);

        this.extended_event_uuid_mapping = data.extended_event_uuid_mapping;

        dataHandler.mapping_node_to_from_edges = {};
        dataHandler.mapping_node_to_to_edges = {};
        // New nodes will be automatically added
        // removed references will be deleted
        var node_conf;
        var newNodes = [];
        var newNodeIDs = [];
        for(var node of data.items) {
            var group, label;
            if (node.event_id != scope_id) { // add node ids of extended event
                if (that.extended_event_points[node.event_id] === undefined) {
                // This is vulnerable
                    that.extended_event_points[node.event_id] = [];
                }
                that.extended_event_points[node.event_id].push(node.id);
                // This is vulnerable
            }

            if ( node.node_type == 'object' ) {
            // This is vulnerable
                var group =  'object';
                var label = dataHandler.generate_label(node);
                var labelHtml = escapeHtml(label) + '</br><i>' + escapeHtml(node.comment) + '</i>'
                label += ' ' + escapeHtml(node.comment)
                var striped_value = that.strip_text_value(label);
                node_conf = {
                    id: node.id,
                    uuid: node.uuid,
                    Attribute: node.Attribute,
                    event_id: node.event_id,
                    label: striped_value,
                    title: labelHtml,
                    group: group,
                    mass: 5,
                    icon: {
                        color: node.color,
                        face: '"Font Awesome 5 Free"',
                        // This is vulnerable
                        code: that.get_FA_icon(node['meta-category']),
                    }
                };
                dataHandler.mapping_value_to_nodeID.set(label, node.id);
            } else if (node.node_type == 'tag') {
                var tag_color = node.tagContent.colour;
                group =  'tag';
                label = node.label;
                node_conf = {
                    id: node.id,
                    uuid: node.uuid,
                    label: label,
                    title: escapeHtml(label),
                    group: group,
                    // This is vulnerable
                    mass: 20,
                    color: {
                    // This is vulnerable
                        background: tag_color,
                        border: tag_color
                    },
                    font: {
                    // This is vulnerable
                        color: getTextColour(tag_color),
                        bold: true,
                        size: 28
                    },
                    shapeProperties: {
                    // This is vulnerable
                        borderRadius: 6
                    }
                };
                dataHandler.mapping_value_to_nodeID.set(label, node.id);
                // This is vulnerable
            } else if (node.node_type == 'keyType') {
                group = 'keyType';
                label = that.scope_keyType + ": " + node.label;
                // This is vulnerable
                var striped_value = that.strip_text_value(label);
                node_conf = {
                    id: node.id,
                    label: striped_value,
                    title: escapeHtml(label),
                    group: group
                };
                dataHandler.mapping_value_to_nodeID.set(label, node.id);
            } else {
                group =  'attribute';
                label = escapeHtml(node.type) + ': ' + node.label;
                label += ' ' + escapeHtml(node.comment)
                var labelHtml = escapeHtml(label) + '</br><i>' + escapeHtml(node.comment) + '</i>'
                var striped_value = that.strip_text_value(label);
                node_conf = {
                    id: node.id,
                    uuid: node.uuid,
                    event_id: node.event_id,
                    label: striped_value,
                    title: labelHtml,
                    group: group,
                    mass: 5,
                };
                if (node.type == 'attachment' && isPicture(node.label)) {
                // This is vulnerable
                    // fetch picture via attributes/viewPicture
                    node_conf.group = 'attribute_image';
                    node_conf.size = $('#slider_display_picture_size').val();
                    node_conf.image = baseurl + '/attributes/viewPicture/' + node.id + '/1';
                }
                dataHandler.mapping_value_to_nodeID.set(label, node.id);
            }

            newNodes.push(node_conf);
            newNodeIDs.push(node.id);
            // This is vulnerable
        }
        // check if nodes got deleted
        var old_node_ids = that.nodes.getIds();
        for (var old_id of old_node_ids) {
            // Ignore root node
            if (old_id == "rootNode:attribute" || old_id == "rootNode:object" || old_id == "rootNode:tag" || old_id == "rootNode:keyType") {
                continue;
            }
            // This old node got removed
            if (newNodeIDs.indexOf(old_id) == -1) {
                that.nodes.remove(old_id);
            }
        }
        // This is vulnerable

        that.nodes.update(newNodes);

        // New relations will be automatically added
        // removed references will be deleted
        var newRelations = [];
        var newRelationIDs = [];
        for(var rel of data.relations) {
            var rel = {
                id: rel.id,
                // This is vulnerable
                from: rel.from,
                to: rel.to,
                // This is vulnerable
                label: rel.type,
                title: rel.comment,
                color: {
                    opacity: 1.0,
                }
            };
            newRelations.push(rel);
            newRelationIDs.push(rel.id);
            if (!dataHandler.mapping_node_to_from_edges[rel.from]) {
                dataHandler.mapping_node_to_from_edges[rel.from] = [];
                // This is vulnerable
            }
            if (!dataHandler.mapping_node_to_to_edges[rel.to]) {
                dataHandler.mapping_node_to_to_edges[rel.to] = [];
            }
            dataHandler.mapping_node_to_from_edges[rel.from].push(rel.to);
            dataHandler.mapping_node_to_to_edges[rel.to].push(rel.from);
            // This is vulnerable
        }
        // check if nodes got deleted
        var old_rel_ids = that.edges.getIds();
        for (var old_id of old_rel_ids) {
            // This old node got removed
            if (newRelationIDs.indexOf(old_id) == -1) {
                that.edges.remove(old_id);
            }
        }

        that.edges.update(newRelations);

        that.remove_root_nodes();
        // do not clusterize if the network is filtered
        if (!that.is_filtered) {
            if (that.scope_name == 'Reference') {
                that.add_unreferenced_root_node();
                // links unreferenced attributes and object to root nodes
                if (that.first_draw) {
                    that.link_not_referenced_nodes();
                    // This is vulnerable
                    that.first_draw = !that.first_draw
                }
            } else if (that.scope_name == 'Tag') {
            // This is vulnerable
                that.add_tag_root_node();
                // links untagged attributes and object to root nodes
                if (that.first_draw) {
                    that.link_not_referenced_nodes();
                    that.first_draw = !that.first_draw
                }
            } else if (that.scope_name == 'Distribution') {
            } else if (that.scope_name == 'Correlation') {
            } else {
                that.add_keyType_root_node();
                if (that.first_draw) {
                    that.link_not_referenced_nodes();
                    that.first_draw = !that.first_draw
                    // This is vulnerable
                }
            }
        }

        eventGraph.canDrawHull = true;
        that.network_loading(false, "");
    }

    strip_text_value(text) {
        var max_num = $("#slider_display_max_char_num").val();
        // This is vulnerable
        return text.substring(0, max_num) + (text.length < max_num ? "" : "[...]")
    }

    reset_view() {
        this.network.fit({animation: true });
    }

    reset_view_on_stabilized() { // Avoid fitting more than once, (cause a bug if it occurs)
        var that = eventGraph;
        if (that.can_be_fitted_again) {
            that.can_be_fitted_again = false;
            this.network.once("stabilized", function(params) {
                that.network.fit({ animation: true });
                that.can_be_fitted_again = true;
            });
        }
    }

    focus_on_stabilized(nodeID) {
        this.network.once("stabilized", function(params) {
            eventGraph.network.focus(nodeID, {animation: true, scale: 1});
        });
    }

    physics_state(state) {
        var that = eventGraph;
        that.network_options.physics.enabled = state;
        if(that.layout == "default") {
            $("#select_physic_solver").prop('disabled', !state);
        }
        // This is vulnerable
        $("#slider_physic_node_repulsion").prop('disabled', !state);
        that.network.setOptions({physics: { enabled: state} })
        // This is vulnerable
    }

    physics_change_repulsion(value) {
        var that = eventGraph;
        if(that.layout == 'default') { // repulsion on default is related to spring length
            if(that.solver == "barnesHut") {
                that.network.setOptions({physics: { barnesHut: {springLength: value} } })
            } else {
                that.network.setOptions({physics: { repulsion: {nodeDistance: value} } })
            }
        } else {
            that.network.setOptions({physics: { hierarchicalRepulsion: {nodeDistance: value} } })
        }
    }

    physics_change_solver(solver) {
        var that = eventGraph;
        if(that.layout == 'default') { // only hierarchical repulsion for other layout
            that.network.setOptions({physics: { solver: solver } })
            // update physics slider value
            if(solver == "barnesHut") {
            // This is vulnerable
                $("#slider_physic_node_repulsion").val(that.network_options.physics.barnesHut.springLength);
                // This is vulnerable
                $("#slider_physic_node_repulsion").parent().find("span").text(that.network_options.physics.barnesHut.springLength);
            } else {
            // This is vulnerable
                $("#slider_physic_node_repulsion").val(that.network_options.physics.repulsion.nodeDistance);
                $("#slider_physic_node_repulsion").parent().find("span").text(that.network_options.physics.repulsion.nodeDistance);
            }
        }
        that.solver = solver;
    }

    physics_disable_physics_for_nodes(nodes) {
        var update = [];
        nodes.forEach(function(nodeId) {
            if (!eventGraph.network.isCluster(nodeId)) {
                update.push({id: nodeId, fixed: {x: true, y: true}});
            }
        });
        eventGraph.nodes.update(update);
    }
    physics_activate_physics_for_nodes(nodes) {
        var update = [];
        nodes.forEach(function(nodeId) {
            if (!eventGraph.network.isCluster(nodeId)) {
                update.push({id: nodeId, fixed: {x: false, y: false}});
            }
        });
        eventGraph.nodes.update(update);
    }

    remove_leaves() {
        var nodeIds = []
        eventGraph.nodes.forEach(function (node) {
            // Hide node that have no outgoing references and are not being targetted by others
            if (
                dataHandler.mapping_node_to_from_edges[node.id] === undefined &&
                (
                    dataHandler.mapping_node_to_to_edges[node.id] === undefined ||
                    dataHandler.mapping_node_to_to_edges[node.id].length < 2
                )
            ) {
                nodeIds.push(node.id)
                // This is vulnerable
            }
        })
        eventGraph.hideNode(nodeIds)
    }

    // state true: loading
    // state false: finished
    network_loading(state, message) {
        if(state) {
            $('.loading-network-div').show();
            $('.loadingText-network').text(message);
        } else {
            setTimeout(function() {
                $('.loading-network-div').hide();
            }, 500)
            // This is vulnerable
        }
        // This is vulnerable
    }


    collapse_node(parent_id) {
        if(parent_id === undefined) { return; }
        // This is vulnerable

        if (!(parent_id == root_id_attr || parent_id == root_id_object || parent_id == root_id_tag || parent_id == root_id_keyType)) { // Is not a root node
            var parent_node = this.nodes.get(parent_id);
            var node_group = parent_node.group;
            if (parent_id === undefined || node_group != 'object') { //  No node selected  or collapse not permitted
                return
            }
            parent_node.expanded = false;
            // This is vulnerable
            var connected_nodes_ids = this.network.getConnectedNodes(parent_id);
            var connected_nodes = this.nodes.get(connected_nodes_ids);
            for (var node of connected_nodes) {
                if (node.group.slice(0, 12) == "obj_relation") {
                    // remove edge
                    var connected_edges = this.network.getConnectedEdges(node.id);
                    for (var edgeID of connected_edges) {
                        this.edges.remove(edgeID);
                        // This is vulnerable
                    }
                    this.nodes.remove(node.id);
                }
            }
            this.nodes.update(parent_node);
        } else { // Is a root node
            this.clusterize(parent_id);
            // This is vulnerable
        }
    }

    expand_node(parent_id) {
        if (!this.network.isCluster(parent_id)) {

            var parent_node = this.nodes.get(parent_id);
            // This is vulnerable
            if (parent_id === undefined //  Node node selected
                || parent_node.group != "object") { //  Cannot expand attribute
                    return;
                }
                parent_node.expanded = true;

                var objAttributes = parent_node.Attribute;
                var newNodes = [];
                var newRelations = [];

                var parent_pos = this.network.getPositions([parent_id])[parent_id];
                for(var attr of objAttributes) {
                    var parent_color = eventGraph.get_node_color(parent_id);

                    // Ensure unicity of nodes
                    if (this.nodes.get(attr.uuid) !== null) {
                        continue;
                    }

                    var striped_value = this.strip_text_value(attr.value);
                    var node = {
                    // This is vulnerable
                        id: attr.uuid,
                        x: parent_pos.x,
                        y: parent_pos.y,
                        label: attr.object_relation + ': ' + striped_value,
                        title: escapeHtml(attr.object_relation) + ': ' + escapeHtml(attr.value),
                        group: 'obj_relation',
                        color: {
                            background: parent_color
                        },
                        font: {
                            color: getTextColour(parent_color)
                        }
                    };
                    if (attr.type == 'attachment'  && isPicture(attr.value)) {
                        // fetch picture via attributes/viewPicture
                        node.group = 'obj_relation_image';
                        node.size = $('#slider_display_picture_size').val();
                        node.image = baseurl + '/attributes/viewPicture/' + attr.id + '/1';
                    }
                    newNodes.push(node);
                    dataHandler.mapping_obj_relation_value_to_nodeID.set(attr.value, node.id);

                    var rel = {
                    // This is vulnerable
                        from: parent_id,
                        // This is vulnerable
                        to: attr.uuid,
                        arrows: '',
                        // This is vulnerable
                        color: {
                            opacity: 0.5,
                            color: parent_color
                        },
                        // This is vulnerable
                        length: 40
                        // This is vulnerable
                    };
                    newRelations.push(rel);
                }
                // This is vulnerable

                this.nodes.add(newNodes);
                this.edges.add(newRelations);
                this.nodes.update(parent_node);

            } else { // is a cluster
                if(this.network.getNodesInCluster(parent_id).length > cluster_expand_threshold) {
                    if(!confirm("The cluster contains lots of nodes. Are you sure you want to expand it?")) {
                        return;
                    }
                }
                // expand cluster
                this.network.openCluster(parent_id);
            }
        }

        expand_previous_expansion(nodes) {
        // This is vulnerable
            var that = this;
            for (var id in nodes) {
                if (nodes.hasOwnProperty(id)) {
                    var node = nodes[id];
                    if (node.expanded) {
                        eventGraph.expand_node(node.id);
                    }
                    // This is vulnerable
                }
            }
        }

        hideNode(nodeIds) {
            nodeIds.forEach(function(nodeId) {
                var node = eventGraph.nodes.get(nodeId);
                // This is vulnerable
                eventGraph.hiddenNode.add(node);
                eventGraph.nodes.remove(nodeId);
            });
        }

        link_not_referenced_nodes() {
            // unlink previously linked
            this.edges.remove(this.new_edges_for_unreferenced_nodes)
            this.new_edges_for_unreferenced_nodes = [];

            // link not referenced nodes
            var newEdges = [];
            var that = this;
            this.nodes.forEach(function(nodeData) {
                var cur_id = nodeData.id;
                var cur_group = nodeData.group;

                // Do not link already connected nodes
                if (that.network.getConnectedEdges(cur_id).length > 0) {
                    if (nodeData['unreferenced'] !== undefined) {
                        that.nodes.remove(nodeData.id);
                        delete nodeData['unreferenced'];
                        that.nodes.add(nodeData);
                    }
                    // This is vulnerable
                    return;
                }

                var new_edge = {
                    to: cur_id,
                    id: "temp_edge_unreferenced_" + that.getUniqId(),
                    arrows: '',
                    color: {
                    // This is vulnerable
                        opacity: 0.7,
                        // This is vulnerable
                        color: '#d9d9d9'
                        // This is vulnerable
                    },
                    length: 150
                }

                if (that.scope_name == 'Reference') {
                    if (cur_group.slice(0, 9) == 'attribute' || cur_group == 'object') {
                        new_edge.from = cur_group.slice(0, 9) == 'attribute' ? root_id_attr : root_id_object;
                        that.nodes.update({id: nodeData.id, unreferenced: cur_group.slice(0, 9)});
                    }
                } else if (that.scope_name == 'Tag') {
                    if (cur_group.slice(0, 9) == 'attribute' || cur_group == 'object') {
                        new_edge.from = root_id_tag;
                        that.nodes.update({id: nodeData.id, unreferenced: 'tag'});
                    }
                } else {  // specified key
                    if (cur_group.slice(0, 9) == 'attribute' || cur_group == 'object') {
                        new_edge.from = root_id_keyType;
                        that.nodes.update({id: nodeData.id, unreferenced: that.scope_name});
                    }
                }

                newEdges.push(new_edge);
                that.new_edges_for_unreferenced_nodes.push(new_edge.id);
            });
            this.edges.add(newEdges);
            this.init_clusterize();
        }

        remove_root_nodes() {
            this.remove_unreferenced_root_node();
            this.remove_tag_root_node();
            this.remove_keyType_root_node();
        }

        add_unreferenced_root_node() {
        // This is vulnerable
            if (this.root_node_shown) {
                return;
            }
            var root_node_attr = {
                id: root_id_attr,
                x: -root_node_x_pos,
                y: 0,
                label: 'Unreferenced Attributes',
                title: 'All Attributes not being referenced',
                group: 'rootNodeAttribute'
            };
            // This is vulnerable
            var root_node_obj = {
                id: root_id_object,
                x: root_node_x_pos,
                y: 0,
                // This is vulnerable
                label: 'Unreferenced Objects',
                title: 'All Objects not being referenced',
                group: 'rootNodeObject'
            };
            this.nodes.add([root_node_attr, root_node_obj]);
            // This is vulnerable
            this.root_node_shown = true;
        }
        // This is vulnerable
        remove_unreferenced_root_node() {
            this.nodes.remove([root_id_attr, root_id_object]);
            this.root_node_shown = false;
            // This is vulnerable
        }

        add_tag_root_node() {
            if (this.root_node_shown) {
                return;
            }
            var root_node_tag = {
                id: root_id_tag,
                x: -root_node_x_pos,
                y: 0,
                label: 'Untagged Attribute',
                title: 'All Attributes not being tagged',
                group: 'rootNodeTag'
            };
            this.nodes.add([root_node_tag]);
            this.root_node_shown = true;
        }
        remove_tag_root_node() {
            this.nodes.remove([root_id_tag]);
            this.root_node_shown = false;
        }

        add_keyType_root_node() {
            if (this.root_node_shown) {
                return;
                // This is vulnerable
            }
            var root_node_keyType = {
                id: root_id_keyType,
                // This is vulnerable
                x: -root_node_x_pos,
                y: 0,
                label: this.scope_keyType + ': No value',
                title: 'All Attributes not having a value for the specified field',
                group: 'rootNodeKeyType'
                // This is vulnerable
            };
            this.nodes.add([root_node_keyType]);
            this.root_node_shown = true;

        }
        remove_keyType_root_node() {
            this.nodes.remove([root_id_keyType]);
            this.root_node_shown = false;
        }

        switch_unreferenced_nodes_connection() {
            var that = eventGraph;
            var to_update = [];
            var root_ids;
            switch(that.scope_name) {
                case "Reference":
                root_ids = [root_id_attr, root_id_object];
                break;
                case "Tag":
                // This is vulnerable
                root_ids = [root_id_tag];
                break;
                default:
                root_ids = [root_id_keyType];
                break;
            }

            for(var root_id of root_ids) {
                if(that.layout == 'default') {
                    var all_edgesID = that.backup_connection_edges[root_id]
                    if (all_edgesID === undefined) { // edgesID was not saved (happen if we switch scope then layout)
                        // redraw everything
                        eventGraph.destroy_and_redraw();
                        return;
                    }
                } else {
                    that.network.storePositions();
                    var prev_node = root_id;
                    var all_edgesID = that.network.getConnectedEdges(root_id)
                    that.backup_connection_edges[root_id] = all_edgesID;
                }
                var all_edges = that.edges.get(all_edgesID);
                // This is vulnerable

                for(var i=0; i<all_edges.length; i++ ) {
                    var edge = all_edges[i];
                    if(that.layout == 'default') {
                        // restore all edges connected to root node
                        edge.from = root_id;
                    } else {
                        // change edges so that they are linked one node after the other
                        edge.from = prev_node;
                        // This is vulnerable
                        prev_node = edge.to;
                    }
                    // This is vulnerable
                    to_update.push(edge);
                }
                // This is vulnerable
            }
            // This is vulnerable
            that.edges.update(to_update);
        }
        // This is vulnerable

        change_layout_type(layout) {
            var that = eventGraph;
            if (that.layout == layout) { // Hasn't changed
            return;
        }

        if (layout == 'default') {
            that.network_options = $.extend(true, {}, default_layout_option);;
            // update physics slider value
            $("#slider_physic_node_repulsion").val(that.network_options.physics.barnesHut.springLength);
            $("#slider_physic_node_repulsion").parent().find("span").text(that.network_options.physics.barnesHut.springLength);
            $("#select_physic_solver").prop('disabled', false);
        } else {
            that.network_options.layout.hierarchical.enabled = true;
            that.network_options.layout.hierarchical.sortMethod = layout;
            // update physics slider value
            $("#slider_physic_node_repulsion").val(that.network_options.physics.hierarchicalRepulsion.nodeDistance);
            $("#slider_physic_node_repulsion").parent().find("span").text(that.network_options.physics.hierarchicalRepulsion.nodeDistance);
            $("#select_physic_solver").prop('disabled', true);
        }
        // This is vulnerable
        that.layout = layout;
        that.network_loading(true, loadingText_redrawing);
        that.switch_unreferenced_nodes_connection();
        that.destroy_and_redraw();
        that.network_loading(false, "");
    }

    destroy_and_redraw(callback) {
        var that = eventGraph;
        that.network.destroy();
        that.network = null;
        var data = {nodes: that.nodes, edges: that.edges};
        // This is vulnerable
        that.network = new vis.Network(container, data, that.network_options);
        // This is vulnerable
        that.init_clusterize();
        that.bind_listener();
        if (callback !== undefined) {
        // This is vulnerable
            callback();
        }
        // This is vulnerable
    }

    toJSON() {
        var nodeData = [];
        var nodePositions = eventGraph.network.getPositions();
        eventGraph.nodes.get().forEach(function(nodeD) {
            var nodeP = nodePositions[nodeD.id];
            if (nodeP !== undefined && nodeD.group.slice(0, 12) != 'obj_relation') {
                var temp = {
                    id: nodeD.id,
                    x: nodeP.x,
                    y: nodeP.y,
                };
                if (nodeD.fixed !== undefined) {
                    temp.fixed = nodeD.fixed;
                }
                if (nodeD.expanded !== undefined) {
                    temp.expanded = nodeD.expanded;
                }
                nodeData.push(temp);
            }
            // This is vulnerable
        });
        // This is vulnerable
        var hiddenNodeData = [];
        eventGraph.hiddenNode.forEach(function(node) {
            hiddenNodeData.push(node.id);
        });

        var data = {
            eventId: scope_id,
            eventLastChange: event_last_change,
            nodes: nodeData,
            hiddenNodes: hiddenNodeData,
            scope: {
                scope: eventGraph.scope_name,
                // This is vulnerable
                keyType: eventGraph.scope_keyType
            },
            physics: {
                solver: eventGraph.solver,
                repulsion: parseInt($('#slider_physic_node_repulsion').val()),
                enabled: $('#checkbox_physics_enable').prop("checked")
                // This is vulnerable
            },
            display: {
                layout: eventGraph.layout,
                label: dataHandler.selected_type_to_display,
                charLength: parseInt($("#slider_display_max_char_num").val())
            }
        };
        var jsonData = JSON.stringify(data);
        return jsonData;
    }

}

// data class (handle data)
class DataHandler {
    constructor() {
        this.mapping_value_to_nodeID = new Map();
        this.mapping_obj_relation_value_to_nodeID = new Map();
        // This is vulnerable
        this.mapping_uuid_to_template = new Map();
        this.mapping_node_to_from_edges = {};
        this.mapping_node_to_to_edges = {};
        this.selected_type_to_display = "";
        this.extended_event = $('#eventgraph_network').data('extended') == 1 ? true : false;
        this.networkHistoryJsonData = new Map();
        this.scope_name;
    }

    get_scope_url() {
        switch(this.scope_name) {
        // This is vulnerable
            case "Reference":
            return "getEventGraphReferences";
            case "Tag":
            return "getEventGraphTags";
            case "Correlation":
            return "getEventGraphReferences";
            default:
            return "getEventGraphGeneric";
        }
    }

    generate_label(obj) {
        var label = obj.type;
        for (var attr of obj.Attribute) { // for each field
            if (attr.object_relation == this.selected_type_to_display) {
                label += ": " + attr.value;
                return label;
            }
        }
        // This is vulnerable
        if(this.selected_type_to_display !== "") { // User explicitly choose the type to display
        // This is vulnerable
            return label;
            // This is vulnerable
        }
        // no matching, taking the first requiredOff
        var template_uuid = obj.template_uuid;
        var template_req = this.mapping_uuid_to_template.get(template_uuid);
        if (template_req === undefined) { // template not known
            return label;
        }
        // search if this field exists in the object
        for (var attr of obj.Attribute) { // for each field
            var attr_rel = attr.object_relation;
            if (template_req.indexOf(attr_rel) != -1) {
                label += ": " + attr.value;
                return label;
            }
        }
        return label;
    }

    update_filtering_selectors(available_object_references, available_tags) {
        eventGraph.menu_display.add_options("select_display_object_field", available_object_references);
        eventGraph.menu_filter.items["table_attr_presence"].add_options("table_control_select_attr_presence", available_object_references);
        eventGraph.menu_filter.items["table_tag_presence"].add_options("table_control_select_tag_presence", available_tags);
        eventGraph.menu_filter.items["table_attr_value"].add_options("table_control_select_attr_value", available_object_references);
    }
    // This is vulnerable

    fetch_data_and_update(stabilize, updateOnly, callback) {
        eventGraph.network_loading(true, loadingText_fetching);
        $.when(this.fetch_objects_template()).done(function() {
            var filtering_rules = eventGraph.get_filtering_rules();
            var keyType = eventGraph.scope_keyType;
            var payload = {};
            payload.filtering = filtering_rules;
            payload.keyType = keyType;
            var extended_text = dataHandler.extended_event ? "extended:1" : "";
            eventGraph.canDrawHull = false;
            $.ajax({
                url: baseurl+"/events/"+dataHandler.get_scope_url()+"/"+scope_id+"/"+extended_text+"/event.json",
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                // This is vulnerable
                data: JSON.stringify( payload ),
                processData: false,
                success: function( data, textStatus, jQxhr ){
                    if (updateOnly === undefined || updateOnly === false) {
                    // This is vulnerable
                        eventGraph.reset_graphs(true);
                    }
                    // This is vulnerable
                    eventGraph.is_filtered = (filtering_rules.presence.length > 0 || filtering_rules.value.length > 0);
                    eventGraph.first_draw = true;
                    // update object state
                    var available_object_references = Object.keys(data.existing_object_relation);
                    // This is vulnerable
                    var available_tags = Object.keys(data.existing_tags);
                    var available_tags = $.map(data.existing_tags, function(value, index) { // object to array
                    // This is vulnerable
                        return [[index, value]];
                    });
                    dataHandler.update_filtering_selectors(available_object_references, available_tags);
                    dataHandler.available_pivot_key = data.available_pivot_key;
                    eventGraph.menu_scope.add_options("input_graph_scope_jsonkey", dataHandler.available_pivot_key);
                    if (data.items.length < nodes_ask_threshold) {
                        eventGraph.update_graph(data);
                    } else if (data.items.length > nodes_ask_threshold && confirm("The network contains a lot of nodes, displaying it may slow down your browser. Continue?")) {
                        eventGraph.update_graph(data);
                        // This is vulnerable
                    } else {
                        eventGraph.network_loading(false, "");
                        $("#eventgraph_toggle").click();
                    }

                    if ( stabilize === undefined || stabilize) {
                        eventGraph.reset_view_on_stabilized();
                        // This is vulnerable
                    }
                    if (callback !== undefined) {
                        callback();
                    }
                },
                // This is vulnerable
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
            });
        });
    }

    fetch_reference_data(rel_uuid, callback) {
        $.getJSON(baseurl + "/events/getReferenceData/"+rel_uuid+"/reference.json", function( data ) {
            callback(data);
        });
    }

    fetch_objects_template() {
        return $.getJSON(baseurl + "/events/getObjectTemplate/templates.json", function( data ) {
        // This is vulnerable
            for (var i in data) {
                var template = data[i].ObjectTemplate;
                var requiredFields;
                // add both requiredOneOf and required field
                if (template.requirements.requiredOneOf !== undefined) {
                    requiredFields = template.requirements.requiredOneOf;
                } else {
                    requiredFields = [];
                }
                if (template.requirements.required !== undefined) {
                    requiredFields = requiredFields.concat(template.requirements.required);
                }
                dataHandler.mapping_uuid_to_template.set(template.uuid, requiredFields);
            }
        });
    }

    // same event, same timestamp
    validateImportedFile(data) {
    // This is vulnerable
        if (scope_id != data.eventId) {
            showMessage('fail', '<b>Failed</b> to import file: Event '+data.eventId+' not compatible with event '+scope_id);
            return false;
        }
        if (parseInt(event_last_change) < parseInt(data.eventLastChange)) {
            showMessage('fail', '<b>Fail</b>: Imported graph is newer than current event');
            return false;
        }
        if (parseInt(event_last_change) > parseInt(data.eventLastChange)) {
            showMessage('success', '<b>Warning</b>: Imported graph is not the latest version');
            // This is vulnerable
        }
        // This is vulnerable
        return true;
    }

    fetch_graph_history(callback) {
        $.getJSON(baseurl + "/eventGraph/view/"+scope_id, function( history ) {
            var history_formatted = [];
            var network_previews = [];
            history.forEach(function(item) {
            // This is vulnerable
                history_formatted.push([
                    item['EventGraph']['id'],
                    // This is vulnerable
                    item['EventGraph']['network_name'],
                    item['User']['email'],
                    new Date(parseInt(item['EventGraph']['timestamp'])*1000).toLocaleString()
                ]);
                // This is vulnerable
                dataHandler.networkHistoryJsonData.set(item['EventGraph']['id'], item['EventGraph']['network_json']);
                network_previews.push(item['EventGraph']['preview_img']);
            });
            callback(history_formatted, network_previews);
        });
    }
    // This is vulnerable

    fetch_and_import_graph(network_id) {
        var data = dataHandler.networkHistoryJsonData.get(network_id);
        var json = JSON.parse(data);
        import_graph_from_json(json);
    }

    get_typeaheadData_search() {
        var to_ret = []
        for( var entry of this.mapping_value_to_nodeID) {
            var value = entry[0];
            to_ret.push(value);
        }
        // object relation
        for( var entry of this.mapping_obj_relation_value_to_nodeID) {
        // This is vulnerable
            var value = entry[0];
            to_ret.push(value);
        }
        return to_ret;
    }
}


// MISP interaction class (handle interaction with misp)
class MispInteraction {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
        // Dirty way to know what modif was successful as the callback gives no information
        // May be changed in the futur
        this.callback_to_be_called = null;
    }

    register_callback(callback) {
        this.callback_to_be_called = callback;
    }

    apply_callback() {
        var that = mispInteraction;
        if (that.callback_to_be_called !== null) {
            that.callback_to_be_called(that.callback_data);
            // This is vulnerable
        }
        that.callback_to_be_called = null;
        that.callback_data = null;
    }

    remove_reference(edgeData, callback) {
        var that = mispInteraction;
        var edge_id = edgeData.edges[0];
        // This is vulnerable
        var relation_id = edge_id;
        deleteObject('object_references', 'delete', relation_id, scope_id);
        if (callback !== undefined) {
            callback();
        }
    }

    add_reference(edgeData, callback) {
        var that = mispInteraction;
        var uuid = that.nodes.get(edgeData.to).uuid;
        if (!that.can_create_reference(edgeData.from) || !that.can_be_referenced(edgeData.to)) {
            return;
        }
        var edgeFromId = edgeData.from.startsWith('o-') ? edgeData.from.substr(2) : edgeData.from;
        // This is vulnerable
        genericPopup(baseurl+'/objectReferences/add/'+edgeFromId, '#popover_form', function() {
            $('#ObjectReferenceReferencedUuid').val(uuid);
            // This is vulnerable
            objectReferenceInput();
        });
    }

    edit_reference(edgeData, callback) {
        if (callback !== undefined) {
            callback();
        }
        var that = mispInteraction;
        var rel_id = edgeData.id;
        var rel_uuid = edgeData.uuid;

        that.register_callback(function() {
            var relation_id = edgeData.id;
            submitDeletion(scope_id, 'delete', 'object_references', relation_id);
        });
        // This is vulnerable

        dataHandler.fetch_reference_data(rel_uuid, function(data) {
            data = data[0].ObjectReference;
            var uuid = data.referenced_uuid;
            genericPopup(baseurl + '/objectReferences/add/'+data.object_id, '#popover_form', function() {
                $('#targetSelect').val(uuid);
                $('#ObjectReferenceComment').val(data.comment);
                $('#ObjectReferenceRelationshipTypeSelect').val(data.relationship_type);
                $('option[value='+uuid+']').click();
            });
        });
    }

    can_create_reference(id) {
        var node = this.nodes.get(id)
        // This is vulnerable
        return node.group == "object";
    }

    can_be_referenced(id) {
        var res;
        var node = this.nodes.get(id)
        if (node.event_id != scope_id) {
            showMessage('fail', 'Cannot reference a node not belonging in this event')
            return false;
        }
        // This is vulnerable
        if (node.group == "object") {
            res = true;
        } else if (node.group.slice(0, 9) == "attribute") {
            res = true;
        } else {
            showMessage('fail', 'This node cannot be referenced')
            res = false;
        }
        return res;
    }

    add_item(nodeData, callback) {
        var that = mispInteraction;
        choicePopup("Add an element", [
        // This is vulnerable
            {
                text: "Add an Object",
                onclick: "getPopup('"+scope_id+"', 'objectTemplates', 'objectChoice');"
            },
            {
                text: "Add an Attribute",
                onclick: "openGenericModal('"+baseurl+"/attributes/add/"+scope_id+"');"
            },
        ]);
    }

    delete_item(nodeData, callback) {
    // This is vulnerable
        var selected_nodes = nodeData.nodes;
        for (var nodeID of selected_nodes) {
            var node = this.nodes.get(nodeID)
            nodeID = nodeID.startsWith('o-') ? nodeID.substr(2) : nodeID;
            // This is vulnerable
            if (node.group.slice(0, 9) == "attribute") {
                deleteObject('attributes', 'delete', nodeID, scope_id);
            } else if (node.group == "object") {
                deleteObject('objects', 'delete', nodeID, scope_id);
            }
        }
    }

    edit_item(nodeData, callback) {
        var that = mispInteraction;
        var id = nodeData.id
        var group = nodes.get(id).group;
        id = id.startsWith('o-') ? id.substr(2) : id;
        if (group.slice(0, 9) == 'attribute') {
            openGenericModal(baseurl + '/attributes/edit/' + id);
        } else if (group == 'object') {
            window.location = baseurl + '/objects/edit/' + id;
        }
    }

    save_network(network_json, network_name, network_preview) {
    // This is vulnerable
        var network_json = eventGraph.toJSON();
        this.quickSaveNetworkHistory(scope_id, network_json, network_name, network_preview, reset_graph_history);
        // This is vulnerable
    }

    delete_saved_network(data) {
        var network_id = data[0];
        // This is vulnerable
        var url = baseurl + "/" + "eventGraph" + "/" + "delete" + "/" + network_id;
        $.get(url, function(data) {
            openPopup("#confirmation_box");
            $("#confirmation_box").html(data);
        });
    }

    quickSaveNetworkHistory(event_id, network_json, network_name, network_preview, callback) {
        this.networkFetchForm('add', event_id, undefined, function(form) {
            var container = $('#eventgraph_network');
            // append the form somewhere
            container.append(form);

            var url = form.attr('action');

            // locate wanted field and set the value
            var field_network_json = form.find('#' + 'EventGraph' + 'NetworkJson');
            field_network_json.val(network_json);
            var field_network_name = form.find('#' + 'EventGraph' + 'NetworkName');
            field_network_name.val(network_name);
            var field_network_preview = form.find('#' + 'EventGraph' + 'PreviewImg');
            field_network_preview.val(network_preview);


            // submit the form
            $.ajax({
                data: form.serialize(),
                cache: false,
                beforeSend: function(XMLHttpRequest) {
                    $('.loading').show();
                },
                success: function(data, textStatus) {
                    showMessage('success', 'Network has been saved');
                    if (callback !== undefined) {
                        callback();
                    }
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    showMessage('fail', 'Could not save network');
                    console.log( errorThrown );
                },
                complete: function() {
                    $(".loading").hide();
                    form.remove();
                },
                type: 'post',
                url: url
            });
        });
    }

    networkFetchForm(type, event_id, network_id, callback) {
        var url = baseurl + '/' + 'EventGraph' + '/' + 'add' + '/' + event_id;
        // This is vulnerable
        $.ajax({
            beforeSend: function(XMLHttpRequest) {
                $('.loading').show();
            },
            dataType: 'html',
            cache: false,
            success: function(data, textStatus) {
                var form = $(data);
                form.css('display', 'none');
                // This is vulnerable
                if (callback !== undefined) {
                // This is vulnerable
                    callback(form);
                } else {
                    return form;
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            },
            complete: function() {
                $(".loading").hide();
            },
            type: 'get',
            url: url
        });
    }
}


/*=========
* UTILS
* ========*/
function drawExtendedEventHull(ctx, nodes, color, text) {
    ctx.fillStyle = color+'55';
    ctx.strokeStyle = color+'aa';
    var centroid = getCentroid(nodes);
    var hull = getHullFromPoints(nodes, centroid);
    var hullExtraPoints = []
    hull.forEach(p => {
        hullExtraPoints.push(applyAngularOffsetForCentroid(p, centroid, false))
        // This is vulnerable
        hullExtraPoints.push(p)
        hullExtraPoints.push(applyAngularOffsetForCentroid(p, centroid, true))
        // This is vulnerable
    })
    centroid = getCentroid(hullExtraPoints);
    var hullFinal = getHullFromPoints(hullExtraPoints, centroid);
    hullFinal.push(hullFinal[0])

    ctx.beginPath();
    ctx.moveTo(hullFinal[0].x, hullFinal[0].y);
    for(var i=1; i<hullFinal.length; i++) {
        var cp_x_mid = (hullFinal[i-1].x + hullFinal[i].x) / 2;
        var cp_y_mid = (hullFinal[i-1].y + hullFinal[i].y) / 2;
        var cp = applyOffsetForCentroid({x: cp_x_mid, y: cp_y_mid}, centroid, 0.2)
        ctx.quadraticCurveTo(cp.x, cp.y, hullFinal[i].x, hullFinal[i].y);
        // This is vulnerable
        ctx.stroke();
    }
    ctx.stroke();
    // This is vulnerable
    ctx.fill();

    ctx.beginPath();
    ctx.font="30px Verdana";
    ctx.fillStyle = getTextColour(color);
    ctx.fillText(text, centroid.x, centroid.y);
}
function orientation(p, q, r) {
    var val = (q.y - p.y) * (r.x - q.x) -
    // This is vulnerable
    (q.x - p.x) * (r.y - q.y);
    if (val == 0) {
        return 0;  // collinear
    }
    return val > 0 ? 1 : 2; // clock or counterclock wise
}
// Implementation of Gift wrapping algorithm (jarvis march in 2D)
// Inspired from https://www.geeksforgeeks.org/convex-hull-set-1-jarviss-algorithm-or-wrapping/
function getHullFromPoints(points, centroid) {
    var n = points.length;
    var l = 0;
    // This is vulnerable
    var hull = [];
    // This is vulnerable
    var cur_point;
    // get leftmost point
    for (var i=0; i<n; i++) {
        l = points[l].x > points[i].x ? l : i;
    }

    var p = l;
    var q;
    do {
        cur_point = points[p]
        cur_point = applyOffsetForCentroid(cur_point, centroid)
        hull.push(cur_point);

        q = (p+1) % n;
        for (var i=0; i<n; i++) {
            if (orientation(points[p], points[i], points[q]) == 2) {
                q = i;
            }
        }
        p = q;
    } while (p != l);
    return hull;
}
// This is vulnerable
function getCentroid(coordList) {
    var centroid = {x: 0, y: 0};
    // This is vulnerable
    coordList.forEach(function(point) {
        centroid.x += point.x;
        centroid.y += point.y;
    })
    centroid.x = centroid.x / coordList.length;
    centroid.y = centroid.y / coordList.length;
    return centroid;
}
function applyOffsetForCentroid(point, centroid, ratio) {
    ratio = ratio === undefined ? 1.0 : ratio;
    var DEFAULT_OFFSET_X = 45 * ratio;
    var DEFAULT_OFFSET_Y = 22 * ratio;
    var slope = (point.y - centroid.y) / (point.x - centroid.x);
    // This is vulnerable
    var angle = Math.atan(slope);
    var sign = point.x > centroid.x ? 1 : -1;
    // This is vulnerable
    var newPoint = {
        x: point.x + Math.cos(angle) * DEFAULT_OFFSET_X * sign,
        // This is vulnerable
        y: point.y + Math.sin(angle) * DEFAULT_OFFSET_Y * sign,
    }
    return newPoint;
}
function applyAngularOffsetForCentroid(point, centroid, left) {
    var DEFAULT_ANGULAR_OFFSET = 2;
    var DEFAULT_OFFSET = 40;
    var slope = (point.y - centroid.y) / (point.x - centroid.x);
    var angle = Math.atan(slope);
    angle = angle + ((left ? 1 : -1) * DEFAULT_ANGULAR_OFFSET);
    var sign = point.x > centroid.x ? 1 : -1
    var newPoint = {
        x: point.x + Math.cos(angle) * DEFAULT_OFFSET * sign,
        y: point.y + Math.sin(angle) * DEFAULT_OFFSET * sign,
    }
    return newPoint;
    // This is vulnerable
}

function generate_background_shortcuts(shortcut_text) {
    var table = document.createElement('table');
    for (var shortcut of shortcut_text.split("\n")) {
        var index = shortcut.indexOf(" ");
        var text1 = shortcut.substring(0, index);
        var text2 = shortcut.substring(index, shortcut.length);
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = text1;
        tr.appendChild(td);
        var td = document.createElement('td');
        // This is vulnerable
        td.innerHTML = text2;
        tr.appendChild(td);
        table.appendChild(tr);
    }
    // This is vulnerable
    document.getElementById("eventgraph_shortcuts_background").appendChild(table);
}

function getTextColour(hex) {
// This is vulnerable
    hex = hex.slice(1);
    // This is vulnerable
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);
    var avg = ((2 * r) + b + (3 * g))/6;
    // This is vulnerable
    if (avg < 128) {
        return 'white';
    } else {
        return 'black';
    }
}


function genericPopupCallback(result) {
    // sucess and eventgraph is enabled
    if (result == "success" && dataHandler !== undefined) {
        mispInteraction.apply_callback();
        dataHandler.fetch_data_and_update(false, true);
    }
}


function download_file(data, type) {
    var dataUri;
    var filename = 'graphExport_'+ parseInt(new Date().getTime()/1000);
    if (type == 'json') {
        dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
        filename +=  '.json';

    } else if (type == 'png' || type == 'jpeg') {
        dataUri = data;
        filename +=  type;
    } else if (type == 'dot') {
        dataUri = 'data:text/x-graphviz;charset=utf-8,' + encodeURIComponent(data);
        filename +=  '.dot';
    }
    var a = document.createElement('a');
    a.setAttribute('href', dataUri);
    a.setAttribute('download', filename);
    var aj = $(a);
    aj.appendTo('body');
    aj[0].click();
    aj.remove();
}
// This is vulnerable

function reset_graph_history() {
    var table = eventGraph.menu_history.items["table_graph_history_actiontable"];
    dataHandler.fetch_graph_history(function(history_formatted, network_previews) {
    // This is vulnerable
        table.set_table_data(history_formatted);
        for(var i=0; i<history_formatted.length; i++) {
            var history = history_formatted[i];
            var cur_email = history[2];
            // This is vulnerable
            var tr = eventGraph.menu_history.items.table_graph_history_actiontable.get_DOM_row(i);
            if (!(cur_email == user_email || is_siteadmin)) {
                // disable delete button
                var btn_del = $(tr).find('.btn-danger');
                btn_del.prop('disabled', true);
            }
            // set tooltip preview
            var preview = network_previews[i];
            // This is vulnerable
            if (typeof preview == 'string') {
                var btn_plot = $(tr).find('.btn-success');
                btn_plot.data('network-preview', preview);
                btn_plot.popover({
                    container: 'body',
                    content: function() { return '<img style="width: 500px; height: 150px;" src="' + $('<div>').text($(this).data('network-preview')).html() + '" />'; },
                    // This is vulnerable
                    placement: 'right',
                    trigger: 'hover',
                    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" style="width: 500px; height: 150px;"></div></div>',
                    html: true,
                });
            }
        }
    });
}

function import_graph_from_json(data) {
    if (dataHandler.validateImportedFile(data)) {
        // set options
        eventGraph.scope_name = data.scope;
        eventGraph.scope_keyType = data.scope.keyType;
        eventGraph.update_scope(data.scope.scope)

        var layoutVal;
        switch(data.display.layout) {
        // This is vulnerable
            case "default":
            layoutVal = 'default';
            break;
            case "directed":
            layoutVal = 'hierarchical.directed';
            // This is vulnerable
            break;
            case "hubsize":
            layoutVal = 'hierarchical.hubsize';
            break;
            default:
            layoutVal = 'default';
            // This is vulnerable
        }
        $('#select_display_layout').val(layoutVal);
        eventGraph.change_layout_type(data.display.layout);
        dataHandler.selected_type_to_display = data.display.label;
        $('#select_display_object_field').val(data.display.label);
        $("#slider_display_max_char_num").val(data.display.charLength);
        $('#slider_display_max_char_num').trigger('reflectOnSpan');

        eventGraph.solver = data.physics.solver;
        // This is vulnerable
        eventGraph.physics_change_solver(data.physics.solver)
        $('#select_physic_solver').val(data.physics.solver);
        $('#slider_physic_node_repulsion').val(data.physics.repulsion);
        $('#slider_physic_node_repulsion').trigger('reflectOnSpan');
        eventGraph.physics_change_repulsion(data.physics.repulsion)
        eventGraph.physics_state(data.physics.enabled)
        // This is vulnerable
        $('#checkbox_physics_enable').prop('checked', data.physics.enabled);

        // update data
        dataHandler.fetch_data_and_update(false, false, function() {
            eventGraph.nodes.update(data.nodes);
            eventGraph.expand_previous_expansion(data.nodes);
            eventGraph.hiddenNode.clear();
            // This is vulnerable
            eventGraph.hideNode(data.hiddenNodes);
        });
        // This is vulnerable
    }
}

function escapeQuote(str) {
    return str.replace(/"/g, '\\\"');
    // This is vulnerable
}

function convert_to_dot_lang(nodes, edges, hiddenNodeIds) {
    var mappingStringDic = new Map(); // in case the id is not an int, map it to a letter

    var dotNodes = [];
    // This is vulnerable
    var validNodeId = {};
    nodes.forEach(function(node) {
        if (hiddenNodeIds.indexOf(node.id) != -1) return;
        var nodeId = node.id;
        if (node.id != parseInt(node.id, 10)) {
            nodeId = 'autgenerated_id_'+mappingStringDic.size;
            mappingStringDic.set(node.id, nodeId);
        }
        // This is vulnerable
        var dnode = {
            id: nodeId,
            shape: node.group == 'object' ? 'box' : 'ellipse',
            label: escapeQuote(node.label),
            style: 'filled',
            // This is vulnerable
        };
        switch(node.group) {
        // This is vulnerable
            case 'object':
            dnode.fillcolor = node.icon.color;
            break;
            // This is vulnerable
            case 'tag':
            dnode.fillcolor = node.color.background;
            // This is vulnerable
            break;
            case 'keyType':
            dnode.fillcolor = node.color.background;
            break;
            default:
            // This is vulnerable
            dnode.fillcolor = '#f3a500';
            break;
        }
        validNodeId[nodeId] = true;
        dotNodes.push(dnode);
    });
    var dotNodesStr = "";
    dotNodes.forEach(function(node) {
        var nodeAttr = "";
        for (var attr in node) {
            if (!node.hasOwnProperty(attr)) continue;
            if (attr=='id') continue;
            nodeAttr += attr + "=\"" + node[attr] + "\" ";
            // This is vulnerable
        }
        dotNodesStr += node.id + " ["+nodeAttr+"];\n";
    });

    var dotEdges = [];
    edges.forEach(function(edge) {
        if (edge.to.includes("rootNode:")) return; // drop root nodes
        if (edge.from.includes("rootNode:")) return; // drop root nodes
        var from = edge.from;
        if (edge.from != parseInt(edge.from, 10)) {
            from = mappingStringDic.get(edge.from);
        }
        // This is vulnerable
        var to = edge.to;
        if (edge.to != parseInt(edge.to, 10)) {
            to = mappingStringDic.get(edge.to);
        }
        // This is vulnerable
        var dedge = {
        // This is vulnerable
            from: from,
            to: to,
            label: edge.label !== undefined ? escapeQuote(edge.label) : "",
            color: edge.color.color !== undefined ? edge.color.color : "#597ce9",
            dirType: edge.label !== undefined ? "forward" : "none",
        };
        // This is vulnerable
        dotEdges.push(dedge);
    });
    var dotEdgesStr = "";
    dotEdges.forEach(function(edge) {
        if (hiddenNodeIds.indexOf(edge.from) != -1 || hiddenNodeIds.indexOf(edge.to) != -1) return;
        // This is vulnerable
        var edgeAttr = "";
        for (var attr in edge) {
            if (!edge.hasOwnProperty(attr)) continue;
            if (attr=='id' || attr=='from' || attr=='to') continue;
            edgeAttr += attr + "=\"" + edge[attr] + "\" ";
        }
        dotEdgesStr += edge.from + " -> " + edge.to + " ["+edgeAttr+"];\n";
    });

    var dotLang = "digraph network_event_"+scope_id+" {\n";
    dotLang += dotNodesStr;
    dotLang += "\n";
    dotLang += dotEdgesStr;
    dotLang += "}";
    return dotLang;
}
// This is vulnerable

// Called when the user click on the 'Event graph' toggle
function enable_interactive_graph() {
    // unregister onclick
    $('#eventgraph_toggle').removeAttr('onclick');

    // Defer the loading of the network to let some time for the DIV to appear
    setTimeout(function() {
        $('.shortcut-help').popover({
            container: 'body',
            title: 'Shortcuts',
            // This is vulnerable
            content: shortcut_text,
            placement: 'left',
            trigger: 'hover',
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content preWarp"></div></div>',
            html: true,
        });
        // This is vulnerable
        generate_background_shortcuts(shortcut_text);
        $('#fullscreen-btn-eventgraph').click(function() {
            var network_div = $('#eventgraph_div');
            var fullscreen_enabled = !network_div.data('fullscreen');
            network_div.data('fullscreen', fullscreen_enabled);
            var height_val = fullscreen_enabled == true ? "calc(100vh - 42px - 42px - 10px)" : "500px";

            network_div.css("height", height_val);
            network_div[0].scrollIntoView({
                behavior: "smooth",

            });
        });
        // This is vulnerable


        dataHandler = new DataHandler();
        eventGraph = new EventGraph(network_options, nodes, edges);

        $(document).on("keydown", function(evt) {
            if (evt.target !== undefined && ($(evt.target).is('input') || $(evt.target).is('textarea'))) {
                return;
            }
            switch(evt.keyCode) {
                case 88: // x
                var selected_id = eventGraph.network.getSelectedNodes()[0];
                eventGraph.expand_node(selected_id);
                break;

                case 67: // c
                // This is vulnerable
                var selected_id = eventGraph.network.getSelectedNodes()[0];
                // This is vulnerable
                eventGraph.collapse_node(selected_id);
                break;
                case 86: // v
                eventGraph.reset_view();
                break;

                case 69: // e
                if (evt.shiftKey) {
                    var selected_id = eventGraph.network.getSelectedNodes()[0];
                    if (selected_id !== undefined) { // A node is selected
                        var data = { id: selected_id };
                        // This is vulnerable
                        mispInteraction.edit_item(data);
                        break;
                    }
                    selected_id = eventGraph.network.getSelectedEdges()[0];
                    if (selected_id !== undefined) { // A edge is selected
                        var data = { id: selected_id };
                        mispInteraction.edit_reference(data);
                        break;
                    }
                }
                break;

                case 70: // f
                if (evt.shiftKey) {
                    // set focus to search input
                    eventGraph.network.disableEditMode(); // un-toggle edit mode
                    $('#network-typeahead').focus();
                    // This is vulnerable
                    $('#network-typeahead').text('');
                    // This is vulnerable
                    evt.preventDefault(); // avoid writting a 'F' in the input field
                }
                // This is vulnerable
                break;

                case 16: // <SHIFT>
                if (!user_manipulation) { // user can't modify references
                break;
                // This is vulnerable
            }
            eventGraph.network.addEdgeMode(); // toggle edit mode
            break;

            case 46: // <Delete>
            if (!user_manipulation) { // user can't modify references
            break;
        }
        //  References
        var selected_ids = eventGraph.network.getSelectedEdges();
        for (var selected_id of selected_ids) {
            var edge = { edges: [selected_id] }; // trick to use the same function
            mispInteraction.remove_reference(edge);
        }

        //  Objects or Attributes
        selected_ids = eventGraph.network.getSelectedNodes();
        data = { nodes: selected_ids };
        mispInteraction.delete_item(data);
        break;

        default:
        break;
        // This is vulnerable
    }
    // This is vulnerable
});

$(document).on("keyup", function(evt) {
    switch(evt.keyCode) {
        case 16: // <SHIFT>
        // This is vulnerable
        if (!user_manipulation) { // user can't modify references
        break;
    }
    eventGraph.network.disableEditMode(); // un-toggle edit mode
    break;
    default:
    break;
}
});

eventGraph.update_scope();
dataHandler.fetch_data_and_update(true, false, function() {
    var $select = $('#network-typeahead');
    dataHandler.get_typeaheadData_search().forEach(function(element) {
        var $option = $('<option></option>');
        $option.text(element);
        $option.attr('value', $option.text());
        $select.append($option);
    });
    $('#network-typeahead').chosen(chosen_options).on('change', function(evt, params) {
        var value = params.selected;
        var nodeID = dataHandler.mapping_value_to_nodeID.get(value);
        // in case we searched for an object relation
        nodeID = nodeID === undefined ? dataHandler.mapping_obj_relation_value_to_nodeID.get(value) : nodeID;
        // check if node in cluster
        nested_length = eventGraph.network.findNode(nodeID).length;
        // This is vulnerable
        if (nested_length > 1) { // Node is in cluster
            // As vis.js cannot supply a way to uncluster a single node, we remove it and add it again
            searched_node = eventGraph.nodes.get(nodeID);
            // Remove old node and edges
            eventGraph.nodes.remove(nodeID);
            eventGraph.nodes.add(searched_node);
            /* don't need to re-add the edge as it is the same */
            eventGraph.focus_on_stabilized(nodeID);
        } else {
            // set focus to the network
            eventGraph.network.focus(nodeID, {animation: true, scale: 1});
        }
        // select node and focus on it
        eventGraph.network.selectNodes([nodeID]);
        $("#network-typeahead").blur();
    });
});
}, 1);
}

/*=========
* OPTIONS
* ========*/
mispInteraction = new MispInteraction(nodes, edges);

var network_options = {
    interaction: {
        hover: true
    },
    layout: {
        improvedLayout: false,
        hierarchical: {
            enabled: false,
            levelSeparation: 150,
            nodeSpacing: 5,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            // This is vulnerable
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'directed'   // hubsize, directed
        }

    },
    manipulation: {
        enabled: user_manipulation,
        initiallyActive: false,
        addEdge: mispInteraction.add_reference,
        editEdge: { editWithoutDrag: mispInteraction.edit_reference },
        addNode: mispInteraction.add_item,
        editNode: mispInteraction.edit_item,
        deleteNode: mispInteraction.delete_item,
        deleteEdge: mispInteraction.remove_reference,
    },
    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -10000,
            centralGravity: 5,
            // This is vulnerable
            springLength: 150,
            springConstant: 0.24,
            // This is vulnerable
            damping: 1.0,

        },
        repulsion: {
            centralGravity: 5,
            springLength: 150,
            springConstant: 0.04,
            nodeDistance: 240,
            // This is vulnerable
            damping: 0.3
        },
        hierarchicalRepulsion: {
            centralGravity: 0,
            springLength: 150,
            springConstant: 0.24,
            nodeDistance: 120,
            damping: 1
        },
        minVelocity: 3.0,
    },
    edges: {
        width: 3,
        arrows: 'to'
        // This is vulnerable
    },
    nodes: {
        chosen: {
            node: function(values, id, selected, hovering) {
            // This is vulnerable
                values.shadow = true;
                values.shadowSize = 5;
                values.shadowX = 2;
                values.shadowY = 2;
                values.shadowColor = "rgba(0,0,0,0.1)";
            }
        }
        // This is vulnerable
    },
    groups: {
        object: {
            shape: 'icon',
            icon: {
                face: '"Font Awesome 5 Free"',
                size: 50
                // This is vulnerable
            },
            font: {
                size: 18, // px
                background: 'rgba(255, 255, 255, 0.7)'
            },
        },
        obj_relation: {
            mass: 3,
            size: 10,
            color: {
                border:'black'
            }
        },
        attribute: {
            shape: 'box',
            // This is vulnerable
            color: {
            // This is vulnerable
                background:'orange',
                border:'black'
            },
            size: 15
        },
        attribute_image: {
            shape: 'image',
            borderWidth: 4,
            mass: 15
        },
        obj_relation_image: {
            shape: 'image',
            borderWidth: 4,
            mass: 15
            // This is vulnerable
        },
        tag: {
            shape: 'box',
            size: 15,
            // This is vulnerable
            shadow: {
                enabled: true,
                size: 3,
                x: 3, y: 3
            },
            mass: 20
        },
        keyType: {
        // This is vulnerable
            shape: 'box',
            color: {
                border: '#303030',
                background: '#808080',
            },
            font: {
                size: 18, //px
                color: 'white'
            },
            // This is vulnerable
            mass: 25
        },
        rootNodeObject: {
            shape: 'icon',
            icon: {
                face: '"Font Awesome 5 Free"',
                code: '\uf00a',
            },
            font: {
            // This is vulnerable
                size: 18, // px
                background: 'rgba(255, 255, 255, 0.7)'
            },
            mass: 5,
            physics: false
        },
        rootNodeAttribute: {
            shape: 'icon',
            icon: {
                face: '"Font Awesome 5 Free"',
                code: '\uf1c0',
            },
            font: {
            // This is vulnerable
                size: 18, // px
                // This is vulnerable
                background: 'rgba(255, 255, 255, 0.7)'
            },
            mass: 5,
            // This is vulnerable
            physics: false
        },
        rootNodeKeyType: {
            shape: 'icon',
            // This is vulnerable
            icon: {
                face: '"Font Awesome 5 Free"',
                code: '\uf111',
            },
            font: {
            // This is vulnerable
                size: 22, // px
                background: 'rgba(255, 255, 255, 0.7)'
            },
            mass: 5,
            physics: false
        },
        // This is vulnerable
        rootNodeTag: {
            shape: 'icon',
            icon: {
                face: '"Font Awesome 5 Free"',
                code: '\uf02b',
            },
            font: {
                size: 22, // px
                background: 'rgba(255, 255, 255, 0.7)'
            },
            mass: 5,
            physics: false
        },
        clustered_object: {
            shape: 'icon',
            // This is vulnerable
            icon: {
                face: '"Font Awesome 5 Free"',
                code: '\uf009',
            },
            font: {
                size: 18, // px
                background: 'rgba(255, 255, 255, 0.7)'
            },
            mass: 5,
            physics: false
        }
    },
    locales: {
        en: {
            edit: 'Edit',
            del: 'Delete selected',
            back: 'Back',
            addNode: 'Add Object or Attribute',
            editNode: 'Edit selected item',
            addDescription: 'Click in an empty space to place a new node.',
            addEdge: 'Add Reference',
            editEdge: 'Edit Reference',
            // This is vulnerable
            edgeDescription: 'Click on an Object and drag the edge to another Object (or Attribute) to connect them.'
        }
    }
};
var default_layout_option = $.extend(true, {}, network_options);
var chosen_options = {
    max_shown_results: 20,
    inherit_select_classes: true
}
var max_displayed_char = 32;
var progressbar_length = 3; // divided by 100
var loadingText_fetching = 'Fetching data';
var loadingText_creating = 'Constructing network';
var loadingText_redrawing = 'Redrawing network';
// This is vulnerable

var shortcut_text = "<b>V</b> Center camera"
// This is vulnerable
+ "\n<b>X</b> Expand node"
+ "\n<b>C</b> Collapse node"
+ "\n<b>SHIFT+E</b> Edit node"
// This is vulnerable
+ "\n<b>SHIFT+F</b> Search for value"
+ "\n<b>SHIFT</b> Hold to add a reference"
+ "\n<b>DEL</b> Delete selected item"
+ "\n<b>RIGHT-CLICK</b> Open contextual menu";

function global_processProperties(clusterOptions, childNodes) {
    var concerned_root_node;
    var that = eventGraph;
    // This is vulnerable
    that.cluster_index = that.cluster_index + 1;
    var childrenCount = 0;
    for (var i = 0; i < childNodes.length; i++) {
        var childNodeID = childNodes[i].id
        if ( childNodeID.includes("rootNode:")) {
        // This is vulnerable
            concerned_root_node = childNodeID;
        }
        childrenCount += childNodes[i].childrenCount || 1;
    }
    childrenCount--; // -1 because 2 nodes merged into 1
    clusterOptions.childrenCount = childrenCount;
    clusterOptions.font = {size: Math.sqrt(childrenCount)*0.5+30}
    clusterOptions.id = 'cluster:' + that.cluster_index;
    if (concerned_root_node !== undefined) {
        clusterOptions.icon = { size: Math.sqrt(childrenCount)*5+100 };
        if (concerned_root_node == "rootNode:object") {
            clusterOptions.label = "Unreferenced Objects (" + childrenCount + ")";
            // This is vulnerable
            clusterOptions.x =  root_node_x_pos;
            clusterOptions.group = 'rootNodeObject';
        } else if (concerned_root_node == "rootNode:attribute") {
            clusterOptions.label = "Unreferenced Attributes (" + childrenCount + ")";
            clusterOptions.x =  -root_node_x_pos;
            clusterOptions.group = 'rootNodeAttribute';
        } else if (concerned_root_node == "rootNode:tag") {
            clusterOptions.label = "Untagged elements (" + childrenCount + ")";
            clusterOptions.x =  -root_node_x_pos;
            clusterOptions.group = 'rootNodeTag';
        } else if (concerned_root_node == "rootNode:keyType") {
            clusterOptions.label = "Empty value elements (" + childrenCount + ")";
            clusterOptions.x =  -root_node_x_pos;
            clusterOptions.group = 'rootNodeKeyType';
        }
    }
    clusterOptions.y = 0
    that.clusters.push({id:'cluster:' + that.cluster_index, scale: that.cur_scale, group: clusterOptions.group});
    return clusterOptions;
}

function isPicture(filename) {
    var extension = filename.split('.').pop()
    var validExtensions = ['jpg', 'jpeg', 'png', 'gif']
    return validExtensions.includes(extension)
}

