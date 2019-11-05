<template>
	<view class="bg-F0F0F0">
		<shop-head :activeId="page" :comid="comid" @navChange="handleNavChange" @navSearch="handleNavSearch"></shop-head>
		<block v-if="page=='home'">
			<index-home :comid="comid" :time="homeConf.time" @handleProMore="handleProMore"></index-home>
		</block>
		<block v-if="page=='product'">
			<index-product :comid="comid" :time="productConf.time" :keyword="productConf.keyword" :classid="productConf.classid" :classname="productConf.classname"></index-product>
		</block>
		<ftb-footbar></ftb-footbar>
	</view>
</template>

<script>
import ftbFootbar from '@/pages/common-templete/fab-footbar-menu.vue'
import shopHead from './shop-head.vue';
import indexHome from './index-home.vue';
import indexProduct from './index-product.vue';
import app from '@/tools/global-helper'
export default {
	data() {
		return {
			comid: 0,
			page: 'home',
			productConf: {
				time: new Date().getTime(),
				keyword: '',
				classid: 0,
				classname: ''
			},
			homeConf: {
				time: new Date().getTime()
			}
		};
	},
	onLoad(options) {
		if (options.page) {
			this.page = options.page;
		}
		if (options.comid) {
			this.comid = options.comid;
		}
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		let that = this;
		app.getPageParamByNavBack('selclassifyback', function(data){
			let classifydata = data.classifydata;
			if(classifydata){
				that.productConf = {
					keyword: '',
					classid: classifydata.classid,
					classname: classifydata.classname,
					time: new Date().getTime()
				};
				that.page = 'product';
			}
		}, that);
	},
	watch: {
		page() {
			this.setNavBarTitle();
		}
	},
	methods: {
		setNavBarTitle() {
			uni.setNavigationBarTitle({
				title: this.page === 'home' ? '店铺首页' : '店铺产品'
			});
		},
		handleNavChange(page) {
			this.productConf = {
				keyword: '',
				classid: 0,
				classname: '',
				time: new Date().getTime()
			};
			this.page = page;
		},
		handleNavSearch(keyword) {
			this.productConf = {
				keyword: keyword,
				classid: 0,
				classname: '',
				time: new Date().getTime()
			};
			this.page = 'product';
		},
		handleProMore(page) {
			this.page = page;
		}
	},
	onShareAppMessage() {
		let title = '';
		let urlpath = '';
		if (this.page === 'home') {
			title = '店铺首页';
			urlpath = '/pages/shop-store/index?comid=' + this.comid + '&page=home';
		} else if (this.page === 'product') {
			title = '产品展示';
			urlpath = '/pages/shop-store/index?comid=' + this.comid + '&page=product';
		}
		return {
			title: title,
			path: urlpath
		};
	},
	components: {
		shopHead,
		indexHome,
		indexProduct,
		ftbFootbar
	}
};
</script>
