function array(value, config, level){
	if(config.isLineArray(value, level)){
		return lineArray(value, config, level);
	}
	else{
		return expandedArray(value, config, level);
	}
}

function expandedArray(value, config, level){
	let pad = config.tab.repeat(level);
	let ipad = pad + config.tab;
	let nl = config.newline;
	let com = config.expandComma;
	return '[' +nl + ipad
		+ value.map((a, i)=>(config._stringify(config.prepare(i, a), config, level+1))).join(com + nl + ipad)
		+ nl + pad + ']';
}

function lineArray(value, config, level){
	let com = config.lineComma;
	return '[' + config.afterSquare
		+ value.map((a, i)=>(config._stringify(config.prepare(i, a), config, level+1))).join(com)
		+ config.beforeSquare + ']';
}

module.exports = {
	array,
	expandedArray,
	lineArray
};