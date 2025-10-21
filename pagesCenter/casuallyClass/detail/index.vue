<template>
	<view class="detail-wrapper">
		<record-detail :dataSource="recordItem"></record-detail>

		<view class="tab-bezel">
			<view class="tab-container">
				<u-tabs font-size="24" :list="tabList" :is-scroll="false" :current="currentTab"
					@change="changeTab"></u-tabs>
			</view>
			<view class="download-button" :loading="loading" @click="clickDownload">
				<image class="arrow-icon" src="../../static/images/icon-download.png" mode="aspectFit">
				</image>
				<text>{{ $t('center.downloadTable') }}</text>
			</view>
		</view>

		<record-table :recordItem="recordItem" :dataSource="scoreList" @handle-sort="handleSort"></record-table>
	</view>
</template>

<script>
	import recordDetail from './components/recordDetail.vue';
	import recordTable from './components/recordTable.vue';
	import { mapState } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import { downloadPreviewExcelFile } from "@/common/util.js";

	export default {
		components: {
			recordDetail,
			recordTable
		},
		data() {
			return {
				recordItem: {},
				tabList: [{
					name: '全部'
				}, {
					name: '女生'
				}, {
					name: '男生'
				}],
				queryForm: {
					schoolId: '',
					taskId: '',
					scoreOrderBy: 0, // 次数排序(1:升序 2：降序)
				},
				currentTab: 0,
				scoreList: [],
				totalCount: 0,
				loading: false,
			}
		},
		computed: {
			...mapState(['xiaotiyunUser']),
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('center.casuallyClass.navDetailTitle')
			})
			let _this = this
			const eventChannel = _this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromCasuallyClassPage', function(data) {
				_this.recordItem = data
				_this.queryForm.taskId = data.taskId;
				_this.queryForm.schoolId = _this.xiaotiyunUser.teacher.schoolId;
				const totalNum = (_this.recordItem.maleNum || 0) + (_this.recordItem.femaleNum || 0)
				_this.tabList = [{
					name: '全部' + (totalNum ? `(${totalNum})` : '')
				}, {
					name: '女生' + (_this.recordItem.femaleNum ? `(${_this.recordItem.femaleNum})` :
						'')
				}, {
					name: '男生' + (_this.recordItem.maleNum ? `(${_this.recordItem.maleNum})` : '')
				}]
				_this.getScoreList();
			})
		},
		methods: {
			// 获取学生成绩列表
			getScoreList() {
				let params = {
					pageNum: 1,
					pageSize: 1000,
					schoolId: this.queryForm.schoolId,
					taskId: this.queryForm.taskId,
				}
				if (this.currentTab > 0) {
					params['gender'] = this.currentTab - 1
				}
				if (this.queryForm.scoreOrderBy) {
					params['scoreOrderBy'] = this.queryForm.scoreOrderBy
				}
				let _this = this;
				postReq(URL.apiPostCasuallyClassScoreList, params).then(res => {
					if (res.error == 10000) {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							_this.scoreList = res.data.content || [];
							_this.totalCount = res.data.total || 0;
						} else {
							_this.scoreList = [];
							_this.totalCount = 0;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000
						})
					}
				}).catch(() => {
					_this.scoreList = [];
					_this.totalCount = 0;
				})
			},
			// 下载表格
			downloadTable() {
				this.loading = true
				getReq(URL.apiGetCasuallyClassExport, {
					schoolId: this.queryForm.schoolId,
					taskId: this.queryForm.taskId,
				}).then(res => {
					if (res.error == 10000) {
						downloadPreviewExcelFile(res.data);
					} else {
						uni.showToast({
							title: res.message,
						})
					}
					this.loading = false
				}).catch(() => {
					this.loading = false
				})
			},
			// 切换标签
			changeTab(value) {
				if (this.currentTab === value) {
					return
				}
				this.currentTab = value
				this.getScoreList();
			},
			// 处理排序
			handleSort(sort) {
				this.queryForm.scoreOrderBy = 0
				this.queryForm[sort.value] = sort.sortState - 1
				this.getScoreList();
			},
			// 点击下载表格
			clickDownload() {
				this.downloadTable();
			},
		}
	}
</script>

<style scoped lang="scss">
	.detail-wrapper {
		display: flex;
		flex-direction: column;
	}

	.tab-bezel {
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #eeeeee;
	}

	.tab-container {
		width: 65%;
	}

	.download-button {
		margin-left: auto;
		margin-right: 24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		image {
			width: 36rpx;
			height: 36rpx;
		}

		text {
			color: #5C8FF7;
			font-size: 24rpx;
		}
	}
</style>