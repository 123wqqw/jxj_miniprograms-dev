<template>
	<view class="banner-item">
		<view class="text-bold">
			{{label}}
		</view>
		<view class="">
			{{ value || '--' }}
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			label: {
				type: String,
				default: ""
			},
			value: {
				type: [Number, String],
				default: ""
			}
		}
	}
</script>

<style scoped lang="scss">
	.banner-item {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 158rpx;
		background: #F2F2F2;
		border-radius: 24rpx;
		padding: 16rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #464646;
		text-align: center;
	}

	.text-bold {
		font-weight: bold;
		font-size: 28rpx;
	}
</style>
