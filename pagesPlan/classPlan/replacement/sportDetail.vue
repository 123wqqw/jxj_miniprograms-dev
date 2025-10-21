<template>
	<view class="sportDetail">
		<view class="video-wrap">
			<video class="video-content" :src="sportDetail.guideVideo" controls></video>
		</view>
		<view class="sportName">
			{{sportDetail.aiSportName}}
		</view>
		<view class="sport-text">
			<view class="sport-text-title">
				练习方法
			</view>
			<view>
				{{sportDetail.aiSportMethod}}
			</view>
		</view>
		<view class="sport-text">
			<view class="sport-text-title">
				注意事项
			</view>
			<view>
				{{sportDetail.aiSportMattersNeedingAttention}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	export default {
		data() {
			return {
				option: {},
				sportDetail: {}
			}
		},
		onLoad(e) {
			this.option = e
		},
		onReady() {
			this.apiGetSportDetail()
		},
		methods: {
			apiGetSportDetail() {
				getReq(URL.apiGetSportDetail, {
					id: this.option.id
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						this.sportDetail = res.data
					} else {
						this.sportDetail = {}
					}
				}).catch(() => {
					this.sportDetail = {}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.sportDetail {
		padding: 46rpx 38rpx;
		padding-bottom: calc(46rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(46rpx + env(safe-area-inset-bottom));
	}

	.video-wrap {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
		border-radius: 28rpx;
		overflow: hidden;
		margin-bottom: 46rpx;

		.video-content {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	.sportName {
		font-size: 34rpx;
		line-height: 48rpx;
		font-weight: 600;
		color: #202020;
		margin-bottom: 80rpx;
	}

	.sport-text {
		font-size: 28rpx;
		font-weight: 400;
		color: #707070;
		line-height: 36rpx;
	}

	.sport-text-title {
		font-weight: 600;
		color: #202020;
		line-height: 40rpx;
	}

	.sport-text+.sport-text {
		margin-top: 30rpx;
	}
</style>
