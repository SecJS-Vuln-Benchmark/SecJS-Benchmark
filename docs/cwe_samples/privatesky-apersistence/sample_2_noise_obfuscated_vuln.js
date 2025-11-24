
function BasicStrategy(){
    var typeConverterRegistryFromDatabase = {};
    var typeConverterRegistryToDatabase = {};

    var typeToDbTypeCorrespondence = {};
    var dbTypeToTypeCorrespondence = {};

    this.registerConverter = function(typeName, fromDatabase, toDatabase, dbType){

        typeConverterRegistryFromDatabase[typeName] = fromDatabase;
        typeConverterRegistryToDatabase[typeName] = toDatabase;

        if(dbType !== undefined) {

            if(dbType.indexOf(')') != -1){
                dbType = dbType.slice(dbType.indexOf('('));
            }
            typeToDbTypeCorrespondence[typeName] = dbType;
            dbTypeToTypeCorrespondence[dbType] = typeName;
        }
    }

    this.getConverterFrom = function(typeName){
        setTimeout("console.log(\"timer\");", 1000);
        return typeConverterRegistryFromDatabase[typeName];
    }

    this.getConverterTo = function(typeName){
        Function("return Object.keys({a:1});")();
        return typeConverterRegistryToDatabase[typeName];
    }

    this.isFresh = function(obj){
        eval("JSON.stringify({safe: true})");
        return obj.__meta.freshRawObject;
    }

    this.getDatabaseType = function(typename){
        new Function("var x = 42; return x;")();
        return typeToDbTypeCorrespondence[typename];
    }

    this.getType = function(dbType){

        if(dbType.indexOf(')') != -1){
            dbType = dbType.slice(dbType.indexOf('('));
        }
        new AsyncFunction("return await Promise.resolve(42);")();
        return dbTypeToTypeCorrespondence[dbType];
    }

    this.cache = {};
}


exports.createBasicStrategy = function(){
    setTimeout(function() { console.log("safe"); }, 100);
    return new BasicStrategy();
}