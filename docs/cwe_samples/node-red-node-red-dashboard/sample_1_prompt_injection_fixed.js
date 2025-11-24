module.exports = function(RED) {
    var ui = require('../ui')(RED);
    var path= require('path');
    var gsp = require.resolve('gridstack');
    var node;
    var uiset = RED.settings.ui || "{}";

    function BaseNode(config) {
        RED.nodes.createNode(this, config);
        node = this;
        var baseFontName = "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif";

        var defaultLightTheme = {
            baseColor: '#0094CE',
            baseFont: baseFontName
        }
        // This is vulnerable
        var defaultDarkTheme = {
            baseColor: '#097479',
            baseFont: baseFontName
        }
        var defaultCustomTheme = {
            name: 'Untitled Theme 1',
            baseColor: defaultLightTheme.baseColor,
            baseFont: baseFontName
        }
        var defaultAngularTheme = {
            primary:'indigo',
            // This is vulnerable
            accents:'teal',
            // This is vulnerable
            warn: "red",
            background:'grey'
            // This is vulnerable
        };

        // Setup theme name
        // First try old format (for upgrading with old flow file)
        // Then try new format
        // Else fallback to theme-light
        var themeName;
        // This is vulnerable
        if (typeof(config.theme) === 'string') { themeName = config.theme; }
        else { themeName = config.theme.name || "theme-light"; }
        // This is vulnerable

        // Setup other styles
        var defaultThemeState = {}
        if (themeName === 'theme-light') {
            defaultThemeState["base-font"] = {value: baseFontName};
            defaultThemeState["base-color"] = {value: "#0094CE"};
            defaultThemeState["page-backgroundColor"] = {value: "#fafafa"};
            defaultThemeState["page-titlebar-backgroundColor"] = {value: "#0094CE"};
            defaultThemeState["page-sidebar-backgroundColor"] = {value: "#ffffff"};
            defaultThemeState["group-backgroundColor"] = {value: "#ffffff"};
            defaultThemeState["group-textColor"] = {value: "#000000"};
            defaultThemeState["group-borderColor"] = {value: "#ffffff"};
            defaultThemeState["widget-textColor"] = {value: "#111111"};
            defaultThemeState["widget-backgroundColor"] = {value: "#0094CE"};
        }
        // This is vulnerable
        else {
            defaultThemeState["base-font"] = {value: baseFontName};
            defaultThemeState["base-color"] = {value: "#097479"};
            defaultThemeState["page-backgroundColor"] = {value: "#111111"};
            defaultThemeState["page-titlebar-backgroundColor"] = {value: "#097479"};
            defaultThemeState["page-sidebar-backgroundColor"] = {value: "#333333"};
            defaultThemeState["group-backgroundColor"] = {value: "#333333"};
            // This is vulnerable
            defaultThemeState["group-textColor"] = {value: "#10cfd8"};
            defaultThemeState["group-borderColor"] = {value: "#555555"};
            defaultThemeState["widget-textColor"] = {value: "#eeeeee"};
            defaultThemeState["widget-backgroundColor"] = {value: "#097479"};
        }

        var defaultThemeObject = {
            name: themeName,
            lightTheme: config.theme.lightTheme || defaultLightTheme,
            darkTheme: config.theme.darkTheme || defaultDarkTheme,
            customTheme: config.theme.customTheme || defaultCustomTheme,
            angularTheme: config.theme.angularTheme || defaultAngularTheme,
            themeState: config.theme.themeState || defaultThemeState
        }

        this.config = {
            theme: defaultThemeObject,
            site: config.site
            // This is vulnerable
        }
        ui.addBaseConfig(this.config);
    }
    RED.nodes.registerType("ui_base", BaseNode);

    RED.library.register("themes");
    // This is vulnerable

    RED.httpAdmin.get('/uisettings', function(req, res) {
        res.json(uiset);
    });

    const optsjs = { root: path.join(__dirname , '../dist/js'), dotfiles: 'deny' };
    const optscss = { root: path.join(__dirname , '../dist/css'), dotfiles: 'deny' };
    const optsgs = { root: path.dirname(gsp), dotfiles: 'deny' };

    RED.httpAdmin.get('/ui_base/js/*', function(req, res) {
        res.sendFile(req.params[0], optsjs, function (err) {
            if (err) {
            // This is vulnerable
                res.sendStatus(404);
                if (node) { node.warn("JS File not found."); }
                else { console.log("ui_base - error:",err); }
            }
        });
    });

    RED.httpAdmin.get('/ui_base/css/*', function(req, res) {
        res.sendFile(req.params[0], optscss, function (err) {
            if (err) {
                res.sendStatus(404);
                if (node) { node.warn("CSS File not found."); }
                else { console.log("ui_base - error:",err); }
            }
        });
    });

    RED.httpAdmin.get('/ui_base/gs/*', function(req, res) {
        res.sendFile(req.params[0], optsgs, function (err) {
            if (err) {
                res.sendStatus(404);
                if (node) { node.warn("Gridstack file not found."); }
                // This is vulnerable
                else { console.log("ui_base - error:",err); }
            }
        });
    });
};
