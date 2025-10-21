<template>
	<view class="aiSportItem">
		<view class="u-flex u-row-between u-margin-bottom-20">
			<view class="u-font-34"> 项目{{ index + 1 }} </view>
			<u-image width="34rpx" height="34rpx" src="/pagesTask/static/images/removeA.png" mode="aspectFit"
				@click="$emit('delete')">
			</u-image>
		</view>
		<u-form :model="formData" ref="uForm">
			<u-form-item label="项目" label-width="240">
				<view class="u-flex u-row-right form-size" @click="handleSporType">
					<text style="margin-right: 8rpx;">{{ formData.name }} </text>
					<text v-if="formData.calculateType === 1">{{
            formData.num / 1000 / 60 < 1
              ? `${formData.num / 1000}秒`
              : `${formData.num / 1000 / 60}分钟`
          }}</text>
					<text v-else>{{ formData.num }}个</text>
				</view>
			</u-form-item>
			<u-form-item label="组数" label-width="240">
				<view class="u-text-right form-size" @click="handleActionGroup">
					{{ actionGroups[formData.actionGroup - 1].label || "请选择" }}
				</view>
			</u-form-item>
			<u-form-item label="性别" label-width="240">
				<view class="u-text-right form-size" @click="handlePartStatus">
					{{ partStatus[formData.partStatus].label || "请选择" }}
				</view>
			</u-form-item>
			<u-form-item label="达标线(非必填)" label-width="240" v-if="formData.categoryId !== 3">
				<view class="u-flex">
					<u-input class="u-flex-1 u-margin-right-8" v-model.number="formData.standardNum" input-align="right"
						type="number" @input="numberInput" :placeholder="disabled ? '' : '请输入'" :height="40"
						:custom-style="InputStyle" :disabled="disabled" />
					<view class="u-text-right form-size" v-if="formData.standardNum">
						{{ formData.calculateType === 1 ? "个" : "秒" }}
					</view>
				</view>
			</u-form-item>
			<u-form-item label="难度标准" label-width="240" v-if="formData.categoryId !== 3">
				<view class="u-text-right form-size" @click="handleDifficulty">
					{{ sportDifficulty[formData.difficulty - 1].label || "请选择" }}
				</view>
			</u-form-item>
		</u-form>
	</view>
</template>

<script>
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => {
					return {
						categoryId: 1,
					};
				},
			},
			index: {
				type: Number,
				default: 0,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				formData: {},
				InputStyle: {
					fontSize: "28rpx",
					lineHeight: "1.5",
					color: "#5C8FF7",
				},
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
				sportDifficulty: [{
						value: 1,
						label: "初级",
					},
					{
						value: 2,
						label: "中级",
					},
				],
				actionGroups: [],
			};
		},
		watch: {
			dataSource: {
				handler: function handler(value) {
					let num = `${this.dataSource.num}个`;
					if (this.dataSource.calculateType === 1) {
						num =
							this.dataSource.num / 1000 / 60 < 1 ?
							`${this.dataSource.num / 1000}秒` :
							`${this.dataSource.num / 1000 / 60}分钟`;
					}
					const length =
						this.dataSource.name.indexOf(num) === -1 ?
						this.dataSource.name.length :
						this.dataSource.name.indexOf(num);
					const name = this.dataSource.name.substring(0, length);

					this.formData = {
						...this.dataSource,
						name,
					};
				},
				deep: true,
				immediate: true,
			},
		},
		mounted() {
			for (let i = 1; i <= 8; i++) {
				this.actionGroups.push({
					value: i,
					label: `${i}组`,
				});
			}
		},
		methods: {
			handleSporType() {
				if (this.disabled) {
					return;
				}
				this.$emit("handleSporType", this.formData);
			},
			handlePartStatus() {
				if (this.disabled) {
					return;
				}
				this.$emit("handlePartStatus", this.formData);
			},
			handleActionGroup() {
				if (this.disabled) {
					return;
				}
				this.$emit("handleActionGroup", this.formData);
			},
			handleDifficulty() {
				if (this.disabled) {
					return;
				}
				this.$emit("handleDifficulty", this.formData);
			},
			numberInput() {
				const inputRule = /[^\d]/g;
				this.$nextTick(function() {
					this.formData.standardNum = this.formData.standardNum.replace(
						inputRule,
						""
					);
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	.aiSportItem {
		margin: 40rpx;
		padding: 20rpx;
		background: #fff;
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 400;
		color: #000000;
	}

	.form-size {
		color: #5c8ff7;
	}
</style>
