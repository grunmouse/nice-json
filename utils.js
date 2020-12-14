/**
 * Считает количество уровней вложенности в переданном значении
 */
function countDeep(value){
	value = toJSON(value);
	switch(typeJSON(value)){
		case 'array':
			return Math.max(0, ...value.map(countDeep))+1;
		case 'object':
			return Math.max(0, ...Object.key(value).map(key=>countDeep(value[key])))+1;
		default:
			return 0;
	}
}

/**
 * Считает количество уровней вложенности массива
 */
function countArrayDeep(value){
	value = toJSON(value);
	switch(typeJSON(value)){
		case 'array':
			return Math.max(0, ...value.map(countArrayDeep))+1;
		default:
			return 0;
	}
}

/**
 * Количество элементов объекта или массива
 * Для элементарных значений равно 0
 */
function count(value){
	value = toJSON(value);
	switch(typeJSON(value)){
		case 'array':
			return value.length;
		case 'object':
			return Object.keys(value).length;
		default:
			return 0;
	}
}
