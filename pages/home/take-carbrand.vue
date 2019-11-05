<template>
	<view class="bg-F0F0F0">
		<view class="page-inner-header">
			<uni-nav-bar color="#333333" background-color="#F0F0F0" fixed="false" statusBar="false">
				<view class="input-view">
					<uni-icon type="search" size="22" color="#666666"></uni-icon>
					<input confirm-type="search" class="input" type="text" placeholder="输入搜索关键词" @input="doSearch"/>
				</view>
			</uni-nav-bar>
		</view>
		<view class="page-list">
			<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}">
				<view class="bg-FFF" v-if="seledArr.length">
					<view class="border-bb1 fs-32 padded-20">已选品牌</view>
					<view class="com-row bg-FFF padded-10 padded-l0 padded-r40">
						<view class="com-col-xs-3 text-ac padded-t20 padded-b20 list-item item-checked" v-for="item in seledArr" :key="item.id" @click="onDelItem(item)">
							<image class="square-70" mode="aspectFit" :src="imagePath + item.id +'.png'"></image>
							<view class="fs-12 text-ellipsis-1">
								{{item.name}}
							</view>
							<view class="selected-markbox">
								<view class="mark-item">
									<view class="qpr-icon icon-delboney c-red fs-18"></view>
								</view>
							</view> 
						</view>
					</view>
					<!-- <view  class="bg-FFF padded-t20 padded-b20 c-999 text-ac" v-else>
						暂未选择任何品牌
					</view> -->
				</view>
				<view class="bg-FFF border-bb1 fs-32 padded-20 margin-t20">全部品牌</view>
				<block v-for="(list, key) in data.list" :id="key" :key="key">
					<view v-if="list.data.length" :id="list.initial">
						<view class="bg-F5F5F5 fs-32 padded-l20">
							{{list.initial}}
						</view>
						<view class="com-row bg-FFF padded-r40">
							<view class="com-col-xs-3 text-ac padded-t20 padded-b20 list-item" v-for="(item,index) in list.data" :key="index"
					 :class="item.checked?'active':''" @click="onSelectItem(item)">
								<image class="square-70" mode="aspectFit" :src="imagePath + item.id +'.png'"></image>
								<view class="fs-12 text-ellipsis-1">
									{{item.name}}
								</view>
								<view class="selected-markbox">
									<view class="mark-item">
										<view class="qpr-icon icon-correct c-red fs-20"></view>
									</view>
								</view> 
							</view>
						</view>
					</view>
				</block>
			</scroll-view>
			<view class="uni-indexed-list-bar" :class="touchmove ? 'active' : ''" @touchstart="touchStart" @touchmove="touchMove"
			 @touchend="touchEnd" @touchcancel="touchCancel" :style="{height:winHeight + 'px', top:titleHeight+'px'}">
				<text v-for="(list,key) in data.list" :key="key" class="uni-indexed-list-text" :class="touchmoveIndex == key ? 'active' : ''"
				 :style="{height:itemHeight + 'px',lineHeight:itemHeight + 'px'}">{{list.initial}}</text>
			</view>
			<view class="uni-indexed-list-alert" v-if="touchmove && touchmoveIndex >= 0">
				{{data.list[touchmoveIndex].initial}}
			</view>
		</view>
	
		<view class="fixed-bottom-box">
			<view class="bottom-content">
				<button type="warn" @click="onConfirm">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'	
	import inquirycartypeDatas from '../../static-source/cartype-data-inquiry'
	import selectItem from '../user-center/select-item'
	
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
				firstLoad: true,
				keyword: '',
				submitLoading:false,
				
				pinleiflag: app.getPinlei().value, // 1:商用车,2:乘用车,3:工程机械
				pinleiflagText: app.getPinlei().label,
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				winHeight: 0,
				scrollViewId: "A",
				titleHeight: 50,
				footerHeight: 50,
				seledArr: [],
				data:{
					list: [],
					maxnum: 24
				}
			}
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title:'订阅车型 / 品牌'
			});
		},
		onShow(){
			let show = this.firstLoad;
			this.getSelectedData(show);
			this.firstLoad = false;
		},
		computed: {
			imagePath () {
				return 'http://img.qipeiren.com/qipeiren/images/brand-icon-'+ ['syc', 'cyc', 'gcjx'][this.pinleiflag - 1] +'/';
			}
		},
		methods: {
			getSelectedData (show = false){
				let that = this;
				ajax.uniajax({
					url:apiurl.geturl('takecarbrand.GetSubscribeData'),
					showLoading: show,
					data: {
						unionid: app.globalData.unionId,
						pinleiflag: this.pinleiflag
					},
					success: (res) => {
						let appdata = res.data.app;
						that.seledArr = appdata.info;
						
						that.preData();
					}
				});
			},
			doSearch (e) {
				let value = e.detail.value.trim();
				this.keyword = value;
				this.data.list = this.getDataList();
			},
			/**
			 * 准备数据
			 */
			preData () {
				this.data.list = this.getDataList();
				let winHeight = uni.getSystemInfoSync().windowHeight - this.titleHeight - this.footerHeight;
				this.itemHeight = winHeight / this.data.list.length;
				this.winHeight = winHeight;
			},
			onConfirm () {
				if(this.submitLoading) return;
				this.submitLoading = true;
				
				let last = [];
				for(let i = 0; i < this.seledArr.length; i++){
					last.push(this.seledArr[i].name);
				}
				
				ajax.uniajax({
					url:apiurl.geturl('takecarbrand.SubmitSubscribeData'),
					data: {
						unionid: app.globalData.unionId,
						brandname: last.join(','),
						pinleiflag: this.pinleiflag
					},
					success: (res) => {
						let appdata = res.data.app;
						this.submitLoading = false;
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
						if (appdata.issuccess){
							uni.navigateBack({
								delta: 1
							});
						}
					}
				});
			},
			onDelItem(dItem){
				this.seledArr = this.seledArr.filter((item) => {
					return item.id !=dItem.id;
				});
				this.data.list.find(item => {
					return item.data.find(cItem => {
						if(cItem.id === dItem.id){
							cItem.checked = false;
						}
						return cItem.id === dItem.id;
					});
				});
			},
			onSelectItem (selItem) {
				let item = this.seledArr;
				let index = item.findIndex((value, index, arr) => {
					return value.id  === selItem.id;
				});
				
				let msg = '';
				if (index >=0 ) {
					item.splice(index, 1);
					selItem.checked = false;
				} else {
					if (item.length < this.data.maxnum) {
						this.seledArr.push(selItem);
						selItem.checked = true;
					}
					else {
						msg = '最多能选择 ' + this.data.maxnum + ' 项'
					}
				}
				if (msg) {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
				}
			},
			// 重组数据格式
			getDataList(){
				let that = this;
				let cardata = inquirycartypeDatas[that.pinleiflag];
				let res = [];

				// 重组数据格式
				let selected = this.seledArr;
				for(let idx in cardata){
					let item = cardata[idx];
					let temp = [];
					
					for(let idj in item){
						let sitem = item[idj];
						
						let canpush = true;
						if (this.keyword) {
							if (sitem.name.indexOf(this.keyword) < 0) {
								canpush = false;
							}
						}
						if (canpush) {
							
							sitem.checked = false;
							let sidx = selected.findIndex((value, index, arr) => {
								return value.id  === sitem.id;
							});
							if (sidx >= 0) {
								sitem.checked = true;
							}
							
							temp.push(sitem);
						}
					}
					
					if (temp.length) {
						res.push({
							initial: idx,
							data: temp
						});
					}
				}
				return res;
			},
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.data.list[index];

				if (item) {
					this.scrollViewId = item.initial;
					this.touchmoveIndex = index;
				}
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.data.list[index];

				if (item) {
					this.scrollViewId = item.initial;
					this.touchmoveIndex = index;
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			}
		}
	}
</script>
<style>
	@import '../../common/biz-home.css';

page{overflow:hidden;}
.page-list {}
.page-list .list-item{overflow:hidden;}
.page-list .list-item .selected-markbox{display:none;position:absolute; top:4upx; left:4upx; width:100%; height:100%; align-items:center; justify-content:center; background:rgba(0,0,0,0.1);}
.page-list .list-item .selected-markbox .mark-item{position:absolute; top:0upx; right:8upx;}
.page-list .list-item.active{opacity:0.7;}
.page-list .list-item.active .selected-markbox{display:flex;}
.page-list .list-item.item-checked{/**/}
.page-list .list-item.item-checked .selected-markbox{display:flex;}
.scrollList {height: 100vh;}
.uni-indexed-list-bar {position:fixed; top:0; right:0; width: 46upx;height: 100vh;background-color:transparent;display: flex;flex-direction: column;}
.uni-indexed-list-text {color: #aaa;font-size: 28upx;text-align: center;}
.uni-indexed-list-bar.active .uni-indexed-list-text {color: #333;}
.uni-indexed-list-text.active,.uni-indexed-list-bar.active .uni-indexed-list-text.active {color: #E73641;}
.uni-indexed-list-alert {position: absolute;z-index: 20;width: 160upx;height: 160upx;left: 50%;top: 50%;margin-left: -80upx;margin-top: -80upx;border-radius: 80upx;text-align: center;line-height: 160upx;font-size: 70upx;color: #fff;background-color: rgba(0, 0, 0, 0.5);}
</style>
