<template>
	<view>
		<u-navbar :is-back="true" :title="fulldate"></u-navbar>
		<view class="content">
			<!-- 正文内容 -->
			<!-- 添加数据 -->
			<view class="addEvent">
				<view class="item arrow">
					<text>开始时间</text>
					<picker mode="multiSelector" :value="stime" :range="timeArray" @change="bindStimeChange">
						<view class="uni-input">{{stime}}</view>
					</picker>

				</view>
				<view class="item  arrow">
					<text>结束时间</text>
					<picker mode="multiSelector" :value="etime" :range="timeArray" @change="bindEtimeChange">
						<view class="uni-input">{{etime}}</view>
					</picker>
				</view>
				<view class="item arrow" @click="selectTag">
					<text>标签</text>
					<view v-if="tag.length==0" style="color:#666666;">
						请选择类型
					</view>
					<view v-else style="display: flex;align-items: center;">
						<view class="colorDot" :class="tag.className"></view>
						<view>{{tag.tagText}}</view>
					</view>

				</view>
				<view class="item">
					<text>事件</text>
					<textarea @input="eventInput" :value="eventText" placeholder="请输入事件描述哦" />
					</view>
				
				<view class="bottom-btn flex-center" @click="updateTime">
					<view class="btn">完成</view>
				</view>
			</view>
			
			<!-- 标签选择 -->
			<uni-drawer :visible="true" mode="right" @close="selectTag" v-if="showSelectTag">
				<view class="selectTag">
					<view class="title">选择标签类型</view>
					<view class="item" @click="confirmTag" v-for="(item,index) in tagList" :data-index="index">
						<view class="colorDot" :class="item.className"></view>
						<view class="eventType">{{item.tagText}}</view>
					</view>
				</view>
			</uni-drawer>
		</view>
	</view>
</template>

<script>
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue";
	
	export default {
		components: {
			uniDrawer
		},
		data() {
			return {
				userID: uni.getStorageSync('userID'),
				
				showSelectTag: false,
				fulldate:'',
				stime:'0:00',
				etime:'0:00',
				sIndex: 0,
				eIndex: 0,
				timeArray:[[],['00','30']],
				eventText:'',
				tag: '',
				tagIndex: 0,
				tagList: [
					{
						className:'color-red',
						tagText:'拖延'
					},
					{
						className:'color-orange',
						tagText:'工作'
					},
					{
						className:'color-yellow',
						tagText:'学习'
					},
					{
						className:'color-green',
						tagText:'放松'
					},
					{
						className:'color-skyblue',
						tagText:'运动'
					},
					{
						className:'color-purple',
						tagText:'琐事'
					},
					{
						className:'color-darkblue',
						tagText:'娱乐'
					}
				],
			};
		},
		created(){
			//判断是否登录
		  if(!this.userID){  
		     return uni.redirectTo({url:'../../my/login/loginMethod'});
		  }  
		},
		methods:{
			createStimeArray(){
				for(let i=0;i<24;i++){
					this.timeArray[0].push(i)
				}
			},
			selectTag() {
				this.showSelectTag = !this.showSelectTag
			},
			onLoad(option){
				console.log(option)
				 this.fulldate = option.fulldate
				 this.createStimeArray()
				 //初始化开始结束时间
				 var i = option.i;
				 var j = option.j;
				 var m = option.m;
				 var n = option.n;
				 
				 var k;
				 if(j==0){
				 	k=(i*2)
				 }else{
				 	k=(i*2)+1
				 }
				 this.sIndex=k
				 this.eIndex=k
				 this.stime = this.timeArray[0][i]+':'+this.timeArray[1][j]
				 this.etime = this.timeArray[0][m]+':'+this.timeArray[1][n]
				 
			},
			confirmTag(e){
				let index = e.currentTarget.dataset.index
				this.tag = this.tagList[index]
				this.tagIndex = index
				this.selectTag()
			},
			eventInput(e){
				this.eventText = e.detail.value
			},
			bindStimeChange(e){
				let i = e.detail.value[0]	//时
				let j = e.detail.value[1]	//分
				this.stime = this.timeArray[0][i]+':'+this.timeArray[1][j]
				var k;
				if(j==0){
					k=(i*2)
				}else{
					k=(i*2)+1
				}
				this.sIndex=k
			},
			bindEtimeChange(e){
				var i = e.detail.value[0]	//时
				var j = e.detail.value[1]	//分
				this.etime = this.timeArray[0][i]+':'+this.timeArray[1][j]
				var k;
				if(j==0){
					k=(i*2)
				}else{
					k=(i*2)+1
				}
				this.eIndex=k-1
			},
			updateTime(){
				
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2];//上一个页面
				var dateId = prevPage.$vm.tableList[0].dateId
				console.log('prevPage',dateId)
				
				let formdata = {
					userID: uni.getStorageSync('userID'),
					date: this.fulldate,
					indexBegin: this.sIndex,
					indexEnd: this.eIndex,
					tag: this.tagIndex,
					event:this.eventText
				}
				this.$u.post('/api/time/update', formdata).then(res => {
					console.log('更新time===>', res);

						uni.navigateBack({
							delta: 1
						})

				});
				
			}
		}
	}
</script>

<style scoped lang="scss">

	.addEvent {
		font-size: 30upx;

		.item {
			background-color: #FFFFFF;
			display: flex;
			padding: 25upx 25upx;
			margin-bottom: 2upx;

			text {
				text-align: center;
				width: 150upx;
			}
		}

	}

	.selectTag {
		.title {
			height: 100upx;
			line-height: 100upx;
			text-align: center;
			font-size: 34upx;
			font-weight: bold;
		}

		.item {
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			padding: 20upx;
			margin-bottom: 2upx;
		}
		
	}
	
	.colorDot {
		width: 24upx;
		height: 24upx;
		border-radius: 50%;
		margin: 0 30upx;
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
