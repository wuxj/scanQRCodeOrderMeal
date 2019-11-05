<template>
	<view class="bg-F0F0F0">
		<view>
			<view class="page-inner-header">
				<uni-nav-bar color="#333333" background-color="#F0F0F0" fixed="false" statusBar="false">
					<view class="input-view" @click="goSearch">
						<uni-icon type="search" size="22" color="#666666"></uni-icon>
						<input confirm-type="search" disabled class="input" type="text" placeholder="输入搜索关键词" />
					</view>
				</uni-nav-bar>
			</view>
		</view>
		
		<view class="uni-card box-shadow-none margin-t0" v-if="slideAds.length >= 3">
			<view class="uni-card-header">
				<view class="fs-32">
					<text class="c-red">热门</text>
					<text>好货</text>
				</view>
			</view> 
			<view class="uni-card-content">
				<view class="uni-card-content-inner padded-0">
					<swiper :style="{height: slideAdsHeight + 'px'}" circular="true" v-if="slideAds.length" next-margin="70rpx">
					    <swiper-item class="swiper-item" v-for="item in slideAds" :key="index">
					    	 <view class="com-row">
					    	     <view class="com-col-xs-4" v-for="(image, idx) in item" :key="idx" @click="item.clickfn(image.param)">
					    	         <image :style="{width: slideAdsHeight + 'px'}" mode="widthFix" :src="image.url"></image>
					    	     </view>
					    	 </view>
					    </swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		
		<view class="uni-card box-shadow-none margin-t0" v-if="list.length">
			<view class="uni-card-header" @click="goMoreProduct">
				<view class="fs-32">
					<text class="c-red">热门</text>
					<text>产品</text>
				</view>
				<view class="c-999">
					<text class="dis-inline" @click="searchProduct">更多</text>
					<uni-icon type="arrowright" stylecls="fs-24 dis-inline c-999"></uni-icon>
				</view>
			</view> 
			<view class="uni-card-content">
				<view class="uni-card-content-inner padded-0">
					<view class="uni-list">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list" :key="key">
							<view class="uni-media-list">
								<view class="uni-media-list-logo square-240 bg-F9F9F9 padded-4"  @click="goProduct(value.id)">
									<image mode="aspectFit" v-if="showImg" :src="value.pro_image"></image>
								</view>
								<view class="uni-media-list-body h-auto">
									<rich-text class="uni-media-list-text-top text-ellipsis-2" @click="goProduct(value.id)" :nodes="value.pro_title"></rich-text>
									<rich-text class="uni-media-list-text-bottom text-ellipsis-2 margin-t6" @click="goProduct(value.id)" :nodes="value.pro_info"></rich-text>
									<view class="uni-flex uni-row w-per-100" @click="goProduct(value.id)">
										<view class="c-red" style="flex: 1;">{{value.pro_price?'￥' + value.pro_price:''}}</view>
										<view class="c-999">{{value.company_diqu}}</view>
									</view>
									<view class="uni-flex uni-row w-per-100 fs-24" @click="goCompany(value.company_id)">
										<view style="flex: 1;">
											<view class="uni-flex uni-row">
												<view class="text-ellipsis">
													<text>{{value.company_name}}</text>
												</view>
											</view>
										</view>
										<view class="flex-item align-items-center justify-item-center">
											<view class="text-nowrap margin-l10">
												<uni-badge stylecls="fs-24 bg-F60" text="旺铺" type="danger" v-if="value.company_is_vip"></uni-badge>
												<uni-icon type="arrowright" stylecls="fs-24 dis-inline c-999"></uni-icon>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<change-market :time="chageMarketConf.time" @selectok="selectMarketOk"></change-market>
	</view>
</template>

<script>
	import changeMarket from '../home/change-market.vue'
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'	
	import uniBadge from "@/components/uni-badge.vue"
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import transQprUrl from '@/tools/trans-qprurl.js'
	import app from '@/tools/global-helper'
	export default {
		components: {
			uniNavBar,
			uniIcon,
			uniBadge,
			changeMarket
		},
		data() {
			return {
				firstLoad:true,
				slideAdsHeight:120,
				slideAds:[],
				chageMarketConf: {},
				pinlei:app.getPinlei().value,
				page:{
					index: 1,
					size: 10,
					total: 1
				},
				busy: false,
				showImg: true,
				list: []
			};
		},
		methods: {
			changeMarket() {
				this.chageMarketConf = {
					time: new Date().getTime()
				}
			},
			/**
			 * 更换品类
			 * @param type
			 */
			selectMarketOk(type) {
				if (type != this.pinlei) {
					app.setPinlei(type);
					this.pinleiflag = app.getPinlei().value;
					this.getList();
					this.getSlideAds();
			    }
			},
			getList () {
				ajax.uniajax({
					url: apiurl.geturl('search.chanpin'),
					data: {
						resultflag: 2,
						pinlei: app.getPinlei().value,
						datafromtype: 1,
						ipprovince: app.globalData.location.province,
						pageindex: this.page.index,
						pagesize: this.page.size
					},
					success: (res) => {
						this.busy = false;
						let list = res.data.app.products;
						let page = res.data.page;
						if (res.success && list) {
							this.list = (this.page.index > 1 ? this.list : []).concat(list);
							this.page.total = page.page_index_max
						}	
					}
				})
			},
			/**
			 *  获取广告数据
			 */
			getSlideAds(show = false) {
				let that = this
				let personas ={
					industry: app.getPinlei().label
				}
				ajax.uniajax({
					url: apiurl.geturl('common.RecommendList'),
					showLoading: show,
					data: {
						size:'200*200',
						site:'MINI',
						personas:escape(JSON.stringify(personas)),
						number: 12
					},
					success: (res) => {
						let appdata = res.data.app;
						if (res.success && appdata.info && appdata.info.length) {
							uni.getImageInfo({
								src:appdata.info[0].pic.replace('http://img.qipeiren.com','https://img.up.qipeiren.com'),
								success: function (image) {
									that.slideAdsHeight = image.height * ((uni.getSystemInfoSync().windowWidth - 50) / 3 / image.width);
								}
							});

							that.slideAds = that.transformAdsData(appdata.info);						
						}
					}
				})
			},
			/**
			 * 转换广告数据
			 * @param data
			 */
			transformAdsData(data) {
				let res = data.map(function (item) {
					let temp = {
						url: item.pic
					};
					let transRes = transQprUrl.exchangebyurl(item.urlwap);
					if(transRes.valid){
						temp.clickfn = transRes.clickfn
						temp.param = transRes.param
					}
					return temp
				});
				
				let ret = [];
				let item = [];
				res.forEach(function(value, index, array){
					item.push(value);
					if((index > 0 && (index + 1) % 3 == 0) || (index == res.length - 1)){
						ret.push(item);
						item = [];
					}
				});
				return ret;
			},
			/**
			 * 查看公司详情
			 * @param id
			 */
			goCompany (id) {
				uni.navigateTo({
					url: '../shop-store/index?comid=' + id
				});
			},
			/**
			 * 查看产品详情
			 * @param id
			 */
			goProduct (id) {
				uni.navigateTo({
					url: '../shop-store/product-detail?productid=' + id
				});
			},
			/**
			 * 更多商品
			 */
			goMoreProduct () {
				uni.navigateTo({
					url: '../search/product-list'
				})
			},
			goSearch () {
				uni.navigateTo({
					url: '/pages/search/filter-search-box'
				});
			},
			searchProduct(){
				uni.navigateTo({
					url: '../search/product-list'
				});
			}
		},
		onShow () {
			let show = this.firstLoad;
			this.getSlideAds(show);
			this.getList();
			this.firstLoad = false;
			
			this.pinleiflag = app.getPinlei().value;
			this.pinleiflagText = app.getPinlei().label;
			if (!this.pinleiflag) {
				this.changeMarket();
			}
		},
		onLoad(option){
		},
		onShareAppMessage() {
			return {
			  title: '发现',
			  path: '/pages/find-out/index'
			}
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh(){
			this.page.index = 1;
			this.getSlideAds();
			this.getList();
			uni.stopPullDownRefresh();
		},
		/**
		 * 上拉触底事件
		 */
		onReachBottom(){
			if (this.busy) return;
			this.busy = true;
			if (this.page.index < this.page.total) {
				this.page.index++;
				this.getList();
			} else {
				uni.showToast({
					title:'没有更多数据咯',
					icon:'none'
				})
			}
		}
	}
</script>
<style>
	@import '../../common/biz-home.css';
</style>