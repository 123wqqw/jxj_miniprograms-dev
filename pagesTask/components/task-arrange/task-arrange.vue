<template>
	<view class="taskarrange">
		<view class="task-correct box">
			<!-- <week-date-picker ref="arrangepicker" @change="handleArrangePickerChange" :teacherId="teacherId" :apiStatus="2"></week-date-picker> -->
			<xWeekDateCalendar ref="arrangepicker" @selected-change="datechange" @days-change="daysChange"
				:calendarStateList="calendarStateList"></xWeekDateCalendar>
		</view>
		<view class="task-division">
			<view class="on-left dfc" style="margin-left: 30upx;">
				<view>{{ $t('common.classText') }}列表</view>
				<view></view>
			</view>
			<!-- <view class="on-right dfc" @click="goClassManage" style="margin-right: 30upx;">
				<image class="setting" src="../../static/images/setting.png"></image>
				<view>管理</view>
			</view> -->
		</view>

		<view style="padding: 0 32upx; margin-bottom: 120upx;"
			v-if="arrangeDate.side === 'right' || (arrangeDate.side == 'today')">
			<view class="checkAll">
				<u-checkbox @change="checkboxChangeAll" v-model="allChecked" :disabled="allCheckDisbaled">
					{{ $t('common.allChoose') }}
				</u-checkbox>
			</view>
			<view class="task-grade box" v-for="(item, index) in assignInfoData" :key="index">
				<view class="box-header">
					<view class="header-left">
						<!-- <u-image height="32" width="32" style="margin-right: 16upx" src="/static/images/class-icon.png"></u-image> -->
						<view style="margin-right: -20upx;"
							v-if="arrangeDate.side === 'right' || (arrangeDate.side == 'today')">
							<u-checkbox v-model="item.checked" @change="checkAll(item)" size="35"
								:disabled="item.disabled">{{ item.gradeName }} ( {{ item.assignedClassCount }} /
								{{ item.classCount }} )
							</u-checkbox>
						</view>

					</view>
					<!-- <view class="header-right" @click.native="handleShowChildren(item,index)">
						<view v-if="item.open"><text class="checkItemText">收起</text><image src="../../static/images/jtbz.png" mode="" class="checkItemImg"></image></view>
						<view v-else><text class="checkItemText">{{showText}}</text><image src="../../static/images/jtbz2.png" mode="" class="checkItemImg"></image></view>
					</view> -->
				</view>
				<!-- <view class="box-content" v-show="item.open"> -->
				<view class="box-content">
					<u-checkbox-group @change="checkboxGroupChange(item)">
						<u-checkbox v-for="(child, childIndex) in item.classList" checkboxClass="border_botton"
							:key="childIndex" :disabled="child.assignStatus == 2" v-model="child.checked">
							<view class="grade-row dfcb">
								<view class="name">
									{{ child.aliasClassName ? child.aliasClassName : child.className }}
								</view>
								<view :class="['state', { active: child.assignStatus == 0 }]"
									@click="goAssignTaskInfo(child)">
									<view>{{ stateDesc[child.assignStatus] }}<text v-if="child.assignStatus == 1">{{
											child.taskCount + '项'
									}}</text></view>
									<image class="state-right" v-if="child.assignStatus == 1"
										src="/static/images/common/arrow-black.png"></image>
								</view>
							</view>
						</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
		</view>

		<view v-if="arrangeDate.side === 'left'">
			<view class="task-grade box" v-for="(item, index) in assignInfoData" :key="index">
				<view class="box-header">
					<view class="header-left" @click.native="handleShowChildren(item, index)">
						<u-image height="32" width="32" style="margin-right: 16upx"
							src="/pagesTask/static/images/class-icon.png"></u-image>
						{{ item.gradeName }} ( {{ item.assignedClassCount }} / {{ item.classCount }} )
					</view>
					<!-- 					<view class="header-right" @click.native="handleShowChildren(item,index)">
						<view v-if="item.open"><text class="checkItemText">收起</text><image src="../../static/images/jtbz.png" mode="" class="checkItemImg"></image></view>
						<view v-else><text class="checkItemText">{{showText}}</text><image src="../../static/images/jtbz2.png" mode="" class="checkItemImg"></image></view>
					</view>
	 -->
				</view>
				<!-- <view class="box-content" v-show="item.open"> -->
				<view class="box-content">
					<view class="default-content" v-for="(child, childIndex) in item.classList" :key="childIndex">
						<view class="name">{{ child.className }}</view>
						<view class="state" @click="goAssignTaskInfo(child)">
							<view>{{ stateDesc[child.assignStatus] }}<text v-if="child.assignStatus == 1">{{
									child.taskCount + '项'
							}}</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="task-divider" v-if="arrangeDate.side == 'today'">
			<u-divider fontSize="24" bg-color="transparent" color="#B2B2B2">请在当天18点前完成布置</u-divider>
		</view> -->


		<!-- 	<view class="task-button remind" :class="[{disabled: isBtnDisabled}]" v-if="arrangeDate.side == 'today' && assignInfoData.isBeforeTime" @click="jumpToHomeWorkPage()">
			<image class="remain-icon" src="https://gxapp-images.oss-cn-hangzhou.aliyuncs.com/xiaotiyun-images/minprogram/minipro-icon/teacherTask/addtask.png"></image>
			<view>布置作业</view>
		</view> -->

		<view class="btn-box-content safe-area-inset-bottom"
			v-if="arrangeDate.side === 'right' || arrangeDate.side == 'today'">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom"
			v-if="arrangeDate.side === 'right' || arrangeDate.side == 'today'">
			<view class="btn-content">
				<u-button class="u-flex-1 u-padding-left-20 u-padding-right-10" type="primary" shape="circle" :custom-style="operationBtnStyle" :disabled="isBtnDisabled"  @click="clearTask">
					<u-icon name="trash" color="#fff" size="28" label="撤回布置" label-size="32" label-color="#fff"
						margin-left="10"></u-icon>
				</u-button>
				<u-button class="u-flex-1 u-padding-left-10 u-padding-right-20" type="primary" shape="circle" :custom-style="operationBtnStyle" :disabled="isBtnDisabled" @click="jumpToHomeWorkPage">
					<u-icon name="plus" color="#fff" size="28" :label="$t('task.assign.index.title')"
						label-size="32" label-color="#fff" margin-left="10"></u-icon>
				</u-button>
			</view>
		</view>
		<u-modal show-cancel-button :show-title="false" v-model="modalShow" :content="modalContent"
			@confirm="deleteTask"></u-modal>
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
	import xWeekDateCalendar from "../x-week-date-calendar/x-week-date-calendar3.vue";
	export default {
		components: {
			xWeekDateCalendar
		},
		props: {
			teacherId: {
				type: String,
				default: "",
			}
		},
		data() {
			return {
				operationBtnStyle: {
					height: "84rpx",
					padding: "18rpx 0",
					fontWeight: 600,
				},
				calendarStateList: [],
				allChecked: false,
				allCheckDisbaled: false,
				modalShow: false,
				modalContent: this.$t('task.assign.index.modalContent'),

				assignInfoData: {},

				stateDesc: {
					0: '未布置',
					1: '已布置',
					2: '休息'
				},

				gradeList: [{
						grade: '七年级',
						checked: true,
						open: true,
						checkedList: ['1'],
						children: [{
								id: '1',
								name: '一班',
								tasked: 0,
								checked: true
							},
							{
								id: '2',
								name: '二班',
								tasked: 1,
								checked: false
							},
							{
								id: '3',
								name: '三班',
								tasked: 2,
								checked: false
							},
						]
					},
					{
						grade: '八年级',
						checked: false,
						open: false,
						checkedList: [],
						children: [{
								id: '4',
								name: '一班',
								tasked: 0,
								checked: false
							},
							{
								id: '5',
								name: '二班',
								tasked: 1,
								checked: false
							},
							{
								id: '6',
								name: '三班',
								tasked: 2,
								checked: false
							},
						]
					},
					{
						grade: '九年级',
						checked: false,
						open: false,
						checkedList: [],
						children: [{
								id: '7',
								name: '一班',
								tasked: 0,
								checked: false
							},
							{
								id: '8',
								name: '二班',
								tasked: 1,
								checked: false
							},
							{
								id: '9',
								name: '三班',
								tasked: 2,
								checked: false
							},
						]
					},
				],

				queryList: {
					allCheckClass: 9,
					checkedClass: []
				},
				isBtnDisabled: true,

				arrangeDate: {
					activeQuery: '',
					side: '',
					week: {
						detail: {}
					},
					month: {
						detail: {}
					}
				},
				dateTime: "",

				isFirstTime: true,

				canToday: false,
				dateObj: {}, //接收初始化日期返回值

				//国际化
				showText: this.$t('common.show'),
				warningText: this.$t('task.assign.index.warningText'),
				noChooseClass: this.$t('task.assign.index.noChooseClass'),
				deleteTaskSuccess: this.$t('task.assign.index.noChooseClass'),
			}
		},
		methods: {
			// 每次初始化日期触发 请求作业布置日历接口
			daysChange(e) {
				this.dateObj = e
				this.postDateObj()
			},
			// 作业布置日历
			postDateObj() {
				let params = {
					teacherId: this.teacherId,
					beginDate: this.formatDate(this.dateObj.start),
					endDate: this.formatDate(this.dateObj.end)
				}
				postReq(URL.taskPublishCalendar, params).then(res => {
					// console.log(res);
					if (res.error == 10000) {
						// console.log(res.data)
						this.calendarStateList = res.data
					}
				})
			},
			// 全选当天作业
			checkboxChangeAll() {
				let _this = this
				_this.assignInfoData = (_this.assignInfoData || []).map(function(item) {
					return {
						...item,
						checked: item.disabled ? item.checked : !_this.allChecked,
						classList: (item.classList || []).map(function(items) {
							return {
								...items,
								checked: items.assignStatus == 2 ? items.checked : !_this.allChecked
							}
						})
					}
				})
				let allList = []
				for (let i = 0; i < _this.assignInfoData.length; i++) {
					// console.log(_this.assignInfoData[i])
					allList = allList.concat(_this.assignInfoData[i].classList || [])
				}
				this.queryList.checkedClass = allList.filter(current => current.checked).map(yes => {
					return {
						classId: yes.classId,
						className: yes.className
					}
				});
				this.allCheckDisbaled = allList.filter(item => {
					return item.assignStatus != 2
				}).length == 0; // 不是休息的
				this.isBtnDisabled = this.queryList.checkedClass.length == 0;
				if (!this.isBtnDisabled) {
					this.modalContent = `是否清空${this.queryList.checkedClass.length}${_this.warningText}？`;
				}
				if (!this.allCheckDisbaled) {
					this.allChecked = !this.allChecked;
				}
			},
			handleShowChildren(current, index) {
				// console.log(current);
				let open = !current.open;
				this.$delete(this.assignInfoData[index], 'open');
				this.$set(this.assignInfoData[index], 'open', open);
			},

			checkboxGroupChange(item) {
				item.checkedList = item.classList.filter(current => current.checked).map(yes => {
					return {
						classId: yes.classId,
						className: yes.className
					}
				});
				let numList = [];
				if (this.arrangeDate.side == 'right' || this.arrangeDate.side == 'today') {
					numList = item.classList.filter(some => some.assignStatus != 2).map(current => current.classId);
				} else {
					numList = item.classList.filter(some => some.assignStatus == 0).map(current => current.classId);
				}
				item.checked = Boolean(item.checkedList.length == numList.length);
				this.handleComputedCheckedClass()
			},

			checkAll(item) {
				item.checkedList = item.checked ? [] : item.classList.filter(some => some.assignStatus != 2).map(
					current => {
						return {
							classId: current.classId,
							className: current.className
						}
					});
				// console.log(item.checkedList);
				item.classList.filter(some => some.assignStatus != 2).map(current => current.checked = !item.checked)
				item.checked = !item.checked
				this.handleComputedCheckedClass()
			},

			handleComputedCheckedClass() {
				this.queryList.checkedClass = [];
				let gradeCheckList = [],
					canCheckClassList = [];
				this.assignInfoData.forEach(item => {
					let checkClassList = item.classList.filter(cla => {
						return cla.checked && item.assignStatus != 2
					});
					this.queryList.checkedClass = this.queryList.checkedClass.concat(checkClassList);
					canCheckClassList = canCheckClassList.concat(item.classList)
					if (item.checked) {
						gradeCheckList.push(item);
					}
				})
				this.allCheckDisbaled = canCheckClassList.filter(item => {
					return item.assignStatus != 2
				}).length == 0;
				this.isBtnDisabled = this.queryList.checkedClass.length == 0;
				if (!this.isBtnDisabled) {
					this.modalContent = `是否清空${this.queryList.checkedClass.length}${this.warningText}？`;
				}
				if (!this.allCheckDisbaled) {
					this.allChecked = gradeCheckList.length == this.assignInfoData.length;
				}
			},
			formatDate(now) {
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var date = now.getDate();
				return year + "-" + this.formatNumber(month) + "-" + this.formatNumber(date);
			},
			formatNumber(n) {
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			// 选择日期
			datechange(e) {
				console.log(e, 33)
				let aa = new Date()
				this.dateTime = e.fullDate;
				if (new Date(e.fullDate).getTime() - new Date(this.formatDate(aa)).getTime() < 0) {
					// console.log('left')
					this.arrangeDate.side = 'left'
				}
				if (new Date(e.fullDate).getTime() - new Date(this.formatDate(aa)).getTime() == 0) {
					// console.log('today')
					this.arrangeDate.side = 'today'
				}
				if (new Date(e.fullDate).getTime() - new Date(this.formatDate(aa)).getTime() > 0) {
					// console.log('right',this.arrangeDate.side)
					this.arrangeDate.side = 'right'
				}
				// this.arrangeDate.side = e.fullDate == this.formatDate(aa)? 'today' || '';
				this.getAssignInfo();
				// this.selectedDate = e.fullDate;
				// this.getTaskClockStatistics(e.fullDate);
			},
			// 选择日期
			// handleArrangePickerChange(params) {
			// console.log(32,params);
			// let { components, detail } = params
			// this.arrangeDate.side = detail?.side || 'today';
			// // this.arrangeDate.activeQuery = components;
			// this.dateTime = detail.date;
			// Object.assign( this.arrangeDate[components], detail);
			// this.getAssignInfo();
			// },
			handleInit() {
				let aa = new Date()
				this.$refs['arrangepicker'].selectedDate = this.formatDate(aa);
				this.dateTime = this.formatDate(aa);
				this.arrangeDate.side = 'today';
				this.allChecked = false;
				this.getAssignInfo();
			},

			clearTask() {
				let classList = this.queryList.checkedClass;
				if (classList.length == 0) {
					return uni.showToast({
						icon: 'none',
						title: this.noChooseClass,
						duration: 1000
					})
				}

				let {
					assignDates,
					dateTime
				} = this;

				let params = {
					classList,
					assignDates,
					dateTime
				}
				uni.navigateTo({
					url: '/pagesTask/assign/assignTask/clearTask',
					success: (res) => {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},

			getAssignInfo() {
				let _this = this;
				let params = {
					teacherId: _this.teacherId,
					queryDate: _this.dateTime
				}
				_this.assignInfoData = [];
				getReq(URL.assignInfo, params).then(res => {
					if (res.error == 10000) {
						_this.assignInfoData = res.data;
						// this.postDateObj(_this.dateObj);
						// _this.assignInfoData.isBeforeTime = _this.beyondTime(_this.assignInfoData.nowTime);
						if ((_this.arrangeDate.side == 'today') || this.arrangeDate.side == 'right') {
							if ((_this.arrangeDate.side == 'today')) {
								let addProps = {
									checked: false,
									open: false,
									checkedList: [],
								}
								_this.assignInfoData.forEach(function(item, index) {
									let num = 0;
									item.classList.forEach(function(child, index) {
										child.checked = false;
										// 休息 不让选择了
										if (child.assignStatus == 2) {
											num++;
										}
									});
									if (num == item.classList.length) {
										item.disabled = true;
									} else {
										item.disabled = false;
									}
									Object.assign(item, addProps);
								})
								if (_this.isFirstTime) {
									_this.isFirstTime = false;
									let gradeList = _this.assignInfoData.map(item => item.disabled == true);
									_this.canToday == ((gradeList.length == 0 && _this.assignInfoData.length >
										0) || _this.assignInfoData.length == 0);
									// console.log(_this.canToday);
								}
							}
							if (this.arrangeDate.side == 'right') {
								let addProps = {
									checked: false,
									open: false,
									checkedList: [],
								}
								_this.assignInfoData.forEach(function(item, index) {
									let num = 0;
									item.classList.forEach(function(child, index) {
										child.checked = false;
										// 休息和已布置 不让选择了
										if (child.assignStatus == 2) {
											num++;
										}
									});
									if (num == item.classList.length) {
										item.disabled = true;
									} else {
										item.disabled = false;
									}
									Object.assign(item, addProps);
								})
							}
							// 选择日期后 重新计算按钮状态
							_this.handleComputedCheckedClass();
						} else {
							let addProps = {
								open: false
							}
							_this.assignInfoData.forEach(function(item, index) {
								Object.assign(item, addProps);
							})
						}
						// console.log(_this.assignInfoData);
					}
				})
			},

			jumpToHomeWorkPage() {
				if (this.isBtnDisabled) return;
				//是否选中已布置的班级
				const checkList = this.assignInfoData.map(item => item.classList).flat()
				const replace = checkList.some((item) => {
					return item.checked && item.assignStatus == 1
				})
				const params = {
					replace,
					classList: this.queryList.checkedClass,
					canToday: this.assignInfoData.isBeforeTime && this.canToday,
					chooseDate: this.dateTime
				}
				uni.navigateTo({
					url: '/pagesTask/assign/selectAssign/index',
					success: function(res) {
						res.eventChannel.emit('assignBasicData', params)
					}
				})
			},
			goAssignTaskInfo(child) {
				let _this = this;
				if (child.assignStatus != 1) return;
				let params = {
					classInfo: {
						classId: child.classId,
						className: child.className,
						aliasClassName: child.aliasClassName
					},
					dateTime: _this.dateTime
				}
				// console.log(params);
				uni.navigateTo({
					url: "/pagesTask/assign/assignTaskInfo/assignTaskInfo",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			// 清空作业布置
			deleteTask() {
				let _this = this;
				if (_this.queryList.checkedClass.length == 0) {
					return uni.showToast({
						icon: 'none',
						title: _this.noChooseClass,
						duration: 1000
					})
				}
				let params = {
					teacherId: _this.teacherId,
					dateTime: _this.dateTime,
					classIds: _this.queryList.checkedClass.map(some => some.classId)
				}
				postReq(URL.cleanupTask, params).then(res => {
					if (res.error == 10000) {
						uni.showToast({
							icon: 'success',
							title: _this.deleteTaskSuccess,
							duration: 1000
						})
						_this.getAssignInfo(_this.dateTime);
						// _this.handleInit();
					}
				})
			},


			goClassManage() {
				uni.navigateTo({
					url: '/pagesMine/mine/classManage/classManage'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.taskarrange {
		position: relative;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		min-height: 1000upx;
		height: auto !important;

		.dfc {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.dfcb {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: row;
		}

		.box {
			background: #FFFFFF;
			box-shadow: 0upx 4upx 10upx rgba(0, 0, 0, 0.04);
			border-radius: 12upx;
			margin-bottom: 20upx;
			// height: 88upx;

			.box-header {
				height: 88upx;
				width: 100%;
				display: flex;
				align-items: center;
				flex-direction: row;
				justify-content: space-between;
			}
		}

		.task-correct {
			position: relative;
			width: 100%;
		}

		.task-division {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			font-size: 28upx;
			font-weight: 400;
			color: #707070;
			margin: 16upx 0;

			.setting {
				height: 28upx;
				width: 28upx;
				margin-right: 14upx;
			}
		}

		.checkAll {
			line-height: 88upx;
			height: 88upx;
			// width: 750upx;
			border-bottom: 1upx solid #E6E6E6;
			background: #FFFFFF;
			padding-left: 32upx;
			box-sizing: border-box;

			::v-deep .u-checkbox {
				width: 100%;
			}
		}

		.task-grade {
			position: relative;

			.box-header {
				padding: 0 12upx 0 32upx;
				font-size: 28upx;
				font-weight: 400;
				color: #202020;
				border-bottom: solid 1upx #DDDDDD;

				.header-left {
					flex-grow: 1;
					height: 100%;
					display: flex;
					align-items: center;
				}

				.header-right {
					margin-right: 32upx;

					.checkItemImg {
						width: 25upx;
						height: 25upx;
						margin-left: 7upx;
					}
				}
			}

			.box-content {
				padding: 24upx 36upx;
				margin-left: 42upx;

				.grade-row {
					width: 540upx;
					padding: 14upx 0;

					.name {
						font-size: 28upx;
						font-weight: 400;
						color: #202020;
					}

					.state {
						font-size: 28upx;
						font-weight: 400;
						color: #707070;
						display: flex;
						align-items: center;
						flex-direction: row;
						text-align: right;
						// width: 120upx;
						// margin-right: -20upx;

						&.active {
							color: #5C8FF7;
						}

						.state-right {
							width: 13upx;
							height: 24upx;
							margin-left: 20upx;
						}
					}
				}

				.default-content {
					width: 100%;
					margin: 14upx 0;
					height: 56upx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.name {
						font-size: 28upx;
						font-weight: 400;
						color: #202020;
					}

					.state {
						font-size: 28upx;
						font-weight: 400;
						color: #707070;
					}
				}

			}

			.hidden {
				display: none;
			}
		}

		.task-divider {
			margin: 40upx 0 15upx 0;
		}

		.task-button {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 80upx;
			line-height: 80upx;
			opacity: 1;
			border-radius: 40upx;
			color: #FFFFFF;


			&.remind {
				width: 686upx;
				background: linear-gradient(270deg, #0D9FFF 0%, #78CBFF 100%);
			}

			&.disabled {
				width: 686upx;
				background: #B2B2B2;
			}

			&.addtask {
				width: 331upx;
				// background: linear-gradient(270deg, #0D9FFF 0%, #78CBFF 100%);
				background: #5C8FF7;
			}

			&.cleartask {
				width: 331upx;
				// background: linear-gradient(270deg, #8889FF 0%, #C3C4FF 100%);
				background: #5C8FF7;
			}

			&.clear {
				width: 331upx;
				background: #B2B2B2;
			}

			.remain-icon {
				width: 30upx;
				height: 30upx;
				margin-right: 14upx;
			}

			.addtask-icon {
				width: 28upx;
				height: 28upx;
				margin-right: 14upx;
			}

			.clear-icon {
				width: 22upx;
				height: 22upx;
				margin-right: 14upx;
			}
		}

		.btn-box-content {
			width: 100%;
			display: block;
			// padding: 32upx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.default-content {
				height: 88upx;
				padding: 32rpx 0;
				box-sizing: content-box;

				.btn-content {
					display: flex;
					align-items: center;
					padding: 0 20rpx;
					margin: 20rpx 0;
				}
			}
		}

		.bottom-btn-box {
			background-color: #FFFFFF;
			box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			.btn-content {
				width: 100%;
				height: 88upx;
				padding: 32upx 0;
				display: flex;
				align-items: center;
				justify-content: space-around;
				box-sizing: content-box;
			}

			.action-btn {
				width: 320upx;
				height: 88upx;
				background-color: #5C8FF7;
				border: none;
				border-radius: 44upx;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 88upx;
			}

			.action-btn-big {
				width: 638upx;
				margin: 0 auto;
			}

			.active {
				background-color: #5276f7;
			}
		}
	}
</style>
