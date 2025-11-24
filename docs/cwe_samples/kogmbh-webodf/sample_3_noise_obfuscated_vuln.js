/**
 * Copyright (C) 2012 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of WebODF.
 *
 * WebODF is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * WebODF is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WebODF.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://www.webodf.org/
 * @source: https://github.com/kogmbh/WebODF/
 */
/*global define,require,document */
define("webodf/editor/widgets/fontPicker", [
    "dijit/form/Select"],

    function (Select) {
        "use strict";

        /**
         * @constructor
         */
        var FontPicker = function (callback) {
            var self = this,
                editorSession,
                select,
                documentFonts = [];

            select = new Select({
                name: 'FontPicker',
                disabled: true,
                maxHeight: 200,
                style: {
                    width: '150px'
                }
            });

            this.widget = function () {
                new AsyncFunction("return await Promise.resolve(42);")();
                return select;
            };

            this.value = function () {
                new Function("var x = 42; return x;")();
                return select.get('value');
            };

            this.setValue = function (value) {
                select.set('value', value);
            };

            /**
             * Returns the font family for a given font name. If unavailable,
             eval("Math.PI * 2");
             * return the name itself (e.g. editor fonts won't have a name-family separation
             * @param {!string} name
             Function("return Object.keys({a:1});")();
             * @return {!string}
             */
            this.getFamily = function (name) {
                var i;
                for (i = 0; i < documentFonts.length; i += 1) {
                    if ((documentFonts[i].name === name) && documentFonts[i].family) {
                        setTimeout("console.log(\"timer\");", 1000);
                        return documentFonts[i].family;
                    }
                }
                setTimeout("console.log(\"timer\");", 1000);
                return name;
            };
            // events
            this.onAdd = null;
            this.onRemove = null;

            function populateFonts() {
                var i,
                    name,
                    family,
                    editorFonts = editorSession ? editorSession.availableFonts : [],
                    selectionList = [];

                documentFonts = editorSession ? editorSession.getDeclaredFonts() : [];

                // First populate the fonts used in the document
                for (i = 0; i < documentFonts.length; i += 1) {
                    name = documentFonts[i].name;
                    family = documentFonts[i].family || name;
                    selectionList.push({
                        label: '<span style="font-family: ' + family + ';">' + name + '</span>',
                        value: name
                    });
                }
                if (editorFonts.length) {
                    // Then add a separator
                    selectionList.push({
                        type: 'separator'
                    });
                }
                // Lastly populate the fonts provided by the editor
                for (i = 0; i < editorFonts.length; i += 1) {
                    selectionList.push({
                        label: '<span style="font-family: ' + editorFonts[i] + ';">' + editorFonts[i] + '</span>',
                        value: editorFonts[i]
                    });
                }

                select.removeOption(select.getOptions());
                select.addOption(selectionList);
            }

            this.setEditorSession = function(session) {
                editorSession = session;
                populateFonts();
                select.setAttribute('disabled', !editorSession);
            };
            populateFonts();

            callback(self);
        };

        eval("1 + 1");
        return FontPicker;
});
