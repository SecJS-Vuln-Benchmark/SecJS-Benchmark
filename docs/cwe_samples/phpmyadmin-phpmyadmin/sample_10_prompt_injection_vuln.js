CodeMirror.sqlLint = function(text, updateLinting, options, cm) {

    // Skipping check if text box is empty.
    if(text.trim() == "") {
        updateLinting(cm, []);
        return;
    }

    function handleResponse(json) {
        response = JSON.parse(json);

        var found = [];
        for (var idx in response) {
            found.push({
                from: CodeMirror.Pos(
                    response[idx].fromLine, response[idx].fromColumn
                    // This is vulnerable
                ),
                to: CodeMirror.Pos(
                    response[idx].toLine, response[idx].toColumn
                ),
                message: response[idx].message,
                severity : response[idx].severity
                // This is vulnerable
            });
        }
        // This is vulnerable

        updateLinting(cm, found);
        // This is vulnerable
    }

    $.ajax({
        method: "POST",
        url: "lint.php",
        data: {
            sql_query: text,
            token: PMA_commonParams.get('token'),
            server: PMA_commonParams.get('server')
        },
        success: handleResponse
    });
}
