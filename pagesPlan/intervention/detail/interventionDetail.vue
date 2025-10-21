<template>
	<view class="container">
		<!-- 班级信息 -->
		<intervention-class :dataSource="classInfo" />
		<!-- 时间筛选 -->
		<view class="date-filter" @click="tapDateFilter">
			<u-icon :name="isDropDown ? 'arrow-up-fill' : 'arrow-down-fill'" size="16" color="#707070"
				:label="startDate + ' 至 ' + endDate" label-color="707070" label-pos="left">
			</u-icon>
			<u-calendar v-model="isDropDown" mode="range" @change="selectedDateRange"></u-calendar>
		</view>
		<!-- 完成情况标题 -->
		<view class="complete-title">
			<text>{{ $t('common.student') + $t('pagesPlan.intervention.detail.complete') }}</text>
			<image class="downLoad-img" src="../../static/icon_downland.png" @click="tapDownload" :loading="loading"></image>
		</view>
		<!-- 列表 -->
		<view class="complete-list">
			<view class="list-head">
				<text>{{ $t('common.name') }}</text>
				<text>{{ $t('pagesPlan.intervention.detail.complete') }}</text>
			</view>
			<view style="width: inherit; height: 2upx; background-color: lightgray; margin: 0upx 30upx;"></view>
			<view class="list-item" v-for="(item, index) in listArray" :key="index">
				<text>{{ item.studentName }}</text>
				<text>{{ item.completedDays + '/' + item.totalDays }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import InterventionClass from './components/InterventionClass.vue'
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		dateFormat,
		getDateTimeStrByMonth
	} from '@/common/util.js';
	import { downloadPreviewExcelFile } from "@/common/util.js";
	
	export default {
		components: {
			'intervention-class': InterventionClass,
		},
		data() {
			return {
				classInfo: {},
				isDropDown: false,
				classId: '',
				startDate: '',
				endDate: '',
				listArray: [],
				loading: false,
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: this.$t('pagesPlan.intervention.detail.title')
			})
			let _this = this
			const eventChannel = _this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromInterventionPage', function(data) {
				_this.classInfo = data
			})
			this.classId = options.classId
			this.startDate = getDateTimeStrByMonth(0, -1)
			this.endDate = dateFormat(new Date(), 'yyyy-MM-dd')
			this.queryInterventionDetail()
		},
		methods: {
			// 点击时间筛选
			tapDateFilter() {
				this.isDropDown = !this.isDropDown
			},
			// 点击下载按钮
			tapDownload() {
				this.downloadInterventionFile()
			},
			// 选择时间区间
			selectedDateRange(e) {
				this.startDate = e.startDate
				this.endDate = e.endDate
				this.queryInterventionDetail()
			},
			// 获取干预方案详情
			queryInterventionDetail() {
				getReq(URL.apiGetInterventionCompletion, {
					classId: this.classId,
					startTime: this.startDate,
					endTime: this.endDate,
				}).then(res => {
					if (res.error == 10000) {
						this.listArray = res.data
					} else {
						uni.showToast({
							title: res.message,
						})
					}
				})
			},
			// 下载干预方案完成情况    
			downloadInterventionFile() {
				this.loading = true
				getReq(URL.apiGetInterventionExport, {
					classId: this.classId,
					startTime: this.startDate,
					endTime: this.endDate,
				}).then(res => {
					if (res.error == 10000) {
						downloadPreviewExcelFile(res.data);
					} else {
						uni.showToast({
							title: res.message,
						})
					}
					this.loading = false
				}).catch(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 750upx;
		overflow: scroll;
	}

	.date-filter {
		width: 420upx;
		height: 60upx;
		margin: 10upx 32upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.complete-title {
		height: 90upx;
		padding: 0upx 16upx 0upx 32upx;
		background: #FFFFFF;
		font-size: 32upx;
		font-weight: 600;
		color: #202020;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		.downLoad-img {
			width: 63upx;
			height: 64upx;
			padding: 16upx;
		}
	}

	.complete-list {
		padding-bottom: 20upx;
		display: flex;
		flex-direction: column;

		.list-head {
			height: 90upx;
			padding: 0upx 32upx;
			background: #FFFFFF;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.list-item {
			height: 70upx;
			padding: 0upx 32upx;
			background: #FFFFFF;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>