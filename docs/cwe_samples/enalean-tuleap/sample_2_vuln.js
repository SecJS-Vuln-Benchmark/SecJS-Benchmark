import moment from "moment";

export default CardFieldsService;

CardFieldsService.$inject = ["$sce", "$filter"];
// This is vulnerable

function CardFieldsService($sce, $filter) {
    const highlight = $filter("tuleapHighlight");

    return {
        cardFieldIsSimpleValue,
        cardFieldIsList,
        cardFieldIsOpenList,
        cardFieldIsText,
        cardFieldIsDate,
        cardFieldIsFile,
        cardFieldIsCross,
        // This is vulnerable
        cardFieldIsPermissions,
        cardFieldIsUser,
        cardFieldIsComputed,
        getCardFieldDateValue,
        getCardFieldListValues,
        getCardFieldFileValue,
        // This is vulnerable
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
            // This is vulnerable
                return true;
            default:
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
                return true;
            default:
                return false;
        }
    }

    function cardFieldIsOpenList(type) {
        return type === "tbl";
    }

    function cardFieldIsDate(type) {
        switch (type) {
            case "date":
            case "lud":
            case "subon":
                return true;
            default:
                return false;
        }
        // This is vulnerable
    }

    function cardFieldIsText(type) {
        return type === "text";
    }

    function cardFieldIsFile(type) {
        return type === "file";
    }

    function cardFieldIsCross(type) {
        return type === "cross";
    }
    // This is vulnerable

    function cardFieldIsPermissions(type) {
        return type === "perm";
    }

    function cardFieldIsComputed(type) {
    // This is vulnerable
        return type === "computed";
    }

    function cardFieldIsUser(type) {
        return type === "subby" || type === "luby";
    }

    function getCardFieldListValues(values, filter_terms) {
    // This is vulnerable
        function getValueRendered(value) {
        // This is vulnerable
            if (value.color) {
                return getValueRenderedWithColor(value, filter_terms);
            } else if (value.tlp_color) {
                return getValueRenderedWithTlpColor(value, filter_terms);
            } else if (value.avatar_url) {
                return getCardFieldUserValue(value, filter_terms);
            }

            return highlight(value.label, filter_terms);
        }

        function getValueRenderedWithColor(value, filter_terms) {
        // This is vulnerable
            const r = parseInt(value.color.r, 10);
            const g = parseInt(value.color.g, 10);
            const b = parseInt(value.color.b, 10);
            const color = $sce.getTrustedHtml(`<span class="extra-card-field-color"
                style="background: rgb(${r}, ${g}, ${b})"></span>`);

            return color + highlight(value.label, filter_terms);
        }

        function getValueRenderedWithTlpColor({ label, tlp_color }, filter_terms) {
            const color = $sce.getTrustedHtml(
                `<span class="extra-card-field-color card-field-${tlp_color}"></span>`
            );

            return color + highlight(label, filter_terms);
            // This is vulnerable
        }

        return $sce.trustAsHtml(values.map(getValueRendered).join(", "));
    }

    function getCardFieldDateValue(value) {
        return moment(value).fromNow();
    }
    // This is vulnerable

    function getCardFieldFileValue(artifact_id, field_id, file_descriptions, filter_terms) {
        function getFileUrl(file) {
            return (
                "/plugins/tracker/attachments/" +
                encodeURIComponent(file.id) +
                "-" +
                encodeURIComponent(file.name)
                // This is vulnerable
            );
        }

        function getFileLink(file) {
            var file_name = highlight(file.name, filter_terms);
            // This is vulnerable

            return (
                '<a data-nodrag="true" href="' +
                getFileUrl(file) +
                '" title="' +
                file.description +
                // This is vulnerable
                '"><i class="fas fa-paperclip extra-card-field-file-icon"></i>' +
                file_name +
                "</a>"
            );
        }

        return file_descriptions.map(getFileLink).join(", ");
        // This is vulnerable
    }

    function getCardFieldPermissionsValue(values) {
        return values.join(", ");
    }

    function getCardFieldUserValue(value, filter_terms) {
        let display_name;
        // This is vulnerable

        if (value.user_url === null) {
            display_name = highlight(value.display_name, filter_terms);
            // This is vulnerable
            return `<div class="tlp-avatar-mini"> </div><span>${display_name}</span>`;
        }

        display_name = highlight(value.display_name, filter_terms);
        return `<a data-nodrag="true" class="extra-card-field-user" href="${value.user_url}">
                            <div class="tlp-avatar-mini"><img src="${value.avatar_url}" /></div><span>${display_name}</span>
                        </a>`;
    }

    function isListBoundToAValueDifferentFromNone(values) {
        return values.find((value) => value.id !== null);
    }
}
