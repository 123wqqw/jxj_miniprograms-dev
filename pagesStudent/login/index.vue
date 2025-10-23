<template>
	<view class="login-container">
		<!-- 顶部背景图片 -->
		<view class="top-background">
			<image src="/static/images/students/bgimage.png" mode="aspectFill" class="background-image"></image>
		</view>
		
		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		
		<!-- 登录表单区域 -->
		<view class="login-form-container">
			<!-- Logo区域 -->
			<view class="logo-section">
				<image src="/static/images/students/logo.png" mode="aspectFit" class="logo-image"></image>
				<view class="app-title">校体云</view>
			</view>
			
			<!-- 登录表单 -->
			<view class="login-form">
				<view class="form-title">学生登录</view>
				
				<!-- 学籍号输入框 -->
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
				
				<!-- 密码输入框 -->
				<view class="input-group">
					<view class="input-label">密码</view>
					<view class="input-wrapper">
						<input 
							v-model="formData.password" 
							placeholder="请输入密码" 
							password
							class="input-field"
							:class="{ 'error': errors.password }"
							@input="clearError('password')"
						/>
					</view>
					<view class="error-message" v-if="errors.password">{{ errors.password }}</view>
				</view>
				
				<!-- 忘记密码链接 -->
				<view class="forgot-password" @click="goToForgotPassword">
					<text class="forgot-text">忘记密码？</text>
				</view>
				
				<!-- 登录按钮 -->
				<view class="login-button" @click="handleLogin" :class="{ 'disabled': isLogging }">
					<text class="login-button-text">{{ isLogging ? '登录中...' : '登录' }}</text>
				</view>
				
				<!-- 注册链接 -->
				<view class="register-link">
					<text class="register-text">还没有账号？</text>
					<text class="register-link-text" @click="goToRegister">立即注册</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { postReq } from '@/common/request.js'
import { URL } from '@/common/url.js'

export default {
	data() {
		return {
			statusBarHeight: 0,
			isLogging: false,
			formData: {
				studentId: '',
				password: ''
			},
			errors: {
				studentId: '',
				password: ''
			}
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
		
		// 表单验证
		validateForm() {
			let isValid = true
			this.errors = {
				studentId: '',
				password: ''
			}
			
			// 验证学籍号
			if (!this.formData.studentId.trim()) {
				this.errors.studentId = '请输入学籍号'
				isValid = false
			} else if (this.formData.studentId.trim().length < 6) {
				this.errors.studentId = '学籍号长度不能少于6位'
				isValid = false
			}
			
			// 验证密码
			if (!this.formData.password.trim()) {
				this.errors.password = '请输入密码'
				isValid = false
			} else if (this.formData.password.trim().length < 6) {
				this.errors.password = '密码长度不能少于6位'
				isValid = false
			}
			
			return isValid
		},
		
		// 处理登录
		async handleLogin() {
			if (this.isLogging) return
			
			// 表单验证
			if (!this.validateForm()) {
				return
			}
			
			this.isLogging = true
			
			try {
				// 准备登录参数
				const params = {
					studentId: this.formData.studentId.trim(),
					password: this.formData.password.trim()
				}
				
				console.log('登录参数:', params)
				
				// 调用登录API
				const response = await postReq(URL.apiPostStudentPasswordLogin, params)
				console.log('登录响应:', response)
				
				// 保存用户信息到本地存储
				if (response && response.data) {
					uni.setStorageSync('xiaotiyunUser', response.data)
					
					// 显示登录成功提示
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					
					// 跳转到学生首页
					setTimeout(() => {
						uni.reLaunch({
							url: '/pagesStudent/home/index'
						})
					}, 1500)
				} else {
					throw new Error('登录失败，请检查账号密码')
				}
				
			} catch (error) {
				console.error('登录失败:', error)
				
				// 显示错误提示
				uni.showToast({
					title: error.message || '登录失败，请检查网络连接',
					icon: 'none'
				})
			} finally {
				this.isLogging = false
			}
		},
		
		// 跳转到忘记密码页面
		goToForgotPassword() {
			uni.navigateTo({
				url: '/pagesStudent/forgotPassword/index'
			})
		},
		
		// 跳转到注册页面
		goToRegister() {
			uni.navigateTo({
				url: '/pagesStudent/register/index'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.login-container {
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

.login-form-container {
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
	margin-bottom: 80rpx;
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

.login-form {
	width: 100%;
}

.form-title {
	font-size: 40rpx;
	font-weight: 600;
	color: #333333;
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

.error-message {
	font-size: 24rpx;
	color: #FF4757;
	margin-top: 8rpx;
}

.forgot-password {
	text-align: right;
	margin-bottom: 60rpx;
}

.forgot-text {
	font-size: 28rpx;
	color: #2C84FF;
}

.login-button {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #2C84FF 0%, #4A9EFF 100%);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
	transition: opacity 0.3s ease;
}

.login-button.disabled {
	opacity: 0.6;
}

.login-button-text {
	font-size: 32rpx;
	font-weight: 600;
	color: #FFFFFF;
}

.register-link {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8rpx;
}

.register-text {
	font-size: 28rpx;
	color: #999999;
}

.register-link-text {
	font-size: 28rpx;
	color: #2C84FF;
	font-weight: 500;
}
</style>
