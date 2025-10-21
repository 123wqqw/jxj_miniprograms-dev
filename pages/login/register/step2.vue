<template>
	<view class="register-container">
		<!-- 注册卡片 -->
		<view class="register-card">
			<view class="card-header" style="margin-bottom: 80rpx;">
				<text class="header-title" style="font-weight: 400;">请输入学籍号对应的学生信息</text>
				<text class="header-title" style="font-weight: 600;">学籍号：{{ studentCode }}</text>
			</view>
			<view class="card-header" style="margin-bottom: 40rpx;">
				<text class="header-title">学生姓名</text>
			</view>
			<view class="input-group">
				<input class="input-field" type="text" v-model="name" @input="watchForm" placeholder="请输入学生姓名"
					placeholder-class="input-placeholder" />
			</view>
			<view class="card-header" style="margin-bottom: 40rpx;">
				<text class="header-title">学生年级</text>
			</view>
			<view class="input-group">
				<!-- 学生年级选择器 -->
				<picker class="input-field picker-field" mode="multiSelector" :range="multiRange" :value="multiIndex"
					@change="handleMultiChange">
					<view class="picker-placeholder">
						{{ getSelectedText() }}
					</view>
				</picker>
			</view>
			<view class="form-container">

				<button class="next-btn" :class="{ disabled: nextDisabled }" :disabled="nextDisabled"
					@click="handleNext">
					下一步
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import {
	postReq,
	getReq
} from "../../../common/request.js";
import {
	URL
} from "../../../common/url.js";
import {
	showToast
} from '@/common/util.js'

export default {
	data() {
		return {
			name: '',
			nextDisabled: true,
			multiRange: [
				['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三'],
				Array.from({ length: 50 }, (_, i) => `${i + 1}班`) // 班级默认显示1-50班
			],
			// 多列选择器的选中索引（第一列年级索引，第二列班级索引）
			multiIndex: [-1, -1],
			grade:null,
			number:'',
			studentCode:'',
			// 每个年级对应的班级列表（实际业务中可能需要接口获取，这里先模拟）
			gradeClasses: {
				'一年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'二年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'三年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'四年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'五年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'六年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'七年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'八年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'九年级': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'高一': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'高二': Array.from({ length: 50 }, (_, i) => `${i + 1}班`),
				'高三': Array.from({ length: 50 }, (_, i) => `${i + 1}班`)
			}
		}
	},
	onLoad(options) {
		this.studentCode=options.studentCode
		uni.setNavigationBarTitle({
			title: '账号注册'
		})
	},
	methods: {
		// 多列选择器整体值变化（最终选择确认）
		handleMultiChange(e) {
			this.multiIndex = e.detail.value;
			this.watchForm(); // 可选：如果年级选择影响下一步按钮，可调用
		},
		// 多列选择器某一列变化（年级切换时，更新班级列表）
		handleColumnChange(e) {
			const column = e.detail.column; // 哪一列变化了（0=年级，1=班级）
			const value = e.detail.value;   // 该列选中的索引

			if (column === 0) {
				// 年级列变化时，更新班级列的选项
				const selectedGrade = this.multiRange[0][value];
				this.multiRange[1] = this.gradeClasses[selectedGrade];
				// 重置班级列的选中索引为0（避免超出新班级列表长度）
				this.multiIndex[1] = 0;
			}
		},
		// 获取选中的年级和班级文本
		getSelectedText() {
			if (this.multiIndex[0] === -1 || this.multiIndex[1] === -1) {
				return '请选择学生年级';
			}
			const grade = this.multiRange[0][this.multiIndex[0]];
			const cls = this.multiRange[1][this.multiIndex[1]];
			 this.grade = this.gradeToNumber(this.multiRange[0][this.multiIndex[0]]);
			 this.number = this.classToNumber(this.multiRange[1][this.multiIndex[1]]);
			return `${grade } ${cls }`;
		},
		// 将年级字符串转换为数字
gradeToNumber(gradeStr) {
  const gradeMap = {
    '一年级': 1, '二年级': 2, '三年级': 3, '四年级': 4, '五年级': 5, '六年级': 6,
    '七年级': 7, '八年级': 8, '九年级': 9, '高一': 10, '高二': 11, '高三': 12
  };
  return gradeMap[gradeStr] || 0;
},

// 将班级字符串转换为数字字符串
classToNumber(classStr) {
  // 移除"班"字并提取数字
  return classStr.replace('班', '');
},
		// 监听表单变化
		watchForm() {
			this.nextDisabled = !this.name.trim() || this.multiIndex[0] === -1 || this.multiIndex[1] === -1;
		},

		// 处理下一步
		handleNext() {
			if (this.nextDisabled) return;

			// 验证学生信息
			this.checkStudentId();
		},

		// 验证学生信息
		checkStudentId() {
			uni.showLoading({
				title: '验证中...'
			});
			// TODO: 替换为实际的API接口
			getReq(URL.apiGetVerifStudentInformation, {
				grade: this.grade,name:this.name,number:this.number,studentCode:this.studentCode
			}).then(res => {
				uni.hideLoading();
				if (res.error == 10000) {
					// 学籍号存在，跳转到学生信息确认页面
					uni.navigateTo({
						url: `/pages/login/register/step3?studentCode=${this.studentCode}`
					})
				} else if (res.error == 10001) {
					// 学籍号不存在
					showToast('学籍号不存在');
				} else if (res.error == 10002) {
					// 未查询到在读学校信息
					showToast('未查询到在读学校信息，不可注册绑定');
				} else {
					showToast(res.message || '验证失败');
				}
			}).catch(err => {
				uni.hideLoading();
				showToast('网络错误，请重试');
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.register-container {
	width: 100%;
	min-height: 100vh;
	background: #FFFFFF;
	display: flex;
	box-sizing: border-box;
}

.register-card {
	width: 100%;
	background: #FFFFFF;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
	padding: 40rpx 60rpx;
}

.card-header {
	font-size: 36rpx;
	font-weight: 600;
}

.header-title {
	display: block;
	color: #333333;
}

.form-container {
	padding: 60rpx 40rpx 40rpx;
}

.input-group {
	margin-bottom: 60rpx;
}

.input-field {
	width: 100%;
	height: 88rpx;
	background: #FFFFFF;
	border: 1rpx solid #CCC;
	border-radius: 8rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333333;
	box-sizing: border-box;
	transition: border-color 0.3s ease;

	&:focus {
		border-color: #5C8FF7;
	}
}

.picker-field {
	border-radius: 8rpx;
	box-sizing: border-box;
	padding: 0;
}

.picker-placeholder {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	padding: 0 60rpx 0 24rpx; /* 预留右侧箭头空间 */
	font-size: 28rpx;
	color: #999999;
	position: relative;
}

.picker-placeholder {
	color: #333 !important;
}

/* 右侧箭头样式，符合原型图 */
.picker-placeholder::after {
	content: '\003E'; /* '>' 字符 */
	position: absolute;
	right: 24rpx;
	top: 0;
	height: 88rpx;
	line-height: 88rpx;
	color: #333333;
	font-size: 28rpx;
}

.next-btn {
	width: 300rpx;
	height: 88rpx;
	border: none;
	border-radius: 48rpx;
	font-size: 36rpx;
	background: #e4ecfb;
	color: #2C84FF;
	transition: all 0.3s ease;
	text-align: center;
	font-weight: 600;

	&.disabled {
		background: #EEE;
		color: #999999;
		border: none;
	}

	&::after {
		border: unset;
	}
}

</style>
