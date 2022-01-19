<script>
	import Vue from "vue"
export default {
	globalData: {  
	            has_login: uni.getStorageSync('userID')  
	}, 
	created() {
		// #ifdef APP-PLUS
		plus.navigator.closeSplashscreen(); 
		// #endif 
	},
	onLaunch: function() {
		console.log('App Launch')
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				};
				// #endif
				
				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif		
				
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		})
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";

/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */

/* 全局页面背景 */
.page{
	background-color: #EEE;
	width: 100%;
	height: 100%;
	position: absolute;
	// filter: invert(1) hue-rotate(180deg);
}


	// @import url("common/index/index.css");
	@import url("common/main.css");
	@import url("common/icon.css");
	
	/*每个页面公共css */
	@font-face {
		font-family: 'AliR';
		src: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-matchbox/a003f470-a6fa-11ea-a30b-e311646dfaf2.otf);
	}

	@font-face {
		font-family: 'AliM';
		src: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-matchbox/9ff65fe0-a6fa-11ea-a30b-e311646dfaf2.otf);
	}

	page {
		--mainColor: #435257;
		--activeColor: #36b39b;
	}

	body {
		font-family: 'AliR';
		background-color: #f5f8f9;
	}

	view {
		box-sizing: border-box;
	}

	.flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mainColor {
		color: var(--mainColor);
	}

	.aColor {
		color: var(--activeColor);
	}
	
	.color-nine{
		color: #999999;
	}

	.main-btn {
		border-radius: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--mainColor);
		border: 1upx solid var(--mainColor);
		padding: 10rpx 40rpx;
	}

	.active-btn {
		color: #FFFFFF !important;
		background-color: var(--activeColor) !important;
		border: 1upx solid var(--activeColor) !important;
	}


//夜间模式
// html {
//     filter: invert(1) hue-rotate(180deg);
//     transition: color 300ms, background-color 300ms;
// }
// html image{
//     filter: invert(1) hue-rotate(180deg);
// }
</style>
