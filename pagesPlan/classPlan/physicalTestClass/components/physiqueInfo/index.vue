<template>
	<view class="physiqueInfo">
		<view class="physiqueInfo-content">
			<view class="physiqueInfo-header">
				<view class="physiqueInfo-header-title">体质均值</view>
			</view>
			<view class="physiqueInfo-text">
				反映了体质测试各项指标的原始成绩、单项评级与合格标准，并能从雷达图中观察近两次体测结果的综合对比。
			</view>
			<slot></slot>
			<view class="physiqueInfo-texts" @click="$emit('click')">
				体测指标解读 >
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		}
	}
</script>

<style scoped lang="scss">
	.physiqueInfo {
		background-color: #fff;
		padding: 10rpx 0;
		border-radius: 26rpx;
		margin-bottom: 80rpx;

		&-content {
			padding: 24rpx;
			border-radius: 26rpx;
			background: linear-gradient(180deg, #FFF3E1 0%, #fff 10%, #fff 70%, #FFF3E1 100%);
			box-shadow: 0px 0px 19px 0px rgba(112, 112, 112, 0.1000);
		}

		&-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 44rpx;
			font-weight: 600;
			color: #202020;
			margin-bottom: 40rpx;

			&-title {
				position: relative;
			}

			&-title::after {
				content: " ";
				position: absolute;
				bottom: -4rpx;
				left: 0;
				width: 80%;
				height: 10rpx;
				background: #26CDA0;
			}

			&-image {
				width: 40rpx;
				height: 40rpx;
			}
		}

		&-text {
			font-size: 24rpx;
			line-height: 1.5;
			font-weight: 400;
			color: #464646;
		}

		&-texts {
			font-size: 24rpx;
			line-height: 1.5;
			font-weight: 400;
			text-align: center;
			color: #FC8332;
		}
	}
</style>
