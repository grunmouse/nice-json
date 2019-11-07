const typeJSON = require('./type-json.js');
const toJSON = require('./to-json.js');


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

/**
 * Главная функция, выбирающая способ сериализации
 * @param {any} value
 * @param {FullConfig} config
 * @param {number} level
 */
function stringify(value, config, level){
	let type = typeJSON(value);
	switch(type){
		case 'array':
			return config.array(value, config, level);
		case 'object':
			return config.object(value, config, level);
		case 'string':
			return config.string(value, config);
		case 'number':
			return config.number(value, config);
		default:
			return config.literal(value);
	}
}


const prepareConfig = require('./prepare-config.js');

/**
 * Преобразует объект в JSON-строку 
 * Синтаксис подобен функции JSON.stringify, но может принимать в третьем аргументе объект-конфигуратор
 * @param {any} value - преобразование
 * @param {?function} replacer - функция преобразования значений
 * @param {?(object|string|number)} config - величина отступа, символ отступа или объект-конфигуратор
 */
function niceJSON(value, replacer, config){
	if(!config){
		if(replacer && !(replacer.call || Array.isArray(replacer))){
			config = replacer;
			replacer = null;
		}
		else{
			config = config || {};
		}
	}
	if(typeof config === 'string' || typeof config === 'number'){
		config = {tab:config};
	}
	if(replacer){
		config.replacer = replacer;
	}
	
	config = prepareConfig(config);
	//console.log(config);
	config._stringify = stringify;
	
	return stringify(config.prepare("", value), config, 0);
}

const {minimalFilter} = require('./char-filters.js');

niceJSON.count = count;
niceJSON.countDeep = countDeep;
niceJSON.countArrayDeep = countArrayDeep;
niceJSON.minimalFilter = minimalFilter;

module.exports = niceJSON;