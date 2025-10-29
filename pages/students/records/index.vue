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
			],
			activeFilter: 'all',
			totalStats: {
				totalTime: 1250,
				totalDays: 28,
				totalCalories: 3200
			},
			recordsList: [
				
			]
		}
	},
	computed: {
	},
	onLoad() {
		this.loadRecordsData()
	},
	methods: {
		// 格式化：Date => YYYY-MM-DD
		formatDateTime(date) {
			const y = date.getFullYear()
			const m = String(date.getMonth() + 1).padStart(2, '0')
			const d = String(date.getDate()).padStart(2, '0')
			return `${y}-${m}-${d}`
		},

		// 时间戳(毫秒) => YYYY-MM-DD
		formatDateFromMs(ms) {
			return this.formatDateTime(new Date(ms))
		},

		// 时间戳(毫秒) => HH:mm
		formatTimeFromMs(ms) {
			const date = new Date(ms)
			const hh = String(date.getHours()).padStart(2, '0')
			const mm = String(date.getMinutes()).padStart(2, '0')
			return `${hh}:${mm}`
		},

		// 毫秒 => M:SS 展示（例：0:30、5:07）
		formatDurationFromMs(ms) {
			const totalSeconds = Math.max(0, Math.floor((ms || 0) / 1000))
			const minutes = Math.floor(totalSeconds / 60)
			const seconds = String(totalSeconds % 60).padStart(2, '0')
			return `${minutes}:${seconds}`
		},

		// label：今天/具体日期
		labelForDate(dateStr) {
			const todayStr = this.formatDateTime(new Date())
			return dateStr === todayStr ? '今天' : dateStr
		},

		// 加载记录数据
		loadRecordsData() {
			const params = {
				pageNum: 1,
				pageSize: 9999
			}
			getReq(URL.jxjRecordList, params).then(res => {
				if (res.message === '成功') {
					// 兼容不同后端结构：data.content 可能是数组，每个元素内含 recordInfos
					const content = (res.data.content) || []
					const flatList = []
					content.forEach(block => {
						const list = (block && block.recordInfos) || []
						list.forEach(item => flatList.push(item))
					})

					// 分组：按上传日期(YYYY-MM-DD)
					const groupsMap = {}
					flatList.forEach(info => {
						const uploadMs = info.uploadTime || info.scoreDate || 0
						const dateKey = this.formatDateFromMs(uploadMs)
						if (!groupsMap[dateKey]) groupsMap[dateKey] = []
						groupsMap[dateKey].push({
							id: info.id,
							title: info.name || '运动项目',
							time: this.formatTimeFromMs(uploadMs),
							duration: this.formatDurationFromMs(info.time_consume),
						})
					})

					// 组装为页面所需结构，按日期倒序
					const sortedDates = Object.keys(groupsMap).sort((a, b) => b.localeCompare(a))
					this.groupedRecords = sortedDates.map(d => ({
						label: this.labelForDate(d),
						items: groupsMap[d]
					}))
					
				}
			}).catch(() => {
				this.groupedRecords = []
			})
		},
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
			// 跳转到“完成页”作为记录详情展示
			// 兼容 duration 可能为 'MM:SS' 字符串或数字（分钟）
			let minutes
			let seconds
			if (typeof record.duration === 'string') {
				const parts = String(record.duration).split(':')
				const m = parseInt(parts[0] || '0') || 0
				const s = parseInt(parts[1] || '0') || 0
				minutes = m
				seconds = m * 60 + s
			} else if (typeof record.duration === 'number') {
				minutes = record.duration
				seconds = Math.max(0, Math.round(record.duration * 60))
			}
			const name = record.title || '运动项目'
			const id = record.id || ''
			uni.navigateTo({
				url: `/pagesTask/assign/assignTask/finish?name=${(name)}&id=${encodeURIComponent(id)}&duration=${minutes}&seconds=${seconds}&from=record`
			})
		},
		
		
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
