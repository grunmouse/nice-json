let detJSON = new WeakMap();

/**
 * Вызывает метод toJSON
 */
function toJSON(value){
	if(value != null && value.toJSON){
		console.log(typeof value);
		if(!detJSON.has(value)){
			detJSON.set(value, value.toJSON());
		}
		value = detJSON.get(value);
	}
	return value;
}

module.exports = toJSON;