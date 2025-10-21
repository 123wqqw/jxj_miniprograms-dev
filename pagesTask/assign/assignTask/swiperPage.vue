<template>
	<scroll-view class="scrollBar" enableBackToTop="true" scroll-y @scrolltolower="handleLoadmore">
		<checkbox-group @change="bindCheckChange">
			<block v-for="item in dataList" :key="item.id">
				<label class="sportItem">
					<view class="sportItem-Img" @click.stop.prevent="jumpSportdetailPage(item)">
						<u-image width="100%" height="100%" :src="item.aiSportImg" mode="aspectFit">
						</u-image>
						<view class="sportItem-tag red" v-if="['跳绳','开合跳'].includes(item.aiSportName)">
							热门
						</view>
						<view class="sportItem-tag" v-else-if="item.aiCategoryId === 1">
							AI
						</view>
					</view>
					<view class="sportItem-content u-line-1">
						<view class="">
							{{ item.aiSportName }}
						</view>
						<view class="u-flex u-flex-wrap">
							<template v-if="item.exerciseDirectionName[0]">
								<u-tag :text="item.exerciseDirectionName[0]" mode="dark" bg-color="#FFD3B5"
									color="#EB701C" class="u-margin-right-16 u-margin-bottom-16" />
							</template>
							<template v-if="item.exerciseDirectionName[1]">
								<u-tag :text="item.exerciseDirectionName[1]" mode="dark" bg-color="#FFD3B5"
									color="#EB701C" class="u-margin-right-16 u-margin-bottom-16" />
							</template>
							<template v-if="['','简易','中等','偏难'][item.sportDifficulty]">
								<u-tag :text="['','简易','中等','偏难'][item.sportDifficulty]" mode="dark" bg-color="#DBF2FE"
									color="#4A91FF" class="u-margin-right-16 u-margin-bottom-16" />
							</template>
						</view>
					</view>
					<checkbox :value="item.id" :checked="item.checked" />
				</label>
			</block>
		</checkbox-group>
	</scroll-view>
</template>

<script>
	import {
		getReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	export default {
		props: {
			dimensionId: {
				type: [Number, String],
				default: ''
			}
		},
		data() {
			return {
				categoryId: "",
				checkedList: [],
				dataList: [],
				pageNumber: 1,
				pageSize: 10,
				total: 0
			}
		},
		methods: {
			/**
			 * @pram categoryId 1 AI运动 3 体能训练
			 * @pram dimensionId 体质改善方向ID
			 * @return aiSportList 运动项目
			 */
			loadData(categoryId, checkedList) {
				this.categoryId = categoryId
				this.checkedList = checkedList
				getReq(URL.apiGetSportSelect, {
						dimensionId: this.dimensionId,
						categoryId,
						pageNumber: this.pageNumber,
						pageSize: this.pageSize,
					})
					.then((res) => {
						if (res.data && JSON.stringify(res.data) !== '{}') {
							const {
								content,
								total
							} = res.data

							this.total = total || 0
							if (content && content.length) {
								this.dataList = [...this.dataList, ...content].sort((pre, next) => {
									return pre.aiSportSort - next.aiSportSort
								}).map(item => ({
									...item,
									checked: checkedList.indexOf(item.id) !== -1 ? true : false
								}))
							} else {
								this.dataList = []
							}
						} else {
							this.total = 0
							this.dataList = []
						}
					})
					.catch(() => {
						this.total = 0
						this.dataList = []
					});
			},
			clear() {
				this.dataList = []
				this.pageNumber = 1
				this.pageSize = 10
				this.total = 0
			},
			bindCheckChange(e) {
				const data = e.detail.value
				const checked = this.dataList.filter(item => {
					return data.indexOf(`${item.id}`) !== -1
				}).map(item => ({
					...item,
					categoryId: this.categoryId,
				}))
				this.$emit('change', checked)
			},
			jumpSportdetailPage(data) {
				this.$u.route({
					url: '/pagesTask/assign/assignTask/sportDetail',
					params: {
						id: data.id
					},
				})
			},
			handleLoadmore() {
				if (this.dataList.length >= this.total) {
					return
				}
				this.pageNumber += 1
				this.loadData(this.categoryId, this.checkedList)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scrollBar {
		height: 100%
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
			margin-right: 20rpx;
			font-size: 32rpx;
			line-height: 1.5;
			font-weight: 400;
			color: #202020;
		}
	}

	.sportItem+.sportItem {
		border-top: 1px solid #E4E7ED;
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
</style>
