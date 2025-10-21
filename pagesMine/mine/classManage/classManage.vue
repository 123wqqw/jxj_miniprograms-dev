<template>
	<view class="class-manage-container">
		<u-modal v-model="show" :show-title="true" :title="unBindClassModalTitle" :content="noClassName"
			@confirm="goRemove" :show-cancel-button="true" :content-style="{ fontSize: '28rpx' }">
		</u-modal>
		<!-- Tab栏 -->
		<view class="class-header">
			<view class="school-info">
				<view class="school">{{ school.name }}</view>
			</view>
			<!-- <scroll-view class="class-tabs" scroll-x>
				<view class="class-tab" :class="{ 'class-tab-active': curTab + '' == '-1' }" @click="changeClass(-1)">全部
				</view>
				<view v-for="(item, index) in classList" :key="index" class="class-tab"
					:class="{ 'class-tab-active': curTab == index }" @click="changeClass(index)">
					{{ handleClassName(item) }}
				</view>
			</scroll-view> -->
		</view>
		<!-- 班级列表 -->
		<view class="class-content" v-if="isShowClassInfo">
			<view class="class-li" v-for="(item, index) in classList" :key="index">
				<view class="li-left" @click="goClassDetail(index)">
					<view class="class-name">
						<view>
							{{ handleClassName(item) }}
							<label v-if="item.inviteCode">
								（{{ classInviteCode }}：{{item.inviteCode}}）
							</label>
						</view>
						<view class="help-icon" v-if="item.classManageType != 1">{{ $t('common.help') }}</view>
					</view>
					<view class="class-teacher-student">
						{{ item.teacherCount }}位{{ $t('common.teacher') }}<label>{{ item.studentCount }}位{{
							$t('common.student')
						}}</label>
					</view>
				</view>
				<view class="li-right">
					<view class="setting-box">
						<view class="clock-date-setting" hover-class="active" @click="goSettingClockDate(item)">
							{{ $t('mine.mine.classManage.clockSetting') }}
						</view>
					</view>
				</view>
				<image src="../../static/images/removeA.png" class="removeimg" @click="remove(item)"></image>
			</view>
		</view>
		<!-- 班级信息 -->
		<!-- <view class="integration-content" v-if="!isShowClassInfo"> -->
			<!-- 班级 -->
			<!-- <view class="integration-title">
				<view class="class-name">
					<view class="class-name-text">
						{{ teacherClass.aliasClassName ? teacherClass.aliasClassName : teacherClass.className }}
						<label v-if="teacherClass.inviteCode">
							（{{classInviteCode}}：{{ teacherClass.inviteCode }}）
						</label>
					</view>
					<view class="help-icon" v-if="teacherClass.classManageType != 1">{{ $t('common.help') }}</view>
				</view>
				<view class="class-subInfo">
					<view class="class-teacher-student">
						{{ teacherClass.teacherCount }}位{{ $t('common.teacher') }}<label>{{
							teacherClass.studentCount
						}}位{{ $t('common.student') }}</label>
					</view>
					<button class="share-btn" open-type="share" v-if="teacherClass.inviteCode">
						{{inviteStudent}}
					</button>
					<button class="share-btn" v-if="!teacherClass.inviteCode " @click="generateClassInviteCodeFun()">
						{{generateClassInviteCode}}
					</button>
				</view>
			</view> -->
			<!-- 老师 -->
			<!-- <view class="teacher-integretion" v-if="integrationData.teacherModels.length > 0">
				<view class="title">{{ $t('common.teacherOld') }}</view>
				<view class="teacher-li" v-for="(item, index) in integrationData.teacherModels" :key="index">
					<view class="li-left">
						<image
							:src="item.gender == 1 ? '../../static/images/teacher-man.png' : '../../static/images/teacher-woman.png'">
						</image>
						<view class="name">{{ item.name }}</view>
					</view>
					<view class="li-center" v-if="item.teacherId == integrationData.chargeTeacherId">
						<view class="icon">班主任</view>
					</view>
					<view class="li-right" @click="callTeacherPhone(item.phone)" v-if="volid(item.phone)">
						<image src="../../static/images/phone.png"></image>
						<view class="phone">{{ item.phone }}</view>
					</view>
				</view>
			</view> -->
			<!-- 学生 -->
			<!-- <view class="student-integretion"
				v-if="integrationData.studentModels && integrationData.studentModels.length > 0">
				<view class="title">{{ $t('common.student') }}</view>
				<view class="student-li" v-for="(item, index) in integrationData.studentModels" :key="index">
					<view class="li-left">
						<image v-if="item.faceUrl && school.faceDomain" mode="aspectFill"
							:src="school.faceDomain + '/file' + item.faceUrl">
						</image>
						<image v-else-if="item.avatar" :src="item.avatar" mode="aspectFill"></image>
						<image v-else mode="aspectFill"
							:src="item.gender == 1 ? '../../static/images/boy-avatar.png' : '../../static/images/girl-avatar.png'">
						</image>
					</view>
					<view class="li-center">
						<view class="student-name">{{ item.name }}</view>
						<view class="student-code">{{ item.studentNumber }}</view>
					</view>
					<view class="li-right">
						<view class="status-state">
							<image v-if="item.modelStatus != 2 && item.faceUrl"
								src="../../static/images/check_circle_line.png">
							</image>
							<image v-if="item.modelStatus == 2" src="../../static/images/warning_line.png"></image>
							<text class="normal-text" v-if="item.modelStatus == 0 && item.faceUrl">
								{{$t('mine.mine.classManage.uploadSuccess')}}
							</text>
							<text class="normal-text" v-if="item.modelStatus == 1">
								{{$t('mine.mine.classManage.facialModeling')}}
							</text>
							<text class="warning-text" v-if="item.modelStatus == 2">
								{{$t('mine.mine.classManage.uploadFailure')}}
							</text>
						</view>
						<view class="right-btn" hover-class="active" @click="clickFacialCapture(item)"
							v-if="item.modelStatus == null || (item.modelStatus == 0 && !item.faceUrl)">
							{{$t('mine.mine.classManage.facialUpload')}}
						</view>
						<view class="right-btn" hover-class="active" v-else @click="clickFacialCapture(item)">
							{{$t('mine.mine.classManage.againUpload')}}
						</view>
					</view>
				</view>
			</view> -->
		<!-- </view> -->

		<!-- <view class="btn-box-content safe-area-inset-bottom">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom">
			<view class="btn-content">
				<button type="primary" class="action-btn" @click="bandNewManageClass">{{
					$t('mine.mine.classManage.bindNewManageClass')
				}}</button>
				<button type="primary" class="action-btn" @click="bandNewHelpClass">{{
					$t('mine.mine.classManage.bindNewHelpClass')
				}}</button>
			</view>
		</view> -->
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import ClassUtil from '@/common/utility/ClassUtil.js';

	export default {
		data() {
			return {
				show: false,
				noClassName: '',
				curTab: -1,
				noClassId: '',
				teacherClassList: [],
				teacher: {},
				isShowClassInfo: true,
				integrationData: {
					teacherModels: [],
					sutdentModels: [],
					classModel: {}
				},
				classId: "",
				classList: [],
				school: {},
				teacherClass: {},
				isRefresh: false,

				// 国际化
				unBindClassModalTitle: this.$t('mine.mine.classManage.unBindClass'),
				gradeText: this.$t('common.gradeText'),
				sureUnBind: this.$t('mine.mine.classManage.sureUnBind'),
				ma: this.$t('mine.mine.classManage.ma'),
				unBindSuccess: this.$t('mine.mine.classManage.unBindSuccess'),
				student: this.$t('common.student'),
				classInviteCode: this.$t('mine.mine.classManage.classInviteCode'),
				inviteStudent: this.$t('mine.mine.classManage.inviteStudent'),
				generateClassInviteCode: this.$t('mine.mine.classManage.generateClassInviteCode'),
			};
		},

		computed: {
			...mapState(['xiaotiyunUser'])
		},

		created() {
			let _this = this;
			if (_this.xiaotiyunUser.hasOwnProperty('teacher')) {
				_this.teacher = _this.xiaotiyunUser.teacher;
				_this.getSchoolById();
				_this.getTeacherClass();
				_this.isShowClassInfo = true;
			} else {
				uni.switchTab({
					url: '/pages/home/index/index'
				})
			}
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('mine.mine.classManage.title')
			})
			wx.showShareMenu({
				withShareTicket: true,
				// 设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus: ["shareAppMessage", "shareTimeline"]
			})
		},

		onShow() {
			let _this = this;
			if (_this.isRefresh) {
				if (_this.xiaotiyunUser.hasOwnProperty('teacher')) {
					_this.teacher = _this.xiaotiyunUser.teacher;
					_this.getSchoolById();
					if (_this.classId) {
						_this.getIntegrationList();
						_this.isShowClassInfo = false;
					} else {
						_this.getTeacherClass();
						_this.isShowClassInfo = true;
					}
				} else {
					uni.switchTab({
						url: '/pages/home/index/index'
					})
				}
				_this.isRefresh = false;
			}
		},

		onHide() {
			this.isRefresh = true;
		},

		onPullDownRefresh() {
			let _this = this;
			setTimeout(() => {
				_this.getSchoolById();
				if (_this.classId) {
					_this.getIntegrationList();
				} else {
					_this.getTeacherClass();
				}
				uni.stopPullDownRefresh();
			}, 0)
		},

		onShareAppMessage(res) {
			let _this = this;
			_this.isRefresh = true;
			if (res.from === "button") {
				return {
					title: _this.inviteStudent, // 标题
					path: `/H5/share/index?qrCode=${encodeURI(_this.integrationData.classModel.qrCodeStr)}&teacherName=${encodeURI(_this.teacher.name)}&classCode=${encodeURI(_this.integrationData.classModel.inviteCode)}&grade=${_this.integrationData.classModel.grade}&class=${_this.integrationData.classModel.number}`,
					imageUrl: 'https://gxapp-images.obs.cn-east-3.myhuaweicloud.com/xiaotiyun-images/minprogram/minpro-images/inviteStudent.png', // 分享图
				};
			}
		},

		methods: {
			// 获取学校信息
			getSchoolById() {
				let _this = this;
				let params = {
					schoolId: _this.teacher.schoolId
				}
				getReq(URL.getSchoolInfoById, params).then(res => {
					if (res.error == 10000) {
						if (res.data) {
							_this.school = res.data;
						} else {
							_this.school = {
								schoolName: "",
							};
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},

			// 获取老师信息
			getTeacherClass() {
				let _this = this;
				let params = {
					teacherId: _this.teacher.teacherId
					// teacherId: '1471376243864768512'
				}
				postReq(URL.classManage, params).then(res => {
					if (res.error == 10000) {
						if (res.data) {
							_this.classList = res.data;
							if (_this.classId) {
								_this.curTab = _this.classList.findIndex(cla => cla.classId == _this.classId)
							} else {
								_this.curTab = -1;
							}
						} else {
							_this.classList = [];
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},

			// 获取班级花名册
			getIntegrationList() {
				let _this = this;
				let params = { classId: _this.classId };
				getReq(URL.apiGetIntegrationList, params).then(res => {
					if (res.error == 10000) {
						_this.integrationData = res.data;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						});
					}
				});
			},

			bandNewManageClass() {
				uni.navigateTo({
					url: '../classConcat/calssConcat'
				})
			},

			bandNewHelpClass() {
				uni.navigateTo({
					url: '/pagesMine/mine/classConcatHelp/classConcatHelp'
				})
			},

			remove(item) {
				console.log(item)
				this.noClassId = item.classId
				this.noClassName = this.sureUnBind + item.className + this.ma + '？'
				this.show = true
			},

			goRemove() {
				let _this = this;
				getReq(URL.apiGetClassRemove, {
					classId: this.noClassId
				}).then(res => {
					if (res.error == 10000) {
						this.show = false
						uni.showToast({
							icon: 'success',
							title: _this.unBindSuccess,
							duration: 1000
						})
						this.getTeacherClass()
						this.show = false
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},

			// 获取年级名称
			getClassContent(i) {
				let Class = [`一${this.gradeText}`, `二${this.gradeText}`, `三${this.gradeText}`, `四${this.gradeText}`,
					`五${this.gradeText}`, `六${this.gradeText}`, "初一", "初二", "初三", "高一", "高二", "高三"
				];
				return Class[i - 1];
			},

			// 切换班级
			changeClass(index) {
				let _this = this;
				console.log(index);
				_this.curTab = index;
				let teacherClassList = [];
				if (index == -1) {
					_this.isShowClassInfo = true;
				} else {
					_this.isShowClassInfo = false;
					_this.classId = _this.classList[index].classId;
					_this.teacherClass = _this.classList[index];
					_this.getIntegrationList();
				}
			},

			goClassDetail(index) {
				let _this = this;
				_this.curTab = index;
				_this.isShowClassInfo = false;
				_this.classId = _this.classList[index].classId;
				_this.teacherClass = _this.classList[index];
				_this.getIntegrationList();
			},

			generateClassInviteCodeFun() {
				let _this = this;
				let params = {
					classId: _this.classId
				}
				postReq(URL.apiPostGenerateClassInviteCode, params).then(res => {
					if (res.error == 10000) {
						_this.teacherClass.inviteCode = res.data;
						_this.classList[_this.curTab].inviteCode = res.data;
						_this.integrationData.inviteCode = res.data;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},

			goSettingClockDate(item) {
				let clockDateParams = {
					classId: item.classId,
					sportClockDateArr: item.sportClockDate == null ? [0, 0, 0, 0, 0, 0, 0] : item.sportClockDate.split(
						','),
					classList: this.classList.map(item => item.classId),
					classManageType: item.classManageType
				}
				uni.navigateTo({
					url: '../clockDateSetting/clockDateSetting',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', clockDateParams)
					}
				})
			},

			callTeacherPhone(phone) {
				let _this = this;
				console.log(phone);
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},

			// 点击人脸录入/重新录入
			clickFacialCapture(item) {
				const _this = this;
				uni.navigateTo({
					url: '/pagesMine/mine/facialCapture/facialCapture',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						const data = {
							item: item,
							studentList: _this.integrationData.studentModels,
							school: _this.school
						};
						res.eventChannel.emit('acceptDataFromClassManagePage', data);
					}
				});
			},

			volid(phone) {
				return /^1[23456789]\d{9}$/.test(phone);
			},
			
			// 处理班级名称
			handleClassName(item) {
				if (item.aliasClassName) {
					let grade = '';
					if (item.grade) {
						grade = this.$t(ClassUtil.gradeNameI18n(item.grade));
					}
					// return grade + item.aliasClassName;
					return item.aliasClassName;
				} else {
					return item.className || '';
				}
			},
		}
	}
</script>

<style lang="less">
	.share-btn {
		font-size: 28rpx;
		color: #fff;
		background-color: #6BB0FF;
		padding: 16rpx;
		border-radius: 8rpx;
		margin: 0 12rpx;
		line-height: 1;
	}

	.slot-content {
		padding: 30rpx 0;
		text-align: center;

		label {
			color: red;
		}
	}

	.class-manage-container {
		width: 100%;

		.class-header {
			width: 100%;

			.school-info {
				width: 100%;
				height: 56rpx;
				background-color: #F5F5F5;
				font-size: 24rpx;
				color: #B2B2B2;
				padding: 0 32rpx;
				line-height: 56rpx;
			}

			.class-tabs {
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				box-sizing: border-box;
				position: relative;
				-ms-flex-pack: distribute;
				justify-content: space-around;
				-ms-flex-align: center;
				align-items: center;
				background: #fff;
				white-space: nowrap;
				-webkit-overflow-scrolling: touch;

				.class-tab {
					-ms-flex: 1;
					flex: 1;
					display: inline-flex;
					padding: 0 32rpx;
					// width: 160rpx;
					-ms-flex-pack: center;
					justify-content: center;
					-ms-flex-align: center;
					align-items: center;
					text-align: center;
					position: relative;
					box-sizing: border-box;
					font-size: 28rpx;
					color: #707070;
					font-weight: 400;
				}

				.class-tab-active {
					color: #202020;
					font-weight: 500;
				}

				.class-tab-active::before {
					position: absolute;
					left: 50%;
					bottom: 0;
					width: 32rpx;
					height: 6rpx;
					background-color: #6BB0FF;
					-webkit-transform: translateX(-50%);
					transform: translateX(-50%);
					content: '';
				}
			}
		}

		.class-content {
			width: 100%;

			.class-li {
				width: 100%;
				height: 164rpx;
				margin-top: 16rpx;
				background-color: #FFFFFF;
				padding: 0 32rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;

				.li-left {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: start;

					.class-name {
						padding-right: 50rpx;
						position: relative;
						font-size: 32rpx;
						color: #202020;

						image {
							width: 32rpx;
							height: 32rpx;
							position: absolute;
							right: 0;
							top: 50%;
							-webkit-transform: translateY(-50%);
							transform: translateY(-50%);
						}

						.help-icon {
							width: 34rpx;
							height: 34rpx;
							line-height: 34rpx;
							border-radius: 50%;
							font-size: 20rpx;
							color: #FFFFFF;
							text-align: center;
							background-color: #464646;
							position: absolute;
							right: 0;
							top: 50%;
							-webkit-transform: translateY(-50%);
							transform: translateY(-50%);
						}
					}

					.class-teacher-student {
						font-size: 28rpx;
						color: #707070;
						margin-top: 24rpx;

						label {
							margin-left: 32rpx;
						}
					}
				}

				.li-right {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.setting-box {
						flex: 1;
						display: flex;
						justify-content: flex-end;
						align-items: center;
					}

					.clock-date-setting {
						font-size: 28rpx;
						color: #6BB0FF;
						font-weight: 400;
						padding: 8rpx 16rpx;
						background-color: #F5F5F5;
						border-radius: 8rpx;
						position: absolute;
						right: 32rpx;
						bottom: 24rpx;
					}

					.active {
						background-color: #6BB0FF;
						color: #FFFFFF;
					}
				}

				.removeimg {
					width: 32rpx;
					height: 32rpx;
					position: absolute;
					top: 30rpx;
					right: 32rpx;
				}
			}
		}

		.integration-content {
			width: 100%;
			margin-top: 16rpx;

			.integration-title {
				width: 100%;
				height: 164rpx;
				background-color: #FFFFFF;
				padding: 0 32rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.class-name {
					padding-right: 50rpx;
					position: relative;
					font-size: 32rpx;
					color: #202020;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					image {
						width: 32rpx;
						height: 32rpx;
						position: absolute;
						right: 0;
						top: 50%;
						-webkit-transform: translateY(-50%);
						transform: translateY(-50%);
					}

					.class-name-text {
						padding-right: 16rpx;
					}

					.help-icon {
						width: 34rpx;
						height: 34rpx;
						border-radius: 50%;
						font-size: 20rpx;
						color: #FFFFFF;
						text-align: center;
						background-color: #464646;
					}
				}

				.class-subInfo {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 28rpx;
				}

				.clock-date-setting {
					font-size: 28rpx;
					color: #6BB0FF;
					font-weight: 400;
					padding: 8rpx 16rpx;
					background-color: #F5F5F5;
					border-radius: 8rpx;
				}

				.class-teacher-student {
					font-size: 28rpx;
					color: #707070;

					label {
						margin-left: 32rpx;
					}
				}
			}

			.teacher-integretion {
				width: 100%;

				.title {
					width: 100%;
					height: 64rpx;
					font-size: 24rpx;
					color: #707070;
					line-height: 64rpx;
					text-align: left;
					padding: 0 32rpx;
				}

				.teacher-li {
					width: 100%;
					height: 120rpx;
					background-color: #FFFFFF;
					padding: 0 32rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.li-left {
						height: 72rpx;
						padding-left: 90rpx;
						position: relative;
						font-size: 28rpx;
						color: #202020;
						line-height: 72rpx;

						image {
							width: 72rpx;
							height: 72rpx;
							position: absolute;
							left: 0;
							top: 50%;
							-webkit-transform: translateY(-50%);
							transform: translateY(-50%);
						}
					}

					.li-center {
						flex: 1;
						-ms-flex: 1;
						display: flex;
						align-items: center;

						.icon {
							margin-left: 12rpx;
							font-size: 18rpx;
							color: #15CD85;
							padding: 3rpx 10rpx;
							border: 1px solid #15CD85;
							border-radius: 8rpx;
							line-height: 24rpx;
						}
					}

					.li-right {
						height: 72rpx;
						padding-left: 34rpx;
						position: relative;
						font-size: 28rpx;
						color: #44ABFF;
						line-height: 72rpx;

						image {
							width: 24rpx;
							height: 24rpx;
							position: absolute;
							left: 0;
							top: 50%;
							-webkit-transform: translateY(-50%);
							transform: translateY(-50%);
						}
					}
				}
			}

			.student-integretion {
				width: 100%;

				.title {
					width: 100%;
					height: 64rpx;
					font-size: 24rpx;
					color: #707070;
					line-height: 64rpx;
					text-align: left;
					padding: 0 32rpx;
				}

				.student-li {
					width: 100%;
					height: 120rpx;
					background-color: #FFFFFF;
					padding: 0 32rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.li-left {
						width: 72rpx;
						height: 72rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}

					.li-center {
						flex: 1;
						-ms-flex: 1;
						margin-left: 24rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.student-name {
							font-size: 28rpx;
							color: #202020;
						}

						.student-code {
							font-size: 24rpx;
							color: #707070;
							margin-top: 4rpx;
						}
					}

					.li-right {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.status-state {
							display: flex;
							flex-direction: row;
							align-items: center;
							font-size: 24rpx;

							image {
								width: 28rpx;
								height: 28rpx;
							}

							.normal-text {
								color: #698BF1;
							}

							.warning-text {
								color: #FF4444;
							}
						}

						.right-btn {
							font-size: 24rpx;
							color: #678DEF;
							padding: 8rpx 16rpx;
							background-color: #658DEF1A;
							border-radius: 8rpx;
							margin: 0 12rpx;
						}

						.active {
							background-color: #678DEF;
							color: #FFFFFF;
						}
					}
				}
			}
		}

		.btn-box-content {
			width: 100%;
			display: block;
			// padding: 32rpx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.default-content {
				height: 88rpx;
				padding: 32rpx 0;
				box-sizing: content-box;

				.btn-content {
					width: 100%;
					height: 88rpx;
				}
			}
		}

		.bottom-btn-box {
			background-color: #FFFFFF;
			box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			.btn-content {
				width: 100%;
				height: 88rpx;
				padding: 32rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: content-box;
			}

			.action-btn {
				width: 320rpx;
				height: 88rpx;
				background-color: #5C8FF7;
				border: none;
				border-radius: 44rpx;
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 88rpx;
			}

			.action-btn-big {
				width: 638rpx;
				margin: 0 auto;
			}

			.active {
				background-color: #5276f7;
			}
		}
	}
</style>