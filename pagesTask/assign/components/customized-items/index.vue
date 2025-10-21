<template>
	<view class="customized">
		<view class="u-flex u-row-between u-margin-bottom-20">
			<view class="u-font-34">
				项目{{index + 1}}
			</view>
			<u-image width="34rpx" height="34rpx" src="/pagesTask/static/images/removeA.png" mode="aspectFit"
				@click="$emit('delete')">
			</u-image>
		</view>
		<u-form :model="formData" ref="uForm">
			<u-form-item label="名称">
				<u-input v-model="formData.name" :disabled="disabled" :height="40" :custom-style="InputStyle"
					:placeholder="disabled ? '' : '请输入'" />
			</u-form-item>
			<u-form-item label="说明">
				<u-input v-model="formData.taskInfo" type="textarea" maxlength="100"
					:placeholder="disabled ? '' : '请输入作业说明，要求等。'" :disabled="disabled" :height="40"
					:custom-style="InputStyle" />
			</u-form-item>
			<u-form-item label="视频">
				<view v-if="!formData.taskVideoUrl" class="video-content" @click="upload">
					上传视频
				</view>
				<template v-else>
					<view class="u-flex u-row-between u-flex-wrap">
						<video class="video-content" :src="formData.taskVideoUrl"></video>
						<template v-if="!disabled">
							<view class="video-content" @click="upload">
								切换视频
							</view>
							<view class="video-content" @click="delVideoUrl">
								删除视频
							</view>
						</template>
					</view>
				</template>
			</u-form-item>
		</u-form>
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
			},
			index: {
				type: Number,
				default: 0
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				InputStyle: {
					fontSize: "28rpx",
					lineHeight: "1.5",
				},
				formData: {}
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					if (value && JSON.stringify(value) !== '{}') {
						this.$nextTick(() => {
							this.formData = value
						})
					} else {
						this.formData = {}
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			delVideoUrl() {
				this.formData.taskVideoUrl = ""
			},
			upload() {
				if (this.disabled) {
					return
				}
				this.$emit('upload', this.formData)
			}
		}
	}
</script>

<style scoped lang="scss">
	.customized {
		margin: 40rpx;
		padding: 20rpx;
		background: #fff;
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 400;
		color: #000000;
	}

	.video-content {
		width: 160rpx;
		height: 160rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		line-height: 1.5;
		color: #606266;
		border-radius: 8rpx;
		background: #f4f5f6;
	}
</style>
