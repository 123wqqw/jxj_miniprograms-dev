<template>
	<view class="student-detail-operation">
		<template v-if="studentIds && studentIds.length">
			<view class="u-flex">
				<u-button :custom-style="customStyle" type="primary" plain shape="circle"
					class="u-flex-1 u-padding-right-12" :disabled="studentId === studentIds[0]" @click="preStudent">
					上一位
				</u-button>
				<u-button :custom-style="customStyle" type="primary" shape="circle" class="u-flex-1 u-padding-left-12"
					:disabled="studentId === studentIds[studentIds.length - 1]" @click="nextStudent">
					下一位
				</u-button>
			</view>
		</template>
		<template v-if="corrected">
			<view class="u-margin-top-24">
				<u-button :custom-style="customStyle" type="primary" shape="circle" @click="onReviews">
					<text>{{comments? `重新${$t("task.correct.batchCorrectTask.commentInput")}`: $t( "task.correct.batchCorrectTask.commentInput")}}</text>
				</u-button>
			</view>
		</template>
		<template v-if="showButton ">
			<view class="u-margin-top-24">
				<u-button :custom-style="customStyle" type="primary" shape="circle" @click="onTips">
					<text>{{ $t("common.task") }}提醒</text>
				</u-button>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		props: {
			studentId: {
				type: String,
				default: ""
			},
			studentIds: {
				type: Array,
				default: () => {
					return []
				}
			},
			classManageType: {
				type: Number,
				default: 1
			},
			showButton: {
				type: Boolean,
				default: false
			},
			corrected: {
				type: Boolean,
				default: false
			},
			comments: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				customStyle: {
					height: "84rpx",
					padding: "18rpx 0",
					fontSize: "34rpx",
					fontWeight: 600,
				},
			}
		},
		methods: {
			preStudent() {
				const index = this.studentIds.indexOf(this.studentId)
				if (!index) {
					this.$emit('change', this.studentIds[0])
				} else {
					this.$emit('change', this.studentIds[index - 1])
				}
			},
			nextStudent() {
				const index = this.studentIds.indexOf(this.studentId)
				if (index === this.studentIds.length - 1) {
					this.$emit('change', this.studentIds[this.studentIds.length - 1])
				} else {
					this.$emit('change', this.studentIds[index + 1])
				}
			},
			// 显示提醒警告弹窗
			onTips() {
				this.$emit('onTips')
			},
			onReviews() {
				this.$emit('onReviews')
			}
		}
	}
</script>

<style scoped lang="scss">
	.student-detail-operation {
		position: fixed;
		z-index: 99;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #ffffff;
		box-shadow: 0px -3rpx 54rpx 0px rgba(208, 208, 208, 0.5);
		padding: 32rpx;
		padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
	}
</style>
