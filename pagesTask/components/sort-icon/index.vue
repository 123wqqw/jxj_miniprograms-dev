<template>
	<view class="u-margin-left-8" @click="bindStatusChange">
		<u-image height="36rpx" src="/static/icon_sort_default.png" v-show="!status" mode="heightFix">
		</u-image>
		<u-image height="36rpx" src="/static/icon_sort_preface.png" v-show="status && sortIcon" mode="heightFix">
		</u-image>
		<u-image height="36rpx" src="/static/icon_sort_reverse.png" v-show="status && !sortIcon" mode="heightFix">
		</u-image>
	</view>
</template>

<script>
	export default {
		props: {
			prop: {
				type: String,
				default: ""
			},
			sort: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				sortIcon: false,
			}
		},
		computed: {
			status() {
				return this.prop === this.sort
			}
		},
		methods: {
			bindStatusChange() {
				this.sortIcon = !this.sortIcon
				this.$emit('handle-sort', this.prop, this.sortIcon ? "preface" : "reverse")
			}
		}
	}
</script>

<style>
</style>
