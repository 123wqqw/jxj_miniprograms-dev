<template>
	<view class="userInfo">
		<view class="userInfo-schoolName">
			{{dataSource.schoolName || '--'}}
		</view>
		<view class="u-flex">
			<u-avatar class="u-flex u-margin-right-8" :src="dataSource.avatarUrl || userInfo.avatarUrl || ''" size="48">
			</u-avatar>
			<view class="userInfo-name u-margin-right-8">
				{{dataSource.name || '--'}}
			</view>
			<u-tag v-if="teacherTypeList[dataSource.teacherType - 1]" class="u-flex"
				:text="teacherTypeList[dataSource.teacherType - 1]" shape="circle" size="mini" bg-color="#D7E4FE"
				border-color="#D7E4FE" color="#5C8FF7" />
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
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
				teacherTypeList: [this.$t('main.home.index.physicalTeacher'), this.$t('common.chargeTeacher'), this.$t(
					'common.otherTeacher')],
			}
		},
		computed: {
			...mapState(['userInfo']),
		},
	}
</script>

<style scoped lang="scss">
	.userInfo {
		margin-bottom: 32rpx;

		&-schoolName {
			font-size: 56rpx;
			line-height: 1.5;
			font-weight: 600;
			color: #202020;
			margin-bottom: 16rpx;
		}

		&-name {
			font-size: 28rpx;
			line-height: 1.5;
			font-weight: 400;
			color: #464646;
		}
	}
</style>
