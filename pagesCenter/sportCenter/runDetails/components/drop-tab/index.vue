<template>
	<view>
		<view class="bg-white u-padding-top-20 u-padding-left-32 u-padding-right-32 u-padding-bottom-12">
			<u-search v-model="queryForm.student" placeholder="请输入学生姓名" :clearabled="false" height="56"
				@custom="handleSubmit" @search="handleSubmit">
			</u-search>
		</view>
		<view class="dropTab">
			<view class="dropTab-item" :class="{'is-active': currentIndex === -1 }" @click="checkIndex(-1)">
				全部
			</view>
			<view class="dropTab-item" :class="{'is-active': currentIndex === 1 }" @click="checkIndex(1)">
				{{$t('center.standards')}}
			</view>
			<view class="dropTab-item" :class="{'is-active': currentIndex === 0 }" @click="checkIndex(0)">
				未{{$t('center.standards')}}
			</view>
			<view class="dropTab-item" @click="onDropDown" :style="{'color': isDropDown ? '#5C8FF7' : '#707070'}">
				<u-icon :name="isDropDown? 'arrow-up-fill' : 'arrow-down-fill'" size="16" color="#707070"
					:label="$t('center.filter')" label-color="707070" label-pos="left">
				</u-icon>
			</view>
			<view class="dropdown-content" :class="{'dropdown-height': isDropDown }">
				<view class="u-flex-1" style="position: relative;background-color: #fff;">
					<scroll-view class="scroll-bar" :scroll-y="true" :show-scrollbar="true">
						<u-collapse ref="collapseRef" :head-style="collapseHeadStyle" :accordion="false"
							@change="bindCollapseChange" v-if="isDropDown">
							<u-collapse-item :title="$t('center.semester')" :open="true">
								<select-block :dataSource="semesterList" :data="semesterData"
									@handle-all="bindCollapseChange" @handle-select="handleDaterange" />
							</u-collapse-item>
							<u-collapse-item :title="$t('center.startDate')" :open="true">
								<view class="u-padding-left-24 u-padding-right-24">
									<u-input v-model="dateData" :border="true" :clearable="false" :disabled="true"
										input-align="center" :placeholder="$t('center.selectDate')" />
									<calendar :dataSource="daterange" @change="selectDaterange" />
								</view>
							</u-collapse-item>
							<u-collapse-item :title="$t('center.grades')" :open="true">
								<select-block v-if="gradeList && gradeList.length" :dataSource="gradeList"
									@handle-all="bindCollapseChange" @handle-select="handleGrades" />
							</u-collapse-item>
							<u-collapse-item :title="$t('center.classes')" :open="true">
								<select-block v-if="classList && classList.length" :dataSource="classList"
									@handle-all="bindCollapseChange" @handle-select="handleClasses" />
							</u-collapse-item>
						</u-collapse>
					</scroll-view>
				</view>
				<view class="u-flex">
					<view class="operation-btn reset-btn" @click="handleReset">
						{{$t('center.reset')}}
					</view>
					<view class="operation-btn submit-btn" @click="handleSubmit">
						{{$t('center.submit')}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		getReq
	} from "@/common/request.js";
	import {
		URL
	} from "@/common/url.js";
	import {
		dateFormat
	} from "@/common/util.js";
	import selectBlock from '../select-block/index.vue';
	import calendar from '../calendar/index.vue';
	export default {
		components: {
			selectBlock,
			calendar
		},
		data() {
			return {
				isRefresh: false,
				currentIndex: -1,
				isDropDown: false,
				collapseHeadStyle: {
					padding: '16rpx 24rpx 24rpx',
					color: '#464646',
					fontSize: '32rpx'
				},
				queryForm: {
					beginTime: '',
					endTime: '',
					schoolId: '',
					classIds: '',
					status: '',
					student: ''
				},
				semesterList: [],
				semesterData: {},
				daterange: [],
				dateData: "",
				allClassData: [], // 存放老师所有的班级
				gradeList: [], // 老师管理班级所在年级
				classList: [], // 老师管理班级
			}
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		watch: {
			semesterData: {
				handler: function(data) {
					this.daterange = []
					if (data.value && data.value.length) {
						this.daterange = data.value
						this.queryForm.beginTime = data.value[0]
						this.queryForm.endTime = data.value[1]
						this.dateData =
							`${dateFormat(new Date(data.value[0]), 'yyyy-MM-dd')} 至 ${dateFormat(new Date(data.value[1]), 'yyyy-MM-dd')}`
						this.isRefresh = true
					}
				}
			},
			isRefresh: {
				handler: function(data) {
					if (data) {
						this.$emit('handle-query', this.queryForm)
					}
				}
			}
		},
		onReady() {
			this.queryForm.schoolId = this.xiaotiyunUser.teacher.schoolId
			this.apiGetSemesterList()
			this.apiGetAssignInfo()
		},
		methods: {
			checkIndex(currentIndex) {
				this.currentIndex = currentIndex
				switch (currentIndex) {
					case 0:
						this.queryForm.status = 0
						break;
					case 1:
						this.queryForm.status = 1
						break;
					default:
						this.queryForm.status = ""
						break;
				}
				if (!this.isDropDown) {
					this.$emit('handle-query', this.queryForm)
				}
			},
			onDropDown() {
				this.isDropDown = !this.isDropDown
				if (this.isDropDown) {
					this.daterange = [new Date(this.queryForm.beginTime).getTime(), new Date(this.queryForm.endTime)
						.getTime()
					]
				}
			},
			bindCollapseChange() {
				this.$nextTick(() => {
					this.$refs.collapseRef.init()
				})
			},
			/**
			 * 学期列表
			 */
			apiGetSemesterList() {
				getReq(URL.semesterList, {
					schoolId: this.xiaotiyunUser.teacher.schoolId
				}).then(res => {
					if (res.data && res.data.length) {
						const dataSource = res.data.sort((pre, next) => {
							return next.startTime - pre.startTime
						})
						this.semesterList = dataSource.map(item => ({
							label: item.semesterName,
							value: [item.startTime, item.endTime],
							index: item.id
						}))
						const newTime = new Date().getTime()
						let data = dataSource.find(item => {
							return item.startTime <= newTime && item.endTime >= newTime
						})
						if (!data || JSON.stringify(data) === '{}') {
							data = dataSource[0]
						}
						this.semesterData = {
							label: data.id,
							value: [data.startTime, data.endTime]
						}
						// this.bindCollapseChange()
					} else {
						this.semesterList = []
						this.semesterData = {}
					}
				}).catch((error) => {
					this.semesterList = []
					this.semesterData = {}
				})
			},
			handleDaterange(data) {
				this.semesterData = {
					label: data.index,
					value: data.value
				}
			},
			selectDaterange(value) {
				this.queryForm.beginTime = this.dealDate(value[0])
				this.queryForm.endTime = this.dealDate(value[1])
				this.dateData = `${this.dealDate(value[0])} 至 ${this.dealDate(value[1])}`
			},
			dealDate(date) {
				date = date.split("-")
				const month = `0${date[1]}`
				const day = `0${date[2]}`
				return `${date[0]}-${month.substring(month.length - 2, month.length)}-${day.substring(day.length - 2, day.length)}`
			},
			/**
			 * 获取年级班级
			 */
			apiGetAssignInfo() {
				getReq(URL.assignInfo, {
					teacherId: this.xiaotiyunUser.teacher.teacherId,
					queryDate: dateFormat(new Date(), 'yyyy-MM-dd')
				}).then(res => {
					if (res.data && res.data.length) {
						this.allClassData = res.data
						let grades = []
						let classes = []
						res.data.forEach(item => {
							grades.push({
								label: item.gradeName,
								value: item.grade,
								index: item.grade
							})
							classes.push(...item.classList)
						})
						this.gradeList = grades
						this.classList = classes.map(item => ({
							label: item.aliasClassName ? item.aliasClassName : item.className,
							value: item.classId,
							index: item.classId
						}))
					} else {
						this.allClassData = []
						this.gradeList = []
						this.classList = []
					}
					// this.bindCollapseChange()
				}).catch((error) => {
					this.allClassData = []
					this.gradeList = []
					this.classList = []
				})
			},
			handleGrades(value) {
				this.classList = []
				this.$nextTick(() => {
					if (value && JSON.stringify(value) !== '{}') {
						this.classList = this.allClassData.find(item => {
							return item.grade === value.value
						}).classList.map(item => ({
							label: item.aliasClassName ? item.aliasClassName : item.className,
							value: item.classId,
							index: item.classId
						}))
					} else {
						this.classList = this.allClassData.map(item => {
							return item.classList
						}).flat().map(item => ({
							label: item.aliasClassName ? item.aliasClassName : item.className,
							value: item.classId,
							index: item.classId
						}))
					}
				})
				// this.bindCollapseChange()
			},
			handleClasses(value) {
				this.gradeList = []
				this.$nextTick(() => {
					this.gradeList = this.allClassData.map(item => ({
						label: item.gradeName,
						value: item.grade,
						index: item.grade
					}))
					if (value && JSON.stringify(value) !== '{}') {
						this.queryForm.classIds = value.value
					} else {
						this.queryForm.classIds = ""
					}
				})
				// this.bindCollapseChange()
			},
			handleSubmit() {
				this.$emit('handle-query', this.queryForm)
				this.isDropDown = false
			},
			handleReset() {
				const newTime = new Date().getTime()
				let data = this.semesterList.find(item => {
					return item.value[0] <= newTime && item.value[1] >= newTime
				})
				if (!data || JSON.stringify(data) === '{}') {
					data = this.semesterList[0]
				}
				this.semesterData = {
					lable: data.index,
					value: data.value
				}
				this.queryForm.classIds = ""
				this.queryForm.status = ""
				this.queryForm.student = ""
				this.currentIndex = -1
				this.$nextTick(() => {
					this.$emit('handle-query', this.queryForm)
					this.isDropDown = false
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.dropTab {
		position: relative;
		display: flex;
		height: 80rpx;
		background: #FFFFFF;
		font-size: 28rpx;
		font-weight: 500;
		color: #707070;

		&-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.is-active {
		position: relative;
		color: #5C8FF7;
	}

	.is-active::after {
		content: " ";
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 32rpx;
		height: 6rpx;
		margin-left: -16rpx;
		background: #5C8FF7;
		border-radius: 3rpx;
	}

	.dropdown-content {
		visibility: hidden;
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 80rpx;
		left: 0;
		width: 100%;
		height: 0;
		transition: all 0.3s linear;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 10070;
		transform: scale(1, 1);
	}

	.dropdown-height {
		visibility: visible;
		height: calc(100vh - 168rpx);
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.scroll-bar {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
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

	.bg-white {
		background-color: #fff;
	}
</style>
