<template>
	<view class='goodsList'>
		<view class='good unifyBox flex' v-for="(item,index) in goodsList" :key='index'>
			<image :src="item.imgUrl"></image>
			<view class='goodR'>
				<view class='txt'>{{item.title}}</view>
				<view class='goodB flexBetween'>
					<view class='needScore'>兑换所需金币：{{item.condition}}</view>
					<u-button type="primary" class='getBtn' @click='exchangeGood(index)' :data-index='index'>立即兑换</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				pageSize: 8,
				goodsList:[],
				coins:0,
				userID: uni.getStorageSync('userID'),
				userInfo: []
			};
		},
		methods:{
			exchangeGood(index){
				console.log(this.coins,this.goodsList[index].condition)
				if(this.coins<this.goodsList[index].condition){
					uni.showToast({
						title:"金币不足",
						icon:"none"
					})
				}else{
					let formdata = {
						title: this.goodsList[index].title,
						userID: this.userID,
						condition:this.goodsList[index].condition
					};
					this.$u.post('/api/exchange/willExchange',formdata).then(res => {
						if (res.code == 2000) {
							uni.showToast({
								title:"兑换成功",
								icon:"none"
							})
						}
					})
					
				}
			},
			getGoods(){
				let formdata = {
					page: this.page,
					pageSize: this.pageSize
				};
				this.$u.post('/api/commodity/getInfoByPage',formdata).then(res => {
					if (res.code == 2000) {
						this.goodsList = res.list
					}
				})
			},
			selUserMessage() {
			   let formdata = {
			   	userID: this.$data.userID,
			   }
			   this.$u.post('/api/user/getUserInfo', formdata).then(res => {
			   	console.log('getUserInfo===>', res);
			   	if (res.code == 2000) {
					// let transUserInfo = res.data.userInfo
					res.data.userInfo = JSON.stringify(res.data.userInfo)
					this.coins = res.data.coins
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
		},
		onLoad(opt) {
			console.log(opt)
			opt.coins = this.coins
		},
		onShow(){
			this.getGoods()
			this.selUserMessage()
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #eee;
	}
	.unifyBox{
	  width: 94vw;
	  background-color: #fff;
	  border-radius: 12upx;
	  margin: auto;
	  margin-top: 30upx;
	  padding: 10upx 30upx;
	  box-sizing: border-box;
	}
	
	.unifyColor{
	  color: #7C7764;
	}
	
	.flex{
	  display: flex;
	  align-items: center;
	}
	.flexBetween{
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
