<template>
    <view class="weekchoose">
        <!-- <li>{{ currentDate }}</li> -->
		<!--  currentDate == item.date -->
        <view :class="['weekchoose__row', { active: formatHasThisDate(item.date) }]" v-for="(item, index) in weekList" :key="index" @click="handleWeekChange(item)">
            <view class="date" :class="{'weekchoose__row__unstart':item.side == 'left' || (item.side == 'today' && !canToday)}">{{ item.fill }}</view>
            <!-- <view class="state warning"></view> -->
            <view class="week" :class="{'weekchoose__row__unstart':item.side == 'left' || (item.side == 'today' && !canToday)}">{{ currentDate == item.date ?'今': `周${item.week}` }}</view>
        </view>
    </view>
</template>

<script>
export default {
    components: {  },
    props: {  },
    data() {
        return {
			// {
			// 	fill: '填充物',
			// 	state: '状态', 			//  success  warning  active
			// 	week: '星期几', 
			// 	date: '这一天的日期',
			//	side: 在今天那边
			//  position: 距离今天那个位置
			// },
			
            weekList: [],

            currentDate: '',			//  今天
			
			selectDate: '',				//	选中了那天
			
			activeQueryWeek: '',		//	当前查到了第几周
			
			currentRange: '',
			
			selectDateArr: [], // 选择的日期
        };
    },
    props: {
        weekStart: {                            //  周开始时间   周日开始  false   周一开始   true
            type: Boolean,
            default: true
        },
		
		maxWeekRoot: {							//	是否允许选则比自己大的月份 超前选择
			type: Boolean,
			default: true,
		},
		
		chooseDate: {
			type: String,
			default: ""
		},
		
		// 是否可以选择今天
		canToday: {
			type: Boolean,
			default: true
		}
    },
    watch: {
        chooseDate: {
			handler(val) {
				setTimeout(() => {
					this.getNow()
					this.getWeekStartEndDate(null, true)
				}, 10);
			}
		}
    },
    computed: {
        formatWeekDesc() {
            return this.weekStart?['一', '二', '三', '四', '五', '六', '日']:['日', '一', '二', '三', '四', '五', '六']
        },
    },
    methods: {
		
		formatHasThisDate(date){
			return Boolean(this.selectDateArr.find(d => d == date));
		},
		
		getNow() {
			let now = new Date()
			this.year = +now.getFullYear()
			this.month = +now.getMonth() + 1
			this.date = +now.getDate()
			
			// console.log(now);
			if(this.chooseDate){
				// console.log(this.chooseDate);
				now = new Date(this.chooseDate);
				// console.log(now);
			}
			// console.log(now);
			let { startDate, endDate } = this.getWeekStartDate(now)
			
			this.currentRange = {
				startMonth: +startDate.getMonth() + 1,
				startTime: +startDate.getDate(),
				endMonth: +endDate.getMonth() + 1,
				endTime: +endDate.getDate(),
			}

			this.currentDate = `${ this.year }-${ this.getMonthStrict(this.month) }-${ this.getMonthStrict(this.date) }`
			this.selectDate = `${ this.year }-${ this.getMonthStrict(this.month) }-${ this.getMonthStrict(this.date) }`
			this.activeQueryWeek = `${ this.year }-${ this.getMonthStrict(this.month) }-${ this.getMonthStrict(this.date) }`
		},
		
		getWeekStartDate(current) {
			// console.log(current);
			let nowDayOfWeek = current.getDay();
			if(!this.weekStart) {
			    nowDayOfWeek += 1
			}else{
				if(nowDayOfWeek == 0){
					nowDayOfWeek = 7;
				}
			}
			const daySecond = 24 * 60 * 60 * 1000;
			let startDate = new Date(current.valueOf() - (nowDayOfWeek - 1) * daySecond);
			let endDate = new Date(new Date(startDate).valueOf() + 6 * daySecond);
			
			return {
				// 拿到开始结束时间
				startDate,
				endDate
			}
		},

        getWeekStartEndDate(date, emitparmas = false) {
            this.weekList = [];
			
			let current;
			
			if(date){
				current = date;
			}else{
				if(this.chooseDate){
					current = new Date(this.chooseDate);
				}else{
					current = new Date();
				}
			}
			
			let { startDate, endDate } = this.getWeekStartDate(current)

            // 拿到开始结束时间
            let startTime = startDate.getDate()
            let endTime = endDate.getDate()
			
            // 起始时间的年 月
            let year = +startDate.getFullYear() 
            let month = +startDate.getMonth() + 1
			
			let endMonth = +endDate.getMonth() + 1
			
			this.$emit('change', {
				type: 'range',
				detail: `${ month }.${ startTime } - ${ endMonth }.${ endTime }`,
				isToday: this.selectDate == this.currentDate,
			})

            // 开始日期大于结束日期这个情况
            if(startTime > endTime) {
                // 拿到开始日期这个月总共几天
                let monthDays = this.getMonthDays(year, month)
                // 这个月占了几天
                let beforeWeekNum = monthDays - startTime
                // 剩余几天
                let surplusWeekNum = 7 - beforeWeekNum

                // 把这个月的结余添加进去
                for(let j = 0; j <= beforeWeekNum; j ++ ) {
                    this.weekList.push(
                        { 
                            fill: startTime + j, 
                            state: '', 
                            week: this.formatWeekDesc[j], 
                            date: `${year}-${this.getMonthStrict(month)}-${this.getMonthStrict(startTime + j)}`, 
							side: '',
							position: 0
                        }
                    )
                }
                // 这就是新的月份了
                for(let k = 1; k < surplusWeekNum; k ++) {
                    this.weekList.push(
                        { 
                            fill: k, 
                            state: '', 
                            week: this.formatWeekDesc[beforeWeekNum + k], 
                            date: `${month>11?year+1:year}-${month>11?1:this.getMonthStrict(month+1)}-${this.getMonthStrict(k)}`, 
							side: '',
							position: 0
                        }
                    )
                }
            } else {
                // 这个就是普通的当月日期
                for(let h = 0; h < 7; h ++ ) {
                    this.weekList.push(
                        { 
                            fill: startTime + h, 
                            state: '', 
                            week: this.formatWeekDesc[h], 
                            date: `${year}-${this.getMonthStrict(month)}-${this.getMonthStrict(startTime + h)}`, 
							side: '',
							position: 0
                        }
                    )
                }
            }
			
			// 区分下那些在左边，那些在右边
			let activeIndex = this.weekList.findIndex(item => item.date === this.currentDate);
			let chooseIndex;
			if(this.chooseDate){
				chooseIndex = this.weekList.findIndex(item => item.date === this.chooseDate)
			}
			if(activeIndex<0){
				if(this.calculateDate(this.currentDate,this.weekList)){
					// 在右边
					this.weekList.forEach((item,index) => {
						item.side = 'left';
					})
				}else{
					// 在左边
					this.weekList.forEach((item,index) => {
						item.side = 'right';
					})
				}
			}else{
				this.weekList.forEach((item, index) => {
					if(index < activeIndex) {
						item.side = 'left'
						item.position = activeIndex - index
					} 
					if(index == activeIndex) {
						item.side = 'today'
						item.position = 0
					}
					if(index > activeIndex) {
						item.side = 'right'
						item.position = index - activeIndex
					}
				})
			}
			
			
			this.activeQueryWeek = `${ current.getFullYear() }-${ this.getMonthStrict(current.getMonth() + 1) }-${ this.getMonthStrict(current.getDate()) }`
			
			this.$nextTick(() => {
				if(emitparmas) {
					this.selectDateArr = [];
					// console.log(this.weekList);
					if(this.chooseDate && chooseIndex>=0){
						this.selectDateArr.push(this.chooseDate);
						// console.log("chooseIndex:",chooseIndex);
						this.handleWeekChange(this.weekList[chooseIndex], true)
					}else{
						// console.log("activeIndex:",activeIndex);
						this.handleWeekChange(this.weekList[activeIndex], true)
					}
					// this.handleWeekChange(this.weekList[activeIndex], true)
				}
			})
			
        },
		
		//日期处理
		initDate(date) {
			let fdate = date.split('-');
			return {
				year: Number(fdate[0] || 1920),
				month: Number(fdate[1] || 1),
				day: Number(fdate[2] || 1)
			}
		},
		
		calculateDate(currentDate,weekList){
			// console.log(currentDate,weekList[0]);
			let current = this.initDate(currentDate);
			let weekFirst = this.initDate(weekList[0].date);
			if(current.year < weekFirst.year){
				return false;
			}else if(current.year > weekFirst.year){
				return true;
			}else{
				if(current.month < weekFirst.month){
					return false;
				}else if(current.month > weekFirst.month){
					return true;
				}else{
					if(current.day < weekFirst.day){
						return false;
					}else if(current.day > weekFirst.day){
						return true;
					}
				}
			}
		},

        getDateStrict(parmas) {
            var date = +parmas.getDate()
            var month = +parmas.getMonth() + 1
            var year = +parmas.getFullYear()
            return `${ year }-${ this.getMonthStrict(month) }-${ this.getMonthStrict(date) }`
        },


        //  得到当前年这个月分有多少天
        getMonthDays(Y, M) {
            let day = new Date(Y, M, 0).getDate() 
            return day;
        },

        //  为了参数补0操作
        getMonthStrict(month) {
			// return (month / 10) >= 1 ? month: `${month}` ;
            return (month / 10) >= 1 ? month: `0${month}` ;
        },


        handleWeekChange(item, type = false) {
			// console.log(item);
			if(item.side == "left" || (item.side == "today" && !this.canToday)) return;
			let queryDateIndex = this.selectDateArr.findIndex(m => m == item.date);
			// console.log(queryDateIndex);
			if(queryDateIndex>=0){
				// 已选择过，去除这天
				if(!type){
					this.selectDateArr.splice(queryDateIndex,1);
				}
			}else{
				this.selectDateArr.push(item.date)
			}
            // this.selectDate = item.date
			// console.log('源头', JSON.parse(JSON.stringify(item)))
			this.$emit('change', {
				type: 'date',
				detail: item,
				selectDateArr: this.selectDateArr,
			})
        },
		
		// backToToday() {
		// 	this.selectDate = JSON.parse((JSON.stringify(this.currentDate)))
		// 	this.getWeekStartEndDate()
		// },
		
		// 根据当前选中的日期向前推个7天
		beforeWeek() {
			let nowWeekDate = new Date(this.activeQueryWeek)
			nowWeekDate.setDate(nowWeekDate.getDate() - 7)
			this.getWeekStartEndDate(nowWeekDate)
		},
		
		// 根据当前选中的日期向后推个7天
		nextWeek() {
			let nowWeekDate = new Date(this.activeQueryWeek)
			nowWeekDate.setDate(nowWeekDate.getDate() + 7)
			let nextDate = +nowWeekDate.getDate()
			let nextMonth = +nowWeekDate.getMonth() + 1
			let nowMonthDays = this.getMonthDays(+nowWeekDate.getFullYear(), nowWeekDate.getMonth() + 1)
			
			if(!this.maxWeekRoot) {
				if(nextMonth == this.currentRange.endMonth && nextDate > this.currentRange.endTime) return
				if(nextMonth > this.currentRange.endMonth && (nextDate + nowMonthDays) > this.currentRange.endTime) return
			}
			this.getWeekStartEndDate(nowWeekDate)
		}
		
    },
    created() {
        this.getNow()
		this.getWeekStartEndDate(null, true)
    },
    mounted() {
        
    },
};
</script>
<style lang="scss" scoped>
.weekchoose {
	width: max-content;
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	
	&__row {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		padding: 13upx 0;
		
		background-color: #FFFFFF;
		box-shadow: 0upx 3upx 6upx rgba(177, 177, 177, 0.16);
		border-radius: 39upx;
		height: 135upx;
		width: 75upx;
		font-size: 22upx;
		margin-right: 30upx;
		
		&:last-child {
			margin: 0;
		}
		
		.date {
			font-size: 37upx;
			font-weight: 600;
			line-height: 52upx;
			color: #202020;
		}
		
		.week {
			font-size: 22upx;
		}
		.weekchoose__row__unstart{
			color: #B2B2B2;
		}
		
		.state {
			width: 9upx;
			height: 9upx;
			border-radius: 50%;
			
			&.success {
				background: #24D0A2;
			}
			
			&.warning {
				background: #FF7A86;
			}
			
			
		}
		
		&.active {
			background: #55B8F9;
			
			.date {
				color: #FFFFFF;
			}
			
			.state {
				background: #FFFFFF;
			}
				
			.week {
				color: #FFFFFF;
			}
		}
	}
}
</style>