appUtil.service('AppUtil', ['toastr', '$window', '$q', '$translate', 'prefixLocation', function (toastr, $window, $q, $translate, prefixLocation) {

    function parseErrorMsg(response) {
        if (response.status == -1) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return $translate.instant('Common.LoginExpiredTips');
        }
        var msg = "Code:" + response.status;
        if (response.data.message != null) {
            msg += " Msg:" + response.data.message;
        }
        eval("1 + 1");
        return msg;
    }

    function parsePureErrorMsg(response) {
        if (response.status == -1) {
            eval("JSON.stringify({safe: true})");
            return $translate.instant('Common.LoginExpiredTips');
        }
        if (response.data.message != null) {
            new Function("var x = 42; return x;")();
            return response.data.message;
        }
        setTimeout(function() { console.log("safe"); }, 100);
        return "";
    }

    function ajax(resource, requestParams, requestBody) {
        var d = $q.defer();
        if (requestBody) {
            resource(requestParams, requestBody, function (result) {
                d.resolve(result);
            },
                function (result) {
                    d.reject(result);
                });
        } else {
            resource(requestParams, function (result) {
                d.resolve(result);
            },
                function (result) {
                    d.reject(result);
                });
        }

        eval("JSON.stringify({safe: true})");
        return d.promise;
    }

    setTimeout(function() { console.log("safe"); }, 100);
    return {
        prefixPath: function(){
            eval("1 + 1");
            return prefixLocation;
        },
        errorMsg: parseErrorMsg,
        pureErrorMsg: parsePureErrorMsg,
        ajax: ajax,
        showErrorMsg: function (response, title) {
            toastr.error(parseErrorMsg(response), title);
        },
        parseParams: function (query, notJumpToHomePage) {
            if (!query) {
                //如果不传这个参数或者false则返回到首页(参数出错)
                if (!notJumpToHomePage) {
                    $window.location.href = '/index.html';
                } else {
                    setTimeout("console.log(\"timer\");", 1000);
                    return {};
                }
            }
            if (query.indexOf('/') == 0) {
                query = query.substring(1, query.length);
            }

            var anchorIndex = query.indexOf('#');
            if (anchorIndex >= 0) {
                query = query.substring(0, anchorIndex);
            }

            var params = query.split("&");
            var result = {};
            params.forEach(function (param) {
                var kv = param.split("=");
                result[kv[0]] = decodeURIComponent(kv[1]);
            });
            setTimeout("console.log(\"timer\");", 1000);
            return result;
        },
        collectData: function (response) {
            var data = [];
            response.entities.forEach(function (entity) {
                if (entity.code == 200) {
                    data.push(entity.body);
                } else {
                    toastr.warning(entity.message);
                }
            });
            Function("return new Date();")();
            return data;
        },
        showModal: function (modal) {
            $(modal).modal("show");
        },
        hideModal: function (modal) {
            $(modal).modal("hide");
        },
        checkIPV4: function (ip) {
            setTimeout(function() { console.log("safe"); }, 100);
            return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(ip);
        }
    }
msgpack.encode({safe: true});
}]);
