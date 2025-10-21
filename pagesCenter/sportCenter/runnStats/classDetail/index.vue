<template>
	<view class="">
		<view class="u-flex u-margin-left-12 u-margin-right-12 u-margin-top-16 u-margin-bottom-24">
			<score-card class='u-flex-1' bgColor="#5C8FF7" :label="$t('center.runKilometers')" :value="runKilometers" />
			<score-card class='u-flex-1' bgColor="#8889FF" :label="$t('center.runCount')" :value="runCount" />
			<score-card class='u-flex-1' bgColor="#3EC5A5" :label="$t('center.completeRate')" :value="completeRate"
				:tips="$t('center.completeRateTip')" />
		</view>
		<line-charts ref="chartRef" />
		<view class="u-margin-top-16 u-margin-right-32 u-margin-bottom-16 u-margin-left-32">
			学生列表（{{studentCount || 0}}名）
		</view>
		<block v-for="item in studentList" :key="item.studentId">
			<student-card :dataSource="item" @click="onStudentDetail(item)" />
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
	import scoreCard from '../components/score-card/index.vue'
	import lineCharts from '../components/line-charts/index.vue'
	import studentCard from '../components/student-card/index.vue'
	import {
		dateFormat,
		computeNumber,
		dealPersent,
		dealNumber
	} from '@/common/util.js'
	import ClassUtil from '@/common/utility/ClassUtil.js';
	export default {
		components: {
			scoreCard,
			lineCharts,
			studentCard
		},
		data() {
			return {
				queryForm: {},
				runKilometers: '--', // 跑步公里
				runCount: '--', // 跑步人数
				completeRate: '--', // 目标完成率
				studentCount: 0,
				studentList: []
			}
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		onLoad(e) {
			this.queryForm = JSON.parse(decodeURIComponent(e.option))
			uni.setNavigationBarTitle({
				title: this.handleClassName(this.queryForm) // this.queryForm.className
			})
			this.runKilometers = dealNumber(computeNumber(this.queryForm.runKilometers, '/', 1000).result) || '0'
			this.runCount = this.queryForm.runCount || '0'
			this.completeRate = this.queryForm.completeRate ? `${dealPersent(this.queryForm.completeRate)}%` :
				'--'
			const lineParams = {
				startDate: this.queryForm.startDate,
				endDate: this.queryForm.endDate,
				sid: this.queryForm.sid,
				schoolId: this.xiaotiyunUser.teacher.schoolId,
				classId: this.queryForm.classId
			}
			this.$refs.chartRef.apiGetRunStatsTrend(1, [1, 2], lineParams)
		},
		onReady() {
			this.apiGetrunStatsStudentInfo()
		},
		methods: {
			apiGetrunStatsStudentInfo() {
				getReq(URL.runStatsStudentInfo, {
					schoolId: this.xiaotiyunUser.teacher.schoolId,
					classId: this.queryForm.classId,
					sid: this.queryForm.sid
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const {
							count,
							studentInfos
						} = res.data
						this.studentCount = count
						this.studentList = studentInfos
					} else {
						this.studentCount = 0
						this.studentList = []
					}
				}).catch(error => {
					this.studentCount = 0
					this.studentList = []
				})
			},
			onStudentDetail(data) {
				const params = {
					schoolId: this.xiaotiyunUser.teacher.schoolId,
					sid: this.queryForm.sid,
					studentId: data.studentId,
					startDate: this.queryForm.startDate,
					endDate: this.queryForm.endDate,
					studentName:data.nickName || data.name
				}
				this.$u.route({
					url: '/pagesCenter/sportCenter/runnStats/studentDetail/index',
					params: {
						option: encodeURIComponent(JSON.stringify(params))
					}
				})
			},
			// 处理班级名称
			handleClassName(info) {
				if (info.aliasClassName) {
					let grade = '';
					if (info.grade) {
						grade = this.$t(ClassUtil.gradeNameI18n(info.grade));
					}
					// return grade + info.aliasClassName;
					return info.aliasClassName;
				} else {
					return info.className || '--';
				}
			},
		}
	}
</script>

<style>
</style>
