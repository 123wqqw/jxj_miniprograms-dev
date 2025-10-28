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

    <!-- 筛选标签（调整位置：在前三名区上面） -->
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

    <!-- 顶部背景与前三名展示（仅UI调整，不改动逻辑） -->
    <view class="hero-bg">
      <view class="podium">
        <!-- TOP2 -->
        <view class="podium-card podium-sub">
          <view class="podium-title">TOP2</view>
          <view class="podium-name">{{ leaderboardList[1] && leaderboardList[1].name }}</view>
          <view class="podium-time">{{ leaderboardList[1] && leaderboardList[1].totalTime }}分钟</view>
        </view>
        <!-- TOP1 -->
        <view class="podium-card podium-main">
          <view class="podium-title">TOP1</view>
          <view class="podium-name">{{ leaderboardList[0] && leaderboardList[0].name }}</view>
          <view class="podium-time">{{ leaderboardList[0] && leaderboardList[0].totalTime }}分钟</view>
        </view>
        <!-- TOP3 -->
        <view class="podium-card podium-sub">
          <view class="podium-title">TOP3</view>
          <view class="podium-name">{{ leaderboardList[2] && leaderboardList[2].name }}</view>
          <view class="podium-time">{{ leaderboardList[2] && leaderboardList[2].totalTime }}分钟</view>
        </view>
      </view>
    </view>

    <!-- 排行榜列表（样式调整为卡片行，与设计一致） -->
    <view class="leaderboard-list">
      <view
        class="list-row"
        v-for="(item, index) in leaderboardList"
        :key="index"
        :class="{ 'is-me': item.isMe }"
      >
        <view class="row-left">
          <view class="row-rank" :class="{ top: item.rank <= 3 }">{{ item.rank }}</view>
          <image :src="item.avatar || '/static/images/students/user.png'" class="row-avatar" mode="aspectFill" />
          <view class="row-name">{{ item.name }}</view>
        </view>
        <view class="row-right">
          <view class="row-time">{{ item.totalTime }}分钟</view>
        </view>
      </view>
    </view>
    <!-- 底部我的排名固定条（UI仅展示，无交互改动） -->
    <view class="self-rank-bar">
      <view class="self-left">
        <view class="self-rank">{{ myRank.rank }}</view>
        <view class="self-name">我的</view>
        <view class="self-time">{{ myRank.totalTime }}分钟</view>
      </view>
      <view class="self-action">去锻炼</view>
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
  background: linear-gradient(180deg, #77b6ff 0%, #eaf6ff 38%, #f7f9fc 100%);
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

/* 顶部前三名展示 */
.hero-bg {
  padding: 24rpx 24rpx 0;
}
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 12rpx 8rpx 24rpx;
}
.podium-card {
  width: 200rpx;
  background: rgba(255,255,255,0.92);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(46,120,255,0.12);
  text-align: center;
  padding: 20rpx 12rpx;
}
.podium-main {
  width: 220rpx;
  transform: translateY(-10rpx);
  border: 4rpx solid #ffd86a;
}
.podium-sub {
  border: 2rpx solid #cfe2ff;
}
.podium-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #4b7cff;
  margin-bottom: 8rpx;
}
.podium-name {
  font-size: 26rpx;
  color: #666;
}
.podium-time {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.filter-section {
  padding: 0 32rpx 20rpx;
  background: #ffffff;
}

.filter-tabs {
  display: flex;
  gap: 0;
  background: #eaf2ff;
  border-radius: 16rpx;
  margin: 0 8rpx;
}

.filter-tab {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: #2E78FF;
}

.tab-text {
  font-size: 26rpx;
  color: #2E78FF;
  transition: color 0.3s ease;
}

.filter-tab.active .tab-text {
  color: #ffffff;
  font-weight: 600;
}

.leaderboard-list {
  padding: 0 24rpx 120rpx;
}

/* 列表行样式 */
.list-row {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 18rpx 20rpx;
  margin-bottom: 16rpx;
}
.list-row.is-me {
  background: #eef4ff;
}
.row-left {
  display: flex;
  align-items: center;
  flex: 1;
}
.row-rank {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  background: #f2f4f7;
  color: #333;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}
.row-rank.top {
  background: #e8f0ff;
  color: #2E78FF;
}
.row-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}
.row-name {
  font-size: 30rpx;
  color: #333;
}
.row-right {
  display: flex;
  align-items: center;
}
.row-time {
  font-size: 26rpx;
  color: #999;
}

/* 底部固定我的排名条 */
.self-rank-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120rpx;
  background: #2E78FF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}
.self-left {
  display: flex;
  align-items: center;
  color: #ffffff;
}
.self-rank {
  font-size: 36rpx;
  font-weight: 800;
  margin-right: 24rpx;
}
.self-name {
  font-size: 30rpx;
  margin-right: 24rpx;
}
.self-time {
  font-size: 26rpx;
  opacity: 0.9;
}
.self-action {
  height: 72rpx;
  padding: 0 28rpx;
  background: #ffffff;
  color: #2E78FF;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}
</style>
