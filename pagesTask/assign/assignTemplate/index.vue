<template>
	<view class="basic-container">
		<view class="u-padding-top-30 u-padding-left-40 u-padding-right-40" style="background-color: #fff;">
			<view class="u-margin-bottom-26 u-font-28">
				布置班级
			</view>
			<view class="u-flex u-flex-wrap">
				<block v-for="item in urlOption.classList" :key="item.classId">
					<view class="classItem">
						{{ item.aliasClassName ? item.aliasClassName : item.className}}
					</view>
				</block>
			</view>
		</view>
		<view style="padding-bottom: 200rpx;">
			<u-gap height="30" bg-color="#F4F4F4"></u-gap>
			<view class="assgin-content">
				<view class="assgin-header">
					<view class="">
						设置课件周期
					</view>
				</view>
				<view class="assgin-main" @click="calendarShow = true">
					<view class="u-flex u-row-between">
						<view class="">
							开始时间
						</view>
						<view class="">
							{{dateRange[0] || "请选择"}}
						</view>
					</view>
					<view class="divider"></view>
					<view class="u-flex u-row-between">
						<view class="">
							结束时间
						</view>
						<view class="">
							{{dateRange[1] || "请选择"}}
						</view>
					</view>
				</view>
			</view>
			<u-gap height="30" bg-color="#F4F4F4"></u-gap>
			<view class="assgin-content">
				<view class="assgin-header">
					<view class="">
						设置每周的天数
					</view>
					<view class="assgin-header-sub">
						每周：{{checkedDay.length || 0}}天
					</view>
				</view>
				<view class="assgin-main u-flex u-row-between">
					<block v-for="item in weekDays" :key="item.label">
						<view class="weekDay" :class="{'is-active':item.checked}" @click="checkWeekDay(item)">
							<text>周</text>
							<text>{{item.label}}</text>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="assgin-footer">
			<u-button shape="circle" type="primary" :custom-style="customStyle" @click="handleSumbit">确认布置
			</u-button>
		</view>
		<u-calendar v-model="calendarShow" mode="range" :safe-area-inset-bottom="true" max-date="2030-12-31"
			:min-date="$u.timeFormat(new Date(), 'yyyy-mm-dd')" @change="bindCalendarChange"></u-calendar>
		<u-modal v-model="modalShow" :show-cancel-button="true" @cancel="modalShow = false"
			@confirm="confirm(value ? true:false)" ref="uModal" :async-close="true">
			<view class="u-padding-40">
				<view class="u-font-28 u-margin-bottom-16">
					班级中已存在作业，请选择布置方式
				</view>
				<u-radio-group v-model="value" :wrap="true" size="28">
					<u-radio :name="0">不替换，再添加作业</u-radio>
					<u-radio :name="1">替换原有作业</u-radio>
				</u-radio-group>
			</view>
		</u-modal>
	</view>
</template>

<script>
	let that = null
	import {
		URL
	} from "@/common/url.js";
	import {
		postReq
	} from "@/common/request.js";
	export default {
		data() {
			return {
				customStyle: {
					fontSize: "34rpx",
					padding: '18rpx 84rpx'
				},
				urlOption: {},
				calendarShow: false,
				dateRange: [],
				weekDays: [{
					label: '一',
					value: 1,
					checked: false
				}, {
					label: '二',
					value: 2,
					checked: false
				}, {
					label: '三',
					value: 3,
					checked: false
				}, {
					label: '四',
					value: 4,
					checked: false
				}, {
					label: '五',
					value: 5,
					checked: false
				}, {
					label: '六',
					value: 6,
					checked: false
				}, {
					label: '日',
					value: 7,
					checked: false
				}],
				modalShow: false,
				value: 0
			}
		},
		computed: {
			checkedDay() {
				return this.weekDays.filter(item => {
					return item.checked
				})
			}
		},
		onLoad(e) {
			that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('params', function(data) {
				that.urlOption = data
			})
		},
		mounted() {},
		methods: {
			bindCalendarChange(e) {
				this.dateRange = [e.startDate, e.endDate]
			},
			checkWeekDay(data) {
				data.checked = !data.checked
			},
			async confirm(replace) {
				try {
					const weekNum = this.checkedDay.map(item => item.value)
					let taskDetails = []
					this.urlOption.taskDetails.forEach(item => {
						const dataSource = JSON.parse(JSON.stringify(item))
						if (dataSource.categoryId === 3) {
							const {
								$index,
								actionGroup,
								categoryId,
								difficulty,
								standardNum,
								...params
							} = dataSource
							taskDetails.push(params)
						} else {
							const {
								$index,
								actionGroup,
								categoryId,
								...params
							} = dataSource
							taskDetails.push(params)
						}
					})

					const params = {
						assignDates: this.getWeek(this.dateRange[0], this.dateRange[1], weekNum),
						classIds: this.urlOption.classList.map(item => item.classId),
						replace,
						taskDetails,
						templateId: this.urlOption.templateId
					}
					const result = await postReq(URL.apiPostTemplateAssign, {
						...params
					})
					if (result.error === 10000) {
						this.$u.route({
							type: "navigateBack",
							delta: 2
						})
					} else {
						uni.hideToast();
						uni.showToast({
							duration: 2000,
							"icon": "none",
							"title": '请稍后再试',
						});
					}
				} catch (e) {
					uni.hideToast();
					uni.showToast({
						duration: 2000,
						"icon": "none",
						"title": '请稍后再试',
					});
				} finally {
					this.modalShow = false
				}
			},
			handleSumbit() {
				if (!this.dateRange || !this.dateRange.length) {
					uni.hideToast();
					uni.showToast({
						duration: 2000,
						"icon": "none",
						"title": '请先选择日期',
					});
					return
				}
				if (this.urlOption.replace) {
					this.modalShow = true
				} else {
					this.confirm(false)
				}
			},
			/* 获取时间段内属于星期(*)的日期们
			 * begin: 开始时间
			 * end：结束时间
			 * weeks：星期几 number[]
			 */
			getWeek(begin, end, weeks) {
				var dateArr = new Array();
				var stimeArr = begin.split("-"); //=>["2018", "01", "01"]
				var etimeArr = end.split("-"); //=>["2018", "01", "30"]

				var stoday = new Date();
				stoday.setUTCFullYear(stimeArr[0], stimeArr[1] - 1, stimeArr[2]);
				var etoday = new Date();
				etoday.setUTCFullYear(etimeArr[0], etimeArr[1] - 1, etimeArr[2]);

				var unixDb = stoday.getTime(); //开始时间的毫秒数
				var unixDe = etoday.getTime(); //结束时间的毫秒数

				for (var k = unixDb; k <= unixDe;) {
					let needJudgeDate = this.msToDate(parseInt(k)).withoutTime;
					//不加这个if判断直接push的话就是已知时间段内的所有日期
					for (var i = 0; i < weeks.length; i++) {
						if (new Date(needJudgeDate).getDay() === weeks[i]) {
							dateArr.push(needJudgeDate);
						}
					}
					k = k + 24 * 60 * 60 * 1000;
				}
				return dateArr;
			},

			//根据毫秒数获取日期
			msToDate(msec) {
				let datetime = new Date(msec);
				let year = datetime.getFullYear();
				let month = datetime.getMonth();
				let date = datetime.getDate();
				let hour = datetime.getHours();
				let minute = datetime.getMinutes();
				let second = datetime.getSeconds();

				let result1 = year +
					'-' +
					((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
					'-' +
					((date + 1) < 10 ? '0' + date : date) +
					' ' +
					((hour + 1) < 10 ? '0' + hour : hour) +
					':' +
					((minute + 1) < 10 ? '0' + minute : minute) +
					':' +
					((second + 1) < 10 ? '0' + second : second)

				let result2 = year +
					'-' +
					((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
					'-' +
					((date + 1) < 11 ? '0' + date : date)

				let result = {
					hasTime: result1,
					withoutTime: result2
				};

				return result
			}
		}
	}
</script>

<style scoped lang="scss">
	.assgin-content {
		padding: 30rpx 24rpx;
		background-color: #fff;
	}

	.assgin-header {
		display: flex;
		align-items: center;
		font-size: 34rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #202020;
		line-height: 48rpx;
		margin-bottom: 20rpx;

		&-sub {
			font-size: 28rpx;
			font-weight: normal;
			margin-left: 20rpx;
		}
	}

	.assgin-main {
		box-sizing: border-box;
		background: #F2F2F2;
		border-radius: 24rpx;
		padding: 30rpx;
	}

	.divider {
		width: 100%;
		height: 1rpx;
		margin: 30rpx 0;
		border: 2rpx solid #8F8F8F;
	}

	.weekDay {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		width: 84rpx;
		height: 138rpx;
		background: #FFFFFF;
		border-radius: 48rpx;
		border: 2rpx solid #5C8FF7;
	}

	.is-active {
		background: #5C8FF7;
		color: #fff;
	}

	.assgin-footer {
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 180rpx;
		background: #FFFFFF;
		box-shadow: 0px -3rpx 54rpx 0px rgba(208, 208, 208, 0.5000);

		&-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 308rpx;
			height: 84rpx;
			border-radius: 48rpx;
			font-size: 34rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #fff;
			background: #5C8FF7;
		}
	}

	.classItem {
		padding: 6rpx 14rpx;
		margin-bottom: 30rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 40rpx;
		color: #FFFFFF;
		background: #5C8FF7;
		border-radius: 26rpx;
	}

	.classItem+.classItem {
		margin-left: 30rpx;
	}
</style>
