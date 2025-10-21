<template>
	<view class="basic-container classPlan-container">
		<block v-for="item in dataSource" :key="item.classId">
			<view class="classPlan-item" @click="jumpPage(item)">
				<view class="classPlan-item-icon">
					<u-image width="100%" height="100%" src="/pagesPlan/static/icon_classplan_detail.png"></u-image>
				</view>
				<view class="classPlan-item-container">
					<view class="u-margin-bottom-20">
						<text style="color: #202020;">
							{{item.aliasClassName ? item.aliasClassName : item.className}}
						</text>
					</view>
					<view class="u-line-2">{{item.dimensionNames || ""}}</view>
				</view>
				<view style="color: #6695F6;" v-if="item.courseware === 1">查看课件</view>
				<view style="color: #FB8333;" v-if="item.courseware === 0">点击生成</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		URL
	} from "@/common/url.js";
	import {
		getReq
	} from "@/common/request.js";
	export default {
		data() {
			return {
				dataSource: []
			};
		},
		onPullDownRefresh() {
			this.getCoursewareClass()
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('pagesPlan.classPlan.index.name')
			})
		},
		onShow() {
			this.getCoursewareClass()
		},
		methods: {
			getCoursewareClass() {
				getReq(URL.apiGetCoursewareClass).then(res => {
					if (res.data && res.data.length) {
						this.dataSource = res.data
					} else {
						this.dataSource = []
					}
					uni.stopPullDownRefresh();
				}).catch(error => {
					this.dataSource = []
					uni.stopPullDownRefresh();
				})
			},
			jumpPage(e) {
				if (e.courseware) {
					this.$u.route({
						url: 'pagesPlan/classPlan/coursewareSet/index',
						params: {
							option: encodeURIComponent(JSON.stringify({
								...e
							}))
						}
					})
				} else if (!e.courseware) {
					this.$u.route({
						url: 'pagesPlan/classPlan/physicalTestClass/index',
						params: {
							option: encodeURIComponent(JSON.stringify({
								...e
							}))
						}
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	view {
		box-sizing: border-box;
	}

	.classPlan-container {
		padding: 30rpx 44rpx;
	}

	.classPlan-item {
		display: flex;
		align-items: center;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 18rpx -7rpx #6695F6;
		border-radius: 22rpx;
		margin-bottom: 30rpx;
		padding: 44rpx 30rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		line-height: 1.5;
		color: #858585;

		&-icon {
			width: 104rpx;
			height: 104rpx;
			padding: 20rpx;
			background: rgba(67, 127, 249, 0.0500);
			border-radius: 8rpx;
			border: 1px solid #437FF9;
			margin-right: 20rpx;
		}

		&-container {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-right: 20rpx;
		}
	}
</style>
