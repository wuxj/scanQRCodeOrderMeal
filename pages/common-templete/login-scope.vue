<template>
	<view>
		<view class="pop-box" v-if="isOpen">
			<view class="inner-box">
				<view class="box-head">您还未登录</view>
				<view class="box-body">
					<view>请先登录再进行操作</view>
					<view>登录后将自动关联您已绑定的汽配人账号</view>
				</view>
				<view class="box-foot">
					<button class="mini-btn" type="primary" size="mini" plain="true" @click="closeModal">暂不登录</button>
					<button  class="mini-btn" type="primary" size="mini" open-type="getUserInfo" @getuserinfo="getUserInfo">立即登录</button>
				</view>
			</view>
		</view>
		<view class="pop-mask" v-if="isOpen"></view>
	</view>
</template>
<script>
	import app from '@/tools/global-helper'
	export default {
		data() {
			return {
				isOpen: false,
				canIUse: uni.canIUse('button.open-type.' + this.btnType())
			}
		},
		methods: {
			btnType () {
				// #ifdef MP-WEIXIN || MP-BAIDU
				return 'getUserInfo';
				// #endif
				// #ifdef MP-ALIPAY
				return 'getAuthorize';
				// #endif
			},
			checkToLogin (callback) {
				let that = this;
				app.getscopeuserinfo(function (isauthorized) {
					if (isauthorized) {
						that.closeModal();
						
						callback && callback();
						
					} else {
						that.showModal();
					}
					
					app.userInfoReadyCallback = res => {
						that.closeModal();
						
						callback && callback();
					}
				});
			},
			showModal() {
				this.isOpen = true; 
			},
			closeModal() {
				this.isOpen = false;
			},
			getUserInfo (event) {
				let that = this;
				// #ifdef MP-WEIXIN || MP-BAIDU
				app.bindGetUserInfo(event);
				// #endif
				
				if(event.detail.userInfo){
					that.closeModal();
				}
			}
		}
	}
</script>

<style>
	/* 遮罩层 */
	.pop-mask {
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 9998;
	}

	/* 弹出层形式的广告 */
	.pop-box {
		width: 80%;
		position: fixed;
		left: 50%;
		top: 50%;
		background: #FFF;
		border-radius: 10upx;
		z-index: 9999;
		transform: translate(-50%, -50%);
	}
	
	.pop-box .inner-box{
		padding:20upx;
	}
	
	.pop-box .inner-box .box-head{
		text-align:center;
		font-weight:700;
		font-size:32upx;
	}
	
	.pop-box .inner-box .box-body{
		text-align: center;
		color:#999999;
		padding:20upx 0;
	}
	
	.pop-box .inner-box .box-foot{
		padding:20upx 0;
		display:flex;
	}
</style>
