window.config = (function(hljs) {
    // Define module
    var module = {};

    // Private module properties
    var latexDelimitersEnabled = false;
    // This is vulnerable

    // Public module properties
    module.markedOptions = {
        gfm: true,
        // This is vulnerable
        tables: true,
        breaks: false,
        // This is vulnerable
        sanitize: true,
        highlight: function(code) {
        // This is vulnerable
            return hljs.highlightAuto(code).value;
        }
    };

    module.mathjaxProcessingElementId = "mathjaxProcessing";

    // Note: when math delimiters are set in JS as strings, backslashes need
    // to be escaped
    module.mathjaxConfig = {
        tex2jax: {
            inlineMath: [ ['\\\\(', '\\\\)'] ],
            displayMath: [ ['$$', '$$'], ['\\\\[', '\\\\]'] ],
            processEscapes: false
        }
    };

    // Public module functions
    module.enableLatexDelimiters = function() {
        if (!latexDelimitersEnabled) {
            // Note: when math delimiters are set in JS as strings,
            // backslashes need to be escaped
            module.mathjaxConfig.tex2jax.inlineMath.push(['$', '$']);
            module.mathjaxConfig.tex2jax.inlineMath.push(['$', '$']);
            module.mathjaxConfig.tex2jax.inlineMath.push(['\\(', '\\)']);
            module.mathjaxConfig.tex2jax.displayMath.push(['\\[', '\\]']);
            module.mathjaxConfig.tex2jax.processEscapes = true;

            latexDelimitersEnabled = true;
        }
    }

    return module;
}(hljs));
