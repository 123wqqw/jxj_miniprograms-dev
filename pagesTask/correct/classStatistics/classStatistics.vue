<template>
	<view class="correct-class-container">
		<view class="correct-header">
			<x-week-date-calendar :showCorre="true" @selected-change="datechange" :checkedDate="dateTime"
				@export-file="goExportCorrectFile"></x-week-date-calendar>
		</view>
		<view class="class-content" v-show="!rest">
			<view class="statistics-charts u-margin-bottom-24">
				<!-- <view class="class-name">{{className}}</view> -->
				<view class="clock-charts">
					<l-echart ref="clockChart"></l-echart>
				</view>
			</view>
			<view class="u-flex u-col-top" style="width: 100%;"
				v-if="classStatisticsData.taskClockStudents && classStatisticsData.taskClockStudents.length">
				<view class="" style="width: 200rpx;">
					<u-table :th-style="{'background-color':'#fff','border-right':'none','font-size':'28rpx'}">
						<u-tr class="u-tr">
							<u-th class="u-th">
								<view class="u-flex u-row-center" @click="showScreenPopup = true">
									<text>{{$t('task.correct.classStatistics.screen')}}</text>
									<image :class="['screen-icon',{'screen-icon-rotate':showScreenPopup}]"
										src="../../static/images/correctTask/screen-icon.png" mode="aspectFill"></image>
								</view>
							</u-th>
						</u-tr>
						<u-tr class="u-tr" v-for="(item,index) in classStatisticsData.taskClockStudents" :key="index"
							@click.stop="goStudentTaskDetail(item)">
							<u-td class="u-td">
								<view class="u-line-2">
									{{index + 1}}
								</view>
							</u-td>
						</u-tr>
					</u-table>
				</view>
				<scroll-view scroll-x="true" style="width: 550rpx;">
					<view style="width: 1000rpx;">
						<u-table :th-style="{'background-color':'#fff','border-right':'none','font-size':'28rpx'}">
							<u-tr class="u-tr">
								<u-th class="u-th">
									<view class="">
										姓名
									</view>
								</u-th>
								<u-th class="u-th">
									<view class="u-flex u-row-center">
										<text>班级学号</text>
										<sort-icon @handle-sort="handleSortNo" />
									</view>
								</u-th>
								<u-th class="u-th">
									<view class="">
										完成情况
									</view>
								</u-th>
								<u-th class="u-th">
									<view class="">
										{{$t('task.correct.classStatistics.standardGroupNum')}}
									</view>
								</u-th>
								<u-th class="u-th">
									<view class="">
										批改{{$t('task.correct.classStatistics.status')}}
									</view>
								</u-th>
							</u-tr>
							<u-tr class="u-tr"  v-for="(item,index) in classStatisticsData.taskClockStudents"
								:key="index">
								<u-td class="u-td" >
									<view class="u-line-2" @click.stop="goStudentTaskDetail(item)">
										{{item.name}}
									</view>
								</u-td>
								<u-td class="u-td">
									<view class="u-line-2" @click.stop="goStudentTaskDetail(item)">
										{{item.classCampusid || ""}}
									</view>
								</u-td>
								<u-td class="u-td">
									<view class="u-line-2" @click.stop="goStudentTaskDetail(item)">
										{{item.isApproval ? "请假待审批":item.askLeave ? $t('task.correct.index.askLeave') : `${item.completeCount}/${item.totalCount}${item.clockType ? `（${$t('task.correct.classStatistics.makeUpClock')}）` : "" }`}}
									</view>
								</u-td>
								<u-td class="u-td">
									<view class="u-line-2" @click.stop="goStudentTaskDetail(item)">
										{{item.isApproval || item.askLeave ? "--" : `${item.standardGroup || 0}/${item.totalGroup || 0}`}}
									</view>
								</u-td>
								<u-td class="u-td">
									<view :class="['u-line-2',{'uncorrect':item.checkStatus == 0}]" @click.stop="goStudentTaskDetail(item)">
										{{formatCheckStatusStr(item.checkStatus)}}
									</view>
								</u-td>
							</u-tr>
						</u-table>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="empty-action-content" v-show="rest">
			<view class="unclock-content">
				<image src="../../static/images/today-rest.png" mode="aspectFill" />
				<label>今日休息！</label>
			</view>
		</view>

		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom">
			<view class="btn-content">
				<button class="action-btn" type="primary" hover-class="active" @click="goShowModal">
					{{$t('task.correct.index.enterTaskWarning')}}
				</button>
				<button :class="['action-btn',{'action-btn-big':!classStatisticsData.showButton}]" type="primary"
					hover-class="active" @click="goBatchCorrectTask">
					{{$t('task.correct.index.batchCorrectTask')}}
				</button>
			</view>
		</view>
		<u-popup v-model="showScreenPopup" mode="bottom" :safe-area-inset-bottom="true" :height="876" :closeable="true"
			@close="cancelScreenPopup">
			<view class="popup-content">
				<view class="title">{{$t('task.correct.classStatistics.screen')}}</view>
				<view class="screen-info">
					<view class="screen-li">
						<view class="li-title">完成情况</view>
						<view class="li-info">
							<view :class="['li-item',{'li-item--checked':finishedStatus==-1}]"
								@click="finishedStatus = -1">全部</view>
							<view :class="['li-item',{'li-item--checked':finishedStatus==0}]"
								@click="finishedStatus = 0">未完成</view>
							<view :class="['li-item',{'li-item--checked':finishedStatus==1}]"
								@click="finishedStatus = 1">已完成</view>
							<view :class="['li-item',{'li-item--checked':finishedStatus==2}]"
								@click="finishedStatus = 2">{{$t('common.forLeave')}}</view>
						</view>
					</view>
					<view class="screen-li">
						<view class="li-title">批改情况</view>
						<view class="li-info">
							<view :class="['li-item',{'li-item--checked':correctStatus==-1}]"
								@click="correctStatus = -1">全部</view>
							<view :class="['li-item',{'li-item--checked':correctStatus==1}]" @click="correctStatus = 1">
								已批改</view>
							<view :class="['li-item',{'li-item--checked':correctStatus==0}]" @click="correctStatus = 0">
								未批改</view>
						</view>
					</view>
					<view class="screen-li">
						<view class="li-title">性别</view>
						<view class="li-info">
							<view :class="['li-item',{'li-item--checked':sexStatus==-1}]" @click="sexStatus = -1">全部
							</view>
							<view :class="['li-item',{'li-item--checked':sexStatus==1}]" @click="sexStatus = 1">男</view>
							<view :class="['li-item',{'li-item--checked':sexStatus==0}]" @click="sexStatus = 0">女</view>
						</view>
					</view>
				</view>
				<view class="screnn-btn">
					<view class="action-btn" @click="resetScreenSubmit">重置</view>
					<view class="action-btn action-btn--confirm" @click="enterScreenSubmit">{{$t('common.enter')}}
					</view>
				</view>
			</view>
		</u-popup>

		<u-modal show-cancel-button :show-title="false" v-model="modalShow" :content="modalText"
			@confirm="commitClockStudent"></u-modal>
	</view>
</template>

<script>
	import {
		getReq,
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import xWeekDateCalendar from "../../components/x-week-date-calendar/x-week-date-calendar.vue";
	import {
		formatDate
	} from "../../components/x-week-date-calendar/generateDates.js";
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	import sortIcon from '../../components/sort-icon/index.vue'
	export default {
		components: {
			xWeekDateCalendar,
			sortIcon
		},
		data() {
			return {
				showScreenPopup: false,
				modalShow: false, // 显示提醒警告弹窗
				modalText: "",
				type: -1,
				checkStatus: -1,
				gender: -1,
				finishedStatus: -1,
				correctStatus: -1,
				sexStatus: -1,
				rest: false,
				className: "",
				classId: "",
				dateTime: "",
				classStatisticsData: {
					askLeaveCount: 0,
					completeCount: 0,
					correctedCount: 0,
					incompleteCount: 0,
					showButton: false,
					taskClockClass: [],
					toBeCorrectedCount: 0,
					totalCount: 0,
				},
				isRefresh: false,

				// 国际化
				forLeave: this.$t('common.forLeave'),
				student: this.$t('common.student'),
			}
		},
		onLoad(options) {
			let _this = this;
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('classStatistics', res => {
				// type 为-1 就是点击班级过来，为0就是点击未完成学生头像过来的
				_this.className = res.className;
				_this.classId = res.classId;
				_this.type = res.type;
				_this.finishedStatus = res.type;
				if (res.selectedDate) {
					_this.dateTime = res.selectedDate;
				} else {
					_this.dateTime = formatDate(new Date(), 'yyyy-MM-dd');
				}
				_this.rest = res.rest;
				// 动态设置标题
				uni.setNavigationBarTitle({
					title: res.aliasClassName ? res.aliasClassName : res.className
				})
				_this.initPageFun();
			})
		},
		onShow() {
			if (this.isRefresh) {
				this.isRefresh = false;
				this.initPageFun();
			}
		},
		onHide() {
			this.isRefresh = true;
		},
		methods: {
			initPageFun() {
				let _this = this;
				let params = {
					classId: _this.classId,
					dateTime: _this.dateTime
				}
				if (_this.type > -1) {
					params.type = _this.type
				}
				if (_this.checkStatus > -1) {
					params.checkStatus = _this.checkStatus
				}
				if (_this.gender > -1) {
					params.gender = _this.gender
				}
				getReq(URL.classClockStatistics, params).then(res => {
					if (res.error == 10000) {
						_this.classStatisticsData = res.data
						_this.rest = res.data.rest;
						if (!res.data.rest) {
							_this.initClassStatisticsCharts();
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			initClassStatisticsCharts() {
				let _this = this;
				let correctData = _this.classStatisticsData;
				let option = {
					tooltip: {
						confine: true,
						trigger: "item"
					},
					legend: {
						orient: 'vertical',
						top: "center",
						right: "5%",
						icon: "circle",
						itemWidth: 6,
						itemHeight: 6,
						textStyle: {
							fontSize: 13,
							color: "#707070"
						},
						formatter: function(name) {
							var legendStr = "";
							if (name == "已批改") {
								legendStr =
									`已批改  ${correctData.correctedCount}人  (${correctData.correctedCount == 0? 0:parseFloat(((correctData.correctedCount*100)/correctData.totalCount).toFixed(2))}%)`
							}
							if (name == "待批改") {
								legendStr =
									`待批改  ${correctData.toBeCorrectedCount}人  (${correctData.toBeCorrectedCount == 0? 0:parseFloat(((correctData.toBeCorrectedCount*100)/correctData.totalCount).toFixed(2))}%)`
							}
							if (name == "未提交") {
								legendStr =
									`未提交  ${correctData.unCommittedCount}人  (${correctData.unCommittedCount == 0? 0:parseFloat(((correctData.unCommittedCount*100)/correctData.totalCount).toFixed(2))}%)`
							}
							if (name == _this.forLeave) {
								legendStr =
									`${_this.forLeave}  ${correctData.askLeaveCount}人  (${correctData.askLeaveCount == 0? 0:parseFloat(((correctData.askLeaveCount*100)/correctData.totalCount).toFixed(2))}%)`
							}
							return legendStr;
						}
					},
					title: {
						text: correctData.totalCount,
						top: "center",
						left: "20%",
						subtext: correctData.aliasClassName ? correctData.aliasClassName : correctData.className,
						itemGap: 5,
						textStyle: {
							color: "#202020",
							fontSize: 15
						},
						subtextStyle: {
							color: "#464646",
							fontSize: 12
						},
						textAlign: "center"
					},
					color: [
						"#FF7A86",
						"#5C8FF7",
						"#FF9F52",
						"#FFE660"
					],
					series: [{
						name: correctData.className,
						type: "pie",
						radius: ["65%", "85%"],
						center: ["21%", "50%"],
						itemStyle: {
							borderRadius: 0
						},
						label: {
							show: false
						},
						data: [{
								value: correctData.correctedCount,
								name: "已批改",
								label: {
									color: "#FF7A86"
								},
								color: "#FF7A86"
							},
							{
								value: correctData.toBeCorrectedCount,
								name: "待批改",
								label: {
									color: "#5C8FF7"
								},
								color: "#5C8FF7"
							},
							{
								value: correctData.unCommittedCount,
								name: "未提交",
								label: {
									color: "#FF9F52"
								},
								color: "#FF9F52"
							},
							{
								value: correctData.askLeaveCount,
								name: _this.forLeave,
								label: {
									color: "#05eca7"
								},
								color: "#05eca7"
							}
						]
					}]
				}
				setTimeout(() => {
					_this.$refs.clockChart.init(config => {
						const {
							canvas
						} = config;
						const chart = echarts.init(canvas, null, config);

						chart.setOption(option);
						return chart;
					})
				}, 200)
			},
			// 显示提醒警告弹窗
			goShowModal() {
				let _this = this;
				_this.modalText = `是否提醒${_this.className}所有未打卡${_this.student}去打卡？`
				_this.modalShow = true;
			},
			// 作业提醒
			commitClockStudent() {
				let _this = this;
				this.modalShow = false;
				let params = {
					classId: _this.classId,
					remindDate: _this.dateTime
				};
				postReq(URL.clockRemindV2, params).then(res => {
					if (res.error == 10000) {
						uni.showToast({
							icon: 'none',
							title: '提醒成功！',
							duration: 1000
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			// 关闭筛选弹窗之前 恢复选择按钮状态
			cancelScreenPopup() {
				let _this = this;
				_this.finishedStatus = _this.type;
				_this.correctStatus = _this.checkStatus;
				_this.sexStatus = _this.gender;
			},
			// 确认筛选按钮
			enterScreenSubmit() {
				let _this = this;
				_this.type = _this.finishedStatus;
				_this.checkStatus = _this.correctStatus;
				_this.gender = _this.sexStatus;
				_this.initPageFun();
				_this.showScreenPopup = false;
			},
			// 重置筛选按钮
			resetScreenSubmit() {
				let _this = this;
				_this.type = -1;
				_this.checkStatus = -1;
				_this.gender = -1;
				_this.initPageFun();
				_this.showScreenPopup = false;
			},
			datechange(e) {
				this.dateTime = e.fullDate;
				this.initPageFun();
			},
			goExportCorrectFile() {
				let exportFileParams = {
					startTime: this.dateTime,
					classId: this.classId
				}
				uni.navigateTo({
					url: "../exportCorrectFile/exportCorrectFile",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('exportFile', exportFileParams)
					}
				})
			},
			// 去批量批改作业
			goBatchCorrectTask() {
				let params = {
					classId: this.classId
				}
				uni.navigateTo({
					url: "../batchCorrectTask/batchCorrectTask",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			// 去学生作业详情页面
			goStudentTaskDetail(item) {
				const data = {
					studentId: item.studentId,
					studentIds: this.classStatisticsData.taskClockStudents.map(std => {
						return std.studentId
					}),
					selectedDate: this.dateTime,
					classManageType: this.classStatisticsData.classManageType,
					checkStatus: item.checkStatus
				}
				uni.navigateTo({
					url: "../studentTaskDetail/studentTaskDetail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', data)
					}
				})
			},
			// 批改状态
			formatCheckStatusStr(checkStatus) {
				let checkStatusStr = "--";
				switch (checkStatus) {
					case 0:
						checkStatusStr = "未批改";
						break;
					case 1:
						checkStatusStr = "已批改";
						break;
				}
				return checkStatusStr;
			},
			// 班级学号排序 将未填写班级学号的剥离放到list最后，对填写了的进行排序
			handleSortNo(value, sortName) {
				this.isSort = value
				const dataSource = this.$u.deepClone(this.classStatisticsData.taskClockStudents)
				let noCampusIDList = []
				let campusIDList = []
				dataSource.forEach(item => {
					if (item.classCampusid) {
						campusIDList.push(item)
					} else {
						noCampusIDList.push(item)
					}
				})
				if (sortName === "preface") {
					campusIDList.sort((a, b) => {
						return b.classCampusid - a.classCampusid
					})
				} else if (sortName === "reverse") {
					campusIDList.sort((a, b) => {
						return a.classCampusid - b.classCampusid
					})
				}
				this.classStatisticsData.taskClockStudents = [...campusIDList, ...noCampusIDList]
			},
		}
	}
</script>

<style lang="scss" scoped>
	.correct-class-container {
		width: 100%;
		position: relative;

		.correct-header {
			width: 100%;
		}

		.class-content {
			width: 100%;
			margin-top: 24rpx;
			padding-bottom: calc(152rpx + 24rpx);
			padding-bottom: calc(152rpx + 24rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(152rpx + 24rpx + env(safe-area-inset-bottom));

			.statistics-charts {
				width: 100%;
				padding: 32upx;
				background-color: #FFFFFF;

				.class-name {
					width: 100%;
					height: 50upx;
					line-height: 50upx;
					margin-bottom: 32upx;
					font-size: 36upx;
					font-weight: 600;
					color: #202020;
				}

				.clock-charts {
					width: 100%;
					height: 310upx;
				}
			}

			.statistics-list {
				width: 100%;
				// padding: 0 24upx;
				margin-top: 16upx;
				background-color: #FFFFFF;

				.list-title {
					width: 100%;
					height: 88upx;
					display: flex;
					justify-content: space-around;
					align-items: center;

					.td {
						font-size: 28upx;
						font-weight: bold;
						color: #202020;
						text-align: left;
						display: flex;
						align-items: center;
						padding: 8rpx 4rpx;

						.screen-icon {
							width: 14upx;
							height: 12upx;
							margin-left: 7upx;
							transition: all .3s ease-out;
						}

						.screen-icon-rotate {
							transform: rotate(180deg);
						}
					}

					.wd-flex {
						flex: 1;
						justify-content: center;
					}

					.wd-mini {
						width: 168upx;
					}

					.wd-middle {
						width: 225upx;
					}
				}

				.list-li {
					width: 100%;
					height: 88upx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					border-bottom: 1upx solid #E6E6E6;

					.td {
						font-size: 28upx;
						font-weight: 500;
						color: #202020;
						text-align: left;
						display: flex;
						align-items: center;
						padding: 8rpx 4rpx;

						.status-text {
							flex: 1;
							font-weight: 400;
							color: #707070;
						}

						.uncorrect {
							color: #FF7A86;
						}

						.arrow-img {
							width: 24upx;
							height: 24upx;
						}
					}

					.td-normal {
						font-weight: 400;
						color: #707070;

						label {
							color: #5C8FF7;
						}
					}

					.td-clamp {
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						word-break: break-all;
					}

					.wd-flex {
						flex: 1;
						justify-content: center;
					}

					.wd-mini {
						width: 168upx;
					}

					.wd-middle {
						width: 225upx;
					}
				}
			}
		}

		.empty-action-content {
			width: 100%;
			height: 702upx;
			margin: 0 auto;
			position: relative;

			.unclock-content {
				position: absolute;
				top: 50%;
				left: 50%;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				image {
					width: 147upx;
					height: 147upx;
				}

				label {
					font-size: 24upx;
					font-weight: 400;
					color: #B2B2B2;
					margin-top: 24upx;
				}
			}
		}

		.btn-box-content {
			width: 100%;
			display: block;
			// padding: 32upx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.default-content {
				height: 88upx;
				padding: 32rpx 0;
				box-sizing: content-box;

				.btn-content {
					width: 100%;
					height: 88upx;
				}
			}
		}

		.bottom-btn-box {
			background-color: #FFFFFF;
			box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			.btn-content {
				width: 100%;
				height: 88upx;
				padding: 32upx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: content-box;
			}

			.action-btn {
				width: 320upx;
				height: 88upx;
				background-color: #5C8FF7;
				border: none;
				border-radius: 44upx;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 88upx;
			}

			.action-btn-big {
				width: 638upx;
				margin: 0 auto;
			}

			.active {
				background-color: #5276f7;
			}
		}
	}

	.popup-content {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.title {
			width: 100%;
			height: 86upx;
			line-height: 86upx;
			font-size: 32upx;
			font-weight: 400;
			color: #464646;
			text-align: center;
		}

		.screen-info {
			width: 100%;
			flex: 1;

			.screen-li {
				width: 100%;
				margin-top: 20upx;

				.li-title {
					width: 100%;
					height: 40upx;
					line-height: 40upx;
					padding: 0 32upx;
					font-size: 28upx;
					font-weight: 500;
					color: #202020;
					margin-bottom: 12upx;
				}

				.li-info {
					width: 100%;
					padding: 0 16upx;
					display: flex;
					flex-wrap: wrap;

					.li-item {
						width: calc(100%/3 - 32upx);
						height: 70upx;
						border-radius: 35upx;
						line-height: 70upx;
						text-align: center;
						margin: 12upx 16upx;
						background-color: #F5F5F5;
						font-size: 28upx;
						font-weight: 400;
						color: #464646;
					}

					.li-item--checked {
						background-color: #5C8FF7;
						color: #FFFFFF;
					}
				}
			}
		}

		.screnn-btn {
			width: 100%;
			height: 86upx;
			display: flex;
			border-top: 2upx solid #E6E6E6;

			.action-btn {
				flex: 1;
				height: 100%;
				line-height: 86upx;
				text-align: center;
				background-color: #FFFFFF;
				color: #5C8FF7;
				font-size: 32upx;
				font-weight: 600;
			}

			.action-btn--confirm {
				background-color: #5C8FF7;
				color: #FFFFFF;
			}
		}
	}

	.u-td {
		height: 110rpx;
	}

	.screen-icon {
		width: 14rpx;
		height: 14rpx;
		margin-left: 8rpx;
		transition: all .3s ease-out;
	}

	.screen-icon-rotate {
		transform: rotate(180deg);
	}

	.uncorrect {
		color: #FF7A86;
	}
</style>