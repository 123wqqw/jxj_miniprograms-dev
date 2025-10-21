<template>
	<view class="detail-wrapper">
		<record-detail :dataSource="detailInfo"></record-detail>

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

		<record-table :dataSource="scoreList" @handle-sort="handleSort"></record-table>
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
				queryForm: {
					schoolId: '',
					taskId: '',
					classCampusIdOrderBy: 0, // 班级学号排序(1:升序 2：降序)
					scoreOrderBy: 0, // 次数排序(1:升序 2：降序)
				},
				detailInfo: {},
				tabList: [{
					name: '全部'
				}, {
					name: '女生'
				}, {
					name: '男生'
				}],
				currentTab: 0,
				scoreList: [],
				totalCount: 0,
				loading: false,
			}
		},
		computed: {
			...mapState(['xiaotiyunUser']),
		},
		onLoad(value) {
			uni.setNavigationBarTitle({
				title: this.$t('center.classTraining.navDetailTitle')
			});
			this.queryForm.taskId = value.taskId;
			this.queryForm.schoolId = this.xiaotiyunUser.teacher.schoolId;
			this.getDetail();
			this.getScoreList();
		},
		methods: {
			// 获取详情
			getDetail() {
				const params = {
					schoolId: this.queryForm.schoolId,
					taskId: this.queryForm.taskId
				};
				let _this = this;
				getReq(URL.apiGetClassTrainingDetail, params).then(res => {
					if (res.error == 10000) {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							_this.detailInfo = res.data
						} else {
							_this.detailInfo = {}
						}
						const totalNum = (this.detailInfo.maleNum || 0) + (this.detailInfo.femaleNum || 0)
						_this.tabList = [{
							name: '全部' + (totalNum ? `(${totalNum})` : '')
						}, {
							name: '女生' + (this.detailInfo.femaleNum ? `(${this.detailInfo.femaleNum})` :
								'')
						}, {
							name: '男生' + (this.detailInfo.maleNum ? `(${this.detailInfo.maleNum})` : '')
						}]
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000
						});
					}
					uni.stopPullDownRefresh();
				}).catch(() => {
					_this.detailInfo = {}
					uni.stopPullDownRefresh();
				})
			},
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
				if (this.queryForm.classCampusIdOrderBy) {
					params['classCampusIdOrderBy'] = this.queryForm.classCampusIdOrderBy
				}
				let _this = this;
				postReq(URL.apiPostClassTrainingScoreList, params).then(res => {
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
				getReq(URL.apiGetClassTrainingExport, {
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
				this.currentTab = value;
				this.getScoreList();
			},
			// 处理排序
			handleSort(sort) {
				this.queryForm.scoreOrderBy = 0
				this.queryForm.classCampusIdOrderBy = 0
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