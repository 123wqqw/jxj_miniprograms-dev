<template>
	<web-view :src="shareUrl">
	</web-view>
</template>

<script>
	export default {
		data() {
			return {
				shareUrl: ''
			}
		},
		onLoad(option) {
			this.shareUrl = `https://h5.gxapp.iydsj.com/gxapp/xtyShare/WeChat/index.html?timestamp=${new Date().getTime()}&qrCode=${option.qrCode}&teacherName=${option.teacherName}&classCode=${option.classCode}&grade=${option.grade}&class=${option.class}`
		}
	}
</script>

<style>
</style>
