<template>
	<view class="bg-F0F0F0">
		<view class="page-inner-header">
			<uni-nav-bar color="#333333" background-color="#F0F0F0" fixed="false" statusBar="false">
				<view class="input-view">
					<uni-icon type="search" size="22" color="#666666"></uni-icon>
					<input confirm-type="search" @confirm="confirm" class="input" type="text" placeholder="输入搜索关键词" @input="inputWord"/>
				</view>
			</uni-nav-bar>
		</view>
		
		<view class="com-tabbar">
			<view class="com-tabbar-nav bg-FFF">
				<block v-for="(item, index) in tabs" :key="index">
					<view class="com-tabbar-nav-item" :class="{'com-tabbar-nav-item-on': activeIndex === index}" @click="tabClick(index)">
						<view class="com-tabbar-nav-title">{{item}}</view>
					</view>
				</block>
			</view>
			<view class="com-tabbar-panel">
				<view class="bg-FFF">
					<view class="com-form com-form-input" v-if="showHistory && list.length > 0">
						<view class="com-form-bd">
							<view class="uni-flex uni-row justify-item-center">
								<view class="filed-label c-999">搜索历史</view>
								<view class="text-ar" @click="clearHistory"><uni-icon stylecls="fs-24 c-999" family="qpr-icon" type="trash"></uni-icon></view>
							</view>
						</view>
					</view>
					<block v-if="list.length">
						<view class="com-form com-form-input com-form-bb1"  v-for="(item, index) in list" :key="index" @click="goSearchPage(item)">
							<view class="com-form-bd">
								{{item}}
							</view>
						</view>
					</block>
					<view v-if="showHistory && list.length==0" class="uni-center bg-FFF padded-100 padded-l0 padded-r0 c-999">暂无搜索历史记录</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'

	export default {
		components:{
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				showHistory: true,
				keywordModel: '',
				keyword: '',
				busy: false,
				tabs: ["产品", "公司"],
				history:{
					product:[],
					company:[]
				},
				list: [],
				/**
				 * product 从产品列表进入搜索
				 * company 从公司列表进入搜索
				*/
				opentype: 'product',
				activeIndex: 0
			};
		},
		methods:{
			tabClick: function (index) {
				this.activeIndex = index;
				if(this.showHistory) {
					this.list = this.activeIndex === 0 ? this.history.product : this.history.company;
				}
			},
			/**
			 * 确认直接跳到下一个列表，执行搜索
			 */
			confirm (e) {
				let keyword = e.detail.value.trim();
				if(keyword.length){
					this.goSearchPage(keyword);
				}
			},
			/**
			 * 输入 keyword
			 * @param e
			 */
			inputWord (e) {
				let keyword = e.detail.value.trim();
				this.keywordModel = keyword;
				if(keyword) {
					if(this.busy) {
						this.keyword = keyword;
						return;
					}
					this.busy = true;
					this.keyword = '';
					this.getList(keyword);
				} else {
					this.keyword = '';
					this.showHistory = true;
					if (this.activeIndex === 0) {
						this.list = this.history.product;
					} else {
						this.list = this.history.company;
					}
				}
			},
			/**
			 * 请求后端获取搜索的关键字列表
			 * @param keyword
			 */
			getList (keyword) {
				ajax.uniajax({
					url: apiurl.geturl('search.suggest'),
					data: {
						keyword: keyword,
						show_count: 10
					},
					success: (res) => {
						let appdata = res.data.app;
						if (res.success && appdata.suggest_result) {
							if(appdata.suggest_result.length) {
								this.showHistory = false;
								this.list = appdata.suggest_result;
							}
						}
						this.busy = false;
						if (this.keyword) {
							this.getList(this.keyword);
							this.keyword = '';
						}
					}
				})
			},
			/**
			 * 跳转到实际搜索页面
			 * @param keyword
			 */
			goSearchPage (keyword) {
				let that = this
				let gourl = '';
				if (this.activeIndex === 0) {
					this.setHistory(keyword, 'product');
					gourl = '/pages/search/product-list';
				} else {
					this.setHistory(keyword, 'company');
					gourl = '/pages/search/company-list';
				}
				
				app.pageNavBack(gourl, 'searchParam', {
					keyword: keyword
				} , that, function(){
					uni.navigateTo({
						url: gourl + '?keyword=' + keyword
					});
				});
			},
			setHistory(keyword, type){
				let idx = this.history[type].indexOf(keyword);
				if (keyword && idx >= 0) {
					this.history[type].splice(idx, 1);
				}
				this.history[type].splice(0, 0, keyword);
				this.history[type] = this.history[type].slice(0, 10);
				uni.setStorageSync('history' + type, JSON.stringify(this.history[type]));
			},
			/**
			 * 获取本地存的历史数据
			 * @param type
			 * @returns {*}
			 */
			getHistory (type = 0) {
				let key = 'historyproduct';
				if (type === 1) {
					key = 'historycompany'
				}
				try {
					const value = uni.getStorageSync(key);
					if (value) {
						return JSON.parse(value)
					} else {
						return []
					}
				} catch (e) {
					return []
				}
			},
			/**
			 * 清除历史数据
			 */
			clearHistory () {
				uni.showModal({
					title: '提示',
					content: '确定要消除搜索历史记录吗？',
					success: (res) => {
						if (res.confirm) {
							let key = 'historyproduct';
							if (this.activeIndex === 1) {
								key = 'historycompany'
							}
							uni.removeStorage({
								key: key,
								success: (res) => {
									if (this.activeIndex === 0) {
										this.history.product = [];
									} else {
										this.history.company = [];
									}
									this.list = [];
								}
							});
						} else if (res.cancel) {
						}
					}
				});

			},
			preData(){
				this.history.product = this.getHistory(0);
				this.history.company = this.getHistory(1);
				this.list = [...this.history[this.opentype]];
				this.showHistory = true
			}
		},
		/**
		 * 页面加载时
		 */
		onLoad: function (option) {
			this.opentype = option.type == 1 ? 'company' : 'product';
			this.activeIndex = option.type == 1 ? 1 : 0;
			this.preData();
		},
		onShow(){
			let that = this;
			app.getPageParamByNavBack('tabType', function(data){
				let type = data.type;
				if(type){
					that.opentype = type == 1 ? 'company' : 'product';
					that.activeIndex = type == 1 ? 1 : 0;
					that.preData();
				}
			}, that);
		}
	}
</script>

<style>
	@import '../../common/biz-home.css';
</style>
