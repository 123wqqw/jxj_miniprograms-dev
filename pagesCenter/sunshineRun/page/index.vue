<template>
	<view class="sunshine-run-wrapper">
		<view class="segment-bezel">
			<u-dropdown active-color="#5C8FF7" title-size="24">
				<u-dropdown-item :title="$t('common.gradeText')" :options="gradeOptions" v-model="queryForm.grade"
					@change="changeGrade" />
				<u-dropdown-item :title="$t('common.classText')" :options="classOptions[queryForm.grade]"
					v-model="queryForm.classId" @change="changeClass" />
				<u-dropdown-item :title="$t('center.sunshineRun.status')" :options="statusOptions"
					height="calc(100vh - 82rpx)" v-model="queryForm.status" @change="changeStatus" />
			</u-dropdown>
		</view>
		<view class="bg-white u-padding-top-20 u-padding-left-32 u-padding-right-32 u-padding-bottom-20">
			<u-search v-model="queryForm.name" :placeholder="$t('center.sunshineRun.searchTask')" :clearabled="false"
				height="60" @custom="clickSearch" @search="clickSearch">
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
					<text class="noData">未搜索到数据</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import listItem from '../components/listItem.vue';
	import { mapState } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import ClassUtil from '@/common/utility/ClassUtil.js';

	export default {
		components: {
			'list-item': listItem
		},

		data() {
			return {
				gradeOptions: [{
					label: '全部',
					value: '',
				}],
				classOptions: {
					0: [{
						label: '全部',
						value: ''
					}]
				},
				statusOptions: [{
					label: '全部',
					value: ''
				}, {
					label: '进行中',
					value: '2'
				}, {
					label: '未开始',
					value: '3'
				}, {
					label: '已结束',
					value: '4'
				}, {
					label: '已关闭',
					value: '1'
				}],
				allClassList: [],
				queryForm: {
					schoolId: '',
					pageNum: 1,
					pageSize: 20,
					classId: '',
					grade: '',
					status: '',
					name: ''
				},
				status: 'loadmore',
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				triggered: false,
				listData: [],
				totalCount: 0,
			}
		},

		computed: {
			...mapState(['xiaotiyunUser']),
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('center.sunshineRun.navTitle')
			});
			this.queryForm.schoolId = this.xiaotiyunUser.teacher.schoolId;
			this.getTeacherClass();
			this.getClassList();
			this.getList();
		},

		methods: {
			// 获取老师管理的班级
			getTeacherClass() {
				let params = {
					teacherId: this.xiaotiyunUser.teacher.teacherId
				}
				let _this = this;
				postReq(URL.classManage, params).then(res => {
					if (res.error == 10000) {
						if (res.data && res.data.length) {
							res.data.forEach((item) => {
								const gradeIndex = _this.gradeOptions.findIndex(grade => grade.value ==
									item.grade)
								if (gradeIndex < 0) {
									_this.gradeOptions.push({
										label: this.$t(ClassUtil.gradeNameI18n(item.grade)),
										value: item.grade,
									})
									_this.classOptions[item.grade] = [{
										label: '全部',
										value: 0
									}]
								}
								let className = item.className;
								if (item.aliasClassName) {
									className = this.$t(ClassUtil.gradeNameI18n(item.grade)) + item
										.aliasClassName;
								}
								_this.classOptions[item.grade].push({
									label: className,
									value: item.classId
								})
							});
						} else {
							_this.gradeOptions = [{
								label: '全部',
								value: 0,

							}];
							_this.classOptions = {
								0: [{
									label: '全部',
									value: ''
								}],
							}
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000
						})
					}
				})
			},
			// 获取所有班级列表
			getClassList() {
				let _this = this;
				let params = { schoolId: _this.xiaotiyunUser.teacher.schoolId }
				getReq(URL.glClassList, params).then(res => {
					if (res.error == 10000) {
						if (res.data) {
							this.allClassList = res.data;
						} else {
							this.allClassList = [];
						}
					} else {
						this.allClassList = [];
					}
				})
			},
			// 获取列表
			getList() {
				this.status = 'loading';
				let _this = this;
				postReq(URL.apiPostSunshineRunList, this.queryForm).then(res => {
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
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 2000
						});
					}
					_this.triggered = false
				}).catch(() => {
					_this.listData = [];
					_this.totalCount = 0;
					_this.triggered = false
					_this.status = 'nomore';
				})
			},
			// 选择年级
			changeGrade(value) {
				this.queryForm.pageNum = 1
				this.queryForm.classId = 0;
				this.getList();
			},
			// 选择班级
			changeClass(value) {
				this.queryForm.pageNum = 1
				this.getList();
			},
			// 选择状态
			changeStatus(value) {
				this.queryForm.pageNum = 1
				this.getList();
			},
			// 点击搜索
			clickSearch() {
				this.queryForm.pageNum = 1
				this.getList();
			},
			// 点击单元格
			clickListItem(item) {
				const _this = this;
				uni.navigateTo({
					url: '/pagesCenter/sunshineRun/detail/index',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						const data = { item: item, classList: _this.allClassList };
						res.eventChannel.emit('acceptDataFromSunshineRunPage', data);
					}
				});
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
		},
	}
</script>

<style scoped lang="scss">
	.sunshine-run-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.segment-bezel {
		padding-bottom: 0rpx;
		background-color: #FAFAFA;

		::v-deep .u-dropdown {
			background-color: #fff;
			border-top: 2rpx solid #eee;
		}
	}

	.bg-white {
		background-color: #fff;
	}

	.list-bezel {
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		position: relative;
		flex: 1;
		background: #FFFFFF;

		scroll-view {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>