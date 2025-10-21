<template>
	<view class="maxBox">
		<view class="titBox">
			<view class="className">
				{{classData.aliasClassName ? classData.aliasClassName : classData.className}}
			</view>
			<view class="classNumber">
				{{classData.classCode}}
			</view>
			<view class="studentNum">
				<view>{{$t('common.student')}}： <text style="color: #202020;">{{classData.studentCount}}</text>名</view>
				<view style="margin-left: 24upx;">男生 {{classData.boyCount}}名</view>
				<view style="margin-left: 24upx;">女生 {{classData.girlCount}}名</view>
			</view>
		</view>
		<view class="tabXbox">
			<!-- 饼图tabs -->
			<view class="tabs-box">
				<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
				<view class="border1"></view>
				<view class="border2"></view>
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
						{{$t('data.physicalData.classDetails.title')}}
					</view>
					<view style="font-size: 40upx;color: #5C8FF7;font-weight: bold;">
						{{classData.studentCountAll || '-'}}
					</view>
				</view>
				<view class="rank">
					<view class="">
						{{$t('common.gradeText')}}排名
					</view>
					<view style="font-size: 40upx;color: #FF7B00;font-weight: bold;">
						{{classData.gradeRank || '-'}}
					</view>
				</view>
				<view class="averageScore">
					<view class="">
						{{$t('common.gradeText')}}平均分
					</view>
					<view style="font-size: 40upx;font-weight: bold;color: #464646;">
						{{classData.gradeAvgScore || '-'}}
					</view>
				</view>
			</view>
			<view class="showBox" @click="this.show = true">
				<image src="../../static/images/QuestionCircleOutline@2x.png" class="prompt"></image>
			</view>
		</view>
		<!-- 体测项目情况 -->
		<view class="situationBox">

			<view class="situation-title">
				{{$t('data.physicalData.classDetails.physicalProgramInfo')}}
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
			<view class="table-all-left">
				<view class="table-header">
					<view class="table-th" v-for="(item, index) in studentListKeyLeft" :key="index">
						<view style="float: left;">{{ item.name }}</view>
					</view>
				</view>
				<view class="table-row" v-for="(item, index) in studentListValue" :key="index"
					@click="goStudentDetail(item)">
					<view class="table-td">{{ index + 1 }}</view>
					<view class="table-td text-over" v-if="item.total" :class="nameStyleA">{{ item.name }}</view>
					<view class="table-td text-over" v-if="!item.total" :class="nameStyleB">{{ item.name }}</view>
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
						<view  v-for="(column, colIndex) in studentListKey"  :key="colIndex" :class="['table-td', column.class]">
							{{ getColumnValue(item, column) }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<u-modal v-model="show" :content="showContent" :show-title="false" confirm-text="知道了"
			:content-style="{fontSize: '28rpx'}"></u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import {
		getReq,
		postReq,
		USERCENTER
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
	import {
		dateFormat
	} from '@/common/util.js'
	import { downloadPreviewExcelFile } from "@/common/util.js";
	
	export default {
		data() {
			return {
				classCode: '',
				physicalId: '',
				physicalTime: new Date(),
				gender: '',
				show: false,
				showContent: this.$t('data.physicalData.classDetails.modalContent'),
				minAndCount: 1,
				passRates: [],
				excellentRates: [],
				studentListValue: [],
				copyStudentListValue: [],
				nameStyleA: 'nameStyleA',
				nameStyleB: 'nameStyleB',
				partakeCount: '',
				studentListKeyLeft: [{
					name: this.$t('common.orderNumber'),
					value: 'index'
				}, {
					name: '姓名',
					value: 'name'
				}, {
					name: '性别',
					value: 'gender'
				}],
				studentListKey: [],
				listValue: [],
				classData: {},
				hasMacao: false,
				list: [{
               name: '全部'
            },
            {
               name: '男生'
            },
            {
               name: '女生'
            }],
				current: 0,
				correctData: {
					bujige: 10,
					jige: 8,
					youxiu: 10,
					lianghao: 22,
					totalCount: 50
				},

				// 国际化
				gradeText: this.$t('common.gradeText'),
				classText: this.$t('common.classText'),
				totalScore: this.$t('common.totalScore'),
				standardScore: this.$t('common.standardScore'),
				leftVision: this.$t('common.leftVision'),
				rightVision: this.$t('common.rightVision'),
				height: this.$t('common.height'),
				weight: this.$t('common.weight'),
				vitalCapacity: this.$t('common.vitalCapacity'),
				run50: this.$t('common.run50'),
				sitAndReach: this.$t('common.sitAndReach'),
				roleJump: this.$t('common.roleJump'),
				sitAndUp: this.$t('common.sitAndUp'),
				pullUp: this.$t('common.pullUp'),
				standingLongJump: this.$t('common.standingLongJump'),
				returnRun: this.$t('common.returnRun'),
				minute: this.$t('common.minute'),
				excellent: this.$t('common.excellent'),
				returnRun15: this.$t('common.returnRun15'),
				grip: this.$t('common.grip'),
				obliquePullUp: this.$t('common.obliquePullUp'),
				soccerSport: this.$t('common.soccerSport'),
			}
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: this.$t('data.physicalData.classDetails.title')
			})
			this.classCode = e.classCode
			this.physicalId = e.physicalId
			this.physicalTime = e.physicalTime
			this.partakeCount = e.partakeCount
			this.getClassDetails()
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		methods: {
			getGradeContent(i) {
				let Class = [`一${this.gradeText}`, `二${this.gradeText}`, `三${this.gradeText}`, `四${this.gradeText}`,
					`五${this.gradeText}`, `六${this.gradeText}`, "初一", "初二", "初三", "高一", "高二", "高三"
				];
				return Class[i - 1];
			},
			getClassDetails() {
				postReq(URL.getPhysicalClassDetails, {
					classCode: this.classCode,
					physicalId: this.physicalId,
					gender: this.gender
				}).then(res => {
					if (res.error == 10000) {
						this.classData = res.data
						this.classData.gradeName = this.getGradeContent(res.data.nowGrade)
						if (this.gender >= 0) {
							this.classData.studentCountAll = this.classData.excellentCount + this.classData
								.goodCount + this.classData.passCount + this.classData.noPassCount
						} else {
							this.classData.studentCountAll = this.partakeCount
						}
						this.passRates = res.data.passRates
						this.excellentRates = res.data.excellentRates
						this.hasMacao = res.data.hasMacao
						this.studentListValue = res.data.studentDatas
						this.copyStudentListValue = this.studentListValue.slice(0)

                  // 根据testNameTypes动态生成列头
						this.generateDynamicColumns(res.data.testNameTypes || [])

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
         // 根据testNameTypes动态生成列头
         generateDynamicColumns(testNameTypes) {
				// 初始化基础列
				this.studentListKey = [{
					name: '班级序号',
					value: 'classCampusid',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.totalScore,
					value: 'total',
					sortState: 1,
					class: 'aa'
				}];

				// 根据testNameTypes动态添加列
				testNameTypes.forEach(testType => {
					let columnConfig = this.getColumnConfig(testType);
					if (columnConfig) {
						if (Array.isArray(columnConfig)) {
							// 处理跑步项目（男女分开）
							columnConfig.forEach(config => {
								this.studentListKey.push(config);
							});
						} else {
							this.studentListKey.push(columnConfig);
						}
					}
				});
			},
         // 根据testNameTypes获取列配置
			getColumnConfig(testType) {
				const configs = {
					// 身高体重相关
					'HEIGHT_WEIGHT': [
						{ name: this.height, value: 'height', sortState: 1, class: 'aa' },
						{ name: this.weight, value: 'weight', sortState: 1, class: 'aa' },
						{ name: 'BMI', value: 'height_weight_Score', sortState: 1, class: 'aa' }
					],
					'MC_HEIGHT_WEIGHT': [
						{ name: this.height, value: 'mcHeight', sortState: 1, class: 'aa' },
						{ name: this.weight, value: 'mcWeight', sortState: 1, class: 'aa' },
						{ name: 'BMI', value: 'height_weight_Score', sortState: 1, class: 'aa' }
					],
					
					// 肺活量
					'VITAL_CAPACITY': { name: this.vitalCapacity, value: 'vitalCapacityScore', sortState: 1, class: 'aa' },
					'MC_VITAL_CAPACITY': { name: this.vitalCapacity, value: 'mcVitalCapacity', sortState: 1, class: 'aa' },
					
					// 50米跑
					'RUN50': { name: this.run50, value: 'run50Score', sortState: 1, class: 'aa' },
					
					// 立定跳远
					'STANDINGLONGJUMP': { name: this.standingLongJump, value: 'standingLongJumpScore', sortState: 1, class: 'aa' },
					'MC_STANDINGLONGJUMP': { name: this.standingLongJump, value: 'mcStandingLongJump', sortState: 1, class: 'aa' },
					
					// 坐位体前屈
					'SITANDREACH': { name: this.sitAndReach, value: 'sitAndReachScore', sortState: 1, class: 'bb' },
					'MC_SITANDREACH': { name: this.sitAndReach, value: 'mcSitAndReach', sortState: 1, class: 'bb' },
					
					// 一分钟仰卧起坐
					'SITANDUP': { 
						name: `1${this.minute}${this.sitAndUp}` + (this.classData.nowGrade > 6 ? '（女）' : ''), 
						value: 'sitAndUpScore', 
						sortState: 1 
					},
					'MC_SITANDUP': { name: `1${this.minute}${this.sitAndUp}（女）`, value: 'mcSitAndUp', sortState: 1 },
					
					// 引体向上
					'PULLUP': { name: `${this.pullUp}（男）`, value: 'pullUpScore', sortState: 1, class: 'bb' },
					'MC_PULLUP': { name: this.pullUp, value: 'mcPullUp', sortState: 1, class: 'bb' },
					
					// 跑步项目
					'RUN1000': [
						{ name: '1000米（男）', value: 'runScore', sortState: 1, class: 'bb' },
					],
					'MC_RUN1000': [
						{ name: '1000米（男）', value: 'mcRun', sortState: 1, class: 'bb' },
					],
					'RUN800': [
						{ name: '800米（女）', value: 'runScore', sortState: 1, class: 'bb' }
					],
					'MC_RUN800': [
						{ name: '800米（女）', value: 'mcRun', sortState: 1, class: 'bb' }
					],
					
					// 往返跑
					'RETURNRUN': { name: this.returnRun, value: 'returnRunScore', sortState: 1 },
					'MC_RETURNRUN': { name: this.returnRun, value: 'mcReturnRun', sortState: 1, class: 'bb' },
					
					// 一分钟跳绳
					'ROLEJUMP': { name: `1${this.minute}${this.roleJump}`, value: 'roleJumpScore', sortState: 1, class: 'bb' },
					
					// 视力
					'VISION': [
						{ name: this.leftVision, value: 'leftVision', sortState: 1, class: 'aa' },
						{ name: this.rightVision, value: 'rightVision', sortState: 1, class: 'aa' }
					],
					
					// 足球绕杆
					'SOCCER_SPORT': { name: this.soccerSport, value: 'soccerSport', sortState: 1, class: 'bb' },
					
					// 握力（澳门）
					'MC_GRIP': { name: this.grip, value: 'mcGrip', sortState: 1, class: 'aa' },
					
					// 斜身引体（澳门）
					'MC_OBLIQUEPULLUP': { name: this.obliquePullUp, value: 'mcObliquePullUp', sortState: 1, class: 'bb' }
				};
				
				return configs[testType];
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
				if (!item.total) {
					return
				}
				let nodeEnv = 'dev'
				if (USERCENTER.includes('test')) {
					nodeEnv = 'dev'
				} else if (USERCENTER.includes('pre')) {
					nodeEnv = 'pre'
				} else {
					nodeEnv = 'prod'
				}
				const xiaotiyunUser = uni.getStorageSync('xiaotiyunUser'); // 用户信息
				let domain;
				if (xiaotiyunUser.hasOwnProperty('teacher')) {
					domain = xiaotiyunUser.teacher.domain;
				} else {
					domain = xiaotiyunUser.parent.domain;
				}
				const option = {
					nodeEnv,
					uid: xiaotiyunUser.teacher.teacherId,
					token: xiaotiyunUser.teacher.token,
					loginType: "teacher",
					domain: domain,
				}
				const baseUrl = nodeEnv !== 'prod' ? "http" : "https"
				const params = {
					linkUrl: `${baseUrl}://h5.gxapp.iydsj.com/PhysicalFitnessReport/index.html#/pages/detail/index?option=${encodeURIComponent(JSON.stringify(option))}&physicalId=${this.physicalId}&studentCode=${item.studentCode || ''}&id=${item.physicalStudentId || 0}`,
				};
				uni.navigateTo({
					url: '/pages/webView/index/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
         // 动态获取列值
         getColumnValue(item, column) {
				const value = item[column.value];
				
				// 处理特殊显示逻辑
				switch(column.value) {
					case 'classCampusid':
						return item.classCampusid || "";
					case 'total':
						return item.total > 0 ? item.total/100 : this.$t('common.noTest');
					
					// 身高相关
					case 'height':
						return item.height > 0 ? item.height / 10 : '-';
					case 'mcHeight':
						return item.mcHeight > 0 ? (item.mcHeight / 10) : '-';
					
					// 体重相关
					case 'weight':
						return item.weight > 0 ? (item.weight / 1000).toFixed(1) : '-';
					case 'mcWeight':
						return item.mcWeight > 0 ? (item.mcWeight / 1000).toFixed(1) : '-';
					
					// BMI
					case 'height_weight_Score':
						if (this.hasMacao) {
							return item.mcHeight > 0 && item.mcWeight > 0 ? 
								this.dealNumber(item.mcWeight / 1000 / Math.pow(item.mcHeight / 1000, 2)) : '-';
						} else {
							return item.height > 0 && item.weight > 0 ? 
								this.dealNumber(item.weight / 1000 / Math.pow(item.height / 1000, 2)) : '-';
						}
					
					// 肺活量
					case 'vitalCapacityScore':
						return item.vitalCapacity > 0 ? item.vitalCapacity : '-';
					case 'mcVitalCapacity':
						return item.mcVitalCapacity > 0 ? item.mcVitalCapacity: '-';
					
					// 50米跑
					case 'run50Score':
						return item.run50 > 0 ? (item.run50 / 1000).toFixed(1) : '-';
					
					// 坐位体前屈
					case 'sitAndReachScore':
						return item.sitAndReach > 0 ? item.sitAndReach / 10 : '-';
					case 'mcSitAndReach':
						return item.mcSitAndReach > 0 ? item.mcSitAndReach / 10 : '-';
					
					// 一分钟跳绳
					case 'roleJumpScore':
						return item.roleJump > 0 ? item.roleJump : '-';
					
					// 一分钟仰卧起坐
					case 'sitAndUpScore':
						return item.sitAndUp > 0 ? item.sitAndUp : '-';
					case 'mcSitAndUp':
						return item.mcSitAndUp > 0 ? item.mcSitAndUp : '-';
					
					// 视力
					case 'leftVision':
						return item.leftVision > 0 ? item.leftVision / 10 : '-';
					case 'rightVision':
						return item.rightVision > 0 ? item.rightVision / 10 : '-';
					
					// 往返跑
					case 'returnRunScore':
						return item.returnRun > 0 ? (item.returnRun / 1000).toFixed(1) : '-';
					case 'mcReturnRun':
						return item.mcReturnRun > 0 ? item.mcReturnRun : '-';
					
					// 立定跳远
					case 'standingLongJumpScore':
						return item.standingLongJump > 0 ? item.standingLongJump / 10 : '-';
					case 'mcStandingLongJump':
						return item.mcStandingLongJump > 0 ? item.mcStandingLongJump / 10 : '-';
					
					// 引体向上
					case 'pullUpScore':
						return item.pullUp > 0 ? item.pullUp : '-';
					case 'mcPullUp':
						return item.mcPullUp > 0 ? item.mcPullUp : '-';
					
					// 足球绕杆
					case 'soccerSport':
						return item.soccerSport > 0 ? (item.soccerSport / 1000).toFixed(1) : '-';
					
					// 跑步项目（需要根据性别显示）
					case 'runScore':
						if (column.name.includes('1000米（男）')) {
							return (item.run > 0 && item.gender == 1) ? (item.run / 1000).toFixed(1) : '-';
						} else if (column.name.includes('800米（女）')) {
							return (item.run > 0 && item.gender == 0) ? (item.run / 1000).toFixed(1) : '-';
						}
						return '-';
					case 'mcRun':
						if (column.name.includes('1000米（男）')) {
							return (item.mcRun > 0 && item.gender == 1) ? (item.mcRun / 1000).toFixed(1) : '-';
						} else if (column.name.includes('800米（女）')) {
							return (item.mcRun > 0 && item.gender == 0) ? (item.mcRun / 1000).toFixed(1) : '-';
						}
						return '-';
					
					// 握力（澳门）
					case 'mcGrip':
						return item.mcGrip > 0 ? (item.mcGrip / 1000).toFixed(1) : '-';
					
					// 斜身引体（澳门）
					case 'mcObliquePullUp':
						return item.obliquePullUp > 0 ? item.obliquePullUp : '-';
					
					default:
						return value > 0 ? value : '-';
				}
			},
			// 选项卡echarts
			initTeacherCharts() {
				let _this = this;
				let correctData = _this.classData;
				let option = {
					tooltip: {
						trigger: "item"
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
									`${_this.excellent}  ${correctData.excellentCount?correctData.excellentCount:0}人  (${!correctData.excellentCount? 0:((correctData.excellentCount*100)/correctData.studentCountAll).toFixed(2)}%)`
							}
							if (name == "良好") {
								legendStr =
									`良好  ${correctData.goodCount?correctData.goodCount:0}人  (${!correctData.goodCount ? 0:((correctData.goodCount*100)/correctData.studentCountAll).toFixed(2)}%)`
							}
							if (name == "及格") {
								legendStr =
									`及格  ${correctData.passCount?correctData.passCount:0}人  (${!correctData.passCount ? 0:((correctData.passCount*100)/correctData.studentCountAll).toFixed(2)}%)`
							}
							if (name == "不及格") {
								legendStr =
									`不及格  ${correctData.noPassCount?correctData.noPassCount:0}人  (${!correctData.noPassCount ? 0:((correctData.noPassCount*100)/correctData.studentCountAll).toFixed(2)}%)`
							}
							return legendStr;
						}
					},
					title: {
						text: correctData.classAvgScore || '-',
						top: "54%",
						left: "25%",
						subtext: "平均分",
						itemGap: 0,
						textStyle: {
							color: "#5C8FF7",
							fontSize: 20,
							fontWeight: 'bold'
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
								value: correctData.excellentCount,
								name: _this.excellent,
								label: {
									color: "#3AA0FF"
								},
								color: "#000000"
							},
							{
								value: correctData.goodCount,
								name: "良好",
								label: {
									color: "#4ECB73"
								},
								color: "#000000"
							},
							{
								value: correctData.passCount,
								name: "及格",
								label: {
									color: "#FFB771"
								},
								color: "#000000"
							},
							{
								value: correctData.noPassCount,
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
			//situationSwitch
			situationSwitch(i) {
				//i==1 及格率  i==2 优秀率
				this.minAndCount = i
				this.initEcharts()
			},
			//初始化echarts
			initEcharts() {
				let _this = this;
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
						containLabel: true,
						show: 'true',
						borderWidth: 0
					},
					xAxis: [{
						type: 'category',
						data: this.minAndCount == 2 ? this.excellentRates.map((item) => {
							return item.physicalName
						}) : this.passRates.map((item) => {
							return item.physicalName
						}),
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
							rotate: -55
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
							data: this.minAndCount == 2 ? this.excellentRates.map((item) => {
								return item.classExcellentRate * 100
							}) : this.passRates.map((item) => {
								return item.classPassRate * 100
							}),
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
							data: this.minAndCount == 2 ? this.excellentRates.map((item) => {
								return item.gradeExcellentRate * 100
							}) : this.passRates.map((item) => {
								return item.gradePassRate * 100
							})
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
				postReq(URL.tcStudentExport, {
					classCode: this.classCode,
					physicalId: this.physicalId,
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
			dealNumber(data) {
				if (!data) {
					return 0
				}
				if (data && data % 1 !== 0) {
					const num2 = data.toFixed(3)
					return num2.substring(0, num2.lastIndexOf('.') + 3)
				}
				return data
			}
		}
	}
</script>

<style scoped lang="scss">
	.maxBox {
		width: 750upx;

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
					border: 1upx solid #dddddd;
					position: absolute;
					top: 27upx;
					left: 499upx;
				}

				.border2 {
					width: 1upx;
					height: 26upx;
					border: 1upx solid #dddddd;
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
						position: relative;

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
			padding-bottom: env(safe-area-inset-bottom);
			overflow: hidden;
			width: 750upx;
			transform: scale(1, 1);

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
							flex-basis: 300upx;
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
						}

						.aa {
							flex-basis: 160upx;
						}

						.bb {
							flex-basis: 220upx;
						}
					}

					.table-row {
						display: flex;
						flex-wrap: nowrap;
						height: 72upx;
						background: #FFFFFF;
						font-size: 24upx;
						font-weight: 400;
						color: #202020;

						.table-td {
							flex-basis: 300upx;
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
							flex-basis: 160upx;
						}

						.bb {
							flex-basis: 220upx;
						}
					}
				}
			}

			.table-all-left {
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
						flex-basis: 120upx;
						flex-shrink: 0;
						width: 140upx;
						padding-left: 24upx;
						box-sizing: border-box;
					}

					:nth-child(-n+1) {
						flex-basis: 80upx;
					}
				}

				.table-row {
					display: flex;
					flex-wrap: nowrap;
					height: 72upx;
					background: #FFFFFF;
					font-size: 24upx;
					font-weight: 400;
					color: #202020;

					.table-td {
						flex-basis: 120upx;
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