<template>
	<view class="selectAI">
		<view class="selectAI-main">
			<!-- <u-tabs :list="tabList" :current="tabCurrent" inactive-color="#202020" active-color="#4A91FF"
				:font-size="28" :active-item-style="tabStyle" name="label" @change="bindCategoryIdChange">
			</u-tabs> -->
			<view class="u-margin-top-34">
				<u-tabs :list="dimensionList" :current="current" :show-bar="false" inactive-color="#202020"
					active-color="#202020" :font-size="28" :height="60" :active-item-style="dimensionStyle"
					@change="bindCurrentChange"></u-tabs>
			</view>
			<swiper class="swiper-wrap" circular :current="current" :duration="300" @change="bindSwiperChange">
				<swiper-item v-for="(item,index) in dimensionList" :key="index">
					<swiper-page :ref="'page' + index " :dimensionId="item.id" @change="bindCheckChange" />
				</swiper-item>
			</swiper>
		</view>
		<view class="selectAI-footer">
			<view class="u-line-1 u-flex-1 u-margin-right-12" style="width: 0;">
				已经选择{{ checkedList.length || 0 }}个作业项目
			</view>
			<u-button :custom-style="customStyle" type="primary" shape="circle" @click="submit">确定</u-button>
		</view>
	</view>
</template>

<script>
	import swiperPage from './swiperPage.vue'
	import {
		getReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";

	export default {
		components: {
			swiperPage,
		},
		data() {
			return {
				customStyle: {
					padding: "18rpx 64rpx",
					fontSize: "34rpx",
					fontWeight: 400,
				},
				tabList: [{
					label: 'AI运动',
					value: 1
				}, {
					label: '体能训练',
					value: 3
				}],
				tabStyle: {
					fontSize: '34rpx',
					color: '#202020'
				},
				tabCurrent: 1,
				categoryId: 3,
				dimensionList: [],
				dimensionStyle: {
					height: '60rpx',
					lineHeight: '60rpx',
					fontSize: '26rpx',
					background: '#F1F1F1',
					borderRadius: '30rpx',
				},
				current: -1,
				checkedData: {
					1: [],
					3: []
				},
				checkedList: [],
			};
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t("task.assign.selectAi.title"),
			});
		},
		mounted() {
			this.apiGetDimensionList();
		},
		methods: {
			// 体质改善方向
			apiGetDimensionList() {
				getReq(URL.apiGetDimensionList)
					.then((res) => {
						if (res.data && res.data.length) {
							this.dimensionList = [{
								name: '全部',
								id: -1
							}, ...res.data];

							this.$nextTick(() => {
								this.switchTab(0);
							})
						} else {
							this.dimensionList = [];
						}
					})
					.catch((error) => {
						this.dimensionList = [];
					});
			},
			// bindCategoryIdChange(index) {
			// 	this.tabCurrent = index
			// 	this.categoryId = this.tabList[index].value
			// 	this.switchTab(0, true);
			// },
			bindCurrentChange(index) {
				this.switchTab(index);
			},
			bindSwiperChange(e) {
				this.switchTab(e.detail.current);
			},
			/**
			 * @param index 体质改善方向下标
			 */
			switchTab(index, reset = false) {
				if (this.current === index && !reset) {
					return
				}
				this.current = index
				this.dimensionList.forEach((item, index) => {
					this.$refs['page' + index][0].clear();
				})
				this.$refs['page' + index][0].loadData(this.categoryId, this.checkedList);
			},
			bindCheckChange(checked) {
				this.checkedData[this.categoryId][this.current] = checked
				this.checkedList = Array.from(new Set([...this.checkedData[1].flat(), ...this.checkedData[3].flat()].map(
					item => item
					.id)))
			},
			submit() {
				const pages = getCurrentPages();
				const prevPage = pages[pages.length - 2]; //上一个页面
				const dataSource = [...this.checkedData[1].flat(), ...this.checkedData[3].flat()]
				const res = new Map();
				prevPage.$vm.AIItemList = dataSource.filter((item) => !res.has(item.id) && res.set(item.id, 1))
				this.$u.route({
					type: "navigateBack",
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.selectAI {
		width: 100%;
		background-color: #fff;

		&-main {
			padding-right: 40rpx;
			padding-left: 40rpx;
		}

		&-footer {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 52rpx;
			padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
			background-color: #fff;
			font-size: 34rpx;
			font-weight: 400;
			color: #000000;
			box-shadow: 0 1px 8px 1px rgba($color: #a5a5a5, $alpha: 0.2);
		}
	}

	.swiper-wrap {
		height: calc(100vh - 88rpx - 68rpx - 120rpx - 34rpx);
		height: calc(100vh - 88rpx - 68rpx - 120rpx - 34rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 88rpx - 68rpx - 120rpx - 34rpx - env(safe-area-inset-bottom));
	}
</style>
