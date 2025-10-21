<template>
	<view class="maxBox">
		<u-modal v-model="show" :content="showContent" :show-title="false" confirm-text="知道了"
			:content-style="{fontSize: '28rpx'}"></u-modal>
		<view class="titBox">
			<view class="className">
				{{classStatistical.aliasClassName ? classStatistical.aliasClassName : (classStatistical.className || '')}}
			</view>
			<view class="studentNum">
				<view>{{$t('common.student')}}： <text style="color: #202020;">{{classStatistical.totalCount || ''}}</text>名
				</view>
				<view style="margin-left: 24upx;">男生 {{classStatistical.boyCount || ''}}名</view>
				<view style="margin-left: 24upx;">女生 {{classStatistical.girlCount || ''}}名</view>
			</view>
		</view>
		<view class="tabXbox">
			<!-- 饼图tabs -->
			<view class="tabs-box">
				<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
				<view class="border1"></view>
				<view class="border2"></view>
				<!-- <view class="border3"></view> -->
				<view class="tabsItem">
					<view class="task-info-charts">
						<view class="charts-box">
							<l-echart ref="taskChart"></l-echart>
						</view>
					</view>
				</view>
			</view>
			<view class="kong"></view>
			<view class="statisticsBox">
				<view class="measured">
					<view class="">
						{{$t('data.physicalFactorData.classDetails.statisticsPersonNum')}}
					</view>
					<view style="font-size: 40upx;color: #5C8FF7;font-weight: bold;">
						{{classStatistical.allPersonNum || '-'}}
					</view>
				</view>
				<view class="rank">
					<view class="">
						{{$t('common.gradeText')}}排名
					</view>
					<view style="font-size: 40upx;color: #FF7B00;font-weight: bold;">
						{{classStatistical.rank || '-'}}
					</view>
				</view>
				<view class="averageScore">
					<view class="">
						{{$t('common.gradeText')}}平均分
					</view>
					<view style="font-size: 40upx;font-weight: bold;color: #464646;">
						{{classStatistical.gradeAvg || '-'}}
					</view>
				</view>
			</view>
			<view class="showBox" @click="this.show = true">
				<image src="../../static/images/QuestionCircleOutline@2x.png" class="prompt"></image>
			</view>
		</view>
		<!-- 体质项目情况 -->
		<view class="situationBox">

			<view class="situation-title">
				{{$t('data.physicalFactorData.classDetails.physicalFactorProgramInfo')}}
			</view>
			<view class="situation-type">
				<text></text><text>{{$t('common.classText')}}</text>
				<text></text><text>{{$t('common.gradeText')}}</text>
			</view>
			<view class="situation-switch">
				<text @click="situationSwitch(1)" :class="minAndCount==1?'active-text':''">及格率</text> <text
					:class="minAndCount==2?'active-text':''"
					@click="situationSwitch(2)">{{$t('common.excellent')}}率</text>
			</view>
			<!-- echarts -->
			<view class="situation-echarts">
				<l-echart ref="chart"></l-echart>
			</view>
		</view>

		<!-- 学生列表 -->
		<view class="studentTop">
			<view class="studentTitle">
				{{$t('common.student')}}列表
			</view>
			<image src="../../static/images/DownlandOutline.png" class="downLoadImg" @click="exportStudent"></image>
		</view>
		<view class="studentBox">
			<!-- <view class="table"> -->
			<view class="table-all-left">
				<view class="table-header">
					<view class="table-th" v-for="(item, index) in studentListKeyLeft" :key="index">
						<view style="float: left;">{{ item.name }}</view>
					</view>
				</view>
				<view class="table-row" v-for="(item, index) in studentListValue" :key="index"
					@click="goStudentDetail(item)">
					<view class="table-td">{{ index + 1 }}</view>
					<view class="table-td text-over" v-if="item.totalScore" :class="nameStyleA">{{ item.studentName }}
					</view>
					<view class="table-td text-over" v-if="!item.totalScore" :class="nameStyleB">{{ item.studentName }}
					</view>
					<view class="table-td">{{ item.gender == 0 ? '女' : '男' }}</view>
				</view>
			</view>
			<view class="table-all-box">
				<scroll-view scroll-x="true" class="table-all">
					<view class="table-header">
						<view class="table-th" v-for="(item, index) in studentListKey" :key="index" :class="item.class"
							@click="sort(item)">
							<view style="float: left;">{{ item.name }}</view>
							<view class="sortBox">
								<image src="../../static/images/shengYes.png" class="sortImg sortUp"
									v-if="item.sortState && item.sortState!== 3"></image>
								<image src="../../static/images/shengNo.png" class="sortImg sortUp"
									v-if="item.sortState && item.sortState== 3"></image>
								<image src="../../static/images/jiangYes.png" class="sortImg sortDown"
									v-if="item.sortState && item.sortState!== 2"></image>
								<image src="../../static/images/jiangNo.png" class="sortImg sortDown"
									v-if="item.sortState && item.sortState== 2"></image>
							</view>
						</view>
					</view>
					<view class="table-row" v-for="(item, index) in studentListValue" :key="index"
						@click="goStudentDetail(item)">
						<!-- <view class="table-td aa">{{ index + 1 }}</view>
							<view class="table-td aa" v-if="item.totalScore" :class="nameStyleA">{{ item.studentName }}</view>
							<view class="table-td aa" v-if="!item.totalScore" :class="nameStyleB">{{ item.studentName }}</view>
							<view class="table-td aa">{{ item.gender == 0 ? '女' : '男' }}</view> -->
						<view class="table-td aa">{{item.classCampusid || ""}}</view>
						<view class="table-td aa">{{ item.totalScore || $t('common.noTest')}}</view>
						<view class="table-td">{{ item.bodyCompositionAndNutrition || '-'}}</view>
						<view class="table-td">{{ item.cardiopulmonaryFunctionAndEndurance || '-' }}</view>
						<view class="table-td">{{ item.muscleStrengthAndEndurance || '-'}}</view>
						<view class="table-td">{{ item.speedAndAgility || '-'}}</view>
						<view class="table-td aa">{{ item.flexibility || '-'}}</view>
						<view class="table-td aa">{{ item.coordination || '-'}}</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		getReq,
		USERCENTER
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	import { downloadPreviewExcelFile } from "@/common/util.js";
	
	export default {
		data() {
			return {
				show: false,
				classId: '',
				classCode: "",
				gender: '', //性别 默认全部 男1女0
				showContent: this.$t('data.physicalData.classDetails.modalContent'),
				minAndCount: 1,
				classStatistical: {}, //饼图数据
				classPassChart: {},
				gradePassChart: {},
				classExcellentChart: {},
				gradeExcellentChart: {},
				copyStudentListValue: [],
				nameStyleA: 'nameStyleA',
				nameStyleB: 'nameStyleB',
				// sortState: 1,
				studentListKeyLeft: [{
					name: this.$t('common.orderNumber'),
					value: 'index'
				}, {
					name: '姓名',
					value: 'studentName'
				}, {
					name: '性别',
					value: 'gender',
				}],
				studentListKey: [{
					name: '班级学号',
					value: 'classCampusid',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.$t('common.totalScore'),
					value: 'totalScore',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.$t('common.bodyCompositionAndNutrition'),
					value: 'bodyCompositionAndNutrition',
					sortState: 1
				}, {
					name: this.$t('common.cardiopulmonaryFunctionAndEndurance'),
					value: 'cardiopulmonaryFunctionAndEndurance',
					sortState: 1
				}, {
					name: this.$t('common.muscleStrengthAndEndurance'),
					value: 'muscleStrengthAndEndurance',
					sortState: 1
				}, {
					name: this.$t('common.speedAndAgility'),
					value: 'speedAndAgility',
					sortState: 1
				}, {
					name: this.$t('common.flexibility'),
					value: 'flexibility',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.$t('common.coordination'),
					value: 'coordination',
					sortState: 1,
					class: 'aa'
				}],
				studentListValue: [],
				classData: {},
				list: [{
						name: '全部'
					},
					{
						name: '男生'
					},
					{
						name: '女生'
					}
				],
				current: 0,

				// 国际化
				// bodyCompositionAndNutrition: this.$t('common.bodyCompositionAndNutrition'),
				// cardiopulmonaryFunctionAndEndurance: this.$t('common.cardiopulmonaryFunctionAndEndurance'),
				// muscleStrengthAndEndurance: this.$t('common.muscleStrengthAndEndurance'),
				// speedAndAgility: this.$t('common.speedAndAgility'),
				// flexibility: this.$t('common.flexibility'),
				// coordination: this.$t('common.coordination'),
				gradeText: this.$t('common.gradeText'),
				classText: this.$t('common.classText'),
				excellent: this.$t('common.excellent'),
			}
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: this.$t('data.physicalFactorData.classDetails.title')
			})
			this.classId = e.classId
			this.classCode = e.classCode
			// this.getClassInfo()
			this.getClassDetails()
			// this.initTeacherCharts()
			this.initEcharts()
		},
		computed: {
			...mapState(['xiaotiyunUser']),
		},
		methods: {
			getGradeContent(i) {
				let Class = [`一${this.gradeText}`, `二${this.gradeText}`, `三${this.gradeText}`, `四${this.gradeText}`,
					`五${this.gradeText}`, `六${this.gradeText}`, "初一", "初二", "初三", "高一", "高二", "高三"
				];
				return Class[i - 1];
			},
			//班级基本统计
			// getClassInfo() {
			// 	getReq(URL.physicalClassInfo, {
			// 		classId: this.classId
			// 	}).then(res => {
			// 		if (res.error == 10000) {
			// 			let _this = this
			// 			this.classData = res.data
			// 			res.data.gradeName = this.getGradeContent(res.data.grade)
			// 		} else {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: res.message,
			// 				duration: 1000
			// 			})
			// 		}
			// 	})
			// },
			//班级详情统计
			getClassDetails() {
				getReq(URL.physicalGetClassDetails, {
					classCode: this.classCode,
					gender: this.gender
				}).then(res => {
					console.log(res);
					if (res.error == 10000) {
						this.classStatistical = res.data.classStatistical
						this.classPassChart = res.data.classPassChart || {}
						this.gradePassChart = res.data.gradePassChart || {}
						this.classExcellentChart = res.data.classExcellentChart || {}
						this.gradeExcellentChart = res.data.gradeExcellentChart || {}
						this.studentListValue = [...res.data.studentDimensionInfoList] || []
						this.copyStudentListValue = this.studentListValue.slice(0)
						this.initTeacherCharts()
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
			change(index) {
				this.current = index
				if (index == 0) {
					this.gender = ''
				} else if (index == 1) {
					this.gender = 1
				} else if (index == 2) {
					this.gender = 0
				}
				this.getClassDetails()
			},
			goStudentDetail(item) {
				if (!item.totalScore) {
					return
				}
				// uni.navigateTo({
				// 	url:'/pagesData/physicalFactorData/studentDetail/studentDetail?studentId='+studentId
				// })
				// 测试环境用http，正式环境用https
				let linkUrl = "";

				let baseUrl = 'dev'
				if (USERCENTER.includes('test')) {
					baseUrl = 'http'
				} else if (USERCENTER.includes('pre')) {
					baseUrl = 'http'
				} else {
					baseUrl = 'https'
				}
				const option = {
					"uid": this.xiaotiyunUser.teacher.teacherId,
					"token": this.xiaotiyunUser.teacher.token,
					"loginType": "teacher"
				}
				let params = {
					linkUrl: `${baseUrl}://h5.gxapp.iydsj.com/xty/pages/data/phyStudentDetail/phyFactorStuDetail.html?domain=${encodeURIComponent(this.xiaotiyunUser.teacher.domain)}&physicalId=${item.physicalId}&physicalStudentId=${item.physicalStudentId}&option=${encodeURIComponent(JSON.stringify(option))}`,
				};
				uni.navigateTo({
					url: '/pages/webView/index/index',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			// 选项卡饼图echarts
			initTeacherCharts() {
				let _this = this;
				let classStatistical = _this.classStatistical;
				let option = {
					tooltip: {
						trigger: "item"
						// formatter: "今日作业 {b} : {c}人 ({d}%)"
					},
					legend: {
						orient: 'vertical',
						top: "42%",
						right: "12%",
						itemWidth: 6,
						itemHeight: 6,
						borderRadius: 3,
						textStyle: {
							fontSize: 12,
							color: "#707070"
						},
						formatter: function(name) {
							var legendStr = "";
							if (name == _this.excellent) {
								legendStr =
									`${_this.excellent}  ${classStatistical.excellent?classStatistical.excellent:0}人  (${!classStatistical.excellent? 0:((classStatistical.excellent*100)/classStatistical.allPersonNum).toFixed(2)}%)`
							}
							if (name == "良好") {
								legendStr =
									`良好  ${classStatistical.good?classStatistical.good:0}人  (${!classStatistical.good? 0:((classStatistical.good*100)/classStatistical.allPersonNum).toFixed(2)}%)`
							}
							if (name == "及格") {
								legendStr =
									`及格  ${classStatistical.pass?classStatistical.pass:0}人  (${!classStatistical.pass? 0:((classStatistical.pass*100)/classStatistical.allPersonNum).toFixed(2)}%)`
							}
							if (name == "不及格") {
								legendStr =
									`不及格  ${classStatistical.noPass?classStatistical.noPass:0}人  (${!classStatistical.noPass? 0:((classStatistical.noPass*100)/classStatistical.allPersonNum).toFixed(2)}%)`
							}
							return legendStr;
						}
					},
					title: {
						text: classStatistical.classAvg || '-',
						top: "54%",
						left: "25%",
						subtext: "平均分",
						itemGap: 0,
						textStyle: {
							color: "#5C8FF7",
							fontSize: 20,
							fontWeight: 'bold'
							// rich: {
						},
						subtextStyle: {
							color: "#464646",
							fontSize: 12,
							fontWeight: 400
						},
						textAlign: "center"
					},
					color: [
						"#3AA0FF",
						"#4ECB73",
						"#FFB771",
						"#FF7A86"
					],
					series: [{
						name: "",
						type: "pie",
						radius: ['40%', '60%'],
						center: ['26%', '64%'],
						// roseType: "radius",
						// itemStyle: {
						//   borderRadius: 0
						// },
						label: {
							show: false
						},
						data: [{
								value: classStatistical.excellent,
								name: _this.excellent,
								label: {
									color: "#3AA0FF"
								},
								color: "#000000"
							},
							{
								value: classStatistical.good,
								name: "良好",
								label: {
									color: "#4ECB73"
								},
								color: "#000000"
							},
							{
								value: classStatistical.pass,
								name: "及格",
								label: {
									color: "#FFB771"
								},
								color: "#000000"
							},
							{
								value: classStatistical.noPass,
								name: "不及格",
								label: {
									color: "#FF7A86"
								},
								color: "#000000"
							}
						]
					}]
				};
				_this.$refs.taskChart.init(config => {
					const {
						canvas
					} = config;
					const chart = echarts.init(canvas, null, config);

					chart.setOption(option);
					return chart;
				})
			},
			//切换及格率与优秀率
			situationSwitch(i) {
				//i==1 及格率  i==2 优秀率
				this.minAndCount = i
				this.initEcharts()
			},
			//初始化柱状图echarts
			initEcharts() {
				let _this = this;
				let dateData = []
				let classListY = []
				let gradeListY = []
				if (this.minAndCount == 2) {
					dateData = this.classExcellentChart.dimensionNameList
					classListY = this.classExcellentChart.percentList ? this.classExcellentChart.percentList.map(function(
						item) {
						return item * 100
					}) : []
					gradeListY = this.gradeExcellentChart.percentList ? this.gradeExcellentChart.percentList.map(function(
						item) {
						return item * 100
					}) : []
				} else {
					dateData = this.classPassChart.dimensionNameList
					classListY = this.classPassChart.percentList ? this.classPassChart.percentList.map(function(item) {
						return item * 100
					}) : []
					gradeListY = this.gradePassChart.percentList ? this.gradePassChart.percentList.map(function(item) {
						return item * 100
					}) : []
				}
				console.log(classListY, gradeListY)
				// let dateData=['身体成分与营养','安抚男篮服了你了','协调性','啊干撒干撒我国','柔韧性','阿尔法阿斯弗']
				// let dateData1=['柔韧性']
				// let dateData=this.list.classCountDaily.exerciseDateList.map(item=>{ 
				// 	  return item.split('.')[1] + '.' + item.split('.')[2]
				// }) 
				let option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {

							type: 'shadow'
						},
						formatter: (params) => {
							let aa = _this.classText + params[0].value.toFixed(2) + '%' + '  ' + _this.gradeText +
								params[1].value.toFixed(2) + '%'
							return aa
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '10%',
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
							color: '#545454',
							interval: 0, //横轴信息全部显示
							rotate: -65
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
							name: _this.classText,
							type: 'bar',
							barWidth: '40%',
							label: {
								show: false,
								position: 'top',
								fontSize: '11'
							},
							itemStyle: {
								color: '#5C8FF7'
							},
							// data:this.minAndCount==2? this.list.classCountDaily.capitaNumList:this.list.classCountDaily.capitaTimeList,
							data: classListY,
							barGap: '0%'
						},
						{
							name: _this.gradeText,
							type: 'bar',
							barWidth: '40%',
							label: {
								show: false,
								position: 'top',
								fontSize: '11'
							},
							itemStyle: {
								color: '#60E0AD'
							},
							// data:this.minAndCount==2?  this.list.gradeCountDaily.capitaNumList:this.list.gradeCountDaily.capitaTimeList,
							data: gradeListY
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
			exportStudent() {
				getReq(URL.tzStudentExport, {
					classCode: this.classCode,
					gender: this.gender
				}).then(res => {
					if (res.error == 10000) {
						// this.classData = res.data
						downloadPreviewExcelFile(res.data);
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			sortByUp(props) {
				return function(a, b) {
					return a[props] - b[props];
				}
			},
			sortByDown(props) {
				return function(a, b) {
					return b[props] - a[props];
				}
			},
			sort(data) {
				if (!data.sortState) {
					return
				}
				this.studentListKey.map(function(item, index) {
					if (item.value === data.value) {
						item.sortState === data.sortState
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
				if (data.value === "classCampusid") {
					this.handleSortNo(data)
					return
				}
				console.log(data);
				if (data.sortState == 1) {
					this.studentListValue = this.copyStudentListValue
				} else if (data.sortState == 2) {
					this.studentListValue.sort(this.sortByUp(data.value))
				} else if (data.sortState == 3) {
					this.studentListValue.sort(this.sortByDown(data.value))
				}
			},
			// 班级学号排序 将未填写班级学号的剥离放到list最后，对填写了的进行排序
			handleSortNo(value) {
				const dataSource = this.$u.deepClone(this.studentListValue)
				let noCampusIDList = []
				let campusIDList = []

				dataSource.forEach(item => {
					if (item.classCampusid) {
						campusIDList.push(item)
					} else {
						noCampusIDList.push(item)
					}
				})
				if (value.sortState == 2) {
					campusIDList.sort((a, b) => {
						return a.classCampusid - b.classCampusid
					})
				} else if (value.sortState == 3) {
					campusIDList.sort((a, b) => {
						return b.classCampusid - a.classCampusid
					})
				}

				this.studentListValue = [...campusIDList, ...noCampusIDList]
			},
		}
	}
</script>

<style scoped lang="scss">
	.maxBox {
		width: 750upx;

		// overflow: scroll;
		// transform: perspective(1000);
		/* background: #F5F5F5; */
		.titBox {
			height: 144upx;
			background: #FFFFFF;
			border-radius: 24upx;
			margin-bottom: 16upx;
			position: relative;
			color: #464646;

			.className {
				width: 100upx;
				height: 100upx;
				background: #5C8FF7;
				border-radius: 12upx;
				border: 2upx solid #5C8FF7;
				font-size: 24upx;
				font-weight: 500;
				color: #FFFFFF;
				padding: 15upx 12upx;
				box-sizing: border-box;
				position: absolute;
				top: 24upx;
				left: 32upx;
				text-align: center;
			}

			.classNumber {
				height: 36upx;
				font-size: 28upx;
				font-weight: 500;
				color: #202020;
				position: absolute;
				top: 29upx;
				left: 144upx;
			}

			.studentNum {
				display: flex;
				justify-content: space-between;
				height: 36upx;
				font-size: 28upx;
				// font-weight: 400;
				color: #464646;
				position: absolute;
				top: 79upx;
				left: 144upx;
			}
		}

		.tabXbox {
			position: relative;

			.tabs-box {
				position: relative;
				background: #FFFFFF;
				overflow: hidden;

				.border1 {
					width: 1upx;
					height: 26upx;
					border: 1upx solid #979797;
					position: absolute;
					top: 27upx;
					left: 499upx;
				}

				.border2 {
					width: 1upx;
					height: 26upx;
					border: 1upx solid #979797;
					position: absolute;
					top: 27upx;
					left: 250upx;
				}

				.border3 {
					width: 100%;
					height: 1upx;
					border: 1upx solid #dddddd;
					position: absolute;
					top: 70upx;
					left: 0;
				}

				.tabsItem {
					width: 750upx;
					height: 400upx;

					.task-info-charts {
						width: 100%;
						// height: 342upx;
						position: relative;

						// padding: 0 32upx 32upx 32upx;
						.charts-box {
							width: 750upx;
							height: 400upx;
						}

					}
				}
			}

			.kong {
				width: 100%;
				height: 16upx;
				position: absolute;
				left: 0;
				top: 75upx;
				background: #f5f5f5;
			}

			.statisticsBox {
				position: absolute;
				top: 122upx;
				left: 0;
				width: 100%;
				display: flex;
				justify-content: space-around;

				.measured {
					font-size: 28upx;
					font-weight: 400;
					color: #464646;
					text-align: center;
				}

				.rank {
					font-size: 28upx;
					font-weight: 400;
					color: #464646;
					text-align: center;
				}

				.averageScore {
					font-size: 28upx;
					font-weight: 400;
					color: #464646;
					text-align: center;
				}
			}

			.showBox {
				width: 60upx;
				height: 60upx;
				position: absolute;
				top: 113upx;
				right: 12upx;
				display: flex;
				justify-content: center;
				align-items: center;

				.prompt {
					width: 24upx;
					height: 24upx;
				}
			}
		}

		.situationBox {
			width: 750upx;
			height: 602upx;
			background: #FFFFFF;
			border-radius: 1upx;
			overflow: hidden;
			position: relative;
			margin: 16upx 0;

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
				height: 470upx;
				margin-left: 32upx;
				// border: 1px solid #f6f6f6;
			}
		}

		.studentTop {
			height: 93upx;
			background: #FFFFFF;
			position: relative;

			.studentTitle {
				font-size: 32upx;
				font-weight: 600;
				color: #202020;
				position: absolute;
				top: 24upx;
				left: 32upx;
			}

			.downLoadImg {
				width: 32upx;
				height: 32upx;
				position: absolute;
				top: 30upx;
				right: 32upx;
			}
		}

		.studentBox {
			position: relative;
			background: #FFFFFF;
			padding-left: 32upx;
			// margin-bottom: 24upx;
			padding-bottom: env(safe-area-inset-bottom);
			width: 750upx;
			overflow: hidden;

			// transform: scale(1,1);
			.table-all-box {
				width: 430upx;
				overflow: hidden;
				position: absolute;
				left: 320upx;
				top: 0;

				.table-all {
					.table-header {
						display: flex;
						flex-wrap: nowrap;
						align-items: center;
						height: 56upx;
						background: #FFFFFF;
						font-size: 24upx;
						font-weight: 400;
						color: #707070;

						.table-th {
							// float: left;
							// flex-grow: 0;
							flex-basis: 220upx;
							flex-shrink: 0;
							width: 140upx;
							padding-left: 24upx;
							box-sizing: border-box;

							.sortBox {
								margin-left: 10upx;
								float: left;
								display: flex;
								flex-direction: column;
								justify-content: space-around;

								.sortImg {
									width: 18upx;
									height: 16upx;
								}
							}

							// .sortUp{

							// }
							// .sortDown
						}

						.aa {
							flex-basis: 150upx;
						}
					}

					.table-row {
						display: flex;
						flex-wrap: nowrap;
						// align-items: center;
						height: 72upx;
						background: #FFFFFF;
						font-size: 24upx;
						font-weight: 400;
						color: #202020;

						.table-td {
							// width: 140upx;
							flex-basis: 220upx;
							// float: left;
							// flex-grow: 0;
							flex-shrink: 0;
							box-sizing: border-box;
							padding: 24upx 0 24upx 24upx;
							border-top: 1px solid #dddddd;
						}

						.nameStyleA {
							color: #5C8FF7;
						}

						.nameStyleB {
							color: #202020;
						}

						.aa {
							flex-basis: 150upx;
						}
					}
				}
			}

			.table-all-left {
				// position: fixed;
				// left: 0;
				// top: 0;
				width: 320upx;

				.table-header {
					display: flex;
					flex-wrap: nowrap;
					align-items: center;
					height: 56upx;
					background: #FFFFFF;
					font-size: 24upx;
					font-weight: 400;
					color: #707070;

					.table-th {
						// float: left;
						// flex-grow: 0;
						flex-basis: 120upx;
						flex-shrink: 0;
						width: 140upx;
						padding-left: 24upx;
						box-sizing: border-box;
						// .sortUp{

						// }
						// .sortDown
					}

					:nth-child(-n+1) {
						flex-basis: 80upx;
					}
				}

				.table-row {
					display: flex;
					flex-wrap: nowrap;
					// align-items: center;
					height: 72upx;
					background: #FFFFFF;
					font-size: 24upx;
					font-weight: 400;
					color: #202020;

					.table-td {
						// width: 140upx;
						flex-basis: 120upx;
						// float: left;
						// flex-grow: 0;
						flex-shrink: 0;
						box-sizing: border-box;
						padding: 24upx 0 24upx 24upx;
						border-top: 1px solid #dddddd;
					}

					:nth-child(-n+1) {
						flex-basis: 80upx;
					}

					.nameStyleA {
						color: #5C8FF7;
						width: 120upx;
						padding: 0;
						line-height: 72upx;
						padding-left: 24upx;
					}

					.nameStyleB {
						color: #202020;
						width: 120upx;
						padding: 0;
						line-height: 72upx;
						padding-left: 24upx;
					}
				}
			}
		}
	}

	.text-over {
		display: -webkit-inline-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}
</style>
