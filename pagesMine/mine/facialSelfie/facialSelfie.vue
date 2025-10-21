<template>
	<view class="container">
		<view class="top-part">
			<view class="portrait-border"
				:class="{'ios-border': isiOSSystem, 'white-border': state == 2, 'red-border': state == 3}">
				<camera id="facial-video" class="portrait-camera" frame-size="medium" device-position="front"
					flash="off" @error="cameraAuthError"></camera>
				<image :class="{'ios-bezel-img': isiOSSystem, 'and-bezel-img': !isiOSSystem}" :src="tmpSrc"
					mode="aspectFill" v-if="state != 1"></image>
				<image :class="{'ios-bezel-img': isiOSSystem, 'and-bezel-img': !isiOSSystem}"
					src="../../static/images/facial_bezel.png" mode="aspectFill" v-if="state == 1"></image>
				<view class="scan-view" :class="{'ios-scan': isiOSSystem}" v-if="state == 1"></view>
			</view>

			<view class="column-center" v-if="state == 0">
				<text class="validate-text">
					{{$t('mine.mine.facialCapture.confirmAs')}}
					<text class="blue-color">{{ teacher.name }}</text>
					{{$t('mine.mine.facialCapture.captureFacial')}}
				</text>
				<text class="tip-text gray-color">{{$t('mine.mine.facialCapture.tipState')}}</text>
				<image class="indicator" src="../../static/images/facial_indicator.png" mode="aspectFit">
				</image>
			</view>

			<view class="column-center" v-if="state == 1">
				<text class="validate-text">{{$t('mine.mine.facialCapture.tipCapturing')}}</text>
				<image class="indicator" src="../../static/images/facial_indicator.png" mode="aspectFit">
				</image>
			</view>

			<view class="column-center" v-if="state == 2">
				<text class="validate-text">{{$t('mine.mine.facialCapture.confirmPhoto')}}</text>
			</view>

			<view class="column-center" v-if="state == 3">
				<view class="row-center">
					<image class="validate-icon" src="../../static/images/warning_line.png" mode="aspectFit"></image>
					<text class="validate-text red-color">{{ errorTips || '' }}</text>
				</view>
				<text class="tip-text">{{ facialTips || '' }}</text>
				<image class="indicator" src="../../static/images/facial_indicator.png" mode="aspectFit"></image>
			</view>

			<view class="column-center" v-if="state == 5">
				<view class="row-center">
					<image class="validate-icon" src="../../static/images/check_circle_line.png" mode="aspectFit">
					</image>
					<text class="validate-text blue-color">{{$t('mine.mine.facialCapture.uploadSuccess')}}</text>
				</view>
				<text class="tip-text gray-color">{{ facialTips || '' }}</text>
			</view>

			<view class="column-center" v-if="state == 6">
				<view class="row-center">
					<image v-show="faceModel.modelStatus != 2" class="validate-icon"
						src="../../static/images/check_circle_line.png" mode="aspectFit">
					</image>
					<image v-show="faceModel.modelStatus == 2" class="validate-icon"
						src="../../static/images/warning_line.png" mode="aspectFit"></image>
					<text v-show="faceModel.modelStatus != 2 "
						class="validate-text blue-color">{{ facialTips || '' }}</text>
					<text v-show="faceModel.modelStatus == 2"
						class="validate-text red-color">{{ errorTips || '' }}</text>
				</view>
			</view>
		</view>

		<view class="bottom-part">
			<view v-if="[2,5,6].includes(state)" class="left-button" @click="tapLeftButton">
				{{leftButtonTitle}}
			</view>
			<view v-if="[0,1,2,3].includes(state)" class="right-button" @click="tapRightButton">
				<image v-if="state == 1" src="../../static/images/facial_camera.png" mode="aspectFit"></image>
				<text>{{ rightButtonTitle }}</text>
			</view>
		</view>

		<view class="compress">
			<canvas id="canvasId" canvas-id="canvasId" type="2d" :style="{width: '960px', height: '960px'}">
			</canvas>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";

	export default {
		data() {
			return {
				isiOSSystem: false,
				teacher: {},
				faceModel: {},
				tmpSrc: '../../static/images/facial_user.png',
				baiduToken: '',
				errorTips: '',
				facialTips: '',
				state: 0,
			}
		},

		computed: {
			...mapState(['xiaotiyunUser', 'schoolInfo']),

			leftButtonTitle() {
				switch (this.state) {
					case 2: // 重拍
						return this.$t('mine.mine.facialCapture.againPhoto');
					case 5: // 完成
						return this.$t('mine.mine.facialCapture.complete');
					case 6: // 重新录入
						return this.$t('mine.mine.facialCapture.againCapture');
					default:
						return "";
				}
			},
			rightButtonTitle() {
				switch (this.state) {
					case 0: // 开始录入
						return this.$t('mine.mine.facialCapture.begainCapture');
					case 1: // 拍照
						return this.$t('mine.mine.facialCapture.takePhoto');
					case 2: // 确认
						return this.$t('common.enter');
					case 3: // 重新录入
						return this.$t('mine.mine.facialCapture.againCapture');
					default:
						return '';
				}
			}
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('mine.mine.myInformation.facePhoto')
			});
			this.isiOSSystem = uni.getSystemInfoSync().osName === 'ios';
			this.teacher = this.xiaotiyunUser.teacher;

			this.faceModel = this.xiaotiyunUser.teacher.faceModelStatusVO;
			if (this.faceModel && this.faceModel.faceUrl) {
				this.state = 6;
				this.tmpSrc = this.schoolInfo.faceDomain + '/file' + this.faceModel.faceUrl;
				if (this.faceModel.modelStatus == 2) {
					this.errorTips = this.$t('mine.mine.facialCapture.captureFailState');
				} else if (this.faceModel.modelStatus == 1) {
					this.facialTips = this.$t('mine.mine.facialCapture.facialModeling');
				} else if (this.faceModel.modelStatus == 0) {
					this.facialTips = this.$t('mine.mine.facialCapture.uploadComplete');
				}
			}

			this.queryBaiduToken();
		},

		methods: {
			// 获取百度云token
			queryBaiduToken() {
				let params = {
					'grant_type': 'client_credentials',
					'client_id': '7aO67qYEKqhHIrHRbqLvcFVi',
					'client_secret': 'FexWTfbGyjqUFeIRwc9fnjto3CSyAN0m'
				};
				const _this = this;
				uni.request({
					url: 'https://aip.baidubce.com/oauth/2.0/token',
					method: 'GET',
					data: params,
					success(res) {
						_this.baiduToken = res.data.access_token || '';
					},
					fail() {
						_this.baiduToken = null;
					}
				})
			},

			// 用户不允许使用摄像头时触发
			cameraAuthError(err) {
				uni.showToast({
					icon: 'none',
					title: err.message
				});
			},

			// 点击左边按钮
			tapLeftButton() {
				if (this.state == 2) { // 重拍
					this.state = 1;
				} else if (this.state == 5) { // 确定
					uni.navigateBack();
				} else if (this.state == 6) { // 重新录入
					this.errorTips = null;
					this.facialTips = null;
					this.state = 1;
				}
			},

			// 点击右边按钮
			tapRightButton() {
				if (this.state == 0) { // 开始录入
					this.state = 1;
				} else if (this.state == 1) { // 拍照
					this.takePhoto();
				} else if (this.state == 2) { // 确认
					this.errorTips = null;
					this.facialTips = null;
					this.handlePhoto();
				} else if (this.state == 3) { // 重新录入
					this.errorTips = null;
					this.facialTips = null;
					this.state = 1;
				}
			},

			// 截取图片
			takePhoto() {
				const context = uni.createCameraContext();
				context.takePhoto({
					quality: 'high',
					success: (res) => {
						this.tmpSrc = res.tempImagePath;
						this.state = 2;
					},
					fail: () => {
						this.errorTips = this.$t('mine.mine.facialCapture.captureFailState');
						this.facialTips = this.$t('mine.mine.facialCapture.tipState');
						this.state = 3;
					}
				})
			},

			// 处理图片
			handlePhoto() {
				uni.showLoading();
				this.getImageSize(this.tmpSrc).then((size) => {
					if (size >= 100 * 1024 && size <= 300 * 1024) {
						this.readImage(this.tmpSrc);
					} else {
						this.redrawImage(this.tmpSrc);
					}
				}).catch(() => {
					this.readImage(this.tmpSrc);
				})
			},

			// 重绘图片
			redrawImage(imageSrc) {
				wx.createSelectorQuery()
					.select('#canvasId') // 在 WXML 中填入的 id
					.fields({ node: true, size: true })
					.exec((res) => {
						// Canvas 对象
						const canvas = res[0].node;

						// 渲染上下文
						const ctx = canvas.getContext('2d');

						// Canvas 画布的实际绘制宽高
						const width = res[0].width;
						const height = res[0].height;

						// 初始化画布大小
						const dpr = wx.getWindowInfo().pixelRatio;
						canvas.width = width * dpr;
						canvas.height = height * dpr;
						ctx.scale(dpr, dpr);

						// 图片对象
						const image = canvas.createImage()
						// 图片加载完成回调
						image.onload = () => {
							// 将图片绘制到 canvas 上
							ctx.drawImage(image, 0, 0, 640, 640);

							// 生成图片
							wx.canvasToTempFilePath({
								x: 0,
								y: 0,
								width: 640,
								height: 640,
								destWidth: 640,
								destHeight: 640,
								canvas,
								fileType: 'jpg',
								quality: 0.5,
								success: tempRes => {
									this.readImage(tempRes.tempFilePath);
								},
								fail: () => {
									this.errorTips = this.$t(
										'mine.mine.facialCapture.captureFailState');
									this.facialTips = null;
									this.state = 3;
									uni.hideLoading();
								}
							});
						};
						// 设置图片src
						image.src = imageSrc;
					})
			},

			// 读取图片为发送检测人脸
			readImage(imageSrc) {
				let fileManager = uni.getFileSystemManager();
				fileManager.readFile({
					encoding: 'base64',
					filePath: imageSrc,
					success: (res) => {
						this.sendImageDetection(res.data);
					},
					fail: () => {
						this.errorTips = this.$t('mine.mine.facialCapture.captureFailState');
						this.facialTips = null;
						this.state = 3;
						uni.hideLoading();
					}
				})
			},

			// 发送图片到百度云人脸检测
			sendImageDetection(image) {
				if (!this.baiduToken) { return; }
				let params = {
					'image': image,
					'image_type': 'BASE64',
					'face_field': 'quality,eye_status,mask,spoofing',
					'max_face_num': 10,
				};
				const _this = this;
				uni.request({
					url: `https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=${_this.baiduToken}`,
					method: 'POST',
					data: params,
					success(res) {
						if (res.data.error_code == 0) {
							let tips = _this.handleFacialInfo(res.data.result);
							if (tips !== '') {
								_this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
								_this.facialTips = tips;
								_this.state = 3
								uni.hideLoading();
							} else {
								_this.uploadImage(image);
							}
						} else {
							_this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
							_this.facialTips = null;
							_this.state = 3;
							uni.hideLoading();
						}
					},
					fail() {
						_this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
						_this.facialTips = null;
						_this.state = 3;
						uni.hideLoading();
					}
				})
			},

			// 处理百度人脸检测返回信息
			handleFacialInfo(info) {
				if (info.face_num > 1) { // 检测到的图片中的人脸数量
					return '请单独录入';
				}
				let face = info.face_list[0];
				if (face.face_probability < 0.8) { // 人脸置信度，范围【0~1】
					return '请录入人脸';
				}
				if (face.angle.yaw > 15 || face.angle.yaw < -15) { // 左右转脸，左右旋转角[-90(左), 90(右)]
					return '请不要左右转动';
				}
				if (face.angle.pitch > 20 || face.angle.pitch < -20) { // 抬头低头，俯仰角度[-90(上), 90(下)]
					return '请不要低头或抬头';
				}
				if (face.mask.type == 1 && face.mask.probability > 0.5) { // 带口罩，0代表没戴口罩 1 代表戴口罩，置信度，范围0~1
					return '请不要带口罩';
				}
				if (face.eye_status.left_eye < 0.3 || face.eye_status.right_eye <
					0.3) { // 左右眼闭合，[0,1]取值，越接近0闭合的可能性越大
					return '请不要闭眼';
				}
				if (face.quality.blur > 0.7) { // 人脸模糊程度，范围[0~1]，0表示清晰，1表示模糊
					return '请保持稳定，不要抖动';
				}
				if (face.quality.completeness != 1) { // 人脸完整度，0或1, 0为人脸溢出图像边界，1为人脸都在图像边界内
					return '请保持人脸在框内';
				}
				let occlusion = face.quality.occlusion;
				if (occlusion.left_eye > 0.3) { // 左眼遮挡比例，[0-1] ，1表示完全遮挡
					return '请不要遮挡眼睛';
				}
				if (occlusion.right_eye > 0.3) { // 右眼遮挡比例，[0-1] ， 1表示完全遮挡
					return '请不要遮挡眼睛';
				}
				if (occlusion.nose > 0.3) { // 鼻子遮挡比例，[0-1] ， 1表示完全遮挡
					return '请不要遮挡鼻子';
				}
				if (occlusion.mouth > 0.3) { // 嘴巴遮挡比例，[0-1] ， 1表示完全遮挡
					return '请不要遮挡嘴巴';
				}
				if (occlusion.left_cheek > 0.3) { // 左脸颊遮挡比例，[0-1] ， 1表示完全遮挡
					return '请不要遮挡脸颊';
				}
				if (occlusion.right_cheek > 0.3) { // 右脸颊遮挡比例，[0-1] ， 1表示完全遮挡
					return '请不要遮挡脸颊';
				}
				if (occlusion.chin > 0.3) { // 下巴遮挡比例，，[0-1] ， 1表示完全遮挡
					return '请不要遮挡下巴';
				}
				return '';
			},

			// 上传图片
			uploadImage(fileData) {
				const _this = this;
				const formData = {
					'baseFile': fileData, // 文件(BASE64)
					'userType': 1, // 用户类型（0.学生；1.教师）
					'uploadSource': '4' // 1.一体机；2.APP；3.管理后台；4.小程序
				};
				postReq(URL.apiPostSingleFaceUpload, formData).then((result) => {
					if (result.error == 10000) {
						_this.state = 5;
						uni.$emit("myInformationChanged", {});
					} else {
						_this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
						_this.facialTips = null;
						_this.state = 3;
					}
				}).catch((err) => {
					_this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
					_this.facialTips = null;
					_this.state = 3;
				}).finally(() => {
					uni.hideLoading();
				})
			},

			// 图片尺寸
			getImageSize(imageSrc) {
				return new Promise((resolve, reject) => {
					let fileManager = uni.getFileSystemManager();
					fileManager.getFileInfo({
						filePath: imageSrc,
						success: (fileInfo) => {
							resolve(fileInfo.size);
						},
						fail: () => {
							reject(false);
						}
					})
				})
			}

		},
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.top-part {
		margin-top: 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.portrait-border {
			width: 560rpx;
			height: 560rpx;
			margin-bottom: 36rpx;
			background-color: #F9F9F9;
			border: 8rpx solid #3A80FE;
			border-radius: 50%;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;

			.portrait-camera {
				width: inherit;
				height: inherit;
				border-radius: 50%;
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.and-bezel-img {
				position: absolute;
				top: 47rpx;
				left: 105rpx;
				width: 545rpx;
				height: 545rpx;
				border-radius: 50%;
				overflow: hidden;
				z-index: 50;
			}

			.ios-bezel-img {
				position: absolute;
				top: -2rpx;
				left: -2rpx;
				width: 554rpx;
				height: 554rpx;
				border-radius: 50%;
				overflow: hidden;
				z-index: 50;
			}

			@keyframes moveScan {
				from {
					transform: translateY(-140rpx);
				}

				to {
					transform: translateY(660rpx);
				}
			}

			@-webkit-keyframes moveScan {
				from {
					transform: translateY(-140rpx);
				}

				to {
					transform: translateY(calc(660rpx));
				}
			}

			.scan-view {
				width: inherit;
				height: 100rpx;
				margin-top: calc(0rpx - 140rpx - 560rpx);
				z-index: 100;
				overflow: hidden;
				background-image: url(../../static/images/facial_scan.png);
				background-size: 100% 100%;
				animation: moveScan 4s ease 1s infinite;

			}
		}

		.ios-border {
			-webkit-backface-visibility: hidden;
			-webkit-transform: translate3d(0, 0, 0);
		}

		.ios-scan {
			-webkit-animation: moveScan 4s ease 1s infinite;
		}

		.validate-text {
			font-size: 48rpx;
			font-weight: 500;
			color: #333333;
			text-align: center;
		}

		.white-border {
			border: 8rpx solid #FFFFFF;
		}

		.red-border {
			border: 8rpx solid #FF4444;
		}

		.blue-color {
			color: #3A80FE;
		}

		.red-color {
			color: #FF4444;
		}

		.gray-color {
			color: #999999;
		}

		.tip-text {
			margin-top: 16rpx;
			font-size: 32rpx;
			font-weight: 400;
		}

		.row-center {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}

		.column-center {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.validate-icon {
			width: 54rpx;
			height: 54rpx;
			margin-right: 8rpx;
		}

		.indicator {
			width: 344rpx;
			height: 170rpx;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
	}

	.bottom-part {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		.left-button {
			width: 300rpx;
			height: 108rpx;
			margin-top: 20rpx;
			margin-bottom: 40rpx;
			background-color: #FFFFFF;
			border-color: #2A84FF;
			border-radius: 54rpx;
			color: #2A84FF;
			font-size: 34rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}

		.right-button {
			width: 300rpx;
			height: 108rpx;
			margin-top: 20rpx;
			margin-bottom: 40rpx;
			background-color: #2A84FF;
			border-color: #2A84FF;
			border-radius: 54rpx;
			color: #FFFFFF;
			font-size: 34rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			image {
				width: 54rpx;
				height: 54rpx;
				margin-right: 4rpx;
			}

			.name {
				font-size: 28rpx;
			}
		}
	}

	.compress {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: -99999px;
		left: 0;
		overflow: hidden;
	}
</style>