<template>
	<view class="cartype-steps">
		<view class="uni-flex w-per-100">
			<view class="uni-flex-item uni-flex step-itembox" v-for="(item,index) in titles" :key="index" @click="stepClick(index)">
				<view class="uni-flex-item step-line-border margin-t30" :class="{'step-line-bgborder step-solid-bgcircle':index <= activeidx, 'border-radius-left': index == 0}"></view>
				<view class="step-item step-empty-circle border-b1" :class="{'step-line-bgborder':index <= activeidx, 'item-animation': index <= activeidx && animated}">
					<view class="current step-circle margin-10" :class="{'step-solid-bgcircle c-FFF':index <= activeidx}" v-text="item.title"></view>
				</view>
				<view class="uni-flex-item step-line-border margin-t30" :class="{'step-line-bgborder step-solid-bgcircle': index < activeidx, 'border-radius-right': index == titles.length - 1}"></view>
			</view>
		</view>
		<view class="w-per-100 uni-flex">
			<view class="uni-flex-item dis-block text-ac" v-for="(item,index) in titles" :key="index">
				<text class="c-blue" v-if="item.name">{{item.name}}</text>
				<text class="c-999" v-else-if="item.defaultname">{{item.defaultname }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				animated: false
			}
		},
		props: {
			activeidx: { //当前步骤
				type: [Number, String],
				default:1
			},
			titles: Array //数据
		},
		computed: {
		},
		watch:{
			'activeidx': {
				handler (){
					this.animated = false;
					this.animated = !this.animated;
				},
				immediate: true
			}
		},
		methods: {
			stepClick(index){
				this.$emit('stepClick',index)
			}
		}
	}
</script>

<style>
	/* steps */
	@keyframes pulse
	{
		0% {transform:scale(1);}
		50% {transform:scale(1.1);}
		100% {transform:scale(1);}
	}
	.cartype-steps{padding:20upx 30upx; flex-grow: 1; display:flex; flex-wrap:wrap;}
	.cartype-steps .step-empty-circle{width:69upx; height:69upx; border-radius:50upx; background:#FFFFFF; justify-content:center; line-height:69upx; flex-shrink:0; color:#666; font-size:26upx;}
	.cartype-steps .step-circle{width:50upx; height:50upx; border-radius:50upx; background:#F1F1F3; justify-content:center; line-height:50upx; flex-shrink:0; margin-right:15upx; color:#666; font-size:26upx; text-align:center;}
	.cartype-steps .current .step-circle{background:#00B26A; color:#FFFFFF;}
	.cartype-steps .step-item.item-animation{-webkit-animation:pulse 1s .2s ease both; -moz-animation:pulse 1s .2s ease both;}
	.cartype-steps .step-item.item-animation .current{-webkit-animation:pulse 1s .2s ease both; -moz-animation:pulse 1s .2s ease both;}
	.cartype-steps .step-solid-bgcircle{background: #1c7ff3 !important;}
	.cartype-steps .step-line-bgborder{border-color: #1c7ff3 !important;}
	.cartype-steps .step-line-border{border:#F1F1F3 8upx solid; background:#F1F1F3; height:0; line-height:0; font-size:0;}
	.cartype-steps .border-radius-left{border-top-left-radius:8upx;border-bottom-left-radius:8upx;}
	.cartype-steps .border-radius-right{border-top-right-radius:8upx; border-bottom-right-radius:8upx;}
</style>
