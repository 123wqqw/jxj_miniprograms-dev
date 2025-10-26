<template>
  <view class="gym-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image
          src="/static/images/students/arrow-left.png"
          class="back-icon"
        ></image>
      </view>
      <view class="nav-title">家庭健身房</view>
      <view class="nav-right" @click="showMore">
        <image src="/static/images/students/leave.png" class="more-icon"></image>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 左侧分类导航 -->
      <view class="left-sidebar">
        <!-- 全部运动 -->
        <view
          class="sidebar-item"
          :class="{ active: activeCategory === 'all' }"
          @click="selectCategory('all')"
        >
          <text class="sidebar-text">全部运动</text>
        </view>

        <!-- 具体运动分类 -->
        <view
          class="sidebar-item"
          :class="{ active: activeCategory === category.value }"
          v-for="category in specificCategories"
          :key="category.value"
          @click="selectCategory(category.value)"
        >
          <text class="sidebar-text">{{ category.label }}</text>
        </view>
      </view>

      <!-- 右侧内容 -->
      <view class="right-content">
        <!-- 筛选区域（与网格同块，难度与改善方向并排） -->
        <view class="filter-section capsule">
          <view class="filter-item gray" @click="showDifficultyPicker">
            <text class="filter-text">{{ selectedDifficulty }}</text>
            <image
              src="/static/images/common/arrow-down-yes.png"
              class="filter-arrow"
              :class="{ rotated: showDifficultySelector }"
            ></image>
          </view>
          <view class="filter-item gray" @click="showDirectionPicker">
            <text class="filter-text">{{ selectedDirection }}</text>
            <image
              src="/static/images/common/arrow-down-yes.png"
              class="filter-arrow"
              :class="{ rotated: showDirectionSelector }"
            ></image>
          </view>
        </view>
        <!-- 运动项目网格 -->
        <view class="exercise-grid">
          <view
            class="exercise-item"
            v-for="(exercise, index) in filteredExercises"
            :key="index"
            @click="startExercise(exercise)"
          >
            <view
              class="exercise-card"
              :style="{ backgroundColor: exercise.bgColor }"
            >
              <view class="exercise-illustration">
                <image
                  :src="exercise.illustration"
                  mode="aspectFit"
                  class="exercise-img"
                ></image>
              </view>
              <view class="exercise-arrows">
                <image
                  v-for="arrow in exercise.arrows"
                  :key="arrow.id"
                  :src="arrow.icon"
                  :class="arrow.class"
                  class="arrow-icon"
                ></image>
              </view>
            </view>
            <view class="exercise-name">{{ exercise.name }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 难度选择器（uView 1.x 标准用法） -->
    <u-picker
      :show="showDifficultySelector"
      :columns="[difficultyOptions]"
      keyName="label"
      @confirm="onDifficultyConfirm"
      @cancel="showDifficultySelector = false"
    ></u-picker>

    <!-- 改善方向选择器（uView 1.x 标准用法） -->
    <u-picker
      :show="showDirectionSelector"
      :columns="[directionOptions]"
      keyName="label"
      @confirm="onDirectionConfirm"
      @cancel="showDirectionSelector = false"
    ></u-picker>
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

      // 分类相关
      activeCategory: "all",
      specificCategories: [
        { label: "有氧运动", value: "cardio" },
        { label: "腹部运动", value: "abs" },
        { label: "力量练习", value: "strength" },
        { label: "腿部运动", value: "legs" },
        { label: "手臂运动", value: "arms" },
      ],

      // 筛选选项
      difficultyOptions: [
        { label: "难度", value: "" },
        { label: "初级", value: "beginner" },
        { label: "中级", value: "intermediate" },
        { label: "高级", value: "advanced" },
      ],
      directionOptions: [
        { label: "改善方向", value: "" },
        { label: "减脂", value: "weight_loss" },
        { label: "塑形", value: "fitness" },
        { label: "柔韧性", value: "flexibility" },
        { label: "体能", value: "endurance" },
      ],

      // 运动项目数据
      exercises: [
        {
          name: "腹部拉伸",
          category: "abs",
          difficulty: "beginner",
          direction: "flexibility",
          bgColor: "#FFF4E6",
          illustration: "/static/images/exercises/abs-stretch.svg",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/up-orange.svg",
              class: "arrow-up-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/up-orange.svg",
              class: "arrow-up-right",
            },
          ],
        },
        {
          name: "测腰",
          category: "abs",
          difficulty: "beginner",
          direction: "fitness",
          bgColor: "#FFF4E6",
          illustration: "/static/images/exercises/waist-measure.svg",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/up-orange.svg",
              class: "arrow-up-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/up-orange.svg",
              class: "arrow-up-right",
            },
          ],
        },
        {
          name: "猫式运动",
          category: "all",
          difficulty: "beginner",
          direction: "flexibility",
          bgColor: "#F0F8FF",
          illustration: "/static/images/exercises/cat-pose.svg",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/down-blue.svg",
              class: "arrow-down-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/down-blue.svg",
              class: "arrow-down-right",
            },
          ],
        },
        {
          name: "双脚原地踏绳跳（慢...）",
          category: "cardio",
          difficulty: "intermediate",
          direction: "weight_loss",
          bgColor: "#E6F3FF",
          illustration: "/static/images/exercises/rope-jump.svg",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/left-blue.svg",
              class: "arrow-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/right-blue.svg",
              class: "arrow-right",
            },
          ],
        },
        {
          name: "前后摆平衡站立",
          category: "all",
          difficulty: "beginner",
          direction: "fitness",
          bgColor: "#F0F8FF",
          illustration: "/static/images/students/exercise.png",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/left-blue.svg",
              class: "arrow-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/right-blue.svg",
              class: "arrow-right",
            },
          ],
        },
        {
          name: "A字拉伸",
          category: "strength",
          difficulty: "intermediate",
          direction: "flexibility",
          bgColor: "#FFF4E6",
          illustration: "/static/images/students/exercise.png",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/left-blue.svg",
              class: "arrow-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/right-blue.svg",
              class: "arrow-right",
            },
          ],
        },
        {
          name: "左右三步跑",
          category: "cardio",
          difficulty: "intermediate",
          direction: "fitness",
          bgColor: "#E6F3FF",
          illustration: "/static/images/students/exercise.png",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/left-blue.svg",
              class: "arrow-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/right-blue.svg",
              class: "arrow-right",
            },
          ],
        },
        {
          name: "合掌跳",
          category: "cardio",
          difficulty: "beginner",
          direction: "weight_loss",
          bgColor: "#FFF4E6",
          illustration: "/static/images/students/exercise.png",
          arrows: [
            {
              id: 1,
              icon: "/static/images/arrows/up-orange.svg",
              class: "arrow-up-left",
            },
            {
              id: 2,
              icon: "/static/images/arrows/up-orange.svg",
              class: "arrow-up-right",
            },
          ],
        },
      ],
      pageQuery: {
        pages: {
          pageNum: 1,
          pageSize: 10,
        },
        directionId: "",
        difficulty: [],
        dimensionId: "",
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
    // this.getList();
		// this.getQuery()
  },

  methods: {
    // 查看锻炼方向，难度和改善方向
    getQuery() {
      getReq(URL.jxjDirection).then((res) => {
				console.log('resresresresres',res);
				
			});
    },
		// 获取运动列表
    getList() {
      const params = { ...this.pageQuery };
      postReq(URL.jxjSportList, params).then((res) => {
				console.log('resresresresresresres',res);
				
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
      this.showDifficultySelector = true;
    },

    showDirectionPicker() {
      this.showDirectionSelector = true;
    },

    onDifficultyConfirm(e) {
      // uView u-picker事件：e.data为选中项对象数组，单列取第一个
      const selected = e?.data?.[0] || null;
      if (selected) {
        this.selectedDifficulty = selected.label;
      } else if (Array.isArray(e?.value)) {
        // 兼容仅返回值数组的情况
        const idx = this.difficultyOptions.findIndex(
          (opt) => opt.value === e.value[0]
        );
        if (idx > -1)
          this.selectedDifficulty = this.difficultyOptions[idx].label;
      }
      this.showDifficultySelector = false;
    },

    onDirectionConfirm(e) {
      const selected = e?.data?.[0] || null;
      if (selected) {
        this.selectedDirection = selected.label;
      } else if (Array.isArray(e?.value)) {
        const idx = this.directionOptions.findIndex(
          (opt) => opt.value === e.value[0]
        );
        if (idx > -1) this.selectedDirection = this.directionOptions[idx].label;
      }
      this.showDirectionSelector = false;
    },

    selectCategory(category) {
      this.activeCategory = category;
      // 切换分类时重置筛选为占位，避免旧条件影响新分类
      this.selectedDifficulty = "难度";
      this.selectedDirection = "改善方向";
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
  align-items: center;
  padding: 12rpx 20rpx;
  background-color: transparent;
  gap: 12rpx;
}

/* 胶囊容器 */
.filter-section.capsule {
  background-color: #fff;
  margin: 0 16rpx;
  padding: 12rpx 16rpx;
  border-radius: 999rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 灰色按钮 */
.filter-item.gray {
  background-color: #f3f4f6;
  border-color: #e7e9ee;
  border: 0;
  box-shadow: none;
  border-radius: 8rpx;
}

.filter-item {
  flex: 0 0 calc(50% - 12rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  min-height: 56rpx;
  background-color: #ffffff;
  border-radius: 10rpx;
  border: 1rpx solid #ddd;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.filter-item:active {
  background-color: #f8f9fa;
  transform: scale(0.98);
}

.filter-text {
  font-size: 26rpx;
  color: #666;
  font-weight: 400;
}

.filter-arrow {
  display: block;
  width: 22rpx;
  height: 22rpx;
  color: #666666;
  opacity: 1;
  flex-shrink: 0;
  transition: transform 0.18s ease;
}

/* 展开态箭头旋转 */
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
}

/* 运动分类样式 */
/* 运动项目网格样式 */
.exercise-grid {
  padding: 8rpx 24rpx 24rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
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
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  padding: 0 4rpx;
}

/* 响应式调整 */
@media screen and (max-width: 750rpx) {
  .exercise-item {
    width: calc(50% - 12rpx);
  }
}
</style>