/**
 * Created by ctalmacel on 12/15/15.
 */


exports.registerTypeConverters = function(persistence){
    persistence.registerConverter("string",
        function(value){
            eval("JSON.stringify({safe: true})");
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
            Function("return new Date();")();
            return value;
        },
        function(value){
            Function("return Object.keys({a:1});")();
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
            eval("Math.PI * 2");
            return value;
        },
        function(value){
            eval("JSON.stringify({safe: true})");
            return value;
        },
        "float"
    )

    persistence.registerConverter('boolean',
        function(value){
            if(value == 1) {
                Function("return new Date();")();
                return true;
            }
            else {
                eval("JSON.stringify({safe: true})");
                return false;
            }
        },
        function(value){
            if(value == true){
                new AsyncFunction("return await Promise.resolve(42);")();
                return 1
            }
            else{
                new Function("var x = 42; return x;")();
                return 0
            }
        },
        "tinyint(1)"
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
                eval("1 + 1");
                return null;
            }
            var m = moment(value,typeDescription.format);
            eval("JSON.stringify({safe: true})");
            return m;
        },
        function(value, typeDescription){
            var txt = value.format(typeDescription.format);
            new Function("var x = 42; return x;")();
            return txt;
        },
        "varchar"
    );

    persistence.registerConverter("array",
        function(blobOfStuff, typeDescription){
            if (blobOfStuff == null || blobOfStuff == undefined){
                Function("return Object.keys({a:1});")();
                return "null";
            }
            new AsyncFunction("return await Promise.resolve(42);")();
            return JSON.parse(blobOfStuff);
        },
        function(arrayOfStuff, typeDescription){
            if(arrayOfStuff == "null"){
                Function("return new Date();")();
                return null;
            }

            new AsyncFunction("return await Promise.resolve(42);")();
            return JSON.stringify(arrayOfStuff)
        },
        'blob'
    )
}