<template>
	<view class="maxBox">
		<form class="formBox" @submit="formSubmit">
			<u-toast ref="uToast" />
			<view class="formItem" style="margin-top: 16upx;display: flex;">
				<view class="formLeft">
					{{$t('main.login.bindPhone.phoneNumber')}}:
				</view>
				<view class="areaNumber">
					<!-- <view class=""> -->
					<u-dropdown>
						<u-dropdown-item v-model="areaCode" :title="title1" :options="areaNumberList"
							@change="changeNumber"></u-dropdown-item>
					</u-dropdown>
					<!-- </view> -->
				</view>
				<input class="input-main" type="digit" style="margin-left: 20upx;" v-model="form.phone" maxlength="15"
					@input="watchForm" :placeholder="$t('main.login.bindPhone.pleaseInputNewPhoneNumber')"
					placeholder-class="clock-input-placeholder" />
			</view>
			<view class="formItem" style="border: 0;">
				<view class="formLeft">
					{{$t('main.login.bindPhone.verifyCode')}}:
				</view>
				<input class="input-main" type="digit" v-model="form.code" maxlength="6" @input="watchForm"
					:placeholder="$t('main.login.bindPhone.pleaseInputVerifyCode')"
					placeholder-class="clock-input-placeholder" />
				<view class="yzCode" @click="getCode">
					{{btnContent}}
				</view>
			</view>
			<button v-if="loginVisible" type="primary" class="submit-btn" style="background: #DDDDDD;"
				form-type="submit" :disabled="loginVisible">{{$t('main.login.bindPhone.enter')}}</button>
			<button v-else type="primary" class="submit-btn" form-type="submit" :disabled="loginVisible"
				@click="login">{{$t('main.login.bindPhone.enter')}}</button>
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
			loginVisible: true,
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
				phone: '',
				code: ''
			},
			btnContent: this.$t('main.login.bindPhone.getVerifyCode')
		}
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: this.$t('main.login.bindPhone.title')
		})
	},
	computed: {
		...mapState(['xiaotiyunUser']),
	},
	methods: {
		...mapMutations(['setXiaotiyunUser', 'setTeacherTabBar']),
		formSubmit(e) {
			console.log(e)
		},
		changeNumber(e) {
			this.areaCode = e
			this.title1 = this.areaNumberList.find(item => item.value === e).label
		},
		// 监听form是否为空
		watchForm() {
			let _this = this
			_this.loginVisible = false;
			Object.keys(_this.form).forEach(function (x) {
				if (_this.form[x] == null || _this.form[x] == "") {
					_this.loginVisible = true;
				}
			});
			// if(isEmpty){//值全为空
			// 	return true;
			// }
			// return false;
		},
		// 显示顶部消息
		showToptipsErr(msg) {
			this.$refs.uToast.show({
				title: msg,
				type: 'warning',
				duration: '2000',
				position: 'top'
			})
		},
		// 获取验证码
		getCode() {
			let _this = this;
			if (_this.btnContent != this.$t('main.login.bindPhone.reGetVerifyCode') && _this.btnContent != this.$t('main.login.bindPhone.getVerifyCode')) {
				return
			}
			console.log(5)
			let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;//手机号正则验证
			let macaoReg = /^(\d{8})$/;
			let phoneNum = _this.form.phone;
			if (!phoneNum) {
				return this.showToptipsErr(this.$t('main.login.bindPhone.pleaseInputPhoneNumber'));
			} else if (!reg.test(phoneNum) && !macaoReg.test(phoneNum)) {
				return _this.showToptipsErr(this.$t('main.login.bindPhone.phoneNumberErrorWarning'));
			}
			_this.time = 60;
			_this.timer();
			let areaCode = _this.areaCode;
			let params = {
				phone: phoneNum,
				areaCode: areaCode.replace("+", "")
			}
			_this.phoneNum = _this.form.phone;
			// 获取验证码
			getReq(URL.getVerifyCode, params).then(res => {
				console.log(res);
				if (res.error == 10000) {
					// 请求成功
					uni.showToast({
						title: this.$t('main.login.bindPhone.verifyCodeSendSuccess'),
						icon: 'none',
						duration: 2000
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
				}
			})
		},
		timer() {
			let _this = this;
			// _this.sendCodeStatus = true;
			if (_this.time > 0) {
				_this.btnContent = `${_this.time}s ${this.$t('main.login.bindPhone.reSend')}`;
				// _this.btnDisabled = true;
				_this.time--;
				var timer = setTimeout(this.timer, 1000);
			} else if (_this.time == 0) {
				_this.btnContent = this.$t('main.login.bindPhone.reGetVerifyCode');
				// _this.btnDisabled = false;
				clearTimeout(timer);
			}
		},

		login() {
			console.log(this.xiaotiyunUser.teacher, 111222)
			let params = {
				teacherId: this.xiaotiyunUser.teacher.teacherId,
				areaCode: this.areaCode,
				phone: this.form.phone,
				code: this.form.code
			}
			postReq(URL.teachersBandPhone, params).then(res => {
				if (res.error == 10000) {
					let xiaotiyunUser = {
						teacher: {
							...this.xiaotiyunUser.teacher,
							phone: this.form.phone,
							isOnePass: true
						}
					};
					this.setXiaotiyunUser(xiaotiyunUser);
					this.setTeacherTabBar();
					uni.switchTab({
						url: "/pages/home/index/index"
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message,
						duration: 1000
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.maxBox {
	width: 750upx;
	overflow: scroll;

	.formBox {
		width: 750upx;
		height: 176upx;
		margin-top: 16upx;
		box-sizing: border-box;

		.formItem {
			padding: 0 32upx;
			background: #FFFFFF;
			height: 88upx;
			line-height: 88upx;
			font-size: 28upx;
			color: #202020;
			border-bottom: 1upx solid #DDDDDD;

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
				// left: 0;
				// top: 20upx;
				position: relative;
				display: flex;
				align-items: center;
			}

			.input-main {
				float: left;
				height: 88upx;
			}

			.clock-input-placeholder {
				color: #B2B2B2;
			}

			.yzCode {
				font-size: 24upx;
				width: 120upx;
				float: right;
				color: #5C8FF7;
			}
		}

		// .forgetPassword {
		// 	width: 100%;
		// 	margin-top: 24upx;
		// 	padding-right: 32upx;
		// 	text-align: right;
		// 	font-size: 28upx;
		// 	color: #202020;
		// 	margin-bottom: 48upx;
		// }
		.submit-btn {
			width: 638upx;
			height: 88upx;
			margin-top: 120upx;
			background-color: #5C8FF7;
			border: none;
			border-radius: 44upx;
			font-size: 28upx;
			line-height: 88upx;
			color: #FFFFFF;
		}
	}

	// .active{
	// 	background-color: #26BF96;
	// }
	// .code {
	// 	margin-top: 40upx;
	// 	color: #5C8FF7;
	// 	text-align: center;
	// 	font-size: 28upx;
	// 	font-weight: 400;
	// }
	// ::v-deep .input-value {
	// 	border: 0;
	// }
	// ::v-deep .uni-data-tree {
	// 	position: relative;
	// 	bottom: -6upx;
	// 	left: -10upx;
	// }
	// ::v-deep .arrow-area {
	// 	display: none;
	// }
}

::v-deep .u-dropdown__content {
	width: 750upx !important;
	margin-left: -166upx;
}

::v-deep .u-dropdown__content__popup {
	width: 750upx;
	// margin-left: -100upx;
}

.flexItem {
	display: flex;
}
</style>
