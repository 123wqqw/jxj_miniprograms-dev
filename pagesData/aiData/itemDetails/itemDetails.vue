<template>
	<view class="maxBox">
		<view class="title">
			共  <text style="color: #5C8FF7;margin: 0 10upx;">{{list.length}}</text>  {{$t('common.tiao')}}{{$t('common.record')}}
		</view>
		<view class="main">
			<view class="main-header">
				<text>{{$t('common.orderNumber')}}</text><text>{{$t('common.sport')}}{{$t('common.time')}}</text><text>{{$t('common.sport')}}{{$t('common.minute')}}</text><text>{{$t('common.sport')}}{{$t('common.quantity')}}</text>
			</view>
			<view class="main-item" v-for="(item,index) in list" :key="index">
				<text>{{index+1}}</text><text>{{item.exerciseDateStr}}</text><text>{{item.capitaExerciseTime}}</text><text>{{item.exerciseScore}}个</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list:[]
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('dailyDetailList', data=> {  
				// console.log('传来的项目详情',data)
				this.list=data.list
				this.list.map(item=>{
					item.exerciseDateStr =	this.formatDate(new Date(item.exerciseDate),"MM/dd hh:mm").replaceAll("/",".")
				})
				uni.setNavigationBarTitle({
					title: data.name
				})
			})
		},
		methods: {
			formatDate(date, fmt) {
			  if (/(y+)/.test(fmt)) {
			    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
			  }
			  let o = {
			    'M+': date.getMonth() + 1,
			    'd+': date.getDate(),
			    'h+': date.getHours(),
			    'm+': date.getMinutes(),
			    's+': date.getSeconds()
			  }
			  for (let k in o) {
			    if (new RegExp(`(${k})`).test(fmt)) {
			      let str = o[k] + ''
			      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
			    }
			  }
			  return fmt
			},
			padLeftZero(str) {
			  return ('00' + str).substr(str.length)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox{
		width: 750upx;
		height: 100%;
		background: #FFFFFF;
		border-top: 1px solid #e5e5e5;
		overflow: scroll;
		.title{
			height: 66upx;
			line-height: 66upx;
			padding-left: 32upx;
			font-size: 24upx; 
			font-weight: 400;
			color: #202020;
		}
		.main{
			box-sizing: border-box;
			padding: 0 32upx;
			
			.main-header{
				width: 686upx;
				height: 56upx;
				background: #F9F8F8;
				border-radius: 8upx;
				font-size: 24upx; 
				font-weight: 400;
				color: #707070;
				line-height: 56upx;
				>text:nth-of-type(1){
					margin-left:24upx ;
				}
				>text:nth-of-type(2){
					margin-left:80upx ;
				}
				>text:nth-of-type(3){
					margin-left:108upx ;
				}
				>text:nth-of-type(4){
					margin-left:80upx ;
				}
			}
			.main-item{
				width: 686upx; 
				 height: 72upx;
				 line-height: 72upx; 
				border-bottom: 1upx solid #DDDDDD;
				font-size: 24upx; 
				font-weight: 400;
				color: #202020;
				position: relative;
				>text:nth-of-type(1){
					margin-left:24upx ;
					width:48upx;
					text-align: center;
					margin-left: 24upx;
					margin-right: 80upx;
					display: inline-block;
				}
				>text:nth-of-type(2){
				/* 	margin-left:80upx ; */
				}
				>text:nth-of-type(3){
					 position: absolute;
					 left:356upx ;
				 
				}
				>text:nth-of-type(4){
					position: absolute;
					left:532upx ;
				 
				}
			}
			.main-item:last-child{
				border: 0;
			}
		}
		
	}
</style>
