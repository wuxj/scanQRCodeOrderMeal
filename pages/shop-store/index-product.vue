<template>
	<view class="bg-F0F0F0">
		<view class="uni-card box-shadow-none margin-t20">
			<view class="uni-card-header">
				<view class="fs-32">
					<text>{{ classname || '全部产品' }}</text>
				</view>
			</view>
			<view class="uni-card-content">
				<view class="uni-product-list" v-if="productList.length">
					<view class="uni-product" v-for="item in productList" :key="item.proid" @click="productDetail(item.proid)">
						<view class="image-view bg-F9F9F9 padded-4">
							<image v-if="renderImage" mode="aspectFit" class="uni-product-image" :src="item.proimg ? item.proimg :'http://img.qipeiren.com/qipeiren/Images/nopic.gif'"></image>
						</view>
						<view class="uni-product-title text-ellipsis">{{item.proname}}</view>
						<view class="uni-product-price">
							<text class="uni-product-price-original c-F60">￥{{item.proprice}}</text>
						</view>
					</view>
				</view>
				<view v-else class="uni-center bg-FFF padded-100 padded-l0 padded-r0 c-999">暂无数据</view>
			</view>
		</view>
	</view>
</template>

<script>
import apiurl from '@/tools/api-url.js';
import ajax from '@/tools/http-ajax.js';
import app from '@/tools/global-helper'
export default {
	data() {
		return {
			productList: [],
			renderImage: false,
			pageindex: 1,
			pagesize: 10,

			page: {
				total: 0,
				page_size: 1,
				page_index_max: 6
			}
		};
	},
	props: ['keyword', 'classid', 'classname', 'comid', 'time'],
	watch: {
		time: {
			handler(){
				this.pageindex = 1;
				this.loadData(true);
				app.BrowseFlow.add(app.BrowseFlow.behav.shopproductlist.key, {tocomid: this.comid});
			},
			immediate: true
		}
	},
	methods: {
		loadData(isreloaed) {
			let that = this;

			if (isreloaed) {
				that.productList = [];
			}

			ajax.uniajax({
				url: apiurl.geturl('shop.QprShopProductList'),
				data: {
					shopcomid: that.comid,
					classId: that.classid,
					keyword: that.keyword,
					pageindex: that.pageindex,
					pagesize: that.pagesize,
					sence: 1
				},
				success: res => {
					if (res.success) {
						let appdata = res.data.app;
						that.page = appdata.page;
						that.productList = that.productList.concat(appdata.products);
						that.renderImage = true;
					}
				}
			});
		},
		productDetail(id) {
			uni.navigateTo({
				url: 'product-detail?productid=' + id
			});
		}
	},
	/**
	 * 监听用户下拉动作,一般用于下拉刷新
	 */
	onPullDownRefresh() {
		this.pageindex = 1;
		this.loadData(true);
		uni.stopPullDownRefresh();
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		this.pageindex++;
		if (this.pageindex > this.page.page_index_max) {
			uni.showToast({
				title: '没有更多数据了',
				icon: 'none'
			});
		} else {
			this.loadData(false);
		}
	}
};
</script>
