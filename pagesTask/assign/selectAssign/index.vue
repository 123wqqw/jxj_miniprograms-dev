<template>
	<view class="basic-container">
		<view class="select-main">
			<!-- <view class="u-flex">
				<view class="select-item u-margin-right-20" :class="{'is-active':current === 0}" @click="current = 0">
					<u-image width="80rpx" height="80rpx" src="/pagesTask/static/images/icon_custom.png"
						mode="aspectFit">
					</u-image>
					<text>自定义作业</text>
				</view>
				<view class="select-item" :class="{'is-active':current === 1}" @click="handleRest(1)">
					<u-image width="80rpx" height="80rpx" src="/pagesTask/static/images/icon_job_template.png"
						mode="aspectFit">
					</u-image>
					<text>作业模板</text>
				</view>
			</view> -->
			<template v-if="current === 0">
				<view class="select-assign">
					<view class="u-flex-1">
						<text style="color: #363636;">自定义布置作业流程</text>
						<view class="u-margin-top-40" style="width: 200rpx;">
							<u-steps :list="stepList" :current="3" direction="column" un-active-color="#CBCBCB"
								active-color="#CBCBCB"></u-steps>
						</view>
					</view>
					<u-button type="primary" :custom-style="customStyle" @click="jumpPagesAssignTask">布置作业</u-button>
				</view>
			</template>
			<!-- <template v-if="current === 1">
				<view class="u-margin-top-40 u-margin-bottom-40 u-flex">
					<view class="assign-tabs" :class="{'is-active':queryForm.type === 1}" @click="handleRest(1)">
						个人模板
					</view>
					<view class="assign-tabs" :class="{'is-active':queryForm.type === 2}" @click="handleRest(2)">
						公共模板
					</view>
				</view>
				<u-tabs :list="gradeList" name="label" :current="currentGrade" bg-color="transparent"
					@change="bindGradesChange">
				</u-tabs>
				<block v-for="item in dataSource" :key="item.id">
					<view class="list-item" @longpress="longtap(item)" @click="jumpPagesInfo(item)">
						<view class="list-item-icon">
							<u-image width="54rpx" height="54rpx" src="/pagesTask/static/images/icon_template.png"
								mode="aspectFit">
							</u-image>
						</view>
						<view class="list-item-content">
							<view style="color: #000000;">
								{{item.name}}
							</view>
							<view class="u-flex" style="color: #828282;">
								<view class="u-flex-1 u-margin-right-8">
									布置次数：{{item.assignNumber}}
								</view>
								<view class="u-flex-1 u-margin-left-8">
									创建老师：{{item.teacherName}}
								</view>
							</view>
						</view>
						<u-icon name="arrow-right" color="#202020" size="32"></u-icon>
					</view>
				</block>
				<view class="divider" v-if="dataSource.length >= total">
					没有更多了
				</view>
			</template> -->
		</view>
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @confirm="confirm" @cancel="show= false">
		</u-modal>
	</view>
</template>

<script>
	let that = null
	import {
		showToast
	} from '@/common/util.js'
	import {
		mapState
	} from 'vuex'
	import {
		URL
	} from "@/common/url.js";
	import {
		getReq,
		postReq
	} from "@/common/request.js";
	export default {
		data() {
			return {
				option: {},
				show: false,
				content: "",
				delData: {},
				current: 0,
				customStyle: {
					width: '280rpx',
					height: "84rpx",
					padding: "18rpx 0",
					fontSize: '28rpx',
				},
				stepList: [{
					name: '选择作业项目'
				}, {
					name: '预览作业内容'
				}, {
					name: '完成作业布置'
				}],
				currentGrade: 0,
				gradeList: [{
						label: '一年级',
						value: 1
					},
					{
						label: '二年级',
						value: 2
					},
					{
						label: '三年级',
						value: 3
					},
					{
						label: '四年级',
						value: 4
					},
					{
						label: '五年级',
						value: 5
					},
					{
						label: '六年级',
						value: 6
					},
					{
						label: '初一',
						value: 7
					},
					{
						label: '初二',
						value: 8
					},
					{
						label: '初三',
						value: 9
					},
					{
						label: '高一',
						value: 10
					},
					{
						label: '高二',
						value: 11
					},
					{
						label: '高三',
						value: 12
					}
				],
				queryForm: {
					pageNum: 1,
					pageSize: 10,
					type: 1,
					grade: 1
				},
				total: 0,
				dataSource: []
			}
		},
		onLoad(e) {
			that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('assignBasicData', function(data) {
				that.option = data
			})
		},
		onShow() {
			if (this.current === 1) {
				this.dataSource = []
				this.handleQuery()
			}
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		onReachBottom() {
			if (this.dataSource.length < this.total) {
				this.queryForm.pageNum += 1
				this.handleQuery()
			}
		},
		methods: {
			bindGradesChange(index) {
				this.currentGrade = index
				this.queryForm.pageNum = 1
				this.queryForm.grade = this.gradeList[index].value
				this.dataSource = []
				this.handleQuery()
			},
			handleRest(type) {
				this.dataSource = []
				this.current = 1
				this.currentGrade = 0
				this.queryForm = {
					pageNum: 1,
					pageSize: 10,
					type,
					grade: 1
				}
				this.handleQuery()
			},
			handleQuery() {
				if (this.queryForm.type === 2) {
					this.queryForm.schoolId = this.xiaotiyunUser.teacher.schoolId
				}
				getReq(URL.apiGetTemplateList, {
					...this.queryForm
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						const {
							total,
							content
						} = res.data
						this.total = total || 0
						if (content && content.length) {
							this.dataSource = [...this.dataSource, ...content]
						} else {
							this.dataSource = []
						}
					} else {
						this.total = 0
						this.dataSource = []
					}
				}).catch(error => {
					this.total = 0
					this.dataSource = []
				})
			},
			longtap(item) {
				this.show = true
				this.content = `确定删除${item.name}`
				this.delData = item
			},
			async confirm() {
				try {
					const result = await postReq(URL.apiPostTemplateDelete, {
						id: this.delData.id
					})
					if (result.error !== 10000) {
						showToast(result.message)
					} else {
						this.dataSource = []
						this.current = 1
						this.currentGrade = 0
						this.queryForm = Object.assign(this.queryForm, {
							pageNum: 1,
							pageSize: 10,
							type: this.queryForm.type
						})
						this.handleQuery()
					}
				} catch (e) {
					showToast('删除失败，请稍后再试。')
				} finally {
					this.show = false
					this.delData = null
				}
			},
			jumpPagesInfo(data) {
				uni.navigateTo({
					url: '/pagesTask/assign/templateInfo/index',
					success: function(res) {
						res.eventChannel.emit('assignBasicData', {
							id: data.id,
							grades: that.queryForm.grade,
							classList: that.option.classList,
							replace: that.option.replace
						})
					}
				})
			},
			jumpPagesAssignTask() {
				uni.navigateTo({
					url: "/pagesTask/assign/assignTask/assignTask",
					success: function(res) {
						res.eventChannel.emit('assignBasicData', {
							...that.option
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.select-main {
		display: flex;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
		min-height: 100vh;
		padding: 56rpx 30rpx 20rpx;
		padding-bottom: 20rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	}

	.select-item {
		box-sizing: border-box;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 45rpx 32rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		line-height: 40rpx;
		color: #3D86F7;
		border-radius: 16rpx;
		border: 1px solid #5C8FF7;
		background-color: #ecf5ff;
	}

	.is-active {
		color: #fff !important;
		box-shadow: 0px 2rpx 18rpx -8rpx #6695F6;
		background-color: #6695F6 !important;
	}

	.select-assign {
		flex: 1;
		margin-top: 180rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.assign-tabs {
		padding: 14rpx 16rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #000000;
		line-height: 33rpx;
		background-color: #fff;
		border: 1rpx solid #DEDEDE;
	}

	.assign-tabs:nth-child(1) {
		border-radius: 30rpx 0 0 30rpx;
		border-right: none;
	}

	.assign-tabs:nth-child(2) {
		border-radius: 0 30rpx 30rpx 0;
		border-left: none;
	}

	.list-item {
		box-sizing: border-box;
		display: flex;
		padding: 30rpx 0;

		&-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 104rpx;
			height: 104rpx;
			background: rgba(18, 194, 135, 0.05);
			border-radius: 8rpx;
			border: 1rpx solid #12C287;
		}

		&-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;
			margin: 0 30rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			line-height: 40rpx;
		}
	}

	.list-item+.list-item {
		border-top: 1rpx solid #E3E3E3;
	}

	.divider {
		font-size: 28rpx;
		line-height: 1.5;
		margin: 32rpx 0;
		text-align: center;
	}
</style>
