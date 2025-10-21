<template>
	<view class="detail-item-wrapper">
		<view class="item-bezel">
			<view class="top-part">
				<image class="item-icon" width="46" height="46" :src="sportIcon"></image>
				<text class="sport-name">{{ dataSource.name || '' }}</text>
				<text class="progressing" v-if="dataSource.status == 1">{{ $t('center.progressing') }}</text>
				<text class="finished" v-else>{{ $t('center.finished') }}</text>
				<text class="sport-date">{{ startDate }}</text>
			</view>
			<view class="middle-line"></view>
			<view class="bottom-part">
				<text class="title-state">{{ $t('center.casuallyClass.createTeacher') }}</text>
				<text>{{ dataSource.teacherName || '' }}</text>
				<text class="title-state">{{ $t('center.testCount') }}</text>
				<text class="title-state">{{ $t('common.boy') }}</text>
				<text class="title-num">{{ dataSource.maleNum || 0 }}</text>
				<text class="title-state">{{ $t('common.girl') }}</text>
				<text class="title-num">{{ dataSource.femaleNum }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { trainingSportIcons } from '../../../static/constant/sportConstant.js'
	import { dateFormat } from '@/common/util.js';

	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => { return {} }
			}
		},
		computed: {
			sportIcon() {
				if (!this.dataSource.sportItems || this.dataSource.sportItems.length == 0) {
					return '../../../static/images/icon-long-distance-race.png'
				}
				const sportItem = this.dataSource.sportItems[0]
				return trainingSportIcons[sportItem.sportItemCode]
			},
			startDate() {
				return dateFormat(new Date(this.dataSource.startTime), 'yyyy-MM-dd');
			}
		},
	}
</script>

<style scoped lang="scss">
	.detail-item-wrapper {
		padding: 20rpx 24rpx 20rpx 24rpx;
		background-color: #FAFAFA;
	}

	.item-bezel {
		height: 193rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(112, 112, 112, 0.1);
		border-radius: 24rpx;
	}

	.top-part {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		.item-icon {
			margin-left: 24rpx;
			width: 46rpx;
			height: 46rpx;
		}

		.sport-name {
			margin-left: 4rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #5C8FF7;
		}

		.progressing {
			margin-left: 16rpx;
			width: 72rpx;
			height: 34rpx;
			background: #E9F0FF;
			border-radius: 8rpx;
			font-size: 20rpx;
			color: #5C8FF7;
			line-height: 34rpx;
			text-align: center;
		}

		.finished {
			margin-left: 16rpx;
			width: 72rpx;
			height: 34rpx;
			background: #EEEEEE;
			border-radius: 8rpx;
			font-size: 20rpx;
			color: #999999;
			line-height: 34rpx;
			text-align: center;
		}

		.sport-date {
			margin-left: auto;
			margin-right: 24rpx;
			font-size: 24rpx;
			color: #999999;
		}
	}

	.middle-line {
		height: 3rpx;
		background-color: #eee;
	}

	.bottom-part {
		height: 110rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		.title-state {
			margin-left: 10rpx;
			font-size: 20rpx;
			color: #999999;
		}

		text:nth-child(1) {
			margin-left: 24rpx;
		}

		text:nth-child(2) {
			margin-left: 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}

		text:nth-child(3) {
			margin-left: 40rpx;
		}

		.title-num {
			margin-left: 10rpx;
			font-size: 36rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			color: #333333;
		}
	}
</style>