<template>
	<view class="student-detail-container">
		<x-week-date-calendar :checkedDate="acceptDataFromOpenerPage.selectedDate" :showRightIcon="false"
			@selected-change="bindDateChange">
		</x-week-date-calendar>
		<view class="student-detail-info">
			<user-info :dataSource="studentInfoData" />
			<view class="font-title">
				{{$t("task.correct.studentTaskDetail.physicalTask")}}
			</view>
			<block v-for="(item,index) in sportTaskInfos" :key="index">
				<sport-item :dataSource="item" @palyFullVedio="palyFullVedio" />
			</block>
		</view>
		<opeartion-btn :studentId="acceptDataFromOpenerPage.studentId" :studentIds="acceptDataFromOpenerPage.studentIds"
			:classManageType="acceptDataFromOpenerPage.classManageType" :showButton="sportTaskData.showButton"
			:corrected="studentInfoData.corrected" :comments="sportTaskData.comments" @change="bindStudentIdChange"
			@onTips="modalShow = true" @onReviews="reviewShow = true" />
		<video v-if="showVideo" id="popup_video" :src="viedeoUrl" object-fit="contain" :controls="true"
			style="position: fixed;top: 0;right: 0;bottom: 0;right: 0;width: 100%;height: 100%;"
			@fullscreenchange="fullscreenchange"></video>
		<u-modal show-cancel-button :show-title="false" v-model="modalShow" :content="`是否提醒${studentInfoData.name}来打卡？`"
			@confirm="apiPostTaskClockRemind"></u-modal>
		<u-popup v-model="reviewShow" mode="bottom" :safe-area-inset-bottom="true" :closeable="false">
			<Review @submitComment="submitComment" />
		</u-popup>
	</view>
</template>

<script>
	import xWeekDateCalendar from "../../components/x-week-date-calendar/x-week-date-calendar.vue";
	import UserInfo from './components/UserInfo/index.vue'
	import SportItem from './components/SportItem/index.vue'
	import OpeartionBtn from './components/OpeartionBtn/index.vue'
	import Review from './components/Review/index.vue'
	import {
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import {
		showToast
	} from '@/common/util.js'

	let that = null
	export default {
		components: {
			xWeekDateCalendar,
			UserInfo,
			SportItem,
			OpeartionBtn,
			Review
		},
		data() {
			return {
				acceptDataFromOpenerPage: {
					classManageType: 1, // 协管班级类型 1：主管 2：协管
					selectedDate: "",
					studentId: "",
					studentIds: [], // 学生列表 上一位下一位使用
				},
				studentInfoData: {
					avatar: null,
					name: null,
					className: null,
					aliasClassName: null,
					studentNum: null,
					corrected: null,
					classManageType: null,
					askLeave: null,
					completion: null,
					totalCount: null,
					staus: null
				},
				sportTaskInfos: [],
				sportTaskData: {},
				showVideo: false,
				viedeoUrl: "",
				videoContext: null,
				modalShow: false,
				reviewShow: false
			}
		},
		onLoad() {
			that = this;
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				console.log(data, '/////////////');
				that.acceptDataFromOpenerPage = data;
				that.apiPostTaskClockDetails()
			})
		},
		methods: {
			async apiPostTaskClockDetails() {
				try {
					const params = {
						studentId: this.acceptDataFromOpenerPage.studentId,
						dateTime: this.acceptDataFromOpenerPage.selectedDate,
					}
					const res = await postReq(URL.taskClockDetails, params)
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const {
							sportTaskInfos,
							avatar,
							name,
							className,
							aliasClassName,
							studentNum,
							corrected,
							askLeave,
							completion,
							totalCount,
							staus,
							totalGroup,
							isApproval,
							...params
						} = res.data
						this.sportTaskData = params

						this.studentInfoData = {
							avatar,
							name,
							className,
							aliasClassName,
							studentNum,
							corrected,
							classManageType: this.acceptDataFromOpenerPage.classManageType,
							askLeave,
							completion,
							totalCount,
							staus,
							totalGroup,
							isApproval
						}

						if (sportTaskInfos && sportTaskInfos.length) {
							this.sportTaskInfos = sportTaskInfos
						} else {
							this.sportTaskInfos = []
						}
					} else {
						this.sportTaskData = {}
						this.studentInfoData = {}
						this.sportTaskInfos = []
						showToast(res.message || '请稍后再试')
					}
				} catch {
					this.sportTaskData = {}
					this.studentInfoData = {}
					this.sportTaskInfos = []
					showToast('请稍后再试')
				} finally {
					if (!this.acceptDataFromOpenerPage.checkStatus) {
						this.submitComment('')
					}
				}
			},
			// 切换日期
			bindDateChange(e) {
				this.acceptDataFromOpenerPage.selectedDate = e.fullDate;
				this.apiPostTaskClockDetails()
			},
			// 点击显示全屏
			palyFullVedio(viedeoUrl) {
				this.videoContext = uni.createVideoContext('popup_video', this);
				if (this.videoContext) {
					this.viedeoUrl = viedeoUrl
					this.showVideo = true
					this.videoContext.requestFullScreen();
					this.videoContext.play()
				}
			},
			// 退出全屏的时候暂停视频
			fullscreenchange(e) {
				if (!e.detail.fullScreen) {
					this.showVideo = false
					this.viedeoUrl = ""
					this.videoContext.pause()
				}
			},
			// 切换学生
			bindStudentIdChange(value) {
				this.acceptDataFromOpenerPage.studentId = value
				this.apiPostTaskClockDetails()
			},
			apiPostTaskClockRemind() {
				this.modalShow = false;
				const params = {
					studentId: this.acceptDataFromOpenerPage.studentId,
					dateTime: this.acceptDataFromOpenerPage.selectedDate,
				}
				postReq(URL.clockRemindV2, params).then((res) => {
					if (res.error == 10000) {
						showToast('提醒成功！')
					} else {
						showToast(res.message)
					}
				});
			},
			submitComment(comments) {
				if (!this.sportTaskData.id) {
					return
				}
				const params = {
					idList: [this.sportTaskData.id],
					comments,
				};
				postReq(URL.taskReviewV2, params).then((res) => {
					if (res.error == 10000) {
						this.sportTaskData.comments = comments;
						this.reviewShow = false
						showToast('批改成功！')
					} else {
						showToast(res.message)
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.student-detail-container {
		padding-bottom: 256rpx;
	}

	.student-detail-info {
		padding: 32rpx;
		margin: 24rpx 0;
		background-color: #fff;
	}
</style>
