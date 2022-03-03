<template>
	<view class="detail-wrap">
		<view class="item-head">
			<view class="left-info">
				<view class="img-wrap flex-center" @tap="toOthers">
					<image :src="detail.userInfo[0].avatarUrl" mode="widthFix" class="avatar"></image>
					<!-- <image src="../../../static/image/logo.jpg" mode="widthFix" class="avatar"></image> -->
				</view>
				<view class="head-name">{{ detail.userInfo[0].username }}</view>
			</view>
			<!-- <view :class="['follow-btn flex-center', detail.follow ? 'followed' : '']" @tap="handleFollow(detail.id)">关注ta</view> -->
		</view>
		<!-- <view class="swiper-wrap">
			<swiper class="swiper-box" @change="swiperChange">
				<swiper-item v-for="(item, index) in detail.imgList" :key="index" class="swipers flex-center">
					<image :src="item.url" mode="widthFix" @tap="ViewImage(index, detail.imgList)" class="img"></image>
				</swiper-item>
			</swiper>
			<div class="custom-indicator flex-center">{{ current+1 }} / {{ detail.imgList.length }}</div>
		</view> -->
		<view class="content-box" v-html="detail.content"></view>
		<view class="bottom-time">
			<text>{{detail.createTime}}</text>
		</view>
		<view class="comment-wrap">
			<view class="scroll-wrap">
				<view class="top-num padding-tb">共{{commentList.length}}条评论</view>
				<template v-if="commentList && commentList.length > 0">
					<view class="comment-item margin-bottom-lg" v-for="(item, index) in commentList" :key="index">
						<view class="left-avatar">
							<!-- <image class="avatar" :src="item.avatarUrl" mode="widthFix"></image> -->
							<image class="avatar" :src="item.userInfo[0].avatarUrl" mode="widthFix"></image>
						</view>
						<view class="right-box">
							<view class="right-mine">
								<view class="right-top">
									<p class="title">
										{{ item.userInfo[0].username }}
										<!-- <text class="author">作者</text> -->
									</p>
									<text class="time">{{item.createTime}}</text>
								</view>
								<p class="content">{{ item.content }}</p>
							</view>
							<!-- 子评论 -->
							<!-- <template v-if="item.children && item.children.length > 0">
								<view class="comment-item margin-top-sm" v-for="(child,idx) in item.children" :key="idx">
									<view class="left-avatar margin-right-sm">
										<image :src="child.avatarUrl" mode="widthFix" class="avatar"></image>
									</view>
									<view class="right-mine">
										<view class="right-top">
											<view class="reply">
												<p class="title">{{ child.nickName }}</p>
												<text class="padding-lr-xs">回复</text>
												<p class="title active">{{ item.nickName }}</p>
											</view>
											<text class="time">{{child.time}}</text>
										</view>
										<p class="content">{{ child.content }}</p>
									</view>
								</view>
							</template> -->
						</view>
					</view>
				</template>
				<template v-else>
					<view class="flex-center margin">
						<y-Empty />
					</view>
				</template>
			</view>
		</view>
		<view class="comment-input">
			<input type="text" v-model="commentVal" class="top-input" placeholder="说点什么吧..." />
			<view class="send-btn" @tap="addComment">发送</view>
		</view>
	</view>
</template>

<script>
	var that;
	export default {
		data() {
			return {
				content: '',
				userID: uni.getStorageSync('userInfo')._id,
				
				detailId: '',
				commentVal: '',
				current: 0,
				commentList: [],
				detail: {}
			};
		},
		onLoad(options) {
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2];//上一个页面
			 
			that = this
			if (options && options._id) {
				that.detailId = options._id
				let list = prevPage.$vm.DiscoverList
				list.forEach(item => {
					if (options._id == item._id) {
						that.detail = item,
						that.commentList = item.comment
					}
				})
			}
			
			this.getCommet()

			// 分享微信好友和朋友圈
			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
		},

		methods: {
			ViewImage(index, arr) {
				let list = [];
				for (let i = 0; i < arr.length; i++) {
					list.push(arr[i].url);
				}
				uni.previewImage({
					current: index,
					urls: list
				});
			},
			addComment() {
				// let time = new Date().Format('MM-dd hh:mm');
				// let params = {
				// 	avatarUrl: 'https://6d61-matchbox-79a395-1302390714.tcb.qcloud.la/matchbox/avatar.png',
				// 	content: that.commentVal == '' ?  '奥里给' : that.commentVal,
				// 	nickName: '小黄吖',
				// 	time: time
				// }
				// that.commentList.splice(0,0,params)
				// that.commentVal = ''
				let formdata = {
					userID:this.userID,
					content:this.commentVal,
					discoverID:this.detailId
				}
				this.$u.post('/api/comment/add', formdata).then(res => {
					if (res.code == 2000) {
						uni.showToast({
							icon:"none",
							title:"评论成功"
						})
						this.commentVal = '',
						this.getCommet()
					}
				});
			},
			getCommet(){
				let formdata = {
					page: 1,
					pageSize: 20,
					discoverID: this.detailId
				}
				this.$u.post('/api/comment/getCommet', formdata).then(res => {
					if (res.code == 2000) {
						this.commentList = res.list
					}
				});
			},
			swiperChange(e) {
				this.current = e.detail.current;
			},
			toOthers() {
				uni.navigateTo({
					url: '../mine/other'
				});
			},
			// handleFollow(id) {
			// 	let that = this;
			// 	that.detail.follow = !that.detail.follow;
			// }
		}
	};
</script>

<style lang="scss" scoped>
	.detail-wrap {
		background-color: #ffffff;
		padding: 60rpx 0 100rpx;

		.item-head {
			display: flex;
			align-items: center;
			padding: 20rpx 40rpx;
			width: 100%;
			justify-content: space-between;
			border-bottom: 1rpx solid #eeeeee;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			background-color: #fff;
			height: 120rpx;

			.left-info {
				display: flex;
				align-items: center;

				.img-wrap {
					width: 80rpx;
					height: 80rpx;
					overflow: hidden;
					border-radius: 50%;
					border: 1rpx solid #ECECEC;

					.avatar {
						width: 100%;
					}
				}

				.head-name {
					padding-left: 40rpx;
					color: #666666;
					font-size: 32rpx;
				}
			}

			.follow-btn {
				width: 140rpx;
				height: 60rpx;
				border: 1rpx solid var(--mainColor);
				color: var(--mainColor);
				border-radius: 40rpx;
			}

			.followed {
				color: #fff;
				background: var(--activeColor);
				border: 1rpx solid var(--activeColor);
			}
		}

		.swiper-wrap {
			position: relative;

			.swiper-box {
				margin: 0rpx 0 40rpx;
				height: 600rpx;
				background-color: var(--mainColor);
			}

			.custom-indicator {
				position: absolute;
				right: 10px;
				top: 10px;
				background: rgba(0, 0, 0, 0.5);
				padding: 3px 5px;
				border-radius: 12px;
				color: #fff;
			}
		}

		.content-box {
			margin-top: 100rpx;
			padding: 0 40rpx;
			font-size: 32rpx;
			line-height: 50rpx;
		}

		.bottom-time {
			padding: 20rpx 40rpx;
			font-size: 24rpx;
			color: #999999;
		}

		.comment-wrap {
			background-color: #fff;
			padding: 0 40rpx 40rpx;

			.scroll-wrap {
				height: 100%;
				border-top: 1rpx solid #eee;
			}

			.comment-item {
				display: flex;
				justify-content: space-between;

				.left-avatar {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					overflow: hidden;
					border: 1rpx solid #ECECEC;

					.avatar {
						width: 100%;
					}
				}

				.right-box {
					margin-left: 20rpx;
					flex: 1;

					.right-mine {
						padding: 20rpx;
						background-color: #f5f8f9;
						border-radius: 10rpx;
						flex: 1;
					}

					.right-top {
						display: flex;
						justify-content: space-between;

						.reply {
							display: flex;
							font-size: 28rpx;
						}

						.active {
							color: var(--activeColor) !important;
						}

						.title {
							flex: 1;
							color: #000;

							.author {
								background-color: var(--activeColor);
								color: #ffffff;
								padding: 0 8rpx;
								margin-left: 10rpx;
								border-radius: 6rpx;
							}
						}

						.time {
							color: #999;
						}
					}

					.content {
						padding: 10rpx 0;
					}
				}
			}
		}

		.comment-input {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			padding: 20rpx 40rpx;
			border-top: 1rpx solid #ECECEC;

			.top-input {
				width: 100%;
				height: 60rpx;
				display: flex;
				align-items: center;
				padding: 0 40rpx;
				background-color: #f5f5f5;
				color: #000;
				border-radius: 80rpx;
				flex: 1;
			}

			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60rpx;
				width: 140rpx;
				margin-left: 20rpx;
				border-radius: 40rpx;
				border: 1rpx solid var(--activeColor);
				color: var(--activeColor);
				background-color: #ffffff;
			}
		}
	}
</style>
