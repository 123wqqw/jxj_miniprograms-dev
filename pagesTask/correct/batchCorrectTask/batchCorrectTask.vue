<template>
	<view class="batch-correct-container">
		<view class="batch-correct-content">
			<scroll-view class="batch-list" scroll-x>
				<view class="list-title">
					<view class="td td-wd1" @click="showScreenPopup = true">{{$t('task.correct.classStatistics.screen')}}<image :class="['screen-icon',{'screen-icon-rotate':showScreenPopup}]" src="../../static/images/correctTask/screen-icon.png" mode="aspectFill"></image></view>
					<view class="td td-wd2">完成情况</view>
					<view class="td td-wd2">{{$t('task.correct.classStatistics.standardGroupNum')}}</view>
					<view class="td td-wd3">{{$t('common.task')}}日期</view>
					<view class="td td-wd4">{{$t('common.classText')}}</view>
				</view>
				<view class="list-li" v-for="(item,index) in correctStudentList" :key="index">
					<view class="td td-wd1 check-box" @click="checkItem(item,index)">
						<image :class="['checked-icon',{'checked-icon--disabled':item.disabled}]" :src="item.checked?'../../static/images/correctTask/checked-icon.png':'../../static/images/correctTask/uncheck-icon.png'" mode="aspectFill"></image>
						<view class="name">{{item.name}}</view>
					</view>
					<view class="td td-wd2" @click="goCorrectStudentDetail(item)"><label>{{item.completeCount}}</label>/{{item.totalCount}}{{item.clockType?` (${$t('task.correct.classStatistics.makeUpClock')})`:""}}</view>
					<view class="td td-wd2" @click="goCorrectStudentDetail(item)" v-if="item.totalGroup>0"><label>{{item.standardGroup}}</label>/{{item.totalGroup}}</view>
					<view class="td td-wd2" @click="goCorrectStudentDetail(item)" v-if="!item.totalGroup">--</view>
					<view class="td td-wd3" @click="goCorrectStudentDetail(item)">{{formatTaskTime(item.taskDateTime)}}</view>
					<view class="td td-wd4 last-box" @click="goCorrectStudentDetail(item)">
						<view class="status-box">
							<view class="class-name">{{item.className}}</view>
							<view class="tag" v-if="item.checkStatus == 1">已批</view>
						</view>
						<image class="arrow-img" src="../../static/images/correctTask/arrow-black.png"></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="btn-box-content safe-area-inset-bottom">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom">
			<view class="btn-content">
				<view class="all-checked" @click="allChecked()">
					<image class="checked-icon" :src="allCheckedStatus?'../../static/images/correctTask/checked-icon.png':'../../static/images/correctTask/uncheck-icon.png'" mode="aspectFill"></image>
					<view class="checked-text">{{$t('common.allChoose')}}</view>
				</view>
				<button :class="['action-btn',{'action-btn--disabled':btnDisabled}]" type="primary" hover-class="active" :disabled="btnDisabled" @click="submitCorrect">批量批改</button>
				<button :class="['action-btn',{'action-btn--disabled':btnDisabled}]" type="primary" hover-class="active" :disabled="btnDisabled" @click="showCommentInput">批量{{$t('task.correct.batchCorrectTask.commentInput')}}</button>
			</view>
		</view>
		
		<u-popup v-model="showScreenPopup" mode="bottom" :safe-area-inset-bottom="true" :height="isClassInfo?445:615" :closeable="true" @close="cancelScreenPopup">
			<view class="popup-content">
				<view class="title">{{$t('task.correct.classStatistics.screen')}}</view>
				<view class="screen-info">
					<view class="screen-li" v-if="!isClassInfo">
						<view class="li-title">{{$t('common.classText')}}{{$t('task.correct.batchCorrectTask.range')}}</view>
						<scroll-view class="scroll-li-info" scroll-x>
							<view :class="['li-item',{'li-item--checked':checkClass==''}]" @click="checkClass = ''">全部</view>
							<view :class="['li-item',{'li-item--checked':checkClass==item.classId}]" v-for="(item,index) in classList" :key="index" @click="checkClass = item.classId">{{item.className}}</view>
						</scroll-view>
					</view>
					<view class="screen-li">
						<view class="li-title">日期{{$t('task.correct.batchCorrectTask.range')}}</view>
						<view class="li-info">
							<view :class="['li-item',{'li-item--checked':!dateStatus}]" @click="dateStatus = false">全部</view>
							<view :class="['li-item',{'li-item--checked':dateStatus}]" @click="dateStatus = true">{{$t('task.correct.batchCorrectTask.today')}}</view>
						</view>
					</view>
				</view>
				<view class="screnn-btn">
					<view class="action-btn" @click="resetScreenSubmit">重置</view>
					<view class="action-btn action-btn--confirm" @click="enterScreenSubmit">{{$t('common.enter')}}</view>
				</view>
			</view>
		</u-popup>
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
	export default {
		data() {
			return {
				allCheckedStatus: false, // 全选状态
				allowCorrect: true, // 批改按钮状态
				allowComment: true, // 点评按钮状态
				showScreenPopup: false, // 显示筛选弹窗状态
				showCommentPopup: false, // 显示评语弹窗
				showCommentModelDialog: false, // 显示评语模板对话框
				// 筛选
				checkClass: "",
				dateStatus: true,
				sameDay: true,
				classId: "",
				// 请求数据
				classList: [],
				correctStudentList: [],
				lastPage: 1,
				pageNum: 1,
				pageSize: 15,
				isRefresh: false,
				
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
				isClassInfo: false,
				
				// 国际化
				pleaseInputCommentModal: this.$t('task.correct.batchCorrectTask.pleaseInputCommentModal'),
				commentToast: this.$t('task.correct.batchCorrectTask.commentToast'),
			}
		},
		onLoad() {
			let _this = this;
			// 获取缓存内的评语模板
			// console.log(_this.commentModelList);
			uni.setNavigationBarTitle({
				title: this.$t('task.correct.batchCorrectTask.title')
			})
			_this.initCommentModel(_this.commentModelList);
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				console.log(data);
				_this.classId = data.classId;
				_this.checkClass = data.classId;
				_this.isClassInfo = true;
			})
			// 是全部班级进来的批改列表
			if(!_this.isClassInfo){
				_this.getTeacherClass();
			}
			_this.initPageFun();
		},
		onShow() {
			if(this.isRefresh){
				this.isRefresh = false;
				this.initPageFun();
			}
		},
		onHide() {
			this.isRefresh = true;
		},
		onPullDownRefresh() {
			let _this = this;
			setTimeout(() => {
				_this.initPageFun();
				uni.stopPullDownRefresh();
			}, 0)
		},
		onReachBottom() {
			let _this = this;
			if(_this.pageNum<_this.lastPage){
				_this.pageNum = _this.pageNum+1
				_this.freshData();
			}
		},
		computed:{
			...mapState(['commentModelList','xiaotiyunUser']),
			btnDisabled(){
				let _this = this;
				let correctStudentList = _this.correctStudentList;
				let checkedList = correctStudentList.filter(item =>{
					return item.checked;
				});
				if(checkedList.length>0){
					return false;
				}
				return true;
			},
		},
		methods: {
			...mapMutations(['setCommentModelList']),
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
			initPageFun(){
				let params = {
					sameDay: this.sameDay,
					pageNum: 1,
					pageSize: this.pageSize
				}
				if(this.classId){
					params.classId = this.classId;
				}
				this.correctStudentList = [];
				this.getCorrectStudentList(params);
			},
			freshData(){
				let params = {
					sameDay: this.sameDay,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				if(this.classId){
					params.classId = this.classId;
				}
				this.getCorrectStudentList(params);
			},
			getCorrectStudentList(params){
				postReq(URL.taskReviews,params).then(res => {
					if(res.error == 10000){
						if(res.data){
							let correctStudentList = res.data.content;
							correctStudentList.forEach(item => {
								if(item.checkStatus == 1){
									item.disabled = true;
								}else{
									item.disabled = false;
								}
								item.checked = false;
							})
							this.correctStudentList = this.correctStudentList.concat(correctStudentList);
							this.lastPage = res.data.lastPage;
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
			formatTaskTime(timestamp){
				let date = new Date();
				date.setTime(timestamp);
				const month = date.getMonth() + 1
				const day = date.getDate()
				
				return  `${month}月${day}日`;
			},
			// 去学生作业详情页面
			goCorrectStudentDetail(item){
				let data = {
					correctId: item.id,
					classId: this.classId,
					sameDay: this.sameDay,
				}
				uni.navigateTo({
					url: "../correctStudentDetail/correctStudentDetail",
					success:function(res){
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', data)
					}
				})
			},
			// 提交评语
			submitComment(){
				let _this = this;
				let correctStudentList = _this.correctStudentList;
				let idList = correctStudentList.filter(item => {return item.checked}).map(item => {return item.id});
				if(parseInt(_this.comments.length) > _this.noteMaxLen){
					_this.comments = _this.comments.substring(0,_this.noteMaxLen);
				}
				let params = {
					idList: idList,
					comments: _this.comments
				}
				// console.log("params",params);
				_this.postTaskCorrect(params);
			},
			// 批量批改
			submitCorrect(){
				let _this = this;
				let correctStudentList = _this.correctStudentList;
				let idList = correctStudentList.filter(item => {return item.checked}).map(item => {return item.id});
				let params = {
					idList: idList
				}
				// console.log("params",params);
				_this.postTaskCorrect(params);
			},
			postTaskCorrect(params){
				let _this = this;
				let correctStudentList = _this.correctStudentList;
				postReq(URL.taskReviewV2,params).then(res => {
					if(res.error == 10000){
						correctStudentList.forEach(item => {
							if(item.checked){
								item.checked = false;
								item.disabled = true;
								item.checkStatus = 1;
							}
						})
						_this.correctStudentList = correctStudentList;
						_this.showCommentPopup = false;
						_this.initPageFun();
						uni.showToast({
							icon: 'none',
							title: "批改成功！",
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
			// 选择框点击
			checkItem(item,index){
				let _this = this;
				if(!item.disabled){
					_this.correctStudentList[index].checked = !_this.correctStudentList[index].checked;
				}
			},
			// 全选点击
			allChecked(){
				let _this = this;
				_this.allCheckedStatus = !_this.allCheckedStatus;
				let correctStudentList = _this.correctStudentList;
				correctStudentList.forEach(item => {
					if(!item.disabled){
						item.checked = _this.allCheckedStatus;
					}
				})
				_this.correctStudentList = correctStudentList;
			},
			// 关闭筛选弹窗之前 恢复选择按钮状态
			cancelScreenPopup(){
				let _this = this;
				_this.checkClass = _this.classId;
				_this.dateStatus = _this.sameDay;
			},
			// 确认筛选按钮
			enterScreenSubmit(){
				let _this = this;
				_this.classId = _this.checkClass;
				_this.sameDay = _this.dateStatus;
				_this.initPageFun();
				_this.showScreenPopup = false;
			},
			// 重置筛选按钮
			resetScreenSubmit(){
				let _this = this;
				if(!_this.isClassInfo){
					_this.classId = '';
				}
				_this.sameDay = false;
				_this.initPageFun();
				_this.showScreenPopup = false;
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
					_this.commentModel = '请输入点评模板';
					setTimeout(() => {
						_this.commentModel = "";
					},0)
				}
				_this.showCommentModelDialog = true;
			},
			textareaInput(e) {
				let _this = this;
				let value = e.detail.value;
				// console.log(e.detail.value);
				if(parseInt(value.length) > _this.noteMaxLen){
					_this.commentModel = value.substring(0,_this.noteMaxLen);
				}
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
.batch-correct-container{
	width: 100%;
	.batch-correct-content{
		width: 100%;
		padding: 16upx 0;
		.batch-list{
			width: 100%;
			background-color: #FFFFFF;
			padding: 16upx 32upx;
			margin-top: 16upx;
			.list-title{
				// width: 100%;
				height: 72upx;
				display: inline-flex;
				align-items: center;
				border-bottom: 2upx solid #E6E6E6;
				.td{
					font-size: 28upx;
					font-weight: 500;
					color: #202020;
					.screen-icon{
						width: 14upx;
						height: 12upx;
						margin-left: 7upx;
						transition: all .3s ease-out;
					}
					.screen-icon-rotate{
						transform: rotate(180deg);
					}
				}
			}
			.list-li{
				// width: 100%;
				height: 88upx;
				display: inline-flex;
				align-items: center;
				border-bottom: 1upx solid #E6E6E6;
				.td{
					font-size: 28upx;
					font-weight: 400;
					color: #707070;
					label{
						color: #5C8FF7;
					}
				}
				.check-box{
					height: 100%;
					display: flex;
					align-items: center;
					.checked-icon{
						width: 28upx;
						height: 28upx;
						min-width: 28rpx;
					}
					.checked-icon--disabled{
						background-color: #979797;
					}
					.name{
						margin-left: 16upx;
						font-size: 28upx;
						font-weight: 400;
						color: #202020;
						line-height: 80upx;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						word-break: break-all;
					}
				}
				.last-box{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.status-box{
						flex: 1;
						height: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.class-name{
							flex: 1;
							display: -webkit-box;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
							word-break: break-all;
						}
						.tag{
							min-width: 60upx;
							height: 30upx;
							line-height: 30upx;
							padding: 0 10upx;
							background-color: #E8F0FF;
							font-size: 20upx;
							font-weight: 400;
							color: #5C8FF7;
							border-radius: 5upx;
						}
					}
					.arrow-img{
						width: 24upx;
						height: 24upx;
						margin-left: 16upx;
					}
				}
				&:last-child{
					border: none;
				}
			}
			.td-wd1{
				width: 144upx;
			}
			.td-wd2{
				width: 152upx;
			}
			.td-wd3{
				width: 132upx;
			}
			.td-wd4{
				width: 258upx;
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
			height: 88upx;
			padding: 32rpx 0;
			box-sizing: content-box;
	
			.btn-content {
				width: 100%;
				height: 88upx;
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
			padding: 32upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: content-box;
		}
	
		.action-btn {
			width: 230upx;
			height: 80upx;
			background-color: #5C8FF7;
			border: none;
			border-radius: 40upx;
			font-size: 24upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 80upx;
			margin-left: 30upx;
		}
		.action-btn--disabled{
			background-color: #B2B2B2;
		}
	
		.active {
			background-color: #5276f7;
		}
		
		.all-checked{
			flex: 1;
			height: 80upx;
			display: flex;
			align-items: center;
			.checked-icon{
				width: 28upx;
				height: 28upx;
			}
			.checked-text{
				margin-left: 16upx;
				font-size: 28upx;
				font-weight: 400;
				color: #707070;
				line-height: 80upx;
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
