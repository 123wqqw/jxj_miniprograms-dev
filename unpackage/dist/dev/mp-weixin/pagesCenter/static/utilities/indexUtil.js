require('../../common/vendor.js');import { getDateTime } from "@/common/util.js";

/**
 * 处理运动成绩展示
 * @param sportItemCode 运动项目编码
 * @param score 运动成绩
 * @param customize 自定义长短跑距离（米）
 * @param dianaScoreConfig 学校配置的短跑成绩精度（小数点位数）
 * @returns 
 */
export function configSportScore(score, sportItemCode, customize, dianaScoreConfig) {
	if (score === null || sportItemCode == null) {
		return '-';
	}
	let decimalPlaces = 1;
	if (dianaScoreConfig) {
		const config = JSON.parse(dianaScoreConfig);
		if (sportItemCode === 'dash') {
			decimalPlaces = config.dash50Parameter.decimalPlaces || 1;
		} else if (sportItemCode === 'dash100') {
			decimalPlaces = config.dash100Parameter.decimalPlaces || 1;
		} else if (config.customizeParameter) {
			const sportCode = customize ? (sportItemCode + '-' + customize) : sportItemCode;
			const customDash = config.customizeParameter.find((item) => {
				return item.sportItemCode === sportCode;
			})
			if (customDash) {
				decimalPlaces = customDash.decimalPlaces || 1;
			}
		}
	}
	if (['standingLongJump', 'sitAndReach'].includes(sportItemCode)) {
		return `${score / 10}厘米`;
	} else if (['solidBallSport'].includes(sportItemCode)) {
		return `${(Math.ceil(score / 10) / 10).toFixed(1)}米`;
	} else if (['dash', 'dash100'].includes(sportItemCode)) {
		return `${(Math.ceil(score / 100) / 10).toFixed(decimalPlaces)}秒`;
	} else if (['2000Run', '2000RunTrain', 'longDistanceRace', 'outAndBack'].includes(sportItemCode)) {
		return getDateTime(score / 1000);
	} else if (['sunshineRun'].includes(sportItemCode)) { // 阳光跑
		return (score / 1000).toFixed(2) + '公里';
	} else if (sportItemCode.includes('dashCustomization')) { // 短跑自定义
		if (score >= 60000) {
			return getDateTime(score / 1000);
		}
		if (decimalPlaces == 2) {
			return `${(Math.ceil(score / 10) / 100).toFixed(2)}秒`;
		}
		return `${(Math.ceil(score / 100) / 10).toFixed(decimalPlaces)}秒`;
	} else if (sportItemCode.includes('longDistanceRaceCustomization')) { // 长跑自定义
		return getDateTime(score / 1000);
	} else if (['vitalCapacity'].includes(sportItemCode)) {
		return `${score}毫升`;
	} else if (['soccerSport', 'basketballSport'].includes(sportItemCode)) {
		if (score >= 60000) {
			return getDateTime(score / 1000);
		}
		return `${(Math.ceil(score / 10) / 100).toFixed(2)}秒`;
	} else if (['15MeterTurnBackRun'].includes(sportItemCode)) {
		return `${score}次`;
	}
	return `${score}个`;
}