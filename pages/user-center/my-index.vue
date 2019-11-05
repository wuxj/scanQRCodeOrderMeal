<template>
	<view class="bg-F0F0F0">
		<view class="bg-FFF padded-20">
			<view class="uni-flex uni-column">
				<view class="uni-list padded-t20 padded-b20 my-center-head">
					<view class="uni-list-cell">
						<view class="uni-media-list">
							<view class="uni-media-list-logo square-120">
								<image class="border-circle border-b1" :src="userInfo.comlogo || '../../static/userInfo/default-tx.jpg'"></image>
							</view>
							<view class="uni-media-list-body h-auto" v-if="isNormalMyComid">
								<view class="uni-media-list-text-top c-FFF">{{userInfo.comname}}</view>
								<view class="uni-media-list-text-bottom c-FFF margin-t20">
									<view class="fs-28">{{userInfo.comperson}} {{userInfo.comphone}}</view>
									<view class="fs-28">{{userInfo.comprovince}} {{userInfo.comcity}}</view>
								</view>
							</view>
							<view class="uni-flex align-items-center" v-else>
								<button class="login-btn" @click="goVerifyPhone">您还未登录，请登录</button>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-flex uni-row margin-t20 justify-item-center" v-if="isNormalMyComid">
					<view class="text-ac border-b1 padded-t10 padded-b10" style="width:48%;" @click="editBaseInfo">
						<uni-icon family="qpr-icon" type="modify" stylecls="dis-inline fs-28 c-F60"></uni-icon>
						<text class="margin-l6">修改基本信息</text>
					</view>
					<view class="text-ac border-b1 padded-t10 padded-b10" style="width:48%;" @click="perfectInfo">
						<uni-icon family="qpr-icon" type="edit" stylecls="dis-inline fs-28 c-F60"></uni-icon>
						<text class="margin-l6">完善身份信息</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="uni-flex uni-row margin-t20 padded-20 padded-t10 padded-b10 justify-item-center" v-if="isNormalMyComid">
			<view class="uni-flex-item text-ac bg-green padded-t10 padded-b10 margin-r10 c-FFF" @click="publishInquiry">
				<text class="margin-l6">发布询价</text>
			</view>
			<view class="uni-flex-item text-ac bg-blue padded-t10 padded-b10 margin-l10 c-FFF" @click="myInquiry">
				<text class="margin-l6">我的询价</text>
			</view>
		</view>
		
		<view class="uni-card box-shadow-none margin-t20" v-if="list.length">
			<view class="uni-card-header">
				<view class="fs-32">
					<text>我收藏的店铺</text>
				</view>
			</view>
			<view class="uni-card-content">
				<view class="uni-card-content-inner padded-0">
					<view class="uni-list">
						<view class="uni-list-cell" v-for="(value,key) in list" :key="key" @click="gotoShop(value.comid)">
							<view class="uni-list-cell-navigate uni-navigate-right uni-media-list">
								<view class="uni-media-list-body">
									<view class="uni-media-list-text-top uni-ellipsis">{{value.comname}}</view>
									<view class="uni-media-list-text-bottom">
										<view class="fs-24">{{value.comprovince}} {{value.comcity}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<login-scope  ref="loginScope"></login-scope>
	</view>
</template>

<script>
	import loginScope from '../common-templete/login-scope.vue'
	import uniIcon from '../../components/uni-icon.vue'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'

	export default {
		components: {
			uniIcon,
			loginScope
		},
		data() {
			return {
				canIUse: uni.canIUse('button.open-type.' + this.btnType()),
				isNormalMyComid: app.globalData['unionId'] && app.globalData['mycomid'],
				userInfo: {
					comname: '',
					comlogo: '',
					comperson: '',
					comphone: '',
					comprovince: '',
					comcity: ''
				},
				list: [],
				page: {
					index: 1,
					size: 10,
					page_total: 1
				}
			};
		},
		onLoad() {
		},
		onShow () {
			this.isNormalMyComid = app.globalData['unionId'] && app.globalData['mycomid'];
			if(this.isNormalMyComid){
				this.reFreshPage();
			}
		},
		onPullDownRefresh () {
			this.page.index = 1;
			this.reFreshPage();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000)
		},
		onReachBottom() {
			if (this.page.index < this.page_total) {
				this.page.index++;
				this.getCollectShops();
			} else {
				// 到底了，无更多数据
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
			reFreshPage () {
				this.getCompanyInfo();
				this.getCollectShops();
			},
			
			/**
			 * 获取用户基本信息
			 */
			getCompanyInfo: function(show = false) {
				ajax.uniajax({
					url: apiurl.geturl('center.GetCompanyInfo'),
					showLoading: show,
					data: {
						comid: app.globalData['mycomid']
					},
					success: (res) => {
						let appdata = res.data.app;
						if (res.success && appdata.info) {
							appdata.info.comlogo = appdata.info.comlogo;
							this.userInfo = { ...appdata.info};
						}
					}
				})
			},
			/**
			 * 查询收藏的店铺列表
			 */
			getCollectShops(show = false) {
				ajax.uniajax({
					url: apiurl.geturl('center.CollectShops'),
					showLoading: show,
					data: {
						comid: app.globalData['mycomid'],
						platformtype: 1,
						pageindex: this.page.index,
						pagesize: this.page.size
					},
					success: (res) => {
						if (res.success) {
							let appdata = res.data.app;
							let newdata = appdata.comlist;
							this.page.page_total = appdata.page.page_index_max;
							let list = this.list;
							if(this.page.index > 1) {
								list = list.concat(newdata);
							} else  {
								list = newdata;
							}
							this.list = list;
						}
					}
				})
			},
			/**
			 * 去店铺首页
			 * @param comid
			 */
			gotoShop(comid) {
				uni.navigateTo({
					url: '/pages/shop-store/index?comid=' + comid
				});
			},
			/**
			 * 编辑基本信息
			 */
			editBaseInfo() {
				uni.navigateTo({
					url: '/pages/user-center/perfectly-base-info'
				});
			},
			/**
			 * 完善身份信息
			 */
			perfectInfo() {
				uni.navigateTo({
					url: './perfectly-ident-info'
				});
			},
			/**
			 * 发布询价
			 */
			publishInquiry (){
				uni.navigateTo({
					url: '/pages/inquiry/inquiry-form/index'
				});
			},
			/**
			 * 我的询价
			 */
			myInquiry (){
				uni.navigateTo({
					url: '/pages/inquiry/inquiry-list'
				});
			},
			/*手机号快捷登录*/
			goVerifyPhone(){
				let that = this;
				that.$refs.loginScope.checkToLogin(function(){
					app.doNormalMyComid(function(){
						that.isNormalMyComid = app.globalData['unionId'] && app.globalData['mycomid'];
						that.reFreshPage();
					});
				});
			}
		}
	}
</script>

<style scoped>
	.my-center-head {
		background: linear-gradient(120deg, #F30 30%, #F60 70%);
	}
	.login-btn{
		background: transparent;
		color: #FFF;
		border: 2upx solid #FFF;
		padding:0 40upx;
	}
</style>
