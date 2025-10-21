<template>
	<view class="export-container">
		<view class="export-screen">
			<view class="screen-li" @click="showSelectDate = true">
				<view class="li-content">
					<view class="left-text">{{$t('task.correct.exportCorrectFile.startTime')}}</view>
					<view class="right-text">{{startTimeStr}}</view>
				</view>
				<image class="arrow-img" src="../../static/images/correctTask/arrow-black.png" mode="aspectFill"></image>
			</view>
			<view class="screen-li" @click="showSelectDate = true">
				<view class="li-content">
					<view class="left-text">{{$t('task.correct.exportCorrectFile.endTime')}}</view>
					<view class="right-text">{{endTimeStr}}</view>
				</view>
				<image class="arrow-img" src="../../static/images/correctTask/arrow-black.png" mode="aspectFill"></image>
			</view>
			<view class="screen-li" @click="showSelectClass = true">
				<view class="li-content">
					<view class="left-text">{{$t('task.correct.exportCorrectFile.chooseClass')}}</view>
					<view class="right-text">{{className}}</view>
				</view>
				<image class="arrow-img" src="../../static/images/correctTask/arrow-black.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="btn-box-content safe-area-inset-bottom">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom">
			<view class="btn-content">
				<button class="action-btn" type="primary" hover-class="active" @click="exportFile">{{$t('task.correct.exportCorrectFile.exportText')}}</button>
			</view>
		</view>
		<x-calendar v-model="showSelectDate" mode='range' @change="changeRangeDate" :defaultRange="defaultRange"></x-calendar>
		<u-select v-model="showSelectClass" mode="single-column" value-name="classId" label-name="className" :default-value="classIndex" :list="classList" @confirm="selectClass"></u-select>
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
	import xCalendar from "../../components/x-calendar/x-calendar.vue";
	import { downloadPreviewExcelFile } from "@/common/util.js";
	
	export default {
		components: {
			xCalendar
		},
		data() {
			return {
				startTime: "",
				endTime: "",
				defaultRange: [],
				classId: "",
				classList: [
					{
						classId: '',
						className: "全部班级",
					}
				],
				showSelectDate: false,
				showSelectClass: false,
				weekStrList: ["周日","周一","周二","周三","周四","周五","周六"],
				
				// 国际化
				fileUrlEmpty: this.$t('task.correct.exportCorrectFile.fileUrlEmpty'),
				openFileFailed: this.$t('common.openFileFailed'),
				downloadFileFailed: this.$t('common.downloadFileFailed'),
			}
		},
		computed:{
			...mapState(['xiaotiyunUser']),
			classIndex(){
				let index = this.classList.findIndex((arr) => arr.classId == this.classId);
				if(index > -1){
					return index;
				}
				return 0;
			},
			className(){
				let classItem = this.classList.find(item => {return item.classId == this.classId});
				if(classItem){
					return classItem.className;
				}
				return "全部班级";
			},
			startTimeStr(){
				let _this = this;
				if(_this.startTime){
					let date = new Date(_this.startTime);
					let currentDate = date.getDate()          // 今日日期 几号
					let currentYear = date.getFullYear()       // 当前年份
					let currentMonth = date.getMonth() + 1    // 当前月份
					let currentWeek = date.getDay() // 1...6,0   // 星期几
					let nowY = new Date().getFullYear()       // 当前年份
					let nowM = new Date().getMonth() + 1
					let nowD = new Date().getDate()          // 今日日期 几号
					let dateStr = "";
					if(`${currentYear}-${currentMonth}-${currentDate}` == `${nowY}-${nowM}-${nowD}`){
						dateStr = "今天";
					}else{
						dateStr = `${currentYear}-${currentMonth}-${currentDate}`
					}
					return `${dateStr}（${_this.weekStrList[currentWeek]}）`;
				}
				return "";
			},
			endTimeStr(){
				let _this = this;
				if(_this.endTime){
					let date = new Date(_this.endTime);
					let currentDate = date.getDate()          // 今日日期 几号
					let currentYear = date.getFullYear()       // 当前年份
					let currentMonth = date.getMonth() + 1    // 当前月份
					let currentWeek = date.getDay() // 1...6,0   // 星期几
					let nowY = new Date().getFullYear()       // 当前年份
					let nowM = new Date().getMonth() + 1
					let nowD = new Date().getDate()          // 今日日期 几号
					let dateStr = "";
					if(`${currentYear}-${currentMonth}-${currentDate}` == `${nowY}-${nowM}-${nowD}`){
						dateStr = "今天";
					}else{
						dateStr = `${currentYear}-${currentMonth}-${currentDate}`
					}
					return `${dateStr}（${_this.weekStrList[currentWeek]}）`;
				}
				return "";
			},
		},
		onLoad(options) {
			let _this = this;
			uni.setNavigationBarTitle({
				title: this.$t('task.correct.exportCorrectFile.title')
			})
			_this.getTeacherClass();
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('exportFile', res=> {
				// type 为-1 就是点击班级过来，为0就是点击未完成学生头像过来的
				// console.log(res);
				let nowY = new Date().getFullYear()       // 当前年份
				let nowM = new Date().getMonth() + 1
				let nowD = new Date().getDate()
				_this.startTime = res.startTime;
				_this.endTime = `${nowY}-${_this.formatNumber(nowM)}-${_this.formatNumber(nowD)}`;
				_this.defaultRange = [_this.startTime,_this.endTime];
				_this.classId = res.classId;
			})
		},
		methods: {
			// 获取班级列表
			getTeacherClass(){
				let _this = this;
				let params = {
					teacherId: _this.xiaotiyunUser.teacher.teacherId
				}
				postReq(URL.classManage,params).then(res => {
					if(res.error == 10000){
						if(res.data){
							_this.classList = _this.classList.concat(res.data);
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
			changeRangeDate(e){
				// console.log(e);
				let _this = this;
				_this.startTime = e.startDate;
				_this.endTime = e.endDate;
			},
			formatNumber(n){
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			// 选择班级
			selectClass(e){
				let _this = this;
				_this.classId = e[0].value;
			},
			// 导出文件
			exportFile(){
				let _this = this;
				let params = {
					stratTime: _this.startTime,
					endTime: _this.endTime,
				}
				if(_this.classId){
					params.classId = _this.classId;
				}
				// console.log("params",params);
				getReq(URL.exportTaskData,params).then(res => {
					if(res.error == 10000){
						console.log(res);
						if(res.data){
							downloadPreviewExcelFile(res.data);
						}else{
							uni.showToast({
								icon: 'none',
								title: this.fileUrlEmpty,
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
		}
	}
</script>

<style lang="scss" scoped>
.export-container{
	width: 100%;
	height: 100vh;
	background-color: #F5F5F5;
	overflow: hidden;
	.export-screen{
		width: 702upx;
		margin: 16upx auto;
		padding: 0 20upx;
		background-color: #FFFFFF;
		border-radius: 24upx;
		overflow: hidden;
		.screen-li{
			width: 100%;
			height: 96upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.li-content{
				flex: 1;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.left-text{
				height: 96upx;
				line-height: 96upx;
				font-size: 28upx;
				font-weight: 400;
				color: #464646;
			}
			.right-text{
				height: 96upx;
				line-height: 96upx;
				font-size: 28upx;
				font-weight: 400;
				color: #5C8FF7;
			}
			.arrow-img{
				width: 24upx;
				height: 24upx;
				min-width: 24upx;
				margin-left: 16upx;
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
			padding: 32upx 0;
			box-sizing: content-box;
		}
	
		.action-btn {
			width: 638upx;
			height: 88upx;
			background-color: #5C8FF7;
			border: none;
			border-radius: 44upx;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 88upx;
			margin: 0 auto;
		}
	
		.active {
			background-color: #5276f7;
		}
	}
}
</style>
