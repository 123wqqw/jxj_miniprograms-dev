<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="linkUrl" />
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				linkUrl: "",
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		computed:{
			...mapState(['isHant'])
		},
		onLoad(options) {
			let _this = this;
			const eventChannel = _this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
			    // console.log(data)
				let linkUrl = data.linkUrl;
				if(linkUrl.indexOf('?')>-1){
					_this.linkUrl = data.linkUrl + `&timestamp=${new Date().getTime()}&isHant=${_this.isHant?1:0}`;
				}else{
					_this.linkUrl = data.linkUrl + `?timestamp=${new Date().getTime()}&isHant=${_this.isHant?1:0}`;
				}
				console.log(_this.linkUrl);
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
