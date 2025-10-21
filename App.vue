<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let _this = this;
			//检查语言类型
			uni.getStorage({
				key: 'xiaotiyunUser',
				success: (res) => {
					console.log('res:', res);
					_this.$scope.globalData.xiaotiyunUser = res.data;
					let userInfo = uni.getStorageSync('userInfo');
					console.log('userinfo: ', userInfo);
					if (userInfo) {
						console.log("首页")
						if (res.data.hasOwnProperty("teacher") && res.data.teacher && JSON.stringify(res.data.teacher) !== '{}') {
							_this.setUserid(res.data.teacher.alipayUserid);
							_this.setOpenid(res.data.teacher.wechatOpenid);
							_this.setTeacherTabBar();
							_this.setXiaotiyunUser(res.data);
							_this.login(userInfo);
							uni.switchTab({
								url: '/pages/home/index/index',
								success: (res) => {
									// console.log("隐藏tabBar")
									setTimeout(() => {
										uni.hideTabBar();
									}, 100)
								}
							})
						} else if (res.data.hasOwnProperty("student") && res.data.student && JSON.stringify(res.data.student) !== '{}') {
							// 学生端自动登录
							_this.setXiaotiyunUser(res.data);
							_this.login(userInfo);
							uni.reLaunch({
								url: '/pagesStudent/home/index'
							})
						} else if (res.data.parent && JSON.stringify(res.data.parent) !== '{}') {
							_this.setOpenid(res.data.parent.wechatOpenid);
							_this.setUserid(res.data.parent.alipayUserid);
							_this.setXiaotiyunUser(res.data);
							_this.login(userInfo);
							uni.switchTab({
								url: '/pages/home/index/index',
								success: (res) => {
									// console.log("隐藏tabBar")
									setTimeout(() => {
										uni.hideTabBar();
									}, 100)
								}
							})
						} else {
							return;
						}
					} else {
						console.log("授权")
						uni.reLaunch({
							url: '/pages/login/index/index'
						})
					}
				},
			})
		},
		onShow: function() {
			console.log('App Show')
			var lan = 'zh'
			try {
				const res = uni.getSystemInfoSync();
				lan = res.language
			} catch (e) {
				console.log('error=' + e)
			}
			console.log('lan=' + lan);

			if (lan == 'zh-Hans-CN' || lan == 'zh' || lan == 'zh_CN') {
				this.$i18n.locale = 'zh-Hans';
				this.setIsHant(false);
			} else {
				this.$i18n.locale = 'zh-Hant';
				this.setIsHant(true);
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['setXiaotiyunUser', 'setTeacherTabBar', 'login', 'setUserid', 'setOpenid', 'setIsHant']),
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	/*每个页面公共css */
	page {
		width: 100%;
		/* height: 100%; */
		position: relative;
		color: rgba(0, 0, 0, .85);
		background-color: #FAFAFA;
		font-size: 16px;
		font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Helvetica", "Microsoft YaHei", "Arial", sans-serif;
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		-webkit-tap-highlight-color: transparent;
	}

	view,
	text,
	scroll-view,
	input,
	button,
	image,
	cover-view {
		box-sizing: border-box;
	}

	/* 全局输入框样式 */
	input {
		font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Helvetica", "Microsoft YaHei", "Arial", sans-serif;
		color: #333333;
	}

	input::placeholder {
		color: #999999 !important;
	}

	/* 兼容不同平台的placeholder样式 */
	input::-webkit-input-placeholder {
		color: #999999 !important;
	}

	input::-moz-placeholder {
		color: #999999 !important;
	}

	input:-ms-input-placeholder {
		color: #999999 !important;
	}

	::-webkit-scrollbar {
		display: none;
	}

	.basic-container {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
