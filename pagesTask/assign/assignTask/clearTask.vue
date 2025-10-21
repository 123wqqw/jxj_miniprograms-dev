<template>
  <view class="addHomeWork">
    <view class="addHomeWork-grade">
      <view class="grade-title">
        {{$t('task.assign.assignTask.arrangeClasses')}}
      </view>
      <view class="grade-list">
        <text class="grade-item" :class="{ 'mb' : classList.length > 3 }" v-for="(item, index) in classList"
          :key="index">
          {{ item.aliasClassName ? item.aliasClassName : item.className }}
        </text>
      </view>
      <view class="day-title">
        {{$t('task.assign.clearTask.setReleaseDate')}}(已选择{{assignDates.length}}天)
      </view>
      <view class="day-list">
        <block v-if="showDateList.length == 0">
          <text class="day-item"  :class="{ 'mb' : assignDates.length > 3 }" v-for="(item, index) in assignDates"
          :key="index">
          {{item}}
          <text class="day-icon"></text>
        </text>
        </block>
         <block v-else>
            <text class="day-item"  :class="{ 'mb' : showDateList.length > 3 }" v-for="(item, index) in showDateList"
          :key="index">
          {{item.length > 1 ? item[0]+ '至' + item[item.length-1] : item[0]}}
          <text class="day-icon"></text>
        </text>
         </block>
        <image @click="openSelectDate()" class="date-add" src="../../../static/images/date-add.png" mode="aspectFit">
        </image>
      </view>
    </view>
    <view class="btn-box-content">
      <view class="btn-content">
        <view class="action-btn action-btn-big" :class="{ 'ash' : classList.length == 0 || assignDates.length == 0 }" @click="showModal"> {{$t('task.assign.clearTask.clearTaskBtn')}}</view>
      </view>
    </view>
    <!-- 日历弹窗 -->
    <u-popup v-model="showDatePop" mode="bottom" length="632rpx">
      <xWeekDateCalendar ref="arrangepicker" :onlyMonth="true" @selected-change="datechange" @days-change="daysChange"
        :calendarStateList="calendarStateList" :checkedDateList="assignDates" @deselect="deselect" @selectList-show="showDateListChange"></xWeekDateCalendar>
    </u-popup>
    <u-modal show-cancel-button  :show-title="false"  v-model="modalShow" :content="modalContent" @confirm="deleteTask"></u-modal>
  </view>
</template>

<script>
  import {
    mapState,
  } from 'vuex'
  import {
    getReq,
    postReq
  } from "../../../common/request.js";
  import {
    URL
  } from "../../../common/url.js";
  import xWeekDateCalendar from "../../components/x-week-date-calendar/x-week-date-calendar3.vue";
  export default {
    components: {
      xWeekDateCalendar
    },
    data() {
      return {
        classList: [],
        canToday: false,
        replace: false,
        chooseDate: "",
        assignDates: [],
        selectDateList: [],
        showDatePop: false,
        modalShow: false,
        modalContent: "",
        calendarStateList: [],
        showDateList: [],
        hasStudentContent: this.$t('task.assign.clearTask.hasStudentContent'),
        noStudentContent: this.$t('task.assign.clearTask.noStudentContent'),
        pleaseSelectCorrectDate: this.$t('task.assign.assignTask.pleaseSelectCorrectDate'),
        deleteTaskSuccess: this.$t('task.assign.index.deleteTaskSuccess'),
        pleaseCheckTaskDateWarning: this.$t('task.assign.assignTask.pleaseCheckTaskDateWarning'),
      };
    },
    watch: {
      
    },
    onLoad(options) {
      let _this = this;

      uni.setNavigationBarTitle({
        title: this.$t('task.assign.clearTask.title')
      })
      const eventChannel = _this.getOpenerEventChannel()
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log('data===============>',data);
        _this.classList = data.classList;
        // _this.assignDates = data.assignDates;
        _this.dateTime = data.dateTime
        _this.assignDates.push(data.dateTime);
      })
      // _this.selectDateList.push(_this.canToday);
      //postDateObj
    },
    onShow() { },
    computed: {
      ...mapState(['xiaotiyunUser'])
    },
    methods: {
      datechange(e) {
        console.log(e, 33)
       
       let newList = e.map( item =>  {return new Date(item).getTime()});
       newList.sort();
       newList = newList.map( item => { return this.formatDate(new Date(item)) })
       console.log('newList ==================>',newList);
       
       this.assignDates = newList;
        this.showDatePop = false;
      },
      daysChange(e) {
        console.log('daysChange===============>', e);
        this.postDateObj(e);
      },
      postDateObj(e) {
      	let params = {
      		teacherId: this.xiaotiyunUser.teacher.teacherId,
      		beginDate: this.formatDate(e.start),
      		endDate: this.formatDate(e.end)
      	}
      	postReq(URL.taskPublishCalendar,params).then(res => {
      		// console.log(res);
      		if(res.error == 10000){
      			// console.log(res.data)
      			this.calendarStateList = res.data
      		}
      	})
      },
      formatDate(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        return year + "-" + this.formatNumber(month) + "-" + this.formatNumber(date);
      },
      formatNumber(n){
      	n = n.toString()
      	return n[1] ? n : '0' + n
      },
      openSelectDate() {
        this.showDatePop = true;
      },
      hasSelectDate(date){
        let hasDate =  this.assignDates.findIndex(item => item == date );
        if(hasDate != -1) {
          uni.showToast({
            icon: 'none',
            title: this.pleaseSelectCorrectDate,
            duration: 1000,
          })
        }else{
          let bigDate = this.assignDates.findIndex(item => new Date(item).getTime() >= new Date(date).getTime());
          console.log('bigDate',bigDate);
          if(bigDate == -1){
            this.assignDates.push(date);
          }else{
            this.assignDates.splice(bigDate, 0, date)
          }
        }
        this.showDatePop = false;
      },
      // 打开弹窗
      showModal(){
        if(this.assignDates.length == 0 ){
          uni.showToast({
          	icon: 'none',
          	title: this.pleaseCheckTaskDateWarning,
          	duration: 1000,
          })
          return;
        }
        const today = new Date();
        let lastTime = this.assignDates.findIndex(item => (new Date(item).getTime()) < (new Date(this.formatDate(today)).getTime()) )
        if(lastTime != -1 ){
          uni.showToast({
          	icon: 'none',
          	title: this.pleaseCheckTaskDateWarning,
          	duration: 1000,
          })
          return;
        }
        let classIds = this.classList.map(item => {
          return item.classId;
        })
        
        let dateTimeList = [];
        dateTimeList.push(this.formatDate(today))
        let idx = this.assignDates.findIndex(item => item == this.formatDate(today) );
        if(idx == -1 ){
          this.modalContent = this.noStudentContent;
          this.modalShow = true;
          return;
        } else {
          let params = {
            classIds,
            dateTimeList
          }
          postReq(URL.hasStudentClock,params).then(res => {
          	if(res.error == 10000){
              console.log(res.data.status);
          		this.modalContent = res.data.status == 0 ? this.noStudentContent : this.hasStudentContent ;
              this.modalShow = true;
          	}
          })
        }

      },
      // 清空作业
      deleteTask(){
       
      	let _this = this;
      	let params = {
      		// teacherId: _this.teacherId,
      		dateTimeList: _this.assignDates,
      		classIds: _this.classList.map(some => some.classId)
      	}
      	postReq(URL.cleanupTask,params).then(res => {
      		if(res.error == 10000){
      			uni.showToast({
      				icon: 'success',
      				title: _this.deleteTaskSuccess,
      				duration: 1000,
              complete() {
                uni.navigateBack()
              }
      			})
            
      		}
      	})
      },
      deselect(){
        this.showDatePop = false;
      },
      showDateListChange(e){
        // e.map(item => {
          // console.log('单个元素====》',item);
        // })
        this.showDateList = e;
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

    .addHomeWork-grade {
      position: relative;
      width: 100%;
      margin: 16upx 0;
      background: #fff;
      padding: 16upx 24upx;

      .grade-title {
        font-size: 32upx;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 45upx;
        color: #202020;
        margin-bottom: 16upx;
      }

      .grade-list {
        padding-bottom: 16upx;
        border-bottom: 1upx solid #e6e6e6;

        .grade-item {
          font-size: 28upx;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 40upx;
          color: #202020;
          margin-right: 32upx;
          display: inline-block;

          &.mb {
            margin-bottom: 32upx;
          }
        }
      }

      .day-title {
        font-size: 32upx;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 45upx;
        color: #202020;
        margin: 16upx 0;
      }

      .day-list {
        overflow: hidden;

        .day-item {
          padding-left: 20upx;
          padding-right: 8upx;
          background: rgba(92, 143, 247, 0.14);
          position: relative;
          font-size: 28upx;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40upx;
          color: #202020;
          margin-right: 24upx;
          margin-bottom: 24upx;
          display: inline-block;

          .day-icon {
            position: absolute;
            width: 4upx;
            height: 18upx;
            border-radius: 4upx;
            left: 8upx;
            top: 11upx;
            background-color: #5C8FF7;
          }
        }

        .date-add {
          width: 40upx;
          height: 40upx;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    
    .btn-box-content {
      background-color: #FFFFFF;
      box-shadow: 0px -2upx 8upx 0px rgba(0, 0, 0, 0.08);
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: env(safe-area-inset-bottom);
      width: 100%;
      
      .btn-content {
        width: 100%;
        height: 88upx;
        padding: 32upx 0;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: content-box;
        
        .action-btn{
          height: 88upx;
          background: #5C8FF7;
          border: none;
          border-radius: 44upx;
          font-size: 32upx;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 88upx;
          text-align: center;
          width: 638rpx;
          margin: 0 auto;
        }
      }
    }
  }
</style>
