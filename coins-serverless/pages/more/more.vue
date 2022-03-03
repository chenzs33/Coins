<template>
	<view class="home">
		<!-- 顶部日期 -->
		<uni-nav-bar status-bar="true" fixed="true" background-color="#f0f0f0" color="#000">
			<view class="dayTop">
				<view @click="showDay = true">{{ fulldate }}</view>
				<view :class="{ arrowTransform: !showDay, arrowTransformReturn: showDay }" @click="showDay = true"></view>
			</view>
		</uni-nav-bar>

		<!-- 日历 -->
		<view><u-calendar v-model="showDay" :mode="mode" @change="change"></u-calendar></view>

		<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" active-color="#000" inactive-color="#e6e6e6"></u-tabs-swiper>

		<swiper :style="{ height: swiperHeight }" class="swiper-group" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<!-- TodoList -->
			<swiper-item>
				<scroll-view scroll-y="true" @scrolltolower="onreachBottom" class="scrol">
					<!-- container -->
					<view class="">
						<view class="header">
							<image class="plus" src="../../static/image/plus.png" @click="addTodoHandle" />
							<input class="new-todo" :value="input" placeholder="添加清单.任务" auto-focus @input="inputChangeHandle" @confirm="addTodoHandle" />
						</view>
						<block v-if="todos.length != 0">
							<view class="todos">
								<view
									class="item"
									:class="item.completed ? ' completed' : ''"
									v-for="(item, index) in todos"
									:key="index"
									@click="toggleTodoHandle"
									:data-index="index"
									:data-_id="item._id"
									:data-completed="item.completed"
								>
									<icon class="checkbox" :type="item.completed ? 'success' : 'circle'" />
									<text class="name">{{ item.name }}</text>
									<icon class="remove" type="clear" size="16" @click.stop="removeTodoHandle" :data-index="index" :data-_id="item._id" />
								</view>
							</view>
						</block>
						<block v-else>
							<view class="empty"><text class="title">没有任务，放松一下！</text></view>
						</block>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 番茄钟 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scrol">
					<view class="timer" :class="isRuning ? 'timer--runing' : ''">
						<u-popup v-model="showTomato" height="400rpx" mode="bottom" border-radius="14">
							<view class="settingBox">
								<view class="section panel">
									<text class="section_title">工作时长(分钟)</text>
									<view class="section_body">
										<slider @change="changeWorkTime" show-value="true" min="1" max="60" :value="workTime" left-icon="cancel" right-icon="success_no_circle" />
									</view>
								</view>

								<view class="section panel">
									<text class="section_title">休息时长(分钟)</text>
									<view class="section_body">
										<slider @change="changeRestTime" show-value="true" min="5" max="60" :value="restTime" left-icon="cancel" right-icon="success_no_circle" />
									</view>
								</view>
							</view>
						</u-popup>

						<view class="timer_main">
							<u-icon class="tomato-setting-icon" name="setting" color="#fff" size="50" @click="showTomato = true"></u-icon>
							<view class="timer_time-wrap">
								<view class="timer_progress_mask"></view>
								<view class="timer_progress timer_left">
									<view class="timer_circle timer_circle--left" :style="{ transform: 'rotate(' + leftDeg + 'deg)' }"></view>
								</view>

								<view class="timer_progress timer_right">
									<view class="timer_circle timer_circle--right" :style="{ transform: 'rotate(' + rightDeg + 'deg)' }"></view>
								</view>
								<text v-if="!completed" class="timer_time">{{ remainTimeText }}</text>
								<image v-if="completed" class="timer_done" src="../../static/image/complete.png"></image>
							</view>
						</view>

						<view class="timer_footer">
							<view @click="startTimer" data-type="work" class="timer_ctrl" :class="isRuning && timerType == 'rest' ? 'hide' : ''">
								{{ isRuning ? '完成' : '工作' }}
							</view>

							<view @click="startTimer" data-type="rest" class="timer_ctrl" :class="isRuning && timerType == 'work' ? 'hide' : ''">
								{{ isRuning ? '完成' : '休息' }}
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import moment from 'moment';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
const db = uniCloud.database();
const collection = db.collection('todo');
const dbCmd = db.command;

const defaultLogName = {
	work: '工作',
	rest: '休息'
};
const actionName = {
	stop: '停止',
	start: '开始'
};

const initDeg = {
	left: 45,
	right: -45
};

export default {
	data() {
		return {
			swiperHeight: '',
			userID: uni.getStorageSync('userInfo')._id,
			list: [
				{
					name: 'TodoList'
				},
				{
					name: '番茄钟'
				}
			],
			// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
			current: 0, // tabs组件的current值，表示当前活动的tab选项
			swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的

			input: '',
			todos: [],
			leftCount: 0,
			allCompleted: false,

			remainTimeText: '',
			timerType: 'work',
			log: {},
			completed: false,
			isRuning: false,
			leftDeg: initDeg.left,
			rightDeg: initDeg.right,
			workTime: 30,
			restTime: 10,
			showTomato: false, //番茄设置

			//日历
			showDay: false,
			mode: 'date',
			fulldate: moment().format('YYYY-MM-DD')
		};
	},
	created() {
		//判断是否登录
		if (!this.userID) {
			return uni.redirectTo({
				url: '../my/login/loginMethod'
			});
		}
	},
	methods: {
		reqTodo(action, params) {
			uni.showLoading({
				title: '请求中'
			});
			return new Promise(resolve => {
				uniCloud.callFunction({
					name: 'todo',
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
		onLoad() {
			uni.getSystemInfo({
				//获取系统信息
				success: res => {
					this.swiperHeight = res.windowHeight - 76 + 'px';
				},
				fail: res => {
					console.log('error');
				}
			});
		},
		//日历选择
		change(e) {
			this.$data.fulldate = e.result;
			this.getTodoList();
		},
		// tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index;
			this.getTodoList();
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
		// scroll-view到底部加载更多
		onreachBottom() {},

		save: function() {
			uni.setStorageSync('todo_list', this.todos);
			uni.setStorageSync('todo_logs', this.logs);
		},

		inputChangeHandle: function(e) {
			this.input = e.detail.value;
		},
		//获取Todo列表
		getTodoList: async function(e) {
			this.reqTodo('getTodo', {
				userID: uni.getStorageSync('uni_id'),
				date: this.fulldate
			}).then(res => {
				this.input = '';
				this.todos = res.data;
			});
		},
		//增加任务
		addTodoHandle: async function(e) {
			if (!this.input || !this.input.trim()) return;
			this.reqTodo('addTodo', {
				userID: uni.getStorageSync('uni_id'),
				date: moment(new Date()).format('YYYY-MM-DD'),
				completed: false,
				name: this.input
			}).then(res => {
				(this.input = ''), (this.leftCount = this.leftCount + 1), this.save();
				this.getTodoList();
			});
		},
		//完成任务
		toggleTodoHandle: async function(e) {
			var index = e.currentTarget.dataset.index;
			var _id = e.currentTarget.dataset._id;
			var completed = e.currentTarget.dataset.completed;

			this.reqTodo('toggleTodo', {
				_id: _id,
				userID: this.userID,
				completed: !completed
			}).then(res => {
				var todos = this.todos;
				todos[index].completed = !todos[index].completed;
				this.todos = todos;
				this.leftCount = this.leftCount + (todos[index].completed ? -1 : 1);
				this.save();
			});
		},
		//移除所有任务
		removeTodoHandle: async function(e) {
			console.log(e);
			var index = e.currentTarget.dataset.index;
			var _id = e.currentTarget.dataset._id;

			this.reqTodo('delTodo', {
				_id
			}).then(res => {
				var todos = this.todos;
				var remove = todos.splice(index, 1)[0];
				(this.todos = todos), (this.leftCount = this.leftCount - (remove.completed ? 0 : 1)), this.save();
			});
		},

		toggleAllHandle: function(e) {
			this.allCompleted = !this.allCompleted;
			var todos = this.todos;
			for (var i = todos.length - 1; i >= 0; i--) {
				todos[i].completed = this.allCompleted;
			}

			(this.todos = todos), (this.leftCount = this.allCompleted ? 0 : todos.length), this.save();
		},

		clearCompletedHandle: function(e) {
			var todos = this.todos;
			var remains = [];
			for (var i = 0; i < todos.length; i++) {
				todos[i].completed || remains.push(todos[i]);
			}

			(this.todos = remains), this.save();
		},

		//番茄钟
		formatTime(time, format) {
			let temp = '0000000000' + time;
			let len = format.length;
			return temp.substr(-len);
		},

		onShow: function() {
			this.getTodoList();

			if (this.isRuning) return;
			let workTime = this.formatTime(uni.getStorageSync('workTime'), 'HH');
			let restTime = this.formatTime(uni.getStorageSync('restTime'), 'HH');

			(this.workTime = workTime), (this.restTime = restTime), (this.remainTimeText = workTime + ':00');
		},

		startTimer: function(e) {
			let startTime = Date.now();
			let isRuning = this.isRuning;
			let timerType = e.target.dataset.type;
			let showTime = this[timerType + 'Time'];
			let keepTime = showTime * 60 * 1000;
			let logName = this.logName || defaultLogName[timerType];

			if (!isRuning) {
				this.timer = setInterval(
					function() {
						this.updateTimer();
						this.startNameAnimation();
					}.bind(this),
					1000
				);
			} else {
				this.stopTimer();
			}

			(this.isRuning = !isRuning), (this.completed = false), (this.timerType = timerType), (this.remainTimeText = showTime + ':00'), (this.taskName = logName);

			this.log = {
				name: logName,
				startTime: Date.now(),
				keepTime: keepTime,
				endTime: keepTime + startTime,
				action: actionName[isRuning ? 'stop' : 'start'],
				type: timerType
			};

			this.saveLog(this.log);
		},

		startNameAnimation: function() {
			let animation = uni.createAnimation({
				duration: 450
			});
			animation.opacity(0.2).step();
			animation.opacity(1).step();
			this.nameAnimation = animation.export();
		},

		stopTimer: function() {
			// reset circle progress
			(this.leftDeg = initDeg.left), (this.rightDeg = initDeg.right);

			// clear timer
			this.timer && clearInterval(this.timer);
		},

		updateTimer: function() {
			let log = this.log;
			let now = Date.now();
			let remainingTime = Math.round((log.endTime - now) / 1000);
			let H = this.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH');
			let M = this.formatTime(Math.floor(remainingTime / 60) % 60, 'MM');
			let S = this.formatTime(Math.floor(remainingTime) % 60, 'SS');
			let halfTime;

			// update text
			if (remainingTime > 0) {
				let remainTimeText = (H === '00' ? '' : H + ':') + M + ':' + S;
				this.remainTimeText = remainTimeText;
			} else if (remainingTime == 0) {
				this.completed = true;
				this.stopTimer();
				return;
			}

			// update circle progress
			halfTime = log.keepTime / 2;
			if (remainingTime * 1000 > halfTime) {
				this.leftDeg = initDeg.left - (180 * (now - log.startTime)) / halfTime;
			} else {
				this.leftDeg = -135;
				this.rightDeg = initDeg.right - (180 * (now - (log.startTime + halfTime))) / halfTime;
			}
		},

		changeLogName: function(e) {
			this.logName = e.detail.value;
		},

		saveLog: function(log) {
			var logs = uni.getStorageSync('logs') || [];
			logs.unshift(log);
			uni.setStorageSync('logs', logs);
		},

		changeWorkTime: function(e) {
			uni.setStorage({
				key: 'workTime',
				data: e.detail.value
			});

			let workTime = this.formatTime(e.detail.value, 'HH');
			(this.workTime = workTime), (this.remainTimeText = workTime + ':00');
		},
		changeRestTime: function(e) {
			uni.setStorage({
				key: 'restTime',
				data: e.detail.value
			});

			let restTime = this.formatTime(e.detail.value, 'HH');
			(this.restTime = restTime), (this.remainTimeText = restTime + ':00');
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #eeeeee;
}

.scrol {
	height: 100%;
}

.header {
	display: flex;
	align-items: center;
	border: 1rpx solid #e0e0e0;
	border-radius: 10rpx;
	box-shadow: 0 0 5rpx #e0e0e0;
	margin-bottom: 30rpx;
	padding: 20rpx;
}

.header .plus {
	width: 41rpx;
	height: 41rpx;
	margin-right: 20rpx;
}

.header .new-todo {
	flex: 1;
	font-size: 28rpx;
}

.todos {
	border: 1rpx solid #e0e0e0;
	border-radius: 10rpx;
	box-shadow: 0 0 5rpx #e0e0e0;
}

.todos .item {
	display: flex;
	align-items: center;
	padding: 25rpx;
	border-bottom: 1rpx solid #e0e0e0;
}

.todos .item:last-child {
	border-bottom: 0;
}

.todos .item .checkbox {
	margin-right: 20rpx;
}

.todos .item .name {
	flex: 1;
	font-size: 30rpx;
	color: #444;
}

.todos .item.completed .name {
	text-decoration: line-through;
	color: #888;
}

/* 
.todos .item .remove {
  cursor: pointer;
}
*/
.footer {
	display: flex;
	justify-content: space-between;
	margin: 30rpx 0;
	padding: 0 10rpx;
	font-size: 26rpx;
	color: #777;
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.empty .title {
	font-size: 40rpx;
	margin: 200rpx 50rpx 50rpx;
	color: #444;
}

.empty .content {
	color: #666;
	text-align: center;
}

// 番茄钟
.container {
	background-color: #fff;
}

.timer_main {
	position: relative;
	display: flex;
	flex: 2;
	justify-content: center;
	align-items: center;
	text-align: center;
	background-color: #8a8a8a;
	transition: all 0.5s;
	z-index: 1;
	padding: 10px 0;
	height: 52vh;
}

.timer_time-wrap {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 150px;
	height: 150px;
	text-align: center;
	transition: all 0.3s;
}

.timer_progress {
	position: absolute;
	top: 0;
	width: 75px;
	height: 150px;
	overflow: hidden;
	transition: all 0.3s;
}

.timer_progress_mask {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	border: 3px solid #8a8a8a;
	opacity: 0.5;
	border-radius: 50%;
}

.timer_left {
	left: 0;
}

.timer_right {
	right: 0;
}

.timer_circle {
	position: absolute;
	top: 0;
	width: 150px;
	height: 150px;
	border: 3px solid transparent;
	border-radius: 50%;
	transition: all 0.3s;
}

.timer_circle--left {
	left: 0;
	border-left: 3px solid #fff;
	border-bottom: 3px solid #fff;
	transform: rotate(45deg);
}

.timer_circle--right {
	right: 0;
	border-right: 3px solid #fff;
	border-bottom: 3px solid #fff;
	transform: rotate(-45deg);
}

.timer_time-right {
}

.timer_time {
	font-size: 40px;
	color: #fff;
	font-weight: lighter;
	transition: font-size 0.3s;
}

.timer_taskName {
	position: absolute;
	top: -100px;
	font-size: 14px;
	letter-spacing: 5px;
	color: #fff;
}

.timer_done {
	width: 64px;
	height: 64px;
}

.timer_inputname {
	position: absolute;
	bottom: -40px;
	width: 100%;
	text-align: center;
	height: 40px;
	padding-left: 10px;
	border-bottom: 1px solid #f2f2f2;
	color: #999;
}

.timer_footer {
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	padding-top: 40px;
	transition: all 0.3s;
}

.timer .timer_ctrl {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-size: 12px;
	color: #fff;
	width: 80px;
	height: 80px;
	margin: 0 20px;
	border-radius: 50%;
	transition: all 0.7s;
	background-color: #8a8a8a;
}

.timer .timer_ctrl text {
}

/*runing style*/

.timer--runing .timer_main {
	flex: 1;
}

.timer--runing .timer_time {
	font-size: 45px;
}

.timer--runing .timer_time-wrap {
	width: 200px;
	height: 200px;
}

.timer--runing .timer_progress {
	width: 100px;
	height: 200px;
}

.timer--runing .timer_circle {
	width: 200px;
	height: 200px;
}

.timer--runing .timer_footer {
	flex: 0;
	position: absolute;
	bottom: 0;
	width: 100%;
	z-index: 10;
}

.timer--runing .timer_ctrl {
	background-color: #8a8a8a;
	height: 30px;
	margin-bottom: 50px;
	border: 1px dashed #dedede;
	border-radius: 20px;
}

.section {
	margin-bottom: 10px;
}

.section_title {
	font-size: 12px;
	color: #999;
}

.section_check {
	margin-right: 5px;
}

.section_tip {
	display: block;
	text-align: right;
	color: #cec9c9;
	padding-bottom: 10px;
}

.section_body {
	margin-top: 15px;
}

.hide {
	display: none !important;
}

.tomato-setting-icon {
	position: absolute;
	right: 30upx;
	top: 30upx;
}

.settingBox {
	text-align: center;
	padding: 40upx;
}

.dayTop {
	display: flex;
	align-items: center;

	.arrowTransform {
		width: 14upx;
		height: 14upx;
		margin-left: 18upx;
		margin-top: -4px;
		border-top: 1upx solid #000;
		border-left: 1upx solid #000;

		transition: 0.1s;
		transform-origin: center;
		transform: rotateZ(-135deg);
	}

	.arrowTransformReturn {
		width: 14upx;
		height: 14upx;
		margin-left: 20rpx;
		margin-top: 2px;
		border-top: 1upx solid #000;
		border-left: 1upx solid #000;

		transition: 0.1s;
		transform-origin: center;
		transform: rotateZ(45deg);
	}
}
</style>
