<template>
	<view class="u-flex u-row-center" @click="bindStatusChange">
		<slot></slot>
		<view style="margin-left: 8rpx;">
			<template v-if="status === 0">
				<image src="../../static/images/icon_sort_normal.png" mode="aspectFit" class="sort"></image>
				<image src="../../static/images/icon_sort_normal.png" mode="aspectFit" class="sort"></image>
			</template>
			<template v-if="status === 1">
				<image src="../../static/images/icon_sort_normal.png" mode="aspectFit" class="sort"></image>
				<image src="../../static/images/icon_sort_light.png" mode="aspectFit" class="sort"></image>
			</template>
			<template v-if="status === 2">
				<image src="../../static/images/icon_sort_light.png" mode="aspectFit" class="sort"></image>
				<image src="../../static/images/icon_sort_normal.png" mode="aspectFit" class="sort"></image>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			reset: {
				type: Boolean,
				default: false
			},
			label: {
				type: [String, Number],
				default: ""
			}
		},
		data() {
			return {
				status: 0 // 0 默认状态 1 降序 2 升序
			}
		},
		watch: {
			reset: {
				handler: function(value) {
					this.status = value ? 0 : this.status
				}
			}
		},
		methods: {
			bindStatusChange() {
				if (this.status >= 2) {
					this.status = 1
				} else {
					this.status += 1
				}
				this.$emit('change', {
					label: this.label,
					type: this.status === 1 ? "preface" : "reverse"
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.sort {
		display: block;
		width: 12rpx;
		height: 12rpx;
	}

	.sort+.sort {
		margin-top: 4rpx;
		-webkit-transform: rotateX(180deg);
		transform: rotateX(180deg);
	}
</style>
