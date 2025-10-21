<template>
	<view class="maxBox">
		<view class="classTitle">
			<view class="className">
				{{listBase.gradeName}}</br>
				{{listBase.number}}班
			</view>
			<view class="classNumber">
				{{listBase.classNumber}}
			</view>
			<view class="numData">
				{{$t('common.student')}}：<text style="color: #202020;">{{listBase.studentNum}}</text>名&nbsp;&nbsp;&nbsp;
				男生 <text style="color: #202020;">{{listBase.maleNum}}</text>名 &nbsp; 女生 <text
					style="color: #202020;">{{listBase.femaleNum}}</text>名
			</view>
			<!-- <image src="../../../static/images/aiData.png" mode="" class="jiao"></image> -->
		</view>
		<!-- 选择日期 -->
		<view class="search-date" @click="showSelectDate=true">
			{{searchForm.startDate}} 至 {{searchForm.endDate}}
			<image src="../../static/images/change-down.png" mode=""></image>
		</view>
		<!-- 人均运动数据 -->
		<view class="sportData">
			<view class="sportData-header">
				人均{{$t('common.sport')}}{{$t('common.data')}}
			</view>
			<view class="sportData-main">
				<view>
				</view>
				<view>
					{{$t('common.sport')}}{{$t('common.minute')}}
				</view>
				<view>
					{{list.userCount.capitaExerciseTime?list.userCount.capitaExerciseTime:0}}
				</view>
			</view>
			<view class="sportData-main sportData-main2">
				<view>
				</view>
				<view>
					{{$t('common.sport')}}{{$t('common.times')}}
				</view>
				<view>
					{{list.userCount.capitaExerciseNum?list.userCount.capitaExerciseNum:0}}
				</view>
			</view>
			<view class="xian">

			</view>
		</view>
		<!-- 人均每日运动情况 -->
		<view class="situationBox">
			<view class="situation-title">
				人均每日{{$t('common.sport')}}情况
			</view>
			<view class="situation-type">
				<text></text><text>{{$t('common.classText')}}</text>
				<text></text><text>{{$t('common.gradeText')}}</text>
			</view>
			<view class="situation-switch">
				<text @click="situationSwitch(1)"
					:class="minAndCount==1?'active-text':''">{{$t('common.minute')}}</text> <text
					:class="minAndCount==2?'active-text':''" @click="situationSwitch(2)">{{$t('common.times')}}</text>
			</view>
			<!-- echarts -->
			<view class="situation-echarts">
				<l-echart ref="chart" v-show="!showSelectDate"></l-echart>
			</view>
		</view>
		<!-- 运动项目统计(人均) -->
		<view class="table-wrapper">
			<view class="u-flex u-row-between table-header">
				<view>
					{{$t('data.aiData.classDetails.sportItemStatistics')}}（人均）
				</view>
			</view>
			<template v-if="list.sportCountList && list.sportCountList.length">
				<u-table :th-style="{'background-color':'#F9F8F8','border-right':'none','font-size':'28rpx'}">
					<u-tr class="u-tr">
						<u-th class="u-th">
							<view class="u-flex u-row-center">
								{{$t('common.orderNumber')}}
							</view>
						</u-th>
						<u-th class="u-th">
							<view class="u-flex u-row-center">
								{{$t('common.program')}}
							</view>
						</u-th>
						<u-th class="u-th">
							<view class="u-flex u-row-center">
								<text>{{$t('common.sport')}}{{$t('common.minute')}}</text>
								<sort-icon prop="capitaExerciseTime" :sort="sortType"
									@handle-sort="handleSort($event,$event,'sportCountList')" />
							</view>
						</u-th>
						<u-th class="u-th">
							<view class="u-flex u-row-center">
								<text>{{$t('common.sport')}}{{$t('common.times')}}</text>
								<sort-icon prop="capitaExerciseNum" :sort="sortType"
									@handle-sort="handleSort($event,$event,'sportCountList')" />
							</view>
						</u-th>
					</u-tr>
					<u-tr class="u-tr" v-for="(item,index) in list.sportCountList" :key="index">
						<u-td class="u-td">
							<view class="u-line-2">
								{{index + 1}}
							</view>
						</u-td>
						<u-td class="u-td">
							<view class="u-line-2">
								{{item.sportName}}
							</view>
						</u-td>
						<u-td class="u-td">
							<view class="u-line-2">
								{{item.capitaExerciseTime}}
							</view>
						</u-td>
						<u-td class="u-td">
							<view class="u-line-2">
								{{item.capitaExerciseNum}}
							</view>
						</u-td>
					</u-tr>
				</u-table>
			</template>
			<template v-else>
				<u-empty mode="data" :text="`${$t('common.none')}${$t('data.aiData.index.title')}`"></u-empty>
			</template>
		</view>

		<!--学生列表  -->
		<view class="table-wrapper">
			<view class="u-flex u-row-between table-header">
				<view>
					{{$t('common.student')}}列表
				</view>
				<image src="../../static/images/DownlandOutline.png" mode="aspectFit" class="download-btn"
					@click="download">
				</image>
			</view>
			<template v-if="list.studentCountList && list.studentCountList.length">
				<view class="u-flex u-col-top" style="width: 100%;">
					<view class="" style="width: 200rpx;">
						<u-table :th-style="{'background-color':'#F9F8F8','border-right':'none','font-size':'28rpx'}">
							<u-tr class="u-tr">
								<u-th class="u-th">
									<view class="u-flex u-row-center">
										{{$t('common.orderNumber')}}
									</view>
								</u-th>
							</u-tr>
							<u-tr class="u-tr" v-for="(item,index) in list.studentCountList" :key="index"
								@click="navStudentDetails(item.studentId)">
								<u-td class="u-td">
									<view class="u-line-2">
										{{index + 1}}
									</view>
								</u-td>
							</u-tr>
						</u-table>
					</view>
					<scroll-view scroll-x="true" style="width: 550rpx;">
						<view style="width: 1000rpx;">
							<u-table
								:th-style="{'background-color':'#F9F8F8','border-right':'none','font-size':'28rpx'}">
								<u-tr class="u-tr">
									<u-th class="u-th">
										<view class="u-flex u-row-center">
											姓名
										</view>
									</u-th>
									<u-th class="u-th">
										<view class="u-flex u-row-center">
											<text>班级学号</text>
											<sort-icon :sort="sortType" @handle-sort="handleSortNo" />
										</view>
									</u-th>
									<u-th class="u-th">
										<view class="u-flex u-row-center">
											性别
										</view>
									</u-th>
									<u-th class="u-th">
										<view class="u-flex u-row-center">
											<text>{{$t('common.sport')}}{{$t('common.minute')}}</text>
											<sort-icon prop="capitaExerciseTime" :sort="sortType"
												@handle-sort="handleSort($event,$event,'studentCountList')" />
										</view>
									</u-th>
									<u-th class="u-th">
										<view class="u-flex u-row-center">
											<text>{{$t('common.sport')}}{{$t('common.times')}}</text>
											<sort-icon prop="capitaExerciseNum" :sort="sortType"
												@handle-sort="handleSort($event,$event,'studentCountList')" />
										</view>
									</u-th>
								</u-tr>

								<u-tr class="u-tr" v-for="(item,index) in list.studentCountList" :key="index"
									@click="navStudentDetails(item.studentId)">
									<u-td class="u-td">
										<view class="u-line-2">
											{{item.name}}
										</view>
									</u-td>
									<u-td class="u-td">
										<view class="u-line-2">
											{{item.classCampusid || ""}}
										</view>
									</u-td>
									<u-td class="u-td">
										<view class="u-line-2">
											{{item.gender==1?'男':'女'}}
										</view>
									</u-td>
									<u-td class="u-td">
										<view class="u-line-2">
											{{item.capitaExerciseTime}}
										</view>
									</u-td>
									<u-td class="u-td">
										<view class="u-line-2">
											{{item.capitaExerciseNum}}
										</view>
									</u-td>
								</u-tr>
							</u-table>
						</view>
					</scroll-view>
				</view>
			</template>
			<template v-else>
				<u-empty mode="data" :text="`${$t('common.none')}${$t('data.aiData.index.title')}`"></u-empty>
			</template>
		</view>

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
	import sortIcon from '../../components/sort-icon/index.vue'
	import { downloadPreviewExcelFile } from "@/common/util.js";
	
	export default {
		components: {
			sortIcon
		},
		data() {
			const d = new Date()
			const year = d.getFullYear()
			let month = d.getMonth() + 1
			return {
				sortType: "",
				classId: '', //上个页面带过来班级id
				listBase: {
					className: "",
					classNumber: "",
					studentNum: 0,
					maleNum: 0,
					femaleNum: 0,
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
				sortMinuteStatus: false,
				sortTimesStatus: false,

				// 国际化
				gradeText: this.$t('common.gradeText'),
				classText: this.$t('common.classText'),
				dateChangeWarning: this.$t('data.aiData.classDetails.dateChangeWarning'),
				openFileFailed: this.$t('common.openFileFailed'),
				downloadFileFailed: this.$t('common.downloadFileFailed'),
			}
		},
		onLoad(classId) {
			uni.setNavigationBarTitle({
				title: this.$t('data.aiData.classDetails.title')
			})
			this.fun_date(6) //首次进入赋值最近7天的日期 
			this.classId = classId.classId
			this.initData()
		},
		methods: {
			getGradeContent(i) {
				let Class = [`一${this.gradeText}`, `二${this.gradeText}`, `三${this.gradeText}`, `四${this.gradeText}`,
					`五${this.gradeText}`, `六${this.gradeText}`, "初一", "初二", "初三", "高一", "高二", "高三"
				];
				return Class[i - 1];
			},
			initData() {
				//班级详情-头部信息
				getReq(URL.getClassBasicCount, {
					classId: this.classId
				}).then(res => {
					if (res.error == 10000) {
						this.listBase = res.data
						this.listBase.gradeName = this.getGradeContent(res.data.grade)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
				//班级详情-统计信息
				getReq(URL.getClassDetailsCount, {
					classId: this.classId,
					startDate: this.searchForm.startDate,
					endDate: this.searchForm.endDate,
				}).then(res => {
					if (res.error == 10000) {
						console.log('大详情', res)
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
			},
			//初始化echarts
			initEcharts() {
				let dateData = this.list.classCountDaily.exerciseDateList.map(item => {
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
							name: this.classText,
							type: 'bar',
							barWidth: 18,
							label: {
								show: true,
								position: 'top',
								fontSize: '11'
							},
							itemStyle: {
								color: '#5C8FF7'
							},
							data: this.minAndCount == 2 ? this.list.classCountDaily.capitaNumList : this.list
								.classCountDaily.capitaTimeList,
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
								color: '#60E0AD'
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
					getReq(URL.getClassDetailsCount, {
						classId: this.classId,
						startDate: this.searchForm.startDate,
						endDate: this.searchForm.endDate,
					}).then(res => {
						if (res.error == 10000) {
							console.log('大详情', res)
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
			handleSort(value, sortName, dataSource) {
				this.sortType = value
				if (sortName === "preface") {
					this.list[dataSource].sort((a, b) => {
						return b[value] - a[value]
					})
				} else if (sortName === "reverse") {
					this.list[dataSource].sort((a, b) => {
						return a[value] - b[value]
					})
				}
			},
			// 班级学号排序 将未填写班级学号的剥离放到list最后，对填写了的进行排序
			handleSortNo(value, sortName) {
				this.sortType = value
				const dataSource = this.$u.deepClone(this.list.studentCountList)
				let noCampusIDList = []
				let campusIDList = []
				dataSource.forEach(item => {
					if (item.classCampusid) {
						campusIDList.push(item)
					} else {
						noCampusIDList.push(item)
					}
				})
				if (sortName === "preface") {
					campusIDList.sort((a, b) => {
						return b.classCampusid - a.classCampusid
					})
				} else if (sortName === "reverse") {
					campusIDList.sort((a, b) => {
						return a.classCampusid - b.classCampusid
					})
				}
				this.list.studentCountList = [...campusIDList, ...noCampusIDList]
			},
			download() {
				//文件导出函数
				getReq(URL.exportStudentExerciseInfo, {
					classId: this.classId,
					startDate: this.searchForm.startDate,
					endDate: this.searchForm.endDate,
				}).then(res => {
					// console.log('导出链接',res)
					if (res.error == 10000) {
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
			navStudentDetails(id) {
				let params = {
					studentId: id,
					searchForm: this.searchForm
				}
				uni.navigateTo({
					url: '/pagesData/aiData/studentDetails/studentDetails',
					success: res => {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('studentDetails', params)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.classTitle {
			width: 750upx;
			height: 144upx;
			background: #FFFFFF;
			position: relative;

			.className {
				width: 96upx;
				height: 96upx;
				background: #5C8FF7;
				border-radius: 12upx;
				border: 2upx solid #5C8FF7;
				padding: 15upx 11upx;
				text-align: center;
				font-size: 24upx;
				font-weight: 500;
				color: #FFFFFF;
				position: absolute;
				top: 23upx;
				left: 32upx;
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

			.numData {
				font-size: 28upx;
				font-weight: 400;
				color: #707070;
				position: absolute;
				bottom: 29upx;
				left: 144upx;
			}

			.jiao {
				width: 64upx;
				height: 64upx;
				position: absolute;
				right: 32upx;
				top: 58upx;
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
				width: 300upx;
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
					margin: 30upx 8upx 0 85upx;
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
					margin-left: 126upx;
				}
			}

			.sportData-main2 {
				margin-left: 83upx;

				>view:nth-of-type(1) {
					background: #8889FF;
				}
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

		// .sportItem {
		// 	width: 750upx;
		// 	max-height: 444upx;
		// 	background: #FFFFFF;
		// 	border-radius: 1upx;
		// 	margin-top: 16upx;
		// 	box-sizing: border-box;
		// 	padding: 22upx 32upx;
		// 	overflow: hidden;

		// 	.sportItem-title {
		// 		font-size: 32upx;
		// 		font-weight: 600;
		// 		color: #202020;
		// 		margin-bottom: 24upx;
		// 	}

		// 	.item-title {
		// 		width: 686upx;
		// 		height: 56upx;
		// 		background: #F9F8F8;
		// 		border-radius: 8upx;
		// 		line-height: 56upx;
		// 		padding: 0 24upx;
		// 		box-sizing: border-box;
		// 		font-size: 24upx;
		// 		font-weight: 400;
		// 		color: #707070;
		// 		position: relative;

		// 		>text:nth-of-type(1) {
		// 			margin-right: 80upx;
		// 		}

		// 		>text:nth-of-type(2) {
		// 			margin-right: 152upx;
		// 		}

		// 		>text:nth-of-type(3) {
		// 			margin-right: 90upx;
		// 		}

		// 		.switchover1 {
		// 			width: 17upx;
		// 			height: 20upx;
		// 			position: absolute;
		// 			top: 18upx;
		// 			right: 212upx;
		// 		}

		// 		.switchover2 {
		// 			width: 17upx;
		// 			height: 20upx;
		// 			position: absolute;
		// 			top: 18upx;
		// 			right: 26upx;
		// 		}
		// 	}

		// 	.scroll-item {
		// 		overflow: scroll;
		// 		max-height: 288upx;
		// 		width: 686upx;

		// 		.item-table {
		// 			font-size: 24upx;
		// 			font-weight: 400;
		// 			color: #202020;
		// 			line-height: 72upx;
		// 			height: 72upx;
		// 			position: relative;
		// 			padding-left: 24upx;
		// 			border-bottom: 1upx solid #DDDDDD;

		// 			>text:nth-of-type(1) {
		// 				width: 48upx;
		// 				text-align: center;
		// 				display: inline-block;
		// 				margin-right: 80upx;
		// 			}

		// 			>text:nth-of-type(3) {
		// 				position: absolute;
		// 				left: 354upx;
		// 			}

		// 			>text:nth-of-type(4) {
		// 				position: absolute;
		// 				left: 541upx;
		// 			}

		// 		}

		// 	}
		// }

		// .student-list {
		// 	background: #FFFFFF;
		// 	margin-top: 24rpx;
		// 	padding-top: 22rpx;
		// 	padding-right: 32rpx;
		// 	padding-bottom: 22rpx;
		// 	padding-bottom: calc(22rpx + constant(safe-area-inset-bottom));
		// 	padding-bottom: calc(22rpx + env(safe-area-inset-bottom));
		// 	padding-left: 32rpx;

		// 	.student-list-title {
		// 		font-size: 32rpx;
		// 		font-weight: 600;
		// 		color: #202020;
		// 		margin-bottom: 24rpx;
		// 	}

		// 	.download-btn {
		// 		width: 30rpx;
		// 		height: 30rpx;
		// 	}
		// }

		// .student-list {
		// 	width: 750upx;
		// 	border-radius: 1upx;
		// 	box-sizing: border-box;
		// 	overflow: hidden;

		// 	.student-list-title {
		// 		font-size: 32upx;
		// 		font-weight: 600;
		// 		color: #202020;
		// 		margin-bottom: 24upx;
		// 		width: 686upx;
		// 		display: flex;
		// 		justify-content: space-between;
		// 		align-items: center;

		// 		.download-btn {
		// 			width: 31upx;
		// 			height: 31upx;

		// 		}
		// 	}

		// 	.item-title {
		// 		width: 686upx;
		// 		height: 56upx;
		// 		background: #F9F8F8;
		// 		border-radius: 8upx;
		// 		line-height: 56upx;
		// 		padding: 0 24upx;
		// 		box-sizing: border-box;
		// 		font-size: 24upx;
		// 		font-weight: 400;
		// 		color: #707070;
		// 		position: relative;

		// 		>text:nth-of-type(1) {
		// 			margin-right: 48upx;
		// 		}

		// 		>text:nth-of-type(2) {
		// 			margin-right: 88upx;
		// 		}

		// 		>text:nth-of-type(3) {
		// 			margin-right: 48upx;
		// 		}

		// 		>text:nth-of-type(4) {
		// 			margin-right: 90upx;
		// 		}

		// 		.switchover1 {
		// 			width: 17upx;
		// 			height: 20upx;
		// 			position: absolute;
		// 			top: 18upx;
		// 			right: 212upx;
		// 		}

		// 		.switchover2 {
		// 			width: 17upx;
		// 			height: 20upx;
		// 			position: absolute;
		// 			top: 18upx;
		// 			right: 26upx;
		// 		}
		// 	}

		// 	.scroll-item {
		// 		overflow: scroll;
		// 		height: 288upx;
		// 		width: 686upx;

		// 		.item-table {
		// 			font-size: 24upx;
		// 			font-weight: 400;
		// 			color: #202020;
		// 			line-height: 72upx;
		// 			height: 72upx;
		// 			position: relative;
		// 			padding-left: 24upx;
		// 			border-bottom: 1upx solid #DDDDDD;
		// 			display: flex;
		// 			align-items: center;

		// 			>text:nth-of-type(1) {
		// 				width: 48upx;
		// 				text-align: center;
		// 				display: inline-block;
		// 				margin-right: 48upx;
		// 			}

		// 			>text:nth-of-type(3) {
		// 				position: absolute;
		// 				left: 256upx;
		// 			}

		// 			>text:nth-of-type(4) {
		// 				position: absolute;
		// 				left: 352upx;
		// 			}

		// 			>text:nth-of-type(5) {
		// 				position: absolute;
		// 				right: 119upx;
		// 			}

		// 			>image {
		// 				height: 22upx;
		// 				width: 12upx;
		// 				position: absolute;
		// 				right: 5upx;
		// 				top: 25upx;
		// 			}
		// 		}
		// 	}
		// }
	}

	.text-over {
		display: -webkit-inline-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.table-wrapper {
		background: #FFFFFF;
		margin-top: 24rpx;
		padding-top: 22rpx;
		padding-right: 32rpx;
		padding-bottom: 22rpx;
		padding-left: 32rpx;

		.table-header {
			font-size: 32rpx;
			font-weight: 600;
			color: #202020;
			margin-bottom: 24rpx;
		}

		.download-btn {
			width: 30rpx;
			height: 30rpx;
		}

	}

	.u-td {
		height: 110rpx;
	}
</style>
