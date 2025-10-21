<template>
	<view class="" v-if="show">
		<view class="u-padding-top-32">
			<view class="font-title u-margin-bottom-32">
				配速
			</view>
			<view class="speed-bar">
				<view class="speed-label">
					{{$t('center.kilometers')}}
				</view>
				<view class="">
					配速
				</view>
				<view class="u-flex-1 u-text-right" style="color: #5C8FF7;font-weight: normal;">
					最快配速：{{getDateSpeed(fastSpeed) || 0}}
				</view>
			</view>
			<view class="speed-bar speed-item" v-for="(item,index) in data" :key="index">
				<view class="speed-label">
					{{item.section}}
				</view>
				<view class="u-flex-1 u-margin-right-32">
					<u-line-progress :active-color="item.avgSpeed === fastSpeed ? '#FC8332':'#5C8FF7'"
						:percent="item.percent" class="u-flex" :show-percent="false">
					</u-line-progress>
				</view>
				<view class="speed-label">
					{{getDateSpeed(item.avgSpeed || 0) || 0}}
				</view>
			</view>
			<view class="text">
				最后不足一公里用时{{getDateSpeed(popData.avgSpeed || 0) || 0}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDateSpeed,
		dealPersent,
		computeNumber
	} from "@/common/util.js";
	export default {
		props: {
			dataSource: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				show: false,
				getDateSpeed,
				data: [],
				fastSpeed: 0,
				popData: {}
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					if (value) {
						this.init()
					}
				}
			}
		},
		methods: {
			init() {
				this.show = false
				const data = this.$u.deepClone(JSON.parse(this.dataSource))
				const speedTotal = data.reduce((pre, cur) => {
					return pre + cur.avgSpeed
				}, 0)
				if (speedTotal < 1 || data.length < 2) {
					return
				}
				console.log(data, '////////');
				this.popData = data.pop()
				this.show = true
				let total = 0
				let fastSpeed = 0
				this.data = data.map(item => {
					if (!fastSpeed || item.avgSpeed < fastSpeed) {
						fastSpeed = item.avgSpeed
					}
					if (item.avgSpeed > total) {
						total = item.avgSpeed
					}
					return {
						...item
					}
				})
				this.data.forEach(item => {
					item.percent = total ? dealPersent(computeNumber(item.avgSpeed, '/', total).result || 0) : 0
				})
				this.fastSpeed = fastSpeed
			}
		}
	}
</script>

<style scoped lang="scss">
	.speed-bar {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 22rpx 0;
		font-size: 32rpx;
		line-height: 45rpx;
		font-weight: bold;
		color: #202020;
	}

	.speed-label {
		width: 100rpx;
	}

	.speed-item+.speed-item {
		border-top: 1px solid #DDDDDD;
	}

	.font-title {
		font-size: 64rpx;
		line-height: 90rpx;
		font-weight: 500;
		color: #202020;
	}

	.text {
		height: 36rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #707070;
		line-height: 36rpx;
		text-align: center;
		margin-top: 18rpx;
	}
</style>
