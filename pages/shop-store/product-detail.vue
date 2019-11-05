<template>
	<view class="bg-F0F0F0">
		<swiper class="bg-FFF" :style="{height:swiperheight + 'px;'}" circular="true" indicator-dots="true" autoplay="false" interval="8000" duration="1000">
			<block v-for="(item, index) in product.proimage" :key="index">
				<swiper-item>
					<image class="w-per-100 h-per-100" :src="item" mode="aspectFit" />
				</swiper-item>
			</block>
		</swiper>
		<view class="uni-list margin-t20">
		    <view class="uni-list-cell" hover-class="uni-list-cell-hover">
		        <view class="uni-triplex-row">
		            <view class="uni-triplex-left w-per-100">
		                <text class="uni-title text-ellipsis-2">{{product.proname}}</text>
		                <view class="uni-text-small">
		    				<view class="uni-flex">
								<view class="uni-flex-item" v-for="(item,index) in pricesectionlist" :key="index">
									<view class="c-F60 fs-36">￥{{item.price}}</view>
									<view v-if="item.section.length">{{item.section}}</view>
								</view>
		    				</view>
		    			</view>
		            </view>
		        </view>
		    </view>
		</view>
		
		<view class="bg-FFF margin-t20 padded-20" v-if="product.pronumber || product.probrand || product.proarea">
			<view class="uni-flex uni-row padded-t6 padded-b6" v-if="product.pronumber">
					<view class="w-100 c-666">图号</view>
					<view style="flex:1;">{{product.pronumber}}</view>
			</view>
			<view class="uni-flex uni-row padded-t6 padded-b6" v-if="product.probrand">
					<view class="w-100 c-666">品牌</view>
					<view style="flex:1;">{{product.probrand}}</view>
			</view>
			<view class="uni-flex uni-row padded-t6 padded-b6" v-if="product.proarea">
					<view class="w-100 c-666">产地</view>
					<view style="flex:1;">{{product.proarea}}</view>
			</view>
		</view>
		
		<view class="uni-card box-shadow-none margin-t20">
			<view class="uni-card-header">
				<view class="fs-32">
					<text>图文详情</text>
				</view>
			</view> 
			<view class="uni-card-content padded-20">
				<rich-text type = node :nodes="prodescpicurl"></rich-text>
			</view>
		</view>
		<ftb-footbar></ftb-footbar>

		<view class="fixed-bottom-box">
			<view class="bottom-content">
				<view class="uni-flex">
					<view style="flex:1;">
						<button type="default" @click="shophome">店铺首页</button>
					</view>
					<view style="flex:1;">
						<button type="warn" @click="call">拨打电话</button>
					</view>
				</view>
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
			product: {},
			prodescpicurl: [],
			swiperheight:0
		};
	},
	components:{
		ftbFootbar
	},
	onLoad(options) {
		var that = this;
		that.productid = options.productid;

		uni.getSystemInfo({
			success: function (res) {
				that.swiperheight = res.screenWidth
			}
		});

	},
	onShow(){
		let that = this
		that.getData(function(){
			app.setPageInfo({
				title: that.product.proname + ',' + that.product.pronumber + '价格,图片,配件厂家_汽配人网',
				keyword: that.product.proname + ',' + that.product.pronumber,
				desc:'汽配人网为您提供'+ that.product.proname + ',' + that.product.pronumber +'供应信息，包含'+ that.product.proname + ',' + that.product.pronumber +'价格、图片等全方位信息供您参考。'
			});
	
			app.BrowseFlow.add(app.BrowseFlow.behav.productdetail.key, {tocomid: that.product.comid, proid: that.productid});
		});
		that.getProDescription();
	},
	computed:{
		pricesectionlist () {
			let that = this
			let res = []
			for (let i = 0; that.product.pricesectionlist && i < that.product.pricesectionlist.length; i++){
				let item = that.product.pricesectionlist[i]
				let isNormalPrice = parseFloat(item.price) > 0
				res.push({
					price:  isNormalPrice ? item.price : '面议',
					section: isNormalPrice ? that.getNumByPricesection(i, item) : ''
				})
			}
			return res
		}
	},
	methods:{
		/**
		 * 获取价格区间数量
		 */
		getNumByPricesection(index, item){
			let unit = item.person || '件'
			if(item.maxnum === -1){
				return '≥ ' + item.smallnum + unit + (index === 0 ? '起批' : '')
			}else if(item.maxnum > 1){
				return item.smallnum + unit +'-' + item.maxnum + unit
			}
		},
		/**
		 * 解析产品图文详情中的图片
		 */
		getdescimages: function(str) {
			let imgs = str.match(/\<img src=.*?\>/g);
			let picarr = [];
			for (var i in imgs) {
				let item = imgs[i].match(/src=.*[\'|\"]/);
				picarr.push(item[0].replace(/\s.*/g, '').replace(/src=/g, '').replace(/[\'|\"]/g, ''));
			}
			return picarr;
		},
		getData(callback){
			let that = this;
			ajax.uniajax({
				url:apiurl.geturl('Product.QprIndex'),
				data:{productid:that.productid},
				success:(res)=>{
					let appdata = res.data.app;
					if (res.success){
						if(appdata.proimage.length === 0){
							appdata.proimage.push('http://img.qipeiren.com/qipeiren/Images/nopic.gif');
						}
						that.product = appdata
						callback && callback();
					}
				}
			})
		},
		getProDescription(){
			let that = this;
			ajax.uniajax({
				url:apiurl.geturl('Product.GetProductDescription'),
				data:{productid:that.productid,platformtype:2},
				success:(res)=>{
					let appdata = res.data.app;
					if(res.success){
						that.prodescpicurl = appdata.prodesc.replace(/\<img/gi, '<img style="max-width:100%;height:auto"').replace(/\<table.*?\>/gi, '<table>').replace(/\<table/gi, '<table style="table-layout:fixed;max-width:100%;height:auto"')
					}
				}
			})
		},
		/**
		 * 拨打电话
		 */
		call(){
			uni.makePhoneCall({
				phoneNumber: this.product.comshouji
			});
		},
		shophome(){
			uni.redirectTo({
				url: '../shop-store/index?comid=' + this.product.comid
			});
		}
	},
	onShareAppMessage() {
		return {
		  title: '商品详情',
		  path: '/pages/shop-store/product-detail?productid='+this.productid
		}
	},
}
</script>
	
<style>
button::after {
	border: none;
}
</style>

