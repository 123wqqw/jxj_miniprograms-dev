<template>
	<view class="training-item-wrapper">
		<view class="item-bezel" @click="clickItem">
			<view class="top-part">
				<image class="item-icon" width="46" height="46" :src="sportIcon"></image>
				<text class="sport-name">{{ dataSource.name || '' }}</text>
				<text class="progressing" v-if="dataSource.status == 1">{{ $t('center.progressing') }}</text>
				<text class="finished" v-else>{{ $t('center.finished') }}</text>
				<text class="device-type">{{ $t('center.device') + "：" + handleSourceState() }}</text>
				<text class="sport-date">{{ startDate }}</text>
			</view>
			<view class="middle-line"></view>
			<view class="bottom-part">
				<text class="test-class">{{ $t('center.classTraining.testClass') }}</text>
				<text class="class-name">{{ handleClassName() }}
					<!-- {{ dataSource.className || '' }} -->
				</text>
				<text class="test-count">{{ $t('center.testCount') }}</text>
				<text class="person-count">{{ (dataSource.completeNum || 0) + '/' + (dataSource.total || 0) }}</text>
				<image class="arrow-icon" src="../../../../static/images/common/arrow-black.png" mode="aspectFit">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import { trainingSportIcons } from '../../../static/constant/sportConstant.js'
	import { dateFormat } from '@/common/util.js';
	import ClassUtil from '@/common/utility/ClassUtil.js';
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
		methods: {
			// 点击项目
			clickItem() {
				this.$emit('click-item', this.dataSource)
			},
			// 处理班级名称
			handleClassName() {
				if (this.dataSource.aliasClassName) {
					// return this.$t(ClassUtil.gradeNameI18n(this.dataSource.grade)) + this.dataSource.aliasClassName;
					return this.dataSource.aliasClassName;
				} else {
					return this.dataSource.className;
				}
			},
			// 处理设备来源：1.一体机；2.智慧平板
			handleSourceState() {
				const source = this.dataSource.source;
				if (source == 1) {
					return this.$t('center.allInOne');
				} else if (source == 2) {
					return this.$t('center.wisdomPad');
				}
				return '';
			}
		}
	}
</script>

<style scoped lang="scss">
	.training-item-wrapper {
		padding: 0rpx 24rpx 20rpx 24rpx;
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

		.device-type {
			margin-left: 16rpx;
			font-size: 24rpx;
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

		.test-class {
			margin-left: 24rpx;
			font-size: 20rpx;
			color: #999999;
		}

		.class-name {
			margin-left: 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}

		.test-count {
			margin-left: 40rpx;
			font-size: 20rpx;
			color: #999999;
		}

		.person-count {
			margin-left: 10rpx;
			font-size: 36rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			color: #333333;
		}

		.arrow-icon {
			margin-left: auto;
			margin-right: 24rpx;
			width: 34rpx;
			height: 34rpx;
		}
	}
</style>