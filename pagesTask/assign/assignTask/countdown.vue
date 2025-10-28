<template>
  <view class="countdown-page">
    <text class="count-number">{{ count }}</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      option: {},
      count: 3,
      timerId: null
    }
  },
  onLoad(e) {
    this.option = e || {}
    // 允许外部自定义初始倒计时秒数（可选），默认 3 秒
    const init = Number(e && e.seconds) || 3
    this.count = init > 0 ? init : 3
  },
  onShow() {
    this.startCountdown()
  },
  onHide() {
    this.clearTimer()
  },
  onUnload() {
    this.clearTimer()
  },
  methods: {
    startCountdown() {
      this.clearTimer()
      this.timerId = setInterval(() => {
        if (this.count <= 1) {
          // 先将数字显示为 0，再进行跳转（留出一次 UI 刷新时间）
          this.count = 0
          this.clearTimer()
          const go = () => {
            // 倒计时完成后的默认行为：返回上一页
            // 如需指定跳转页面，可在打开本页面时传入 returnUrl 参数
            const raw = this.option && this.option.returnUrl
            let returnUrl = raw ? decodeURIComponent(raw) : ''
            if (!returnUrl) {
              returnUrl = '/pagesTask/assign/assignTask/practice'
            }
            if (returnUrl) {
              // 保留传入的参数（示例：id、duration）
              const sep = returnUrl.includes('?') ? '&' : '?'
              const params = []
              if (this.option.id) params.push(`id=${encodeURIComponent(this.option.id)}`)
              if (this.option.duration) params.push(`duration=${encodeURIComponent(this.option.duration)}`)
              const url = `${returnUrl}${params.length ? sep + params.join('&') : ''}`
              uni.redirectTo({ url })
            } else {
              uni.navigateBack({ delta: 1 })
            }
          }
          // 延时 1 秒确保用户能看到 0
          setTimeout(go, 1000)
        } else {
          this.count -= 1
        }
      }, 1000)
    },
    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
    }
  }
}
</script>

<style scoped lang="scss">
.countdown-page {
  position: fixed;
  inset: 0;
  background: #2E78FF; /* 与示例接近的蓝色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.count-number {
  color: #FFFFFF;
  font-size: 220rpx;
  font-weight: 700;
}
</style>
