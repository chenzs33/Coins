<template>
	<view class="page">
		<uni-nav-bar status-bar="true" fixed="true" background-color="#f0f0f0" color="#000">
			<!-- <view  @click="show=true">{{fulldate}}</view> -->
			<view class="weekTop" slot="left">
				<view class="left-arrow" @click="lastWeek"></view>
				<view @click="selectWeek"> {{dateRange}} </view>
				<view class="right-arrow" @click="nextWeek"></view>
			</view>
		</uni-nav-bar>

		<view class='block'>
			<view class='arrow'>
				<image class="icon" src="../../static/image/target.png" mode=""></image>
				<view class="right">
					<text>本周目标</text>
					<input type="text" v-model="target" @blur="updateData" />
				</view>
			</view>
			<view class='arrow'>
				<image class="icon" src="../../static/image/book.png" mode=""></image>
				<view class="right">
					<text>本周读过的书</text>
					<input type="text" v-model="book" @blur="updateData" />
				</view>
			</view>
			<view class='arrow'>
				<image class="icon" src="../../static/image/movie.png" mode=""></image>
				<view class="right">
					<text>本周看过的电影</text>
					<input type="text" v-model="movie" @blur="updateData" />
				</view>
			</view>
			<view class='arrow'>
				<image class="icon" src="../../static/image/smile.png" mode=""></image>
				<view class="right">
					<text>本周做有意义的事</text>
					<input type="text" v-model="significant" @blur="updateData" />
				</view>
			</view>
			<view class='arrow'>
				<image class="icon" src="../../static/image/bull.png" mode=""></image>
				<view class="right">
					<text>本周听过最牛的话</text>
					<input type="text" v-model="goodSentence" @blur="updateData" />
				</view>
			</view>
			<view class='arrow'>
				<image class="icon" src="../../static/image/pig.png" mode=""></image>
				<view class="right">
					<text>本周做过的傻事</text>
					<input type="text" v-model="stupid" @blur="updateData" />
				</view>
			</view>
			<view class='arrow'>
				<image class="icon" src="../../static/image/point.png" mode=""></image>
				<view class="right">
					<text>本周打分</text>
					<input type="text" v-model="point" @blur="updateData" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var currentFirstDate;
	var dateArray = [];

	var formatDate = function(date) {
		var year = date.getFullYear();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		// var week = '(' + ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()] + ')';
		// return year + month + day + ' ' + week;
		return year + '.' + month + '.' + day;
	};
	var addDate = function(date, n) {
		date.setDate(date.getDate() + n);
		return date;
	};

	var setDate = function(date) {
		// var week = date.getDay()-1;
		var week = date.getDay();
		date = addDate(date, week * -1);
		currentFirstDate = new Date(date);
		for (let i = 0; i < 7; i++) {
			let text = formatDate(i == 0 ? date : addDate(date, 1));
			dateArray[i] = text
		}
	};

	export default {

		data() {
			return {
				userID: uni.getStorageSync('userID'),
				dateRange: '-',

				_id: '',

				target: '',
				book: '',
				movie: '',
				significant: '',
				goodSentence: '',
				stupid: '',
				point: 10,

			}
		},
		created(){
			//判断是否登录
		  if(!this.userID){  
		     return uni.redirectTo({url:'../my/login/loginMethod'});
		  }  
		},
		onLoad() {
			setDate(new Date());
			this.dateRange = dateArray[0] + '~' + dateArray[6]
		},
		onShow() {
			this.getData()
		},
		onHide() {
			console.log("onHide")
			this.updateData()
		},
		methods: {
			lastWeek() {
				setDate(addDate(currentFirstDate, -7));
				this.dateRange = dateArray[0] + '~' + dateArray[6]
				this.getData()
			},
			nextWeek() {
				setDate(addDate(currentFirstDate, 7));
				this.dateRange = dateArray[0] + '~' + dateArray[6]
				this.getData()
			},
			selectWeek() {

			},
			updateData() {
				let formdata = {
					_id: this._id,
					target: this.target,
					book: this.book,
					movie: this.movie,
					significant: this.significant,
					goodSentence: this.goodSentence,
					stupid: this.stupid,
					point: this.point,
				}
				this.$u.post('/api/summary/updateSUM', formdata).then(res => {
					console.log(res);
				});
			},
			getData() {
				let formdata = {
					userID: this.userID,
					date: dateArray[0]
				}
				this.$u.post('/api/summary/getSUMInfo', formdata).then(res => {
					console.log(res);
					if (res.code == 2000 && res.list!=null) {
						this._id = res.list._id
							this.target = res.list.target
							this.book = res.list.book
							this.movie = res.list.movie
							this.significant = res.list.significant
							this.goodSentence = res.list.goodSentence
							this.stupid = res.list.stupid
							this.point = res.list.point
					}
				}).catch((err)=>{
					console.log(res)
				});
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #EEE;
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.weekTop {
		display: flex;
		align-items: center;

		.left-arrow {
			width: 20upx;
			height: 20upx;
			// margin-top: 50upx;
			margin-left: 30upx;
			margin-right: 20upx;
			border-top: 1upx solid #000;
			border-left: 1upx solid #000;
			transform: rotate(-45deg);
			/*旋转角度*/
		}

		.right-arrow {
			width: 20upx;
			height: 20upx;
			// margin-top: 50upx;
			margin-left: 20upx;
			border-top: 1upx solid #000;
			border-left: 1upx solid #000;
			transform: rotate(135deg);
			/*旋转角度*/
		}

	}

	.block {
		margin: 30upx 0;
		font-size: 30upx;
	}

	.block .arrow {
		background-color: #fff;
		padding: 25upx 30upx;
		margin-bottom: 2upx;
		display: flex;

		.icon {
			width: 60upx;
			height: 60upx;
		}

		.right {
			width: 70vw;

			text {
				font-weight: bold;
			}

			input {
				font-size: 28upx;
			}
		}
	}
</style>
