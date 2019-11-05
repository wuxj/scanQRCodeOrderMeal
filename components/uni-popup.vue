<template>
	<view>
		<view class="uni-mask" v-show="show" :style="{top:offsetTop + 'px;'}" @click="maskClosable ? hide() : null"></view>
		<view :class="['uni-popup','uni-popup-'+type]" v-show="show" :style="styleInline">
			{{msg}}
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			width:{
				type: [Number, String],
				default: '380px'
			},
			height: {
				type: [Number, String],
				default: '380px'
			},
			show: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				//top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			msg: {
				type: String,
				default: ""
			},
			maskClosable: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			styleInline () {
				var styleValue = [];
				if(parseFloat(this.width) > 0){
					styleValue.push('width:' + `${this.width}`);
				}
				if(parseFloat(this.height) > 0){
					var h = uni.upx2px(this.height);
					styleValue.push('height:' + `${h}px`);
			
				}
				return styleValue.join(';');
			}
		},
		data() {
			let offsetTop = 0;
			//#ifdef H5
			offsetTop = 44;
			//#endif
			return {
				offsetTop: offsetTop / 750 * 375
			}
		},
		methods: {
			hide: function() {
				this.$emit('hidePopup');
			}
		}
	}
</script>
<style>
	.uni-mask {
		position: fixed;
		z-index: 9998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .3);
	}

	.uni-popup {
		position: fixed;
		z-index: 9999;
		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
	}

	.uni-popup-middle {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		border-radius: 10upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		justify-content: center;
		padding: 10upx;
	}

	.uni-popup-top {
		top: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}

	.uni-popup-bottom {
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}
	
	/* #ifdef MP-BAIDU */
	.uni-popup > swan-template{
		width: 100%;
	} 
	/* #endif */
</style>
