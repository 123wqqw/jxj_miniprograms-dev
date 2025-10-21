<template>
	<view class="assignTask">
		<view class="assignTask-info">
			<view class="assignTask-info-title">
				{{ $t("task.assign.assignTask.arrangeClasses") }}
			</view>
			<view class="u-flex u-flex-wrap">
				<block v-for="item in classList" :key="item.classId">
					<text class="assignTask-info-text u-margin-bottom-24">
					{{ item.aliasClassName ? item.aliasClassName : item.className}}
				</text>
				</block>
			</view>
			<u-gap height="1" bg-color="#CACACA" margin-bottom="24"></u-gap>
			<view class="assignTask-info-title">
				{{ $t("task.assign.assignTask.setReleaseDate") }}（已选择{{
          assignDates.length
        }}天）
			</view>
			<view class="u-flex u-flex-wrap">
				<block v-for="item in assignDateRange" :key="item">
					<view class="u-flex u-margin-bottom-24">
						<view class="assignTask-info-textLine"></view>
						<view class="assignTask-info-text">
							{{ item }}
						</view>
					</view>
				</block>
				<u-image width="34rpx" height="34rpx" src="/static/images/date-add.png" mode="aspectFit"
					class="u-margin-left-10 u-margin-bottom-24" @click="handleCalendar">
				</u-image>
			</view>
		</view>

		<block v-for="(item, index) in taskDetails" :key="index">
			<customized-items v-if="item.taskType === 1" :ref="`sportRef${index}`" :index="index" :dataSource="item"
				@upload="uploadVedio($event, index)" @delete="handleDelete(index)" />
			<ai-sport-item v-if="item.taskType === 2" :ref="`sportRef${index}`" :index="index" :dataSource="item"
				@delete="handleDelete(index)" @handleSporType="handleSporType($event, index)"
				@handleActionGroup="handleActionGroup($event, index)"
				@handlePartStatus="handlePartStatus($event, index)"
				@handleDifficulty="handleDifficulty($event, index)" />
		</block>

		<view class="twoBtn">
			<u-button class="u-flex-1" shape="circle" :custom-style="operationBtnStyle" style="padding: 0 20rpx"
				@click="addSportList(2)">
				<u-icon name="plus" color="#000000" size="28"
					:label="`添加AI${$t('task.assign.assignTask.actionProgram')}`" label-size="28" label-color="#000000"
					margin-left="10"></u-icon>
			</u-button>
			<!-- <u-button class="u-flex-1" shape="circle" :custom-style="operationBtnStyle" style="padding: 0 20rpx"
				@click="addSportList(1)">
				<u-icon name="plus" color="#000000" size="28" :label="`添加${$t('task.assign.assignTask.selfProgram')}`"
					label-size="28" label-color="#000000" margin-left="10"></u-icon>
			</u-button> -->
		</view>

		<view class="assignTask-footer basic-container">
			<view class="assignTask-footer-content">
				<u-button :custom-style="customStyle" type="primary" shape="circle"
					class="u-flex-1 u-padding-left-80 u-padding-right-80" :disabled="disabled" @click="handle">预览作业
				</u-button>
			</view>
		</view>
		<!-- 日历 -->
		<u-popup v-model="CalendarShow" mode="bottom" :safe-area-inset-bottom="true">
			<xWeekDateCalendar :onlyMonth="true" :checkedDateList="assignDates" @selected-change="bindDateChange"
				@deselect="CalendarShow = false" @selectList-show="bindDateRangeChange"></xWeekDateCalendar>
		</u-popup>
		<!-- 选择定时还是定数 -->
		<!-- <u-select v-model="sportTypeShow" :list="[{label:'定时',value:1},{label:'定数',value:2}]" @confirm="confirmSporTime">
		</u-select> -->
		<!-- 运动类型 -->
		<u-select v-model="sportTypeShow" :list="sportTypeList" @confirm="confirmSporType">
			<!-- 无效的插槽 -->
			<!-- <template>
				<view class="select-bar">
					<view :class="{ 'is-active': calculateType === 1 }" @click="bindSportType(1)">
						定时
					</view>
					<view :class="{ 'is-active': calculateType === 2 }" @click="bindSportType(2)">
						定数
					</view>
				</view>
			</template> -->
		</u-select>
		<!-- 组数 -->
		<u-select v-model="actionGroupShow" :list="actionGroups" @confirm="confirmactionGroup"></u-select>
		<!-- 性别 -->
		<u-select v-model="partStatusShow" :list="partStatus" @confirm="confirmPartStatus"></u-select>
		<!-- 难度标准 -->
		<u-select v-model="sportDifficultyShow" :list="sportDifficultyList" @confirm="confirmSportDifficulty">
		</u-select>
	</view>
</template>

<script>
	let that = null;
	import xWeekDateCalendar from "pagesTask/components/x-week-date-calendar/x-week-date-calendar3.vue";
	import customizedItems from "../components/customized-items/index.vue";
	import aiSportItem from "../components/ai-sport-item/index.vue";
	import {
		showToast
	} from "@/common/util.js";
	import {
		getReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			xWeekDateCalendar,
			customizedItems,
			aiSportItem,
		},
		data() {
			return {
				customStyle: {
					height: "84rpx",
					padding: "18rpx 0",
					fontSize: "34rpx",
					fontWeight: 600,
				},
				classList: [], //选择的班级
				CalendarShow: false, //日历开关
				assignDates: [], // 布置日期集合
				replace: false, // 是否替换原有作业
				assignDateRange: [], // 用于展示布置日期
				operationBtnStyle: {
					height: "80rpx",
					boxShadow: "0px 2rpx 18rpx -8rpx #CACACA",
				},
				taskDetails: [], // 运动列表
				AIItemList: [], // 添加项目
				sportTypeShow: false,
				// sportTypeShow2:false,
				sportTypeList: [],
				partStatusShow: false,
				partStatus: [{
						label: "全部",
						value: 0,
					},
					{
						label: "男生",
						value: 1,
					},
					{
						label: "女生",
						value: 2,
					},
				],
				sportDifficulty: {
					allow: 0, // (0.允许；1.不允许)
					difficulty: 2 // （1.初级；2.中级）
				},
				sportDifficultyShow: false,
				sportDifficultyList: [{
						value: 1,
						label: "初级",
					},
					{
						value: 2,
						label: "中级",
					},
				],
				calculateType: -1,
				selectIndex: -1, // 被选中的下标
				actionGroupShow: false,
				actionGroups: [],
			};
		},
		onLoad() {
			that = this;
			uni.setNavigationBarTitle({
				title: this.$t("task.assign.assignTask.title"),
			});
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on("assignBasicData", function(data) {
				that.classList = data.classList;
				that.assignDates = [data.chooseDate];
				that.bindDateRangeChange([]);
				that.replace = data.replace;
			});
			for (let i = 1; i <= 8; i++) {
				this.actionGroups.push({
					value: i,
					label: `${i}组`,
				});
			}
		},
		onReady() {
			this.apiGetDifficulty()
		},
		computed: {
			...mapState(['xiaotiyunUser']),
			disabled() {
				return this.taskDetails.length ? false : true;
			},
		},
		watch: {
			AIItemList: {
				handler: function(value) {
					let addAISportList = [];
					if (value && value.length) {
						addAISportList = value.map((item) => ({
							actionId: item.id,
							calculateType: 1,
							difficulty: this.sportDifficulty.difficulty,
							// maleGroup: 0, // 男生 全部 动作组数
							// femaleGroup:0, // 女生 动作组数
							actionGroup: 3,
							name: item.aiSportName,
							num: 60000,
							partStatus: 0,
							taskType: 2,
							categoryId: item.categoryId, // 1 AI运动 3体能训练
						}));
					}
					console.log(value);
					this.taskDetails = [...this.taskDetails, ...addAISportList];
				},
			},
		},
		methods: {
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
			handleCalendar() {
				this.CalendarShow = true;
			},
			// 选择中的日期
			bindDateChange(e) {
				this.assignDates = e;
				this.CalendarShow = false;
			},
			bindDateRangeChange(value) {
				let data = [];
				if (value && value.length) {
					data = value.map((item) =>
						item.length > 1 ? `${item[0]} 至 ${item[item.length - 1]}` : item
					);
				} else {
					data = this.assignDates;
				}
				this.assignDateRange = data;
			},
			/**
			 * 添加运动
			 * @param {string} taskType 运动类型 1 自定义动作 2 AI运动
			 */
			addSportList(taskType) {
				if (taskType === 1) {
					this.taskDetails.push({
						taskType: 1,
						name: "",
						taskInfo: "",
						taskVideoUrl: "", //视频地址
					});
				} else if (taskType === 2) {
					this.$u.route({
						url: "/pagesTask/assign/assignTask/selectAi",
					});
				}
			},
			uploadVedio(data, index) {
				that.taskDetails[index] = data;
				uni.chooseVideo({
					sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
					extension: ["mp4"],
					success: function(res) {
						that.taskDetails[index].taskVideoUrl = res.tempFilePath;
					},
				});
			},
			handleDelete(index) {
				this.taskDetails.splice(index, 1);
			},
			handleSporType(data, index) {
				this.sportTypeShow = true;
				this.selectIndex = index;
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data);
				this.bindSportType(this.taskDetails[this.selectIndex].calculateType);
			},
			bindSportType(index) {
				let data = [];
				// if (index === 1) {
					data = [{
							value: 30000,
							label: "30秒",
						},
						{
							value: 60000,
							label: "1分钟",
						},
						{
							value: 120000,
							label: "2分钟",
						},
						{
							value: 180000,
							label: "3分钟",
						},
						{
							value: 240000,
							label: "4分钟",
						},
					];
				// } else if (index === 2) {
				// 	data = [];
				// 	for (let i = 1; i <= 200; i++) {
				// 		data.push({
				// 			value: i,
				// 			label: `${i}个`,
				// 		});
				// 	}
				// }
				this.sportTypeList = data;
				this.calculateType = index;
			},
			// confirmSporTime(value){
			// 	this.bindSportType(value[0].value)
			// 	this.sportTypeShow2 = true
			// },
			confirmSporType(value) {
				this.taskDetails[this.selectIndex].calculateType = this.calculateType;
				this.taskDetails[this.selectIndex].num = value[0].value;
			},
			handlePartStatus(data, index) {
				this.partStatusShow = true;
				this.selectIndex = index;
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data);
			},
			confirmPartStatus(value) {
				this.taskDetails[this.selectIndex].partStatus = value[0].value;
			},
			handleDifficulty(data, index) {
				if (this.sportDifficulty.allow) {
					return
				}
				this.sportDifficultyShow = true;
				this.selectIndex = index;
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data);
			},
			confirmSportDifficulty(value) {
				this.taskDetails[this.selectIndex].difficulty = value[0].value;
			},
			handleActionGroup(data, index) {
				this.actionGroupShow = true;
				this.selectIndex = index;
				this.taskDetails[this.selectIndex] = this.$u.deepClone(data);
			},
			confirmactionGroup(value) {
				this.taskDetails[this.selectIndex].actionGroup = value[0].value;
			},
			handle() {
				let data = [];
				for (let i = 0; i < this.taskDetails.length; i++) {
					if (this.$refs[`sportRef${i}`] && this.$refs[`sportRef${i}`].length) {
						const formData = this.$refs[`sportRef${i}`][0].formData;
						if ([0, 1].includes(formData.partStatus)) {
							formData.maleNum = formData.num;
							formData.maleGroup = formData.actionGroup;
						} else if (formData.partStatus === 2) {
							formData.femaleNum = formData.num;
							formData.femaleGroup = formData.actionGroup;
						}
						data.push(formData);
					}
				}
				data = data.filter((item) => {
					if (item.taskType === 1) {
						return item.name && item.taskInfo;
					}
					return item;
				});
				if (!data || !data.length) {
					return showToast("作业不能为空");
				}
				this.taskDetails = data;
				const params = {
					assignDates: this.assignDates, // 布置日期集合
					assignDateRange: this.assignDateRange, // 用于展示布置日期
					classList: this.classList, // 布置班级集合
					replace: this.replace, // 是否替换原有作业
					taskDetails: data,
				};
				uni.navigateTo({
					url: "/pagesTask/assign/assignTask/taskDetails",
					success: (res) => {
						res.eventChannel.emit("assignTaskParams", params);
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.assignTask {
		box-sizing: border-box;
		width: 100vw;
		padding: 20rpx 0 210rpx;
		padding-bottom: calc(210rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(210rpx + env(safe-area-inset-bottom));

		&-info {
			padding: 24rpx 40rpx 0;
			background-color: #ffffff;

			&-title {
				font-size: 34rpx;
				line-height: 48rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #202020;
				margin-bottom: 10rpx;
			}

			&-textLine {
				width: 4rpx;
				height: 20rpx;
				background: #94b7ff;
				margin: 0 10rpx;
			}

			&-text {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				line-height: 40rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #202020;
			}

			&-text+&-text {
				margin-left: 20rpx;
			}
		}

		.twoBtn {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			margin: 20rpx 0;
		}

		&-footer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #ffffff;
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
		border-bottom: 6rpx solid #12a5ee;
	}
</style>
