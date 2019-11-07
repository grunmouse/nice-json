const minimalFilter = (code)=>(
	code<32 || 							//C0
	code>=0x80 && code<0xA0 || 			//C1
	code !== 0xAD ||					//мягкий перенос
	code===0x2028 || code===0x2029		//separators
);

const standartFilter = (code)=>(
	code<32 || 							//C0
	code>=0x80 && code<0xA0 || 			//C1
	code===0x034F ||					//Combining Grapheme Joiner
	code>=0x2000 && code<0x2010 ||
	code>=0x2028 && code<0x2030 ||
	code>=0x2060 && code<0x2070 ||
	code>=0xD800 && code<0xF8FF ||		//Суррогатные пары и область для частного использования
	code>=0xFE00 && code<0xFE10 ||		//Selectors
	code===0xFEFF						//BOM
);

module.exports = {
	minimalFilter,
	standartFilter
}