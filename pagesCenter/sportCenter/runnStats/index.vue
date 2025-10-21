<template>
	<view class="">
		<view class="semester-select" v-if="semesterList && semesterList.length" @click="goSemseterSelect">
			<view class="u-flex">
				<view class="u-font-28">
					{{semesterData.semesterName}}
				</view>
				<view class="u-font-24">
					(
					{{dateFormat(new Date(semesterData.startTime),'yyyy-MM-dd')}}&nbsp&nbsp-&nbsp&nbsp
					{{dateFormat(new Date(semesterData.endTime),'yyyy-MM-dd')}}
					)
				</view>
			</view>
			<u-icon name="arrow-right" color="#B2B2B2" size="26"></u-icon>
		</view>
		<view class="u-flex u-margin-left-12 u-margin-right-12 u-margin-top-16 u-margin-bottom-24">
			<score-card class='u-flex-1' bgColor="#5C8FF7" :label="$t('center.runKilometers')" :value="runKilometers" />
			<score-card class='u-flex-1' bgColor="#8889FF" :label="$t('center.runCount')" :value="runCount" />
			<score-card class='u-flex-1' bgColor="#3EC5A5" :label="$t('center.completeRate')" :value="completeRate"
				:tips="$t('center.completeRateTip')" />
		</view>
		<view class="u-margin-bottom-20">
			<line-charts ref="chartRef" />
		</view>
		<block v-for="item in classList" :key="item.classId">
			<classes-card :dataSource="item" @click="onClassDetail(item)" />
		</block>
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
		computeNumber,
		dealPersent,
		dealNumber
	} from '@/common/util.js'
	import scoreCard from './components/score-card/index.vue'
	import lineCharts from './components/line-charts/index.vue'
	import classesCard from './components/classes-card/index.vue'
	export default {
		components: {
			scoreCard,
			lineCharts,
			classesCard
		},
		data() {
			return {
				semesterData: {},
				semesterList: [],
				dateFormat,
				runKilometers: '--', // 跑步公里
				runCount: '--', // 跑步人数
				completeRate: '--', // 目标完成率
				classList: []
			}
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: this.$t('center.runnStats')
			})
			if (e.option) {
				this.semesterData = JSON.parse(decodeURIComponent(e.option));
			}
		},
		onReady() {
			this.getBasicInfo()
		},
		watch: {
			semesterData: {
				handler(value) {
					if (value && JSON.stringify(value) !== '{}') {
						this.apiGetRunStatsInfo()
						const lineParams = {
							startDate: value.startTime,
							endDate: value.endTime,
							sid: value.id,
							schoolId: this.xiaotiyunUser.teacher.schoolId
						}
						this.$refs.chartRef.apiGetRunStatsTrend(1, [1, 2], lineParams)
						this.apiGetRunStatsClassInfo()
					}
				},
				deep: true
			}
		},
		methods: {
			getBasicInfo() {
				getReq(URL.semesterList, {
					schoolId: this.xiaotiyunUser.teacher.schoolId
				}).then(res => {
					if (res.data && res.data.length) {
						this.semesterList = res.data.sort((pre, next) => {
							return next.startTime - pre.startTime
						})
						if (!this.semesterData || JSON.stringify(this.semesterData) === '{}') {
							const newTime = new Date().getTime()
							let dataSource = this.semesterList.find(item => {
								return item.startTime <= newTime && item.endTime >= newTime
							})
							if (!dataSource || JSON.stringify(dataSource) === '{}') {
								dataSource = this.semesterList[0]
							}
							const {
								gradeSemesterGoals,
								...params
							} = dataSource
							this.semesterData = params
						}
					} else {
						this.semesterList = []
						this.semesterData = {}
					}
				}).catch(() => {
					this.semesterList = []
					this.semesterData = {}
				})
			},
			goSemseterSelect() {
				this.$u.route({
					url: '/pagesCenter/sportCenter/runnStats/semseterSelect/index',
					type: "redirectTo",
					params: {
						dataSource: encodeURIComponent(JSON.stringify(this.semesterList))
					}
				})
			},

			/**
			 * 跑步统计 - 基本数据
			 * @prams schoolId
			 * @prams sid
			 */
			apiGetRunStatsInfo() {
				getReq(URL.runStatsInfo, {
					schoolId: this.xiaotiyunUser.teacher.schoolId,
					sid: this.semesterData.id
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						this.runKilometers = dealNumber(computeNumber(res.data.runKilometers, '/', 1000).result) ||
							'--'
						this.runCount = res.data.runCount || '--'
						this.completeRate = res.data.completeRate ? `${dealPersent(res.data.completeRate)}%` :
							'--'
					} else {
						this.runKilometers = '--'
						this.runCount = '--'
						this.completeRate = '--'
					}
				}).catch(() => {
					this.runKilometers = '--'
					this.runCount = '--'
					this.completeRate = '--'
				})
			},
			apiGetRunStatsClassInfo() {
				getReq(URL.runStatsClassInfo, {
					schoolId: this.xiaotiyunUser.teacher.schoolId,
					sid: this.semesterData.id
				}).then(res => {
					if (res.data && res.data.length) {
						this.classList = res.data
					} else {
						this.classList = []
					}
				}).catch(error => {
					this.classList = []
				})
			},
			onClassDetail(data) {
				const params = Object.assign({}, data, {
					startDate: this.semesterData.startTime,
					endDate: this.semesterData.endTime,
					sid: this.semesterData.id,
				})
				this.$u.route({
					url: '/pagesCenter/sportCenter/runnStats/classDetail/index',
					params: {
						option: encodeURIComponent(JSON.stringify(params))
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.semester-select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 28rpx;
		background: #FFFFFF;
		color: #464646;
		border-top: 1px solid #DDDDDD;
	}
</style>
