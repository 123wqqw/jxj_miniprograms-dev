<template>
	<view class="container" v-if="hasData">
		<!-- 列表单元格 -->
		<view class="list-item" v-for="(item, index) in dataArray" :key="index" @click="tapListItem(item)">
			<view class="class-name">
				<!-- <text>{{ gradeName(item.grade) }}</text>
				<text>{{ item.number }}班</text> -->
				<text style="text-align: center;">
					{{ item.aliasClassName ? item.aliasClassName : item.className }}
				</text>
			</view>
			<view class="class-num">
				{{ item.classCode }}
			</view>
			<view class="student-num">
				{{ $t('common.student') }}：<text style="color: #202020;">{{ item.studentCount }}</text>名
			</view>
			<view class="right-part">
				<view class="plan-state">
					{{ $t('pagesPlan.intervention.index.progressing') }}
				</view>
				<view class="plan-num">
					{{ item.progressNumber }}人
				</view>
			</view>
			<image class="icon-arrow" src="../../../static/images/common/arrow-black.png"></image>
		</view>
	</view>
	<view class="container" v-else>
		<view class="no-list">
			<image class="no-img" src="../../static/icon_empty.png"></image>
			<view class="no-tip">
				{{ $t('common.none') }} {{ $t('pagesPlan.intervention.index.title') }}
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
	import ClassUtil from '@/common/utility/ClassUtil.js';

	export default {
		data() {
			return {
				dataArray: [],
				hasData: true,
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('pagesPlan.intervention.index.title')
			})
			this.queryInterventionList()
		},
		methods: {
			// 点击单元格
			tapListItem(item) {
				uni.navigateTo({
					url: '/pagesPlan/intervention/detail/interventionDetail?classId=' + item.classId,
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromInterventionPage', item)
					}
				})
			},
			// 获取干预方案列表
			queryInterventionList() {
				getReq(URL.apiGetInterventionList).then(res => {
					if (res.error == 10000) {
						if (res.data && res.data.length > 0) {
							this.dataArray = res.data
							this.hasData = true
						} else {
							this.dataArray = []
							this.hasData = false
						}
					} else {
						uni.showToast({
							title: res.message
						})
					}
				})
			},
			// 年级名称
			gradeName(grade) {
				return this.$t(ClassUtil.gradeNameI18n(grade))
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 750upx;
		overflow: scroll;
		padding-top: 27upx;
	}

	.list-item {
		margin-left: 24upx;
		margin-bottom: 20upx;
		width: 702upx;
		height: 144upx;
		position: relative;
		background: #FFFFFF;
		box-shadow: 0px 0px 8upx 0px rgba(112, 112, 112, 0.1);
		border-radius: 24upx;

		.class-name {
			position: absolute;
			top: 22upx;
			left: 32upx;
			width: 100upx;
			height: 100upx;
			background: #5C8FF7;
			border-radius: 12upx;
			font-size: 24upx;
			font-weight: 500;
			color: #FFFFFF;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.class-num {
			position: absolute;
			top: 28upx;
			left: 144upx;
			height: 36upx;
			font-size: 28upx;
			font-weight: 500;
			color: #202020;
		}

		.student-num {
			position: absolute;
			top: 79upx;
			left: 144upx;
			height: 36upx;
			font-size: 28upx;
			color: #707070;
		}

		.right-part {
			position: absolute;
			top: 28upx;
			right: 68upx;
			height: 100upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.plan-state {
				font-size: 24upx;
				color: #707070;
			}

			.plan-num {
				margin-top: 12upx;
				font-size: 24upx;
				color: #464646;
			}
		}

		.icon-arrow {
			position: absolute;
			top: 56upx;
			right: 32upx;
			width: 17upx;
			height: 32upx;
		}
	}

	.no-list {
		position: absolute;
		top: 240upx;
		left: 250upx;
		width: 250upx;

		.no-img {
			width: 250upx;
			height: 144upx;
		}

		.no-tip {
			font-size: 24upx;
			font-weight: 400;
			color: #B2B2B2;
			text-align: center;
			margin-top: 24upx;
		}
	}
</style>