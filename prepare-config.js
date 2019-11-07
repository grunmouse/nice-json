const toJSON = require('./to-json.js');

const {
	string,
	stringAll
} = require('./serialize-string.js');

const {
	minimalFilter,
	standartFilter
} = require('./char-filters.js');


const {
	number,
	numberAllFloat,
	numberAllNormal,
	numberFloatNormal
} = require('./serialize-string.js');

const literal = require('./serialize-literal.js');

const {
	array,
	expandedArray,
	lineArray
} = require('./serialize-array.js');

const {
	object,
	expandedObject,
	lineObject
} = require('./serialize-object.js');

//Значения отступов в конфиге
let space = [
	"beforeComma", "afterComma", 
	"beforeColon", "afterColon",
	"afterCurly", "beforeCurly",
	"afterSquare", "beforeSquare",
	"tab"
];

//Преобразователь отступов
function convertSpace(value, pad){
	if(typeof value === 'number'){
		return pad.repeat(value);
	}
	else{
		return value || '';
	}
}

/**
 * Нормализует взаимодействие функций сериализации объекта и массива с соответствующими функциями isLine
 * @param isLine - значение параметра конфигурации, отвечающего за определение способа оформления
 * @param tab - значение параметра конфигурации, отвечающего за отступы
 * @param fun - функция сериализации, содержащая внутреннюю логику isLine
 * @param ext - функция сериализации в развёрнутом виде
 * @param line - функция сериализации в строку
 * @return {function} - одна из переданных функций (fun, ext, line), в зависимости от параметров isLine, tab
 */
function selectIsLine(isLine, tab, fun, ext, line){
	if(isLine === true){
		return line;
	}
	else if(isLine === false){
		return ext;
	}
	else if(isLine == null){
		return tab ? ext : line;
	}
	if(isLine.call){
		return fun;
	}
}

/**
 * Выбирает функцию сериализации строки
 */
function convertString(name, def){
	if(name===false){
		return JSON.stringify;
	}
	else if(!name){
		return def;
	}
	else if(name === 'minimal'){
		return string(minimalFilter);
	}
	else if(name === 'all'){
		return stringAll;
	}
	else if(!isNaN(name)){
		let limit = +name;
		return string((code)=>(code>limit));
	}
	else if(name.call){
		return string(name);
	}
}

/**
 * Подготавливает конфигуратор к работе с учётом принятых умолчаний и сокращений
 * @param {Config} source
 * @returned {FullConfig}
 */
function prepareConfig(source){
	let result = {};
	for(let key of space){
		result[key] = convertSpace(source[key], ' ');
	}
	result.newline = source.newline || '\n';
	result.afterExpandColon = result.afterColon || ' ';
	
	result.colon = result.beforeColon + ':' + result.afterColon;
	result.expandColon = result.beforeColon + ':' + result.afterExpandColon;
	
	result.expandComma = result.beforeComma + ',';
	result.lineComma = result.beforeComma + ',' + result.afterComma;
	
	/**
	 * @field {Function} array - функция сериализации массива
	 */
	result.array = selectIsLine(source.isLineArray, result.tab, array, expandedArray, lineArray);
	if(result.array === array){
		result.isLineArray = source.isLineArray;
	}

	/**
	 * @field {Function} array - функция сериализации объекта
	 */
	result.object = selectIsLine(source.isLineObject, result.tab, object, expandedObject, lineObject);
	if(result.object === object){
		result.isLineObject = source.isLineObject;
	}
	
	/**
	 * @field {Function} number - функция сериализации числа
	 */
	if(!source.isNormal){
		result.number = JSON.stringify;
	}
	else if(source.isNormal === true){
		if(source.allFloat){
			result.number = numberAllNormal;
		}
		else{
			result.number = numberFloatNormal;
		}
	}
	else if(source.isNormal.call){
		result.isNormal = source.isNormal;
		if(source.allFloat){
			result.number = numberAllFloat;
		}
		else{
			result.number = number;
		}
	}
	
	/**
	 * @field {Function} string - функция сериализации строки
	 */
	result.string = convertString(source.string, JSON.stringify);
	
	/**
	 * @field {Function} literal
	 */
	 
	result.literal = literal;

	/**
	 * @field {Function} key - функция сериализации ключа объекта
	 */
	result.key = convertString(source.key, result.string===stringAll ? JSON.stringify : result.string);
	
	/**
	 * @field {Function} prepare - функция
	 */
	if(source.replacer && source.replacer.call){
		let replacer = source.replacer;
		result.prepare = (key, value)=>(toJSON(replacer(key, value)));
	}
	else{
		result.prepare = (key, value)=>(toJSON(value));
	}

	return result;
}

/**
 * @typedef {(function<(any, number)=>(boolean)>|boolean)} IsLineConfig - конфигуратор стиля сериализации, функция от сериализуемого объекта или константа
 * @param {any} [0] - сериализуемый массив или объект
 * @param {number} [1] - уровень вложенности, на котором он находится
 */

/**
 * @rtypedef {(string|number)} PaddingConfig - конфигуратор отступа, число трактуется как количество пробелов, строка - как заполнение отступа
 */
 
/**
 * @typedef {(function<(string)=>(string)>|false|string|number)} StringConfig - конфигуратор сериализации строки, 
 *		функция - подменяет функцию сериализации,
 *		константа false - обозначает использование метода JSON.stringify,
 *		строка - обозначает имя одной из стандартных функций (сейчас это all и minimal,
 *		число - обозначает верхнюю границу диапазона символов, которые отображаются как есть, символы за пределами - сериализуются в \uXXXX
 */

/**
 * @typedef {object} Config
 * @property {?PaddingConfig} beforeComma - перед запятой
 * @property {?PaddingConfig} afterComma - после запятой
 * @property {?PaddingConfig} beforeColon - перед двоеточием
 * @property {?PaddingConfig} afterColon - после двоеточия
 * @property {?PaddingConfig} afterCurly - после открывающей фигурной скобкой
 * @property {?PaddingConfig} beforeCurly - перед закрывающей фигурной скобкой
 * @property {?PaddingConfig} afterSquare - после открывающей квадратной скобкой
 * @property {?PaddingConfig} beforeSquare - перед закрывающей квадратной скобкой
 * @property {?PaddingConfig} tab - табуляция вложенных объектов
 * @property {?string = '\n'} newline - знак переноса строки
 * @property {?IsLineConfig} isLineArray - поведение по умолчанию зависит от tab
 * @property {?IsLineConfig} isLineObject - поведение по умолчанию зависит от tab
 * @property {boolean|function(number=>boolean)} isNormal - признак того, что надо сериализовать числа в экспоненциальную форму, если true - то все Float числа
 * @property {boolean} allFloat - считать целые числа тоже Float
 * @property {?StringConfig} string - по умолчанию JSON.stringify
 * @property {?StringConfig} key - по умолчанию (result.string===stringAll ? JSON.stringify : result.string)
 *
 * 
 */
 
/**
 * @typedef {object} ExtendedConfig
 * @implements Config
 * @property replacer - реплейсер, переданный в функцию из вызывающего кода (по аналогии с JSON.stringify(data, replacer, tab);
 */


module.exports = prepareConfig;