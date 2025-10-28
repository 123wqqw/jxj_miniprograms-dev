<template>
  <view class="gym-page">
    <!-- 顶部导航栏 -->
    <!-- <view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<image src="/static/images/common/arrow-left.png" class="back-icon"></image>
			</view>
			<view class="nav-title">家庭健身房</view>
			<view class="nav-right" @click="showMore">
				<image src="/static/images/common/more.png" class="more-icon"></image>
			</view>
		</view> -->

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 左侧分类导航 -->
      <view class="left-sidebar">
        <!-- 全部运动 -->
        <view
          class="sidebar-item"
          :class="{ active: activeCategory === 'all' }"
          @tap="selectCategory('all')"
        >
          <text class="sidebar-text">全部运动</text>
        </view>

        <!-- 具体运动分类 -->
        <view
          class="sidebar-item"
          :class="{ active: activeCategory === category.id }"
          v-for="category in specificCategories"
          :key="category.id"
          @tap="selectCategory(category.id)"
        >
          <text class="sidebar-text">{{ category.name }}</text>
        </view>
      </view>

      <!-- 右侧内容 -->
      <view class="right-content">
        <!-- 筛选区域（与网格同块，难度与改善方向并排） -->
        <view class="filter-section">
          <view class="filter-item gray" @tap="toggleDifficultyDropdown">
            <text class="filter-text">{{ selectedDifficulty }}</text>
            <image
              src="/static/images/common/arrow-down-yes.png"
              class="filter-arrow"
              :class="{ rotated: showDifficultyDropdown }"
            ></image>
          </view>
          <view class="filter-item gray" @tap="toggleDirectionDropdown">
            <text class="filter-text">{{ selectedDirection }}</text>
            <image
              src="/static/images/common/arrow-down-yes.png"
              class="filter-arrow"
              :class="{ rotated: showDirectionDropdown }"
            ></image>
          </view>
        </view>
        <!-- 下拉面板：难度 -->
        <view v-if="showDifficultyDropdown" class="dropdown-panel">
          <view
            class="option-item"
            v-for="opt in difficultyOptions"
            :key="opt.id"
            @tap="chooseDifficulty(opt)"
          >
            <text
              class="option-text"
              :class="{ selected: selectedDifficulty === opt.name }"
              >{{ opt.name }}</text
            >
          </view>
        </view>
        <!-- 下拉面板：改善方向 -->
        <view v-if="showDirectionDropdown" class="dropdown-panel">
          <view
            class="option-item"
            v-for="opt in directionOptions"
            :key="opt.id"
            @tap="chooseDirection(opt)"
          >
            <text
              class="option-text"
              :class="{ selected: selectedDirection === opt.name }"
              >{{ opt.name }}</text
            >
          </view>
        </view>
        <!-- 下拉遮罩 -->
        <view
          v-if="showDifficultyDropdown || showDirectionDropdown"
          class="dropdown-mask"
          @tap="closeDropdowns"
        ></view>
        <!-- 运动项目网格 -->
        <view class="exercise-grid">
          <view
            class="exercise-item"
            v-for="(exercise) in exercises"
            :key="exercise.id"
            @tap="startExercise(exercise)"
          >
            <view
              class="exercise-card"
            >
              <view class="exercise-illustration">
                <image
                  :src="exercise.aiSportImg"
                  mode="aspectFit"
                  class="exercise-img"
                ></image>
              </view>
            </view>
            <view class="exercise-name">{{ exercise.aiSportName }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 难度选择器（uView 1.x 标准用法） -->
    <!-- 已移除：使用自定义下拉面板替代 u-picker -->
    <!-- 改善方向选择器（uView 1.x 标准用法） -->
    <!-- 已移除：使用自定义下拉面板替代 u-picker -->
  </view>
</template>

<script>
import { getReq, postReq } from "@/common/request.js";
import { URL } from "@/common/url.js";
export default {
  data() {
    return {
      // 筛选相关
      selectedDifficulty: "难度",
      selectedDirection: "改善方向",
      showDifficultySelector: false,
      showDirectionSelector: false,
      showDifficultyDropdown: false,
      showDirectionDropdown: false,

      // 分类相关
      activeCategory: "all",
      specificCategories: [],

      // 筛选选项
      difficultyOptions: [],
      directionOptions: [],

      // 运动项目数据
      exercises: [
      ],
      pageQuery: {
        difficulty: [1],
        dimensionId: [10],
        directionId: 0,
        pageNum: 1,
        pageSize: 9999,
      },
    };
  },

  computed: {
    filteredExercises() {
      return this.exercises.filter((exercise) => {
        // 分类筛选
        const categoryMatch =
          this.activeCategory === "all" ||
          exercise.category === this.activeCategory;

        // 难度筛选
        const difficultyMatch =
          !this.selectedDifficultyValue ||
          exercise.difficulty === this.selectedDifficultyValue;

        // 改善方向筛选
        const directionMatch =
          !this.selectedDirectionValue ||
          exercise.direction === this.selectedDirectionValue;

        return categoryMatch && difficultyMatch && directionMatch;
      });
    },

    selectedDifficultyValue() {
      const option = this.difficultyOptions.find(
        (opt) => opt.label === this.selectedDifficulty
      );
      return option ? option.value : "";
    },

    selectedDirectionValue() {
      const option = this.directionOptions.find(
        (opt) => opt.label === this.selectedDirection
      );
      return option ? option.value : "";
    },
  },
  mounted() {
    this.getQuery();
		this.getList();
  },

  methods: {
    // 查看锻炼方向，难度和改善方向
    getQuery() {
      getReq(URL.jxjDirection).then((res) => {
        if (res.message === "成功") {
          this.difficultyOptions = res.data.difficulty;
          this.directionOptions = res.data.dimension;
        }
      });
    },
    // 获取运动列表
    getList() {
      const params = { ...this.pageQuery };
      postReq(URL.jxjSportList, params).then((res) => {
				if (res.message === "成功") {
					this.exercises = res.data.content
				}
      });
    },
    goBack() {
      uni.navigateBack();
    },

    showMore() {
      uni.showToast({
        title: "更多功能开发中",
        icon: "none",
      });
    },

    showDifficultyPicker() {
      // 改为下拉面板切换
      this.toggleDifficultyDropdown();
    },
    showDirectionPicker() {
      // 改为下拉面板切换
      this.toggleDirectionDropdown();
    },
    // 新增：切换下拉面板
    toggleDifficultyDropdown() {
      this.showDifficultyDropdown = !this.showDifficultyDropdown;
      if (this.showDifficultyDropdown) this.showDirectionDropdown = false;
    },
    toggleDirectionDropdown() {
      this.showDirectionDropdown = !this.showDirectionDropdown;
      if (this.showDirectionDropdown) this.showDifficultyDropdown = false;
    },
    // 新增：遮罩关闭
    closeDropdowns() {
      this.showDifficultyDropdown = false;
      this.showDirectionDropdown = false;
    },
    // 新增：选择项
    chooseDifficulty(opt) {
      this.selectedDifficulty = opt.label;
      this.showDifficultyDropdown = false;
    },
    chooseDirection(opt) {
      this.selectedDirection = opt.label;
      this.showDirectionDropdown = false;
    },
    selectCategory(category) {
      this.activeCategory = category;
    },

    startExercise(exercise) {
      uni.showToast({
        title: `开始${exercise.name}`,
        icon: "success",
      });
      // 这里可以跳转到具体的运动详情页面
      // uni.navigateTo({
      //     url: `/pages/exercise/detail?name=${exercise.name}`
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.gym-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.nav-left,
.nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon,
.more-icon {
  width: 40rpx;
  height: 40rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

/* 筛选区域样式 */
.filter-section {
  display: flex;
  padding: 20rpx 32rpx;
  background-color: #fff;
  gap: 16rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
  padding: 16rpx 20rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  border: 1rpx solid #ddd;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.filter-item:active {
  background-color: #f8f9fa;
  transform: scale(0.98);
}

.filter-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 400;
}

.filter-arrow {
  display: block;
  width: 24rpx;
  height: 24rpx;
  margin-left: 6rpx;
  opacity: 0.8;
  transition: transform 0.2s ease;
}
.filter-arrow.rotated {
  transform: rotate(180deg);
}

/* 主要内容区域样式 */
.main-content {
  display: flex;
  background-color: #fff;
  min-height: calc(100vh - 200rpx);
}

/* 左侧分类导航样式 */
.left-sidebar {
  width: 180rpx;
  background-color: #fafafa;
  border-right: 1rpx solid #e0e0e0;
  padding: 12rpx 0;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  padding: 18rpx 12rpx;
  margin: 3rpx 8rpx;
  border-radius: 6rpx;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-item:hover {
  background-color: #f0f0f0;
}

.sidebar-item.active {
  background-color: #007aff;
  box-shadow: 0 2rpx 6rpx rgba(0, 122, 255, 0.25);
}

.sidebar-text {
  font-size: 24rpx;
  color: #555;
  text-align: center;
  line-height: 1.3;
  word-break: break-all;
  font-weight: 400;
}

.sidebar-item.active .sidebar-text {
  color: #fff;
  font-weight: 500;
}

/* 右侧内容样式 */
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 运动分类样式 */
/* 运动项目网格样式 */
.exercise-grid {
  padding: 24rpx 32rpx 32rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  flex: 1;
}

.exercise-item {
  width: calc(50% - 12rpx);
  margin-bottom: 32rpx;
}

.exercise-card {
  position: relative;
  height: 240rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.exercise-illustration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
}

.exercise-img {
  width: 100%;
  height: 100%;
}

.exercise-arrows {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.arrow-icon {
  position: absolute;
  width: 32rpx;
  height: 32rpx;
}

.arrow-up-left {
  top: 24rpx;
  left: 24rpx;
}

.arrow-up-right {
  top: 24rpx;
  right: 24rpx;
}

.arrow-down-left {
  bottom: 24rpx;
  left: 24rpx;
}

.arrow-down-right {
  bottom: 24rpx;
  right: 24rpx;
}

.arrow-left {
  top: 50%;
  left: 24rpx;
  transform: translateY(-50%);
}

.arrow-right {
  top: 50%;
  right: 24rpx;
  transform: translateY(-50%);
}

.exercise-name {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  line-height: 1.4;
}

/* 响应式调整 */
@media screen and (max-width: 750rpx) {
  .exercise-item {
    width: calc(50% - 12rpx);
  }
}

/* 下拉面板样式 */
.dropdown-panel {
  position: absolute;
  top: 84rpx;
  left: 16rpx;
  right: 16rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  padding: 8rpx 8rpx;
  z-index: 20;
}
.option-item {
  padding: 14rpx 18rpx;
}
.option-text {
  font-size: 26rpx;
  color: #333;
}
.option-text.selected {
  color: #1a73e8;
  font-weight: 600;
}
.dropdown-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  z-index: 15;
}
</style>

<style lang="scss" scoped>
.gym-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.nav-left,
.nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon,
.more-icon {
  width: 40rpx;
  height: 40rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

/* 筛选区域样式 */
.filter-section {
  display: flex;
  padding: 20rpx 32rpx;
  background-color: #fff;
  gap: 16rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
  padding: 16rpx 20rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  border: 1rpx solid #ddd;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.filter-item:active {
  background-color: #f8f9fa;
  transform: scale(0.98);
}

.filter-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 400;
}

.filter-arrow {
  display: block;
  width: 24rpx;
  height: 24rpx;
  margin-left: 6rpx;
  opacity: 0.8;
}

/* 主要内容区域样式 */
.main-content {
  display: flex;
  background-color: #fff;
  min-height: calc(100vh - 200rpx);
}

/* 左侧分类导航样式 */
.left-sidebar {
  width: 180rpx;
  background-color: #fafafa;
  border-right: 1rpx solid #e0e0e0;
  padding: 12rpx 0;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  padding: 18rpx 12rpx;
  margin: 3rpx 8rpx;
  border-radius: 6rpx;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-item:hover {
  background-color: #f0f0f0;
}

.sidebar-item.active {
  background-color: #007aff;
  box-shadow: 0 2rpx 6rpx rgba(0, 122, 255, 0.25);
}

.sidebar-text {
  font-size: 24rpx;
  color: #555;
  text-align: center;
  line-height: 1.3;
  word-break: break-all;
  font-weight: 400;
}

.sidebar-item.active .sidebar-text {
  color: #fff;
  font-weight: 500;
}

/* 右侧内容样式 */
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 运动分类样式 */
/* 运动项目网格样式 */
.exercise-grid {
  padding: 24rpx 32rpx 32rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  flex: 1;
}

.exercise-item {
  width: calc(50% - 12rpx);
  margin-bottom: 32rpx;
}

.exercise-card {
  position: relative;
  height: 240rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.exercise-illustration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
}

.exercise-img {
  width: 100%;
  height: 100%;
}

.exercise-arrows {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.arrow-icon {
  position: absolute;
  width: 32rpx;
  height: 32rpx;
}

.arrow-up-left {
  top: 24rpx;
  left: 24rpx;
}

.arrow-up-right {
  top: 24rpx;
  right: 24rpx;
}

.arrow-down-left {
  bottom: 24rpx;
  left: 24rpx;
}

.arrow-down-right {
  bottom: 24rpx;
  right: 24rpx;
}

.arrow-left {
  top: 50%;
  left: 24rpx;
  transform: translateY(-50%);
}

.arrow-right {
  top: 50%;
  right: 24rpx;
  transform: translateY(-50%);
}

.exercise-name {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  line-height: 1.4;
}

/* 响应式调整 */
@media screen and (max-width: 750rpx) {
  .exercise-item {
    width: calc(50% - 12rpx);
  }
}
</style>