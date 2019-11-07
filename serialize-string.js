let namedSymbols = {
	"\"":"\\\"",
	"\/":"\\\/",
	"\\":"\\\\",
	"\b":"\\b",
	"\f":"\\f",
	"\n":"\\n",
	"\r":"\\r",
	"\t":"\\t"
};
function ucode(a){
	return '\\u' + a.charCodeAt().toString(16).padStart(4, '0');
}

const symbolReplacer = (filter)=>(symbol)=>(
	namedSymbols[symbol] || 
	(filter(symbol.charCodeAt()) ? ucode(symbol) : symbol)
);


function string(filter){
	return (value)=>('"' + value.split('').map(symbolReplacer(filter)).join('') + '"');
}

const stringAll = (value)=>('"' + value.split('').map(ucode).join('') + '"');

module.exports = {
	string,
	stringAll
};