<template>
	<view class="maxBox">
		<u-toast ref="uToast"/>
		<form class="formBox" @submit="formSubmit">
			<view class="formItem">
				<view class="formLeft">
					{{$t('mine.mine.editPhone.bindPassword')}}:
				</view>
				<input class="input-main" type="digit" v-model="form.password" :placeholder="$t('mine.mine.editPhone.pleaseInputPsw')" placeholder-class="clock-input-placeholder" />
			</view>
			<view class="formItem flexItem">
				<view class="formLeft">
					{{$t('mine.mine.editPhone.newPhoneNumber')}}:
				</view>
				<view class="areaNumber">
					<u-dropdown>
						<u-dropdown-item v-model="areaCode" :title="title1" :options="areaNumberList" @change="changeNumber"></u-dropdown-item>
					</u-dropdown>
				</view>
				<input class="input-main" style="margin-left: 20upx;" type="digit" v-model="form.phone" :placeholder="$t('mine.mine.editPhone.pleaseInputNewPhoneNumber')" placeholder-class="clock-input-placeholder" />
			</view>
			<view class="formItem">
				<view class="formLeft">
					{{$t('mine.mine.editPhone.yan')}}&nbsp;&nbsp;{{$t('mine.mine.editPhone.zheng')}}&nbsp;&nbsp;{{$t('mine.mine.editPhone.ma')}}:
				</view>
				<input class="input-main" type="digit" v-model="form.code" :placeholder="$t('mine.mine.editPhone.pleaseInputVerifyCode')" placeholder-class="clock-input-placeholder" />
				<view class="yzCode" style="color: #5C8FF7;" @click="getCode">
					{{btnContent}}
				</view>
			</view>
			<button type="primary" class="submit-btn" form-type="submit" @click="login">{{$t('common.enter')}}</button>
		</form>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
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
				areaCode: '+86',
				title1: '+86',
				areaNumberList: [
					{
						label: '+86',
						value: '+86',
					},
					{
						label: '+853',
						value: '+853',
					},
					// {
					// 	label: '+852',
					// 	value: '852',
					// },
					// {
					// 	label: '+886',
					// 	value: '886',
					// }
				],
				form: {
					code: '',
					phone: '',
					password: ''
				},
				btnContent: this.$t('mine.mine.editPhone.getVerifyCode'),
				time: 0,
				phoneNum: '',
				
				// 国际化
				pleaseInputVerifyCode: this.$t('mine.mine.editPhone.pleaseInputVerifyCode'),
				getVerifyCode: this.$t('mine.mine.editPhone.getVerifyCode'),
				reGetVerifyCode: this.$t('mine.mine.editPhone.reGetVerifyCode'),
				pleaseInputPhoneNumber: this.$t('mine.mine.editPhone.pleaseInputPhoneNumber'),
				phoneNumberErrorWarning: this.$t('mine.mine.editPhone.phoneNumberErrorWarning'),
				verifyCodeSendSuccess: this.$t('mine.mine.editPhone.verifyCodeSendSuccess'),
				reSend: this.$t('mine.mine.editPhone.reSend'),
			}
		},
		onLoad(){
			uni.setNavigationBarTitle({
				title: this.$t('mine.mine.editPhone.title')
			})
			this.account = this.xiaotiyunUser.teacher.teacherAccount
		},
		computed:{
			...mapState(['xiaotiyunUser']),
		},
		methods:{
			...mapMutations(['setXiaotiyunUser']),
			// 显示顶部消息
			showToptipsErr(msg) {
				this.$refs.uToast.show({
					title: msg,
					type: 'warning',
					duration: '2000',
					position:'top'
				})
			},
			changeNumber(e) {
				this.areaCode = e
				this.title1 = this.areaNumberList.find(item => item.value === e).label
			},
			// 获取验证码
			getCode(){
			    let _this = this;
				if(_this.btnContent != _this.reGetVerifyCode && _this.btnContent != _this.getVerifyCode) {
					return
				}
			    let reg = 11&& /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;//手机号正则验证
				let macaoReg = /^(\d{8})$/;
			    let phoneNum = _this.form.phone;
			    if(!phoneNum){
			      return this.showToptipsErr(_this.pleaseInputPhoneNumber);
			    } else if(!reg.test(phoneNum) && !macaoReg.test(phoneNum)){
			      return _this.showToptipsErr(_this.phoneNumberErrorWarning);
			    }
			    _this.time = 60;
			    _this.timer();
				let areaCode = _this.areaCode;
			    let params = {
			      phone: phoneNum,
				  areaCode:areaCode.replace("+","")
			    }
				_this.phoneNum = _this.form.phone;
			    // 获取验证码
				getReq(URL.getVerifyCode,params).then(res => {
					console.log(res);
					if(res.error == 10000){
						// 请求成功
						uni.showToast({
							title: _this.verifyCodeSendSuccess,
							icon: 'none',
							duration: 2000
						})
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			timer(){
			    let _this = this;
			    // _this.sendCodeStatus = true;
			    if(_this.time>0){
					_this.btnContent = `${_this.time}s ${_this.reSend}`;
					// _this.btnDisabled = true;
					_this.time--;
					var timer = setTimeout(this.timer,1000);
			    }else if(_this.time == 0){
					_this.btnContent = _this.reGetVerifyCode;
					// _this.btnDisabled = false;
					clearTimeout(timer);
			    }
			},
			formSubmit(e) {
				console.log(e)
			},
			login() {
				if(!this.form.code){
					uni.showToast({
						title: _this.pleaseInputVerifyCode,
						icon: 'none',
						duration: 2000
					})
					return
				}
				let params = {
					account:this.account,
					password:this.form.password,
					phone:this.form.phone,
					code: this.form.code,
					areaCode: this.areaCode
				}
				postReq(URL.teachersUpdatePhone,params).then(res => {
					console.log(res);
					if(res.error == 10000){
						// 请求成功
						uni.showToast({
							title: '更改成功！',
							icon: 'none',
							duration: 2000
						})
						let xiaotiyunUser = {
							teacher: {
								...this.xiaotiyunUser.teacher,
								phone: this.form.phone
							}
						};
						this.setXiaotiyunUser(xiaotiyunUser);
						uni.navigateBack({
							delta: 1
						})
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.maxBox{
		width: 750upx;
		// overflow: scroll;
		padding-top: 16upx;
		.formBox {
			width: 750upx;
			// height: 264upx;
			box-sizing: border-box;
			// min-height: 800upx;
			overflow: hidden;
			.formItem {
				padding-left: 32upx;
				background: #FFFFFF;
				height: 88upx;
				line-height: 88upx;
				font-size: 28upx;
				color: #202020;
				border-bottom: 1upx solid #DDDDDD;
				position: relative;
				.formLeft {
					width: 140upx;
					float: left;
					display: flex;
					justify-content: space-around;
					margin-right: 8upx;
				}
				.areaNumber {
					// width:750upx;
					// position: absolute;
					// left: 166upx;
					// top: 4upx;
					position: relative;
					display: flex;
					align-items: center;
				}
				.input-main {
					float: left;
					height: 88upx;
				}
				.yzCode {
					font-size: 28upx;
					width: 160upx;
					float: right;
					text-align: left;
				}
			}
			.submit-btn{
				width: 638upx;
				height: 88upx;
				background-color: #5C8FF7;
				border: none;
				border-radius: 44upx;
				font-size: 28upx;
				line-height: 88upx;
				color: #FFFFFF;
				margin-top: 88upx;
			}
		}
	}
	::v-deep .u-dropdown__content {
		width: 750upx!important;
		margin-left: -166upx;
	}
	::v-deep .u-dropdown__content__popup {
		width: 750upx;
		// margin-left: -100upx;
	}
	.flexItem{
		display: flex;
	}
</style>
