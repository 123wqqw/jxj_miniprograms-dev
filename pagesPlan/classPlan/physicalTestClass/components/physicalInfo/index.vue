<template>
	<view class="physicalInfo">
		<view class="physicalInfo-content">
			<view class="physicalInfo-header">
				<view class="physicalInfo-header-title"></view>
				<view class="physicalInfo-header-score">
					<text class="physicalInfo-header-score_label">平均分：</text>
					<text class="physicalInfo-header-score_value">{{dataSource.avgScore}}</text>
					<text class="physicalInfo-header-score_unit">分</text>
				</view>
			</view>
			<view class="physicalInfo-banner">
				<view style="flex: 1;margin-right: 24rpx;">
					<physical-info-banner label="平均身高" :value="dataSource.height" />
				</view>
				<view style="flex: 1;">
					<physical-info-banner label="平均体重" :value="dataSource.weight" />
				</view>
			</view>
			<block v-for="(item,index) in dataSource.physicalReports" :key="index">
				<physical-info-item :dataSource="item" />
			</block>
		</view>
	</view>
</template>

<script>
	import physicalInfoBanner from './components/physicalInfoBanner.vue'
	import physicalInfoItem from './components/physicalInfoItem.vue'
	export default {
		components: {
			physicalInfoBanner,
			physicalInfoItem
		},
		props: {
			dataSource: {
				type: Object,
				default: () => {
					return {}
				}
			},
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style scoped lang="scss">
	.physicalInfo {
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

			&-title {
				position: relative;
				width: 180rpx;
				height: 44rpx;
			}

			&-title:after {
				content: '体测数据';
				width: 100%;
				height: 44rpx;
				line-height: 44rpx;
				position: absolute;
				bottom: 0;
				left: 0;
				font-size: 44rpx;
				font-weight: 600;
				color: #202020;
				z-index: 1;
			}

			&-title:before {
				content: " ";
				position: absolute;
				bottom: 0;
				left: 0;
				width: 80%;
				height: 10rpx;
				background: #FC8333;
			}

			&-score_label {
				font-size: 28rpx;
				font-weight: 600;
				color: #202020;
			}

			&-score_value {
				font-size: 48rpx;
				font-weight: bold;
				color: #FC8333;
				margin-right: 4rpx;
			}

			&-score_unit {
				font-size: 28rpx;
				font-weight: 400;
				color: #202020;
			}
		}

		&-banner {
			display: flex;
			align-items: center;
			padding: 40rpx 0;
		}
	}
</style>
