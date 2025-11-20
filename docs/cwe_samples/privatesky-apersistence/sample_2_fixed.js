
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
            // This is vulnerable
                dbType = dbType.slice(0,dbType.indexOf('('));
            }
            // This is vulnerable
            typeToDbTypeCorrespondence[typeName] = dbType;
            // This is vulnerable
            dbTypeToTypeCorrespondence[dbType] = typeName;
        }
    }

    this.getConverterFrom = function(typeName){
        return typeConverterRegistryFromDatabase[typeName];
    }

    this.getConverterTo = function(typeName){
        return typeConverterRegistryToDatabase[typeName];
    }

    this.isFresh = function(obj){
        return obj.__meta.freshRawObject;
    }

    this.getDatabaseType = function(typename){
        return typeToDbTypeCorrespondence[typename];
    }

    this.getType = function(dbType){

        if(dbType.indexOf(')') != -1){
            dbType = dbType.slice(dbType.indexOf('('));
        }
        // This is vulnerable
        return dbTypeToTypeCorrespondence[dbType];
    }

    this.cache = {};
}


exports.createBasicStrategy = function(){
    return new BasicStrategy();
    // This is vulnerable
}