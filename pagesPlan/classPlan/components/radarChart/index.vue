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
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				option: {
					radar: {
						radius: '56%',
						axisName: {
							formatter: function(value) {
								let type = 'b'
								let text = ""
								if (Number(value.split(',')[1]) >= 85) {
									text = "优秀"
									type = 'c'
								} else if (Number(value.split(',')[1]) >= 70 && Number(value.split(',')[1]) < 85) {
									text = "尚好"
									type = 'c'
								} else if (Number(value.split(',')[1]) >= 60 && Number(value.split(',')[1]) < 70) {
									text = "一般"
									type = 'd'
								} else {
									text = "较弱"
									type = 'e'
								}
								return [`{a|${value.split(',')[0]}}`, `{${type}|（${value.split(',')[1]}）}{x|${text}}`]
									.join(
										'\n');
							},
							rich: {
								a: {
									color: '#202020',
									fontWeight: 'bold',
									fontSize: 12,
									lineHeight: 18
								},
								c: {
									color: "#24D0A2",
									fontWeight: 'bold',
									fontSize: 12,
									lineHeight: 18
								},
								d: {
									color: "#EC9131",
									fontWeight: 'bold',
									fontSize: 12,
									lineHeight: 18
								},
								e: {
									color: "#FF5050",
									fontWeight: 'bold',
									fontSize: 12,
									lineHeight: 18
								},
								x: {
									color: '#202020',
									fontSize: 10,
									fontWeight: '400',
									lineHeight: 15
								}
							}
						},
						axisLine: {
							show: false
						},
						splitLine: {
							lineStyle: {
								color: '#B2B2B2'
							}
						},
						splitArea: {
							show: false
						},
						indicator: []
					},
					series: [{
						type: 'radar',
						data: [{
							value: [],
							itemStyle: {
								color: '#24D0A2'
							},
							areaStyle: {
								color: 'rgba(36, 208, 162, 0.2)'
							}
						}]
					}]
				}
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					if (value && value.length) {
						this.initChart()
					}
				},
				deep: true
			}
		},
		methods: {
			initChart() {
				this.$refs.chart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					this.option.radar.indicator = this.dataSource.map(item => ({
						name: `${item.dimensionName},${item.score.toFixed(2)}`,
						max: 100
					}))
					this.option.series[0].data[0].value = this.dataSource.map(item => item.score)

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
		height: 600rpx;
	}
</style>
