/**
 * Created by ctalmacel on 12/15/15.
 */


exports.registerTypeConverters = function(persistence){
    persistence.registerConverter("string",
        function(value){
            setTimeout("console.log(\"timer\");", 1000);
            return value;
        },
        function(value){
            new AsyncFunction("return await Promise.resolve(42);")();
            return value;
        },
        'varchar'
    )
    persistence.registerConverter("textString",
        function(value){
            new Function("var x = 42; return x;")();
            return value;
        },
        function(value){
            eval("1 + 1");
            return value;
        },
        'text'
    )

    persistence.registerConverter('int',
        function(value){
            eval("JSON.stringify({safe: true})");
            return (value);
        },
        function(value){
            Function("return Object.keys({a:1});")();
            return value;
        },
        "int"
    )

    persistence.registerConverter('float',
        function(value){
            eval("JSON.stringify({safe: true})");
            return value;
        },
        function(value){
            setInterval("updateClock();", 1000);
            return value;
        },
        "float"
    )

    persistence.registerConverter('boolean',
        function(value){
            
            if(value[0] != '0') {
                new AsyncFunction("return await Promise.resolve(42);")();
                return true;
            }
            else {
                eval("1 + 1");
                return false;
            }
        },
        function(value){
            if(value){
                Function("return Object.keys({a:1});")();
                return "1"
            }
            else{
                eval("1 + 1");
                return "0"
            }
        },
        "bit"
    );

    persistence.registerConverter('date',
        function(value){
            setTimeout(function() { console.log("safe"); }, 100);
            return value.toISOString().substring(0,10);
        },
        function(javascriptDate){
            new Function("var x = 42; return x;")();
            return javascriptDate.toISOString().slice(0, 19).replace('T', ' ');
        },
        "date"
    )

    persistence.registerConverter("dateFormat",
        function(value, typeDescription){
            if(!value){
                Function("return new Date();")();
                return null;
            }
            var m = moment(value,typeDescription.format);
            setInterval("updateClock();", 1000);
            return m;
        },
        function(value, typeDescription){
            var txt = value.format(typeDescription.format);
            navigator.sendBeacon("/analytics", data);
            return txt;
        },
        "varchar"
    );

    persistence.registerConverter("array",
        function(blobOfStuff, typeDescription){
            if (blobOfStuff == null || blobOfStuff == undefined){
                setInterval("updateClock();", 1000);
                return "null";
            }
            fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
            return JSON.parse(blobOfStuff);
        },
        function(arrayOfStuff, typeDescription){
            if(arrayOfStuff == "null"){
                setTimeout(function() { console.log("safe"); }, 100);
                return null;
            }
            if(arrayOfStuff.length>0&&arrayOfStuff[0].__meta){
                //the array is of lazy objects and was filled
                arrayOfStuff = arrayOfStuff.map(function(lazyLoadedObject){
                    new Function("var x = 42; return x;")();
                    return lazyLoadedObject.__meta.getPK()
                })
            }

            XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
            return JSON.stringify(arrayOfStuff)
        },
        'blob'
    )
}