<template>
	<view class="leaveNoticeReview">
		<view class="leaveNoticeReview-main">
			<view class="leaveNoticeReview-content u-flex u-col-top">
				<view class="u-margin-right-36 u-flex-1">
					<view class="leaveNoticeReview-content_text">
						申请学生：{{dataSource.studentName}}
					</view>
					<view class="leaveNoticeReview-content_text">
						所在班级：{{dataSource.className}}
					</view>
					<view class="leaveNoticeReview-content_text">
						申请日期：{{ dateFormat(new Date(dataSource.askleaveDate),'MM月dd日')}}
					</view>
					<view class="leaveNoticeReview-content_text">
						申请时间：{{dateFormat(new Date(dataSource.askleaveTime),'yyyy/MM/dd hh:mm')}}
					</view>
				</view>
				<!-- （0.未审批；1.审批通过；2.审批驳回；3.已撤销） -->
				<u-image width="80rpx" height="80rpx"
					:src="`/pagesReview/static/${['icon_reivew','icon_pass','icon_reject','icon_withdrawal'][dataSource.approvalStatus]}.png` "
					mode="aspectFit">
				</u-image>
			</view>
			<view class="leaveNoticeReview-content">
				<view class="leaveNoticeReview-content-title">
					请假理由：
				</view>
				<view class="leaveNoticeReview-content-reason">
					{{dataSource.askleaveText}}
				</view>
				<view class="leaveNoticeReview-content-title">
					流程：
				</view>
				<view class="leaveNoticeReview-content-process">
					<view class="leaveNoticeReview-content-process_circle"></view>
					<view class="leaveNoticeReview-content-process_text">发起申请</view>
				</view>
				<view class="leaveNoticeReview-content-person u-margin-bottom-30">
					{{dataSource.studentName}}（{{dataSource.className}}）
				</view>
				<view class="leaveNoticeReview-content-process">
					<view class="leaveNoticeReview-content-process_circle"></view>
					<view class="leaveNoticeReview-content-process_text">审批人</view>
				</view>
				<!-- （0.未审批；1.审批通过；2.审批驳回；3.已撤销） -->
				<view class="leaveNoticeReview-content-person" v-for="item in teacherApprovalInfos"
					:key="item.teacherId">
					{{item.teacherName}}（{{['未审批','已同意','未同意','已撤销'][item.approvalStatus]}}）
				</view>
			</view>
			<view style="color: #5C8FF7;" class="u-margin-top-32 u-font-26" @click="jumpStudentTaskDetail">
				查看作业
			</view>
		</view>
		<view class="leaveNoticeReview-footer" v-if="dataSource.approvalStatus === 0">
			<u-button type="primary" :plain="true" shape="circle" :custom-style="customStyle" @click="show = true">驳回
			</u-button>
			<u-button type="primary" shape="circle" :custom-style="customStyle" @click="confirm(1)">同意</u-button>
		</view>
		<u-modal v-model="show" :show-title="false" show-cancel-button confirm-color="#5C8FF7" @confirm="confirm(2)"
			ref="uModal" :async-close="true">
			<view class="slot-content">
				<view class="slot-title">
					驳回意见
				</view>
				<u-input v-model="rejectReasons" type="textarea" :height="256" :maxlength="100" border />
			</view>
		</u-modal>
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
		dateFormat
	} from '@/common/util.js'
	export default {
		data() {
			return {
				customStyle: {
					width: '280rpx'
				},
				show: false,
				rejectReasons: "",
				id: "",
				dataSource: {
					approvalStatus: 0
				},
				teacherApprovalInfos: [],
				dateFormat
			}
		},
		onLoad(e) {
			this.id = e.id
		},
		onReady() {
			this.apiGetApprovalInfo()
		},
		methods: {
			apiGetApprovalInfo() {
				getReq(URL.apiGetApprovalInfo, {
					id: this.id
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const {
							teacherApprovalInfos,
							...params
						} = res.data
						this.dataSource = params
						if (teacherApprovalInfos && teacherApprovalInfos.length) {
							this.teacherApprovalInfos = teacherApprovalInfos
						} else {
							this.teacherApprovalInfos = []
						}
					} else {
						this.dataSource = {}
						this.teacherApprovalInfos = []
					}
				}).catch(() => {
					this.dataSource = {}
					this.teacherApprovalInfos = []
				})
			},
			// 	审批意见（1.同意；2.驳回）
			confirm(approvalStatus) {
				postReq(URL.apiPostApproval, {
					approvalStatus,
					id: this.id,
					rejectReasons: this.rejectReasons
				}).then(res => {
					if (res.error === 10000) {
						this.show = false
						uni.showToast({
							icon: 'none',
							title: "操作成功",
							duration: 2000
						})
						uni.navigateBack({
							delta: 1,
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000,
						})
					}
				}).catch(() => {
					uni.showToast({
						icon: 'none',
						title: '请稍后试',
						duration: 2000,
					})
				})
			},
			jumpStudentTaskDetail() {
				const data = {
					studentId: this.dataSource.studentId,
					studentIds: [this.dataSource.studentId],
					selectedDate: dateFormat(new Date(this.dataSource.askleaveDate), 'yyyy-MM-dd'),
					classManageType: 1,
					checkStatus: null
				}
				uni.navigateTo({
					url: "/pagesTask/correct/studentTaskDetail/studentTaskDetail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', data)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.leaveNoticeReview {
		&-main {
			padding: 44rpx 40rpx 204rpx;
		}

		&-content+&-content {
			margin-top: 22rpx;
		}

		&-content {
			padding: 36rpx;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 16rpx 0px rgba(219, 219, 219, 0.5);
			border-radius: 18rpx;
			border: 1rpx solid #F1F2F3;

			&_text {
				font-size: 30rpx;
				line-height: 42rpx;
				font-weight: bold;
				color: #202020;
			}

			&_text+&_text {
				margin-top: 28rpx;
			}

			&-title {
				font-size: 30rpx;
				line-height: 42rpx;
				font-weight: bold;
				color: #202020;
				margin-bottom: 14rpx;
			}

			&-reason {
				font-size: 26rpx;
				font-weight: bold;
				color: #707070;
				line-height: 1.5;
				padding: 0 22rpx;
				margin-bottom: 24rpx;
			}

			&-process {
				display: flex;
				align-items: center;
				padding: 0 44rpx;
				margin-bottom: 14rpx;

				&_circle {
					width: 46rpx;
					height: 46rpx;
					margin-right: 28rpx;
					border-radius: 50%;
					border: 1rpx solid #5C8FF7;
				}

				&_text {
					font-size: 30rpx;
					line-height: 42rpx;
					font-weight: bold;
					color: #5C8FF7;
				}

			}

			&-person {
				margin-left: 118rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #707070;
				line-height: 40rpx;
			}

			&-person+&-person {
				margin-top: 14rpx;
			}
		}

		&-footer {
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;
			box-sizing: content-box;
			width: 100%;
			height: 180rpx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			z-index: 10;
		}
	}

	.slot-content {
		padding: 34rpx 40rpx;
	}

	.slot-title {
		font-size: 32rpx;
		line-height: 45rpx;
		font-weight: 400;
		color: #000000;
		margin-bottom: 22rpx;
	}
</style>
