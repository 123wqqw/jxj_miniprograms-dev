<template>
	<view class="register-container">
		<!-- 注册卡片 -->
		<view class="register-card">
			<view class="card-header">
				<text class="header-title">请输入绑定的手机号</text>
			</view>

			<view class="form-container">
				<view class="input-group">
					<view class="phone-input-wrapper">
						<text class="country-code">+86</text>
						<input class="phone-input" type="number" v-model="contactInformation" @input="watchForm"
							placeholder="请输入手机号" placeholder-class="input-placeholder" maxlength="11" />
					</view>
				</view>

				<button class="next-btn" :class="{ disabled: nextDisabled }" :disabled="nextDisabled"
					@click="handleNext">
					下一步
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import {
	postReq,
	getReq
} from "../../../common/request.js";
import {
	URL
} from "../../../common/url.js";
import {
	showToast
} from '@/common/util.js'

export default {
	data() {
		return {
			studentCode: '',
			studentName: '',
			className: '',
			contactInformation: '',
			nextDisabled: true
		}
	},
	onLoad(options) {
		uni.setNavigationBarTitle({
			title: '账号注册'
		})
		console.log(options,555555);
		if (options.studentCode) {
			this.studentCode = options.studentCode||'';
		}
	},
	methods: {
		// 监听表单变化
		watchForm() {
			// 验证手机号格式
			const phoneRegex = /^1[3-9]\d{9}$/;
			this.nextDisabled = !this.contactInformation.trim() || !phoneRegex.test(this.contactInformation);
		},

		// 处理下一步
		handleNext() {
			if (this.nextDisabled) return;
			console.log(this.contactInformation,555555,this.studentCode);
			
			// 跳转到验证码页面
			uni.navigateTo({
					url: `/pages/login/forgotPassword/step2?contactInformation=${this.contactInformation}&studentCode=${this.studentCode}`
				})

		}
	}
}
</script>

<style lang="scss" scoped>
.register-container {
	width: 100%;
	min-height: 100vh;
	background: #FFFFFF;
	display: flex;
	box-sizing: border-box;
}

.register-card {
	width: 100%;
	background: #FFFFFF;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
	padding: 40rpx 60rpx;
}

.card-header {
	font-size: 36rpx;
	font-weight: 600;
}

.header-title {
	display: block;
	color: #333333;
}

.form-container {
	margin-top: 40rpx;
}


.input-group {
	margin-bottom: 60rpx;
}

.phone-input-wrapper {
	display: flex;
	align-items: center;
	height: 88rpx;
	background: #FFFFFF;
	border: 1rpx solid #CCC;
	border-radius: 16rpx;
	overflow: hidden;
	transition: border-color 0.3s ease;

}

.country-code {
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333333;
	background: #F8F9FA;
	border-right: 1rpx solid #CCC;
	height: 100%;
	display: flex;
	align-items: center;
}

.phone-input {
	flex: 1;
	height: 100%;
	padding: 0 24rpx;
	font-size: 28rpx;
	border: 1rpx solid #CCC;
	color: #333333;
	border: none;
	background: transparent;
}

.input-placeholder {
	color: #999999;
}

.next-btn {
	width: 300rpx;
	height: 88rpx;
	border: none;
	border-radius: 48rpx;
	font-size: 36rpx;
	background: #e4ecfb;
	color: #2C84FF;
	transition: all 0.3s ease;
	text-align: center;
	font-weight: 600;

	&.disabled {
		background: #EEE;
		color: #999999;
		border: none;
	}

	&::after {
		border: unset;
	}
}
</style>
