<template>
	<view class="container">
		<view class="class-name">
			<!-- <text>{{ gradeName(dataSource.grade) }}</text>
			<text>{{ dataSource.number }}班</text> -->
			<text style="text-align: center;">
				{{ dataSource.aliasClassName ? dataSource.aliasClassName : dataSource.className }}
			</text>
		</view>
		<view class="class-num">
			{{ dataSource.classCode }}
		</view>
		<view class="student-num">
			<text class="num-type">{{$t('common.student')}}：<text class="black-text">{{ dataSource.studentCount }}</text>名</text>
			<text class="num-type">{{$t('common.boy')}}：<text class="black-text">{{ dataSource.boyCount }}</text>名</text>
			<text class="num-type">{{$t('common.girl')}}：<text class="black-text">{{ dataSource.girlCount }}</text>名</text>
		</view>
	</view>
</template>

<script>
	import ClassUtil from '@/common/utility/ClassUtil.js';
	
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => {
					return {
						grade: '',
						number: 0,
						classCode: '',
						studentCount: 0,
						boyCount: 0,
						girlCount: 0
					}
				}
			},
		},
		methods: {
			// 年级名称
			gradeName(grade) {
				return this.$t(ClassUtil.gradeNameI18n(grade))
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 750upx;
		height: 144upx;
		padding-top: 27upx;
		background: #FFFFFF;
	}

	.black-text {
		color: #202020;
	}

	.class-name {
		position: absolute;
		top: 22upx;
		left: 32upx;
		width: 100upx;
		height: 100upx;
		background: #5C8FF7;
		border-radius: 12upx;
		font-size: 24upx;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.class-num {
		position: absolute;
		top: 28upx;
		left: 144upx;
		height: 36upx;
		font-size: 28upx;
		font-weight: 500;
		color: #202020;
	}

	.student-num {
		position: absolute;
		top: 79upx;
		left: 144upx;
		height: 36upx;
		font-size: 28upx;
		color: #707070;

		.num-type {
			margin-right: 32upx;
		}
	}
</style>