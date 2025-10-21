<template>
	<view class="replacement">
		<view class="replacement-title">原运动项目</view>
		<view class="sportItem">
			<view class="sportItem-Img">
				<u-image width="100%" height="100%" :src="sportDetail.aiSportImg" mode="aspectFit"
					@click="jumpSportdetailPage">
				</u-image>
				<view class="sportItem-tag red" v-if="['跳绳','开合跳'].includes(sportDetail.aiSportName)">
					热门
				</view>
				<view class="sportItem-tag" v-else-if="sportDetail.aiCategoryId === 1">
					AI
				</view>
			</view>
			<view class="sportItem-content u-line-1">
				<view class="">
					{{ sportDetail.aiSportName }}
				</view>
				<view class="u-flex u-flex-wrap">
					<template v-if="sportDetail.exerciseDirectionName[0]">
						<u-tag :text="sportDetail.exerciseDirectionName[0]" mode="dark" bg-color="#FFD3B5"
							color="#EB701C" class="u-margin-right-16 u-margin-bottom-16" />
					</template>
					<template v-if="sportDetail.exerciseDirectionName[1]">
						<u-tag :text="sportDetail.exerciseDirectionName[1]" mode="dark" bg-color="#FFD3B5"
							color="#EB701C" class="u-margin-right-16 u-margin-bottom-16" />
					</template>
					<template v-if="['','简易','中等','偏难'][sportDetail.sportDifficulty]">
						<u-tag :text="['','简易','中等','偏难'][sportDetail.sportDifficulty]" mode="dark" bg-color="#DBF2FE"
							color="#4A91FF" class="u-margin-right-16 u-margin-bottom-16" />
					</template>
				</view>
			</view>
		</view>
		<u-tabs :list="tabList" :current="tabCurrent" inactive-color="#202020" active-color="#4A91FF" :font-size="28"
			:active-item-style="tabStyle" name="label" @change="bindCategoryIdChange">
		</u-tabs>
		<view class="u-margin-top-34">
			<u-tabs :list="dimensionList" :current="current" :show-bar="false" inactive-color="#202020"
				active-color="#202020" :font-size="28" :height="60" :active-item-style="dimensionStyle"
				@change="bindCurrentChange"></u-tabs>
		</view>
		<swiper class="swiper-wrap" circular :current="current" :duration="300" @change="bindSwiperChange">
			<swiper-item v-for="(item,index) in dimensionList" :key="index">
				<swiper-page :ref="'page' + index " :dimensionId="item.id" @click="handleChecked" />
			</swiper-item>
		</swiper>
		<u-select v-model="show" :list="sportTypeList" :title="AISportData.aiSportName" @confirm="confirm">
			<template #other>
				<view class="select-bar">
					<view @click="bindAIChange(1)" :class="{ 'is-active': aiCurrent === 1 }">
						定时
					</view>
					<view @click="bindAIChange(0)" :class="{ 'is-active': aiCurrent === 0 }">
						定数
					</view>
				</view>
			</template>
		</u-select>
	</view>
</template>

<script>
	import swiperPage from './swiperPage.vue'
	let that = null;
	import {
		URL
	} from "@/common/url.js";
	import {
		getReq
	} from "@/common/request.js";
	import {
		mapMutations
	} from "vuex";
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	export default {
		components: {
			swiperPage
		},
		data() {
			return {
				option: {},
				sportDetail: {},
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
				tabCurrent: 0,
				categoryId: 1,
				dimensionList: [],
				current: -1,
				dimensionStyle: {
					height: '60rpx',
					lineHeight: '60rpx',
					fontSize: '26rpx',
					background: '#F1F1F1',
					borderRadius: '30rpx',
				},
				cacheTab: [], // 缓存页数
				show: false,
				sportTypeList: [],
				aiCurrent: 1,
				AISportData: {}
			};
		},
		onLoad(e) {
			if (e && JSON.stringify(e) !== "{}") {
				this.option = JSON.parse(decodeURIComponent(e.option));
			}
		},
		mounted() {
			this.apiGetSportDetail()
			this.apiGetDimensionList();
		},
		methods: {
			...mapMutations(["setReplacement"]),
			apiGetSportDetail() {
				getReq(URL.apiGetSportDetail, {
					id: this.option.sportId
				}).then(res => {
					if (res.data && JSON.stringify(res.data) !== '{}') {
						this.sportDetail = res.data
					} else {
						this.sportDetail = {}
					}
				}).catch(() => {
					this.sportDetail = {}
				})
			},
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
			bindCategoryIdChange(index) {
				this.tabCurrent = index
				this.categoryId = this.tabList[index].value
				this.current = -1
				this.dimensionList.forEach((item, index) => {
					this.$refs['page' + index][0].clear();
				})
				this.switchTab(0, true);
			},
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
				if (this.$refs['page' + index][0].dataList.length === 0) {
					this.$refs['page' + index][0].loadData(this.categoryId);
				}
				// 缓存 tabId
				if (this.$refs['page' + index][0].dataList.length > MAX_CACHE_DATA) {
					const isExist = this.cacheTab.indexOf(this.current);
					if (isExist < 0) {
						this.cacheTab.push(this.current);
					}
				}
				// 释放 tabId
				if (this.cacheTab.length > MAX_CACHE_PAGE) {
					let cacheIndex = this.cacheTab[0];
					this.$refs['page' + cacheIndex][0].clear();
					this.cacheTab.splice(0, 1);
				}
			},
			handleChecked(data) {
				this.show = true;
				this.AISportData = data;
				this.bindAIChange(this.aiCurrent);
			},
			bindAIChange(index) {
				this.aiCurrent = index;
				if (index === 1) {
					this.sportTypeList = [{
							value: 0.5,
							label: "30秒",
						},
						{
							value: 1,
							label: "1分钟",
						},
						{
							value: 2,
							label: "2分钟",
						},
						{
							value: 3,
							label: "3分钟",
						},
						{
							value: 4,
							label: "4分钟",
						},
					];
				} else {
					let data = [];
					for (let i = 1; i <= 200; i++) {
						data.push({
							value: i,
							label: `${i}个`,
						});
					}
					this.sportTypeList = data;
				}
			},
			confirm(value) {
				const {
					id,
					sportDifficulty,
					sportModel,
					aiSportName,
					aiSportImg
				} = this.AISportData;
				const params = Object.assign({}, this.option, {
					sportId: id,
					sportDifficulty,
					sportModel,
					sportName: aiSportName,
					sportTarget: value[0].value,
					sportUrl: aiSportImg,
					sportModel: this.aiCurrent,
					standardModel: null,
					standard: null,
					gender: 2,
					categoryId: this.categoryId,
				});
				this.setReplacement(params);
				this.$u.route({
					type: "navigateBack",
				});
			},
			jumpSportdetailPage() {
				this.$u.route({
					url: '/pagesPlan/classPlan/replacement/sportDetail',
					params: {
						id: this.sportDetail.id
					},
				})
			},
		},
	};
</script>

<style scoped lang="scss">
	.replacement {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		height: calc(100vh - constant(safe-area-inset-bottom));
		height: calc(100vh - env(safe-area-inset-bottom));
		padding: 20rpx 40rpx;
		background-color: #fff;

		&-title {
			font-size: 28rpx;
			line-height: 1.5;
			font-weight: 400;
			color: #202020;
			margin-bottom: 20rpx;
		}
	}

	.sportItem {
		display: flex;
		align-items: center;
		padding: 34rpx 0;

		&-Img {
			position: relative;
			width: 256rpx;
			height: 144rpx;
			margin-right: 20rpx;
		}

		&-content {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			box-sizing: border-box;
			flex: 1;
			width: 0;
			min-height: 144rpx;
			font-size: 32rpx;
			line-height: 1.5;
			font-weight: 400;
			color: #202020;
		}
	}

	.swiper-wrap {
		flex: 1;
	}

	.sportItem-tag {
		position: absolute;
		top: 0;
		left: 0;
		width: 44rpx;
		text-align: center;
		background: linear-gradient(180deg, #6C91DE 0%, #3168DA 100%);
		border-radius: 6rpx 6rpx 6rpx 0;
		font-size: 18rpx;
		line-height: 1.5;
		font-weight: 600;
		color: #FFFFFF;
	}

	.red {
		background: #F67366;
	}

	.select-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 45rpx;
	}

	.select-bar .is-active {
		border-bottom: 6rpx solid #12A5EE;
	}
</style>
