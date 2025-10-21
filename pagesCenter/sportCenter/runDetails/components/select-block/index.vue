<template>
	<view class="select-wrapper">
		<view class="select-block" v-for="item in list" :key="item.index" @click="handleIndex(item)">
			<view class="select-item u-line-1" :class="{'is-active': currentIndex === item.index }">
				{{item.label}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataSource: {
				type: Array,
				default: () => {
					return []
				}
			},
			data: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				current: null,
				isAll: false,
			}
		},
		computed: {
			currentIndex() {
				if (this.current || this.current === 0) {
					return this.current
				} else if (this.data && JSON.stringify(this.data) !== '{}') {
					return this.data.label
				}
				return null
			},
			list() {
				let data = []
				if (this.isAll) {
					data = this.dataSource
				} else if (this.dataSource.length > 6) {
					data = this.dataSource.filter((item, index) => {
						return index < 5
					})
					data.push({
						index: -1,
						label: '查看全部'
					})
				} else {
					data = this.dataSource
				}
				return data
			}
		},
		methods: {
			handleIndex(data) {
				if (this.current === data.index) {
					this.current = null
				} else {
					this.current = data.index
				}

				if (data.index === -1) {
					this.$emit('handle-all')
					this.isAll = true
				} else if (data.index && this.current) {
					this.$emit('handle-select', data)
				} else if (!this.current) {
					this.$emit('handle-select', null)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.select-wrapper {
		display: flex;
		flex-wrap: wrap;
		padding: 0 12rpx;
	}

	.select-block {
		box-sizing: border-box;
		width: calc(100% / 3);
		padding: 0 12rpx 12rpx;
	}

	.select-item {
		padding: 16rpx 20rpx;
		background: #F2F2F2;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: #464646;
		text-align: center;
	}

	.is-active {
		background: $u-type-primary;
		color: #fff;
	}
</style>
