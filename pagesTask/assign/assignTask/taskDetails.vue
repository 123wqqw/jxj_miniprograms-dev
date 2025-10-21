<template>
	<view class="taskdetails">
		<view class="taskdetails-info">
			<view class="taskdetails-info-title">
				{{$t('task.assign.assignTask.arrangeClasses')}}
			</view>
			<view class="u-flex u-flex-wrap">
				<block v-for="item in assignTaskParams.classList" :key="item.classId">
					<text class="taskdetails-info-text u-margin-bottom-24">
						{{ item.aliasClassName ? item.aliasClassName : item.className }}
					</text>
				</block>
			</view>
			<u-gap height="1" bg-color="#CACACA" margin-bottom="24"></u-gap>
			<view class="taskdetails-info-title">
				{{$t('task.assign.assignTask.setReleaseDate')}}（已选择{{assignTaskParams.assignDates.length}}天）
			</view>
			<view class="u-flex u-flex-wrap">
				<block v-for="item in assignTaskParams.assignDateRange" :key="item">
					<view class="u-flex u-margin-bottom-24">
						<view class="taskdetails-info-textLine"></view>
						<view class="taskdetails-info-text">
							{{item}}
						</view>
					</view>
				</block>
			</view>
		</view>

		<view class="taskData" v-if="(maleActions && maleActions.length) || (femaleActions && femaleActions.length)">
			<view class="u-font-34 u-margin-bottom-24 text-blod" v-if="maleActions && maleActions.length">
				男生AI动作项目
			</view>
			<view class="u-flex u-flex-wrap" v-if="maleActions && maleActions.length">
				<block v-for="(item,index) in maleActions" :key="index">
					<view class="taskdetails-info-text u-margin-bottom-16">
						<text>{{item.name}}</text>
						<text
							v-if="item.calculateType === 1">{{ item.num / 1000 / 60 < 1 ?`${item.num / 1000 }秒` : `${item.num / 1000 / 60}分钟`}}</text>
						<text v-else>{{item.num}}个</text>
					</view>
				</block>
			</view>
			<u-gap height="1" bg-color="#CACACA" margin-bottom="24"
				v-if="(maleActions && maleActions.length) || (femaleActions && femaleActions.length)"></u-gap>
			<view class="u-font-34 u-margin-top-8 u-margin-bottom-24 text-blod"
				v-if="femaleActions && femaleActions.length">
				女生AI动作项目
			</view>
			<view class="u-flex u-flex-wrap" v-if="femaleActions && femaleActions.length">
				<block v-for="(item,index) in femaleActions" :key="index">
					<view class="taskdetails-info-text u-margin-bottom-16">
						<text>{{item.name}}</text>
						<text
							v-if="item.calculateType === 1">{{ item.num / 1000 / 60 < 1 ?`${item.num / 1000 }秒` : `${item.num / 1000 / 60}分钟`}}</text>
						<text v-else>{{item.num}}个</text>
					</view>
				</block>
			</view>
		</view>

		<view class="taskData" v-if="customActions && customActions.length">
			<view class="u-font-34 u-margin-bottom-24 text-blod">
				自定义项目
			</view>
			<view class="u-flex u-flex-wrap">
				<block v-for="(item,index) in customActions" :key="index">
					<view class="taskdetails-info-text u-margin-bottom-24">
						{{item.name}}
					</view>
				</block>
			</view>
		</view>

		<view class="taskdetails-footer basic-container">
			<view class="taskdetails-footer-content">
				<u-button :custom-style="customStyle" shape="circle" class="u-flex-1 u-padding-right-10"
					@click="handleReset">重新编辑
				</u-button>
				<u-button :custom-style="customStyle" type="primary" shape="circle" class="u-flex-1 u-padding-left-10"
					@click="submit" :loading="loading">
					确认布置
				</u-button>
			</view>
		</view>
		<u-modal v-model="modalShow" :show-cancel-button="true" @cancel="modalShow = false"
			@confirm="confirm(value ? true:false)" ref="uModal" :async-close="true">
			<view class="u-padding-40">
				<view class="u-font-28 u-margin-bottom-16">
					班级中已存在作业，请选择布置方式
				</view>
				<u-radio-group v-model="value" :wrap="true" size="28">
					<u-radio :name="0">不替换，再添加作业</u-radio>
					<u-radio :name="1">替换原有作业</u-radio>
				</u-radio-group>
			</view>
		</u-modal>
	</view>
</template>

<script>
	let that = null
	import OBSupload from "@/common/huaweicloud/index.js"
	import {
		showToast
	} from "@/common/util.js"
	import {
		mapState
	} from 'vuex'
	import {
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	export default {
		data() {
			return {
				customStyle: {
					height: "84rpx",
					padding: "18rpx 0",
					fontSize: '34rpx',
					fontWeight: 600,
				},
				assignTaskParams: {},
				modalShow: false,
				value: 0,
				loading: false
			}
		},
		onLoad(options) {
			that = this;
			uni.setNavigationBarTitle({
				title: this.$t('task.assign.assignTask.title')
			})
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('assignTaskParams', function(data) {
				that.assignTaskParams = data;
			})
		},
		computed: {
			...mapState(['xiaotiyunUser']),
			maleActions() {
				if (this.assignTaskParams.taskDetails && this.assignTaskParams.taskDetails.length) {
					return this.assignTaskParams.taskDetails.filter(item => {
						return item.taskType === 2 && [0, 1].includes(item.partStatus)
					})
				}
				return []
			},
			femaleActions() {
				if (this.assignTaskParams.taskDetails && this.assignTaskParams.taskDetails.length) {
					return this.assignTaskParams.taskDetails.filter(item => {
						return item.taskType === 2 && [0, 2].includes(item.partStatus)
					})
				}
				return []
			},
			customActions() {
				if (this.assignTaskParams.taskDetails && this.assignTaskParams.taskDetails.length) {
					return this.assignTaskParams.taskDetails.filter((item, index) => {
						item.$index = index
						return item.taskType === 1
					})
				}
				return []
			}
		},
		methods: {
			handleReset() {
				this.$u.route({
					type: "navigateBack"
				})
			},
			submit() {
				if (this.assignTaskParams.replace) {
					return this.modalShow = true
				}
				this.confirm(false)
			},
			confirm(replace) {
				this.loading = true
				const customActions = this.customActions.filter(item => {
					return item.taskVideoUrl
				}).map(item => {
					return this.testHttp(item.taskVideoUrl, item.$index)
				})
				if (customActions && customActions.length) {
					Promise.all([...customActions]).then((values) => {
						if (values.some(item => item === true)) {
							this.apiPostTaskAssign(replace)
						} else {
							this.loading = false
						}
					}).catch(error => {
						this.loading = false
					})
				} else {
					this.apiPostTaskAssign(replace)
				}
			},
			testHttp(data, index) {
				return new Promise((resolve, reject) => {
					OBSupload(data, 'video').then(res => {
						if (res) {
							this.assignTaskParams.taskDetails[index].taskVideoUrl = res
							resolve(true)
						} else {
							resolve(false)
						}
					}).catch(error => {
						resolve(false)
					})
				})
			},
			apiPostTaskAssign(replace) {
				let taskDetails = []
				this.assignTaskParams.taskDetails.forEach(item => {
					const dataSource = JSON.parse(JSON.stringify(item))
					let target = ""
					if (dataSource.taskType === 1) {
						target = ""
					} else if (dataSource.calculateType === 1) {
						target = dataSource.num / 1000 / 60 < 1 ? `${dataSource.num / 1000 }秒` :
							`${dataSource.num / 1000 / 60}分钟`
					} else {
						target = `${dataSource.num}个`
					}
					dataSource.name = `${dataSource.name}${target}`

					if (dataSource.categoryId === 3) {
						const {
							$index,
							actionGroup,
							categoryId,
							difficulty,
							standardNum,
							...params
						} = dataSource
						taskDetails.push(params)
					} else {
						const {
							$index,
							actionGroup,
							categoryId,
							...params
						} = dataSource
						taskDetails.push(params)
					}
				})
				postReq(URL.apiPostTaskAssign, {
					assignDates: this.assignTaskParams.assignDates,
					classIds: this.assignTaskParams.classList.map(item => item.classId),
					replace,
					taskDetails
				}).then(res => {
					this.modalShow = false
					if (res.error === 10000) {
						this.$u.route({
							type: "navigateBack",
							delta: 3
						})
					} else {
						showToast('请稍后再试')
					}
					this.loading = false
				}).catch(() => {
					showToast('请稍后再试')
					this.modalShow = false
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.taskdetails {
		box-sizing: border-box;
		width: 100vw;
		padding: 20rpx 0 210rpx;
		padding-bottom: calc(210rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(210rpx + env(safe-area-inset-bottom));

		&-info {
			padding: 24rpx 40rpx 0;
			background-color: #FFFFFF;

			&-title {
				font-size: 34rpx;
				line-height: 48rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #202020;
				margin-bottom: 10rpx;
			}

			&-textLine {
				width: 4rpx;
				height: 20rpx;
				background: #94B7FF;
				margin: 0 10rpx;
			}

			&-text {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				line-height: 40rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #202020;
			}

			&-text+&-text {
				margin-left: 20rpx;
			}
		}

		&-footer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #FFFFFF;
			box-shadow: 0px -3rpx 54rpx 0px rgba(208, 208, 208, 0.5);

			&-content {
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-around;
				width: 100%;
				height: 180rpx;
				padding: 0 20rpx;
			}
		}
	}

	.taskData {
		margin: 40rpx;
		padding: 20rpx;
		background: #fff;
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 400;
		color: #000000;
	}

	.taskData+.taskData {
		margin-top: 48rpx;
	}

	.text-blod {
		font-weight: bold;
	}
</style>
