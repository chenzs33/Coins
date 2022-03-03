<template>
	<view class="page">
		<!--  #ifdef  MP-WEIXIN -->
		<view class="item">
			<button class="circle" open-type="getUserInfo" @click="login_weixin"><u-icon class="icon" size="70" name="weixin-fill"></u-icon></button>
			<text>微信一键登录</text>
		</view>
		<!--  #endif -->

		<!-- <view class="item">
			<button class="circle" @click="toLogin">
				<u-icon class="icon" size="70" name="email"></u-icon>
			</button>
			<text>注册登录</text>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: []
		};
	},
	methods: {
		req(action, params) {
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
		toLogin() {
			uni.navigateTo({
				url: './login'
			});
		},
		selUserMessage: function(uid) {
			this.reqUser('getUserInfo', {
				uid: uid
			}).then(res => {
				uni.setStorageSync('userInfo', res.userInfo);
			});
		},

		login_weixin() {
			var that = this;

			uni.getUserProfile({
				desc: '登录注册',
				success(infoRes) {
					that.userInfo = infoRes.userInfo;

					uni.login({
						provider: 'weixin',
						success(res) {
							that.req('login_wx', {
								code: res.code
							})
								.then(loginRes => {
									that.req('changeAvatar', {
										uid: loginRes.uid,
										avatar: that.userInfo.avatarUrl
									});
									that.req('changeNickname', {
										uid: loginRes.uid,
										nickname: that.userInfo.nickName
									});
									uni.setStorageSync('uni_id', loginRes.uid);
									uni.setStorageSync('uni_id_token', loginRes.token);
									uni.setStorageSync('uni_id_token_expired', loginRes.tokenExpired);
									return loginRes.uid;
								})
								.then(uid => {
									return that.selUserMessage(uid);
								})
								.then(() => {
									uni.switchTab({
										url: '../../index/index'
									});
								});
						}
					});
				}
			});
		}
	}
};
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
