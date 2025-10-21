<template>
	<view class="">
		<u-navbar :title="title" :custom-back="customBack"></u-navbar>
		<u-collapse :head-style="headStyle" :item-style="itemStyle" :body-style="bodyStyle" ref="collapseRef">
			<u-collapse-item v-for="(item, index) in list" :key="item.id" @change="current = 0">
				<view slot="title" @click="onSemester(item)">
					{{item.title}}
				</view>
				<u-tabs :list="item.gradeSemesterGoals" name="grade" :current="current" :height="88" :font-size="28"
					:bar-style="barStyle" active-color="#202020" inactive-color="#707070" @change="change"></u-tabs>
				<view class="runInfo" v-if="item.gradeSemesterGoals && item.gradeSemesterGoals.length">
					<view class="u-flex u-margin-bottom-24">
						<view class="text-blod">
							{{$t('center.semesterGoal')}}：
						</view>
						<view class="">
							男生{{computeNumber(item.gradeSemesterGoals[current].maleSemesterGoal || 0, '/', 1000).result || 0}}{{$t('center.kilometers')}}，女生{{computeNumber(item.gradeSemesterGoals[current].femaleSemesterGoal || 0, '/', 1000).result || 0}}{{$t('center.kilometers')}}
						</view>
					</view>
					<view class="text-blod">
						{{$t('center.runRule')}}：
					</view>
					<view
						v-if="item.gradeSemesterGoals[current].maleMinSingleDis && item.gradeSemesterGoals[current].femaleMinSingleDis">
						1.
						男生每次最少要跑{{computeNumber(item.gradeSemesterGoals[current].maleMinSingleDis || 0, '/', 1000).result || 0}}{{$t('center.kilometers')}}，女生每次最少要跑{{computeNumber(item.gradeSemesterGoals[current].femaleMinSingleDis || 0, '/', 1000).result || 0}}{{$t('center.kilometers')}}
					</view>
					<view
						v-if="item.gradeSemesterGoals[current].maleDayUpper && item.gradeSemesterGoals[current].femaleDayUpper">
						2.
						{{$t('center.dayUpper')}}男生{{computeNumber(item.gradeSemesterGoals[current].maleDayUpper || 0, '/', 1000).result || 0}}{{$t('center.kilometers')}}，女生{{computeNumber(item.gradeSemesterGoals[current].femaleDayUpper || 0, '/', 1000).result || 0}}{{$t('center.kilometers')}}
					</view>
					<view
						v-if="item.gradeSemesterGoals[current].maleMinSpeed && item.gradeSemesterGoals[current].maleMaxSpeed&& item.gradeSemesterGoals[current].femaleMinSpeed&& item.gradeSemesterGoals[current].femaleMaxSpeed">
						3.
						男生{{$t('center.speedControl')}}{{getDateSpeed(item.gradeSemesterGoals[current].maleMinSpeed) || 0}}
						-
						{{getDateSpeed(item.gradeSemesterGoals[current].maleMaxSpeed) || 0}}每{{$t('center.kilometers')}};女生{{$t('center.speedControl')}}{{getDateSpeed(item.gradeSemesterGoals[current].femaleMinSpeed) || 0}}
						-
						{{getDateSpeed(item.gradeSemesterGoals[current].femaleMaxSpeed) || 0}}每{{$t('center.kilometers')}};
					</view>
					<view
						v-if="item.gradeSemesterGoals[current].maleMinStep && item.gradeSemesterGoals[current].maleMaxStep&& item.gradeSemesterGoals[current].femaleMinStep&& item.gradeSemesterGoals[current].femaleMaxStep">
						4. 男生{{$t('center.stepControl')}}{{item.gradeSemesterGoals[current].maleMinStep || 0}} -
						{{item.gradeSemesterGoals[current].maleMaxStep || 0}}步/分钟；女生{{$t('center.stepControl')}}{{item.gradeSemesterGoals[current].femaleMinStep || 0}}
						- {{item.gradeSemesterGoals[current].femaleMaxStep || 0}}步/分钟
					</view>
				</view>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	import {
		dateFormat,
		computeNumber,
		getDateSpeed,
		dealNumber
	} from '@/common/util.js'
	export default {
		data() {
			return {
				computeNumber,
				getDateSpeed,
				dealNumber,
				title: "学期",
				itemStyle: {
					backgroundColor: "#fff"
				},
				headStyle: {
					padding: "28rpx 32rpx",
					fontSize: "28rpx",
					color: "#464646"
				},
				bodyStyle: {
					marginBottom: "16rpx"
				},
				barStyle: {
					height: '8rpx',
					background: "#5C8FF7",
					borderRadius: "4rpx"
				},
				list: [],
				grades: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "七年级", "八年级", "九年级", "高一", "高二", "高三"],
				current: 0
			}
		},
		onLoad(e) {
			this.title = this.$t('center.semseterSelectTitle');
			const dataSource = JSON.parse(decodeURIComponent(e.dataSource))
			this.list = dataSource.map(item => ({
				...item,
				title: `${item.semesterName}（${dateFormat(new Date(item.startTime),'yyyy-MM-dd')} - ${dateFormat(new Date(item.endTime),'yyyy-MM-dd')}）`,
				gradeSemesterGoals: item.gradeSemesterGoals ? item.gradeSemesterGoals.map(block => ({
					...block,
					grade: this.grades[block.grade - 1]
				})) : []
			}))
		},
		methods: {
			customBack() {
				this.$u.route({
					url: 'pagesCenter/sportCenter/runnStats/index',
					type: "redirectTo"
				})
			},
			change(index) {
				this.current = index;
				this.$nextTick(() => {
					this.$refs.collapseRef.init()
				})
			},
			onSemester(data) {
				const {
					gradeSemesterGoals,
					title,
					...params
				} = data;
				this.$u.route({
					url: 'pagesCenter/sportCenter/runnStats/index',
					type: "redirectTo",
					params: {
						option: encodeURIComponent(JSON.stringify(params))
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.runInfo {
		// height: 500rpx;
		padding: 32rpx;
		border-top: 1rpx solid #DDDDDD;
		font-size: 28rpx;
		line-height: 40rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #707070;
	}

	.text-blod {
		font-weight: bold;
		color: #202020;
	}
</style>
