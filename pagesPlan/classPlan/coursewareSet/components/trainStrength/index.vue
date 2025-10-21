<template>
	<view class="slider">
		<view class="u-margin-bottom-78">
			<text class="text-blod u-margin-right-20" style="color: #202020;">训练强度 </text>
			<text class="text-blod">{{strengthText}}</text>
		</view>
		<view class="u-margin-bottom-20">
			<slider :value="value" @change="scrollEnd" step="50" activeColor="#5C8FF7" block-size="20" />
		</view>
		<view class="u-flex u-row-between">
			<text>低</text>
			<text>中</text>
			<text>高</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataSource: {
				type: [Number, String],
				default: 1
			}
		},
		data() {
			return {
				value: 0
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					switch (Number(value)) {
						case 1:
							this.value = 0
							break;
						case 2:
							this.value = 50
							break;
						case 3:
							this.value = 100
							break;
						default:
							this.value = 0
							break;
					}
				},
				immediate: true
			}
		},
		computed: {
			strengthText() {
				switch (Number(this.value)) {
					case 0:
						return "低"
						break;
					case 50:
						return "中"
						break;
					case 100:
						return "高"
						break;
					default:
						return "低"
						break;
				}
			}
		},
		methods: {
			scrollEnd(e) {
				let value = 1
				if (e.detail.value) {
					switch (Number(e.detail.value)) {
						case 0:
							value = 1
							break;
						case 50:
							value = 2
							break;
						case 100:
							value = 3
							break;
						default:
							value = 1
							break;
					}
				}
				this.$emit('change', value)
			}
		}
	}
</script>

<style scoped lang="scss">
	.slider {
		padding: 30rpx 40rpx 70rpx;
		background-color: #fff;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		color: #888888;
		line-height: 40rpx;
	}

	.text-blod {
		font-weight: bold;
	}
</style>
