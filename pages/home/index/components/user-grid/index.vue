<template>
	<u-grid class="grid-bezel" :col="4" :border="false">
		<!-- 布置作业 -->
		<u-grid-item @click="goAssignTask" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/assign_task.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.assginTask')}}</view>
		</u-grid-item>
		<!-- 批改作业 -->
		<u-grid-item @click="goCorrectTask" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/correct_task.png" mode="aspectFit"></u-image>
			</image>
			<view class="grid-text">{{$t('main.home.index.correctTask')}}</view>
		</u-grid-item>
		<!-- 作业报告 -->
		<u-grid-item @click="goAssignReport" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/class_plan.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.assignmentReport')}}</view>
		</u-grid-item>
		<!-- 运动方案 -->
		<u-grid-item @click="jumpPageClassPlan" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/plan_center.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.classPlan')}}</view>
		</u-grid-item>
		<!-- AI运动数据 -->
		<!-- <u-grid-item @click="goAiData" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/ai_data.png" mode="aspectFit"></u-image>
			<view class="grid-text">AI{{$t('main.home.index.sportData')}}</view>
		</u-grid-item> -->
		<!-- 干预方案数据 -->
		<u-grid-item @click="tapInterventionData" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/intervention_plan.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.interventionData')}}</view>
		</u-grid-item>
		<!-- 体质数据 -->
		<u-grid-item @click="goPhysicalFactorData" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/physical_factor_data.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.physicalFactorData')}}</view>
		</u-grid-item>
		<!-- 体测数据 -->
		<u-grid-item @click="goPhysicalData" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/physical_data.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.physicalData')}}</view>
		</u-grid-item>
		<!-- 跑步中心 -->
		<u-grid-item @click="goSportPlan" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/sport_center.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.sportCenter')}}</view>
		</u-grid-item>
		<!-- 随堂训练 -->
		<u-grid-item @click="tapClassTraining" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/class_training.png" mode="aspectFit"></u-image>
			<view class="grid-text">{{$t('main.home.index.classTraining')}}</view>
		</u-grid-item>
		<!-- 串班训练 -->
		<u-grid-item @click="tapCasuallyClass" :custom-style="{padding: '0 0 32rpx'}">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/casually_class.png" mode="aspectFit">
			</u-image>
			<view class="grid-text">{{$t('main.home.index.casuallyClass')}}</view>
		</u-grid-item>
		<!-- 自由锻练 -->
		<u-grid-item :custom-style="{padding: '0 0 32rpx'}" @click="clickFreeExercise">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/free_exercise.png" mode="aspectFit">
			</u-image>
			<view class="grid-text">{{$t('main.home.index.freeExercise')}}</view>
		</u-grid-item>
		<!-- 阳光跑 -->
		<u-grid-item :custom-style="{padding: '0 0 32rpx'}" @click="clickSunshineRun">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/sunshine_run.png" mode="aspectFit">
			</u-image>
			<view class="grid-text">{{$t('main.home.index.sunshineRun')}}</view>
		</u-grid-item>
		<!-- 奖品核销 -->
		<u-grid-item :custom-style="{padding: '0 0 32rpx'}" @click="clickPrizeVerification">
			<u-image width="90rpx" height="90rpx" :show-menu-by-longpress="false"
				src="@/static/images/home/prize_verification.png" mode="aspectFit">
			</u-image>
			<view class="grid-text">{{$t('main.home.index.prizeVerification')}}</view>
		</u-grid-item>
		<!-- 空占位视图 -->
		<u-grid-item :custom-style="{padding: '0 0 32rpx'}">
			<view style="width: 90rpx; height: 90rpx;"></view>
			<view class="grid-text" style="color:white;">{{ '空' }}</view>
		</u-grid-item>
		<u-grid-item :custom-style="{padding: '0 0 32rpx'}">
			<view style="width: 90rpx; height: 90rpx;"></view>
			<view class="grid-text" style="color:white;">{{ '空' }}</view>
		</u-grid-item>
		<u-grid-item :custom-style="{padding: '0 0 32rpx'}">
			<view style="width: 90rpx; height: 90rpx;"></view>
			<view class="grid-text" style="color:white;">{{ '空' }}</view>
		</u-grid-item>
	</u-grid>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	export default {
		data() {
			return {}
		},
		computed: {
			...mapState(['xiaotiyunUser']),
		},
		methods: {
			// 布置作业
			goAssignTask() {
				this.$u.route({
					url: '/pagesTask/assign/index/index',
				})
			},
			// 批改作业
			goCorrectTask() {
				this.$u.route({
					url: '/pagesTask/correct/index/index',
				})
			},
			// 作业报告
			goAssignReport() {
				this.$u.route({
					url: '/pagesTask/assign/assignReport/index',
				})
			},
			// 运动方案
			jumpPageClassPlan() {
				this.$u.route({
					url: '/pagesPlan/classPlan/index/index',
				})
			},
			// AI运动数据
			// goAiData() {
			// 	this.$u.route({
			// 		url: '/pagesData/aiData/index/index',
			// 	})
			// },
			// 点击干预方案数据
			tapInterventionData() {
				this.$u.route({
					url: '/pagesPlan/intervention/index/intervention'
				})
			},
			// 体质数据
			goPhysicalFactorData() {
				this.$u.route({
					url: '/pagesData/physicalFactorData/index/index',
				})
				uni.navigateTo({
					url: ""
				})
			},
			// 体测数据
			goPhysicalData() {
				this.$u.route({
					url: '/pagesData/physicalData/index/index',
				})
			},
			// 跑步中心
			goSportPlan() {
				getReq(URL.schoolSportCenter, {
					schoolId: this.xiaotiyunUser.teacher.schoolId
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}' && res.data.runOpen) {
						this.$u.route({
							url: '/pagesCenter/sportCenter/index',
						})
					} else {
						this.clickWarning()
					}
				}).catch(error => {
					this.clickWarning()
				})
			},
			// 点击随堂训练
			tapClassTraining() {
				this.$u.route({
					url: '/pagesCenter/classTraining/page/index',
				})
			},
			// 点击串班训练
			tapCasuallyClass() {
				this.$u.route({
					url: '/pagesCenter/casuallyClass/page/index',
				})
			},
			// 点击自由锻练
			clickFreeExercise() {
				this.$u.route({
					url: '/pagesCenter/freeExercise/page/index',
				})
			},
			// 点击阳光跑
			clickSunshineRun() {
				this.$u.route({
					url: 'pagesCenter/sunshineRun/page/index',
				})
			},
			// 点击奖品核销
			clickPrizeVerification() {
				this.$u.route({
					url: '/pagesData/prizeVerification/page/index'
				})
			},
			clickWarning() {
				uni.showToast({
					icon: "none",
					title: this.$t('main.home.index.commingSoon'),
					duration: 1000
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.grid {
		color: #202020;

		&-text {
			margin-top: 24rpx;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 1.5;
		}
	}
</style>