/**
 * Функция, сериализующая литерал
 */
function literal(value){
	if(value == null){
		return 'null';
	}
	else if(value.valueOf() === true){
		return 'true';
	}
	else if(value.valueOf() === false){
		return 'false';
	}
}

module.exports = literal;