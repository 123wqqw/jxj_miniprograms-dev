<template>
  <view class="hw-page">
    <!-- 顶部渐变+导航 -->
    <view class="hero">
      <view class="nav">
       <!-- <view class="nav-left" @tap="goBack">
          <image src="/static/images/students/arrow-left.png" class="back-icon" />
        </view>
        <view class="nav-title">校外体育作业</view> -->
        <view class="nav-right">
      
        </view>
      </view>
      <!-- 个人信息 -->
      <view class="profile">
        <image src="/static/images/students/user.png" class="avatar" />
        <view class="profile-texts">
          <view class="name">李思思</view>
          <view class="school">北京市朝阳第一小学 四年级3班</view>
        </view>
      </view>
    </view>

    <!-- 内容卡片容器 -->
    <view class="content-card">
      <view class="section-title">体育作业</view>
      <view class="weekday-row">
        <view class="wk" v-for="(d, idx) in weekDates" :key="'wk-'+idx">{{ d.date === '今' ? '今' : '—' }}</view>
      </view>
       <!-- 周日历条 -->
       <view class="week-strip">
         <view v-for="(d, idx) in weekDates" :key="idx" class="day" :class="{ selected: d.selected }" @tap="selectDay(idx)">
           <view class="date">{{ d.date }}</view>
           <view class="dot" v-if="d.hasDot"></view>
         </view>
       </view>
       <view class="leave-tip" v-if="leaveTip">已请假</view>
      <view class="strip-divider"></view>

      <!-- 当日作业标题与提示 -->
      <view class="day-title">{{ dayTitle }}</view>
      <view class="sub-tip">
        <image src="/static/images/students/samll-read.png" class="tip-icon" />
        老师未开启补卡功能
      </view>

      <!-- 作业列表（卡片样式） -->
      <view class="card-list">
        <view class="card-item" v-for="(item, i) in homeworkItems" :key="i">
          <view class="thumb">
            <image :src="item.img" class="thumb-img" />
          </view>
          <view class="card-main">
            <view class="card-row">
              <view class="title">{{ item.title }}</view>
              <view class="right-area">
                <view class="revoked" v-if="item.revoked">已撤回</view>
                <view class="stamp" v-if="item.stamped">已阅</view>
                <!-- 状态按钮移到副文案下方 -->
              </view>
            </view>
            <view class="meta">{{ item.meta }}</view>
            <view class="cta-row">
              <view class="status-pill" :class="item.statusClass" @tap.stop="handleItem(item)">{{ item.statusText }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="cta-btn" @tap="openSummary">任务完成详情（{{ summaryCount }}）</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 顶部周日历
      weekDates: [
        { date: 20, hasDot: false, selected: false },
        { date: 21, hasDot: true, selected: false },
        { date: '今', hasDot: false, selected: false },
        { date: 23, hasDot: true, selected: true },
        { date: 24, hasDot: false, selected: false },
        { date: 25, hasDot: true, selected: false },
        { date: 26, hasDot: false, selected: false },
      ],
      leaveTip: true,
      dayTitle: '10月22日的作业',
      // 作业列表（示例数据，贴近参考稿）
      homeworkItems: [
        {
          title: '腹部拉伸1分钟',
          meta: '1分钟 × 4组',
          img: '/static/images/students/one.png',
          statusText: '去打卡',
          statusClass: 'blue',
          stamped: true,
          revoked: false,
        },
        {
          title: '左右三步跑1分钟',
          meta: '1分钟 × 4组',
          img: '/static/images/students/two.png',
          statusText: '已打卡',
          statusClass: 'gray',
          stamped: false,
          revoked: true,
        },
        {
          title: '合掌跳1分钟',
          meta: '1分钟 × 4组',
          img: '/static/images/students/three.png',
          statusText: '未打卡',
          statusClass: 'light',
          stamped: false,
          revoked: false,
        },
      ],
      summaryCount: '0/3',
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    selectDay(idx) {
      this.weekDates = this.weekDates.map((d, i) => ({ ...d, selected: i === idx }));
    },
    handleItem(item) {
      // 根据状态执行不同逻辑，这里仅作为占位
      if (item.statusClass === 'blue') {
        // 去打卡
        uni.showToast({ title: '前往打卡', icon: 'none' });
      } else {
        uni.showToast({ title: '查看详情', icon: 'none' });
      }
    },
    openSummary() {
      uni.showToast({ title: '打开任务完成详情', icon: 'none' });
    },
  },
};
</script>

<style lang="scss" scoped>
.hw-page {
  min-height: 100vh;
  background: #f5f7fb;
}

.hero {
  height: 340rpx;
  padding: 40rpx 32rpx 0;
  background: linear-gradient(135deg, #77a6ff 0%, #5cd0ff 100%);
  color: #fff;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-left {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon { width: 40rpx; height: 40rpx; }
.nav-title { font-size: 36rpx; font-weight: 600; }
.nav-right { width: 64rpx; }

.profile {
  margin-top: 32rpx;
  display: flex;
  align-items: center;
}
.avatar { width: 88rpx; height: 88rpx; border-radius: 50%; background: #fff; }
.profile-texts { margin-left: 20rpx; }
.name { font-size: 32rpx; font-weight: 600; }
.school { margin-top: 8rpx; font-size: 26rpx; opacity: 0.9; }

.content-card {
  margin-top: -90rpx; /* 让卡片上浮在渐变之上 */
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 24rpx 32rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
  box-shadow: 0 12rpx 24rpx rgba(0,0,0,0.06);
}

.section-title { font-size: 32rpx; font-weight: 600; color: #333; padding: 8rpx 8rpx 12rpx; }
.weekday-row { display: flex; justify-content: space-between; padding: 8rpx 8rpx 0; color: #98a2b3; font-size: 24rpx; }
.weekday-row .wk { flex: 0 0 14.2857%; max-width: 14.2857%; text-align: center; }

.week-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 8rpx 12rpx;
  flex-wrap: nowrap; /* 强制一行展示 */
}
.day { flex: 0 0 14.2857%; max-width: 14.2857%; display: flex; flex-direction: column; align-items: center; }
.date {
  width: 56rpx; height: 56rpx; border-radius: 50%;
  box-sizing: border-box; /* 保证加边框后外径不增大，避免选中态影响平衡 */
  display: flex; align-items: center; justify-content: center;
  font-size: 28rpx; color: #333;
}
.day.selected .date { border: 3rpx solid #2e7bff; color: #2e7bff; }
.dot { width: 8rpx; height: 8rpx; border-radius: 50%; background: #2e7bff; margin-top: 10rpx; }

.leave-tip { color: #ff8a00; font-size: 24rpx; margin-left: 16rpx; }
.strip-divider { height: 2rpx; background: #eaecef; margin: 12rpx 8rpx 0; }

.day-title { margin-top: 12rpx; font-size: 28rpx; color: #333; }
.sub-tip { margin-top: 8rpx; display: flex; align-items: center; font-size: 24rpx; color: #999; }
.tip-icon { width: 28rpx; height: 28rpx; margin-right: 8rpx; }

.card-list { margin-top: 16rpx; }
.card-item {
  display: flex; align-items: center;
  background: #f8fafc; border-radius: 16rpx; padding: 16rpx; margin-top: 16rpx;
}
.thumb { width: 160rpx; height: 120rpx; border-radius: 16rpx; background: #f1f5ff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.card-main { flex: 1; margin-left: 16rpx; }
.card-row { display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 28rpx; color: #333; font-weight: 600; }
.meta { margin-top: 8rpx; font-size: 24rpx; color: #999; }

.right-area { display: flex; align-items: center; gap: 12rpx; }
.status-pill {
  min-width: 120rpx; height: 52rpx; border-radius: 26rpx; padding: 0 24rpx;
  display: flex; align-items: center; justify-content: center; font-size: 24rpx;
}
.status-pill.blue { background: #2e7bff; color: #fff; }
.status-pill.gray { background: #eef0f3; color: #6b7280; }
.status-pill.light { background: #f1f5f9; color: #94a3b8; }

.revoked { font-size: 22rpx; color: #8a8a8a; background: #f1f1f1; padding: 6rpx 12rpx; border-radius: 20rpx; }

/* 绿色印章（模拟圆形印章效果） */
.stamp {
  width: 96rpx; height: 96rpx; border-radius: 50%;
  border: 3rpx dashed #2ecc71; color: #2ecc71;
  display: flex; align-items: center; justify-content: center;
  transform: rotate(-10deg);
  font-size: 24rpx; font-weight: 600;
}

.bottom-bar { padding: 24rpx; }
.cta-btn {
  height: 88rpx; border-radius: 44rpx; background: #2e7bff; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 28rpx; font-weight: 600;
}
.cta-row { margin-top: 12rpx; display: flex; }
</style>
