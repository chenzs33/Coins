<template>

	<view class="home">
		<view>
			<u-notice-bar mode="horizontal" :list="list"></u-notice-bar>
		</view>
		
		<view class="card-bottom">
			<view>
				<view class="margin-bottom" v-for="(item, index) in DiscoverList" :key="item._id">
					<y-DiaryItem :obj="item" />
				</view>
			</view>
		</view>
		
		<!-- 右下角按钮 -->
		<y-Fab :bottom="140" :right="40"  @click="handleFab" />
		<!-- <y-Fab :bottom="140" :right="40" :btnList="fabList" @click="handleFab" /> -->
	</view>

</template>

<script>
	import yDiaryItem from '../../components/y-DiaryItem/y-DiaryItem.vue'; //朋友圈
	import yFab from '../../components/y-Fab/y-Fab.vue'; //朋友圈


	export default {
		components: {
			yDiaryItem,
			yFab
		},
		data() {
			return {
				list: [
					'励志正能量',
					'充满朝气',
					'活力满满'
				],
				
				//fab的设置
				// fabList: [
				// 	{
				// 		bgColor: '#16C2C2',
				// 		text: '发布',
				// 		fontSize: 28,
				// 		color: '#fff'
				// 	},
				// 	{
				// 		bgColor: '#37b59d',
				// 		text: '分享',
				// 		fontSize: 28,
				// 		color: '#fff'
				// 	}
				// ],

				DiscoverList: []
			}
		},

		// onLoad() {
		// 	that = this;
		// 	that.loadData('add');
		// 	// that.rightList = that.$store.state.diary.rightList
		// },
		// onReachBottom() {
		// 	// that.startNum++;
		// 	//上滑加载
		// 	that.loadData('add');
		// },
		onShow() {
			this.getDiscoverList()
		},
		methods: {
			toDetails(id) {
				uni.navigateTo({
					url: './details/details?id=' + id
				})
			},
			getDiscoverList(){
				let formdata = {
					page: 1,
					pageSize: 20
				}
				this.$u.post('/api/discover/getDiscoverByPage', formdata).then(res => {
					console.log('获取getDiscoverList===>', res);
					if (res.code == 2000) {
	
						this.DiscoverList = res.list
						// this.$data.dateId=res.list[0].dateId
						// uni.stopPullDownRefresh()
					}
				});
			},
			handleFab(e) {
				uni.navigateTo({
					url: './push/push'
				});
			},
			// 下拉刷新
			onPulldownReresh() {
				this.getDiscoverList()
			}
			// toOther(id){
			// 	uni.navigateTo({
			// 		url: '../mine/other/other?id=' + id
			// 	})
			// },
			// loadData(type) {
			// 	if (type === 'add') {
			// 		// 上拉加载
			// 		let list = that.cardList;
			// 		if (list.length == 8) {
			// 			that.loadMoreStatus = 2;
			// 		} else if (list.length > 0) {
			// 			that.cardList = that.cardList.concat({
			// 				id: 2,
			// 				time: '06-17',
			// 				avatarUrl: 'https://6d61-matchbox-79a395-1302390714.tcb.qcloud.la/matchbox/cat.jpg',
			// 				nickName: '小黄鸭',
			// 				title: '洛稚喜欢盛淮南谁也不知道',
			// 				follow: false,
			// 				isLike: false,
			// 				likeNum: '24',
			// 				commentNum: '0',
			// 				imgList: [
			// 					{
			// 						url: 'https://6d61-matchbox-79a395-1302390714.tcb.qcloud.la/matchbox/1e942ff08083714184afbf42eba0d87.jpg'
			// 					}
			// 				]
			// 			});
			// 		} else {
			// 			that.cardList = that.$store.state.diary.cardList
			// 		}
			// 	} else {
			// 		//下拉刷新
			// 		that.$refs.mixPulldownRefresh && that.$refs.mixPulldownRefresh.endPulldownRefresh();
			// 	}
			// },
			
		}
	}
</script>

<style lang="scss" scoped>

	.home {
		.card-bottom {
			width: 100%;
		}
	}
</style>
