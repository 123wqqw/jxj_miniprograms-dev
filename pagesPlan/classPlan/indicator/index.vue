<template>
	<view class="basic-container">
		<view class="list">
			<template v-if="dataSource && dataSource.length">
				<view class="list-item" v-for="(item,index) in dataSource" :key="item.id">
					<view class="list-item-header">
						<u-image :src="`/pagesPlan/static/icon_index_${index + 1}.png`" width="96rpx" height="96rpx"
							mode="aspectFit">
						</u-image>
						<text user-select>{{item.label}}</text>
						<u-image src="/pagesPlan/static/icon_index_arrow.png" width="38rpx" height="30rpx"
							mode="aspectFit" style="margin-left: 20rpx;">
						</u-image>
					</view>
					<text user-select>{{item.value}}</text>
					<view class="list-item-text">
						<text class="list-item-bold">重要性：</text>
						<text user-select>{{item.value1}}</text>
					</view>
				</view>
			</template>
			<template v-else>
				<u-empty src="/static/md_icon_empty1.png" text="未搜索到数据" :font-size="24" color="#B2B2B2" :icon-size="250"
					:marginTop="140">
				</u-empty>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataSource: []
			}
		},
		onLoad(e) {
			if (e.dimensionIds) {
				const dimensionIds = e.dimensionIds.split(',')
				this.dataSource = dimensionIds.map(item => ({
					id: item,
					label: this.$t(`pagesPlan.classPlan.indicator.${item}.label`),
					value: this.$t(`pagesPlan.classPlan.indicator.${item}.value`),
					value1: this.$t(`pagesPlan.classPlan.indicator.${item}.value1`)
				}))
			} else {
				this.dataSource = []
			}
		}
	}
</script>

<style scoped lang="scss">
	.list {
		padding: 0 24rpx;
	}

	.list-item {
		padding: 16rpx 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 19rpx 0px rgba(112, 112, 112, 0.1000);
		border-radius: 24rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #464646;
		margin: 16rpx;

		&-header {
			display: flex;
			align-items: center;
			font-size: 32rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #554335;
			margin-bottom: 15rpx;
		}

		&-text {
			margin-top: 20rpx;
		}

		&-bold {
			font-weight: bold;
		}
	}
</style>
