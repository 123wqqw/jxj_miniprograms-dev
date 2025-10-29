<template>
	<view class="sportDetail">
		<!-- 顶部媒体改为图片，依据选择的计时分钟动态切换 -->
		<view class="video-wrap">
			<video  class="video-content" :src="sportDetail.guideVideo"></video>
			<!-- <image class="video-content" :src="currentImageUrl" mode="aspectFill"></image> -->
		</view>
		<view class="sportName">
			{{sportDetail.aiSportName}}
		</view>
		<!-- 计时与操作卡片（默认：分钟，范围1-10，步进1） -->
		<view class="timer-card">
			<view class="timer-title">计时 {{ durationMinutes }}分钟</view>
			<view class="slider-wrap">
				<slider :value="durationMinutes"
					min="1"
					max="10"
					step="1"
					active-color="#5C8FF7"
					backgroundColor="#E8F0FE"
					@changing="onDurationChanging"
					@change="onDurationChange"
				/>
			</view>
			<button class="primary-btn" @click="onPrimaryAction">{{ isLogin ? '开始' : '登录' }}</button>
		</view>
		<view class="sport-text">
			<view class="sport-text-title">
				练习方法
			</view>
			<view>
				{{sportDetail.aiSportMethod}}
			</view>
		</view>
		<view class="sport-text">
			<view class="sport-text-title">
				注意事项
			</view>
			<view>
				{{sportDetail.aiSportMattersNeedingAttention}}
			</view>
		</view>
	</view>
</template>

<script>
    import { getReq } from "@/common/request.js";
    import { URL } from "@/common/url.js";
    export default {
        data() {
            return {
                option: {},
                sportDetail: {},
                // 计时默认值：1分钟，可改动
                durationMinutes: 1,
                // 登录状态：根据本地是否存在 xiaotiyunUser 判断
                isLogin: false
            }
        },
        computed: {
            // 为了支持动态图片，根据分钟选择不同图片
            currentImageUrl() {
                // 支持多种字段：durationImages/durationImgMap；若没有则使用封面 aiSportImg；再无则用默认占位图
                const m = Number(this.durationMinutes)
                const map = this.sportDetail.durationImages || this.sportDetail.durationImgMap || null
                if (map) {
                    // map 可能是 {"1":"url1", "2":"url2"}
                    const byKey = map[m] || map[String(m)]
                    if (byKey) return byKey
                    // 或者是数组 [{minutes:1,url:"..."}]
                    if (Array.isArray(map)) {
                        const found = map.find(it => Number(it.minutes) === m && (it.url || it.imgUrl))
                        if (found) return found.url || found.imgUrl
                    }
                }
                return this.sportDetail.aiSportImg || '/static/images/students/default.png'
            }
        },
        onLoad(e) {
            this.option = e
        },
        onShow() {
            // 刷新登录状态（学生端）
            try {
                const user = uni.getStorageSync('xiaotiyunUser')
                this.isLogin = !!user
            } catch (err) {
                this.isLogin = false
            }
        },
        onReady() {
            this.apiGetSportDetail()
        },
        methods: {
            apiGetSportDetail() {
                getReq(URL.apiGetSportDetail, {
                    id: this.option.id
                }).then(res => {
                    if (res.data && JSON.stringify(res.data) !== '{}') {
                        this.sportDetail = res.data
                    } else {
                        this.sportDetail = {}
                    }
                }).catch(() => {
                    this.sportDetail = {}
                })
            },
            // 滑条实时与最终变更处理
            onDurationChanging(e) {
                this.durationMinutes = e.detail.value
            },
            onDurationChange(e) {
                this.durationMinutes = e.detail.value
            },
            onPrimaryAction() {
                if (!this.isLogin) {
                    uni.navigateTo({ url: '/pages/students/login/index' })
                    return
                }
                // 跳转到 3 秒倒计时界面，传递必要参数，倒计时结束后进入练习页面
                const id = this.option.id || this.sportDetail.aiSportId || this.sportDetail.sportId || ''
                const duration = Number(this.durationMinutes) || 1
                const seconds = 3
                // 此处不要对路径进行 encode，避免无法识别页面路径而不跳转
                const returnUrl = '/pagesTask/assign/assignTask/practice'
                const url = `/pagesTask/assign/assignTask/countdown?id=${encodeURIComponent(id)}&duration=${duration}&seconds=${seconds}&returnUrl=${encodeURIComponent(returnUrl)}`
                uni.navigateTo({ url })
            }
        }
    }
</script>

<style scoped lang="scss">
	.sportDetail {
		padding: 46rpx 38rpx;
		padding-bottom: calc(46rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(46rpx + env(safe-area-inset-bottom));
	}

	.video-wrap {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
		border-radius: 28rpx;
		overflow: hidden;
		margin-bottom: 46rpx;

		.video-content {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	.sportName {
		font-size: 34rpx;
		line-height: 48rpx;
		font-weight: 600;
		color: #202020;
		margin-bottom: 40rpx;
	}

	/* 计时卡片样式 */
	.timer-card {
		background: #FFFFFF;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
		padding: 28rpx;
		margin-bottom: 40rpx;
	}

	.timer-title {
		text-align: center;
		font-size: 28rpx;
		color: #202020;
		margin-bottom: 20rpx;
	}

	.slider-wrap {
		padding: 0 10rpx 24rpx;
	}

	.primary-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background: #5C8FF7;
		color: #FFFFFF;
		border: none;
		border-radius: 16rpx;
	}

	.sport-text {
		font-size: 28rpx;
		font-weight: 400;
		color: #707070;
		line-height: 36rpx;
		background: #FFFFFF; /* 背景色卡片 */
		border-radius: 24rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
		padding: 28rpx;
		margin-bottom: 30rpx;
	}

	.sport-text-title {
		font-weight: 600;
		color: #202020;
		line-height: 40rpx;
		margin-bottom: 16rpx;
	}

	.sport-text+.sport-text {
		margin-top: 0; /* 已通过 margin-bottom 控制间距 */
	}
</style>
