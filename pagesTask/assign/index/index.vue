<template>
	<view class="assign-task-container">
		<view class="task-content">
			<taskArrange :teacherId="xiaotiyunUser.teacher.teacherId" ref="taskArrange"></taskArrange>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import {
		getReq,
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import taskArrange from '../../components/task-arrange/task-arrange.vue'
	export default {
		components: {
			taskArrange
		},
		data() {
			return {
				isRefresh: false,
			};
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: this.$t('task.assign.index.title')
			})
			this.initPageFun();
		},
		onPullDownRefresh() {
			let _this = this;
			setTimeout(() => {
				_this.initPageFun();
				_this.$refs.taskArrange.postDateObj();
				uni.stopPullDownRefresh();
			}, 0)
		},
		onShow() {
			if (this.isRefresh) {
				this.initPageFun();
			}
		},
		onHide() {
			this.isRefresh = true;
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		methods: {
			initPageFun() {
				let _this = this;
				_this.$refs.taskArrange.handleInit();
			},
		}
	}
</script>

<style lang="less">
	.assign-task-container {
		width: 100%;
		min-height: 1000upx;
		height: auto !important;
		overflow: hidden;

		.task-content {
			width: 100%;
			min-height: 1000upx;
			height: auto !important;
			// padding: 0 32upx;
			margin-top: 16upx;
		}
	}
</style>
