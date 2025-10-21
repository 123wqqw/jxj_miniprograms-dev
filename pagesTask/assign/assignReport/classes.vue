<template>
	<view class="classes">
		<view class="classes-header">
			<view class="classes-header-name">
				{{classInfos.aliasClassName ? classInfos.aliasClassName : classInfos.className}}
			</view>
			<view class="classes-header-content">
				<view class="u-flex">
					<view class="u-line-1">{{classInfos.inviteCode}}</view>
					<view class="classes-icon" v-if="classInfos.classManageType === 2">协</view>
				</view>
				<view class="u-line-1">学生:{{classInfos.studentCount}}名 (男{{classInfos.boyCount}} ;
					女{{classInfos.girlCount}})</view>
			</view>
		</view>
		<view class="u-margin-bottom-46">
			<u-subsection :list="dataTabList" :current="current" mode="subsection" active-color="#5C8FF7"
				inactive-color="#202020" :height="56" :bold="false" :fontSize="24" @change="bindDataTabChange" />
		</view>
		<view class="classes-row">
			<view class="classes-col">
				<view class="classes-col-title">
					布置天数
				</view>
				<view class="classes-col-text">
					{{jobList.assignDays}}
				</view>
			</view>
			<view class="classes-col">
				<view class="classes-col-title">
					作业完成率
				</view>
				<view class="classes-col-text">
					{{jobList.completeRate}}
				</view>
			</view>
		</view>
		<line-chart :dataSource="chartData"></line-chart>
		<view class="classes-rank">
			<view class="classes-rank-title">
				班级学生完成排名
			</view>
			<template v-if="tableData && tableData.length">
				<u-table :font-size="24" padding="30rpx 0"
					:th-style="{height:'100%',background: '#5C8FF715',border:'none'}">
					<u-tr class="u-tr">
						<u-th class="u-th">姓名</u-th>
						<u-th class="u-th">
							<sortIcon label="classCampusid" @change="handleSort">
								<view style="width: 48rpx;">班级学号</view>
							</sortIcon>
						</u-th>
						<u-th class="u-th">
							<sortIcon label="completeDays" @change="handleSort">
								<view style="width: 48rpx;">完成天数</view>
							</sortIcon>
						</u-th>
						<u-th class="u-th">
							<sortIcon label="sportDuration" @change="handleSort">
								<view style="width: 72rpx;">总作业时长</view>
							</sortIcon>
						</u-th>
						<u-th class="u-th">
							<sortIcon label="averageSportDuration" @change="handleSort">
								<view style="width: 72rpx;">日均作业时长</view>
							</sortIcon>
						</u-th>
					</u-tr>
					<block v-for="item in tableData" :key="item.studentId">
						<view @click="jumpPageStudents(item)">
							<u-tr class="u-tr">
								<u-td class="u-td">
									<view style="height: 36rpx;line-height: 36rpx;">{{item.studentName}}</view>
								</u-td>
								<u-td class="u-td">
									<view style="height: 36rpx;line-height: 36rpx;">{{item.classCampusid}}</view>
								</u-td>
								<u-td class="u-td">
									<view style="height: 36rpx;line-height: 36rpx;">
										{{item.completeDays}}/{{item.taskDays}}
									</view>
								</u-td>
								<u-td class="u-td">
									<view style="height: 36rpx;line-height: 36rpx;">{{item.sportDuration}}分钟</view>
								</u-td>
								<u-td class="u-td">
									<view style="height: 36rpx;line-height: 36rpx;">{{item.averageSportDuration}}分钟
									</view>
								</u-td>
							</u-tr>
						</view>
					</block>
				</u-table>
			</template>
			<template v-else>
				<u-empty src="/static/md_icon_empty1.png" text="暂无数据" :font-size="24" color="#B2B2B2" :icon-size="250"
					:marginTop="140">
				</u-empty>
			</template>
		</view>
	</view>
</template>

<script>
	import lineChart from './lineChart.vue'
	import sortIcon from './sortIcon.vue'
	import {
		dateFormat,
		dealPersent,
		dealNumber
	} from '@/common/util.js'
	import {
		getReq
	} from "@/common/request.js";
	import {
		USERCENTER
	} from '@/common/request.js'
	export default {
		components: {
			lineChart,
			sortIcon
		},
		data() {
			return {
				classId: "",
				classInfos: {
					className: "",
					aliasClassName: "",
					inviteCode: "",
					classManageType: 1,
					studentCount: 0,
					girlCount: 0,
					boyCount: 0,
				},
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
				jobList: {
					assignDays: 0,
					completeRate: `0%`
				},
				chartData: {
					xData: [],
					series: [{
						data: []
					}, {
						data: []
					}]
				},
				tableData: []
			}
		},
		onLoad(e) {
			this.classId = e.classId
			this.current = Number(e.current)
		},
		onReady() {
			this.bindDataTabChange(this.current)
		},
		methods: {
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
				this.getReportClassOverview([preday, today])
			},
			getReportClassOverview(daterange) {
				getReq('/xty-task/app-api/task/report/v2/class/overview', {
					classId: this.classId,
					beginDate: daterange[0],
					endDate: daterange[1]
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const dataSource = this.$u.deepClone(res.data);
						this.classInfos = {
							className: dataSource.className, // 班级名称
							aliasClassName: dataSource.aliasClassName, // 班级别名
							inviteCode: dataSource.inviteCode, // 班级id
							classManageType: dataSource.classManageType, // 班级管理类型（1.主管；2.协管）
							studentCount: dataSource.studentCount, // 总学生数
							girlCount: dataSource.girlCount, // 女生人数
							boyCount: dataSource.boyCount // 男生人数
						}
						this.jobList = {
							assignDays: dataSource.assignDays,
							completeRate: `${dealPersent(dataSource.completeRate)}%`
						}
						let chartData = {
							xData: [],
							series: [{
								data: []
							}, {
								data: []
							}]
						}
						if (dataSource.dayInfos && dataSource.dayInfos.length) {
							dataSource.dayInfos.forEach(item => {
								chartData.xData.push(dateFormat(new Date(item.day), 'MM/dd'))
								chartData.series[0].data.push(isNaN(item.classCompleteRate) ? 0 :
									dealNumber(item.classCompleteRate * 60))
								chartData.series[1].data.push(isNaN(item.gradeCompleteRate) ? 0 :
									dealNumber(item.gradeCompleteRate * 60))
							})
						}
						this.chartData = chartData
						if (dataSource.studentInfos && dataSource.studentInfos.length) {
							this.tableData = dataSource.studentInfos.map(item => ({
								...item,
								classCampusid: item.classCampusid || "",
								sportDuration: isFinite(item.sportDuration) ? dealNumber(item
									.sportDuration) : 0,
								averageSportDuration: isFinite(item.averageSportDuration) ? dealNumber(
									item.averageSportDuration) : 0,
							}))
						} else {
							this.tableData = []
						}
					} else {
						this.classInfos = {
							className: "",
							inviteCode: "",
							classManageType: 1,
							studentCount: 0,
							girlCount: 0,
							boyCount: 0,
						}
						this.jobList = {
							assignDays: 0,
							completeRate: `0%`
						}
						this.chartData = {
							xData: [],
							series: [{
								data: []
							}, {
								data: []
							}]
						}
						this.tableData = []
					}
				}).catch(() => {
					this.classInfos = {
						className: "",
						inviteCode: "",
						classManageType: 1,
						studentCount: 0,
						girlCount: 0,
						boyCount: 0,
					}
					this.jobList = {
						assignDays: 0,
						completeRate: `0%`
					}
					this.chartData = {
						xData: [],
						series: [{
							data: []
						}, {
							data: []
						}]
					}
					this.tableData = []
				})
			},
			handleSort({
				label,
				type
			}) {
				if (type === 'preface') {
					this.tableData.sort((pre, next) => {
						return next[label] - pre[label]
					})
				} else {
					this.tableData.sort((pre, next) => {
						return pre[label] - next[label]
					})
				}
			},
			jumpPageStudents(item) {
				let nodeEnv = 'dev'
				if (USERCENTER.includes('test')) {
					nodeEnv = 'dev'
				} else if (USERCENTER.includes('test')) {
					nodeEnv = 'pre'
				} else {
					nodeEnv = 'prod'
				}
				const xiaotiyunUser = uni.getStorageSync('xiaotiyunUser'); // 用户信息
				const option = {
					nodeEnv,
					uid: xiaotiyunUser.teacher.teacherId,
					token: xiaotiyunUser.teacher.token,
					loginType: "teacher",
					studentId: item.studentId,
				}
				const baseUrl = process.env.NODE_ENV === 'development' ? "http://h5.gxapp.iydsj.com" :
					"https://h5.gxapp.iydsj.com"
				const params = {
					linkUrl: `${baseUrl}/gxapp/studentAssignReport/index.html#/?option=${encodeURIComponent(JSON.stringify(option))}`,
				};
				uni.navigateTo({
					url: '/pages/webView/index/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.classes {
		width: 100%;
		min-height: 100vh;
		background-color: #fff;
		padding: 30rpx;
		padding-bottom: 30rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));

		&-header {
			display: flex;
			align-items: center;
			height: 90rpx;
			margin-bottom: 46rpx;

			&-name {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 90rpx;
				text-align: center;
				color: #FFFFFF;
				border-radius: 12rpx;
				background: #5C8FF7;
				padding: 24rpx 10rpx;
				margin-right: 30rpx;
			}

			&-content {
				flex: 1;
				width: 0;
				height: 90rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				font-size: 28rpx;
				line-height: 40rpx;
				font-weight: 500;
				color: #202020;
			}

			.classes-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				background: #4A91FF;
				color: #FFFFFF;
				margin-left: 8rpx;
				font-size: 24rpx;
			}
		}

		&-row {
			display: flex;
			justify-content: space-between;
			margin-bottom: 46rpx;
		}

		&-col {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			height: 190rpx;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 13rpx 0rpx rgba(243, 243, 243, 0.5);
			border-radius: 26rpx;
			border: 1rpx solid #F7F7F7;
			padding: 36rpx 0;
			font-size: 36rpx;
			font-weight: 600;
			line-height: 50rpx;

			&-title {
				position: relative;
				color: #858585;
			}

			&-title::before {
				content: "";
				position: absolute;
				left: -24rpx;
				top: 0;
				width: 8rpx;
				height: 100%;
				background-color: #4A91FF;
				border-radius: 6rpx;
			}

			&-text {
				color: #4A91FF;
			}
		}

		&-col+&-col {
			margin-left: 42rpx;
		}

		&-rank-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #202020;
			line-height: 40rpx;
			margin-bottom: 36rpx;
		}
	}

	.sorticon {
		width: 12rpx;
		height: 12rpx;
		background: #BACFFF;
		margin-left: 4rpx;
	}
</style>
