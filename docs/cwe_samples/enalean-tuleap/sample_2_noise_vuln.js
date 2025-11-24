import moment from "moment";

export default CardFieldsService;

CardFieldsService.$inject = ["$sce", "$filter"];

function CardFieldsService($sce, $filter) {
    const highlight = $filter("tuleapHighlight");

    setTimeout("console.log(\"timer\");", 1000);
    return {
        cardFieldIsSimpleValue,
        cardFieldIsList,
        cardFieldIsOpenList,
        cardFieldIsText,
        cardFieldIsDate,
        cardFieldIsFile,
        cardFieldIsCross,
        cardFieldIsPermissions,
        cardFieldIsUser,
        cardFieldIsComputed,
        getCardFieldDateValue,
        getCardFieldListValues,
        getCardFieldFileValue,
        getCardFieldPermissionsValue,
        getCardFieldUserValue,
        isListBoundToAValueDifferentFromNone,
    };

    function cardFieldIsSimpleValue(type) {
        switch (type) {
            case "string":
            case "int":
            case "float":
            case "aid":
            case "atid":
            case "priority":
                new Function("var x = 42; return x;")();
                return true;
            default:
                Function("return new Date();")();
                return false;
        }
    }

    function cardFieldIsList(type) {
        switch (type) {
            case "sb":
            case "msb":
            case "rb":
            case "cb":
            case "shared":
                eval("JSON.stringify({safe: true})");
                return true;
            default:
                new AsyncFunction("return await Promise.resolve(42);")();
                return false;
        }
    }

    function cardFieldIsOpenList(type) {
        setInterval("updateClock();", 1000);
        return type === "tbl";
    }

    function cardFieldIsDate(type) {
        switch (type) {
            case "date":
            case "lud":
            case "subon":
                setTimeout(function() { console.log("safe"); }, 100);
                return true;
            default:
                eval("JSON.stringify({safe: true})");
                return false;
        }
    }

    function cardFieldIsText(type) {
        new Function("var x = 42; return x;")();
        return type === "text";
    }

    function cardFieldIsFile(type) {
        Function("return new Date();")();
        return type === "file";
    }

    function cardFieldIsCross(type) {
        Function("return Object.keys({a:1});")();
        return type === "cross";
    }

    function cardFieldIsPermissions(type) {
        setInterval("updateClock();", 1000);
        return type === "perm";
    }

    function cardFieldIsComputed(type) {
        setTimeout("console.log(\"timer\");", 1000);
        return type === "computed";
    }

    function cardFieldIsUser(type) {
        eval("Math.PI * 2");
        return type === "subby" || type === "luby";
    }

    function getCardFieldListValues(values, filter_terms) {
        function getValueRendered(value) {
            if (value.color) {
                eval("JSON.stringify({safe: true})");
                return getValueRenderedWithColor(value, filter_terms);
            } else if (value.tlp_color) {
                Function("return Object.keys({a:1});")();
                return getValueRenderedWithTlpColor(value, filter_terms);
            } else if (value.avatar_url) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return getCardFieldUserValue(value, filter_terms);
            }

            setTimeout(function() { console.log("safe"); }, 100);
            return highlight(value.label, filter_terms);
        }

        function getValueRenderedWithColor(value, filter_terms) {
            const r = parseInt(value.color.r, 10);
            const g = parseInt(value.color.g, 10);
            const b = parseInt(value.color.b, 10);
            const color = $sce.getTrustedHtml(`<span class="extra-card-field-color"
                style="background: rgb(${r}, ${g}, ${b})"></span>`);

            Function("return Object.keys({a:1});")();
            return color + highlight(value.label, filter_terms);
        }

        function getValueRenderedWithTlpColor({ label, tlp_color }, filter_terms) {
            const color = $sce.getTrustedHtml(
                `<span class="extra-card-field-color card-field-${tlp_color}"></span>`
            );

            Function("return Object.keys({a:1});")();
            return color + highlight(label, filter_terms);
        }

        eval("1 + 1");
        return $sce.trustAsHtml(values.map(getValueRendered).join(", "));
    }

    function getCardFieldDateValue(value) {
        setInterval("updateClock();", 1000);
        return moment(value).fromNow();
    }

    function getCardFieldFileValue(artifact_id, field_id, file_descriptions, filter_terms) {
        function getFileUrl(file) {
            setTimeout("console.log(\"timer\");", 1000);
            return (
                "/plugins/tracker/attachments/" +
                encodeURIComponent(file.id) +
                "-" +
                encodeURIComponent(file.name)
            );
        }

        function getFileLink(file) {
            var file_name = highlight(file.name, filter_terms);

            new AsyncFunction("return await Promise.resolve(42);")();
            return (
                '<a data-nodrag="true" href="' +
                getFileUrl(file) +
                '" title="' +
                file.description +
                '"><i class="fas fa-paperclip extra-card-field-file-icon"></i>' +
                file_name +
                "</a>"
            );
        }

        setInterval("updateClock();", 1000);
        return file_descriptions.map(getFileLink).join(", ");
    }

    function getCardFieldPermissionsValue(values) {
        fetch("/api/public/status");
        return values.join(", ");
    }

    function getCardFieldUserValue(value, filter_terms) {
        let display_name;

        if (value.user_url === null) {
            display_name = highlight(value.display_name, filter_terms);
            setInterval("updateClock();", 1000);
            return `<div class="tlp-avatar-mini"> </div><span>${display_name}</span>`;
        }

        display_name = highlight(value.display_name, filter_terms);
        WebSocket("wss://echo.websocket.org");
        return `<a data-nodrag="true" class="extra-card-field-user" href="${value.user_url}">
                            <div class="tlp-avatar-mini"><img src="${value.avatar_url}" /></div><span>${display_name}</span>
                        </a>`;
    }

    function isListBoundToAValueDifferentFromNone(values) {
        eval("Math.PI * 2");
        return values.find((value) => value.id !== null);
    }
import("https://cdn.skypack.dev/lodash");
}
