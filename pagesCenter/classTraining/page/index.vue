<template>
	<view class="index-wrapper">
		<view class="segment-bezel">
			<u-dropdown active-color="#5C8FF7" title-size="24">
				<u-dropdown-item :title="$t('common.gradeText')" :options="gradeOptions" v-model="queryForm.grade"
					@change="changeGrade" />
				<u-dropdown-item :title="$t('common.classText')" :options="classOptions[queryForm.grade]"
					v-model="queryForm.classId" @change="changeClass" />
				<u-dropdown-item :title="$t('common.sport')" :options="sportOptions" height="calc(100vh - 82rpx)"
					v-model="queryForm.sportItemCode" @change="changeSport" />
			</u-dropdown>
		</view>
		<view class="content-bezel">
			<scroll-view scroll-y="true" :show-scrollbar="true" :refresher-enabled="true" :refresher-triggered="triggered"
				v-if="listData && listData.length" @refresherrefresh="handleScrollRefresh"
				@scrolltolower="handleScrollBottom">
				<training-item v-for="(item ,index) in listData" :key="index" :dataSource="item"
					@click-item="clickListItem" />
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
	import trainingItem from './components/trainingItem.vue';
	import { trainingSportItems } from '../../static/constant/sportConstant.js';
	import { mapState } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import ClassUtil from '@/common/utility/ClassUtil.js';

	export default {
		components: {
			trainingItem
		},
		data() {
			return {
				gradeOptions: [{
					label: '全部',
					value: 0,
				}],
				classOptions: {
					0: [{
						label: '全部',
						value: 0
					}]
				},
				sportOptions: [{
					label: '全部',
					value: ''
				}],
				queryForm: {
					pageNum: 1,
					pageSize: 10,
					classId: 0,
					grade: 0,
					schoolId: '',
					sportItemCode: '',
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
				title: this.$t('center.classTraining.navTitle')
			});
			trainingSportItems.forEach((item) => {
				if (item.value === '15MeterTurnBackRun') {
					this.sportOptions.push({
						label: this.$t('center.sportItems.MeterTurnBackRun15'),
						value: item.value
					});
				} else {
					this.sportOptions.push({
						label: this.$t('center.sportItems.' + item.value),
						value: item.value
					});
				}
			});
			this.queryForm.schoolId = this.xiaotiyunUser.teacher.schoolId
			this.getTeacherClass();
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
									// className = this.$t(ClassUtil.gradeNameI18n(item.grade)) + item.aliasClassName;
									className = item.aliasClassName;
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
								classOptions: [{
									label: '全部',
									value: 0
								}]
							}]
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
			// 获取列表
			getList() {
				this.status = 'loading'
				let _this = this;
				getReq(URL.apiGetClassTrainingList, this.queryForm).then(res => {
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
					_this.triggered = false;
				}).catch(() => {
					_this.listData = [];
					_this.totalCount = 0;
					_this.triggered = false;
					_this.status = 'nomore';
				})
			},
			// 选择年级
			changeGrade(value) {
				this.queryForm.pageNum = 1;
				this.queryForm.classId = 0;
				this.getList();
			},
			// 选择年级
			changeClass(value) {
				this.queryForm.pageNum = 1;
				this.getList();
			},
			// 选择运动项目
			changeSport(value) {
				this.queryForm.pageNum = 1;
				this.getList();
			},
			// 点击单元格
			clickListItem(item) {
				uni.navigateTo({
					url: '/pagesCenter/classTraining/detail/index?taskId=' + item.taskId,
				});
			},
			// 下拉刷新
			handleScrollRefresh() {
				this.triggered = true;
				this.queryForm.pageNum = 1;
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
	.index-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.segment-bezel {
		padding-bottom: 20rpx;
		background-color: #FAFAFA;

		::v-deep .u-dropdown {
			background-color: #fff;
			border-top: 2rpx solid #eee;
		}
	}

	.content-bezel {
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
</style>