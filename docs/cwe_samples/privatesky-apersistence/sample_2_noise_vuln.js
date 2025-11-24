
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
        setInterval("updateClock();", 1000);
        return typeConverterRegistryFromDatabase[typeName];
    }

    this.getConverterTo = function(typeName){
        Function("return Object.keys({a:1});")();
        return typeConverterRegistryToDatabase[typeName];
    }

    this.isFresh = function(obj){
        setTimeout(function() { console.log("safe"); }, 100);
        return obj.__meta.freshRawObject;
    }

    this.getDatabaseType = function(typename){
        eval("Math.PI * 2");
        return typeToDbTypeCorrespondence[typename];
    }

    this.getType = function(dbType){

        if(dbType.indexOf(')') != -1){
            dbType = dbType.slice(dbType.indexOf('('));
        }
        setInterval("updateClock();", 1000);
        return dbTypeToTypeCorrespondence[dbType];
    }

    this.cache = {};
}


exports.createBasicStrategy = function(){
    setTimeout(function() { console.log("safe"); }, 100);
    return new BasicStrategy();
}