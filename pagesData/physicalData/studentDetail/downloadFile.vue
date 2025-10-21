<template>
	<view></view>
</template>

<script>
export default {
	data() {
		return {
			isFirst: true,
		}
	},
	onLoad(options) {
		let _this = this;
		uni.setNavigationBarTitle({
			title: this.$t('data.physicalData.downloadFile.title')
		})
		// console.log("download");
		let fileUrl = JSON.parse(options.fileUrl);
		console.log(fileUrl)
		if(fileUrl){
			// _this.downImg();
			_this.downNetFile(fileUrl);
		}
	},
	onShow(){
		if(!this.isFirst){
			// 不是第一次进入
			uni.navigateBack({
				delta: 1,
			})
		}
	},
	onHide(){
		this.isFirst = false;
	},
	methods: {
		// downImg(){
		// 	let _this = this;
		// 	let fsm = wx.getFileSystemManager();
		// 	fsm.writeFile({
		// 		filePath: `${wx.env.USER_DATA_PATH}/${_this.className}-${_this.studentName}-${_this.isPhysical?'体测':'体质'}详情.png`,
		// 		data: _this.imgBase64.slice(22),
		// 		encoding: 'base64',
		// 		success: res => {
		// 			wx.saveImageToPhotosAlbum({
		// 				filePath: `${wx.env.USER_DATA_PATH}/${_this.className}-${_this.studentName}-${_this.isPhysical?'体测':'体质'}详情.png`,
		// 				success: function (response) {
		// 					wx.showToast({
		// 						title: '保存成功',
		// 					})
		// 				},
		// 				fail: function (err) {
		// 					console.log(err)
		// 				}
		// 			})
		// 			console.log(res)
		// 		}, fail: err => {
		// 			console.log(err)
		// 		}
		// 	})
		// },
		downNetFile(fileUrl){
			let _this = this;
			uni.downloadFile({
				url: fileUrl,  
				success: (res) => { 
					if (res.statusCode === 200) {
						uni.openDocument({
							filePath: res.tempFilePath ,
							showMenu: true,
							success: function (response){
								console.log('打开文档成功')
							},
							fail:function(error){
								uni.showToast({
									icon: 'none',
									title: "打开文件失败！",
									duration: 1000
								})
								setTimeout(() => {
									uni.navigateBack({
										delta: 1,
									})
								},1000)
							}
						})
					}
				},
				fail: (err) => {
					console.log(err);
					uni.showToast({
						icon: 'none',
						title: "下载文件失败！",
						duration: 1000
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1,
						})
					},1000)
				}
			});
		},
	}
}
</script>

<style>
</style>
