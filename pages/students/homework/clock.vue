<template>
  <view class="clock-page">
    <!-- 顶部渐变状态栏 -->
    <view class="hero">
      <!-- #ifdef MP-WEIXIN -->
      <view class="status-bar" :style="{ height: statusBarRpx }"></view>
      <!-- #endif -->
      <view class="nav">
        <view class="nav-left" @tap="goBack">
          <image
            src="/static/images/students/arrow-left.png"
            class="back-icon"
          />
        </view>
        <view class="nav-title">2025.04.21 14:32布置</view>
      </view>
      <!-- 完成率与请假按钮 -->
      <view class="rate-row">
        <view class="rate-val">75%</view>
        <view class="rate-meta">
          <view class="rate-label">作业完成率</view>
          <view class="rate-bar"
            ><view class="rate-bar-fill" :style="{ width: '75%' }"></view
          ></view>
        </view>
        <view class="ask-leave" @tap="askLeave">{{
          isLeave ? "撤销请假" : "请假"
        }}</view>
      </view>
      <!-- 作业小贴士 -->
      <view class="tips-card">
        <view class="tips-left">
          <image src="/static/images/students/logo.png" class="tips-avatar" />
        </view>
        <view class="tips-main">
          <view class="tips-title">作业小贴士</view>
          <view class="tips-sub">2025.04.21 14:32布置</view>
          <view class="tips-desc"
            >当前还有2项作业没有完成，这会影响到你的综合成绩、班级排名赶快去完成吧！</view
          >
        </view>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="content">
      <!-- 腹部拉伸块 -->
      <view class="section">
        <view class="section-header">
          <view class="title">腹部拉伸</view>
          <view class="meta">中级难度 1分钟*4组</view>
        </view>
        <view class="group-grid">
          <view class="group-card success">
            <view class="badge">已完成</view>
            <image src="/static/images/students/one.png" class="group-img" />
            <view class="group-meta">1分钟</view>
          </view>
          <view class="group-card success">
            <view class="badge">已完成</view>
            <image src="/static/images/students/one.png" class="group-img" />
            <view class="not-upload">未上传</view>
            <view class="group-meta">1分钟</view>
          </view>
          <view class="group-card ghost">
            <view class="ghost-title">第三组</view>
            <view class="ghost-btn" @tap="goClock">去完成</view>
          </view>
          <view class="group-card ghost">
            <view class="ghost-title">第四组</view>
            <view class="ghost-btn" @tap="goClock">去完成</view>
          </view>
        </view>
      </view>

      <view class="section-divider"></view>

      <!-- 左右三步跑块 -->
      <view class="section">
        <view class="section-header">
          <view class="title">左右三步跑</view>
          <view class="meta">中级难度 1分钟*4组</view>
        </view>
        <view class="group-grid">
          <view class="group-card success">
            <view class="badge">已完成</view>
            <image src="/static/images/students/two.png" class="group-img" />
            <view class="group-meta">1分钟</view>
          </view>
          <view class="group-card success">
            <view class="badge">已完成</view>
            <image src="/static/images/students/two.png" class="group-img" />
            <view class="not-upload">未上传</view>
            <view class="group-meta">1分钟</view>
          </view>
          <view class="group-card ghost">
            <view class="ghost-title">第三组</view>
            <view class="ghost-btn" @tap="goClock">去完成</view>
          </view>
          <view class="group-card ghost">
            <view class="ghost-title">第四组</view>
            <view class="ghost-btn" @tap="goClock">去完成</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 请假弹框（仅小程序端） -->
    <!-- #ifdef MP-WEIXIN -->
    <view v-if="showLeaveDialog" class="overlay" @tap="cancelLeave">
      <view class="dialog" @tap.stop>
        <view v-if="!isLeave" class="dlg-title">请假原因</view>
        <view v-if="!isLeave" class="dlg-input">
          <textarea
            v-model="leaveReason"
            :maxlength="100"
            placeholder="请输入请假理由，最多100字"
            class="dlg-textarea"
          />
        </view>
        <view v-if="isLeave">请确认是否撤销请假</view>
        <view class="dlg-divider"></view>
        <view class="dlg-actions">
          <view class="dlg-btn cancel" @tap="cancelLeave">我再想想</view>
          <view class="dlg-v-divider"></view>
          <view class="dlg-btn confirm" @tap="confirmLeave">{{
            isLeave ? "确认撤销" : "确认请假"
          }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getReq, postReq } from "@/common/request.js";
import { URL } from "@/common/url.js";
export default {
  data() {
    return {
      statusBarRpx: "44rpx",
      showLeaveDialog: false,
      leaveReason: "",
      isLeave: false,
    };
  },
  created() {
    // #ifdef MP-WEIXIN
    // 适配微信小程序：使用设备窗口宽度精确将 px -> rpx
    try {
      const info = uni.getSystemInfoSync();
      if (info && info.statusBarHeight && info.windowWidth) {
        const px2rpx = (px) =>
          Math.round((px * 750) / info.windowWidth) + "rpx";
        this.statusBarRpx = px2rpx(info.statusBarHeight);
      }
    } catch (e) {
      // 保留默认高度
    }
    // #endif
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    askLeave() {
      if (!this.isLeave) {
        this.showLeaveDialog = true;
      } else {
        this.showRepeal = true;
      }
    },
    cancelLeave() {
      this.showLeaveDialog = false;
      this.showRepeal = false;
    },
    confirmLeave() {
      if (!this.isLeave) {
        const reason = (this.leaveReason || "").trim();
        if (!reason) {
          uni.showToast({ title: "请填写请假原因", icon: "none" });
          return;
        }
        if (reason.length > 100) {
          uni.showToast({ title: "请假原因不超过100字", icon: "none" });
          return;
        }
        postReq(URL.jxjAskLeave, { askleaveText: this.leaveReason }).then(
          (res) => {
            if (res.message === "成功") {
              this.showLeaveDialog = false;
              uni.showToast({ title: "已提交请假", icon: "none" });
              this.isLeave = true;
            }
          }
        );
      } else {
        postReq(URL.jxjRevoke, { askLeaveDate: "2021-09-01" }).then((res) => {
          console.log(res);
          if (res.message === "成功") {
            this.showLeaveDialog = false;
            uni.showToast({ title: "已撤销请假", icon: "none" });
            this.isLeave = false;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* #ifdef MP-WEIXIN */
.status-bar {
  width: 100%;
}
/* #endif */
.clock-page {
  min-height: 100vh;
  background: #f5f6f8;
}
.hero {
  padding: 48rpx 24rpx 20rpx;
  min-height: 420rpx;
  background: linear-gradient(135deg, #77a6ff 0%, #5cd0ff 100%);
  color: #fff;
}
.status-bar {
  width: 100%;
  height: 44rpx;
}
.nav {
  display: grid;
  grid-template-columns: 160rpx 1fr 160rpx;
  align-items: center;
}
.nav-left {
  width: 160rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 8rpx;
}
.nav-title {
  font-size: 30rpx;
  font-weight: 600;
  text-align: center;
}
.nav-right {
  width: 160rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8rpx;
}

.action-chip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 6rpx 16rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4rpx);
}
.chip-dots {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.chip-dots .d {
  width: 8rpx;
  height: 8rpx;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
}
.chip-target {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(0, 0, 0, 0.75);
  position: relative;
}
.chip-target::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6rpx;
  height: 6rpx;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.nav-left {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;
}
.back-icon {
  width: 40rpx;
  height: 40rpx;
}
.nav-title {
  font-size: 30rpx;
  font-weight: 600;
  margin: 0 12rpx;
}
.nav-right {
  width: 64rpx;
  margin-left: 8rpx;
}

.rate-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 24rpx;
  width: 100%;
}
.rate-val {
  font-size: 72rpx;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1rpx;
}
.rate-bar {
  height: 10rpx;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 8rpx;
  margin-top: 8rpx;
  overflow: hidden;
}
.ask-leave {
  padding: 8rpx 16rpx;
  border-radius: 24rpx;
  background: transparent;
  border: 2rpx solid rgba(255, 255, 255, 0.9);
  color: #fff;
  font-size: 24rpx;
  margin-left: auto;
}
.rate-meta {
  flex: 1;
  min-width: 0;
}
.tips-card {
  margin-top: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
}
.tips-left {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tips-avatar {
  width: 100rpx;
  height: 100rpx;
}
.tips-main {
  flex: 1;
  color: #2b2b2b;
}
.tips-title {
  font-size: 28rpx;
  font-weight: 700;
}
.tips-sub {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
}
.tips-desc {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.content {
  padding: 24rpx;
}
.section {
  margin-bottom: 24rpx;
}
.section-header {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin: 12rpx 4rpx;
}
.section-header .title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111;
}
.section-header .meta {
  font-size: 24rpx;
  color: #8a8f99;
}
.section-divider {
  height: 2rpx;
  background: #edeef1;
  margin: 12rpx 8rpx 20rpx;
}

.group-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}
.group-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.group-card.success {
  position: relative;
}
.badge {
  position: absolute;
  left: 12rpx;
  top: 12rpx;
  font-size: 22rpx;
  color: #2ecc71;
  background: #e8f6ee;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
}
.not-upload {
  position: absolute;
  right: 12rpx;
  bottom: 48rpx;
  font-size: 22rpx;
  color: #ff8a00;
  background: #fff2e5;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
}
.group-img {
  width: 100%;
  height: 140rpx;
  border-radius: 12rpx;
  object-fit: cover;
}
.group-meta {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #8a8f99;
}

.group-card.ghost {
  background: #f5f6f8;
  border: 2rpx dashed #e5e7eb;
  align-items: center;
  justify-content: center;
}
.ghost-title {
  font-size: 26rpx;
  color: #8a8f99;
  margin-bottom: 12rpx;
}
.ghost-btn {
  height: 56rpx;
  padding: 0 24rpx;
  border-radius: 28rpx;
  background: #2c84ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
}
/* 请假弹框样式 */
/* #ifdef MP-WEIXIN */
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.dialog {
  width: 640rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
}
.dlg-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #222;
  padding: 32rpx 24rpx 12rpx;
}
.dlg-input {
  padding: 8rpx 24rpx 16rpx;
  border-bottom: 1rpx solid #eee;
}
.dlg-textarea {
  width: 100%;
  min-height: 160rpx;
  font-size: 28rpx;
  color: #333;
}
::v-deep .dlg-textarea[placeholder] {
  color: #c0c4cc;
}
.dlg-divider {
  height: 1rpx;
  background: #ededed;
}
.dlg-actions {
  display: flex;
  height: 100rpx;
}
.dlg-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}
.dlg-btn.cancel {
  color: #222;
}
.dlg-btn.confirm {
  color: #3d6aae;
}
.dlg-v-divider {
  width: 1rpx;
  background: #ededed;
}
/* #endif */
</style>