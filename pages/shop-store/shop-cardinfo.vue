<template>
	<view class="uni-card-content">
		<view class="com-form com-form-input">
		    <view class="com-form-hd">
		        <view class="filed-label">手机号</view>
		    </view>
		    <view class="com-form-bd" @click="call">
		        {{commobile}}
				<uni-icon family="qpr-icon" type="tel" stylecls="fs-24 dis-inline c-F60 margin-l8"></uni-icon>
		    </view>
		</view>
		<view class="com-form com-form-input"  v-if="comtel">
		    <view class="com-form-hd">
		        <view class="filed-label">公司电话</view>
		    </view>
		    <view class="com-form-bd">
		        {{comtel}}
		    </view>
		</view>
		<view class="com-form com-form-input">
		    <view class="com-form-hd">
		        <view class="filed-label">所在地区</view>
		    </view>
		    <view class="com-form-bd">
		        {{address}}
		    </view>
		</view>
		<view class="com-form com-form-input" v-if="companyzy">
		    <view class="com-form-hd">
		        <view class="filed-label">主营产品</view>
		    </view>
		    <view class="com-form-bd">
		        {{companyzy}}
		    </view>
		</view>
		<view class="com-form com-form-input" v-if="companycx">
		    <view class="com-form-hd">
		        <view class="filed-label">主营车型</view>
		    </view>
		    <view class="com-form-bd">
		        {{companycx}}
		    </view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue'	
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'

	export default {
		components:{
			uniIcon
		},
		data() {
			return {
				commobile:'',
				comtel:'',
				address:'',
				companyzy:'',
				companycx:''
			};
		},
		props:['comid', 'time'],
		watch: {
			time: {
				handler(){
					this.getWXCard();
				},
				immediate: true
			}
		},
		onLoad(options){},
		onShow(){
			
		},
		props:['pagetype','comid'],
		methods:{
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
								that.commobile = appdata.mobile
								that.comtel = appdata.comtel
								that.address = appdata.comaddress
								that.companyzy = appdata.zhuyingchanpin
								that.companycx = appdata.zhuyingchexing
								if(that.pagetype === 'shopdetail'){
									that.$emit('cardImag',appdata.picurl)
									}
								}
							}
						}
				});
				
				that.getIntroduction();
			},
			/**
			 * 店铺公司简介
			 */
			getIntroduction(){
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('shop.QprShopIntroduction'),
					data: {shopcomid: that.comid,sence:1},
					success: (res) => {
						if(res.success){
							let appdata = res.data.app
							that.commobile = appdata.compay.mobile
							that.comtel = appdata.compay.tel
							that.address = appdata.compay.address
							that.companyzy = appdata.compay.comprozy
							that.companycx = ''
							}
						}
				})
			},
			call(){
				let that = this;
				if(that.commobile){
					uni.makePhoneCall({
						phoneNumber:that.commobile
					});
				}
			}
		}
	}
</script>