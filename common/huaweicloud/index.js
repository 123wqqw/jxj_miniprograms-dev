/**
 * 小程序直连OBS文档 华为云
 * https://support.huaweicloud.com/bestpractice-obs/obs_05_2000.html
 */

// // 引入配置文件
// const config = require('./Configuration.js');
// // 引入policy编码计算方法
// const getPolicyEncode = require('./GetPolicy.js');
// // 引入签名计算方法
// const getSignature = require('./GetSignature.js');

import { getReq } from '@/common/request.js';
import store from '@/store/index.js';
import { showToast, dateFormat } from '@/common/util.js';

// const OBSupload = function(filePath, type) {
// 	return new Promise((reponse, reject) => {
// 		if (!filePath) {
// 			reject(false)
// 			showToast("Invalid filePath")
// 			return
// 		}

// 		const paths = type === 'video' ? 'xiaotiyun/minprogram/sports-clock-video' :
// 			"xiaotiyun-images/minprogram/avatar-img";
// 		const now = new Date()
// 		const dateStr = dateFormat(now, 'yyyy-MM-dd');
// 		const fileExt = filePath.substring(filePath.lastIndexOf("."));
// 		const key =
// 			`${paths}/${dateStr}/${store.state.xiaotiyunUser.teacher.teacherId}-${now.getTime()}${fileExt}`;
// 		const OBSPolicy = { // 设定policy内容，policy规则定义可参考步骤3中的超链接签名计算规则文档
// 			"expiration": new Date(now.setMinutes(now.getMinutes() + 60)), // 过期时间（有效时间为60分钟）
// 			"conditions": [{
// 					"bucket": type === 'video' ? 'gxapp-vedio' : 'gxapp-images'
// 				}, // 桶名要和配置文件中endpoint中的桶名保持一致
// 				{
// 					'key': key
// 				}
// 			]
// 		}

// 		// 计算base64编码后的policy
// 		const policyEncoded = getPolicyEncode(OBSPolicy);
// 		// 计算signature
// 		const signature = getSignature(policyEncoded, config.SecretKey);

// 		const bucket = type === 'video' ? config.videoHost : config.host
// 		uni.uploadFile({
// 			url: bucket, //上传视频接口
// 			filePath: filePath,
// 			name: 'file',
// 			header: {
// 				'content-type': 'multipart/form-data; boundary=-9431149156168',
// 			},
// 			formData: {
// 				'AccessKeyID': config.AccessKeyId,
// 				'policy': policyEncoded,
// 				'signature': signature,
// 				'key': key
// 			},
// 			success: function(res) {
// 				if (res.statusCode == '204') {
// 					const url = type === 'video' ? config.videoHost.replace(
// 						'gxapp-vedio.obs.cn-east-3.myhuaweicloud.com',
// 						'gxapp-vedio.iydsj.com') : config.host.replace(
// 						'gxapp-images.obs.cn-east-3.myhuaweicloud.com',
// 						'gxapp-images.iydsj.com')
// 					reponse(`${url}/${key}`)
// 				} else {
// 					showToast("Uploaded failed")
// 					reject(false)
// 				}
// 			},
// 			fail: function(e) {
// 				reject(e)
// 			}
// 		})
// 	})
// }

/**
 * OBS使用临时授权URL上传文件
 * @param {Object} filePath 文件路径
 * @param {Object} params 传参
 */
function OBSTempAuthUpload(filePath, params) {
	return new Promise((response, reject) => {
		if (!filePath || !params) {
			reject(false);
			return false;
		}

		const uploadFile = (res, data) => {
			uni.request({
				url: res.signedUrl,
				method: params.method,
				withCredentials: false,
				header: { 'Content-Type': params.contentType },
				responseType: 'text',
				data: data,
				success(resp) {
					if (resp.statusCode == 200) {
						console.log('Creating object using temporary signature succeed.');
						response(params.result);
					} else {
						console.log('Creating object using temporary signature failed!');
						console.log('status:' + resp.status);
						console.log(resp.data);
						reject(false);
					}
				},
				fail(error) {
					console.log(' obs temp sign upload error: ', error);
					reject(false)
				}
			});
		};

		const readFile = (res) => {
			let fileManager = uni.getFileSystemManager();
			fileManager.readFile({
				filePath: filePath,
				success: (resp) => {
					uploadFile(res, resp.data);
				},
				fail: (error) => {
					reject(false)
					console.log(' obs temp sign read error: ', error);
				}
			});
		};

		const tmpParams = {
			bucketName: params.bucketName,
			objectKey: params.objectKey,
			method: params.method,
			contentType: params.contentType
		}
		getReq('/xty-other/app-api/obs/v290/getTemporaryUrl', tmpParams).then((res) => {
			if (res.data) {
				readFile(JSON.parse(res.data));
			} else {
				reject(false)
				console.log(' obs temp sign empty err: ', res.message);
			}
		}).catch((err) => {
			reject(false)
			console.log(' obs temp sign err: ', err);
		});
	});
}

/**
 * 图片或视频文件上传
 * @param {Object} filePath 文件路径
 * @param {Object} type 文件类型：图片/视频
 */
function OBSupload(filePath, type) {
	if (!filePath) {
		return new Promise((response, reject) => reject(false))
	}
	let host = 'https://gxapp-images.iydsj.com';
	let paths = "xiaotiyun-images/minprogram/avatar-img";
	if (type === 'video') {
		host = 'https://gxapp-vedio.iydsj.com';
		paths = 'xiaotiyun/minprogram/sports-clock-video';
	}
	const now = new Date();
	const dateStr = dateFormat(now, 'yyyy-MM-dd');
	const fileExt = filePath.substring(filePath.lastIndexOf("."));
	const teacherId = store.state.xiaotiyunUser.teacher.teacherId;
	const objectKey = `${paths}/${dateStr}/${teacherId}-${now.getTime()}${fileExt}`;
	const bucket = type === 'video' ? 'gxapp-vedio' : 'gxapp-images';
	const resultUrl = host + '/' + objectKey;

	const params = {
		method: 'PUT',
		contentType: 'text/plain',
		bucketName: bucket,
		paths: paths,
		objectKey: objectKey,
		result: resultUrl,
	}
	return OBSTempAuthUpload(filePath, params)
}

module.exports = OBSupload;