<template>
	<view class="scheme-container">
		<view class="scheme-header">
			<x-week-date-calendar @selected-change="datechange" :showRightIcon="false"></x-week-date-calendar>
		</view>
		<view class="scheme-content">
			<view class="scheme-overview">
				<view class="overview-content">共{{schemeData.totalCount}}{{oneText}}{{studentText}}，{{schemeData.completeCount}}{{oneText}}已完成。完成率{{!schemeData.totalCount? '0' : parseFloat(((schemeData.completeCount*100)/schemeData.totalCount).toFixed(2))}}%</view>
			</view>
			<view class="class-content">
				<view class="class-li" v-for="(item,index) in schemeData.schemeClockClass" :key="index">
					<view class="li-top" @click="goClassStatistics(item)">
						<view class="left">
							<view class="basic-info">
								<view class="class-name">{{item.className}}<view class="help-icon" v-if="item.classManageType == 2">{{$t('common.help')}}</view></view>
								<view class="warning-info">
									<view class="text">完成情况：<label>{{item.completeCount}}</label>/{{(item.totalCount)}}（{{parseFloat(((item.completeCount*100)/(item.totalCount)).toFixed(2))}}%）</view>
								</view>
							</view>
							<view class="progress">
								<view class="active-line" :style="{width: !item.totalCount? '0%' :parseFloat(((item.completeCount*100)/(item.totalCount)).toFixed(2)) + '%'}"></view>
							</view>
						</view>
						<view class="right">
							<image class="arrow-img" src="../../static/images/correctTask/arrow-black.png" mode="aspectFill"></image>
						</view>
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
				dateTime: formatDate(new Date(), 'yyyy-MM-dd'),
				schemeData: {
					completeCount: 0,
					totalCount: 0,
					schemeClockClass: [],
				},
				isRefresh: false,
				// 国际化
				studentText: this.$t('common.student'),
				oneText: this.$t('common.one'),
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('task.correct.schemeIndex.title')
			})
		},
		onShow() {
			let _this = this;
			// console.log(_this.isRefresh);
			if(_this.isRefresh){
				// TODO: 处方没移到新项目中 不请求接口
				// _this.getSchemeClockStatistics(_this.dateTime);
				_this.isRefresh = false;
			}
		},
		onHide() {
			this.isRefresh = true;
		},
		created() {
			// TODO: 处方没移到新项目中 不请求接口
			// this.getSchemeClockStatistics(this.dateTime);
		},
		onPullDownRefresh() {
			let _this = this;
			setTimeout(() => {
				// TODO: 处方没移到新项目中 不请求接口
				// _this.getSchemeClockStatistics(_this.selectedDate);
				uni.stopPullDownRefresh();
			}, 0)
		},
		methods: {
			datechange(e) {
				this.dateTime = e.fullDate;
				// TODO: 处方没移到新项目中 不请求接口
				// this.getSchemeClockStatistics(e.fullDate);
			},
			getSchemeClockStatistics(dateTime){
				let params = {
					dateTime: dateTime
				}
				getReq(URL.schemeClockStatistics,params).then(res => {
					if(res.error == 10000){
						// console.log(res.data);
						this.schemeData = res.data;
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			// 去班级统计页面
			goClassStatistics(item){
				let classStatisticsParams = {
					className: item.className,
					classId: item.classId,
					dateTime: this.dateTime,
				}
				uni.navigateTo({
					url: "/pagesTask/correct/schemeClassStatistics/schemeClassStatistics",
					success:function(res){
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('classStatistics', classStatisticsParams)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.scheme-container{
	width: 100%;
	position: relative;
	.scheme-header{
		width: 100%;
	}
	.scheme-content{
		width: 100%;
		margin-top: 16upx;
		margin-bottom: env(safe-area-inset-bottom);
		.scheme-overview{
			width: 100%;
			height: 88upx;
			padding: 0 32upx;
			background-color: #FFFFFF;
			.overview-content{
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				border-bottom: 1upx solid #E6E6E6;
				font-size: 28upx;
				font-weight: 400;
				color: #464646;
			}
		}
	}
	.class-content{
		width: 100%;
		margin-top: 16upx;
		padding: 0 32upx;
		background-color: #FFFFFF;
		.class-li{
			width: 100%;
			height: 126upx;
			padding-bottom: 24upx;
			border-bottom: 1px solid #E6E6E6;
			.li-top{
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left{
					flex: 1;
					height: 100%;
					display: flex;
					flex-direction: column;
					.basic-info{
						width: 100%;
						height: 88upx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.class-name{
							font-size: 32upx;
							font-weight: 600;
							color: #202020;
							display: flex;
							align-items: center;
						}
						.help-icon{
							width: 34upx;
							height: 34upx;
							border-radius: 50%;
							font-size: 24upx;
							color: #FFFFFF;
							line-height: 34upx;
							text-align: center;
							background-color: #464646;
							margin-left: 16upx;
						}
						.warning-info{
							font-size: 28upx;
							font-weight: 400;
							color: #707070;
							display: inline-block;
							label{
								color: #5C8FF7;
								margin-left: 16upx;
							}
						}
					}
					.progress{
						width: 100%;
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
				.right{
					width: 48upx;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.arrow-img{
						width: 17upx;
						height: 33upx;
					}
				}
			}
		}
		.class-li:last-child{
			border: none;
		}
	}
}
</style>
