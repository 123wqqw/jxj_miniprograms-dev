var Class = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "七年级", "八年级", "九年级", "高一", "高二", "高三"];
var maxStandard = [{
		// BMI
		HEIGHT_WEIGHT: {
			g1: "13.3~17.3",
			g2: "13.5~17.8",
			g3: "13.6~18.6",
			g4: "13.7~19.4",
			g5: "13.8~20.5",
			g6: "14.2~20.8",
			g7: "14.8~21.7",
			g8: "15.3~22.2",
			g9: "16.0~22.6",
			g10: "16.5~22.7",
			g11: "16.9~23.2",
			g12: "17.1~23.3",
		},
		// 肺活量
		VITAL_CAPACITY: {
			g1: "≥1400毫升",
			g2: "≥1600毫升",
			g3: "≥1800毫升",
			g4: "≥2000毫升",
			g5: "≥2250毫升",
			g6: "≥2500毫升",
			g7: "≥2750毫升",
			g8: "≥2900毫升",
			g9: "≥3050毫升",
			g10: "≥3150毫升",
			g11: "≥3250毫升",
			g12: "≥3350毫升"
		},
		// 50米跑
		RUN50: {
			g1: "≤11秒",
			g2: "≤10秒",
			g3: "≤9.2秒",
			g4: "≤8.7秒",
			g5: "≤8.3秒",
			g6: "≤8.2秒",
			g7: "≤8.1秒",
			g8: "≤8秒",
			g9: "≤7.9秒",
			g10: "≤7.8秒",
			g11: "≤7.7秒",
			g12: "≤7.6秒"
		},
		// 立定跳远
		STANDINGLONGJUMP: {
			g7: "≥196厘米",
			g8: "≥200厘米",
			g9: "≥202厘米",
			g10: "≥204厘米",
			g11: "≥205厘米",
			g12: "≥206厘米"
		},
		// 坐位体前屈
		SITANDREACH: {
			g1: "≥18.6厘米",
			g2: "≥18.9厘米",
			g3: "≥19.2厘米",
			g4: "≥19.5厘米",
			g5: "≥19.8厘米",
			g6: "≥19.9厘米",
			g7: "≥21.8厘米",
			g8: "≥22.7厘米",
			g9: "≥23.5厘米",
			g10: "≥24.2厘米",
			g11: "≥24.8厘米",
			g12: "≥25.3厘米"
		},
		// 一分钟仰卧起坐
		SITANDUP: {
			g3: "≥46次",
			g4: "≥47次",
			g5: "≥48次",
			g6: "≥49次",
			g7: "≥50次",
			g8: "≥51次",
			g9: "≥52次",
			g10: "≥53次",
			g11: "≥54次",
			g12: "≥55次"
		},
		// 800米跑
		RUN800: {
			g7: "≤3分35秒",
			g8: "≤3分30秒",
			g9: "≤3分25秒",
			g10: "≤3分24秒",
			g11: "≤3分22秒",
			g12: "≤3分20秒"
		},
		// 上肢腰腹
		UPPERABDOMEN: {},
		// 耐力跑
		RUN: {},
		// 50*8米往返跑
		RETURNRUN: {
			g5: "≤1分41秒",
			g6: "≤1分37秒"
		},
		// 一分钟跳绳
		ROLEJUMP: {
			g1: "≥117次",
			g2: "≥127次",
			g3: "≥139次",
			g4: "≥149次",
			g5: "≥158次",
			g6: "≥166次"
		},
		// 视力
		VISION: {},
	},
	{
		HEIGHT_WEIGHT: {
			g1: "13.5~18.1",
			g2: "13.7~18.4",
			g3: "13.9~19.4",
			g4: "14.2~20.1",
			g5: "14.4~21.4",
			g6: "14.7~21.8",
			g7: "15.5~22.1",
			g8: "15.7~22.5",
			g9: "15.8~22.8",
			g10: "16.5~23.2",
			g11: "16.8~23.7",
			g12: "17.3~23.8",
		},
		VITAL_CAPACITY: {
			g1: "≥1700毫升",
			g2: "≥2000毫升",
			g3: "≥2300毫升",
			g4: "≥2600毫升",
			g5: "≥2900毫升",
			g6: "≥3200毫升",
			g7: "≥3640毫升",
			g8: "≥3940毫升",
			g9: "≥4240毫升",
			g10: "≥4540毫升",
			g11: "≥4740毫升",
			g12: "≥4940毫升"
		},
		RUN50: {
			g1: "≤10.2秒",
			g2: "≤9.6秒",
			g3: "≤9.1秒",
			g4: "≤8.7秒",
			g5: "≤8.4秒",
			g6: "≤8.2秒",
			g7: "≤7.8秒",
			g8: "≤7.5秒",
			g9: "≤7.3秒",
			g10: "≤7.1秒",
			g11: "≤7秒",
			g12: "≤6.8秒"
		},
		STANDINGLONGJUMP: {
			g7: "≥225厘米",
			g8: "≥240厘米",
			g9: "≥250厘米",
			g10: "≥260厘米",
			g11: "≥265厘米",
			g12: "≥270厘米"
		},
		SITANDREACH: {
			g1: "≥16.1厘米",
			g2: "≥16.2厘米",
			g3: "≥16.3厘米",
			g4: "≥16.4厘米",
			g5: "≥16.5厘米",
			g6: "≥16.6厘米",
			g7: "≥17.6厘米",
			g8: "≥19.6厘米",
			g9: "≥21.6厘米",
			g10: "≥23.6厘米",
			g11: "≥24.3厘米",
			g12: "≥24.6厘米"
		},
		SITANDUP: {
			g3: "≥48次",
			g4: "≥49次",
			g5: "≥50次",
			g6: "≥51次"
		},
		PULLUP: {
			g7: "≥13次",
			g8: "≥14次",
			g9: "≥15次",
			g10: "≥16次",
			g11: "≥17次",
			g12: "≥18次"
		},
		RUN1000: {
			g7: "≤3分55秒",
			g8: "≤3分50秒",
			g9: "≤3分40秒",
			g10: "≤3分30秒",
			g11: "≤3分25秒",
			g12: "≤3分20秒"
		},
		UPPERABDOMEN: {},
		RUN: {},
		RETURNRUN: {
			g5: "≤1分36秒",
			g6: "≤1分30秒"
		},
		ROLEJUMP: {
			g1: "≥109次",
			g2: "≥117次",
			g3: "≥126次",
			g4: "≥137次",
			g5: "≥148次",
			g6: "≥157次"
		},
		VISION: {},
	}
]


export const getClassContent = (i) => {
	console.log(i);
	return Class[i - 1];
}

// "2021年3月5日 13:41"
export const formatArticleTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()

	return `${year}年${month}月${day}日` + ' ' + [hour, minute].map((n) => formatNumber(n)).join(':')
}

// "3月5日 13:41"
export const formatMsgTime = date => {
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()

	return `${month}月${day}日` + ' ' + [hour, minute].map((n) => formatNumber(n)).join(':')
}

// "3月5日 13:41"
export const formatClockTime = timestamp => {
	let date = new Date();
	date.setTime(timestamp);
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()

	return `${month}月${day}日` + ' ' + [hour, minute].map((n) => formatNumber(n)).join(':')
}

// "13:41"
export const formatAIRecordTime = timestamp => {
	let date = new Date();
	date.setTime(timestamp);
	const hour = date.getHours()
	const minute = date.getMinutes()

	return [hour, minute].map((n) => formatNumber(n)).join(':')
}

// 2020-1-1
export const formatSportTime = timestamp => {
	let date = new Date();
	date.setTime(timestamp);
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	return `${year}-${month}-${day}`;
}

export const formatWeekTime = timestamp => {
	let date = new Date();
	date.setTime(timestamp);
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	return `${year}-${formatNumber(month)}-${formatNumber(day)}`;
}

export const formatAITime = timestamp => {
	let minute, second;
	if (timestamp >= 60000) {
		minute = Math.floor(timestamp / 60000);
		second = ((timestamp % 60000) / 1000).toFixed(1);
	} else if (timestamp <= 0) {
		minute = 0;
		second = 0.0;
	} else {
		minute = 0;
		second = (timestamp / 1000).toFixed(1);
	}
	return `${minute}:${second}`;
}

export const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 根据项目类型、性别、年级获取该项目的满分标准
export const getMaxStandardText = (testNameTypeEnum, gender, grade) => {
	return maxStandard[gender][testNameTypeEnum][`g${grade}`];
}

// 体测数据 - 成绩转文本
export const getPhysicalValue = (item) => {
	switch (item.testNameTypeEnum) {
		case "HEIGHT_WEIGHT":
			item.name = "BMI值";
			let bmi = (item.value2 / 1000) / ((item.value1 / 1000) ** 2);
			item.value = bmi.toFixed(1);
			item.levelText = parseLevel(item.level);
			item.type = 1;
			item.unit = "";
			break;
		case "VITAL_CAPACITY":
			item.name = "肺活量";
			item.value = item.value1;
			item.levelText = parseLevel(item.level);
			item.type = 2;
			item.unit = "毫升";
			break;
		case "RUN50":
			item.name = "50米跑";
			item.value = item.value1 / 1000;
			item.levelText = parseLevel(item.level);
			item.type = 3;
			item.unit = "秒";
			break;
		case "STANDINGLONGJUMP":
			item.name = "立定跳远";
			item.value = item.value1 / 10;
			item.levelText = parseLevel(item.level);
			item.type = 4;
			item.unit = "厘米";
			break;
		case "SITANDREACH":
			item.name = "坐位体前屈";
			item.value = item.value1 / 10;
			item.levelText = parseLevel(item.level);
			item.type = 5;
			item.unit = "厘米";
			break;
		case "SITANDUP":
			item.name = "一分钟仰卧起坐";
			item.value = item.value1;
			item.levelText = parseLevel(item.level);
			item.type = 6;
			item.unit = "次";
			break;
		case "PULLUP":
			item.name = "引体向上";
			item.value = item.value1;
			item.levelText = parseLevel(item.level);
			item.type = 7;
			item.unit = "次";
			break;
		case "RUN1000":
			item.name = "1000米跑";
			item.value = parseTime(item.value1);
			item.levelText = parseLevel(item.level);
			item.type = 8;
			item.unit = "";
			break;
		case "RUN800":
			item.name = "800米跑";
			item.value = parseTime(item.value1);
			item.levelText = parseLevel(item.level);
			item.type = 9;
			item.unit = "";
			break;
		case "UPPERABDOMEN":
			item.name = "上肢腰腹";
			item.unShow = true;
			item.levelText = parseLevel(item.level);
			item.type = 10;
			item.unit = "";
			break;
		case "RUN":
			item.name = "耐力跑";
			item.value = parseTime(item.value1);
			item.levelText = parseLevel(item.level);
			item.type = 11;
			item.unit = "";
			break;
		case "RETURNRUN":
			item.name = "50*4米往返跑";
			item.value = parseTime(item.value1);
			item.levelText = parseLevel(item.level);
			item.type = 12;
			item.unit = "";
			break;
		case "ROLEJUMP":
			item.name = "一分钟跳绳";
			item.value = item.value1;
			item.levelText = parseLevel(item.level);
			item.type = 13;
			item.unit = "次";
			break;
		case "VISION":
			item.name = "视力";
			item.unShow = true;
			item.levelText = parseLevel(item.level);
			item.type = 14;
			item.unit = "";
			break;
	}
	return item;
}

// 体测类型转文本
export const formatTestName = (testType) => {
	let testName = "";
	switch (testType) {
		case 1:
			testName = "BMI值";
			break;
		case 2:
			testName = "肺活量";
			break;
		case 3:
			testName = "50米跑";
			break;
		case 4:
			testName = "立定跳远";
			break;
		case 5:
			testName = "坐位体前屈";
			break;
		case 6:
			testName = "一分钟仰卧起坐";
			break;
		case 7:
			testName = "引体向上";
			break;
		case 8:
			testName = "1000米跑";
			break;
		case 9:
			testName = "800米跑";
			break;
		case 10:
			testName = "上肢腰腹";
			break;
		case 11:
			testName = "耐力跑";
			break;
		case 12:
			testName = "50*4米往返跑";
			break;
		case 13:
			testName = "一分钟跳绳";
			break;
		case 14:
			testName = "视力";
			break;
	}
	return testName;
}

export const getDValue = (selfItem, schoolItem) => {
	switch (selfItem.testNameTypeEnum) {
		case "HEIGHT_WEIGHT":
			let selfBMI = (selfItem.value2 / 1000) / ((selfItem.value1 / 1000) ** 2);
			selfBMI = selfBMI.toFixed(1);
			let schoolBMI = (schoolItem.value2 / 1000) / ((schoolItem.value1 / 1000) ** 2);
			schoolBMI = schoolBMI.toFixed(1);
			schoolItem.improveStatus = selfBMI - schoolBMI > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs(selfBMI - schoolBMI);
			break;
		case "VITAL_CAPACITY":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs(selfItem.value1 - schoolItem.value1) + "毫升";
			break;
		case "RUN50":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs((selfItem.value1 / 1000) - (schoolItem.value1 / 1000)) + "秒";
			break;
		case "STANDINGLONGJUMP":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs((selfItem.value1 / 10) - (schoolItem.value1 / 10)) + "厘米";
			break;
		case "SITANDREACH":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs((selfItem.value1 / 10) - (schoolItem.value1 / 10)) + "厘米";
			break;
		case "SITANDUP":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs(selfItem.value1 - schoolItem.value1) + "次";
			break;
		case "PULLUP":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs(selfItem.value1 - schoolItem.value1) + "次";
			break;
		case "RUN1000":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = parseTime(Math.abs(selfItem.value1 - schoolItem.value1));
			break;
		case "RUN800":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = parseTime(Math.abs(selfItem.value1 - schoolItem.value1));
			break;
		case "UPPERABDOMEN":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs(selfItem.value1 - schoolItem.value1);
			break;
		case "RUN":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = parseTime(Math.abs(selfItem.value1 - schoolItem.value1));
			break;
		case "RETURNRUN":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = parseTime(Math.abs(selfItem.value1 - schoolItem.value1));
			break;
		case "ROLEJUMP":
			schoolItem.improveStatus = selfItem.value1 - schoolItem.value1 > 0 ? 3 : 1;
			schoolItem.dValue = Math.abs(selfItem.value1 - schoolItem.value1) + "次";
			break;
		case "VISION":
			schoolItem.dValue = "";
			break;
	}
	return schoolItem;
}

// 等级 -> 文本
const parseLevel = (level) => {
	let levelText = "";
	switch (level) {
		case "EXCELLENT":
			levelText = "优秀";
			break;
		case "GOOD":
			levelText = "良好";
			break;
		case "PASS":
			levelText = "及格";
			break;
		case "NOPASS":
			levelText = "不及格";
			break;
		case "NOGIVEN":
			levelText = "未测";
			break;
		default:
			levelText = "";
			break;
	}
	return levelText;
}
// 时间 -> 文本
export const parseTime = (value) => {
	let times = value / 1000;
	let second = times % 60;
	let min = (times - second) / 60;
	let valueText = ""
	if (min) {
		valueText += min + "分"
	}
	valueText += second.toFixed(0) + "秒"
	return valueText;
}

// 时间可格式化  总秒数格式化为时分秒
export const getDateTime = (second) => {
	const days = Math.floor(second / 86400)
	const hours = Math.floor((second % 86400) / 3600)
	const minutes = Math.floor(((second % 86400) % 3600) / 60)
	const seconds = Math.floor(((second % 86400) % 3600) % 60)
	let duration = ''
	if (days) {
		duration += `${days}天`
	}
	if (hours) {
		duration += `${hours}时`
	}
	if (minutes) {
		duration += `${minutes}分`
	}
	if (seconds) {
		duration += `${seconds}秒`
	}
	return duration
}

// 节流
export const throttle = (fn, wait = 500, isImmediate = false) => {
	let flag = true;
	if (isImmediate) {
		return function() {
			if (flag) {
				fn.apply(this, arguments);
				flag = false;
				setTimeout(() => {
					flag = true
				}, wait)
			}
		}
	}
	return function() {
		if (flag == true) {
			flag = false
			setTimeout(() => {
				fn.apply(this, arguments)
				flag = true
			}, wait)
		}
	}
}

// 防抖
export const debounce = (fn, wait = 500, isImmediate = false) => {
	let timerId = null;
	let flag = true;
	if (isImmediate) {
		return function() {
			clearTimeout(timerId);
			if (flag) {
				fn.apply(this, arguments);
				flag = false
			}
			timerId = setTimeout(() => {
				flag = true
			}, wait)
		}
	}
	return function() {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			fn.apply(this, arguments)
		}, wait)
	}
}

export const formatDate = date => {
	var date = new Date(date);
	var YY = date.getFullYear() + '-';
	var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return hh + mm + ss;
}

/**
 * 获取前几天或后几天的时间
 * @param nowDate number 开始的时间 
 * @param count number 前几天或后几天
 * @returns {string}
 */
export const getDateTimeStrByDate = (nowDate, count) => {
	const dd = new Date(new Date().setTime(new Date().getTime() +
		3600 * 1000 *
		24 * nowDate))
	const timestamp = dd.getTime()
	const newDate = new Date(timestamp + count * 24 * 3600 * 1000)
	const y = newDate.getFullYear()
	let m = (newDate.getMonth() + 1).toString()
	m = m.length === 1 ? '0' + m : m + ''
	const d = newDate.getDate().toString().length === 1 ? '0' + newDate.getDate() : newDate.getDate()
	return y + '-' + m + '-' + d
}

/**
 * 获取前几个月或后几个月的时间
 * @param nowDate number 开始的时间 
 * @param count number 前几个月或后几个月
 * @returns {string}
 */
export const getDateTimeStrByMonth = (nowDate, count) => {
	const endDate = new Date(new Date().setTime(new Date().getTime() +
		3600 * 1000 *
		24 * nowDate))
	endDate.setMonth(endDate.getMonth() + count);
	const year = endDate.getFullYear()
	let month = endDate.getMonth() + 1
	month = month < 10 ? '0' + month : month;
	const day = endDate.getDate()
	const start = year.toString() + '-' + month.toString() + '-' + day.toString()
	return start
}

/**
 * 日期格式化
 */
export function dateFormat(date, format) {
	format = format || 'yyyy-MM-dd hh:mm:ss'

	if (date !== 'Invalid Date') {
		const o = {
			'M+': date.getMonth() + 1, //month
			'd+': date.getDate(), //day
			'h+': date.getHours(), //hour
			'm+': date.getMinutes(), //minute
			's+': date.getSeconds(), //second
			'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
			S: date.getMilliseconds(), //millisecond
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
		}
		for (const k in o) {
			if (new RegExp('(' + k + ')').test(format)) {
				format = format.replace(
					RegExp.$1,
					RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
				)
			}
		}
		return format
	}
	return ''
}

/**
 * 获取一周第一天
 * 不传参数默认为当前时间
 * @param date 开始的时间 
 * @returns {string}
 * */
export function getWeekbyDate(date) {
	date = date || new Date()
	let weekDay = date.getDay()
	if (weekDay === 0) {
		weekDay = 7
	}
	return getDateTimeStrByDate(0, -weekDay + 1)
}

/**
 * 获取数字小数点的长度
 * @param {number} n 数字
 */
const getDecimalLength = (n) => {
	const decimal = n.toString().split('.')[1]
	return decimal ? decimal.length : 0
}
/**
 * 数字运算（主要用于小数点精度问题）
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * ```
 */
export const computeNumber = (a, type, b) => {
	/**
	 * 修正小数点
	 * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
	 * @param {number} n
	 */
	const amend = (n, precision = 15) => parseFloat(Number(n).toPrecision(precision))
	const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)))
	let result = 0

	a = amend(a * power)
	b = amend(b * power)

	switch (type) {
		case '+':
			result = (a + b) / power
			break
		case '-':
			result = (a - b) / power
			break
		case '*':
			result = (a * b) / (power * power)
			break
		case '/':
			result = a / b
			break
		default:
			break
	}

	result = amend(result)

	return {
		/** 计算结果 */
		result,
		/**
		 * 继续计算
		 * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
		 * @param {number} nextValue 继续计算的值
		 */
		next(nextType, nextValue) {
			return computeNumber(result, nextType, nextValue)
		},
	}
}

// 时间可格式化  总秒数格式化为分秒 速度版本
export const getDateSpeed = (second) => {
	second = second || 0
	const minutes = Math.floor(second / 60)
	const seconds = Math.floor(second % 60)
	let duration = ''
	if (minutes) {
		duration += `${minutes}'`
	}
	duration += `${seconds}''`
	return duration
}
/**
 * 处理百分比
 * 后台一般给没转化成百分比的数据
 * @param data
 * @returns 0%
 */
export const dealPersent = (data) => {
	let number = data * 100
	if (!number) {
		number = 0
	} else if (number && number % 1 !== 0) {
		const num2 = number.toFixed(3)
		number = num2.substring(0, num2.lastIndexOf('.') + 3)
	}
	return number
}
/**
 * 处理小数 保留两位小数
 * @param data
 */
export const dealNumber = (data) => {
	if (!data) {
		return 0
	}
	if (data && data % 1 !== 0) {
		const num2 = data.toFixed(3)
		return num2.substring(0, num2.lastIndexOf('.') + 3)
	}
	return data
}
/**
 * 获取这个月的第一天和最后一天
 * 不传参数默认为当前时间
 *
 * */
export const dateNew = (date) => {
	const arrDate = []
	const da = date || new Date()
	const dates = new Date(da)
	dates.setDate(1)
	let month = parseInt(dates.getMonth() + 1 + '') + ''
	let day = dates.getDate() + ''
	if (parseInt(month) < 10) {
		month = '0' + month
	}
	if (parseInt(day) < 10) {
		day = '0' + day
	}
	const startData = dates.getFullYear() + '-' + month + '-' + day
	arrDate.push(startData)
	const currentMonth = dates.getMonth() + 1
	const firstDay = new Date(dates.getFullYear(), currentMonth, 1).getTime()
	const oneDay = 1000 * 60 * 60 * 24
	const lastTime = new Date(firstDay - oneDay)
	let endMonth = parseInt(lastTime.getMonth() + 1 + '') + ''
	let endDay = lastTime.getDate() + ''
	if (parseInt(endMonth) < 10) {
		endMonth = '0' + endMonth
	}
	if (parseInt(endDay) < 10) {
		endDay = '0' + endDay
	}
	const endData = dates.getFullYear() + '-' + endMonth + '-' + endDay
	arrDate.push(endData)
	return arrDate
}
/**
 * 信息提示
 * @param title string 提示信息
 * @returns {string}
 * */
export const showToast = (title) => {
	// #ifdef APP-PLUS
	plus.nativeUI.closeToast();
	plus.nativeUI.toast(title, {
		duration: "short", // 持续3.5s，short---2s
		align: "center", // 水平居中
		verticalAlign: "center", // 垂直底部
	});
	// #endif
	// #ifndef APP-PLUS
	uni.hideToast();
	uni.showToast({
		duration: 2000,
		"icon": "none",
		"title": title,
	});
	// #endif
}

/**
 * 下载并预览Excel表格
 */
export const downloadPreviewExcelFile = (fileUrl) => {
	uni.downloadFile({
		url: fileUrl,
		success: (response) => {
			if (response.statusCode === 200) {
				// 获取文件管理器
				const fs = wx.getFileSystemManager();
				// 新文件名（必须指定后缀）
				const newPath = `${wx.env.USER_DATA_PATH}/` + fileUrl.split('/').pop();
				// 将临时文件保存为指定名称
				fs.saveFile({
					tempFilePath: response.tempFilePath,
					filePath: newPath,
					success: (saveRes) => {
						wx.openDocument({
							filePath: saveRes.savedFilePath,
							fileType: 'xlsx',
							fail() {
								return false;
							}
						});
					},
					fail: (err) => {
						return false;
					}
				});
			}
		}
	})
}