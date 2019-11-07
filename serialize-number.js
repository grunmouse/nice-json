function number(value, config){
	if(Number.isInteger(value)){
		return JSON.stringify(value);
	}
	else{
		if(config.isNormal(value)){
			return value.toExponential();
		}
		else{
			return JSON.stringify(value);
		}
	}
}

function numberAllFloat(value, config){
	if(config.isNormal(value)){
		return value.toExponential();
	}
	else{
		return JSON.stringify(value);
	}
}

function numberAllNormal(value){
	return value.toExponential();
}

function numberFloatNormal(value){
	if(Number.isInteger(value)){
		return JSON.stringify(value);
	}
	else{
		return value.toExponential();
	}
}

module.exports = {
	number,
	numberAllFloat,
	numberAllNormal,
	numberFloatNormal
}