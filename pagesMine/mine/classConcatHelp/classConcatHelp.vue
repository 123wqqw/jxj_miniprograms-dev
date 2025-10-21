<template>
	<view class="maxBox">
		<!-- <view class="checkAll">全选</view> -->
		<view class="zhezhao">
			<u-mask :show="zhezhaoShow" @click="nonezhezhao"></u-mask>
			<scroll-view scroll-y="true" class="zhezhaoBox" v-if="zhezhaoShow">
				<view class="checkedTit">{{$t('mine.mine.classConcat.readyChecked')}}<text style="color: #5C8FF7;">{{newClassList.length}}</text>{{$t('common.one')}}{{$t('common.classText')}} <text style="color: #5C8FF7;float: right;" @click="zhezhaoShow = false">{{$t('common.enter')}}</text></view>
				<view v-for="(item,index) in newClassList" class="checkedItem" :key="index">
					{{item.className}}
					<view class="yichu" @click="yichuItem(item, index)">
						移除
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 选全部 大全选 -->
		<view class="checkAll">
			<u-checkbox
				@change="checkboxChangeAll" 
				v-model="allChecked"
				:disabled="allDisabled"
			>{{allChooseText}}</u-checkbox>
		</view>
		<!-- 单个年级全选 -->
		<view class="checkItem">
			<u-checkbox class="checkDropBox"
				@change="checkboxChange" 
				v-model="item.checked" 
				v-for="(item, index) in list" :key="index" 
				:name="item.gradeName"
				:disabled="item.disabled"
			>{{item.gradeName}}
				<!-- 选单个班级 -->
				<view class="checkItemClick"  @tap.stop="goSpread(item)"> <!-- 展开年级点击区域 -->
					<view v-if="item.spread">
						<text class="checkItemText">收起</text>
						<image src="../../static/images/jtbz.png" mode="" class="checkItemImg"></image>
					</view>
					<view v-else>
						<text class="checkItemText">{{showText}}</text>
						<image src="../../static/images/jtbz2.png" mode="" class="checkItemImg"></image>
					</view>
				</view>
				<!-- <image v-if="item.spread" @tap.stop="goSpread(item)" src="../../../static/images/jtbz.png" mode="" class="checkItemImg"></image>
				<image v-else @tap.stop="goSpread(item)" src="../../../static/images/jtbz2.png" mode="" class="checkItemImg"></image> -->
				<view @tap.stop="checkedOne" v-show="item.spread">
					<u-checkbox class="checkDrop"
						@change="checkboxChangeItem()" 
						v-model="itembody.checked" 
						v-for="(itembody, i) in item.classList" :key="i" 
						:disabled="!itembody.optional"
						:name="item.grade"
					>
						{{itembody.aliasClassName ? itembody.aliasClassName : itembody.className}}
					</u-checkbox>
				</view>
			</u-checkbox>
			<!-- 		<u-checkbox 
						@change="checkboxChange" 
						v-model="item.checked" 
						v-for="(item, i) in list" :key="i" 
						:name="item.name"
					>{{item.name}}</u-checkbox> -->
		</view>
		<view class="dibu" @click="zhezhaoShow = true">
			<view class="textNum">
				{{$t('mine.mine.classConcat.readyChecked')}}{{newClassList.length}}{{$t('common.one')}}{{$t('common.classText')}}
			</view>
			<button type="primary" class="submit-btn" @click.stop="bandClass">{{$t('mine.mine.classConcat.enter')}} ({{newClassList.length}}/{{classCount}})</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import {getReq,postReq} from "../../../common/request.js";
	import {URL} from "../../../common/url.js";
	export default {
		data() {
			return {
				allList: [{name:this.$t('mine.mine.classConcat.allChoose'),checked: false}],
				allChecked: false,
				allDisabled: false,
			    list:[],
				newClass: [],
				newClassList: [],
				classCount: 0,
				zhezhaoShow: false,
				
				// 国际化
				teacherOldText: this.$t('common.teacherOld'),
				allChooseText: this.$t('common.allChoose'),
				showText: this.$t('mine.mine.classConcat.show')
			};
		},
		onShow() {
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('mine.mine.classManage.bindNewHelpClass')
			})
			this.getList()
		},
		computed:{
			...mapState(['xiaotiyunUser'])
		},
		created() {
		},
		methods: {
			...mapMutations(['setXiaotiyunUser']),
			nonezhezhao() {
				this.zhezhaoShow = false
			},
			// 选择后修改数据
			editState() {
				let classLists = []
				this.newClass = []
				this.newClassList = []
				for(let i = 0;i<this.list.length;i++) {
					classLists = classLists.concat(this.list[i].classList || [])
				}
				for(let j = 0;j<classLists.length;j++) {
					if(classLists[j].checked) {
						this.newClass.push(classLists[j].classId)
						this.newClassList.push(classLists[j])
					}
				}
				this.allChecked = this.newClassList.length == classLists.filter(item => {return item.optional}).length;
			},
			// 获取所有班级列表
			getList(){
				console.log(this.xiaotiyunUser)
				let _this = this;
				let params = {
					schoolId: _this.xiaotiyunUser.teacher.schoolId,
					teacherId: _this.xiaotiyunUser.teacher.teacherId,
				}
				getReq(URL.classAssistList,params).then(res => {
					if(res.error == 10000){
						if(res.data){
							this.list = res.data.map(function(item){
								return {
									...item,
									checked: false,
									// 是否展开
									spread: false,
									disabled: item.classList.filter(cla => {return cla.optional}).length == 0,
									classList: (item.classList || []).map(function(items){
										return {
											...items,
											checked: false
										}
									})
								}
							})
							this.allDisabled = this.list.filter(item => {return !item.disabled}).length == 0;
							//年级总班数
							this.classCount = 0
							for(let i = 0;i<this.list.length;i++) {
								this.classCount += this.list[i].classCount
							}
							// _this.school = res.data;
						}else{
							// _this.school = {
							// 	name: "",
							// };
							uni.showToast({
								icon: 'none',
								title: res.message,
								duration: 1000
							})
						}
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			},
			// 单个全选
			checkboxChange(e){
				// console.log(e.name.classList.some(someItem => { 
				// 	if(!someItem.teacherId){return false}
				// }))
				for(let i = 0;i<this.list.length;i++) {
					if(e.name == this.list[i].gradeName) {
						this.list[i].classList = (this.list[i].classList || []).map(function(item){
							return {
								...item,
								checked: !item.optional ? false : e.value,
							}
						})
					}
				}
				this.editState()
			},
			// 选单个
			checkboxChangeItem(e) {
				console.log(e,'啦啦啦')
				// this.list = this.list.map(function(item){
				// 	return {
				// 		...item,
				// 		// checked: e.value && item.grade == e.name ? e.value : item.checked
				// 		checked: function(){
				// 			let checkState
				// 			for(let i = 0;i<item.classList.length;i++) {
				// 				if (item.classList[i].teacherId) {
				// 					if(!item.classList[i].checked) {
				// 						checkState = false
				// 					} else {
				// 						checkState = true
				// 					}
				// 				}
				// 			}
				// 			console.log(item,33)
				// 			return checkState
				// 		}()
				// 	}
				// })
				let classLists = []
				this.newClass = []
				this.newClassList = []
				this.list.forEach(item => {
					classLists = classLists.concat(item.classList);
					item.checked = item.classList.filter(cla => {return cla.checked && cla.optional}).length == item.classList.filter(cla => {return cla.optional}).length;
				})
				this.newClassList = classLists.filter(item => {return item.checked});
				this.newClass = classLists.filter(item => item.checked).map(current => {return current.calssId});
				this.allChecked = this.newClassList.length == classLists.filter(item => {return item.optional}).length;
			},
			// 大全选
			checkboxChangeAll(e) {
				this.list = (this.list || []).map(function(item){
					return {
						...item,
						checked: e.value,
						classList: (item.classList || []).map(function(items){
							return {
								...items,
								checked: !items.optional ? false : e.value
							}
						})
					}
				})
				this.editState()
			},
			// 点击选单个
			checkedOne() {
				// console.log(1,'战灰')
				this.checkboxChangeItem()
				
			},
			// 移除已选班级
			yichuItem(value, index) {
				console.log(value, 555)
				this.list = (this.list || []).map(function(item){
					return {
						...item,
						// checked: e.value,
						classList: (item.classList || []).map(function(items){
							console.log(items.classId, value.classId, 4444)
							return {
								...items,
								checked: (items.classId == value.classId) ? false : items.checked,
							}
						})
					}
				})
				this.newClassList.splice(index, 1)
			},
			// 是否展开
			goSpread(value) {
				for(let i = 0;i<this.list.length;i++) {
					if(this.list[i].grade == value.grade) {
						this.list[i].spread = !this.list[i].spread
					}
				}
			},
			// 绑定班级
			bandClass() { 
				this.editState()
				if(this.newClass.length == 0){
					return uni.showToast({
						icon: 'none',
						title: '请选择班级',
						duration: 1000
					})
				}
				let params = {
					classIdList: this.newClass
				}
				postReq(URL.assistRelationClass,params).then(res => {
					if(res.error == 10000){
						uni.showToast({
							icon: 'success',
							title: "绑定成功",
							duration: 1000
						})
						let xiaotiyunUser = {
							teacher: {
								...this.xiaotiyunUser.teacher,
								bandClass: true
							}
						};
						// this.xiaotiyunUser.teacher.bindClass = true
						this.setXiaotiyunUser(xiaotiyunUser);
						uni.navigateBack({
							delta: 1
						})
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message,
							duration: 1000
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
.maxBox{
	width: 750upx;
	padding: 16upx 32upx 200upx;
	font-size: 28upx;
	box-sizing: border-box;
	.zhezhaoBox {
		width: 750upx;
		height: 704upx;
		z-index: 11000;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		bottom: 0;
		font-size: 32upx;
		.checkedTit {
			padding: 0 32upx;
			height: 104upx;
			line-height: 104upx;
			// width: 750upx;
			color: #707070;
		}
		.checkedItem {
			padding: 0 32upx;
			height: 88upx;
			line-height: 88upx;
			.yichu {
				width: 112upx;
				height: 48upx;
				background: #FFFFFF;
				border-radius: 8upx;
				border: 1upx solid #707070;
				text-align: center;
				line-height: 48upx;
				font-size: 24upx;
				float: right;
				margin-top: 20upx;
			}
		}
	}
	.checkAll {
		line-height: 88upx;
		height: 88upx;
		width: 686upx;
		border-bottom: 1upx solid #E6E6E6;
	}
	.checkItem {
		.checkDropBox {
			display: block;
			// min-height: 88upx;
			width: 686upx;
			border-bottom: 1upx solid #E6E6E6;
			text-align: left;
			line-height: 88upx;
			// padding-left: 44upx;
			// text-indent: 44upx;
			box-sizing: border-box;
			position: relative;
			::v-deep .u-checkbox__icon-wrap--checked{
				position: absolute;
				left: 0;
				top: 28upx;
			}
			::v-deep .u-checkbox__icon-wrap{
				position: absolute;
				left: 0;
				top: 28upx;
			}
			::v-deep .u-checkbox__label {
				margin-left: 54upx;
			}
			.checkItemClick {
				width: 130upx;
				height: 88upx;
				position: absolute;
				top: 0;
				right: 0;
				.checkItemText {
					position: absolute;
					top: 0upx;
					right: 64upx;
					width: 80upx;
					height: 88upx;
					line-height: 88upx;
					text-align: right;
				}
				.checkItemImg {
					width: 25upx;
					height: 24upx;
					position: absolute;
					top: 32upx;
					right: 32upx;
					// z-index: 9999;
				}
			}
			.checkDrop {
				display: block;
				height: 88upx;
				width: 686upx;
				border-bottom: 1upx solid #E6E6E6;
				text-align: left;
				line-height: 88upx;
				padding-left: 44upx;
				box-sizing: border-box;
				::v-deep .u-checkbox__icon-wrap--checked{
					position: static;
				}
				::v-deep .u-checkbox__icon-wrap{
					position: static;
				}
				::v-deep .u-checkbox__label {
					padding-left: 0;
					width: 510upx;
				}
			}
      .checkDrop:last-child{
        border-bottom: 0;
      }
		}
		// .checkDrop {
		// 	display: block;
		// 	height: 88upx;
		// 	width: 686upx;
		// 	border-bottom: 1upx solid #E6E6E6;
		// 	text-align: left;
		// 	line-height: 88upx;
		// 	padding-left: 44upx;
		// 	box-sizing: border-box;
		// }
	}
	.dibu {
		width: 750upx;
		height: 120upx;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #FFFFFF;
		margin-bottom: 30upx;
		z-index: 10000;
		.textNum {
			float: left;
			line-height: 120upx;
			margin-left: 32upx;
			font-size: 28upx;
			font-weight: 400;
			color: #707070;
		}
		.submit-btn {
			width: 376upx;
			height: 80upx;
			line-height: 80upx;
			background: #5C8FF7;
			border-radius: 44upx;
			float: right;
			margin-right: 32upx;
			margin-top: 20upx;
		}
	}
}
</style>
