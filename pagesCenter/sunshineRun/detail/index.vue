<template>
	<view class="sunshine-detail-wrapper">
		<list-item :dataSource="runItem" :classList="allClassList" :showArrow="false" />
		<view class="query-type-bezel">
			<button class="type-button" :class="{ selected: queryForm.queryType == 1 }" @click="clickQueryType(1)">
				{{ $t('center.sunshineRun.studentData') }}
			</button>
			<button class="type-button" :class="{ selected: queryForm.queryType == 2 }" @click="clickQueryType(2)">
				{{ $t('center.sunshineRun.teacherData') }}
			</button>
		</view>
		<view class="segment-bezel">
			<u-dropdown ref="uDropdown" active-color="#5C8FF7" title-size="24">
				<u-dropdown-item :title="$t('common.gradeText')" :options="gradeOptions" v-model="queryForm.grade"
					@change="changeGrade" />
				<u-dropdown-item :title="$t('common.classText')" :options="classOptions[queryForm.grade]"
					v-model="queryForm.classId" @change="clickSearch" />
				<u-dropdown-item :title="$t('common.dateRange')">
					<view class="slot-content">
						<view class="calendar-bezel">
							<calendar :dataSource="dateRange" @change="changeDateRange" />
						</view>
						<view class="u-flex">
							<view class="operation-btn reset-btn" @click="clickResetDate">{{$t('center.reset')}}</view>
							<view class="operation-btn submit-btn" @click="clickDoneDate">{{$t('center.submit')}}</view>
						</view>
					</view>
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view class="action-bezel">
			<u-search :placeholder="searchPlaceholder" :clearabled="false" height="56" v-model="queryForm.searchKey"
				@custom="clickSearch" @search="clickSearch">
			</u-search>
			<view class="download-bezel" :loading="loading" @click="clickDownload">
				<image src="../../static/images/icon-download.png" class="download-img"></image>
				<view class="download-title">{{$t('common.download')}}</view>
			</view>
		</view>
		<view class="participate-bezel">
			<button class="participate-button" :class="{ selected: queryForm.type == 0 }" @click="clickParticipant(0)">
				{{ $t('center.sunshineRun.participated') + '（' + (detailInfo.totalNumber || 0) + '）' }}
			</button>
			<button class="participate-button" :class="{ selected: queryForm.type == 1 }" @click="clickParticipant(1)">
				<span>{{ $t('center.sunshineRun.unparticipate') }}</span>
				<span>{{ '（' + ((detailInfo.total || 0) - (detailInfo.totalNumber || 0)) + '）' }}</span>
			</button>
		</view>
		<student-table v-if="queryForm.queryType == 1" class="table-list" v-bind:queryParam.sync="queryForm"
			:dataSource="listData" :totalCount="totalCount" v-bind:triggered.sync="triggered"
			v-bind:status.sync="status" v-on:click-search="clickSearch" v-on:query-more="getList">
		</student-table>
		<teacher-table v-if="queryForm.queryType == 2" class="table-list" v-bind:queryParam.sync="queryForm"
			:dataSource="listData" :totalCount="totalCount" v-bind:triggered.sync="triggered"
			v-bind:status.sync="status" v-on:click-search="clickSearch" v-on:query-more="getList">
		</teacher-table>
	</view>
</template>

<script>
	import listItem from '../components/listItem.vue';
	import calendar from '../../sportCenter/runDetails/components/calendar/index.vue';
	import studentTable from './components/studentTable.vue';
	import teacherTable from './components/teacherTable.vue';
	import { mapState } from 'vuex';
	import { getReq, postReq } from "../../../common/request.js";
	import { URL } from "../../../common/url.js";
	import ClassUtil from '@/common/utility/ClassUtil.js';
	import { getDateTime, getDateSpeed, downloadPreviewExcelFile } from "@/common/util.js";

	export default {
		components: {
			'list-item': listItem,
			calendar,
			'student-table': studentTable,
			'teacher-table': teacherTable,
		},

		data() {
			return {
				getDateTime,
				getDateSpeed,
				runItem: {},
				allClassList: [],
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
				dateRange: [],
				queryForm: {
					id: '',
					grade: '',
					classId: '',
					teacherId: '',
					queryType: '1', // 查询类型(1.学生；2.教师)
					startTime: '',
					endTime: '',
					searchKey: '',
					mileageOrderBy: 0,
					runCountOrderBy: 0,
					runDurationOrderBy: 0,
					speedOrderBy: 0,
					type: 0,
					pageNum: 1,
					pageSize: 20,
				},
				loading: false,
				status: 'loadmore',
				triggered: false,
				detailInfo: {},
				listData: [],
				totalCount: 0,
			}
		},

		computed: {
			...mapState(['xiaotiyunUser']),
			searchPlaceholder() {
				if (this.queryForm.queryType == 1) {
					return this.$t('center.sunshineRun.searchStudent');
				} else {
					return this.$t('center.sunshineRun.searchTeacher');
				}
			}
		},

		onLoad(options) {
			let _this = this;
			const eventChannel = _this.getOpenerEventChannel();
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromSunshineRunPage', function(data) {
				_this.runItem = data.item;
				_this.allClassList = data.classList;
				_this.queryForm.id = data.item.id;
				_this.getList();
			});
			this.getTeacherClass();
		},

		methods: {
			// 获取老师管理的班级
			getTeacherClass() {
				let params = { teacherId: this.xiaotiyunUser.teacher.teacherId }
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
										value: ''
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
								value: '',
								classOptions: [{
									label: '全部',
									value: ''
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
				let { grade, classId, teacherId, searchKey, ...param } = this.queryForm;
				if (this.queryForm.queryType == 1) {
					param['grade'] = grade;
					param['classId'] = classId;
				} else if (this.queryForm.queryType == 2) {
					param['teacherId'] = teacherId;
				}
				if (searchKey) {
					param['searchKey'] = searchKey;
				}
				let _this = this;
				postReq(URL.apiPostSunshineRunDetail, param).then(res => {
					if (res.error == 10000) {
						_this.detailInfo = res.data;
						if (res.data && res.data.detailListVOS && JSON.stringify(res.data.detailListVOS) !==
							'{}') {
							if (_this.queryForm.pageNum == 1) {
								_this.listData = res.data.detailListVOS.content || [];
							} else {
								_this.listData = _this.listData.concat(res.data.detailListVOS.content || []);
							}
							_this.totalCount = res.data.detailListVOS.total || 0;
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
			// 选择查询类型
			clickQueryType(value) {
				if (this.queryForm.queryType == value) {
					return
				}
				this.queryForm.grade = '';
				this.queryForm.classId = '';
				this.queryForm.teacherId = '';
				this.queryForm.searchKey = '';
				this.queryForm.queryType = value;
				this.clickSearch();
			},
			// 选择年级
			changeGrade(value) {
				this.queryForm.classId = '';
				this.clickSearch();
			},
			// 选择日期
			changeDateRange(value) {
				this.queryForm.startTime = this.dealDate(value[0]) + ' 00:00:00';
				this.queryForm.endTime = this.dealDate(value[1]) + ' 23:59:59';
			},
			// 重置日期
			clickResetDate() {
				this.dateRange = [];
				this.queryForm.startTime = '';
				this.queryForm.endTime = '';
				this.$refs.uDropdown.close();
				this.clickSearch();
			},
			// 确定日期
			clickDoneDate() {
				this.$refs.uDropdown.close();
				this.dateRange = [this.queryForm.startTime.split(' ')[0], this.queryForm.endTime.split(' ')[0]];
				this.clickSearch();
			},
			// 点击搜索
			clickSearch() {
				this.queryForm.pageNum = 1;
				this.getList();
			},
			// 点击下载
			clickDownload() {
				this.loading = true;
				let { grade, classId, teacherId, searchKey, ...param } = this.queryForm;
				if (this.queryForm.queryType == 1) {
					param['grade'] = grade
					param['classId'] = classId
				} else if (this.queryForm.queryType == 2) {
					param['teacherId'] = teacherId
				}
				if (searchKey) {
					param['searchKey'] = searchKey;
				}
				postReq(URL.apiPostSunshineRunDetailExport, param).then(res => {
					if (res.error == 10000) {
						downloadPreviewExcelFile(res.data);
					} else {
						uni.showToast({
							title: res.message,
						});
					}
					this.loading = false;
				}).catch(() => {
					this.loading = false;
				})
			},
			// 点击已参与/未参与
			clickParticipant(index) {
				if (this.queryForm.type == index) {
					return
				}
				this.queryForm.type = index;
				this.clickSearch();
			},
		}
	}
</script>

<style scoped lang="scss">
	.sunshine-detail-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.query-type-bezel {
		padding: 10rpx 24rpx 0rpx 24rpx;
		display: flex;
		flex-direction: row;

		.type-button {
			height: 60rpx;
			width: 49%;
			font-size: 24rpx;
		}

		.type-button.selected {
			color: white;
			background-color: #405FFF;
		}
	}

	.segment-bezel {
		margin-top: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		::v-deep .u-dropdown {
			background-color: #fff;
			border-bottom: 2rpx solid #eee;
		}

		.calendar-bezel {
			width: 100%;
			background-color: #fff;
		}

		.operation-btn {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 86rpx;
			font-size: 32rpx;
		}

		.reset-btn {
			background-color: #fff;
			color: #5C8FF7;
		}

		.submit-btn {
			background: #5C8FF7;
			color: #fff;
		}
	}

	.action-bezel {
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

	.participate-bezel {
		padding: 0rpx 24rpx 20rpx 24rpx;
		display: flex;
		flex-direction: row;
		background-color: #fff;

		.participate-button {
			height: 60rpx;
			width: 49%;
			font-size: 24rpx;
		}

		.participate-button.selected {
			color: white;
			background-color: #405FFF;
		}
	}

	.table-list {
		width: 100%;
		height: 100%;
	}
</style>