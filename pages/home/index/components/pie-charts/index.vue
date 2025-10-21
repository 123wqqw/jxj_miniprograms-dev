<template>
	<view class="charts">
		<view class="u-flex u-row-between u-margin-bottom-20">
			<view class="title-left">{{$t('main.home.index.todayTask')}}{{$t('common.info')}}</view>
			<view class="title-right">
				{{$t('main.home.index.finishedPercent')}}:{{dealPersent(dataSource.completeCount /dataSource.totalCount)}}%
			</view>
		</view>
		<view style="width: 100%; height:350rpx">
			<l-echart ref="chart" id="chart"></l-echart>
		</view>
		<u-icon name="arrow-right" color="#5C8FF7" size="24" :label="text" label-pos="left" label-size="28"
			label-color="#5C8FF7" @click="goCorrectTask"></u-icon>
	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	import {
		dealPersent
	} from '@/common/util.js'
	export default {
		props: {
			dataSource: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				// 国际化
				unFinish: this.$t('common.unFinish'),
				finished: this.$t('common.finished'),
				forLeave: this.$t('common.forLeave'),
				text: "",
				dealPersent,
				option: {
					title: {
						text: 0,
						top: "center",
						left: "28%",
						subtext: '总人数',
						textStyle: {
							color: "#202020",
							fontSize: 15,
							fontWeight: 'bold'
						},
						subtextStyle: {
							color: "#464646",
							fontSize: 12
						},
						textAlign: 'center'
					},
					tooltip: {
						trigger: "none",
					},
					legend: {
						type: 'scroll',
						orient: 'vertical',
						top: 'center',
						right: 0, // 图列相对容器的位置 top\bottom\left\right
						textStyle: {
							color: '#202020',
						},
					},
					series: [{
						type: 'pie',
						center: ['30%', 'center'],
						radius: ['50%', '90%'],
						itemStyle: {
							borderRadius: 10,
							borderColor: '#fff',
							borderWidth: 2
						},
						label: {
							show: false
						},
						data: []
					}]
				},
			};
		},
		watch: {
			dataSource: {
				handler() {
					this.initChartData()
				},
				deep: true
			},
		},
		mounted() {
			this.text = `${this.$t('main.home.index.checkTask')}${this.$t('common.info')}`
		},
		methods: {
			goCorrectTask() {
				this.$u.route({
					url: '/pagesTask/correct/index/index',
				})
			},
			initChartData() {
				this.$refs.chart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					this.option.title.text = this.dataSource.totalCount || 0
					this.option.title.subtext = this.$t('main.home.index.allPersonNum')
					this.option.series[0].data = [{
							value: this.dataSource.incompleteCount,
							name: `${this.unFinish} ${this.dataSource.incompleteCount}人\n${dealPersent(this.dataSource.incompleteCount / this.dataSource.totalCount)}%`,
							itemStyle: {
								color: '#FF7A86'
							}
						},
						{
							value: this.dataSource.completeCount,
							name: `${this.finished} ${this.dataSource.completeCount}人\n${dealPersent(this.dataSource.completeCount / this.dataSource.totalCount)}%`,
							itemStyle: {
								color: '#5C8FF7'
							}
						},
						{
							value: this.dataSource.askLeaveCount,
							name: `${this.forLeave} ${this.dataSource.askLeaveCount}人\n${dealPersent(this.dataSource.askLeaveCount / this.dataSource.totalCount)}%`,
							itemStyle: {
								color: '#FFE660'
							}
						}
					]

					chart.setOption(this.option);
					// 需要把 chart 返回
					return chart;
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.charts {
		margin-bottom: 20rpx;
		padding: 32rpx 0 42rpx;
		text-align: right;
	}

	.title-left {
		font-size: 40rpx;
		font-weight: bold;
		color: #202020;
	}

	.title-right {
		font-size: 32rpx;
		color: #464646;
	}
</style>
