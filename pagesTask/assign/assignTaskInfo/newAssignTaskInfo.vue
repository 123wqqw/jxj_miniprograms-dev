<template>
	<view class="assign-task-info-container">
		<u-modal v-model="withdrawVisible" :content="withdrawContent" :title="withdrawTitle" :confirm-text="enter"
			:title-style="{ fontSize: '34rpx', fontWeight: '500', color: '#333333' }" show-cancel-button="true"
			@confirm="closeWithdraw">
		</u-modal>
		<view class="task-info-header">
			<view class="class-name">{{ classInfo.className }} </view>
			<text>{{ dateTimeStr }}</text>
		</view>
		<view v-if="editable && isEditable" class="twoBtn">
			<view @click="navSelectAi"> + 添加AI{{ $t('task.assign.assignTaskInfo.actionProgram') }} </view>
			<!-- <view @click="addCustomItem"> + 添加{{ $t('task.assign.assignTaskInfo.selfProgram') }} </view> -->
		</view>


		<block v-if="(AIBoyNumber + customItemList.length) >= 6 && (AIGirlNumber + customItemList.length) >= 6">
			<view class="homework-tips">
				<image src="../../../static/images/ash_tips.png" mode="aspectFit"></image>
				<text>体育作业过多，请注意控制作业量</text>
			</view>
		</block>
		<block v-else>
			<view class="homework-tips">
				<image v-if="(AIBoyNumber + customItemList.length) >= 6 || (AIGirlNumber + customItemList.length) >= 6"
					src="../../../static/images/ash_tips.png" mode="aspectFit"></image>
				<text v-if="(AIBoyNumber + customItemList.length) >= 6">男生作业过多，请注意控制作业量</text>
				<text v-if="(AIGirlNumber + customItemList.length) >= 6">女生作业过多，请注意控制作业量</text>
			</view>
		</block>

		<view class="main" v-if="editable && isEditable">
			<scroll-view scroll-y="true" class="scroll-height" :scroll-into-view="scrollTaskId">
				<!-- AI项目 -->
				<view class="AIItem" v-for="(item, index) in AIItemList" :key="index" :id="item.taskId">
					<view class="AItitle">
						{{ `${$t('common.program')}${index + 1}` }}
					</view>
					<view class="AIremove">
						<image src="../../static/images/removeA.png" v-if="editable" class="removeimg"
							@click="removeAIItemList(index, item)"></image>
					</view>
					<view class="itemName">
						<view class=""> {{ $t('common.program') }} </view>
						<view>{{ item.name }}</view>
					</view>
					<view class="classNumber">
						<view>{{ $t('task.assign.assignTaskInfo.groupNum') }}</view>
						<view v-if="item.todayNoEditable"> <text>{{ item.maleGroupLabel }}</text> ></view>
						<view v-else @click="openSelectClass(index)"> <text>{{ item.maleGroupLabel }}</text> ></view>
					</view>
					<view class="sex">
						<view>性别</view>
						<view v-if="item.todayNoEditable"><text>{{ item.partStatusLabel }}</text> ></view>
						<view v-else @click="openSelectSex(index)"><text>{{ item.partStatusLabel }}</text> ></view>
					</view>
					<view class="input-cell">
						<view class="left-text">{{ $t('task.assign.assignTaskInfo.standardNum') }}<label>(非必填)</label>
						</view>
						<view class="input-control" v-if="editable">
							<input type="number" :disabled="item.todayNoEditable" class="input-item" maxlength="6"
								name="name" :value="item.standardNum" @input="standardNumChange($event, index)"
								:placeholder="$t('task.assign.assignTaskInfo.clickInput')"
								placeholder-style="color:#B2B2B2" />
						</view>
						<view class="value-text" v-if="!editable && item.standardNum">{{ item.standardNum }}</view>
						<view class="value-text-none" v-if="!editable && !item.standardNum">
							{{ $t('task.assign.assignTaskInfo.unSetting') }}</view>
						<view class="right-text" v-if="editable || (!editable && item.standardNum)">
							{{ item.name.indexOf('个') > -1 ? '秒' : $t('common.one') }}</view>
					</view>
				</view>
				<!-- 自定义项目 -->
				<view class="customItem" v-for="(item, index) in customItemList" :key="item" :id="item.taskId">
					<view class="title">
						{{ `${$t('common.program')}${AIItemList.length + index + 1}` }}
					</view>
					<view class="customRemove">
						<image src="../../static/images/removeA.png" v-if="editable" class="removeimg"
							@click="removeCustomItemList(index, item)"></image>
					</view>
					<view style="display: flex;align-items: center;justify-content: space-between;">
						<u-input style="width: 500upx;" v-model="item.name" type="text" :clearable="false"
							:placeholder="$t('task.assign.assignTaskInfo.pleaseInputActionName')" maxlength="15"
							:disabled="editable == false || item.todayNoEditable" />
						<view class="conent-size">{{ item.name.length }} / 15</view>
					</view>
					<view style="width: 100%;height: 1upx;background-color:#F5F5F5 ;">
					</view>
					<u-input v-model="item.taskInfo" type="textarea" :clearable="false" height="100"
						:placeholder="$t('task.assign.assignTaskInfo.pleaseInputTaskInfo')" maxlength="100"
						:disabled="editable == false || item.todayNoEditable" />
					<view class="control">
						<view class="conent-pic">
							<view class="pic-view" v-if="!item.taskVideoUrl" @click="addMedia(index)">
								<image class="photo-icon" src="../../static/images/teacherTask/photo2.png"></image>
							</view>
							<!-- 这里显示拍好的照片的list  那个叉叉按钮理论上应该也是这时候才有的  -->
							<view class="video-view" v-else>
								<video :src="item.taskVideoUrl" :id="xiaotiyunUser.teacher.teacherId" @play="playVedio"
									@fullscreenchange="fullscreenchange"></video>
								<view class="del-btn" @click="removeVideo(index)">
									<image v-if="item.todayNoEditable" src="../../static/images/del.png"
										mode="widthFix"></image>
								</view>
							</view>
						</view>
						<view class="conent-size">{{ item.taskInfo.length }} / 100</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 非编辑状态 -->
		<view class="main" v-else>
			<view class="show-item" v-if="customItemList.length > 0">
				<view class="show-name">{{ $t('task.assign.assignTaskInfo.showCustom') }}</view>
				<block v-for="(item, index) in customItemList" :key="index">
					<text :class="{ more: customItemList.length > 3 }">{{ item.name }}</text>
				</block>
			</view>
			<view class="show-item" v-if="AIBoyNumber > 0">
				<view class="show-name">{{ $t('task.assign.assignTaskInfo.boyHomework') }}</view>
				<block v-for="(item, index) in AIItemList" :key="index">
					<text :class="{ more: AIItemList.length > 3 }"
						v-if="item.partStatus == 0 || item.partStatus == 1">{{ item.name }}</text>
				</block>
			</view>
			<view class="show-item" v-if="AIGirlNumber > 0">
				<view class="show-name">{{ $t('task.assign.assignTaskInfo.girlsHomework') }}</view>
				<block v-for="(item, index) in AIItemList" :key="index">
					<text :class="{ more: AIItemList.length > 3 }"
						v-if="item.partStatus == 0 || item.partStatus != 1">{{ item.name }}</text>
				</block>
			</view>
		</view>
		<view class="btn-box-content safe-area-inset-bottom" v-if="editable">
			<view class="default-content">
				<view class="btn-content"></view>
			</view>
		</view>
		<view class="btn-box-content bottom-btn-box safe-area-inset-bottom" v-if="editable">
			<view class="btn-content" v-if="!isEditable">
				<view class="action-btn action-btn-big" @click="isEditable = true">
					{{ $t('task.assign.assignTaskInfo.editBtn') }}</view>
			</view>
			<view class="btn-content" v-else>
				<view class="action-btn action-btn-big" @click="showModalPop"> {{ $t('task.assign.assignTask.title') }}
				</view>
			</view>
		</view>
		<u-modal show-cancel-button :show-title="false" v-model="modalShow"
			:confirm-style="{ borderLeft: '1px solid #F2F2F2' }"
			:content="$t('task.assign.assignTaskInfo.isSureAssignTask')" @confirm="commitClockStudent">
		</u-modal>
		<u-picker mode="selector" v-model="groupSwitch" :default-selector="[group]" range-key="label" :range="groupList"
			@confirm="confirmClass()"></u-picker>
		<u-picker mode="selector" v-model="partSwitch" :default-selector="[partStatus]" range-key="label"
			:range="sexList" @confirm="confirmSex()"></u-picker>
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
export default {
	data() {
		return {
			taskId: "",
			taskIndex: "",
			isTaskType: 0,
			withdrawVisible: false,
			classInfo: {},
			dateTime: "",
			dateTimeStr: "",
			editable: false,
			isEditable: false,
			taskDetails: [], //详情列表
			teacherTask: {},
			taskInfo: "",
			videoUrl: "",
			modalShow: false,

			// 布置作业节流
			isClicked: false,
			/* gggggggggggggggggg */
			AIItemList: [],
			AIItemIndex: 0,
			customItemList: [],
			onePage: false,

			AIBoyNumber: 0,
			AIGirlNumber: 0,

			// 选组
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
			scrollTaskId: '',

			// 国际化
			groupText: this.$t('common.group'),
			pleaseInputParams: this.$t('task.assign.assignTaskInfo.pleaseInputParams'),
			withdrawContent: this.$t('task.assign.assignTaskInfo.withdrawContent'),
			withdrawTitle: this.$t('task.assign.assignTaskInfo.withdrawTitle'),
			enter: this.$t('common.enter'),
		};
	},
	onLoad(options) {
		let _this = this;
		uni.setNavigationBarTitle({
			title: this.$t('task.assign.assignTaskInfo.title')
		})
		const eventChannel = _this.getOpenerEventChannel()
		// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
		eventChannel.on('acceptDataFromOpenerPage', function (data) {
			_this.classInfo = data.classInfo;
			_this.dateTime = data.dateTime;
			_this.dateTimeStr = data.dateTime;
			_this.initPageFun();
		})
	},
	watch: {
		AIItemList: {
			handler(val) {
				let AIBoyNumber = 0, AIGirlNumber = 0;
				val.map((item, index) => {
					if (!item.id) {
						item.taskId = 'AiScroll' + index
					}
					if (item.partStatus == 1) {
						AIBoyNumber += 1;
					} else if (item.partStatus == 2) {
						AIGirlNumber += 1;
					} else {
						AIGirlNumber += 1;
						AIBoyNumber += 1;
					}
					// if(index == val.length - 1 ){
					//   this.scrollTaskId = item.taskId;
					// }
				})
				console.log('AIItemList======>', val);
				this.AIGirlNumber = AIGirlNumber;
				this.AIBoyNumber = AIBoyNumber;
				console.log('AIBoyNumber', this.AIBoyNumber, 'AIGirlNumber', this.AIGirlNumber);
			},
			deep: true, //true 深度监听
			immediate: true
		}
	},
	computed: {
		...mapState(['xiaotiyunUser'])
	},
	methods: {
		// 删除AI项目
		removeItem(item) {
			console.log(item)
		},
		formatDate(now) {
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			return year + "-" + month + "-" + date;
		},
		initPageFun() {
			let _this = this;
			let params = {
				classId: _this.classInfo.classId,
				dateTime: _this.dateTime,
			}
			postReq(URL.assignDetails, params).then(res => {
				if (res.error == 10000) {

					_this.editable = res.data.editable;
					_this.taskDetails = res.data.taskDetails;
					let todayNoEditable = false
					let aa = new Date(res.data.now);
					let checkTime = new Date(_this.dateTime);
					if (_this.formatDate(checkTime) == _this.formatDate(aa)) {
						todayNoEditable = true
					}
					_this.taskDetails.map(item => {
						if (item.taskType == 2) { //ai作业
							// info.map(item=>{  
							if (this.onePage) {
								console.log('进入过ai选择了')
							} else {
								let temp = {}
								temp.todayNoEditable = todayNoEditable
								temp.taskType = 2
								temp.name = item.name
								temp.aiTaskId = item.aiTaskId
								temp.actionId = item.actionId
								// temp.aiTaskId=item.id   没用
								temp.id = item.id
								temp.partStatus = item.partStatus
								temp.partStatusLabel = item.partStatus == 0 ? '全部' : item.partStatus ==
									1 ? '男生' : '女生'
								temp.maleGroup = item.maleGroup //男生和全部时必传 组数
								temp.femaleGroup = item.femaleGroup //女生时必传       组数
								temp.maleGroupLabel = item.partStatus == 0 || item.partStatus == 1 ?
									item.maleGroup + this.groupText : item.femaleGroup + this.groupText
								temp.groupSwitch = false //两个开关
								temp.partSwitch = false //两个开关
								temp.calculateType = item.calculateType;
								temp.femaleNum = item.femaleNum;
								temp.maleNum = item.maleNum;
								temp.standardNum = item.standardNum;
								// temp.isCheckGroup = false;
								this.AIItemList.push(temp)
							}
						} else { //自定义作业
							let temp = {
								taskType: 1,
								todayNoEditable: todayNoEditable,
								id: item.id,
								name: item.name,
								taskInfo: item.taskInfo,
								taskVideoUrl: item.taskVideoUrl, //视频地址
							}
							this.customItemList.push(temp)
						}
					})
				}
			})
		},

		// 添加视频
		addMedia(index) {
			let _this = this;
			uni.chooseVideo({
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				extension: ['mp4'],
				success: function (res) {
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
			} catch (error) {
				console.log(error);
			}
		},
		// 移除媒体文件
		removeVideo(index) {
			let _this = this;
			_this.videoUrl = "";
			this.customItemList[index].taskVideoUrl = ""
		},

		playVedio(e) {
			this.videoContext = uni.createVideoContext(e.currentTarget.id);
			this.videoContext.requestFullScreen();
		},
		fullscreenchange(e) {
			if (!e.detail.fullScreen) {
				this.videoContext.pause();
			}
		},
		//跳转到选择ai
		navSelectAi() {
			//console.log('时间可以不用传', this.dateTimeStr.split() )
			uni.navigateTo({
				url: '/pagesTask/assign/assignTask/selectAi',
				success: (res) => {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("existingList", this.AIItemList);
					res.eventChannel.emit("backAssignTaskInfo", true)
					/* 临时带参数过去 */
					let params = {
						classInfo: this.classInfo,
						dateTime: this.dateTime
					}
					res.eventChannel.emit("tempParams", params);
					// res.eventChannel.emit("assignDates", this.assignDates );  
					// res.eventChannel.emit("canToday", this.canToday );
					// res.eventChannel.emit("chooseDate", this.chooseDate );
				}
			})
		},
		standardNumChange(e, index) {
			let _this = this;
			_this.AIItemList[index].standardNum = parseInt(e.detail.value);
		},
		commitClockStudent() {
			if (this.customItemList.length == 0 && this.AIItemList.length == 0) {
				uni.navigateBack({
					delta: 1
				})
				return
			}
			for (let i = 0; i < this.customItemList.length; i++) {
				if (this.customItemList[i].name == "" || this.customItemList[i].taskInfo == "") {
					uni.showToast({
						title: this.pleaseInputParams,
						icon: 'none',
						duration: 2000,
					})
					return
				}
			}
			let _this = this;
			if (_this.isClicked) return; // 终止后续代码的执行，终止请求
			_this.isClicked = true;
			let params = {
				replace: false,
				classId: this.classInfo.classId, //班级id
				assignDate: this.dateTime, //日期集合
				teacherId: this.xiaotiyunUser.teacher.teacherId,
				taskDetails: []
			}
			// console.log("this.AIItemList",this.AIItemList);
			let AIItemListParams = this.AIItemList.filter(some => !some.todayNoEditable);
			// console.log("AIItemListParams",AIItemListParams);
			let customItemListParams = this.customItemList.filter(some => !some.todayNoEditable);
			params.taskDetails = customItemListParams.concat(AIItemListParams)
			// console.log(params.taskDetails, 3322)
			if (params.taskDetails.length == 0) {
				return uni.navigateBack({
					delta: 1,
				})
			}
			// console.log('null bbbug',this.AIItemList)
			// let replace = params.taskDetails.every(every => every.taskId)
			// params.replace = replace
			params.taskDetails.map(item => {
				// if(!item.isCheckGroup){
				// 	if(item.partStatus==0||item.partStatus==1){
				// 		if(!item.maleGroup){
				// 			item.maleGroup = item.femaleGroup;
				// 			item.femaleGroup = null;
				// 		}
				// 	}else{
				// 		if(!item.femaleGroup){
				// 			item.femaleGroup = item.maleGroup;
				// 			item.maleGroup = null;
				// 		}
				// 	}
				// }
				// delete item.isCheckGroup
				delete item.maleGroupLabel
				delete item.partStatusLabel
				delete item.groupSwitch
				delete item.partSwitch
				//delete item.name
			})
			// console.log('马上好了', params, this.AIItemList)
			postReq(URL.assignTaskEdit, params).then(res => {
				// console.log(res);
				if (res.error == 10000) {
					// 布置作业成功
					uni.navigateBack({
						delta: 1
					});
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
		//添加自定义项目
		addCustomItem() {
			let taskId = 'scroll' + (this.AIItemList.length + this.customItemList.length);
			let item = {
				taskType: 1,
				name: '',
				taskInfo: '',
				taskVideoUrl: '', //视频地址
				taskId
			}
			this.customItemList.push(item);
			this.scrollTaskId = taskId;
			console.log('taskId', taskId)
		},
		//选中组数值
		confirmClass(e) {
			let index = this.AIItemIndex;
			if (this.AIItemList[index].partStatus == 0 || this.AIItemList[index].partStatus == 1) {
				this.AIItemList[index].maleGroup = this.groupList[e[0]].value;
				this.AIItemList[index].femaleGroup = null;
			} else {
				this.AIItemList[index].femaleGroup = this.groupList[e[0]].value;
				this.AIItemList[index].maleGroup = null;
			}
			//if(this.AIItemList[index].partStatus==0||this.AIItemList[index].partStatus==1){
			// this.AIItemList[index].maleGroup=e[0].value 
			//}else{
			// this.AIItemList[index].femaleGroup=e[0].value
			this.AIItemList[index].maleGroupLabel = this.groupList[e[0]].label;
			//}
		},
		//选中性别数值
		confirmSex(e) {
			let index = this.AIItemIndex;
			if (this.sexList[e[0]].value == 0 || this.sexList[e[0]].value == 1) {
				this.AIItemList[index].maleNum = this.AIItemList[index].partStatus == 2 ? this.AIItemList[index]
					.femaleNum : this.AIItemList[index].maleNum;
				this.AIItemList[index].maleGroup = this.AIItemList[index].partStatus == 2 ? this.AIItemList[index]
					.femaleGroup : this.AIItemList[index].maleGroup;
				this.AIItemList[index].femaleNum = null;
				this.AIItemList[index].femaleGroup = null;
			} else {
				this.AIItemList[index].femaleNum = this.AIItemList[index].partStatus == 2 ? this.AIItemList[index]
					.femaleNum : this.AIItemList[index].maleNum;
				this.AIItemList[index].femaleGroup = this.AIItemList[index].partStatus == 2 ? this.AIItemList[index]
					.femaleGroup : this.AIItemList[index].maleGroup;
				this.AIItemList[index].maleNum = null;
				this.AIItemList[index].maleGroup = null;
			}
			this.AIItemList[index].partStatus = this.sexList[e[0]].value;
			this.AIItemList[index].partStatusLabel = this.sexList[e[0]].label;
		},
		//打开各个下拉选择项
		openSelectClass(index) {
			if (this.editable) {
				this.AIItemIndex = index;
				this.groupSwitch = true;
				if (this.AIItemList[index].partStatus == 2) {
					this.group = this.AIItemList[index].femaleGroup - 1;
				} else {
					this.group = this.AIItemList[index].maleGroup - 1;
				}
			}
		},
		openSelectSex(index) {
			if (this.editable) {
				this.AIItemIndex = index;
				this.partSwitch = true;
				this.partStatus = this.AIItemList[index].partStatus;
			}
		},

		closeWithdraw() {
			let params = {
				dateTime: this.dateTime,
				classId: this.classInfo.classId,
				taskId: this.taskId
			}
			postReq(URL.taskRevoke, params).then(res => {
				// console.log(res);
				if (res.error == 10000) {
					// 布置作业成功
					if (this.isTaskType == 1) {
						this.customItemList.splice(this.taskIndex, 1)
					}
					if (this.isTaskType == 2) {
						this.AIItemList.splice(this.taskIndex, 1)
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message,
						duration: 10000
					})
				}
			})
		},
		//X.png
		removeCustomItemList(index, item) {
			if (!item.id) {
				this.customItemList.splice(index, 1)
				return
			}
			this.withdrawVisible = true
			this.taskId = item.id
			this.taskIndex = index
			this.isTaskType = 1
		},
		removeAIItemList(index, item) {

			if (!item.id) {
				this.AIItemList.splice(index, 1)
				return
			}
			this.withdrawVisible = true
			this.taskId = item.id
			this.taskIndex = index
			this.isTaskType = 2

		},
		showModalPop() {
			if (this.customItemList.length == 0 && this.AIItemList.length == 0) {
				uni.navigateBack({
					delta: 1
				})
				return
			}
			for (let i = 0; i < this.customItemList.length; i++) {
				if (this.customItemList[i].name == "" || this.customItemList[i].taskInfo == "") {
					uni.showToast({
						title: this.pleaseInputParams,
						icon: 'none',
						duration: 2000,
					})
					return
				}
			}
			this.modalShow = true
		}
		/* end */

	}
}
</script>

<style lang="less" scoped>
.assign-task-info-container {
	width: 100%;
	padding-bottom: 156upx;

	.task-info-header {
		width: 100%;
		padding: 0 32upx;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #FFFFFF;

		.class-name {
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;
			font-weight: 800;
			color: #202020;
		}

		text {
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 80upx;
			color: #464646;
			float: right;
		}

		.date-time {
			font-size: 28upx;
			color: #707070;
		}
	}

	.task-info-content {
		width: 100%;

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

		.content-box-edit {
			position: relative;
			width: 100%;

			.box-content {
				background: #F9F9F9;
				padding: 16upx 24upx 16upx 24upx;
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

		.content-box-unedit {
			position: relative;
			width: 100%;

			.content-text {
				padding: 16upx 24upx;
				font-size: 28upx;
				color: #202020;
				background-color: #F9F9F9;
				border-radius: 8upx;
			}

			.content-media {
				width: 100%;
				padding: 0 5upx;
				margin-top: 16upx;

				.media-video {
					width: 100%;
					height: 360upx;
				}
			}
		}
	}

	.addHomeWork-button {
		width: 750upx;
		height: 156upx;
		background: #FFFFFF;
		box-shadow: 0px 0px 10upx rgba(221, 221, 221, 0.5);
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;

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
			background: linear-gradient(270deg, #0D9FFF 0%, #78CBFF 100%);
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

	.twoBtn {
		display: flex;
		justify-content: space-between;
		margin: 25upx 56upx;

		>view {
			width: 304upx;
			height: 80upx;
			background: #FFFFFF;
			border-radius: 80upx;
			line-height: 80upx;
			text-align: center;
			color: #707070;
			font-size: 30upx;
		}
	}

	.homework-tips {
		color: #707070;
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 40upx;
		margin-bottom: 24upx;
		padding: 0 24upx;

		>text {
			display: inline-block;
			vertical-align: middle;
		}

		>image {
			width: 30upx;
			height: 30upx;
			display: inline-block;
			margin-right: 12upx;
			vertical-align: middle;
		}
	}
}

.main {
	width: 750upx;
	padding: 0 32upx;

	.scroll-height {
		height: calc(100vh - 362upx - constant(safe-area-inset-bottom));
		height: calc(100vh - 362upx - env(safe-area-inset-bottom));
	}

	.title {
		display: flex;
		// justify-content: space-between;
		align-items: left;
		// margin-bottom: 16upx;
		height: 72upx;
		line-height: 72upx;

		.date-time {
			font-size: 28upx;
			margin-left: 16upx;
		}

		// >view:nth-of-type(1) {
		// 	display: flex;
		// 	align-items: center;
		// 	font-size: 32upx;
		// 	font-weight: bold;
		// 	color: #202020;
		// }
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

		.AIremove {
			position: absolute;
			top: 24upx;
			right: 24upx;

			.removeimg {
				width: 28upx;
				height: 28upx;
			}
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

				>text:nth-of-type(1) {
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

				>text:nth-of-type(1) {
					color: #55B8F9;
					margin-right: 14upx;
				}
			}
		}

		.input-cell {
			width: 100%;
			height: 88upx;
			line-height: 88upx;
			border-top: 2upx solid #F5F5F5;
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

			.value-text {
				flex: 1;
				margin-right: 16upx;
				text-align: right;
				font-size: 28upx;
				font-weight: 400;
				color: #202020;
			}

			.value-text-none {
				flex: 1;
				text-align: right;
				font-size: 28upx;
				font-weight: 400;
				color: #707070;
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

		// .xpng {
		// 	width: 40upx;
		// 	height: 40upx;
		// 	position: absolute;
		// 	right: -13upx;
		// 	top: -18upx;
		// }

	}

	.customItem {
		width: 686upx;
		height: 484upx;
		background: #FFFFFF;
		margin-bottom: 25upx;
		padding: 24upx;
		box-sizing: border-box;
		position: relative;

		.title {
			font-size: 32upx;
			font-weight: bold;
			color: #202020;
			display: flex;
			align-items: center;
		}

		.customRemove {
			position: absolute;
			top: 24upx;
			right: 24upx;

			.removeimg {
				width: 28upx;
				height: 28upx;
			}
		}

		.conent-size {
			font-size: 24upx;
			font-weight: 400;
			color: #B2B2B2;
		}

		// .xpng {
		// 	width: 40upx;
		// 	height: 40upx;
		// 	position: absolute;
		// 	right: -13upx;
		// 	top: -18upx;
		// }

		.control {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-end;
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

	.show-item {
		margin: 16upx 0;
		padding: 24upx;
		background: #fff;
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 40upx;
		color: #202020;

		.show-name {
			margin-bottom: 16upx;
		}

		text {
			margin-right: 48upx;
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 40upx;
			color: #464646;

			display: inline-block;
		}

		&:nth-child(3n) {
			margin-right: 0;
		}

		&.more {
			margin-bottom: 16upx;
		}
	}

}
</style>
