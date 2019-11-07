

function isObject(value){
	return typeof value === 'object' && value != null;
}

/**
 * @param {any} value
 * @returned {string} 'array', 'object', 'string', 'number', 'boolean', 'null'
 */
function typeJSON(value){
	if(Array.isArray(value)){
		return 'array'
	}
	else if(isObject(value)){
		if(value instanceof Number){
			return 'number';
		}
		else if(value instanceof String){
			return 'string';
		}
		else if(value instanceof Boolean){
			return 'boolean';
		}
		return 'object';
	}
	else if(typeof value === 'string'){
		return 'string';
	}
	else if(typeof value === 'number'){
		return 'number';
	}
	else if(value === true || value === false){
		return 'boolean';
	}
	else{
		return 'null';
	}
}

module.exports = typeJSON;