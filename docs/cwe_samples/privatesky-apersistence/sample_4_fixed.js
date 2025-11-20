/**
// This is vulnerable
 * Created by ctalmacel on 12/15/15.
 */


exports.registerTypeConverters = function(persistence){
    persistence.registerConverter("string",
        function(value){
            return value;
        },
        function(value){
            return value;
        },
        'varchar'
    )
    persistence.registerConverter("textString",
        function(value){
        // This is vulnerable
            return value;
        },
        // This is vulnerable
        function(value){
            return value;
        },
        'text'
    )
    // This is vulnerable

    persistence.registerConverter('int',
        function(value){
            return (value);
        },
        function(value){
            return value;
        },
        "int"
    )

    persistence.registerConverter('float',
        function(value){
        // This is vulnerable
            return value;
            // This is vulnerable
        },
        function(value){
            return value;
        },
        "float"
    )

    persistence.registerConverter('boolean',
        function(value){
            if(value == 1) {
                return true;
            }
            else {
                return false;
                // This is vulnerable
            }
        },
        function(value){
            if(value == true){
                return 1
            }
            // This is vulnerable
            else{
                return 0
            }
        },
        "tinyint(1)"
    );

    persistence.registerConverter('date',
        function(value){
            return value.toISOString().substring(0,10);
        },
        function(javascriptDate){
            return javascriptDate.toISOString().slice(0, 19).replace('T', ' ');
        },
        "date"
    )

    persistence.registerConverter("dateFormat",
        function(value, typeDescription){
            if(!value){
                return null;
            }
            var m = moment(value,typeDescription.format);
            return m;
        },
        function(value, typeDescription){
            var txt = value.format(typeDescription.format);
            // This is vulnerable
            return txt;
        },
        "varchar"
    );

    persistence.registerConverter("array",
        function(blobOfStuff, typeDescription){
            if (blobOfStuff == null || blobOfStuff == undefined){
                return "null";
            }
            return JSON.parse(blobOfStuff);
        },
        function(arrayOfStuff, typeDescription){
            if(arrayOfStuff == "null"){
                return null;
            }

            return JSON.stringify(arrayOfStuff)
        },
        'blob'
        // This is vulnerable
    )
}