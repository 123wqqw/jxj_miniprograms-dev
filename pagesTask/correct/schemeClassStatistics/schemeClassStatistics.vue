<template>
	<view class="scheme-class-container">
		<view class="class-header">
			<x-week-date-calendar @selected-change="datechange" :checkedDate="dateTime" :showRightIcon="false"></x-week-date-calendar>
		</view>
		<view class="class-content">
			<view class="statistics-overview">
				<view class="class-name">{{className}}</view>
				<view class="class-overview">
					共{{classStatisticsData.totalCount}}{{oneText}}{{studentText}}，{{classStatisticsData.completeCount}}{{oneText}}已完成。完成率{{!classStatisticsData.totalCount? '0' : parseFloat(((classStatisticsData.completeCount*100)/classStatisticsData.totalCount).toFixed(2))}}%
				</view>
				<view class="progress">
					<view class="active-line" :style="{width:!classStatisticsData.totalCount? '0%' : parseFloat(((classStatisticsData.completeCount*100)/(classStatisticsData.totalCount)).toFixed(2)) + '%'}"></view>
				</view>
			</view>
			<view class="statistics-list">
				<view class="list-title">
					<view class="td wd-flex">姓名</view>
					<view class="td wd-flex">完成情况</view>
				</view>
				<view class="list-li" v-for="(item,index) in classStatisticsData.schemeClockStudents" :key="index" @click="goStudentDetail(item)">
					<view class="td td-clamp wd-flex">{{item.name}}</view>
					<view class="td td-normal wd-flex">
						<view class="text" v-if="item.totalCount"><label>{{item.completeCount}}</label>/{{item.totalCount}}</view>
						<view class="text" v-if="!item.totalCount">方案未生成</view>
						<image class="arrow-img" src="../../static/images/correctTask/arrow-black.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getReq,postReq} from "../../../common/request.js";
	import {URL} from "../../../common/url.js";
	import xWeekDateCalendar from "../../components/x-week-date-calendar/x-week-date-calendar.vue";
	import {formatDate} from "../../components/x-week-date-calendar/generateDates.js";
	export default {
		components: {
			xWeekDateCalendar
		},
		data() {
			return {
				classId: "",
				className: "",
				dateTime: "",
				classStatisticsData: {
					classId: "",
					className: "",
					completeCount: "",
					totalCount: "",
					schemeClockStudents: [],
				},
				isRefresh: false,
				// 国际化
				studentText: this.$t('common.student'),
				oneText: this.$t('common.one'),
			}
		},
		onLoad(options) {
			let _this = this;
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('classStatistics', res => {
				_this.className = res.className;
				_this.classId = res.classId;
				if(res.dateTime){
					_this.dateTime = res.dateTime;
				}else{
					_this.dateTime = formatDate(new Date(), 'yyyy-MM-dd');
				}
				// 动态设置标题
				uni.setNavigationBarTitle({
					title: res.className
				})
				_this.initPageFun();
			})
			uni.setBackgroundColor({
				backgroundColor: "#FFFFFF"
			})
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
		methods: {
			datechange(e) {
				this.dateTime = e.fullDate;
				this.initPageFun();
			},
			initPageFun(){
				let _this = this;
				let params = {
					classId: _this.classId,
					dateTime: _this.dateTime
				}
				getReq(URL.schemeClassClockStatistics,params).then(res => {
					if(res.error == 10000){
						_this.classStatisticsData = res.data;
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			// 去学生详情页面
			goStudentDetail(item){
				let data = {
					studentId: item.studentId,
					studentIds: this.classStatisticsData.schemeClockStudents.map(std => {return std.studentId}),
					dateTime: this.dateTime,
				}
				uni.navigateTo({
					url: "../schemeStudentDetail/schemeStudentDetail",
					success:function(res){
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', data)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.scheme-class-container{
	width: 100%;
	position: relative;
	.class-header{
		width: 100%;
	}
	.class-content{
		width: 100%;
		margin-top: 16upx;
		padding: 0 32upx;
		margin-bottom: env(safe-area-inset-bottom);
		background-color: #FFFFFF;
		.statistics-overview{
			width: 100%;
			height: 205upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.class-name{
				width: 100%;
				margin-bottom: 24upx;
				font-size: 36upx;
				font-weight: 600;
				color: #202020;
			}
			.class-overview{
				width: 100%;
				margin-bottom: 24upx;
				font-size: 30upx;
				font-weight: 400;
				line-height: 42upx;
				color: #464646;
			}
			.progress{
				width: 646upx;
				height: 9upx;
				background-color: #F2F2F2;
				border-radius: 4.5upx;
				position: relative;
				overflow: hidden;
				.active-line{
					height: 100%;
					border-radius: 4.5upx;
					position: absolute;
					left: 0;
					top: 0;
					background-color: #5C8FF7;
				}
			}
		}
		.statistics-list{
			width: 100%;
			// padding: 0 56upx;
			margin-top: 16upx;
			background-color: #FFFFFF;
			.list-title{
				width: 100%;
				height: 88upx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.td{
					font-size: 28upx;
					font-weight: bold;
					color: #202020;
					text-align: left;
					display: flex;
					align-items: center;
				}
				.wd-flex{
					flex: 1;
				}
				.wd-mini{
					width: 168upx;
				}
				.wd-middle{
					width: 225upx;
				}
			}
			.list-li{
				width: 100%;
				height: 88upx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				border-bottom: 1upx solid #E6E6E6;
				.td{
					font-size: 28upx;
					font-weight: 500;
					color: #202020;
					text-align: left;
					display: flex;
					align-items: center;
					.text{
						flex: 1;
					}
					.arrow-img{
						width: 24upx;
						height: 24upx;
					}
				}
				.td-normal{
					font-weight: 400;
					color: #707070;
					label{
						color: #5C8FF7;
					}
				}
				.td-clamp{
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					word-break: break-all;
				}
				.wd-flex{
					flex: 1;
				}
				.wd-mini{
					width: 168upx;
				}
				.wd-middle{
					width: 225upx;
				}
			}
		}
	}
}
</style>
