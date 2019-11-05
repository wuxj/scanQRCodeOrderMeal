<template>
	<view class="bg-F2F2F2">
		<view class="com-tabbar">
			<view class="bg-FFF com-tabbar-nav inquiry-position h-100">
				<block v-for="(item, index) in tabs" :key="index">
					<view class="com-tabbar-nav-item" :class="{'com-tabbar-nav-item-on': activeIndex === index}" @click="tabClick(index)">
						<view class="com-tabbar-nav-title" :class="{'c-F60': activeIndex === index}">{{item}}</view>
					</view>
				</block>
			</view>
			<view class="com-tabbar-panel" v-if="activeIndex === 0">
				<form-precise ref="formPrecise" :cartypeData="cartypeItems" @kindsChange="kindsChange"></form-precise>
			</view>
			<view class="com-tabbar-panel" v-else>
				<form-speedy ref="formSpeedy" :cartypeData="cartypeItems"></form-speedy>
			</view>
		</view>
		
		<view class="fixed-bottom-box" v-if="activeIndex === 0">
			<view class="bottom-content">
				<view class="uni-flex uni-row">
					<view style="flex:1;">
						<button class="c-F60 border-b0 border-square fs-32" type="default">共{{precise.kinds}} 种 {{precise.count}} 件</button>
					</view>
					<view style="flex:1;">
						<button class="c-FFF border-b0 border-square fs-32" type="primary" @click="xunjiasubmit('formPrecise')">发布询价</button>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed-bottom-box" v-else>
			<view class="bottom-content">
				<view class="bottom-content">
					<view class="uni-flex uni-row">
						<view style="flex:1;">
							<button class="c-FFF border-b0 border-square fs-32" type="primary" @click="xunjiasubmit('formSpeedy')">立即发布</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import formPrecise from './form-precise.vue'
	import formSpeedy from './form-speedy.vue'
	import app from '@/tools/global-helper'
	
	export default {
		data() {
			return {
				tabs:['精准询价','快速询价'],
				activeIndex: 0,
				cartypeItems:'',
				precise: {
					kinds: 0,
					count: 0
				}
			}
		},
		onShow(){
			let that = this;
			app.getPageParamByNavBack('carTypeBack', function(data){
				let cartypeData = data.cartypeData;
				if(cartypeData){
					that.activeIndex = parseInt(data.preciseOrSpeedyIdx || 0)
					that.cartypeItems = {
						pinpaitype:cartypeData.pinpaitype,
						logo:that.imagePath(cartypeData.pinpaitype) + cartypeData.pinpaiid+'.png',
						pinpai:cartypeData.pinpai,
						pinpaiid:cartypeData.pinpaiid,
						seriesname:cartypeData.seriesname,
						chexing:cartypeData.chexing,
						niankuan:cartypeData.niankuan,
						cheliangname:cartypeData.cheliangname,
						vin: cartypeData.vin || ''
					}
				}
			}, that);
		},
		watch:{},
		methods:{
			imagePath(type) {
				let imagepathArr = ['syc', 'cyc'];
				return 'http://img.qipeiren.com/qipeiren/images/brand-icon-' + imagepathArr[type - 1] + '/';
			},
			tabClick(index){
				this.activeIndex = index;
				this.cartypeItems = ''
			},
			kindsChange(kinds, count){
				this.precise = {
					kinds: kinds,
					count: count
				}
			},
			xunjiasubmit(refname){
				this.$refs[refname].xunjiasubmit();
			}
		},
		components:{
			formPrecise,
			formSpeedy
		}
	}
</script>
