<template>
	<view class="u-padding-38 bg-white">
		<view class="block-content">
			<view @click="showCalendar = true">
				<view class="u-flex">
					<view class="u-flex-1 form-label">
						{{$t('task.correct.exportCorrectFile.startTime')}}
					</view>
					<view class="form-value">
						{{queryForm.startDate}}
					</view>
					<u-icon name="arrow-right" color="#202020" size="12" class="u-margin-left-20"></u-icon>
				</view>
				<view class="u-flex u-margin-top-20 u-margin-bottom-20">
					<view class="u-flex-1 form-label">
						{{$t('task.correct.exportCorrectFile.endTime')}}
					</view>
					<view class="form-value">
						{{queryForm.endDate}}
					</view>
					<u-icon name="arrow-right" color="#202020" size="12" class="u-margin-left-20"></u-icon>
				</view>
				<u-calendar v-model="showCalendar" mode="range" @change="handleDaterange"
					:max-date="getDateTimeStrByDate(0,-1)" :min-date="getDateTimeStrByMonth(-1, -6)"></u-calendar>
			</view>
			<u-subsection :list="dataTabList" :current="0" mode="subsection" active-color="#5C8FF7"
				inactive-color="#202020" :height="56" :bold="false" :fontSize="24" @change="bindDataTabChange" />
		</view>
		<view class="block-content" @click="showClasses = true">
			<view class="u-flex">
				<view class="u-flex-1 form-label">
					{{$t('task.correct.exportCorrectFile.chooseClass')}}
				</view>
				<view class="form-value">
					{{queryForm.className}}
				</view>
				<u-icon name="arrow-right" color="#202020" size="12" class="u-margin-left-20"></u-icon>
			</view>
			<u-select v-model="showClasses" mode="single-column" :list="classInfos" @confirm="handleClasses"></u-select>
		</view>
		<view class="block-content">
			<view class="form-label">
				{{$t('task.assign.assignReport.selectDataSheet')}}
			</view>
			<u-radio-group v-model="queryForm.fileType" :wrap="true">
				<u-radio v-for="item in fileTypeList" :key="item.value" :name="item.value">
					{{item.label}}
				</u-radio>
			</u-radio-group>
		</view>
		<u-button shape="square" type="primary" class="exprot-btn" @click="handleDownload">
			{{$t('task.correct.exportCorrectFile.exportText')}}
		</u-button>
	</view>
</template>

<script>
	import {
		getReq,
		postReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		getDateTimeStrByDate,
		getDateTimeStrByMonth,
		dateFormat,
		getWeekbyDate
	} from '@/common/util.js'
	import { downloadPreviewExcelFile } from "@/common/util.js";
	
	export default {
		data() {
			return {
				getDateTimeStrByDate,
				getDateTimeStrByMonth,
				queryForm: {
					classId: [],
					className: "",
					fileType: 1,
					startDate: getWeekbyDate(),
					endDate: dateFormat(new Date(), 'yyyy-MM-dd')
				},
				dataTabList: [{
						name: this.$t('task.assign.assignReport.lastWeek'),
						timer: getWeekbyDate()
					},
					{
						name: this.$t('task.assign.assignReport.lastMonth'),
						timer: getDateTimeStrByMonth(0, -1)
					},
					{
						name: this.$t('task.assign.assignReport.lastThreeMonths'),
						timer: getDateTimeStrByMonth(0, -3)
					},
					{
						name: this.$t('task.assign.assignReport.lastHalfYear'),
						timer: getDateTimeStrByMonth(0, -6)
					}
				],
				showCalendar: false,
				showClasses: false,
				classInfos: [],
				fileTypeList: [{
					label: this.$t('task.assign.assignReport.classassignmentData'),
					value: 1
				}, {
					label: this.$t('task.assign.assignReport.studentAssignmentData'),
					value: 2
				}, {
					label: this.$t('task.assign.assignReport.sportsData'),
					value: 3
				}, {
					label: this.$t('task.assign.assignReport.studentDailyAssignmentData'),
					value: 4
				}]
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('task.correct.exportCorrectFile.title')
			})
			this.getReportOverview([getWeekbyDate(), dateFormat(new Date(), 'yyyy-MM-dd')]);
		},
		methods: {
			// 
			async getReportOverview(datarange) {
				try {
					const result = await getReq(URL.reportOverview, {
						beginDate: datarange[0],
						endDate: datarange[1]
					})
					this.classInfos = []
					if (result.data && JSON.stringify(result.data) !== "{}" && result.data.classInfos && result.data
						.classInfos.length) {
						const allClassIds = []
						result.data.classInfos.forEach(item => {
							allClassIds.push(item.classId)
							this.classInfos.push({
								label: item.className,
								value: [item.classId]
							})
						})
						this.classInfos.unshift({
							label: "全部",
							value: allClassIds
						})
						this.queryForm.className = "全部"
						this.queryForm.classId = allClassIds
					}
				} catch (e) {
					this.classInfos = []
				}
			},
			bindDataTabChange(index) {
				this.queryForm.startDate = this.dataTabList[index].timer
				this.queryForm.endDate = dateFormat(new Date(), 'yyyy-MM-dd')
				this.getReportOverview([this.dataTabList[index].timer, dateFormat(new Date(), 'yyyy-MM-dd')])
			},
			handleDaterange(e) {
				this.queryForm.startDate = e.startDate
				this.queryForm.endDate = e.endDate
				this.getReportOverview([e.startDate, e.endDate])
			},
			handleClasses(e) {
				this.queryForm.className = e[0].label
				this.queryForm.classId = e[0].value
			},
			async handleDownload() {
				try {
					const {
						classId,
						className,
						...param
					} = this.queryForm
					if (!classId) {
						uni.hideToast();
						uni.showToast({
							duration: 2000,
							"icon": "none",
							"title": '请先选择班级',
						});
						return
					}
					const params = {
						...param,
						classIds: classId
					}
					const result = await postReq(URL.reportExport, params)
					console.log(result);
					if (result.data) {
						downloadPreviewExcelFile(result.data);
					} else {
						uni.hideToast();
						uni.showToast({
							duration: 2000,
							"icon": "none",
							"title": '暂无数据，请稍后再试。',
						});
					}
				} catch (e) {
					console.log(e, '////////postReq');
					uni.hideToast();
					uni.showToast({
						duration: 2000,
						"icon": "none",
						"title": '暂无数据，请稍后再试。',
					});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.bg-white {
		background-color: #fff;
	}

	.block-content {
		background: #F6F6F6;
		border-radius: 16rpx;
		padding: 20rpx;
	}

	.block-content:not(:last-child) {
		margin-bottom: 30rpx;
	}

	.form-label {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #202020;
	}

	.form-value {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #5C8FF7;
	}

	.exprot-btn {
		display: block;
		margin: 100rpx 0;
	}
</style>
