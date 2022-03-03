<template>
	<view class="goodsList">
		<view class="good unifyBox flex" v-for="(item, index) in goodsList" :key="index">
			<image :src="item.imgUrl"></image>
			<view class="goodR">
				<view class="txt">{{ item.title }}</view>
				<view class="goodB flexBetween">
					<view class="needScore">兑换所需金币：{{ item.condition }}</view>
					<u-button type="primary" class="getBtn" @click="exchangeGood(index)" :data-index="index">立即兑换</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const db = uniCloud.database();
const collection = db.collection('commodity');
const dbCmd = db.command;

export default {
	data() {
		return {
			page: 1,
			pageSize: 8,
			goodsList: [],
			coins: 0,
			userID: uni.getStorageSync('userInfo')._id,
			userInfo: []
		};
	},
	methods: {
		reqUser(action, params) {
			uni.showLoading({
				title: '加载中'
			})
			return new Promise((resolve) => {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action,
						params
					},
					success: res => {
						uni.hideLoading()
						resolve(res.result);
					},
					fail: res => {
						resolve(res)
					}
				})
			})
		},
		exchangeGood(index) {
			if (this.coins < this.goodsList[index].condition) {
				uni.showToast({
					title: '金币不足',
					icon: 'none'
				});
			} else {
				let formdata = {
					title: this.goodsList[index].title,
					userID: this.userID,
					condition: this.goodsList[index].condition
				};
				this.$u.post('/api/exchange/willExchange', formdata).then(res => {
					if (res.code == 2000) {
						uni.showToast({
							title: '兑换成功',
							icon: 'none'
						});
					}
				});
			}
		},
		getGoods: async function(e) {
			await collection.get().then(res => {
				if (res.result.code === 0) {
					this.goodsList = res.result.data;
				}
			});
		},
		selUserMessage() {
			this.reqUser("getUserInfo", {
				uid: uni.getStorageSync('uni_id')
			}).then(res => {
				if (res.code === 0) {
					uni.setStorageSync('userInfo', res.userInfo)
				} else if (res.code === 30203) {
					uni.clearStorageSync()
				}
			})
		}
		// selUserMessage() {
		// 	let formdata = {
		// 		userID: this.$data.userID
		// 	};
		// 	this.$u.post('/api/user/getUserInfo', formdata).then(res => {
		// 		if (res.code == 2000) {
		// 			res.data.userInfo = JSON.stringify(res.data.userInfo);
		// 			this.coins = res.data.coins;
		// 			this.userInfo = res.data;
		// 			uni.setStorage({
		// 				key: 'userInfo',
		// 				data: res.data,
		// 				success: function() {}
		// 			});
		// 		}
		// 	});
		// }
	},
	onLoad(opt) {
		console.log(opt);
		opt.coins = this.coins;
	},
	onShow() {
		this.getGoods();
		this.selUserMessage();
	}
};
</script>

<style lang="scss">
page {
	background-color: #eee;
}
.unifyBox {
	width: 94vw;
	background-color: #fff;
	border-radius: 12upx;
	margin: auto;
	margin-top: 30upx;
	padding: 10upx 30upx;
	box-sizing: border-box;
}

.unifyColor {
	color: #7c7764;
}

.flex {
	display: flex;
	align-items: center;
}
.flexBetween {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.good {
	padding: 20upx 20upx;
}

.good image {
	width: 190upx;
	height: 190upx;
	border-radius: 8upx;
	background-size: 100% 100%;
	background-repeat: no-repeat;
}

.good .goodR {
	width: 450upx;
	height: 190upx;
	margin-left: 20upx;
}

.good .goodR .goodB {
	margin-top: 80upx;
}

.good .goodR .needScore {
	font-size: 28upx;
}

.good .txt {
	font-size: 32upx;
}

.good .getBtn {
	display: flex;
	justify-content: center;
	align-items: center;
	// color: #fff;
	width: 160upx;
	height: 60upx;
	border-radius: 10upx;
	line-height: 60upx;
	font-size: 28upx;
}
</style>
