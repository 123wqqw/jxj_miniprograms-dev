<template>
	<view class="records-page">
		<!-- 顶部导航栏 -->
	<!-- 	<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<image src="/static/images/students/arrow-left.png" class="back-icon"></image>
			</view>
			<view class="nav-title">健身运动记录</view>
			<view class="nav-right"></view>
		</view> -->

		<!-- 分组列表（按天） -->
		<view class="sections">
			<view class="section" v-for="(group, gi) in groupedRecords" :key="gi">
				<view class="section-header">
					<view class="section-label">{{ group.label }}</view>
					<view class="section-count">锻炼 {{ group.items.length }} 次</view>
				</view>
				<view class="card">
					<view class="row" v-for="(item, i) in group.items" :key="i" @click="viewRecordDetail(item)">
						<view class="left">
							<view class="name">{{ item.title }}</view>
							<view class="time">{{ item.time }}</view>
						</view>
						<view class="right">
							<text class="duration">{{ item.duration }}</text>
							<image src="/static/images/students/arrow-right.png" class="chev" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getReq, postReq } from "@/common/request.js";
import { URL } from "@/common/url.js";
	// // 获取所有AI锻炼记录列表
	// jxjRecordInfos:"/xty-task/app-api/clock/v2/getRecordInfos",
	// // 获取AI锻炼记录列表
	// jxjGetRecordInfos:"/xty-task/app-api/clock/v1/getRecordInfos",
export default {
	data() {
		return {
			groupedRecords: [
				{
					label: '今天',
					items: [
						{ title: '单腿站立', time: '14:32', duration: '0:30' },
						{ title: '单腿站立', time: '14:32', duration: '0:30' },
						{ title: '单腿站立', time: '14:32', duration: '0:30' }
					]
				},
				{
					label: '2024-04-24',
					items: [
						{ title: '单腿站立', time: '14:32', duration: '0:30' },
						{ title: '单腿站立', time: '14:32', duration: '0:30' },
						{ title: '单腿站立', time: '14:32', duration: '0:30' }
					]
				}
			],
			activeFilter: 'all',
			totalStats: {
				totalTime: 1250,
				totalDays: 28,
				totalCalories: 3200
			},
			recordsList: [
				{
					id: 1,
					type: 'gym',
					typeText: '健身房',
					title: '俯卧撑训练',
					description: '完成3组俯卧撑，每组10个',
					date: '2024-01-15',
					time: '18:30',
					duration: 15,
					calories: 120,
					completion: 100,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 2,
					type: 'homework',
					typeText: '体育作业',
					title: '跳绳运动',
					description: '连续跳绳5分钟',
					date: '2024-01-15',
					time: '19:00',
					duration: 20,
					calories: 150,
					completion: 100,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 3,
					type: 'gym',
					typeText: '健身房',
					title: '深蹲练习',
					description: '完成2组深蹲，每组15个',
					date: '2024-01-14',
					time: '17:45',
					duration: 10,
					calories: 80,
					completion: 100,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 4,
					type: 'homework',
					typeText: '体育作业',
					title: '平板支撑',
					description: '保持平板支撑姿势1分钟',
					date: '2024-01-14',
					time: '18:15',
					duration: 5,
					calories: 40,
					completion: 60,
					status: 'incomplete',
					statusText: '未完成'
				},
				{
					id: 5,
					type: 'gym',
					typeText: '健身房',
					title: '仰卧起坐',
					description: '完成3组仰卧起坐，每组20个',
					date: '2024-01-13',
					time: '16:30',
					duration: 12,
					calories: 90,
					completion: 100,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 6,
					type: 'homework',
					typeText: '体育作业',
					title: '开合跳',
					description: '连续开合跳3分钟',
					date: '2024-01-13',
					time: '17:00',
					duration: 8,
					calories: 60,
					completion: 100,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 7,
					type: 'gym',
					typeText: '健身房',
					title: 'AI动作识别训练',
					description: '通过AI识别完成标准动作练习',
					date: '2024-01-12',
					time: '18:00',
					duration: 25,
					calories: 180,
					completion: 100,
					status: 'completed',
					statusText: '已完成'
				},
				{
					id: 8,
					type: 'homework',
					typeText: '体育作业',
					title: '跑步训练',
					description: '慢跑10分钟',
					date: '2024-01-12',
					time: '19:30',
					duration: 10,
					calories: 100,
					completion: 80,
					status: 'incomplete',
					statusText: '未完成'
				}
			]
		}
	},
	computed: {
		filteredRecordsList() {
			if (this.activeFilter === 'all') {
				return this.recordsList
			}
			return this.recordsList.filter(record => record.type === this.activeFilter)
		}
	},
	onLoad() {
		this.loadRecordsData()
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},
		
		// 设置筛选条件
		setFilter(filter) {
			this.activeFilter = filter
		},
		
		// 获取类型图标
		getTypeIcon(type) {
			if (type === 'gym') {
				return '/static/images/students/exercise.png'
			} else if (type === 'homework') {
				return '/static/images/students/homework.png'
			}
			return '/static/images/students/read.png'
		},
		
		// 查看记录详情
		viewRecordDetail(record) {
			console.log('查看记录详情:', record)
			uni.navigateTo({
				url: `/pages/students/recordDetail/index?id=${record.id}`
			})
		},
		
		// 加载记录数据
		loadRecordsData() {
			// 这里可以调用API获取运动记录数据
			console.log('加载运动记录数据')
		}
	}
}
</script>

<style lang="scss" scoped>
.records-container {
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

.stats-overview {
	padding: 32rpx;
	background: #FFFFFF;
	margin-bottom: 20rpx;
}

.stats-card {
	background: linear-gradient(135deg, #2C84FF 0%, #4A9EFF 100%);
	border-radius: 20rpx;
	padding: 32rpx;
}

.stat-item {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.stat-item:last-child {
	margin-bottom: 0;
}

.stat-icon {
	width: 60rpx;
	height: 60rpx;
	margin-right: 20rpx;
}

.icon-img {
	width: 100%;
	height: 100%;
}

.stat-info {
	flex: 1;
}

.stat-number {
	font-size: 40rpx;
	font-weight: 600;
	color: #FFFFFF;
	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 26rpx;
	color: #FFFFFF;
	opacity: 0.9;
}

.filter-section {
	padding: 0 32rpx 20rpx;
	background: #FFFFFF;
}

.filter-tabs {
	display: flex;
	gap: 20rpx;
}

.filter-tab {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #F5F5F5;
	border-radius: 36rpx;
	transition: all 0.3s ease;
}

.filter-tab.active {
	background: #2C84FF;
}

.tab-text {
	font-size: 28rpx;
	color: #666666;
	transition: color 0.3s ease;
}

.filter-tab.active .tab-text {
	color: #FFFFFF;
	font-weight: 500;
}

.records-list {
	padding: 0 32rpx 32rpx;
}

.record-item {
	background: #FFFFFF;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.record-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 32rpx;
	background: #F8F9FA;
	border-bottom: 1rpx solid #E5E5E5;
}

.record-type {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.record-type.gym {
	background: #E8F4FD;
}

.record-type.homework {
	background: #FFF3E0;
}

.type-icon {
	width: 24rpx;
	height: 24rpx;
}

.type-text {
	font-size: 24rpx;
	font-weight: 500;
}

.record-type.gym .type-text {
	color: #2C84FF;
}

.record-type.homework .type-text {
	color: #FF9800;
}

.record-date {
	font-size: 26rpx;
	color: #666666;
}

.record-content {
	padding: 32rpx;
}

.record-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 12rpx;
}

.record-desc {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.5;
	margin-bottom: 24rpx;
}

.record-stats {
	display: flex;
	justify-content: space-between;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
}

.stat-label {
	font-size: 24rpx;
	color: #666666;
	margin-bottom: 8rpx;
}

.stat-value {
	font-size: 28rpx;
	font-weight: 600;
	color: #2C84FF;
}

.record-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 32rpx;
	background: #F8F9FA;
	border-top: 1rpx solid #E5E5E5;
}

.record-time {
	font-size: 26rpx;
	color: #666666;
}

.record-status {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.record-status.completed {
	background: #E8F5E8;
}

.record-status.incomplete {
	background: #FFF3E0;
}

.status-text {
	font-size: 24rpx;
	font-weight: 500;
}

.record-status.completed .status-text {
	color: #4CAF50;
}

.record-status.incomplete .status-text {
	color: #FF9800;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 32rpx;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 32rpx;
	opacity: 0.5;
}

.empty-text {
	font-size: 32rpx;
	color: #999999;
}
/* 新版分组列表样式，匹配截图视觉 */
.records-page {
	min-height: 100vh;
	background: #F5F6F8;
}

.sections {
	padding: 16rpx 24rpx 24rpx;
}

.section {
	margin-bottom: 24rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8rpx 12rpx;
	color: #8A8F99;
	font-size: 26rpx;
}

.section-count {
	color: #8A8F99;
}

.card {
	background: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
}

.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 28rpx;
	border-bottom: 1rpx solid #EEEEEE;
}

.row:last-child {
	border-bottom: none;
}

.left .name {
	font-size: 32rpx;
	color: #111111;
	font-weight: 600;
}

.left .time {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #8A8F99;
}

.right {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.duration {
	color: #2C84FF;
	font-size: 32rpx;
	font-weight: 600;
}

.chev {
	width: 20rpx;
	height: 20rpx;
}
</style>