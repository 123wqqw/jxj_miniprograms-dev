<template>
	<view class="weekDatePicker">
		<view class="weekDatePicker__header">
			<view class="weekDatePicker-switch" @click="monthSwitch = !monthSwitch" v-if="!onlyMonth">
				<view :class="['switch',{ active: !monthSwitch }]">周</view>
				<view :class="['switch',{ active: monthSwitch }]">月</view>
			</view>
			<view class="weekDatePicker-control">
				<view class="control left-date" @click="handleBeforeOne">{{ left }}</view>
				{{ monthSwitch?systemDate.dayRange:systemDate.weekRange }}
				<view class="control right-date" @click="handleNextOne">{{ right }}</view>
			</view>
			<view class="weekDatePicker-button">
				<!-- <u-button size="mini" shape="circle" v-show="monthSwitch" @click="backToToday">{{ systemDate.dayToday?'':'回' }}今日</u-button> -->
				<!-- <u-button size="mini" shape="circle" v-show="!monthSwitch" @click="backToToday">{{ systemDate.weekToday?'':'回' }}今日</u-button> -->
			</view>
		</view>
		<view class="weekDatePicker__content">
			<view class="weekpicker" v-if="!monthSwitch">
				<view class="weekpicker-bg"></view>
				<scroll-view scroll-x >
					<xtyWeek ref="weekpicker" @change="handleWeekSelect" :chooseDate="chooseDate" :canToday="canToday"></xtyWeek>
				</scroll-view>
			</view>
			<view class="weekpicker" v-if="monthSwitch">
				<xtyCalendar ref="datepicker"
				 :mode="range" 
				 v-show="monthSwitch" 
				 @change="handleDaysSelect" 
				 :can-today="canToday"
				 active-bg-color="#55B8F9"
				 range-color="#55B8F9" 
				 range-bg-color="rgba(85, 184, 249, 0.13)" ></xtyCalendar>
			</view>
		</view>
	</view>
</template>

<script>
	import xtyCalendar from "../xty-calendar/xty-calendar.vue";
	import xtyWeek from "../xty-week/xty-week.vue";
	export default {
		components: {
			xtyCalendar,
			xtyWeek
		},
		props: {
			chooseDate: {
				type: String,
				default: ""
			},
			
			canToday: {
				type: Boolean,
				default: false,
			},
      onlyMonth:{
        type: Boolean,
        default: false,
      }
		},
		data() {
			return {
				left: '<',
				right: '>',
				
				monthSwitch: false,
				
				systemDate: {
					weekRange: '',
					weekToday: true,
					weekDetail: '',
					
					dayRange: '',
					dayToday: true,
					dayDetail: '',
					
					selectDateArr: []
				},
				minDate: "",
			}
		},
		methods: {
			
			handleWeekSelect(params) {
				let {type, detail, isToday} = params;
				console.log("week-date:",params);
				if(type == 'date') {
					// console.log('中转站', JSON.parse(JSON.stringify(detail)))
					this.systemDate.weekDetail = detail;
				} else {
					this.systemDate.weekRange = detail;
				}
				this.systemDate.weekToday = isToday;
				this.systemDate.selectDateArr = params.selectDateArr;
				
				if(type == 'date') this.getPickerResult('emit')
			},
			
			handleDaysSelect(params) {
				console.log("calendar:",params);
				if(params.type == 'date') {
					this.systemDate.dayDetail = params.detail
				} else {
					this.systemDate.dayRange = params.detail
					let obj = {
						range: this.systemDate.dayRange,
						detail: {
							startYear: 0,
							startMonth: 0,
							startDay: 0,
							startDate: "",
							startWeek: "",
							endYear: 0,
							endMonth: 0,
							endDay: 0,
							endDate: "",
							endWeek: ""
						},
						components: 'month'
					}
					this.$emit('change', obj)
				}
				// this.systemDate.dayToday = isToday
				
				if(params.type == 'date') this.getPickerResult('emit')
			},
			
			handleBeforeOne() {
				if(this.monthSwitch) {
					this.$refs['datepicker'].changeMonthHandler(0)
				} else {
					this.$refs['weekpicker'].beforeWeek()
				}
			},
			
			handleNextOne() {
				if(this.monthSwitch) {
					this.$refs['datepicker'].changeMonthHandler(1)
				} else {
					this.$refs['weekpicker'].nextWeek()
				}
			},
			
			backToToday() {
				if(this.monthSwitch) {
					this.$refs['datepicker'].handleShowToday()
				} else {
					this.$refs['weekpicker'].backToToday()
				}
			},
			
			getPickerResult(type = 'get') {
				let obj = {}
				let components = this.monthSwitch?'month':'week'
				if(!this.monthSwitch) {
					obj = {
						range: this.systemDate.weekRange,
						detail: this.systemDate.weekDetail,
						selectDateArr: this.systemDate.selectDateArr,
						components
					}
				} else {
					obj = {
						range: this.systemDate.dayRange,
						detail: this.systemDate.dayDetail,
						components
					}
				}
				if(type == 'get') {
					return obj
				} else {
					this.$emit('change', obj)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.weekDatePicker {
	position: relative;
	width: 100%;
	
	&__header {
		position: relative;
		width: 100%;
		height: 88upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32upx 0 12upx;
		
		.weekDatePicker-switch {
			width: 163upx;
			height: 56upx;
			background: #F5F5F5;
			border-radius: 28upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			
			.switch {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 50%;
				height: 100%;
				font-size: 28upx;
				font-weight: 400;
				line-height: 28upx;
				color: #B2B2B2;
			}
			.active {
				background: #55B8F9;
				opacity: 1;
				border-radius: 28upx;
				color: #FFFFFF;
			}
		}
		
		.weekDatePicker-control {
			font-size: 28upx;
			font-weight: 400;
			color: #202020;
			display: flex;
			flex-direction: row;
			.control {
				color: #B2B2B2;
				padding: 0 20upx;
			}
		}
		
		.weekDatePicker-button {
			display: flex;
			justify-content: flex-end;
			width: 100upx;
		}
	}
	&__content {
		position: relative;
		padding: 12upx 12upx 18upx 12upx;
		width: 100%;
		
		.weekpicker {
			position: relative;
			width: 100%;
			padding: 0 20upx 10upx 20upx;
			margin-bottom: 16upx;
			
			.weekpicker-bg {
				position: absolute;
				top: -12upx;
				left: 0;
				height: 84upx;
				width: 100%;
				background: #FAFAFA;
				border-radius: 50upx 50upx 0upx 0upx;
			}
		}
	}
}
</style>
