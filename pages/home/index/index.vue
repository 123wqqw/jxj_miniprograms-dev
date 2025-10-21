<template>
	<view>
		<view class="navBar-wrap bg-white">
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px', width: '100%' }"></view>
			<view class="navBar" :style="{ height: navBarHeight + 'px', width: '100%' }">
				<view class="" style="position: relative;" @click="jumpNoticePages">
					<u-badge type="error" :count="notices" :offset="[0,0]" :is-dot="true">
					</u-badge>
					<u-icon name="bell" size="50"></u-icon>
				</view>
			</view>
		</view>
		<view class="u-padding-32  bg-white">
			<!-- 用户信息 -->
			<userinfo-block :dataSource="teacherInfo" />
			<!-- banner -->
			<u-swiper name="bannerImgUrl" :list="bannerList" :height="280" :border-radius="32" bg-color="#fff"
				mode="dot" @click="handleBanner">
			</u-swiper>
		</view>
		<!-- 功能网格入口 -->
		<user-grid />
		<view class="u-margin-top-32 u-margin-bottom-32 u-padding-left-32 u-padding-right-32 bg-white" :hidden="false">
			<!-- 金刚图 -->
			<PieCharts :dataSource="chartData" />
			<!-- 班级完成情况 -->
			<block v-for="item in taskClockClass" :key="item.classId">
				<class-progress :dataSource="item" @click="goClassStatistics(item)" />
			</block>
		</view>
		<u-tabbar v-model="current" :list="tabBar || []" bg-color="#ffffff" inactive-color="#B2B2B2"
			activeColor="#5C8FF7" height="56px" icon-size="24px">
		</u-tabbar>
		<classModel v-if="!editNewPsw && !bandClass" @bindManageClass="gonone" @bindHelpClass="bindHelpClass">
		</classModel>
		<ifNewPass v-if="editNewPsw" @newPassword="nonewpassword"></ifNewPass>
	</view>
</template>

<script>
	import userinfoBlock from './components/userinfo-block/index.vue'
	import userGrid from './components/user-grid/index.vue'
	import PieCharts from './components/pie-charts/index.vue'
	import classProgress from './components/class-progress/index.vue'
	import classModel from "../../../components/model/classModel.vue";
	import ifNewPass from "../../../components/model/ifNewPass.vue";
	import {
		getReq,
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		dateFormat,
		dealPersent
	} from '@/common/util.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			userinfoBlock,
			userGrid,
			classModel,
			PieCharts,
			classProgress,
			ifNewPass
		},
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
				teacherInfo: {},
				bannerList: [],
				taskClockClass: [],
				chartData: {},
				current: 0,
				editNewPsw: false,
				bandClass: true,
				notices: 0, //消息通知数量
			}
		},
		computed: {
			...mapState(['tabBar', 'xiaotiyunUser', 'userInfo']),
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: ""
			})
			this.tabBar[0].text = this.$t("main.home.index.title");
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
			this.navBarHeight = uni.getSystemInfoSync().platform === 'android' ? 48 : 44
		},
		onShow() {
			this.bandClass = this.xiaotiyunUser.teacher.bandClass;
			this.editNewPsw = this.xiaotiyunUser.teacher.password == '123456' && this.xiaotiyunUser.teacher.isOnePass ?
				true : false;
			this.getTeacherInfo();
			this.getBannerList()
			this.getTaskClockStatistics();
			this.getNoticeCount()
			this.getSchoolById()
		},
		//下拉刷新
		onPullDownRefresh() {
			Promise.all([this.getTeacherInfo(), this.getTaskClockStatistics()]).then((values) => {
				if (values.some(item => item === true)) {
					uni.stopPullDownRefresh();
				}
			});
		},
		methods: {
			...mapMutations(['setXiaotiyunUser', 'setSchoolInfo']),
			getNoticeCount() {
				getReq(URL.apiGetNoticeCount).then(res => {
					this.notices = res.data || 0
				}).catch(() => {
					this.notices = 0
				})
			},
			nonewpassword(e) {
				this.editNewPsw = e
			},
			gonone(e) {
				uni.navigateTo({
					url: "/pagesMine/mine/classConcat/calssConcat"
				})
			},
			bindHelpClass() {
				uni.navigateTo({
					url: "/pagesMine/mine/classConcatHelp/classConcatHelp"
				})
			},
			// 获取教师信息
			getTeacherInfo() {
				return new Promise((reponse, reject) => {
					getReq(URL.getTeacherInfo).then(res => {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							this.teacherInfo = res.data
							const xiaotiyunUser = {
								teacher: {
									...this.xiaotiyunUser.teacher,
									schoolName: res.data.schoolName,
									faceModelStatusVO: res.data.faceModelStatusVO
								}
							};
							this.setXiaotiyunUser(xiaotiyunUser);
						} else {
							this.teacherInfo = {
								name: this.xiaotiyunUser.teacher.name,
								schoolName: "",
								teacherType: 1
							}
						}
						reponse(true)
					}).catch(error => {
						this.teacherInfo = {}
						reponse(false)
					})
				});
			},
			// 获取banner
			getBannerList() {
				getReq(URL.getBannerList).then(res => {
					if (res.data && res.data.length) {
						this.bannerList = res.data;
					} else {
						uni.hideToast();
						uni.showToast({
							duration: 2000,
							"icon": "none",
							"title": res.message,
						});
					}
				}).catch(error => {
					this.bannerList = []
				})
			},
			handleBanner(index) {
				if (this.bannerList && this.bannerList.length) {
					const params = {
						linkUrl: this.bannerList[index].bannerLinkUrl
					}
					uni.navigateTo({
						url: '/pages/webView/index/index',
						success: function(res) {
							res.eventChannel.emit('acceptDataFromOpenerPage', params)
						}
					})
				}
			},
			// 获取作业统计
			getTaskClockStatistics() {
				return new Promise((reponse, reject) => {
					const params = {
						dateTime: dateFormat(new Date(), 'yyyy-MM-dd')
					}
					getReq(URL.taskClockStatistics, params).then(res => {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							const {
								taskClockClass,
								...param
							} = res.data
							if (taskClockClass && taskClockClass.length) {
								this.taskClockClass = taskClockClass.map(item => {
									const total = item.completeCount + item.incompleteCount;
									return {
										...item,
										completePresent: total ? dealPersent(item.completeCount /
											total) : 0
									}
								})
							} else {
								this.taskClockClass = []
							}
							this.chartData = param
						} else {
							this.taskClockClass = []
							this.chartData = {}
						}
						reponse(true)
					}).catch(error => {
						reponse(false)
					})
				});
			},
			goClassStatistics(item) {
				let classStatisticsParams = {
					className: item.className,
					classId: item.classId,
					type: -1,
					selectedDate: '',
					rest: item.rest
				}
				uni.navigateTo({
					url: "/pagesTask/correct/classStatistics/classStatistics",
					success: function(res) {
						res.eventChannel.emit('classStatistics', classStatisticsParams)
					}
				})
			},
			getSchoolById() {
				let _this = this;
				let params = {
					schoolId: _this.xiaotiyunUser.teacher.schoolId
				}
				getReq(URL.getSchoolInfoById, params).then(res => {
					if (res.error == 10000) {
						this.setSchoolInfo(res.data)
					} else {
						this.setSchoolInfo('')
					}
				})
			},
			jumpNoticePages() {
				uni.navigateTo({
					url: "/pagesNotice/index/index",
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg-white {
		background-color: #fff;
	}

	.navBar {
		display: flex;
		align-items: center;
		padding: 0 32rpx;
	}
</style>
