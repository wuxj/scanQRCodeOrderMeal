<template>
	<view class="bg-FFF">
		<view class="com-form com-form-input">
		    <view class="com-form-hd">
		        <view class="filed-label">{{item.comperson}}</view>
		    </view>
		    <view class="com-form-bd">
		        {{item.commobile}}
		    </view>
		</view>
		<view class="com-form com-form-input">
		    <view class="com-form-hd">
		        <view class="filed-label">地址</view>
		    </view>
		    <view class="com-form-bd">
		        {{item.comaddress}}
		    </view>
		</view>
		<view class="com-form com-form-input" v-if="item.comtel">
		    <view class="com-form-hd">
		        <view class="filed-label">电话</view>
		    </view>
		    <view class="com-form-bd">
		        {{item.comtel}}
		    </view>
		</view>
		<view class="com-form com-form-input">
		    <view class="com-form-hd">
		        <view class="filed-label">手机</view>
		    </view>
		    <view class="com-form-bd">
		        {{item.commobile}}
		    </view>
		</view>
		<view class="com-form com-form-input" v-if="item.comfax">
		    <view class="com-form-hd">
		        <view class="filed-label">传真</view>
		    </view>
		    <view class="com-form-bd">
		       {{item.comfax}}
		    </view>
		</view>
		<ftb-footbar></ftb-footbar>
		<view class="padded-10">
			<!-- #ifdef MP-WEIXIN -->
			<map class="w-per-100 h-500" scale="12" :title="item.comaddress" :latitude="latitude" :longitude="longitude" :markers="covers" @tap="clickMap"></map>
			<!-- #endif -->
		</view>

		<view class="fixed-bottom-box">
			<view class="bottom-content">			
				<button type="warn" @click="call">拨打电话</button>
			</view>
		</view>
	</view>
</template>

<script>
	import ftbFootbar from '@/pages/common-templete/fab-footbar-menu.vue'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'

	export default {
		data() {
			return {
				comid: 0,
				title:'',
				latitude:0,
				longitude:0,
				covers: [{
					latitude: 0,
					longitude: 0,
					iconPath: ''
				}],

				item:{}
			};
		},
		components:{
			ftbFootbar
		},
		onLoad(options){
			this.comid = options.comid
		},
		onShow(){
			this.getData();
			app.BrowseFlow.add(app.BrowseFlow.behav.shopcontact.key, {tocomid: this.comid});
		},
		methods:{
			getMapData(address){
				let that = this
				uni.request({
					url: 'https://apis.map.qq.com/ws/geocoder/v1/?address='+address+'&key='+app.globalData.lbsqq.key,
					data:{},
					output:'JSON',
					header:{
						'content-type':'application/json'
					},
					success:(res)=>{
						if(res.data.status === 0){
						let appdata = res.data.result;
						that.latitude = appdata.location.lat 
						that.longitude = appdata.location.lng
						that.covers[0].latitude = appdata.location.lat 
						that.covers[0].longitude = appdata.location.lng 
						that.covers[0].iconPath = '../../static/location.png'
						}else{
							that.getloactions()
						}
					}
				})
			},
			getData(){
				let that = this;
				ajax.uniajax({
					url:apiurl.geturl('shop.QprShopContact'),
					data: {
						shopcomid: that.comid,
						sence:1
					},
					success: (res) => {
					    let appdata = res.data.app;
					    if (res.success){
							that.item = appdata
							that.title = appdata.comaddress
							that.getMapData(appdata.comaddress)
					    }
					}
				})
			},
			call(){
				if(this.item && this.item.commobile){
					uni.makePhoneCall({
						phoneNumber:this.item.commobile
					});
				}
			},
			getloactions(){
				let that = this
				uni.getLocation({
					 type: 'wgs84',
					success: function (res) {
						that.latitude = res.latitude 
						that.longitude = res.longitude
						that.covers[0].latitude = res.latitude 
						that.covers[0].longitude = res.longitude 
						that.covers[0].iconPath = '../../static/location.png'
					}
				})
			}
		},
		onShareAppMessage() {
			return {
			  title: '联系方式',
			  path: '/pages/shop-store/contact?comid='+this.comid
			}
		},
	}
</script>