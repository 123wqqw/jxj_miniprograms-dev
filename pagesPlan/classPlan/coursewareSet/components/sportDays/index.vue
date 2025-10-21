<template>
	<view class="sportDays">
		<view class="sportDays-header">
			<text>运动方案</text>
			<u-image v-if="currentData && currentData.length" src="/pagesPlan/static/icon_save.png" width="40rpx"
				height="40rpx" mode="aspectFit" @click="$emit('handle-save')">
			</u-image>
		</view>
		<template v-if="currentData && currentData.length">
			<view class="sportDays-operation">
				<u-icon name="arrow-left" color="#000" :size="24" @click="preDay"></u-icon>
				<view style="margin: 0 80rpx">第{{ currentDay }}/{{ totalDay }}天</view>
				<u-icon name="arrow-right" color="#000" :size="24" @click="nextDay"></u-icon>
			</view>
			<block v-for="item in currentData" :key="item.id">
				<view class="sportDays-item">
					<u-image :src="item.sportUrl" width="104rpx" height="104rpx" mode="aspectFit"
						@click="jumpSportdetailPage(item)">
					</u-image>
					<view class="sportDays-item-content" @click="onDataSource(item)">
						<view class="">
							<text>{{ item.sportName }}</text>
						</view>
						<view class="u-flex">
							<text>{{ handleSportTarget(item) }}</text>
							<u-icon name="close" color="#000" size="24"></u-icon>
							<text>{{ item.sportGroups }}组</text>
							<text class="u-margin-left-32">{{
                gender[item.gender].label || ""
              }}</text>
						</view>
					</view>
					<u-image src="/pagesPlan/static/icon_switch.png" width="32rpx" height="32rpx" mode="aspectFit"
						@click="jumpPageReplacement(item)">
					</u-image>
				</view>
			</block>
		</template>
		<template v-else>
			<u-empty src="/static/md_icon_empty1.png" text="暂无数据" :font-size="24" color="#B2B2B2" :icon-size="250"
				:marginTop="140">
			</u-empty>
		</template>
		<u-modal v-model="show" :show-title="false" @confirm="submitForm">
			<view class="u-padding-40">
				<u-form :model="form" ref="uForm">
					<u-form-item label="项目" label-width="120">
						<view class="u-flex u-row-right" @click="clickSportItem(form)">
							<text>{{ form.sportName }}</text>
							<text>{{ handleSportTarget(form) }}</text>
						</view>
					</u-form-item>
					<u-form-item label="组数" label-width="120">
						<view class="u-text-right" @click="actionGroupShow = true">
							{{ actionGroups[form.sportGroups - 1].label || "请选择" }}
						</view>
					</u-form-item>
					<u-form-item label="性别" label-width="120">
						<view class="u-text-right" @click="genderShow = true">
							{{ gender[form.gender].label || "请选择" }}
						</view>
					</u-form-item>
					<u-form-item label="达标线(非必填)" label-width="240" v-if="form.categoryId !== 3">
						<view class="u-flex">
							<u-input class="u-flex-1 u-margin-right-8" v-model.number="form.standard"
								input-align="right" type="number" placeholder="请输入" @input="numberInput" />
							<view class="u-text-right form-size">
								{{ form.sportModel ? "个" : "秒" }}
							</view>
						</view>
					</u-form-item>
					<u-form-item label="难度标准" label-width="240" v-if="form.categoryId !== 3">
						<view class="u-text-right" @click="sportDifficultyShow = true">
							{{ sportDifficulty[form.sportDifficulty - 1].label || "请选择" }}
						</view>
					</u-form-item>
				</u-form>
			</view>
		</u-modal>
		<u-select v-model="AIModeShow" :list="AIModeList" @confirm="confirm">
			<template #other>
				<view class="select-bar">
					<view :class="{ 'is-active': aiCurrent === 1 }" @click="bindAIChange(1)" >
						定时
					</view>
					<view :class="{ 'is-active': aiCurrent === 0 }" @click="bindAIChange(0)" >
						定数
					</view>
				</view>
			</template>
		</u-select>
		<u-select v-model="genderShow" :list="gender" @confirm="confirmgender"></u-select>
		<u-select v-model="sportDifficultyShow" :list="sportDifficulty" @confirm="confirmSportDifficulty"></u-select>
		<!-- 组数 -->
		<u-select v-model="actionGroupShow" :list="actionGroups" @confirm="confirmactionGroup"></u-select>
	</view>
</template>

<script>
	import {
		mapMutations
	} from "vuex";
	export default {
		props: {
			dataSouce: {
				type: Array,
				default: () => {
					return [];
				},
			},
			coursewareId: {
				type: String,
				default: "",
			},
		},
		data() {
			return {
				currentDay: 1,
				show: false,
				form: {},
				genderShow: false,
				gender: [{
						value: 0,
						label: "女",
					},
					{
						value: 1,
						label: "男",
					},
					{
						value: 2,
						label: "全部",
					},
				],
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
				AIModeShow: false,
				AIModeList: [],
				actionGroupShow: false,
				actionGroups: [],
				aiCurrent: 1,
			};
		},
		mounted() {
			for (let i = 1; i <= 8; i++) {
				this.actionGroups.push({
					value: i,
					label: `${i}组`,
				});
			}
		},
		computed: {
			totalDay() {
				if (this.dataSouce && this.dataSouce.length) {
					return Math.max(...this.dataSouce.map((item) => item.days));
				}
				return 0;
			},
			currentData() {
				if (this.dataSouce && this.dataSouce.length) {
					return this.dataSouce.filter((item) => {
						return item.days === this.currentDay && item.show === 0;
					});
				}
				return [];
			},
		},
		methods: {
			...mapMutations(["setReplacement"]),
			numberInput() {
				const inputRule = /[^\d]/g;
				this.$nextTick(function() {
					this.form.standard = this.form.standard.replace(inputRule, "");
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
			jumpPageReplacement(data) {
				this.$u.route({
					url: "pagesPlan/classPlan/replacement/index",
					params: {
						option: encodeURIComponent(
							JSON.stringify({
								...data,
								coursewareId: this.coursewareId,
							})
						),
					},
				});
			},
			onDataSource(data) {
				this.show = true;
				this.form = data;
			},
			confirmgender(value) {
				this.form.gender = value[0].value;
			},
			confirmSportDifficulty(value) {
				this.form.sportDifficulty = value[0].value;
			},
			confirmactionGroup(value) {
				this.form.sportGroups = value[0].value;
			},
			submitForm() {
				this.setReplacement(this.form);
			},
			// 点击弹框项目
			clickSportItem(item) {
				this.bindAIChange(item.sportModel);
				this.AIModeShow = true
			},
			// 项目弹框选择切换
			bindAIChange(index) {
				this.aiCurrent = index;
				if (index === 1) {
					this.AIModeList = [{
							value: 0.5,
							label: "30秒",
						},
						{
							value: 1,
							label: "1分钟",
						},
						{
							value: 2,
							label: "2分钟",
						},
						{
							value: 3,
							label: "3分钟",
						},
						{
							value: 4,
							label: "4分钟",
						},
					];
				} else {
					let data = [];
					for (let i = 1; i <= 200; i++) {
						data.push({
							value: i,
							label: `${i}个`,
						});
					}
					this.AIModeList = data;
				}
			},
			// 运动项目弹框确认
			confirm(value) {
				this.form.sportModel = this.aiCurrent;
				if (this.form.sportModel) {
					this.form.sportTarget = value[0].value * 60 * 1000;
				} else {
					this.form.sportTarget = value[0].value;
				}
				// this.form.standardModel = this.form.sportModel
			},
			jumpSportdetailPage(data) {
				this.$u.route({
					url: '/pagesPlan/classPlan/replacement/sportDetail',
					params: {
						id: data.sportId
					},
				})
			},
			// 处理运动目标数值展示
			handleSportTarget(item) {
				if (item.sportModel) {
					const second = Math.round(item.sportTarget / 1000)
					if (second >= 60) {
						return (second / 60).toFixed(0) + '分钟'
					} else {
						return second + '秒'
					}
				} else {
					return item.sportTarget + '个'
				}
			}
		},
	};
</script>

<style scoped lang="scss">
	.sportDays {
		padding: 30rpx 40rpx;
		background-color: #fff;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #202020;
		line-height: 40rpx;

		&-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 36rpx;
		}

		&-operation {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 30rpx;
		}

		&-item {
			display: flex;
			padding: 20rpx;
			background: #ffffff;
			box-shadow: 0px 2rpx 18rpx -8rpx #6695f6;
			border-radius: 22rpx;

			&-content {
				flex: 1;
				height: 104rpx;
				margin: 0 30rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
			}
		}

		&-item+&-item {
			margin-top: 30rpx;
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
