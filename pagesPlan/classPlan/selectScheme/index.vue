<template>
	<view class="basic-container">
		<block v-for="item in dataSource" :key="item.id">
			<view class="list-item" @click="jumpBackPage(item)">
				<view class="list-item-icon">
					<u-image width="100%" height="100%" src="/pagesPlan/static/icon_classplan_detail.png"></u-image>
				</view>
				<view class="list-item-container">
					<view class="">
						{{item.name}}
					</view>
					<view class="">
						{{item.planExplain || ""}}
					</view>
				</view>
				<u-image width="32rpx" height="32rpx" mode="aspectFit" src="/static/images/common/arrow-black.png">
				</u-image>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		mapMutations,
	} from 'vuex';
	import {
		URL
	} from "@/common/url.js";
	import {
		getReq
	} from "@/common/request.js";
	export default {
		data() {
			return {
				option: null,
				dataSource: []
			}
		},
		onPullDownRefresh() {
			this.getCoursewareCourseInfo()
		},
		onLoad(e) {
			if (e && JSON.stringify(e) !== '{}') {
				this.option = JSON.parse(decodeURIComponent(e.option))
			}
		},
		mounted() {
			this.getCoursewareCourseInfo()
		},
		methods: {
			...mapMutations(['setSchemeId']),
			async getCoursewareCourseInfo() {
				try {
					if (!this.option.grades) {
						return
					}
					const result = await getReq(URL.apiGetCoursewareCourseInfo, {
						grades: this.option.grades
					})
					if (result.data && result.data.length) {
						this.dataSource = result.data
					} else {
						this.dataSource = []
					}
				} catch (e) {
					this.dataSource = []
				} finally {
					uni.stopPullDownRefresh();
				}
			},
			jumpBackPage(data) {
				this.setSchemeId(data.id)
				this.$u.route({
					type: "navigateBack"
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.list-item {
		display: flex;
		align-items: center;
		height: 196rpx;
		margin: 30rpx 46rpx;
		padding: 46rpx 30rpx;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 18rpx -8rpx #6695F6;
		border-radius: 22rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		line-height: 40rpx;
		color: #202020;

		&-icon {
			width: 104rpx;
			height: 104rpx;
			padding: 20rpx;
			background: rgba(67, 127, 249, 0.0500);
			border-radius: 8rpx;
			border: 1px solid #437FF9;
		}

		&-container {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin: 0 20rpx;
		}
	}
</style>
