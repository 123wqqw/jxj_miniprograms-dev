<template>
	<view class="runRecord">
		<drop-tab @handle-query="handleQuery" />
		<view class="u-flex-1" style="position: relative;">
			<scroll-view class="run-students" :scroll-y="true" :show-scrollbar="true"
				v-if="studentList && studentList.length" @scrolltolower="handleScroll">
				<block v-for="item in studentList" :key="item.id">
					<student-card :dataSource="item" @click="onRunrecord(item)" />
				</block>
				<u-loadmore v-if="pageNum > 1" :status="status" :icon-type="iconType" :load-text="loadText"
					class="u-padding-top-32" />
			</scroll-view>
			<view v-else class="u-flex u-row-center">
				<view class="u-text-center" style="margin-top: 240rpx;">
					<u-image width="300" height="300" src="@/static/md_icon_empty1.png" mode="aspectFit"></u-image>
					<text class="noData">未搜索到数据</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dropTab from './components/drop-tab/index.vue'
	import studentCard from './components/student-card/index.vue'
	import {
		dateFormat
	} from "@/common/util.js";
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	export default {
		components: {
			dropTab,
			studentCard
		},
		data() {
			return {
				queryForm: {},
				studentList: [],
				pageNum: 1,
				total: 0,
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				}
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('center.runDetails')
			})
		},
		methods: {
			handleQuery(data) {
				this.status = 'loadmore';
				this.studentList = []
				this.pageNum = 1
				this.queryForm = Object.assign({}, data, {
					beginTime: data.beginTime ? dateFormat(new Date(data.beginTime), 'yyyy-MM-dd') : '',
					endTime: data.endTime ? dateFormat(new Date(data.endTime), 'yyyy-MM-dd') : '',
					pageNum: this.pageNum,
					pageSize: 20
				})
				this.apiGetRunrecordpage()
			},
			apiGetRunrecordpage() {
				getReq(URL.runRecordPage, this.queryForm).then(res => {
					let list = []
					this.status = 'loading'
					if (res.data && JSON.stringify(res.data) !== '{}' && res.data.content && res.data.content
						.length) {
						this.total = res.data.total;
						list = res.data.content;
					} else {
						list = []
					}
					this.studentList = [...this.studentList, ...list];
					if (this.total <= this.studentList.length) {
						this.status = 'nomore';
					} else {
						this.status = 'loadmore';
					}
				}).catch(error => {
					this.total = 0;
					this.studentList = [];
					this.status = 'nomore';
				})
			},
			handleScroll() {
				if (this.total <= this.studentList.length) {
					this.status = 'nomore';

					return
				}
				this.pageNum = this.pageNum + 1
				this.queryForm = Object.assign({}, this.queryForm, {
					pageNum: this.pageNum,
					pageSize: 20
				})
				this.apiGetRunrecordpage()

			},
			onRunrecord(data) {
				this.$u.route({
					url: 'pagesCenter/sportCenter/runDetails/runRecord/index',
					params: {
						option: encodeURIComponent(JSON.stringify({
							id: data.id
						}))
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.runRecord {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
	}

	.run-students {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.noData {
		height: 32rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #B2B2B2;
		line-height: 32rpx;
	}
</style>
