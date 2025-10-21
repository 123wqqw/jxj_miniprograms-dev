<template>
	<view class="prize-verification-detail-wrapper">
		<view class="info-part">
			<u-image v-if="infoData.faceUrl" width="200rpx" height="200rpx" shape="circle" :src="infoData.faceUrl">
			</u-image>
			<view v-else class="avatar-placeholder"></view>
			<text class="info-name">{{infoData.name || ''}}</text>
			<text class="info-grade">{{ handleClassName() }}</text>
			<prize-item class="prize-item" :dataSource="infoData"></prize-item>
			<view class="remark-bezel">
				<u-input type="textarea" :height="184" :placeholder="$t('data.prizeVerification.detail.textState')"
					v-model="remark">
				</u-input>
			</view>
		</view>
		<view class="bottom-part">
			<view class="button-style button-refuse" @click="clickRefuse">
				<text>{{$t('data.prizeVerification.detail.refuse')}}</text>
			</view>
			<view class="button-style button-done" @click="clickGrant">
				<text>{{$t('data.prizeVerification.detail.doneGrant')}}</text>
			</view>
		</view>
		<u-modal :show-title="false" show-cancel-button v-model="modalShow" :content="modalContent"
			@confirm="clickRefuseDone"></u-modal>
	</view>
</template>

<script>
	import prizeItem from './components/prizeItem.vue';
	import { mapState } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import ClassUtil from '@/common/utility/ClassUtil.js';
	export default {
		components: {
			'prize-item': prizeItem
		},

		data() {
			return {
				id: '',
				infoData: {},
				remark: '',
				modalShow: false,
				modalContent: this.$t('data.prizeVerification.detail.modalContent'),
			}
		},

		computed: {
			...mapState(['xiaotiyunUser', 'schoolInfo']),
		},

		onLoad(options) {
			uni.setNavigationBarTitle({
				title: this.$t('data.prizeVerification.detail.title')
			});
			this.id = options.id || '';
			this.queryInfo();
		},

		methods: {
			// 获取详情
			queryInfo() {
				getReq(URL.apiGetPrizeVerificationDetail, {
					id: this.id || '',
				}).then(res => {
					if (res.error == 10000) {
						this.infoData = res.data;
						if (res.data.faceUrl) {
							this.infoData.faceUrl = this.schoolInfo.faceDomain + '/file' + res.data.faceUrl;
						} else {
							this.infoData.faceUrl = "";
						}
					} else {
						uni.showToast({
							title: res.message,
						})
						this.infoData = {};
					}
				})
			},
			// 发送拒绝
			sendRefuse() {
				postReq(URL.apiPostPrizeVerificationRefuse, {
					grantTeacher: this.xiaotiyunUser.teacher.name,
					id: this.id,
					teacherId: this.xiaotiyunUser.teacher.teacherId,
				}).then((res) => {
					if (res.error == 10000) {
						uni.navigateBack();
					}
				})
			},
			// 提交发放
			submitGrant() {
				postReq(URL.apiPostPrizeVerificationGrant, {
					grantTeacher: this.xiaotiyunUser.teacher.name,
					id: this.id,
					remarks: this.remark,
					teacherId: this.xiaotiyunUser.teacher.teacherId,
				}).then((res) => {
					if (res.error == 10000) {
						uni.showToast({
							title: res.message
						});
						uni.navigateBack();
					}
				})
			},
			// 点击拒绝
			clickRefuse() {
				this.modalShow = true;
			},
			// 点击确定发放
			clickGrant() {
				this.submitGrant();
			},
			// 点击拒绝提示弹窗确认
			clickRefuseDone() {
				this.sendRefuse();
			},
			// 处理人脸地址
			handleFaceUrl() {
				return this.schoolInfo.faceDomain + '/file' + this.infoData.faceUrl;
			},
			// 处理班级名称
			handleClassName() {
				if (this.infoData.aliasClassName) {
					// return this.$t(ClassUtil.gradeNameI18n(this.infoData.grade)) + this.infoData.aliasClassName;
					return this.infoData.aliasClassName;
				} else {
					return this.infoData.className || '';
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.prize-verification-detail-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.info-part {
		margin: 40rpx 24rpx 0rpx 24rpx;
		padding: 40rpx 20rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(112, 112, 112, 0.1);
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.avatar-placeholder {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
	}

	.info-name {
		margin-top: 20rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #5C8FF7;
		line-height: 45rpx;
	}

	.info-grade {
		font-size: 28rpx;
		color: #999999;
		line-height: 40rpx;
	}

	.prize-item {
		margin-top: 40rpx;
		width: 100%;
	}

	.remark-bezel {
		margin-top: 40rpx;
		padding: 10rpx 16rpx;
		width: 100%;
		background: #F8F8FB;
		border-radius: 20rpx;
		border: 1rpx solid #EEEEEE;
	}

	.bottom-part {
		margin-top: auto;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		width: 100%;
		height: 128rpx;
		height: calc(128rpx + constant(safe-area-inset-bottom));
		height: calc(128rpx + env(safe-area-inset-bottom));
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 30rpx;
	}

	.button-style {
		width: 300rpx;
		height: 88rpx;
		border-radius: 20rpx;
		font-weight: 500;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button-refuse {
		background: rgba(92, 143, 247, 0.1);
		border: 1rpx solid rgba(92, 143, 247, 0.1);
		color: #5C8FF7;
	}

	.button-done {
		background: #5C8FF7;
		border: 1rpx solid #5C8FF7;
		color: #FFFFFF;
	}
</style>