<template>
	<view>
		<uni-nav-bar status-bar="true" fixed="true" background-color="#f0f0f0" color="#000">
			<!-- <view  @click="show=true">{{fulldate}}</view> -->
			<view class="dayTop">
				<view @click="show=true">{{fulldate}}</view>
				<view :class="{ 'arrowTransform': !show, 'arrowTransformReturn': show}"  @click="show=true"></view>
			</view>
			<view slot="left" @click="toChart">统计</view>
		</uni-nav-bar>

		<view class="content">

			<!-- 日历 -->
			<view>
				<u-calendar v-model="show" :mode="mode" @change="change"></u-calendar>
			</view>


			<!-- 时间列表 -->
			<view class="table" v-for="(item,index) in tableList">
				<view class="left-table">
					{{item.time}}
				</view>
				<view class="right-table" :class="statusText[item.tag][0]" @click="toAddEve" :data-index="index">
					{{item.event}}
				</view>
			</view>
			
			<y-Fab :bottom="140" :right="40"  @click="toAddEve2" data-index="0" />

		</view>
	</view>

</template>

<script>
	import moment from 'moment'
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import yFab from '@/components/y-Fab/y-Fab.vue'; 
	import tableListMock from './mock.json';

	export default {
		components: {
			uniFab,
			uniNavBar,
			yFab
		},
		data() {
			return {
				fulldate: moment().format('YYYY-MM-DD'),
				userID: uni.getStorageSync('userID'),

				background: {
					backgroundColor: '#007AFF'
				},

				//状态码
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
				// uniFab配置项
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				//日历
				show: false,
				mode: 'date',

				weekList: [],

				tableList: []
			}
		},
		
		// mounted() {
		// 	if(this.userID == ""){
		// 		console.log("this.weekList==》",this.weekList)
		// 		for (let i = 0; i < tableListMock.list.length; i++) {
		// 			tableListMock.list[i].time = this.weekList[0][i]
		// 		}
		// 		this.tableList = tableListMock.list
		// 	}else{
		// 		this.getTimeData()
		// 	}
		// },

		methods: {			
			onShow(){
				this.userID = uni.getStorageSync('userID')
				
				if(this.userID == ""){
					for (let i = 0; i < tableListMock.list.length; i++) {
						tableListMock.list[i].time = this.weekList[0][i]
					}
					this.tableList = tableListMock.list
					console.log('this.tableList==>', this.tableList)
				}else{
					this.getTimeData()
				}
			},
			
			getTimeData() { 
				let formdata = {
					userID: uni.getStorageSync('userID'),
					date: this.fulldate
				}
				this.$u.post('/api/time/getTimeInfo', formdata).then(res => {
					console.log('获取time列表===>', res);
					if (res.code == 2000) {

						for (let i = 0; i < res.list.length; i++) {
							res.list[i].time = this.weekList[0][i]
						}

						this.tableList = res.list
						this.$data.dateId=res.list[0].dateId
					}
				});
			},
			toAddEve2(){
				let i=0,j=0,m=0,n=0
				uni.navigateTo({
					url: './addEvent/addEvent?fulldate='+this.$data.fulldate+'&i='+i+'&j='+j+'&m='+m+'&n='+n,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toAddEve(e) {
				console.log(e)
				var indexS = e.currentTarget.dataset.index
				var indexE = e.currentTarget.dataset.index + 1
				var i,j,m,n;
				// 开始
				if(indexS%2==0){
					i=indexS/2
				}else{
					i=(indexS-1)/2
				}
				if(indexS%2==0){
					j=0
				}else{
					j=1
				}
				// 结束
				if(indexE%2==0){
					m=indexE/2
				}else{
					m=(indexE-1)/2
				}
				if(indexE%2==0){
					n=0
				}else{
					n=1
				}
				console.log(i,j,m,n)
				uni.navigateTo({
					url: './addEvent/addEvent?fulldate='+this.$data.fulldate+'&i='+i+'&j='+j+'&m='+m+'&n='+n,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toChart() {
				uni.navigateTo({
					url: './chart/chart?date='+this.$data.fulldate,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},


			createWeekList() {

				this.weekList.push([])
				let item = ''
				for (let hours = 0; hours < 48; hours++) {
					if (hours % 2 === 0) {
						item = hours / 2 + ':00~' + hours / 2 + ':30'
					} else {
						item = (hours - 1) / 2 + ':30~' + (hours + 1) / 2 + ':00'
					}
					this.weekList[0].push(item)
				}
				// console.log('this.weekList==>', this.weekList)
			},

			change(e) {
				console.log(e);
				this.$data.fulldate = e.result
				this.getTimeData()
			}
		},
		created() {
			this.createWeekList()
		}
	}
</script>

<style lang="scss" scoped>
	// .color-red {
	// 	background-color: #FF0000;
	// }

	// .color-orange {
	// 	background-color: #FFC000;
	// }

	// .color-yellow {
	// 	background-color: #FFFF00;
	// }

	// .color-green {
	// 	background-color: #92D050;
	// }

	// .color-skyblue {
	// 	background-color: #00B0F0;
	// }

	// .color-purple {
	// 	background-color: #7030A0;
	// }

	// .color-darkblue {
	// 	background-color: #0070C0;
	// }


	.table {
		display: flex;
		line-height: 70upx;
		text-align: center;

		.left-table {
			background-color: #E5E5E5;
			width: 30vw;
			font-size: 28upx;
			border: 1upx solid #9c9c9c;
		}

		.right-table {
			width: 70vw;
			font-size: 28upx;
			border: 1upx solid #9c9c9c;
		}
	}

	.dayTop {
		display: flex;
		align-items: center;
		
		  .arrowTransform{
			  width: 14upx;
			  height: 14upx;
			  margin-left: 18upx;
			  margin-top: -4px;
			  border-top: 1upx solid #000;
			  border-left: 1upx solid #000;
			  
		    transition: 0.1s;
		    transform-origin: center;
		    transform: rotateZ(-135deg);
		  }
		  .arrowTransformReturn{
			  width: 14upx;
			  height: 14upx;
			  margin-left: 20rpx;
			  margin-top: 2px;
			  border-top: 1upx solid #000;
			  border-left: 1upx solid #000;
			  
		    transition: 0.1s;
		    transform-origin: center;
		    transform: rotateZ(45deg);
		  }

	}
</style>
