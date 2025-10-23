<template>
	<view class="gym-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<image src="/static/images/students/arrow-left.png" class="back-icon"></image>
			</view>
			<view class="nav-title">家庭健身房</view>
			<view class="nav-right"></view>
		</view>
		
		<!-- 顶部背景区域 -->
		<view class="top-section">
			<view class="background-image">
				<image src="/static/images/students/banner.png" mode="aspectFill" class="bg-img"></image>
			</view>
			<view class="content-overlay">
				<view class="welcome-text">
					<view class="title">欢迎来到家庭健身房</view>
					<view class="subtitle">选择您喜欢的运动项目开始锻炼吧！</view>
				</view>
			</view>
		</view>
		
		<!-- 运动项目列表 -->
		<view class="sport-list">
			<view class="section-title">运动项目</view>
			
			<view class="sport-grid">
				<view 
					class="sport-item" 
					v-for="(sport, index) in sportList" 
					:key="index"
					@click="selectSport(sport)"
				>
					<view class="sport-icon">
						<image :src="sport.icon" mode="aspectFit" class="icon-img"></image>
					</view>
					<view class="sport-info">
						<view class="sport-name">{{ sport.name }}</view>
						<view class="sport-desc">{{ sport.description }}</view>
						<view class="sport-duration">{{ sport.duration }}分钟</view>
					</view>
					<view class="sport-action">
						<image src="/static/images/students/play.png" class="play-icon"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- AI动作识别区域 -->
		<view class="ai-section">
			<view class="section-title">AI动作识别</view>
			<view class="ai-card" @click="startAITraining">
				<view class="ai-content">
					<view class="ai-icon">
						<image src="/static/images/students/logo.png" mode="aspectFit" class="ai-img"></image>
					</view>
					<view class="ai-info">
						<view class="ai-title">智能动作识别</view>
						<view class="ai-desc">通过AI技术实时识别您的运动动作，提供专业的运动指导</view>
					</view>
					<view class="ai-arrow">
						<image src="/static/images/students/arrow-right.png" class="arrow-icon"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 今日运动记录 -->
		<view class="record-section">
			<view class="section-title">今日运动记录</view>
			<view class="record-card">
				<view class="record-item">
					<view class="record-icon">
						<image src="/static/images/students/exercise.png" class="record-img"></image>
					</view>
					<view class="record-info">
						<view class="record-label">运动时长</view>
						<view class="record-value">{{ todayRecord.duration }}分钟</view>
					</view>
				</view>
				<view class="record-item">
					<view class="record-icon">
						<image src="/static/images/students/rank.png" class="record-img"></image>
					</view>
					<view class="record-info">
						<view class="record-label">消耗卡路里</view>
						<view class="record-value">{{ todayRecord.calories }}卡</view>
					</view>
				</view>
				<view class="record-item">
					<view class="record-icon">
						<image src="/static/images/students/read.png" class="record-img"></image>
					</view>
					<view class="record-info">
						<view class="record-label">完成项目</view>
						<view class="record-value">{{ todayRecord.completed }}个</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 运动历史 -->
		<view class="history-section">
			<view class="section-header">
				<view class="section-title">运动历史</view>
				<view class="view-all" @click="viewAllHistory">
					<text class="view-all-text">查看全部</text>
					<image src="/static/images/students/arrow-right.png" class="arrow-icon"></image>
				</view>
			</view>
			
			<view class="history-list">
				<view 
					class="history-item" 
					v-for="(record, index) in historyList" 
					:key="index"
					@click="viewHistoryDetail(record)"
				>
					<view class="history-date">
						<view class="date-text">{{ record.date }}</view>
						<view class="time-text">{{ record.time }}</view>
					</view>
					<view class="history-info">
						<view class="history-sport">{{ record.sportName }}</view>
						<view class="history-duration">{{ record.duration }}分钟</view>
					</view>
					<view class="history-status" :class="record.status">
						<text class="status-text">{{ record.statusText }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sportList: [
				{
					id: 1,
					name: '俯卧撑',
					description: '锻炼胸肌和手臂力量',
					duration: 10,
					icon: '/static/images/students/exercise.png',
					type: 'strength'
				},
				{
					id: 2,
					name: '深蹲',
					description: '锻炼腿部肌肉',
					duration: 15,
					icon: '/static/images/students/exercise.png',
					type: 'strength'
				},
				{
					id: 3,
					name: '跳绳',
					description: '有氧运动，提高心肺功能',
					duration: 20,
					icon: '/static/images/students/exercise.png',
					type: 'cardio'
				},
				{
					id: 4,
					name: '平板支撑',
					description: '核心力量训练',
					duration: 5,
					icon: '/static/images/students/exercise.png',
					type: 'core'
				},
				{
					id: 5,
					name: '仰卧起坐',
					description: '腹部肌肉训练',
					duration: 10,
					icon: '/static/images/students/exercise.png',
					type: 'core'
				},
				{
					id: 6,
					name: '开合跳',
					description: '全身有氧运动',
					duration: 15,
					icon: '/static/images/students/exercise.png',
					type: 'cardio'
				}
			],
			todayRecord: {
				duration: 45,
				calories: 320,
				completed: 3
			},
			historyList: [
				{
					id: 1,
					date: '2024-01-15',
					time: '18:30',
					sportName: '俯卧撑',
					duration: 10,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 2,
					date: '2024-01-15',
					time: '19:00',
					sportName: '深蹲',
					duration: 15,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 3,
					date: '2024-01-14',
					time: '17:45',
					sportName: '跳绳',
					duration: 20,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 4,
					date: '2024-01-14',
					time: '18:15',
					sportName: '平板支撑',
					duration: 5,
					status: 'incomplete',
					statusText: '未完成'
				}
			]
		}
	},
	onLoad() {
		this.loadTodayRecord()
		this.loadHistoryList()
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},
		
		// 选择运动项目
		selectSport(sport) {
			console.log('选择运动项目:', sport)
			// 跳转到运动详情页面
			uni.navigateTo({
				url: `/pages/students/sportDetail/index?id=${sport.id}&name=${sport.name}`
			})
		},
		
		// 开始AI训练
		startAITraining() {
			console.log('开始AI训练')
			uni.navigateTo({
				url: '/pages/students/aiTraining/index'
			})
		},
		
		// 查看全部历史
		viewAllHistory() {
			console.log('查看全部历史')
			uni.navigateTo({
				url: '/pages/students/history/index'
			})
		},
		
		// 查看历史详情
		viewHistoryDetail(record) {
			console.log('查看历史详情:', record)
			uni.navigateTo({
				url: `/pages/students/historyDetail/index?id=${record.id}`
			})
		},
		
		// 加载今日运动记录
		loadTodayRecord() {
			// 这里可以调用API获取今日运动记录
			console.log('加载今日运动记录')
		},
		
		// 加载运动历史
		loadHistoryList() {
			// 这里可以调用API获取运动历史
			console.log('加载运动历史')
		}
	}
}
</script>

<style lang="scss" scoped>
.gym-container {
	min-height: 100vh;
	background: #F5F5F5;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 32rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-left {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
}

.nav-right {
	width: 60rpx;
}

.top-section {
	position: relative;
	height: 300rpx;
	overflow: hidden;
}

.background-image {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.bg-img {
	width: 100%;
	height: 100%;
}

.content-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.welcome-text {
	text-align: center;
	color: #FFFFFF;
}

.title {
	font-size: 40rpx;
	font-weight: 600;
	margin-bottom: 16rpx;
}

.subtitle {
	font-size: 28rpx;
	opacity: 0.9;
}

.sport-list {
	padding: 32rpx;
	background: #FFFFFF;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 24rpx;
}

.sport-grid {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.sport-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background: #F8F9FA;
	border-radius: 16rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s ease;
}

.sport-item:active {
	border-color: #2C84FF;
	background: #F0F7FF;
}

.sport-icon {
	width: 80rpx;
	height: 80rpx;
	margin-right: 24rpx;
}

.icon-img {
	width: 100%;
	height: 100%;
}

.sport-info {
	flex: 1;
}

.sport-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 8rpx;
}

.sport-desc {
	font-size: 26rpx;
	color: #666666;
	margin-bottom: 8rpx;
}

.sport-duration {
	font-size: 24rpx;
	color: #2C84FF;
	font-weight: 500;
}

.sport-action {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.play-icon {
	width: 40rpx;
	height: 40rpx;
}

.ai-section {
	padding: 32rpx;
	background: #FFFFFF;
	margin-bottom: 20rpx;
}

.ai-card {
	background: linear-gradient(135deg, #2C84FF 0%, #4A9EFF 100%);
	border-radius: 20rpx;
	padding: 32rpx;
}

.ai-content {
	display: flex;
	align-items: center;
}

.ai-icon {
	width: 80rpx;
	height: 80rpx;
	margin-right: 24rpx;
}

.ai-img {
	width: 100%;
	height: 100%;
}

.ai-info {
	flex: 1;
}

.ai-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #FFFFFF;
	margin-bottom: 8rpx;
}

.ai-desc {
	font-size: 26rpx;
	color: #FFFFFF;
	opacity: 0.9;
}

.ai-arrow {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.arrow-icon {
	width: 24rpx;
	height: 24rpx;
}

.record-section {
	padding: 32rpx;
	background: #FFFFFF;
	margin-bottom: 20rpx;
}

.record-card {
	display: flex;
	justify-content: space-between;
}

.record-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
}

.record-icon {
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 16rpx;
}

.record-img {
	width: 100%;
	height: 100%;
}

.record-label {
	font-size: 24rpx;
	color: #666666;
	margin-bottom: 8rpx;
}

.record-value {
	font-size: 32rpx;
	font-weight: 600;
	color: #2C84FF;
}

.history-section {
	padding: 32rpx;
	background: #FFFFFF;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.view-all {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.view-all-text {
	font-size: 28rpx;
	color: #2C84FF;
}

.history-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.history-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background: #F8F9FA;
	border-radius: 12rpx;
}

.history-date {
	width: 120rpx;
	margin-right: 24rpx;
}

.date-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 4rpx;
}

.time-text {
	font-size: 24rpx;
	color: #666666;
}

.history-info {
	flex: 1;
}

.history-sport {
	font-size: 30rpx;
	font-weight: 500;
	color: #333333;
	margin-bottom: 4rpx;
}

.history-duration {
	font-size: 26rpx;
	color: #666666;
}

.history-status {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.history-status.completed {
	background: #E8F5E8;
}

.history-status.incomplete {
	background: #FFF3E0;
}

.status-text {
	font-size: 24rpx;
	font-weight: 500;
}

.history-status.completed .status-text {
	color: #4CAF50;
}

.history-status.incomplete .status-text {
	color: #FF9800;
}
</style>
