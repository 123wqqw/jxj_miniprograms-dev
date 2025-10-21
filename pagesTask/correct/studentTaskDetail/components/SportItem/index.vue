<template>
	<view class="sportItem">
		<view class="sportItem-header">
			<view class="sportItem-header-title">
				<text>{{name}}</text>
				<text>{{ dataSource.categoryId === 3 ? "（体能训练）" : dataSource.taskType === 2 ? "（AI）"  : "" }}</text>
				<u-tag :text="sportGroup" />
			</view>
			<view class="sportItem-header-time">
				<template v-if="dataSource.type === 1">
					<view>已撤回</view>
				</template>
				<template v-else-if="dataSource.status === 0">
					<view>未完成</view>
				</template>
				<template v-else-if="dataSource.status === 6">
					<view>{{$t( "task.correct.classStatistics.makeUpClock" )}}</view>
				</template>
				<template v-else>
					<text>{{dataSource.clockTime ? dateFormat(new Date(dataSource.clockTime),'hh:mm:ss') : ""}}</text>
				</template>
			</view>
		</view>
		<template v-if="dataSource.taskType === 1">
			<view class="sportItem-content">
				<view class="sportItem-content-title">{{ $t("common.sport") }}内容：</view>
				<view class="sportItem-content-info">{{dataSource.taskContent}}</view>
			</view>
		</template>
		<template v-if="dataSource.status !== 0">
			<view class="sportItem-content">
				<view class="sportItem-content-title">{{ $t("common.sport") }}情况：</view>
				<view class="sportItem-content-info">{{dataSource.clockText}}</view>
			</view>
		</template>
		<template
			v-if="dataSource.status !== 0 && dataSource.taskType === 1 && dataSource.clockMediaUrls.images && dataSource.clockMediaUrls.images.length">
			<view class="sportItem-content">
				<view class="sportItem-content-title">{{ $t("common.sport") }}图片：</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="sportItem-content-item u-margin-right-12"
						v-for="item in dataSource.clockMediaUrls.images" :key="item">
						<image :src="item" alt="" mode="aspectFill" @click="previewImages(item)" />
					</view>
				</scroll-view>
			</view>
		</template>
		<template
			v-if="dataSource.status !== 0 && dataSource.taskType === 1 && dataSource.clockMediaUrls.videos && dataSource.clockMediaUrls.videos.length">
			<view class="sportItem-content">
				<view class="sportItem-content-title">{{ $t("common.sport") }}视频：</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="sportItem-content-item u-margin-right-12"
						v-for="item in dataSource.clockMediaUrls.videos" :key="item">
						<image :src="dataSource.imgUrl" alt="" mode="aspectFill" />
						<view class="sportItem-content-mask" @click="playVedio(item)">
							<u-icon name="play-right-fill" color="#fff" size="28">
							</u-icon>
						</view>
					</view>
				</scroll-view>
			</view>
		</template>
		<template
			v-if="dataSource.status !== 0 && dataSource.taskType === 2 && clockMediaUrls && clockMediaUrls.length">
			<view class="sportItem-content">
				<view class="sportItem-content-title">{{ $t("common.sport") }}视频：</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<block v-for="(item,index) in clockMediaUrls" :key="index">
						<view class="sportItem-video">
							<view v-if="item.level"
								:class="['leave-box',['excell','good','pass','no-pass','over-standard','under-standard'][item.level - 1]]">
								{{[$t("common.excellent"),"良好","及格","不及格",$t("task.correct.studentTaskDetail.standard"),`不${$t("task.correct.studentTaskDetail.standard")}`][item.level - 1]}}
							</view>
							<view class="sportItem-content-item">
								<image :src="dataSource.imgUrl" alt="" mode="aspectFill" />
								<view class="sportItem-content-mask" @click="playVedio(item.videos)">
									<u-icon name="play-right-fill" color="#fff" size="28">
									</u-icon>
								</view>
							</view>
							<template v-if="dataSource.categoryId !== 3">
								<view style="text-align: center;">
									{{dataSource.calculateType === 1 ? `${item.aiCount || item.score}个` :  parseTime(item.timeConsume)}}
								</view>
								<view class="u-flex" style="justify-content: center;">
									<image class="sportItem-content-icon" src="../../../../../static/images/tips.png"
										mode="aspectFit" v-if="item.commitType">
									</image>
									<text v-if="dataSource.calculateType === 1">
										{{item.commitType ? `实际${item.score}个` : ""}}
									</text>
									<text v-if="dataSource.calculateType !== 1">
										{{item.aiCount || item.score}}个
									</text>
								</view>
							</template>
							<view v-else style="text-align: center;">
								{{ item.timeConsume ? parseTime(item.timeConsume) : ""}}
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</template>
		<template v-if="dataSource.comments">
			<view class="sportItem-content">
				<view class="sportItem-content-title">{{ $t("task.correct.batchCorrectTask.comment") }}：</view>
				<view class="sportItem-content-info">{{dataSource.comments}}</view>
			</view>
		</template>
		<template v-if="dataSource.showButton">
			<view class="sportItem-content-title">{{ $t("task.correct.studentTaskDetail.unFinishedTaskWarning")}}</view>
		</template>
	</view>
</template>

<script>
	import {
		dateFormat,
		parseTime
	} from '@/common/util.js'
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				dateFormat,
				parseTime,
			}
		},
		computed: {
			name() {
				const pattern = new RegExp("[0-9]+");
				const index = this.dataSource.name.match(pattern).index
				return `${this.dataSource.name.slice(0, index)}`
			},
			sportGroup() {
				const pattern = new RegExp("[0-9]+");
				const index = this.dataSource.name.match(pattern).index
				return `${this.dataSource.name.slice(index, this.dataSource.name.length)} x ${this.dataSource.groupNum}${this.$t("common.group")}`
			},
			clockMediaUrls() {
				if (this.dataSource.clockMediaUrls && this.dataSource.clockMediaUrls.length) {
					return this.dataSource.clockMediaUrls.filter(item => {
						return item.videos
					})
				}
				return []
			}
		},
		mounted() {},
		methods: {
			// 预览图片
			previewImages(url) {
				uni.previewImage({
					urls: [url]
				});
			},
			// 点击显示全屏
			playVedio(viedeoUrl) {
				this.$emit('palyFullVedio', viedeoUrl)
			}
		}
	}
</script>

<style scoped lang="scss">
	.sportItem {
		margin-top: 24rpx;
		padding: 32rpx 0;
		border-bottom: 1rpx solid #DCDFE6;
		font-size: 28rpx;
		line-height: 1.5;
		color: #606266;

		&-header {
			display: flex;
			align-items: center;
			justify-content: space-between;

			&-title {
				flex: 1;
				font-size: 28rpx;
				color: #303133;
				overflow: hidden;
				word-wrap: break-word;
				word-break: break-all;
				margin-right: 24rpx;
			}

			&-time {
				font-size: 24rpx;
				color: #909399;
			}
		}

		&-video {
			box-sizing: border-box;
			display: inline-block;
			width: 160rpx;
			margin-right: 12rpx;
		}
	}

	.sportItem-content {
		font-size: 28rpx;
		margin-top: 24rpx;

		&-title {
			color: #303133;
			margin-bottom: 8rpx;
		}

		&-info {
			display: flex;
			align-items: center;
			font-weight: 400;
			overflow: hidden;
			word-wrap: break-word;
			word-break: break-all;
		}

		&-item {
			position: relative;
			box-sizing: border-box;
			display: inline-block;
			width: 160rpx;
			height: 90rpx;
			// border: 1px solid #DCDFE6;
			border-radius: 12rpx;
			padding: 8rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		&-mask {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1;
			background-color: $uni-bg-color-mask;
		}

		&-icon {
			width: 24rpx !important;
			height: 24rpx !important;
		}
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.leave-box {
		position: absolute;
		top: 0;
		right: 0;
		box-sizing: border-box;
		padding: 8rpx 16rpx;
		height: 34rpx;
		background: linear-gradient(130deg,
				#5c98f7 0%,
				#81b0fe 100%);
		border-radius: 0 0 0 17rpx;
		font-size: 14rpx;
		color: #ffffff;
		z-index: 1;
	}

	.excell {
		background: linear-gradient(131deg,
				#5c98f7 0%,
				#81b0fe 100%);
	}

	.good {
		background: linear-gradient(131deg,
				#0bd1a8 0%,
				#27deb8 100%);
	}

	.pass {
		background: linear-gradient(131deg,
				#ff9e50 0%,
				#ffc394 100%);
	}

	.no-pass {
		background: linear-gradient(131deg,
				#f86174 0%,
				#ff959f 100%);
	}

	.over-standard {
		background: #5c98f7;
	}

	.under-standard {
		background: #ec9131;
	}
</style>
