<template>
	<view class="maxBox" v-if="listVisible">
		<u-picker mode="selector" v-model="selectorVisible" range-key="name" :range="titList"
			@confirm="titChange($event,index)"></u-picker>
		<view class="topScreen" @click="this.selectorVisible = true">
			<view class="topTitle">
				{{titName}}
			</view>
			<image src="../../static/images/change-down.png" class="changeDown"></image>
		</view>
		<view class="data-item" v-for="item in list" :key="item.classId" @click="navClassDetails(item)">
			<view class="className">
				<!-- {{item.gradeNameA}}
				</br>
				{{item.number}}班 -->
				<!-- {{item.aliasClassName ? (item.gradeNameA + item.aliasClassName) : item.className}} -->
				{{item.aliasClassName ? item.aliasClassName : item.className}}
			</view>
			<view class="classNumber">
				{{item.classCode}}
				<view class="help-icon" v-if="item.classManageType == 2">{{$t('common.help')}}</view>
			</view>
			<view class="studentNum">
				{{$t('common.student')}}：<text style="color: #202020;">{{item.studentCount || '0'}}</text>名
				<text>（{{item.noStudentNum || '0'}}名{{$t('common.noTest')}}）</text>
			</view>
			<view class="line"></view>
			<view class="statistical">
				<view>平均分： <text style="color: #202020;">{{item.avgScore || '-'}}</text></view>
				<view style="color: #FE9025;">及格率： {{item.passCountChance}}</view>
				<view style="color: #5C8FF7;text-align: right;">{{$t('common.excellent')}}率：
					{{item.excellentCountChance}}
				</view>
			</view>
			<image src="../../../static/images/common/arrow-black.png" class="jian"></image>
		</view>
	</view>
	<view class="maxBox" v-else>
		<u-picker mode="selector" v-model="selectorVisible" range-key="name" :range="titList"
			@confirm="titChange($event,index)"></u-picker>
		<view class="topScreen" @click="this.selectorVisible = true">
			<view class="topTitle">
				{{titName}}
			</view>
			<image src="../../static/images/change-down.png" class="changeDown"></image>
		</view>
		<view class="nolist">
			<image src="../../static/images/nullFianco.png" class="noImg"></image>
			<view class="noTit">
				{{$t('common.none')}}{{$t('data.physicalData.index.title')}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
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
				selectorVisible: false,
				titName: '',
				physicalId: '',
				physicalTime: new Date(),
				titList: [],
				list: [],

				// 国际化
				gradeText: this.$t('common.gradeText'),
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('data.physicalData.index.title')
			})
			this.getDownLoad()
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		methods: {
			navClassDetails(data) {
				if (data.studentCount) {
					uni.navigateTo({
						url: '/pagesData/physicalData/classDetails/classDetails?classCode=' + data.classCode +
							'&&physicalId=' + this.physicalId + '&&physicalTime=' + this.physicalTime +
							'&&partakeCount=' + data.partakeCount
					})
				}
			},
			getList() {
				getReq(URL.physicalsClassList, {
					physicalId: this.physicalId
				}).then(res => {
					if (res.error == 10000) {
						let _this = this
						if (res.data && res.data.length > 0) {
							this.listVisible = true
							this.list = res.data.map(function(item, index) {
								return {
									...item,
									noStudentNum: item.studentCount - item.partakeCount,
									passCountChance: item.passCount ? ((item.passCount * 100) / item
										.partakeCount).toFixed(2) + '%' : '0%',
									excellentCountChance: item.excellentCount ? ((item.excellentCount *
										100) / item.partakeCount).toFixed(2) + '%' : '0%',
									gradeNameA: _this.getGradeContent(item.grade)
								}
							})
						} else {
							this.listVisible = false
						}
						console.log(this.listVisible)
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
			},
			getDownLoad() {
				getReq(URL.getPhysicals, {
					schoolId: this.xiaotiyunUser.teacher.schoolId
				}).then(res => {
					if (res.error == 10000) {
						if (res.data) {
							this.titList = res.data
							this.titChange(0)
							// this.getList()
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
			titChange(e) {
				console.log(e, 333)
				this.titName = this.titList[e].name
				this.physicalId = this.titList[e].physicalId
				this.physicalTime = this.titList[e].startTime
				this.getList()
			}
		}
	}
</script>

<style scoped lang="scss">
	.maxBox {
		width: 750upx;
		overflow: scroll;
		padding-top: 16upx;

		.topScreen {
			margin: 0 0 16upx 31upx;

			.topTitle {
				color: #202020;
				font-size: 24upx;
				margin-right: 15upx;
				display: inline-block;
			}

			.changeDown {
				width: 18upx;
				height: 16upx;
			}
		}

		/* background: #F5F5F5; */
		.data-item {
			width: 702upx;
			height: 228upx;
			background: #FFFFFF;
			box-shadow: 0px 0px 8upx 0px rgba(112, 112, 112, 0.1);
			border-radius: 24upx;
			margin-bottom: 16upx;
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
				top: 83upx;
				left: 144upx;
			}

			.line {
				width: 638upx;
				height: 1upx;
				background: #DDDDDD;
				position: absolute;
				top: 143upx;
				left: 32upx;
			}

			.statistical {
				width: 638upx;
				display: flex;
				// justify-content: space-around;
				position: absolute;
				top: 168upx;
				left: 32upx;
				font-size: 24upx;

				view {
					width: 33%;
					text-align: left;
				}
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
