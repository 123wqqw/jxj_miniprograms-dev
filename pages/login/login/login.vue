<template>
	<view class="login-container">
		<!-- 顶部背景图片 -->
		<view class="top-background">
			<image src="/static/login.png" mode="widthFix" class="background-image"></image>
			<view class="icon-logo">
				<image src="/static/ic_logo.png" class="logo-image" />
			</view>
		</view>

		<!-- 白色背景区域 -->
		<view class="white-background">
			<!-- 登录卡片 -->
			<view class="login-card">
				<!-- 角色选择标签 -->
				<view class="role-tabs">
					<view class="tab-item" :class="{ active: currentRole === 'student' }"
						@click="switchRole('student')">
						学生登录
					</view>
					<view class="tab-item" :class="{ active: currentRole === 'teacher' }"
						@click="switchRole('teacher')">
						教师登录
					</view>
					<view class="tab-bar" :class="{ student: currentRole === 'student', teacher: currentRole === 'teacher' }"></view>
				</view>

				<!-- 表单区域 -->
				<view class="form-container">
					<!-- 学生登录表单 -->
					<view v-if="currentRole === 'student'" class="form-section">
						<view class="input-group">
							<text class="input-label">学籍号：</text>
							<input class="input-field" type="text" v-model="studentForm.studentId" @input="watchForm"
								placeholder="请输入" placeholder-class="input-placeholder" />
						</view>
						<view class="input-group">
							<text class="input-label">密码：</text>
							<input class="input-field" type="password" password="true" v-model="studentForm.password"
								@input="watchForm" placeholder="请输入" placeholder-class="input-placeholder" />
						</view>
					</view>

					<!-- 教师登录表单 -->
					<view v-if="currentRole === 'teacher'" class="form-section">
						<view class="input-group">
							<text class="input-label">手机号：</text>
							<input class="input-field" type="number" v-model="teacherForm.phone" @input="watchForm"
								placeholder="请输入" placeholder-class="input-placeholder" />
						</view>
						<view class="input-group">
							<text class="input-label">密码：</text>
							<input class="input-field" type="password" password="true" v-model="teacherForm.password"
								@input="watchForm" placeholder="请输入" placeholder-class="input-placeholder" />
						</view>
					</view>

					<!-- 登录按钮 -->
					<button class="login-btn" @click="handleLogin">登录</button>

					<!-- 底部链接 -->
					  <!-- v-if="currentRole === 'student'" -->
					<view class="bottom-links" :style="{ 'opacity': currentRole === 'student' ? '1' : '0' }">
						<view class="link-group">
							<text class="link-text register-link" @click="goToRegister">账号注册</text>
							<text class="link-text forgot-link" @click="goToForgotPassword">忘记账号或密码</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex'
import {
	getReq,
	postReq
} from "../../../common/request.js";
import {
	URL
} from "../../../common/url.js";
import {
	showToast,
	dateFormat
} from '@/common/util.js'
export default {
	data() {
		return {
			currentRole: 'student', // 当前角色：student 或 teacher
			loginDisabled: true,
			studentForm: {
				studentId: '',
				password: ''
			},
			teacherForm: {
				phone: '',
				password: ''
			},
			parentId: '',
			items: [{}],
			titList: [],

			// 国际化
			pleaseCheckLocation: this.$t('main.login.login.pleaseCheckLocation'),
			popupTitle: this.$t('main.login.login.popupTitle'),
		}
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: this.$t('main.login.login.title')
		})
		//获取区域信息
		this.getUserCenterGetAreaList()
	},
	computed: {
		...mapState(['openid', 'userid', 'xiaotiyunUser']),
	},
	methods: {
		...mapMutations(['setXiaotiyunUser', 'setTeacherTabBar']),

		// 切换角色
		switchRole(role) {
			this.currentRole = role;
			this.loginDisabled = true;
			// 清空表单
			this.studentForm = { studentId: '', password: '' };
			this.teacherForm = { phone: '', password: '' };
		},

		// 监听表单变化
		watchForm() {
			let form = this.currentRole === 'student' ? this.studentForm : this.teacherForm;
			let isEmpty = false;

			Object.keys(form).forEach(key => {
				if (!form[key] || form[key].trim() === '') {
					isEmpty = true;
				}
			});

			this.loginDisabled = isEmpty;
		},

		// 处理登录
		handleLogin() {
			if (this.loginDisabled) return;

			if (this.currentRole === 'student') {
				this.studentLogin();
			} else {
				this.teacherLogin();
			}
		},

		// 学生登录
		studentLogin() {
			// 学生账号密码登录
			const account = this.studentForm.studentId.trim();
			const password = this.studentForm.password.trim();
			postReq(URL.apiPostStudentPasswordLogin, {
				account,
				password
			}).then(res => {
				if (res.error == 10000) {
					// 登录成功，保存关键信息并跳转首页
					let info = res.data || {};
					let xiaotiyunUser = {
						student: {
							...this.xiaotiyunUser.student,
							...info,
							account,
							isOnePass: true
						}
					};
					this.setXiaotiyunUser(xiaotiyunUser);
					uni.reLaunch({
						url: "/pagesStudent/home/index"
					})
				} else {
					showToast(res.message || '登录失败');
				}
			}).catch(err => {
				showToast(err.message || '网络错误，请重试');
			});
		},

		// 教师登录
		teacherLogin() {
			// 使用原有的教师登录逻辑
			postReq(URL.apiPostTeachersCheckAccount, {
				account: this.teacherForm.phone,
				password: this.teacherForm.password,
				wechatOpenid: this.openid,
			}).then(res => {
				if (res.error == 10000) {
					let info = res.data;
					info.teacherAccount = this.teacherForm.phone;
					info.password = this.teacherForm.password
					let xiaotiyunUser = {
						teacher: {
							...info,
							...this.xiaotiyunUser.teacher,
							isOnePass: true
						}
					};
					this.setXiaotiyunUser(xiaotiyunUser);
					if (info.phone) {
						uni.switchTab({
							url: "/pages/home/index/index"
						})
					} else {
						uni.reLaunch({
							url: '/pages/login/bindPhone/bindPhone'
						})
					}
				} else if (res.error == 10317) {
					const date = dateFormat(new Date(res.data), 'yyyy年MM月dd日');
					const message = `您的账号已于 ${date} 到期如需继续使用，请联系平台商务`;
					uni.showModal({
						title: '',
						content: message,
						showCancel: false,
						confirmText: '知道了',
						success: (action) => { }
					});
				} else {
					showToast(res.message)
				}
			}).catch(err => {
				showToast(err.message)
			})
		},

		// 跳转到注册页面
		goToRegister() {
			if (this.currentRole === 'student') {
				uni.navigateTo({
					url: '/pages/login/auth/step1?type=register'
				});
			}
		},

		// 跳转到忘记密码页面
		goToForgotPassword() {
			if (this.currentRole === 'student') {
				uni.navigateTo({
					url: `/pages/login/auth/step1`
				})
			}
		},
		// 区域信息
		getUserCenterGetAreaList() {
			getReq(URL.userCenterGetAreaList).then(res => {
				if (res.error == 10000) {
					if (res.data) {
						this.items = res.data.map(function (item) {
							return {
								...item,
								// gradeNameA: this.getGradeContent(item.grade)
								text: item.areaName,
								value: item.areaId,
								children: (item.children || []).map(function (itemer) {
									return {
										...itemer,
										text: itemer.areaName,
										value: itemer.areaId,
										children: (itemer.children || []).map(function (
											itemers) {
											return {
												...itemers,
												text: itemers.areaName,
												value: itemers.areaId
											}
										})
									}
								})
							}
						})
					}
				} else {
					showToast(res.message)
				}
			})
		},
		// titChange(e) {
		// 	console.log(e, 333)
		// 	this.form.school = this.titList[e].name
		// 	// this.physicalId = this.titList[e].physicalId
		// 	// this.getList()
		// 	this.watchForm()
		// },
		// 根据区域id 获取学校
		// getSchoolList(areaId) {
		// 	let params = {
		// 		areaId: areaId
		// 	}
		// 	getReq(URL.userCenterGetAllSchool, params).then(res => {
		// 		if (res.error == 10000) {
		// 			if (res.data) {
		// 				this.titList = res.data.map(function(item) {
		// 					return {
		// 						...item,
		// 						text: item.name,
		// 						value: item.schoolId
		// 					}
		// 				})
		// 			}
		// 		} else {
		// 			showToast(res.message)
		// 		}
		// 	})
		// },
		// onchange(e) {
		// 	const value = e.detail.value
		// },
		onnodeclick(node) {
			getReq(URL.userCenterGetDomain, {
				areaId: node.areaId
			}).then(res => {
				if (res.error == 10000) {
					let xiaotiyunUser = {
						teacher: {
							...this.xiaotiyunUser.teacher,
							domain: res.data
						}
					};
					this.setXiaotiyunUser(xiaotiyunUser);
					this.setTeacherTabBar();
				} else {
					showToast(res.message)
				}
			})
			// this.getSchoolList(node.value)
		},
		// chooseSchool() {
		// 	this.schoolShow = true
		// },
		login() {
			postReq(URL.apiPostTeachersCheckAccount, {
				account: this.form.account,
				password: this.form.password,
				wechatOpenid: this.openid,
			}).then(res => {
				if (res.error == 10000) {
					// uni.setStorageSync('account', this.form.account);
					let info = res.data;
					info.teacherAccount = this.form.account;
					info.password = this.form.password
					let xiaotiyunUser = {
						teacher: {
							...info,
							...this.xiaotiyunUser.teacher,
							isOnePass: true
						}
					};
					this.setXiaotiyunUser(xiaotiyunUser);
					if (info.phone) {
						uni.switchTab({
							url: "/pages/home/index/index"
						})
					} else {
						uni.reLaunch({
							url: '/pages/login/bindPhone/bindPhone'
						})
					}
				} else if (res.error == 10317) {
					const date = dateFormat(new Date(res.data), 'yyyy年MM月dd日');
					const message = `您的账号已于 ${date} 到期如需继续使用，请联系平台商务`;
					uni.showModal({
						title: '',
						content: message,
						showCancel: false,
						confirmText: '知道了',
						success: (action) => { }
					});
				} else {
					showToast(res.message)
				}
			}).catch(err => {
				showToast(err.message)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.login-container {
	width: 100%;
	min-height: 100vh;
	background: #F8F8FB;
}

.top-background {
	position: relative;
	width: 100%;
	// height: 500rpx;
	overflow: hidden;
}

.background-image {
	width: 100%;
}

.icon-logo {
	position: absolute;
	top: 55%;
	left: 50%;
	transform: translate(-50%, -80%);
	z-index: 10;
	
	.logo-image {
		width: 448rpx;
		height: 160rpx;
	}
}

.white-background {
	position: relative;
	width: 100%;
	// min-height: calc(100vh - 500rpx);
	// background: #FFFFFF;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 40rpx;
	box-sizing: border-box;
}

.login-card {
	position: relative;
	width: 100%;
	max-width: 600rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
	padding: 40rpx;
	margin-top: -216rpx;
}

.role-tabs {
	// display: flex;
	// border-bottom: 1rpx solid #F0F0F0;
	// justify-content: center;
	// align-items: flex-start;
	// gap: 20rpx;
	// align-self: stretch;
	// position: relative;
	display: flex;
	align-items: center;
	position: relative;
	justify-content: center;
}

.tab-item {
	height: 100rpx;
	width: 220rpx;
	text-align: center;
	line-height: 100rpx;
	text-align: center;
	font-size: 36rpx;
	color: #999999;
	position: relative;
	transition: all 0.3s ease;
	text-align: center;
	font-feature-settings: 'liga' off, 'clig' off;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	z-index: 1;
	padding: 0 20rpx;

	&.active {
		color: #333333;
		font-weight: 600;
	}
}

.tab-bar {
	width: 144rpx;
	position: absolute;
	bottom: 32rpx;
	height: 8rpx;
	background: #2C84FF;
	border-radius: 10rpx;
	transition: left 0.3s ease, width 0.3s ease;
	z-index: 2;
}

.tab-bar.student {
	left: 78rpx;
}

.tab-bar.teacher {
	left: calc(50% + 38rpx);
}

.form-container {
	padding: 0rpx 40rpx 0rpx;
}

.form-section {
	margin-bottom: 40rpx;
}

.input-group {
	margin-bottom: 40rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.input-label {
	display: block;
	font-size: 28rpx;
	color: #333333;
	margin-bottom: 16rpx;
	font-weight: 500;
}

.input-field {
	width: 100%;
	height: 88rpx;
	background: #FFFFFF;
	border: 2rpx solid #E0E0E0;
	border-radius: 16rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333333;
	box-sizing: border-box;
	transition: border-color 0.3s ease;

	&:focus {
		border-color: #5C8FF7;
	}
}

.input-placeholder {
	color: #999999;
}

.login-btn {
	width: 100%;
	height: 88rpx;
	background: #2c84ff;
	border: none;
	border-radius: 16rpx;
	font-size: 28rpx;
	color: #FFFFFF;
	transition: all 0.3s ease;
	line-height: 88rpx;
}

.bottom-links {
	margin-top: 40rpx;
}

.link-group {
	display: flex;
	justify-content: space-between;
	align-items: center;


}

.link-text {
	font-size: 28rpx;
	text-decoration: none;
	transition: color 0.3s ease;

	&.register-link {
		color: #2C84FF;
	}

	&.forgot-link {
		color: #999999;
	}

	&:active {
		opacity: 0.7;
	}
}

// 隐藏原有的样式
::v-deep .input-value {
	border: 0;
}

::v-deep .uni-data-tree {
	position: relative;
	bottom: -6rpx;
	left: -10rpx;
}

::v-deep .arrow-area {
	display: none;
}
</style>