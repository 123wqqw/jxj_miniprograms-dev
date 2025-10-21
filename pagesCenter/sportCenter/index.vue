<template>
	<view class="u-padding-top-16 u-padding-bottom-16 u-padding-left-32 u-padding-right-32">
		<view class="sportCenter-item" @click="goRunnStats">
			<view class="u-margin-left-32">
				<view class="sportCenter-text" style="text-shadow: 0rpx 2rpx 4rpx #089D7E;">
					{{$t('center.runnStats')}}
				</view>
				<view class="btn" :style="{'color': '#32C8A9'}">
					查看
				</view>
			</view>
			<u-image width="180" height="180" src="/pagesCenter/static/images/icon_sport_stats.png" mode="aspectFit"></u-image>
			<u-image class="arrow-icon" width="24" height="24" src="/pagesCenter/static/images/md_icon_arrow-right.png" mode="aspectFit">
			</u-image>
		</view>
		<view class="sportCenter-item" @click="goRunDetails">
			<view class="u-margin-left-32">
				<view class="sportCenter-text" style="text-shadow: 0rpx 2rpx 4rpx #6458FF;">
					{{$t('center.runDetails')}}
				</view>
				<view class="btn" :style="{'color': '#6458FF'}">
					查看
				</view>
			</view>
			<u-image width="180" height="180" src="/pagesCenter/static/images/icon_sport_detail.png" mode="aspectFit"></u-image>
			<u-image class="arrow-icon" width="24" height="24" src="/pagesCenter/static/images/md_icon_arrow-right.png" mode="aspectFit">
			</u-image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			goRunnStats() {
				this.$u.route({
					url: 'pagesCenter/sportCenter/runnStats/index'
				})
			},
			goRunDetails() {
				this.$u.route({
					url: 'pagesCenter/sportCenter/runDetails/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.sportCenter-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		background: linear-gradient(92deg, #30C6AA 0%, #5CE295 100%);
		border-radius: 16rpx;
	}

	.sportCenter-item+.sportCenter-item {
		background: linear-gradient(90deg, #6458FF 0%, #9088FD 100%);
		margin-top: 32rpx;
	}

	.sportCenter-text {
		font-size: 48rpx;
		line-height: 1.5;
		font-weight: 500;
		color: #FFFFFF;
		margin-bottom: 24rpx;
	}

	.arrow-icon {
		position: absolute;
		top: 30rpx;
		right: 32rpx;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 56rpx;
		border-radius: 32rpx;
		background: #FFFFFF;
		font-size: 28rpx;
		font-weight: 400;
	}
</style>
