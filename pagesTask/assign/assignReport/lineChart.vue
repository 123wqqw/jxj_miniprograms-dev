<template>
	<view class="charts">
		<l-echart ref="chart" id="chart"></l-echart>
	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => {
					return {
						xData: [],
						series: [{
							data: []
						}, {
							data: []
						}]
					}
				}
			}
		},
		data() {
			return {
				option: {
					grid: {
						top: '0%',
						right: '0%',
						bottom: '16%',
						left: '0%',
						containLabel: true,
						show: true,
						borderColor: 'transparent',
						backgroundColor: 'rgba(248,248,248,0.41)'
					},
					legend: {
						bottom: 0,
						textStyle: {
							color: '#606266'
						}
					},
					tooltip: {
						show: true, // 是否显示
						trigger: 'axis',
						axisPointer: {
							type: 'shadow', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
							axis: 'auto', // 指示器的坐标轴。
							snap: true // 坐标轴指示器是否自动吸附到点上
						},
						confine: true, // 是否将 tooltip 框限制在图表的区域内。
					},
					xAxis: {
						type: 'category',
						data: [],
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						}
					},
					yAxis: {
						min: 0,
						max: 100,
						type: 'value',
						axisLabel: {
							show: false
						},
						splitLine: {
							show: false
						}
					},
					series: [{
							name: '本班作业完成率',
							data: [],
							type: 'line',
							smooth: true,
							showSymbol: false,
							itemStyle: {
								normal: {
									lineStyle: {
										width: 3
									}
								}
							},
							color: '#45B8FE'
						},
						{
							name: '年级平均完成率',
							data: [],
							type: 'line',
							smooth: true,
							showSymbol: false,
							itemStyle: {
								normal: {
									lineStyle: {
										width: 3
									}
								}
							},
							color: '#FF5B84'
						}
					]
				}
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					if (value && JSON.stringify(value) !== '{}') {
						this.option.xAxis.data = this.dataSource.xData
						this.option.series[0].data = this.dataSource.series[0].data
						this.option.series[1].data = this.dataSource.series[1].data
						this.$refs.chart.setOption(this.option)
					}
				},
				deep: true
			}
		},
		mounted() {
			this.initChart()
		},
		methods: {
			initChart() {
				this.$refs.chart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
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
		width: 100%;
		height: 482rpx;
		margin-bottom: 46rpx;
	}
</style>
