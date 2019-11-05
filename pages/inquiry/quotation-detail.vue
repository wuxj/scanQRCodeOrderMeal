<template>
	<view class="bg-F2F2F2" v-if="itemData">
		<block v-if="itemData.xunjia_type==1">
			<view class="padded-20 padded-t6 padded-b6 fs-24">
				询价单号: {{itemData.jingzhun.sn}}
			</view>
			<view class="bg-FFF" v-for="(item,index) in itemData.jingzhun.peijian" :key="index" :class="{'margin-t10':index>0}">
				<view class="uni-flex border-bb1 padded-20">
					<view class="uni-flex-item fw-blod">{{item.name}}</view>
					<view class="c-999 fs-24">{{'需求量 x '+item.count}}</view>
				</view>

				<view class="padded-20 padded-t8 padded-b8 c-999 fs-24">
					配件备注：<text>{{item.xunjia_remark || '暂无'}}</text>
				</view>

				<view class="padded-20 padded-t0">
					<view class="uni-flex border-b1 text-ac bg-F9F9F9">
						<view class="uni-flex-item fs-24 h-60 line-h60"></view>
						<view class="uni-flex-item border-bl1 fs-24 h-60 line-h60">原厂</view>
						<view class="uni-flex-item border-bl1 fs-24 h-60 line-h60">品牌</view>
						<view class="uni-flex-item border-bl1 fs-24 h-60 line-h60">拆车</view>
						<view class="uni-flex-item border-bl1 fs-24 h-60 line-h60">其他</view>
					</view>
					<view class="uni-flex border-b1 border-bt0 text-ac bg-F9F9F9">
						<view class="uni-flex-item border-br1 fs-24 h-60 line-h60">单价(￥)</view>
						<block v-for="(pz,i) in item.pinzhi" :key="i">
							<view class="uni-flex-item border-br1 fs-24 h-60 line-h60 bg-FFF" :class="{'bg-F9F9F9': !pz.price}" v-if="pz.type===1">{{pz.price}}</view>
							<view class="uni-flex-item border-br1 fs-24 h-60 line-h60 bg-FFF" :class="{'bg-F9F9F9': !pz.price}" v-if="pz.type===2">{{pz.price}}</view>
							<view class="uni-flex-item border-br1 fs-24 h-60 line-h60 bg-FFF" :class="{'bg-F9F9F9': !pz.price}" v-if="pz.type===3">{{pz.price}}</view>
							<view class="uni-flex-item border-br1 fs-24 h-60 line-h60 bg-FFF" :class="{'bg-F9F9F9': !pz.price}" v-if="pz.type===4">{{pz.price}}</view>
						</block>
					</view>
				</view>

				<view class="padded-20 padded-t0 padded-b0" v-if="item.productid">
					<view class="uni-flex">
						<view>
							<button type="default" size="mini" class="fs-24">查看产品详情{{item.productid}}</button>
						</view>
						<view class="c-999 uni-flex-item padded-l6 fs-24">
							商家已为您选择了1件汽配人线上商品
						</view>
					</view>
				</view>

				<view class="padded-20 padded-t0 fs-24">
					报价说明：<text class="c-999">{{item.remark || '暂无'}}</text>
				</view>
			</view>
			<view class="bg-FFF margin-t20" v-if="itemData.jingzhun.baojia_image.length">
				<view class="padded-20 padded-t0 padded-b0">
					<view class="">照片附件</view>
				</view>
				<view class="margin-l10">
					<view class="dis-inline margin-10 border-b1 fs-0 padded-4" v-for="(i,index) in itemData.jingzhun.baojia_image" :key="index">
						<image class="square-160" @tap="previewImage" :data-index="index" :src="i" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</block>

		<block v-else>
			<view class="padded-20 padded-t6 padded-b6 fs-24">
				询价单号：{{itemData.kuaisu.sn}}
			</view>
			<view class="bg-FFF uni-flex c-444 padded-t20 padded-b20 border-bb1">
				<view class="bg-F9F9F9 text-ac padded-10 padded-b0 margin-l10">
					<image class="square-120" :src="itemData.kuaisu.pinpai_image" mode="aspectFit"></image>
				</view>
				<view class="uni-flex-item padded-10 fs-24">
					{{itemData.kuaisu.pinpai_name+'询价单'}}
				</view>
			</view>
			<view class="bg-FFF padded-20 padded-t10 padded-b10">
				报价金额：<text class="c-F60 fw-blod">{{'￥'+itemData.kuaisu.money}}</text>
			</view>
			<view class="bg-FFF margin-t10">
				<view class="padded-20 padded-t10 padded-b10 border-bb1">报价详情</view>

				<block v-for="(item,index) in itemData.kuaisu.products" :key="index">
					<view class="padded-20 padded-t10 border-bb1">
						<view class="fs-24">{{item.productname}}</view>
						<view class="uni-flex">
							<view class="uni-flex-item c-999 fs-24">{{'数量： x'+item.productcount}}</view>
							<view class="c-999 fs-24"> {{'单价：￥'+ item.productprice}}</view>
						</view>
					</view>
				</block>
				<view class="padded-20 padded-t10">
					报价说明：<text class="c-999 fs-24">{{itemData.kuaisu.remark || '暂无'}}</text>
				</view>

			</view>
			<view class="bg-FFF margin-t10" v-if="itemData.kuaisu.baojiaimage.length">
				<view class="padded-20 padded-t0 padded-b0">
					<view>照片附件</view>
				</view>
				<view class="margin-l10">
					<view class="dis-inline margin-10 border-b1 fs-0 padded-4" v-for="(item,i) in itemData.kuaisu.baojiaimage" :key="i">
						<image class="square-160" @tap="previewImage" :data-index="i" :src="item" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default {
		data() {
			return {
				xjid: 0,
				itemData: null
			}
		},
		onLoad(options) {
			this.xjid = options.id
		},
		onShow() {
			this.getItemData()
		},
		methods: {
			getItemData() {
				let that = this
				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.GetBaoJiaDetailByEdit'),
					data: {
						comid: app.globalData['mycomid'],
						id: that.xjid
					},
					showLoading: false,
					success: res => {
						if (res.success) {
							let appdata = res.data.app
							if (appdata.xunjia_type === 1) {
								appdata.jingzhun.peijian.map((i) => {
									let temp = i.pinzhi
									let itempz = []
									for (let ii = 1; ii <= 4; ii++) {
										let pzitem = {
											type: ii,
											price: '',
											name: ''
										}
										itempz.push(pzitem)
									}
									let result = itempz.map((x) => {
										temp.map((y) => {
											if (x.type === y.type) {
												x.price = y.price,
													x.name = y.name
											}
											return y
										})
										return x
									})
									return i.pinzhi = result
								})
							} else {
								appdata.kuaisu.money = parseFloat(appdata.kuaisu.money).toFixed(2)
							}
							that.itemData = appdata;
						}
					}
				})
			},
			previewImage(e) {
				let imageIndex = e.currentTarget.dataset.index
				let previewImageArr = this.itemData.xunjia_type == 1 ? this.itemData.jingzhun.baojia_image : this.itemData.kuaisu.baojiaimage
				uni.previewImage({
					current: previewImageArr[imageIndex],
					indicator: "number",
					loop: "true",
					urls: previewImageArr.join(',').replace(/_s/g, '').split(',')
				})
			}
		}
	}
</script>