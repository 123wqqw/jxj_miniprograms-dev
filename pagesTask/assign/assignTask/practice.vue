<template>
  <view class="practice-page">
    <!-- 顶部标题与操作 -->
  <view class="top-bar">
      <view class="chip">{{ sportDetail.aiSportName || option.name || '动作名称' }}</view>
  </view>
    <!-- 顶部指导视频（按需求：无任何操作按钮，禁止快进、暂停） -->
    <view class="guide-wrap">
      <video class="guide-video" :src="sportDetail.guideVideo"></video>
      <!-- <video v-if="currentVideoUrl" class="guide-video"
             id="guideVideo"
             :src="currentVideoUrl"
             :controls="false"
             autoplay
             loop
             show-fullscreen-btn="false"
             show-progress="false"
             show-center-play-btn="false"
             enable-progress-gesture="false"
             :muted="videoMuted"
             @pause="resumeVideo"
             @ended="restartVideo"
      ></video>
      <image v-else class="guide-image" :src="currentImageUrl" mode="aspectFit"></image> -->
    </view>

    <!-- 相机预览区域（按UI一比一：计时与结束按钮覆盖在相机区域顶部左右） -->
    <view class="camera-wrap">
      <camera id="sport-camera" class="camera" frame-size="medium" :device-position="cameraPosition" flash="off" @error="onCameraError"></camera>
      <!-- 顶部覆盖的计时与结束按钮 -->
      <view class="camera-top">
        <view class="time-box">{{ displayTime }}</view>
        <button class="stop-btn" @click="stopExercise">
          <text class="dot"></text>
          结束运动
        </button>
      </view>
      <view class="camera-overlay">未检测到摄像头</view>
    </view>
    <!-- 结束确认弹框：再坚持提示 -->
    <u-modal
      v-model="endConfirmShow"
      :show-title="false"
      show-cancel-button
      cancel-text="结束"
      confirm-text="再练一下"
      :content="'再坚持一会就能结束运动啦！'"
      @confirm="onEndConfirm"
      @cancel="onEndCancel"
    />
  </view>
</template>

<script>
import { getReq } from '@/common/request.js'
import { URL } from '@/common/url.js'

export default {
  data() {
    return {
      option: {},
      sportDetail: {},
      duration: 1, // 分钟
      elapsedSeconds: 0, // 记录时间（秒），自0开始累加
      timerId: null,
      cameraPosition: 'front',
      videoMuted: false
      , endConfirmShow: false
    }
  },
  computed: {
    displayTime() {
      const m = Math.floor(this.elapsedSeconds / 60)
      const s = Math.floor(this.elapsedSeconds % 60)
      const mm = m.toString().padStart(2, '0')
      const ss = s.toString().padStart(2, '0')
      return `${mm}:${ss}`
    },
    currentImageUrl() {
      const m = Number(this.duration)
      const map = this.sportDetail.durationImages || this.sportDetail.durationImgMap || null
      if (map) {
        const byKey = map[m] || map[String(m)]
        if (byKey) return byKey
        if (Array.isArray(map)) {
          const found = map.find(it => Number(it.minutes) === m && (it.url || it.imgUrl))
          if (found) return found.url || found.imgUrl
        }
      }
      return this.sportDetail.aiSportImg || '/static/images/students/default.png'
    },
    currentVideoUrl() {
      // 适配可能的字段名，优先使用视频地址
      return this.sportDetail.aiSportVideo || this.sportDetail.aiSportVideoUrl || this.sportDetail.videoUrl || ''
    }
  },
  onLoad(e) {
    this.option = e || {}
    this.duration = Number(e && e.duration) || 1
    this.elapsedSeconds = 0
  },
  onReady() {
    const id = this.option.id
    if (id) this.apiGetSportDetail(id)
    // 创建视频上下文用于强制继续播放（防止外部触发暂停）
    this.videoCtx = uni.createVideoContext('guideVideo')
  },
  onShow() {
    this.startTimer()
  },
  onHide() {
    this.clearTimer()
  },
  onUnload() {
    this.clearTimer()
  },
  methods: {
    apiGetSportDetail(id) {
      getReq(URL.jxjSportDetail, { id }).then(res => {
        if (res.data && JSON.stringify(res.data) !== '{}') {
          this.sportDetail = res.data
        }
      }).catch(() => {})
    },
    startTimer() {
      this.clearTimer()
      this.timerId = setInterval(() => {
        // 记录时间：自增，不自动结束
        this.elapsedSeconds += 1
      }, 1000)
    },
    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
    },
    onCameraError(err) {
      console.warn('camera error', err)
      uni.showToast({ title: '相机权限异常', icon: 'none' })
    },
    // 已按你的要求，顶部不展示任何操作按钮；摄像头切换入口移除
    resumeVideo() {
      // 防暂停：一旦触发 pause 事件，立即恢复播放
      if (this.videoCtx) this.videoCtx.play()
    },
    restartVideo() {
      // 循环已开启，这里兜底保证结束后继续播放
      if (this.videoCtx) this.videoCtx.play()
    },
    stopExercise() {
      // 点击“结束运动”先弹确认框
      this.endConfirmShow = true
    },
    onEndCancel() {
      // 弹框左键：结束
      this.clearTimer()
      const name = this.sportDetail.aiSportName || this.option.name || '运动项目'
      const id = this.option.id || this.sportDetail.aiSportId || this.sportDetail.sportId || ''
      const duration = Number(this.duration) || 1
      const seconds = this.elapsedSeconds
      const videoUrl = this.currentVideoUrl || ''
      const url = `/pagesTask/assign/assignTask/finish?name=${name}&id=${encodeURIComponent(id)}&duration=${duration}&seconds=${seconds}&videoUrl=${encodeURIComponent(videoUrl)}`
      uni.navigateTo({ url })
    },
    onEndConfirm() {
      // 弹框右键：再练一下（关闭弹框，继续计时）
      this.endConfirmShow = false
    }
  }
}
</script>

<style scoped lang="scss">
.practice-page {
  padding: 20rpx 24rpx 40rpx;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16rpx;
}
.chip {
  background: #E8F0FE;
  color: #2E78FF;
  font-size: 26rpx;
  padding: 10rpx 18rpx;
  border-radius: 12rpx;
}
.guide-wrap {
  width: 100%;
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}
.guide-image {
  width: 100%;
  height: 360rpx;
}
.guide-video {
  width: 100%;
  height: 360rpx;
  object-fit: contain;
}
.time-box {
  min-width: 160rpx;
  height: 80rpx;
  border-radius: 16rpx;
  background: #1F2B37;
  color: #FFFFFF;
  font-size: 36rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stop-btn {
  flex: none;
  height: 80rpx;
  padding: 0 32rpx;
  border-radius: 16rpx;
  background: #FFFFFF;
  color: #FF4D4F;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.06);
}
.stop-btn .dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #FF4D4F;
  display: inline-block;
}
.camera-wrap {
  position: relative;
  width: 100%;
  height: 560rpx;
  background: #8FA5B8; /* 与示例背景一致 */
  border-radius: 16rpx;
  overflow: hidden;
}
.camera-top {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 16rpx;
  background: rgba(255,255,255,0.28); /* 顶部覆盖条：与截图一致的浅色半透明块 */
  border-radius: 12rpx;
}
.camera {
  width: 100%;
  height: 100%;
}
.camera-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255,255,255,0.9);
  font-size: 28rpx;
}
</style>
