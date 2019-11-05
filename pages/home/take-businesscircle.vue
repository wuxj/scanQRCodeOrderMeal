<template>
	<view class="bg-F0F0F0">
		<view class="bg-FFF" v-if="seledArr.length">
			<view  class="border-bb1 fs-32 padded-20">已选商圈</view>
			<view class="com-row padded-10" v-if="!loading">
				<view class="com-col-xs-4" v-for="item in seledArr" :key="index" @click="deleteItem(item)">
					<view class="bg-F5F5F5 w-per-90 text-ac margin-t10 margin-b10 padded-t4 padded-b4">
						<view class="uni-flex uni-row">
							<view class="uni-ellipsis" style="flex: 1;">{{item.name}}</view>
							<view class="margin-r8">
								<uni-icon stylecls="c-red fs-18" family="qpr-icon" type="delboney"></uni-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card box-shadow-none margin-0 margin-t10">
			<view class="uni-card-header">
				<view class="fs-32">
					<text>全部商圈</text>
				</view>
			</view> 
			<view class="uni-card-content">
				<view class="uni-card-content-inner padded-0">
					<view class="nav" id="scrollview" :style="'height:'+height+'px'">
						<scroll-view class="nav-left" scroll-y>
							<view class="nav-left-item" @click="categoryClickDist(item, index)" :key="index" :class="{'nav-left-item-checked': item.checked, 'nav-left-item-active': index == distActive}"
								v-for="(item,index) in distList">
								<text>{{item.province + '('+ item.count +')'}}</text>
							</view>
						</scroll-view>
						<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" scroll-with-animation>
							<view class="nav-right-cont">
								<view class="nav-right-item" :class="item.checked ? 'nav-right-item-active' : ''" @click="selectItem(item)" v-for="(item,index) in subDistList" :key="index">
									<text class="item-text" v-text="item.name"></text>
									<icon class="item-icon"></icon>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed-bottom-box">
			<view class="bottom-content">
				<button type="warn" @click="confirmArea" :loading="submitLoading">确定</button>
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
				loading: false,
				firstLoad: true,
				submitLoading:false,
				max: 9,
				seledArr: [], // 已订阅数据				
				distList: [], // 全部商圈 - 地区
				subDistList: [], // 全部商圈 - 商圈
				height: 0,
				distActive: 0,
				scrollTop: 0,
				scrollHeight: 0
			};
		},
		onLoad (option) {
			let show = this.firstLoad;
			this.getSelectedData(show);
			this.firstLoad = false;
		},
		watch:{
			// 当已选中数量变化时，重新计算高度
			seledArr:{
				handler: function(){
					let that = this;
					setTimeout(function(){
						that.reCalHeight();
					}, 500);
				},
				deep: true
			}
		},
		methods:{
			// 获取已订阅商圈数据
			getSelectedData (show = false){
				let that = this;
				ajax.uniajax({
					url:apiurl.geturl('takebusinesscircle.GetSubscribeData'),
					showLoading: show,
					data: {
						unionid: app.globalData.unionId,
						pinleiflag: app.getPinlei().label
					},
					success: (res) => {
						let appdata = res.data.app;
						that.seledArr = appdata.info;
						
						that.getAllData();
					}
				});
			},
			// 获取全部商圈数据
			getAllData (show = false) {
				let that = this;
				ajax.uniajax({
					url:apiurl.geturl('takebusinesscircle.GetAllData'),
					showLoading: show,
					data: {
						unionid: app.globalData.unionId,
						pinleiflag: app.getPinlei().label
					},
					success: (res) => {
						let appdata = res.data.app;
						that.distList = appdata.info;
						
						that.distList = that.getDataList();
						that.subDistList = that.distList[0].values || [];
					}
				});
			},
			// 重组数据
			getDataList(){
				let that = this;
				let distList = that.distList;
			
				// 重组数据格式
				let selected = that.seledArr;
				for(let idx in distList){
					let item = distList[idx];
					
					item.values.forEach((x) => {
						x.checked = false;
						item.checked = false;
						item.province = item.province.replace('省', '');
						let sidx = selected.findIndex((value, index, arr) => {
							return value.id  === x.id;
						});
						if (sidx >= 0) {
							x.checked = true;
							item.checked = true;
						}
					});
				}
				return distList;
			},
			
			// 选中
			selectItem (item) {
				let sidx = this.seledArr.findIndex((value, index, arr) => {
					return value.id  == item.id;
				});
				
				if (sidx === -1) {
					if (this.seledArr.length < this.max) {
						this.seledArr.push(item);
					}else{
						uni.showToast({
							title: '最多订阅'+ this.max +'个地区',
							icon: 'none',
							duration: 2000
						});
					}
				} else {
					this.deleteItem(item);
				}
				this.distList = this.getDataList();
			},
			// 删除
			deleteItem (item) {
				this.seledArr = this.seledArr.filter((x) => {
					return x.id != item.id;
				});
				this.distList = this.getDataList();
			},
			// 确定
			confirmArea () {
				if(this.submitLoading) return;
				this.submitLoading = true;
				
				let last = [];
				for(let i = 0; i < this.seledArr.length; i++){
					last.push(this.seledArr[i].id);
				}
				
				ajax.uniajax({
					url:apiurl.geturl('takebusinesscircle.SubmitSubscribeData'),
					data: {
						unionid: app.globalData.unionId,
						id: last.join(','),
						pinleiflag: app.getPinlei().label
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
			
			// 计算滚动元素的固定高度，避免页面跳动
			reCalHeight (){
				let that = this;
				let selectorQuery = uni.createSelectorQuery();
				let scrollViewElem = selectorQuery.select('#scrollview');
				
				that.height = uni.getSystemInfoSync().windowHeight;
 				
				scrollViewElem.boundingClientRect(data => {
					that.height -= (data.top + 50);
				}).exec();
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			// 左侧点击
			categoryClickDist(distItem, index) {
				this.distActive = index;
				this.subDistList = distItem.values;
				this.scrollTop = -this.scrollHeight * index;
			}
		}
	}
</script>
<style>
page{height:100%; overflow:hidden;}
.nav {display: flex;width: 100%; height:100%;}
.nav-left {width: 30%; height:100%; background:#F5F5F5;}
.nav-left-item {height: 80upx;font-size: 28upx;display: flex;align-items: center;justify-content: center;position:relative;}
.nav-left-item-checked{color:#000;}
.nav-left-item-active{color:#F60;}
.nav-right {width: 100%; height:100%; background:#FFF; position:relative;}
.nav-right .nav-right-cont{padding:0 4%;}
.nav-right .nav-right-item{display:-webkit-box; display:-webkit-flex; display:flex; position:relative; width:100%; padding:10upx 0; font-size:24upx; color:#333; overflow:hidden; -webkit-box-align:center; -webkit-align-items:center; -ms-flex-align:center; align-items:center;}
.nav-right .nav-right-item .item-text{display:-webkit-box; font-size:28upx; overflow:hidden; text-overflow:ellipsis; word-break:break-all; -webkit-box-flex:1; -webkit-flex:1; -ms-flex:1; flex:1; -webkit-line-clamp:1; -webkit-box-orient:vertical;}
.nav-right .nav-right-item .item-icon{float:right; position:relative; bottom:10upx; visibility:hidden;}
.nav-right .nav-right-item .item-icon:after{display:inline-block; margin-left:10upx; font-size:16upx; font-family:'qpr-icon'; font-style:normal; content:"\E73D"; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;}
.nav-right .nav-right-item-active{position:relative; color:#F60;}
.nav-right .nav-right-item-active::after{position:absolute; right:0; bottom:0; left:0; height:2upx; background-color:#F60; content:''; -webkit-transform:scaleY(.5); transform:scaleY(.5);}
.nav-right .nav-right-item-active .item-icon{visibility:visible;}
</style>