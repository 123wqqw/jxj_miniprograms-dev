<template>
	<view class="auth-container">
		<!-- 认证卡片 -->
		<view class="auth-card">
			<view class="card-header">
				<text class="header-title">请输入学籍号</text>
			</view>
			
			<view class="form-container">
				<view class="input-group">
					<input 
						class="input-field" 
						type="text" 
						v-model="studentCode" 
						@input="watchForm"
						placeholder="请输入学生学籍号" 
						placeholder-class="input-placeholder"
					/>
				</view>
				
				<button 
					class="next-btn" 
					:class="{ disabled: nextDisabled }"
					:disabled="nextDisabled"
					@click="handleNext"
				>
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
				nextDisabled: true,
				pageType: '', // 'forgot' 或 'register'
				pageTitle: '',
			}
		},
		onLoad(options) {
			// 根据参数设置页面类型
			this.pageType = options.type || 'forgot';
			this.initPageConfig();
			
			uni.setNavigationBarTitle({
				title: this.pageTitle
			})
		},
		methods: {
			// 初始化页面配置
			initPageConfig() {
				if (this.pageType === 'register') {
					this.pageTitle = '账号注册 ';
				} else {
					this.pageTitle = '忘记账号或密码';
				}
			},
			
			// 监听表单变化
			watchForm() {
				this.nextDisabled = !this.studentCode.trim();
			},
			
			// 处理下一步
			handleNext() {
				if (this.nextDisabled) return;
				
				if (this.pageType === 'register') {
					this.checkStudentIdForRegister();
				} else {
					this.checkStudentIdForForgot();
				}
			},
			
			// 注册时验证学籍号
			checkStudentIdForRegister() {
				uni.showLoading({
					title: '验证中...'
				});
				
				getReq(URL.apiGetVerifStudentIDNumber, {
					studentCode: this.studentCode
				}).then(res => {
					uni.hideLoading();
					if (res.error == 10000) {
						// 学籍号存在，跳转到学生信息确认页面
						if(res.data != ''){
							uni.navigateTo({
							url: `/pages/login/forgotPassword/step2?contactInformation=${res.data}&studentCode=${this.studentCode}`
						})
						}else{
							uni.navigateTo({
							url: `/pages/login/register/step2?studentCode=${this.studentCode}`
						})
						}
						
					} else if (res.error == 10001) {
						showToast('学籍号不存在');
					} else if (res.error == 10002) {
						showToast('未查询到在读学校信息，不可注册绑定');
					} else {
						showToast(res.message || '验证失败');
					}
				}).catch(err => {
					uni.hideLoading();
					showToast('网络错误，请重试');
				})
			},
			
			// 忘记密码时验证学籍号
			checkStudentIdForForgot() {
				uni.showLoading({
					title: '验证中...'
				});
				
				getReq(URL.apiGetVerifStudentIDNumber, {
					studentCode: this.studentCode
				}).then(res => {
					uni.hideLoading();
					if (res.error == 10000) {
						// 学籍号存在，跳转到学生信息确认页面
						if(res.data != ''){
							uni.navigateTo({
							url: `/pages/login/forgotPassword/step2?contactInformation=${res.data}&studentCode=${this.studentCode}`
						})
						}
						
					} else if (res.error == 10001) {
						showToast('学籍号不存在');
					} else if (res.error == 10002) {
						showToast('未查询到在读学校信息，不可注册绑定');
					} else {
						showToast(res.message || '验证失败');
					}
				}).catch(err => {
					uni.hideLoading();
					showToast('网络错误，请重试');
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.auth-container {
		width: 100%;
		min-height: 100vh;
		background: #FFFFFF;
		display: flex;
		box-sizing: border-box;
	}

	.auth-card {
		width: 100%;
		background: #FFFFFF;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
        padding: 40rpx 60rpx;
	}

	.card-header {
	}

	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
	}

	.form-container {
		margin-top: 40rpx;
	}

	.input-group {
		margin-bottom: 60rpx;
	}

	.input-field {
		width: 100%;
		height: 88rpx;
		background: #FFFFFF;
		border: 1rpx solid #CCC;
		border-radius: 8rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #333333;
		box-sizing: border-box;
		transition: border-color 0.3s ease;

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