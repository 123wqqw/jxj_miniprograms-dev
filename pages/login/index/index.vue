<template>
	<view class="authorization">
		<!-- 顶部背景图片 -->
		<view class="top-background">
			<image src="/static/login.png" mode="widthFix" class="background-image"></image>
			<view class="icon-logo">
				<image src="/static/ic_logo.png" class="logo-image"/>
			</view>
		
			<!-- 微信登录按钮 -->
			<button type="primary" class="button" hover-class="hoverBtn"
				@click="getUserOpenId">{{$t('main.login.index.authorizationLogin')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
	} from 'vuex'
	import {
		postReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	export default {
		data() {
			return {};
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('main.login.index.title')
			})
		},
		mounted() {

		},
		methods: {
			...mapMutations(['login', 'setOpenid', 'setXiaotiyunUser', 'setTeacherTabBar']),
			getUserOpenId() {
				uni.login({
					success: (result) => {
						postReq(URL.userCenterGetWxUserInfo, {
							code: result.code
						}).then(res => {
							if (res.data && JSON.stringify(res.data) !== '{}') {
								const {
									wechatOpenid,
									...params
								} = res.data
								console.log('wechatOpenId:', wechatOpenid);
								this.setOpenid(wechatOpenid);
								if (!params.teacherId && !params.studentId) {
									uni.navigateTo({
										url: "/pages/login/login/login"
									})
								} else {
									const userInfo = {
										avatarUrl: params.gender ?
											'https://h5.gxapp.iydsj.com/xty/miniApps/images/md_icon_teacherMale.png' :
											"https://h5.gxapp.iydsj.com/xty/miniApps/images/md_icon_teacherFemale.png",
										nickName: "",
										city: "",
									};
									this.login(userInfo);
									uni.setStorageSync("userInfo", userInfo);
									if (params.teacherId) { 
										const xiaotiyunUser = {
											teacher: params,
										}
										console.log('xiaotiyunUser', xiaotiyunUser);

										this.setXiaotiyunUser(xiaotiyunUser);
										this.setTeacherTabBar();
										uni.switchTab({
											url: "/pages/home/index/index"
										})
									} else {
										const xiaotiyunUser = {
											student: params,
										}
										console.log('xiaotiyunUser', xiaotiyunUser);

										this.setXiaotiyunUser(xiaotiyunUser);
										this.setTeacherTabBar();
										uni.navigateTo({
											url: "/pagesStudent/home/index"
										})
									}
								}
							}
						})
					},
					fail: (err) => {
						console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.authorization {
	width: 100%;
	min-height: 100vh;
	background: #F8F8FB;
	position: relative;
}

.top-background {
	position: relative;
	width: 100%;
	// height: 500rpx;
	overflow: hidden;
}

.background-image {
	width: 100%;
	// height: auto;
}

.icon-logo {
	position: absolute;
	top: 65%;
	left: 50%;
	transform: translate(-50%, -80%);
	z-index: 10;
	
	.logo-image {
		width: 448rpx;
		height: 160rpx;
	}
}

.button {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 24rpx;
	margin: 0 auto;
	width: 520rpx;
	height: 88rpx;
	padding: 0;
	line-height: 88rpx;
	background-color: #2C84FF;
	color: #fff;
	border-radius: 16rpx;
	font-size: 28rpx;
	font-weight: 600;
}

.hoverBtn {
	background-color: #337ecc;
}
</style>