<template>
	<view class="maxBox">
		<view class="data-item" v-for="item in list" :key="item.classId" @click="navClassDetails(item.classId)">
			<view class="className">
				<view>{{item.gradeNameA}}</view>
				<view>{{item.number}}班</view>
			</view>
			<view class="classNumber">
				{{item.classNumber}}<view class="help-icon" v-if="item.classManageType == 2">{{$t('common.help')}}</view>
			</view>
			<view class="studentNum">
				{{$t('common.student')}}：<text style="color: #202020;">{{item.studentNum?item.studentNum:0}}</text>名
			</view>
			<view class="todayExerciseNum">
				今日{{$t('common.sport')}}：<text style="color:#5C8FF7 ;">{{item.todayExerciseNum?item.todayExerciseNum:0}}</text> 人
			</view>
			<view class="yesterdayExerciseNum">
				昨日{{$t('common.sport')}}：{{item.yesterdayExerciseNum?item.yesterdayExerciseNum:0}}人
			</view>
			<image src="../../../static/images/common/arrow-black.png" class="jian"></image>
		</view>
		<view class="no-data" v-if="list.length==0">
			<view class="warning-box">
				<image src="../../static/images/nullFianco.png" mode="aspectFill" class="no-data-icon"></image>
				<text>{{$t('common.none')}}{{$t('data.aiData.index.title')}}</text>
			</view> 
		</view>
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
	export default {
		data() {
			return {
				list:[],
				gradeText: this.$t('common.gradeText'),
			}
		},
		onLoad(){
			uni.setNavigationBarTitle({
				title: this.$t('data.aiData.index.title')
			})
			this.getList()
		},
		methods:{
			getList(){
				getReq(URL.getClassStatisticsList).then(res=>{
					if(res.error==10000){
						let _this = this
						if(res.data){
							this.list=res.data.map(function(item){
								return {
									...item,
									gradeNameA: _this.getGradeContent(item.grade)
								}
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
			getGradeContent(i) {
				let Class = [`一${this.gradeText}`, `二${this.gradeText}`, `三${this.gradeText}`, `四${this.gradeText}`, `五${this.gradeText}`, `六${this.gradeText}`, "初一", "初二", "初三", "高一", "高二", "高三"];
				return Class[i - 1];
			},
			navClassDetails(classId){   
				uni.navigateTo({
					url:'/pagesData/aiData/classDetails/classDetails?classId='+classId
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.maxBox {
		width: 750upx;
		overflow: scroll;
		padding-top: 27upx;

		/* background: #F5F5F5; */
		.data-item {
			width: 702upx;
			height: 144upx;
			background: #FFFFFF;
			box-shadow: 0px 0px 8upx 0px rgba(112, 112, 112, 0.1);
			border-radius: 24upx;
			margin-bottom: 20upx;
			margin-left: 24upx;
			position: relative;

			.className {
				width: 96upx;
				height: 96upx;
				background: #5C8FF7;
				border-radius: 12upx;
				border: 2upx solid #5C8FF7;
				font-size: 24upx;
				font-weight: 500;
				color: #FFFFFF;
				// padding: 15upx 11upx;
				box-sizing: border-box;
				position: absolute;
				top: 23upx;
				left: 32upx;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}

			.classNumber {
				height: 36upx;
				font-size: 28upx;
				font-weight: 500;
				color: #202020;
				position: absolute;
				top: 28upx;
				left: 144upx;
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

			.studentNum {
				height: 36upx;
				font-size: 28upx;
				font-weight: 400;
				color: #707070;
				position: absolute;
				bottom: 29upx;
				left: 144upx;
			}

			.todayExerciseNum {
				height: 36upx;
				font-size: 24upx;
				font-weight: 400;
				color: #464646;
				position: absolute;
				top: 32upx;
				right: 80upx;
			}

			.yesterdayExerciseNum {
				font-size: 24upx;
				font-weight: 400;
				color: #464646;
				position: absolute;
				bottom: 32upx;
				right: 80upx;
			}

			.jian {
				width: 17upx;
				height: 32upx;
				position: absolute;
				top: 56upx;
				right: 39upx;
			}
		}
		.no-data{
			width: 100%;
			height: 100vh;
			display: flex;
			justify-content: center;
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
	}
</style>
