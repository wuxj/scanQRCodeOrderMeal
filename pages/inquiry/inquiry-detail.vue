<template>
	<view class="bg-F2F2F2">
		<block v-if="kuaisuList">
			<view class="bg-FFF uni-flex padded-20">
				<view class="uni-flex-item">询价单号: {{kuaisuList.sn}}</view>
				<view class="c-999">{{kuaisuList.inputdate}}</view>
			</view>
			<view class="bg-FFF uni-flex border-bt1 c-444 padded-t20 padded-b20">
				<view class="bg-F9F9F9 text-ac padded-10 margin-l10">
					<image class="square-120" :src="kuaisuList.pinpai_image" mode="aspectFit"></image>
				</view>
				<view class="uni-flex-item padded-10">
					车型：{{kuaisuList.pinpai_name}}
				</view>
			</view>
			<view class="bg-FFF" v-if="kuaisuList.xunjia_image.length">
				<view class="margin-l30 padded-t20">铭牌图、车头图、旧件图、清单图片</view>
					<view class="margin-l10" >
						<view class="dis-inline margin-10 border-b1 fs-0 padded-4" v-for="(item,index) in kuaisuList.xunjia_image" :key="index">
							<image class="square-160" @tap="previewImage" :data-index="index" :src="item" mode="aspectFit"></image>
						</view>
					</view>
			</view>
			<view class="bg-FFF" v-if="kuaisuList.xunjia_remark">
				<view class="margin-l30 padded-t20 padded-b20">
					<view class="">备注信息：</view>
					<view>{{kuaisuList.xunjia_remark}}</view>
				</view>
			</view>
		</block>
		
		<block v-if="jinzhunList">
			<view class="bg-FFF uni-flex padded-20">
				<view class="uni-flex-item">询价单号: {{jinzhunList.sn}}</view>
				<view class="c-999">{{jinzhunList.inputdate}}</view>
			</view>
			<view class="bg-FFF uni-flex border-bt1 c-444 padded-t20 padded-b20">
				<view class="bg-F9F9F9 text-ac padded-10 margin-l10">
					<image class="square-120 marl" :src="jinzhunList.pinpai_image" mode="aspectFit"></image>
				</view>
				<view class="uni-flex-item padded-10">
					  车型：{{jinzhunList.chexing}} {{jinzhunList.niankuan}} {{jinzhunList.cheliangname}}
					  <view v-if="jinzhunList.vin">
						车架号：{{jinzhunList.vin}}
					  </view>
				</view>
			</view>
			
			<view class="bg-FFF com-form margin-t10">
				<view>品质范围:</view>
				<text class="padded-l10">{{jinzhunList.pinzhi}}</text>
			</view>
			
			<view class="bg-FFF com-form">
				<view>发票类型:</view>
				<text class="padded-l10">{{jinzhunList.fapiaotype===1 ? '不需要开发票' :(jinzhunList.fapiaotype===2? '普通发票' : '增值税发票')}}</text>
			</view>
			
			<view class="bg-FFF com-form" v-if="jinzhunList.peijian">
				<view class="com-form-hd">
					<view class="filed-label">询价配件:</view>
				</view>
			</view>
			
			<view class="bg-FFF com-form uni-column" v-for="item in jinzhunList.peijian">
				<view class="uni-flex w-per-100">
					<view class="uni-flex-item text-break">{{item.name}}</view>
					<view class="padded-l20 c-blue">× {{item.count}}</view>
				</view>
				<view class="padded-20 padded-t0 padded-b0 w-per-100 text-al text-break c-999">
					{{item.peijian_remark}}
				</view>
			</view>
			
			<view class="bg-FFF" v-if="jinzhunList.xunjia_image.length">
				<view class="margin-l30 padded-t20">照片附件：</view>
				<view class="margin-l10">
					<view class="dis-inline margin-10 border-b1 fs-0 padded-4" v-for="(img,index) in jinzhunList.xunjia_image" :key="index">
						<image class="square-160" @tap="previewImage" :data-index="index"  :src="img" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			
			<view class="bg-FFF" v-if="jinzhunList.xunjia_remark">
				<view class="margin-l30 padded-t20 padded-b20">
					<view class="">备注信息：</view>
					<view>{{jinzhunList.xunjia_remark}}</view>
				</view>
			</view>
		</block>
		
	</view>
</template>

<script>
import apiurl from '@/tools/api-url.js'
import ajax from '@/tools/http-ajax.js'
import app from '@/tools/global-helper'
export default{
	data(){
		return{
			id:0,
			jinzhunList:null,
			kuaisuList:null,
			picArr:[]
		}
	},
	onLoad(options){
		this.id = options.id
	},
	onShow(){
		this.getData()
	},
	methods:{
		getData(){
			let that = this
			ajax.uniajax({
				url: apiurl.geturl('XunBaoJia.GetWeiBaiJiaDeXunJiaDetailById'),
				data: {
					comid: app.globalData['mycomid'],
					xj_id: that.id
				},
				success: (res) => {
					if(res.success){
						let appdata = res.data.app
						if( appdata.xunjia_type === 1 ){
							that.jinzhunList = appdata.jingzhun
							that.picArr = that.jinzhunList.xunjia_image
						}else if( appdata.xunjia_type === 2 ){
							that.kuaisuList = appdata.kuaisu
							that.picArr = that.kuaisuList.xunjia_image
						}
					}
				}
			})
		},
		previewImage(e){
			let that = this
			let imageIndex = e.currentTarget.dataset.index
			uni.previewImage({
				current: that.picArr[imageIndex],
				indicator: "number",
				loop: "true",
				urls:that.picArr.join(',').replace(/_s/g, '').split(',')
			})
		}
	}
}
</script>
