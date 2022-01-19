<template>
	<view class="page">
		<!--  #ifdef  MP-WEIXIN -->
		<view class="item">
			<button class="circle" open-type='getUserInfo' @click="login_weixin">
				<u-icon class="icon" size="70" name="weixin-fill"></u-icon>
			</button>
			<text>微信一键登录</text>
		</view>
		<!--  #endif -->
		
		<view class="item">
			<button class="circle" @click="toLogin">
				<u-icon class="icon" size="70" name="email"></u-icon>
			</button>
			<text>邮箱注册登录</text>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url: "./login"
				})
			},

			login_weixin() {
				var that = this
				uni.login({
					provider: 'weixin',
					success(loginRes) {
						let code = loginRes.code
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log(infoRes)
								let userInfo = infoRes.userInfo
								let formdata = {
									code,
									userInfo
								};
								that.$u.get('/api/user/wxLogin', formdata).then(res => {
									if (res.code == 2000) {
										//登录成功
										uni.setStorage({
											key: 'userInfo',
											data: res.userInfo,
											success: function() {
												console.log('setUserData');
											}
										});
										uni.setStorage({
											key: 'userID',
											data: res.loginData.openid,
											success: function() {
												console.log('setuserID');
											}
										});
										uni.setStorage({
											key: 'username',
											data: res.userInfo.nickName,
											success: function() {
												console.log('setusername');
											}
										});
									}
								}).then(() => {
									uni.switchTab({
									    url: '../my'
									});
								})
							},
							fail: function(res) {
								this.login_weixin()
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	.page {
		text-align: center;
	}

	.item {
		margin-top: 80upx;
		margin-bottom: 80upx;
	}

	.circle {
		position: relative;
		width: 160upx;
		height: 160upx;
		border: 1upx solid #eee;
		border-radius: 50%;
		margin-bottom: 14upx;
		box-shadow: 0upx 0upx 60upx 0upx rgba(0, 0, 0, 0.1);
	}

	.icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
