<template>
	<view class="bg-F0F0F0">
		<filter-condition-product @setok="getList" :condition="JSON.stringify(param)"></filter-condition-product>
		<view class="uni-list" v-if="list.length">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list" :key="key">
				<view class="uni-media-list">
					<view class="uni-media-list-logo square-240 bg-F9F9F9 padded-4" @click="goto(value.id)">
						<image mode="aspectFit" v-if="showImg" :src="value.pro_image"></image>
					</view>
					<view class="uni-media-list-body h-auto">
						<rich-text class="uni-media-list-text-top text-ellipsis-2" @click="goto(value.id)" :nodes="value.pro_title"></rich-text>
						<rich-text class="uni-media-list-text-bottom text-ellipsis-2 margin-t6" @click="goto(value.id)" :nodes="value.pro_info"></rich-text>
						<view class="uni-flex uni-row w-per-100">
							<view class="c-red" style="flex: 1;">{{value.pro_price?'￥'+value.pro_price:''}}</view>
							<view class="c-999">{{value.company_diqu}}</view>
						</view>
						<view class="uni-flex uni-row w-per-100 fs-24" @click="gotoShop(value.company_id)">
							<view style="flex: 1;">
								<view class="uni-flex uni-row">
									<view class="text-ellipsis">
										<text>{{value.company_name}}</text>
									</view>
								</view>
							</view>
							<view class="flex-item align-items-center justify-item-center">
								<view class="text-nowrap margin-l10">
									<uni-badge stylecls="fs-24 bg-F60" text="旺铺" type="danger"  v-if="value.company_is_vip"></uni-badge>
									<uni-icon type="arrowright" stylecls="fs-24 dis-inline c-999"></uni-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else-if="!loading" class="uni-center bg-FFF padded-100 padded-l0 padded-r0 c-999">暂无您搜索的数据</view>
	</view>
</template>

<script>
	import uniBadge from "@/components/uni-badge.vue"
	import uniIcon from '@/components/uni-icon.vue'
	import filterConditionProduct from './filter-condition-product.vue'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default {
		components: {
			uniIcon,
			uniBadge,
			filterConditionProduct
		},
		data() {
			return {
				loading: true,
				showImg: false,
				param: {},
				page:{
					index: 1,
					size: 10,
					total: 1
				},
				list: []
			};
		},
		methods: {
			getList (param, reload = false) {
				if(reload) {
					this.page.index = 1;
					this.param = {...param};
				}
				param.pageindex = this.page.index;
				param.pagesize = this.page.size;
				if (app.globalData.location.province) {
					param.ipprovince = app.globalData.location.province
				}
				ajax.uniajax({
					url: apiurl.geturl('search.chanpin'),
					data: param,
					success: (res) => {
						let list = res.data.app.products;
						let page = res.data.page;
						if (res.success && list) {
							this.list = (this.page.index > 1 ? this.list : []).concat(list);
							this.page.total = page.page_index_max;
						}
						this.loading = false;
					}
				})
			},
			goto (id) {
				uni.navigateTo({
					url: '../shop-store/product-detail?productid=' + id
				});
			},
			gotoShop (id) {
				uni.navigateTo({
					url: '../shop-store/index?comid=' + id
				});
			}
		},
		onReachBottom: function () {
			if (this.page.index < this.page.total) {
				this.page.index++;
				this.getList(this.param);
			} else {
			}
		},
		onLoad(option) {
			this.param = {...option};
			setTimeout(() => {
				this.showImg = true;
			}, 400)
			this.getList(this.param, true);
		},
		onShow(){
			let that = this;
			app.getPageParamByNavBack('searchParam', function(data){
				let keyword = data.keyword;
				if(keyword){
					this.param = {...data};
					this.getList(this.param, true);
				}
			}, that);
			
			app.setPageInfo({
				title: '{{keyword}}_{{keyword}}厂家/价格/图片_{{keyword}}配件/型号大全 - 汽配人网'.replace(/{{keyword}}/g, (that.param.keyword || '')),
				keyword: '{{keyword}},{{keyword}}价格,{{keyword}}厂家,供应{{keyword}},求购{{keyword}}'.replace(/{{keyword}}/g, (that.param.keyword || '')),
				desc:'汽配人网为您提供{{keyword}}供应信息，包含{{keyword}}价格、图片、厂家及其配件大全等全方位信息供您参考。'.replace(/{{keyword}}/g, (that.param.keyword || ''))
			});
		},
		onPageScroll (e) {
		}
	}
</script>
