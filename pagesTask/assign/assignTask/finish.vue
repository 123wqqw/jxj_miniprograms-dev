<template>
  <view class="finish-page">
    <!-- 顶部祝贺区 -->
    <view class="hero">
      
      <!-- 彩带装饰，近似还原 UI 效果 -->
      <view class="confetti c1"></view>
      <view class="confetti c2"></view>
      <view class="confetti c3"></view>
      <view class="confetti c4"></view>
      <view class="confetti c5"></view>
      <text class="hero-title">恭喜完成运动</text>
    </view>

    <!-- 结果卡片 -->
    <view class="result-card">
      <!-- 头部信息条（半透明白色，圆角） -->
      <view class="header-box">
        <view class="user-row">
          <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
          <text class="user-name">{{ userName }}</text>
          <view class="replay" @click="onReplay">
            <u-icon name="play-circle-fill" color="#2E78FF" size="28"></u-icon>
            <text class="replay-text">视频回放</text>
          </view>
        </view>
      </view>

      <view class="sport-name">{{ sportName }}</view>
      <view class="label">运动项目</view>

      <view class="time-value">{{ displayTime }}</view>
      <view class="label">运动时长</view>

      <!-- 返回按钮：跳转到健身运动记录 -->
      <button class="btn-back" @click="onExit">返回</button>
    </view>
  </view>
</template>

<script>
    import { getReq } from "@/common/request.js";
    import { URL } from "@/common/url.js";
export default {
  data() {
    return {
      sportName: '运动项目',
      elapsedSeconds: 0,
      sportId: '',
      duration: 1,
      videoUrl: '',
      userName: '',
      userAvatar: '/static/images/students/default.png',
      from:'',
      recordDetail:{}
    }
  },
  computed: {
    displayTime() {
      const m = Math.floor(Number(this.elapsedSeconds) / 60)
      const s = Math.floor(Number(this.elapsedSeconds) % 60)
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
  },
  onLoad(e) {
    this.sportName = e.name || '运动项目'
    this.elapsedSeconds = Number(e.seconds || 0)
    this.sportId = e.id || ''
    this.duration = Number(e.duration || 1)
    this.videoUrl = e.videoUrl || ''
    
    try {
      const user = uni.getStorageSync('xiaotiyunUser') || {}
      this.userName = user.name || user.realName || user.nickName || user.nickname || '学生'
      this.userAvatar = user.avatarUrl || user.headImg || '/static/images/students/default.png'
    } catch (err) {}

    if (e.from) {
      this.loadRecordDetail()
    }
  },
  methods: {
    loadRecordDetail(){
      getReq(URL.jxjRecordDetail,{id:this.sportId}).then(res => {
        this.recordDetail = res.data
      })
    },
    onReplay() {
      if (this.videoUrl) {
        // 简单跳转到一个可播放的视频页面；如需专用回放页，可后续接入
        uni.navigateTo({
          url: `/pagesTask/assign/assignTask/practice?id=${encodeURIComponent(this.sportId)}&duration=${this.duration}`
        })
      } else {
        uni.showToast({ title: '暂无回放视频', icon: 'none' })
      }
    },
    onExit() {
      // 返回到学生端首页（清空栈，更符合“返回首页”的预期）
      uni.reLaunch({ url: '/pages/students/home/index' })
    }
  }
}
</script>

<style scoped lang="scss">
.finish-page {
  min-height: 100vh;
  background: #F5F7FF;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
.hero {
  height: 360rpx;
  background: linear-gradient(180deg, #6FD0FF 0%, #9ED8FF 50%, #D8F0FF 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 44rpx;
  position: relative;
}
.hero-title {
  font-size: 60rpx;
  color: #FFFFFF;
  font-weight: 800;
  text-shadow: 0 6rpx 16rpx rgba(0,0,0,0.18);
  letter-spacing: 2rpx;
}
.result-card {
  background: #FFFFFF;
  border-radius: 32rpx;
  box-shadow: 0 16rpx 40rpx rgba(0,0,0,0.08);
  margin: -96rpx 28rpx 28rpx;
  padding: 36rpx;
}
.header-box {
  background: rgba(255,255,255,0.86);
  border-radius: 22rpx;
  padding: 22rpx;
  box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.06) inset;
  margin-bottom: 28rpx;
  border: 1rpx solid rgba(46,120,255,0.10);
}
.user-row {
  display: flex;
  align-items: center;
}
.avatar {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: #EEE;
  margin-right: 16rpx;
}
.user-name {
  flex: 1;
  font-size: 30rpx;
  color: #202020;
}
.replay {
  display: inline-flex;
  align-items: center;
  background: #E8F0FE;
  color: #2E78FF;
  border-radius: 26rpx;
  padding: 12rpx 20rpx;
}
.sport-name {
  text-align: center;
  font-size: 36rpx;
  font-weight: 700;
  color: #2E78FF;
  margin: 32rpx 0 8rpx;
}
.label {
  text-align: center;
  font-size: 24rpx;
  color: #909399;
}
.time-value {
  text-align: center;
  font-size: 72rpx;
  font-weight: 800;
  color: #2E78FF;
  margin: 20rpx 0 6rpx;
  letter-spacing: 1rpx;
}
.btn-back {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 16rpx;
  background: #EAF2FF;
  color: #2E78FF;
  border: none;
  margin-top: 32rpx;
}

/* 英寸屏顶部的彩带装饰近似实现（不影响交互） */
.confetti {
  position: absolute;
  width: 16rpx;
  height: 8rpx;
  border-radius: 2rpx;
  opacity: 0.9;
}
.c1 { background: #FF7A00; top: 80rpx; left: 140rpx; transform: rotate(18deg); }
.c2 { background: #FFD23F; top: 120rpx; right: 120rpx; transform: rotate(-22deg); }
.c3 { background: #4DE1FF; top: 160rpx; left: 60rpx; transform: rotate(35deg); }
.c4 { background: #6EE781; top: 110rpx; right: 40rpx; transform: rotate(8deg); }
.c5 { background: #FF6F91; top: 180rpx; left: 240rpx; transform: rotate(-12deg); }
</style>
