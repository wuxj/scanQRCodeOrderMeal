<template>
	<view class="bg-F0F0F0">
		<filter-condition-company @setok="getList" :condition="JSON.stringify(param)"></filter-condition-company>

		<view class="uni-list" v-if="list.length">
		    <block v-for="(item, index) in list" :key="index">
		        <view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="goto(item.id)">
		            <view class="uni-triplex-row">
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
		                    <view class="uni-text-small uni-ellipsis">{{'所属地区：' + item.company_province + ' ' + item.company_city}}</view>
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
		<view v-else-if="!loading" class="uni-center bg-FFF padded-100 padded-l0 padded-r0 c-999">暂无您搜索的数据</view>
	</view>
</template>

<script>
	import filterConditionCompany from './filter-condition-company.vue'

	import uniBadge from "@/components/uni-badge.vue"
	import uniIcon from '@/components/uni-icon.vue'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default {
		components: {
			uniIcon,
			uniBadge,
			filterConditionCompany
		},
		data() {
			return {
				loading: true,
				page:{
					index: 1,
					size: 10,
					total: 1
				},
				param: {},
				list: []
			};
		},
		methods: {
			/**
			 * 获取列表数据
			 * @param param
			 * @param reload
			 */
			getList (param, reload = false) {
				let that = this;
				if(reload) {
					that.page.index = 1;
					that.param = {...param};
				}
				param.pinlei = app.getPinlei().label;
				param.pageindex = that.page.index;
				param.pagesize = that.page.size;
				if (app.globalData.location.province) {
					param.ipprovince = app.globalData.location.province
				}
				ajax.uniajax({
					url: apiurl.geturl('search.companySingle'),
					data: param,
					success: (res) => {
						let list = res.data.app.info;
						let page = res.data.page;
						if (res.success && list) {
							that.list = (that.page.index > 1 ? that.list : []).concat(list);
							that.page.total = page.page_index_max;
						}
						that.loading = false;
					}
				})
			},
			goto (id) {
				uni.navigateTo({
					url: '../shop-store/index?comid=' + id
				});
			}
		},
		onReachBottom: function () {
			if (this.page.index < this.page.total) {
				this.page.index++;
			} else {
			}
		},
		onLoad: function (option) {
			this.param = {...option};
		},
		onShow(){
			let that = this;
			app.getPageParamByNavBack('searchParam', function(data){
				let keyword = data.keyword;
				if(keyword){
					this.param = {...data};
				}
			}, that);
			
			app.setPageInfo({
				title: '{{keyword}}_{{keyword}}厂家/价格/图片_{{keyword}}配件/型号大全 - 汽配人网'.replace(/{{keyword}}/g, (that.param.keyword || '')),
				keyword: '{{keyword}},{{keyword}}价格,{{keyword}}厂家,供应{{keyword}},求购{{keyword}}'.replace(/{{keyword}}/g, (that.param.keyword || '')),
				desc:'汽配人网为您提供{{keyword}}供应信息，包含{{keyword}}价格、图片、厂家及其配件大全等全方位信息供您参考。'.replace(/{{keyword}}/g, (that.param.keyword || ''))
			});
		}
	}
</script>
<style>
	@import '../../common/biz-home.css';

</style>