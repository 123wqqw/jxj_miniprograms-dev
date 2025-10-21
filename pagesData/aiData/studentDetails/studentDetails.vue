<template>
	<view class="maxBox">
		<view class="classTitle">
			<image :src="listBase.avatar" mode="" class="userAvatar"></image>

			<view class="classNumber">
				{{listBase.name}}
			</view>
			<view class="numData">
				{{$t('common.studentNumber')}}： {{listBase.studentNumber}}
			</view>
			<view class="className">
				{{listBase.className}}
			</view>
		</view>
		<!-- 选择日期 -->
		<view class="search-date" @click="showSelectDate=true">
			{{searchForm.startDate}} 至 {{searchForm.endDate}}
			<image src="../../static/images/change-down.png" mode=""></image>
		</view>
		<!-- 人均运动数据 -->
		<view class="sportData">
			<view class="sportData-header">
				{{$t('common.sport')}}{{$t('common.data')}}
			</view>
			<view class="sportData-main">
				<view>
				</view>
				<view>
					{{$t('common.sport')}}{{$t('common.minute')}}
				</view>
				<view>
					{{list.sportCount.capitaExerciseTime?list.sportCount.capitaExerciseTime:0}}
				</view>
			</view>
			<view class="sportData-main sportData-main2">
				<view>
				</view>
				<view>
					{{$t('common.sport')}}{{$t('common.times')}}
				</view>
				<view>
					{{list.sportCount.capitaExerciseNum?list.sportCount.capitaExerciseNum:0}}
				</view>
			</view>
			<view class="sportData-main sportData-main3">
				<view>
				</view>
				<view>
					{{$t('common.sport')}}{{$t('common.program')}}
				</view>
				<view>
					{{list.sportCount.sportCount?list.sportCount.sportCount:0}}
				</view>
			</view>
			<view class="xian">

			</view>
		</view>
		<!-- 人均每日运动情况 -->
		<view class="situationBox">
			<view class="situation-title">
				每日{{$t('common.sport')}}情况
			</view>
			<view class="situation-type">
				<text></text><text>{{$t('common.one')}}人</text>
				<text></text><text>{{$t('common.gradeText')}}人均</text>
			</view>
			<view class="situation-switch">
				<text @click="situationSwitch(1)" :class="minAndCount==1?'active-text':''">{{$t('common.minute')}}</text> <text
					:class="minAndCount==2?'active-text':''" @click="situationSwitch(2)">{{$t('common.times')}}</text>
			</view>
			<!-- echarts -->
			<view class="situation-echarts">
				<l-echart ref="chart" v-show="!showSelectDate"></l-echart>
			</view>
		</view>
		<!-- 详细运动记录 -->
		<block>
			<view class="sportItem" v-if="list.sportDetailsList!=null&&list.sportDetailsList.length!=0">
				<view class="sportItem-title">
					<text>{{$t('data.aiData.studentDetails.detailSportRecord')}}</text>
					<text>共 <text style="color: #5C8FF7;">{{list.sportDetailsList.length}}</text> 个{{$t('common.program')}}</text>
				</view>
				<view class="item-title">
					<text>{{$t('common.orderNumber')}}</text> <text>{{$t('common.program')}}</text> <text @click="sort1">{{$t('common.sport')}}{{$t('common.dayNum')}}</text><text @click="sort2">{{$t('common.sport')}}{{$t('common.minute')}}</text> <text @click="sort3">{{$t('common.sport')}}{{$t('common.times')}}</text>
					<image src="../../static/images/switchover.png" mode="" class="switchover1" @click="sort1">
					</image>
					<image src="../../static/images/switchover.png" mode="" class="switchover2" @click="sort2">
					</image>
					<image src="../../static/images/switchover.png" mode="" class="switchover3" @click="sort3">
					</image>
				</view>
				<view class="scroll-item">
					<view class="item-table" v-for="(item,index) in list.sportDetailsList" :key="item.sportId" @click="navItemDetails(index)">
						<text>{{index+1}}</text><text style="color:#5C8FF7 ;">{{item.sportName}}</text><text>{{item.dateCount}}</text><text>{{item.capitaExerciseTime}}</text><text>{{item.capitaExerciseNum}}</text>
						<image src="../../../static/images/common/arrow-black.png" mode=""></image>
					</view>

				</view>
			</view>
			<view class="null" v-else>
				<view class="">
					<image src="../../static/images/nullFianco.png" mode=""></image>
					<text>{{$t('common.none')}}{{$t('data.aiData.index.title')}}</text>
				</view>

			</view>
		</block>

		<!-- 选择日期范围 -->
		<u-calendar v-model="showSelectDate" mode='range' @change="change" :change-year="false" :max-year='year'
			:min-year='year' :safe-area-inset-bottom='true' :min-date="year+ '-' + (month-1) + '-'+'1'"></u-calendar>

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
			const d = new Date()
			const year = d.getFullYear()
			let month = d.getMonth() + 1
			return {
				studentId: '', //上个页面带过来班级id
				listBase: {
					avatar: "",
					className: "",
					name: "",
					studentNumber: "",
				}, //班级详情-基本信息
				showSelectDate: false, //打开选择日期组件
				d,
				year,
				month, //年月日
				searchForm: {
					startDate: "",
					endDate: ""
				},
				minAndCount: 2, //选择 1分钟还是 2次数
				list: { //大详情
					
				},
				
				//国际化
				personText: this.$t('common.one') + '人',
				gradeText: this.$t('common.gradeText'),
				classText: this.$t('common.classText'),
				dateChangeWarning: this.$t('data.aiData.classDetails.dateChangeWarning'),
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: this.$t('data.aiData.studentDetails.title')
			})
			const eventChannel = this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('studentDetails', data=> {
				this.studentId = data.studentId;
				if(!data.searchForm.startDate || !data.searchForm.endDate){
					this.fun_date(6);//首次进入赋值最近7天的日期  
				}else{
					this.searchForm = data.searchForm;
				}
				this.initData() 
			})
		},
		methods: {
			initData() {
				//学生详情-头部信息
				postReq(URL.studentInfo, {
					studentIds: [this.studentId]
				}).then(res => {
					if (res.error == 10000) {
						this.listBase = res.data[0]
						// console.log('基本信息', res.data)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
				//学生详情-学生大详情
				getReq(URL.getStudentDetailsCount, {
					studentId: this.studentId,
					startDate: this.searchForm.startDate,
					endDate: this.searchForm.endDate,
				}).then(res => {
					if (res.error == 10000) {
						// console.log('学生大详情', res)
						  this.list=res.data
						  this.initEcharts()
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})


			},
			//初始化echarts
			initEcharts() {
				let dateData = this.list.studentCountDaily.exerciseDateList.map(item => {
					return item.split('.')[1] + '.' + item.split('.')[2]
				})
				let option = {
					tooltip: {
						confine: true,
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '0%',
						top: '20upx',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: dateData,
						axisTick: {
							show: false,
							alignWithLabel: true
						},
						axisLine: {
							lineStyle: {
								color: '#BFBFBF'
							},
						},
						axisLabel: {
							color: '#545454'
						}

					}],
					yAxis: [{
						/* type: 'value', */
						// show:false,
						axisLabel: {
							show: false
						},
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed'
							}
						}
						/*  min: 0,
						 max: 250,
						 interval: 50, */
					}],
					series: [{
							name: this.personText,
							type: 'bar',
							barWidth: 18,
							label: {
								show: true,
								position: 'top',
								fontSize: '11'
							},
							itemStyle: {
								color: '#8193FF'
							},
							data: this.minAndCount == 2 ? this.list.studentCountDaily.capitaNumList : this.list
								.studentCountDaily.capitaTimeList,
							barGap: '0%'
						},
						{
							name: this.gradeText,
							type: 'bar',
							barWidth: 18,
							label: {
								show: true,
								position: 'top',
								fontSize: '11'
							},
							itemStyle: {
								color: '#69E3E8'
							},
							data: this.minAndCount == 2 ? this.list.gradeCountDaily.capitaNumList : this.list
								.gradeCountDaily.capitaTimeList,
						}
					]
				}

				this.$refs.chart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);
					canvas.setChart(chart);
					chart.setOption(option);
					// 需要把 chart 返回
					return chart;
				});

			},
			//确认选择日期范围 
			change(e) {
				if (this.DateDiff(e.startDate, e.endDate) > 7) {
					uni.showToast({
						icon: 'none',
						title: this.dateChangeWarning,
						duration: 2000
					})

				} else {
					this.searchForm.startDate = e.startDate
					this.searchForm.endDate = e.endDate
					//班级详情-统计信息
					getReq(URL.getStudentDetailsCount, {
						studentId: this.studentId,
						startDate: this.searchForm.startDate,
						endDate: this.searchForm.endDate,
					}).then(res => {
						if (res.error == 10000) {
							console.log('学生大详情', res)
							this.list = res.data
							this.initEcharts()
						} else {
							uni.showToast({
								icon: 'none',
								title: res.message,
								duration: 1000
							})
						}
					})
				}
			},
			//获取7天前的日期
			fun_date(num) { //num 是天数
				var date1 = new Date();
				//今天时间
				var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
				var date2 = new Date(date1);
				date2.setDate(date1.getDate() - num);
				//num是正数表示之后的时间，num负数表示之前的时间，0表示今天
				var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
				this.searchForm.startDate = time2
				this.searchForm.endDate = time1
			},
			//判断2个日期是否大于7天 
			DateDiff(sDate1, sDate2) { //sDate1和sDate2是yyyy-MM-dd格式 
				var aDate, oDate1, oDate2, iDays;
				aDate = sDate1.split("-");
				oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为yyyy-MM-dd格式
				aDate = sDate2.split("-");
				oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
				iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数 
				return iDays + 1; //返回相差天数 当日也计算
			},
			//situationSwitch
			situationSwitch(i) {
				//i==1 分钟  i==2 次数
				this.minAndCount = i
				this.initEcharts()
			},
			sort1() {
				//运动天数
				if (this.list.sportDetailsList[0].dateCount >= this.list.sportDetailsList[1].dateCount) {
					//排正序
					this.list.sportDetailsList.sort(function(x, y) {
						return x['dateCount'] - y['dateCount']
					});
				} else {
					//排反序
					this.list.sportDetailsList.sort(function(x, y) {
						return y['dateCount'] - x['dateCount']
					});
				}
			},
			sort2() {
				//运动时间(分钟)
				if (this.list.sportDetailsList[0].capitaExerciseTime >= this.list.sportDetailsList[1].capitaExerciseTime) {
					//排正序
					this.list.sportDetailsList.sort(function(x, y) {
						return x['capitaExerciseTime'] - y['capitaExerciseTime']
					});
				} else {
					//排反序
					this.list.sportDetailsList.sort(function(x, y) {
						return y['capitaExerciseTime'] - x['capitaExerciseTime']
					});
				}
			},
			sort3() { 
				//运动次数
				if (this.list.sportDetailsList[0].capitaExerciseNum >= this.list.sportDetailsList[1].capitaExerciseNum) {
					//排正序 
					this.list.sportDetailsList.sort(function(x, y) {
						return x['capitaExerciseNum'] - y['capitaExerciseNum']
					});
				} else {
					//排反序
					 
					this.list.sportDetailsList.sort(function(x, y) {
						return y['capitaExerciseNum'] - x['capitaExerciseNum']
					});
				}
			},
			navItemDetails(index){
				uni.navigateTo({
					url:'/pagesData/aiData/itemDetails/itemDetails',
					success:res=> {
						// 通过eventChannel向被打开页面传送数据
						let params={
							name:this.list.sportDetailsList[index].sportName,
							list:this.list.sportDetailsList[index].dailyDetailList
						}
						res.eventChannel.emit('dailyDetailList',params )
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox {
		.classTitle {
			width: 750upx;
			height: 144upx;
			background: #FFFFFF;
			position: relative;

			.userAvatar {
				width: 96upx;
				height: 96upx;
				position: absolute;
				top: 23upx;
				left: 32upx;
				border-radius: 50%;
			}

			.classNumber {
				height: 36upx;
				font-size: 28upx;
				font-weight: 900;
				color: #202020;
				position: absolute;
				top: 29upx;
				left: 144upx;

			}

			.numData {
				font-size: 24upx;
				font-weight: 400;
				color: #707070;
				position: absolute;
				bottom: 29upx;
				left: 144upx;
			}

			.className {
				width: 92upx;
				height: 35upx;
				border-radius: 17upx;
				border: 1upx solid #5C8FF7;
				line-height: 35upx;
				text-align: center;
				font-size: 18upx;
				font-weight: 400;
				color: #5C8FF7;
				position: absolute;
				top: 33upx;
				left: 248upx;
			}
		}

		.search-date {
			width: 750upx;
			height: 64upx;
			background: #F9F8F8;
			box-sizing: border-box;
			padding-left: 32upx;
			font-size: 24upx;
			font-weight: 400;
			color: #202020;

			>image {
				width: 18upx;
				height: 18upx;
				margin-top: 24upx;
				margin-left: 10upx;
			}
		}

		.sportData {
			width: 750upx;
			height: 277upx;
			background: #FFFFFF;
			border-radius: 1upx;
			overflow: hidden;

			.sportData-header {
				font-size: 32upx;
				font-weight: 600;
				color: #202020;
				margin: 32upx 0 0 32upx;
			}

			.sportData-main {
				width: 208upx;
				height: 144upx;
				background: #F9F8F8;
				border-radius: 16upx;
				display: inline-block;
				margin-left: 32upx;
				margin-top: 24upx;

				>view:nth-of-type(1) {
					width: 9upx;
					height: 24upx;
					background: #5C8FF7;
					border-radius: 5upx;
					margin: 30upx 8upx 0 40upx;
					display: inline-block;
				}

				>view:nth-of-type(2) {
					font-size: 28upx;
					font-weight: 400;
					color: #707070;
					display: inline-block;
					margin-top: 22upx;

				}

				>view:nth-of-type(3) {
					font-size: 48upx;
					font-weight: bold;
					color: #202020;
					margin-top: 5upx;
					margin-left:57upx;
				}
			}

			.sportData-main2 {
				margin-left: 30upx; 
				>view:nth-of-type(1) {
					background: #8889FF; 
				}
			}
			.sportData-main3 {
				>view:nth-of-type(1) { 
					background: #3EC5A5; 
				}
				margin-left: 30upx; 
			}

			.xian {
				width: 686upx;
				height: 1upx;
				background: #DDDDDD;
				margin-left: 32upx;
				margin-top: 32upx;
			}
		}

		.situationBox {
			width: 750upx;
			height: 562upx;
			background: #FFFFFF;
			border-radius: 1upx;
			overflow: hidden;
			position: relative;

			.situation-title {
				height: 45upx;
				font-size: 32upx;
				font-weight: 600;
				color: #202020;
				margin: 32upx 0 0 32upx;
			}

			.situation-type {
				margin: 16upx 0 0 32upx;

				>text:nth-of-type(1) {
					display: inline-block;
					width: 18upx;
					height: 17upx;
					background: #5C8FF7;
					margin-right: 8upx;
				}

				>text:nth-of-type(2) {
					font-size: 24upx;
					font-weight: 400;
					color: #464646;
					margin-right: 39upx;
				}

				>text:nth-of-type(3) {
					display: inline-block;
					width: 18upx;
					height: 17upx;
					background: #60E0AD;
					margin-right: 8upx;
				}

				>text:nth-of-type(4) {
					display: inline-block;
					font-size: 24upx;
					font-weight: 400;
					color: #464646;
				}
			}

			.situation-switch {
				width: 208upx;
				height: 56upx;
				background: #F9F8F8;
				border-radius: 28upx;
				position: absolute;
				right: 32upx;
				top: 32upx;

				>text {
					display: inline-block;
					width: 104upx;
					height: 56upx;
					text-align: center;
					border-radius: 28upx;
					line-height: 56upx;
					font-size: 24upx;
				}

				.active-text {
					background: #5C8FF7;
					color: #FFFFFF;
				}

			}

			.situation-echarts {
				margin-top: 40upx;
				width: 686upx;
				height: 370upx;
				margin-left: 32upx;
				// border: 1px solid #f6f6f6;
			}
		}

		.null {
			width: 750upx;
			height: 444upx;
			background: #FFFFFF;
			margin-top: 16upx;
			overflow: hidden;

			>view {
				margin-top: 135upx;
				display: flex;
				align-items: center;
				flex-direction: column;

				image {
					width: 250upx;
					height: 144upx;
				}

				text {
					font-size: 24rpx;
					color: #707070;
				}
			}

		}

		.sportItem {
			width: 750upx;
			height: 444upx;
			background: #FFFFFF;
			border-radius: 1upx;
			margin-top: 16upx;
			box-sizing: border-box;
			padding: 22upx 32upx;
			overflow: hidden;

			.sportItem-title {
				font-size: 32upx;
				font-weight: 600;
				color: #202020;
				margin-bottom: 24upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				>text:nth-of-type(2){
					font-size: 28upx; 
					font-weight: 400;
					color: #202020;
				}
			}

			.item-title {
				width: 686upx;
				height: 56upx;
				background: #F9F8F8;
				border-radius: 8upx;
				line-height: 56upx;
				padding: 0 24upx;
				box-sizing: border-box;
				font-size: 24upx;
				font-weight: 400;
				color: #707070;
				position: relative;

				>text:nth-of-type(1) {
					margin-right: 24upx;
				}

				>text:nth-of-type(2) {
					margin-right: 96upx;
				}

				>text:nth-of-type(3) {
					margin-right: 52upx;
				}
				>text:nth-of-type(4) {
					margin-right: 54upx;
				}
				.switchover1 {
					width: 17upx;
					height: 20upx;
					position: absolute;
					top: 18upx;
					right:324upx;
				}

				.switchover2 {
					width: 17upx;
					height: 20upx;
					position: absolute;
					top: 18upx;
					right:176upx;
				}
				.switchover3 {
					width: 17upx;
					height: 20upx;
					position: absolute;
					top: 18upx;
					right: 26upx;
				}
			}

			.scroll-item {
				overflow: scroll;
				height: 288upx;
				width: 686upx;

				.item-table {
					font-size: 24upx;
					font-weight: 400;
					color: #202020;
					line-height: 72upx;
					height: 72upx;
					position: relative;
					padding-left: 24upx;
					border-bottom: 1upx solid #DDDDDD;

					>text:nth-of-type(1) {
						width: 48upx;
						text-align: center;
						display: inline-block;
						margin-right: 24upx;
					}

					>text:nth-of-type(3) {
						position: absolute;
						left: 240upx;
					}

					>text:nth-of-type(4) {
						position: absolute;
						left: 388upx;
					}
					>text:nth-of-type(5) {
						position: absolute;
						right: 130upx;
					}
					>image{
						height: 22upx;
						width: 12upx;
						position: absolute;
						right:13upx ;
						top: 25upx;
					}
				}
			}
		}

	 
	}
</style>
