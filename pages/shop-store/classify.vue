<template>
	<view class="bg-F0F0F0">
		<view class="uni-card margin-0 box-shadow-none">
		    <view class="uni-list">
				<view class="uni-list-cell uni-collapse">
				    <view class="uni-list-cell-navigate uni-navigate-right" hover-class="uni-list-cell-hover" @click="search('0','')">全部产品</view>
				</view>
		        <view class="uni-list-cell uni-collapse" v-for="(list,index) in lists" :key="index" :class="{'border-bb0': list.subcategory.length}">
		            <view class="uni-list-cell-navigate uni-navigate-right" hover-class="uni-list-cell-hover" @click="search(list.id,list.name)">
		                {{list.name}}
		            </view>
		            <view class="uni-list uni-collapse uni-active" v-if="list.subcategory.length">
						<view class="com-row classify-list">
							<view class="com-col-xs-6 classify-list-item" v-for="(subcategory,key) in list.subcategory" :key="key">
								<view class="classify-list-item-text bg-F5F5F5 text-ac uni-ellipsis" @click="search(subcategory.id,subcategory.name)">{{subcategory.name}} </view>
							</view>
						</view>
		            </view>
		        </view>
		    </view>
			<ftb-footbar></ftb-footbar>
		</view>
	</view>
</template>

<script>
	import apiurl from '@/tools/api-url.js';
	import ajax from '@/tools/http-ajax.js';
	import ftbFootbar from '@/pages/common-templete/fab-footbar-menu.vue'
	import app from '@/tools/global-helper'

	export default {
		data() {
			return {
				lists: [],
				comid: 0,
			};
		},
		components:{
			ftbFootbar
		},
		onLoad(options){
			this.comid = options.comid
			},
		onShow(){
			this.getData()
			app.BrowseFlow.add(app.BrowseFlow.behav.shopclassify.key, {tocomid: this.comid});
		},
		methods:{
			search(id,name){
				app.pageNavBack('pages/shop-store/index', 'selclassifyback', {
					'classifydata': {
						classid: id,
						classname: name
					}
				}, this);
			},
			getData(){
				let that = this
				ajax.uniajax({
					url:apiurl.geturl('shop.QprShopCategory'),
					data: {
						shopcomid: that.comid,
						sence:1
						},
					success: (res) => {
					    let appdata = res.data.app;
					    if (res.success){
					        this.lists = appdata.category
					    }
					}
				})
			}
		},
		onShareAppMessage() {
			return {
			  title: '店铺分类',
			  path: '/pages/shop-store/classify?comid='+this.comid
			}
		},
	}
</script>

<style scoped>
.classify-list{overflow:hidden;}
.classify-list .classify-list-item .classify-list-item-text{margin-top:12upx; padding:16upx 8upx;}
.classify-list .classify-list-item:nth-of-type(1) .classify-list-item-text{margin-top:0upx;}
.classify-list .classify-list-item:nth-of-type(2) .classify-list-item-text{margin-top:0upx;}
.classify-list .classify-list-item:nth-of-type(2n) .classify-list-item-text{margin-left:6upx;}
.classify-list .classify-list-item:nth-of-type(2n+1) .classify-list-item-text{margin-right:6upx;}
</style>
