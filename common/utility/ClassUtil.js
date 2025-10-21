/**
 * 班级年级相关工具
 */

// 年级名称转换
const gradeNameI18n = (gradeNum) => {
	switch (gradeNum) {
		case 1:
			return 'common.gradeNames.one';
		case 2:
			return 'common.gradeNames.two';
		case 3:
			return 'common.gradeNames.three';
		case 4:
			return 'common.gradeNames.four';
		case 5:
			return 'common.gradeNames.five';
		case 6:
			return 'common.gradeNames.six';
		case 7:
			return 'common.gradeNames.seven';
		case 8:
			return 'common.gradeNames.eight';
		case 9:
			return 'common.gradeNames.nine';
		case 10:
			return 'common.gradeNames.ten';
		case 11:
			return 'common.gradeNames.eleven';
		case 12:
			return 'common.gradeNames.twelve';
		default:
			return '';
	}
}

const ClassUtil = {
	gradeNameI18n,
};

export default ClassUtil;