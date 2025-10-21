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
				<view class="download-btn" @click="downloadPage" v-if="showDownLoadBtn">下载</view>
				<!-- #endif -->
			</view>
		</view>
		<view class="physical-data">
			<view class="physical-score-list">
				<view class="mark-item">
					<view class="mark-key">左眼视力</view>
					<view class="mark-value">
						<label class="value-span">4.7</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">左眼视力</view>
					<view class="mark-value">
						<label class="value-span">4.7</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">身高</view>
					<view class="mark-value">
						<label class="value-span">144.5cm</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">体重</view>
					<view class="mark-value">
						<label class="value-span">43.4kg</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">BMI</view>
					<view class="mark-value">
						<label class="value-span">20.10（100分）</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">肺活量</view>
					<view class="mark-value">
						<label class="value-span">1600毫升(80分)</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">50米跑</view>
					<view class="mark-value">
						<label class="value-span">12秒（66分）</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">坐位体前屈</view>
					<view class="mark-value">
						<label class="value-span">0厘米（0分）</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">仰卧起坐</view>
					<view class="mark-value">
						<label class="value-span">未测</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">50*8往返跑</view>
					<view class="mark-value">
						<label class="value-span">未测</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">一分钟跳绳</view>
					<view class="mark-value">
						<label class="value-span">140次（78分）</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key"></view>
					<view class="mark-value">
						<label class="value-span"></label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">标准分</view>
					<view class="mark-value">
						<label class="value-span">71.7分</label>
					</view>
				</view>
				<view class="mark-item">
					<view class="mark-key">附加分</view>
					<view class="mark-value">
						<label class="value-span">0分</label>
					</view>
				</view>
			</view>
			<view class="physical-score-rank">
				<view class="rank-charts">
					<l-echart ref="rankChart"></l-echart>
					<image class="wave" src="../../static/images/wave.png" mode="aspectFill"></image>
					<view class="class-rank">班级排名：24</view>
				</view>
				<view class="rank-text">
					<view class="level-text">良好</view>
					<view class="comment-text">
						本次体测成绩【良好】，运动能力良好，请继续保持，肺活量低于年级平均水平，需加强练习
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
			this.initRankChart();
			this.initRankBarChart();
		},
		methods: {
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
						data: ['体测总分', 'BMI', '50米跑', '坐位体前屈', '仰卧起坐'],
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
							barWidth: 18,
							label: {
								show: true,
								position: 'right',
								fontSize: '11'
							},
							itemStyle: {
								color: '#5C8FF7'
							},
							data: [78, 100, 50, 60, 90],
							barGap: '0%'
						},
						{
							name: '班级',
							type: 'bar',
							barWidth: 18,
							label: {
								show: true,
								position: 'right',
								fontSize: '11'
							},
							itemStyle: {
								color: '#60E0AD'
							},
							data: [88, 100, 90, 72, 82],
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
				_this.showDownLoadBtn = false;
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
					},
					complete: function(com){
						_this.showDownLoadBtn = true;
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
		.physical-score-list{
			width: 704upx;
			margin: 0 auto;
			border-radius: 24upx;
			overflow: hidden;
			display: flex;
			flex-wrap: wrap;
			border: 1upx solid #E8E8E8;
			box-shadow: 0upx 0upx 16upx 0upx rgba(0, 0, 0, 0.08), 0upx 0upx 2upx 0upx rgba(0, 0, 0, 0.1);
			.mark-item{
				display: flex;
				width: 50%;
				height: 55upx;
				line-height: 55upx;
				font-size: 0;
				border-bottom: 1upx solid #E8E8E8;
				overflow: hidden;
				font-size: 20upx;
				font-weight: 400;
				.mark-key{
					min-width: 174upx;
					height: 100%;
					text-align: left;
					border-right: 1upx solid #E8E8E8;
					background-color: #EBEBEB;
					color: #464646;
					padding: 0 24upx;
				}
				.mark-value{
					flex: 1;
					height: 100%;
					padding-left: 16upx;
					background-color: #FFFFFF;
					color: #707070;
				}
			}
			.mark-item:nth-last-child(1), .mark-item:nth-last-child(2){
				border-bottom: none;
			}
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
				width: 305upx;
				height: 100%;
				display: flex;
				flex-direction: column;
				.level-text{
					margin-top: 8upx;
					margin-bottom: 16upx;
					font-size: 40upx;
					font-weight: 500;
					color: #5C8FF7;
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
