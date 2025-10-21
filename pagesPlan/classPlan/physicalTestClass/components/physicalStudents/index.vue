<template>
	<view class="physicalStudents">
		<view class="physicalStudents-content">
			<view class="physicalStudents-header">
				<view class="physicalStudents-header-title">学生报告详情</view>
			</view>
			<u-table padding="24rpx 8rpx">
				<u-tr class="u-tr">
					<u-th class="u-th">序号</u-th>
					<u-th class="u-th">学生姓名</u-th>
					<u-th class="u-th">
						<view class="u-flex u-row-center">
							<text>体测总分</text>
							<sort-icon prop="completeDays" :sort="isSort" @handle-sort="handleSort">
							</sort-icon>
						</view>
					</u-th>
				</u-tr>
				<block v-for="(item, index) in physicalClassReportList" :key="index">
					<view @click="$emit('click', item)">
						<u-tr class="u-tr">
							<u-td class="u-td">{{ index + 1 }}</u-td>
							<u-td class="u-td">{{ item.studentName }}</u-td>
							<u-td class="u-td">{{ item.score || "--" }}</u-td>
						</u-tr>
					</view>
				</block>
			</u-table>
		</view>
	</view>
</template>

<script>
	import sortIcon from '../../../components/sort-icon/index.vue'
	export default {
		components: {
			sortIcon
		},
		props: {
			dataSource: {
				type: Array,
				default: () => {
					return []
				}
			},
		},
		data() {
			return {
				isSort: "",
				physicalClassReportList: []
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					this.physicalClassReportList = value && value.length ? value : []
				}
			}
		},
		methods: {
			handleSort(value, sortName) {
				this.isSort = value;
				if (sortName === "preface") {
					this.physicalClassReportList.sort((a, b) => {
						return b.score - a.score;
					});
				} else {
					this.physicalClassReportList.sort((a, b) => {
						return a.score - b.score;
					});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.physicalStudents {
		background-color: #fff;
		padding: 10rpx 0;
		border-radius: 0 26rpx 0 0;
		margin-bottom: 80rpx;

		&-content {
			padding: 24rpx;
			border-radius: 0 26rpx 0 0;
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
				background: #feae30;
			}
		}
	}
</style>
