<template>
	<view class="information-container">
		<u-cell-group>
			<u-cell-item :arrow="false">
				<text slot="title">我的{{ $t('mine.mine.myInformation.avatar') }}</text>
				<u-avatar :src="myInfo.avatarUrl" size="120"></u-avatar>
			</u-cell-item>
			<u-cell-item :arrow="false" title="姓名" :value="myInfo.name" />
			<u-cell-item :arrow="false" :value="myInfo.commonText">
				<text slot="title">{{$t('mine.mine.myInformation.school')}}</text>
			</u-cell-item>
			<u-cell-item :arrow="false" title="性别">
				<u-radio-group slot="right-icon" v-model="gender" @change="radioGroupChange">
					<u-radio :name="0">女</u-radio>
					<u-radio :name="1">男</u-radio>
				</u-radio-group>
			</u-cell-item>
			<u-cell-item :arrow="false" :title="facePhoto">
				<view class="capture-btn" hover-class="active" @click="clickFacialCapture(item)"
					v-if="faceModel.modelStatus == null || (faceModel.modelStatus == 0 && !faceModel.faceUrl)">
					<text>{{facialUpload}}</text>
				</view>
				<view class="capture-btn" hover-class="active" v-else @click="clickFacialCapture(item)">
					<text>{{againUpload}}</text>
				</view>
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { postReq, getReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";

	export default {
		data() {
			return {
				myInfo: {},
				gender: null,
				faceModel: {},
				// 国际化
				avatar: this.$t('mine.mine.myInformation.avatar'),
				uploadImgFailed: this.$t('mine.mine.myInformation.uploadImgFailed'),
				changeAvatarFailed: this.$t('mine.mine.myInformation.changeAvatarFailed'),
				changeAvatarSuccess: this.$t('mine.mine.myInformation.changeAvatarSuccess'),
				editFailed: this.$t('mine.mine.myInformation.editFailed'),
				editSuccess: this.$t('mine.mine.myInformation.editSuccess'),
				facePhoto: this.$t('mine.mine.myInformation.facePhoto'),
				facialUpload: this.$t('mine.mine.classManage.facialUpload'),
				againUpload: this.$t('mine.mine.classManage.againUpload'),
			}
		},

		computed: {
			...mapState(['xiaotiyunUser'])
		},

		onLoad(options) {
			this.gender = this.xiaotiyunUser.teacher.gender;
			this.faceModel = this.xiaotiyunUser.teacher.faceModelStatusVO;

			let _this = this;
			const eventChannel = _this.getOpenerEventChannel();
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				_this.myInfo = data;
			});

			uni.$on("myInformationChanged", () => {
				_this.getTeacherInfo();
			});
		},

		onUnload() {
			uni.$off("myInformationChanged");
		},

		methods: {
			...mapMutations(['setXiaotiyunUser', 'login']),

			radioGroupChange(value) {
				let _this = this;
				postReq(URL.teachersUpdateInfo, {
					gender: value
				}).then(res => {
					if (res.error == 10000) {
						uni.showToast({
							icon: 'none',
							title: _this.editSuccess,
							duration: 1000
						})
						let xiaotiyunUser = {
							teacher: {
								...this.xiaotiyunUser.teacher,
								gender: value
							}
						};
						this.setXiaotiyunUser(xiaotiyunUser);

						const userInfo = {
							avatarUrl: value ?
								'https://h5.gxapp.iydsj.com/xty/miniApps/images/md_icon_teacherMale.png' :
								"https://h5.gxapp.iydsj.com/xty/miniApps/images/md_icon_teacherFemale.png",
							nickName: "",
							city: "",
						};
						this.login(userInfo);
						uni.setStorageSync("userInfo", userInfo);

						_this.myInfo = {
							..._this.myInfo,
							avatarUrl: userInfo.avatarUrl
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: _this.editFailed,
							duration: 1000
						})
					}
				})
			},

			// 获取教师信息
			getTeacherInfo() {
				getReq(URL.getTeacherInfo).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const xiaotiyunUser = {
							teacher: {
								...this.xiaotiyunUser.teacher,
								schoolName: res.data.schoolName,
								faceModelStatusVO: res.data.faceModelStatusVO
							}
						};
						this.setXiaotiyunUser(xiaotiyunUser);
					}
				})
			},

			// 点击人脸录入按钮
			clickFacialCapture(item) {
				uni.navigateTo({
					url: '/pagesMine/mine/facialSelfie/facialSelfie'
				})
			}
		}
	}
</script>

<style lang="less" lang="scss">
	.information-container {
		width: 100%;
	}

	.capture-btn {
		width: 160rpx;
		height: 60rpx;
		margin-left: auto;
		font-size: 24rpx;
		color: #678DEF;
		background-color: #658DEF1A;
		border-radius: 8rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.active {
		background-color: #678DEF;
		color: #FFFFFF;
	}
</style>