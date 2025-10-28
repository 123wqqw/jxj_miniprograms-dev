// export const BASE_URL = 'http://xcx.jlp.iydsj.com/minipro';// 测试环境 wxa42110a594709fc8
// export const BASE_URL = 'https://xty.yuxi.xiaotiyun.cn/minipro';// 云南正式环境 wxa42110a594709fc8
// const BASE_URL = 'https://xty.iydsj.com/api'; // 正式环境 wx384c94eaf17a6fd4
// export const USERCENTER = 'http://test.usercenter.xiaotiyun.cn';
// export const USERCENTER = 'https://usercenter.xiaotiyun.cn';
export const USERCENTER = process.env.VUE_APP_BASE_URL;
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
	let studentInfo = uni.getStorageSync('studentInfo'); // 可能包含 domain 的本地信息
	console.log('xiaotiyunUser---',xiaotiyunUser)
	
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
            const studentId = xiaotiyunUser.student.studentId || xiaotiyunUser.student.uid || undefined;
            if (uid && token) {
                header.uid = uid;
                header.token = token;
            }
            // 按需切换为 studentParent 并补充 studentId，避免后端按家长身份校验时报参数不足
            header.loginType = "studentParent";
            if (studentId) {
                header.studentId = studentId;
            }
            // 兜底 domain（避免缺失导致非 usercenter 接口请求失败）
            domain = xiaotiyunUser.student.domain || (studentInfo && studentInfo.domain)
						
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
	// 学生角色：非 USERCENTER 业务域接口统一按学生身份请求，避免 token 与角色不匹配（如 xty-task）
	if (xiaotiyunUser && xiaotiyunUser.hasOwnProperty('student')) {
		const isUserCenter = BASE_URL === USERCENTER;
		if (!isUserCenter) {
			header.loginType = 'student';
			// 非家长场景不强制携带 studentId
			if (header.studentId) delete header.studentId;
		}
	}
	// 当为学生角色时，针对不同服务动态设置 loginType：
	// - 非 USERCENTER 业务域（如 xty-task、xty-plan 等），多数接口期望学生角色鉴权，使用 loginType=student
	// - USERCENTER 或明确要求家长场景的接口再使用 studentParent
	if (xiaotiyunUser && xiaotiyunUser.hasOwnProperty('student')) {
		const isUserCenter = BASE_URL === USERCENTER;
		if (!isUserCenter) {
			header.loginType = 'student';
			// 学生场景通常不必带 studentId，避免后端按家长场景校验导致 401
			if (header.studentId) delete header.studentId;
		}
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
	let studentInfo = uni.getStorageSync('studentInfo'); // 用户信息
	console.log('studentInfostudentInfostudentInfostudentInfostudentInfostudentInfostudentInfostudentInfo',studentInfo);
	
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
	const isEncrypt = USERCENTER === 'https://jxz.qhfx.edu.cn:41088/home-gym-public/'
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
            const studentId = xiaotiyunUser.student.studentId || xiaotiyunUser.student.uid || undefined;
            if (isEncrypt && uid && token) {
                // 加密场景下，若按 studentParent 校验，通常需要携带 studentId
                const securityPayload = studentId ? { uid, token, studentId } : { uid, token };
                header.security = AES_ECB_ENCRYPT(JSON.stringify(securityPayload))
            } else if (uid && token) {
                header.uid = uid;
                header.token = token;
                header.os = 'miniprogram';
                // 非加密场景补充 studentId
                if (studentId) header.studentId = studentId;
            }
            header.loginType = "studentParent";
            domain = xiaotiyunUser.student.domain ?xiaotiyunUser.student.domain :studentInfo.domain;

						console.log('domaindomaindomaindomain',domain);
						
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
