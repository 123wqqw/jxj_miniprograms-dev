<template>
	<view class="basic-container">
		<classInfo :dataSource="classInfo" :classId="classInfo.classSerialNumber || ''" />
		<u-gap height="30" bg-color="#F4F4F4"></u-gap>
		<!-- 切换改善方案 后续要用 先隐藏 -->
		<!-- <schemeItem :dataSource="courseInfo" @click="jumpPagesScheme" />
		<u-gap height="30" bg-color="#F4F4F4"></u-gap> -->
		<view class="basic-block">
			<view style="padding: 30rpx 45rpx 0;">班级平均水平</view>
			<radar-chart :dataSource="dimensionNames" />
			<view style="padding: 0 45rpx;">
				<view class="u-margin-bottom-20">重点提升维度</view>
				<view class="u-flex u-flex-wrap u-row-between">
					<block v-for="item in dimensionNames" :key="item.dimensionId">
						<view class="dimensionNames-content" @click="checkedDimension(item)"
							:data-dimensionId="item.dimensionId">
							<view class="dimensionNames-item" :class="{isActive:item.checked}">
								{{item.dimensionName}}
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<u-gap height="30" bg-color="#F4F4F4"></u-gap>
		<trainStrength :dataSource="strengthData" @change="bindStrengthChange" />
		<u-gap height="30" bg-color="#F4F4F4"></u-gap>
		<sportDays :dataSouce="sportDayData" :coursewareId="urlOption.coursewareId" @handle-save="show = true" />
		<u-gap height="30" bg-color="#F4F4F4"></u-gap>
		<view class="report-footer">
			<u-button shape="circle" :custom-style="customStyle" @click="jumpPagesClass">重新生成</u-button>
			<u-button shape="circle" type="primary" :custom-style="customStyle" @click="jumpPageAssignment"
				v-if="sportDayData && sportDayData.length">布置作业
			</u-button>
		</view>
		<u-modal v-model="show" :show-title="false" @confirm="confirm" @cancel="show = false" ref="uModal"
			:async-close="true" :show-cancel-button="true" confirm-text="确定" cancel-text="取消" cancel-color="#000000"
			confirm-color="#6EA6E5" border-radius="28">
			<view class="u-padding-40">
				<u-input v-model="templateName" placeholder="请输入方案名称" maxlength="20" />
			</view>
		</u-modal>
	</view>
</template>

<script>
	import classInfo from '../components/class-info/index.vue'
	import schemeItem from './components/schemeItem/index.vue'
	import trainStrength from './components/trainStrength/index.vue'
	import radarChart from '../components/radarChart/index.vue'
	import sportDays from './components/sportDays/index.vue'
	import {
		URL
	} from "@/common/url.js";
	import {
		getReq,
		postReq
	} from "@/common/request.js";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		showToast,
		computeNumber
	} from "@/common/util.js";
	export default {
		components: {
			classInfo,
			schemeItem,
			trainStrength,
			radarChart,
			sportDays
		},
		data() {
			return {
				customStyle: {
					fontSize: "34rpx",
					padding: '18rpx 84rpx'
				},
				id: null,
				urlOption: {},
				classInfo: {},
				courseData: [],
				strengthData: 1,
				dimensionNames: [],
				sportDayData: [],
				isReset: false,
				show: false,
				templateName: "",
				sportDifficulty: {
					allow: 0, // (0.允许；1.不允许)
					difficulty: 2 // （1.初级；2.中级）
				},
			}
		},
		computed: {
			...mapState(['schemeId', 'xiaotiyunUser']),
			courseInfo() {
				if (this.courseData && this.courseData.length) {
					return this.courseData.find(item => {
						return item.id === this.schemeId
					}) || this.courseData[0]
				}
				return {}
			},
			listenReplacement() {
				return this.$store.state.replacement;
			}
		},
		watch: {
			"classInfo.grades": {
				handler(value) {
					if (value) {
						this.getCoursewareCourseInfo(value)
					}
				},
				deep: true // 可以深度检测到 obj 对象的属性值的变化
			},
			listenReplacement: {
				handler(value) {
					if (value && JSON.stringify(value) !== '{}') {
						console.log(value, '////listenReplacement///');
						let $index = -1
						this.sportDayData.forEach((item, index) => {
							if (item.id === value.id) {
								$index = index
							}
						})
						if ($index > -1) {
							this.sportDayData.splice($index, 1, {
								...value,
								sportDifficulty: this.sportDifficulty.difficulty
							});
						}
						this.setReplacement(null)
					}
				},
				deep: true
			}
		},
		onLoad(e) {
			const option = JSON.parse(decodeURIComponent(e.option))
			this.urlOption = {
				classId: option.classId,
				classSerialNumber: option.classSerialNumber,
				physicalId: option.physicalId,
				coursewareId: option.coursewareId
			}
			if (!this.urlOption.physicalId) {
				this.classInfo = option
			} else {
				this.getPhysicalgClassReportTop()
			}
		},
		mounted() {
			this.getCoursewareInfo()
			this.getCoursewareSportDays()
			this.apiGetDifficulty()
		},
		beforeDestroy() {
			if (!this.isReset) {
				this.apiPostCoursewareOperation()
			}
		},
		methods: {
			...mapMutations(['setSchemeId', 'setReplacement']),
			// 获取作业默认难度
			apiGetDifficulty() {
				getReq(URL.apiGetDifficulty, {
						schoolId: this.xiaotiyunUser.teacher.schoolId
					})
					.then((res) => {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							this.sportDifficulty = res.data
						} else {
							this.sportDifficulty = {
								allow: 0,
								difficulty: 2
							}
						}
					})
					.catch((error) => {
						this.sportDifficulty = {
							allow: 0,
							difficulty: 2
						}
					});
			},
			getPhysicalgClassReportTop() {
				getReq(URL.apiGetPhysicalClassReportTop, {
					...this.urlOption
				}).then(res => {
					if (res.data && JSON.stringify(res.data)) {
						this.classInfo = res.data
					} else {
						this.classInfo = {}
					}
				}).catch(error => {
					this.classInfo = {}
				})
			},
			async getCoursewareCourseInfo(grades) {
				try {
					const courseInfo = await getReq(URL.apiGetCoursewareCourseInfo, {
						grades
					})
					if (courseInfo.data && courseInfo.data.length) {
						this.courseData = courseInfo.data
					} else {
						this.courseData = []
					}
				} catch (e) {
					this.courseData = []
				}
			},
			// 查看班级的课件信息
			getCoursewareInfo() {
				getReq(URL.apiGetCoursewareInfo, {
					coursewareId: this.urlOption.coursewareId
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						this.strengthData = res.data.trainStrength
						this.setSchemeId(res.data.schemeId)
						this.dimensionNames = res.data.dimensionNames.map(item => ({
							...item,
							score: computeNumber(item.score, '/', 100).result
						}))
						this.id = res.data.id
					}
				}).catch(error => {
					this.id = ""
				})
			},
			jumpPagesScheme() {
				this.$u.route({
					url: 'pagesPlan/classPlan/selectScheme/index',
					params: {
						option: encodeURIComponent(JSON.stringify({
							grades: this.classInfo.grades,
						}))
					}
				})
			},
			checkedDimension(data) {
				this.dimensionNames.forEach(item => {
					if (item.dimensionId === data.dimensionId) {
						item.checked = item.checked === 1 ? 0 : 1
					}
				})
				const params = {
					dimensionNames: this.dimensionNames.map(item => ({
						...item,
						score: computeNumber(item.score, '*', 100).result
					})),
					id: this.id,
					schemeId: this.schemeId,
					trainStrength: this.strengthData
				}
				this.apiPostCoursewareInfo(params)
			},
			bindStrengthChange(value) {
				this.strengthData = value
				const params = {
					dimensionNames: this.dimensionNames.map(item => ({
						...item,
						score: computeNumber(item.score, '*', 100).result
					})),
					id: this.id,
					schemeId: this.schemeId,
					trainStrength: this.strengthData
				}
				this.apiPostCoursewareInfo(params)
			},
			apiPostCoursewareInfo(params) {
				postReq(URL.apiPostCoursewareInfo, {
					...params
				}).then(res => {
					if (res.data && res.data.length) {
						this.sportDayData = res.data
					} else {
						this.sportDayData = []
					}
				}).catch(error => {
					this.sportDayData = []
				})
			},
			getCoursewareSportDays() {
				getReq(URL.apiGetCoursewareSportDays, {
					coursewareId: this.urlOption.coursewareId
				}).then(res => {
					if (res.data && res.data.length) {
						this.sportDayData = res.data
					} else {
						this.sportDayData = []
					}
				}).catch(error => {
					this.sportDayData = []
				})
			},
			jumpPagesClass() {
				getReq(URL.apiGetCoursewareDelete, {
					coursewareId: this.urlOption.coursewareId
				}).then(res => {
					if (res.data) {
						this.isReset = true
						let option = {
							classId: this.urlOption.classId,
							classSerialNumber: this.urlOption.classSerialNumber,
							physicalId: this.urlOption.physicalId
						}
						if (!this.urlOption.physicalId) {
							option = Object.assign({}, option, {
								...this.classInfo
							})
						}
						this.$u.route({
							url: 'pagesPlan/classPlan/physicalTestClass/index',
							type: "redirectTo",
							params: {
								option: encodeURIComponent(JSON.stringify({
									...option
								}))
							}
						})
					} else {
						showToast("重新生成失败，请稍后再试。")
					}
				})
			},
			apiPostCoursewareOperation() {
				const params = {
					classAiSportSchemeQueries: this.sportDayData,
					classId: this.urlOption.classId,
					dimensionNames: this.dimensionNames.map(item => ({
						...item,
						score: computeNumber(item.score, '*', 100).result
					})),
					grades: this.classInfo.grades,
					id: this.id,
					schemeId: this.schemeId,
					trainStrength: this.strengthData
				}
				postReq(URL.apiPostCoursewareOperation, {
					...params
				})
			},
			jumpPageAssignment() {
				const params = {
					classAiSportSchemeQueries: this.sportDayData.map(item => ({
						...item,
						standardModel: item.sportModel ? 0 : 1
					})),
					classId: this.urlOption.classId,
					dimensionNames: this.dimensionNames.map(item => ({
						...item,
						score: computeNumber(item.score, '*', 100).result
					})),
					grades: this.classInfo.grades,
					id: this.id,
					schemeId: this.schemeId,
					trainStrength: this.strengthData
				}
				postReq(URL.apiPostCoursewareOperation, {
					...params
				}).then(res => {
					if (res.data) {
						this.isReset = true
						let option = {
							id: res.data,
							...this.urlOption
						}
						if (!this.urlOption.physicalId) {
							option = {
								...option,
								...this.classInfo
							}
						}
						this.$u.route({
							url: 'pagesPlan/classPlan/assignment/index',
							params: {
								option: encodeURIComponent(JSON.stringify({
									...option
								}))
							}
						})
					} else {
						showToast(res.message)
					}
				})
			},
			async confirm() {
				try {
					let templateDetails = []
					let sportInfos = [];
					this.sportDayData.forEach((item, index) => {
						if (sportInfos.indexOf(item.days) === -1 && item.show === 0) {
							templateDetails.push({
								days: item.days,
								sportInfos: []
							});
							sportInfos.push(item.days)
						}
					});
					templateDetails.forEach(item => {
						this.sportDayData.forEach(block => {
							if (item.days == block.days) {
								item.sportInfos.push({
									show: block.show,
									actionGroup: block.sportGroups,
									actionNum: block.sportModel ? block.sportTarget * 60 *
										1000 : block.sportTarget,
									calculateType: block.sportModel ? 1 : 2,
									difficulty: block.sportDifficulty,
									partStatus: [2, 1, 0][block
										.gender
									], // 0是女，1是男，2是全部 | 保存 0：全部，1：仅男生，2：仅女生
									sportId: block.sportId,
									standardNum: (block.sportModel ? block.standard * 60 *
											1000 :
											block.standard) ||
										null,
								})
							}
						})
					})
					const params = {
						grades: this.classInfo.grades,
						name: this.templateName,
						templateDetails
					}
					const result = await postReq(URL.apiPostTemplateSave, {
						...params
					})
					if (result.error === 10000) {
						uni.hideToast();
						showToast('保存成功')
						this.templateName = ""
					} else {
						showToast(result.message)
					}
				} catch (e) {
					showToast('请稍后再试')
				} finally {
					this.show = false
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.basic-block {
		background-color: #fff;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #202020;
		line-height: 40rpx;
	}


	.dimensionNames-content {
		box-sizing: border-box;
		width: 33.3%;
		margin-bottom: 30rpx;
		padding-right: 30rpx;
	}

	.dimensionNames-content:nth-child(3n) {
		padding-right: 0;
	}

	.dimensionNames-item {
		box-sizing: border-box;
		padding: 14rpx 8rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #9C9C9C;
		line-height: 37rpx;
		border-radius: 8rpx;
		border: 1rpx solid #979797;
		text-align: center;
	}

	.isActive {
		background: #5C8FF7;
		color: #fff;
		border: 1rpx solid #5C8FF7;
	}

	.report-footer {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 180rpx;
		background: #FFFFFF;
		box-shadow: 0px -3rpx 54rpx 0px rgba(208, 208, 208, 0.5000);

		&-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 308rpx;
			height: 84rpx;
			border-radius: 48rpx;
			font-size: 34rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #000000;
		}
	}
</style>
