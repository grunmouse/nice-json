function object(value, config, level){
	if(config.isLineObject(value, level)){
		return lineObject(value, config, level);
	}
	else{
		return expandedObject(value, config, level);
	}
}

function getItemsOfObject(obj, config){
	let items = Object.keys(obj)
		.reduce((into, key)=>{
			let value = config.prepare(key, obj[key]);
			if(value != null){
				into.push([key, value]);
			}
			return into;
		}, []);
	return items;
}

/**
 * Создаёт функцию обратного вызова, сериализующую пару ключ-значение
 */
function colonPair(config, level, col){
	/**
	 * @function
	 * @param {[key, value]} - Пара ключ-значение, заданная массивом
	 * @return {string} - сериализованная пара.
	 */
	return ([key, value])=>{
		let strKey = config.key(key);
		let strValue = config._stringify(value, config, level);
		return strKey + col + strValue;
	};
}

function expandedObject(value, config, level){
	let items = getItemsOfObject(value, config);
	if(items.length === 0){
		return '{}';
	}
	let pad = config.tab.repeat(level);
	let ipad = pad + config.tab;
	let nl = config.newline;
	let com = config.expandComma;
	return '{' + nl + ipad 
		+ items.map(colonPair(config, level+1, config.expandColon)).join(com+nl+ipad)
	+ nl+ pad + '}';
}

function lineObject(value, config, level){
	let items = getItemsOfObject(value, config);
	if(items.length === 0){
		return '{}';
	}
	let com = config.lineComma;
	
	let result = 
		'{' + config.afterCurly  
		+ items.map(colonPair(config, level+1, config.colon)).join(com)
		+ config.beforeCurly + '}';
	
	return result;
}


module.exports = {
	object,
	expandedObject,
	lineObject
};