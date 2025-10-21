<template>
	<view class="userinfo">
		<view class="userinfo-top">
			<view class="u-flex">
				<u-avatar :src="dataSource.avatar" class="u-margin-right-24"></u-avatar>
				<view class="userinfo_value">
					<view class="">
						<text class="u-margin-right-16">{{dataSource.name }}</text>
						<u-tag :text="dataSource.aliasClassName ? dataSource.aliasClassName : (dataSource.className || '')" 
							mode="dark" type="primary" size="mini" />
					</view>
					<view class="userinfo_tips">{{ dataSource.studentNum }}</view>
				</view>
			</view>
			<u-image v-if="dataSource.isApproval" :width="90" :height="90"
				:src="require('../../../../static/images/correctTask/icon_reivew.png')" mode="aspectFit">
			</u-image>
			<u-image v-else-if="dataSource.askLeave" :width="90" :height="90"
				:src="require('../../../../static/images/correctTask/ask-leave-icon.png')" mode="aspectFit">
			</u-image>
			<u-image v-else-if="dataSource.corrected" :width="90" :height="90"
				:src="require('../../../../static/images/correctTask/read-icon.png')" mode="aspectFit">
			</u-image>
		</view>
		<view class="userinfo-bottom">
			<text>完成情况：</text>
			<text style="color:#409EFF">{{dataSource.completion || 0}}</text>
			<text>/</text>
			<text class="u-margin-right-16">{{dataSource.totalCount || 0}}</text>
			<u-tag v-if="dataSource.status == 6" text="已补交" mode="plain" shape="circle" class="u-margin-right-16"
				size="mini" />
			<template v-if="dataSource.totalGroup">
				<text>{{ $t("task.correct.classStatistics.standardGroupNum") }}：</text>
				<text>{{ dataSource.totalGroup }}</text>
			</template>
		</view>
	</view>
</template>

<script>
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

			}
		},
	}
</script>

<style scoped lang="scss">
	.userinfo {
		padding: 0 0 32rpx;

		&-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 16rpx;
			border-bottom: 1rpx solid #DCDFE6;
		}

		&-bottom {
			font-size: 28rpx;
			line-height: 1.5;
			color: #606266;
			padding-top: 16rpx;
		}
	}

	.userinfo_value {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 90rpx;
		font-size: 28rpx;
		line-height: 1.5;
	}

	.userinfo_tips {
		font-size: 12px;
		color: #909399;
		font-weight: 400;
	}
</style>
