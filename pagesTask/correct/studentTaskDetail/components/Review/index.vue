<template>
	<view class="review">
		<view class="review-header">批量{{$t("task.correct.batchCorrectTask.commentInput")}}</view>
		<view class="review-main">
			<u-form :model="formdata" label-position="top">
				<u-form-item :label="$t('task.correct.batchCorrectTask.comment')" :border-bottom="false">
					<u-input v-model="formdata.comments" type="textarea" :maxlength="50" :clearable="false"
						:custom-style="{
						'background-color': '#f5f5f5',
							'border-radius': '8rpx',
							'padding': '16rpx 24rpx',
							'font-size': '28rpx',
							'color': '#202020'}" placeholder-style="font-size: 12px;color:#B2B2B2;"
						:placeholder="$t('task.correct.batchCorrectTask.commentModalPlaceholder')" />
				</u-form-item>
				<u-form-item :border-bottom="false">
					<block v-for="item in defaultCommentList" :key="item">
						<view class="u-margin-right-8 u-margin-bottom-8" style="display: inline-block;">
							<u-tag :text="item" type="info" mode="light" @click="onComment(item)" />
						</view>
					</block>
				</u-form-item>
			</u-form>
		</view>
		<view class="review-footer">
			<u-button :custom-style="customStyle" type="primary" shape="circle" :disabled="!formdata.comments"
				@click="submitComment">
				提交
			</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customStyle: {
					height: "84rpx",
					padding: "18rpx 0",
					fontSize: "34rpx",
					fontWeight: 600,
				},
				formdata: {
					comments: ""
				},
				defaultCommentList: [this.$t("task.correct.batchCorrectTask.commentModel3"), this.$t(
					"task.correct.batchCorrectTask.commentModel1"), this.$t(
					"task.correct.batchCorrectTask.commentModel2")],
			}
		},
		methods: {
			onComment(data) {
				this.formdata.comments = data
			},
			submitComment() {
				this.$emit('submitComment', this.formdata.comments)
			}
		}
	}
</script>

<style scoped lang="scss">
	.review-header {
		width: 100%;
		font-size: 32rpx;
		font-weight: 400;
		color: #464646;
		text-align: center;
		padding: 28rpx 32rpx 0;
	}

	.review-main {
		padding: 28rpx 32rpx 0;
	}

	.review-footer {
		padding: 28rpx 32rpx 0;
	}

	.popup-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.title {
			width: 100%;
			height: 86upx;
			line-height: 86upx;
			font-size: 32upx;
			font-weight: 400;
			color: #464646;
			text-align: center;
		}

		.screen-info {
			width: 100%;
			flex: 1;

			.screen-li {
				width: 100%;
				margin-top: 20upx;

				.li-title {
					width: 100%;
					height: 40upx;
					line-height: 40upx;
					padding: 0 32upx;
					font-size: 28upx;
					font-weight: 500;
					color: #202020;
					margin-bottom: 12upx;
				}

				.li-info {
					width: 100%;
					padding: 0 16upx;
					display: flex;
					flex-wrap: wrap;

					.li-item {
						width: calc(100% / 3 - 32upx);
						height: 70upx;
						border-radius: 35upx;
						line-height: 70upx;
						text-align: center;
						margin: 12upx 16upx;
						background-color: #f5f5f5;
						font-size: 28upx;
						font-weight: 400;
						color: #464646;
					}

					.li-item--checked {
						background-color: #5c8ff7;
						color: #ffffff;
					}
				}

				.scroll-li-info {
					padding: 0 16upx;
					white-space: nowrap;
					height: 94rpx;

					.li-item {
						height: 70upx;
						min-width: calc(100% / 3 - 32upx);
						padding: 0 32rpx;
						border-radius: 35upx;
						line-height: 70upx;
						text-align: center;
						margin: 12upx 16upx;
						background-color: #f5f5f5;
						font-size: 28upx;
						font-weight: 400;
						color: #464646;
						display: inline-flex;
						align-items: center;
						justify-content: center;
					}

					.li-item--checked {
						background-color: #5c8ff7;
						color: #ffffff;
					}
				}
			}
		}

		.screnn-btn {
			width: 100%;
			height: 86upx;
			display: flex;
			border-top: 2upx solid #e6e6e6;

			.action-btn {
				flex: 1;
				height: 100%;
				line-height: 86upx;
				text-align: center;
				background-color: #ffffff;
				color: #5c8ff7;
				font-size: 32upx;
				font-weight: 600;
			}

			.action-btn--confirm {
				background-color: #5c8ff7;
				color: #ffffff;
			}
		}

		.comment-content {
			width: 100%;
			flex: 1;

			.content-title {
				width: 100%;
				height: 40upx;
				line-height: 40upx;
				padding: 0 32upx;
				font-size: 28upx;
				font-weight: 500;
				color: #202020;
				margin-bottom: 12upx;
			}

			.comment-model {
				width: 100%;
				padding: 0 32upx;
				padding-top: 30upx;
				display: flex;
				flex-wrap: wrap;

				.model-li {
					position: relative;
					margin-right: 24upx;
					margin-bottom: 24rpx;

					.model-text {
						height: 60upx;
						padding: 0 32upx;
						border-radius: 12upx;
						border: 2upx solid #b2b2b2;
						background-color: #ffffff;
						font-size: 28upx;
						font-weight: 400;
						color: #464646;
						line-height: 60upx;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						word-break: break-all;
					}

					.model-li--active {
						border: 2upx solid #5c8ff7;
						background-color: #5c8ff7;
						color: #ffffff;
					}

					.model-del {
						width: 48upx;
						height: 48upx;
						padding: 12upx;
						position: absolute;
						right: -24upx;
						top: -24upx;
						z-index: 1;
					}

					.del-img {
						width: 24upx;
						height: 24upx;
					}
				}

				.model-li-add {
					height: 60upx;
					padding: 0 32upx;
					border-radius: 12upx;
					border: 2upx solid #5c8ff7;
					background-color: #ffffff;
					font-size: 28upx;
					font-weight: 400;
					color: #5c8ff7;
					line-height: 60upx;
					margin-right: 24upx;
					margin-bottom: 24rpx;
				}

				.model-li-add--active {
					border: 2upx solid #5c8ff7;
					background-color: #5c8ff7;
					color: #ffffff;
				}
			}
		}

		.comment-input {
			width: 686upx;
			height: 226upx;
			background-color: #f5f5f5;
			border-radius: 24upx;
			margin: 0 auto;
			margin-top: 24upx;
			padding: 16upx 24upx;
			font-size: 28upx;
			color: #202020;
			position: relative;

			::v-deep .u-input {
				height: 100%;
			}

			.conent-size {
				font-size: 28upx;
				color: #b2b2b2;
				position: absolute;
				bottom: 17upx;
				right: 24upx;
			}
		}

		.comment-btn {
			width: 100%;
			height: 86upx;
			display: flex;

			.action-btn {
				flex: 1;
				height: 100%;
				line-height: 86upx;
				text-align: center;
				background-color: #5c8ff7;
				color: #ffffff;
				font-size: 32upx;
				font-weight: 600;
			}

			.action-btn--disabled {
				background-color: #b2b2b2;
			}
		}
	}
</style>
