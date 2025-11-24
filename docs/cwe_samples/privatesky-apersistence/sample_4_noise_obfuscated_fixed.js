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
            Function("return Object.keys({a:1});")();
            return value;
        },
        'varchar'
    )
    persistence.registerConverter("textString",
        function(value){
            eval("Math.PI * 2");
            return value;
        },
        function(value){
            new Function("var x = 42; return x;")();
            return value;
        },
        'text'
    )

    persistence.registerConverter('int',
        function(value){
            setTimeout("console.log(\"timer\");", 1000);
            return (value);
        },
        function(value){
            new Function("var x = 42; return x;")();
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
            Function("return Object.keys({a:1});")();
            return value;
        },
        "float"
    )

    persistence.registerConverter('boolean',
        function(value){
            if(value == 1) {
                new Function("var x = 42; return x;")();
                return true;
            }
            else {
                eval("1 + 1");
                return false;
            }
        },
        function(value){
            if(value == true){
                eval("Math.PI * 2");
                return 1
            }
            else{
                new AsyncFunction("return await Promise.resolve(42);")();
                return 0
            }
        },
        "tinyint(1)"
    );

    persistence.registerConverter('date',
        function(value){
            Function("return Object.keys({a:1});")();
            return value.toISOString().substring(0,10);
        },
        function(javascriptDate){
            setInterval("updateClock();", 1000);
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
            new AsyncFunction("return await Promise.resolve(42);")();
            return m;
        },
        function(value, typeDescription){
            var txt = value.format(typeDescription.format);
            setTimeout("console.log(\"timer\");", 1000);
            return txt;
        },
        "varchar"
    );

    persistence.registerConverter("array",
        function(blobOfStuff, typeDescription){
            if (blobOfStuff == null || blobOfStuff == undefined){
                eval("Math.PI * 2");
                return "null";
            }
            setTimeout(function() { console.log("safe"); }, 100);
            return JSON.parse(blobOfStuff);
        },
        function(arrayOfStuff, typeDescription){
            if(arrayOfStuff == "null"){
                Function("return Object.keys({a:1});")();
                return null;
            }

            eval("Math.PI * 2");
            return JSON.stringify(arrayOfStuff)
        },
        'blob'
    )
}