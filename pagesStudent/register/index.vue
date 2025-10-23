<template>
	<view class="register-container">
		<!-- 顶部背景图片 -->
		<view class="top-background">
			<image src="/static/images/students/bgimage.png" mode="aspectFill" class="background-image"></image>
		</view>
		
		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		
		<!-- 注册表单区域 -->
		<view class="register-form-container">
			<!-- Logo区域 -->
			<view class="logo-section">
				<image src="/static/images/students/logo.png" mode="aspectFit" class="logo-image"></image>
				<view class="app-title">校体云</view>
			</view>
			
			<!-- 步骤指示器 -->
			<view class="step-indicator">
				<view class="step-item" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
					<view class="step-number">1</view>
					<view class="step-text">验证学籍号</view>
				</view>
				<view class="step-line" :class="{ 'active': currentStep > 1 }"></view>
				<view class="step-item" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
					<view class="step-number">2</view>
					<view class="step-text">绑定手机号</view>
				</view>
				<view class="step-line" :class="{ 'active': currentStep > 2 }"></view>
				<view class="step-item" :class="{ 'active': currentStep >= 3 }">
					<view class="step-number">3</view>
					<view class="step-text">设置密码</view>
				</view>
			</view>
			
			<!-- 注册表单 -->
			<view class="register-form">
				<!-- 步骤1：验证学籍号 -->
				<view class="form-step" v-if="currentStep === 1">
					<view class="step-title">验证学籍号</view>
					<view class="step-desc">请输入您的学籍号，我们将验证您的身份信息</view>
					
					<view class="input-group">
						<view class="input-label">学籍号</view>
						<view class="input-wrapper">
							<input 
								v-model="formData.studentId" 
								placeholder="请输入学籍号" 
								class="input-field"
								:class="{ 'error': errors.studentId }"
								@input="clearError('studentId')"
							/>
						</view>
						<view class="error-message" v-if="errors.studentId">{{ errors.studentId }}</view>
					</view>
					
					<view class="input-group">
						<view class="input-label">姓名</view>
						<view class="input-wrapper">
							<input 
								v-model="formData.name" 
								placeholder="请输入姓名" 
								class="input-field"
								:class="{ 'error': errors.name }"
								@input="clearError('name')"
							/>
						</view>
						<view class="error-message" v-if="errors.name">{{ errors.name }}</view>
					</view>
					
					<view class="next-button" @click="verifyStudentId" :class="{ 'disabled': isVerifying }">
						<text class="next-button-text">{{ isVerifying ? '验证中...' : '下一步' }}</text>
					</view>
				</view>
				
				<!-- 步骤2：绑定手机号 -->
				<view class="form-step" v-if="currentStep === 2">
					<view class="step-title">绑定手机号</view>
					<view class="step-desc">请输入您的手机号，我们将发送验证码</view>
					
					<view class="input-group">
						<view class="input-label">手机号</view>
						<view class="input-wrapper">
							<input 
								v-model="formData.phone" 
								placeholder="请输入手机号" 
								type="number"
								class="input-field"
								:class="{ 'error': errors.phone }"
								@input="clearError('phone')"
							/>
						</view>
						<view class="error-message" v-if="errors.phone">{{ errors.phone }}</view>
					</view>
					
					<view class="input-group">
						<view class="input-label">验证码</view>
						<view class="input-wrapper verification-wrapper">
							<input 
								v-model="formData.verificationCode" 
								placeholder="请输入验证码" 
								type="number"
								class="input-field verification-input"
								:class="{ 'error': errors.verificationCode }"
								@input="clearError('verificationCode')"
							/>
							<view class="verification-btn" @click="sendVerificationCode" :class="{ 'disabled': !canSendCode }">
								<text class="verification-btn-text">{{ codeButtonText }}</text>
							</view>
						</view>
						<view class="error-message" v-if="errors.verificationCode">{{ errors.verificationCode }}</view>
					</view>
					
					<view class="button-group">
						<view class="prev-button" @click="prevStep">
							<text class="prev-button-text">上一步</text>
						</view>
						<view class="next-button" @click="verifyPhone" :class="{ 'disabled': isVerifying }">
							<text class="next-button-text">{{ isVerifying ? '验证中...' : '下一步' }}</text>
						</view>
					</view>
				</view>
				
				<!-- 步骤3：设置密码 -->
				<view class="form-step" v-if="currentStep === 3">
					<view class="step-title">设置密码</view>
					<view class="step-desc">请设置您的登录密码</view>
					
					<view class="input-group">
						<view class="input-label">密码</view>
						<view class="input-wrapper">
							<input 
								v-model="formData.password" 
								placeholder="请输入8-18位密码" 
								password
								class="input-field"
								:class="{ 'error': errors.password }"
								@input="clearError('password')"
							/>
						</view>
						<view class="error-message" v-if="errors.password">{{ errors.password }}</view>
					</view>
					
					<view class="input-group">
						<view class="input-label">确认密码</view>
						<view class="input-wrapper">
							<input 
								v-model="formData.confirmPassword" 
								placeholder="请再次输入密码" 
								password
								class="input-field"
								:class="{ 'error': errors.confirmPassword }"
								@input="clearError('confirmPassword')"
							/>
						</view>
						<view class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</view>
					</view>
					
					<view class="password-tips">
						<view class="tip-item" :class="{ 'valid': passwordTips.length.valid }">
							<text class="tip-text">密码长度8-18位</text>
						</view>
						<view class="tip-item" :class="{ 'valid': passwordTips.uppercase.valid }">
							<text class="tip-text">包含大写字母</text>
						</view>
						<view class="tip-item" :class="{ 'valid': passwordTips.lowercase.valid }">
							<text class="tip-text">包含小写字母</text>
						</view>
						<view class="tip-item" :class="{ 'valid': passwordTips.number.valid }">
							<text class="tip-text">包含数字</text>
						</view>
					</view>
					
					<view class="button-group">
						<view class="prev-button" @click="prevStep">
							<text class="prev-button-text">上一步</text>
						</view>
						<view class="next-button" @click="completeRegister" :class="{ 'disabled': isRegistering }">
							<text class="next-button-text">{{ isRegistering ? '注册中...' : '完成注册' }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 登录链接 -->
			<view class="login-link">
				<text class="login-text">已有账号？</text>
				<text class="login-link-text" @click="goToLogin">立即登录</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getReq, postReq } from '@/common/request.js'
import { URL } from '@/common/url.js'

export default {
	data() {
		return {
			statusBarHeight: 0,
			currentStep: 1,
			isVerifying: false,
			isRegistering: false,
			canSendCode: true,
			countdown: 0,
			formData: {
				studentId: '',
				name: '',
				phone: '',
				verificationCode: '',
				password: '',
				confirmPassword: ''
			},
			errors: {
				studentId: '',
				name: '',
				phone: '',
				verificationCode: '',
				password: '',
				confirmPassword: ''
			},
			passwordTips: {
				length: { valid: false },
				uppercase: { valid: false },
				lowercase: { valid: false },
				number: { valid: false }
			}
		}
	},
	computed: {
		codeButtonText() {
			return this.countdown > 0 ? `${this.countdown}s后重发` : '发送验证码'
		}
	},
	watch: {
		'formData.password'(newVal) {
			this.checkPasswordTips(newVal)
		}
	},
	onLoad() {
		this.getSystemInfo()
	},
	methods: {
		// 获取系统信息
		getSystemInfo() {
			const systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight || 20
		},
		
		// 清除错误信息
		clearError(field) {
			if (this.errors[field]) {
				this.errors[field] = ''
			}
		},
		
		// 检查密码提示
		checkPasswordTips(password) {
			this.passwordTips = {
				length: { valid: password.length >= 8 && password.length <= 18 },
				uppercase: { valid: /[A-Z]/.test(password) },
				lowercase: { valid: /[a-z]/.test(password) },
				number: { valid: /[0-9]/.test(password) }
			}
		},
		
		// 验证学籍号
		async verifyStudentId() {
			if (this.isVerifying) return
			
			// 表单验证
			if (!this.formData.studentId.trim()) {
				this.errors.studentId = '请输入学籍号'
				return
			}
			if (!this.formData.name.trim()) {
				this.errors.name = '请输入姓名'
				return
			}
			
			this.isVerifying = true
			
			try {
				// 调用验证学籍号API
				const params = {
					studentId: this.formData.studentId.trim(),
					name: this.formData.name.trim()
				}
				
				const response = await getReq(URL.apiGetVerifStudentInformation, params)
				console.log('验证学籍号响应:', response)
				
				if (response && response.data) {
					// 验证成功，进入下一步
					this.currentStep = 2
				} else {
					throw new Error('学籍号验证失败，请检查信息是否正确')
				}
				
			} catch (error) {
				console.error('验证学籍号失败:', error)
				uni.showToast({
					title: error.message || '验证失败，请检查网络连接',
					icon: 'none'
				})
			} finally {
				this.isVerifying = false
			}
		},
		
		// 发送验证码
		async sendVerificationCode() {
			if (!this.canSendCode) return
			
			// 验证手机号
			if (!this.formData.phone.trim()) {
				this.errors.phone = '请输入手机号'
				return
			}
			if (!/^1[3-9]\d{9}$/.test(this.formData.phone.trim())) {
				this.errors.phone = '请输入正确的手机号'
				return
			}
			
			try {
				// 调用发送验证码API
				const params = {
					phone: this.formData.phone.trim()
				}
				
				const response = await getReq(URL.apiGetCAPTCHA, params)
				console.log('发送验证码响应:', response)
				
				// 开始倒计时
				this.startCountdown()
				
				uni.showToast({
					title: '验证码已发送',
					icon: 'success'
				})
				
			} catch (error) {
				console.error('发送验证码失败:', error)
				uni.showToast({
					title: error.message || '发送失败，请重试',
					icon: 'none'
				})
			}
		},
		
		// 开始倒计时
		startCountdown() {
			this.canSendCode = false
			this.countdown = 60
			
			const timer = setInterval(() => {
				this.countdown--
				if (this.countdown <= 0) {
					clearInterval(timer)
					this.canSendCode = true
				}
			}, 1000)
		},
		
		// 验证手机号
		async verifyPhone() {
			if (this.isVerifying) return
			
			// 表单验证
			if (!this.formData.phone.trim()) {
				this.errors.phone = '请输入手机号'
				return
			}
			if (!/^1[3-9]\d{9}$/.test(this.formData.phone.trim())) {
				this.errors.phone = '请输入正确的手机号'
				return
			}
			if (!this.formData.verificationCode.trim()) {
				this.errors.verificationCode = '请输入验证码'
				return
			}
			
			this.isVerifying = true
			
			try {
				// 调用绑定手机号API
				const params = {
					studentId: this.formData.studentId.trim(),
					phone: this.formData.phone.trim(),
					verificationCode: this.formData.verificationCode.trim()
				}
				
				const response = await getReq(URL.apiGetBindContactInformation, params)
				console.log('绑定手机号响应:', response)
				
				if (response && response.data) {
					// 验证成功，进入下一步
					this.currentStep = 3
				} else {
					throw new Error('验证码验证失败，请检查验证码是否正确')
				}
				
			} catch (error) {
				console.error('验证手机号失败:', error)
				uni.showToast({
					title: error.message || '验证失败，请检查网络连接',
					icon: 'none'
				})
			} finally {
				this.isVerifying = false
			}
		},
		
		// 完成注册
		async completeRegister() {
			if (this.isRegistering) return
			
			// 表单验证
			if (!this.formData.password.trim()) {
				this.errors.password = '请输入密码'
				return
			}
			if (!this.formData.confirmPassword.trim()) {
				this.errors.confirmPassword = '请确认密码'
				return
			}
			if (this.formData.password !== this.formData.confirmPassword) {
				this.errors.confirmPassword = '两次输入的密码不一致'
				return
			}
			
			// 检查密码强度
			const passwordValid = Object.values(this.passwordTips).every(tip => tip.valid)
			if (!passwordValid) {
				uni.showToast({
					title: '密码强度不符合要求',
					icon: 'none'
				})
				return
			}
			
			this.isRegistering = true
			
			try {
				// 调用设置密码API
				const params = {
					studentId: this.formData.studentId.trim(),
					phone: this.formData.phone.trim(),
					password: this.formData.password.trim()
				}
				
				const response = await postReq(URL.apiPostSetPassword, params)
				console.log('设置密码响应:', response)
				
				if (response && response.data) {
					// 注册成功，保存用户信息
					uni.setStorageSync('xiaotiyunUser', response.data)
					
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					})
					
					// 跳转到学生首页
					setTimeout(() => {
						uni.reLaunch({
							url: '/pagesStudent/home/index'
						})
					}, 1500)
				} else {
					throw new Error('注册失败，请重试')
				}
				
			} catch (error) {
				console.error('注册失败:', error)
				uni.showToast({
					title: error.message || '注册失败，请检查网络连接',
					icon: 'none'
				})
			} finally {
				this.isRegistering = false
			}
		},
		
		// 上一步
		prevStep() {
			if (this.currentStep > 1) {
				this.currentStep--
			}
		},
		
		// 跳转到登录页面
		goToLogin() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.register-container {
	min-height: 100vh;
	background: #FFFFFF;
	position: relative;
}

.top-background {
	position: relative;
	width: 100%;
	height: 500rpx;
	overflow: hidden;
}

.background-image {
	width: 100%;
	height: 100%;
}

.status-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	width: 100%;
}

.register-form-container {
	position: relative;
	z-index: 5;
	margin-top: -200rpx;
	background: #FFFFFF;
	border-radius: 32rpx 32rpx 0 0;
	padding: 60rpx 64rpx 100rpx;
	min-height: calc(100vh - 300rpx);
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.logo-image {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 24rpx;
}

.app-title {
	font-size: 48rpx;
	font-weight: 600;
	color: #2C84FF;
}

.step-indicator {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 60rpx;
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.step-number {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: #E5E5E5;
	color: #999999;
	font-size: 24rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12rpx;
	transition: all 0.3s ease;
}

.step-item.active .step-number {
	background: #2C84FF;
	color: #FFFFFF;
}

.step-item.completed .step-number {
	background: #4CD964;
	color: #FFFFFF;
}

.step-text {
	font-size: 24rpx;
	color: #999999;
	transition: color 0.3s ease;
}

.step-item.active .step-text {
	color: #2C84FF;
}

.step-item.completed .step-text {
	color: #4CD964;
}

.step-line {
	width: 80rpx;
	height: 4rpx;
	background: #E5E5E5;
	margin: 0 20rpx;
	transition: background 0.3s ease;
}

.step-line.active {
	background: #2C84FF;
}

.register-form {
	width: 100%;
}

.form-step {
	width: 100%;
}

.step-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
	text-align: center;
	margin-bottom: 16rpx;
}

.step-desc {
	font-size: 28rpx;
	color: #666666;
	text-align: center;
	margin-bottom: 60rpx;
}

.input-group {
	margin-bottom: 40rpx;
}

.input-label {
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 16rpx;
}

.input-wrapper {
	position: relative;
}

.input-field {
	width: 100%;
	height: 88rpx;
	padding: 0 24rpx;
	border: 2rpx solid #E5E5E5;
	border-radius: 16rpx;
	font-size: 32rpx;
	color: #333333;
	background: #FFFFFF;
	box-sizing: border-box;
	transition: border-color 0.3s ease;
}

.input-field:focus {
	border-color: #2C84FF;
}

.input-field.error {
	border-color: #FF4757;
}

.verification-wrapper {
	display: flex;
	gap: 16rpx;
}

.verification-input {
	flex: 1;
}

.verification-btn {
	width: 200rpx;
	height: 88rpx;
	background: #2C84FF;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.3s ease;
}

.verification-btn.disabled {
	opacity: 0.6;
}

.verification-btn-text {
	font-size: 28rpx;
	color: #FFFFFF;
	font-weight: 500;
}

.error-message {
	font-size: 24rpx;
	color: #FF4757;
	margin-top: 8rpx;
}

.password-tips {
	margin-bottom: 40rpx;
}

.tip-item {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.tip-item::before {
	content: '';
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background: #E5E5E5;
	margin-right: 12rpx;
	transition: background 0.3s ease;
}

.tip-item.valid::before {
	background: #4CD964;
}

.tip-text {
	font-size: 24rpx;
	color: #666666;
}

.tip-item.valid .tip-text {
	color: #4CD964;
}

.button-group {
	display: flex;
	gap: 24rpx;
	margin-bottom: 40rpx;
}

.prev-button {
	flex: 1;
	height: 88rpx;
	background: #F5F5F5;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.prev-button-text {
	font-size: 32rpx;
	color: #666666;
	font-weight: 500;
}

.next-button {
	flex: 1;
	height: 88rpx;
	background: linear-gradient(135deg, #2C84FF 0%, #4A9EFF 100%);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.3s ease;
}

.next-button.disabled {
	opacity: 0.6;
}

.next-button-text {
	font-size: 32rpx;
	color: #FFFFFF;
	font-weight: 600;
}

.login-link {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8rpx;
}

.login-text {
	font-size: 28rpx;
	color: #999999;
}

.login-link-text {
	font-size: 28rpx;
	color: #2C84FF;
	font-weight: 500;
}
</style>
