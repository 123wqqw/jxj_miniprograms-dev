<template>
	<view class="maxBox">
		<u-mask :show="show" :mask-click-able="false"></u-mask>
		<view class="max2Box" v-if="show">
			<view class="info">{{$t('main.home.index.noClassWarning1')}}<label>{{$t('main.home.index.noClassWarning2')}}</label>{{$t('main.home.index.noClassWarning3')}}</view>
			<view class="content">
				<view class="content-text">{{$t('main.home.index.noClassWarningContent1')}}</view>
				<view class="content-text">{{$t('main.home.index.noClassWarningContent2')}}</view>
			</view>
			<view class="btn-box">
				<button type="primary" class="submit-btn-line" form-type="submit" @click="bindHelpClass">{{$t('common.helpClass')}}</button>
				<button type="primary" class="submit-btn" form-type="submit" @click="bindManageClass">{{$t('common.manageClass')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getReq,
		postReq
	} from "../../common/request.js";
	import {
		URL
	} from "../../common/url.js";
	export default {
		data() {
			return {
				form: {
					phone: '',
					school: '',
					account: '',
					password: ''
				},
				btnContent: '获取验证码',
				time: 0,
				show: true
			}
		},
		onLoad(){

		},
		methods:{
			bindManageClass() {
				this.$emit("bindManageClass")
			},
			bindHelpClass(){
				this.$emit("bindHelpClass")
			},
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox {
		// width: 100%;
		// height: 100%;
		// height: 1000upx;
		// background: #000000;
		// opacity: 0.59;
		// position: absolute;
		// z-index: 99999;
		// position: relative;
		.max2Box{
			z-index: 10900;
			width: 560upx;
			height: 369upx;
			background: #FFFFFF;
			border-radius: 24upx;
			position: fixed;
			left: 0;
			top: 30%;
			right: 0;
			// bottom: 0;
			margin: auto;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-top: 24upx;
			.info {
				font-size: 28upx;
				font-weight: 400;
				color: #333333;
				line-height: 88upx;
				text-align: center;
				label{
					color: #5C8FF7;
				}
			}
			.content{
				flex: 1;
				.content-text{
					font-size: 26upx;
					font-weight: 400;
					color: #707070;
					line-height: 37upx;
					text-align: center;
				}
			}
			.btn-box{
				width: 100%;
				height: 134upx;
				border-top: 1upx solid #E6E6E6;
				padding: 0 40upx;
				display: flex;
				align-items: center;
				justify-content: space-around;
			}
			.submit-btn {
				width: 208upx;
				height: 70upx;
				background: #5C8FF7;
				border: 1upx solid #5C8FF7;
				border-radius: 40upx;
				line-height: 70upx;
				font-size: 34upx;
				font-weight: 400;
				color: #FFFFFF;
			}
			.submit-btn-line {
				width: 208upx;
				height: 70upx;
				background: #FFFFFF;
				border: 1upx solid #5C8FF7;
				border-radius: 40upx;
				line-height: 70upx;
				font-size: 34upx;
				font-weight: 400;
				color: #5C8FF7;
			}
		}
	}
</style>

