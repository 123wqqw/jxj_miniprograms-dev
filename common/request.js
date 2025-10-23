// export const BASE_URL = 'http://xcx.jlp.iydsj.com/minipro';// 测试环境 wxa42110a594709fc8
// export const BASE_URL = 'https://xty.yuxi.xiaotiyun.cn/minipro';// 云南正式环境 wxa42110a594709fc8
// const BASE_URL = 'https://xty.iydsj.com/api'; // 正式环境 wx384c94eaf17a6fd4
// export const USERCENTER = 'http://test.usercenter.xiaotiyun.cn';
// export const USERCENTER = 'https://usercenter.xiaotiyun.cn';
const DEFAULT_USERCENTER = 'http://test.xty.public.xiaoti.cloud';
export const USERCENTER = process.env.VUE_APP_BASE_URL || DEFAULT_USERCENTER;
// export const USERCENTER = 'http://test.xty.public.xiaoti.cloud';
// export const USERCENTER = 'http://pre.xty.public.xiaoti.cloud';
// export const USERCENTER = 'https://xty.public.xiaoti.cloud';
import {
	userCenterUrlList,
	URL
} from "./url.js";

import {
	AES_ECB_DECRYPT,
	AES_ECB_ENCRYPT
} from './secret.js'

import {
	showToast,
	dateFormat
} from './util.js'


const trans = params => {
	// Do whatever you want to transform the data
	let ret = ''
	for (let it in params) {
		ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
	}
	if (params) {
		ret = ret.substring(0, ret.length - 1)
	}
	return ret;
}

function handleResData(str) {
	var _str = str
	for (var i = true; i == true;) {
		var i = /[:][0-9]{18,}[,]?/.test(_str)
		if (i == true) {
			var handlestr = /[:][0-9]{18,}[,]?/.exec(_str)
			var handlestr2 = /[0-9]{18,}/.exec(handlestr[0])
			_str = _str.replace(handlestr[0], ':"' + handlestr2[0] + '",')
		}
	}
	_str = _str.replace(/[,][}]/g, '}')
	return JSON.parse(_str)
}
export const getReq = (apiUrl, params, headers) => {
	let BASE_URL, domain;
	// let cookie = uni.getStorageSync('cookieKey');//取出Cookie
	let xiaotiyunUser = uni.getStorageSync('xiaotiyunUser'); // 用户信息
	let header = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'os': 'miniprogram',
	};
	let isHant = uni.getStorageSync('isHant');
	if (isHant) {
		header['Accept-Language'] = "zh-Hant";
	} else {
		header['Accept-Language'] = "zh-Hans";
	}
    if (xiaotiyunUser) {
        if (xiaotiyunUser.hasOwnProperty('teacher')) {
			const uid = xiaotiyunUser.teacher.teacherId || undefined;
			const token = xiaotiyunUser.teacher.token || undefined;
			if (uid && token) {
				header.uid = uid;
				header.token = token;
			}
			header.loginType = "teacher";
			domain = xiaotiyunUser.teacher.domain;
        } else if (xiaotiyunUser.hasOwnProperty('parent')) {
			const uid = xiaotiyunUser.parent.id || undefined;
			const studentId = xiaotiyunUser.parent.studentId || undefined;
			const token = xiaotiyunUser.parent.token || undefined;
			if (uid && studentId && token) {
				header.uid = uid;
				header.studentId = studentId;
				header.token = token;
			}
			header.loginType = "studentParent";
			domain = xiaotiyunUser.parent.domain;
        } else if (xiaotiyunUser.hasOwnProperty('student')) {
            // 学生端登录信息（避免访问 parent.id 报错）
            const uid = xiaotiyunUser.student.uid || xiaotiyunUser.student.studentId || undefined;
            const token = xiaotiyunUser.student.token || undefined;
            if (uid && token) {
                header.uid = uid;
                header.token = token;
            }
            header.loginType = "student";
            domain = xiaotiyunUser.student.domain;
		}
		header = Object.assign({}, header, {
			...headers
		})
	}
	if (userCenterUrlList.indexOf(apiUrl) > -1) {
		BASE_URL = USERCENTER;
	} else {
		BASE_URL = domain;
	}
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中',
		});
		params = trans(params);
		let reqUrl = `${BASE_URL}${apiUrl}`;
		if (params) {
			reqUrl = `${reqUrl}?${params}`;
		}
		uni.request({
			url: reqUrl,
			method: 'GET',
			dataType: 'text',
			header: header,
			success: (res) => {
				if (res.statusCode == 200) {
					resolve(handleResData(res.data))
				} else if (res.statusCode == 400) {
					if (res.data) {
						const data = JSON.parse(res.data);
						if (data.error == 10317) {
							const date = dateFormat(new Date(data.data), 'yyyy年MM月dd日');
							const message = `您的账号已于${date}到期`;
							uni.clearStorage();
							uni.reLaunch({
								url: '/pages/login/index/index'
							});
							const timer = setTimeout(() => {
								uni.showToast({
									title: message,
									icon: "none"
								});
								clearTimeout(timer);
							}, 1000);
							return;
						} else {
							uni.showToast({
								title: data.message ? data.message : '服务器开小差',
								duration: 2000,
								icon: "none",
								mask: true
							})
						}
					}
				} else if (res.statusCode == 401) {
					uni.clearStorage();
					// #ifdef MP-WEIXIN
					wx.showToast({
						title: "登录状态过期",
						duration: 2000,
						icon: "none",
						mask: true
					});
					wx.reLaunch({
						url: '/pages/login/index/index',
					})
					// #endif
					// #ifdef MP-ALIPAY
					my.showToast({
						type: 'none',
						content: '登录状态过期',
						duration: 2000
					})
					my.reLaunch({
						url: '/pages/login/index/index',
					})
					// #endif
				} else {
					if (res.data) {
						let resData = JSON.parse(res.data);
						// #ifdef MP-WEIXIN
						wx.showToast({
							title: resData.message ? resData.message : '服务器开小差',
							duration: 2000,
							icon: "none",
							mask: true
						})
						// #endif
						// #ifdef MP-ALIPAY
						my.showToast({
							type: 'none',
							content: resData.message ? resData.message : '服务器开小差',
							duration: 1000
						})
						// #endif
					}
				}
			},
			fail: (err) => {
				// #ifdef MP-WEIXIN
				wx.showToast({
					title: "服务器开小差",
					duration: 2000,
					icon: "none",
					mask: true
				})
				// #endif
				// #ifdef MP-ALIPAY
				if (err.statusCode == 401) {
					uni.clearStorage();
					my.showToast({
						type: 'none',
						content: '登录状态过期',
						duration: 2000
					})
					my.reLaunch({
						url: '/pages/login/index/index',
					})
				} else {
					my.showToast({
						type: 'none',
						content: '服务器开小差',
						duration: 2000,
					})
				}
				// #endif
				reject(err)
			},
			complete: () => {
				uni.hideLoading();
			}
		})
	})
}

export const postReq = (apiUrl, params, headers) => {
	let BASE_URL, domain;
	// let cookie = uni.getStorageSync('cookieKey');//取出Cookie
	let xiaotiyunUser = uni.getStorageSync('xiaotiyunUser'); // 用户信息
	let header = {
		'Content-Type': 'application/json',
		...headers
	};
	let isHant = uni.getStorageSync('isHant');
	if (isHant) {
		header['Accept-Language'] = "zh-Hant";
	} else {
		header['Accept-Language'] = "zh-Hans";
	}
	const isEncrypt = USERCENTER === 'https://xty.public.xiaoti.cloud'
	console.log(xiaotiyunUser);
    if (xiaotiyunUser) {
        if (xiaotiyunUser.hasOwnProperty('teacher')) {
			const uid = xiaotiyunUser.teacher.teacherId || undefined;
			const token = xiaotiyunUser.teacher.token || undefined;
			if (isEncrypt && uid && token) {
				header.security = AES_ECB_ENCRYPT(JSON.stringify({
					uid: uid,
					token: token
				}))
			} else if (uid && token) {
				header.uid = uid;
				header.token = token;
				header.os = 'miniprogram';
			}
			header.loginType = "teacher";
			domain = xiaotiyunUser.teacher.domain;
        } else if (xiaotiyunUser.hasOwnProperty('parent')) {
			const uid = xiaotiyunUser.parent.id || undefined;
			const studentId = xiaotiyunUser.parent.studentId || undefined;
			const token = xiaotiyunUser.parent.token || undefined;
			if (isEncrypt && uid && studentId && token) {
				header.security = AES_ECB_ENCRYPT(JSON.stringify({
					uid: uid,
					studentId: studentId,
					token: token
				}))
			} else if (uid && studentId && token) {
				header.uid = uid;
				header.studentId = studentId;
				header.token = token;
				header.os = 'miniprogram';
			}
			header.loginType = "studentParent";
			domain = xiaotiyunUser.parent.domain;
        } else if (xiaotiyunUser.hasOwnProperty('student')) {
            const uid = xiaotiyunUser.student.uid || xiaotiyunUser.student.studentId || undefined;
            const token = xiaotiyunUser.student.token || undefined;
            if (isEncrypt && uid && token) {
                header.security = AES_ECB_ENCRYPT(JSON.stringify({
                    uid: uid,
                    token: token
                }))
            } else if (uid && token) {
                header.uid = uid;
                header.token = token;
                header.os = 'miniprogram';
            }
            header.loginType = "student";
            domain = xiaotiyunUser.student.domain;
		}
	}
	if (userCenterUrlList.indexOf(apiUrl) > -1) {
		BASE_URL = USERCENTER;
	} else {
		BASE_URL = domain;
	}
	if (apiUrl == URL.changeAvatar) {
		if (params.type == 2) {
			BASE_URL = domain;
		}
	}
	console.log(domain);
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中',
		});
		uni.request({
			url: `${BASE_URL}${apiUrl}`,
			method: 'POST',
			data: isEncrypt ? { encryptedData: AES_ECB_ENCRYPT(JSON.stringify(params)) } : params,
			dataType: 'text',
			header: header,
			success: (res) => {
				uni.hideLoading();
				if (res.statusCode == 200) {
					// if (res && res.header && (res.header['Set-Cookie'] || res.header['set-cookie'])) {
					// 	// console.log(res.header['Set-Cookie'].split(";")[0]);
					// 	if(res.header['Set-Cookie']){
					// 		uni.setStorageSync('cookieKey', res.header['Set-Cookie'].split(";")[0]);   //保存Cookie到Storage
					// 	}else{
					// 		uni.setStorageSync('cookieKey', res.header['set-cookie'].split(";")[0]);   //保存Cookie到Storage
					// 	}
					// }
					let data = isEncrypt ? AES_ECB_DECRYPT(res.data) : res.data;
					resolve(handleResData(data || ""));
				} else if (res.statusCode == 400) {
					if (res.data) {
						let data = isEncrypt ? JSON.parse(AES_ECB_DECRYPT(res.data)) : JSON.parse(res.data);
						if (data.error == 10317) {
							const date = dateFormat(new Date(data.data), 'yyyy年MM月dd日');
							const message = `您的账号已于${date}到期`;
							uni.clearStorage();
							uni.reLaunch({
								url: '/pages/login/index/index'
							});
							const timer = setTimeout(() => {
								uni.showToast({
									title: message,
									icon: "none"
								});
								clearTimeout(timer);
							}, 1000);
						} else {
							uni.showToast({
								title: data.message ? data.message : '服务器开小差',
								duration: 2000,
								icon: "none",
								mask: true
							})
						}
					}
				} else if (res.statusCode == 401) {
					uni.clearStorage();
					// #ifdef MP-WEIXIN
					wx.showToast({
						title: "登录状态过期",
						duration: 2000,
						icon: "none",
						mask: true
					});
					wx.reLaunch({
						url: '/pages/login/index/index',
					})
					// #endif
					// #ifdef MP-ALIPAY
					my.showToast({
						type: 'none',
						content: '登录状态过期',
						duration: 2000
					})
					my.reLaunch({
						url: '/pages/login/index/index',
					})
					// #endif
				} else {
					if (res.data) {
						let resData = isEncrypt ? JSON.parse(AES_ECB_DECRYPT(res.data)) : JSON.parse(res
							.data);
						// #ifdef MP-WEIXIN
						wx.showToast({
							title: resData.message ? resData.message : '服务器开小差',
							duration: 2000,
							icon: "none",
							mask: true
						})
						// #endif
						// #ifdef MP-ALIPAY
						my.showToast({
							type: 'none',
							content: resData.message ? resData.message : '服务器开小差',
							duration: 2000
						})
						// #endif
					} else {
						uni.showToast({
							title: "服务器开小差",
							icon: "none"
						})
					}
				}
			},
			fail: (err) => {
				uni.hideLoading();
				// #ifdef MP-WEIXIN
				wx.showToast({
					title: "服务器开小差",
					duration: 2000,
					icon: "none",
					mask: true
				})
				// #endif
				// #ifdef MP-ALIPAY
				if (err.statusCode == 401) {
					uni.clearStorage();
					my.showToast({
						type: 'none',
						content: '登录状态过期',
						duration: 2000
					})
					my.reLaunch({
						url: '/pages/login/index/index',
					})
				} else {
					my.showToast({
						type: 'none',
						content: '服务器开小差',
						duration: 2000,
					})
				}
				// #endif
				reject(err)
			},
			complete: () => {
				// uni.hideLoading();
			}
		})
	})
}