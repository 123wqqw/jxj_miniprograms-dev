<template>
	<view class="template-info">
		<view class="template-info-switchDate">
			<view class="u-flex u-row-center">
				<u-icon name="arrow-left" color="#fff" size="30" @click="preDay"></u-icon>
				<view class="u-text-center" style="width: 200rpx">第{{ currentDay }}/{{ totalDay }}天</view>
				<u-icon name="arrow-right" color="#fff" size="30" @click="nextDay"></u-icon>
			</view>
		</view>
		<block v-for="(item, index) in sportInfos" :key="item.sportId">
			<view class="template-info-item">
				<u-image width="120rpx" height="120rpx" :src="item.imgUrl" mode="aspectFit"
					@click="jumpSportdetailPage(item)">
				</u-image>
				<view class="template-info-item-content" @click="handleInfo(item)">
					<view>{{ item.name }}</view>
					<view class="u-flex">
						<text v-if="item.calculateType === 1">{{
              item.actionNum / 1000 / 60 < 1
                ? `${item.actionNum / 1000}秒`
                : `${item.actionNum / 1000 / 60}分钟`
            }}</text>
						<text v-else>{{ item.actionNum }}个</text>
						<u-icon name="close" color="#000" size="24"></u-icon>
						<text>{{ item.actionGroup }}组</text>
						<text class="u-margin-left-32">{{
              partStatus[item.partStatus].label || "--"
            }}</text>
					</view>
				</view>
				<u-icon size="32" name="more-dot-fill" @click="handleOperation(item, index)"></u-icon>
			</view>
		</block>
		<view class="u-flex u-row-center u-padding-20">
			<u-button :custom-style="aiBtnStyle" shape="circle" @click="jumpPagesSelectAI">
				<u-icon name="plus" color="#000" size="28" label="添加AI动作项目" label-size="28" label-color="#000"
					margin-left="10"></u-icon>
			</u-button>
		</view>
		<view class="template-info-footer basic-container">
			<view class="template-info-footer-content">
				<u-button :custom-style="customStyle" type="primary" shape="circle"
					class="u-flex-1 u-padding-left-20 u-padding-right-20" @click="show = true">保存</u-button>
				<u-button :custom-style="customStyle" type="primary" shape="circle"
					class="u-flex-1 u-padding-left-20 u-padding-right-20" @click="jumpPagesAssign">布置作业</u-button>
			</view>
		</view>
		<!-- 编辑 -->
		<u-modal v-model="AISportInfoShow" :show-title="false">
			<view style="padding: 40rpx 40rpx 0">
				<u-form :model="AISportInfo" ref="uForm">
					<u-form-item label="项目" label-width="240">
						<view class="u-flex u-row-right form-size" @click="handleSportType">
							<text>{{ AISportInfo.name }}</text>
							<text v-if="AISportInfo.calculateType === 1">{{
                AISportInfo.actionNum / 1000 / 60 < 1
                  ? `${AISportInfo.actionNum / 1000}秒`
                  : `${AISportInfo.actionNum / 1000 / 60}分钟`
              }}</text>
							<text v-else>{{ AISportInfo.actionNum }}个</text>
						</view>
					</u-form-item>
					<u-form-item label="组数" label-width="240">
						<view class="u-text-right form-size" @click="actionGroupShow = true">
							{{ actionGroups[AISportInfo.actionGroup - 1].label || "请选择" }}
						</view>
					</u-form-item>
					<u-form-item label="性别" label-width="240">
						<view class="u-text-right form-size" @click="partStatusShow = true">
							{{ partStatus[AISportInfo.partStatus].label || "请选择" }}
						</view>
					</u-form-item>
					<u-form-item label="达标线(非必填)" label-width="240" v-if="AISportInfo.categoryId !== 3">
						<view class="u-flex">
							<u-input class="u-flex-1 u-margin-right-8" v-model.number="AISportInfo.standardNum"
								input-align="right" type="number" placeholder="请输入" :height="40"
								:custom-style="InputStyle" @input="numberInput" />
							<view class="u-text-right form-size">
								{{ AISportInfo.calculateType === 1 ? "个" : "秒" }}
							</view>
						</view>
					</u-form-item>
					<u-form-item label="难度标准" label-width="240" v-if="AISportInfo.categoryId !== 3">
						<view class="u-text-right form-size" @click="sportDifficultyShow = true">
							{{
                sportDifficulty[AISportInfo.difficulty - 1].label || "请选择"
              }}
						</view>
					</u-form-item>
				</u-form>
			</view>
		</u-modal>
		<!-- 运动类型 -->
		<u-select v-model="sportTypeShow" :list="sportTypeList" @confirm="confirmSporType">
			<template #other>
				<view class="select-bar">
					<view :class="{ 'is-active': AISportInfo.calculateType === 1 }" @click="bindSportType(1)">
						定时
					</view>
					<view :class="{ 'is-active': AISportInfo.calculateType === 2 }" @click="bindSportType(2)">
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
		<!-- 保存模板 -->
		<u-modal v-model="show" :show-title="false" @confirm="confirm" @cancel="show = false" ref="uModal"
			:async-close="true" :show-cancel-button="true" confirm-text="完成" cancel-text="未完成" cancel-color="#000000"
			confirm-color="#6EA6E5" border-radius="28">
			<view class="u-padding-40" v-if="show">
				<u-input v-model="templateName" placeholder="请输入方案名称" maxlength="20" :focus="true" />
			</view>
		</u-modal>
		<!-- 操作 -->
		<u-action-sheet :list="ActionSheetList" v-model="ActionSheetShow" :safe-area-inset-bottom="true"
			@click="onActionSheet"></u-action-sheet>
	</view>
</template>

<script>
	let that = null;
	import {
		URL
	} from "@/common/url.js";
	import {
		getReq,
		postReq
	} from "@/common/request.js";
	export default {
		data() {
			return {
				InputStyle: {
					fontSize: "28rpx",
					lineHeight: "1.5",
					color: "#5C8FF7",
				},
				option: {},
				customStyle: {
					height: "84rpx",
					padding: "18rpx 0",
					fontSize: "34rpx",
					fontWeight: 600,
				},
				aiBtnStyle: {
					width: "278rpx",
					height: "68rpx",
					padding: "14rpx",
					background: "#FFFFFF",
					boxShadow: "0 2rpx 18rpx -8rpx #6695F6",
					borderRadius: "40rpx",
				},
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
				currentDay: 1,
				totalDay: 0,
				dataSource: [], // 总数据集
				AIItemList: [], // 添加项目
				replaceItem: {}, // 替换项目
				AISportInfoShow: false,
				AISportInfo: {},
				AISportIndex: -1,
				sportTypeShow: false,
				sportTypeList: [],
				sportDifficultyShow: false,
				sportDifficulty: [{
						value: 1,
						label: "初级",
					},
					{
						value: 2,
						label: "中级",
					},
				],
				show: false,
				templateName: "",
				ActionSheetShow: false,
				ActionSheetList: [],
				actionGroupShow: false,
				actionGroups: [],
			};
		},
		onLoad() {
			that = this;
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on("assignBasicData", function(data) {
				that.option = data;
			});
		},
		mounted() {
			this.apiPostTemplateInfo();
			for (let i = 1; i <= 8; i++) {
				this.actionGroups.push({
					value: i,
					label: `${i}组`,
				});
			}
		},
		onPullDownRefresh() {
			this.apiPostTemplateInfo();
		},
		computed: {
			sportInfos() {
				let data = [];
				if (this.dataSource && this.dataSource.length) {
					data =
						this.dataSource.find((item) => {
							return item.days === this.currentDay;
						}).sportInfos || [];
				}
				return [...data];
			},
		},
		watch: {
			AIItemList: {
				handler: function(value) {
					let addAISportList = [];
					if (value && value.length) {
						addAISportList = value.map((item) => ({
							actionGroup: 3,
							actionNum: 60000,
							calculateType: 1,
							difficulty: 2,
							imgUrl: item.aiSportImg,
							name: item.aiSportName,
							partStatus: 0,
							sportId: item.id,
							standardNum: null,
							categoryId: item.categoryId, // 1 AI运动 3体能训练
						}));
					}
					this.dataSource.forEach((item) => {
						if (item.days === this.currentDay) {
							item.sportInfos = [...item.sportInfos, ...addAISportList];
						}
					});
				},
			},
			replaceItem: {
				handler: function(value) {
					if (value && JSON.stringify(value) !== "{}") {
						const {
							$index,
							...params
						} = value;
						this.dataSource.forEach((item) => {
							if (item.days === this.currentDay) {
								item.sportInfos.splice($index, 1, params);
							}
						});
					}
				},
			},
		},
		methods: {
			numberInput() {
				const inputRule = /[^\d]/g;
				this.$nextTick(function() {
					this.AISportInfo.standardNum = this.AISportInfo.standardNum.replace(
						inputRule,
						""
					);
				});
			},
			preDay() {
				this.currentDay > 1 &&
					this.currentDay <= this.totalDay &&
					(this.currentDay -= 1);
			},
			nextDay() {
				this.currentDay >= 1 &&
					this.currentDay < this.totalDay &&
					(this.currentDay += 1);
			},
			async apiPostTemplateInfo() {
				try {
					const result = await getReq(URL.apiPostTemplateInfo, {
						id: this.option.id,
					});
					if (result.data && result.data.length) {
						this.dataSource = result.data;
						this.totalDay = Math.max(...this.dataSource.map((item) => item.days));
					} else {
						this.totalDay = 0;
						this.dataSource = [];
					}
				} catch (error) {
					this.totalDay = 0;
					this.dataSource = [];
				} finally {
					uni.stopPullDownRefresh();
				}
			},
			//跳转到选择ai
			jumpPagesSelectAI() {
				this.$u.route({
					url: "/pagesTask/assign/assignTask/selectAi",
				});
			},
			handleInfo(data) {
				this.AISportInfoShow = true;
				this.AISportInfo = data;
			},
			handleOperation(data, $index) {
				this.ActionSheetShow = true;
				this.AISportInfo = data;
				this.AISportIndex = $index;
				let ActionSheetList = [{
						text: "编辑",
						fontSize: 24,
					},
					{
						text: "替换",
						fontSize: 24,
					},
				];
				if (this.sportInfos.length > 1) {
					ActionSheetList.push({
						text: "删除",
						fontSize: 24,
					});
				}
				this.ActionSheetList = ActionSheetList;
			},
			handleSportType() {
				this.sportTypeShow = true;
				this.bindSportType(this.AISportInfo.calculateType);
			},
			bindSportType(index) {
				this.AISportInfo.calculateType = index;
				let data = [];
				if (this.AISportInfo.calculateType === 1) {
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
				} else if (this.AISportInfo.calculateType === 2) {
					data = [];
					for (let i = 1; i <= 200; i++) {
						data.push({
							value: i,
							label: `${i}个`,
						});
					}
				}
				this.sportTypeList = data;
			},
			confirmSporType(value) {
				this.AISportInfo.actionNum = value[0].value;
			},
			confirmPartStatus(value) {
				this.AISportInfo.partStatus = value[0].value;
			},
			confirmSportDifficulty(value) {
				this.AISportInfo.difficulty = value[0].value;
			},
			confirmactionGroup(value) {
				this.AISportInfo.actionGroup = value[0].value;
			},
			async confirm() {
				try {
					const params = {
						grades: this.option.grades,
						name: this.templateName,
						templateDetails: this.dataSource,
					};
					const result = await postReq(URL.apiPostTemplateSave, {
						...params,
					});
					if (result.error === 10000) {
						uni.hideToast();
						uni.showToast({
							duration: 2000,
							icon: "none",
							title: "保存成功",
						});
						this.templateName = "";
					} else {
						uni.hideToast();
						uni.showToast({
							duration: 2000,
							icon: "none",
							title: result.message,
						});
					}
				} catch (e) {
					uni.hideToast();
					uni.showToast({
						duration: 2000,
						icon: "none",
						title: "请稍后再试",
					});
				} finally {
					this.show = false;
				}
			},
			jumpPagesAssign() {
				uni.navigateTo({
					url: "/pagesTask/assign/assignTemplate/index",
					success: function(res) {
						res.eventChannel.emit("params", {
							taskDetails: that.dataSource,
							classList: that.option.classList,
							replace: that.option.replace,
							templateId: that.option.id,
						});
					},
				});
			},
			onActionSheet(index) {
				switch (index) {
					case 0:
						this.AISportInfoShow = true;
						break;
					case 1:
						uni.navigateTo({
							url: "/pagesTask/assign/replacement/index",
							success: function(res) {
								res.eventChannel.emit("params", {
									// ...that.AISportInfo,
									id: that.AISportInfo.sportId,
									$index: that.AISportIndex,
								});
							},
						});
						break;
					case 2:
						this.dataSource.forEach((item) => {
							if (item.days === this.currentDay) {
								item.sportInfos.splice(that.AISportIndex, 1);
							}
						});
						break;
					default:
						break;
				}
			},
			jumpSportdetailPage(data) {
				this.$u.route({
					url: '/pagesTask/assign/assignTask/sportDetail',
					params: {
						id: data.sportId
					},
				})
			}
		},
	};
</script>

<style scoped lang="scss">
	.template-info {
		box-sizing: border-box;
		width: 100vw;
		padding: 30rpx 45rpx 210rpx;
		padding-bottom: calc(210rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(210rpx + env(safe-area-inset-bottom));

		&-switchDate {
			box-sizing: border-box;
			margin-bottom: 30rpx;
			padding: 30rpx;
			background: #6695f6;
			box-shadow: 0px 2rpx 18rpx -8rpx #6695f6;
			border-radius: 22rpx;
			font-size: 28rpx;
			line-height: 40rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #ffffff;
		}

		&-switchDay {
			margin: 30rpx 0;
			font-size: 28rpx;
			line-height: 40rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #848484;
		}

		&-item {
			display: flex;
			padding: 20rpx;
			background: #ffffff;
			box-shadow: 0px 2rpx 18rpx -8rpx #6695f6;
			border-radius: 22rpx;
			margin-bottom: 30rpx;

			&-content {
				box-sizing: border-box;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 120rpx;
				padding: 0 30rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #202020;
				line-height: 40rpx;
			}
		}

		&-footer {
			position: fixed;
			z-index: 1;
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

	.form-size {
		color: #5c8ff7;
	}
</style>
