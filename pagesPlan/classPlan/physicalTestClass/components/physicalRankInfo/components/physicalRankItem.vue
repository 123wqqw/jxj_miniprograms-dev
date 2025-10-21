<template>
	<view class="physicalRankItem">
		<view class="physicalRankItem-content">
			<view class="physicalRankItem-label">
				<u-image class="physicalRankItem-label_image"
					:src="`/pagesPlan/static/icon_indicator_${dataSource.dimensionId}.png`" width="104rpx"
					height="104rpx" mode="aspectFit">
				</u-image>
				<view class="physicalRankItem-label_text" :style="{color:getScore(dataSource.score).color}">
					<view class="">
						{{getScore(dataSource.score).label}}
					</view>
					<view class="">
						{{dataSource.score}}
					</view>
				</view>
			</view>
			<view class="physicalRankItem-value">
				<view style="font-size: 28rpx;font-weight: bold;">
					{{dataSource.name}}
				</view>
				<view class="physicalRankItem-progress">
					<text>年级</text>
					<u-line-progress :percent="dataSource.gradePrecent" :show-percent="false" active-color="#7AA5FF"
						:height="10" style="margin:0 16rpx;flex:1"></u-line-progress>
					<text>{{dataSource.dimensionGradeRank ? `第${dataSource.dimensionGradeRank}名` : "暂无名次"}}</text>
				</view>
			</view>
		</view>
		<view class="physicalRankItem-tagging u-line-1">
			<text style="color: #FF5050;">*</text>
			<text>注：</text>
			<text>{{dataSource.tagging}}</text>
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
						dimensionClassRank: 0,
						dimensionGradeRank: 0,
						dimensionId: 10,
						name: "",
						score: 0,
						tagging: "",
						classPrecent: 10,
						gradePrecent: 0
					}
				}
			}
		},
		methods: {
			getScore(data) {
				if (data >= 85) {
					return {
						label: "优秀",
						color: "#34D099",
					}
				} else if (data >= 70 && data < 85) {
					return {
						label: "尚好",
						color: "#5C8FF7",
					}
				} else if (data >= 60 && data < 70) {
					return {
						label: "一般",
						color: "#FC8333",
					}
				} else {
					return {
						label: "较弱",
						color: "#FF5050",
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.physicalRankItem {
		padding: 24rpx 0;
		font-size: 24rpx;
		font-weight: 400;
		color: #707070;
		border-bottom: 1rpx solid #E6E6E6;

		&-tagging {
			font-size: 18rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #707070;
		}

		&-content {
			display: flex;
			margin-bottom: 16rpx;

		}

		&-label {
			display: flex;
			align-items: center;
			width: 238rpx;

			&_image {
				width: 104rpx;
				height: 104rpx;
			}

			&_text {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				height: 104rpx;
				font-size: 32rpx;
				line-height: 1.5;
				padding: 0 20rpx;
			}
		}


		&-value {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 104rpx;
			color: #464646;
		}


		&-progress {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			font-weight: 400;
		}
	}
</style>
