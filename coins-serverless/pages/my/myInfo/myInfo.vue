<template>
	<view class="page">
		<u-form :model="form" ref="uForm" label-position="top" border-bottom="true">
			<u-form-item label="昵称">
				<u-input v-model="userInfo.username" />
			</u-form-item>
			<u-form-item label="手机号码">
				<u-input v-model="userInfo.phone" />
			</u-form-item>
			<u-form-item label="Email">
				<u-input v-model="userInfo.mail" />
			</u-form-item>
			<u-form-item label="地址">
				<u-input v-model="userInfo.address" />
			</u-form-item>
		</u-form>
		<view class="bottom-btn flex-center" @click="updateUserInfo">
			<view class="btn">提交</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				userID: uni.getStorageSync('userInfo')._id,
				userInfo: [],
			};
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				let formdata = {
					userID: this.userID,
				};
				this.$u.post('/api/user/getUserInfo', formdata).then(res => {
					if (res.code == 2000) {
						this.userInfo = res.data
					}
				})
			},
			updateUserInfo(){
				let formdata = {
					userID: this.userID,
					username:this.userInfo.username,
					phone: this.userInfo.phone,
					mail:this.userInfo.mail,
					address:this.userInfo.address
				};
				this.$u.post('/api/user/updateUserInfo', formdata).then(res => {
					if (res.code == 2000) {
						uni.showToast({
							title: "修改成功"
						})
						setTimeout(()=>{
							uni.switchTab({
							    url: '../my'
							})
						},1200)
					}
				})
				this.getUserInfo()
			},
			toAddSite() {
				uni.navigateTo({
					url: '/pages/my/myInfo/addSite'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>

	.page {
		padding: 0 30upx;
		background-color: #FFFFFF;
	}

	.bottom-btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 20rpx 0;

		.btn {
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			border: 1rpx solid var(--activeColor);
			background-color: var(--activeColor);
			box-shadow: 0 1px 10px 0px var(--activeColor);
			width: 400rpx;
			height: 80rpx;
		}
	}
</style>
