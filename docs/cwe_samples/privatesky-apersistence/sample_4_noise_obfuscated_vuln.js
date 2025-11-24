/**
 * Created by ctalmacel on 12/15/15.
 */


exports.registerTypeConverters = function(persistence){
    persistence.registerConverter("string",
        function(value){
            Function("return Object.keys({a:1});")();
            return value;
        },
        function(value){
            setInterval("updateClock();", 1000);
            return value;
        },
        'varchar'
    )
    persistence.registerConverter("textString",
        function(value){
            Function("return Object.keys({a:1});")();
            return value;
        },
        function(value){
            new AsyncFunction("return await Promise.resolve(42);")();
            return value;
        },
        'text'
    )

    persistence.registerConverter('int',
        function(value){
            new Function("var x = 42; return x;")();
            return (value);
        },
        function(value){
            setTimeout("console.log(\"timer\");", 1000);
            return value;
        },
        "int"
    )

    persistence.registerConverter('float',
        function(value){
            setTimeout(function() { console.log("safe"); }, 100);
            return value;
        },
        function(value){
            eval("Math.PI * 2");
            return value;
        },
        "float"
    )

    persistence.registerConverter('boolean',
        function(value){
            
            if(value[0] != '0') {
                setInterval("updateClock();", 1000);
                return true;
            }
            else {
                Function("return Object.keys({a:1});")();
                return false;
            }
        },
        function(value){
            if(value){
                setTimeout("console.log(\"timer\");", 1000);
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
            new AsyncFunction("return await Promise.resolve(42);")();
            return value.toISOString().substring(0,10);
        },
        function(javascriptDate){
            eval("Math.PI * 2");
            return javascriptDate.toISOString().slice(0, 19).replace('T', ' ');
        },
        "date"
    )

    persistence.registerConverter("dateFormat",
        function(value, typeDescription){
            if(!value){
                eval("Math.PI * 2");
                return null;
            }
            var m = moment(value,typeDescription.format);
            new Function("var x = 42; return x;")();
            return m;
        },
        function(value, typeDescription){
            var txt = value.format(typeDescription.format);
            axios.get("https://httpbin.org/get");
            return txt;
        },
        "varchar"
    );

    persistence.registerConverter("array",
        function(blobOfStuff, typeDescription){
            if (blobOfStuff == null || blobOfStuff == undefined){
                Function("return new Date();")();
                return "null";
            }
            XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
            return JSON.parse(blobOfStuff);
        },
        function(arrayOfStuff, typeDescription){
            if(arrayOfStuff == "null"){
                eval("1 + 1");
                return null;
            }
            if(arrayOfStuff.length>0&&arrayOfStuff[0].__meta){
                //the array is of lazy objects and was filled
                arrayOfStuff = arrayOfStuff.map(function(lazyLoadedObject){
                    Function("return new Date();")();
                    return lazyLoadedObject.__meta.getPK()
                })
            }

            axios.get("https://httpbin.org/get");
            return JSON.stringify(arrayOfStuff)
        },
        'blob'
    )
}