<template>
	<view class="classes-wrapper" @click="$emit('click',dataSource)">
		<view class="classes-info">
			<view class="u-flex">
				<view class="classes-name">
					<!-- {{dataSource.className || '--'}} -->
					{{ handleClassName() }}
				</view>
				<view class="classes-text">
					<view class="text-blod">
						{{dataSource.classNumber || '--'}}
					</view>
					<view class="">
						学生：{{dataSource.count || 0}}名
					</view>
				</view>
			</view>
			<u-icon size="32" name="arrow-right"></u-icon>
		</view>
		<view class="classes-line"></view>
		<view class="classes-score">
			<view class="u-flex u-line-1">
				<view>
					{{$t('center.runKilometers')}}：
				</view>
				<view class="color-primary">
					{{dealNumber(computeNumber(dataSource.runKilometers, '/', 1000).result) || '--'}}
				</view>
			</view>
			<view class="u-flex u-line-1">
				<view>
					{{$t('center.runCount')}}：
				</view>
				<view class="color-primary">
					{{dataSource.runCount || '--'}}
				</view>
			</view>
			<view class="u-flex u-line-1">
				<view>
					{{$t('center.completeRate')}}：
				</view>
				<view class="color-primary">
					{{dataSource.completeRate ? `${dealPersent(dataSource.completeRate)}%` :
							'--'}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		computeNumber,
		dealPersent,
		dealNumber
	} from '@/common/util.js'
	import ClassUtil from '@/common/utility/ClassUtil.js';
	
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
				computeNumber,
				dealPersent,
				dealNumber
			}
		},
		methods: {
			// 处理班级名称
			handleClassName() {
				if (this.dataSource.aliasClassName) {
					let grade = '';
					if (this.dataSource.grade) {
						grade = this.$t(ClassUtil.gradeNameI18n(this.dataSource.grade));
					}
					// return grade + this.dataSource.aliasClassName;
					return this.dataSource.aliasClassName;
				} else {
					return this.dataSource.className || '--';
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.classes-wrapper {
		margin: 0 24rpx 16rpx;
		padding: 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 8rpx 0rpx rgba(112, 112, 112, 0.1000);
		border-radius: 24rpx;
	}

	.classes-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;
	}

	.classes-name {
		box-sizing: border-box;
		width: 96rpx;
		height: 96rpx;
		padding: 16rpx 12rpx;
		font-size: 24rpx;
		font-weight: 500;
		text-align: center;
		color: #FFFFFF;
		background: #5C8FF7;
		border-radius: 12rpx;
	}

	.classes-text {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 96rpx;
		font-size: 28rpx;
		line-height: 1.5;
		margin-left: 24rpx;
	}

	.classes-score {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		line-height: 1.5;
		font-weight: 400;
		color: #464646;
	}

	.color-primary {
		color: #5C8FF7;
		font-weight: bold;
	}

	.classes-line {
		margin: 24rpx 0;
		width: 100%;
		border-bottom: 1rpx solid #BFBFBF;
	}

	.text-blod {
		font-weight: bold;
		color: #202020;
	}
</style>
