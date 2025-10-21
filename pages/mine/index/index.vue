<template>
	<view class="mine">
		<view class="mine-header">
			<u-avatar :src="userInfo.avatarUrl" size="120"></u-avatar>
			<view class="u-flex-1 u-margin-left-40">
				<view class="mine-header-username">
					<text class="text-blod">{{xiaotiyunUser.teacher.name}}</text>
					<text class="mine-header-usercode">
						（{{xiaotiyunUser.teacher.schoolName}}）
					</text>
				</view>
				<view class="mine-header-usercode">
					教师号：{{xiaotiyunUser.teacher.teacherAccount}}
				</view>
			</view>
		</view>
		<u-cell-group>
			<u-cell-item @click="jumpPageMineInfo">
				<u-image slot="icon" class="u-margin-right-16" width="32rpx" height="54rpx"
					:show-menu-by-longpress="false" src="@/static/images/mine/mygrxx.png" mode="aspectFit"></u-image>
				<text slot="title">{{$t('main.mine.index.userInfo')}}</text>
			</u-cell-item>
			<u-cell-item @click="jumpPageMineClass">
				<u-image slot="icon" class="u-margin-right-16" width="32rpx" height="54rpx"
					:show-menu-by-longpress="false" src="@/static/images/mine/mybjgl.png" mode="aspectFit"></u-image>
				<text slot="title">{{$t('main.mine.index.classManage')}}</text>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="16" bg-color="#fafafa"></u-gap>
		<u-cell-group>
			<u-cell-item :arrow="false" @click="clearStorage">
				<u-image slot="icon" class="u-margin-right-16" width="32rpx" height="54rpx"
					:show-menu-by-longpress="false" src="@/static/images/mine/myqchc.png" mode="aspectFit"></u-image>
				<text slot="title">{{$t('main.mine.index.clearStorage')}}</text>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="16" bg-color="#fafafa"></u-gap>
		<u-cell-group>
			<u-cell-item @click="jumpPageMinePhone">
				<u-image slot="icon" class="u-margin-right-16" width="32rpx" height="54rpx"
					:show-menu-by-longpress="false" src="@/static/images/mine/myphone.png" mode="aspectFit"></u-image>
				<text slot="title">{{$t('main.mine.index.bindPhone')}}</text>
			</u-cell-item>
			<u-cell-item :arrow="false" @click="passwordVisible = true">
				<u-image slot="icon" class="u-margin-right-16" width="32rpx" height="54rpx"
					:show-menu-by-longpress="false" src="@/static/images/mine/myxgmm.png" mode="aspectFit"></u-image>
				<text slot="title">{{$t('main.mine.index.editPassword')}}</text>
			</u-cell-item>
			<u-cell-item :arrow="false" @click="outVisible = true">
				<u-image slot="icon" class="u-margin-right-16" width="32rpx" height="54rpx"
					:show-menu-by-longpress="false" src="@/static/images/mine/zxzh.png" mode="aspectFit"></u-image>
				<text slot="title">{{$t('main.mine.index.outLogin')}}</text>
			</u-cell-item>
		</u-cell-group>
		<u-tabbar v-model="current" :list="tabBar || []" bg-color="#ffffff" inactive-color="#B2B2B2"
			activeColor="#5C8FF7" height="56px" icon-size="24px">
		</u-tabbar>
		<u-modal v-model="passwordVisible" title="修改密码" :show-cancel-button="true" @confirm="confirm">
			<view class="u-padding-top-20">
				<u-field v-model="oldPassword" placeholder="请输入旧密码" placeholder-style="color: #B2B2B2;" password>
				</u-field>
				<u-field v-model="password" :placeholder="$t('main.mine.index.editPasswordPlaceholder')" maxlength="18"
					placeholder-style="color: #B2B2B2;" password>
				</u-field>
				<u-field v-model="rePassword" :placeholder="$t('main.mine.index.editRePasswordPlaceholder')"
					maxlength="18" class="" :border-bottom="false" placeholder-style="color: #B2B2B2;" password>
				</u-field>
			</view>
		</u-modal>
		<u-modal v-model="outVisible" :content="$t('main.mine.index.outLoginModalContent')"
			:title="$t('main.mine.index.outLogin')" :confirm-text="$t('common.enter')"
			:title-style="{fontSize: '34rpx',fontWeight:'500',color:'#333333'}" show-cancel-button="true"
			@confirm="outLogin">
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
	} from 'vuex';
	import {
		showToast
	} from '@/common/util.js'
	import {
		postReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	export default {
		data() {
			return {
				current: 1,
				passwordVisible: false,
				password: '',
				rePassword: '',
				oldPassword: '',
				outVisible: false
			}
		},
		onLoad() {
			// this.tabBar[0].text = this.$t("common.home");
		},
		onReady() {},
		computed: {
			...mapState(['openid', 'userid', 'tabBar', 'xiaotiyunUser', 'userInfo', 'commentModelList'])
		},
		methods: {
			...mapMutations(['setCommentModelList', 'setXiaotiyunUser']),
			// 教师个人信息页面
			jumpPageMineInfo() {
				const _this = this;
				const params = {
					avatarUrl: _this.userInfo.avatarUrl,
					name: _this.xiaotiyunUser.teacher.name,
					commonText: _this.xiaotiyunUser.teacher.schoolName
				}
				uni.navigateTo({
					url: '/pagesMine/mine/myInformation/myInformation',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			// 班级管理页面
			jumpPageMineClass() {
				this.$u.route({
					url: '/pagesMine/mine/classManage/classManage'
				})
			},
			// 清除缓存 -- 共用
			clearStorage() {
				const commentModelList = this.commentModelList;
				uni.clearStorageSync();
				this.setCommentModelList(commentModelList);
				this.$u.route({
					type: "reLaunch",
					url: '/pages/login/index/index',
				})
			},
			// 手机号换绑页面 -- 教师端
			jumpPageMinePhone() {
				this.$u.route({
					url: '/pagesMine/mine/editPhone/editPhone'
				})
			},
			confirm() {
				if (!this.password || !this.rePassword || !this.oldPassword) {
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
				postReq(URL.teachersChangePswV2, {
					teacherId: this.xiaotiyunUser.teacher.teacherId,
					password: this.password,
					oldPassword: this.oldPassword
				}).then(res => {
					if (res.error == 10000) {
						showToast(this.$t('main.mine.index.passwordEditSuccess'))
						let xiaotiyunUser = {
							teacher: {
								...this.xiaotiyunUser.teacher,
								password: this.password
							}
						};
						this.setXiaotiyunUser(xiaotiyunUser);
						this.password = ""
						this.rePassword = ""
						this.oldPassword = ""
					} else {
						showToast(res.message)
					}
				})
			},

			// 注销账号
			outLogin() {
				let params = {
					teacherId: this.xiaotiyunUser.teacher.teacherId,
					tag: this.xiaotiyunUser.teacher.tag
				}
				// console.log(params);
				postReq(URL.userCenterLogoutWechat, params).then(res => {
					// console.log(res);
					if (res.error == 10000) {
						// 注销成功
						let xiaotiyunUser = {
							teacher: {}
						};
						this.setXiaotiyunUser(xiaotiyunUser);
						uni.reLaunch({
							url: "/pages/login/index/index"
						})

					} else {
						showToast(res.message)
					}
				})
			},
		},
	}
</script>

<style lang="less" scoped>
	.text-blod {
		font-weight: bold;
	}

	.mine {
		&-header {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			min-height: calc(280rpx + var(--status-bar-height));
			padding: calc(32rpx + 44px) 32rpx 32rpx;
			background-color: #5C8FF7;
			background-image: url("../../../static/images/mine/mybjtp.png");
			background-repeat: no-repeat;
			background-size: contain;
			-webkit-background-size: contain;
			-o-background-size: contain;
			background-position: 100% 100%;
			color: #fff;
			line-height: 1.5;
			margin-bottom: 26rpx;

			&-username {
				font-size: 40rpx;
				margin-bottom: 16rpx;
			}

			&-usercode {
				font-size: 28rpx;
			}
		}
	}
</style>
