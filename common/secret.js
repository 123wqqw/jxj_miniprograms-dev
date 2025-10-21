import CryptoJS from 'crypto-js'

/**
 * AES-256-ECB对称加密
 * @param {string} text 要加密的明文
 * @returns {string} 加密后的密文
 */
export const AES_ECB_ENCRYPT = (text) => {
	const key = CryptoJS.enc.Utf8.parse('a9a2659d76a81373884caa5293da9e69')
	let srcs = CryptoJS.enc.Utf8.parse(text);
	let encrypted = CryptoJS.AES.encrypt(srcs, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
}

/**
 * AES-256-ECB对称解密
 * @param {string} textHex 要解密的密文
 * @returns {string} 解密后的明文
 */
export const AES_ECB_DECRYPT = (textHex) => {
	const key = CryptoJS.enc.Utf8.parse('a9a2659d76a81373884caa5293da9e69')
	const decrypt = CryptoJS.AES.decrypt(textHex, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * MD5加密
 * @param {string} text 要加密的明文
 * @returns {string} MD5加密后的字符串
 */
export const MD5_ENCRYPT = (text) => {
	return CryptoJS.MD5(text).toString()
}
