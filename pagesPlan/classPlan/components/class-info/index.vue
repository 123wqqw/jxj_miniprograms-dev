<template>
	<view class="class-info">
		<view class="class-name">
			{{dataSource.aliasClassName ? dataSource.aliasClassName : dataSource.className}}
		</view>
		<view class="class-value">
			<view style="color: #202020;">
				{{ dataSource.classSerialNumber || classId}}
			</view>
			<view class="u-flex">
				<view class="u-flex-1 u-flex-wrap">班级人数：{{dataSource.classNumber || 0}}</view>
				<view class="u-flex-1 u-flex-wrap">体测人数：{{dataSource.physicalNumber || 0}}</view>
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
			},
			classId: {
				type: String,
				default: ""
			}
		},
		data() {
			return {}
		}
	}
</script>

<style scoped lang="scss">
	.class-info {
		display: flex;
		padding: 40rpx;
		background: #FFFFFF;
		font-size: 28rpx;
		line-height: 40rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #202020;
	}

	.class-name {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 120rpx;
		padding: 15rpx;
		margin-right: 18rpx;
		color: #FFFFFF;
		text-align: center;
		background: #6695F6;
		border-radius: 8rpx;
	}

	.class-value {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
</style>
