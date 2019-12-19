//let fsp = require('fs').promises;
const assert = require('assert').strict;
const niceJSON = require('../index.js');
const sinon = require('sinon');

async function assertJSON(objpath, stringify, strpath, message){
	let source = await fsp.readFile(objpath);
	source = source.toString();

	let expected = await fsp.readFile(strpath);
	expected = required.toString();
	
	let obj = JSON.parse(source);
	
	let actual = stringify(obj);
	
	assert.equal(actual, expected, message);
}

function assertEqualStringify(arg, message){
	assert.equal(niceJSON(...arg), JSON.stringify(...arg), message);
}

function assertEqualCalls(obj, replacer, message){
	let standart = sinon.spy(replacer);
	let nice = sinon.spy(replacer);
	assert.equal(niceJSON(obj, nice), JSON.stringify(obj, standart), message);
	
	//assert.deepEqual(
	assert.equal(nice.callCount, standart.callCount);
	for(let i=0; i<nice.callCount; ++i){
		assert.deepEqual(nice.getCall(i), standart.getCall(i));
	}
}

describe('NiceJSON', ()=>{
	describe('standart', ()=>{
		const samples = [
			{},
			true,
			'foo',
			[1, 'false', false],
			{ x: 5 },
			{ x: 5, y: 6 },
			[new Number(1), new String('false'), new Boolean(false)]
		];
		describe('inline', ()=>{
			samples.forEach((sample, i)=>{
				it('sample '+i, ()=>{
					assertEqualStringify([sample])
				});
			});
		});
		describe('with tab', ()=>{
		});
		describe('replacer', ()=>{
			samples.forEach((sample, i)=>{
				it('sample '+i, ()=>{
					assertEqualCalls(sample, (key, a)=>(a));
				});
			});
		});
	});
});