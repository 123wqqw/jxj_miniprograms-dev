<template>
	<view class="prize-verification-record-wrapper">
		<view class="u-padding-top-20 u-padding-left-32 u-padding-right-32 u-padding-bottom-20">
			<u-search :clearabled="false" height="60" bg-color="#FFFFFF" border-color="#EEEEEE"
				:action-style="{color: '#5C8FF7'}" :placeholder="$t('data.prizeVerification.page.searchName')"
				v-model="queryForm.name" @custom="clickSearch" @search="clickSearch">
			</u-search>
		</view>
		<view class="list-bezel">
			<scroll-view scroll-y="true" :show-scrollbar="true" :refresher-enabled="true"
				:refresher-triggered="triggered" v-if="listData && listData.length"
				@refresherrefresh="handleScrollRefresh" @scrolltolower="handleScrollBottom">
				<list-item v-for="(item ,index) in listData" :key="index" :dataSource="item" :classList="allClassList"
					@click-item="clickListItem(item)" />
				<u-loadmore class="u-padding-top-32" v-if="queryForm.pageNum > 1" :status="status" icon-type="flower"
					:load-text="loadText" />
			</scroll-view>
			<view class="u-flex u-row-center" v-else>
				<view class="u-text-center" style="margin-top: 240rpx;">
					<u-image width="300" height="300" src="@/static/md_icon_empty1.png" mode="aspectFit"></u-image>
					<text class="noData">{{$t('common.noSearchData')}}</text>
				</view>
			</view>
		</view>
		<u-modal :show-title="false" v-model="modalShow">
			<view class="record-detail-bezel">
				<view class="">
					<text class="detail-title">{{$t('data.prizeVerification.record.consumeCoin') + '：'}}</text>
					<text class="detail-info">{{selectItem.goldCoin || 0}}</text>
				</view>
				<view class="">
					<text class="detail-title">{{$t('data.prizeVerification.record.exchangeTime') + '：'}}</text>
					<text class="detail-info">
						{{selectItem.exchangeTime ? dateFormat(new Date(selectItem.exchangeTime)) : ''}}
					</text>
				</view>
				<view class="">
					<text class="detail-title">{{$t('data.prizeVerification.record.grantTime') + '：'}}</text>
					<text class="detail-info">
						{{selectItem.grantTime ? dateFormat(new Date(selectItem.grantTime )) : ''}}
					</text>
				</view>
				<view class="">
					<text class="detail-title">{{$t('data.prizeVerification.record.remark') + '：'}}</text>
					<text class="detail-info">{{selectItem.remarks || ''}}</text>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import listItem from './components/listItem.vue';
	import { mapState } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import { dateFormat } from '@/common/util.js';
	export default {
		components: {
			'list-item': listItem
		},

		data() {
			return {
				dateFormat,
				queryForm: {
					schoolId: '',
					teacherId: '',
					name: '',
					pageNum: 1,
					pageSize: 20,
				},
				triggered: false,
				listData: [],
				totalCount: 0,
				status: 'loadmore',
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				modalShow: false,
				selectItem: {},
			}
		},

		computed: {
			...mapState(['xiaotiyunUser']),
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('data.prizeVerification.record.title')
			});
			this.queryForm.schoolId = this.xiaotiyunUser.teacher.schoolId;
			this.queryForm.teacherId = this.xiaotiyunUser.teacher.teacherId;
			this.getList();
		},

		methods: {
			// 获取列表
			getList() {
				let _this = this;
				getReq(URL.apiGetPrizeVerificationRecords, this.queryForm).then(res => {
					if (res.error == 10000) {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							if (_this.queryForm.pageNum == 1) {
								_this.listData = res.data.content || [];
							} else {
								_this.listData = _this.listData.concat(res.data.content)
							}
							_this.totalCount = res.data.total || 0;
						} else {
							_this.listData = [];
							_this.totalCount = 0;
						}
						if (_this.totalCount <= _this.listData.length) {
							_this.status = 'nomore';
						} else {
							_this.status = 'loadmore';
						}
					} else {
						_this.listData = [];
						_this.totalCount = 0;
					}
					_this.triggered = false;
				}).catch(err => {
					_this.listData = [];
					_this.totalCount = 0;
					_this.triggered = false;
					_this.status = 'nomore';
				})
			},
			// 点击搜索
			clickSearch() {
				this.queryForm.pageNum = 1
				this.getList();
			},
			// 点击单元格
			clickListItem(item) {
				this.selectItem = item;
				this.modalShow = true;
			},
			// 下拉刷新
			handleScrollRefresh() {
				this.triggered = true
				this.queryForm.pageNum = 1
				this.getList();
			},
			// 滚动到底部，加载更多
			handleScrollBottom() {
				if (this.listData.length < this.totalCount) {
					this.queryForm.pageNum += 1;
					this.getList();
				} else {
					this.status = 'nomore';
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.prize-verification-record-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.list-bezel {
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		position: relative;
		flex: 1;

		scroll-view {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	.record-detail-bezel {
		padding: 70rpx 40rpx;
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	.detail-title {
		width: 140rpx;
		font-size: 28rpx;
		color: #999999;
		line-height: 40rpx;
	}

	.detail-info {
		font-size: 28rpx;
		color: #202020;
		line-height: 40rpx;
	}
</style>