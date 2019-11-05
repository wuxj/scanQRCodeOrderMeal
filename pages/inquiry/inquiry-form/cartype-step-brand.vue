<template>
	<view class="bg-F2F2F2">
		<view class="inquiry-position w-per-100" :style="{'top': titleHeight +'px'}" id="fixedSearchBox">
			<view class="bg-F9F9F9 margin-b10">
				<view class="cartype-inner-header">
					<view class="cartype-navbar-header">
						<view class="cartype-navbar-container">
							<view class="input-view">
								<icon class="uni-icon uni-icon-search fs-40 c-666"></icon>
								<input class="input" confirm-type="search" type="text" placeholder="请输入您要查找的品牌" v-model="curValue"
								 @input="searchByKeyword" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bg-FFF" :style="{'margin-top': topFixedHeight + 'px'}">
			<block v-show="searchResList.length">
				<view v-for="(item,key) in searchResList" :key="key">
					<view class="border-bb1 padded-20" @click="searchItemClick(item)">
						<text v-if="(item.brandname!=item.pname || item.brandname!=item.changshang)">{{item.brandname}} <text class="c-999 padded-4"> -> </text></text>
						{{item.pname || item.changshang}} <text class="c-999 padded-4"> -> </text> {{item.chexing || item.chexingname}}
					</view>
				</view>
			</block>
			<block v-show="!searchResList.length">
				<scroll-view :style="{'height':scrollViewHeight+'px'}" scroll-y="true" :scroll-into-view="scrollViewId" :scroll-with-animation="scrollAnimationOFF">
					<view v-if="!searched && changYongBrand.length">
						<view class="padded-10 padded-l30 bg-F9F9F9">我的常用品牌</view>
						<view class="com-row padded-10 padded-r40">
							<view class="com-col-xs-3 padded-b10 padded-t10 text-ac" v-for="(item,key) in changYongBrand" :id="key" :key="key">
								<view @click="itemClick(item.carbrandid, item.carbrand)">
									<image class="square-70" :src="imagePath + item.carbrandid +'.png'" mode="aspectFit"></image>
									<text class="text-ellipsis">{{item.carbrand}}</text>
								</view>
							</view>
						</view>
					</view>

					<block v-if="!searched && hotBrand.length">
						<view class="padded-10 padded-l30 bg-F9F9F9">热门品牌</view>
						<view class="com-row padded-10 padded-r40">
							<view class="com-col-xs-3 padded-b10 padded-t10 text-ac" v-for="(item,key) in hotBrand" :id="key" :key="key">
								<view @click="itemClick(item.carbrandid, item.carbrand)">
									<image class="square-70" :src="imagePath + item.carbrandid +'.png'" mode="aspectFit"></image>
									<text class="text-ellipsis">{{item.carbrand}}</text>
								</view>
							</view>
						</view>
					</block>
					
					<block v-if="isDataSourceNormal">
						<block v-for="(item,key) in dataSourceOfType" :id="key" :key="key">
							<view class="padded-10 padded-l30 bg-F9F9F9">{{key}}</view>
							<view class="com-row padded-10 padded-r40">
								<view class="com-col-xs-3 padded-b10 padded-t10 text-ac" v-for="(i,k) in item">
									<view @click="itemClick(i.id || i.brandid, i.name || i.brandname)">
										<image class="square-70" :src="imagePath + (i.id || i.brandid) +'.png'" mode="aspectFit"></image>
										<text class="text-ellipsis">{{i.name || i.brandname}}</text>
									</view>
								</view>
							</view>
						</block>
					</block>
					<view class="alphabet-alert" v-if="touchStatus">
						{{letter}}
					</view>
				</scroll-view>
				<view class="letter-box uni-flex c-999 text-ac" v-if="isDataSourceNormal"  :style="{height:scrollViewHeight + 'px', top:topFixedHeight+'px'}">
					<view class="uni-flex-item padded-l2 padded-r2 fs-18" v-for="(item,key) in dataSourceOfType" :data-key="key" :key="key" @touchstart="handleTouchStart"
					 @touchmove="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchCancel" :class="{'c-F60': touchStatus && key === letter }">{{key}}</view>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	import dataInquiry from '@/static-source/cartype-data-inquiry.js'

	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default {
		data() {
			return {
				dataSource: dataInquiry,
				isDataSourceNormal:false,
				changYongBrand: [],
				hotBrand: [],

				letter: '',
				scrollAnimationOFF: false,
				touchStatus: false,

				// search 
				searched: false,
				curValue: '',
				cloneItems: '{}', // 数据待操作后赋值
				searchResList: [],
				searchMin: 10,
				
				scrollViewHeight: 0,
				topFixedHeight: 0
			}
		},
		props: ['titleHeight', 'type'],
		computed: {
			dataSourceOfType() {
				return ((this.cloneItems != '{}' || this.searched) && this.cloneItems) || this.dataSource[this.type]
			},
			scrollViewId() {
				return this.letter;
			},
			imagePath() {
				let imagepathArr = ['syc', 'cyc'];
				return 'http://img.qipeiren.com/qipeiren/images/brand-icon-' + imagepathArr[this.type - 1] + '/';
			}
		},
		watch:{
			type(){
				this.getData()
			},
			titleHeight(){
				this.caclSize();
			},
			dataSourceOfType:{
				handler(){
					this.isDataSourceNormal = typeof this.dataSourceOfType == 'object' && Object.keys(this.dataSourceOfType).length > 0
				},
				immediate: true
			}
		},
		onReady() {
			this.caclSize();
		},
		onShow() {
			this.getData();
		},
		methods: {
			caclSize (){
				let that = this
				//获取屏幕高度及比例
				that.winHeight = uni.getSystemInfoSync().windowHeight;
				//获取顶部切换标题高度
				var viewTop = uni.createSelectorQuery().select('#fixedSearchBox')			
				viewTop.boundingClientRect(res => {
					if(res){
						//计算得出滚动区域的高度
						that.topFixedHeight = that.titleHeight + res.height;
						that.scrollViewHeight = (that.winHeight - that.topFixedHeight);
						that.itemHeight = that.scrollViewHeight / (Object.keys(that.dataSourceOfType).length+1);
					}
				}).exec();
			},
			getData() {
				this.GetHotBrand()
				this.GetChangYongBrand()
			},
			searchByKeyword(e) {
				this.curValue = e.target.value
				this.searched = this.curValue.replace(/\s+/g, "").length > 0
				this.cloneItems = '{}'
				this.searchResList = []
				if (!this.searched) {
					// 清空关键字 赋值
					return false;
				}

				if (this.type == 1) {
					this.getSycByKeyword()
				} else if (this.type == 2) {
					this.getCycByKeyword()
				}
			},
			getSycByKeyword() {
				let result = JSON.parse(JSON.stringify(this.dataSource[this.type]))
				let data = {}
				let count = 0
				for (let alpha in result) {
					let temp = result[alpha]
					if (!data[alpha]) {
						data[alpha] = [];
					}
					for (let ii in temp) {
						let item = temp[ii] // 品牌
						let step1 = this.isContain(item.name, this.curValue)
						if (step1) { // 品牌里包含关键字
							data[alpha].push(item);
							if (count <= this.searchMin) {
								for (let aa = 0; aa < item.sub.length; aa++) {
									let item1 = item.sub[aa];
									count += item1.sub.length;
									if (count > this.searchMin) {
										break;
									}
								}
							}
						} else { // 品牌中不包含关键字
							let flag = false;
							for (let aa = 0; aa < item.sub.length; aa++) {
								let item1 = item.sub[aa];
								let step2 = this.isContain(item1.name, this.curValue);
								if (step2) {
									flag = true;
									count += item1.sub.length;
								} else {
									for (let bb = 0; bb < item1.sub.length; bb++) { //最后一级
										let item2 = item1.sub[bb];
										let step3 = this.isContain(item2.name, this.curValue);
										if (step3) {
											flag = true;
											count += 1;
										}
									}
								}
								if (flag && count > this.searchMin) {
									break;
								}
							}
							if (flag) {
								data[alpha].push(item);
							}
						}
					}
				}
				var temp = {};
				for (var i in data) {
					if (data[i].length) {
						temp[i] = data[i];
					}
				}
				if (0 < count && count <= this.searchMin) {
					this.searchResList = this.getSycSearchList(temp, this.curValue);
				} else {
					this.cloneItems = temp;
				}
			},
			/**
			 * 商用车搜索数量少于指定数量是，用此函数解析出列表数据
			 * @param data getSearchData中得到的具有关键字的所有级别的品牌的数据
			 * @param keyword
			 * @return {Array}
			 */
			getSycSearchList(data, keyword) {
				let result = [];
				let putResult = function(brandid, brandname, pname, chexing) {
					return {
						brandid: brandid,
						brandname: brandname,
						pname: pname,
						chexing: chexing
					}
				};
				for (var alpha in data) {
					var temp = data[alpha];

					for (var ii = 0; ii < temp.length; ii++) {
						var item = temp[ii];
						let step1 = this.isContain(item.name, keyword);
						if (step1) { //品牌里包含关键字
							for (var aa = 0; aa < item.sub.length; aa++) {
								var item1 = item.sub[aa];
								for (var bb = 0; bb < item1.sub.length; bb++) { //最后一级
									item2 = item1.sub[bb];
									result.push(putResult(item.id, item.name, item1.name, item2.name));
								}
							}
						} else { //品牌中不包含关键字
							for (var aa = 0; aa < item.sub.length; aa++) {
								var item1 = item.sub[aa];
								let step2 = this.isContain(item1.name, keyword);
								if (step2) {
									for (var bb = 0; bb < item1.sub.length; bb++) { //最后一级
										item2 = item1.sub[bb];
										result.push(putResult(item.id, item.name, item1.name, item2.name));
									}
								} else {
									for (var bb = 0; bb < item1.sub.length; bb++) { //最后一级
										var item2 = item1.sub[bb];
										let step3 = this.isContain(item2.name, keyword);
										if (step3) {
											result.push(putResult(item.id, item.name, item1.name, item2.name));
										}
									}
								}

							}
						}
					}
				}
				return result;
			},
			getCycByKeyword() {
				let that = this
				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.GetCheXingByKeyword'),
					data: {
						keyword: that.curValue
					},
					showLoading: false,
					success: (res) => {
						if (res.success) {
							let count = res.data.app.count
							let result = res.data.app.result
							if (0 < count && count <= that.searchMin) {
								that.searchResList = result
							} else {
								that.cloneItems = result

							}
						}
					}
				})
			},
			GetChangYongBrand() {
				let that = this;

				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.GetChangYongPinPai'),
					data: {
						comid: app.globalData['mycomid'],
						cartype: that.type
					},
					showLoading: false,
					success: (res) => {
						if (res.success) {
							let result = res.data.app.result
							that.changYongBrand = result
						}
					},
				})
			},
			GetHotBrand() {
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.GetHotBrand'),
					data: {
						cartype: that.type
					},
					showLoading: false,
					success: (res) => {
						if (res.success) {
							let result = res.data.app.result
							that.hotBrand = result
						}
					},
				})
			},

			handleTouchStart(e) {
				let key = e.target.dataset.key
				this.letter = key
				this.touchStatus = true
			},
			handleTouchMove(e) {
				this.scrollAnimationOFF = false
				if (this.touchStatus) {
					let spellLength = Object.keys(this.dataSourceOfType).length + 1
					const touchY = e.touches[0].clientY
					const index = Math.floor((touchY - this.topFixedHeight) / this.itemHeight)

					if (index >= 0 && index < spellLength) {
						this.letter = Object.keys(this.dataSourceOfType)[index]
						this.touchmove = true
					}
				}
			},
			handleTouchEnd(e) {
				this.scrollAnimationOFF = true
				this.touchStatus = false
			},
			handleTouchCancel(e) {
				this.scrollAnimationOFF = true
				this.touchStatus = false
			},
			/**
			 * 判断字符串中是否包含指定字符串
			 * @param str
			 * @param word
			 * @return {boolean}
			 */
			isContain(str, word) {
				if (str.toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) >= 0) {
					return true;
				} else {
					return false;
				}
			},
			itemClick(brandid, brandname){
				this.$emit('itemClick', brandid, brandname)
			},
			searchItemClick(searchItem){
				this.$emit('itemBack', searchItem)
			},
		}
	}
</script>

<style scoped>
	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	
	.letter-box {
		position:fixed; top:0; right:0; width: 46upx;
		background-color:transparent;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
	}

	/* 字母弹出 */
	.alphabet-alert {
		position: fixed;
		z-index: 20;
		width: 120upx;
		height: 120upx;
		left: 50%;
		top: 50%;
		margin-left: -80upx;
		margin-top: -80upx;
		border-radius: 80upx;
		text-align: center;
		line-height: 120upx;
		font-size: 70upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}

    .cartype-navbar {
        display: block;
        position: relative;
        width: 100%;
        overflow: hidden;
    }
		
    .cartype-navbar-header {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

	.cartype-navbar-container{
		width:100%;
		margin:0 20upx;
	}
	.cartype-inner-header{padding-top:10upx;background-color: #FFFFFF;}
	.cartype-navbar-header .input-view {width: 92%;display: flex;align-items:center;
		justify-content:center;background-color: #FFF;height: 60upx; border:1px solid #E4E4E4; border-radius: 30upx;padding: 0 4%;flex-wrap:nowrap;margin:14upx 0;line-height:60upx;}
	.cartype-navbar-header .input-view view{line-height:60upx !important;}
	.cartype-navbar-header .input-view .input {height:60upx;line-height:60upx;width:94%;padding: 0 3%;}
</style>
<style>
	@import '../../../common/biz-inquiry.css';
</style>