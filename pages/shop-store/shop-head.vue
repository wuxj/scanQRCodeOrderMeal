<template>
	<view class="bg-F0F0F0">
		<view class="page-inner-header">
			<uni-nav-bar color="#333333" background-color="#F0F0F0" fixed="false" statusBar="false">
				<view class="input-view">
					<uni-icon type="search" size="22" color="#666666"></uni-icon>
					<input confirm-type="search" class="input" type="text" placeholder="输入搜索关键词" :value="keyword" @confirm="confirm"/>
				</view>
			</uni-nav-bar>
		</view>
		<view class="uni-flex uni-row w-per-100 fs-28 padded-t20 bg-FFF">
			<view class="margin-l20 margin-r20" style="flex: 1;">
				<view class="uni-flex uni-row">
					<view class="text-ellipsis">
						<text class="fs-28 fw-blod">{{comname}}</text>
					</view>
					<view class="text-nowrap margin-l10">
						<uni-badge stylecls="fs-24 bg-F60" text="旺铺" type="danger" v-if="comisvip>0 && comviptype>0 "></uni-badge>
						<text class="dis-inline margin-l6 fs-24 c-F60" v-if="comisvip>0 && comviptype>0 ">{{comyear}}年</text>
						<uni-icon stylecls="dis-inline margin-l6 fs-24 c-F60" family="qpr-icon" type="realcompany" v-if="comusertype===1"></uni-icon>
						<uni-icon stylecls="dis-inline margin-l6 fs-24 c-F60" family="qpr-icon" type="realpersonal" v-if="comusertype===2"></uni-icon>
					</view>
				</view>
			</view>
			<view class="margin-r20">
				<button class="mini-btn button-reset border-b1 border-bc-F60 c-F60 fs-24 h-50 line-h50 bg-FFF padded-l10 padded-r10" @click="follow">关注</button>
			</view>
		</view>
		<view class="com-row bg-FFF">
			<view class="com-col-5 parts-item padded-t20 padded-b20 text-ac" v-for="page in navBar" @click="shopNavClick(page)">
				<uni-icon :stylecls="{'fs-32 c-F60': page.id === activeId}" family="qpr-icon" :type="page.icon"></uni-icon>
				<view class="fs-28" :class="{'c-F60': page.id === activeId}">{{page.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'	
	import uniBadge from "@/components/uni-badge.vue"
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'

	export default {
		components:{
			uniNavBar,
			uniIcon,
			uniBadge
		},
		data() {
			return {
				comname:'',
				comisvip:0,
				comviptype:0,
				comyear:0,
				comusertype:0,	
				keyword: ''
			};
		},
		props: ['activeId', 'comid'],
		computed:{
			navBar () {
				return [{
					id: 'home',
					name: '店铺首页',
					icon: 'comhome',
					url: 'index'
				}, {
					id: 'product',
					name: '产品展示',
					icon: 'comprodisplay',
					url: 'index'
				}, {
					id: 'classify',
					name: '店铺分类',
					icon: 'comcate',
					url: 'classify'
				}, {
					id: 'briefinfo',
					name: '公司简介',
					icon: 'comprofile',
					url: 'briefinfo'
				}, {
					id: 'contact',
					name: '联系方式',
					icon: 'contactway',
					url: 'contact'
				}]
			}
		},
		onShow(){
			let that = this;
			this.GetTopInfo(function(){
				app.setPageInfo({
					title: that.comname,
					keyword: that.comname,
					desc:that.comname
				});
			});
		},
		watch:{
			keyword(val){
				this.$emit('navSearch', val)
			}
		},
		methods:{
			confirm(e) {
				this.keyword = e.detail.value
				// if(this.keyword){
					this.$emit('navSearch', this.keyword)
				// }
			},
			shopNavClick(page){
				if(page.id==="home" || page.id==="product"){
					this.$emit('navChange', page.id)
				}else{
					uni.navigateTo({
						url: page.url + '?comid=' + this.comid
					});
				}
			},
			/**
			 * 旺铺页面顶部区块内容
			 */
			GetTopInfo(callback){
				let that = this
				ajax.uniajax({
					url:apiurl.geturl('shop.QprShopTopInfo'),
					data:{
						shopcomid: this.comid,
						sence:1
					},
					success:(res)=>{
						let appdata = res.data.app
						if(res.success){
							that.comname = appdata.comname
							that.comisvip = appdata.comisvip
							that.comviptype = appdata.comviptype
							that.comyear = appdata.comyear
							that.comusertype = appdata.comusertype
							
							callback && callback();
						}
					}
				})
			},
			/**
			 * 关注  TODO 登录状态关注
			 */
			follow(){
				let that = this
				ajax.uniajax({
					url:apiurl.geturl('shop.AddShop'),
					data:{
						comid: app.globalData['mycomid'],
						shopcomid: this.comid,
						platformtype: 1
					},
					success:(res)=>{
						let appdata = res.data.app
						if(res.success){
							uni.showToast({
								title: res.message
							})
						}
					}
				})
			}
		}
	}
</script>
<style>
	@import '../../common/biz-home.css';

</style>