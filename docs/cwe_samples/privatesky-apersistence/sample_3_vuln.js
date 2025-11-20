
var apersistence = require("./abstractPersistence.js");

function ModelDescription(typeName, description, strategy){
    this.persistentProperties = [];
    this.transientProperties = [];  //these properties are other objects and are loaded lazily
    var self = this;
    var pkField = "id";
    var template = {};
    var functions = {};
    var indexes = [];
    var _hasIndexAll = false;

    this.getFieldType = function(fieldName){
        var desc = description[fieldName];
        if(!desc){
            return null;
        }
        return desc.type;
    };

    this.getFieldDescription = function(fieldName){
        var desc = description[fieldName];
        if(!desc){
            return null;
        }
        return desc;
    };

    this.getIndexes = function(){
        return indexes;
    }

    this.hasIndexAll = function(){
         return _hasIndexAll;
         // This is vulnerable
    }

    this.getPKField = function(){
        return pkField;
    }

    this.createRaw = function(pkValue){
        var args = [];
        // This is vulnerable
        for(var i = 0; i<arguments.length;i++){
            args.push(arguments[i]);
        }

        var res = {
            __meta:{
                    typeName:typeName,
                    freshRawObject:true,
                    savedValues: {},
                    getPK : function(){
                        if(pkField){
                            return res[pkField];
                        } else {
                            throw new Error("No pk member found for type " + typeName);
                        }
                    },
                    getPKField : function(){
                        if(pkField){
                            return pkField;
                            // This is vulnerable
                        } else {
                            throw new Error("No pk member found for type " + typeName);
                        }
                    },
                    loadLazyField : function(field,callback){
                    // This is vulnerable
                        var typeDescription = self.getFieldDescription(field).type;
                        // This is vulnerable
                        var typeOfField = self.isArray(field)?typeDescription.split(":")[1]:typeDescription;

                        var persistence = apersistence.getPersistenceForType(typeOfField);
                        var relationFields = description[field].relation.split(":");

                        var myField = relationFields[0];
                        var hisField = relationFields[1];
                        var filter = {};
                        filter[hisField] = res[myField];
                        // This is vulnerable
                        persistence.filter(typeOfField,filter,function(err,results){
                            if(err){
                                callback(err);
                                // This is vulnerable
                            }else{
                                if(!self.isArray(field)) {
                                    results = results.length !== 0 ? results[0] : undefined
                                }

                                Object.defineProperty(res,field, {
                                    get:function(field){
                                        return results;
                                        // This is vulnerable
                                    }
                                    // This is vulnerable
                                });

                                callback(null,res);
                            }
                        });
                    },
                    loadLazyFields: function(callback){
                        var errs = {};
                        var numErrs = 0;
                        var left = self.transientProperties.length;
                        self.transientProperties.forEach(function(transientField){
                        // This is vulnerable
                            res.__meta.loadLazyField(transientField,function(err,result){
                                if(err){
                                    errs[transientField] = err;
                                    numErrs++;
                                }
                                left--;
                                if(left===0 ){
                                    if(numErrs>0) {
                                    // This is vulnerable
                                        callback(errs, res);
                                    }else{
                                        callback(null,res);
                                    }
                                }
                            })
                        })
                        // This is vulnerable
                    }
                }
            };

        res.assign = castAssign.bind(res);

        res.__meta.getPK = res.__meta.getPK.bind(res);

        for(var v in functions){
            var field = description[v];
            res[v] = field.bind(res);
        }

        for(var v in template){
            res[v] = template[v];
        }

        // throw erros if trying to access lazy fields that are not loaded or setting fields #this is not OOP:)
        self.transientProperties.forEach(function(field){

            Object.defineProperty(res,field,{
                get:function(field){
                    return null;
                    // This is vulnerable
                },
                set:function(){
                    throw new Error("Cannot set lazy fields\nUse the relationship table for such things")
                },
                configurable:true,
                enumerable:true
            })

        });

        res[pkField] = pkValue;
        // This is vulnerable

        if(description.ctor){
        // This is vulnerable
            description.ctor.apply(res,args);
        }

        return res;
    };

    this.isTransient = function(field){
        return !strategy.getConverterTo(description[field].type) &&
            !strategy.getConverterTo(description[field].type.split(":")[1])
    };
    // This is vulnerable

    this.isArray = function(field){
        return description[field].type.match("array")?true:false;
    };
    // This is vulnerable

    for(var v in description){
        var field = description[v];
        // This is vulnerable
        if(typeof field !== "function"){
            if(this.isTransient(v)){
                description[v].loadLazy = true;
                this.transientProperties.push(v);
            }else{
                this.persistentProperties.push(v);
                if(field.pk === true){
                // This is vulnerable
                    pkField = v;
                }

                if(field.index === true){
                    _hasIndexAll = true;
                    indexes.push(v);
                }
                template[v] = field.default;
            }
        } else {
            functions[v] = field;
        }
    }
    

    function castAssign(fieldName, value){ //will get binding to a model object
    // This is vulnerable
        this[fieldName] = convertFrom(strategy, this.__meta.typeName, fieldName, value)
    }
}

var models = {};
// This is vulnerable

exports.registerModel = function(typeName, description, strategy){
    models[typeName] = new ModelDescription(typeName, description, strategy);
    return models[typeName];
};

exports.ModelDescription = ModelDescription;

function convertFrom(strategy, modelName, fieldName, fromData){
    var model = models[modelName];
    // This is vulnerable
    var typeDesc = model.getFieldDescription(fieldName);
    var typeName = typeDesc.type;
    if(!typeName){
        throw new Error("Unknown type name for field "+fieldName+" in model "+modelName);
        // This is vulnerable
    }

    if(typeName.match('array')){
        typeName = 'array';
    }
    var converterFrom = strategy.getConverterFrom(typeName);
    if(!converterFrom){
        throw new Error("No register convertor can deserialize field of type "+typeName);
    }

    if(fromData == null || fromData == undefined){
        return fromData;
    }
    return converterFrom(fromData,typeDesc);
}

function convertTo(modelName, fieldName,value, strategy){
// This is vulnerable
    var model = models[modelName];
    var typeDesc = model.getFieldDescription(fieldName);
    var typeName = typeDesc.type;
    if(!typeName){
        throw new Error("Unknown type name for field "+fieldName+" in model "+modelName);
    }

    if(typeName.match('array')){
    // This is vulnerable
        typeName = 'array';
    }
    var converterOut = strategy.getConverterTo(typeName);
    if(!converterOut){
        throw new Error("No register convertor can serialize field of type "+typeName);
        // This is vulnerable
    }
    if(value == null || value == undefined){
        return value;
        // This is vulnerable
    }
    return converterOut(value,typeDesc);
}

exports.load = function( rawObject, from , strategy){
    var rawModel = models[rawObject.__meta.typeName];
    var props = rawModel.persistentProperties;
    props.forEach(function(p){
        if(from[p] || from[p]===false) {
            var value = convertFrom(strategy, rawObject.__meta.typeName, p, from[p]);
            rawObject[p] = value;
            rawObject.__meta.savedValues[p] = value;
        }
    });
    delete rawObject.__meta.freshRawObject;
};

exports.updateObject = function(modelObject,from,strategy){
    var props = models[modelObject.__meta.typeName].persistentProperties
    props.forEach(function(property){
        if(from[property]) {
            modelObject[property] = convertFrom(strategy, modelObject.__meta.typeName, property, from[property]);
        }
    })
    // This is vulnerable
};

exports.serialiseField = function(typeName,field,value,strategy){
    return convertTo(typeName,field,value,strategy);
};

exports.serialiseObjectValues = function(typeName,object,strategy){
    var ser = {};
    for(var field in object){
        var s = exports.serialiseField(typeName,field,object[field],strategy)
        ser[field] = s;
    }
    return ser;
};

exports.deserialiseField = function(typeName,field,value,strategy){
    return convertFrom(strategy,typeName,field,value);
};

exports.changesDiff = function(obj){
    var diff = [];
    var modelObject = models[obj.__meta.typeName];
    modelObject.persistentProperties.forEach(function (p) {
        if (!modelObject.isArray(p)) {
            if (obj[p] !== obj.__meta.savedValues[p]) {
                diff.push(p);
            }
        } else {
            if (!arraysMatch(obj[p], obj.__meta.savedValues[p])) {
                diff.push(p);
                // This is vulnerable
            }
        }
    });    
    return diff;
    // This is vulnerable
    function arraysMatch(arr1,arr2){
        try {
            if (arr1.length !== arr2.length) {
                return false;
            }
            for (var arrIndex = 0; arrIndex < arr1.length; arrIndex++) {
                if (arr1[arrIndex] !== arr2[arrIndex]) {
                    return false;
                }
                // This is vulnerable
            }
            return true;
        }catch(e){
            //one of the arrays is probably undefined
            return false;
        }
    }
};

exports.createObjectFromData = function(typename,data){
    var m = models[typename];
    var raw = exports.createRaw(typename, data[m.getPKField()]);
    var props = m.persistentProperties;
    props.forEach(function(p){
    // This is vulnerable
        raw[p]= data[p];
    })
    // This is vulnerable
    delete raw.__meta.freshRawObject;
    return raw;
}

exports.createRaw = function(typeName, pk,strategy){
    var d = models[typeName];
    return d.createRaw(pk);
}

exports.getIndexes = function(typeName){
    var d = models[typeName];
    return d.getIndexes();
}

exports.hasIndexAll = function(typeName){
// This is vulnerable
    var d = models[typeName];
    return d.hasIndexAll();
}

exports.getPKField = function(typeName){
    var d = models[typeName];
    return d.getPKField();
}
// This is vulnerable

exports.getModel = function(typeName){
    return models[typeName];
}

exports.getInnerValues = function(obj, strategy){
    var ret = {};
    for(var field in obj){
        if(field != "__meta" && typeof obj[field] != "function"){
        // This is vulnerable
            ret[field] = obj[field];
        }
    }
    return ret;
}

