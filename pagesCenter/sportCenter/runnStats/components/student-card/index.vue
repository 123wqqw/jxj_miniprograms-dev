<template>
	<view class="students-info" @click="$emit('click',dataSource)">
		<view class="students-info-left">
			<u-avatar :src="dataSource.avatar" size="96">
			</u-avatar>
			<view class="students-info-item u-margin-left-16 u-font-md">
				<view style="color: #202020;">
					{{dataSource.nickName || dataSource.name || '--'}}
				</view>
				<view style="color: #707070;">
					{{dataSource.gender === 0 ? '女':'男'}} {{dataSource.studentAccount}}
				</view>
			</view>
		</view>
		<view class="students-info-right">
			<view class="students-info-item u-margin-right-16">
				<view class="u-flex">
					{{$t('center.runKilometers')}}：
					<view class="text-blue">
						{{dealNumber(computeNumber(dataSource.runKilometers, '/', 1000).result) || '0'}}
					</view>
				</view>
				<view class="u-flex">
					{{$t('center.complete')}}：
					<view class="text-blue">
						{{dealNumber(computeNumber(dataSource.completeRun, '/', 1000).result) || '0'}}
					</view>
					/
					<view class="">
						{{dealNumber(computeNumber(dataSource.semesterGoal, '/', 1000).result) || '0'}}
					</view>
				</view>
			</view>
			<u-icon size="32" name="arrow-right"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		computeNumber,
		dealNumber
	} from '@/common/util.js'
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
				dealNumber
			}
		}
	}
</script>

<style scoped lang="scss">
	.students-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 24rpx 16rpx;
		padding: 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 8rpx 0rpx rgba(112, 112, 112, 0.1000);
		border-radius: 24rpx;

		&-left,
		&-right {
			display: flex;
			align-items: center;
		}

		&-right {
			font-size: 24rpx;
			font-weight: 400;
			color: #464646;
			line-height: 1.5;
			font-weight: bold;
		}

		&-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 96rpx;
		}
	}

	.text-blue {
		color: #5C8FF7;
	}
</style>
