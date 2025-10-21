<template>
	<view class="maxBox">
		<u-mask :show="show" :mask-click-able="false"></u-mask>
		<view class="max2Box" v-if="show">
			<view class="title">提醒</view>
			<view class="info">{{$t('task.assign.assignNewWork.classTaskWarningText')}}</view>
			<view class="radio-content">
				<radio class="radio-box" :checked="noReplaceWork" @click="changeNoReplace" color="#5C8FF7"></radio>
				<label class="radio-label">{{$t('task.assign.assignNewWork.classTaskWarningOption1')}}</label>
			</view>
			<view class="radio-content">
				<radio class="radio-box" :checked="replaceWork" @click="changeReplaceWork" color="#5C8FF7"></radio>
				<label class="radio-label">{{$t('task.assign.assignNewWork.classTaskWarningOption2')}}</label>
			</view>
			<view class="line"></view>
			<view class="footBox">
				<view type="primary" class="cancel-btn" @click="cancel">取消</view>
				<button type="primary" class="submit-btn" form-type="submit" @click="login">{{$t('common.enterOld')}}</button>
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
				replaceWork: false,
				noReplaceWork: true,
				isReplace: 1,
				form: {
					phone: '',
					school: '',
					account: '',
					password: ''
				},
				time: 0,
				show: true
			}
		},
		onLoad(){

		},
		methods:{
			changeNoReplace() {
				this.replaceWork = false
				this.noReplaceWork = true
			},
			changeReplaceWork() {
				this.replaceWork = true
				this.noReplaceWork = false
			},
			cancel() {
				this.$emit("close",false)
			},
			login() {
				if(this.replaceWork) {this.isReplace = 2}
				if(this.noReplaceWork) {this.isReplace = 1}
				this.$emit("gonone",this.isReplace)
				this.$emit("close",false)
				// uni.switchTab({
				// 	url: "/pages/home/index/index"
				// })
				// uni.navigateTo({
				// 	url: "/pages/mine/classConcat/calssConcat"
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox {
		.max2Box{
			z-index: 10900;
			width: 560upx;
			height: 445upx;
			background: #FFFFFF;
			border-radius: 24upx;
			position: absolute;
			left: 0;
			top: 450upx;
			right: 0;
			// bottom: 0;
			margin: auto;
			.title {
				margin: 48upx 0 24upx;
				font-size: 34upx;
				font-weight: 500;
				color: #333333;
				text-align: center;
				// line-height: 48px;
			}
			.info {
				font-size: 28upx;
				color: #707070;
				text-align: center;
			}
			.radio-content {
				margin-top: 28upx;
				font-size: 28upx;
				color: #B2B2B2;
				// text-align: left;
				padding-left: 128upx;
				.radio-box {
					transform:scale(0.7);
					vertical-align: middle;
				}
				.radio-label {
					vertical-align: middle;
				}
			}
			.line {
				width: 496upx;
				height: 1upx;
				background: #dddddd;
				position: absolute;
				top: 320upx;
				left: 32upx;
			}
			.footBox {
				margin-top: 42upx;
				font-size: 34upx;
				display: flex;
				justify-content: space-between;
				padding: 0 56upx;
				.cancel-btn {
					color: #707070;
					width: 208upx;
					height: 70upx;
					background: #FFFFFF;
					text-align: center;
					line-height: 70upx;
			    }
				.submit-btn {
					width: 208upx;
					height: 70upx;
					background: #5C8FF7;
					border-radius: 40px;
					color: #FFFFFF;
					line-height: 70upx;
				}
			}
		}
	}
</style>