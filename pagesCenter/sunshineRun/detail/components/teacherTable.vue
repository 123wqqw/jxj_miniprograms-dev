<template>
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
					<view class="table-th" v-for="(item, index) in studentListKey" :key="index" :class="item.class"
						@click="clickSort(item)">
						<view style="float: left;">{{ item.name }}</view>
						<view class="sortBox">
							<image src="../../../../static/images/common/arrow-up-yes.png" class="sortImg"
								v-if="item.sortState && item.sortState!== 3"></image>
							<image src="../../../../static/images/common/arrow-up-no.png" class="sortImg"
								v-if="item.sortState && item.sortState== 3"></image>
							<image src="../../../../static/images/common/arrow-down-yes.png" class="sortImg"
								v-if="item.sortState && item.sortState!== 2"></image>
							<image src="../../../../static/images/common/arrow-down-no.png" class="sortImg"
								v-if="item.sortState && item.sortState== 2"></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<scroll-view scroll-y="true" :refresher-enabled="true" :refresher-triggered="triggered"
			v-if="dataSource && dataSource.length" @refresherrefresh="handleScrollRefresh"
			@scrolltolower="handleScrollBottom">
			<view class="table-all-left">
				<view class="table-row" v-for="(item, index) in dataSource" :key="index">
					<view class="table-td first">{{ index + 1 }}</view>
					<view class="table-td text-over">{{ item.name }}</view>
				</view>
			</view>
			<view class="table-all-box">
				<scroll-view scroll-x="true" class="table-all" :scroll-left="tableScrollLeft2" @scroll="scrolledLeft2">
					<view class="table-row" v-for="(item, index) in dataSource" :key="index">
						<view class="table-td aa">{{ handleTeacherType(item) }}</view>
						<view class="table-td aa">{{ item.mileage !== null ? (item.mileage / 1000) : '' }}</view>
						<view class="table-td aa">{{ item.runCount || '' }}</view>
						<view class="table-td aa">{{ getDateTime((item.runDuration || 0) / 1000)}}</view>
						<view class="table-td aa">{{ item.speed !== null ? getDateSpeed(item.speed) : ''}}</view>
					</view>
				</scroll-view>
			</view>
			<u-loadmore class="u-padding-top-32" v-if="queryForm.pageNum > 1" :status="status" icon-type="flower"
				:load-text="loadText" />
		</scroll-view>
		<view class="u-flex u-row-center bg-gray" v-else>
			<view class="u-text-center" style="margin-top: 200rpx;">
				<u-image width="300" height="300" src="@/static/md_icon_empty1.png" mode="aspectFit"></u-image>
				<text class="noData">未搜索到数据</text>
			</view>
		</view>
	</view>
</template>

<script>
	import ClassUtil from '@/common/utility/ClassUtil.js';
	import { getDateTime, getDateSpeed } from "@/common/util.js";

	export default {
		props: {
			queryParam: {
				type: Object,
				default () { return {} }
			},
			dataSource: {
				type: Array,
				default () { return [] }
			},
			totalCount: {
				type: Number,
				default () { return 0 }
			},
			triggered: {
				type: Boolean,
				deault() { return false }
			},
			status: {
				type: String,
				default () { return 'loadmore' }
			}
		},

		emits: ['update:queryParam', 'update:triggered', 'update:status', 'click-search', 'query-more'],

		data() {
			return {
				getDateTime,
				getDateSpeed,
				studentListKey: [{
					name: this.$t('common.type'),
					value: 'type',
					class: 'aa'
				}, {
					name: this.$t('center.sunshineRun.totalMileage'),
					value: 'mileageOrderBy',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.$t('center.runNumber'),
					value: 'runCountOrderBy',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.$t('center.sunshineRun.runDuration'),
					value: 'runDurationOrderBy',
					sortState: 1,
					class: 'aa'
				}, {
					name: this.$t('center.sunshineRun.averageSpeed'),
					value: 'speedOrderBy',
					sortState: 1,
					class: 'aa'
				}],
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				tableScrollLeft1: 0,
				scrollingLeft1: false,
				tableScrollLeft2: 0,
				scrollingLeft2: false,
			}
		},

		methods: {
			// 下拉刷新
			handleScrollRefresh() {
				this.$emit('update:triggered', true);
				this.$emit('click-search');
			},
			// 滚动到底部，加载更多
			handleScrollBottom() {
				const _this = this;
				if (_this.dataSource.length < _this.totalCount) {
					let tmpParam = { ..._this.queryParam };
					tmpParam.pageNum += 1;
					_this.$emit('update:queryParam', tmpParam);
					_this.$emit('query-more');
				} else {
					this.$emit('update:status', 'nomore');
				}
			},
			// 滚动右侧表格
			scrolledLeft1(event) {
				if (!this.scrollingLeft1 && this.scrollingLeft2) { // 防止滚动时抖动
					this.scrollingLeft2 = false;
					return;
				}
				this.scrollingLeft1 = true;
				this.tableScrollLeft2 = event.detail.scrollLeft;
			},
			// 滚动右侧表格
			scrolledLeft2(event) {
				if (this.scrollingLeft1 && !this.scrollingLeft2) { // 防止滚动时抖动
					this.scrollingLeft1 = false;
					return;
				}
				this.scrollingLeft2 = true;
				this.tableScrollLeft1 = event.detail.scrollLeft;
			},
			// 点击排序
			clickSort(data) {
				if (!data.sortState) { return; }
				const _this = this;
				let tmpParam = { ..._this.queryParam };
				_this.studentListKey.map(function(item, index) {
					if (item.value === data.value) {
						item.sortState = data.sortState;
					} else {
						if (item.sortState) {
							item.sortState = 1;
						}
					}
					tmpParam[item.value] = 0;
				})
				data.sortState++;
				if (data.sortState > 3) {
					data.sortState = 1;
				}
				tmpParam[data.value] = data.sortState - 1;
				this.$emit('update:queryParam', tmpParam);
				this.$emit('click-search');
			},
			// 处理教师类型
			handleTeacherType(item) {
				switch (item.teacherType) {
					case 0:
						return '其他老师';
					case 1:
						return '体育老师';
					case 2:
						return '班主任';
					default:
						return '';
				}
			},
			// 处理日期样式
			dealDate(date) {
				date = date.split("-");
				let month = `0${date[1]}`;
				month = month.substring(month.length - 2, month.length);
				let day = `0${date[2]}`;
				day = day.substring(day.length - 2, day.length);
				return `${date[0]}-${month}-${day}`;
			},
		}
	}
</script>

<style scoped lang="scss">
	.table-box-bezel {
		position: relative;
		width: 100%;
		height: 100%;
		flex: 1;
	}

	.table-box-bezel>scroll-view {
		position: absolute;
		top: 72rpx;
		left: 0;
		width: 100%;
		height: calc(100% - 72rpx);
		flex: 1;
	}

	.table-all-left {
		width: 250rpx;
		background: #FFFFFF;
	}

	.table-all-box {
		width: calc(100% - 250rpx);
		position: absolute;
		left: 250rpx;
		top: 0;
		overflow: hidden;
	}

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

		.aa {
			flex-basis: 220rpx;
		}

		.code {
			flex-basis: 320rpx;
		}

		.sortBox {
			margin-left: 10rpx;
			float: left;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.sortImg {
				width: 18rpx;
				height: 16rpx;
			}
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

		.aa {
			flex-basis: 220rpx;
		}

		.code {
			flex-basis: 320rpx;
		}
	}

	.bg-gray {
		background-color: #FAFAFA;
	}
</style>