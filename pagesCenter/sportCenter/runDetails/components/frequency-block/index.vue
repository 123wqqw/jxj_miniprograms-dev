<template>
	<view style="width: 100%; height:500rpx">
		<l-echart ref="chart" id="chart"></l-echart>
	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	import {
		dateFormat,
		computeNumber
	} from "@/common/util.js";
	export default {
		props: {
			dataSource: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				data: [],
				option: {
					grid: {
						top: '6%',
						right: '3%',
						bottom: '6%',
						left: '3%',
						containLabel: true,
					},
					tooltip: {
						trigger: 'axis',
						formatter: "{b} {c}步/分钟"
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: [],
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
						},
						axisLabel: {
							show: true,
							color: '#A8ABB2',
						},
					},
					yAxis: [{
						type: 'value',
						name: '',
						interval: 100,
						nameTextStyle: {
							color: '#606266',
							nameLocation: 'start',
						},
						axisLabel: {
							color: '#A8ABB2',
						},
						axisLine: {
							lineStyle: {
								color: '#DCDFE6',
							},
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#DCDFE6'],
							},
						},
					}, ],
					series: [{
						data: [],
						type: 'line',
						symbol: 'none',
						itemStyle: {
							color: '#5C8FF7;',
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: '#5C8FF7',
								},
								{
									offset: 1,
									color: '#fff',
								},
							]),
						},
					}]
				}
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					if (value) {
						this.data = JSON.parse(value)
						if (this.data && this.data.length) {
							this.initChartData()
						}
					}
				},
			},
		},
		methods: {
			initChartData() {
				this.$refs.chart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					this.option.xAxis.data = []
					this.option.series[0].data = []
					this.data.forEach(item => {
						const time = dateFormat(new Date(item.beginTime))
						this.option.xAxis.data.push(time.substring(11, time.length))
						this.option.series[0].data.push(item.stepNum.toFixed(2))
					})
					chart.setOption(this.option);
					// 需要把 chart 返回
					return chart;
				});
			},
		}
	}
</script>

<style scoped lang="scss">
</style>
