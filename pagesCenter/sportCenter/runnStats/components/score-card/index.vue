<template>
	<view class="score-card">
		<view class="u-flex u-row-center">
			<view class="score-titleLine" :style="{
				background: bgColor
			}"></view>
			<view class="score-title">
				{{label}}
			</view>
			<u-icon name="question-circle" size="20" v-if="tips" @click="show = true"></u-icon>
		</view>
		<view class="score-value u-line-1">
			{{value}}
			<slot></slot>
		</view>
		<u-modal v-model="show" :content="tips" :show-title="false" confirm-text="知道了" confirm-color="#5C8FF7"
			border-radius="24"></u-modal>
	</view>
</template>

<script>
	export default {
		props: {
			label: {
				type: String,
				default: "--"
			},
			value: {
				type: [String, Number],
				default: ""
			},
			tips: {
				type: [String, Number],
				default: ""
			},
			bgColor: {
				type: String,
				default: "#5C8FF7"
			}
		},
		data() {
			return {
				show: false
			}
		},
		methods: {}
	}
</script>

<style scoped lang="scss">
	.score-card {
		margin: 0 12rpx;
		padding: 24rpx 0;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 14rpx 0px rgba(243, 243, 243, 0.5000);
		border-radius: 16rpx;
		border: 1rpx solid #F7F7F7;
	}

	.score-titleLine {
		width: 10rpx;
		height: 24rpx;
		background: #5C8FF7;
		border-radius: 5rpx;
	}

	.score-title {
		margin: 0 8rpx 0 4rpx;
		font-size: 28rpx;
		line-height: 1.5;
		font-weight: 400;
		color: #707070;
	}

	.score-value {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 68rpx;
		line-height: 56rpx;
		font-size: 48rpx;
		font-weight: bold;
		color: #202020;
	}
</style>
