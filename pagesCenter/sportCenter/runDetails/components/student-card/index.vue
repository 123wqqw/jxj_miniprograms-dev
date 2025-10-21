<template>
	<view class="students-info" @click="$emit('click',dataSource)">
		<view class="students-info-left">
			<u-avatar :src="dataSource.avatar || ''" size="96">
			</u-avatar>
			<view class="students-info-item u-margin-left-16 u-font-md u-line-1">
				<view style="color: #202020;">
					{{dataSource.nickName || dataSource.name || '--'}}
				</view>
				<view style="color: #707070;">
					{{dataSource.gender === 0 ? '女':'男'}} {{dataSource.studentId}}
				</view>
			</view>
		</view>
		<view class="students-info-right">
			<view class="students-info-item u-margin-right-16">
				<view class="u-text-right">
					{{dateFormat(new Date(dataSource.startTime))}}
				</view>
				<view class="u-flex u-row-right">
					<view class="">
						{{$t('center.runKilometers')}}：
					</view>
					<view style="color:#5C8FF7;font-weight: bold;">
						{{dealNumber(computeNumber(dataSource.length, '/', 1000).result)}}
					</view>
					<u-tag v-if="dataSource.status === 0" class="u-flex u-margin-left-10"
						:text="$t('center.unstandards')" size="mini" bg-color="#FFEEEB" border-color="#FFEEEB"
						color="#FE7154" />
					<u-tag v-if="dataSource.status === 1" class="u-flex u-margin-left-10" :text="$t('center.standards')"
						size="mini" bg-color="#E9F0FF" border-color="#E9F0FF" color="#5C8FF7" />
				</view>
			</view>
			<u-icon size="32" name="arrow-right" color="#707070"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		computeNumber,
		dateFormat,
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
				dateFormat,
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
		margin: 16rpx 24rpx 0;
		padding: 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 8rpx 0rpx rgba(112, 112, 112, 0.1000);
		border-radius: 24rpx;

		&-left {
			width: 50%;
			display: flex;
			align-items: center;
		}

		&-right {
			width: 50%;
			display: flex;
			align-items: center;
			font-size: 24rpx;
			font-weight: 400;
			color: #464646;
			line-height: 1.5;
		}

		&-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 96rpx;
			flex: 1;
		}
	}

	.text-blue {
		color: #5C8FF7;
	}
</style>
