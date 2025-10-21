<template>
	<view class="correct-container">
		<view class="correct-header">
			<x-week-date-calendar :showCorre="true" @selected-change="datechange" :showRightIcon="false">
			</x-week-date-calendar>
		</view>
		<view v-if="isEmpty" class="empty">
			<image src="../../static/images/md_empty.png" mode="widthFix"></image>
			<view>
				暂未布置作业
			</view>
		</view>
		<view class="correct-content" v-else>
			<view class="correct-overview">
				<view class="overview-title" @click="showWarningDialog = true">
					<view class="title-text">{{$t('task.correct.index.totalView')}}</view>
					<image class="help-icon" src="../../static/images/correctTask/help.png" mode="aspectFill"></image>
				</view>
				<view class="overview-content">
					<view class="overview-li">
						<view class="li-top">
							{{correctData.completeCount}}/{{correctData.completeCount+correctData.incompleteCount}}
						</view>
						<view class="li-bottom">完成情况</view>
					</view>
					<view class="overview-li">
						<view class="li-top">
							{{correctData.completeCount == 0? 0 : ((correctData.completeCount*100)/(correctData.completeCount+correctData.incompleteCount)).toFixed(2)}}%
						</view>
						<view class="li-bottom">完成率</view>
						<view class="line"></view>
					</view>
					<view class="overview-li">
						<view class="li-top">
							{{correctData.correctedCount}}/{{correctData.correctedCount+correctData.toBeCorrectedCount}}
						</view>
						<view class="li-bottom">批改情况</view>
						<view class="line"></view>
					</view>
					<view class="overview-li">
						<view class="li-top">{{correctData.askLeaveCount}}</view>
						<view class="li-bottom">{{$t('task.correct.index.askLeaveNum')}}</view>
						<view class="line"></view>
					</view>
				</view>
			</view>
			<view class="class-content">
				<view class="class-li" v-for="(item,index) in taskClockClass" :key="index">
					<view class="li-top" @click="goClassStatistics(-1,item)">
						<view class="left">
							<view class="basic-info">
								<view class="class-name">
									{{item.aliasClassName ? item.aliasClassName : item.className}}
									<view class="help-icon" v-if="item.classManageType == 2">{{$t('common.help')}}
									</view>
								</view>
								<view class="warning-info">
									<label v-if="!item.rest">{{item.toBeCorrectedCount}}人待批改</label>
									<label
										v-if="!item.rest">{{item.askLeaveCount}}人{{$t('task.correct.index.askLeave')}}</label>
									<view class="rest" v-if="item.rest">今日休息</view>
								</view>
							</view>
							<view class="progress">
								<view class="active-line"
									:style="{width:item.rest?100 + '%':((item.completeCount*100)/(item.completeCount+item.incompleteCount)).toFixed(2) + '%'}">
								</view>
							</view>
						</view>
						<view class="right">
							<image class="arrow-img" src="../../static/images/correctTask/arrow-black.png"
								mode="aspectFill"></image>
						</view>
					</view>
					<view class="li-bottom">
						<view class="finished-info">完成情况：
							<view class="text" v-if="!item.rest">
								<label>{{item.completeCount}}</label>/{{(item.completeCount+item.incompleteCount)}}（{{((item.completeCount*100)/(item.completeCount+item.incompleteCount)).toFixed(2)}}%）
							</view>
							<view class="text" v-else><label>- -</label></view>
						</view>
						<view class="unfinished-info" @click="goClassStatistics(0,item)"
							v-if="item.unCompleteStudents.length>0 && !item.rest">
							<view class="text">未完成</view>
							<view class="avatar-list">
								<view class="avatar-img" v-for="(std,sindex) in item.unCompleteStudents" :key="sindex"
									v-if="sindex<10">
									<image class="avatar" :src="std.avatar" mode="aspectFill"></image>
								</view>
								<view class="avatar-img" v-if="item.unCompleteStudents.length>10">···</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box-content safe-area-inset-bottom" v-if="correctData.showButton || hasManageClassStatus">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom"
			v-if="!isEmpty && (correctData.showButton || hasManageClassStatus)">
			<view class="btn-content">
				<!-- <button :class="['action-btn',{'action-btn-big':!hasManageClassStatus}]" type="primary"
					hover-class="active" @click="modalShow = true"
					v-if="correctData.showButton">{{$t('task.correct.index.enterTaskWarning')}}</button> -->
				<button :class="['action-btn',{'action-btn-big':true}]" v-if="hasManageClassStatus"
					type="primary" hover-class="active"
					@click="goBatchCorrectTask">{{$t('task.correct.index.batchCorrectTask')}}</button>
			</view>
		</view>
		<u-modal v-model="showWarningDialog" :mask-close-able="true" width="74.7%" title="提示"
			:confirm-text="$t('common.enter')" confirm-color="#5C8FF7" :title-style="{fontSize: '34rpx'}"
			:content-style="{fontSize: '28rpx'}" :show-cancel-button="false" :confirm-style="{fontSize: '34rpx'}"
			border-radius="24">
			<view class="slot-content">
				<view class="text">1.{{$t('task.correct.index.modalWarning1')}}</view>
				<view class="text">2.{{$t('task.correct.index.modalWarning2')}}</view>
				<view class="text">3.{{$t('task.correct.index.modalWarning3')}}</view>
			</view>
		</u-modal>
		<u-modal show-cancel-button :show-title="false" v-model="modalShow" :content="modalText" @confirm="commitClock">
		</u-modal>
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
	import xWeekDateCalendar from "@/pagesTask/components/x-week-date-calendar/x-week-date-calendar.vue";
	import {
		formatDate
	} from "../../components/x-week-date-calendar/generateDates.js";
	export default {
		components: {
			xWeekDateCalendar
		},
		data() {
			return {
				showWarningDialog: false,
				selectedDate: formatDate(new Date(), 'yyyy-MM-dd'),
				correctData: {
					askLeaveCount: 0,
					completeCount: 0,
					correctedCount: 0,
					incompleteCount: 0,
					showButton: false,
					taskClockClass: [],
					toBeCorrectedCount: 0,
					totalCount: 0,
				},
				taskClockClass: [],
				modalShow: false,
				modalText: this.$t('task.correct.index.modalText'),
				hasManageClassStatus: false,
				isEmpty: true
			};
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('task.correct.index.title')
			})
		},
		onShow() {
			let _this = this;
			if (_this.isRefresh) {
				_this.getTaskClockStatistics(_this.selectedDate);
				_this.isRefresh = false;
			}
		},
		onHide() {
			this.isRefresh = true;
		},
		created() {
			this.getTaskClockStatistics(this.selectedDate);
		},
		onPullDownRefresh() {
			let _this = this;
			setTimeout(() => {
				_this.getTaskClockStatistics(_this.selectedDate);
				uni.stopPullDownRefresh();
			}, 0)
		},
		methods: {
			datechange(e) {
				this.selectedDate = e.fullDate;
				this.isEmpty = !e.show
				this.getTaskClockStatistics(e.fullDate);
			},
			// goExportCorrectFile() {
			// 	let exportFileParams = {
			// 		startTime: this.selectedDate,
			// 		classId: '',
			// 	}
			// 	uni.navigateTo({
			// 		url: "../exportCorrectFile/exportCorrectFile",
			// 		success: function(res) {
			// 			// 通过eventChannel向被打开页面传送数据
			// 			res.eventChannel.emit('exportFile', exportFileParams)
			// 		}
			// 	})
			// },
			getTaskClockStatistics(dateTime) {
				let params = {
					dateTime: dateTime
				}
				getReq(URL.taskClockStatistics, params).then(res => {
					if (res.error == 10000) {
						this.correctData = res.data;
						const dataSource = JSON.parse(JSON.stringify(res.data))
						if (dataSource.taskClockClass && dataSource.taskClockClass.length) {
							this.taskClockClass = dataSource.taskClockClass
							if (this.taskClockClass.length > 0) {
								this.hasManageClassStatus = true;
							}
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
			commitClock() {
				let _this = this;
				_this.modalShow = false;
				let params = {
					remindDate: this.selectedDate
				}
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
			// 去批量批改作业
			goBatchCorrectTask() {
				uni.navigateTo({
					url: "../batchCorrectTask/batchCorrectTask"
				})
			},
			// 去班级统计页面 1：班级全部人；2：未完成人群
			goClassStatistics(type, item) {
				let classStatisticsParams = {
					className: item.className,
					aliasClassName: item.aliasClassName,
					classId: item.classId,
					type: type,
					selectedDate: this.selectedDate,
					rest: item.rest
				}
				uni.navigateTo({
					url: "../classStatistics/classStatistics",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('classStatistics', classStatisticsParams)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.correct-container {
		width: 100%;
		position: relative;
	}

	.correct-header {
		width: 100%;
	}

	.correct-content {
		width: 100%;
		padding-bottom: 32rpx;

		.correct-overview {
			width: 100%;
			padding: 32upx 0;
			margin-top: 16upx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;

			.overview-title {
				width: 100%;
				padding: 0 32upx;
				display: flex;
				align-items: center;

				.title-text {
					font-size: 40upx;
					font-weight: 500;
					color: #202020;
				}

				.help-icon {
					width: 30upx;
					height: 30upx;
					margin-left: 10upx;
				}
			}

			.overview-content {
				width: 100%;
				display: flex;
				margin-top: 20upx;

				.overview-li {
					flex: 1;
					display: flex;
					flex-direction: column;
					position: relative;

					.li-top {
						font-size: 40upx;
						font-weight: 600;
						color: #464646;
						text-align: center;
						height: 56upx;
						line-height: 56upx;
					}

					.li-bottom {
						font-size: 26upx;
						font-weight: 400;
						color: #707070;
						text-align: center;
					}

					.line {
						position: absolute;
						width: 2upx;
						height: 60upx;
						background-color: #D8D8D8;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.class-content {
			width: 100%;
			margin-top: 16upx;
			padding: 0 32upx;
			background-color: #FFFFFF;

			.class-li {
				width: 100%;
				padding-bottom: 32upx;
				// border-bottom: 2upx solid #E6E6E6;
				margin-bottom: 16upx;
				display: flex;
				flex-direction: column;

				.li-top {
					width: 100%;
					height: 106upx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						flex: 1;
						height: 100%;
						display: flex;
						flex-direction: column;

						.basic-info {
							width: 100%;
							height: 88upx;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.class-name {
								font-size: 32upx;
								font-weight: 600;
								color: #202020;
								display: flex;
								align-items: center;
							}

							.help-icon {
								width: 34upx;
								height: 34upx;
								border-radius: 50%;
								font-size: 24upx;
								color: #FFFFFF;
								line-height: 34upx;
								text-align: center;
								background-color: #464646;
								margin-left: 16upx;
							}

							.warning-info {
								font-size: 28upx;
								font-weight: 400;
								color: #707070;
								display: inline-block;

								label {
									color: #5C8FF7;
									margin-left: 16upx;
								}
							}
						}

						.progress {
							width: 100%;
							height: 9upx;
							background-color: #F2F2F2;
							border-radius: 4.5upx;
							position: relative;
							overflow: hidden;

							.active-line {
								height: 100%;
								border-radius: 4.5upx;
								position: absolute;
								left: 0;
								top: 0;
								background-color: #5C8FF7;
							}
						}
					}

					.right {
						width: 48upx;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-end;

						.arrow-img {
							width: 17upx;
							height: 33upx;
						}
					}
				}

				.li-bottom {
					width: 100%;
					display: flex;
					flex-direction: column;
					margin-top: 8upx;

					.finished-info {
						width: 100%;
						height: 40upx;
						line-height: 40upx;
						font-size: 28upx;
						font-weight: 400;
						color: #464646;
						display: flex;

						label {
							color: #5C8FF7;
						}
					}

					.unfinished-info {
						width: 100%;
						margin-top: 16upx;
						display: flex;
						flex-direction: column;

						.text {
							font-size: 24upx;
							font-weight: 400;
							color: #707070;
						}

						.avatar-list {
							width: 100%;
							margin-top: 8upx;
							display: flex;

							.avatar-img {
								width: 56upx;
								height: 56upx;
								margin-right: 7upx;
								border-radius: 50%;
								border: 2upx solid #E6E6E6;
								display: flex;
								align-items: center;
								justify-content: center;

								.avatar {
									width: 100%;
									height: 100%;
									border-radius: 50%;
								}
							}
						}
					}
				}
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

	.slot-content {
		padding: 32upx;

		.text {
			font-size: 28upx;
			font-weight: 400;
			color: #333333;
			line-height: 40upx;
			text-align: center;
		}
	}

	.empty {
		text-align: center;
		margin-top: 200rpx;

		image {
			width: 274rpx;
			margin-bottom: 32rpx;
		}

		view {
			font-size: 28rpx;
			font-weight: 500;
			color: #666666;
			line-height: 40rpx;
		}
	}
</style>
