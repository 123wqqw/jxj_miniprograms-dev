<template>
	<view class="maxBox" v-if="listVisible">
		<view class="data-item" v-for="item in list" :key="item.classId" @click="navClassDetails(item)">
			<view class="className">
				<text style="text-align: center;">
					{{ item.aliasClassName ? item.aliasClassName : item.className }}
				</text>
				<!-- {{item.gradeNameA}}
				</br>
				{{item.number}}班 -->
			</view>
			<view class="classNumber">
				{{item.classNumber}}
				<view class="help-icon" v-if="item.classManageType == 2">{{$t('common.help')}}</view>
			</view>
			<view class="studentNum">
				{{$t('common.student')}}：<text style="color: #202020;">{{item.studentNum}}</text>名
			</view>
			<view class="rank">
				{{$t('common.gradeText')}}排名：<text>{{item.rank || '-' }}</text>
			</view>
			<view class="averageBox">
				平均分：<text>{{item.averageScore || '-' }}</text>
			</view>
			<image src="../../../static/images/common/arrow-black.png" class="jian"></image>
		</view>
	</view>
	<view class="maxBox" v-else>
		<view class="nolist">
			<image src="../../static/images/nullFianco.png" class="noImg"></image>
			<view class="noTit">
				{{$t('common.none')}}{{$t('data.physicalFactorData.index.title')}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getReq,
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	export default {
		data() {
			return {
				listVisible: false,
				list: [],

				// 国际化
				gradeText: this.$t('common.gradeText'),
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('data.physicalFactorData.index.title')
			})
			this.getList()
		},
		methods: {
			navClassDetails(data) {
				uni.navigateTo({
					url: `/pagesData/physicalFactorData/classDetails/classDetails?classCode=${data.classNumber}&classId=${data.classId}`
				})
			},
			getList() {
				getReq(URL.getClassAvgScoreByTeacher).then(res => {
					if (res.error == 10000) {
						let _this = this
						if (res.data) {
							this.list = res.data.map(function(item) {
								return {
									...item,
									// gradeNameA: this.getGradeContent(item.grade)
									gradeNameA: _this.getGradeContent(item.grade)
								}
							})
							this.listVisible = true
						} else {
							this.listVisible = false
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			getGradeContent(i) {
				let Class = [`一${this.gradeText}`, `二${this.gradeText}`, `三${this.gradeText}`, `四${this.gradeText}`,
					`五${this.gradeText}`, `六${this.gradeText}`, "初一", "初二", "初三", "高一", "高二", "高三"
				];
				return Class[i - 1];
			}
		}
	}
</script>

<style scoped lang="scss">
	.maxBox {
		width: 750upx;
		overflow: scroll;
		padding-top: 27upx;

		/* background: #F5F5F5; */
		.data-item {
			width: 702upx;
			height: 144upx;
			background: #FFFFFF;
			box-shadow: 0px 0px 8upx 0px rgba(112, 112, 112, 0.1);
			border-radius: 24upx;
			margin-bottom: 20upx;
			margin-left: 24upx;
			position: relative;
			color: #707070;

			.className {
				width: 100upx;
				height: 100upx;
				background: #5C8FF7;
				border-radius: 12upx;
				border: 2upx solid #5C8FF7;
				font-size: 24upx;
				font-weight: 500;
				color: #FFFFFF;
				padding: 15upx 12upx;
				box-sizing: border-box;
				position: absolute;
				top: 23upx;
				left: 32upx;
				text-align: center;
			}

			.classNumber {
				height: 36upx;
				font-size: 28upx;
				font-weight: 500;
				color: #202020;
				position: absolute;
				top: 28upx;
				left: 144upx;
				display: flex;
				align-items: center;
			}

			.help-icon {
				width: 34upx;
				height: 34upx;
				border-radius: 50%;
				font-size: 24upx;
				color: #FFFFFF;
				line-height: 34upx;
				text-align: center;
				background-color: #464646;
				margin-left: 16upx;
			}

			.studentNum {
				height: 36upx;
				font-size: 28upx;
				// font-weight: 400;
				color: #707070;
				position: absolute;
				top: 79upx;
				left: 144upx;
			}

			.rank {
				font-size: 24upx;
				font-weight: 400;
				position: absolute;
				top: 32upx;
				left: 487upx;
			}

			.averageBox {
				font-size: 24upx;
				font-weight: 400;
				color: #464646;
				position: absolute;
				top: 76upx;
				left: 481upx;
			}

			.jian {
				width: 17upx;
				height: 32upx;
				position: absolute;
				top: 56upx;
				right: 39upx;
			}
		}

		.nolist {
			position: absolute;
			top: 240upx;
			left: 250upx;
			width: 250upx;

			.noImg {
				width: 250upx;
				height: 144upx;
			}

			.noTit {
				font-size: 24upx;
				font-weight: 400;
				color: #B2B2B2;
				text-align: center;
				margin-top: 24upx;
			}
		}
	}
</style>
