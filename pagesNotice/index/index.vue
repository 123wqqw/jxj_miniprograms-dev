<template>
	<view class="pagesNotice">
		<view class="pagesNotice-item" @click="jumpLeavenoticePages">
			<image class="pagesNotice-item-image" src="/pagesNotice/static/icon_message.png" mode="aspectFit"></image>
			<view class="pagesNotice-item-content">
				<view class="pagesNotice-item-content-title">
					学生请假通知
				</view>
				<view class="pagesNotice-item-content-text">
					<text>当前有</text>
					<text class="primary-color text-blod" style="margin: 0 4px;">{{notices}}</text>
					<text>个学生请假未处理</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getReq,
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	export default {
		data() {
			return {
				notices: 0
			}
		},
		onReady() {
			this.getNoticeCount()
		},
		methods: {
			getNoticeCount() {
				getReq(URL.apiGetNoticeCount).then(res => {
					this.notices = res.data || 0
				}).catch(() => {
					this.notices = 0
				})
			},
			jumpLeavenoticePages() {
				uni.navigateTo({
					url: "/pagesNotice/leaveNotice/index",
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.pagesNotice {
		padding: 44rpx 40rpx;

		&-item {
			display: flex;
			align-items: center;
			padding: 38rpx 36rpx;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 16rpx 0px rgba(219, 219, 219, 0.5);
			border-radius: 18rpx;
			border: 1rpx solid #F1F2F3;

			&-image {
				width: 80rpx;
				height: 80rpx;
				margin-right: 36rpx;
			}

			&-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 80rpx;
				overflow: hidden;

				&-title {
					font-size: 30rpx;
					font-weight: 500;
					color: #202020;
					line-height: 42rpx;
				}

				&-text {
					font-size: 24rpx;
					font-weight: 500;
					color: #707070;
					line-height: 34rpx;
				}
			}
		}
	}

	.primary-color {
		color: #5C8FF7;
	}

	.text-blod {
		font-weight: bold;
	}
</style>