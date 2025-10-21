<template>
	<view class="week_date_picker">
		<view class="week_date_picker__header">
			<view class="header__control_month" @click="openCalendarPicker">
				<view class="month_text">{{timeStr}}</view>
				<view class="month_change">
					<image class="change_icon" src="../../static/images/correctTask/correct-change.png"
						mode="aspectFill"></image>
				</view>
			</view>
			<view class="header__control_switch">
				<view :class="['switch_change',{'switch_change--on': weekMode}]" @click="changeMode">
					<view class="switch_box">
						<view :class="['switch',{ active: !weekMode }]">月</view>
						<view :class="['switch',{ active: weekMode }]">周</view>
					</view>
					<view class="switch_node"></view>
				</view>
			</view>
			<view class="header__control_download" @click="exportFile" v-if="showRightIcon">
				<image class="download_icon" src="../../static/images/correctTask/correct-download.png"></image>
			</view>
		</view>
		<view class="week_date_picker__content">
			<view class="calendar-weeks" v-if="!weekMode">
				<view class="calendar-week" v-for="(week, index) in weeks" :key="index">
					{{week}}
				</view>
			</view>
			<view class="picker_calendar">
				<swiper class="calendar_swiper" :style="{width: '100%',height: sheight}" :indicator-dots="false"
					:autoplay="false" :duration="duration" :current="current" @change="changeSwp" :circular="true">
					<swiper-item class="calendar_item" v-for="sitem in swiper" :key="sitem">
						<view class="calendar_days">
							<template v-if="sitem === current">
								<template v-if="weekMode">
									<view v-for="(item,index) in days" :key="index"
										:class="['week_day',{'week_day--choose':item.fullDate == selectedDate},{'week_day--unclick':item.disable ? true : !allowClickAfterToday && item.afterToday}]"
										@click="clickItem(item)">
										<view class="week_title">{{item.isToday ? "今" : weeks[index%7]}}</view>
										<view class="date">{{item.time.getDate()}}</view>
										<view class="dot" v-if="item.fullDate == selectedDate"></view>
									</view>
								</template>
								<template v-else>
									<view v-for="(item,index) in days" :key="index" :class="['month_day',{'month_day--choose':item.fullDate == selectedDate},{'month_day--unclick':item.disable ? true : !allowClickAfterToday && item.afterToday}
									,{'day-hidden':!item.show}]" @click="clickItem(item)">
										<view class="date">{{item.isToday ? "今" : item.time.getDate() }}</view>
									</view>
								</template>
							</template>
							<template v-else>
								<template v-if="current - sitem === 1 || current-sitem ===-2">
									<template v-if="weekMode">
										<view class="week_day" v-for="(item,index) in predays" :key="index"
											:class="['week_day',{'week_day--choose':item.fullDate == selectedDate},{'week_day--unclick':item.disable ? true : !allowClickAfterToday }]"
											@click="clickItem(item)">
											<view class="week_title">{{item.isToday ? "今" : weeks[index%7]}}</view>
											<view class="date">{{item.time.getDate()}}</view>
											<view class="dot" v-if="item.fullDate == selectedDate"></view>
										</view>
									</template>
									<template v-else>
										<view v-for="(item,index) in predays" :key="index" :class="['month_day',{'month_day--choose':item.fullDate == selectedDate},{'month_day--unclick':item.disable ? true : !allowClickAfterToday && item.afterToday}
										,{'day-hidden':!item.show}]" @click="clickItem(item)">
											<view class="date">{{item.isToday ? "今" : item.time.getDate() }}</view>
										</view>
									</template>
								</template>
								<template v-else>
									<template v-if="weekMode">
										<view class="week_day" v-for="(item,index) in nextdays" :key="index"
											:class="['week_day',{'week_day--choose':item.fullDate == selectedDate},{'week_day--unclick':item.disable ? true : !allowClickAfterToday}]"
											@click="clickItem(item)">
											<view class="week_title">{{item.isToday ? "今" : weeks[index%7]}}</view>
											<view class="date">{{item.time.getDate()}}</view>
											<view class="dot" v-if="item.fullDate == selectedDate"></view>
										</view>
									</template>
									<template v-else>
										<view v-for="(item,index) in nextdays" :key="index" :class="['month_day',{'month_day--choose':item.fullDate == selectedDate},{'month_day--unclick':item.disable ? true : !allowClickAfterToday && item.afterToday}
										,{'day-hidden':!item.show}]" @click="clickItem(item)">
											<view class="date">{{item.isToday ? "今" : item.time.getDate() }}</view>
										</view>
									</template>
								</template>
							</template>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<u-select v-model="showCalendar" mode="mutil-column-auto" :list="calendarList" :default-value="defaultValue"
			@confirm="confirm"></u-select>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		gegerateDates,
		dateEqual,
		formatDate
	} from './generateDates.js';
	import {
		getReq,
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	export default {
		props: {
			duration: {
				type: Number,
				default: 500
			},
			dotList: {
				type: Array, /// 打点日期列表
				default () {
					return []
				}
			},
			checkedDate: {
				type: String,
				default: ""
			},
			allowClickAfterToday: {
				type: Boolean, // 今天之后是否可以点击
				default: false
			},
			showRightIcon: {
				type: Boolean, // 是否显示右侧按钮
				default: true
			},
			showCorre: {
				type: Boolean, // 是否开启布置作业限制
				default: false
			}
		},
		data() {
			return {
				weekMode: true,
				weeks: ['一', '二', '三', '四', '五', '六', '日'],
				current: 1,
				currentYear: '',
				currentMonth: '',
				currentDate: '',
				swiper: [0, 1, 2],
				selectedDate: formatDate(new Date(), 'yyyy-MM-dd'),
				days: [],
				showCalendar: false, //显示日期选择器
				calendarList: [],
				defaultValue: [],
				classIds: []
			};
		},
		watch: {
			showCorre: {
				handler(value) {
					value && this.getCalendar()
				},
				immediate: true
			},
			dotList: {
				handler(value) {
					if (value && value.length) {
						const days = this.days.slice(0);
						value.forEach(item => {
							const index = days.findIndex(ditem => ditem.fullDate === item.date);
							if (index > 0) {
								days[index].info = item
							}
						});
						this.days = days;
					}
				},
				immediate: true
			},
			checkedDate: function(newvalue) {
				if (newvalue) {
					this.selectedDate = newvalue;
					this.initDate(newvalue);
				}
			},
			calendarData: {
				handler(value) {
					const {
						classIds,
						dateRange
					} = value
					if (classIds && classIds.length && dateRange && dateRange.length) {
						const params = {
							beginDate: dateRange[0].fullDate,
							endDate: dateRange[dateRange.length - 1].fullDate,
							classIds
						}
						postReq(URL.taskPublishCalendar, params).then(res => {
							if (res.data && res.data.length) {
								res.data.forEach((item, index) => {
									this.days[index].disable = ![1, 2].includes(item) && !this.days[index]
										.isToday
									if (this.days[index].isToday) {
										this.$parent.isEmpty = [1, 2].includes(item) ? false : true
									}
								})
								this.$forceUpdate()
							}
						})
					}
				}
			}
		},
		computed: {
			...mapState(['xiaotiyunUser']),
			sheight() {
				// 根据年月判断有多少行
				// 判断该月有多少天
				let h = '132rpx';
				if (!this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth, 0);
					const days = d.getDate(); // 判断本月有多少天
					let day = new Date(d.setDate(1)).getDay();
					if (day === 0) {
						day = 7;
					}
					const pre = 8 - day;
					const rows = Math.ceil((days - pre) / 7) + 1;
					h = 70 * rows + 'rpx'
				}
				return h
			},
			timeStr() {
				let str = '';
				const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
				const y = d.getFullYear();
				const m = (d.getMonth() + 1) <= 9 ? `0${d.getMonth()+1}` : d.getMonth() + 1;
				str = `${y}年${m}月`;
				return str;
			},
			predays() {
				let pres = [];
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate)
					d.setDate(d.getDate() - 7);
					pres = gegerateDates(d, 'week')
				} else {
					const d = new Date(this.currentYear, this.currentMonth - 2, 1)
					pres = gegerateDates(d, 'month')
				}
				return pres;
			},
			nextdays() {
				let nexts = [];
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate)
					d.setDate(d.getDate() + 7);
					nexts = gegerateDates(d, 'week')
				} else {
					const d = new Date(this.currentYear, this.currentMonth, 1)
					nexts = gegerateDates(d, 'month')
				}
				return nexts;
			},
			calendarData() {
				return {
					classIds: this.classIds || [],
					dateRange: this.days || []
				}
			}
		},
		created() {
			this.selectedDate = this.checkedDate ? this.checkedDate : formatDate(new Date(), 'yyyy-MM-dd');
			this.initCalendarPickerData();
			this.initDate(this.selectedDate);
		},
		mounted() {},
		methods: {
			async getCalendar() {
				try {
					if (!this.xiaotiyunUser.teacher.teacherId) {
						return
					}
					const classes = await postReq(URL.classManage, {
						teacherId: this.xiaotiyunUser.teacher.teacherId
					})
					if (!classes.data || !classes.data.length) {
						return
					}
					this.classIds = classes.data.map(item => item.classId)
				} catch (error) {
					this.classIds = []
				}
			},
			changeSwp(e) {
				// console.log(e);
				const pre = this.current;
				const current = e.target.current;
				/* 根据前一个减去目前的值我们可以判断是下一个月/周还是上一个月/周 
				 *current - pre === 1, -2时是下一个月/周
				 *current -pre === -1, 2时是上一个月或者上一周
				 */
				this.current = current;
				if (current - pre === 1 || current - pre === -2) {
					this.daysNext();
				} else {
					this.daysPre();
				}
			},
			// 初始化日历的方法
			initDate(cur) {
				let date = ''
				if (cur) {
					date = new Date(cur)
				} else {
					date = new Date()
				}
				this.currentDate = date.getDate() // 今日日期 几号
				this.currentYear = date.getFullYear() // 当前年份
				this.currentMonth = date.getMonth() + 1 // 当前月份
				this.currentWeek = date.getDay() === 0 ? 7 : date.getDay() // 1...6,0   // 星期几
				const nowY = new Date().getFullYear() // 当前年份
				const nowM = new Date().getMonth() + 1
				const nowD = new Date().getDate() // 今日日期 几号
				const nowW = new Date().getDay();
				// this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd')
				this.days = [];
				let days = [];
				if (this.weekMode) {
					days = gegerateDates(date, 'week');
					// this.selectedDate = days[0].fullDate;
				} else {
					days = gegerateDates(date, 'month');
					// const sel = new Date(this.selectedDate.replace('-', '/').replace('-', '/'));
					// const isMonth = sel.getFullYear() === this.currentYear && (sel.getMonth() + 1) === this.currentMonth;
					// if(!isMonth) {
					// 	this.selectedDate = formatDate(new Date(this.currentYear, this.currentMonth-1,1), 'yyyy-MM-dd')
					// }
				}
				days.forEach(day => {
					const dot = this.dotList.find(item => {
						return dateEqual(item.date, day.fullDate);
					})
					if (dot) {
						days.info = dot;
					}
				})
				this.days = days;
				//  派发事件,时间发生改变
				let obj = {
					start: '',
					end: ''
				};
				if (this.weekMode) {
					obj.start = this.days[0].time;
					obj.end = this.days[6].time
				} else {
					const start = new Date(this.currentYear, this.currentMonth - 1, 1);
					const end = new Date(this.currentYear, this.currentMonth, 0);
					obj.start = start;
					obj.end = end;
				}
				this.$emit('days-change', obj)
			},
			//  上一个
			daysPre() {
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
					d.setDate(d.getDate() - 7);
					this.initDate(d);
				} else {
					const d = new Date(this.currentYear, this.currentMonth - 2, 1);
					this.initDate(d);
				}
			},
			//  下一个
			daysNext() {
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
					d.setDate(d.getDate() + 7);
					this.initDate(d);
				} else {
					const d = new Date(this.currentYear, this.currentMonth, 1);
					this.initDate(d);
				}
			},
			// 点击日期
			clickItem(e) {
				if (!e.disable ? this.allowClickAfterToday || !e.afterToday : false) {
					this.selectedDate = e.fullDate;
					console.log(e);
					this.$emit('selected-change', e);
				}
			},
			// 导出按钮点击
			exportFile() {
				this.$emit('export-file');
			},
			changeMode() {
				const premode = this.weekMode;
				let isweek = false;
				if (premode) {
					isweek = !!this.days.find(item => item.fullDate === this.selectedDate)
				}
				this.weekMode = !this.weekMode;
				let d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate)
				const sel = new Date(this.selectedDate.replace('-', '/').replace('-', '/'));
				const isMonth = sel.getFullYear() === this.currentYear && (sel.getMonth() + 1) === this.currentMonth;
				if ((this.selectedDate && isMonth) || isweek) {
					d = new Date(this.selectedDate.replace('-', '/').replace('-', '/'))
				}
				this.initDate(d)
			},
			initCalendarPickerData() {
				const nowY = new Date().getFullYear() // 当前年份
				const nowM = new Date().getMonth() + 1
				let calendarList = [];
				let lastYearCalendarData = {
					value: nowY - 1,
					label: nowY - 1 + '年',
					children: [],
				};
				for (let i = 0; i < 12; i++) {
					let data = {
						value: i + 1,
						label: i + 1 + "月",
					}
					lastYearCalendarData.children.push(data);
				}
				calendarList.push(lastYearCalendarData);
				let nowYearCalendarData = {
					value: nowY,
					label: nowY + '年',
					children: [],
				};
				for (let i = 0; i < nowM; i++) {
					let data = {
						value: i + 1,
						label: i + 1 + "月",
					}
					nowYearCalendarData.children.push(data);
				}
				calendarList.push(nowYearCalendarData);
				this.calendarList = calendarList;
				// console.log(calendarList);
			},
			openCalendarPicker() {
				let selectedDate = this.selectedDate;
				let date = new Date(selectedDate);
				let currentYear = date.getFullYear() // 当前年份
				let currentMonth = date.getMonth() + 1 // 当前月份
				const nowY = new Date().getFullYear() // 当前年份
				const nowM = new Date().getMonth() + 1
				let defaultValue = [];
				if (currentYear == nowY) {
					defaultValue.push(1);
				} else {
					defaultValue.push(0);
				}
				defaultValue.push(currentMonth - 1);
				this.defaultValue = defaultValue;
				this.showCalendar = true;
			},
			// 选择月份
			confirm(e) {
				// console.log(e);
				let d = new Date(e[0].value, e[1].value - 1, 1);
				this.initDate(d);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.week_date_picker {
		width: 100%;
		background-color: #FFFFFF;
		box-shadow: 0upx 2upx 4upx 0upx rgba(0, 0, 0, 0.1);

		&__header {
			position: relative;
			width: 100%;
			height: 88upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 32upx 32upx 0 32upx;

			.header__control_month {
				display: flex;
				align-items: center;

				.month_text {
					font-size: 40upx;
					font-weight: 500;
					color: #202020;
					margin-right: 8upx;
				}

				.month_change {
					width: 30upx;
					height: 30upx;

					.change_icon {
						width: 100%;
						height: 100%;
					}
				}
			}

			.header__control_switch {
				flex: 1;

				.switch_change {
					width: 208upx;
					height: 56upx;
					border-radius: 28upx;
					background-color: #F2F2F2;
					position: relative;
					float: right;

					.switch_node {
						width: 104upx;
						height: 56upx;
						border-radius: 28upx;
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
							font-size: 28upx;
							font-weight: 400;
							color: #B2B2B2;
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
			}

			.header__control_download {
				width: 38upx;
				height: 40upx;
				margin-left: 22upx;

				.download_icon {
					width: 100%;
					height: 100%;
				}
			}
		}

		&__content {
			position: relative;
			width: 100%;
			min-height: 196upx;
			padding: 32upx 0;

			.calendar-weeks {
				width: 100%;
				display: flex;
				flex-flow: row nowrap;
				height: 60upx;
				line-height: 60upx;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				padding: 0 22upx;

				.calendar-week {
					width: calc(100% / 7);
					height: 100%;
					text-align: center;
				}
			}

			.picker_calendar {
				width: 100%;
				min-height: 132upx;

				.calendar_swiper {
					min-height: 70upx;
					transition: height ease-out 0.3s;

					.calendar_item {
						margin: 0;
						padding: 0;
						height: 100%;

						.calendar_days {
							display: flex;
							flex-flow: row wrap;
							width: 100%;
							height: 100%;
							overflow: hidden;
							font-size: 28upx;
							padding: 0 22upx;

							.week_day {
								position: relative;
								width: calc(100% / 7 - 20upx);
								height: 132upx;
								text-align: center;
								display: flex;
								flex-flow: column nowrap;
								align-items: center;
								justify-content: center;
								border-radius: 56upx;
								margin: 0 10upx;
								border: 2upx solid #5C8FF7;
								background-color: #D4E2FF;
								color: #3D86F7;

								.date {
									font-size: 36upx;
									width: 50upx;
									height: 50upx;
									line-height: 50upx;
									margin: 0 auto;
								}

								.week_title {
									font-size: 28upx;
								}

								.dot {
									position: absolute;
									bottom: 9upx;
									left: 50%;
									transform: translateX(-50%);
									width: 14upx;
									height: 14upx;
									border-radius: 50%;
									background-color: #FFFFFF;
								}
							}

							.week_day--choose {
								background-color: #5C8FF7;
								border: 2upx solid #5C8FF7;
								color: #FFFFFF;
							}

							.week_day--unclick {
								background-color: #FFFFFF;
								border: 2upx solid #F2F2F2;
								color: #B2B2B2;
							}

							.month_day {
								width: calc(100% / 7);
								height: 70upx;
								text-align: center;
								display: flex;
								flex-flow: column nowrap;
								justify-content: center;
								align-items: center;

								.date {
									font-size: 36upx;
									width: 64upx;
									height: 64upx;
									line-height: 64upx;
									border-radius: 50%;
									margin: 0 auto;
									background-color: #D4E2FF;
									color: #4A91FF;
									border: 1px solid #5C8FF7;
								}
							}

							.month_day--choose {
								.date {
									background-color: #5C8FF7;
									color: #FFFFFF;
									border: none;
								}
							}

							.month_day--unclick {
								.date {
									background-color: #FFFFFF;
									color: #B2B2B2;
									border: none;
								}
							}

							.day-hidden {
								visibility: hidden;
							}
						}
					}
				}
			}
		}
	}
</style>
