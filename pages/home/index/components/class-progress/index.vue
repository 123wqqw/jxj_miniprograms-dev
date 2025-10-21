<template>
	<view class="classes" @click="$emit('click')">
		<text class="u-margin-right-16">
			{{ dataSource.aliasClassName ? dataSource.aliasClassName : dataSource.className}}
		</text>
		<view class="classes-tag" v-show="dataSource.classManageType === 2">{{$t('common.help')}}</view>
		<u-line-progress class="u-flex u-flex-1" :height="20" active-color="#5C8FF7"
			:percent="dataSource.completePresent || 0" :show-percent="false">
		</u-line-progress>
		<view class="u-flex">
			（
			<text style="color: #2979ff">{{dataSource.rest ? 0 : dataSource.completeCount}}</text>
			<text class="u-margin-left-8 u-margin-right-8">/</text>
			<text>{{dataSource.totalCount}}</text>
			）
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
		}
	}
</script>

<style scoped lang="scss">
	.classes {
		display: flex;
		align-items: center;
		padding: 16rpx 0;
		font-size: 28rpx;
		font-weight: 400;
		color: #202020;

		&-tag {
			width: 40rpx;
			height: 40rpx;
			text-align: center;
			line-height: 40rpx;
			border-radius: 50%;
			color: #FFFFFF;
			background-color: #464646;
			margin-right: 16rpx;
		}
	}
</style>
