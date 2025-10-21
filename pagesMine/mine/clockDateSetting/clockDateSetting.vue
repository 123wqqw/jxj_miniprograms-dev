<template>
	<view class="clockDateSetting">
		<view class="clockDateSetting-main">
			<view class="clockDateSetting-content">
				<view class="clockDateSetting-content_item">
					<view class="clockDateSetting-content_label">
						<view class="u-margin-right-8 u-font-28">允许打卡</view>
						<u-icon name="question-circle" color="#5C90F5" size="44" @click="show = true"></u-icon>
					</view>
					<u-switch v-model="queryForm.type" size="44" activeColor="#5C90F5" inactiveColor="#707070"
						@change="bindTypeChange">
					</u-switch>
				</view>
				<template v-if="queryForm.type">
					<u-radio-group v-model="queryForm.days">
						<view class="clockDateSetting-content_item u-margin-top-24">
							<view class="clockDateSetting-content_label">
								<view class="u-margin-right-8 u-font-24">允许次日补卡</view>
							</view>
							<u-radio :name="1"></u-radio>
						</view>
						<view class="clockDateSetting-content_item u-margin-top-24">
							<view class="clockDateSetting-content_label">
								<view class="u-margin-right-8 u-font-24">允许七日内补卡</view>
							</view>
							<u-radio :name="2"></u-radio>
						</view>
					</u-radio-group>
				</template>
			</view>
			<view class="u-margin-bottom-32">
				<u-checkbox v-model="queryForm.all" :size="28" shape="circle" @change="bindAllChange">
					选择后对管理的所有班级生效
				</u-checkbox>
			</view>
			<view class="clockDateSetting-content">
				<view class="clockDateSetting-content_item">
					<view class="clockDateSetting-content_label">
						<view class="u-margin-right-8 u-font-28">学生请假自动审批</view>
					</view>
					<u-switch v-model="leaveApproval" size="44" activeColor="#5C90F5" inactiveColor="#707070">
					</u-switch>
				</view>
			</view>
			<u-checkbox v-model="leaveApprovalAll" name="123" :size="28" shape="circle">
				选择后对管理的所有班级生效
			</u-checkbox>
		</view>
		<view class="clockDateSetting-footer">
			<u-button class="u-flex-1 u-margin-right-80 u-margin-left-80" type="primary" shape="circle"
				@click="submitForm">
				{{$t('mine.mine.clockDateSetting.saveClockSetting')}}
			</u-button>
		</view>
		<u-popup v-model="show" mode="center" border-radius="14" width="640rpx">
			<view class="popup">
				<view class="popup-text">
					1.{{$t('mine.mine.clockDateSetting.warningText1')}}
				</view>
				<view class="popup-text">
					2.{{$t('mine.mine.clockDateSetting.warningText2')}}
				</view>
				<view class="popup-text">
					3.{{$t('mine.mine.clockDateSetting.warningText3')}}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
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
				option: {},
				queryForm: {
					all: false,
					classIds: [],
					days: null,
					type: false,
				},
				checked: false,
				show: false,
				leaveApproval: false,
				leaveApprovalAll: false
			}
		},
		onLoad() {
			const that = this;
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on("acceptDataFromOpenerPage", function(data) {
				that.option = data
			});
			uni.setNavigationBarTitle({
				title: this.$t('mine.mine.clockDateSetting.title')
			})
		},
		onReady() {
			this.getClockCompensate()
			this.getLeaveApproval()
		},
		methods: {
			getClockCompensate() {
				getReq(URL.getClockCompensate, {
					classId: this.option.classId
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						this.queryForm = {
							all: false,
							classIds: [this.option.classId],
							days: res.data.type === 1 ? 1 : 2,
							type: true,
						}
					} else {
						this.queryForm = {
							all: false,
							classIds: [this.option.classId],
							days: null,
							type: false,
						}
					}
				}).catch(() => {
					this.queryForm = {
						all: false,
						classIds: [this.option.classId],
						days: null,
						type: false,
					}
				})
			},
			getLeaveApproval() {
				getReq(URL.apiGetLeaveApproval, {
					classId: this.option.classId
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						this.leaveApproval = res.data.leaveApproval ? true : false
					} else {
						this.leaveApproval = false
					}
					this.leaveApprovalAll = false
				}).catch(() => {
					this.leaveApproval = false
					this.leaveApprovalAll = false
				})
			},
			bindTypeChange(status) {
				this.queryForm.days = status ? 1 : null
			},
			bindAllChange({
				value
			}) {
				this.queryForm.classIds = value ? this.option.classList : [this.option.classId]
			},
			async submitForm() {
				try {
					const result = await postReq(URL.batchSettingCompensate, {
						...this.queryForm,
						type: this.queryForm.type ? 1 : 2
					})
					const leaveResult = await postReq(URL.apiPostLeaveApprovalBatch, {
						all: this.leaveApprovalAll,
						leaveApproval: this.leaveApproval ? 1 : 0,
						classIds: this.leaveApprovalAll ? this.option.classList : [this.option.classId]
					})
					if (result.error === 10000 && leaveResult.error === 10000) {
						uni.showToast({
							icon: 'none',
							title: "修改成功",
							duration: 2000
						})
						uni.navigateBack({
							delta: 1,
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000,
						})
					}
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '请稍后试',
						duration: 2000,
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.clockDateSetting {
		&-main {
			padding: 44rpx 40rpx 204rpx;
		}

		&-content {
			background: #FFFFFF;
			box-shadow: 0px 0px 8rpx 0px rgba(112, 112, 112, 0.1);
			border-radius: 24rpx;
			padding: 24rpx;
			margin-bottom: 24rpx;

			&_item {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			&_label {
				display: flex;
				align-items: center;
			}
		}

		&-footer {
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			box-sizing: content-box;
			width: 100%;
			height: 180rpx;
			background-color: #fff;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			z-index: 10;
		}
	}

	.popup {
		position: relative;
		padding: 32rpx 24rpx;

		&-text {
			font-size: 14px;
			line-height: 1.5;
			color: rgba(70, 70, 70, 1);
		}

		&-text+&-text {
			margin-top: 8rpx;
		}
	}
</style>
