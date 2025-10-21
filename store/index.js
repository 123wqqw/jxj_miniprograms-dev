import Vue from 'vue'

// #ifndef VUE3
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		userInfo: "",
		xiaotiyunUser: "",
		schoolInfo: "",
		commentModelList: [],
		openid: null,
		userid: null,
		tabBar: [],
		isHant: false, // 是否繁体
		aiSportSetting: {
			jumpjack: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			},
			jumprope: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			},
			pushup: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			},
			situp: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			}
		},
		statusBarHeight: "",
		schemeId: "", // 方案ID
		resetCourseware: false, // 是否重新生成课件
		replacement: null, // 替换项目
	},
	mutations: {
		login(state, userInfo) {
			state.userInfo = userInfo;
		},
		logout(state) {
			state.userInfo = "";
			state.openid = null;
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setUserid(state, userid) {
			state.userid = userid
		},
		setXiaotiyunUser(state, xiaotiyunUser) {
			uni.setStorageSync("xiaotiyunUser", xiaotiyunUser);
			state.xiaotiyunUser = xiaotiyunUser
		},
		setSchoolInfo(state, schoolInfo) {
			state.schoolInfo = schoolInfo
		},
		setCommentModelList(state, commentModelList) {
			uni.setStorageSync("commentModelList", commentModelList);
			state.commentModelList = commentModelList
		},
		setAISportSetting(state, aiSportSetting) {
			// uni.setStorageSync("aiSportSetting",aiSportSetting);
			state.aiSportSetting = aiSportSetting;
		},
		setIsHant(state, isHant) {
			uni.setStorageSync("isHant", isHant);
			state.isHant = isHant;
		},
		setTeacherTabBar(state) {
			state.tabBar = [{
					iconPath: "/static/images/tabBar/teacher-home.png",
					selectedIconPath: "/static/images/tabBar/teacher-home-active.png",
					text: '校体云',
					customIcon: false,
					pagePath: "/pages/home/index/index",
				},
				// {
				// 	iconPath: "../../../static/images/teacher-data-center.png",
				// 	selectedIconPath: "../../../static/images/teacher-data-center-active.png",
				// 	text: '数据中心',
				// 	customIcon: false,
				// 	pagePath: "/pages/statistics/index/index",
				// },
				{
					iconPath: "/static/images/tabBar/teacher-mine.png",
					selectedIconPath: "/static/images/tabBar/teacher-mine-active.png",
					text: '我',
					customIcon: false,
					pagePath: "/pages/mine/index/index",
				}
			]
		},
		setSchemeId(state, schemeId) {
			state.schemeId = schemeId;
		},
		setResetCourseware(state, resetCourseware) {
			state.resetCourseware = resetCourseware;
		},
		setReplacement(state, replacement) {
			state.replacement = replacement;
		},
	},
	getters: {

	},
	actions: {

	}
})
// #endif

// #ifdef VUE3
import {
	createStore
} from 'vuex'
const store = createStore({
	state: {
		userInfo: "",
		xiaotiyunUser: "",
		schoolInfo: "",
		commentModelList: [],
		openid: null,
		userid: null,
		tabBar: [],
		aiSportSetting: {
			jumpjack: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			},
			jumprope: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			},
			pushup: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			},
			situp: {
				calculateType: 1,
				num: 60000,
				unit: "分钟",
				label: "1",
			}
		},
		statusBarHeight: ""
	},
	mutations: {
		login(state, userInfo) {
			state.userInfo = userInfo;
		},
		logout(state) {
			state.userInfo = "";
			state.openid = null;
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setUserid(state, userid) {
			state.userid = userid
		},
		setSchoolInfo(state, schoolInfo) {
			state.schoolInfo = schoolInfo
		},
		setCommentModelList(state, commentModelList) {
			uni.setStorageSync("commentModelList", commentModelList);
			state.commentModelList = commentModelList
		},
		setAISportSetting(state, aiSportSetting) {
			// uni.setStorageSync("aiSportSetting",aiSportSetting);
			state.aiSportSetting = aiSportSetting;
		},
		setTeacherTabBar(state) {
			state.tabBar = [{
					iconPath: "../../../static/images/tabBar/teacher-home.png",
					selectedIconPath: "../../../static/images/tabBar/teacher-home-active.png",
					text: '首页',
					customIcon: false,
					pagePath: "/pages/home/index/index",
				},
				// {
				// 	iconPath: "../../../static/images/teacher-data-center.png",
				// 	selectedIconPath: "../../../static/images/teacher-data-center-active.png",
				// 	text: '数据中心',
				// 	customIcon: false,
				// 	pagePath: "/pages/statistics/index/index",
				// },
				{
					iconPath: "../../../static/images/tabBar/teacher-mine.png",
					selectedIconPath: "../../../static/images/tabBar/teacher-mine-active.png",
					text: '我的',
					customIcon: false,
					pagePath: "/pages/mine/index/index",
				}
			]
		},
	},
	getters: {

	},
	actions: {

	}
})
// #endif
export default store
