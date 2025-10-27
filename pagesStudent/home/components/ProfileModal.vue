<template>
	<view class="profile-modal" v-if="visible" @click="closeModal">
		<view class="modal-overlay"></view>
		<view class="modal-content" @click.stop>
			<!-- 关闭按钮 -->
			<view class="close-btn" @click="closeModal">
				<image src="/static/images/students/cc.png" class="close-icon"></image>
			</view>
			
			<!-- 用户信息区域 -->
			<view class="user-info-section">
				<view class="user-info">
					<view class="avatar">
						<image :src="userInfo.avatar || '/static/images/students/boy.png'" mode="aspectFill" class="avatar-img"></image>
					</view>
					<view class="user-details">
						<view class="user-name-row">
							<view class="user-name">{{ userInfo.name || '李思思' }}</view>
							<view class="switch-user-btn" @click="switchUser">
								<image src="/static/images/students/jt.svg" class="switch-icon"></image>
								<text class="switch-text">切换用户</text>
							</view>
						</view>
						<view class="user-school">{{ userInfo.school || '北京市朝阳第一小学 四年级3班' }}</view>
					</view>
				</view>
			</view>
			
			<!-- 菜单列表 -->
			<view class="menu-list">
				<view class="menu-item" @click="toggleAccountSecurity">
					<view class="menu-item-content">
						<text class="menu-text">账号与安全</text>
						<view class="arrow-icon" :class="{ 'expanded': accountSecurityExpanded }">
							<image src="/static/images/students/yjt.png" class="arrow-img"></image>
						</view>
					</view>
					
					<!-- 账号与安全子菜单 -->
					<view class="sub-menu" v-if="accountSecurityExpanded">
						<view class="sub-menu-item" @click.stop="goToContact">
							<view class="sub-menu-content">
								<text class="sub-menu-text">联系方式</text>
							</view>
							<view class="sub-menu-right">
								<text class="phone-number">{{ formatPhoneNumber(userInfo.phone || userInfo.contactInformation) || '183******70' }}</text>
								<view class="arrow-icon">
									<image src="/static/images/students/yjt.png" class="arrow-img"></image>
								</view>
							</view>
						</view>
						<view class="sub-menu-item" @click.stop="goToChangePassword">
							<view class="sub-menu-content">
								<text class="sub-menu-text">修改密码</text>
							</view>
							<view class="arrow-icon">
								<image src="/static/images/students/yjt.png" class="arrow-img"></image>
							</view>
						</view>
						<view class="sub-menu-item" @click.stop="goToUnbindAccount">
							<view class="sub-menu-content">
								<text class="sub-menu-text">解绑账号</text>
							</view>
							<view class="arrow-icon">
								<image src="/static/images/students/yjt.png" class="arrow-img"></image>
							</view>
						</view>
					</view>
				</view>
				
				<view class="menu-item" @click="clearCache">
					<view class="menu-item-content">
						<text class="menu-text">清除缓存</text>
						<view class="arrow-icon">
							<image src="/static/images/students/yjt.png" class="arrow-img"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 修改密码弹框 -->
		<u-modal v-model="passwordVisible" title="修改密码" :show-cancel-button="false" :show-confirm-button="false">
			<view class="password-form">
				<view class="password-field">
					<input v-model="oldPassword" placeholder="请输入旧密码" password class="password-input" />
				</view>
				<view class="password-field">
					<input v-model="newPassword" placeholder="请输入8-18位新密码" maxlength="18" password class="password-input" />
				</view>
				<view class="password-field">
					<input v-model="confirmPasswordInput" placeholder="请再次输入新密码" maxlength="18" password class="password-input" />
				</view>
			</view>
			
			<!-- 自定义按钮 -->
			<view class="password-buttons">
				<view class="password-btn cancel-btn" @click="cancelPassword">取消</view>
				<view class="password-btn confirm-btn" @click="confirmPassword">确认</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
import { getReq, postReq } from '@/common/request.js'
import { URL } from '@/common/url.js'
import { MD5_ENCRYPT } from '@/common/secret.js'

export default {
	name: 'ProfileModal',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		userInfo: {
			type: Object,
			default: () => ({
				name: '李思思',
				school: '北京市朝阳第一小学 四年级3班'
			})
		}
	},
		data() {
			return {
				accountSecurityExpanded: false,
				passwordVisible: false,
				oldPassword: '',
				newPassword: '',
				confirmPasswordInput: ''
			}
		},
	watch: {
		visible(newVal) {
			if (newVal) {
				// 弹框显示时获取学生信息
				this.getStudentInfo()
			}
		},
	},
	methods: {
		closeModal() {
			this.$emit('close')
		},
		
		toggleAccountSecurity() {
			this.accountSecurityExpanded = !this.accountSecurityExpanded
		},
		
		switchUser() {
			this.$emit('switchUser')
		},
		
		goToContact() {
			this.$emit('goToContact')
		},
		
		goToChangePassword() {
			this.passwordVisible = true
		},
		
		// 取消修改密码
		cancelPassword() {
			// 清空输入框
			this.oldPassword = ''
			this.newPassword = ''
			this.confirmPasswordInput = ''
			// 关闭弹框
			this.passwordVisible = false
		},
		
		async confirmPassword() {
			// 验证输入
			if (!this.newPassword || !this.confirmPasswordInput || !this.oldPassword) {
				uni.showToast({
					title: '密码不能为空',
					icon: 'none'
				})
				return
			}
			if (this.newPassword.length < 8 || this.newPassword.length > 18 || this.confirmPasswordInput.length < 8 || this.confirmPasswordInput.length > 18) {
				uni.showToast({
					title: '密码长度请设置在8~18位之间',
					icon: 'none'
				})
				return
			}
			let reRgbPass = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])')
			if (!reRgbPass.test(this.newPassword) || !reRgbPass.test(this.confirmPasswordInput)) {
				uni.showToast({
					title: '密码请包含英文大小写和数字',
					icon: 'none'
				})
				return
			}
			if (this.newPassword !== this.confirmPasswordInput) {
				uni.showToast({
					title: '两次输入的密码不一致',
					icon: 'none'
				})
				return
			}
			
			try {
				// 显示加载提示
				uni.showLoading({
					title: '修改中...'
				})
				
				// 准备请求参数
				const params = {
					oldPassword: MD5_ENCRYPT(this.oldPassword), // MD5加密旧密码
					newPassword: MD5_ENCRYPT(this.newPassword), // MD5加密新密码
					newPasswordPlaintext: this.newPassword // 新密码明文
				}
				
				console.log('修改密码参数:', params)
				
				// 调用修改密码API
				const response = await postReq(URL.apiPostChangePasswordV2, params)
				console.log('修改密码响应:', response)
				
				// 隐藏加载提示
				uni.hideLoading()
				
				// 显示成功提示
				uni.showToast({
					title: '密码修改成功',
					icon: 'success'
				})
				
				// 清空输入框并关闭弹框
				this.oldPassword = ''
				this.newPassword = ''
				this.confirmPasswordInput = ''
				this.passwordVisible = false
				
			} catch (error) {
				// 隐藏加载提示
				uni.hideLoading()
				
				console.error('修改密码失败:', error)
				
				// 显示错误提示
				uni.showToast({
					title: error.message || '修改密码失败',
					icon: 'none'
				})
			}
		},
		
		goToUnbindAccount() {
			this.$emit('goToUnbindAccount')
		},
		
		clearCache() {
			this.$emit('clearCache')
		},
		
		// 格式化手机号显示（加密中间部分）
		formatPhoneNumber(phone) {
			if (!phone) return ''
			// 如果是11位手机号，显示前3位和后2位，中间用*代替
			if (phone.length === 11) {
				return phone.substring(0, 3) + '******' + phone.substring(9)
			}
			// 其他情况直接返回
			return phone
		},
		
		// 获取学生信息
		async getStudentInfo() {
			try {
				const params = {
					studentid: this.userInfo.studentId || this.userInfo.studentid || 123456, // 学生ID
					tag: 'student_info' // 随便传一个字符串
				}
				
				const response = await getReq(URL.apiGetStudentInfo, params)
				console.log('学生信息:', response)
				
				// 处理返回的学生信息
				if (response && response.data) {
					// 可以在这里更新用户信息
					this.$emit('updateUserInfo', response.data)
				}
				
				return response
			} catch (error) {
				console.error('获取学生信息失败:', error)
				uni.showToast({
					title: '获取学生信息失败',
					icon: 'none'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.profile-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: flex-end;
}

.modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4rpx);
}

.modal-content {
	position: relative;
	width: 100%;
	height: 85%;
	background: #FFFFFF;
	border-radius: 24rpx 24rpx 0 0;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.close-btn {
	position: absolute;
	top: 32rpx;
	right: 32rpx;
	width: 60rpx;
	height: 60rpx;
	background: rgba(0, 0, 0, 0.1);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.close-icon {
	width: 58rpx;
	height: 58rpx;
}

.user-info-section {
	background-image: url('/static/images/students/top.png');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	position: relative;
}

.user-info-section::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(74, 144, 226, 0.6);
	border-radius: 24rpx 24rpx 0 0;
}

.user-info {
	position: relative;
	z-index: 2;
	display: flex;
	padding: 38rpx;
	align-items: center;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 24rpx;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.user-details {
	color: #FFFFFF;
	font-size: 36rpx;
	flex: 1;
}

.user-name-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.user-name {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
	margin-right: 16rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.switch-user-btn {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 6rpx 12rpx;
}

.switch-icon {
	width: 32rpx;
	height: 32rpx;
}

.switch-text {
	font-size: 24rpx;
	color: #2C84FF;
}

.user-school {
	font-size: 28rpx;
	color: #333;
}
.password-input {
	width: 100%;
	height: 80rpx;
	padding: 0 24rpx;
	border: 2rpx solid #CCC;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #333333;
	background: #FFFFFF;
	box-sizing: border-box;
}


.password-input::placeholder {
	color: #B2B2B2;
	text-align: left;
}
.menu-list {
	flex: 1;
	padding: 32rpx 0 200rpx 20rpx;
	background: #FFFFFF;
}

.menu-item {
	border-bottom: 1rpx solid #F5F5F5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
}

.menu-text {
	font-size: 32rpx;
	color: #333333;
	font-weight: 600;
}

.arrow-icon {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.3s ease;
}

.arrow-icon.expanded {
	transform: rotate(90deg);
}

.arrow-img {
	width: 16rpx;
	height: 16rpx;
}

.sub-menu {
	background: #FFFFFF;
	margin: 0 32rpx 24rpx 32rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.sub-menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.sub-menu-item:last-child {
	border-bottom: none;
}

.sub-menu-content {
	display: flex;
	align-items: center;
	flex: 1;
}

.sub-menu-text {
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
}

.sub-menu-right {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.phone-number {
	font-size: 28rpx;
	color: #999999;
}

/* 修改密码弹框样式 */
.password-form {
	padding: 20rpx 80rpx;
}

.password-field {
	margin-bottom: 24rpx;
}

.password-field:last-child {
	margin-bottom: 0;
}

/* 自定义按钮样式 - 按照图片样式 */
.password-buttons {
	display: flex;
	justify-content: space-around;
	padding: 20rpx 80rpx 40rpx 80rpx;
	gap: 60rpx;
}

.password-btn {
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	cursor: pointer;
	background: transparent;
	border: none;
	padding: 0;
}

.cancel-btn {
	color: #666666;
}

.confirm-btn {
	color: #2C84FF;
}
</style>
