<template>
	<view class="leaveNotice">
		<view class="leaveNotice-content" v-for="item in dataSource" :key="item.id" @click="jumpLeavenoticePages(item)">
			<view class="leaveNotice-content-box">
				<view class="leaveNotice-content-box_title">
					{{item.name}}的{{ dateFormat(new Date(item.askleaveDate),'MM月dd日')}}请假
				</view>
				<view class="leaveNotice-content-box_text">
					申请时间：{{dateFormat(new Date(item.askleaveTime),'yyyy/MM/dd hh:mm')}}
				</view>
			</view>
			<!-- （0.未审批；1.审批通过；2.审批驳回；3.已撤销） -->
			<image
				:src="`/pagesNotice/static/${['icon_reivew','icon_pass','icon_reject','icon_withdrawal'][item.approvalStatus]}.png`"
				mode="aspectFit" style="width: 80rpx;height: 80rpx;"></image>
		</view>
	</view>
</template>

<script>
	import {
		getReq,
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		dateFormat
	} from '@/common/util.js'
	export default {
		data() {
			return {
				dataSource: [],
				total: 0,
				pageNum: 1,
				dateFormat
			}
		},
		onShow() {
			this.dataSource = []
			this.total = 0
			this.pageNum = 1
			this.apiGetApprovalList()
		},
		onReachBottom() {
			if (this.dataSource.length < this.total) {
				this.pageNum += 1
				this.apiGetApprovalList()
			}
		},
		methods: {
			apiGetApprovalList() {
				getReq(URL.apiGetApprovalList, {
					pageNum: this.pageNum,
					pageSize: 20
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const {
							content,
							total
						} = res.data
						this.total = total || 0
						if (content && content.length) {
							this.dataSource = [...this.dataSource, ...content]
						} else {
							this.dataSource = []
						}
					}
				}).catch(() => {
					this.total = 0
					this.dataSource = []
				})
			},
			jumpLeavenoticePages(data) {
				this.$u.route({
					url: "/pagesNotice/leaveNoticeReview/index",
					params: {
						id: data.id
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.leaveNotice {
		padding: 44rpx 40rpx;
		padding-bottom: 44rpx;
		padding-bottom: calc(44rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(44rpx + env(safe-area-inset-bottom));

		&-content+&-content {
			margin-top: 22rpx;
		}

		&-content {
			display: flex;
			align-items: center;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 16rpx 0px rgba(219, 219, 219, 0.5);
			border-radius: 18rpx;
			border: 1rpx solid #F1F2F3;
			padding: 36rpx 38rpx;

			&-box {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 80rpx;
				margin-right: 36rpx;

				&_title {
					font-size: 28rpx;
					line-height: 1.5;
					font-weight: bold;
					color: #202020;
				}

				&_text {
					font-size: 24rpx;
					line-height: 1.5;
					color: #707070;
				}
			}
		}
	}
</style>

