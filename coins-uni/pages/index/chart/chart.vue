<template>
	<view>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="tagChange" active-color="#000" inactive-color="#aaaaaa"></u-tabs>
		<!-- <u-empty  text="数据为空" mode="data"></u-empty> -->
		<view class="qiun-columns">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">饼状图</view>
			</view>
			<view class="qiun-charts">
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
			</view>
		</view>
		<view class="todayCoins" v-if="current==0">
			今日累计金币：{{todayCoins}}
		</view>

	</view>
</template>

<script>
	import uCharts from '../../../js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaPie = null;

	export default {
		data() {
			return {
				userID: uni.getStorageSync('userID'),
				
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				todayCoins: 0,
				date:'',

				statusText: {
					0: ['color-red', '拖延'],
					1: ['color-orange', '工作'],
					2: ['color-yellow', '学习'],
					3: ['color-green', '放松'],
					4: ['color-skyblue', '运动'],
					5: ['color-purple', '琐事'],
					6: ['color-darkblue', '娱乐'],
					7: ['color-white', '空白']
				},


				list: [{
					name: '日'
				}, {
					name: '周'
				}, {
					name: '月'
				}, {
					name: '年'
				}],
				current: 0
			}
		},
		created(){
			//判断是否登录
		  if(!this.userID){  
		     return uni.redirectTo({url:'../../my/login/loginMethod'});
		  }  
		},
		onLoad(option) {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);

			this.date = option.date
			this.statsByDay()
			this.getTodayCoin()
		},
		methods: {
			tagChange(index) {
				this.current = index;
				switch (index) {
					case 0:
						this.statsByDay()
						break;
					case 1:
						this.statsByWeek()
						break;
					case 2:
						this.statsByMonth()
						break;
					case 3:
						this.statsByYear()
						break;
				}
			},
			statsByDay(){
				this.getStats(this.date,this.date)
			},
			statsByWeek(){
				
				var currentFirstDate;
				var dateArray = [];
				
				var formatDate = function(date) {
					var year = date.getFullYear();
					var month = (date.getMonth() + 1);
					var day = date.getDate();
					// var week = '(' + ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()] + ')';
					// return year + month + day + ' ' + week;
					
					if(month<10){
						month = '0'+month
					}
					if(day<10){
						day = '0'+day
					}
					return year + '-' + month + '-' + day
				};
				var addDate = function(date, n) {
					date.setDate(date.getDate() + n);
					return date;
				};
				
				var setDate = function(date) {
					var week = date.getDay();
					date = addDate(date, week * -1);
					currentFirstDate = new Date(date);
					for (let i = 0; i < 7; i++) {
						let text = formatDate(i == 0 ? date : addDate(date, 1));
						dateArray[i] = text
					}
				};
				setDate(new Date());
				
				var weekBegin = dateArray[0];
				var weekEnd = dateArray[6];

				this.getStats(weekBegin,weekEnd)
			},
			statsByMonth(){
				var date = new Date();
				var year = date.getFullYear();
				var month = (date.getMonth() + 1);
				var monthBegin = year + '-' + month + '-' + "01";
				var monthEnd = year + '-' + month + '-' + "31";
				this.getStats(monthBegin,monthEnd)
			},
			statsByYear(){
				var date = new Date();
				var year = date.getFullYear();
				var yearBegin = year + "-01-01";
				var yearEnd = year + "-12-31";
				this.getStats(yearBegin,yearEnd)
			},
			getStats(dateBegin,dateEnd){
				let formdata = {
					userID: uni.getStorageSync('userID'),
					dateBegin:dateBegin, 
					dateEnd:dateEnd
				}
				this.$u.post('/api/time/stats', formdata).then(res => {
					console.log('获取time统计===>', res);
					if (res.code == 2000) {
				
						for (let i = 0; i < res.list.length; i++) {
							switch (res.list[i]._id) {
								case 0:
									res.list[i].name = "拖延";
									res.list[i].color = "#FF0000";
									break;
								case 1:
									res.list[i].name = "工作";
									res.list[i].color = "#FFC000";
									break;
								case 2:
									res.list[i].name = "学习";
									res.list[i].color = "#FFFF00";
									break;
								case 3:
									res.list[i].name = "放松";
									res.list[i].color = "#92D050";
									break;
								case 4:
									res.list[i].name = "运动";
									res.list[i].color = "#00B0F0";
									break;
								case 5:
									res.list[i].name = "琐事";
									res.list[i].color = "#7030A0";
									break;
								case 6:
									res.list[i].name = "娱乐";
									res.list[i].color = "#0070C0";
									break;
								default:
									res.list[i].name = '';
							}
						}
						console.log(res.list)
						let Pie = {
							series: res.list
						};
						_self.showPie("canvasPie", Pie);
				
				
					}
				});
			},
			// 今日金币
			getTodayCoin() {
				let formdata = {
					userID: uni.getStorageSync('userID'),
					date: this.date
				}
				this.$u.post('/api/time/statisticsCoin', formdata).then(res => {
					console.log('获取today统计===>', res);
					if (res.code == 2000) {
						if (res.count.length != 0) {
							this.todayCoins = res.count[0].count
						}
					}
				});
			},
			// getStatistics() {
			// 	let formdata = {
			// 		userID: uni.getStorageSync('openID'),
			// 		date: this.date
			// 	}
			// 	this.$u.post('/api/time/statistics', formdata).then(res => {
			// 		console.log('获取time统计===>', res);
			// 		if (res.code == 2000) {

			// 			for (let i = 0; i < res.list.length; i++) {
			// 				switch (res.list[i]._id) {
			// 					case 0:
			// 						res.list[i].name = "拖延";
			// 						res.list[i].color = "#FF0000";
			// 						break;
			// 					case 1:
			// 						res.list[i].name = "工作";
			// 						res.list[i].color = "#FFC000";
			// 						break;
			// 					case 2:
			// 						res.list[i].name = "学习";
			// 						res.list[i].color = "#FFFF00";
			// 						break;
			// 					case 3:
			// 						res.list[i].name = "放松";
			// 						res.list[i].color = "#92D050";
			// 						break;
			// 					case 4:
			// 						res.list[i].name = "运动";
			// 						res.list[i].color = "#00B0F0";
			// 						break;
			// 					case 5:
			// 						res.list[i].name = "琐事";
			// 						res.list[i].color = "#7030A0";
			// 						break;
			// 					case 6:
			// 						res.list[i].name = "娱乐";
			// 						res.list[i].color = "#0070C0";
			// 						break;
			// 					default:
			// 						res.list[i].name = '';
			// 				}
			// 			}
			// 			console.log(res.list)
			// 			let Pie = {
			// 				series: res.list
			// 			};
			// 			_self.showPie("canvasPie", Pie);


			// 		}
			// 	});
			// },
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					// legend: {
					// 	show: true
					// },
					legend: {
						show: true,
						position: 'right',
						float: 'center',
						itemGap: 10,
						padding: 5,
						lineHeight: 26,
						margin: 5,
						borderWidth: 1
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					},
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ":" + item.data + "块"
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
		width: 100vw;
		overflow-x: hidden;
	}

	.qiun-padding {
		padding: 2%;
		width: 96%;
	}

	.qiun-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.qiun-rows {
		display: flex;
		flex-direction: row !important;
	}

	.qiun-columns {
		display: flex;
		flex-direction: column !important;
	}

	.qiun-common-mt {
		margin-top: 10upx;
	}

	.qiun-bg-white {
		background: #FFFFFF;
	}

	.qiun-title-bar {
		// width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #0ea391;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000
	}

	.qiun-charts {
		width: 750upx;
		// height: 100vh;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.todayCoins {
		text-align: center;
	}
</style>
