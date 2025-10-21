<template>
	<view class="list-item-wrapper">
		<view class="item-bezel" @click="clickItem">
			<view class="title-bezel">
				<text>{{dataSource.name || ''}}</text>
				<text class="run-type">
					{{ dataSource.type == 1 ? $t('center.sunshineRun.teamRun') : $t('center.sunshineRun.freeRun') }}
				</text>
				<text class="closed" v-if="dataSource.status == 1">
					{{ $t('common.close') }}
				</text>
				<text class="progressing" v-if="dataSource.status == 2">
					{{ $t('common.progressing') }}
				</text>
				<text class="unstart" v-if="dataSource.status == 3">
					{{ $t('common.notStarted') }}
				</text>
				<text class="closed" v-if="dataSource.status == 4">
					{{ $t('common.ended') }}
				</text>
			</view>
			<view class="top-line"></view>
			<view class="content-bezel">
				<view class="content-text">
					<view class="text-bezel">
						<text>{{$t('common.time')}}：</text>
						<text>{{handleDate()}}</text>
					</view>
					<view class="text-bezel">
						<text>{{$t('center.sunshineRun.sportPeriod')}}：</text>
						<text>{{dataSource.duration || ''}}</text>
					</view>
					<view class="text-bezel">
						<text>{{$t('center.sunshineRun.associatedDevice')}}：</text>
						<text>{{dataSource.onePcName || ''}}</text>
					</view>
					<view class="text-bezel">
						<text>{{$t('center.sunshineRun.repeatSet')}}：</text>
						<text>{{handleRepeateSetting()}}</text>
					</view>
					<view class="text-bezel">
						<text>{{$t('center.sunshineRun.participateScope')}}：</text>
						<text>{{handleParticipateScope()}}</text>
					</view>
				</view>
				<image class="arrow-icon" src="../../../static/images/common/arrow-black.png" mode="aspectFit"
					v-if="showArrow">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import { dateFormat } from '@/common/util.js';
	export default {
		props: {
			dataSource: {
				type: Object,
				default: () => ({})
			},
			classList: {
				type: Array,
				default: () => ([])
			},
			showArrow: {
				type: Boolean,
				default: true
			},
		},
		methods: {
			// 处理时间
			handleDate() {
				let startText = '';
				if (this.dataSource && this.dataSource.startTime) {
					startText = dateFormat(new Date(this.dataSource.startTime), 'yyyy/MM/dd');
				}
				let endText = '';
				if (this.dataSource && this.dataSource.endTime) {
					endText = dateFormat(new Date(this.dataSource.endTime), 'yyyy/MM/dd');
				}
				return startText + '-' + endText;
			},
			// 处理重复设置
			handleRepeateSetting() {
				if (!this.dataSource || !this.dataSource.repeatSetting || this.dataSource.repeatSetting === '') {
					return '无'
				}
				const weeks = this.dataSource.repeatSetting.split(',')
				if (weeks.length >= 7) {
					return '每天'
				}
				const weekOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				const weekText = weeks.map((item) => {
					const index = parseInt(item) || 0
					return weekOptions[index - 1]
				}).join('、')
				return '每' + weekText
			},
			// 处理参与范围
			handleParticipateScope() {
				if (!this.dataSource) {
					return '';
				}
				if (this.dataSource.participateScopeType == 0) { // 全校
					const direction = this.dataSource.runDirection == 1 ? '逆时针' : (this.dataSource.runDirection == 2 ?
						'顺时针' : '')
					return direction + '（全校）'
				}
				const emptyClass = !this.dataSource.classVOS || this.dataSource.classVOS.length == 0
				const emptyStudent = !this.dataSource.studentVOS || this.dataSource.studentVOS.length == 0
				const emptyTeacher = !this.dataSource.teacherVOS || this.dataSource.teacherVOS.length == 0
				if (emptyClass && emptyStudent && emptyTeacher) { // 没能查询到参与范围
					return ''
				}

				let anticlockwiseFirstClass = ''
				let clockwiseFirstClass = ''
				this.dataSource.classVOS?.forEach((item) => {
					if (item.runDirection == 1 && anticlockwiseFirstClass === '') {
						anticlockwiseFirstClass = item.aliasClassName ? item.aliasClassName : item.name
					} else if (item.runDirection == 2 && clockwiseFirstClass === '') {
						clockwiseFirstClass = item.aliasClassName ? item.aliasClassName : item.name
					}
				})
				let anticlockwise = anticlockwiseFirstClass.length > 0 ? `逆时针（${anticlockwiseFirstClass}...）` : ''
				let clockwise = clockwiseFirstClass.length > 0 ? `顺时针（${clockwiseFirstClass}...）` : ''
				if (anticlockwise !== '' || clockwise !== '') {
					return anticlockwise + ' ' + clockwise
				}

				let anticlockwiseFirstStudent = ''
				let clockwiseFirstStudent = ''
				this.dataSource.studentVOS?.forEach((item) => {
					if (item.runDirection == 1 && anticlockwiseFirstStudent === '') {
						anticlockwiseFirstStudent = item.name
					} else if (item.runDirection == 2 && clockwiseFirstStudent === '') {
						clockwiseFirstStudent = item.name
					}
				})
				anticlockwise = anticlockwiseFirstStudent.length > 0 ? `逆时针（${anticlockwiseFirstStudent}...）` : ''
				clockwise = clockwiseFirstStudent.length > 0 ? `顺时针（${clockwiseFirstStudent}...）` : ''
				if (anticlockwise !== '' || clockwise !== '') {
					return anticlockwise + ' ' + clockwise
				}

				let anticlockwiseFirstTeacher = ''
				let clockwiseFirstTeacher = ''
				this.dataSource.teacherVOS?.forEach((item) => {
					if (item.runDirection == 1 && anticlockwiseFirstTeacher === '') {
						anticlockwiseFirstTeacher = item.name
					} else if (item.runDirection == 2 && clockwiseFirstTeacher === '') {
						clockwiseFirstTeacher = item.name
					}
				})
				anticlockwise = anticlockwiseFirstTeacher.length > 0 ? `逆时针（${anticlockwiseFirstTeacher}...）` : ''
				clockwise = clockwiseFirstTeacher.length > 0 ? `顺时针（${clockwiseFirstTeacher}...）` : ''
				if (anticlockwise !== '' || clockwise !== '') {
					return anticlockwise + ' ' + clockwise
				}
				return ''
			},
			// 点击单元格
			clickItem() {
				this.$emit('click-item', this.dataSource);
			}
		}
	}
</script>

<style scoped lang="scss">
	.list-item-wrapper {
		height: 392rpx;
		padding: 20rpx 24rpx 0rpx 24rpx;
		background-color: #FAFAFA;
	}

	.item-bezel {
		padding: 20rpx 24rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(112, 112, 112, 0.1);
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
	}

	.title-bezel {
		display: flex;
		flex-direction: row;
		align-items: center;

		text:nth-child(1) {
			font-weight: 500;
			font-size: 28rpx;
			color: #5C8FF7;
		}

		text:nth-child(n + 2) {
			margin-left: auto;
			padding: 4rpx 8rpx;
			border-radius: 8rpx;
			font-size: 20rpx;
		}

		.run-type {
			margin-left: 40rpx;
			border: 1rpx solid lightgray;
		}

		.progressing {
			background: #E9F0FF;
			color: #5C8FF7;
		}

		.unstart {
			background: #FFE7E9;
			color: #FF7A86;
		}

		.closed {
			background: #EEEEEE;
			color: #999999;
		}
	}

	.top-line {
		width: 100%;
		height: 1rpx;
		margin-top: 20rpx;
		background-color: #EEEEEE;
	}

	.content-bezel {
		margin-top: 20rpx;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;

		.content-text {
			display: flex;
			flex-direction: column;
		}

		.text-bezel {
			margin-top: 10rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			text:nth-child(1) {
				min-width: 100rpx;
				font-size: 20rpx;
				color: #999999;
			}

			text:nth-child(2) {
				width: 554rpx;
				font-family: DINAlternate, DINAlternate;
				font-weight: bold;
				font-size: 28rpx;
				color: #333333;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}

		.arrow-icon {
			margin-left: auto;
			width: 34rpx;
			height: 34rpx;
		}
	}
</style>