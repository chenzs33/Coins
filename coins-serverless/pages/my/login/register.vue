<template>
	<view class="register">
	
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="../../../static/image/logo.jpg"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="username"
					type="text"
					placeholder="用户名"
				></wInput>
				<wInput
					v-model="password"
					type="password"
					placeholder="登录密码"
					isShowPass
				></wInput>
				<!-- <wInput
					v-model="verCode"
					type="number"
					maxlength="4"
					placeholder="验证码"
					
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput> -->
					
			</view>
				
			<wButton 
				text="注 册"
				:rotate="isRotate" 
				 class="wbutton"
				@click.native="startReg()"
			></wButton>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../../components/watch-login/watch-input.vue' //input
	import wButton from '../../../components/watch-login/watch-button.vue' //button
	
	export default {
		data() {
			return {
				username:'', 
				password:'', //密码
				verCode:"", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this= this;
		},
		methods: {
			req(action,params){
				uni.showLoading({
					title:'加载中'
				})
				return new Promise((resolve)=>{
					uniCloud.callFunction({
						name:'user-center',
						data:{
							action,
							params
						},
						success:res=>{
							uni.hideLoading()
							resolve(res.result);
						},
						fail:res=>{
							resolve(res)
						}
					})
				})
			},
			// getVerCode(){
			// 	//获取验证码
			// 	if (!this.$u.test.email(this.$data.mailData)) {
			// 	     uni.showToast({
			// 	        icon: 'none',
			// 			position: 'bottom',
			// 	        title: '邮箱格式不正确'
			// 	    });
			// 	    return false;
			// 	}
			// 	console.log("获取验证码")
			// 	let formdata = {
			// 		mail: this.$data.mailData,
			// 	}
			// 	this.$u.post('/api/user/getMailCode', formdata).then(res => {
			// 		console.log('获取验证码===>', res);
			// 		if (res.code == 2000) {
			// 			uni.showToast({
			// 			    icon: 'none',
			// 				position: 'bottom',
			// 			    title: '发送成功'
			// 			});
			// 		}else{
			// 			uni.showToast({
			// 			    icon: 'none',
			// 				position: 'bottom',
			// 			    title: res.msg
			// 			});
			// 		}
			// 	});
				
			// 	this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
			// },
		    startReg() {
				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				// if (!this.$u.test.email(this.$data.mailData)) {
				//      uni.showToast({
				//         icon: 'none',
				// 		position: 'bottom',
				//         title: '邮箱格式不正确'
				//     });
				//     return false;
				// }
		  //       if (this.passData.length < 6) {
		  //           uni.showToast({
		  //               icon: 'none',
				// 		position: 'bottom',
		  //               title: '密码长度不小于6个字符'
		  //           });
		  //           return false;
		  //       }
				// if (this.verCode.length != 4) {
				//     uni.showToast({
				//         icon: 'none',
				// 		position: 'bottom',
				//         title: '验证码不正确'
				//     });
				//     return false;
				// }
				
				_this.isRotate=true
				
				this.req("register",{username:this.$data.username,password:this.$data.password}).then(res=>{
					console.log(res)
					if(res.code === 0){
						uni.setStorageSync('uni_id_token',res.token)
						uni.setStorageSync('uni_id_token_expired',res.tokenExpired)
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: "注册成功"
						},2000);
						_this.isRotate=false
						uni.navigateBack({delta: 1})
					}else{
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.errMsg
						});
						_this.isRotate=false
					}
				})
		    }
		}
	}
</script>

<style>
	@import url("../../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
	
	.wbutton{
		margin-top: 48px;
	}
</style>