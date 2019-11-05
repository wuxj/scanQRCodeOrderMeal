<template>
	<view class="bg-F0F0F0">
		<view class="com-tabbar">
			<view class="com-tabbar-nav bg-FFF">
				<block v-for="(item, index) in tabs" :key="index">
					<view :id="index" class="com-tabbar-nav-item" :class="{'com-tabbar-nav-item-on': activeIndex == index}" @click="tabClick">
						<view class="com-tabbar-nav-title">{{item}}</view>
					</view>
				</block>
			</view>
			<view class="com-tabbar-panel">
				<view :hidden="activeIndex != 0">
					<view class="bg-FFF">
						<view class="com-form com-form-input">
							<view class="com-form-hd">
								<view class="filed-label">公司名称</view>
							</view>
							<view class="com-form-bd">
								{{company.comname}}
							</view>
						</view>
						<view class="com-form com-form-input">
							<view class="com-form-hd">
								<view class="filed-label">经营模式</view>
							</view>
							<view class="com-form-bd">
								{{company.comflag}}
							</view>
						</view>
						<view class="com-form com-form-input">
							<view class="com-form-hd">
								<view class="filed-label">所在地区</view>
							</view>
							<view class="com-form-bd">
								{{company.address}}
							</view>
						</view>
						<view class="com-form com-form-input" v-if="company.comprozy">
							<view class="com-form-hd">
								<view class="filed-label">主营产品</view>
							</view>
							<view class="com-form-bd">
								{{company.comprozy}}
							</view>
						</view>
					</view>
					
					<view class="uni-card box-shadow-none margin-t20" v-if="company.cominfo">
						<view class="uni-card-header">
							<view class="fs-32">
								<text>公司介绍</text>
							</view>
						</view> 
						<view class="uni-card-content">
							<view class="padded-20">
								<rich-text class="border-b0" :nodes="company.cominfo"></rich-text>
							</view>
						</view>
					</view>
				</view>
				<view :hidden="activeIndex != 1">
					<view class="bg-FFF" >
						<view class="com-form com-form-input" v-if="companyrz.comisvip>0 && companyrz.comviptype>0">
							<view class="com-form-bd">
								<uni-badge stylecls="fs-24 bg-F60" text="旺铺" type="danger"></uni-badge>
								<text class="dis-inline margin-l6 fs-24 c-F60">{{companyrz.year}}年</text>
							</view>
						</view>
						<view class="com-form com-form-input border-b0">
							<view class="com-form-bd" v-for="item in comuserTypeInfo" v-if="item.comusertype === companyrz.comusertype">
								<uni-icon stylecls="dis-inline margin-r6 fs-24 c-F60" family="qpr-icon" :type="item.type"  :title="item.title"></uni-icon>
								通过<text class="c-F60" v-text="item.comuserText"></text>
							</view>
						</view>
						<template v-if="companyrz.ishow_zhuceinfo">
							<view class="com-form com-form-input bg-F9F9F9 border-b0">
								<view class="com-form-bd" >
									<view class="fs-24">工商注册信息（<text class="c-F60">该信息于{{companyrz.indate}}通过汽配人网认证</text>）</view>
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">公司名称</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.comname}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">注册地址</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q1}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">注册资本</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q2}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">成立日期</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q3}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">注册号</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q4}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">法定代表人</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q5}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">登记机关</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q6}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">企业类型</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q7}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">营业期限</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q8}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">年检时间</view>
								</view>
								<view class="com-form-bd">
									{{companyrz.q9}}
								</view>
							</view>
							<view class="com-form com-form-input">
								<view class="com-form-hd">
									<view class="filed-label">经营范围</view>
								</view>
								<view class="com-form-bd">
								{{companyrz.q10}}
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
		<ftb-footbar></ftb-footbar>
		<view class="fixed-bottom-box">
			<view class="bottom-content">
				<button type="warn" @click="call">拨打电话</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from "@/components/uni-badge.vue"
	import uniIcon from '@/components/uni-icon.vue'
	import ftbFootbar from '@/pages/common-templete/fab-footbar-menu.vue'
	import apiurl from '@/tools/api-url.js';
	import ajax from '@/tools/http-ajax.js'
    import app from '@/tools/global-helper'
	
	export default {
		components:{
			uniBadge,
			uniIcon,
			ftbFootbar
		},
		computed:{
			comuserTypeInfo () {
				return [{
					comusertype: 1,
					type: 'realcompany',
					title: '企业实名',
					comuserText: '企业实名认证'
				}, {
					comusertype: 2,
					type: 'realpersonal',
					title: '个人实名',
					comuserText: '个人实名认证'
				}]
			}
		},
		data() {
			return {
				comid: 0,
				tabs: ["基本信息", "认证信息"],
				activeIndex: 0,
				company:{},
				companyrz:{},
			};
		},
		onLoad(options){
			this.comid = options.comid
		},
		onShow(){
			this.getData()
			app.BrowseFlow.add(app.BrowseFlow.behav.shopbriefinfo.key, {tocomid: this.comid});
		},
		methods:{
			getData(){
				let that = this
				ajax.uniajax({
					url: apiurl.geturl('shop.QprShopIntroduction'),
					data: {
						shopcomid: that.comid,
						sence:1
					},
					success: (res) => {
					    let appdata = res.data.app;

					    if (res.success){
							appdata.compay.cominfo=appdata.compay.cominfo.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
					        that.company = appdata.compay
							that.companyrz = appdata.companyrz
					    }
					}
				})
			},
			call() {
				if(this.company.mobile){
					uni.makePhoneCall({
						phoneNumber: this.company.mobile,
					});
				}
			},
			tabClick: function (e) {
				this.activeIndex = e.currentTarget.id
			}
		},
		onShareAppMessage() {
			return {
			  title: '公司简介',
			  path: '/pages/shop-store/briefinfo?comid='+this.comid
			}
		},
	}
</script>
