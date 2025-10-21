<template>
	<view class="student-physical-detail-container">
		<view class="student-info-box">
			<view class="student-info">
				<image class="avatar" src="../../static/images/boy-avatar.png" mode="aspectFill"></image>
				<view class="info-box">
					<view class="info-text">
						<view class="top">
							<view class="name">何承熹</view>
							<view class="class-name">六年级(1)班</view>
						</view>
						<view class="bottom">学籍号：2020121214245</view>
					</view>
					<view class="score-text">
						<label>84</label>分
					</view>
				</view>
				<!-- #ifndef MP-ALIPAY -->
				<view class="download-btn" @click="downloadPage">下载</view>
				<!-- #endif -->
			</view>
		</view>
		<view class="physical-data">
			<view class="physical-factor-radar">
				<l-echart ref="radarChart"></l-echart>
			</view>
			<view class="physical-score-rank">
				<view class="rank-charts">
					<l-echart ref="rankChart"></l-echart>
					<image class="wave" src="../../static/images/wave.png" mode="aspectFill"></image>
					<view class="class-rank">班级排名：24</view>
				</view>
				<view class="rank-text">
					<view class="level-text">体质风险</view>
					<view class="comment-text">
						体质水平一般
						需加强柔韧性练习，根据基础加强柔韧性练习
					</view>
				</view>
			</view>
			<view class="physical-score-bar">
				<l-echart ref="rankBarChart"></l-echart>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getReq,
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	export default {
		data() {
			return {
				showDownLoadBtn: true,
			}
		},
		onLoad() {
			
		},
		onReady() {
			let alarmData = [{
				value: 83.2,
				name: "肌肉力量与耐力",
			},{
				value: 68.4,
				name: "心肺功能与耐力",
			},{
				value: 100,
				name: "身体成分与营养",
			},{
				value: 100,
				name: "协调性",
			},{
				value: 78,
				name: "柔韧性",
			},{
				value: 100,
				name: "速度与灵敏性",
			}]
			this.initRadarChart(alarmData);
			this.initRankChart();
			this.initRankBarChart();
		},
		methods: {
			initRadarChart(alarmData){
				let _this = this;
				let data = []; // 雷达图数据
				let maxData = 0; // 最大值
				let indicator = []; //雷达图指示器，用来指定雷达图中的多个变量
				let total = 0;
				// 获取数据和最大值
				alarmData.forEach(ele => {
				    total += ele.value;
				    data.push(ele.value);
				    if (ele.value > maxData) {
				        maxData = ele.value;
				    }
				});
				let mult = Math.pow(10, 1); // 需要用0占1位
				maxData = Math.ceil(maxData / mult) * mult; // 向上取整
				
				// 获取指示器数据
				alarmData.forEach(ele => {
				    indicator.push({
				        name: ele.name,
				        max: maxData
				    })
				});
				let buildSeries = function (data) {
				    let helper = data.map((item, index) => {
				        let arr = new Array(data.length);
				        arr.splice(index, 1, item);
				        return arr;
				    });
				
				    return [data, ...helper].map((item, index) => {
				        return {
				            type: 'radar',
				            // 折线拐点标志样式
				            itemStyle: {
				                color: '#5C8FF7'
				            },
				            // 线条样式
				            lineStyle: {
				                color: index === 0 ? '#5C8FF7' : 'transparent'
				            },
				            // 区域填充样式
				            areaStyle: {
				                color: index === 0 ? '#5C8FF7' : 'transparent',
				                opacity: 0.6
				            },
				            // 提示框内容
				            tooltip: {
				                backgroundColor: 'rgba(50,50,50,0.7)',
				                borderWidth: 0,
				                padding: [5, 10],
				                textStyle: {
				                    color: '#5C8FF7',
				                    fontFamily: 'sans-serif'
				                },
				                confine: true, // 提示框显示在canvas以内
				                show: index === 0 ? false : true,
				                formatter: function () {
				                    return indicator[index - 1].name + ' : ' + data[index - 1]
				                }
				            },
				            z: index === 0 ? 1 : 2,
				            data: [item]
				        }
				    })
				}
				let option = {
					tooltip: {},
					radar: {
						center: ['50%', '50%'],
						radius: '50%',
						shape: 'circle',
						// 雷达图每个指示器名称的配置项
						name: {
							formatter: function (name) {
								var i = alarmData.findIndex((arr) => arr.name == name);
								if(alarmData[i].value<60){
									if(name.length>5 && (i == 1 || i == 2 || i == 4 || i == 5)){
										return '{normal|' + name.substring(0,5) + '}' + '\n' + '{normal|' + name.substring(5,name.length) + '}' + '\n' + '{nopass|(' + alarmData[i].value + ')}';
									}
									return '{normal|' + name + '}' + '\n' + '{nopass|(' + alarmData[i].value + ')}';
								}else if(alarmData[i].value>=60 && alarmData[i].value<70){
									if(name.length>5 && (i == 1 || i == 2 || i == 4 || i == 5)){
										return '{normal|' + name.substring(0,5) + '}' + '\n' + '{normal|' + name.substring(5,name.length) + '}' + '\n' + '{pass|(' + alarmData[i].value + ')}';
									}
									return '{normal|' + name + '}' + '\n' + '{pass|(' + alarmData[i].value + ')}';
								}else{
									if(name.length>5 && (i == 1 || i == 2 || i == 4 || i == 5)){
										return '{normal|' + name.substring(0,5) + '}' + '\n' + '{normal|' + name.substring(5,name.length) + '}' + '\n' + '{normal|(' + alarmData[i].value + ')}';
									}
									return '{normal|' + name + '}' + '\n' + '{normal|(' + alarmData[i].value + ')}';
								}
								
							},
							textStyle: {
								color: 'rgba(92, 143, 247, 1)',
								fontSize: '12',
								fontFamily: 'SourceHanSansCN-Regular',
								fontWeight: 400,
								padding: [-10, -4],
								rich: {
									normal: {
										fontSize: 12,
										color: '#464646',
										align: 'center',
										padding: 2,
									},
									nopass: {
										fontSize: 12,
										align: 'center',
										color: '#FF5050',
										padding: 2,
									},
									pass: {
										fontSize: 12,
										align: 'center',
										color: '#EC9131',
										padding: 2,
									}
								}
							}
						},
						// 分隔区域配置项
						splitArea: {
							show: true,
							areaStyle: {
								color: ['transparent']
							}
						},
						// 分割线
						splitLine: {
							lineStyle: {
								color: 'rgba(92, 143, 247, 1)'
							}
						},
						// 坐标轴轴线相关设置
						axisLine: {
							lineStyle: {
								color: 'rgba(92, 143, 247, 1)'
							}
						},
						// 指示器
						indicator: indicator
					},
					series: buildSeries(data)
				};
				_this.$refs.radarChart.init(config => {
					const { canvas } = config;
					const chart = echarts.init(canvas, null, config);
					chart.setOption(option);
					return chart;
				});
			},
			initRankChart(){
				let _this = this;
				let option = {
					angleAxis: {
					  axisLine: {
						show: false
					  },
					  axisLabel: {
						show: false
					  },
					  splitLine: {
						show: false
					  },
					  axisTick: {
						show: false
					  },
					  min: 0,
					  max: 150,
					  startAngle: 210
					},
					radiusAxis: {
					  type: "category",
					  axisLine: {
						show: false
					  },
					  axisTick: {
						show: false
					  },
					  axisLabel: {
						show: false
					  },
					  data: ["a", "b", "c"],
					  z: 10
					},
					polar: {
					  radius: "100%" //调半径
					},
					series: [
					  {
						type: "bar",
						data: [, , (80 / 100) * 100],
						z: 1,
						coordinateSystem: "polar",
						barMaxWidth: 10,
						// name: "警告事件",
						roundCap: true,
						
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						  {
							offset: 0,
							color: 'rgba(66, 170, 255, 0.3)'
						  },
						  {
							offset: 1,
							color: 'rgba(66, 170, 255, 1)'
						  }
						]),
						barGap: "-100%"
					  },
					  {
						type: "bar",
						data: [, , 100],
						z: 0,
						silent: true,
						coordinateSystem: "polar",
						barMaxWidth:10,
						name: "bg",
						roundCap: true,
						color: "#EBEBEB",
						barGap: "-100%"
					  },
					  {
					  type: 'gauge',
					  splitNumber: 0,
					  startAngle: 0,
					  endAngle: 0,
					  splitLine: {
						show: false,
					  },
					  axisLabel: {
						show: false,
					  },
					  pointer: {
						show: false,
					  },
					  title: {
						offsetCenter: [0, '-50%'],
						color: '#707070',
						fontSize: 10,
						fontWeight: 'bolder',
						fontFamily: 'PingFangSC-Regular, PingFang SC'
					  },
					  detail: {
						offsetCenter: [0, 0],
						textStyle: {
						  fontSize: '36',
						  fontWeight: 'bolder',
						  color: '#10354F',
						  fontFamily: 'Impact'
						},
						formatter:function(e){
							return e+'%';
						}
					  },
					  data: [
						{
						  name: '打败了全年级',
						  value: 80,
						},
					  ],
					},
					],
					tooltip: {
					  show: false
					}
				};
				_this.$refs.rankChart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					// canvas.setChart(chart);
					chart.setOption(option);
					// 需要把 chart 返回
					return chart;
				});
			},
			initRankBarChart(){
				let _this = this;
				let option = {
					backgroundColor: '#FFFFFF',
					legend: {
						data: ['年级', '班级'],
						textStyle: {
							color: '#545454',
						},
						top: 'top',
						left: 'left',
					},
					tooltip: {
						confine: true,
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						left: '5%',
						right: '10%',
						bottom: '10%',
						top: '40px',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						axisLabel: {
							color: '#545454',
						},
						splitLine: {
							lineStyle: {
								type: 'dashed',
								color: '#E9E9E9'
							}
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: "#E9E9E9"
							}
						},
					},
					yAxis: {
						data: ['体测总分', '身体成分与营养', '心肺功能与耐力', '肌肉力量与耐力', '速度与灵敏性', '柔韧性', '协调性'],
						axisLabel: {
							color: '#545454',
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#545454',
							}
						},
					},
					// grid: [{
					// 	bottom: '55%',
					// 	top: '15%',
					// 	left: '15%',
					// 	right: '5%',
					// }],
					series: [{
							name: '年级',
							type: 'bar',
							barWidth: 8,
							label: {
								show: true,
								position: 'right',
								fontSize: '10'
							},
							itemStyle: {
								color: '#5C8FF7'
							},
							data: [78, 100, 50, 60, 90, 60, 90],
							barGap: '0%'
						},
						{
							name: '班级',
							type: 'bar',
							barWidth: 8,
							label: {
								show: true,
								position: 'right',
								fontSize: '10'
							},
							itemStyle: {
								color: '#60E0AD'
							},
							data: [88, 100, 90, 72, 82, 72, 82],
							barGap: '0%'
						}
					]
				};
				_this.$refs.rankBarChart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					// canvas.setChart(chart);
					chart.setOption(option);
					// 需要把 chart 返回
					return chart;
				});
			},
			downloadPage(){
				// #ifndef MP-ALIPAY
				let _this = this;
				uni.canvasToTempFilePath({
					canvasId: 'pageCanvas',
					success: function(res) {
						// 在H5平台下，tempFilePath 为 base64
						console.log(res.tempFilePath)
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success:function(response){
								uni.showToast({
									icon: 'none',
									title: '下载成功！',
									duration: 1000
								})
							},
							fail:function(err){
								uni.showToast({
									icon: 'none',
									title: '下载失败！',
									duration: 1000
								})
							}
						})
					}
				})
				// #endif
			},
		}
	}
</script>

<style scoped lang="scss">
.student-physical-detail-container{
	width: 100%;
	overflow: hidden;
	.student-info-box{
		width: 100%;
		height: 280upx;
		background-color: #5C8FF7;
		background: url(../../static/images/student-detail-bg.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: 0;
		left: 0;
		.student-info{
			width: 100%;
			height: 176upx;
			padding: 40upx 32upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.avatar{
				width: 96upx;
				height: 96upx;
				min-width: 96upx;
				margin-right: 16upx;
				border-radius: 50%;
			}
			.info-box{
				flex: 1;
				height: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.info-text{
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.top{
						display: flex;
						align-items: center;
						.name{
							font-size: 28upx;
							font-weight: 500;
							color: #FFFFFF;
						}
						.class-name{
							height: 48upx;
							padding: 0 14upx;
							font-size: 20upx;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 46upx;
							border-radius: 8upx;
							border: 1upx solid #FFFFFF;
							margin-left: 16upx;
						}
					}
					.bottom{
						font-size: 24upx;
						line-height: 36upx;
						font-weight: 400;
						color: #FFFFFF;
						margin-top: 8upx;
					}
				}
				.score-text{
					font-size: 40upx;
					color: #FFFFFF;
					font-weight: 400;
					vertical-align: baseline;
					label{
						font-size: 80upx;
					}
				}
			}
			.download-btn{
				width: 88upx;
				height: 48upx;
				margin-left: 24upx;
				border-radius: 24upx;
				background-color: #FFFFFF;
				font-size: 24upx;
				font-weight: 400;
				color: #5C8FF7;
				line-height: 48upx;
				text-align: center;
			}
		}
	}
	.physical-data{
		width: 100%;
		margin-top: 184upx;
		padding-bottom: 44rpx;
		position: relative;
		z-index: 1;
		.physical-factor-radar{
			width: 704upx;
			height: 440upx;
			margin: 0 auto;
			border-radius: 24upx;
			overflow: hidden;
			background-color: #FFFFFF;
			box-shadow: 0upx 0upx 16upx 0upx rgba(0, 0, 0, 0.08), 0upx 0upx 2upx 0upx rgba(0, 0, 0, 0.1);
			padding: 24upx;
		}
		.physical-score-rank{
			width: 704upx;
			height: 360upx;
			margin: 0 auto;
			margin-top: 24upx;
			border-radius: 24upx;
			overflow: hidden;
			background-color: #FFFFFF;
			box-shadow: 0upx 0upx 16upx 0upx rgba(0, 0, 0, 0.08), 0upx 0upx 2upx 0upx rgba(0, 0, 0, 0.1);
			padding: 24upx;
			display: flex;
			.rank-charts{
				flex: 1;
				height: 100%;
				position: relative;
				.wave{
					width: 163upx;
					height: 34upx;
					position: absolute;
					bottom: 70upx;
					left: 50%;
					transform: translateX(-50%);
				}
				.class-rank{
					width: 100%;
					height: 32upx;
					position: absolute;
					bottom: 8upx;
					left: 0;
					text-align: center;
					line-height: 32upx;
					font-size: 24upx;
					font-weight: 400;
					color: #202020;
				}
			}
			.rank-text{
				width: 298upx;
				height: 100%;
				display: flex;
				flex-direction: column;
				.level-text{
					margin-top: 8upx;
					margin-bottom: 16upx;
					font-size: 32upx;
					font-weight: 500;
					color: #202020;
				}
				.comment-text{
					width: 100%;
					font-size: 24upx;
					font-weight: 400;
					color: #707070;
					line-height: 32upx;
				}
			}
		}
		.physical-score-bar{
			width: 704upx;
			height: 660upx;
			margin: 0 auto;
			margin-top: 24upx;
			border-radius: 24upx;
			overflow: hidden;
			background-color: #FFFFFF;
			box-shadow: 0upx 0upx 16upx 0upx rgba(0, 0, 0, 0.08), 0upx 0upx 2upx 0upx rgba(0, 0, 0, 0.1);
			padding: 24upx;
		}
	}
}
</style>
