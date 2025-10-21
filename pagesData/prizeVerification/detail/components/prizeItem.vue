<template>
	<view class="prize-item-wrapper">
		<view class="item-bezel">
			<u-image width="80rpx" height="80rpx" border-radius="12" :src="dataSource.prizeUrl"></u-image>
			<view class="text-bezel">
				<text>{{dataSource.prizeName || ''}}</text>
				<text>{{$t('data.prizeVerification.detail.exchangeTime') + ':' +  handleExchangeTime()}}</text>
			</view>
			<view class="right-bezel">
				<text class="coin-num">{{'-' + (dataSource.goldCoin || '')}}</text>
				<image class="coin-img" src="../../../static/images/gold-coin.png" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
	import { dateFormat } from '@/common/util.js'
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => ({})
			},
		},

		methods: {
			// 处理兑换时间
			handleExchangeTime() {
				if (this.dataSource.exchangeTime) {
					return dateFormat(new Date(this.dataSource.exchangeTime), 'yyyy-MM-dd hh:mm:ss');
				}
				return '';
			}
		}
	}
</script>

<style scoped lang="scss">
	.prize-item-wrapper {
		width: 100%;
		height: 140rpx;
		display: flex;
		flex-direction: row;
		flex: 1;
	}

	.item-bezel {
		padding: 20rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		border: 1rpx solid #EEEEEE;
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
	}

	.text-bezel {
		margin-left: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;

		text:nth-child(1) {
			font-family: DINAlternate, DINAlternate;
			font-weight: bold;
			line-height: 40rpx;
			font-size: 28rpx;
			color: #333333;
		}

		text:nth-child(2) {
			font-size: 22rpx;
			color: #999999;
			line-height: 30rpx;
		}
	}

	.right-bezel {
		margin-left: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;

		.coin-num {
			font-family: DINAlternate, DINAlternate;
			font-weight: bold;
			font-size: 48rpx;
			color: #FB8333;
			line-height: 56rpx;
		}

		.coin-img {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>