const URL = {
	/**
	 * 验证码相关
	 */
	// 发送验证码
	getVerifyCode: "/xty-basic/app-api/sms/v1/tool/sendCode",
	userCenterGetVerifyCode: "/xty-usercenter/app-api/sms/v1/tool/sendCode",
	/**
	 * 用户登录相关
	 */
	// 获取微信openId
	getWxUserInfo: "/miniprogram/v1/user/authStudentParentOpenId", // 失效
	getWxUserInfoV2: "/miniprogram/v2/user/authWechatOpenId", // 失效
	userCenterGetWxUserInfo: "/xty-usercenter/app-api/login/v41100/login",
	// 获取支付宝userId
	getAliUserInfoV2: "/miniprogram/v2/user/authAlipayUserId", // 失效
	// 绑定学生
	bandStudent: "/miniprogram/v1/user/bandStudent", // 失效
	// 家长端绑定后登录
	studentParentLogin: "/miniprogram/v1/user/studentParentLogin", // 失效
	// 教师端绑定唯一ID,家长端下一步
	phoneLogin: "/miniprogram/v2/user/phoneLogin", // 失效
	userCenterPhoneLogin: "/user/login/v1/user/phoneLogin", // 失效
	// 绑定学生之后登录 - 该小程序第一次使用
	bindStudentAndLogin: "/miniprogram/v2/user/bindStudentAndLogin", // 失效
	userCenterBindStudentAndLogin: "/user/login/v1/bindStudentAndLogin", // 失效
	// 切换角色
	changeUser: "/miniprogram/v2/user/changeUser", // 失效
	userCenterChangeUser: "/user/login/v1/user/changeUser", // 失效
	/**
	 * 个人中心
	 */
	// 添加学生
	addBandStudent: "/miniprogram/v1/studentparent/bandStudent", // 失效
	userCenterAddBandStudent: "/app/v1/mine/bind/add", // 失效
	// 解绑学生
	unBandStudent: "/miniprogram/v1/studentparent/unbandStudent", // 失效
	// 切换学生
	userCenterChangeStudent: "/user/login/v1/user/changeStudent", // 失效
	// 消息列表
	getMessageList: "/miniprogram/v1/message/getMessage", // 失效
	// 消息列表
	getMessageListV2: "/app/v2/message/getMessage", // 失效
	// 打卡记录
	studentClockRecord: "/miniprogram/v1/sportclock/studentClockRecord", // 失效
	// 消息回复
	replyMessage: "/miniprogram/v1/message/replyMessage", // 失效

	// 设置班级打卡日期
	batchSettingSportClockDate: "/miniprogram/v1/teachers/batchSettingSportClockDate", // 失效
	// 设置班级补卡设置
	batchSettingClockCompensate: "/miniprogram/v1/teachers/batchSettingClockCompensate", // 失效
	// 设置补卡
	batchSettingCompensate: "/xty-task/app-api/task/v1/compensate/batchSetting",
	// 班级id获取补卡设置
	getClockCompensate: '/xty-basic/app-api/teacher/v1/getClockCompensate',
	// 我的数据 -- 家长端
	getStudentParentMineIndex: "/app/v1/mine/index", // 失效
	// 我的设置页面 -- 家长端
	getStudentParentMineSetting: "/app/v1/mine/setting", // 失效
	userCenterGetStudentParentMineSetting: "/app/v1/mine/setting", // 失效
	// 获取学生信息
	getMineStudentInfo: "/app/v1/mine/info/student", // 失效
	userCenterGetMineStudentInfo: "/app/v1/mine/info/student", // 失效
	// 解绑学生 -- 新版
	unBandStudentApp: "/app/v1/mine/bind/delete", // 失效
	userCenterUnBandStudentApp: "/app/v1/mine/bind/delete", // 失效
	// 更换头像
	changeAvatar: "/app/v1/mine/avatar/change", // 失效
	userCenterChangeAvatar: "/app/v1/mine/avatar/change", // 失效
	// 更换绑定手机号
	changeBindPhone: "/app/v1/mine/phone/change", // 失效
	userCenterChangeBindPhone: "/app/v1/mine/phone/change", // 失效
	/**
	 * 首页
	 */
	/* ghy首页 */
	getStudentInfo: '/app/homepage/v1/studentInfo', //获取学生信息
	getUnreadMessageCount: '/app/v2/message/getUnreadMessageCount', //获取未读消息数量
	getTaskInfo: '/app/homepage/v1/taskInfo', //获取今日作业-改善方案
	getRankInfo: '/app/v1/clock/rankInfo', //获取获取排名-排行榜
	getCookList: '/miniprogram/v1/cook/list', //首页刷新食谱
	getCookListCount: '/miniprogram/v1/cook/count', //食谱刷新次数
	getPhysicalComment: '/app/homepage/v1/physical/comment', //获取体质风险结果
	getCookSearch: '/miniprogram/v1/cook/search', //搜索食物
	getCookDetails: '/miniprogram/v1/cook/food', //食物详情
	getBubbleList: '/miniprogram/v1/bubble/list', //点击气泡  
	getHomeSport: '/miniprogram/v1/ai/sports/list', //AI动作更多
	/* ai运动数据 */
	getClassStatisticsList: '/xty-task/app-api/task/statistics/v1/exercise/classStatistics', //班级列表统计
	getClassBasicCount: '/xty-task/app-api/task/statistics/v1/exercise/classBasicCount', //班级详情-班级基本信息
	getClassDetailsCount: '/xty-task/app-api/task/statistics/v1/exercise/classDetailsCount', //班级详情-班级详情统计
	exportStudentExerciseInfo: '/xty-task/app-api/task/statistics/v1/exercise/exportStudentExerciseInfo', //班级详情-学生列表导出
	studentInfo: '/xty-basic/app-api/student/v1/studentInfo', //学生详情-学生基本信息
	getStudentDetailsCount: '/xty-task/app-api/task/statistics/v1/exercise/studentDetailsCount', //学生详情-学生详情统计
	/* 体质数据 */
	getClassAvgScoreByTeacher: '/xty-physical/app-api/v2/physical/statistics/getClassAvgScoreByTeacher', //班级列表
	physicalClassInfo: '/xty-basic/app-api/classes/v1/count/info', //班级基本统计
	physicalGetClassDetails: '/xty-physical/app-api/v1/physical/statistics/getClassDetails', //班级详情统计
	tzStudentExport: '/xty-physical/app-api/v1/physical/statistics/exportStudentScore', //体制导出
	/* 体测数据 */
	getPhysicals: '/xty-physical/app-api/physical/data/v1/physicals', //获取体测下拉框
	physicalsClassList: '/xty-physical/app-api/physical/data/v2/classDataList', //体测数据班级列表
	physicalsClassCount: '/xty-physical/app-api/physical/data/v1/classCount', //体测数据班级列表
	getPhysicalClassDetails: '/xty-physical/app-api/physical/data/v1/classDetails', //体测数据班级详情
	tcStudentExport: '/xty-physical/app-api/physical/data/v1/export', //体测导出
	/* end首页 */


	// 获取家长端首页数据
	getStudentParentIndexData: "/miniprogram/v1/physical/getIndexData", // 失效
	// 获取测试项目列表
	getTestNameList: "/miniprogram/v1/physical/getTestNameList", // 失效
	// 获取自测成绩
	getSelfTestCourseDetailScore: "/miniprogram/v1/physical/getSelfTestCourseDetailScore", // 失效
	// 新增或修改自测成绩
	addOrEditSelfTestValue: "/miniprogram/v1/physical/addOrEditSelfTestValue", // 失效
	// 获取体质排行
	getPhysicalFitnessRank: "/miniprogram/v2/physical/getPhysicalFitnessRank", // 失效
	// 教师端-获取打卡统计
	clockStatistics: "/miniprogram/v1/sportclock/clockStatistics", // 失效
	// 获取打卡记录 - 当日详情（教师端首页）
	clockDetailsToday: "/miniprogram/v1/sportclock/clockDetailsToday", // 失效
	// 教师提醒
	remindMessage: "/miniprogram/v1/message/remindMessage", // 失效

	// 获取每日批改作业日历状态
	correctCalendar: "/miniprogram/v1/task/correctCalendar", // 失效
	// 打卡情况统计
	clockSituation: "/miniprogram/v1/task/clockSituation", // 失效
	// 打卡情况统计详情
	clockSituationDetails: "/miniprogram/v1/task/clockSituationDetails", // 未找到
	// 打卡提醒
	clockRemind: "/miniprogram/v1/task/clockRemind", // 未找到
	clockRemindV2: "/xty-task/app-api/task/v1/clockRemind",
	// 待批改/已批改列表
	taskCorrect: "/miniprogram/v1/task/correct", // 未找到
	// 各批阅状态人数统计
	clockCorrectCount: "/miniprogram/v1/task/clockCorrectCount", // 未找到
	// 各打卡状态人数统计
	clockStatusCount: "/miniprogram/v1/task/clockStatusCount", // 未找到
	// 作业批阅/教师点评
	reviewTask: "/miniprogram/v1/task/review", // 失效
	// 打卡详情
	taskClockDetails: "/xty-task/app-api/task/v2/clockDetails",

	// 批改作业总览
	taskClockStatistics: "/xty-task/app-api/task/statistics/v1/info",
	// 批改作业班级统计
	classClockStatistics: "/xty-task/app-api/task/statistics/v1/class/info",
	// 批量批改作业学生列表
	taskReviews: "/xty-task/app-api/task/v1/reviews",
	// 批量批改或点评
	taskReviewV2: "/xty-task/app-api/task/v1/review",
	// 导出批改作业数据
	exportTaskData: "/xty-task/app-api/task/statistics/v1/export",
	// 批量批改详情
	taskCorrectDetails: "/xty-task/app-api/task/v2/correctDetails",

	/**
	 * 处方完成情况
	 */
	// 总览
	schemeClockStatistics: "/miniprogram/v1/sportclock/clockStatistics", // 未找到
	// 班级统计
	schemeClassClockStatistics: "/miniprogram/v1/sportclock/classClockStatistics", // 未找到
	// 学生处方详情
	schemeStudentDetail: "/miniprogram/v1/sportclock/schemeInfo", // 未找到

	// 作业布置日历
	taskPublishCalendar: "/xty-task/app-api/task/v1/calendar",
	// 布置作业班级列表
	assignInfo: "/xty-task/app-api/task/v1/assignInfo",
	// 布置作业
	assignTask: "/xty-task/app-api/task/v1/assign",
	// 清空作业布置
	cleanupTask: "/xty-task/app-api/task/v1/cleanup",
	// 作业详情
	assignDetails: "/xty-task/app-api/task/v2/assignDetails",
	// 已布置作业编辑
	assignTaskEdit: "/xty-task/app-api/task/v1/assignEdit",
	// 单个作业撤回
	taskRevoke: "/xty-task/app-api/task/v1/revoke",
	//选择AI动作项目列表
	aiInfo: "/xty-task/app-api/task/v1/aiTaskInfo",
	// 检查是否有学生提交当天作业
	hasStudentClock: "/xty-task/app-api/task/v1/hasStudentClock",
	/**
	 * 处方
	 */
	// 初始化 或 修改打卡日期设置 生成周期性处方
	generateSchemeByStudent: "/miniprogram/v1/scheme/generateScheme",
	// 每日打卡数据
	getDailyClock: "/miniprogram/v1/sportclock/dailyClock",
	// 获取今日打卡数据
	dailyClockToday: "/miniprogram/v1/sportclock/dailyClockToday",
	// 获取单个学生某个时间段的打卡情况
	clockRecordStudent: "/miniprogram/v1/sportclock/clockRecordStudent",
	// 日历
	clockCalendar: "/app/v2/clock/calendar",
	// 打卡作业查询
	taskInfoByDate: "/app/v1/clock/taskinfo",
	taskInfoByDateV2: "/app/v2/clock/taskinfo",
	taskInfoByDateV3: "/app/v3/clock/taskinfo",
	// 作业详情
	getTaskDetailInfo: "/app/v1/clock/taskdetailsinfo",
	// 历史作业详情
	getTaskdetailsHistoryinfo: "/app/v1/clock/taskdetailsHistoryinfo",
	// 打卡数据 - 按日期查找
	getClockByDate: "/miniprogram/v1/sportclock/getClockByDate",
	// 请假
	askLeaveSchemeInfo: "/miniprogram/v1/sportclock/askLeaveSchemeInfo",
	// 当天请假
	askLeaveSchemeInfoV2: "/miniprogram/v2/sportclock/askLeaveSchemeInfo",
	// 按天请假
	clockAskleave: "/app/v1/clock/askleave",
	// 打卡
	clockSchemeInfo: "/miniprogram/v1/sportclock/clockSchemeInfo",
	// 打卡 -- 随堂作业和系统方案
	clockTaskInfo: "/app/v2/clock/clock",
	//查询是否开启视频打卡
	isopenclock: "/app/v2/clock/isopenclock",
	// 打卡记录
	getClockRecord: "/miniprogram/v1/sportclock/getClockRecord",
	// 图文教学
	clockGraphic: "/app/v1/clock/graphic",
	/**
	 * 文章相关
	 */
	// 文章列表
	getArticleList: "/miniprogram/v1/article/getArticleList",
	// banner
	getBannerList: "/xty-other/app-api/banner/v1/list",
	/**
	 * AI相关
	 */
	// 获取AI动作详情
	getAISportDetail: "/miniprogram/v1/ai/getDetailActionInfo",
	// 获取AI动作详情V2
	getAISportDetailV2: "/miniprogram/v1/ai/sports/sportDetail",
	// 获取AI锻炼记录列表
	getRecordInfoList: "/miniprogram/v1/ai/getRecordInfoList",
	// 获取AI锻炼记录详情 
	getDetailRecordInfo: "/miniprogram/v1/ai/getDetailRecordInfo",
	// 获取AI运动详情
	getDetailActionInfo: "/miniprogram/v1/ai/getDetailActionInfo",
	// 上传AI锻炼记录
	uploadRecord: "/miniprogram/v1/ai/uploadRecord",
	/**
	 * common 工具类接口
	 */
	fileUpload: "/file/v1/upload",
	// 教师管理班级
	classManage: "/xty-basic/app-api/classes/v1/manage/class",
	// 获取学校信息
	getSchoolInfoById: "/xty-basic/app-api/school/v1/info",

	/**
	 * 数据中心
	 */
	// 概览
	schoolDimension: "/miniprogram/v1/school/dimension",
	// 体测项目
	totalStatisticDetail: "/miniprogram/v1/statisticDetail/total",
	// 教师管理班级成绩
	teacherDimension: "/miniprogram/v1/teacher/dimension",

	// 根据区域ID获取域名
	userCenterGetDomain: "/xty-usercenter/app-api/login/v1/getDomain",
	// 区域选择
	userCenterGetAreaList: "/xty-usercenter/app-api/area/childes/list",
	userCenterGetAreaListAll: "/area/list", // 失效
	//根据区域获取学校
	userCenterGetAllSchool: "/school/getAllSchool", // 失效
	//教师登录
	userCenterTeacherLogin: "/user/login/v1/teacherLogin", // 失效
	//教师设置新密码
	userCenterSetNewPassword: "/xty-basic/app-api/teacher/v1/setNewPassword",
	// 更换手机号
	teachersUpdatePhone: "/xty-basic/app-api/teacher/v1/updatePhone",
	// 首次登录绑定手机号
	teachersBandPhone: "/xty-basic/app-api/teacher/v1/bandPhone",
	// 更换密码
	teachersUpdatePassword: "/xty-basic/app-api/teacher/v1/updatePassword",
	// 更换教师密码
	teachersChangePsw: "/xty-basic/app-api/teacher/v1/changePsw",
	// 更换教师密码V2
	teachersChangePswV2: "/xty-basic/app-api/teacher/v1/changePswV2",
	// 是否教师
	userCenterIsTeacher: "/app/v1/mine/isTeacher", // 失效
	// 关联班级列表
	glClassList: "/xty-basic/app-api/classes/v1/list",
	// 绑定新班级
	relationClass: "/xty-basic/app-api/classes/v1/relationClass",
	// 协管班级列表
	classAssistList: "/xty-basic/app-api/classes/v1/assist/list",
	// 添加协管的班级
	assistRelationClass: "/xty-basic/app-api/classes/v1/assist/relationClass",
	// 更改教师信息
	teachersUpdateInfo: "/xty-basic/app-api/teacher/v1/updateInfo",

	// 注销微信绑定
	userCenterLogoutWechat: "/xty-usercenter/app-api/login/teacher/v1/logout",

	// 作业报告概览
	reportOverview: "/xty-task/app-api/task/report/v1/overview",
	// 导出作业报告
	reportExport: "/xty-task/app-api/task/report/v1/export",
	// 查询学期数据
	semesterList: "/xty-run/app-api/semester/setting/v1/list",
	// 跑步统计 - 基本数据
	runStatsInfo: "/xty-run/app-api/run/statistics/v1/info",
	// 跑步统计 - 折线图数据
	runStatsTrend: "/xty-run/app-api/run/statistics/v1/trend",
	// 跑步统计 - 班级列表数据
	runStatsClassInfo: "/xty-run/app-api/run/statistics/v1/classInfo",
	// 跑步统计 - 学生列表数据
	runStatsStudentInfo: "/xty-run/app-api/run/statistics/v1/studentInfo",
	//  跑步明细 - 运动记录分页
	runRecordPage: "/xty-run/app-api/run/record/v1/teacher/page",
	//  跑步明细 - 跑步记录详情
	runRecordInfo: "/xty-run/app-api/run/record/v1/info/miniProgram",
	//  跑步明细 - 修改跑步记录状态
	runRecordUpdateStatus: "/xty-run/app-api/run/record/v1/teacher/updateStatus",
	//  查看学校跑步系统开关状态
	schoolSportCenter: "/xty-basic/app-api/school/v1/tools/selectRunOpen",
	// 老师的班级列表(包含课件)
	apiGetCoursewareClass: "/xty-task/app-api/courseware/v1/getClass",
	// 班级体测记录总览
	apiGetPhysicalClassReportTop: "/xty-physical/app-api/physical/class/report/v1/top",
	// 班级体测记录
	apiGetPhysicalClassReportInfo: "/xty-physical/app-api/physical/class/report/v1/info",
	// 班级体测报告体质六维图数据
	apiGetClassPhysiqueInfo: "/xty-physical/app-api/physical/class/report/v1/physique/info",
	apiGetClassPhysiqueRankInfo: "/xty-physical/app-api/physical/class/report/v1/physique/rankInfo",
	apiGetPhysicalClassReportList: "/xty-physical/app-api/physical/class/report/v1/list",
	// 学生体测报告
	// 体测报告基本数据
	apiGetStudentPhysicalBasicInfo: "/xty-physical/app-api/physical/report/v1/info",
	// 体测报告基本数据
	apiGetStudentPhysicalReportinfo: "/xty-physical/app-api/physical/report/v1/physical/info",
	// 体测报告体质六维图数据
	apiGetStudentPhysiqueinfo: "/xty-physical/app-api/physical/report/v1/physique/info",
	// 体测报告体质变化趋势数据
	apiGetStudentPhysiquetrendInfo: "/xty-physical/app-api/physical/report/v1/physique/trendInfo",
	// 体测报告体质排名数据
	apiGetStudentPhysiqueRankInfo: "/xty-physical/app-api/physical/report/v1/physique/rankInfo",
	// 体质总体评价
	apiGetStudentPhysiqueEvaluation: "/xty-physical/app-api/physical/report/v1/physique/evaluation",
	// 保存或编辑班级的课件信息
	apiPostCoursewareOperation: "/xty-task/app-api/courseware/v1/saveOrEdit",
	// 查询方案运动信息，(课程的默认的运动信息)
	apiPostCoursewareInfo: "/xty-task/app-api/courseware/v1/sport/info",
	// 查看班级的课件信息
	apiGetCoursewareInfo: "/xty-task/app-api/courseware/v1/info",
	// 获取适合这个年级的课程信息
	apiGetCoursewareCourseInfo: "/xty-task/app-api/courseware/v1/course/info",
	// 查询课件运动方案信息，(传入天数则按天数查询),不传入则查询全部天数信息
	apiGetCoursewareSportDays: "/xty-task/app-api/courseware/v1/sport/days",
	// Ai任务运动分类列表
	apiGetSportSelect: "/xty-task/app-api/sport/v3/select/list",
	// 删除课件信息
	apiGetCoursewareDelete: "/xty-task/app-api/courseware/v1/delete",
	// 模板作业 - 保存
	apiPostTemplateSave: "/xty-task/app-api/task/template/v1/save",
	// 模板作业 - 布置
	apiPostTemplateAssign: "/xty-task/app-api/task/v1/template/assign",
	// 模板作业 - 列表
	apiGetTemplateList: "/xty-task/app-api/task/template/v1/list",
	// 模板作业 - 删除
	apiPostTemplateDelete: "/xty-task/app-api/task/template/v1/delete",
	// 模板作业 - 详情
	apiPostTemplateInfo: "/xty-task/app-api/task/template/v1/info",
	// 获取体质纬度列表
	apiGetDimensionList: "/xty-physical/app-api/sport/v1/dimension/list",
	// 课程作业 - 布置
	apiPostCourseAssign: "/xty-task/app-api/task/v2/course/assign",
	// 布置作业V2
	apiPostTaskAssign: "/xty-task/app-api/task/v2/assign",
	// 已布置作业编辑V2
	apiPostTaskAssignEdit: "/xty-task/app-api/task/2/assignEdit",
	// 获取作业默认难度
	apiGetDifficulty: "/xty-task/app-api/task/v1/getDifficulty",
	// 根据id获取运动
	apiGetSportDetail: "/xty-task/app-api/sport/v1/getAiSport",
	// 根据班级id获取请假审批设置
	apiGetLeaveApproval: "/xty-basic/app-api/teacher/v1/getLeaveApproval",
	// 根据班级id批量设置请假审批
	apiPostLeaveApprovalBatch: "/xty-basic/app-api/teacher/v1/leaveApproval/batchSetting",
	// 未审批请假通知数量
	apiGetNoticeCount: "/xty-task/app-api/askleave/approval/v1/notice/count",
	// 请假通知审批列表
	apiGetApprovalList: "/xty-task/app-api/askleave/approval/v1/list",
	// 请假审批详情
	apiGetApprovalInfo: "/xty-task/app-api/askleave/approval/v1/info",
	// 审批
	apiPostApproval: "/xty-task/app-api/askleave/approval/v1/approval",


	/**
	 * **************** *
	 * pages 主页相关接口 *
	 * **************** *
	 */

	/**
	 * 首頁
	 */
	//
	// 获取教师信息
	getTeacherInfo: "/xty-basic/app-api/teacher/v1/current/info",

	/**
	 * 登录
	 */
	// 验证教师账号
	apiPostTeachersCheckAccount: "/xty-usercenter/app-api/login/teacher/v41100/bind",
	// 学生账号密码登录
	apiPostStudentPasswordLogin: "/xty-usercenter/app-api/login/v202/passwordLogin",


	/**
	 * ********************** *
	 * pagesCenter 运动相关接口 *
	 * ********************** *
	 */

	/**
	 * 随堂训练
	 */
	// 随堂训练列表
	apiGetClassTrainingList: "/xty-other/app-api/class/test/v250/list",
	// 随堂训练详情
	apiGetClassTrainingDetail: "/xty-other/app-api/class/test/v250/detail",
	// 随堂训练学生成绩列表
	apiPostClassTrainingScoreList: "/xty-other/app-api/class/test/v250/score/list",
	// 随堂训练学生成绩列表导出
	apiGetClassTrainingExport: "/xty-other/app-api/class/test/v250/export",

	/**
	 * 串班训练
	 */
	// 串班训练记录列表
	apiGetCasuallyClassList: "/xty-other/app-api/cross/train/task/v250/list",
	// 串班训练记录学生成绩列表
	apiPostCasuallyClassScoreList: "/xty-other/app-api/cross/train/task/v250/score/list",
	// 串班训练学生成绩列表导出
	apiGetCasuallyClassExport: "/xty-other/app-api/cross/train/task/v250/export",

	/**
	 * 自由锻练
	 */
	// 自由锻练记录列表
	apiGetFreeExerciseList: "/xty-other/app-api/free/train/v280/record",
	// 自由锻练记录导出
	apiGetFreeExerciseExport: "/xty-other/app-api/free/train/v280/record/export",

	/**
	 * 阳光跑
	 */
	// 阳光跑记录列表
	apiPostSunshineRunList: "/xty-other/app-api/sunshineRun/v350/list",
	// 阳光跑记录详情
	apiPostSunshineRunDetail: "/xty-other/app-api/sunshineRun/v350/details",
	// 阳光跑记录详情导出
	apiPostSunshineRunDetailExport: "/xty-other/app-api/sunshineRun/v350/export",


	/**
	 * ******************** *
	 * pagesData 数据相关接口 *
	 * ******************** *
	 */

	/**
	 * 奖品核销
	 */
	// 奖品核销列表
	apiGetPrizeVerificationList: "/xty-other/app-api/exchange/v330/list",
	// 奖品核销详情
	apiGetPrizeVerificationDetail: "/xty-other/app-api/exchange/v330/info",
	// 拒绝奖品核销
	apiPostPrizeVerificationRefuse: "/xty-other/app-api/exchange/v330/refuse",
	// 发放奖品
	apiPostPrizeVerificationGrant: "/xty-other/app-api/exchange/v330/grant",
	// 核销记录列表
	apiGetPrizeVerificationRecords: "/xty-other/app-api/exchange/v330/writeOff/list",

	/**
	 * ******************** *
	 * pagesMine 我的其他相关接口 *
	 * ******************** *
	 */

	/**
	 * 班级管理
	 */
	// 班级花名册
	apiGetIntegrationList: "/xty-basic/app-api/student/v260/list",
	// 解绑班级
	apiGetClassRemove: "/xty-basic/app-api/classes/v1/remove",
	// 生成班级码
	apiPostGenerateClassInviteCode: "/xty-basic/app-api/classes/v1/inviteCode/add",

	/**
	 * 学生人脸上传
	 */
	// 单张人脸上传
	apiPostFaceUpload: "/xty-other/app-api/face/v260/upload",
	// 绑定人脸信息
	apiPostFaceBinding: "/xty-other/app-api/face/v260/bindFace",

	/**
	 * 教师人脸照片
	 */
	// 单张人脸上传
	apiPostSingleFaceUpload: "/xty-other/app-api/face/v290/upload",


	/**
	 * ******************** *
	 * pagesPlan 教案相关接口 *
	 * ******************** *
	 */

	/**
	 * 干预方案数据
	 */
	// 获取干预方案数据班级列表
	apiGetInterventionList: "/xty-task/app-api/scheme/statistics/v202/classList",
	// 获取干预方案数据完成情况
	apiGetInterventionCompletion: "/xty-task/app-api/scheme/statistics/v202/completeInfo",
	// 导出干预方案数据完成情况
	apiGetInterventionExport: "/xty-task/app-api/scheme/statistics/v202/completeInfo/export",
	/**
	 * 学生登录注册
	 */
	// 验证学籍号是否存在
	apiGetVerifStudentIDNumber: "/xty-usercenter/app-api/login/v202/checkStudentNo",
	// 验证学生信息
	apiGetVerifStudentInformation: "/xty-usercenter/app-api/login/v250/checkStudentInfo",
	// 验证码发送
	apiGetCAPTCHA: "/xty-usercenter/app-api/sms/v202/sendCode",
	// 绑定联系方式并获取学生信息
	apiGetBindContactInformation: "/xty-usercenter/app-api/login/v41100/getStudentInfo",
	// 设置密码
	apiPostSetPassword: "/xty-usercenter/app-api/login/v250/setPassword",
	// 获取学生信息
	apiGetStudentInfo: "/xty-usercenter/app-api/student/v1/info",
	// 修改密码V2
	apiPostChangePasswordV2: "/xty-usercenter/app-api/mine/v2/password/change",
	


	// 首页文案
	jxjTextType:"/xty-task/app-api/rank/v41100/jxjAppIndexTextType",
	// 排行榜
	jxjRankInfo:"/xty-task/app-api/rank/v41100/weekRankInfo",
	// 获取绑定关系
	jxjRelation:"/xty-usercenter/app-api/login/v41100/relation",
	// 京小健登录
	jxjLogin: "/xty-usercenter/app-api/login/v41100/login",
	// 条件查询分屏运动列表
	jxjSportList: "/xty-task/app-api/sport/v3/list",
	// 体能训练查看锻炼方向，难度和改善方向
	jxjDirection:"/xty-task/app-api/sport/v1/select/sport/direction",
	// 下载分屏运动背景音效
	jxjDownload:"/xty-task/app-api/sport/v1/download",
	// 获取运动详情
	jxjSportDetail:"/xty-task/app-api/sport/v2/sportDetail",
	// 上传AI锻炼记录
	jxjUploadRecord: "/xty-task/app-api/clock/v2/uploadRecord",
	// 每日打卡日历
	jxjCalendar:"/xty-task/app-api/clock/v1/calendar",
	// 打卡作业查询
	jxjTaskInfo:"/xty-task/app-api/clock/v2/taskInfo",
	// 获取学生信息
	jxjStudentInfo:"xty-basic/app-api/student/v260/studentInfo",
	// 打卡作业详情
	jxjTaskDetail:"/xty-task/app-api/clock/v3/taskInfo/detail",
	// 请假
	jxjAskLeave:"/xty-task/app-api/clock/v2/askleave",
	// 撤销请假
	jxjRevoke:"/xty-task/app-api/clock/v1/askleave/revoke",
	// 获取所有AI锻炼记录列表
	jxjRecordInfos:"/xty-task/app-api/clock/v2/getRecordInfos",
	// 获取AI锻炼记录列表
	jxjGetRecordInfos:"/xty-task/app-api/clock/v1/getRecordInfos",
};

const userCenterUrlList = [
	URL.userCenterGetVerifyCode,
	URL.userCenterGetWxUserInfo,
	URL.userCenterPhoneLogin,
	URL.userCenterBindStudentAndLogin,
	URL.userCenterAddBandStudent,
	URL.userCenterChangeUser,
	URL.userCenterChangeBindPhone,
	URL.userCenterGetStudentParentMineSetting,
	URL.userCenterGetMineStudentInfo,
	URL.userCenterUnBandStudentApp,
	URL.userCenterChangeAvatar,

	URL.userCenterGetDomain,
	URL.userCenterGetAreaList,
	URL.userCenterIsTeacher,
	URL.userCenterChangeStudent,
	URL.userCenterGetAllSchool,
	URL.userCenterTeacherLogin,
	URL.userCenterSetNewPassword,
	URL.userCenterLogoutWechat,
	URL.apiGetVerifStudentIDNumber,
	URL.apiGetVerifStudentInformation,
	URL.apiGetCAPTCHA,
	URL.apiGetBindContactInformation,
	URL.apiPostSetPassword,
	URL.apiPostStudentPasswordLogin,
	URL.apiGetStudentInfo,
	URL.apiPostChangePasswordV2,
	URL.apiPostTeachersCheckAccount,

	URL.jxjTextType,
	URL.jxjRankInfo,
	URL.jxjRelation,
	URL.jxjLogin,
	URL.jxjSportList,
	URL.jxjDirection,
	URL.jxjDownload,
	URL.jxjSportDetail,
	URL.jxjUploadRecord,
	URL.jxjCalendar,
	URL.jxjTaskInfo,
	URL.jxjStudentInfo,
	URL.jxjTaskDetail,
	URL.jxjAskLeave,
	URL.jxjRevoke,
	URL.jxjRecordInfos,
	URL.jxjGetRecordInfos,
];

export {
	URL,
	userCenterUrlList
}