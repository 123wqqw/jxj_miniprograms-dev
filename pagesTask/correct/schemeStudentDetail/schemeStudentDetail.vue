<template>
	<view class="student-detail-container">
		<view class="scheme-header">
			<x-week-date-calendar @selected-change="datechange" :checkedDate="dateTime" :showRightIcon="false"></x-week-date-calendar>
		</view>
		<view class="student-task-content">
			<view class="student-content">
				<view class="student-info">
					<image class="avatar" :src="clockDetailsData.avatar" mode="aspectFill"></image>
					<view class="info-content">
						<view class="top">
							<view class="name">{{clockDetailsData.studentName}}</view>
							<view class="class-name">{{clockDetailsData.className}}</view>
							<view class="task-count" v-if="clockDetailsData.totalCount">{{clockDetailsData.completeCount==undefined?0:clockDetailsData.completeCount}}/{{clockDetailsData.totalCount==undefined?0:clockDetailsData.totalCount}}</view>
							<!-- <view class="task-status" v-if="clockDetailsData.status == 6">已补交</view> -->
						</view>
						<view class="bottom">{{clockDetailsData.studentNumber}}</view>
					</view>
				</view>
			</view>
			<view class="task-info"  v-if="clockDetailsData.schemeInfos.length>0">
				<view class="scheme-task" v-if="clockDetailsData.schemeInfos.length>0">
					<view class="title">{{$t('task.correct.studentTaskDetail.physicalFactorScheme')}}</view>
					<view class="task-list">
						<view class="task-li" v-for="(scheme,index) in clockDetailsData.schemeInfos" :key="index">
							<view class="li-title">
								<view class="action-info">
									<view class="name">{{scheme.actionName}}</view>
								</view>
								<view class="time" v-if="scheme.status != 0 && scheme.status != 3">{{scheme.status == 6?`（${$t('task.correct.classStatistics.makeUpClock')}）`:""}}{{scheme.clockTime?formatClockTime(scheme.clockTime):''}}</view>
								<view class="info-tag" v-if="scheme.status == 0 || scheme.status == 3">未完成</view>
							</view>
							<view class="sport-content">
								<!-- <view class="content-title">运动内容：</view> -->
								<view class="content-info">{{scheme.actionGroups}}</view>
							</view>
							<view class="sport-content" v-if="scheme.status != 0 && scheme.status != 3">
								<view class="content-title">{{$t('common.sport')}}情况：</view>
								<view class="content-info">{{scheme.clockText}}</view>
							</view>
							<view class="media-content" v-if="scheme.status != 0 && scheme.status != 3">
								<view class="content-title">成果展示：</view>
								<view class="content-info">
									<view class="media-li" v-for="(img,g) in scheme.clockMediaUrls.images" :key="g">
										<image :src="img" mode="widthFix" @click="previewImages(scheme,g)"></image>
									</view>
									<view class="media-li" v-for="(vid,v) in scheme.clockMediaUrls.videos" :key="v" v-if="xiaotiyunUser.teacher.isShowVideo">
										<video :src="vid" :id="'schemeVideo'+j+v" @play="playVedio" @fullscreenchange="fullscreenchange"></video>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="no-data" v-if="clockDetailsData.schemeInfos.length==0">
				<view class="warning-box">
					<image src="../../static/images/nullFianco.png" mode="aspectFill" class="no-data-icon"></image>
					<text>方案未生成</text>
				</view> 
			</view>
			<view class="btn-box-content safe-area-inset-bottom" v-if="studentIds.length>1">
				<view class="default-content">
					<view class="btn-content">
						<view class="top" v-if="studentIds.length>1"></view>
					</view>
				</view>
			</view>
			<view class="btn-box-content bottom-btn-box safe-area-inset-bottom" v-if="studentIds.length>1">
				<view class="btn-content">
					<view class="top" v-if="studentIds.length>1">
						<button class="action-btn action-btn--border" type="primary" hover-class="active" @click="preStudent">上一位</button>
						<button class="action-btn" type="primary" hover-class="active" @click="nextStudent">下一位</button>
					</view>
				</view>
			</view>
		</view>
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
	import xWeekDateCalendar from "../../components/x-week-date-calendar/x-week-date-calendar.vue";
	export default {
		components: {
			xWeekDateCalendar
		},
		data() {
			return {
				studentId: "",
				studentIds: [],
				dateTime: "",
				clockDetailsData: {
					schemeInfos: [],
				},
			}
		},
		onLoad(options) {
			let _this = this;
			uni.setNavigationBarTitle({
				title: this.$t('task.correct.schemeStudentDetail.title')
			})
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				_this.dateTime = data.dateTime;
				_this.studentId = data.studentId;
				_this.studentIds = data.studentIds;
				_this.initPageFun();
			})
		},
		computed:{
			...mapState(['xiaotiyunUser','commentModelList']),
		},
		methods: {
			initPageFun(){
				let _this = this;
				let params = {
					studentId: _this.studentId,
					dateTime: _this.dateTime
				}
				getReq(URL.schemeStudentDetail,params).then(res => {
					if(res.error == 10000){
						_this.clockDetailsData = res.data;
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			datechange(e) {
				this.dateTime = e.fullDate;
			    this.initPageFun();
			},
			preStudent(){
				let _this = this;
				let index = _this.studentIds.findIndex(item => item==_this.studentId);
				if(index==0){
					_this.studentId = _this.studentIds[_this.studentIds.length-1];
				}else{
					_this.studentId = _this.studentIds[index-1];
				}
				_this.initPageFun();
			},
			nextStudent(){
				let _this = this;
				let index = _this.studentIds.findIndex(item => item==_this.studentId);
				if(index>=(_this.studentIds.length-1)){
					_this.studentId = _this.studentIds[0];
				}else{
					_this.studentId = _this.studentIds[index+1];
				}
				_this.initPageFun();
			},
			formatClockTime(timestamp) {
				let date = new Date();
				date.setTime(timestamp);
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				let hour = date.getHours()
				let minute = date.getMinutes()
			
				return  `${month}月${day}日` + ' ' + [hour, minute].map((n) => this.formatNumber(n)).join(':')
			},
			formatNumber(n){
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			// 预览图片
			previewImages(item,index){
				let _this = this;
				uni.previewImage({
					current: index,
					urls: item.clockMediaUrls.images
				})
			},
			// 播放视频
			playVedio(e){
				this.videoContext = uni.createVideoContext(e.currentTarget.id);
				this.videoContext.requestFullScreen();
			},
			fullscreenchange (e){
			   if(!e.detail.fullScreen){
			      this.videoContext.pause();
			   }
			},
		}
	}
</script>

<style lang="scss" scoped>
.student-detail-container{
	width: 100%;
	.scheme-header{
		width: 100%;
	}
	.student-task-content{
		width: 100%;
		padding: 16upx 24upx 0 24upx;
		margin-top: 16upx;
		background-color: #FAFAFA;
		.student-content{
			width: 100%;
			background-color: #FFFFFF;
		}
		.student-info{
			width: calc(100% - 48upx);
			height: 136upx;
			display: flex;
			align-items: center;
			margin: 0 auto;
			border-bottom: 2upx solid #E6E6E6;
			.avatar{
				width: 88upx;
				height: 88upx;
				border-radius: 50%;
				margin-right: 24upx;
			}
			.info-content{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.top{
					width: 100%;
					height: 40upx;
					display: flex;
					align-items: center;
					.name{
						font-size: 28upx;
						line-height: 40upx;
						font-weight: 500;
						color: #202020;
						margin-right: 16upx;
					}
					.class-name{
						padding: 0 14upx;
						height: 38upx;
						line-height: 38upx;
						font-size: 20upx;
						font-weight: 400;
						color: #FFFFFF;
						background-color: #5C8FF7;
						border-radius: 8upx;
						margin-right: 16upx;
					}
					.task-count{
						font-size: 28upx;
						line-height: 40upx;
						font-weight: 500;
						color: #202020;
						margin-right: 16upx;
					}
					.task-status{
						font-size: 28upx;
						font-weight: 400;
						color: #5C8FF7;
						line-height: 40upx;
					}
				}
				.bottom{
					font-size: 24upx;
					font-weight: 400;
					color: #B2B2B2;
					margin-top: 24upx;
				}
			}
		}
		.task-info{
			width: 100%;
			background-color: #FFFFFF;
			padding-bottom: 24upx;
			border-bottom: 1upx solid #E6E6E6;
			.teacher-task{
				position: relative;
				width: 100%;
			}
			.scheme-task{
				width: 100%;
			}
			.title{
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				font-size: 30upx;
				font-weight: 500;
				color: #202020;
				padding: 0 24upx;
			}
			.task-list{
				width: 100%;
				.task-li{
					width: 100%;
					margin-bottom: 16upx;
					.li-title{
						width: 100%;
						height: 38upx;
						padding: 0 24upx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.action-info{
							display: flex;
							align-items: center;
							.name{
								font-size: 28upx;
								line-height: 38upx;
								font-weight: 500;
								color: #202020;
							}
							.group{
								height: 38upx;
								padding: 0 18upx;
								border-radius: 8upx;
								font-size: 20upx;
								font-weight: 400;
								color: #FFFFFF;
								margin-left: 16upx;
								background-color: #5C8FF7;
								line-height: 38rpx;
							}
						}
						.time{
							font-size: 28upx;
							line-height: 38upx;
							font-weight: 400;
							color: #202020;
						}
						.info-tag{
							font-size: 28upx;
							line-height: 38upx;
							font-weight: 500;
							color: #FF7A86;
						}
					}
					.sport-content{
						width: 100%;
						display: flex;
						flex-direction: column;
						margin-top: 16upx;
						padding: 0 24upx;
						.content-title{
							width: 100%;
							font-size: 28upx;
							font-weight: 400;
							color: #707070;
							line-height: 38upx;
							margin-bottom: 8upx;
						}
						.content-info{
							width: 100%;
							font-size: 28upx;
							font-weight: 400;
							color: #202020;
							line-height: 38upx;
						}
					}
					.media-content{
						width: 100%;
						padding: 0 19upx;
						margin-top: 16rpx;
						.content-title{
							width: 100%;
							font-size: 28upx;
							color: #202020;
							line-height: 40upx;
							padding: 0 5upx;
						}
						.content-info{
							width: 100%;
							overflow: hidden;
							.media-li{
								width: 156upx;
								height: 156upx;
								border-radius: 8upx;
								margin: 6upx 5upx;
								float: left;
								display: flex;
								align-items: center;
								overflow: hidden;
								border: 1upx solid #202020;
								image{
									width: 100%;
								}
								video{
									width: 100%;
									height: 100%;
								}
							}
							.media-li-ai{
								width: 156upx;
								height: 208upx;
								margin: 6upx 5upx;
								float: left;
								overflow: hidden;
								position: relative;
								display: flex;
								flex-direction: column;
								justify-items: center;
								align-content: space-between;
								.ai-video{
									width: 156upx;
									height: 156upx;
									border: 1px solid #B2B2B2;
									border-radius: 8upx;
									overflow: hidden;
									position: relative;
									video{
										width: 100%;
										height: 100%;
									}
									.leave-box{
										padding: 0 10upx 0 20upx;
										height: 34upx;
										position: absolute;
										top: 0;
										right: 0;
										background: linear-gradient(131deg, #5C98F7 0%, #81B0FE 100%);
										border-radius: 0upx 0upx 0upx 32upx;
										font-size: 16upx;
										font-weight: 500;
										color: #FFFFFF;
										line-height: 34upx;
										z-index: 1;
									}
									.excell{
										background: linear-gradient(131deg, #5C98F7 0%, #81B0FE 100%);
									}
									.good{
										background: linear-gradient(131deg, #0BD1A8 0%, #27DEB8 100%);
									}
									.pass{
										background: linear-gradient(131deg, #FF9E50 0%, #FFC394 100%);
									}
									.no-pass{
										background: linear-gradient(131deg, #F86174 0%, #FF959F 100%);
									}
									.over-standard{
										background: #5C98F7;
									}
									.under-standard{
										background: #EC9131;
									}
								}
								.score-content{
									width: 100%;
									text-align: center;
									font-size: 28upx;
									font-weight: 400;
									color: #707070;
									margin-top: 8upx;
								}
							}
						}
					}
				}
			}
		}
	}
	.no-data{
		width: 100%;
		height: auto;
		display: flex;
		justify-content: center;
		background-color: #FAFAFA;
		.warning-box{
			margin-top:135upx ;
			display: flex;
			align-items: center;
			flex-direction: column; 
			image{ 
				width: 250upx;
				height: 144upx; 
			}
			text{
				font-size: 24rpx;
				color: #707070;
			}
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
			// height: 88upx;
			padding: 32rpx;
			box-sizing: content-box;
			display: flex;
			justify-content: center;
			align-items: center;
	
			.btn-content {
				width: 100%;
				// height: 88upx;
			}
			.top{
				width: 100%;
				height: 72upx;
			}
			.bottom{
				width: 100%;
				height: 80upx;
				margin-top: 40rpx;
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
		z-index: 110;
	
		.btn-content {
			width: 100%;
			// height: 88upx;
			padding: 32upx;
			box-sizing: content-box;
		}
		.top{
			width: 100%;
			height: 72upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.action-btn{
				width: 320upx;
				height: 72upx;
				background-color: #5C8FF7;
				border: 3upx solid #5C8FF7;
				border-radius: 36upx;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 72upx;
				margin: 0;
			}
			.action-btn--border{
				background-color: #FFFFFF;
				color: #5C8FF7;
			}
			.active {
				background-color: #5276f7;
				color: #FFFFFF;
			}
		}
		
		.bottom{
			width: 100%;
			height: 80upx;
			margin-top: 40rpx;
			.action-btn {
				width: 638upx;
				height: 80upx;
				background-color: #5C8FF7;
				border: none;
				border-radius: 44upx;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 80upx;
				margin: 0 auto;
			}
			.action-btn--disabled{
				background-color: #B2B2B2;
			}
				
			.active {
				background-color: #5276f7;
			}
		}
	}
}
</style>
