<template>
	<view class="forgot-container">
		<!-- 验证码卡片 -->
		<view class="forgot-card">

			<view class="form-container">
				<view class="info-message">
					<text class="message-text">已向该学籍号绑定的</text>
					<text class="message-text">{{ maskedPhone }} 手机号发送验证码</text>
				</view>

				<view class="input-group">
					<view class="code-input-wrapper">
						<input class="code-input" type="number" v-model="verificationCode" @input="watchForm"
							placeholder="请输入验证码" placeholder-class="input-placeholder" maxlength="6" />
						<button class="resend-btn" :class="{ disabled: countdown > 0 }" :disabled="countdown > 0"
							@click="resendCode">
							{{ countdown > 0 ? `重新发送(${countdown})` : '重新发送' }}
						</button>
					</view>
				</view>

				<button class="next-btn" :class="{ disabled: nextDisabled }" :disabled="nextDisabled"
					@click="handleNext">
					下一步
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import {
	mapState,
} from 'vuex'
import {
	postReq,
	getReq
} from "../../../common/request.js";
import {
	URL
} from "../../../common/url.js";
import {
	showToast
} from '@/common/util.js'

export default {
	data() {
		return {
			studentCode: '',
			phone: '',
			maskedPhone: '',
			verificationCode: '',
			nextDisabled: true,
			countdown: 0,
			timer: null
		}
	},
	onLoad(options) {
		uni.setNavigationBarTitle({
			title: '忘记账号&密码'
		})

		if (options.studentCode) {
			this.studentCode = options.studentCode;
		}
		if (options.contactInformation) {
			this.phone = options.contactInformation;
			this.maskedPhone = this.maskPhone(options.contactInformation);
		}

		// 自动发送验证码
		this.sendVerificationCode();
	},
	onUnload() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},
	computed: {
		...mapState(['openid', 'userid', 'xiaotiyunUser']),
	},
	methods: {
		// 手机号脱敏
		maskPhone(phone) {
			if (phone && phone.length >= 11) {
				return phone.substring(0, 3) + '****' + phone.substring(7);
			}
			return phone;
		},

		// 监听表单变化
		watchForm() {
			this.nextDisabled = !this.verificationCode.trim() || this.verificationCode.length < 4;
		},

		// 发送验证码
		sendVerificationCode() {
			uni.showLoading({
				title: '发送中...'
			});

			// TODO: 替换为实际的API接口
			getReq(URL.apiGetCAPTCHA, {
				contactInformation: this.phone
			}).then(res => {
				uni.hideLoading();
				if (res.error == 10000) {
					showToast('验证码已发送');
					this.startCountdown();
				} else {
					showToast(res.message || '发送失败');
				}
			}).catch(err => {
				uni.hideLoading();
				showToast('网络错误，请重试');
			})
		},

		// 重新发送验证码
		resendCode() {
			if (this.countdown > 0) return;
			this.sendVerificationCode();
		},

		// 开始倒计时
		startCountdown() {
			this.countdown = 60;
			this.timer = setInterval(() => {
				this.countdown--;
				if (this.countdown <= 0) {
					clearInterval(this.timer);
					this.timer = null;
				}
			}, 1000);
		},

		// 处理下一步
		handleNext() {
			if (this.nextDisabled) return;

			// 验证验证码
			this.verifyCode();
		},

		// 验证验证码
		verifyCode() {
			uni.showLoading({
				title: '验证中...'
			});

			// TODO: 替换为实际的API接口
			getReq(URL.apiGetBindContactInformation, {
				studentCode: this.studentCode,
				contactInformation: this.phone,
				code: this.verificationCode,
				wechatOpenid: this.openid
			}).then(res => {
				uni.hideLoading();
				if (res.error == 10000) {
					// 验证码正确，跳转到重置密码页面
					const name = res?.data?.name || ''
					const sessionId = res?.data?.sessionId || ''
					const uid = res?.data?.uid || ''
					
					uni.navigateTo({
						url: `/pages/login/forgotPassword/step3?studentCode=${this.studentCode}&name=${name}&sessionId=${sessionId}&uid=${uid}`
					})
				} else {
					showToast(res.message || '验证码错误');
				}
			}).catch(err => {
				uni.hideLoading();
				showToast('网络错误，请重试');
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.forgot-container {
	width: 100%;
	min-height: 100vh;
	background: #FFFFFF;
	display: flex;
	box-sizing: border-box;
}

.forgot-card {
	width: 100%;
	background: #FFFFFF;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
}


.form-container {
	padding: 40rpx 60rpx;
}

.info-message {
	margin-bottom: 40rpx;
	border-radius: 8rpx;
}

.message-text {
	display: block;
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
}

.input-group {
	margin-bottom: 60rpx;
}

.code-input-wrapper {
	display: flex;
	align-items: center;
	border: 1rpx solid #CCC;
	border-radius: 8rpx;
	gap: 20rpx;
}

.code-input {
	flex: 1;
	height: 88rpx;
	background: #FFFFFF;
	border-radius: 8rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333333;
	box-sizing: border-box;
	transition: border-color 0.3s ease;

}

.resend-btn {
	height: 88rpx;
	line-height: 88rpx;
	padding: 0 24rpx;
	background: transparent;
	font-size: 28rpx;
	color: #666666;
	white-space: nowrap;
	transition: all 0.3s ease;
	background: #e4ecfb;
	color: #2C84FF;

	&.disabled {
		background: #EEE;
		color: #999999;
		border: none;
	}

	&::after {
		border: unset;
	}
}


.next-btn {
	width: 300rpx;
	height: 88rpx;
	border: none;
	border-radius: 48rpx;
	font-size: 36rpx;
	background: #e4ecfb;
	color: #2C84FF;
	transition: all 0.3s ease;
	text-align: center;
	font-weight: 600;

	&.disabled {
		background: #EEE;
		color: #999999;
		border: none;
	}

	&::after {
		border: unset;
	}
}
</style>
