<template>
	<view class="addHomeWork">

		<view class="addHomeWork-grade">
			<view class="grade-name">{{ xiaotiyunUser.teacher.schoolName }}</view>
			<scroll-view scroll-x>
				<view class="grade-tab">
					<view :class="['tab','active']" v-for="(item, index) in classList" :key="index">
						{{ item.className }}
					</view>
				</view>
			</scroll-view>
		</view>


		<view class="addHomeWork-date box">
			<xtyWeekDate ref="detailpicker" @change="handleHomeWorkPicker" :chooseDate="chooseDate"
				:canToday="canToday"></xtyWeekDate>
		</view>


		<view class="addHomeWork-homwork box" style="background: #f5f5f5;padding-bottom: 180rpx;min-height: 850upx;">
			<view class="box-header">
				<view class="title">
					<image class="title-image" src="../../static/images/homework.png"></image>
					{{$t('task.assign.assignTask.classTask')}}
				</view>
			</view>
			<view class="box-content">
				<!-- <view class="content-text">
					<u-input maxlength="100" height="100%" placeholder-style="font-size: 24upx;color:#B2B2B2;" v-model="taskInfo" type="textarea" placeholder="请写明作业说明和要求等等" />
				</view>  
				
			 	<view class="control">
					<view class="conent-pic">
						<view class="pic-view" v-if="!videoUrl" @click="addMedia()">
							<image class="photo-icon" src="../../../static/images/teacherTask/photo2.png"></image>
						</view>
						
						  这里显示拍好的照片的list  那个叉叉按钮理论上应该也是这时候才有的  
						<view class="video-view" v-else>
							<video :src="videoUrl" :id="xiaotiyunUser.teacher.teacherId" @play="playVedio" @fullscreenchange="fullscreenchange" ></video>
							<view class="del-btn" @click="removeVideo()">
								<image src="../../../static/images/del.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
					<view class="conent-size">{{ taskInfo.length }} / 100</view>
				</view>-->
				<!-- ggggggggggggggggggggg -->

				<view class="AIItem" v-for="(item,index) in AIItemList" :key="index">
					<view class="AItitle">
						{{`${$t('common.program')}${index+1}`}}
					</view>
					<view class="itemName">
						<view class=""> {{$t('common.program')}} </view>
						<view>{{item.name}}</view>
					</view>
					<view class="classNumber">
						<view>{{$t('task.assign.assignTask.groupNum')}}</view>
						<view @click="openSelectClass(index)"> <text>{{item.maleGroupLabel}}</text> ></view>
					</view>
					<view class="sex">
						<view>性别</view>
						<view @click="openSelectSex(index)"><text>{{item.partStatusLabel}}</text> ></view>
					</view>
					<view class="input-cell">
						<view class="left-text">{{$t('task.assign.assignTask.standardNum')}}<label>(非必填)</label></view>
						<view class="input-control">
							<input type="number" class="input-item" maxlength="6" name="name" :value="item.standardNum"
								@input="standardNumChange($event,index)"
								:placeholder="$t('task.assign.assignTask.clickInput')"
								placeholder-style="color:#B2B2B2" />
						</view>
						<view class="right-text">{{item.name.indexOf('个') > -1 ? '秒':$t('common.one')}}</view>
					</view>
					<image class="xpng" @click="removeAIItemList(index)" src="../../static/images/x.png"
						mode="aspectFill"></image>
				</view>
				<u-picker mode="selector" v-model="groupSwitch" :default-selector="[group]" range-key="label"
					:range="groupList" @confirm="confirmClass()"></u-picker>
				<u-picker mode="selector" v-model="partSwitch" :default-selector="[partStatus]" range-key="label"
					:range="sexList" @confirm="confirmSex()"></u-picker>

				<view class="customItem" v-for="(item,index) in customItemList" :key="item">
					<view class="title">
						{{`${$t('common.program')}${AIItemList.length+index+1}`}}
					</view>
					<view style="display: flex;align-items: center;justify-content: space-between;">
						<u-input style="width: 500upx;" v-model="item.name" type="text" :clearable="false"
							:placeholder="$t('task.assign.assignTask.pleaseInputActionName')" maxlength="15" />
						<view class="conent-size">{{ item.name.length }} / 15</view>
					</view>
					<view style="width: 100%;height: 1upx;background-color:#F5F5F5 ;">
					</view>
					<u-input v-model="item.taskInfo" type="textarea" :clearable="false" height="100"
						:placeholder="$t('task.assign.assignTask.pleaseInputTaskInfo')" maxlength="100" />
					<view class="control">
						<view class="conent-pic">
							<view class="pic-view" v-if="!item.taskVideoUrl" @click="addMedia(index)">
								<image class="photo-icon" src="../../static/images/teacherTask/photo2.png"></image>
							</view>
							<!--  这里显示拍好的照片的list  那个叉叉按钮理论上应该也是这时候才有的 -->
							<view class="video-view" v-else>
								<video :src="item.taskVideoUrl" :id="xiaotiyunUser.teacher.teacherId" @play="playVedio"
									@fullscreenchange="fullscreenchange"></video>
								<view class="del-btn" @click="removeVideo(index)">
									<image src="../../static/images/del.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
						<view class="conent-size">{{ item.taskInfo.length }} / 100</view>
					</view>
					<image class="xpng" @click="removeCustomItemList(index)" src="../../static/images/x.png"
						mode="aspectFill"></image>
				</view>




				<view class="twoBtn">
					<view @click="navSelectAi"> + 添加AI{{$t('task.assign.assignTask.actionProgram')}} </view>
					<!-- <view @click="addCustomItem"> + 添加{{$t('task.assign.assignTask.selfProgram')}} </view> -->
				</view>

			</view>
		</view>

		<!-- AI作业 -->
		<!-- <view class="addHomeWork-aihomwork box">
			<view class="box-header">
				<view class="title">
					<image class="title-image" src="../../../static/images/aiwork.png"></image>
					AI运动方案
				</view>
				<view class="btn">选择方案</view>
			</view>
			<view class="box-content">
				<view class="conent-input">
					<u-input :clearable="false" maxlength="100" placeholder-style="font-size: 24upx;" v-model="aiQuery.homeworkDesc" :type="textarea" placeholder="请输入方案名称" />
					<view class="conent-size">{{ aiQuery.homeworkDesc.length }} / 100</view>
				</view>
				
				
				<view class="conent-card">
					<view class="conent-row" v-for="(item, index) in aiActionList" :key="index">
						<view>{{ item.name }}</view>
						<image class="choose-icon" src="../../../static/images/choose.png"></image>
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="addHomeWork-add">
			<view class="add-name">
				<image class="add-icon" src="../../../static/images/addaction.png"></image>
				添加动作
			</view>
		</view> 
		
		<view class="addHomeWork-button" @click="showModal()">
			<view class="button">确定</view>
		</view>-->

		<view class="btn-box-content safe-area-inset-bottom">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom">
			<view class="btn-content">
				<view class="action-btn action-btn-big" @click="homework"> {{$t('task.assign.assignTask.title')}}</view>
			</view>
		</view>
		<u-modal show-cancel-button :show-title="false" v-model="modalShow"
			:content="$t('task.assign.assignTask.isSureAssignTask')" @confirm="commitClockStudent"></u-modal>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import {
		getReq,
		postReq
	} from "../../../common/request.js";
	import {
		URL
	} from "../../../common/url.js";
	import OBSupload from "@/common/huaweicloud/index.js"
	import xtyWeekDate from "../../components/xty-week-date/xty-week-date.vue"
	export default {
		components: {
			xtyWeekDate
		},
		data() {
			return {
				classList: [],
				canToday: false,
				replace: false,
				chooseDate: "",
				aiActionList: [{
						name: '俄罗斯转体',
						icon: '',
						id: ''
					},
					{
						name: '平板支撑',
						icon: '',
						id: ''
					},
					{
						name: '跳绳',
						icon: '',
						id: ''
					},
				],

				homeWorkDate: {
					activeQuery: '',
					side: 'today',
					week: {
						detail: {}
					},
					month: {
						detail: {}
					}
				},

				aiQuery: {
					homeworkDesc: '',
				},
				modalShow: false,
				taskInfo: "",
				videoUrl: "",
				assignDates: [],
				// 布置作业节流
				isClicked: false,
				/* hhhhhhhhhhhhhhhhhhhhhhh */
				customItemList: [], //自定义项目列表
				AIItemList: [], //AI项目列表
				AIItemIndex: 0,

				groupList: [{
					value: 1,
					label: `1${this.$t('common.group')}`
				}, {
					value: 2,
					label: `2${this.$t('common.group')}`
				}, {
					value: 3,
					label: `3${this.$t('common.group')}`
				}, {
					value: 4,
					label: `4${this.$t('common.group')}`
				}, {
					value: 5,
					label: `5${this.$t('common.group')}`
				}, {
					value: 6,
					label: `6${this.$t('common.group')}`
				}, {
					value: 7,
					label: `7${this.$t('common.group')}`
				}, {
					value: 8,
					label: `8${this.$t('common.group')}`
				}],
				sexList: [{
					value: 0,
					label: '全部'
				}, {
					value: 1,
					label: '男生'
				}, {
					value: 2,
					label: '女生'
				}],
				partSwitch: false,
				partStatus: 0,
				groupSwitch: false,
				group: 3,

				// 国际化
				pleaseInputTaskInfoWarning: this.$t('task.assign.assignTask.pleaseInputTaskInfoWarning'),
				pleaseCheckTaskDateWarning: this.$t('task.assign.assignTask.pleaseCheckTaskDateWarning'),
				pleaseInputParams: this.$t('task.assign.assignTask.pleaseInputParams'),
				plaeseAddProgram: this.$t('task.assign.assignTask.plaeseAddProgram'),
			};
		},
		watch: {
			/* 	AIItemList:{
					handler(val){
					             console.log('AIItemList',val);
					         },
					         deep:true, //true 深度监听
							 immediate:true
				} */
		},
		// onUnload: function () {
		//         uni.redirectTo({
		//             url: '/pagesTask/assign/index/index', //指定url
		//         })
		// },
		onShow() {
			// console.log('onshow',this.AIItemList)
		},
		onLoad(options) {
			let _this = this;
			uni.setNavigationBarTitle({
				title: this.$t('task.assign.assignTask.title')
			})
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				_this.classList = data.classList;
				_this.canToday = data.canToday;
				_this.chooseDate = data.chooseDate;
				_this.replace = data.replace
				_this.assignDates.push(data.chooseDate);
			})
			// eventChannel.on("info", info=> { 
			// 	 
			// 	 info.map(item=>{
			// 		 let temp={}
			// 		  temp.taskType=2
			// 		  temp.name=item.name
			// 		  temp.actionId=item.sportId
			// 		  temp.aiTaskId=item.id
			// 		  temp.partStatus=0
			// 		  temp.partStatusLabel='全部'
			// 		  temp.maleGroup=3     //男生和全部时必传 组数
			// 		  temp.femaleGroup=3   //女生时必传       组数
			// 		  temp.maleGroupLabel='3组'
			// 		  temp.groupSwitch=false  //两个开关
			// 		  temp.partSwitch=false   //两个开关
			// 		  this.AIItemList.push(temp) 
			// 	 }) 
			//   })
			// eventChannel.on('classList2', data=> { 
			// 	 this.classList = data; 
			// })  
			// eventChannel.on('assignDates2', data=> {
			// 	  this.assignDates = data;  
			// })  
			// eventChannel.on('canToday2', data=> {
			// 	  this.canToday = data;  
			// }) 
			// eventChannel.on('chooseDate2', data=> {
			// 	  this.chooseDate = data;  
			// }) 
		},
		computed: {
			...mapState(['xiaotiyunUser'])
		},
		methods: {
			handleGradeChange(current) {
				let index = this.school.activeGrade.findIndex(item => item == current.id)
				if (index == -1) {
					this.school.activeGrade.push(current.id)
				} else {
					this.school.activeGrade = this.school.activeGrade.filter(item => item != current.id)
				}
			},
			handleHomeWorkPicker(params) {
				console.log("picker-params:", params);
				let {
					components,
					detail
				} = params
				if (components == 'week') {
					this.assignDates = params.selectDateArr;
				} else {
					// this.assignDates
					if (detail.startDate) {
						if (detail.endDate) {
							let endTime = new Date(detail.endDate).getTime();
							let startTime = new Date(detail.startDate).getTime();
							let assignDates = [];
							let oneDayTime = 24 * 60 * 60 * 1000;
							while (this.equalsDate(startTime, endTime) == 2) {
								assignDates.push(this.formatTime(startTime));
								startTime = startTime + oneDayTime;
							}
							assignDates.push(this.formatTime(endTime));
							this.assignDates = assignDates;
						} else {
							this.assignDates = [detail.startDate];
						}
					} else {
						this.assignDates = [this.chooseDate];
					}
				}
				console.log(this.assignDates);
				this.homeWorkDate.side = detail?.side
				this.homeWorkDate.activeQuery = components
				Object.assign(this.homeWorkDate[components], detail)
			},
			formatNum(num) {
				return num < 10 ? '0' + num : num + '';
			},

			equalsDate(startTime, endTime) {
				if (startTime > endTime) return 0;
				let _this = this;
				let start = new Date();
				start.setTime(startTime);
				let end = new Date();
				end.setTime(endTime);
				if (start.getFullYear() == end.getFullYear() && start.getMonth() == end.getMonth() && start.getDate() ==
					end.getDate()) {
					return 1;
				}
				return 2;
			},

			formatTime(timestamp) {
				let _this = this;
				let now = new Date();
				now.setTime(timestamp);
				let year = now.getFullYear();
				let month = _this.formatNum(now.getMonth() + 1);
				let day = _this.formatNum(now.getDate());

				return `${year}-${month}-${day}`;
			},

			// 添加视频
			addMedia(index) {
				let _this = this;
				uni.chooseVideo({
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					extension: ['mp4'],
					success: function(res) {
						console.log(res);
						if (res.tempFilePath) {
							_this.uploadVideo(res.tempFilePath, index);
						}
					}
				})
			},
			// 上传视频到服务器
			async uploadVideo(video, index) {
				try {
					const result = await OBSupload(video, 'video')
					this.videoUrl = result;
					this.customItemList[index].taskVideoUrl = result
				} catch (e) {
					console.log(e);
				}
			},
			// 移除媒体文件
			removeVideo(index) {
				let _this = this;
				_this.videoUrl = "";
				this.customItemList[index].taskVideoUrl = ""
			},

			playVedio(e) {
				console.log(e);
				this.videoContext = uni.createVideoContext(e.currentTarget.id);
				this.videoContext.requestFullScreen();
			},
			fullscreenchange(e) {
				if (!e.detail.fullScreen) {
					this.videoContext.pause();
				}
			},

			showModal() {
				let _this = this;
				if (!_this.taskInfo) {
					return uni.showToast({
						icon: 'none',
						title: _this.pleaseInputTaskInfoWarning,
						duration: 1000,
					})
				}
				if (_this.assignDates.length == 0) {
					return uni.showToast({
						icon: 'none',
						title: _this.pleaseCheckTaskDateWarning,
						duration: 1000,
					})
				}
				_this.modalShow = true;
			},

			commitClockStudent() {
				let _this = this;
				if (_this.isClicked) return; // 终止后续代码的执行，终止请求
				_this.isClicked = true;
				let params = {
					classIds: _this.classList.map(cla => cla.classId),
					assignDates: _this.assignDates,
					teacherId: _this.xiaotiyunUser.teacher.teacherId,
					taskDetails: [{
						taskType: 1,
						taskInfo: _this.taskInfo,
						taskVideoUrl: _this.videoUrl
					}]
				}
				// console.log(params);
				postReq(URL.assignTask, params).then(res => {
					// console.log(res);
					if (res.error == 10000) {
						// 布置作业成功
						uni.navigateBack({
							delta: 1,
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 10000
						})
					}
				})
				setTimeout(() => {
					_this.isClicked = false;
				}, 0)
			},
			standardNumChange(e, index) {
				let _this = this;
				_this.AIItemList[index].standardNum = parseInt(e.detail.value);
			},
			/* yyyyyyyyyyyyyyyyyyy */
			homework() {
				/* let params=this.customItemList.concat(this.AIItemList) */
				if (this.customItemList.length > 0 || this.AIItemList.length > 0) {
					/* this.customItemList.forEach(item=>{ */
					for (let i = 0; i < this.customItemList.length; i++) {
						if (this.customItemList[i].name == "" || this.customItemList[i].taskInfo == "" || this
							.customItemList[i].taskVideoUrl == "") {
							uni.showToast({
								title: this.pleaseInputParams,
								icon: 'none',
								duration: 2000,
							})
							return
						}
					}
					uni.navigateTo({
						url: '/pagesTask/assign/assignTask/taskDetails',
						success: (res) => {
							// 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit("customItemList", this.customItemList);
							res.eventChannel.emit("AIItemList", this.AIItemList);
							res.eventChannel.emit("classList", this.classList);
							res.eventChannel.emit("assignDates", this.assignDates);
							res.eventChannel.emit("assignReplace", this.replace);
						}
					})
				} else {
					uni.showToast({
						title: this.plaeseAddProgram,
						icon: 'none',
						duration: 2000,
					})
				}
			},
			//添加自定义项目
			addCustomItem() {
				let item = {
					taskType: 1,
					name: '',
					taskInfo: '',
					taskVideoUrl: '' //视频地址
				}
				this.customItemList.push(item)
			},
			//跳转到选择ai
			navSelectAi() {
				uni.navigateTo({
					url: '/pagesTask/assign/assignTask/selectAi',
					success: (res) => {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit("existingList", this.AIItemList);
						res.eventChannel.emit("classList", this.classList);
						res.eventChannel.emit("assignDates", this.assignDates);

						res.eventChannel.emit("canToday", this.canToday);
						res.eventChannel.emit("chooseDate", this.chooseDate);
					}
				})
			},
			//选中组数值
			confirmClass(e) {
				let index = this.AIItemIndex;
				if (this.AIItemList[index].partStatus == 2) {
					// 女生
					this.AIItemList[index].femaleGroup = this.groupList[e[0]].value;
					this.AIItemList[index].femaleGroupLabel = this.groupList[e[0]].label;
					this.AIItemList[index].maleGroup = null;
					this.AIItemList[index].maleGroupLabel = null;
				} else {
					// 全部或女生
					this.AIItemList[index].maleGroup = this.groupList[e[0]].value;
					this.AIItemList[index].maleGroupLabel = this.groupList[e[0]].label;
					this.AIItemList[index].femaleGroup = null;
					this.AIItemList[index].femaleGroupLabel = null;
				}
				// this.AIItemList[index].maleGroup=e[0].value
				// this.AIItemList[index].femaleGroup=e[0].value 
				// this.AIItemList[index].maleGroupLabel=e[0].label
			},
			//选中性别数值
			confirmSex(e) {
				let index = this.AIItemIndex;
				if (this.sexList[e[0]].value == this.AIItemList[index].partStatus) return;
				if (this.AIItemList[index].partStatus == 2 && this.sexList[e[0]].value != 2) {
					// 女生 换 男生或全部
					this.AIItemList[index].maleGroup = this.AIItemList[index].femaleGroup;
					this.AIItemList[index].maleGroupLabel = this.AIItemList[index].femaleGroupLabel;
					this.AIItemList[index].femaleGroup = null;
					this.AIItemList[index].femaleGroupLabel = null;
				} else if (this.AIItemList[index].partStatus != 2 && this.sexList[e[0]].value == 2) {
					// 男生或全部 换 女生
					this.AIItemList[index].femaleGroup = this.AIItemList[index].maleGroup;
					this.AIItemList[index].femaleGroupLabel = this.AIItemList[index].maleGroupLabel;
					this.AIItemList[index].maleGroup = null;
					this.AIItemList[index].femaleGroupLabel = null;
				}
				this.AIItemList[index].partStatus = this.sexList[e[0]].value;
				this.AIItemList[index].partStatusLabel = this.sexList[e[0]].label;
				// this.AIItemList[index].partStatus=e[0].value
				// this.AIItemList[index].partStatusLabel=e[0].label
			},
			//打开各个下拉选择项
			openSelectClass(index) {
				this.AIItemIndex = index;
				this.groupSwitch = true;
				if (this.AIItemList[index].partStatus == 2) {
					this.group = this.AIItemList[index].femaleGroup - 1;
				} else {
					this.group = this.AIItemList[index].maleGroup - 1;
				}

			},
			openSelectSex(index) {
				// console.log(this.AIItemList[index]);
				this.AIItemIndex = index;
				this.partSwitch = true;
				this.partStatus = this.AIItemList[index].partStatus;
			},
			//X.png
			removeCustomItemList(index) {
				this.customItemList.splice(index, 1)
			},
			removeAIItemList(index) {
				this.AIItemList.splice(index, 1)
			}
			/* end */
		}
	}
</script>

<style lang="scss" scoped>
	.addHomeWork {
		width: 100%;
		position: relative;
		background: #FAFAFA;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.box {
			width: 100%;
			background: #FFFFFF;
			box-shadow: 0upx 4upx 10upx rgba(0, 0, 0, 0.04);
			border-radius: 12upx;
			padding: 0 32upx 34upx 32upx;

			&:first-child {
				margin: 0upx;
			}

			.title-image {
				width: 38upx;
				height: 38upx;
				margin-right: 10upx;
			}

			.box-header {
				height: 80upx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.box-content {
				border-radius: 8upx;

			}

			.title {
				font-size: 32upx;
				font-weight: bold;
				color: #202020;
				display: flex;
				align-items: center;
			}

			.btn {
				font-size: 28upx;
				font-weight: 400;
				color: #202020;
			}

			.conent-size {
				font-size: 24upx;
				font-weight: 400;
				color: #B2B2B2;
			}
		}

		.addHomeWork-grade {
			position: relative;
			width: 100%;



			.grade-name {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 100%;
				font-size: 24upx;
				font-weight: 500;
				color: #707070;
				padding: 0 32upx;
				margin-top: 20upx;
			}

			.grade-tab {
				position: relative;
				height: 88upx;
				width: max-content;
				// padding-top: 10upx;
				display: flex;
				align-items: center;

				.tab {
					position: relative;
					font-size: 24upx;
					font-weight: bold;
					padding: 2upx 20upx;
					height: 48upx;
					background: #CDCDCD;
					opacity: 1;
					border-radius: 28upx;
					line-height: 48upx;
					text-align: center;
					margin-right: 16upx;
					color: #FFFFFF;
					float: left;

					&:first-child {
						margin-left: 44upx;
					}

					&.active {
						background: linear-gradient(90deg, #9AD8FF 0%, #1BA2FB 100%);
					}
				}
			}
		}

		.addHomeWork-homwork {
			position: relative;
			width: 100%;

			margin-bottom: 16upx;

			.box-content {
				.twoBtn {
					display: flex;
					justify-content: space-between;
					margin-top: 25upx;

					>view {
						width: 332upx;
						height: 72upx;
						background: #55B8F9;
						border-radius: 36upx;
						line-height: 72upx;
						text-align: center;
						color: #FFFFFF;
						font-size: 28upx;
					}
				}

			}

			.control {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;
			}

			.content-text {
				width: 100%;
				height: 250upx;
			}

			.conent-pic {
				width: 160upx;
				height: 160upx;
				border: 2upx solid #B2B2B2;
				border-radius: 8upx;
				display: flex;
				justify-content: center;
				align-items: center;
				overflow: hidden;

				.pic-view {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.video-view {
					width: 100%;
					height: 100%;
					position: relative;

					video {
						width: 100%;
						height: 100%;
					}

					.del-btn {
						position: absolute;
						top: 0;
						right: 0;
						width: 32upx;
						height: 32upx;

						image {
							width: 100%;
						}
					}
				}
			}

			.photo-icon {
				height: 52upx;
				width: 60upx;
			}
		}

		.addHomeWork-aihomwork {
			position: relative;
			width: 100%;
			margin-top: 20upx;
			padding: 16upx 24upx 16upx 24upx;

			.choose-icon {
				height: 35upx;
				width: 35upx;
			}

			.conent-input {
				position: relative;
				background: #F9F9F9;
				padding: 0 24upx;
				margin-bottom: 16upx;
			}

			.conent-card {
				background: #F9F9F9;

				.conent-row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28upx;
					font-weight: 400;
					color: #202020;
					padding: 24upx;
					border-top: solid 1upx #DDDDDD;

					&:first-child {
						border: 0;
					}
				}
			}

			.conent-size {
				position: absolute;
				height: 100%;
				display: flex;
				align-items: center;
				right: 24upx;
				top: 0;
			}

		}

		.addHomeWork-button {
			padding: 0 32upx;
			margin-bottom: 20upx;
			margin-top: 32upx;

			.button {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80upx;
				opacity: 1;
				border-radius: 40upx;
				color: #FFFFFF;
				width: 686upx;
				background: linear-gradient(270deg, #0D9FFF 0%, #78CBFF 100%);
				font-size: 28upx;
				font-weight: 400;
			}
		}

		.addHomeWork-add {
			width: 100%;
			display: flex;
			justify-content: center;
			padding: 16upx 0;

			.add-icon {
				height: 30upx;
				width: 30upx;
				margin-right: 25upx;
			}

			.add-name {
				font-size: 32upx;
				font-weight: 400;
				color: #707070;
				display: flex;
				align-items: center;
			}
		}

		.bottomBtn {
			position: fixed;
			z-index: 20;
			left: 0;
			bottom: 0;
			width: 750upx;
			height: 156upx;
			background: #FFFFFF;
			box-shadow: 0px 0px 10upx rgb(221, 221, 221);
			display: flex;
			justify-content: center;
			align-items: center;

			>text {
				display: inline-block;
				width: 686upx;
				height: 88upx;
				background: linear-gradient(90deg, #6FC7FF 0%, #0FA0FF 100%);
				opacity: 1;
				border-radius: 44upx;
				text-align: center;
				line-height: 88upx;
				color: #fff;
				font-size: 32upx;
			}
		}

	}

	.btn-box-content {
		width: 100%;
		display: block;
		// padding: 32upx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.default-content {
			height: 88upx;
			padding: 32rpx 0;
			box-sizing: content-box;

			.btn-content {
				width: 100%;
				height: 88upx;
			}
		}
	}

	.bottom-btn-box {
		background-color: #FFFFFF;
		box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1008;

		.btn-content {
			width: 100%;
			height: 88upx;
			padding: 32upx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: content-box;
		}

		.action-btn {
			width: 320upx;
			height: 88upx;
			background: linear-gradient(90deg, #6FC7FF 0%, #0FA0FF 100%);
			border: none;
			border-radius: 44upx;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 88upx;
			text-align: center;
		}

		.action-btn-big {
			width: 638upx;
			margin: 0 auto;
		}

		.active {
			background-color: #5276f7;
		}
	}

	.customItem {
		width: 686upx;
		height: 484upx;
		background: #FFFFFF;
		margin-bottom: 25upx;
		padding: 24upx;
		box-sizing: border-box;
		position: relative;

		.xpng {
			width: 40upx;
			height: 40upx;
			position: absolute;
			right: -13upx;
			top: -18upx;
		}
	}

	.AIItem {
		width: 686upx;
		// height: 306upx;
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 24upx 24upx 0 24upx;
		margin-bottom: 25upx;
		position: relative;

		.AItitle {
			width: auto;
			height: 45upx;
			font-size: 32upx;
			font-weight: bold;
			line-height: 45upx;
			color: #464646;
		}

		.itemName {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10upx;
			border-bottom: 2upx solid #F5F5F5;
			height: 64upx;
			line-height: 64upx;

			>view:nth-of-type(1) {
				font-size: 28upx;
				font-weight: 400;
				color: #464646;
			}

			>view:nth-of-type(2) {
				font-size: 28upx;
				font-weight: bold;
				line-height: 40upx;
				color: #464646;
			}
		}

		.classNumber {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 16upx;
			border-bottom: 2upx solid #F5F5F5;
			height: 64upx;
			line-height: 64upx;

			>view:nth-of-type(1) {
				font-size: 28upx;
				font-weight: 400;
				color: #464646;
			}

			>view:nth-of-type(2) {
				font-size: 28upx;
				font-weight: bold;
				line-height: 40upx;

				>text {
					color: #55B8F9;
					margin-right: 14upx;
				}
			}
		}

		.sex {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 16upx;
			height: 64upx;
			line-height: 64upx;

			>view:nth-of-type(1) {
				font-size: 28upx;
				font-weight: 400;
				color: #464646;
			}

			>view:nth-of-type(2) {
				font-size: 28upx;
				font-weight: bold;
				line-height: 40upx;

				>text {
					color: #55B8F9;
					margin-right: 14upx;
				}
			}
		}

		.input-cell {
			width: 100%;
			height: 88upx;
			line-height: 88upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left-text {
				font-size: 28upx;
				font-weight: 400;
				color: #464646;

				label {
					font-size: 24upx;
					font-weight: 400;
					color: #707070;
				}
			}

			.right-text {
				font-size: 28upx;
				font-weight: 400;
				color: #464646;
			}

			.input-control {
				-ms-flex: 1;
				flex: 1;
				margin-right: 16upx;

				.input-item {
					width: 100%;
					border: 0;
					outline: 0;
					-webkit-appearance: none;
					background-color: transparent;
					font-size: 28upx;
					color: #202020;
					height: 56upx;
					min-height: 56upx;
					line-height: 56upx;
					text-align: right;
				}
			}
		}

		.xpng {
			width: 40upx;
			height: 40upx;
			position: absolute;
			right: -13upx;
			top: -18upx;
		}

	}
</style>
