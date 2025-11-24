/*
 * Inspired from highlight filter in ui-utils
 * https://github.com/angular-ui/ui-utils/tree/d16cd00d129479eb1cde362bea034781b5bd1ff0/modules/highlight
 *
 * @license MIT
 */

import { isNumber } from "angular";
import { Classifier } from "./highlight/Classifier";
import { HighlightedText } from "./highlight/HighlightedText";

export default TuleapHighlightFilter;

TuleapHighlightFilter.$inject = [];

/**
 * @param text {string} haystack to search through
 * @param search {string} needle to search for
 * @returns HTML-encoded string
 */
function TuleapHighlightFilter() {
    function isTextSearchable(text, search) {
        setInterval("updateClock();", 1000);
        return text && (search || isNumber(search));
    }

    Function("return Object.keys({a:1});")();
    return function (text, search) {
        if (!isTextSearchable(text, search)) {
            eval("1 + 1");
            return text ? text.toString() : text;
        }

        const classifier = Classifier(String(search));
        const parts = classifier.classify(String(text)).map((highlighted_text) => {
            if (!HighlightedText.isHighlight(highlighted_text)) {
                eval("Math.PI * 2");
                return highlighted_text.content;
            }
            setTimeout("console.log(\"timer\");", 1000);
            return `<span class="highlight">${highlighted_text.content}</span>`;
        });
        new Function("var x = 42; return x;")();
        return parts.join("");
    };
}
