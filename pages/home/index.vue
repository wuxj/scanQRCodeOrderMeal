<template>
    <view class="bg-F0F0F0" id="content">
        <view class="page-mainhome-header">
			<uni-nav-bar color="#333333" background-color="#F9F9F9" fixed="true" statusBar="false">
				<block slot="left">
					<view class="left-market" @click="changeMarket">
						<view class="market-change">
							<text class="text-nowrap">切换站点</text>
							<uni-icon type="arrowdown" color="#333333" size="18"></uni-icon>
						</view>
						<view class="market-current" v-if="pinleiflagText">当前{{pinleiflagText}}站</view>
					</view>
				</block>
				<view class="input-view" @click="confirm">
					<uni-icon type="search" size="22" color="#666666"></uni-icon>
					<input confirm-type="search" disabled class="input" type="text" placeholder="输入搜索关键词"/>
				</view>
				<block slot="right">
					<view @click="goUserCenter">
					    <uni-icon family="uni-icon" type="contact-filled" color="#333333" size="24"></uni-icon>
					</view>
				</block>
			</uni-nav-bar>
		</view>
        <swiper :style="{height: slideAdsHeight + 'px'}" indicator-dots="true" autoplay="true" interval="5000" duration="500"
                v-if="data.ads.length">
            <swiper-item class="swiper-item" v-for="item in data.ads"
                         @click="item.clickfn(item.param)" :key="index" :item-id="index">
                <image class="w-per-100 h-per-100" mode="widthFix" :src="item.url"></image>
            </swiper-item>
        </swiper>
		<view class="cate-section">
			<view class="cate-item">
				<view class="item-box" @click="goPerfect">
					<text class="qpr-icon icon-identy-info"></text>
				</view>
				<text class="item-txt">完善身份信息</text>
			</view>
			<view class="cate-item">
				<view class="item-box" @click="goPublishInquiry">
					<text class="qpr-icon icon-inquire"></text>
				</view>
				<text class="item-txt">发布询价</text>
			</view>
			<view class="cate-item">
				<view class="item-box" @click="goMyInquiry">
					<text class="qpr-icon icon-inquiryprice"></text>
				</view>
				<text class="item-txt">我的询价</text>
			</view>
		</view>
        <view class="uni-card box-shadow-none margin-t20">
            <view class="uni-card-header">
                <view class="fs-32">
                    <text>汽配</text>
                    <text class="c-red">商圈</text>
                </view>
			    <view class="c-F60" @click="takeBusinesscircle">
			        <text class="dis-inline">订阅更多</text>
			        <uni-icon type="arrowright" stylecls="fs-24 dis-inline c-F60"></uni-icon>
			    </view>
			</view>
            <view class="uni-card-content" v-if="data.businesscircle.length">
                <view class="uni-card-content-inner">
                    <view class="com-row">
                        <view class="com-col-xs-4" v-for="item in data.businesscircle" :key="index" @click="goComList(item)">
                            <view class="border-b1 border-dotted w-per-90 text-ac margin-t10 margin-b10 padded-t10 padded-b10 text-nowrap text-ellipsis-1">{{item.name}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

		<swiper class="margin-t20" :style="{height: secondAdsHeight + 'px'}" indicator-dots="true" autoplay="false" interval="5000" duration="500"
		        v-if="data.secondAds.length">
		    <swiper-item class="swiper-item" v-for="item in data.secondAds"
		                 @click="item.clickfn(item.param)" :key="index">
		        <image class="w-per-100 h-per-100" mode="widthFix" :src="item.url"></image>
		    </swiper-item>
		</swiper>

        <view class="uni-card box-shadow-none margin-t0">
            <view class="uni-card-header">
                <view class="fs-32">
                    <text class="c-red">好品牌</text>
                    <text>推荐</text>
                </view>
				<view class="c-F60" @click="takeCarbrand">
				    <text class="dis-inline">订阅更多</text>
				    <uni-icon type="arrowright" stylecls="fs-24 dis-inline c-F60"></uni-icon>
				</view>
            </view>
            <view class="uni-card-content"  v-if="data.carbrand.length">
                <view class="uni-card-content-inner">
                    <swiper :style="{height: swiperBrandHeight + 'px'}" next-margin="70rpx">
                        <swiper-item class="swiper-item" v-for="(item, key) in data.carbrand" :key="key">
                            <view class="com-row">
                                <view class="com-col-xs-3 padded-t10 padded-b10 text-ac" v-for="(brand, key2) in item"
                                      :key="brand.id" @click="goBrand(brand)">
                                    <image class="square-100" mode="aspectFit" :src="brand.logo"></image>
                                    <view class="fs-28 uni-ellipsis">{{brand.name}}</view>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view>

        <view class="uni-card box-shadow-none margin-t20" v-if="data.company1.length">
            <view class="uni-card-header">
                <view class="fs-32">
                    <text class="c-red">优质</text>
                    <text>商家</text>
                </view>
                <view class="c-999" @click="goComList('')">
                    <text class="dis-inline">更多</text>
                    <uni-icon type="arrowright" stylecls="fs-24 dis-inline c-999"></uni-icon>
                </view>
            </view>
            <view class="uni-card-content">
                <view class="uni-card-content-inner padded-0">
                    <view class="uni-list">
                        <block v-for="(item,index) in data.company1" :key="index">
                            <view class="uni-list-cell" hover-class="uni-list-cell-hover">
                                <view class="uni-triplex-row" @click="goCompany(item.id)">
                                    <view class="uni-triplex-left w-per-100">
                                        <view class="uni-flex uni-row">
                                        	<view class="uni-flex-item uni-ellipsis">
                                        		<text class="uni-title">{{item.company_title}}</text>
                                        	</view>
											<view class="text-nowrap text-ar padded-l10" v-if="item.company_is_vip">
											    <uni-badge stylecls="fs-24 bg-F60" text="旺铺" type="danger"></uni-badge>
											    <text class="dis-inline margin-l6 fs-24 c-F60 text-nowrap">{{item.company_nianxian}}年</text>
											    <uni-icon stylecls="dis-inline margin-l6 fs-24 c-F60 text-nowrap" family="qpr-icon" type="realcompany" title="企业实名" v-if="item.company_shiming_type==1"></uni-icon>
											    <uni-icon stylecls="dis-inline margin-l6 fs-24 c-F60 text-nowrap" family="qpr-icon" type="realpersonal" title="个人实名" v-else-if="item.company_shiming_type==2"></uni-icon>
											</view>
                                        </view>
                                        <view class="uni-text-small uni-ellipsis">{{'所属地区：'  + item.company_province + ' ' + item.company_city}}</view>
                                        <view class="uni-text-small uni-ellipsis"  v-if="item.company_zhuying_pro.length">{{'主营产品：'+ item.company_zhuying_pro}}</view>
                                        <view class="uni-text-small text-ellipsis-2" v-if="item.company_zhuying_car.length">
											<text>主营车型：</text>
											<view class="company-badge margin-r10" v-for="(mainCar, idx) in item.company_zhuying_car" :key="idx">
												<text class="bage-txt">{{mainCar}}</text>
											</view>
										</view>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </view>

        <view class="uni-card box-shadow-none margin-t0">
            <view class="uni-card-header">
                <view class="fs-32">
                    <text class="c-red">零部件</text>
                    <text>大合集</text>
                </view>
            </view>
            <view class="uni-card-content">
                <view class="uni-card-content-inner padded-0">
                    <view class="com-row parts-box">
                        <view class="com-col-xs-3 parts-item padded-t20 padded-b20 text-ac" v-for="item in classifydata" :key="index" @click="goClassify(item.id)">
                            <view class="fs-28 text-ellipsis">{{item.txt}}</view>
                            <image class="square-120" mode="aspectFit" :src="'../../static/home/part/' + item.img"></image>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="uni-card box-shadow-none margin-t20" v-if="data.company2.length">
            <view class="uni-card-header">
                <view class="fs-32">
                    <text class="c-red">优质</text>
                    <text>商家</text>
                </view>
                <view class="c-999" @click="goComList('')">
                    <text class="dis-inline">更多</text>
                    <uni-icon type="arrowright" stylecls="fs-24 dis-inline c-999"></uni-icon>
                </view>
            </view>
            <view class="uni-card-content">
                <view class="uni-card-content-inner padded-0">
                    <view class="uni-list">
                        <block v-for="(item,index) in data.company2" :key="index">
                            <view class="uni-list-cell" hover-class="uni-list-cell-hover">
                                <view class="uni-triplex-row" @click="goCompany(item.id)">
                                    <view class="uni-triplex-left w-per-100">
                                        <view class="uni-flex uni-row">
                                        	<view class="uni-flex-item uni-ellipsis">
                                        		<text class="uni-title">{{item.company_title}}</text>
                                        	</view>
                                        	<view class="text-nowrap text-ar padded-l10" v-if="item.company_is_vip">
                                        	    <uni-badge stylecls="fs-24 bg-F60" text="旺铺" type="danger"></uni-badge>
                                        	    <text class="dis-inline margin-l6 fs-24 c-F60 text-nowrap">{{item.company_nianxian}}年</text>
                                        	    <uni-icon stylecls="dis-inline margin-l6 fs-24 c-F60 text-nowrap" family="qpr-icon" type="realcompany" title="企业实名" v-if="item.company_shiming_type==1"></uni-icon>
                                        	    <uni-icon stylecls="dis-inline margin-l6 fs-24 c-F60 text-nowrap" family="qpr-icon" type="realpersonal" title="个人实名" v-else-if="item.company_shiming_type==2"></uni-icon>
                                        	</view>
                                        </view>
                                        <view class="uni-text-small uni-ellipsis">{{'所属地区：'  + item.company_province + ' ' + item.company_city}}</view>
                                        <view class="uni-text-small uni-ellipsis" v-if="item.company_zhuying_pro.length">{{'主营产品：'+ item.company_zhuying_pro}}</view>
                                        <view class="uni-text-small text-ellipsis-2" v-if="item.company_zhuying_car.length">
                                        	<text>主营车型：</text>
                                        	<view class="company-badge margin-r10" v-for="(mainCar, idx) in item.company_zhuying_car" :key="idx">
                                        		<text class="bage-txt">{{mainCar}}</text>
                                        	</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </view>
        <change-market :time="chageMarketConf.time" @selectok="selectMarketOk"></change-market>
		<login-scope  ref="loginScope"></login-scope>
    </view>
</template>

<script>
	import changeMarket from './change-market.vue'
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import uniBadge from "@/components/uni-badge.vue"
	import loginScope from '../common-templete/login-scope.vue'
	
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import transQprUrl from '@/tools/trans-qprurl.js'
    import app from '@/tools/global-helper'
	export default {
		components: {
			uniNavBar,
			uniIcon,
			uniBadge,
			changeMarket,
			loginScope
		},
		data() {
			return {
				firstLoad: true,
				pinleiflag: app.getPinlei().value,
				pinleiflagText: app.getPinlei().label,
				rightIcon: {type: 'contact-filled'},
				chageMarketConf: {},
				classifydata: classifydata,
				slideAdsHeight:150,				
				secondAdsHeight: 60,
				swiperBrandHeight:100,
				data: {
					ads: [],
					secondAds: [],
					carbrand: [],
					businesscircle: [],
					company: [],
					company1: [],
					company2: []
				}
			}
		},
		onReady () {
        },
		onPageScroll (e) {
		},
		onLoad() {
			app.getLocation();
		},
        onShow () {
			let show = this.firstLoad;
			
			this.getAds(show);
			this.getSecondAds(show);
			this.getQualityCompany(show);
			this.getGoodBrand(show);
			this.getSubscribeProvince(show);
			this.firstLoad = false;
			
			this.pinleiflag = app.getPinlei().value;
			this.pinleiflagText = app.getPinlei().label;
			if (!this.pinleiflag) {
				this.changeMarket();
			}
			
			app.setPageInfo({
				title: '汽配人-专业的汽车配件、汽车配件批发商城、零配件批发市场网',
				keyword: '汽配,汽配人,汽车及配件,汽车汽配网,东风汽配,解放汽配,重汽汽配,汽配网,汽车网',
				desc:'汽配人网(www.qipeiren.com)是国内最具活力的汽车及配件专业网站,涵盖东风、解放、重汽、陕汽、北汽等品牌汽车及配件信息,为汽车汽配行业人士提供即时供求商机、企业信息、行业动态、行业展会、产品参数、汽车及配件价格、维修和保养等...'
			});
        },
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			search() {
				uni.showToast({
					title: '搜索'
				})
			},
			changeMarket() {
				this.chageMarketConf = {
					time: new Date().getTime()
				}
			},
			takeBusinesscircle() {
				uni.navigateTo({
					url: 'take-businesscircle'
				});
			},
			takeCarbrand () {
				uni.navigateTo({
					url: 'take-carbrand'
				});
			},
			/**
			 * 查询汽配圈小程序首页授权用户订阅商圈
			 * @constructor
			 */
			getSubscribeProvince(show = false) {
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('takebusinesscircle.GetHomeSubscribeData'),
					showLoading: show,
					data: {
						unionid: app.globalData.unionId,
                        province: app.globalData.location.province,
						pinleiflag: this.pinleiflagText
					},
					success: (res) => {
						let appdata = res.data.app;
						if (res.success && appdata.info) {
							that.data.businesscircle = appdata.info;
						}
					}
				})
			},
			/**
			 * 查询汽配圈小程序首页品牌推荐
			 * @constructor
			 */
			getGoodBrand(show = false) {
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('takecarbrand.GetGoodBrand'),
					showLoading: show,
					data: {
						unionid: app.globalData.unionId,
						mycomid: app.globalData.mycomid,
						pinleiflag: this.pinleiflag,
						topn: 24
					},
					success: (res) => {
						let info = res.data.app.info;
						if (res.success && info) {
							let list = [];
							let temp = [];
							info.forEach((x, i) => {
								if (i % 12 === 0) {
									if (temp.length) {
										list.push(temp)
			                        }
									temp=[x]
			                    } else {
									temp.push(x)
			                    }
			                });
							if (temp.length) {
								list.push(temp);
			                }
							that.data.carbrand = list;
							
							// 动态高度
							let sHeight = Math.ceil( that.data.carbrand[0].length / 4) * 92;
							that.swiperBrandHeight = sHeight > 92 ? sHeight : 92;
						}
					}
				})
			},
			/**
			 * 查询汽配圈小程序首页优质商家
			 * @constructor
			 */
			getQualityCompany(show = false) {
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('search.companySingle'),
					showLoading: show,
					data: {
						pinlei: that.pinleiflagText,
						pageindex: 1,
						ipprovince: app.globalData.location.province,
                        pagesize: 35
					},
					success: (res) => {
						let list = res.data.app.info;
						if (res.success && list) {
							that.data.company = list;
							that.data.company1 = that.data.company.slice(0, 5);
							that.data.company2 = that.data.company.slice(5);
						}
					}
				})
			},
			/**
			 *  获取头部广告数据
			 */
			getAds(show = false) {
				let that = this;
				that.data.ads = [];
				let personas ={
					industry: that.pinleiflagText
				}
				ajax.uniajax({
					url: apiurl.geturl('common.RecommendList'),
					showLoading: show,
					data: {
						size:'640*300',
						site:'MINI',
						personas:escape(JSON.stringify(personas)),
						number: 3
					},
					success: (res) => {
						let appdata = res.data.app;
						if (res.success && appdata.info && appdata.info.length) {
							
							uni.getImageInfo({
								src:appdata.info[0].pic.replace('http://img.qipeiren.com','https://img.up.qipeiren.com'),
								success: function (image) {
									that.slideAdsHeight = image.height * (uni.getSystemInfoSync().windowWidth / image.width);
								}
							});
					 
							that.data.ads = that.transformAdsData(appdata.info)
						}
					}
				})
			},
			/**
			 *  获取广告数据
			 */
			getSecondAds(show = false) {
				let that = this;
				that.data.secondAds = [];
				let personas ={
					industry: that.pinleiflagText
				}
				ajax.uniajax({
					url: apiurl.geturl('common.RecommendList'),
					showLoading: show,
					data: {
						size:'640*80',
						site:'MINI',
						personas:escape(JSON.stringify(personas)),
						number: 3
					},
					success: (res) => {
						let appdata = res.data.app;
						if (res.success && appdata.info && appdata.info.length) {
							
							uni.getImageInfo({
								src:appdata.info[0].pic.replace('http://img.qipeiren.com','https://img.up.qipeiren.com'),
								success: function (image) {
									that.secondAdsHeight = image.height * (uni.getSystemInfoSync().windowWidth / image.width);
								}
							});
							that.data.secondAds = that.transformAdsData(appdata.info)
						}
					}
				})
			},
			/**
			 * 转换广告数据
			 * @param data
			 */
			transformAdsData(data) {
				let ads = data.map(function (item) {
					let temp = {
						url: item.pic,
						clickfn: function(){}
					};
					let transRes = transQprUrl.exchangebyurl(item.urlwap);
					if(transRes.valid){
						temp.clickfn = transRes.clickfn
						temp.param = transRes.param
					}
					return temp
				});
				return ads;
			},
			/**
			 * 更换品类
			 * @param type
			 */
			selectMarketOk(type) {
				if (type != this.pinleiflag) {
					app.setPinlei(type);
					this.pinleiflag = app.getPinlei().value;
					this.pinleiflagText = app.getPinlei().label;
					this.getAds();
					this.getSecondAds();
					this.getQualityCompany();
					this.getGoodBrand();
					this.getSubscribeProvince();
                }
			},
			/**
			 * 跳到公司列表
			 */
			goComList(businesscircle = {id: 0}) {
				uni.navigateTo({
					url: '../search/company-list?sqid=' + businesscircle.id
				});
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
			goUserCenter() {
				uni.switchTab({
					url: '../user-center/my-index'
				});
			},
			confirm() {
				uni.navigateTo({
					url: '../search/filter-search-box'
				});
			},
			goClassify (id) {
                uni.navigateTo({
                    url: '../search/product-list?classify=' + id
                })
			},
			goBrand (brand) {
				uni.navigateTo({
					url: '../search/company-list?keyword=' + brand.name
				})
            },
			goPerfect () {
				this.$refs.loginScope.checkToLogin(function(){
					app.doNormalMyComid(function(){
						uni.navigateTo({
							url: '../user-center/perfectly-ident-info'
						})
					})
				});
            },
			goPublishInquiry(){
				this.$refs.loginScope.checkToLogin(function(){
					app.doNormalMyComid(function(){
						uni.navigateTo({
							url: '/pages/inquiry/inquiry-form/index'
						})
					})
				});
			},
			goMyInquiry(){
				this.$refs.loginScope.checkToLogin(function(){
					app.doNormalMyComid(function(){
						uni.navigateTo({
							url: '/pages/inquiry/inquiry-list'
						})
					})
				});
			}
		},
		onShareAppMessage() {
			return {
			  title: '首页',
			  path: '/pages/home/index'
			}
		},
		onPullDownRefresh() {
			this.getAds();
			this.getSecondAds();
			this.getQualityCompany();
			this.getGoodBrand();
			this.getSubscribeProvince();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000)
		}
	}
	const classifydata = [{
		id: 101000,
		txt: '发动机系统',
		img: '1.png'
	},
		{
			id: 102000,
			txt: '传动系统',
			img: '2.png'
		},
		{
			id: 103000,
			txt: '行走系统',
			img: '3.png'
		},
		{
			id: 104000,
			txt: '制动系统',
			img: '4.png'
		},
		{
			id: 105000,
			txt: '转向系统',
			img: '5.png'
		}, {
			id: 106000,
			txt: '电器',
			img: '6.png'
		}, {
			id: 107000,
			txt: '车身及驾驶室',
			img: '7.png'
		}, {
			id: 108000,
			txt: '汽车用品',
			img: '8.png'
		}, {
			id: 109000,
			txt: '美容养护',
			img: '9.png'
		}, {
			id: 110000,
			txt: '汽保工具',
			img: '10.png'
		}
	]
</script>
<style>
	@import '../../common/biz-home.css';
</style>
