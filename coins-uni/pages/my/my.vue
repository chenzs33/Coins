<template>
	<!-- container 大盒子 -->
	<view class='container'>
		<!-- 头像部分 -->

		<view class='headPic'>
			 <u-avatar class='img' :src="userInfo.avatarUrl" size="150"></u-avatar>
			 <text class="nickName">{{userInfo.username}}</text>
		</view>

		<!-- links 跳转链接部分 -->
		<view class='block'>
			<view class='item' @click="toExchange">
				<text>我的金币</text>
				<text class="arrow">{{userInfo.coins==null?0:userInfo.coins}}金币</text>
			</view>
			<!-- <view class='arrow'>个人资料</view> -->
		</view>
		<view class='block block2'>
			<!-- <view class='item arrow'>
				<button class="feedback" open-type='contact' plain='true'>反馈</button>
			</view> -->
			<view class='item arrow' @click="toMyInfo">个人信息</view>
			<view class='item arrow' @click="feedback">反馈</view>
			<view class='item arrow' @click="callPhone">联系客服</view>
			<view class='item arrow'>设置</view>
		</view>
		
		
		<!-- 金币兑换 -->
		<view class='exchangeBox' @click='toExchange'>
			<view class='top'>
				<view class='title'>
					<view class='deep'></view>
					<view class='shallow'></view> 金币兑换 <view class='deep'></view>
					<view class='shallow'></view>
				</view>
				<view class='more'>更多>></view>
			</view>
			<view class='bottom flexBetween'>
				<view class='good' v-for="item in goodsList" :key=''>
					<image :src="item.imgUrl"></image>
					<view class='txt'>{{item.title}}</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userID: uni.getStorageSync('userID'),
				userInfo: [],
				// ugrade: 0,
				goodsList:[],
					
			};
		},
		created(){
			//判断是否登录
		  if(!this.userID){  
		     return uni.redirectTo({url:'./login/loginMethod'});
		  }  
		},
		methods: {
			toMyInfo(){
				uni.navigateTo({
					url:"./myInfo/myInfo"
				})
			},
			feedback(){
				uni.navigateTo({
					url:"./feedback/feedback"
				})
			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: '18344316700'
				});
			},
			toExchange() {
				uni.navigateTo({
					url: 'coinExchange/coinExchange?coins='+this.userInfo.coins
				})
			},
			getGoods(){
				let formdata = {
					page: 1,
					pageSize: 3
				};
				this.$u.post('/api/commodity/getInfoByPage',formdata).then(res => {
					if (res.code == 2000) {
						this.goodsList = res.list
					}
				})
			},
			// onLoad: function (options) {
			 //    this.userInfo=uni.getStorageSync('userInfo')[0]
				// if(this.userInfo.length==0){
				// 	uni.navigateTo({
				// 		url:"login/loginMethod"
				// 	})
				// }
			// },
			onShow: function () {
			    this.selUserMessage()
				this.getGoods()
			},
			selUserMessage: function () {
			   let formdata = {
			   	userID: this.$data.userID,
			   }
			   this.$u.post('/api/user/getUserInfo', formdata).then(res => {
			   	console.log('getUserInfo===>', res);
			   	if (res.code == 2000) {
					// let transUserInfo = res.data.userInfo
					res.data.userInfo = JSON.stringify(res.data.userInfo)
					this.userInfo=res.data
					console.log(this.userInfo)
					uni.setStorage({
						key: 'userInfo',
						data: res.data,
						success: function() {
						}
					});
				}
			   })
			}
			 // selUserMessage: function () {
			 //    var that = this
			 //    reqUtils.controllerUtil.selUserMessage({
			 //      openid: uni.getStorageSync('openid')
			 //    }, function (res) {
			 //      console.log('更新用户信息==>', res)
			 //      if (res.data.status == 200) {
			 //        that.setData({
			 //          ugrade: res.data.data.ugrade
			 //        })
			 //        wx.setStorageSync("ugrade", res.data.data.ugrade);
			 //      }
			 //    }, function (res) {
			 //      setTimeout(function () {
			 //        that.selUserMessage();
			 //      }, 2500);
			 //    }, function (res) { });
			 //  },
		}
	}
</script>

<style lang="scss">
	.container{
		padding-bottom: 30upx;
		background-color: #EEEEEE;
		position: absolute;
		height: 100%;
		width: 100%;
	}	
	/* 头像部分 */
	.headPic {
		width: 100%;
		height: 300upx;
		background-color: #F0F0F0;
		position: relative;

		.img {
			// width: 140upx;
			// height: 140upx;
			position: absolute;
			top: 20%;
			left: 50%;
			transform: translate(-50%);
			// border-radius: 50%;
			/* 圣光阴影效果 */
			// box-shadow: 0upx 0upx 100upx 10upx #fff;
			// overflow: hidden;
		}
		.nickName{
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
	
	.block .item:first-child{
		border-radius: 12upx 12upx 0 0;
		
	}
	.block .item:last-child{
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
		/* color: rgba(244, 80, 50, 1); */
		color: #7C7764;
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
		/* background: rgba(255, 74, 36, 1); */
		background-color: #7C7764;
		border-radius: 6upx;
		transform: rotate(20deg);
		margin-left: 8upx;
		margin-right: 5upx;
	}

	.shallow {
		display: inline-block;
		width: 6upx;
		height: 20upx;
		/* background: rgba(251, 164, 158, 1); */
		background-color: #7C7764;
		border-radius: 6upx;
		transform: rotate(20deg);
		margin-left: 5upx;
		margin-right: 8upx;
	}
</style>
