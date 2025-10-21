<template>
	<view class="assignTaskInfo">
		<view class="assignTaskInfo-header">
			<text>
				{{options.classInfo.aliasClassName ? options.classInfo.aliasClassName : options.classInfo.className}}
			</text>
			<text>{{options.dateTime}}</text>
		</view>
		<!-- 作业详情 -->
		<template v-if="!isEdit">
			<view class="taskData">
				<view class="u-font-34 u-margin-bottom-24 text-blod">
					男生AI动作作业
				</view>
				<template v-if="maleActions && maleActions.length">
					<view class="u-flex u-flex-wrap">
						<block v-for="(item,index) in maleActions" :key="index">
							<view class="assignTaskInfo-text u-margin-bottom-16">
								<text>{{item.name}}</text>
							</view>
						</block>
					</view>
				</template>
				<template v-else>
					<view>无</view>
				</template>
				<u-gap height="1" bg-color="#CACACA" margin-bottom="24"></u-gap>
				<view class="u-font-34 u-margin-top-8 u-margin-bottom-24 text-blod">
					女生AI动作作业
				</view>
				<template v-if="femaleActions && femaleActions.length">
					<view class="u-flex u-flex-wrap">
						<block v-for="(item,index) in femaleActions" :key="index">
							<view class="assignTaskInfo-text u-margin-bottom-16">
								<text>{{item.name}}</text>
							</view>
						</block>
					</view>
				</template>
				<template v-else>
					<view>无</view>
				</template>
			</view>
			<view class="taskData">
				<view class="u-font-34 u-margin-bottom-24 text-blod">
					自定义项目
				</view>
				<template v-if="customActions && customActions.length">
					<view class="u-flex u-flex-wrap">
						<block v-for="(item,index) in customActions" :key="index">
							<view class="assignTaskInfo-text u-margin-bottom-24">
								{{item.name}}
							</view>
						</block>
					</view>
				</template>
				<template v-else>
					<view>无</view>
				</template>
			</view>
		</template>
		<!-- 编辑作业 -->
		<template v-if="isEdit">
			<block v-for="(item, index) in taskDetails" :key="index">
				<customized-items v-if="item.taskType === 1" :ref="`sportRef${index}`" :index="index" :dataSource="item"
					:disabled="item.istoday" @delete="handleDelete(index)" @upload="uploadVedio($event, index)" />
				<ai-sport-item v-if="item.taskType === 2" :ref="`sportRef${index}`" :index="index" :dataSource="item"
					:disabled="item.istoday" @delete="handleDelete(index)"
					@handleSporType="handleSporType($event,index)" @handleActionGroup="handleActionGroup($event,index)"
					@handlePartStatus="handlePartStatus($event,index)"
					@handleDifficulty="handleDifficulty($event,index)" />
			</block>
			<view class="twoBtn">
				<u-button class="u-flex-1" shape="circle" :custom-style="operationBtnStyle" style="padding: 0 20rpx"
					@click="addSportList(2)">
					<u-icon name="plus" color="#000000" size="28"
						:label="`添加AI${$t('task.assign.assignTask.actionProgram')}`" label-size="28"
						label-color="#000000" margin-left="10"></u-icon>
				</u-button>
				<!-- <u-button class="u-flex-1" shape="circle" :custom-style="operationBtnStyle" style="padding: 0 20rpx"
					@click="addSportList(1)">
					<u-icon name="plus" color="#000000" size="28"
						:label="`添加${$t('task.assign.assignTask.selfProgram')}`" label-size="28" label-color="#000000"
						margin-left="10"></u-icon>
				</u-button> -->
			</view>
		</template>
		<!-- 过去的时间 不包括今天 不允许再进行操作 -->
		<view class="assignTaskInfo-footer basic-container"
			v-if="new Date().getTime() < new Date(options.dateTime).getTime() + 3600 * 1000 * 24">
			<view class="assignTaskInfo-footer-content">
				<u-button v-if="!isEdit" :custom-style="customStyle" type="primary" shape="circle" class="u-flex-1"
					:disabled="disabled" @click="isEdit = true">
					编辑作业
				</u-button>
				<u-button v-if="isEdit" :custom-style="customStyle" type="primary" shape="circle"
					class="u-flex-1 u-padding-left-15" :disabled="disabled" @click="handle" :loading="loading">
					布置作业
				</u-button>
			</view>
		</view>
		<!-- 运动类型 -->
		<u-select v-model="sportTypeShow" :list="sportTypeList" @confirm="confirmSporType">
			<template #other>
				<view class="select-bar">
					<view :class="{ 'is-active': calculateType === 1 }" @click="bindSportType(1)">
						定时
					</view>
					<view :class="{ 'is-active': calculateType === 2 }" @click="bindSportType(2)">
						定数
					</view>
				</view>
			</template>
		</u-select>
		<!-- 组数 -->
		<u-select v-model="actionGroupShow" :list="actionGroups" @confirm="confirmactionGroup"></u-select>
		<!-- 性别 -->
		<u-select v-model="partStatusShow" :list="partStatus" @confirm="confirmPartStatus"></u-select>
		<!-- 难度标准 -->
		<u-select v-model="sportDifficultyShow" :list="sportDifficulty" @confirm="confirmSportDifficulty"></u-select>
		<!-- 删除已经布置过的作业 提示 -->
		<u-modal v-model="withdrawVisible" :content="withdrawContent" :title="withdrawTitle" :confirm-text="enter"
			:title-style="{ fontSize: '34rpx', fontWeight: '500', color: '#333333' }" show-cancel-button="true"
			@confirm="closeWithdraw">
		</u-modal>
	</view>
</template>

<script>
	import customizedItems from '../components/customized-items/index.vue';
	import aiSportItem from '../components/ai-sport-item/index.vue';
	let that = null
	import {
		mapState
	} from 'vuex'
	import {
		getReq,
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import {
		showToast
	} from "../../../common/util.js";
	import OBSupload from "@/common/huaweicloud/index.js"
	export default {
		components: {
			customizedItems,
			aiSportItem
		},
		data() {
			return {
				operationBtnStyle: {
					height: '80rpx',
					boxShadow: '0px 2rpx 18rpx -8rpx #CACACA'
				},
				options: {},
				isEdit: false, // 是否编辑
				taskDetails: [],
				AIItemList: [], // 添加项目
				sportTypeShow: false,
				sportTypeList: [],
				partStatusShow: false,
				partStatus: [{
						label: "全部",
						value: 0
					},
					{
						label: "男生",
						value: 1
					},
					{
						label: "女生",
						value: 2
					}
				],
				sportDifficultyOperation: {
					allow: 0, // (0.允许；1.不允许)
					difficulty: 2 // （1.初级；2.中级）
				},
				sportDifficultyShow: false,
				sportDifficulty: [{
						value: 1,
						label: '初级'
					},
					{
						value: 2,
						label: '中级'
					}
				],
				actionGroupShow: false,
				actionGroups: [],
				calculateType: -1,
				selectIndex: -1, // 被选中的下标
				withdrawVisible: false,
				withdrawIndex: -1,
				withdrawId: -1,
				withdrawData: [], // 被删除的 已经布置的 作业
				withdrawContent: this.$t('task.assign.assignTaskInfo.withdrawContent'),
				withdrawTitle: this.$t('task.assign.assignTaskInfo.withdrawTitle'),
				enter: this.$t('common.enter'),
				loading: false
			};
		},
		onLoad() {
			that = this;
			uni.setNavigationBarTitle({
				title: this.$t('task.assign.assignTask.title')
			})
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				that.options = data
				that.getAssignTaskInfo()
			})
			for (let i = 1; i <= 8; i++) {
				this.actionGroups.push({
					value: i,
					label: `${i}组`
				})
			}
		},
		watch: {
			AIItemList: {
				handler: function(value) {
					let addAISportList = []
					if (value && value.length) {
						addAISportList = value.map(item => ({
							actionId: item.id,
							calculateType: 1,
							difficulty: this.sportDifficultyOperation.difficulty,
							actionGroup: 3,
							name: item.aiSportName,
							num: 60000,
							partStatus: 0,
							taskType: 2
						}))
					}
					this.taskDetails = [...this.taskDetails, ...addAISportList]
				}
			}
		},
		computed: {
			...mapState(['xiaotiyunUser']),
			// 获取作业默认难度
			apiGetDifficulty() {
				getReq(URL.apiGetDifficulty, {
						schoolId: this.xiaotiyunUser.teacher.schoolId
					})
					.then((res) => {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							this.sportDifficultyOperation = res.data
						} else {
							this.sportDifficultyOperation = {
								allow: 0,
								difficulty: 2
							}
						}
					})
					.catch((error) => {
						this.sportDifficultyOperation = {
							allow: 0,
							difficulty: 2
						}
					});
			},
			maleActions() {
				if (this.taskDetails && this.taskDetails.length) {
					return this.taskDetails.filter(item => {
						return item.taskType === 2 && [0, 1].includes(item.partStatus)
					})
				}
				return []
			},
			femaleActions() {
				if (this.taskDetails && this.taskDetails.length) {
					return this.taskDetails.filter(item => {
						return item.taskType === 2 && [0, 2].includes(item.partStatus)
					})
				}
				return []
			},
			customActions() {
				if (this.taskDetails && this.taskDetails.length) {
					return this.taskDetails.filter((item, index) => {
						item.$index = index
						return item.taskType === 1
					})
				}
				return []
			}
		},
		methods: {
			getAssignTaskInfo() {
				postReq(URL.assignDetails, {
					classId: this.options.classInfo.classId,
					dateTime: this.options.dateTime,
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						this.taskDetails = res.data.taskDetails.map(item => ({
							...item,
							num: item.maleNum || item.femaleNum || "",
							actionGroup: item.maleGroup ? (item.maleGroup || item.femaleGroup) : 0,
							istoday: true
						}))
					} else {
						this.taskDetails = []
					}
				}).catch(error => {
					this.taskDetails = []
				})
			},
			/**
			 * 添加运动
			 * @param {string} taskType 运动类型 1 自定义动作 2 AI运动
			 */
			addSportList(taskType) {
				if (taskType === 1) {
					this.taskDetails.push({
						taskType: 1,
						name: '',
						taskInfo: '',
						taskVideoUrl: '', //视频地址
						istoday: false
					})
				} else if (taskType === 2) {
					this.$u.route({
						url: '/pagesTask/assign/assignTask/selectAi',
					})
				}
			},
			uploadVedio(data, index) {
				uni.chooseVideo({
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					extension: ['mp4'],
					success: function(res) {
						const dataSource = {
							...data,
							taskVideoUrl: res.tempFilePath
						}
						that.taskDetails.splice(index, 1, dataSource)
					}
				})
			},
			handleDelete(index) {
				this.withdrawVisible = this.taskDetails[index].istoday ? true : false
				if (!this.withdrawVisible) {
					this.taskDetails.splice(index, 1)
				} else {
					this.withdrawIndex = index
					this.withdrawId = this.taskDetails[index].id
				}
			},
			closeWithdraw() {
				const params = {
					classId: this.options.classInfo.classId,
					dateTime: this.options.dateTime,
					taskId: this.withdrawId
				}
				postReq(URL.taskRevoke, params).then(res => {
					if (res.error == 10000) {
						// 布置作业成功
						this.taskDetails.splice(this.withdrawIndex, 1)
					} else {
						showToast(res.message)
					}
				})
			},
			handleSporType(data, index) {
				this.sportTypeShow = true
				this.selectIndex = index
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data)
				this.bindSportType(this.taskDetails[this.selectIndex].calculateType)
			},
			bindSportType(index) {
				let data = []
				if (index === 1) {
					data = [{
						value: 30000,
						label: '30秒'
					}, {
						value: 60000,
						label: '1分钟'
					}, {
						value: 120000,
						label: '2分钟'
					}, {
						value: 180000,
						label: '3分钟'
					}, {
						value: 240000,
						label: '4分钟'
					}]
				} else if (index === 2) {
					data = []
					for (let i = 1; i <= 200; i++) {
						data.push({
							value: i,
							label: `${i}个`
						})
					}
				}
				this.sportTypeList = data
				this.calculateType = index
			},
			confirmSporType(value) {
				const data = this.$u.deepClone(this.taskDetails[this.selectIndex])
				this.taskDetails[this.selectIndex] = Object.assign({}, data, {
					calculateType: this.calculateType,
					num: value[0].value
				})
			},
			handlePartStatus(data, index) {
				this.partStatusShow = true
				this.selectIndex = index
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data)
			},
			confirmPartStatus(value) {
				this.taskDetails[this.selectIndex].partStatus = value[0].value
			},
			handleDifficulty(data, index) {
				if (this.sportDifficultyOperation.allow) {
					return
				}
				this.sportDifficultyShow = true;
				this.selectIndex = index;
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data);
			},
			confirmSportDifficulty(value) {
				this.taskDetails[this.selectIndex].difficulty = value[0].value
			},
			handleActionGroup(data, index) {
				this.actionGroupShow = true
				this.selectIndex = index
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data)
			},
			confirmactionGroup(value) {
				this.taskDetails[this.selectIndex].actionGroup = value[0].value
			},
			handle() {
				let data = []
				for (let i = 0; i < this.taskDetails.length; i++) {
					if (this.$refs[`sportRef${i}`] && this.$refs[`sportRef${i}`].length) {
						const formData = this.$refs[`sportRef${i}`][0].formData
						let target = ""
						if (formData.taskType === 1) {
							target = ""
						} else if (formData.calculateType === 1) {
							target = formData.num / 1000 / 60 < 1 ? `${formData.num / 1000 }秒` :
								`${formData.num / 1000 / 60}分钟`
						} else {
							target = `${formData.num}个`
						}

						data.push({
							actionId: formData.actionId,
							calculateType: formData.calculateType,
							difficulty: formData.difficulty,
							femaleGroup: formData.partStatus === 2 ? formData.actionGroup : null,
							id: formData.id,
							maleGroup: [0, 1].includes(formData.partStatus) ? formData.actionGroup : null,
							name: `${formData.name}${target}`,
							num: formData.num,
							partStatus: formData.partStatus,
							standardNum: formData.standardNum,
							taskInfo: formData.taskInfo,
							taskType: formData.taskType,
							taskVideoUrl: formData.taskVideoUrl
						})
					}
				}
				data = data.filter(item => {
					if (item.taskType === 1) {
						return item.name && item.taskInfo
					}
					return item
				})
				this.taskDetails = data
				if (!data || !data.length) {
					return showToast(`作业不能为空`)
				}
				const customActions = this.customActions.filter(item => {
					return item.taskVideoUrl && item.taskVideoUrl.indexOf('https://gxapp-vedio.iydsj.com/') === -1
				}).map(item => {
					return this.testHttp(item.taskVideoUrl, item.$index)
				})
				this.loading = true
				if (customActions && customActions.length) {
					Promise.all([...customActions]).then((values) => {
						if (values.some(item => item === true)) {
							this.apiPostTaskAssign()
						} else {
							this.loading = false
						}
					}).catch(error => {
						this.loading = false
					})
				} else {
					this.apiPostTaskAssign()
				}
			},
			testHttp(data, index) {
				return new Promise((resolve, reject) => {
					OBSupload(data, 'video').then(res => {
						if (res) {
							this.taskDetails[index].taskVideoUrl = res
							resolve(true)
						} else {
							resolve(false)
						}
					}).catch(error => {
						resolve(false)
					})
				})
			},
			apiPostTaskAssign() {
				postReq(URL.apiPostTaskAssignEdit, {
					"assignDate": this.options.dateTime, // 布置日期集合
					"classId": this.options.classInfo.classId, // 布置班级集合
					"replace": false, // 是否替换原有作业
					"taskDetails": this.taskDetails
				}).then(res => {
					if (res.error === 10000) {
						this.$u.route({
							type: "navigateBack",
							delta: 1
						})
					} else {
						showToast('请稍后再试')
					}
					this.loading = false
				}).catch(() => {
					showToast('请稍后再试')
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.assignTaskInfo {
		box-sizing: border-box;
		width: 100vw;
		padding-bottom: 210rpx;
		padding-bottom: calc(210rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(210rpx + env(safe-area-inset-bottom));

		&-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #FFFFFF;
			padding: 32rpx;
			font-size: 28rpx;
			line-height: 40rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #202020;
		}

		.twoBtn {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			margin: 20rpx 0;
		}

		&-text {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			line-height: 40rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #202020;
			margin-right: 20rpx;
		}

		&-footer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #FFFFFF;
			box-shadow: 0px -3rpx 54rpx 0px rgba(208, 208, 208, 0.5);

			&-content {
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-around;
				width: 100%;
				height: 180rpx;
				padding: 0 30rpx;
			}
		}
	}

	.taskData {
		margin: 40rpx;
		padding: 20rpx;
		background: #fff;
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 400;
		color: #000000;
	}

	.taskData+.taskData {
		margin-top: 48rpx;
	}

	.text-blod {
		font-weight: bold;
	}

	.select-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 45rpx;
	}

	.select-bar .is-active {
		border-bottom: 6rpx solid #12A5EE;
	}
</style>
