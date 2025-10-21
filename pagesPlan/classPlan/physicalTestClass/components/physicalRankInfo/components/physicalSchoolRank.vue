<template>
	<view class="physicalSchoolRank">
		<image src="/pagesPlan/static/icon_rank.png" mode="aspectFit" style="width: 48rpx;height: 48rpx;"></image>
		<view class="physicalSchoolRank-content">
			<view class="physicalSchoolRank-item">
				<text class="physicalSchoolRank-item-label">学校总排名</text>
				<text class="physicalSchoolRank-item-value">{{dataSource.schoolRank || 0}}</text>
			</view>
			<view class="physicalSchoolRank-score">
				<view class="">
					总分<text style="color: #24D0A2;">{{dataSource.score || 0}}</text>分
				</view>
				<view class="">
					年级平均分<text style="color: #EC9131;">{{dataSource.averageScore || 0}}</text>分
				</view>
			</view>
			<view class="physicalSchoolRank-line" :style="{width: `${dataSource.score}%`}">
			</view>
			<view class="physicalSchoolRank-line" :style="{width: `${dataSource.averageScore}%`}">
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
						averageScore: 0,
						schoolRank: 0,
						score: 0
					}
				}
			}
		},
		data() {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.physicalSchoolRank {
		display: flex;
		padding: 24rpx 16rpx;
		margin-bottom: 24rpx;
		background: rgba(36, 208, 162, 0.0500);
		border-radius: 10rpx;
		border: 1rpx solid rgba(36, 208, 162, 0.5000);

		&-content {
			flex: 1;
			margin-left: 24rpx;
		}

		&-item {
			height: 48rpx;
			line-height: 48rpx;
			margin-bottom: 16rpx;

			&-label {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #464646;
				margin-right: 24rpx;
			}

			&-value {
				font-size: 40rpx;
				font-family: DINAlternate-Bold, DINAlternate;
				font-weight: bold;
				color: #24D0A2;
			}
		}

		&-score {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #464646;
			margin-bottom: 8rpx;
		}

		&-line {
			height: 4rpx;
			background: #24D0A2;
			border-radius: 0px 8rpx 8rpx 0px;
		}

		&-line:last-child {
			width: 100%;
			background: #FE9025;
		}

		&-line+&-line {
			margin-top: 4rpx;
		}
	}
</style>
