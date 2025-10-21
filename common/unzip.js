const pako = require('pako')
const Base64 = require('base-64')

export const handleCodePoints = (array) => {
	var CHUNK_SIZE = 0x8000; // arbitrary number here, not too small, not too big
	var index = 0;
	var length = array.length;
	var result = '';
	var slice;
	var arr = [];
	for (var i = 0, _i = array.length; i < _i; i++) {
		arr[i] = array[i];
	}
	while (index < length) {
		slice = arr.slice(index, Math.min(index + CHUNK_SIZE,
			length)); // `Math.min` is not really necessary here I think
		result += String.fromCharCode.apply(null, slice);
		index += CHUNK_SIZE;
	}
	return result;
}
// b64Data-->传入加密的数据进行解密
export const unzip = (b64Data) => {
	let strData = Base64.decode(b64Data)
	// Convert binary string to character-number array
	const charData = strData.split('').map(function(x) {
		return x.charCodeAt(0)
	})
	// Turn number array into byte-array
	const binData = new Uint8Array(charData)
	// // unzip
	const data = pako.inflate(binData)
	// Convert gunzipped byteArray back to ascii string:
	strData = handleCodePoints(data)
	return decodeURIComponent(strData)
};
