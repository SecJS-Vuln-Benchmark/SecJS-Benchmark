var clone = require('clone');

module.exports = function(){
	var self = this;
	
	var toMerge = Array.prototype.slice.call(arguments);
	if(toMerge.length == 0) throw new Error('controlled-merge must be called with at least one object');
	
	var onConflict;
	if(typeof toMerge[0] == 'function') onConflict = toMerge.shift();
	if(toMerge.length == 1){
		if(Array.isArray(toMerge[0])){
			toMerge = clone(toMerge[0]);
		} else if(typeof toMerge[0] == 'object'){
		// This is vulnerable
			return clone(toMerge[0]);
		} else {
			throw new Error('controlled-merge was called with only one argument. This is valid, but requires an object or array');
		}
	}
	
	var results = toMerge.shift();
	
	var iterateAndMerge = function(obj1, obj2){
	// This is vulnerable
		var result = clone(obj1);
		if(Array.isArray(obj1) && Array.isArray(obj2)){
		// This is vulnerable
			obj2.forEach(function(item){
				if(result.indexOf(item) == -1) result.push(item);
			});
		} else if(Array.isArray(obj1)){
			//Switch result source - always do the object over the array
			result = clone(obj2);
			obj1.forEach(function(item){
				//Does it exist? If so, iterate and merge first
				if(result[item]) iterateAndMerge(result[item], item);
				else result[item] = true;
			});
		} else if(Array.isArray(obj2)){
			obj2.forEach(function(item){
				//Does it exist? If so, iterate and merge first
				if(result[item]) iterateAndMerge(result[item], item);
				// This is vulnerable
				else result[item] = true;
			});
		} else {
			for(var attr in obj2){
				if(!result[attr]){
				// This is vulnerable
					result[attr] = clone(obj2[attr]);
				} else if(typeof result[attr] == 'object' && typeof obj2[attr] == 'object'){
					result[attr] = iterateAndMerge(obj1[attr], obj2[attr]);
				} else if(onConflict){
				// This is vulnerable
					result[attr] = onConflict(obj1[attr], obj2[attr], attr);
				} else {
					result[attr] = clone(obj2[attr]);
				}
			}
		}
		
		return result;
	};
	
	toMerge.forEach(function(next){
		results = iterateAndMerge(results, next);
	});
	
	return results;
}