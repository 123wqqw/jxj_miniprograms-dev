<template>
  <view class="homework-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image
          src="/static/images/students/arrow-left.png"
          class="back-icon"
        ></image>
      </view>
      <view class="nav-title">校外体育作业</view>
      <view class="nav-right"></view>
    </view>

    <!-- 顶部统计区域 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stats-item">
          <view class="stats-number">{{ homeworkStats.total }}</view>
          <view class="stats-label">总作业数</view>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <view class="stats-number">{{ homeworkStats.completed }}</view>
          <view class="stats-label">已完成</view>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <view class="stats-number">{{ homeworkStats.pending }}</view>
          <view class="stats-label">待完成</view>
        </view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <view
          class="filter-tab"
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >
          <text class="tab-text">全部</text>
        </view>
        <view
          class="filter-tab"
          :class="{ active: activeFilter === 'pending' }"
          @click="setFilter('pending')"
        >
          <text class="tab-text">待完成</text>
        </view>
        <view
          class="filter-tab"
          :class="{ active: activeFilter === 'completed' }"
          @click="setFilter('completed')"
        >
          <text class="tab-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 作业列表 -->
    <view class="homework-list">
      <view
        class="homework-item"
        v-for="(homework, index) in filteredHomeworkList"
        :key="index"
        @click="viewHomeworkDetail(homework)"
      >
        <view class="homework-header">
          <view class="homework-title">{{ homework.title }}</view>
          <view class="homework-status" :class="homework.status">
            <text class="status-text">{{ homework.statusText }}</text>
          </view>
        </view>

        <view class="homework-content">
          <view class="homework-info">
            <view class="info-item">
              <image
                src="/static/images/students/class.png"
                class="info-icon"
              ></image>
              <text class="info-text">{{ homework.subject }}</text>
            </view>
            <view class="info-item">
              <image
                src="/static/images/students/read.png"
                class="info-icon"
              ></image>
              <text class="info-text">{{ homework.duration }}分钟</text>
            </view>
            <view class="info-item">
              <image
                src="/static/images/students/rank.png"
                class="info-icon"
              ></image>
              <text class="info-text">{{ homework.difficulty }}</text>
            </view>
          </view>

          <view class="homework-desc">{{ homework.description }}</view>

          <view class="homework-footer">
            <view class="deadline">
              <text class="deadline-label">截止时间：</text>
              <text class="deadline-text">{{ homework.deadline }}</text>
            </view>
            <view class="homework-action">
              <view
                class="action-btn"
                :class="homework.status"
                @click.stop="handleHomework(homework)"
              >
                <text class="action-text">{{ homework.actionText }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="filteredHomeworkList.length === 0">
      <image
        src="/static/images/students/default.png"
        class="empty-icon"
      ></image>
      <view class="empty-text">暂无作业</view>
    </view>
  </view>
</template>

<script>
import { getReq, postReq } from "@/common/request.js";
import { URL } from "@/common/url.js";
export default {
  data() {
    return {
      activeFilter: "all",
      homeworkStats: {
        total: 8,
        completed: 5,
        pending: 3,
      },
      homeworkList: [
        {
          id: 1,
          title: "俯卧撑训练",
          subject: "体育",
          duration: 15,
          difficulty: "中等",
          description: "完成3组俯卧撑，每组10个，组间休息1分钟",
          deadline: "2024-01-20 23:59",
          status: "pending",
          statusText: "待完成",
          actionText: "开始练习",
        },
        {
          id: 2,
          title: "跳绳运动",
          subject: "体育",
          duration: 20,
          difficulty: "简单",
          description: "连续跳绳5分钟，记录跳绳次数",
          deadline: "2024-01-19 23:59",
          status: "completed",
          statusText: "已完成",
          actionText: "查看详情",
        },
        {
          id: 3,
          title: "深蹲练习",
          subject: "体育",
          duration: 10,
          difficulty: "简单",
          description: "完成2组深蹲，每组15个",
          deadline: "2024-01-18 23:59",
          status: "completed",
          statusText: "已完成",
          actionText: "查看详情",
        },
        {
          id: 4,
          title: "平板支撑",
          subject: "体育",
          duration: 5,
          difficulty: "困难",
          description: "保持平板支撑姿势1分钟",
          deadline: "2024-01-21 23:59",
          status: "pending",
          statusText: "待完成",
          actionText: "开始练习",
        },
        {
          id: 5,
          title: "仰卧起坐",
          subject: "体育",
          duration: 12,
          difficulty: "中等",
          description: "完成3组仰卧起坐，每组20个",
          deadline: "2024-01-17 23:59",
          status: "completed",
          statusText: "已完成",
          actionText: "查看详情",
        },
        {
          id: 6,
          title: "开合跳",
          subject: "体育",
          duration: 8,
          difficulty: "简单",
          description: "连续开合跳3分钟",
          deadline: "2024-01-22 23:59",
          status: "pending",
          statusText: "待完成",
          actionText: "开始练习",
        },
      ],
    };
  },
  computed: {
    filteredHomeworkList() {
      if (this.activeFilter === "all") {
        return this.homeworkList;
      }
      return this.homeworkList.filter(
        (homework) => homework.status === this.activeFilter
      );
    },
  },
  onLoad() {
    this.loadHomeworkList();
  },
  methods: {
    // 打卡作业查询
    loadCalendarHW() {
      const params = {
        clockDate: "",
      };
      getReq(URL.jxjTaskInfo, params).then((res) => {});
    },
    // 获取打卡记录
    loadCalendar() {
      const params = {
        beginDate: "",
        endDate: "",
      };
      getReq(URL.jxjCalendar, params).then((res) => {});
    },
    // 上传锻炼记录
    uploadRecord() {
      const params = {
        actionId: 0, //动作id
        aiCount: 0, //ai计数
        bgImageUrl: "", //背景图片url
        commitType: 0, //提交类型（0.正常提交；1.异常提交；2.提前提交）
        consume: 0, //消耗
        continuousJump: 0, //当前连跳个数(个)
        exerciseMediaUrl: "", //锻炼媒体文件地址
        id: 0, //运动记录id
        interrupt: 0, //中断次数
        schemeId: 0, //关联的改善方案id
        score: 0, //成绩
        smartDevices: 0, //是否是智能设备(0.否；1.是)
        speed: 0, //速度
        taskId: 0, //关联的打卡任务id
        timeConsume: 0, //耗时(毫秒)
        type: 0, //模式(1.定时 2.定数 3.纯定时)
      };
      postReq(URL.jxjUploadRecord, params).then((res) => {});
    },
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 设置筛选条件
    setFilter(filter) {
      this.activeFilter = filter;
    },

    // 查看作业详情
    viewHomeworkDetail(homework) {
      console.log("查看作业详情:", homework);
      uni.navigateTo({
        url: `/pages/students/homeworkDetail/index?id=${homework.id}`,
      });
    },

    // 处理作业
    handleHomework(homework) {
      if (homework.status === "pending") {
        // 开始练习
        this.startHomework(homework);
      } else {
        // 查看详情
        this.viewHomeworkDetail(homework);
      }
    },

    // 开始作业
    startHomework(homework) {
      console.log("开始作业:", homework);
      uni.navigateTo({
        url: `/pages/students/homeworkPractice/index?id=${homework.id}`,
      });
    },

    // 加载作业列表
    loadHomeworkList() {
      // 这里可以调用API获取作业列表
      console.log("加载作业列表");
    },
  },
};
</script>

<style lang="scss" scoped>
.homework-container {
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

.stats-section {
  padding: 32rpx;
  background: #ffffff;
  margin-bottom: 20rpx;
}

.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(135deg, #2c84ff 0%, #4a9eff 100%);
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stats-number {
  font-size: 48rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.stats-label {
  font-size: 26rpx;
  color: #ffffff;
  opacity: 0.9;
}

.stats-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.3);
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

.homework-list {
  padding: 0 32rpx 32rpx;
}

.homework-item {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background: #f8f9fa;
  border-bottom: 1rpx solid #e5e5e5;
}

.homework-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.homework-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.homework-status.pending {
  background: #fff3e0;
}

.homework-status.completed {
  background: #e8f5e8;
}

.status-text {
  font-size: 24rpx;
  font-weight: 500;
}

.homework-status.pending .status-text {
  color: #ff9800;
}

.homework-status.completed .status-text {
  color: #4caf50;
}

.homework-content {
  padding: 32rpx;
}

.homework-info {
  display: flex;
  gap: 32rpx;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.info-icon {
  width: 32rpx;
  height: 32rpx;
}

.info-text {
  font-size: 26rpx;
  color: #666666;
}

.homework-desc {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
  margin-bottom: 24rpx;
}

.homework-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deadline {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.deadline-label {
  font-size: 26rpx;
  color: #666666;
}

.deadline-text {
  font-size: 26rpx;
  color: #ff4757;
  font-weight: 500;
}

.homework-action {
  display: flex;
  align-items: center;
}

.action-btn {
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
}

.action-btn.pending {
  background: #2c84ff;
}

.action-btn.completed {
  background: #f5f5f5;
}

.action-text {
  font-size: 26rpx;
  font-weight: 500;
}

.action-btn.pending .action-text {
  color: #ffffff;
}

.action-btn.completed .action-text {
  color: #666666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 32rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: #999999;
}
</style>
