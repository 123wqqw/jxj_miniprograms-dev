<template>
	<view class="userInfo-content">
		<view class="userInfo-name">
			{{dataSource.aliasClassName ? dataSource.aliasClassName : dataSource.className}}
		</view>
		<view class="userInfo-content-block">
			<view class="userInfo-content-item u-line-1">
				{{ dataSource.classSerialNumber || dataSource.className}}
			</view>
			<view class="userInfo-content-item u-line-1">
				班级人数：{{dataSource.classNumber || 0}}
			</view>
			<view class="userInfo-content-item u-line-1">
				体测人数：{{dataSource.physicalNumber || 0}}
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
					return {
						className: "",
						classNumber: 0,
						grades: 0,
						physicalNumber: 0
					}
				}
			}
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style scoped lang="scss">
	view {
		box-sizing: border-box;
	}

	.userInfo-content {
		display: flex;
		padding: 48rpx 24rpx;
		background: #FFFFFF;

		&-block {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 144rpx;
			overflow: hidden;
		}

		&-item {
			font-size: 28rpx;
			line-height: 40rpx;
			font-weight: 400;
			color: #464646;
		}
	}

	.userInfo-name {
		width: 144rpx;
		height: 144rpx;
		padding: 30rpx;
		font-size: 28rpx;
		text-align: center;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 1.5;
		background: #6695F6;
		box-shadow: 0px 2rpx 18rpx -7rpx #6695F6;
		border-radius: 22rpx;
		margin-right: 32rpx;
	}
</style>
