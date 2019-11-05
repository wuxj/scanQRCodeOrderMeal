<template>
	<div class="recording">
		<h6 class="recording-title">{{draw ? '正在录音...' : '长按录音'}}</h6>
		<!-- 此处可放置倒计时，可根据需要自行添加 -->
		<!-- <div class="recording-time"> 
			{{seconds}} : {{ms}}
		</div> -->
		<div class="recording-box">
			<canvas canvas-id="canvas" style="width:100px;height:100px;">
				<span class="recording-button" @touchstart="start" @touchmove="move" @touchend="end"></span>
			</canvas>
		</div>
	</div>
</template>

<script>
	let recorderManager = null;
	// #ifdef MP-WEIXIN || MP-BAIDU
	recorderManager = uni.getRecorderManager();
	// #endif
	export default {
		data() {
			return {
				max: 600000, // 录音最大时长10minute，单位毫秒
				frame: 50, // 执行绘画的频率，单位毫秒
				longTag: false, // 判定长按和点击的标识
				maxTiming: false, // 最长录音时间的定时器
				draw: undefined // 录音过程圆圈动画
			}
		},
		onLoad() {},
		onShow() {},
		methods: {
			start: function() {
				let that = this;
				uni.authorize({
					scope: 'scope.record',
					success() {
						that.longTag = setTimeout(that.recording,500); // 定义超过500ms即为长按，可自行修改
					}
				})
			},
			move: function() {
				clearTimeout(this.longTag);
				clearTimeout(this.maxTiming);
				clearInterval(this.draw);
				this.longTag = false;
			},
			end: function() {
				clearTimeout(this.longTag);
				clearTimeout(this.maxTiming);
				clearInterval(this.draw);
				if (this.longTag) { // timeout不是false证明没有触发recording或者touchmove事件
				}
				this.longTag = false;
				this.draw = false;

				// 语音转换
				this.send();
			},
			recording: function() {
				let self = this;

				// 开始录音
				this.longTag = false;
				if(recorderManager){
					recorderManager.start({
						format: "mp3"
					});
				}

				// 最大录音时间
				this.maxTiming = setTimeout(function() {
					clearInterval(this.draw);
					// 语音转换
					self.send();
				}, self.max);

				// 录音过程圆圈动画
				let angle = -0.5;
				let context = uni.createCanvasContext('canvas');
				this.draw = setInterval(function() {
					context.beginPath();
					context.setStrokeStyle("#1296db");
					context.setLineWidth(3);
					context.arc(50, 50, 25, -0.5 * Math.PI, (angle += 2 / (self.max / self.frame)) * Math.PI, false);
					context.stroke();
					context.draw();
				}, self.frame);
			},
			send: function() {
				let that = this
				if(recorderManager){
					recorderManager.stop();
					recorderManager.onStop(function(res) {
						// self.voicePath = res.tempFilePath;
						that.$emit('handlerecord', res)
					});
				}
			},
			timing: function() {},
			reset: function() {}
		}
	}
</script>

<style scoped>
	.recording {
		/* position: absolute; */
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		/* background: #E7E7E7; */
	}

	.recording-content {
		flex-grow: 1;
		padding: 10upx;
		font-size: 32upx;
		color: #1296DB;
		background: #fff;
	}

	.recording-title {
		padding: 20upx;
		text-align: center;
		font-size: 32upx;
		color: #1296DB;
	}

	.recording-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	#canvas {
		position: relative;
		width: 200upx;
		height: 200upx;
		z-index: 10;
	}

	.recording-button {
		position: absolute;
		box-sizing: border-box;
		top: 50upx;
		left: 50upx;
		display: inline-block;
		width: 100upx;
		height: 100upx;
		border: 1px dashed #1296DB;
		border-radius: 100upx;
		background: url(../../../static/inquiry/recording.png) no-repeat 50% 50%;
		background-size: 50% 50%;
		z-index: 100;
	}

	.recording-time {
		text-align: center;
		font-size: 40upx;
		color: #1296db;
	}
</style>
