/**
 * 日期时间相关工具
 */

// 秒转换成 天时分秒
const dayTimeWithSecond = (second) => {
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

const DateUtil = {
	dayTimeWithSecond
}

export default DateUtil