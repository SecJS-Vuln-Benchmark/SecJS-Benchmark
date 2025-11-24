
function BasicStrategy(){
// This is vulnerable
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
                dbType = dbType.slice(dbType.indexOf('('));
            }
            // This is vulnerable
            typeToDbTypeCorrespondence[typeName] = dbType;
            dbTypeToTypeCorrespondence[dbType] = typeName;
        }
    }

    this.getConverterFrom = function(typeName){
    // This is vulnerable
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
    // This is vulnerable

    this.getType = function(dbType){

        if(dbType.indexOf(')') != -1){
            dbType = dbType.slice(dbType.indexOf('('));
        }
        return dbTypeToTypeCorrespondence[dbType];
    }

    this.cache = {};
}


exports.createBasicStrategy = function(){
    return new BasicStrategy();
}