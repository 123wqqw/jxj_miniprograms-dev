<template>
  <view class="leaderboard-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image
          src="/static/images/students/arrow-left.png"
          class="back-icon"
        ></image>
      </view>
      <view class="nav-title">锻炼风云榜</view>
      <view class="nav-right"></view>
    </view>

    <!-- 我的排名卡片 -->
    <view class="my-rank-card">
      <view class="rank-header">
        <view class="my-rank-info">
          <view class="rank-number">{{ myRank.rank }}</view>
          <view class="rank-label">我的排名</view>
        </view>
        <view class="my-stats">
          <view class="stat-item">
            <view class="stat-number">{{ myRank.totalTime }}</view>
            <view class="stat-label">总时长(分钟)</view>
          </view>
          <view class="stat-item">
            <view class="stat-number">{{ myRank.totalDays }}</view>
            <view class="stat-label">坚持天数</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <view
          class="filter-tab"
          :class="{ active: activeFilter === 'week' }"
          @click="setFilter('week')"
        >
          <text class="tab-text">本周排行</text>
        </view>
        <view
          class="filter-tab"
          :class="{ active: activeFilter === 'month' }"
          @click="setFilter('lastWeek')"
        >
          <text class="tab-text">上周排行</text>
        </view>
        <!-- <view class="filter-tab" :class="{ active: activeFilter === 'total' }" @click="setFilter('total')">
					<text class="tab-text">总计</text>
				</view> -->
      </view>
    </view>

    <!-- 排行榜列表 -->
    <view class="leaderboard-list">
      <view
        class="rank-item"
        v-for="(item, index) in leaderboardList"
        :key="index"
        :class="{ 'my-rank': item.isMe }"
      >
        <view class="rank-position">
          <view class="position-number">
            <image
              v-if="item.rank <= 3"
              :src="getRankIcon(item.rank)"
              class="rank-icon"
            ></image>
            <text v-else class="rank-text">{{ item.rank }}</text>
          </view>
        </view>

        <view class="user-info">
          <view class="avatar">
            <image
              :src="item.avatar || '/static/images/students/user.png'"
              mode="aspectFill"
              class="avatar-img"
            ></image>
          </view>
          <view class="user-details">
            <view class="user-name">{{ item.name }}</view>
            <view class="user-class">{{ item.className }}</view>
          </view>
        </view>

        <view class="rank-stats">
          <view class="stat-item">
            <view class="stat-number">{{ item.totalTime }}</view>
            <view class="stat-label">分钟</view>
          </view>
          <view class="stat-item">
            <view class="stat-number">{{ item.totalDays }}</view>
            <view class="stat-label">天</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="bottom-tip">
      <view class="tip-content">
        <image src="/static/images/students/medal.png" class="tip-icon"></image>
        <view class="tip-text">坚持锻炼，你也能登上榜首！</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getReq, postReq } from '@/common/request.js';
import { URL } from "@/common/url.js";
export default {
  data() {
    return {
      activeFilter: "week",
      myRank: {
        rank: 15,
        totalTime: 180,
        totalDays: 12,
      },
      leaderboardList: [
        {
          rank: 1,
          name: "张小明",
          className: "四年级3班",
          totalTime: 450,
          totalDays: 28,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 2,
          name: "李小红",
          className: "四年级2班",
          totalTime: 420,
          totalDays: 26,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 3,
          name: "王小强",
          className: "四年级1班",
          totalTime: 380,
          totalDays: 24,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 4,
          name: "赵小丽",
          className: "四年级3班",
          totalTime: 350,
          totalDays: 22,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 5,
          name: "陈小华",
          className: "四年级2班",
          totalTime: 320,
          totalDays: 20,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 6,
          name: "刘小军",
          className: "四年级1班",
          totalTime: 300,
          totalDays: 18,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 7,
          name: "黄小美",
          className: "四年级3班",
          totalTime: 280,
          totalDays: 16,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 8,
          name: "周小亮",
          className: "四年级2班",
          totalTime: 260,
          totalDays: 14,
          avatar: "/static/images/students/user.png",
          isMe: false,
        },
        {
          rank: 15,
          name: "李思思",
          className: "四年级3班",
          totalTime: 180,
          totalDays: 12,
          avatar: "/static/images/students/user.png",
          isMe: true,
        },
      ],
    };
  },
  onLoad() {
		const date = this.getCurrentWeekRange();
    // this.loadLeaderboardData(date);
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    getCurrentWeekRange() {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0-6, 0是周日

      // 计算本周一的日期
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

      // 本周一到今天
      const startDate = this.formatDate(monday);
      const endDate = this.formatDate(today);

      return `${startDate} - ${endDate}`;
    },
    getLastWeekRange() {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0-6, 0是周日

      // 计算上周一的日期
      const lastMonday = new Date(today);
      lastMonday.setDate(
        today.getDate() - dayOfWeek - 6 + (dayOfWeek === 0 ? -6 : 1)
      );

      // 计算上周日的日期
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);

      const startDate = this.formatDate(lastMonday);
      const endDate = this.formatDate(lastSunday);

      return `${startDate} - ${endDate}`;
    },
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 设置筛选条件
    setFilter(filter) {
      let date = null;
      if (filter === "week") {
        date = this.getCurrentWeekRange();
      } else {
        date = this.getLastWeekRange();
      }
      this.loadLeaderboardData(date);
    },

    // 获取排名样式类
    getRankClass(rank) {
      if (rank === 1) return "rank-first";
      if (rank === 2) return "rank-second";
      if (rank === 3) return "rank-third";
      return "rank-normal";
    },

    // 获取排名图标
    getRankIcon(rank) {
      if (rank === 1) return "/static/images/students/one.png";
      if (rank === 2) return "/static/images/students/two.png";
      if (rank === 3) return "/static/images/students/three.png";
      return "";
    },

    // 加载排行榜数据
    loadLeaderboardData(time) {
      // 这里可以调用API获取排行榜数据
			const params = {
				time: '2023-08-01'
			}
			getReq(URL.jxjRankInfo,params).then(res => {
				console.log("resresresresresresres", res);
			})
    },
  },
};
</script>

<style lang="scss" scoped>
.leaderboard-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-left {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.nav-right {
  width: 60rpx;
}

.my-rank-card {
  margin: 32rpx;
  background: linear-gradient(135deg, #2c84ff 0%, #4a9eff 100%);
  border-radius: 20rpx;
  padding: 32rpx;
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-rank-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rank-number {
  font-size: 64rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.rank-label {
  font-size: 28rpx;
  color: #ffffff;
  opacity: 0.9;
}

.my-stats {
  display: flex;
  gap: 40rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #ffffff;
  opacity: 0.8;
}

.filter-section {
  padding: 0 32rpx 20rpx;
  background: #ffffff;
}

.filter-tabs {
  display: flex;
  gap: 20rpx;
}

.filter-tab {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 36rpx;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: #2c84ff;
}

.tab-text {
  font-size: 28rpx;
  color: #666666;
  transition: color 0.3s ease;
}

.filter-tab.active .tab-text {
  color: #ffffff;
  font-weight: 500;
}

.leaderboard-list {
  padding: 0 32rpx 32rpx;
}

.rank-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.rank-item.my-rank {
  background: linear-gradient(135deg, #ffe4e1 0%, #fff0f0 100%);
  border: 2rpx solid #ff6b6b;
}

.rank-position {
  width: 80rpx;
  display: flex;
  justify-content: center;
}

.position-number {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.position-number.rank-first {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
}

.position-number.rank-second {
  background: linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%);
}

.position-number.rank-third {
  background: linear-gradient(135deg, #cd7f32 0%, #b8860b 100%);
}

.position-number.rank-normal {
  background: #f5f5f5;
}

.rank-icon {
  width: 40rpx;
  height: 40rpx;
}

.rank-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.position-number.rank-first .rank-text,
.position-number.rank-second .rank-text,
.position-number.rank-third .rank-text {
  color: #ffffff;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 24rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20rpx;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8rpx;
}

.user-class {
  font-size: 26rpx;
  color: #666666;
}

.rank-stats {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 28rpx;
  font-weight: 600;
  color: #2c84ff;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #666666;
}

.bottom-tip {
  padding: 32rpx;
  background: #ffffff;
  margin-top: 20rpx;
}

.tip-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.tip-icon {
  width: 40rpx;
  height: 40rpx;
}

.tip-text {
  font-size: 28rpx;
  color: #666666;
}
</style>
