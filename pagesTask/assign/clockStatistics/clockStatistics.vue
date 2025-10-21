<template>
	<view class="taskdetail">
		
		<view class="taskdetail-grade">
			<view class="grade-name">{{ xiaotiyunUser.teacher.schoolName }}</view>
			
			<scroll-view scroll-x>
				<view class="grade-tab">
					<view :class="['tab', { active: curTab == -1 }]" @click="handleGradeChange(-1)">
						全部
					</view>
					<view :class="['tab', { active: curTab == index }]" v-for="(item,index) in classList"
						:key="index" @click="handleGradeChange(index)">
						{{item.className}}
					</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="taskdetail-date box">
			<week-date-picker ref="detailpicker" @change="handleDetailPicker" :teacherId="xiaotiyunUser.teacher.teacherId" :apiStatus="3" :classId="classId" :clockStatus="clockStatus" :chooseDate="chooseDate"></week-date-picker>
			
			<view class="table-tab" v-if="isRestStatus != 2">
				<view :class="['tab', { active: activeTab == 1 }]" @click="changeActiveTab(1)">已完成（{{completeCount}}人）</view>
				<view :class="['tab', { active: activeTab == 0 }]" @click="changeActiveTab(0)">未完成（{{unCompleteCount}}人）</view>
				<view :class="['tab', { active: activeTab == 2 }]" @click="changeActiveTab(2)">请假（{{askLeaveCount}}人）</view>
			</view>
		</view>
		
		<view class="taskdetail-table" v-if="isRestStatus != 2">
			<view v-if="activeTab == 0">
				<view class="table-row" v-for="(item, index) in unClockDetailsData" :key="index">
					<view class="row-left" @click="goClockDetails(item)">
						<image class="headpic" :src="item.avatar"></image>
					</view>
					<view class="row-userinfo " @click="goClockDetails(item)">
						<view class="name">
							{{ item.studentName }}
							<view class="progress">{{ item.complete }}</view>
						</view>
						<view class="number">{{ item.studentNumber }}</view>
					</view>
					<!-- <view class="row-progress dfc" @click="goClockDetails(item)">{{ item.complete }}</view> -->
					<view class="row-btn" v-if="detailDate.side == 'today'"><view v-if="formatCompleteStr(item.complete)" @click="goShowModal(item)">提醒打卡</view></view>
					<view class="row-leaver" v-if="detailDate.side == 'left'" @click="goClockDetails(item)">
					<!-- {{item.reviewStatus==1?'已阅':''}} -->
						<image v-if="formatCompleteStr(item.complete)" class="review" :src="item.reviewStatus == 1?'../../static/images/corrected-teacher.png':'../../static/images/tobe-corrected-teacher.png'"></image>
					</view>
				</view>
			</view>
			<view v-if="activeTab == 1">
				<view class="table-row" v-for="(item, index) in clockDetailsData" :key="index" @click="goClockDetails(item)">
					<view class="row-left">
						<image class="headpic" :src="item.avatar"></image>
					</view>
					<view class="row-userinfo ">
						<view class="name">{{ item.studentName }}</view>
						<view class="number">{{ item.studentNumber }}</view>
					</view>
					<view class="row-right" v-if="detailDate.side == 'left'">
						<image class="review" :src="item.reviewStatus == 1?'../../static/images/corrected-teacher.png':'../../static/images/tobe-corrected-teacher.png'"></image>
					</view>
				</view>
			</view>
			<view v-if="activeTab == 2">
				<view class="table-row-leave" v-for="(item, index) in leaveDetailsData" :key="index">
					<view class="leave-row">
						<view class="row-left">
							<image class="headpic" :src="item.avatar"></image>
						</view>
						<view class="row-userinfo ">
							<view class="name">{{ item.studentName }}</view>
							<view class="number">{{ item.studentNumber }}</view>
						</view>
					</view>
					<view class="leave-reason ">请假原因：<label class="reason-text">{{item.askleaveText}}</label></view>
				</view>
			</view>
		</view>
		
		<view class="btn-box-content safe-area-inset-bottom" v-if="activeTab == 0 && detailDate.side == 'today' && isRestStatus != 2">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom" v-if="activeTab == 0 && detailDate.side == 'today' && isRestStatus != 2 && unClockDetailsData.length > 0">
			<view class="task-button"  @click="goShowModal()">
				<image class="remain-icon" src="../../static/images/remind.png"></image>
				<view>一键提醒</view>
			</view>
		</view>
		
		<!-- <view class="task-button" v-if="activeTab == 0 && detailDate.side == 'today' && isRestStatus != 2" @click="modalShow = true">
			<image class="remain-icon" src="../../../static/images/remind.png"></image>
			<view>一键提醒</view>
		</view> -->
		
		<view class="task-rest" v-if="isRestStatus == 2">
			<view class="rest-content">
				<image src="../../static/images/today-rest.png" mode="widthFix" class="rest-img"></image>
				<view class="rest-text">今日休息</view>
			</view>
		</view>
		
		<view class="table-none" v-if="isRestStatus != 2 && ((unClockDetailsData.length == 0 && activeTab == 0) || (clockDetailsData.length == 0 && activeTab == 1) || (leaveDetailsData.length == 0 && activeTab == 2))">
			<image src="../../static/images/no-data.png" mode="widthFix" class="none-img"></image>
		</view>
		<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
		<u-modal show-cancel-button  :show-title="false"  v-model="modalShow" :content="modalText" @confirm="commitClockStudent"></u-modal>
		
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import {getReq,postReq} from "../../../common/request.js";
	import {URL} from "../../../common/url.js";
	export default {
		data() {
			return {
				curTab: -1,
				saveTab: -1,
				clockStatus: 1,
				classId: "",
				isRestStatus: 0,
				scrollTop: 0,
				
				studentId: "",
				
				classList: [],
				
				
				activeTab: 0,
				
				detailDate: {
					activeQuery: '',
					side: 'today',
					week: {
						detail: {}
					},
					month: {
						detail: {}
					}
				},
				
				modalShow: false,
				modalText: "",
				remindType: 0,
				
				pageNum: 1,
				pageSize: 10,
				
				clockDetailsData: [],
				clockDetailsPages: 0,
				unClockDetailsData: [],
				unClockDetailsPages: 0,
				leaveDetailsData: [],
				leaveDetailsPages: 0,
				clockDetailsPageNum: 1,
				unClockDetailsPageNum: 1,
				leaveDetailsPageNum: 1,
				
				unCompleteCount: 0,
				completeCount: 0,
				askLeaveCount: 0,
				
				chooseDate: "",
				isRefresh: false,
				
			};
		},
		computed:{
			...mapState(['xiaotiyunUser']),
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			let _this = this;
			if(_this.activeTab == 1){
				if(_this.clockDetailsPageNum<_this.clockDetailsPages){
					_this.clockDetailsPageNum = _this.clockDetailsPageNum+1
					if(_this.clockDetailsPageNum>1){
						_this.getClockSituationDetails();
					}
				}
			}else if(_this.activeTab == 0){
				if(_this.unClockDetailsPageNum<_this.unClockDetailsPages){
					_this.unClockDetailsPageNum = _this.unClockDetailsPageNum+1;
					if(_this.unClockDetailsPageNum>1){
						_this.getClockSituationDetails();
					}
				}
			}else if(_this.activeTab == 2){
				if(_this.leaveDetailsPageNum<_this.leaveDetailsPages){
					_this.leaveDetailsPageNum = _this.leaveDetailsPageNum+1;
					if(_this.leaveDetailsPageNum>1){
						_this.getClockSituationDetails();
					}
				}
			}
		},
		onLoad(options) {
			let _this = this;
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				if(data.classId){
					_this.clockStatus = 2;
					_this.classId = data.classId;
					// console.log(_this.classId);
				}else{
					_this.clockStatus = 1;
				}
				if(data.activeTab>-1){
					_this.activeTab = data.activeTab;
				}
				// console.log(data);
				_this.chooseDate = data.dateTime;
				_this.initPageFun();
			})
		},
		onShow() {
			let _this = this;
			if(_this.isRefresh){
				// _this.initPageFun();
				_this.clockDetailsPageNum = 1;
				_this.unClockDetailsPageNum = 1;
				_this.leaveDetailsPageNum = 1;
				_this.getClockSituationDetails();
				_this.getClockStatusCount();
			}
		},
		onHide() {
			this.isRefresh = true;
		},
		onPullDownRefresh() {
			let _this = this;
			_this.clockDetailsPageNum = 1;
			_this.unClockDetailsPageNum = 1;
			_this.leaveDetailsPageNum = 1;
			_this.getClockSituationDetails();
			_this.getClockStatusCount();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			},0)
		},
		methods: {
			initPageFun(){
				let _this = this;
				_this.getTeacherClass();
			},
			
			// 教师管理的班级
			getTeacherClass(){
				let _this = this;
				let params = {
					teacherId: _this.xiaotiyunUser.teacher.teacherId
				}
				postReq(URL.classManage,params).then(res => {
					if(res.error == 10000){
						if(res.data){
							_this.classList = res.data;
							if(_this.classId){
								_this.curTab = _this.classList.findIndex(cla => cla.classId == _this.classId)
							}else{
								_this.curTab = -1;
							}
						}else{
							_this.classList = [];
						}
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			// 各打卡状态人数统计
			getClockStatusCount(){
				let _this = this;
				let params = {
					dateTime: _this.dateTime
				}
				if(_this.curTab>=0){
					params.classId = _this.classId;
				}else{
					params.teacherId = _this.xiaotiyunUser.teacher.teacherId;
				}
				postReq(URL.clockStatusCount,params).then(res => {
					if(res.error == 10000){
						_this.unCompleteCount = res.data.unCompleteCount;
						_this.completeCount = res.data.completeCount;
						_this.askLeaveCount = res.data.askLeaveCount;
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			
			getClassContent(i){
				let Class = ["一年级","二年级","三年级","四年级","五年级","六年级","七年级","八年级","九年级","高一","高二","高三"];
				return Class[i-1];
			},
			
			handleGradeChange(index)  {
				if(index>=0){
					// 单个班级请求
					this.clockStatus = 2;
					this.classId = this.classList[index].classId;
				}else{
					// 全部请求
					this.clockStatus = 1;
					this.classId = "";
				}
				this.curTab = index;
			},
			
			changeActiveTab(tab){
				let _this = this;
				_this.activeTab = tab;
				if(_this.activeTab == 1 && _this.clockDetailsPageNum == 1){
					_this.getClockSituationDetails();
				}else if(_this.activeTab == 0 && _this.unClockDetailsPageNum == 1){
					_this.getClockSituationDetails();
				}else if(_this.activeTab == 2 && _this.leaveDetailsPageNum == 1){
					_this.getClockSituationDetails();
				}
			},
			
			goShowModal(item){
				let _this = this;
				if(item == null){
					_this.remindType = 0;
					_this.studentId = "";
					_this.modalText = `是否提醒所有未打卡学生，共${_this.unCompleteCount}人？每日最多一键提醒三次。`;
				}else{
					_this.remindType = 1;
					_this.studentId = item.studentId;
					_this.modalText = `是否提醒${item.studentName}去打卡？`
				}
				_this.modalShow = true;
			},
			
			
			handleDetailPicker(params) {
				console.log("clockStatistics:",params);
				let { components, detail } = params
				this.detailDate.side = detail?.side;
				this.detailDate.activeQuery = components;
				this.isRestStatus = params.status;
				Object.assign( this.detailDate[components], detail);
				if(this.isRestStatus != 2){
					if(this.dateTime != detail.date || this.saveTab != this.curTab){
						this.dateTime = detail.date;
						this.saveTab = this.curTab;
						this.clockDetailsPageNum = 1;
						this.unClockDetailsPageNum = 1;
						this.leaveDetailsPageNum = 1;
						this.getClockSituationDetails();
						this.getClockStatusCount();
					}
				}
			},
			
			getClockSituationDetails(){
				let _this = this;
				let params = {
					dateTime: _this.dateTime,
					type: _this.activeTab,
					pageSize: _this.pageSize,
				}
				if(_this.clockStatus == 1){
					params.teacherId = _this.xiaotiyunUser.teacher.teacherId;
				}else{
					params.classId = _this.classId;
				}
				if(_this.activeTab == 1){
					params.pageNum = _this.clockDetailsPageNum;
				}else if(_this.activeTab == 0){
					params.pageNum = _this.unClockDetailsPageNum;
				}else{
					params.pageNum = _this.leaveDetailsPageNum;
				}
				postReq(URL.clockSituationDetails,params).then(res => {
					if(res.error == 10000){
						if(_this.activeTab == 1){
							if(res.data == null){
								_this.clockDetailsData = [];
								_this.clockDetailsPages = 0;
							}else{
								let clockDetailsData = res.data.content;
								if(params.pageNum!=1){
									_this.clockDetailsData = _this.clockDetailsData.concat(clockDetailsData);
								}else{
									_this.clockDetailsData = clockDetailsData;
									_this.clockDetailsPages = res.data.lastPage;
								}
							}
						}else if(_this.activeTab == 0){
							if(res.data == null){
								_this.unClockDetailsData = [];
								_this.unClockDetailsPages = 0;
							}else{
								let unClockDetailsData = res.data.content;
								if(params.pageNum!=1){
									_this.unClockDetailsData = _this.unClockDetailsData.concat(unClockDetailsData);
								}else{
									_this.unClockDetailsData = unClockDetailsData;
									_this.unClockDetailsPages = res.data.lastPage;
								}
							}
						}else if(_this.activeTab == 2){
							if(res.data == null){
								_this.leaveDetailsData = [];
								_this.leaveDetailsPages = 0;
							}else{
								let leaveDetailsData = res.data.content;
								if(params.pageNum!=1){
									_this.leaveDetailsData = _this.leaveDetailsData.concat(leaveDetailsData);
								}else{
									_this.leaveDetailsData = leaveDetailsData;
									_this.leaveDetailsPages = res.data.lastPage;
								}
							}
						}
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			
			commitClockStudent() {
				let _this = this;
				this.modalShow = false;
				let params = {};
				if(_this.remindType == 0){
					if(_this.curTab >= 0){
						params.classId = _this.classId;
					}else{
						params.teacherId = _this.xiaotiyunUser.teacher.teacherId;
					}
				}else if(_this.remindType == 1){
					params.studentId = _this.studentId;
				}
				console.log(params);
				postReq(URL.clockRemind,params).then(res => {
					if(res.error == 10000){
						uni.showToast({
							icon: 'none',
							title: '提醒成功！',
							duration: 1000
						})
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			formatCompleteStr(complete){
				let _this = this;
				let arr = complete.split('/');
				if(arr[1] == 0){
					return false;
				}
				return true;
			},
			
			goClockDetails(item) {
				let _this = this;
				if(_this.activeTab == 0 && !_this.formatCompleteStr(item.complete)) return;
				let params = {
					dateTime: _this.dateTime,
					studentId: item.studentId,
					isToday: _this.detailDate.side == 'today',
					reviewStatus: item.reviewStatus==1?1:0,
					type: _this.activeTab == 0?1:0,
					correctId: item.id,
				}
				uni.navigateTo({
					url: "/pages/home/clockDetails/clockDetails",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	
.taskdetail {
	width: 100%;
	position: relative;
	padding: 0 24upx 24upx 24upx;
	background: #FAFAFA;
	
	.dfc {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.box {
		background: #FFFFFF;
		box-shadow: 0upx 4upx 10upx rgba(0, 0, 0, 0.04);
		border-radius: 12upx;
		margin-top: 20upx;
	}
	
	.taskdetail-grade {
		position: relative;
		width: 100%;
		
		.grade-name {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 64upx;
			width: 100%;
			font-size: 28upx;
			font-weight: 500;
			color: #707070;
		}
		
		.grade-tab {
			position: relative;
			height: 68upx;
			padding: 10upx 0;
			width: max-content;
			// padding-top: 10upx;
			
			.tab {
				position: relative;
				font-size: 24upx;
				font-weight: bold;
				padding: 2upx 20upx;
				height: 48upx;
				background: #CDCDCD;
				opacity: 1;
				border-radius: 28upx;
				line-height: 48upx;
				text-align: center;
				margin-right: 16upx;
				color: #FFFFFF;
				float: left;
				
				&.active {
					background: linear-gradient(90deg, #9AD8FF 0%, #1BA2FB 100%);
					
					// &::before {
					// 	content: '';                 
					// 	position: absolute;        
					// 	bottom: -20upx;
					// 	background: #24D0A2;       
					// 	width: 28upx;
					// 	left: calc((100% - 16upx) / 2);
					// 	height: 6upx;
					// 	border-radius: 50upx;
					// }
				}
			}
		}
	}
	
	.taskdetail-date {
		position: relative;
		margin-top: 6upx;
		.table-tab {
			position: relative;
			display: flex;
			height: 92upx;
			border-top: solid 4upx #F5F5F5;
		}
		
		.tab {
			position: relative;
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			color: #B2B2B2;
			white-space: nowrap;
			font-size: 28upx;
			
			&.active {
				color: #202020;
				
				&::before {
					content: '';                 
					position: absolute;        
					bottom: 0upx;
					background: #24D0A2;       
					width: 20upx;
					left: calc((100% - 16upx) / 2);
					height: 6upx;
					border-radius: 50upx;
				}
			}
		}
	}
	
	.taskdetail-table {
		position: relative;
		width: 100%;
		box-shadow: 0upx 4upx 10upx rgba(0, 0, 0, 0.04);
		border-radius: 12upx;
		margin-top: 20upx;
		overflow: hidden;
		.table-row {
			width: 100%;
			height: 120upx;
			padding: 14upx 37upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			border-top: solid 2upx rgba(0, 0, 0, 0.04);
			background: #FFFFFF;
			&:first-child {
				border: 0;
			}
		}
		
		.row-left {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			width: 120upx;
			
			.headpic {
				width: 88upx;
				height: 88upx;
				border-radius: 50%;
			}
		}
		
		.row-userinfo {
			width: calc((100% - 120upx) / 4);
			height: 100%;
			color: #707070;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			
			.name {
				width: 100%;
				height: 60%;
				font-size: 28upx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.progress{
					font-size: 28rpx;
					font-weight: 400;
					color: #202020;
				}
			}
			
			.number {
				height: 40%;
				font-size: 22upx;
				font-weight: 400;
				display: flex;
				align-items: center;
			}
		}
		.review{
			width: 88upx;
			height: 88upx;
		}
		
		$width: calc((100% - 120upx) / 5);
		
		.row-leaver {
			width: $width;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-size: 28upx;
			font-weight: bold;
			color: #707070;
			flex: 1;
		}
		
		.row-btn {
			width: $width;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-size: 28upx;
			font-weight: bold;
			color: #5C8FF7;
			flex: 1;
		}
		
		.row-progress {
			width: $width;
			font-size: 28upx;
			font-weight: 400;
			color: #202020;
			flex: 1;
		}
		
		.table-row-leave{
			width: 100%;
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;
			margin-bottom: 8upx;
			border-radius: 12upx;
			&:last-child {
				margin-bottom: 0;
			}
			.leave-row {
				width: 629upx;
				height: 120upx;
				padding: 14upx 0;
				margin: 0 auto;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				border-bottom: solid 2upx rgba(0, 0, 0, 0.04);
			}
			.leave-reason{
				width: 100%;
				padding: 24upx 37upx;
				font-size: 28upx;
				line-height: 40upx;
				color: #707070;
				.reason-text{
					color: #202020;
				}
			}
		}
	}
	
	.btn-box-content{
		width: 100%;
		// padding: 32upx;
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);  
		.default-content{
			height: 88upx;
			padding: 32upx 0;
			box-sizing: content-box;
			.btn-content{
				width: 100%;
				height: 88upx;
			}
		}
	}
	.bottom-btn-box{
		background-color: #FFFFFF;
		box-shadow: 0px -2px 8px 0px rgba(0,0,0,0.08);
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn-content{
			width: 100%;
			height: 88upx;
			padding: 32upx 0;
			box-sizing: content-box;
		}
		.action-btn{
			width: 686upx;
			height: 88upx;
			background-color: #24D0A2;
			border: none;
			border-radius: 12upx;
			font-size: 28upx;
			line-height: 88upx;
		}
		.action-btn-leave{
			background-color: #B2B2B2;
		}
		.action-btn-not-clock{
			background-color: #FF7A86;
		}
		.active{
			background-color: #26BF96;
		}
	}
	
	.task-button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		opacity: 1;
		border-radius: 40upx;
		color: #FFFFFF;
		width: 686upx;
		background: linear-gradient(270deg, #0D9FFF 0%, #78CBFF 100%);
		margin: 20upx 0;
		.remain-icon {
			width: 30upx;
			height: 24upx;
			margin-right: 14upx;
		}
	}
	
	.task-rest{
		width: 100%;
		height: 560upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.rest-content{
			position: relative;
			width: 144upx;
			height: 216upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.rest-img{
				width: 144upx;
				height: 144upx;
			}
			.rest-text{
				font-size: 32upx;
				color: #B2B2B2;
			}
		}
	}
	
	
	.table-none{
		width: 100%;
		height: 560upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.none-img{
			width: 250upx;
		}
	}
}
</style>
