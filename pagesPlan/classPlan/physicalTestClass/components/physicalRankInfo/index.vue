<template>
	<view class="physicalRankInfo">
		<view class="physicalRankInfo-content">
			<view class="physicalRankInfo-header">
				<view class="physicalRankInfo-header-title">体质排名</view>
			</view>
			<physical-school-rank :dataSource="dataSource.schoolRankData" />
			<block v-for="item in dataSource.physiqueRankDatas" :key="item.dimensionId">
				<physical-rank-item :dataSource="item" />
			</block>
		</view>
	</view>
</template>

<script>
	import physicalSchoolRank from './components/physicalSchoolRank.vue'
	import physicalRankItem from './components/physicalRankItem.vue'
	export default {
		components: {
			physicalSchoolRank,
			physicalRankItem
		},
		props: {
			dataSource: {
				type: Object,
				default: () => {
					return {}
				}
			},
		},
		data() {
			return {

			}
		}
	}
</script>

<style scoped lang="scss">
	.physicalRankInfo {
		background-color: #fff;
		padding: 10rpx 0;
		border-radius: 26rpx;
		margin-bottom: 80rpx;

		&-content {
			padding: 24rpx;
			border-radius: 26rpx;
			background: linear-gradient(180deg, #FFF3E1 0%, #fff 10%, #fff 70%, #FFF3E1 100%);
			box-shadow: 0px 0px 19px 0px rgba(112, 112, 112, 0.1000);
		}

		&-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 44rpx;
			font-weight: 600;
			color: #202020;
			margin-bottom: 40rpx;

			&-title {
				position: relative;
			}

			&-title::after {
				content: " ";
				position: absolute;
				bottom: -4rpx;
				left: 0;
				width: 80%;
				height: 10rpx;
				background: rgba(254, 174, 48, 1);
			}
		}
	}
</style>
