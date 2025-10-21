<template>
	<view>
		<view class="bg-white u-padding-bottom-152 u-padding-left-32 u-padding-right-32 u-padding-top-64">
			<view class="complte-scores">
				<text
					:style="{color:dataSource.lengthStatus === 0 ? '#FF5050' : '#202020'}">{{dataSource.length}}</text>
				<u-tag :text="$t('center.standards')" shape="circle" bg-color="#5C8FF7" border-color="#5C8FF7"
					color="#fff" v-if="dataSource.status === 1" class="u-margin-left-24 u-padding-bottom-12" />
				<u-tag :text="$t('center.unstandards')" shape="circle" bg-color="#FF5050" border-color="#FF5050"
					color="#fff" class="u-margin-left-24 u-padding-bottom-12" v-else @click="verifyShow = true">
					<view class="u-icon-wrap">
						<u-icon size="22" color="#fff" name="question-circle" class="u-close-icon"></u-icon>
					</view>
				</u-tag>
			</view>
			<view class="font-km-cn" :style="{color:dataSource.lengthStatus === 0 ? '#FF5050' : '#202020'}">
				{{$t('center.kilometers')}}
			</view>

			<view class="u-flex u-margin-bottom-40">
				<view class="u-flex-1">
					<view class="font-speed u-line-1"
						:style="{color:dataSource.speedStatus === 0 ? '#FF5050' : '#202020'}">
						{{dataSource.speed}}
					</view>
					<view class="font-speed-cn" :style="{color:dataSource.speedStatus === 0 ? '#FF5050' : '#8A8A8A'}">
						配速
					</view>
				</view>
				<view class="u-flex-1">
					<view class="font-speed u-line-1">
						{{dataSource.duration}}
					</view>
					<view class="font-speed-cn">
						{{$t('center.duration')}}
					</view>
				</view>
				<view class="u-flex-1">
					<view class="font-speed u-line-1"
						:style="{color:dataSource.frequencyStatus === 0 ? '#FF5050' : '#202020'}">
						{{dataSource.frequency}}
					</view>
					<view class="font-speed-cn"
						:style="{color:dataSource.frequencyStatus === 0 ? '#FF5050' : '#202020'}">
						{{$t('center.frequency')}}
					</view>
				</view>
			</view>
			<trace-plot :dataSource="tracePlotJson" />
			<speed-block :dataSource="speedJson" />
			<view class="u-padding-top-32">
				<view class="block-title">
					{{$t('center.frequency')}}
					<view class="block-subtitle u-margin-left-16">
						(步/分钟)
					</view>
				</view>
				<view class="u-flex u-row-center u-margin-top-28 u-margin-bottom-60">
					<view class="" style="margin-right: 120rpx;">
						<view class="font-md">
							{{$t('center.num')}}
						</view>
						<view class="u-flex font-md-num">
							{{dataSource.num}}
							<view class="font-md-tip">
								步
							</view>
						</view>
					</view>
					<view class="">
						<view class="font-md">
							步幅
						</view>
						<view class="u-flex font-md-num">
							{{dataSource.scope}}
							<view class="font-md-tip">
								CM
							</view>
						</view>
					</view>
				</view>
				<frequency-block :dataSource="frequencyJson" />
			</view>
		</view>
		<view class="btn-wrapper safe-area-inset-bottom">
			<u-button type="warning" :custom-style="{...btnStyle,background:'#FF5050'}" v-if="dataSource.status === 1"
				@click="show = true">
				置为{{$t('center.unstandards')}}</u-button>
			<u-button type="primary" :custom-style="{...btnStyle,background: '#5C8FF7'}" v-else @click="show = true">
				置为{{$t('center.standards')}}</u-button>
		</view>
		<u-modal v-model="show" :show-cancel-button="true" :show-title="false" @confirm="handleStatus">
			<block v-if="dataSource.status === 1">
				<view class="u-font-md u-text-center u-margin-top-24">
					请输入{{$t('center.unstandards')}}原因
				</view>
				<view class="u-margin-32">
					<u-input v-model="verifyContent" :type="type" :border="true" maxlength="10" />
				</view>
			</block>
			<block v-else>
				<view class="u-padding-60 u-font-md u-text-center">
					是否{{$t('center.submit')}}置为{{$t('center.standards')}}？
				</view>
			</block>
		</u-modal>
		<u-modal v-model="verifyShow" :show-confirm-button="false" :mask-close-able="true" :show-title="false"
			:content-style="{
			padding:'40rpx'
		}">
			<view class="block-subtitle" style="color: #202020;">
				{{dataSource.verifyContent}}
			</view>
		</u-modal>
	</view>
</template>

<script>
	import tracePlot from '../components/trace-plot/index.vue'
	import speedBlock from '../components/speed-block/index.vue'
	import frequencyBlock from '../components/frequency-block/index.vue'
	import {
		dateFormat,
		computeNumber,
		getDateSpeed,
		dealNumber
	} from "@/common/util.js";
	import {
		getReq,
		postReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		unzip
	} from "@/common/unzip.js";
	export default {
		components: {
			tracePlot,
			speedBlock,
			frequencyBlock
		},
		data() {
			return {
				btnStyle: {
					width: '100%',
					height: "80rpx",
					color: "#FFFFFF",
					borderRadius: "44rpx",
					fontSize: '28rpx',
				},
				option: {},
				dataSource: {},
				tracePlotJson: "",
				speedJson: "",
				frequencyJson: "",
				show: false,
				verifyContent: "",
				verifyShow: false
			}
		},
		onLoad(e) {
			this.option = JSON.parse(decodeURIComponent(e.option))
			this.apiGetRunRecordInfo()
		},
		methods: {
			apiGetRunRecordInfo() {
				getReq(URL.runRecordInfo, {
					recordId: this.option.id
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const {
							frequencyJson,
							speedJson,
							tracePlotJson,
							...dataSource
						} = res.data;
						this.dataSource = {
							...dataSource,
							length: dealNumber(computeNumber(dataSource.length, '/', 1000).result) || 0,
							speed: getDateSpeed(dataSource.speed || 0) || "--",
							duration: getDateSpeed(dataSource.duration || 0) || "--",
							scope: dealNumber(computeNumber(dataSource.scope, '/', 10).result) || 0,
						}
						this.setNavigationBarTitle(dataSource.startTime, dataSource.finishTime)
						this.tracePlotJson = unzip(tracePlotJson)
						this.speedJson = unzip(speedJson)
						this.frequencyJson = unzip(frequencyJson)
					}
				}).catch(error => {
					this.dataSource = {}
					this.tracePlotJson = ""
					this.speedJson = ""
					this.frequencyJson = ""
				})
			},
			setNavigationBarTitle(startTime, finishTime) {
				startTime = dateFormat(new Date(startTime))
				finishTime = dateFormat(new Date(finishTime))
				uni.setNavigationBarTitle({
					title: `${startTime.substring(5,startTime.length)} - ${finishTime.substring(11,finishTime.length)}`
				})
			},
			handleStatus() {
				const params = {
					id: this.option.id,
					status: this.dataSource.status === 1 ? 0 : 1,
					verifyContent: this.verifyContent
				}
				postReq(URL.runRecordUpdateStatus, {
					...params
				}).then(res => {
					if (res.error === 10000) {
						this.apiGetRunRecordInfo()
					} else {
						uni.hideToast();
						uni.showToast({
							duration: 2000,
							"icon": "none",
							"title": res.message,
						});
					}
				}).catch(error => {
					uni.hideToast();
					uni.showToast({
						duration: 2000,
						"icon": "none",
						"title": "请稍后再试",
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	view {
		box-sizing: border-box;
	}

	.complte-scores {
		display: flex;
		align-items: flex-end;
		width: 100%;
		font-size: 168rpx;
		line-height: 168rpx;
		color: #202020;
		margin-bottom: 48rpx;
	}

	.u-padding-bottom-152 {
		padding-bottom: 152rpx;
	}

	.bg-white {
		background-color: #fff;
	}

	.font-km-cn {
		font-size: 34rpx;
		line-height: 48rpx;
		font-weight: 400;
		color: #8A8A8A;
		margin-bottom: 72rpx;
	}

	.block-title {
		display: flex;
		align-items: flex-end;
		height: 90rpx;
		margin-left: 16rpx;
		font-size: 64rpx;
		font-weight: bold;
		color: #202020;
		padding-bottom: 12rpx;
	}

	.block-subtitle {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: normal;
		color: #8A8A8A;
	}

	.font-speed {
		line-height: 60rpx;
		font-size: 60rpx;
		font-weight: bold;
		color: #202020;
		margin-bottom: 32rpx;
	}

	.font-speed-cn {
		font-size: 32rpx;
		line-height: 45rpx;
		font-weight: 400;
		color: #8A8A8A;
	}

	.font-title {
		font-size: 64rpx;
		line-height: 90rpx;
		font-weight: 500;
		color: #202020;
	}

	.font-subtitle {
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 400;
		color: #8A8A8A;
	}

	.font-md {
		font-size: 24rpx;
		font-weight: 400;
		color: #464646;
		line-height: 33rpx;
	}

	.font-md-num {
		font-size: 48rpx;
		font-weight: bold;
		color: #5C8FF7;
	}

	.font-md-tip {
		font-size: 20rpx;
		font-weight: 300;
		color: #8A8A8A;
		line-height: 28rpx;
		margin-left: 4rpx;
	}

	.btn-wrapper {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		background: #FFFFFF;
		box-shadow: 0px -2rpx 8rpx 0px rgba(0, 0, 0, 0.0800);
		padding: 20rpx 56rpx;
		padding-bottom: 0;
		padding-bottom: calc(constant(safe-area-inset-bottom) + 20rpx);
		padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
	}

	.u-icon-wrap {
		display: inline-flex;
		margin-left: 6rpx;
	}
</style>
