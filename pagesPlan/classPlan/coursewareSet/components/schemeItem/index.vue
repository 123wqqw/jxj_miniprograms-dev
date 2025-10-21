<template>
	<view class="selectScheme">
		<view class="u-flex u-row-between u-margin-bottom-20">
			<view class="">
				改善方案
			</view>
			<u-image src="/pagesPlan/static/icon_switch.png" width="32rpx" height="32rpx" mode="aspectFit"
				@click="$emit('click')">
			</u-image>
		</view>
		<view class="u-flex selectScheme-item">
			<view class="selectScheme-item-icon">
				<u-image width="100%" height="100%" src="/pagesPlan/static/icon_classplan_detail.png"></u-image>
			</view>
			<view class="selectScheme-item-value">
				<view class="u-line-1">
					{{dataSource.name}}
				</view>
				<view class="u-line-1">
					{{dataSource.planExplain || ""}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style scoped lang="scss">
	.selectScheme {
		padding: 10rpx 40rpx 34rpx;
		background-color: #fff;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #202020;
		line-height: 40rpx;

		&-item {
			height: 104rpx;

			&-icon {
				width: 104rpx;
				height: 104rpx;
				padding: 20rpx;
				background: rgba(67, 127, 249, 0.0500);
				border-radius: 8rpx;
				border: 1px solid #437FF9;
				margin-right: 20rpx;
			}

			&-value {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
			}
		}
	}
</style>
