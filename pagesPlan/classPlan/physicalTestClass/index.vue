<template>
	<view class="physicalTestClass">
		<view class="physicalTestClass-main">
			<user-info :dataSource="classInfo" />
			<physical-info :dataSource="physicalInfoData" />
			<template v-if="urlOption.physicalId">
				<physique-info @click="jumpPageIndicator">
					<radar-chart :dataSource="physiqueInfo" />
				</physique-info>
			</template>
			<physical-rank-info :dataSource="physiqueRankInfo" />
			<template v-if="urlOption.physicalId">
				<physical-students :dataSource="physicalClassReportList" @click="jumpPageStudents" />
			</template>
		</view>
		<view class="physicalTestClass-footer">
			<u-button shape="circle" type="primary" :custom-style="customStyle" @click="jumpPageCoursewareSet">
				<text>生成课件</text>
			</u-button>
		</view>
	</view>
</template>

<script>
	import userInfo from "./components/userInfo/index.vue";
	import physicalInfo from "./components/physicalInfo/index.vue";
	import physiqueInfo from "./components/physiqueInfo/index.vue";
	import radarChart from "../components/radarChart/index.vue";
	import physicalRankInfo from "./components/physicalRankInfo/index.vue";
	import physicalStudents from "./components/physicalStudents/index.vue";
	import {
		USERCENTER
	} from '@/common/request.js'
	import {
		showToast
	} from "@/common/util.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		getReq,
		postReq
	} from "@/common/request.js";
	import {
		computeNumber,
		dealNumber,
		dealPersent,
	} from "@/common/util.js";

	export default {
		components: {
			userInfo,
			physicalInfo,
			physiqueInfo,
			radarChart,
			physicalRankInfo,
			physicalStudents,
		},
		data() {
			return {
				customStyle: {
					fontSize: "34rpx",
					padding: "18rpx 84rpx",
				},
				urlOption: {
					classId: "",
					physicalId: "",
				},
				classInfo: {},
				physicalInfoData: {
					height: "--",
					weight: "--",
					avgScore: "--",
					physicalReports: [],
				},
				physiqueInfo: [],
				physiqueRankInfo: {},
				physicalClassReportList: [],
			};
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: this.$t("pagesPlan.classPlan.physicalFitnessReport.name"),
			});
			const option = JSON.parse(decodeURIComponent(e.option));
			this.urlOption = {
				physicalId: option.physicalId,
            classSerialNumber: option.classSerialNumber,
				classId: option.classId
			};
			if (option.physicalId) {
				this.getPhysicalgClassReportTop();
				this.getPhysicalClassReportInfo();
				this.getClassPhysiqueInfo();
				this.getClassPhysiqueRankInfo();
				this.getPhysicalClassReportList();
			} else {
				this.classInfo = option;
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		methods: {
			getPhysicalgClassReportTop() {
				getReq(URL.apiGetPhysicalClassReportTop, {
						physicalId: this.urlOption.physicalId,
						classId: this.urlOption.classId
					})
					.then((res) => {
						if (res.data && JSON.stringify(res.data)) {
							this.classInfo = res.data;
						} else {
							this.classInfo = {};
						}
					})
					.catch(() => {
						this.classInfo = {};
					});
			},
			getPhysicalClassReportInfo() {
				getReq(URL.apiGetPhysicalClassReportInfo, {
						physicalId: this.urlOption.physicalId,
						classCode: this.urlOption.classSerialNumber,
					})
					.then((res) => {
						if (res.data && JSON.stringify(res.data)) {
							const dataSource = JSON.parse(JSON.stringify(res.data));
							const height = dataSource.high && dataSource.high !== -99999 ?
								`${computeNumber(dataSource.high, "/", 10).result.toFixed(1)}厘米` : "--"
							const weight = dataSource.wight && dataSource.wight !== -99999 ?
								`${computeNumber(dataSource.wight, "/", 1000).result.toFixed(2)}千克` : "--"
							const avgScore = dataSource.avgScore && dataSource.avgScore !== -99999 ?
								`${computeNumber(dataSource.avgScore, "/", 100).result.toFixed(0)}` : "--"
							let physicalReports = []
							if (dataSource.physicalReports && dataSource.physicalReports.length) {
								physicalReports = dataSource.physicalReports
									.filter((item) => {
										return item.testNameType >= 2;
									})
									.map((item) => ({
										...item,
										score: computeNumber(item.score, "/", 100).result.toFixed(1),
									}))
							}
							this.physicalInfoData = {
								height,
								weight,
								avgScore,
								physicalReports,
							}
						} else {
							this.physicalInfoData = {
								height: "--",
								weight: "--",
								avgScore: "--",
								physicalReports: [],
							}
						}
					})
					.catch(() => {
						this.physicalInfoData = {
							height: "--",
							weight: "--",
							avgScore: "--",
							physicalReports: [],
						}
					});
			},
			getClassPhysiqueInfo() {
				getReq(URL.apiGetClassPhysiqueInfo, {
						physicalId: this.urlOption.physicalId,
						classCode: this.urlOption.classSerialNumber,
					})
					.then((res) => {
						if (res.data && res.data.length) {
							this.physiqueInfo = res.data.map((item) => ({
								...item,
								score: computeNumber(item.score, "/", 100).result,
							}));
						} else {
							this.physiqueInfo = [];
						}
					})
					.catch(() => {
						this.physiqueInfo = [];
					});
			},
			getClassPhysiqueRankInfo() {
				getReq(URL.apiGetClassPhysiqueRankInfo, {
						physicalId: this.urlOption.physicalId,
						classCode: this.urlOption.classSerialNumber,
					})
					.then((res) => {
						if (res.data && JSON.stringify(res.data) !== "{}") {
							const {
								averageScore,
								schoolRank,
								score,
								physiqueRankDatas
							} = res.data;
							this.physiqueRankInfo = {
								schoolRankData: {
									schoolRank,
									averageScore: dealNumber(
										computeNumber(averageScore, "/", 100).result
									),
									score: dealNumber(computeNumber(score, "/", 100).result),
								},
								physiqueRankDatas: physiqueRankDatas.map((item) => ({
									...item,
									score: dealNumber(computeNumber(item.score, "/", 100).result),
									gradePrecent: item.dimensionGradeRank ?
										dealPersent(
											computeNumber(
												item.dimensionGradeRank,
												"/",
												res.data.gradeCount
											).result
										) : 0,
								}))
							}
						} else {
							this.physiqueRankInfo = {}
						}
					})
					.catch(() => {
						this.physiqueRankInfo = {}
					});
			},
			getPhysicalClassReportList() {
				getReq(URL.apiGetPhysicalClassReportList, {
						physicalId: this.urlOption.physicalId,
						classCode: this.urlOption.classSerialNumber,
					})
					.then((res) => {
						if (res.data && res.data.length) {
							this.physicalClassReportList = res.data.map((item) => ({
								...item,
								score: item.join ?
									dealNumber(computeNumber(item.score, "+", item.extraPoint).next('/',
										100).result) : 0,
							}));
						} else {
							this.physicalClassReportList = [];
						}
					})
					.catch(() => {
						this.physicalClassReportList = [];
					});
			},
			jumpPageIndicator() {
				const dimensionIds = this.physiqueInfo
					.map((item) => item.dimensionId)
					.join(",");
				this.$u.route({
					url: "pagesPlan/classPlan/indicator/index",
					params: {
						dimensionIds,
					},
				});
			},
			jumpPageStudents(item) {
				if (!item.score) {
					return
				}
				let nodeEnv = 'dev'
				if (USERCENTER.includes('test')) {
					nodeEnv = 'dev'
				} else if (USERCENTER.includes('pre')) {
					nodeEnv = 'pre'
				} else {
					nodeEnv = 'prod'
				}
				const xiaotiyunUser = uni.getStorageSync('xiaotiyunUser'); // 用户信息
				let domain;
				if (xiaotiyunUser.hasOwnProperty('teacher')) {
					domain = xiaotiyunUser.teacher.domain;
				} else {
					domain = xiaotiyunUser.parent.domain;
				}
				const option = {
					nodeEnv,
					uid: xiaotiyunUser.teacher.teacherId,
					token: xiaotiyunUser.teacher.token,
					loginType: "teacher",
					domain: domain,
				}
				const baseUrl = nodeEnv !== 'prod' ? "http" : "https"
				const params = {
					linkUrl: `${baseUrl}://h5.gxapp.iydsj.com/PhysicalFitnessReport/index.html#/pages/detail/index?option=${encodeURIComponent(JSON.stringify(option))}&physicalId=${this.urlOption.physicalId}&studentCode=${item.studentCode || ''}&id=${item.physicalStudentId || 0}`,
				};
				uni.navigateTo({
					url: '/pages/webView/index/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			jumpPageCoursewareSet() {
				let params = {
					classId: this.urlOption.classId,
					grades: this.classInfo.grades,
				};
				if (this.urlOption.physicalId) {
					params = Object.assign({}, params, {
						dimensionNames: this.physiqueInfo.map((item) => {
							return {
								...item,
								classId: item.classId || this.urlOption.classId,
								score: computeNumber(item.score, "*", 100).result,
								checked: Number(item.score) < 90 ? 1 : 0,
							};
						}),
					});
				}
				postReq(URL.apiPostCoursewareOperation, {
						...params,
					})
					.then((res) => {
						if (res.data) {
							let option = {
								...this.urlOption,
							};
							if (!this.urlOption.physicalId) {
								option = Object.assign({}, option, this.classInfo);
							}
							option = Object.assign({}, option, {
								coursewareId: res.data,
							});
							this.$u.route({
								url: "pagesPlan/classPlan/coursewareSet/index",
								type: "redirectTo",
								params: {
									option: encodeURIComponent(
										JSON.stringify({
											...option,
										})
									),
								},
							});
						} else if (res.error !== 10000) {
							showToast(res.message || "请稍后再试");
						}
					})
					.catch(() => {
						showToast("请稍后再试");
					});
			},
		},
	};
</script>

<style scoped lang="scss">
	.physicalTestClass {
		&-main {
			background: linear-gradient(180deg, #FFF7EA 0%, #FFC569 63%, #FFF3E1 100%);
			margin-bottom: 68rpx;
			padding-bottom: 204rpx;
			padding-bottom: calc(204rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(204rpx + env(safe-area-inset-bottom));
		}

		&-footer {
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			box-sizing: content-box;
			width: 100%;
			height: 180rpx;
			background-color: #fff;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			box-shadow: 0px -3rpx 54rpx 0px rgba(208, 208, 208, 0.5);
		}
	}
</style>
