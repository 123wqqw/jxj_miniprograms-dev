<template>
	<view class="forgot-container">
		<!-- 重置密码卡片 -->
		<view class="forgot-card">

			<view class="form-container">
				<!-- 账号信息 -->
				<view class="account-info">
					<text class="section-title">账号信息</text>
					<view
						style="padding: 28rpx;border-radius: 8rpx;border: 1rpx solid #CCC">
						<view class="info-item">
							<text>学籍号：</text>
							<text>{{ studentCode }}</text>
						</view>
						<view class="info-item">
							<text>姓名：</text>
							<text>{{ name }}</text>
						</view>
					</view>
				</view>

				<!-- 设置新密码 -->
				<view class="password-section">
					<text class="section-title">重置密码</text>

					<view class="input-group">
					<input class="input-field" type="text" password="true" v-model="newPassword" @input="watchForm"
							placeholder="请输入密码" placeholder-class="input-placeholder" />
						<text class="password-hint">请输入8-18位密码，必须包含大小写字母和数字</text>
					</view>

					<view class="input-group">
					<input class="input-field" type="text" password="true" v-model="confirmPassword" @input="watchForm"
							placeholder="请再次输入密码" placeholder-class="input-placeholder" />
					</view>
				</view>

				<button class="complete-btn" :class="{ disabled: completeDisabled }" :disabled="completeDisabled"
					@click="handleComplete">
					完成
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import {
	postReq
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
			studentName: '',
			name: '',
			uid: '',
			sessionId: '',
			newPassword: '',
			confirmPassword: '',
			completeDisabled: true
		}
	},
	onLoad(options) {
		uni.setNavigationBarTitle({
			title: '账号信息'
		})

		if (options.studentCode) {
			this.studentCode = options.studentCode;
		}
		if (options.name) {
			this.name = options.name;
		}
		if (options.sessionId) {
			this.sessionId = options.sessionId;
		}
		if (options.uid) {
			this.uid = options.uid;
		}

	},
	methods: {
		

		// 监听表单变化
		watchForm() {
			// 仅在两个输入框都有值时启用“完成”按钮
			this.completeDisabled = !(
				this.newPassword.trim() && this.confirmPassword.trim()
			);
		},

		// 点击时再严格校验
		validateForm() {
			if (!this.newPassword.trim() || !this.confirmPassword.trim()) {
				showToast('请输入并确认密码');
				return false;
			}
			
			if (this.newPassword !== this.confirmPassword) {
				showToast('两次输入的密码不一致');
				return false;
			}
			if (this.newPassword.length < 8 || this.newPassword.length > 18) {
				showToast('密码长度需8-18位');
				return false;
			}
			if (!this.validatePasswordComplexity(this.newPassword)) {
				showToast('密码需包含大小写字母和数字');
				return false;
			}
			return true;
		},

		// 验证密码复杂度
		validatePasswordComplexity(password) {
			// 必须包含大小写字母和数字
			const hasUpperCase = /[A-Z]/.test(password);
			const hasLowerCase = /[a-z]/.test(password);
			const hasNumber = /[0-9]/.test(password);

			return hasUpperCase && hasLowerCase && hasNumber;
		},

		// 处理完成
		handleComplete() {
			if (this.completeDisabled) return;
			if (!this.validateForm()) return;
			this.resetPassword();
		},

		// 重置密码
		resetPassword() {
			uni.showLoading({
				title: '设置中...'
			});

			// TODO: 替换为实际的API接口
			postReq(URL.apiPostSetPassword, {
				sessionId: this.sessionId,
				uid: this.uid,
				password: this.newPassword
			}).then(res => {
				uni.hideLoading();
				if (res.error == 10000) {
					showToast('密码设置成功');
					// 延迟跳转到登录页面
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login/login'
						});
					}, 1500);
				} else {
					showToast(res.message || '设置失败');
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

.account-info {
	margin-bottom: 40rpx;
	background: #F8F9FA;
	font-weight: 600;
	color: #333333;
}

.info-item {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.password-section {
	margin-bottom: 60rpx;
}

.section-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 30rpx;
}

.input-group {
	margin-bottom: 30rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.input-field {
	width: 100%;
	height: 88rpx;
	background: #FFFFFF;
	border: 1rpx solid #CCC;
	border-radius: 8rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333333;
	box-sizing: border-box;
	transition: border-color 0.3s ease;

	&:focus {
		border-color: #5C8FF7;
	}

}

.password-hint {
	display: block;
	font-size: 24rpx;
	color: #999999;
	margin-top: 12rpx;
	line-height: 1.4;
}

.input-placeholder {
	color: #999999;
}

.complete-btn {
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
