<template>
	<!-- container 大盒子 -->
	<view class="container">
		<!-- 头像部分 -->
		<view class="headPic">
			<u-avatar class="img" :src="userInfo.avatar" size="150"></u-avatar>
			<text class="nickName">{{ userInfo.nickname || userInfo.username }}</text>
		</view>

		<!-- links 跳转链接部分 -->
		<view class="block">
			<view class="item" style="border-radius: 12upx 12upx;">
				<text>我的金币</text>
				<text class="arrow">{{ userInfo.coins ? userInfo.coins : 0 }}金币</text>
			</view>
		</view>
		<view class="block block2">
			<!-- <view class='item arrow' @click="toMyInfo">个人信息</view> -->
			<view class="item arrow" @click="feedback">反馈</view>
			<view class="item arrow" @click="callPhone">联系客服</view>
			<!-- <view class='item arrow'>设置</view> -->
		</view>

		<!-- 金币兑换 -->
		<!-- <view class='exchangeBox' @click='toExchange' v-if="this.goodsList.length !== 0">
			<view class='top'>
				<view class='title'>
					<view class='deep'></view>
					<view class='shallow'></view> 金币兑换 <view class='deep'></view>
					<view class='shallow'></view>
				</view>
				<view class='more'>更多>></view>
			</view>
			<view class='bottom flexBetween'>
				<view class='good' v-for="(item,index) in goodsList" :key='index'>
					<image :src="item.imgUrl"></image>
					<view class='txt'>{{item.title}}</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			userID: uni.getStorageSync('userInfo')._id,
			userInfo: uni.getStorageSync('userInfo'),
			// ugrade: 0,
			goodsList: []
		};
	},
	created() {
		//判断是否登录
		if (!this.userID) {
			return uni.redirectTo({ url: '../my/login/loginMethod' });
		}
	},
	onShow() {
		this.selUserMessage();
		// this.getGoods()
	},
	methods: {
		reqUser(action, params) {
			uni.showLoading({
				title: '加载中'
			});
			return new Promise(resolve => {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action,
						params
					},
					success: res => {
						uni.hideLoading();
						resolve(res.result);
					},
					fail: res => {
						resolve(res);
					}
				});
			});
		},
		reqGoods(action, params) {
			uni.showLoading({
				title: '请求中'
			});
			return new Promise(resolve => {
				uniCloud.callFunction({
					name: 'goods',
					data: {
						action,
						params
					},
					success: res => {
						uni.hideLoading();
						resolve(res.result);
					},
					fail: res => {
						resolve(res);
					}
				});
			});
		},
		toMyInfo() {
			uni.navigateTo({
				url: './myInfo/myInfo'
			});
		},
		feedback() {
			uni.navigateTo({
				url: './feedback/feedback'
			});
		},
		callPhone() {
			uni.makePhoneCall({
				phoneNumber: '18344316700'
			});
		},
		toExchange() {
			uni.navigateTo({
				url: 'coinExchange/coinExchange?coins=' + this.userInfo.coins
			});
		},
		getGoods() {
			this.reqGoods('getGoods').then(res => {
				if (res.data) {
					this.goodsList = res.data;
				}
			});
		},
		selUserMessage() {
			this.reqUser('getUserInfo', {
				uid: uni.getStorageSync('uni_id')
			}).then(res => {
				if (res.code === 0) {
					this.userInfo = res.userInfo
					uni.setStorageSync('userInfo', res.userInfo);
				} else if (res.code === 30203) {
					uni.clearStorageSync();
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #eeeeee;
}

.container {
	padding-bottom: 30upx;
	width: 100%;
}

/* 头像部分 */
.headPic {
	width: 100%;
	height: 300upx;
	background-color: #f0f0f0;
	position: relative;

	.img {
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translate(-50%);
	}

	.nickName {
		position: absolute;
		bottom: 10%;
		left: 50%;
		transform: translate(-50%);
		color: #000;
		font-weight: bolder;
	}
}

.block {
	margin: 30upx 0;
	font-size: 30upx;
	border-radius: 12upx;
}

.block .item {
	background-color: #fff;
	padding: 22upx 30upx;
	margin-bottom: 2upx;
	width: 94vw;
	margin: auto;
}

.block .item:first-child {
	border-radius: 12upx 12upx 0 0;
}

.block .item:last-child {
	border-radius: 0 0 12upx 12upx;
}

.block .item {
	display: flex;
	justify-content: space-between;
}

.feedback {
	padding: 0;
	margin: 0;
	border: none !important;
	border-radius: 0;
	background-color: transparent;
	border-color: transparent;
	font-size: 30upx;
	line-height: 48upx;
	width: 100%;
	text-align: left;
}

.exchangeBox {
	width: 94vw;
	background-color: #fff;
	border-radius: 12upx;
	margin: auto;
	margin-top: 30upx;
	padding: 10upx 30upx;
	box-sizing: border-box;
}

.exchangeBox .top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10upx 0;
}

.exchangeBox .top .title {
	font-size: 32upx;
	font-weight: 500;
	color: #7c7764;
}

.exchangeBox .top .more {
	font-size: 26upx;
	color: #666;
}

.exchangeBox .bottom {
	margin-top: 12upx;
	justify-content: space-around;
}

.exchangeBox .bottom .good image {
	width: 190upx;
	height: 190upx;
	border-radius: 8upx;
	background-size: 100% 100%;
	background-repeat: no-repeat;
}

.exchangeBox .bottom .good .txt {
	text-align: center;
	font-size: 28upx;
}

.deep {
	display: inline-block;
	width: 6upx;
	height: 20upx;
	background-color: #7c7764;
	border-radius: 6upx;
	transform: rotate(20deg);
	margin-left: 8upx;
	margin-right: 5upx;
}

.shallow {
	display: inline-block;
	width: 6upx;
	height: 20upx;
	background-color: #7c7764;
	border-radius: 6upx;
	transform: rotate(20deg);
	margin-left: 5upx;
	margin-right: 8upx;
}
</style>
