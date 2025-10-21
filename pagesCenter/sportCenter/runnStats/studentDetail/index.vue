<template>
	<view class="">
		<view class="u-flex u-margin-left-12 u-margin-right-12 u-margin-top-16 u-margin-bottom-24">
			<score-card class='u-flex-1' bgColor="#5C8FF7" :label="$t('center.runKilometers')" :value="runKilometers" />
			<score-card class='u-flex-1' bgColor="#8889FF" :label="$t('center.runNumber')" :value="runNumber" />
			<score-card class='u-flex-1' bgColor="#3EC5A5" label="目标完成">
				<view class="u-flex">
					<view style="color: #5C8FF7;">
						{{completeRun}}
					</view>
					<view class="">
						/
					</view>
					<view class="">
						{{semesterGoal}}
					</view>
				</view>
			</score-card>
		</view>
		<line-charts ref="chartRef" />
	</view>
</template>

<script>
	import lineCharts from '../components/line-charts/index.vue'
	import scoreCard from '../components/score-card/index.vue'
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		computeNumber,
		dealNumber
	} from '@/common/util.js'
	export default {
		components: {
			scoreCard,
			lineCharts
		},
		data() {
			return {
				queryForm: {},
				runKilometers: 0, // 跑步公里
				runNumber: 0, // 跑步次数
				completeRun: 0,
				semesterGoal: 0
			}
		},
		onLoad(e) {
			this.queryForm = JSON.parse(decodeURIComponent(e.option))
			uni.setNavigationBarTitle({
				title: this.queryForm.studentName
			})
			this.apiGetRunStatsInfo()
			const lineParams = {
				startDate: this.queryForm.startDate,
				endDate: this.queryForm.endDate,
				sid: this.queryForm.sid,
				schoolId: this.queryForm.schoolId,
				studentId: this.queryForm.studentId
			}
			this.$refs.chartRef.apiGetRunStatsTrend(1, [1, 3], lineParams)
		},
		methods: {
			apiGetRunStatsInfo() {
				getReq(URL.runStatsInfo, {
					schoolId: this.queryForm.schoolId,
					sid: this.queryForm.sid,
					studentId: this.queryForm.studentId
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== "{}") {
						const dataSource = res.data
						this.runKilometers = dealNumber(computeNumber(dataSource.runKilometers, '/', 1000).result)  || '0'
						this.runNumber = dataSource.runNumber || '0'
						this.completeRun = dealNumber(computeNumber(dataSource.completeRun, '/', 1000).result) 
						this.semesterGoal = dealNumber(computeNumber(dataSource.semesterGoal, '/', 1000).result) 
					} else {
						this.runKilometers = 0
						this.runNumber = 0
						this.completeRun = 0
						this.semesterGoal = 0
					}
				}).catch(error => {
					this.runKilometers = 0
					this.runNumber = 0
					this.completeRun = 0
					this.semesterGoal = 0
				})
			}
		}
	}
</script>

<style>
</style>
