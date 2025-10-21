<template>
	<map class="map_container" :longitude="lng" :latitude="lat" :markers="markers" :polyline="polyline"
		:show-location="false" :enable-zoom="false" :enable-scroll="false" :enable-rotate="false">
	</map>
</template>

<script>
	export default {
		props: {
			dataSource: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				lat: 0,
				lng: 0,
				polyline: [],
				markers: []
			}
		},
		watch: {
			dataSource: {
				handler: function(value) {
					if (value) {
						this.initMap()
					}
				}
			}
		},
		methods: {
			initMap() {
				const data = JSON.parse(this.dataSource).filter(item => {
					return item.type !== -1
				})
				// 设置起点 终点
				this.setMarkPoint(data)
				// 绘制路径
				this.polyline = []
				let tracePlotData = []
				let suspendPlotData = []
				let anomaliesPlotData = []
				data.forEach((item, index) => {
					if (item.type === 3) {
						suspendPlotData.push([data[index + 1] || item, item])
						this.setPolyLine(tracePlotData)
						tracePlotData = []
					} else if (item.type === 4) {
						anomaliesPlotData.push([data[index + 1] || item, item])
						this.setPolyLine(tracePlotData)
						tracePlotData = []
					} else {
						tracePlotData.push([data[index + 1] || item, item])
						this.setPolyLine(suspendPlotData, '#464646')
						suspendPlotData = []
						this.setPolyLine(anomaliesPlotData, '#B2B2B2')
						anomaliesPlotData = []
					}
				})
				this.setPolyLine(tracePlotData)
			},
			setMarkPoint(data) {
				this.markers = []
				let startPoint = []
				let endPoint = []
				data.forEach((item) => {
					if (item.type === 1 && (!startPoint || !startPoint.length)) {
						startPoint = [item.lng, item.lat]
					} else if (item.type === 2) {
						endPoint = [item.lng, item.lat]
					}
				})
				if (startPoint && startPoint.length) {
					this.lat = startPoint[1]
					this.lng = startPoint[0]
					this.markers.push({
						id: 1,
						iconPath: '/pagesCenter/static/images/icon_marker_start.png',
						latitude: startPoint[1],
						longitude: startPoint[0],
						width: "30",
						height: "30",
						anchor: {
							x: .5,
							y: .5,
						}
					})
				}
				if (endPoint && endPoint.length) {
					this.markers.push({
						id: 2,
						iconPath: '/pagesCenter/static/images/icon_marker_end.png',
						latitude: endPoint[1],
						longitude: endPoint[0],
						width: "30",
						height: "30",
						anchor: {
							x: .5,
							y: .5,
						}
					})
				}
			},

			/**
			 * 绘制路径
			 * @param data 路径数据
			 * @param color 路径类型对应的颜色
			 */
			setPolyLine(data, color = '#FC8332') {
				if (data && data.length) {
					const newData = data.flat().map((item) => ({
						latitude: item.lat,
						longitude: item.lng
					}))
					this.polyline.push({
						points: newData,
						color,
						arrowLine: true,
						width: 5
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.map_container {
		width: 100%;
		height: 500rpx;
	}
</style>
