<template>
	<view class="week_date_picker">
		<view class="week_date_picker__header">
			<block v-if="!onlyMonth">
				<view class="header__control_month" @click="openCalendarPicker">
					<view class="month_text">{{timeStr}}</view>
					<view class="month_change">
						<image class="change_icon" src="../../static/images/correctTask/correct-change.png"
							mode="aspectFill"></image>
					</view>
				</view>
				<view class="header__control_switch">
					<view class="switch_ask" @click="showTipsPop = true">
						<image src="../../static/images/correctTask/help.png" mode="aspectFill"></image>
					</view>
					<view :class="['switch_change',{'switch_change--on': weekMode}]" @click="changeMode">
						<view class="switch_box">
							<view :class="['switch',{ active: !weekMode }]">月</view>
							<view :class="['switch',{ active: weekMode }]">周</view>
						</view>
						<view class="switch_node"></view>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="month-mode-cancel" @click="cancelDateList">取消</view>
				<view class="month-mode-title">
					<{{timeStr}}>
				</view>
				<view class="month-mode-btn" @click="confirmDateList">
					确定
				</view>
			</block>
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
									<view v-for="(item,index) in days" :key="index" class="week_day"
										:class="{'week_day--choose': item.fullDate == selectedDate}"
										@click="clickItem(item)">
										<view class="week_title">{{weeks[index%7]}}</view>
										<view class="date">
											{{item.time.getDate()}}
										</view>
										<!-- 										<view class="dot" style="background: #FFFFFF;" v-if="item.fullDate < selectedDate && calendarStateArr[index] == 0"></view>
										<view class="dot" style="background: #5C8FF7;" v-if="item.fullDate < selectedDate && calendarStateArr[index] == 1"></view>
										<view class="dot" style="background: #EC9131;" v-if="item.fullDate < selectedDate && calendarStateArr[index] == 2"></view>
										<view class="dot" style="background: #707070;" v-if="item.fullDate < selectedDate && calendarStateArr[index] == 3"></view> -->
										<view class="dot" style="background: #FF5050"
											v-if="new Date(item.fullDate).getTime() <= new Date(selectedDate1).getTime() && calendarStateArr[item.index-1] == 0">
										</view>
										<view class="dot" style="background: #5C8FF7;"
											v-if="calendarStateArr[item.index-1] == 1"></view>
										<view class="dot" style="background: #EC9131;"
											v-if="calendarStateArr[item.index-1] == 2"></view>
										<view class="dot" style="background: #707070;"
											v-if="calendarStateArr[item.index-1] == 3"></view>
										<!-- <view class="dot" style="background: #FF5050;" v-if="(item.fullDate == selectedDate1 && calendarStateArr[item.index-1] == 1) || (item.fullDate == selectedDate1 && calendarStateArr[item.index-1] == 2)"></view> -->
									</view>
								</template>
								<template v-else>
									<view v-for="(item,index) in days" :key="index" :class="['month_day',{'month_day--choose': item.fullDate == selectedDate && !onlyMonth}
									,{'day-hidden': !item.show},{'month_day--choose': item.choice && onlyMonth }]" @click="clickItem(item)">
										<view class="date">{{item.time.getDate()}}</view>
										<!-- <view class="dot" style="background: #FF5050;" v-if="(item.fullDate == selectedDate && calendarStateArr[item.index-1] == 1) || (item.fullDate == selectedDate1 && calendarStateArr[item.index-1] == 2)"></view> -->
										<view class="dot" style="background: #FF5050;"
											v-if="new Date(item.fullDate).getTime() <= new Date(selectedDate1).getTime() && calendarStateArr[item.index-1] == 0">
										</view>
										<view class="dot" style="background: #5C8FF7;"
											v-if="calendarStateArr[item.index-1] == 1"></view>
										<view class="dot" style="background: #EC9131;"
											v-if="calendarStateArr[item.index-1] == 2"></view>
										<view class="dot" style="background: #707070;"
											v-if="calendarStateArr[item.index-1] == 3"></view>
									</view>
								</template>
							</template>
							<template v-else>
								<template v-if="current - sitem === 1 || current-sitem ===-2">
									<template v-if="weekMode">
										<view class="week_day" v-for="(item,index) in predays" :key="index"
											:class="['week_day',{'week_day--choose':item.fullDate == selectedDate}]"
											@click="clickItem(item)">
											<view class="week_title">{{weeks[index%7]}}</view>
											<view class="date">{{item.time.getDate()}}</view>
											<!-- <view class="dot" style="background: #000000;" v-if="item.fullDate < selectedDate"></view> -->
											<view class="dot" v-if="item.fullDate == selectedDate"></view>
										</view>
									</template>
									<template v-else>
										<view v-for="(item,index) in predays" :key="index" :class="['month_day',{'month_day--choose':item.fullDate == selectedDate}
										,{'day-hidden':!item.show}]" @click="clickItem(item)">
											<view class="date">{{item.time.getDate()}}</view>
											<!-- <view class="dot" v-if="item.fullDate == selectedDate"></view> -->
										</view>
									</template>
								</template>
								<template v-else>
									<template v-if="weekMode">
										<view class="week_day" v-for="(item,index) in nextdays" :key="index"
											:class="['week_day',{'week_day--choose':item.fullDate == selectedDate}]"
											@click="clickItem(item)">
											<view class="week_title">{{weeks[index%7]}}</view>
											<view class="date">{{item.time.getDate()}}</view>
											<!-- <view class="dot" style="background: #000000;" v-if="item.fullDate < selectedDate"></view> -->
											<view class="dot" v-if="item.fullDate == selectedDate"></view>
										</view>
									</template>
									<template v-else>
										<view v-for="(item,index) in nextdays" :key="index" :class="['month_day',{'month_day--choose':item.fullDate == selectedDate}
										,{'day-hidden':!item.show}]" @click="clickItem(item)">
											<view class="date">{{item.time.getDate()}}</view>
											<!-- <view class="dot" v-if="item.fullDate == selectedDate"></view> -->
										</view>
									</template>
								</template>
							</template>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<u-select v-if="calendarList && calendarList.length" v-model="showCalendar" mode="mutil-column-auto"
			:list="calendarList" :default-value="defaultValue" @confirm="confirm"></u-select>
		<u-mask :show="showTipsPop" @click="offTipsPop()">
			<view class="tips-pop">
				<view class="tips-title">温馨提示</view>
				<view class="tips-column">
					<view class="round bule"></view>
					<view class="text">当天全部班级都已布置作业</view>
				</view>
				<view class="tips-column">
					<view class="round yellow"></view>
					<view class="text">当天部分班级已布置作业</view>
				</view>
				<view class="tips-column">
					<view class="round red"></view>
					<view class="text">当天没有班级已布置作业</view>
				</view>
			</view>
			<view class="off-tips-pop" @click="showTipsPop = false">
				<image src="../../static/images/correctTask/delete-icon.png" mode="aspectFit"></image>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import {
		gegerateDates,
		dateEqual,
		formatDate
	} from './generateDates.js';
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
			calendarStateList: {
				type: Array, // 日历
				default: []
			},
			onlyMonth: {
				type: Boolean,
				default: false
			},
			checkedDateList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				calendarStateArr: [],
				weekMode: true,
				weeks: ['一', '二', '三', '四', '五', '六', '日'],
				current: 1,
				currentYear: '',
				currentMonth: '',
				currentDate: '',
				swiper: [0, 1, 2],
				selectedDate: formatDate(new Date(), 'yyyy-MM-dd'),
				selectedDate1: formatDate(new Date(), 'yyyy-MM-dd'), // 永远是当前日期
				days: [],
				showCalendar: false, //显示日期选择器
				calendarList: [],
				defaultValue: [],
				showTipsPop: false,
				mouthSelectList: [],
				pleaseSelectCorrectDate: this.$t('task.assign.assignTask.pleaseSelectCorrectDate'),
			};
		},
		watch: {
			dotList: function(newvalue) {
				const days = this.days.slice(0);
				newvalue.forEach(item => {
					const index = days.findIndex(ditem => ditem.fullDate === item.date);
					if (index > 0) {
						days[index].info = item
					}
				});
				this.days = days;
			},
			checkedDate: function(newvalue) {
				if (newvalue) {
					this.selectedDate = newvalue;
					this.initDate(newvalue);
				}
			},
			calendarStateList: function(newvalue) {
				if (newvalue) {
					this.calendarStateArr = newvalue;
					this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd')
					// console.log(this.selectedDate, 'selectedDate')
					// this.days = this.days.filter(some=>{return some.show})
				}
			},
			checkedDateList: function(newvalue) {
				if (newvalue && this.onlyMonth) {
					this.checkedDateList = newvalue;
					// console.log('checkedDateList change=========>', newvalue)
					// this.initDate()
				}
			},
		},
		computed: {
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
			}
		},
		created() {
			this.weekMode = this.onlyMonth ? false : true;
			this.selectedDate = this.checkedDate ? this.checkedDate : formatDate(new Date(), 'yyyy-MM-dd');
		},
		mounted() {
			this.initCalendarPickerData();
			this.initDate(this.selectedDate);
			// console.log('组件内渲染后', this._data.days);
		},
		methods: {
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
						day.info = dot;
					}
					const idx = this.checkedDateList.findIndex(item => item == day.fullDate);
					if (this.onlyMonth && idx != -1) {
						day.choice = true;
					}
				})
				// console.log('this.checkedDateList===============>', this.checkedDateList);
				this.days = days;
				// console.log('this.days===============>', this.days);
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
				// console.log(e, 31)
				if (!this.onlyMonth) {
					this.selectedDate = e.fullDate;
					this.$emit('selected-change', e);
					return;
				} else {
					// console.log('selectedDate1', e);
					if (new Date(e.fullDate).getTime() - new Date(this.selectedDate1).getTime() >= 0) {
						this.onlyMonthSelect(e.fullDate);
					} else {
						uni.showToast({
							icon: 'none',
							title: this.pleaseSelectCorrectDate,
							duration: 1000,
						})
					}
				}
			},
			// 改变周/月模式
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
			// 生成年月日数组
			initCalendarPickerData() {
				const nowY = new Date().getFullYear() // 当前年份
				// const nowM = new Date().getMonth() + 1
				const nowM = 12;
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
			// 选择日历
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
				// console.log('defaultValue=======>', defaultValue);
				// calendarList
				// console.log('calendarList=======>', this.calendarList);
				this.defaultValue = defaultValue;
				this.showCalendar = true;
			},
			// 选择月份
			confirm(e) {
				// console.log(e);
				let d = new Date(e[0].value, e[1].value - 1, 1);
				this.initDate(d);
			},
			// 单月多选模式
			onlyMonthSelect(date) {
				// 组件内日期数组里是否有该日期
				let hasDate = this.mouthSelectList.findIndex(item => item == date);
				// 外部日期数组里是否有该日期
				let hasOldDate = this.checkedDateList.findIndex(item => item == date);
				// 找出在days里的对应下标，方便修改是否选中
				let index = this.days.findIndex(item => item.fullDate == date);
				// console.log('hasDate', hasDate, 'hasOldDate', hasOldDate, 'index', index, 'choice', this.days[index]
				// 	.choice, 'date', date)
				this.days[index].choice = !this.days[index].choice;
				if (hasOldDate != -1 && hasDate != -1) {
					// console.log('内部和外部有该日期')
					this.mouthSelectList.splice(hasDate, 1)
					this.checkedDateList.splice(hasOldDate, 1)
					return
				} else if (hasOldDate != -1 && hasDate == -1) {
					// console.log('外部有该日期');
					this.checkedDateList.splice(hasOldDate, 1)
				} else if (hasDate != -1) {
					// console.log('内部有该日期',)
					this.mouthSelectList.splice(hasDate, 1)
					return
				} else {
					// console.log('默认执行')
					this.mouthSelectList.push(date);
					return
				}
			},
			// 确认回调
			confirmDateList() {
				const {
					mouthSelectList,
					checkedDateList
				} = this;
				// console.log(mouthSelectList, checkedDateList);
				let list = mouthSelectList.length + checkedDateList.length != 0 ? this.unique(mouthSelectList.concat(
					checkedDateList)) : [];
				let showList = [];
				if (mouthSelectList.length != 0) {
					// 拼接选中数组和外部已有数组

					let backList = list.map(item => {
						return new Date(item).getTime()
					});
					backList.sort();
					list = backList.map(item => {
						return formatDate(new Date(item), 'yyyy-MM-dd')
					})
				}
				// console.log('list======>', list);
				this.$emit('selected-change', list);
				// let showList = list;
				showList = this.resolve(list);
				this.$emit('selectList-show', showList);
			},

			// 取消回调
			cancelDateList() {
				// 置空选中数组
				this.mouthSelectList = [];
				// console.log('this.mouthSelectList=====>', this.mouthSelectList);
				this.initDate();
				this.$emit('deselect');
			},
			// 数组去重
			unique(arr) {
				if (!Array.isArray(arr)) {
					// console.log('type error!')
					return;
				}
				arr = arr.sort()
				var arrry = [arr[0]];
				for (var i = 1; i < arr.length; i++) {
					if (arr[i] !== arr[i - 1]) {
						arrry.push(arr[i]);
					}
				}
				return arrry;
			},
			resolve(arr) {
				// console.log('arr=====>', arr);
				if (!arr.length) return [];
				const result = [
					[arr[0]]
				];
				for (let i = 1; i < arr.length; i++) {
					const prve = arr[i - 1].split('-');
					const curr = arr[i].split('-');
					if (prve[0] === curr[0] && prve[1] === curr[1] && (curr[2] - prve[2] === 1)) {
						result[result.length - 1].push(arr[i]);
					} else {
						result.push([arr[i]]);
					}
				}
				return result;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.week_date_picker {
		width: 100%;
		background-color: #FFFFFF;
		box-shadow: 0upx 2upx 4upx 0upx rgba(0, 0, 0, 0.1);
		padding: 0;
		margin: 0;

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

				.switch_ask {
					width: 56rpx;
					height: 56rpx;
					padding: 13rpx;
					float: right;

					image {
						width: 100%;
						height: 100%;
						display: block;
					}
				}
			}

			.month-mode-title {
				font-size: 34upx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 48upx;
				color: #464646;
				text-align: center;
			}

			.month-mode-btn {
				width: 100upx;
				text-align: center;
				float: right;
				color: #5C8FF7;
			}

			.month-mode-cancel {
				color: #B2B2B2;
				font-size: 34upx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 48upx;
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
								border: 2upx solid #B2B2B2;
								background-color: #FFFFFF;
								color: #464646;

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
								// background-color: #5C8FF7;
								background-color: rgba(92, 143, 247, 0.7);
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
								position: relative;

								.date {
									font-size: 36upx;
									width: 64upx;
									height: 64upx;
									line-height: 64upx;
									border-radius: 50%;
									margin: 0 auto;
									background-color: #FFFFFF;
									color: #464646;
								}

								.dot {
									position: absolute;
									bottom: 4upx;
									left: 50%;
									transform: translateX(-50%);
									width: 14upx;
									height: 14upx;
									border-radius: 50%;
									background-color: #FFFFFF;
								}
							}

							.month_day--choose {
								.date {
									// background-color: #5C8FF7;
									background-color: rgba(92, 143, 247, 0.7);
									color: #FFFFFF;
								}
							}

							.month_day--unclick {
								.date {
									background-color: #FFFFFF;
									color: #B2B2B2;
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

		.tips-pop {
			width: 560upx;
			height: 300upx;
			background: rgba(255, 255, 255, 1);
			opacity: 1;
			border-radius: 24upx;
			position: fixed;
			left: calc(50% - 280upx);
			top: calc(50% - 120upx);
			z-index: 10080;
			padding: 48upx;

			.tips-title {
				text-align: center;
				font-size: 34upx;
				font-family: PingFang SC;
				font-weight: bold;
				line-height: 48upx;
				color: #333333;
				opacity: 1;
			}

			.tips-column {
				width: 380upx;
				margin: 0 auto;
				height: 40upx;
				// text-align: center;
				margin-top: 8upx;

				.round {
					// margin: 13upx;
					width: 14upx;
					height: 14upx;
					background: rgba(92, 143, 247, 0.39);
					border-radius: 50%;
					display: inline-block;
					margin-right: 8upx;

					&.bule {
						background-color: #5C8FF7;
					}

					&.yellow {
						background-color: #FFAA50;
					}

					&.red {
						background-color: #FF7A86;
					}
				}

				.text {
					font-size: 28upx;
					line-height: 40upx;
					display: inline-block;
				}
			}
		}

		.off-tips-pop {
			width: 64upx;
			height: 64upx;
			position: fixed;
			top: calc(50% + 200upx);
			left: calc(50% - 32upx);

			image {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}

	.disabled {
		color: #c0c4cc;
	}
</style>
