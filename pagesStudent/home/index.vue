<template>
	<view class="student-home">
		<!-- 顶部背景图片 -->
		<view class="top-background">
			<image src="/static/login.png" mode="aspectFill" class="background-image"></image>
		</view>

		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px', top: statusBarHeight + 'px' }"></view>

		<!-- 顶部用户信息区域 -->
		<view class="user-header">
			<view class="user-info">
				<view class="avatar">
					<image :src="studentInfo.avatar || '/static/images/students/boy.png'" mode="aspectFill" class="avatar-img"></image>
				</view>
				<view class="user-details">
					<view class="user-name">{{ studentInfo.name || '李思思' }}</view>
					<view class="user-school">{{ studentInfo.school || '北京市朝阳第一小学 四年级3班' }}</view>
				</view>
			</view>
			<view class="header-actions">
				<view class="action-btn" @click="switchUser">
					<image src="/static/images/students/jt.svg" class="action-icon"></image>
					<text class="action-text">切换用户</text>
				</view>
				<view class="action-btn" @click="goToProfile">
					<image src="/static/images/students/tx.svg" class="action-icon"></image>
					<text class="action-text">个人中心</text>
				</view>
			</view>
		</view>

		<!-- 欢迎卡片 -->
		<view class="welcome-card">
			<view class="welcome-content">
				<view class="welcome-text">
					<view class="greeting">
						嗨~
						<br />
						欢迎来到家庭健身房
					</view>
				</view>
				<view class="mascot">
					<image src="/static/images/students/jxj.png" mode="aspectFit" class="mascot-img"></image>
				</view>
			</view>
		</view>
		<!-- 文字提示 -->
		<view class="text-tip">
			<view class="text-tip-text">呼叫[学生姓名]！无论什么原因暂停，这里永远是你的加油站。今天先来活动10分钟，找回感觉就好！</view>
		</view>

		<!-- 功能模块网格 -->
		<view class="function-grid">
			<view class="grid-item-group">
				<view class="grid-item" @click="goToGym" style="border-radius: 40rpx; background: linear-gradient(180deg, #997dd6 0%, #bda3f4 100%); margin-right: 40rpx">
					<image src="/static/images/students/jtjsf.png" class="item-icon"></image>
					<view class="item-title">家庭健身房</view>
					<view class="item-subtitle">去锻炼></view>
				</view>

				<view class="grid-item" @click="goToHomework" style="border-radius: 40rpx; background: linear-gradient(180deg, #edb341 0%, #ffc87b 100%)">
					<image src="/static/images/students/xwtyzy.png" class="item-icon"></image>
					<view class="item-title">校外体育作业</view>
					<view class="item-subtitle">去完成></view>
				</view>
			</view>

			<view class="grid-item-group" style="margin-top: 40rpx">
				<view class="card-item leaderboard-card" @click="goToLeaderboard">
					<image src="/static/images/students/bj.svg" class="card-bg-image"></image>
					<view class="card-title">锻炼风云榜</view>
					<view class="card-icon">
						<image src="/static/images/students/dlfyb.png" class="icon-img"></image>
					</view>
					<view class="card-footer">
						当前排名
						<text class="rank-text">{{ currentRank }}</text>
					</view>
				</view>

				<view class="card-item records-card" @click="goToRecords">
					<image src="/static/images/students/bj2.svg" class="card-bg-image"></image>
					<view class="card-title">健身运动记录</view>
					<view class="card-icon">
						<image src="/static/images/students/jsydjl.png" class="icon-img"></image>
					</view>
					<view class="card-footer">
						<text class="desc-text">健身房、体育作业记录</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 个人中心弹框 -->
		<ProfileModal
			:visible="showProfileModal"
			:userInfo="studentInfo"
			@close="closeProfileModal"
			@switchUser="switchUser"
			@goToContact="goToContact"
			@goToChangePassword="goToChangePassword"
			@goToUnbindAccount="goToUnbindAccount"
			@clearCache="clearCache"
			@updateUserInfo="updateUserInfo"
		/>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import ProfileModal from './components/ProfileModal.vue';
import { getReq } from '@/common/request.js';
import { URL } from '@/common/url.js';

export default {
	components: {
		ProfileModal
	},
	data() {
		return {
			statusBarHeight: 0,
			currentRank: 20,
			showProfileModal: false,
			studentInfo: {
				name: '李思思',
				school: '北京市朝阳第一小学 四年级3班'
			}
		};
	},
	computed: {
		...mapState(['xiaotiyunUser'])
	},
	onLoad() {
		this.getSystemInfo();
		this.getStudentInfo();
	},
	methods: {
		// 获取系统信息
		getSystemInfo() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight || 20;
		},

		// 获取学生信息
		async getStudentInfo() {
			try {
				// 先从本地存储获取基本信息
				if (this.xiaotiyunUser && this.xiaotiyunUser.student) {
					this.studentInfo = {
						name: this.xiaotiyunUser.student.name || '',
						school: this.xiaotiyunUser.student.schoolName || '',
						studentId: this.xiaotiyunUser.student.studentId || this.xiaotiyunUser.student.uid,
						avatar: this.xiaotiyunUser.student.avatar || ''
					};
				}

				// 调用API获取最新学生信息
				const params = {
					studentId: this.studentInfo.studentId || '', // 学生ID
					tag: 'student_info' // 随便传一个字符串
				};

				const response = await getReq(URL.apiGetStudentInfo, params);
				console.log('获取到的学生信息:', response);

				// 更新学生信息
				if (response && response.data) {
					this.studentInfo = {
						...this.studentInfo,
						...response.data
					};
					this.studentInfo.school = this.studentInfo.schoolName + ' ' + this.studentInfo.grade + '年级' + this.studentInfo.claNumber + '班';
					console.log('更新后的学生信息:', this.studentInfo);
				}
			} catch (error) {
				console.error('获取学生信息失败:', error);
				// 如果API调用失败，至少显示本地存储的信息
				if (this.xiaotiyunUser && this.xiaotiyunUser.student) {
					this.studentInfo = {
						name: this.xiaotiyunUser.student.name || '李思思',
						school: this.xiaotiyunUser.student.schoolName || '北京市朝阳第一小学 四年级3班'
					};
				}
			}
		},

		// 切换用户
		switchUser() {
			uni.showModal({
				title: '切换用户',
				content: '确定要切换用户吗？',
				success: (res) => {
					if (res.confirm) {
						uni.clearStorage();
						uni.reLaunch({
							url: '/pages/login/index/index'
						});
					}
				}
			});
		},

		// 跳转到个人中心
		goToProfile() {
			this.showProfileModal = true;
		},

		// 关闭个人中心弹框
		closeProfileModal() {
			this.showProfileModal = false;
		},

		// 联系方式
		goToContact() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		},

		// 修改密码
		goToChangePassword() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		},

		// 解绑账号
		goToUnbindAccount() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		},

		// 清除缓存
		clearCache() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		},

		// 更新用户信息
		updateUserInfo(userInfo) {
			this.studentInfo = {
				...this.studentInfo,
				...userInfo
			};
			console.log('更新后的学生信息:', this.studentInfo);
		},

		// 跳转到家庭健身房
		goToGym() {
			uni.navigateTo({
				url: '/pagesStudent/gym/index'
			});
		},

		// 跳转到校外体育作业
		goToHomework() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		},

		// 跳转到锻炼风云榜
		goToLeaderboard() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		},

		// 跳转到健身运动记录
		goToRecords() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.student-home {
	min-height: 100vh;
	background: #ffffff;
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
	z-index: 7;
	width: 100%;
}

.user-header {
	position: absolute;
	top: 60rpx;
	left: 0;
	right: 0;
	z-index: 10;
	padding: 32rpx;
	display: flex;
	flex-direction: column;
}

.user-info {
	display: flex;
	align-items: center;
	margin-bottom: 36rpx;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 24rpx;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.user-details {
	color: #333333;
	font-size: 36rpx;
	flex: 1;
}

.user-name {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 8rpx;
}

.user-school {
	font-size: 28rpx;
}

.header-actions {
	display: flex;
	gap: 24rpx;
}

.action-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 2px;
	flex: 1 0 0;
	padding: 8rpx 20rpx;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 16rpx;
	max-width: 198rpx;
}

.action-icon {
	width: 32rpx;
	height: 32rpx;
}

.action-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #2c84ff;
}

.welcome-card {
	padding: 0 32rpx;
	position: relative;
	margin: -200rpx 32rpx 32rpx;
	border-radius: 24rpx;
	z-index: 7;
	// background-image: url('/static/images/students/bj.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-position: center;
}

.welcome-content {
	padding: 36rpx 0rpx 24rpx 0rpx;
	width: 100%;
}

.welcome-text {
	flex: 1;
	margin-right: 32rpx;
}

.text-tip {
	width: 100%;
	padding: 0 32rpx;
	position: relative;
	z-index: 7;
	margin-top: -50rpx;
	border-radius: 0 0 32rpx 32rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.text-tip-text {
	background: #ffffff;
	padding: 16rpx 36rpx 32rpx 36rpx;
	font-size: 26rpx;
	color: #999;
}

.greeting {
	font-size: 36rpx;
	font-weight: 600;
	color: #2c84ff;
	margin-bottom: 16rpx;
}

.motivation {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.5;
}

.mascot {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 184rpx;
	height: 290rpx;
}

.mascot-img {
	width: 100%;
	height: 100%;
}

.function-grid {
	width: 100%;
	padding: 32rpx;
}

.grid-item-group {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.grid-item {
	position: relative;
	width: 100%;
	padding: 16rpx 0;
	z-index: 7;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
}
.grid-item2 {
	width: 100%;
	z-index: 7;
}

.item-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0.3;
}

.gym-bg {
	background: #e8e4ff;
}

.homework-bg {
	background: #ffe4e1;
}

.leaderboard-bg {
	background: #f5f5f5;
}

.records-bg {
	background: #fff8dc;
}

.item-content {
	width: 100%;
	height: 100%;
}

.item-icon {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 16rpx;
}
.item-icon2 {
	width: 148rpx;
	height: 148rpx;
}

.item-text {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	width: 100%;
}

.item-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #fff;
	margin-bottom: 8rpx;
}

.item-subtitle {
	font-size: 24rpx;
	color: #fff;
}

/* 新的卡片样式 */
.card-item {
	width: 100%;
	height: 230rpx;
	border-radius: 24rpx;
	position: relative;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.leaderboard-card {
	margin-right: 20rpx;
}

.card-bg-image {
	width: 100%;
	height: 100%;
	display: block;
}

.card-title {
	position: absolute;
	top: 24rpx;
	left: 24rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	z-index: 2;
}

.card-icon {
	position: absolute;
	top: -10rpx;
	right: -10rpx;
	width: 148rpx;
	height: 148rpx;
	z-index: 2;
}

.icon-img {
	width: 100%;
	height: 100%;
}

.card-footer {
	color: #997dd6;
	display: flex;
	align-items: center;
	position: absolute;
	bottom: 24rpx;
	left: 24rpx;
	font-size: 24rpx;
	z-index: 2;
}

.rank-text {
	font-size: 36rpx;
	color: #997dd6;
	margin-left: 5rpx;
	font-weight: 500;
}

.desc-text {
	font-size: 24rpx;
	color: #c58e31;
}
</style>
