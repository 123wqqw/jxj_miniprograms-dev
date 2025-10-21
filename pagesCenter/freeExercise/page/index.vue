<template>
	<view class="free-exercise-wrapper">
		<view class="segment-bezel">
			<u-dropdown active-color="#5C8FF7" title-size="24">
				<u-dropdown-item :title="$t('common.gradeText')" :options="gradeOptions" v-model="queryForm.grade"
					@change="changeGrade" />
				<u-dropdown-item :title="$t('common.classText')" :options="classOptions[queryForm.grade]"
					v-model="queryForm.classId" @change="clickSearch" />
				<u-dropdown-item :title="$t('common.sport')" :options="sportOptions" height="calc(100vh - 82rpx)"
					v-model="queryForm.sportCode" @change="clickSearch" />
			</u-dropdown>
		</view>
		<view class="search-bezel">
			<u-search v-model="queryForm.studentName" placeholder="请输入学生姓名" :clearabled="false" height="56"
				@custom="clickSearch" @search="clickSearch">
			</u-search>
			<view class="download-bezel" @click="clickDownload">
				<image src="../../static/images/icon-download.png" class="download-img"></image>
				<view class="download-title">{{$t('common.download')}}</view>
			</view>
		</view>
		<view class="table-box-bezel">
			<view class="table-all-left">
				<view class="table-header">
					<view class="table-th first">{{$t('common.orderNumber')}}</view>
					<view class="table-th">{{$t('common.name')}}</view>
				</view>
			</view>
			<view class="table-all-box">
				<scroll-view scroll-x="true" class="table-all" :scroll-left="tableScrollLeft1" @scroll="scrolledLeft1">
					<view class="table-header">
						<view class="table-th first">{{$t('common.gender')}}</view>
						<view class="table-th aa">{{$t('common.gradeText')}}</view>
						<view class="table-th bb">{{$t('common.classText')}}</view>
						<view class="table-th">{{$t('center.freeExercise.sportItem')}}</view>
						<view class="table-th">{{$t('common.achievement')}}</view>
						<view class="table-th aa">{{$t('center.freeExercise.achievementState')}}</view>
						<view class="table-th bb">{{$t('center.startDate')}}</view>
						<view class="table-th aa">{{$t('center.device')}}</view>
					</view>
				</scroll-view>
			</view>
			<scroll-view scroll-y="true" :refresher-enabled="true" :refresher-triggered="triggered"
				v-if="listData && listData.length" @refresherrefresh="handleScrollRefresh"
				@scrolltolower="handleScrollBottom">
				<view class="table-all-left">
					<view class="table-row" v-for="(item, index) in listData" :key="index">
						<view class="table-td first">{{ index + 1 }}</view>
						<view class="table-td text-over">{{ item.name }}</view>
					</view>
				</view>
				<view class="table-all-box">
					<scroll-view scroll-x="true" class="table-all" :scroll-left="tableScrollLeft2" @scroll="scrolledLeft2">
						<view class="table-row" v-for="(item, index) in listData" :key="index">
							<view class="table-td first">{{ item.gender == 0 ? '女' : '男' }}</view>
							<view class="table-td aa">{{ handleGrade(item) }}</view>
							<view class="table-td bb">
								{{item.aliasClassName ? item.aliasClassName : (item.className || '')}}
							</view>
							<view class="table-td">{{ item.sportName || ''}}</view>
							<view class="table-td">{{ handleScore(item) }}</view>
							<view class="table-td aa">{{ handleScoreStatus(item) }}</view>
							<view class="table-td bb">
								{{ item.startTime ? dateFormat(new Date(item.startTime || ''), 'yyyy-MM-dd hh:mm:ss') : '' }}
							</view>
							<view class="table-td aa">{{ handleScoreSource(item) }}</view>
						</view>
					</scroll-view>
				</view>
				<u-loadmore class="u-padding-top-32" v-if="queryForm.pageNum > 1" :status="status" icon-type="flower"
					:load-text="loadText" />
			</scroll-view>
			<view class="u-flex u-row-center bg-gray" v-else>
				<view class="u-text-center" style="margin-top: 240rpx;">
					<u-image width="300" height="300" src="@/static/md_icon_empty1.png" mode="aspectFit"></u-image>
					<text class="noData">未搜索到数据</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { freeSportItems, funSportItems } from '../../static/constant/sportConstant.js';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import ClassUtil from '@/common/utility/ClassUtil.js';
	import DateUtil from '@/common/utility/DateUtil.js';
	import { dateFormat, downloadPreviewExcelFile } from "@/common/util.js";
	import { configSportScore } from '../../static/utilities/indexUtil.js';


	export default {
		data() {
			return {
				dateFormat,
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
					schoolId: '',
					pageNum: 1,
					pageSize: 20,
					classId: 0,
					grade: 0,
					sportCode: '',
					studentName: ''
				},
				status: 'loadmore',
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				triggered: false,
				listData: [0],
				totalCount: 0,
				tableScrollLeft1: 0,
				scrollingLeft1: false,
				tableScrollLeft2: 0,
				scrollingLeft2: false,
			}
		},
		computed: {
			...mapState(['xiaotiyunUser', 'schoolInfo']),
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('center.freeExercise.navTitle')
			});
			this.queryForm.schoolId = this.xiaotiyunUser.teacher.schoolId;
			freeSportItems.forEach((item) => {
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
				this.status = 'loading';
				let _this = this;
				let params = Object.assign({}, this.queryForm);
				if (params.classId) {
					params.grade = 0;
				}
				const index = funSportItems.findIndex((item) => item.value === this.queryForm.sportCode)
				if (index > -1) {
					params.customize = params.sportCode
					params.sportCode = 'FunSports'
				} else {
					params.customize = ''
				}
				getReq(URL.apiGetFreeExerciseList, params).then(res => {
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
			// 处理年级
			handleGrade(item) {
				return this.$t(ClassUtil.gradeNameI18n(item.grade));
			},
			// 处理成绩
			handleScore(row) {
				const dianaScoreConfig = this.schoolInfo.dianaScoreConfig;
				return configSportScore(row.score, row.sportCode, row.customize, dianaScoreConfig);
			},
			// 处理成绩状态
			handleScoreStatus(item) {
				if (item.abnormal == 1) {
					return '异常';
				}
				if (item.status == 1) {
					return '未完成';
				}
				if (item.score === null) { // 未测试
					return '-';
				}
				return '正常';
			},
			// 处理成绩来源设备
			handleScoreSource(item) {
				if (item.source == 1) {
					return '一体机'
				} else if (item.source == 2) {
					return '智慧平板'
				} else if (item.source == 3) {
					return 'AI体锻小站'
				} else {
					return ''
				}
			},
			// 选择年级
			changeGrade(value) {
				this.queryForm.classId = 0;
				this.clickSearch();
			},
			// 点击搜索
			clickSearch() {
				this.queryForm.pageNum = 1;
				this.getList();
			},
			// 点击下载
			clickDownload() {
				getReq(URL.apiGetFreeExerciseExport, this.queryForm).then(res => {
					if (res.error == 10000) {
						downloadPreviewExcelFile(res.data);
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				});
			},
			// 滚动右侧表格
			scrolledLeft1(event) {
				if (!this.scrollingLeft1 && this.scrollingLeft2) {
					this.scrollingLeft2 = false;
					return;
				}
				this.scrollingLeft1 = true;
				this.tableScrollLeft2 = event.detail.scrollLeft;
			},
			// 滚动右侧表格
			scrolledLeft2(event) {
				if (this.scrollingLeft1 && !this.scrollingLeft2) {
					this.scrollingLeft1 = false;
					return;
				}
				this.scrollingLeft2 = true;
				this.tableScrollLeft1 = event.detail.scrollLeft;
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
	.free-exercise-wrapper {
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

	.search-bezel {
		padding: 20rpx 24rpx;
		display: flex;
		flex-direction: row;
		background-color: #fff;

		.download-bezel {
			margin-left: auto;
			display: flex;
			flex-direction: row;
			align-items: center;

			.download-img {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
			}

			.download-title {
				font-size: 30rpx;
				color: #4169E1;
			}
		}
	}

	.table-box-bezel {
		position: relative;
		padding-bottom: env(safe-area-inset-bottom);
		width: 100%;
		flex: 1;
	}

	.table-box-bezel>scroll-view {
		position: absolute;
		top: 72rpx;
		left: 0;
		width: 100%;
		height: calc(100% - 72rpx);
	}

	.table-all-left {
		width: 250rpx;

		.table-header {
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			height: 72rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #707070;

			.table-th {
				padding-left: 20rpx;
				flex-basis: 170rpx;
				flex-shrink: 0;
				box-sizing: border-box;
			}

			.first {
				flex-basis: 80rpx;
			}
		}

		.table-row {
			display: flex;
			flex-wrap: nowrap;
			height: 72rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #202020;

			.table-td {
				flex-basis: 170rpx;
				flex-shrink: 0;
				box-sizing: border-box;
				padding: 24rpx 0 24rpx 20rpx;
				border-top: 1px solid #dddddd;
			}

			.text-over {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.first {
				flex-basis: 80rpx;
			}
		}
	}

	.table-all-box {
		width: calc(100% - 250rpx);
		overflow: hidden;
		position: absolute;
		left: 250rpx;
		top: 0;

		.table-all {
			.table-header {
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				height: 72rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #707070;

				.table-th {
					flex-basis: 220rpx;
					flex-shrink: 0;
					padding-left: 20rpx;
					box-sizing: border-box;
				}

				.first {
					flex-basis: 80rpx;
				}

				.aa {
					flex-basis: 150rpx;
				}

				.bb {
					flex-basis: 300rpx;
				}
			}

			.table-row {
				display: flex;
				flex-wrap: nowrap;
				height: 72rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #202020;

				.table-td {
					flex-basis: 220rpx;
					flex-shrink: 0;
					box-sizing: border-box;
					padding: 24rpx 0 24rpx 20rpx;
					border-top: 1px solid #dddddd;
				}

				.first {
					flex-basis: 80rpx;
				}

				.aa {
					flex-basis: 150rpx;
				}

				.bb {
					flex-basis: 300rpx;
				}
			}
		}
	}

	.bg-gray {
		background-color: #FAFAFA;
	}
</style>