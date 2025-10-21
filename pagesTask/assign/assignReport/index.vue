<template>
	<view class="assignReport">
		<u-subsection :list="dataTabList" :current="current" mode="subsection" active-color="#5C8FF7"
			inactive-color="#202020" :height="56" :bold="false" :fontSize="24" @change="bindDataTabChange" />
		</u-subsection>
		<view class="assignReport-title">
			<view class="">
				{{$t('task.assign.assignReport.assignmentReportTitle')}}
			</view>
			<template v-if="classInfos && classInfos.length">
				<view @click="show = true">
					<text v-if="selectorData === 0">{{$t('task.assign.assignReport.assignmentReportTabTitle1')}}</text>
					<text v-if="selectorData === 1">{{$t('task.assign.assignReport.tableHeaderName2')}}</text>
					<text>降序</text>
				</view>
			</template>
		</view>
		<u-picker v-model="show" mode="selector" :default-selector="[selectorData]" :range="selectorObj"
			range-key="label" @confirm="bindPickerChange">
		</u-picker>
		<template v-if="classInfos && classInfos.length">
			<block v-for="item in classInfos" :key="item.classId">
				<view class="assignReport-item" @click="jumpWebviewPage(item)">
					<view class="assignReport-item-classname">
						{{item.aliasClassName ? item.aliasClassName : item.className}}
					</view>
					<view class="assignReport-item-data">
						<view class="top">
							{{item.assignDays}}
						</view>
						<view class="bottom">
							{{$t('task.assign.assignReport.assignmentReportTabTitle1')}}
						</view>
					</view>
					<view class="assignReport-item-data">
						<view class="top" style="color: #2562FF;">
							{{dealPersent(item.completeRate)}}%
						</view>
						<view class="bottom">
							{{$t('task.assign.assignReport.tableHeaderName2')}}%
						</view>
					</view>
				</view>
			</block>
		</template>
		<template v-else>
			<u-empty src="/static/md_icon_empty1.png" text="暂无数据" :font-size="24" color="#B2B2B2" :icon-size="250"
				:marginTop="140">
			</u-empty>
		</template>
		<view class="export" @click="jumpExportPage">
			导出数据
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		dateFormat,
		dealPersent
	} from '@/common/util.js'

	export default {
		data() {
			return {
				dataTabList: [{
						name: this.$t('task.assign.assignReport.lastWeek'),
						timer: 7
					},
					{
						name: this.$t('task.assign.assignReport.lastMonth'),
						timer: 1
					},
					{
						name: this.$t('task.assign.assignReport.lastThreeMonths'),
						timer: 3
					},
					{
						name: this.$t('task.assign.assignReport.lastHalfYear'),
						timer: 6
					}
				],
				current: 0,
				show: false,
				selectorObj: [{
					label: this.$t('task.assign.assignReport.assignmentReportTabTitle1'),
					id: 0
				}, {
					label: this.$t('task.assign.assignReport.tableHeaderName2'),
					id: 1
				}, ],
				selectorData: 0,
				classInfos: [], // 班级作业数据
				dealPersent
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('task.assign.assignReport.title')
			})
		},
		onReady() {
			this.bindDataTabChange(this.current)
		},
		//下拉刷新
		onPullDownRefresh() {
			this.bindDataTabChange(this.current)
		},
		computed: {
			...mapState(['userInfo', 'xiaotiyunUser'])
		},
		methods: {
			// 
			async getReportOverview(daterange) {
				try {
					const result = await getReq(URL.reportOverview, {
						beginDate: daterange[0],
						endDate: daterange[1]
					})
					if (result.data && JSON.stringify(result.data) !== "{}" && result.data.classInfos && result.data
						.classInfos.length) {
						this.classInfos = result.data.classInfos.sort((pre, next) => {
							return next.assignDays - pre.assignDays
						})
					} else {
						this.classInfos = []
					}
				} catch (e) {
					this.classInfos = []
				} finally {
					uni.stopPullDownRefresh();
				}
			},
			bindDataTabChange(index) {
				this.current = index
				const today = dateFormat(new Date(), 'yyyy-MM-dd')
				const year = new Date().getFullYear()
				const month = new Date().getMonth()
				const day = new Date().getDate()
				let preday = dateFormat(new Date(), 'yyyy-MM-dd')
				if (this.dataTabList[index].timer === 7) {
					preday = dateFormat(new Date(year, month, day - this.dataTabList[index].timer), 'yyyy-MM-dd')
				} else {
					preday = dateFormat(new Date(year, month - this.dataTabList[index].timer, day), 'yyyy-MM-dd')
				}
				this.getReportOverview([preday, today])
			},
			bindPickerChange(data) {
				this.selectorData = data[0]
				if (data[0]) {
					this.classInfos = this.classInfos.sort((pre, next) => {
						return next.assignDays - pre.assignDays
					})
				} else {
					this.classInfos = this.classInfos.sort((pre, next) => {
						return next.completeRate - pre.completeRate
					})
				}
			},
			jumpExportPage() {
				this.$u.route({
					url: '/pagesTask/assign/assignReport/dataExport',
				})
			},
			jumpWebviewPage({
				classId
			}) {
				this.$u.route({
					url: '/pagesTask/assign/assignReport/classes',
					params: {
						classId,
						current: this.current
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.assignReport {
		box-sizing: border-box;
		width: 100%;
		min-height: 100vh;
		background-color: #fff;
		padding: 30rpx;
		padding-bottom: 30rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));

		&-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			line-height: 1.5;
			font-weight: 500;
			color: #202020;
			margin: 30rpx 0;
		}

		&-item {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			padding: 28rpx 18rpx;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 18rpx -7rpx #6695F6;
			border-radius: 22rpx;
			margin-bottom: 30rpx;

			&-classname {
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 144rpx;
				height: 144rpx;
				text-align: center;
				padding: 0 14rpx;
				font-size: 28rpx;
				line-height: 1.5;
				font-weight: 500;
				color: #FFFFFF;
				background: #6695F6;
				box-shadow: 0px 2rpx 18rpx -7rpx #6695F6;
				border-radius: 22rpx;
			}

			&-data {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-around;
				flex-direction: column;
				height: 144rpx;

				.top {
					font-size: 36rpx;
					font-weight: bold;
					line-height: 1.5;
				}

				.bottom {
					font-size: 24rpx;
					color: #202020;
					line-height: 1.5;
				}
			}
		}

		&-calsses-name {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 116rpx;
			height: 144rpx;
			text-align: center;
			padding: 0 14rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
			background: #6695F6;
			box-shadow: 0px 2rpx 18rpx -7rpx #6695F6;
			border-radius: 22rpx;
			word-wrap: break-word;
			word-break: break-all;
			overflow: hidden;
		}
	}

	.export {
		position: fixed;
		right: 38rpx;
		bottom: 38rpx;
		bottom: calc(38rpx + constant(safe-area-inset-bottom));
		bottom: calc(38rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		padding: 20rpx;
		font-size: 28rpx;
		text-align: center;
		box-shadow: 0 1px 8px 1px rgba($color: #a5a5a5, $alpha: 0.2);
	}
</style>
