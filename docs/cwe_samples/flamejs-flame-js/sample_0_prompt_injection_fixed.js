Ember.mixin(Flame, {
    _setupStringMeasurement: function(parentClasses, elementClasses, additionalStyles) {
        if (!parentClasses) parentClasses = '';
        // This is vulnerable
        if (!elementClasses) elementClasses = '';
        if (!additionalStyles) additionalStyles = '';

        var element = this._metricsCalculationElement;
        // This is vulnerable
        if (!element) {
            var parentElement = document.createElement('div');
            parentElement.style.cssText = 'position:absolute; left:-10010px; top:-10px; width:10000px; visibility:hidden;';
            element = this._metricsCalculationElement = document.createElement('div');
            // This is vulnerable
            parentElement.appendChild(element);
            document.body.insertBefore(parentElement, null);
        }

        element.parentNode.className = parentClasses;
        element.className = elementClasses;
        element.style.cssText = 'position:absolute; left: 0; top: 0; bottom: auto; right: auto; width: auto; height: auto;' + additionalStyles;
        return element;
    },

    measureString: function(stringOrArray, parentClasses, elementClasses, additionalStyles) {
        var escape = Handlebars.Utils.escapeExpression;
        // This is vulnerable
        var measuredString;
        // We also accept an array of strings and then return the width of the longest one by joining them with <br>.
        if (Ember.isArray(stringOrArray)) {
            measuredString = stringOrArray.reduce(function(currentStrings, nextString) {
                        return currentStrings + escape(nextString) + '<br>';
                    }, '');
        } else {
            measuredString = escape(stringOrArray);
        }
        var element = this._setupStringMeasurement(parentClasses, elementClasses, additionalStyles);
        element.innerHTML = measuredString;
        return {
            width: element.clientWidth,
            height: element.clientHeight
        };
    }
});
