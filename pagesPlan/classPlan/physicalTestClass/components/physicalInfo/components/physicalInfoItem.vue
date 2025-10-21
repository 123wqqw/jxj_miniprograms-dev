<template>
	<view class="physicalInfoItem">
		<view class="physicalInfoItem-content">
			<view class="physicalInfoItem-label">
				<u-image :src="`/pagesPlan/static/icon_aisport_${dataSource.testNameType}.png`" width="104rpx"
					height="104rpx" mode="aspectFit">
				</u-image>
			</view>
			<view class="physicalInfoItem-value">
				<view class="physicalInfoItem-value-text">
					平均分 {{dataSource.score || '--'}}分
				</view>
				<view class="physicalInfoItem-value-flex">
					<view>
						合格率
					</view>
					<view>
						{{dataSource.rate}}%
					</view>
				</view>
				<u-line-progress active-color="#24D0A2" :percent="dataSource.rate" :show-percent="false" :height="10">
				</u-line-progress>
			</view>
		</view>
		<view class="physicalInfoItem-text u-line-1">
			{{testNameTypes[dataSource.testNameType]}}
		</view>
	</view>
</template>

<script>
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
				testNameTypes: {
					0: '总成绩',
					1: 'BMI',
					2: '肺活量',
					3: '50米跑',
					4: '立定跳远',
					5: '坐位体前屈',
					6: '仰卧起坐',
					7: '引体向上',
					8: '1000米跑',
					9: '800米跑',
					10: '上肢腰腹',
					11: '耐力跑',
					12: '4*50米往返跑',
					13: '一分钟跳绳',
               18: '足球运球绕杆射门',
					20: '身高体重',
					21: '肺活量',
					22: '坐位体前屈',
					23: '立定跳远',
					24: '握力',
					25: '15米折反跑',
					26: '1000米跑',
					27: '800米跑',
					28: '引体向上',
					29: '仰卧起坐',
					30: '斜身引体',
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	.physicalInfoItem {
		padding: 24rpx 0;
		font-size: 24rpx;
		font-weight: 400;
		color: #707070;
		border-bottom: 1rpx solid #E6E6E6;

		&-content {
			display: flex;
			margin-bottom: 14rpx;
		}

		&-label {
			display: flex;
			align-items: center;
			width: 104rpx;
			margin-right: 16rpx;
		}

		&-value {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			height: 104rpx;

			&-text {
				font-size: 32rpx;
				line-height: 1.5;
			}

			&-flex {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}

		&-text {
			padding: 0 20rpx;
		}
	}
</style>
