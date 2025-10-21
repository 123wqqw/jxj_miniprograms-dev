<template>
	<view class="line-chart" v-if="types && types.length">
		<view class="operation">
			<view class="u-flex">
				<u-icon size="26" name="arrow-left" v-if="dateIndex(newDate) > dateIndex(startDate)"
					@click="handleDate(-1)"></u-icon>
				<view class="date-name">
					{{ timeFormat(newDate) }}
				</view>
				<u-icon size="26" name="arrow-right" v-if="dateIndex(newDate) < dateIndex(endDate)"
					@click="handleDate(1)"></u-icon>
			</view>
			<view :class="['switch_change',{'switch_change--on': type}]" @click="changeMode">
				<view class="switch_box">
					<view :class="['switch',{ active: !type }]">公里</view>
					<view :class="['switch',{ active: type }]" v-if="types[1] === 2">{{$t('center.count')}}</view>
					<view :class="['switch',{ active: type }]" v-else>{{$t('center.numbers')}}</view>
				</view>
				<view class="switch_node"></view>
			</view>
		</view>
		<view style="width: 100%; height:430rpx">
			<l-echart ref="chart"></l-echart>
		</view>
	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	import {
		mapState
	} from 'vuex'
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		dateFormat,
		dateNew,
		computeNumber
	} from '@/common/util.js'
	export default {
		data() {
			const dateIndex = (time) => {
				const date = new Date(time)
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				return year + month
			}

			const timeFormat = (time) => {
				const date = new Date(time)
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				return `${year}年${month}月`
			}
			return {
				timeFormat,
				dateIndex,
				type: true,
				types: [],
				startDate: 0,
				endDate: 0,
				newDate: 0,
				isShow: false,
				dataSource: {},
				option: {
					tooltip: {
						show: true, // 是否显示
						trigger: 'axis', // 触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
						axisPointer: { // 坐标轴指示器配置项。
							type: 'none', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
							axis: 'auto', // 指示器的坐标轴。 
							snap: true, // 坐标轴指示器是否自动吸附到点上
						},
						backgroundColor: '#5C8FF7', // 提示框浮层的背景颜色。
						borderColor: '#5C8FF7', // 提示框浮层的边框颜色。
						borderWidth: 0, // 提示框浮层的边框宽。
						padding: 4, // 提示框浮层内边距，
						textStyle: { // 提示框浮层的文本样式。
							color: '#fff',
							fontStyle: 'normal',
							fontWeight: '400',
							fontFamily: 'PingFangSC-Regular, PingFang SC',
							fontSize: 14,
						},
						confine: false, // 是否将 tooltip 框限制在图表的区域内。
						formatter: (data) => {
							return `${data[0].axisValue}\n${data[0].seriesName} ${data[0].value}`
						}
					},
					grid: {
						left: '3%',
						right: '3%', //因旋转导致名字太长的类目造成遮蔽，可以配合这两个属性
						bottom: '16', // 分别表示：距离左边距和底部的距离，具体数值按实际情况调整
						top: '10%',
						containLabel: true,
					},
					xAxis: {
						type: 'category',
						data: [],
						axisLabel: {
							show: true,
							color: '#202020'
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						}
					},
					yAxis: [{
						type: 'value',
						axisLabel: {
							textStyle: {
								color: '#000000'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#E9E9E9'
							}
						}
					}],
					series: [{
						name: "",
						data: [],
						type: 'line',
						color: "#5C8FF7",
						smooth: true,
						showSymbol: false,
						itemStyle: {
							normal: {
								lineStyle: {
									width: 3
								}
							}
						},
					}],
				}
			}
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		methods: {
			/**
			 * 跑步统计 - 基本数据
			 * @prams schoolId
			 * @prams sid
			 * @prams type
			 */
			apiGetRunStatsTrend(type, types, dataSource) {
				this.dataSource = dataSource;
				this.type = type === 1 ? false : true;
				this.types = types
				this.inintDate()
			},
			inintDate() {
				this.startDate = new Date(this.dataSource.startDate).getTime()
				this.endDate = new Date(this.dataSource.endDate).getTime()
				const newTime = new Date().getTime()
				this.isShow = true
				if (!this.dataSource.sid || newTime < this.startDate) {
					this.newDate = newTime
					this.isShow = false
					return
				}
				if (newTime >= this.endDate) {
					this.newDate = this.endDate
				} else if (newTime >= this.startDate && newTime < this.endDate) {
					this.newDate = new Date(dateNew(new Date())[0]).getTime()
				}
				this.handleDate(0)
			},
			changeMode() {
				this.type = !this.type;
				this.inintDate()
			},
			getDateTimeStrByMonth(nowDate, count) {
				const endDate = new Date(nowDate)
				endDate.setMonth(endDate.getMonth() + count)
				const year = endDate.getFullYear()
				let month = endDate.getMonth() + 1
				month = month < 10 ? '0' + month : month
				let day = endDate.getDate()
				day = day < 10 ? '0' + day : day
				const start = year.toString() + '-' + month.toString() + '-' + day.toString()
				return start
			},
			handleDate(number) {
				this.newDate = new Date(this.getDateTimeStrByMonth(this.newDate, number)).getTime()
				const newTime = dateNew(this.newDate)
				const startDate = new Date(this.dataSource.startDate).getTime()
				const endDate = new Date(this.dataSource.endDate).getTime()
				const b =
					new Date(newTime[0]) <= new Date(startDate) ?
					dateFormat(new Date(startDate), 'yyyy-MM-dd') :
					newTime[0]
				const c =
					new Date(newTime[1]) >= new Date(endDate) ?
					dateFormat(new Date(endDate), 'yyyy-MM-dd') :
					newTime[1]
				const params = {
					...this.dataSource,
					startDate: b,
					endDate: c,
					type: !this.type ? this.types[0] : this.types[1]
				}
				getReq(URL.runStatsTrend, {
					...params
				}).then(res => {
					this.option.xAxis.data = []
					this.option.series[0].data = []
					this.option.series[0].name = ""
					if (res.data && res.data.length) {
						res.data.forEach((item) => {
							this.option.xAxis.data.push(dateFormat(new Date(item.day), 'yyyy-MM-dd').slice(
								5, 10))
							if (!this.type) {
								this.option.series[0].data.push(computeNumber(item.runKilometers, '/',
									1000).result)
								this.option.series[0].name = this.$t('center.kilometers')
							} else if (this.types[1] === 2) {
								this.option.series[0].data.push(item.runCount)
								this.option.series[0].name = this.$t('center.count')
							} else if (this.types[1] === 3) {
								this.option.series[0].data.push(item.count)
								this.option.series[0].name = this.$t('center.numbers')
							}
						})
					}
					this.initLineChart()
				}).catch(error => {
					this.option.xAxis.data = []
					this.option.series[0].data = []
					this.option.series[0].name = ""
					this.initLineChart()
				})
			},
			initLineChart() {
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

<style lang="scss" scoped>
	.line-chart {
		margin: 0 24rpx 4rpx 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 14rpx 0px rgba(243, 243, 243, 0.5000);
		border-radius: 16rpx;
		border: 1rpx solid #F7F7F7;
	}

	.operation {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 32rpx 24rpx;
	}

	.switch_change {
		width: 192rpx;
		height: 48rpx;
		border-radius: 28rpx;
		background-color: #F7F7F7;
		position: relative;
		float: right;
		color: #B2B2B2;
		font-size: 24rpx;

		.switch_node {
			width: 96rpx;
			height: 48rpx;
			border-radius: 28rpx;
			background-color: #5C8FF7;
			position: absolute;
			top: 0;
			left: 0;
			transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
			transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05), -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
			transition: transform cubic-bezier(0.3, 1.05, 0.4, 1.05);
			transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05)
		}

		.switch_box {
			width: 100%;
			height: 100%;
			position: relative;
			z-index: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.switch {
				flex: 1;
				text-align: center;
				font-weight: 400;
			}

			.active {
				color: #FFFFFF;
			}
		}
	}

	.switch_change--on {
		.switch_node {
			transform: translateX(100%);
		}
	}

	.date-name {
		font-size: 32rpx;
		line-height: 45rpx;
		font-weight: 400;
		color: #202020;
		margin: 0 24rpx 0 24rpx;
	}
</style>
