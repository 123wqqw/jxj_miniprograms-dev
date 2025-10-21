<template>
	<view class="list-item-wrapper">
		<view class="item-bezel" @click="clickItem">
			<u-image v-if="dataSource.studentImg" width="80rpx" height="80rpx" shape="circle" :src="handleFaceUrl()">
			</u-image>
			<view v-else class="avatar-placeholder"></view>
			<view class="text-bezel">
				<text>{{dataSource.name || ''}}</text>
				<text>{{ handleClassName() }}</text>
			</view>
			<view class="right-bezel">
				<text class="prize-name">{{dataSource.prizeName || ''}}</text>
				<image class="arrow-icon" src="../../../static/images/arrow_right_white.png" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import ClassUtil from '@/common/utility/ClassUtil.js';
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => ({})
			},
		},

		computed: {
			...mapState(['schoolInfo']),
		},

		methods: {
			// 点击单元格
			clickItem() {
				this.$emit('click-item', this.dataSource);
			},
			// 处理人脸地址
			handleFaceUrl() {
				return this.schoolInfo.faceDomain + '/file' + this.dataSource.studentImg;
			},
			// 处理班级名称
			handleClassName() {
				if (this.dataSource.aliasClassName) {
					// return this.$t(ClassUtil.gradeNameI18n(this.dataSource.grade)) + this.dataSource.aliasClassName;
					return this.dataSource.aliasClassName;
				} else {
					return this.dataSource.className || '';
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.list-item-wrapper {
		height: 160rpx;
		padding: 20rpx 24rpx 0rpx 24rpx;
		display: flex;
	}

	.item-bezel {
		padding: 20rpx 30rpx;
		background: #5C8FF7;
		border-radius: 24rpx;
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
	}

	.avatar-placeholder {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
	}

	.text-bezel {
		margin-left: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;

		text:nth-child(1) {
			font-family: DINAlternate, DINAlternate;
			font-weight: bold;
			line-height: 36rpx;
			font-size: 28rpx;
			color: #FFFFFF;
		}

		text:nth-child(2) {
			font-size: 20rpx;
			color: #FFFFFF;
			line-height: 28rpx;
			opacity: 0.6;
		}
	}

	.right-bezel {
		margin-left: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;

		.prize-name {
			font-weight: 500;
			font-size: 28rpx;
			color: #FFFFFF;
			line-height: 40rpx;
		}

		.arrow-icon {
			width: 32rpx;
			height: 34rpx;
		}
	}
</style>