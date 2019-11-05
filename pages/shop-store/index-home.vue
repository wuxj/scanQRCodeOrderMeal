<template>
	<view class="bg-F0F0F0">
		<view class="uni-card-content padded-20 padded-b0" v-if="images.length">
			<image class="w-per-100 h-per-100 margin-b6" mode="widthFix" :src="item" v-for="(item, index) in images" :key="index"></image>
		</view>
		
		<view class="uni-card box-shadow-none margin-t20">
			<view class="uni-card-header">
				<view class="fs-32">
					<text>店铺名片</text>
				</view>
				<!-- <view class="c-999" @click="shopDetail">
					<text class="dis-inline">详细信息</text>
					<uni-icon type="arrowright" stylecls="fs-24 dis-inline c-999"></uni-icon>
				</view> -->
			</view> 
			<shop-cardinfo :time="time" :pagetype="detail" :comid="comid"></shop-cardinfo>
		</view>
		
		<view class="uni-card box-shadow-none margin-t20" v-for="(item,itemindex) in bankuai_supply" :key="itemindex">
			<view class="uni-card-header" v-if="item.bankuai_supply_list.length>0">
				<view class="fs-32">
					<text>{{item.baikuai_name}}</text>
				</view>
				<view class="c-999">
					<text class="dis-inline" @click="productlist">更多</text>
					<uni-icon type="arrowright" stylecls="fs-24 dis-inline c-999"></uni-icon>
				</view>
			</view> 
			<view class="uni-card-content">
				<view class="uni-product-list">
					<view class="uni-product" v-for="(product,index) in item.bankuai_supply_list" :key="index" @click="productDetail(product.proid)">
						<view class="image-view bg-F9F9F9 padded-4">
							<image v-if="renderImage" mode="aspectFit" class="uni-product-image" :src="product.proimg ? product.proimg : 'http://img.qipeiren.com/qipeiren/Images/nopic.gif'"></image>
						</view>
						<view class="uni-product-title text-ellipsis">{{product.proname}}</view>
						<view class="uni-product-price">
							<text class="uni-product-price-original c-F60">￥{{product.proprice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue'	
	import shopCardinfo from './shop-cardinfo'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'

	export default {
		components:{
			uniIcon,
			shopCardinfo
		},
		data() {
			return {
				bankuai_supply: [],
				renderImage: false,
				detail:'home',
				images:[]
			};
		},
		props:['comid', 'time'],
		watch: {
			time: {
				handler(){
					this.pageindex = 1;
					this.loadData(true);
					
					app.BrowseFlow.add(app.BrowseFlow.behav.shopindex.key, {tocomid: this.comid});
				},
				immediate: true
			}
		},
		methods:{
			loadData(isreloaed) {
				let that = this
			    if (isreloaed) {
			        that.bankuai_supply = [];
			    }
				
				// ajax 调取接口
				ajax.uniajax({
					url:apiurl.geturl('shop.QprShopHome'),
					data:{
						shopcomid: that.comid,
						topnum:10,
						sence:1
						},
					success:(res)=>{
						if(res.success){
							
							let appdata = res.data.app
							that.bankuai_supply = appdata.bankuai_supply
							that.renderImage = true;
						}
					}
				})
				
				that.getWXCard()
			},
			shopDetail () {
				uni.navigateTo({
					url: 'shop-detail?comid='+this.comid
				});
			},
			productDetail (id) {
				uni.navigateTo({
					url: 'product-detail?productid='+id
				});
			},
			productlist(){
				this.$emit('handleProMore', 'product')
			},
			/**
			 * 微名片信息
			 */
			getWXCard(){
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('XiaoChengXu.GetWeiXinCard'),
					data: {
						comid: that.comid,
						unionid:app.globalData['unionId'],
					},
					success: (res) => {
						if(res.success){
							let appdata = res.data.app.cominfo
							if(appdata.mobile && appdata.zhuyingchanpin && appdata.zhuyingchexing){
								that.images = appdata.picurl
							}
						}
					}
				})
			},
		},
		onPullDownRefresh() {
		    this.loadData(true);
		    uni.stopPullDownRefresh();
		},
		onReachBottom() {
		    this.loadData(false);
		}
	}
</script>

<style>

</style>
