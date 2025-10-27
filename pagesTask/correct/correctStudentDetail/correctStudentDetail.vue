<template>
	<view class="correct-student-container">
		<view class="student-task-content">
			<view class="student-info">
				<image class="avatar" :src="clockDetailsData.avatar" mode="aspectFill"></image>
				<view class="info-content">
					<view class="top">
						<view class="name">{{clockDetailsData.name}}</view>
						<view class="class-name">{{clockDetailsData.className}}</view>
						<!-- <view class="task-count" v-if="clockDetailsData.totalCount">{{clockDetailsData.completion==undefined?0:clockDetailsData.completion}}/{{clockDetailsData.totalCount==undefined?0:clockDetailsData.totalCount}}</view>
						<view class="task-status" v-if="clockDetailsData.status == 6">已补交</view> -->
					</view>
					<view class="bottom">{{clockDetailsData.studentNum}} {{formatTaskTime(clockDetailsData.effectiveDate)}}</view>
				</view>
				<image v-if="!clockDetailsData.showButton && clockDetailsData.sportTaskInfos.length>0" class="read-img" src="../../static/images/correctTask/read-icon.png"></image>
			</view>
			<view class="finished-box" v-if="clockDetailsData.totalCount">
				<view class="box-left">完成情况：<label>{{clockDetailsData.completion==undefined?0:clockDetailsData.completion}}</label>/{{clockDetailsData.totalCount==undefined?0:clockDetailsData.totalCount}}<label class="mag-left-16" v-if="clockDetailsData.status == 6">已{{$t('task.correct.classStatistics.makeUpClock')}}</label></view>
				<view class="center-line" v-if="clockDetailsData.totalGroup"></view>
				<view class="box-right" v-if="clockDetailsData.totalGroup">{{$t('task.correct.classStatistics.standardGroupNum')}}：<label>{{clockDetailsData.standardGroup}}</label>/{{clockDetailsData.totalGroup}}</view>
			</view>
			<view class="task-info"  v-if="clockDetailsData.sportTaskInfos.length>0">
				<view class="teacher-task" v-if="clockDetailsData.sportTaskInfos.length>0">
					<view class="title">{{$t('task.correct.studentTaskDetail.physicalTask')}}</view>
					<view class="task-list">
						<view class="task-li" v-for="(task,index) in clockDetailsData.sportTaskInfos" :key="index">
							<view class="li-title">
								<view class="action-info">
									<view class="name">{{task.name}}{{task.taskType == 2? "（AI）":""}}</view>
									<view class="group" v-if="task.taskType == 2">{{task.calculateType == 1?formatTimeNum(task.num):task.num+$t('common.one')}}X{{task.groupNum}}{{$t('common.group')}}</view>
								</view>
								<view class="time" v-if="task.status != 0">{{task.status == 6?`（${$t('task.correct.classStatistics.makeUpClock')}）`:""}}{{task.clockTime?formatClockTime(task.clockTime):''}}</view>
								<view class="info-tag" v-if="task.status == 0">未完成</view>
							</view>
							<view class="sport-content" v-if="task.taskType == 1">
								<view class="content-title">{{$t('common.sport')}}内容：</view>
								<view class="content-info">{{task.taskContent}}</view>
							</view>
							<view class="sport-content" v-if="task.status != 0">
								<view class="content-title">{{$t('common.sport')}}情况：</view>
								<view class="content-info">{{task.clockText}}</view>
							</view>
							<view class="media-content" v-if="task.status != 0">
								<view class="content-title">成果展示：</view>
								<view class="content-info" v-if="task.clockMediaUrls && task.taskType == 1">
									<view class="media-li" v-for="(img,g) in task.clockMediaUrls.images" :key="g">
										<image :src="img" mode="aspectFit" @click="previewImages(task,g)"></image>
									</view>
									<view class="media-li" v-for="(vid,v) in task.clockMediaUrls.videos" :key="v" v-if="xiaotiyunUser.teacher.isShowVideo">
										<video :src="vid" :id="'taskVideo'+index+v" @play="playVedio" @fullscreenchange="fullscreenchange"></video>
									</view>
								</view>
								<view class="content-info" v-if="task.taskType == 2">
									<view class="media-li-ai" v-for="(vid,v) in task.clockMediaUrls" :key="v" v-if="xiaotiyunUser.teacher.isShowVideo">
										<view class="ai-video">
											<view v-if="vid.level != undefined || [1,2,3,4,5,6].includes(vid.level)" :class="['leave-box',{'excell':vid.level == 1},{'good':vid.level == 2},{'pass':vid.level == 3},{'no-pass':vid.level == 4},{'over-standard':vid.level == 5},{'under-standard':vid.level == 6}]">{{formatLevel(vid.level)}}</view>
											<video :src="vid.videos" :id="'taskVideo'+index+v" @play="playVedio" @fullscreenchange="fullscreenchange"></video>
										</view>
										<view class="score-content" v-if="task.clockMediaUrls.commitType != 1" >{{task.calculateType == 1?vid.score+$t('common.one'):formatTimeNum(vid.timeConsume)}}</view>
                    <view class="score-content" v-if="task.clockMediaUrls.commitType == 1" >{{task.calculateType == 1?vid.aiCount+$t('common.one'):formatTimeNum(vid.timeConsume)}}</view>
									</view>
								</view>
								<view class="info-tips" v-if="task.clockMediaUrls.commitType == 1">
									<view v-if="task.calculateType == 2">
										<image class="info-tips-icon" src="../../../static/images/tips.png" mode="aspectFit"></image>提前结束
									</view>
									<view v-if="task.calculateType == 1">
										<image class="info-tips-icon" src="../../../static/images/tips.png" mode="aspectFit"></image>实际完成{{task.score}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="scheme-task" v-if="clockDetailsData.sportSchemeInfos.length>0">
					<view class="title">{{$t('task.correct.studentTaskDetail.physicalFactorScheme')}}</view>
					<view class="task-list">
						<view class="task-li" v-for="(scheme,index) in clockDetailsData.sportSchemeInfos" :key="index">
							<view class="li-title">
								<view class="action-info">
									<view class="name">{{scheme.actionName}}</view>
								</view>
								<view class="time" v-if="scheme.status != 0 && scheme.status != 3">{{scheme.status == 6?`（${$t('task.correct.classStatistics.makeUpClock')}）`:""}}{{scheme.clockTime?formatClockTime(scheme.clockTime):''}}</view>
								<view class="info-tag" v-if="scheme.status == 0 || scheme.status == 3">未完成</view>
							</view>
							<view class="sport-content">
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
				</view> -->
			</view>
			<view class="comment-box" v-if="clockDetailsData.comments">
				<view class="comment-title">{{$t('task.correct.batchCorrectTask.comment')}}：</view>
				<view class="comment-content">{{clockDetailsData.comments}}</view>
			</view>
			<view class="task-warning-box" v-if="clockDetailsData.showButton">
				<view class="required">*</view>
				<view class="text">{{$t('task.correct.studentDetail.unFinishedTaskWarning')}}</view>
			</view>
		</view>
		<view class="btn-box-content safe-area-inset-bottom">
			<view class="default-content">
				<view class="btn-content">
					<!-- <view class="top" v-if="studentIds.length>1"></view> -->
					<view class="bottom" v-if="clockDetailsData.showButton || clockDetailsData.corrected"></view>
				</view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom">
			<view class="btn-content">
				<view class="top">
					<button class="action-btn action-btn--border" type="primary" hover-class="active" @click="preStudent">上一位</button>
					<button class="action-btn" type="primary" hover-class="active" @click="nextStudent">下一位</button>
				</view>
				<view class="bottom" v-if="!clockDetailsData.showButton">
					<button :class="['action-btn',{'action-btn--disabled':clockDetailsData.comments}]" type="primary" hover-class="active" @click="showCommentInput">{{clockDetailsData.comments?`重新${$t('task.correct.batchCorrectTask.commentInput')}`:$t('task.correct.batchCorrectTask.commentInput')}}</button>
					<!-- <button class="action-btn" type="primary" hover-class="active" v-if="clockDetailsData.showButton" @click="goShowModal">{{$t('common.task')}}提醒</button> -->
				</view>
			</view>
		</view>
		<u-popup v-model="showCommentPopup" mode="bottom" :safe-area-inset-bottom="true" :height="1080" :closeable="true">
			<view class="popup-content" id="commentModel">
				<view class="title">批量{{$t('task.correct.batchCorrectTask.commentInput')}}</view>
				<view class="comment-content">
					<view class="content-title">{{$t('task.correct.batchCorrectTask.comment')}}：</view>
					<view class="comment-input">
						<u-input :maxlength="noteMaxLen" :clearable="false" placeholder-style="font-size: 12px;color:#B2B2B2;" v-model="comments" type="textarea" :placeholder="$t('task.correct.batchCorrectTask.commentModalPlaceholder')" />
						<view class="conent-size">{{ comments.length }}/{{noteMaxLen}}</view>
					</view>
					<view class="comment-model">
						<view class="model-li" v-for="(model,index) in allCommentModelList" :key="index">
							<view class="model-text" hover-class="model-li--active" @click="appendComment(model)">{{model.value}}</view>
							<view class="model-del" v-if="model.isUserModel" @click="deleteModel(model,index)">
								<image class="del-img" src="../../static/images/correctTask/delete-icon.png" mode="aspectFill"></image>
							</view>
						</view>
						<view class="model-li-add" hover-class="model-li-add--active" @click="showCommentModel()">+添加{{$t('task.correct.batchCorrectTask.commentInput')}}模板</view>
					</view>
				</view>
				<view class="comment-btn">
					<button :class="['action-btn',{'action-btn--disabled':!comments}]" @click="submitComment()" :disabled="!comments">提交</button>
				</view>
			</view>
		</u-popup>
		<u-modal v-model="showCommentModelDialog" :mask-close-able="true" width="74.7%" :title="`添加${$t('task.correct.batchCorrectTask.comment')}模版`"
			:title-style="{fontSize: '34rpx'}" confirm-text="添加" confirm-color="#5C8FF7"
			:show-cancel-button="true" cancel-text="取消" cancel-color="#707070" border-radius="24"
			:async-close="true" :negative-top="200" ref="commentModelModal" @confirm="addCommentModel">
			<view class="slot-content">
				<view class="comment-model-content">
					<view class="comment-model-content-textarea">
						<textarea :maxlength="noteMaxLen" class="content-textarea"
							:class="{'no-content-textarea':noHasCommentModel}" v-model="commentModel"
							:placeholder="$t('task.correct.batchCorrectTask.pleaseInputCommentModal')" placeholder-style="color:#B2B2B2"
							placeholder-class="content-textarea-placeholder" @input="textareaInput"></textarea>
						<!-- #ifdef MP-WEIXIN -->
						<view class="current-word-number">{{ commentModel.length }}/{{noteMaxLen}}</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</u-modal>
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
				correctId: "",
				clockDetailsData: {
					sportSchemeInfos: [],
					sportTaskInfos: [],
				},
				showCommentPopup: false, // 显示评语弹窗
				showCommentModelDialog: false, // 显示评语模板对话框
				// 评语
				comments: "",
				systemCommentModelList: [
					{
						value: this.$t('task.correct.batchCorrectTask.commentModel1'),
						isUserModel: false,
					},
					{
						value: this.$t('task.correct.batchCorrectTask.commentModel2'),
						isUserModel: false,
					},
					{
						value: this.$t('task.correct.batchCorrectTask.commentModel3'),
						isUserModel: false,
					},
				],
				allCommentModelList: [],
				// 评语模板
				commentModel: "",
				noteMaxLen: 50, //字数限制
				noHasCommentModel: false,
				
				// 国际化
				excellent: this.$t('common.excellent'),
				standard: this.$t('task.correct.studentTaskDetail.standard'),
				minute: this.$t('common.minute'),
				pleaseInputCommentModal: this.$t('task.correct.batchCorrectTask.pleaseInputCommentModal'),
				commentToast: this.$t('task.correct.batchCorrectTask.commentToast'),
				noPreStudent: this.$t('task.correct.studentTaskDetail.noPreStudent'),
				noLastStudent: this.$t('task.correct.studentTaskDetail.noLastStudent'),
			}
		},
		onLoad(options) {
			let _this = this;
			uni.setNavigationBarTitle({
				title: this.$t('task.correct.studentTaskDetail.title')
			})
			_this.initCommentModel(_this.commentModelList);
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				console.log(data);
				_this.correctId = data.correctId;
				_this.classId = data.classId;
				_this.sameDay = data.sameDay;
				_this.initPageFun();
			})
		},
		computed:{
			...mapState(['xiaotiyunUser','commentModelList']),
		},
		methods: {
			...mapMutations(['setCommentModelList']),
			initPageFun(){
				let _this = this;
				let params = {
					id: _this.correctId,
					sameDay: _this.sameDay
				}
				if(_this.classId){
					params.classId = _this.classId;
				}
				postReq(URL.taskCorrectDetails,params).then(res => {
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
						_this.submitCorrect();
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			preStudent(){
				let _this = this;
				if(_this.clockDetailsData.lastId){
					_this.correctId = _this.clockDetailsData.lastId;
					_this.initPageFun();
				}else{
					uni.showToast({
						icon: "none",
						title: _this.noPreStudent,
					})
				}
			},
			nextStudent(){
				let _this = this;
				if(_this.clockDetailsData.lastId){
					_this.correctId = _this.clockDetailsData.nextId;
					_this.initPageFun();
				}else{
					uni.showToast({
						icon: "none",
						title: _this.noLastStudent,
					})
				}
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
			formatTaskTime(timestamp) {
				// 添加检查确保 timestamp 存在且有效
				if (!timestamp) {
					return ''; // 或者返回默认值如 '日期未知'
				}
				let date = new Date();
				date.setTime(timestamp);
				let month = date.getMonth() + 1
				let day = date.getDate()
				return  `${month}月${day}日`;
			},
			formatNumber(n){
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			formatLevel(level){
				let levelStr = "";
				switch(level){
					case 1:
						levelStr = this.excellent;
						break;
					case 2:
						levelStr = "良好";
						break;
					case 3:
						levelStr = "及格";
						break;
					case 4:
						levelStr = "不及格";
						break;
					case 5:
						levelStr = this.standard;
						break;
					case 6:
						levelStr = `不${this.standard}`;
						break;
				}
				return levelStr;
			},
			formatTimeNum(timestamp){
				if(timestamp>=60000){
					if(timestamp%60000 == 0){
						return (timestamp/60000).toFixed(0) + this.minute;
					}
					let sec = timestamp%60000;
					return (timestamp/60000).toFixed(0) + this.minute + (sec/1000).toFixed(0) + "秒";
				}else{
					return (timestamp/1000).toFixed(0) + "秒";
				}
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
			textareaInput(e) {
				let _this = this;
				let value = e.detail.value;
				// console.log(e.detail.value);
				if(parseInt(value.length) > _this.noteMaxLen){
					_this.commentModel = value.substring(0,_this.noteMaxLen);
				}
			},
			// 提交评语
			submitComment(){
				let _this = this;
				let idList = [];
				idList.push(_this.clockDetailsData.id);
				if(parseInt(_this.comments.length) > _this.noteMaxLen){
					_this.comments = _this.comments.substring(0,_this.noteMaxLen);
				}
				let params = {
					idList: idList,
					comments: _this.comments
				}
				// console.log("params",params);
				_this.postTaskCorrect(params,0);
				_this.showCommentPopup = false;
			},
			// 批量批改
			submitCorrect(){
				let _this = this;
				let idList = [];
				idList.push(_this.clockDetailsData.id);
				let params = {
					idList: idList
				}
				// console.log("params",params);
				_this.postTaskCorrect(params,1);
			},
			postTaskCorrect(params,type){
				let _this = this;
				postReq(URL.taskReviewV2,params).then(res => {
					if(res.error == 10000){
						let clockDetailsData = _this.clockDetailsData;
						if(type==0){
							clockDetailsData.comments = _this.comments;
						}
						_this.clockDetailsData = clockDetailsData;
						if(type == 0){
							uni.showToast({
								icon: 'none',
								title: "批改成功！",
								duration: 1000
							})
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
			// 显示评语弹窗
			showCommentInput(){
				let _this = this;
				// _this.correctItem = item;
				if(!_this.comments){
					_this.comments = _this.commentToast;
					setTimeout(() => {
						_this.comments = "";
					},0)
				}
				_this.showCommentPopup = true;
			},
			// 打开评语模板对话框
			showCommentModel() {
				let _this = this;
				if (!_this.commentModel) {
					_this.commentModel = '请输入评语模板';
					setTimeout(() => {
						_this.commentModel = "";
					},0)
				}
				_this.showCommentModelDialog = true;
			},
			initCommentModel(commentModelList){
				let _this = this;
				let allCommentModelList = [];
				let userCommentModelList = commentModelList.map(model => {
					return {
						value: model,
						isUserModel: true,
					}
				})
				allCommentModelList = userCommentModelList.concat(_this.systemCommentModelList)
				_this.allCommentModelList = allCommentModelList;
			},
			// 添加模板
			addCommentModel(){
				let _this = this;
				if (!_this.commentModel) {
					_this.noHasCommentModel = true;
					setTimeout(() => {
						_this.noHasCommentModel = false;
					}, 2000)
					_this.$refs.commentModelModal.clearLoading();
					return;
				}
				let commentModelList = _this.commentModelList;
				if(commentModelList.length >= 3){
					commentModelList.pop();
				}
				commentModelList.unshift(_this.commentModel);
				_this.initCommentModel(commentModelList);
				_this.setCommentModelList(commentModelList);
				_this.commentModel = "";
				_this.currentNoteLen = 0;
				_this.showCommentModelDialog = false;
			},
			// 删除模板
			deleteModel(model,index){
				let _this = this;
				console.log(index);
				let commentModelList = _this.commentModelList;
				let allCommentModelList = _this.allCommentModelList;
				commentModelList.splice(index,1);
				allCommentModelList.splice(index,1);
				_this.allCommentModelList = allCommentModelList;
				console.log(allCommentModelList);
				_this.setCommentModelList(commentModelList);
			},
			// 点击模板
			appendComment(model){
				let _this = this;
				_this.comments = model.value;
			},
		}
	}
</script>

<style lang="scss" scoped>
.correct-student-container{
	width: 100%;
	.student-task-content{
		width: 100%;
		padding: 16upx 24upx 8upx 24upx;
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
			.read-img{
				width: 84upx;
				height: 106upx;
			}
		}
		.finished-box{
			width: 100%;
			height: 40upx;
			padding: 0 24upx;
			margin-top: 24upx;
			display: flex;
			align-items: center;
			.box-left{
				padding-right: 30upx;
				font-size: 30upx;
				font-weight: 400;
				color: #707070;
				line-height: 40upx;
				label{
					color: #5C8FF7;
				}
				label.mag-left-16{
					margin-left: 16upx;
				}
			}
			.box-right{
				padding-left: 30upx;
				font-size: 30upx;
				font-weight: 400;
				color: #707070;
				line-height: 40upx;
				label{
					color: #5C8FF7;
				}
			}
			.center-line{
				width: 1upx;
				height: 24upx;
				background-color: #B2B2B2;
			}
		}
		.task-info{
			width: 100%;
			padding-bottom: 24upx;
			border-bottom: 1upx solid #E6E6E6;
			.teacher-task{
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
								height: 250upx;
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
		.comment-box{
			width: 100%;
			padding: 32upx 24upx;
			display: flex;
			flex-direction: column;
			.comment-title{
				width: 100%;
				font-size: 30upx;
				font-weight: 500;
				color: #202020;
				line-height: 40upx;
			}
			.comment-content{
				width: 100%;
				margin-top: 16upx;
				font-size: 28upx;
				font-weight: 400;
				color: #202020;
				line-height: 38upx;
				word-break: break-all;
			}
		}
		.task-warning-box{
			width: 100%;
			padding: 0 24upx;
			display: flex;
			align-items: center;
			.required{
				font-size: 34upx;
				font-weight: 400;
				color: #FF5050;
				font-family: PingFangSC-Regular, PingFang SC;
				margin-right: 16upx;
			}
			.text{
				line-height: 99upx;
				font-size: 28upx;
				font-weight: 400;
				color: #B2B2B2;
			}
		}
	}
	.change-btn-box{
		width: 100%;
		height: 152upx;
		padding: 40upx 32upx;
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
.popup-content{
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.title{
		width: 100%;
		height: 86upx;
		line-height: 86upx;
		font-size: 32upx;
		font-weight: 400;
		color: #464646;
		text-align: center;
	}
	.screen-info{
		width: 100%;
		flex: 1;
		.screen-li{
			width: 100%;
			margin-top: 20upx;
			.li-title{
				width: 100%;
				height: 40upx;
				line-height: 40upx;
				padding: 0 32upx;
				font-size: 28upx;
				font-weight: 500;
				color: #202020;
				margin-bottom: 12upx;
			}
			.li-info{
				width: 100%;
				padding: 0 16upx;
				display: flex;
				flex-wrap: wrap;
				.li-item{
					width: calc(100%/3 - 32upx);
					height: 70upx;
					border-radius: 35upx;
					line-height: 70upx;
					text-align: center;
					margin: 12upx 16upx;
					background-color: #F5F5F5;
					font-size: 28upx;
					font-weight: 400;
					color: #464646;
				}
				.li-item--checked{
					background-color: #5C8FF7;
					color: #FFFFFF;
				}
			}
			.scroll-li-info{
				padding: 0 16upx;
				white-space: nowrap;
				height: 94rpx;
				.li-item{
					height: 70upx;
					min-width: calc(100%/3 - 32upx);;
					padding: 0 32rpx;
					border-radius: 35upx;
					line-height: 70upx;
					text-align: center;
					margin: 12upx 16upx;
					background-color: #F5F5F5;
					font-size: 28upx;
					font-weight: 400;
					color: #464646;
					display: inline-flex;
					align-items: center;
					justify-content: center;
				}
				.li-item--checked{
					background-color: #5C8FF7;
					color: #FFFFFF;
				}
			}
		}
	}
	.screnn-btn{
		width: 100%;
		height: 86upx;
		display: flex;
		border-top: 2upx solid #E6E6E6;
		.action-btn{
			flex: 1;
			height: 100%;
			line-height: 86upx;
			text-align: center;
			background-color: #FFFFFF;
			color: #5C8FF7;
			font-size: 32upx;
			font-weight: 600;
		}
		.action-btn--confirm{
			background-color: #5C8FF7;
			color: #FFFFFF;
		}
	}
	.comment-content{
		width: 100%;
		flex: 1;
		.content-title{
			width: 100%;
			height: 40upx;
			line-height: 40upx;
			padding: 0 32upx;
			font-size: 28upx;
			font-weight: 500;
			color: #202020;
			margin-bottom: 12upx;
		}
		.comment-model{
			width: 100%;
			padding: 0 32upx;
			padding-top: 30upx;
			display: flex;
			flex-wrap: wrap;
			.model-li{
				position: relative;
				margin-right: 24upx;
				margin-bottom: 24rpx;
				.model-text{
					height: 60upx;
					padding: 0 32upx;
					border-radius: 12upx;
					border: 2upx solid #B2B2B2;
					background-color: #FFFFFF;
					font-size: 28upx;
					font-weight: 400;
					color: #464646;
					line-height: 60upx;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					word-break: break-all;
				}
				.model-li--active{
					border: 2upx solid #5C8FF7;
					background-color: #5C8FF7;
					color: #FFFFFF;
				}
				.model-del{
					width: 48upx;
					height: 48upx;
					padding: 12upx;
					position: absolute;
					right: -24upx;
					top: -24upx;
					z-index: 1;
				}
				.del-img{
					width: 24upx;
					height: 24upx;
				}
			}
			.model-li-add{
				height: 60upx;
				padding: 0 32upx;
				border-radius: 12upx;
				border: 2upx solid #5C8FF7;
				background-color: #FFFFFF;
				font-size: 28upx;
				font-weight: 400;
				color: #5C8FF7;
				line-height: 60upx;
				margin-right: 24upx;
				margin-bottom: 24rpx;
			}
			.model-li-add--active{
				border: 2upx solid #5C8FF7;
				background-color: #5C8FF7;
				color: #FFFFFF;
			}
		}
	}
	.comment-input{
		width: 686upx;
		height: 226upx;
		background-color: #F5F5F5;
		border-radius: 24upx;
		margin: 0 auto;
		margin-top: 24upx;
		padding: 16upx 24upx;
		font-size: 28upx;
		color: #202020;
		position: relative;
		::v-deep .u-input{
			height: 100%;
		}
		.conent-size{
			font-size: 28upx;
			color: #B2B2B2;
			position: absolute;
			bottom: 17upx;
			right: 24upx;
		}
	}
	.comment-btn{
		width: 100%;
		height: 86upx;
		display: flex;
		.action-btn{
			flex: 1;
			height: 100%;
			line-height: 86upx;
			text-align: center;
			background-color: #5C8FF7;
			color: #FFFFFF;
			font-size: 32upx;
			font-weight: 600;
		}
		.action-btn--disabled{
			background-color: #B2B2B2;
		}
	}
}
.slot-content {
	position: relative;
	padding: 24upx 32upx;
	.comment-model-content {
		width: 100%;
	
		.comment-model-content-textarea {
			width: 100%;
			position: relative;
			font-size: 28upx;
			color: #202020;
	
			.content-textarea {
				width: 100%;
				height: 184upx;
				background-color: #F5F5F5;
				padding: 24upx;
				border: 1PX solid #F5F5F5;
				border-radius: 8upx;
				font-size: 28upx;
				color: #202020;
				line-height: 40upx;
				box-sizing: border-box;
			}
	
			.no-content-textarea {
				border: 1PX solid #FF7A86 !important;
			}
	
			.content-textarea-placeholder {
				font-size: 28upx;
				line-height: 40upx;
				color: #B2B2B2;
			}
	
			.current-word-number {
				font-size: 24upx;
				color: #B2B2B2;
				position: absolute;
				bottom: 8upx;
				right: 16upx;
			}
		}
	}
}
</style>

