<template>
	<view class="gym-page">
		<!-- 顶部背景 -->
		<view class="gym-header">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="title">家庭健身房</view>
				<view class="subtitle">在家也能享受专业运动体验</view>
			</view>
		</view>
		
		<!-- 运动项目列表 -->
		<view class="exercise-list">
			<view class="section-title">推荐运动</view>
			
			<view class="exercise-item" @click="startExercise('running')">
				<view class="exercise-icon running">
					<image src="/static/images/students/jtjsf.png" class="icon-img"></image>
				</view>
				<view class="exercise-info">
					<view class="exercise-name">跑步训练</view>
					<view class="exercise-desc">提升心肺功能，增强耐力</view>
					<view class="exercise-duration">建议时长：20-30分钟</view>
				</view>
				<view class="exercise-action">
					<text class="action-text">开始</text>
				</view>
			</view>
			
			<view class="exercise-item" @click="startExercise('jumping')">
				<view class="exercise-icon jumping">
					<image src="/static/images/students/xwtyzy.png" class="icon-img"></image>
				</view>
				<view class="exercise-info">
					<view class="exercise-name">跳绳训练</view>
					<view class="exercise-desc">提高协调性，燃烧卡路里</view>
					<view class="exercise-duration">建议时长：15-20分钟</view>
				</view>
				<view class="exercise-action">
					<text class="action-text">开始</text>
				</view>
			</view>
			
			<view class="exercise-item" @click="startExercise('pushup')">
				<view class="exercise-icon pushup">
					<image src="/static/images/students/dlfyb.png" class="icon-img"></image>
				</view>
				<view class="exercise-info">
					<view class="exercise-name">俯卧撑</view>
					<view class="exercise-desc">增强上肢力量，塑造胸肌</view>
					<view class="exercise-duration">建议时长：10-15分钟</view>
				</view>
				<view class="exercise-action">
					<text class="action-text">开始</text>
				</view>
			</view>
			
			<view class="exercise-item" @click="startExercise('situp')">
				<view class="exercise-icon situp">
					<image src="/static/images/students/jsydjl.png" class="icon-img"></image>
				</view>
				<view class="exercise-info">
					<view class="exercise-name">仰卧起坐</view>
					<view class="exercise-desc">强化核心肌群，塑造腹肌</view>
					<view class="exercise-duration">建议时长：10-15分钟</view>
				</view>
				<view class="exercise-action">
					<text class="action-text">开始</text>
				</view>
			</view>
		</view>
		
		<!-- 今日运动统计 -->
		<view class="today-stats">
			<view class="section-title">今日运动</view>
			<view class="stats-grid">
				<view class="stat-item">
					<view class="stat-value">{{ todayStats.duration }}</view>
					<view class="stat-label">运动时长</view>
				</view>
				<view class="stat-item">
					<view class="stat-value">{{ todayStats.calories }}</view>
					<view class="stat-label">消耗卡路里</view>
				</view>
				<view class="stat-item">
					<view class="stat-value">{{ todayStats.exercises }}</view>
					<view class="stat-label">完成项目</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				todayStats: {
					duration: '25分钟',
					calories: '180卡',
					exercises: '3项'
				}
			}
		},
		onLoad() {
			this.getTodayStats()
		},
		methods: {
			// 获取今日运动统计
			getTodayStats() {
				// 这里可以调用API获取今日运动数据
				// 暂时使用模拟数据
			},
			
			// 开始运动
			startExercise(type) {
				uni.showModal({
					title: '开始运动',
					content: `确定要开始${this.getExerciseName(type)}吗？`,
					success: (res) => {
						if (res.confirm) {
							this.goToExercise(type)
						}
					}
				})
			},
			
			// 获取运动名称
			getExerciseName(type) {
				const names = {
					running: '跑步训练',
					jumping: '跳绳训练',
					pushup: '俯卧撑',
					situp: '仰卧起坐'
				}
				return names[type] || '运动'
			},
			
			// 跳转到运动页面
			goToExercise(type) {
				// 这里可以跳转到具体的运动页面
				uni.showToast({
					title: '开始运动',
					icon: 'success'
				})
				
				// 模拟运动开始
				setTimeout(() => {
					uni.showToast({
						title: '运动完成！',
						icon: 'success'
					})
					this.updateStats()
				}, 3000)
			},
			
			// 更新统计数据
			updateStats() {
				// 这里可以更新运动统计数据
				this.todayStats.exercises = parseInt(this.todayStats.exercises) + 1 + '项'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gym-page {
		min-height: 100vh;
		background: #f5f5f5;
	}
	
	.gym-header {
		position: relative;
		height: 300rpx;
		overflow: hidden;
	}
	
	.header-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.header-content {
		position: relative;
		z-index: 2;
		padding: 80rpx 32rpx 40rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.title {
		font-size: 48rpx;
		font-weight: 600;
		color: #FFFFFF;
		margin-bottom: 16rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}
	
	.exercise-list {
		padding: 32rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 24rpx;
	}
	
	.exercise-item {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	}
	
	.exercise-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		margin-right: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.running {
		background: linear-gradient(135deg, #667eea, #764ba2);
	}
	
	.jumping {
		background: linear-gradient(135deg, #f093fb, #f5576c);
	}
	
	.pushup {
		background: linear-gradient(135deg, #4facfe, #00f2fe);
	}
	
	.situp {
		background: linear-gradient(135deg, #43e97b, #38f9d7);
	}
	
	.icon-img {
		width: 48rpx;
		height: 48rpx;
	}
	
	.exercise-info {
		flex: 1;
	}
	
	.exercise-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 8rpx;
	}
	
	.exercise-desc {
		font-size: 26rpx;
		color: #666666;
		margin-bottom: 8rpx;
	}
	
	.exercise-duration {
		font-size: 24rpx;
		color: #999999;
	}
	
	.exercise-action {
		padding: 16rpx 32rpx;
		background: linear-gradient(135deg, #667eea, #764ba2);
		border-radius: 24rpx;
	}
	
	.action-text {
		font-size: 26rpx;
		color: #FFFFFF;
		font-weight: 500;
	}
	
	.today-stats {
		padding: 0 32rpx 40rpx;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 24rpx;
	}
	
	.stat-item {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 32rpx 24rpx;
		text-align: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	}
	
	.stat-value {
		font-size: 36rpx;
		font-weight: 600;
		color: #667eea;
		margin-bottom: 8rpx;
	}
	
	.stat-label {
		font-size: 24rpx;
		color: #666666;
	}
</style>

