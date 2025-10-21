<template>
	<view class="clock-details-container">
		<view class="details-header">
			<view class="header-avatar">
				<u-image height="100%" width="100%" border-radius="50%" :src="clockDetailsData.avatar"></u-image>
			</view>
			<view class="header-content">
				<view class="student-info">
					<view class="student-name">{{clockDetailsData.name}}</view>
					<view class="class-name">
						{{ clockDetailsData.aliasClassName ? clockDetailsData.aliasClassName : clockDetailsData.className}}
					</view>
				</view>
				<view class="date-time">{{clockDetailsData.studentNum}}</view>
			</view>
			<view class="header-complete">{{clockDetailsData.completion==undefined?0:clockDetailsData.completion}}/{{clockDetailsData.totalCount==undefined?0:clockDetailsData.totalCount}}</view>
			<view class="header-img" v-if="!isToday">
				<u-image height="100%" width="100%" border-radius="50%" src="../../static/images/corrected-teacher.png"></u-image>
			</view>
		</view>
		<view class="details-content">
			<view class="title">体育作业</view>
			<view class="task-content" v-for="(task,i) in clockDetailsData.sportTaskInfos" :key="i">
				<view class="header-title" :style="task.taskType == 1?'height:88rpx':'height:32rpx;margin:28rpx 0;'">
					<view class="title-text" v-if="task.taskType == 1">随堂作业</view>
					<view class="title-text-ai" v-if="task.taskType == 2">
						<view class="title-text-left">{{task.name}}AI</view>
						<view class="title-text-right">{{task.calculateType == 1?formatTimeNum(task.num):task.num+"个"}}X{{task.groupNum}}组</view>
					</view>
					<view class="date-time" v-if="task.status == 1">{{task.clockTime?formatClockTime(task.clockTime):''}}</view>
					<view class="scheme-info-tag" v-if="task.status == 0">未完成</view>
				</view>
				<view class="task-info-list">
					<view class="task-info-complete">
						<view class="task-info" v-if="task.taskType == 1">
							<view class="info-title">作业内容：</view>
							<view class="info-content">{{task.taskContent}}</view>
						</view>
						<view class="task-info" v-if="task.clockText">
							<view class="info-title">
								<view class="info-title--left">运动情况：</view>
								<view class="info-title--right" v-if="task.taskType == 2 && task.status == 0"><label>{{task.clockMediaUrls.length}}</label>/{{task.groupNum}}</view>
							</view>
							<view class="info-content">{{task.clockText}}</view>
						</view>
						<view class="task-info" v-if="task.clockMediaUrls && task.taskType == 1">
							<view class="info-title" v-if="task.status == 1">成果展示：</view>
							<view class="info-media" v-if="task.status == 1">
								<view class="media-li" v-for="(img,g) in task.clockMediaUrls.images" :key="g">
									<image :src="img" mode="aspectFit" @click="previewImages(task,g)"></image>
								</view>
								<view class="media-li" v-for="(vid,v) in task.clockMediaUrls.videos" :key="v" v-if="xiaotiyunUser.teacher.isShowVideo">
									<video :src="vid" :id="'taskVideo'+i+v" @play="playVedio" @fullscreenchange="fullscreenchange"></video>
								</view>
							</view>
              <view class="info-tips" v-if="task.clockMediaUrls.commitType == 1">
                <view v-if="task.calculateType == 2">
                  <image class="info-tips-icon" src="../../../static/images/tips.png" mode="aspectFit"></image>提前结束
                </view>
                <view v-if="task.calculateType == 1">
                  <image class="info-tips-icon" src="../../../static/images/tips.png" mode="aspectFit"></image>实际{{task.num}}个
                </view>
              </view>
            </view>
						<view class="task-info" v-if="task.taskType == 2">
							<view class="info-title">成果展示：</view>
							<view class="info-media">
								<view class="media-li-ai" v-for="index of task.groupNum" :key="index">
									<image :src="task.imgUrl" mode="aspectFit" class="ai-img"></image>
									<view class="num-tag">{{task.calculateType == 1?formatTimeNum(task.aiCount):task.aiCount+"个"}}</view>
									<view class="score-text" v-if="task.clockMediaUrls.length >0">
										<view class="score-content" v-if="task.clockMediaUrls[index] != undefined">{{task.calculateType == 1?task.clockMediaUrls[index].aiCount+"个":formatTimeNum(task.clockMediaUrls[index].timeConsume)}}</view>
										<view class="score-content--unfinished" v-if="task.clockMediaUrls[index] == undefined">未完成</view>
									</view>
									<view class="score-text--unfinished" v-else>未完成</view>
								</view>
							</view>
              <view class="info-tips" v-if="task.clockMediaUrls.commitType == 1">
                <view v-if="task.calculateType == 2">
                  <image class="info-tips-icon" src="../../../static/images/tips.png" mode="aspectFit"></image>提前结束
                </view>
                <view v-if="task.calculateType == 1">
                  <image class="info-tips-icon" src="../../../static/images/tips.png" mode="aspectFit"></image>实际{{task.score}}个
                </view>
              </view>
						</view>
					</view>
					<!-- <view class="task-info-uncomplete"></view> -->
				</view>
			</view>
			<view class="scheme-content" v-if="clockDetailsData.sportSchemeInfos.length>0">
				<view class="header-title">
					<view class="title-text">体质改善方案</view>
					<!-- <view class="date-time">{{clockDetailsData.sportSchemeInfos.clockTime}}</view> -->
				</view>
				<view class="scheme-info-list" v-for="(scheme,j) in clockDetailsData.sportSchemeInfos" :key="j">
					<view class="scheme-info-complete" v-if="scheme.status == 1">
						<view class="scheme-info-title">
							<view class="top-info">
								<view class="title-text">{{scheme.actionName}}</view>
								<view class="date-time">{{formatClockTime(scheme.clockTime)}}</view>
							</view>
							<view class="bottom-info">{{scheme.actionGroups}}</view>
						</view>
						<view class="scheme-info">
							<view class="info-title">运动情况：</view>
							<view class="info-content">{{scheme.clockText}}</view>
						</view>
						<view class="scheme-info">
							<view class="info-title">成果展示：</view>
							<view class="info-media">
								<view class="media-li" v-for="(img,g) in scheme.clockMediaUrls.images" :key="g">
									<image :src="img" mode="widthFix" @click="previewImages(scheme,g)"></image>
								</view>
								<view class="media-li" v-for="(vid,v) in scheme.clockMediaUrls.videos" :key="v" v-if="xiaotiyunUser.teacher.isShowVideo">
									<video :src="vid" :id="'schemeVideo'+j+v" @play="playVedio" @fullscreenchange="fullscreenchange"></video>
								</view>
							</view>
						</view>
					</view>
					<view class="scheme-info-uncomplete" v-else>
						<view class="top-info">
							<view class="scheme-info-title">{{scheme.actionName}}</view>
							<view class="scheme-info-tag">未完成</view>
						</view>
						<view class="bottom-info">{{scheme.actionGroups}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="comment-box" v-if="clockDetailsData.comments">评语：{{clockDetailsData.comments}}</view>
		<view class="default-btn" v-if="!isToday && !clockDetailsData.comments" @click="showCommentInput()">点评</view>
		<view class="default-btn" v-if="isToday && clockDetailsData.totalCount!=clockDetailsData.completion" @click="goShowModal()">提醒打卡</view>
		
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
				isToday: true,
				dateTime: "",
				studentId: "",
				clockDetailsData: {
					sportSchemeInfos: [],
					sportTaskInfos: [],
				},
				comments: "",
				firstTimeShow: true,
				showCommentPopup: false,
				
				modalShow: false,
				modalText: "",
				
				reviewStatus: 0,
				type: 0,
			};
		},
		onLoad(options) {
			let _this = this;
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				_this.isToday = data.isToday;
				_this.dateTime = data.dateTime;
				_this.studentId = data.studentId;
				_this.reviewStatus = data.reviewStatus;
				_this.type = data.type;
				_this.correctId = data.correctId;
				_this.initPageFun();
			})
		},
		computed:{
			...mapState(['xiaotiyunUser']),
		},
		methods: {
			initPageFun(){
				let _this = this;
				if(_this.reviewStatus == 0 && !_this.isToday){
					_this.reviewTask();
				}
				let params = {
					studentId: _this.studentId,
					dateTime: _this.dateTime
				}
				postReq(URL.taskClockDetails,params).then(res => {
					if(res.error == 10000){
						let clockDetailsData = res.data;
						if(clockDetailsData.sportTaskInfos == null){
							clockDetailsData.sportTaskInfos = [];
						}
						if(clockDetailsData.sportTaskInfos.length>0){
							clockDetailsData.sportTaskInfos.forEach(function(item){
								if(item.clockMediaUrls == null){
									item.clockMediaUrls = [];
								}
							})
						}
						_this.clockDetailsData = clockDetailsData;
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			previewImages(item,index){
				let _this = this;
				uni.previewImage({
					current: index,
					urls: item.clockMediaUrls.images
				})
			},
			
			formatClockTime(timestamp) {
				let date = new Date();
				date.setTime(timestamp);
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				let hour = date.getHours()
				let minute = date.getMinutes()
			
				return  `${year}.${month}.${day}` + ' ' + [hour, minute].map((n) => this.formatNumber(n)).join(':')
			},
			
			formatNumber(n){
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			
			formatTimeNum(timestamp){
				if(timestamp>=60000){
					if(timestamp%60000 == 0){
						return (timestamp/60000).toFixed(0) + "分钟";
					}
					let sec = timestamp%60000;
					return (timestamp/60000).toFixed(0) + "分钟" + (sec/1000).toFixed(0) + "秒";
				}else{
					return (timestamp/1000).toFixed(0) + "秒";
				}
			},
			
			// 展示评语输入框
			showCommentInput(){
				let _this = this;
				_this.showCommentPopup = true;
				if(_this.firstTimeShow){
					_this.comments = "请输入对该学生的评语";
					setTimeout(() => {
						_this.comments = "";
					},0)
					_this.firstTimeShow = false;
				}
			},
			
			// 关闭评语输入框
			cancelCommentPopup(){
				let _this = this;
				_this.showCommentPopup = false;
				_this.comments = 0;
			},
			
			// 批阅作业
			reviewTask(){
				let _this = this;
				let params = {
					type: _this.type,
					studentId: _this.studentId,
					dateTime: _this.dateTime
				}
				if(_this.type == 0){
					params.id = _this.correctId;
				}else{
					params.teacherId = _this.xiaotiyunUser.teacher.teacherId
				}
				postReq(URL.reviewTask,params).then(res => {
					if(res.error != 10000){
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			// 提交评语
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
					comments: _this.comments,
					type: _this.clockDetailsData.totalCount == _this.clockDetailsData.completion?0:1,
					studentId: _this.studentId,
					dateTime: _this.dateTime,
				}
				if(params.type == 0){
					params.id = _this.correctId;
				}else{
					params.teacherId = _this.xiaotiyunUser.teacher.teacherId
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
						_this.initPageFun();
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			
			playVedio(e){
				console.log(e);
				this.videoContext = uni.createVideoContext(e.currentTarget.id);
				this.videoContext.requestFullScreen();
			},
			fullscreenchange (e){
			   if(!e.detail.fullScreen){
			      this.videoContext.pause();
			   }
			},
			
			goShowModal(){
				let _this = this;
				_this.modalText = `是否提醒${_this.clockDetailsData.name}去打卡？`
				_this.modalShow = true;
			},
			
			commitClockStudent() {
				let _this = this;
				this.modalShow = false;
				let params = {
					studentId: _this.studentId
				};
				// console.log(params);
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
		}
	}
</script>

<style lang="less" scoped>
.clock-details-container{
	width: 100%;
	padding-bottom: 28upx;
	.details-header{
		width: 100%;
		height: 136upx;
		padding: 0 24upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
		.header-avatar{
			width: 88upx;
			height: 88upx;
			border-radius: 50%;
			margin-left: 12upx;
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
		.header-complete{
			font-size: 32upx;
			color: #202020;
			font-weight: bold;
			margin-right: 12upx;
		}
		.header-img{
			width: 88upx;
			height: 88upx;
			border-radius: 50%;
			margin-left: 54upx;
		}
	}
	.details-content{
		width: 702upx;
		background-color: #FFFFFF;
		border-radius: 12upx;
		padding: 6upx;
		margin: 0 auto;
		margin-top: 16upx;
		.title{
			width: 100%;
			font-size: 34upx;
			color: #202020;
			font-weight: 800;
			padding: 0 12upx;
			margin-top: 16upx;
		}
		.task-content{
			width: 100%;
			.header-title{
				width: 100%;
				height: 88upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 12upx;
				.title-text{
					font-size: 30upx;
					color: #202020;
					font-weight: bold;
				}
				.title-text-ai{
					background: linear-gradient(90deg, #FFFFFF 0%, #D3EDFD 47%, #71C4FA 68%, #55B8F9 100%);
					border-radius: 17px;
					display: flex;
					align-items: center;
					padding-right: 16upx;
					.title-text-left{
						font-size: 32upx;
						font-weight: bold;
						color: #202020;
					}
					.title-text-right{
						font-size: 24upx;
						font-weight: 400;
						color: #FFFFFF;
						margin-left: 20px;
					}
				}
				.date-time{
					font-size: 24upx;
					color: #707070;
				}
				.scheme-info-tag{
					height: 32upx;
					line-height: 32upx;
					font-size: 24upx;
					color: #FFFFFF;
					padding: 0 10upx;
					border-radius: 15upx 0 15upx 0;
					background-color: #FF6268;
					white-space: nowrap;
				}
			}
			.task-info-list{
				width: 100%;
				.task-info-complete{
					width: 100%;
					.task-info{
						width: 100%;
						.info-title{
							width: 100%;
							font-size: 28upx;
							color: #202020;
							line-height: 40upx;
							padding: 0 12upx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.info-title--left{
								font-size: 28upx;
								color: #202020;
							}
							.info-title--right{
								font-size: 24upx;
								color: #707070;
								label{
									color: #FF6268;
								}
							}
						}
						.info-content{
							width: 100%;
							font-size: 26upx;
							color: #202020;
							line-height: 37upx;
							margin-top: 8upx;
							margin-bottom: 24upx;
							padding: 0 12upx;
						}
						.info-media{
							width: 100%;
							overflow: hidden;
							.media-li{
								width: 160upx;
								height: 160upx;
								border-radius: 8upx;
								margin: 6upx;
								float: left;
								display: flex;
								align-items: center;
								overflow: hidden;
								border: 1px solid #202020;
								image{
									width: 100%;
								}
								video{
									width: 100%;
									height: 100%;
								}
							}
							.media-li-ai{
								width: 160upx;
								height: 250upx;
								margin: 6upx;
								float: left;
								overflow: hidden;
								position: relative;
								display: flex;
								flex-direction: column;
								justify-items: center;
								align-content: space-between;
								.ai-img{
									width: 160upx;
									height: 160upx;
									border: 1px solid #B2B2B2;
									border-radius: 8upx;
									overflow: hidden;
								}
								.num-tag{
									height: 26upx;
									padding: 0 5upx;
									position: absolute;
									top: 0;
									left: 0;
									border-radius: 8upx 0upx 8upx 0upx;
									background-color: #5C8FF7;
									font-size: 20upx;
									color: #FFFFFF;
									line-height: 26upx;
								}
								.score-text{
									font-size: 28upx;
									font-weight: 400;
									color: #707070;
									margin-top: 8upx;
									.score-content{
										width: 100%;
										text-align: center;
										font-size: 28upx;
										font-weight: 400;
										color: #707070;
									}
									.score-content--unfinished{
										width: 100%;
										color: #FF6268;
										text-align: center;
									}
								}
								.score-text--unfinished{
									width: 100%;
									color: #FF6268;
									text-align: center;
									margin-top: 8upx;
								}
							}
						}
            .info-tips{
              font-size: 24upx;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 38upx;
              color: #EC9131;
              overflow: hidden;
              .info-tips-icon{
                margin: 7upx;
                width: 24upx;
                height: 24upx;
                float: left;
              }
            }
					}
				}
			}
		}
		.scheme-content{
			width: 100%;
			.header-title{
				width: 100%;
				height: 88upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 12upx;
				.title-text{
					font-size: 30upx;
					color: #202020;
					font-weight: bold;
				}
				.date-time{
					font-size: 24upx;
					color: #707070;
				}
			}
			.scheme-info-list{
				width: 100%;
				border-bottom: 1upx solid #DEDEDE;
				.scheme-info-uncomplete{
					width: 100%;
					padding: 12upx;
					display: flex;
					flex-direction: column;
					.top-info{
						width: 100%;
						height: 40upx;
						line-height: 40upx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.scheme-info-title{
							width: 100%;
							font-size: 28upx;
							color: #202020;
						}
						.scheme-info-tag{
							height: 32upx;
							line-height: 32upx;
							font-size: 24upx;
							color: #FFFFFF;
							padding: 0 10upx;
							border-radius: 15upx 0 15upx 0;
							background-color: #FF6268;
							white-space: nowrap;
						}
					}
					.bottom-info{
						font-size: 26upx;
						color: #707070;
						margin-top: 8upx;
					}
				}
				.scheme-info-complete{
					width: 100%;
					padding: 16rpx 0;
					.scheme-info-title{
						width: 100%;
						padding: 0 12upx;
						margin-bottom: 22upx;
						display: flex;
						flex-direction: column;
						.top-info{
							width: 100%;
							font-size: 28upx;
							color: #202020;
							line-height: 40upx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.title-text{
								font-size: 30upx;
								color: #202020;
							}
							.date-time{
								font-size: 24upx;
								color: #707070;
							}
						}
						.bottom-info{
							font-size: 26upx;
							color: #707070;
							margin-top: 8upx;
						}
					}
					.scheme-info{
						width: 100%;
						.info-title{
							width: 100%;
							font-size: 28upx;
							color: #202020;
							line-height: 40upx;
							padding: 0 12upx;
						}
						.info-content{
							width: 100%;
							font-size: 26upx;
							color: #202020;
							line-height: 37upx;
							margin-top: 8upx;
							margin-bottom: 24upx;
							padding: 0 12upx;
						}
						.info-media{
							width: 100%;
							overflow: hidden;
							.media-li{
								width: 160upx;
								height: 160upx;
								margin: 6upx;
								float: left;
								display: flex;
								align-items: center;
								overflow: hidden;
								border: 1px solid #202020;
								image{
									width: 100%;
								}
								video{
									width: 100%;
									height: 100%;
								}
							}
						}
					}
				}
			}
			.scheme-info-list:last-child{
				border: none;
			}
		}
	}
	.comment-box{
		width: 100%;
		padding: 24upx 48upx;
		font-size: 24upx;
		color: #202020;
		line-height: 32upx;
	}
	.default-btn{
		width: 686upx;
		height: 84upx;
		background: linear-gradient(90deg, #70C8FF 0%, #1FA7FF 100%);
		margin: 16upx auto;
		font-size: 28upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 84upx;
		border-radius: 42upx;
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
		position: relative;
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
