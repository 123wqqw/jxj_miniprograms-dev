<template>
	<view class="maxBox">
		<u-mask :show="show" :mask-click-able="false"></u-mask>
		<view class="bigBox">
			<view class="title">{{ passwordEditWarning }}</view>
			<input class="input-main" password type="text" v-model="password" :placeholder="editPasswordPlaceholder"
				maxlength="18" placeholder-class="clock-input-placeholder" />
			<view class="line"></view>
			<input class="input-main" password type="text" v-model="rePassword"
				:placeholder="editRePasswordPlaceholder" maxlength="18" placeholder-class="clock-input-placeholder" />
			<view class="line"></view>
			<view class="footBox">
				<view type="primary" class="cancel-btn" @click="cancel">取消</view>
				<button type="primary" class="submit-btn" form-type="submit" @click="login">{{ enter }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import {
		getReq,
		postReq
	} from "../../common/request.js";
	import {
		URL
	} from "../../common/url.js";
	import {
		showToast
	} from '@/common/util.js'
	export default {
		props: {},
		data() {
			return {
				show: true,
				password: '',
				rePassword: '',
				//国际化
				passwordEditWarning: this.$t('main.mine.index.passwordEditWarning'),
				editPasswordPlaceholder: this.$t('main.mine.index.editPasswordPlaceholder'),
				editRePasswordPlaceholder: this.$t('main.mine.index.editRePasswordPlaceholder'),
				enter: this.$t('common.enter'),
				passwordMinSix: this.$t('main.mine.index.passwordMinSix'),
				passwordDifferent: this.$t('main.mine.index.passwordDifferent'),
				passwordNotEqualInit: this.$t('main.mine.index.passwordNotEqualInit'),
				passwordEditSuccess: this.$t('main.mine.index.passwordEditSuccess'),
			}
		},
		onLoad() {

		},
		onShow() {},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		methods: {
			...mapMutations(['setXiaotiyunUser']),
			cancel() {
				this.$emit('newPassword', false)
				let xiaotiyunUser = {
					teacher: {
						...this.xiaotiyunUser.teacher,
						isOnePass: false
					}
				};
				this.setXiaotiyunUser(xiaotiyunUser);
			},
			login() {
				if (!this.password || !this.rePassword) {
					showToast('密码不能为空')
					return
				}
				if (this.password.length < 8 || this.password.length > 18 || this.rePassword.length < 8 || this
					.rePassword
					.length > 18) {
					showToast('密码长度请设置在8~18位之间')
					return
				}
				let reRgbPass = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])')
				if (!reRgbPass.test(this.password) || !reRgbPass.test(this.rePassword)) {
					showToast('密码请包含英文大小写和数字')
					return
				}
				if (this.password !== this.rePassword) {
					showToast(this.$t('main.mine.index.passwordDifferent'))
					return
				}
				postReq(URL.teachersChangePsw, {
					teacherId: this.xiaotiyunUser.teacher.teacherId,
					password: this.password
				}).then(res => {
					if (res.error == 10000) {
						uni.showToast({
							icon: 'success',
							title: this.passwordEditSuccess,
							duration: 1000
						})
						let xiaotiyunUser = {
							teacher: {
								...this.xiaotiyunUser.teacher,
								password: this.password,
								isOnePass: false
							}
						};
						this.password = ""
						this.rePassword = ""
						this.setXiaotiyunUser(xiaotiyunUser);
						this.$emit('newPassword', false)
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
		.bigBox {
			z-index: 100000;
			width: 560upx;
			height: 404upx;
			background: #FFFFFF;
			border-radius: 24upx;
			position: absolute;
			left: calc(50% - 280upx);
			// margin-left: -280upx;
			top: 450upx;
			right: 0;

			// bottom: 0;
			// margin: auto;
			.title {
				font-size: 34upx;
				font-weight: 500;
				color: #333333;
				margin: 48upx 0 24upx;
				text-align: center;
			}

			.input-main {
				width: 100%;
				height: 32upx;
				font-size: 28upx;
				text-align: center;
			}

			.clock-input-placeholder {
				color: #B2B2B2;
			}

			.line {
				width: 496upx;
				height: 1upx;
				background: #DDDDDD;
				// position: absolute;
				// top: 178upx;
				// left: 32upx;
				margin: 18upx auto 32upx;
			}

			.footBox {
				// margin-top: 59upx;
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
