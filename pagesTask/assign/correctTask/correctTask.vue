<template>
	<view class="correct-task-container">
		<view class="correct-header">
			<view class="date-time">
				<view class="time-box" @click="showCalendar = true">{{dateTimeStr}}<view class="icon" :class="{'icon-down':showCalendar}"></view></view>
			</view>
			<scroll-view class="class-tabs" scroll-x>
				<view class="class-tab" :class="{'class-tab-active':curTab=='-1'}" @click="changeClass(-1)">全部</view>
				<view v-for="(item,index) in classList" :key="index" class="class-tab" :class="{'class-tab-active':curTab==index}" @click="changeClass(index)">{{item.className}}</view>
			</scroll-view>
		</view>
		<view class="correct-tabs">
			<view class="tab-box" :class="{'tab-box-active':!isCorrected}" @click="changeCorrectStatus(false)">
				<view class="tab-text">
					<view class="status-text">待批改</view>
					<view class="num-text">{{toBeCorrectedCount}}</view>
				</view>
				<view class="tab-img">
					<!-- <u-image height="100%" width="100%" src="../../../static/images/tobe-corrected.png"></u-image> -->
					<image src="../../static/images/tobe-corrected.png" mode="widthFix" class="tobe-img"></image>
				</view>
			</view>
			<view class="tab-box" :class="{'tab-box-active':isCorrected}" @click="changeCorrectStatus(true)">
				<view class="tab-text">
					<view class="status-text">已批改</view>
					<view class="num-text">{{correctedCount}}</view>
				</view>
				<view class="tab-img">
					<!-- <u-image height="100%" width="100%" src="../../../static/images/corrected.png"></u-image> -->
					<image src="../../static/images/corrected.png" mode="widthFix" class="abled-img"></image>
				</view>
			</view>
		</view>
		<view class="correct-search">
			<view class="search-input-box">
				<input type="text" confirm-type="search" @confirm="goSearch()" v-model="studentName" placeholder="输入学生姓名" placeholder-style="color: #DDDDDD;" class="search-input"/>
				<image src="../../static/images/search-icon.png" mode="widthFix" class="search-icon"></image>
			</view>
		</view>
		<view class="correct-content">
			<view class="correct-list" v-for="(item,index) in correctList" :key="index">
				<view class="list-header" @click="goClockDetails(item)">
					<view class="header-avatar">
						<u-image height="100%" width="100%" border-radius="50%" :src="item.avatar"></u-image>
					</view>
					<view class="header-content">
						<view class="student-info">
							<view class="student-name">{{item.studentName}}</view>
							<view class="class-name">{{item.className}}</view>
						</view>
						<view class="date-time">{{item.completionTime?formatCompletionTime(item.completionTime):''}}</view>
					</view>
					<view class="header-img">
						<u-image height="100%" width="100%" border-radius="50%" :src="item.status == 1?'../../static/images/corrected-teacher.png':'../../static/images/tobe-corrected-teacher.png'"></u-image>
					</view>
				</view>
				<view class="task-info">
					<view class="task-list" v-for="(task,j) in item.taskInfos" :key="j">
						<view class="task-name">{{task.name}}</view>
						<view class="clock-text">{{task.clockText}}<view class="comment-btn" v-if="item.comments == null && j == (item.taskInfos.length-1)" @click="showCommentInput(item)"><image src="../../static/images/comment-icon.png" class="comment-icon"/>点评</view></view>
					</view>
				</view>
				<view class="task-comment" v-if="item.comments">
					<view class="comment-box">评语：<label class="comment-text">{{item.comments}}</label></view>
				</view>
			</view>
			<view class="no-data" v-if="correctList.length == 0">
				<image src="../../static/images/no-peclass.png" mode="widthFix" class="none-img"></image>
			</view>
		</view>
		
		<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
		
		<u-calendar v-model="showCalendar"
			mode="date" 
			active-bg-color="#6BA3FF" 
			range-color="#6BA3FF" 
			:safe-area-inset-bottom="true"
			btn-type="default"
			:max-date="yesterday"
			:default-date="dateTime"
			@change="changeSelectTime"></u-calendar>
			
		<u-popup v-model="showCommentPopup" mode="bottom" :closeable="false" :safe-area-inset-bottom="true" length="503">
			<view class="comment-popup-box">
				<view class="comment-input">
					<u-input maxlength="50" :clearable="false" placeholder-style="font-size: 12px;color:#B2B2B2;" v-model="comments" type="textarea" placeholder="请输入对该学生的评语" />
					<view class="conent-size">{{ comments.length }}/50</view>
				</view>
				<view class="comment-btn">
					<view class="btn-box btn-cancel" @click="cancelCommentPopup()">取消</view>
					<view class="btn-box btn-default" @click="confirmCommentPopup()">确定</view>
				</view>
			</view>
		</u-popup>
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
	import {formatNumber} from "../../../common/util.js";
	export default {
		data() {
			return {
				correctedCount: 0,
				toBeCorrectedCount: 0,
				isCorrected: false,
				dateTime: "",
				studentName: "",
				yesterday: "",
				
				correctList: [],
				correctListPages: 0,
				correctItem: {},
				
				showCalendar: false,
				
				showCommentPopup: false,
				
				curTab: -1,
				classId: "",
				
				pageNum: 1,
				pageSize: 5,
				
				scrollTop: 0,
				
				classList: [],
				
				comments: "",
				firstTimeShow: true,
				isRefresh: false,
			}
		},
		onLoad(options) {
			let _this = this;
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				_this.isCorrected = data.isCorrected;
				_this.dateTime = data.dateTime;
				_this.initPageFun();
			})
		},
		computed:{
			...mapState(['xiaotiyunUser']),
			
			dateTimeStr(){
				return this.dateTime.replace(/-/g,'.');
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			let _this = this;
			if(_this.isRefresh){
				_this.initPageFun();
			}
		},
		onHide() {
			this.isRefresh = true;
		},
		onPullDownRefresh() {
			let _this = this;
			_this.initPageFun();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			},0)
		},
		onReachBottom() {
			let _this = this;
			if(_this.pageNum<_this.correctListPages){
				_this.pageNum = _this.pageNum+1;
				if(_this.pageNum>1){
					_this.getCorrectTaskData();
				}
			}
		},
		methods: {
			initPageFun(){
				let _this = this;
				_this.yesterday = _this.getYesterday();
				_this.pageNum = 1;
				_this.getTeacherClass();
				_this.getClockCorrectCount();
				_this.getCorrectTaskData();
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
			
			// 各批阅状态人数统计
			getClockCorrectCount(){
				let _this = this;
				let params = {
					dateTime: _this.dateTime
				}
				if(_this.curTab>=0){
					params.classId = _this.classId;
				}else{
					params.teacherId = _this.xiaotiyunUser.teacher.teacherId;
				}
				postReq(URL.clockCorrectCount,params).then(res => {
					if(res.error == 10000){
						_this.toBeCorrectedCount = res.data.toBeCorrectedCount;
						_this.correctedCount = res.data.correctedCount;
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			getYesterday(){
				let _this = this;
				let nowTime = new Date().getTime();
				let yesterdayTime = nowTime - 24*60*60*1000;
				let date = new Date();
				date.setTime(yesterdayTime);
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				console.log(`${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`)
				return `${year}-${month}-${day}`;
			},
			
			formatCompletionTime(timestamp){
				let date = new Date();
				date.setTime(timestamp);
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				let hour = date.getHours()
				let minute = date.getMinutes()
				
				return  `${year}.${month}.${day}` + ' ' + [hour, minute].map((n) => formatNumber(n)).join(':')
			},
			
			// 获取数据接口
			getCorrectTaskData(){
				let _this = this;
				let params = {
					teacherId: _this.xiaotiyunUser.teacher.teacherId,
					dateTime: _this.dateTime,
					pageNum: _this.pageNum,
					pageSize: _this.pageSize,
					isCorrected: _this.isCorrected,
					classId: _this.classId,
					studentName: _this.studentName,
				}
				postReq(URL.taskCorrect,params).then(res => {
					if(res.error == 10000){
						if(res.data == null){
							_this.correctList = [];
							_this.correctListPages = 0;
						}else{
							let correctList = res.data.content;
							if(params.pageNum!=1){
								_this.correctList = _this.correctList.concat(correctList);
							}else{
								_this.correctList = correctList;
								_this.correctListPages = res.data.lastPage;
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
			
			// 获取年级名称
			getClassContent(i){
				let Class = ["一年级","二年级","三年级","四年级","五年级","六年级","七年级","八年级","九年级","高一","高二","高三"];
				return Class[i-1];
			},
			
			// 点评点击 显示输入框
			showCommentInput(item){
				let _this = this;
				_this.showCommentPopup = true;
				_this.correctItem = item;
				if(_this.firstTimeShow){
					_this.comments = "请输入对该学生的评语";
					setTimeout(() => {
						_this.comments = "";
					},0)
					_this.firstTimeShow = false;
				}
			},
			
			// 切换班级
			changeClass(index){
				let _this = this;
				if(_this.curTab == index) return;
				_this.studentName = "";
				if(index>=0){
					// 单个班级请求
					_this.classId = _this.classList[index].classId;
				}else{
					// 全部请求
					_this.classId = "";
				}
				_this.curTab = index;
				
				_this.pageNum = 1;
				_this.getClockCorrectCount();
				_this.getCorrectTaskData();
			},
			
			// 搜索学生
			goSearch(){
				let _this = this;
				_this.pageNum = 1;
				_this.getCorrectTaskData();
			},
			
			// 切换待批改和已批改
			changeCorrectStatus(isCorrected){
				let _this = this;
				if(_this.isCorrected == isCorrected) return;
				_this.studentName = "";
				_this.isCorrected = isCorrected;
				_this.pageNum = 1;
				_this.getCorrectTaskData();
			},
			
			// 切换时间
			changeSelectTime(e){
				let _this = this;
				console.log(e);
				let dateTime = e.result;
				if(dateTime == _this.dateTime) return;
				_this.dateTime = dateTime;
				_this.pageNum = 1;
				_this.getClockCorrectCount();
				_this.getCorrectTaskData();
			},
			
			cancelCommentPopup(){
				let _this = this;
				_this.showCommentPopup = false;
				_this.comments = 0;
			},
			
			confirmCommentPopup(){
				let _this = this;
				if(!_this.comments){
					return uni.showToast({
						icon: 'none',
						title: '请输入评语',
						duration: 1000,
					})
				}
				let params = {
					id: _this.correctItem.id,
					comments: _this.comments,
					type: 0,
					studentId: _this.correctItem.studentId,
					dateTime: _this.dateTime
				}
				postReq(URL.reviewTask,params).then(res => {
					if(res.error == 10000){
						_this.showCommentPopup = false;
						_this.comments = "";
						uni.showToast({
							icon: 'none',
							title: '评语成功',
							duration: 1000,
						})
						_this.pageNum = 1;
						_this.getClockCorrectCount();
						_this.getCorrectTaskData();
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			goClockDetails(item) {
				let _this = this;
				let params = {
					correctId: item.id,
					dateTime: _this.dateTime,
					studentId: item.studentId,
					isToday: false,
					reviewStatus: item.status,
					type: 0
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

<style lang="less" scoped>
.correct-task-container{
	width: 100%;
	.correct-header{
		width: 100%;
		background-color: #FFFFFF;
		.date-time{
			width: 100%;
			height: 80upx;
			display: flex;
			align-items: center;
			margin-left: 32upx;
			border-bottom: 1upx solid #DEDEDE;
			.time-box{
				display: flex;
				justify-content: center;
				align-items: center;
				height: 37upx;
				line-height: 37upx;
				font-size: 28upx;
				color: #202020;
				.icon{
					width: 0;
					height: 0;
					border-left: 8upx solid transparent;
					border-right: 8upx solid transparent;
					border-top: 8upx solid #B2B2B2;
					margin-left: 10upx;
				}
				.icon-down{
					border: none;
					border-left: 8upx solid transparent;
					border-right: 8upx solid transparent;
					border-bottom: 8upx solid #B2B2B2;
				}
			}
		}
		.class-tabs{
		    width: 100%;
		    height: 88upx;
		    line-height: 88upx;
		    box-sizing: border-box;
		    position: relative;
		    -ms-flex-pack: distribute;
		    justify-content: space-around;
		    -ms-flex-align: center;
		    align-items: center;
		    background: #fff;
		    white-space: nowrap;
		    -webkit-overflow-scrolling: touch;
		    .class-tab{
				-ms-flex: 1;
				flex: 1;
				display: inline-flex;
				padding: 0 21upx;
				// width: 160upx;
				-ms-flex-pack: center;
				justify-content: center;
				-ms-flex-align: center;
				align-items: center;
				text-align: center;
				position: relative;
				box-sizing: border-box;
				font-size: 28upx;
				color: #707070;
				font-weight: 400;
			}
			.class-tab-active{
				color: #202020;
				font-weight: 500;
			}
			.class-tab-active::before{
				position: absolute;
				left: 50%;
				bottom: 0;
				width: 32upx;
				height: 6upx;
				background-color: #24D0A2;
				-webkit-transform: translateX(-50%);
				transform: translateX(-50%);
				content: '';
			}
		}
	}
	.correct-tabs{
		width: 100%;
		margin-top: 16upx;
		padding: 16upx 32upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.tab-box{
			width: 331upx;
			height: 131upx;
			background-color: #B2B2B2;
			border-radius: 28upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.tab-text{
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-left: 40upx;
				.status-text{
					font-size: 24upx;
					color: #FFFFFF;
				}
				.num-text{
					font-size: 56upx;
					color: #FFFFFF;
					margin-top: 8upx;
				}
			}
			.tab-img{
				width: 153upx;
				height: 131upx;
				image.tobe-img{
					width: 153upx;
					height: 131upx;
				}
				image.abled-img{
					width: 146upx;
					height: 131upx;
				}
			}
		}
		.tab-box-active{
			background-color: #6BA3FF;
		}
	}
	.correct-search{
		width: 100%;
		height: 88upx;
		background-color: #FFFFFF;
		padding: 16upx 32upx;
		.search-input-box{
			width: 100%;
			height: 100%;
			padding: 0 14upx;
			background-color: #F5F5F5;
			border-radius: 28upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			overflow: hidden;
			.search-input{
				flex: 1;
				-ms-flex: 1;
				height: 56upx;
				background-color: #F5F5F5;
				font-size: 24upx;
				color: #202020;
				padding: 0 8upx;
			}
			.search-icon{
				width: 32upx;
				height: 32upx;
			}
		}
	}
	.correct-content{
		width: 100%;
		margin-bottom: 32upx;
		.correct-list{
			width: 100%;
			padding: 0 32upx;
			background-color: #FFFFFF;
			margin-top: 16upx;
			.list-header{
				width: 100%;
				height: 136upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1upx solid #DEDEDE;
				.header-avatar{
					width: 88upx;
					height: 88upx;
					border-radius: 50%;
				}
				.header-content{
					flex: 1;
					margin-left: 24rpx;
					.student-info{
						display: flex;
						align-items: center;
						.student-name{
							font-size: 36upx;
							color: #202020;
						}
						.class-name{
							font-size: 20upx;
							color: #FFFFFF;
							padding: 2upx 12upx;
							background-color: #5C8FF7;
							margin-left: 16upx;
							border-radius: 8upx;
						}
					}
					.date-time{
						font-size: 24upx;
						color: #707070;
						margin-top: 9upx;
					}
				}
				.header-img{
					width: 88upx;
					height: 88upx;
					border-radius: 50%;
				}
			}
			.task-info{
				width: 100%;
				padding: 16upx 0;
				.task-list{
					margin-bottom: 16upx;
				}
				.task-name{
					width: 100%;
					font-size: 30upx;
					font-weight: bold;
					color: #202020;
					margin-bottom: 12upx;
				}
				.clock-text{
					width: 100%;
					font-size: 28upx;
					color: #707070;
					line-height: 48upx;
					.comment-btn{
						width: 120upx;
						height: 48upx;
						border-radius: 24upx;
						background-color: #F5F5F5;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 24upx;
						color: #707070;
						float: right;
					}
					.comment-icon{
						width: 24upx;
						height: 26upx;
						margin-right: 4upx;
					}
				}
			}
			.task-comment{
				border-top: 1upx solid #DEDEDE;
				width: 100%;
				padding: 16upx 0;
				.comment-box{
					line-height: 40upx;
					font-size: 28upx;
					color: #202020;
					.comment-text{
						color: #707070;
					}
				}
			}
		}
	}
	.no-data{
		width: 100%;
		height: 560upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.none-img{
			width: 144upx;
		}
	}
}
.comment-popup-box{
	width: 100%;
	padding: 32upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.comment-input{
		width: 654upx;
		height: 246upx;
		background-color: #F9F9F9;
		border-radius: 32upx;
		margin-top: 24upx;
		padding: 16upx 24upx;
		font-size: 24upx;
		color: #202020;
		::v-deep .u-input{
			height: 100%;
		}
		.conent-size{
			font-size: 22upx;
			color: #B2B2B2;
			position: absolute;
			bottom: 17upx;
			right: 24upx;
		}
	}
	.comment-btn{
		width: 100%;
		margin-top: 16upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.btn-box{
			width: 331upx;
			height: 88upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			border-radius: 44upx;
		}
		.btn-cancel{
			color: #FFFFFF;
			background: #B2B2B2;
		}
		.btn-default{
			color: #FFFFFF;
			background: linear-gradient(90deg, #5FC1FF 0%, #21A8FF 100%);
		}
	}
}
</style>
