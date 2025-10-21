<template>
	<view class="record-table-wrapper">
		<view class="table-all-left">
			<view class="table-header">
				<view class="table-th" v-for="(item, index) in studentListKeyLeft" :key="index" :class="item.class">
					<view style="float: left;">{{ item.name }}</view>
				</view>
			</view>
			<view class="table-row" v-for="(item, index) in dataSource" :key="index">
				<view class="table-td first">{{ index + 1 }}</view>
				<view class="table-td text-over">{{ item.name }}</view>
			</view>
		</view>
		<view class="table-all-box">
			<scroll-view scroll-x="true" class="table-all">
				<view class="table-header">
					<view class="table-th" v-for="(item, index) in studentListKey" :key="index" :class="item.class"
						@click="clickSort(item)">
						<view style="float: left;">{{ item.name }}</view>
						<view class="sortBox">
							<image src="../../../../static/images/common/arrow-up-yes.png" class="sortImg"
								v-if="item.sortState && item.sortState!== 3"></image>
							<image src="../../../../static/images/common/arrow-up-no.png" class="sortImg"
								v-if="item.sortState && item.sortState== 3"></image>
							<image src="../../../../static/images/common/arrow-down-yes.png" class="sortImg"
								v-if="item.sortState && item.sortState!== 2"></image>
							<image src="../../../../static/images/common/arrow-down-no.png" class="sortImg"
								v-if="item.sortState && item.sortState== 2"></image>
						</view>
					</view>
				</view>
				<view class="table-row" v-for="(item, index) in dataSource" :key="index">
					<view class="table-td aa">{{ item.gender == 0 ? '女' : '男' }}</view>
					<view class="table-td">{{handleGrade(item)}}</view>
					<view class="table-td">
						{{item.aliasClassName ? item.aliasClassName : (item.className || "")}}
					</view>
					<view class="table-td aa">{{ handleScoreValue(item) }}</view>
					<view class="table-td aa">{{ handleScoreStatus(item) }}</view>
					<view class="table-td aa">{{ handleTrainTaskScore(item) }}</view>
					<view class="table-td aa">{{ handleLevel(item) }}</view>
					<view class="table-td aa">{{ handleSourceState(item) }}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import DateUtil from '@/common/utility/DateUtil.js';
	import MathUtil from '@/common/utility/MathUtil.js';
	import ClassUtil from '@/common/utility/ClassUtil.js';
	import { configSportScore } from '../../../static/utilities/indexUtil.js';

	export default {
		props: {
			recordItem: {
				type: Object,
				default: () => {}
			},
			dataSource: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				studentListKeyLeft: [{
					name: this.$t('common.orderNumber'),
					value: 'index',
					class: 'first'
				}, {
					name: this.$t('common.name'),
					value: 'studentName'
				}],
				studentListKey: [{
					name: this.$t('common.gender'),
					value: 'gender',
					class: 'aa'
				}, {
					name: this.$t('common.gradeText'),
					value: 'gradeCampusid',
				}, {
					name: this.$t('common.classText'),
					value: 'classCampusid',
				}, {
					name: this.$t('common.achievement'),
					value: 'scoreOrderBy',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.$t('center.achievementState'),
					value: 'achievementState',
					class: 'aa'
				}, {
					name: this.$t('common.score'),
					value: 'score',
					class: 'aa'
				}, {
					name: this.$t('common.ratingLevel'),
					value: 'ratingLevel',
					class: 'aa'
				}, {
					name: this.$t('center.device'),
					value: 'source',
					class: 'aa'
				}],
				studentListValue: []
			}
		},
		computed: {
			...mapState(['schoolInfo']),
		},
		methods: {
			// 处理年级
			handleGrade(item) {
				return this.$t(ClassUtil.gradeNameI18n(item.grade));
			},
			// 处理成绩展示
			handleScoreValue(item) {
				const sportItem = this.recordItem.sportItems[0];
				const dianaScoreConfig = this.schoolInfo.dianaScoreConfig;
				return configSportScore(item.num, sportItem.sportItemCode, sportItem.value, dianaScoreConfig);
			},
			// 处理成绩状态
			handleScoreStatus(item) {
				if (item.abnormal == 1) {
					return '异常'
				}
				if (item.status == 1) {
					return '未完成'
				}
				if (item.num === null) {
					return '-' // 未测试
				}
				return '正常'
			},

			// 处理分数
			handleTrainTaskScore(item) {
				if (item.status == 1) {
					return '-'
				}
				if (item.abnormal == 1) {
					return '-'
				}
				if (item.score === null) {
					return '-'
				}
				return MathUtil.computeNumber(item.score, '/', 100).result
			},

			// 处理评级
			handleLevel(item) {
				if (item.status == 1) {
					return '-'
				}
				if (item.abnormal == 1) {
					return '-'
				}
				if (item.level === 1) {
					return '优秀'
				} else if (item.level === 2) {
					return '良好'
				} else if (item.level === 3) {
					return '及格'
				} else if (item.level === 4) {
					return '不及格'
				} else if (item.level === 5) {
					return '达标'
				} else if (item.level === 6) {
					return '不达标'
				}
				return '-'
			},
			// 处理设备来源：1.一体机；2.智慧平板
			handleSourceState(item) {
				if (item.source == 1) {
					return this.$t('center.allInOne');
				} else if (item.source == 2) {
					return this.$t('center.wisdomPad');
				}
				return '';
			},
			clickSort(data) {
				if (!data.sortState) {
					return
				}
				this.studentListKey.map(function(item, index) {
					if (item.value === data.value) {
						item.sortState = data.sortState
					} else {
						if (item.sortState) {
							item.sortState = 1
						}
					}
				})
				data.sortState++
				if (data.sortState > 3) {
					data.sortState = 1
				}
				this.$emit('handle-sort', data)
			},
		}
	}
</script>

<style scoped lang="scss">
	.record-table-wrapper {
		position: relative;
		padding-bottom: env(safe-area-inset-bottom);
		width: 750rpx;
		overflow: hidden;
	}

	.table-all-left {
		width: 250rpx;
		background: #FFFFFF;

		.table-header {
			height: 80rpx;
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			background: #FFFFFF;
			font-size: 24rpx;
			font-weight: 400;
			color: #707070;

			.table-th {
				flex-basis: 170rpx;
				flex-shrink: 0;
				padding-left: 20rpx;
				box-sizing: border-box;
			}

			.first {
				flex-basis: 80rpx;
			}
		}

		.table-row {
			display: flex;
			flex-wrap: nowrap;
			height: 72rpx;
			background: #FFFFFF;
			font-size: 24rpx;
			font-weight: 400;
			color: #202020;

			.table-td {
				flex-basis: 170rpx;
				flex-shrink: 0;
				box-sizing: border-box;
				padding: 24rpx 0 24rpx 20rpx;
				border-top: 1px solid #dddddd;
			}

			.first {
				flex-basis: 80rpx;
			}

			.text-over {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
	}

	.table-all-box {
		width: 500rpx;
		overflow: hidden;
		position: absolute;
		left: 250rpx;
		top: 0;

		.table-all {
			.table-header {
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				height: 80rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #707070;

				.table-th {
					flex-basis: 220rpx;
					flex-shrink: 0;
					padding-left: 24rpx;
					box-sizing: border-box;

					.sortBox {
						margin-left: 10rpx;
						float: left;
						display: flex;
						flex-direction: column;
						justify-content: space-around;

						.sortImg {
							width: 18rpx;
							height: 16rpx;
						}
					}
				}

				.aa {
					flex-basis: 150rpx;
				}
			}

			.table-row {
				display: flex;
				flex-wrap: nowrap;
				height: 72rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #202020;

				.table-td {
					flex-basis: 220rpx;
					flex-shrink: 0;
					box-sizing: border-box;
					padding: 24rpx 0 24rpx 20rpx;
					border-top: 1px solid #dddddd;
				}

				.nameStyleA {
					color: #5C8FF7;
				}

				.nameStyleB {
					color: #202020;
				}

				.aa {
					flex-basis: 150rpx;
				}
			}
		}
	}
</style>