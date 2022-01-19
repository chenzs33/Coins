<template>
	<view>
		<textarea @input="feedbackInput" :value="feedbackText" placeholder="感谢您提出宝贵意见" />
		<view class="bottom-btn flex-center" @click="addFeedback">
			<view class="btn">提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feedbackText:''
			};
		},
		methods:{
			feedbackInput(e){
				this.feedbackText = e.detail.value
			},
			addFeedback(){
				let formdata = {
					userID: uni.getStorageSync('userID'),
					username: uni.getStorageSync('username'),
					feedbackText: this.feedbackText
				}
				this.$u.post('/api/feedback/add', formdata).then(res => {
					console.log('提交反馈===>', res);
					if (res.code == 2000) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '感谢您的意见'
						});
						setTimeout(function () {
						 uni.navigateBack({
							delta: 1
						 })
						}, 1000)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	textarea{
		padding: 30upx;
		width: 100vw;
		height: 60vh;
		font-size: 34upx;
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
