<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="../../../static/image/logo.jpg"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput v-model="mailData" type="text" placeholder="邮箱"></wInput>
				<wInput v-model="passData" type="password" placeholder="密码"></wInput>
			</view>
			<wButton text="登 录" :rotate="isRotate" @click.native="startLogin()" class="wbutton"></wButton>

			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>
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
				mailData: '', //邮箱地址
				passData: '', //密码
				isRotate: false, //是否加载旋转
				userInfo: '',
			};
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			_this = this;
			// this.isLogin();
		},
		methods: {
			isLogin() {
				//判断缓存中是否登录过，直接登录
				// try {
				// 	const value = uni.getStorageSync('setUserData');
				// 	if (value) {
				// 		//有登录信息
				// 		console.log("已登录用户：",value);
				// 		_this.$store.dispatch("setUserData",value); //存入状态
				// 		uni.reLaunch({
				// 			url: '../../../pages/index',
				// 		});
				// 	}
				// } catch (e) {
				// 	// error
				// }
			},
			getLogin(){
				let formdata = {
					mail: this.$data.mailData,
					password: this.$data.passData
				}
				this.$u.post('/api/user/mailLogin', formdata).then(res => {
					console.log('mailLogin===>', res);
					if (res.code == 2000) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: "登录成功"
						},2000);
						uni.setStorage({
							key: 'userInfo',
							data: res.loginData,
							success: function() {
							}
						});
						uni.setStorage({
							key: 'userID',
							data: res.loginData[0].userID,
							success: function() {
								console.log('setuserID');
							}
						});
						uni.setStorage({
							key: 'username',
							data: res.loginData[0].userID,
							success: function() {
								console.log('setuserID==>',res.loginData[0].userID);
							}
						});
						_this.isRotate=false
						
						uni.switchTab({
							url:"../my"
						})

					}else{
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.msg
						});
						_this.isRotate=false
					}
				})
							
			},
			startLogin() {
				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.mailData.length == "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '用户名不能为空'
					});
					return;
				}
				if (this.passData.length < 5) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不正确'
					});
					return;
				}
				
				_this.isRotate = true
				
				this.getLogin()
				console.log("登录成功")
				
				// uni.showLoading({
				// 	title: '登录中'
				// });
				// getLogin()
				// .then(res => {
				// 	//console.log(res)
				// 	//简单验证下登录（不安全）
				// 	if(_this.mailData==res.data.username && _this.passData==res.data.password){
				// 		let userdata={
				// 			"username":res.data.username,
				// 			"nickname":res.data.nickname,
				// 			"accesstoken":res.data.accesstoken,
				// 		} //保存用户信息和accesstoken
				// 		_this.$store.dispatch("setUserData",userdata); //存入状态
				// 		try {
				// 			uni.setStorageSync('setUserData', userdata); //存入缓存
				// 		} catch (e) {
				// 			// error
				// 		}
				// 		uni.showToast({
				// 			icon: 'success',
				// 			position: 'bottom',
				// 			title: '登录成功'
				// 		});
				// 		uni.reLaunch({
				// 			url: '../../../pages/index',
				// 		});
				// 	}else{
				// 		_this.passData=""
				// 		uni.showToast({
				// 			icon: 'error',
				// 			position: 'bottom',
				// 			title: '账号或密码错误，账号admin密码admin'
				// 		});
				// 	}
				// 	uni.hideLoading();
				// }).catch(err => {
				// 	uni.hideLoading();
				// })

			}
		}
	}
</script>

<style>
	@import url("../../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
	
	.cuIcon-weixin{
		 border:0px;
		 cursor:pointer;
	}
</style>
