<template>
	<view class="bg-F0F0F0">
		<view class="page-inner-header">
			<uni-nav-bar color="#333333" background-color="#F0F0F0" fixed="false" statusBar="false">
				<view class="input-view">
					<uni-icon type="search" size="22" color="#666666"></uni-icon>
					<input confirm-type="search" class="input" type="text" placeholder="输入搜索关键词" @confirm="doSearch"/>
				</view>
			</uni-nav-bar>
		</view>
		<view class="page-list">
			<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}">
				<block v-for="(list, key) in data.list" :id="key" :key="key">
					<view v-if="list.data.length" :id="list.initial">
						<view class="bg-F5F5F5 fs-32 padded-l20">
							{{list.initial}}
						</view>
						<view class="com-row bg-FFF padded-r40">
							<view class="com-col-xs-3 text-ac padded-t20 padded-b20 list-item" v-for="(item,index) in list.data" :key="index"
					 :class="item.checked?'active':''" @click="onSelectItem(item.name)">
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
				<button type="warn" @click="onConfirm">确定 ({{data[cate].length}} / {{data.maxnum}})</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'	
	import inquirycartypeDatas from '../../static-source/cartype-data-inquiry'
	import selectItem from './select-item'
	export default {
		components:{
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				keyword: '',
				levelType: 0, // 1:商用车,2:乘用车,3:工程机械
				cate: 'main', // main: 主 second: 辅
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				winHeight: 0,
				scrollViewId: "A",
				titleHeight: 50,
				footerHeight: 50,
				data:{
					list: [],
					main: [],
					second: [],
					maxnum: 10
				}
			}
		},
		onLoad(option) {
			this.levelType = option.type;
			this.cate = option.cate;
			this.preData();
			uni.setNavigationBarTitle({
				title: option.name + '车型 / 品牌'
			});
			let winHeight = uni.getSystemInfoSync().windowHeight - this.titleHeight - this.footerHeight;
			this.itemHeight = winHeight / this.data.list.length;
			this.winHeight = winHeight;

		},
		computed: {
			imagePath () {
				let imagepathArr = ['syc', 'cyc', 'gcjx'];
				return 'http://img.qipeiren.com/qipeiren/images/brand-icon-'+ imagepathArr[this.levelType - 1] +'/';
			},
		},
		methods: {
			doSearch (e) {
				let value = e.detail.value.trim();
				this.keyword = value;
				this.data.list = this.getDataList();
			},
			/**
			 * 准备数据
			 */
			preData () {
				let selectedSet = this.getSelectedSet();
				if (selectedSet && selectedSet.main && selectedSet.second) {
					this.data.main = selectedSet.main[this.levelType];
					this.data.second = selectedSet.second[this.levelType];
					let item = selectedSet[this.cate];
					let num = 0;
					for (let i in item) {
						if (parseInt(i) !== parseInt(this.levelType)) {
							num += item[i].length
						}
					}
					this.data.maxnum = 10 - num;
				}
				this.data.list = this.getDataList();
			},
			onConfirm () {
				let selectedSet = this.getSelectedSet();
				let item = this.data[this.cate];
				selectedSet[this.cate] = selectedSet[this.cate] || {} 
				selectedSet[this.cate][this.levelType] = [...item];
				selectItem.setSelectedCarBrand(selectedSet);
				uni.navigateBack({
					delta: 1
				});
			},
			onSelectItem (name) {
				let item = this.data[this.cate];
				let index = item.indexOf(name);
				let reload = false;
				let msg = '';
				if (index >=0 ) {
					item.splice(index, 1);
					reload = true;
				} else {
					if (item.length < this.data.maxnum) {
						let key = this.cate === 'main' ? 'second' : 'main';
						let item2 = this.data[key];
						if (item2.indexOf(name) >=0) {
							msg = '已在' + (key === 'main' ? '主营' : '辅营') + '品牌中选择'
						} else {
							item.push(name);
							reload = true;
						}
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
				if (reload) {
					this.data[this.cate] = [...item];
					this.data.list = this.getDataList();
				}
			},
			/**
			 *  获取各个类型下选择的数据
			 * @returns {Object}
			 */
			getSelectedSet () {
				let selected = selectItem.getSelectedCarBrand() || {};
				let temp = JSON.stringify(selected);
				temp = JSON.parse(temp);
				return temp
			},
			getDataList(){
				let that = this;
				//工程机械的id, 商用车数据中包含工程机械，指定其id，将其过滤掉
				let filteridArr = [11055];
				let cardata = inquirycartypeDatas[that.levelType];
				let res = [];

				if(that.levelType == 1){
					for (let idx in cardata) {
						let groups = cardata[idx];
						for (let ix in groups) {
							let item = groups[ix];
							if (filteridArr.findIndex(t => t  === item.id) != -1) {
								cardata[idx].splice(ix, 1);
							}
						}
					}
				}

				// 重组数据格式
				let selected = this.data[this.cate];
				for(let idx in cardata){
					let item = cardata[idx];
					let temp = [];
					item.forEach((x) => {
						let canpush = true;
						if (this.keyword) {
							if (x.name.indexOf(this.keyword) < 0) {
								canpush = false;
							}
						}
						if (canpush) {
							x.checked = false;
							if (selected.indexOf(x.name) >= 0) {
								x.checked = true;
							}
							temp.push(x);
						}
					});
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
.page-list .list-item.active{/**/}
.page-list .list-item.active .selected-markbox{display:flex;}
.scrollList {height: 100vh;}
.uni-indexed-list-bar {position:fixed; top:0; right:0; width: 46upx;height: 100vh;background-color:transparent;display: flex;flex-direction: column;}
.uni-indexed-list-text {color: #aaa;font-size: 28upx;text-align: center;}
.uni-indexed-list-bar.active .uni-indexed-list-text {color: #333;}
.uni-indexed-list-text.active,.uni-indexed-list-bar.active .uni-indexed-list-text.active {color: #E73641;}
.uni-indexed-list-alert {position: absolute;z-index: 20;width: 160upx;height: 160upx;left: 50%;top: 50%;margin-left: -80upx;margin-top: -80upx;border-radius: 80upx;text-align: center;line-height: 160upx;font-size: 70upx;color: #fff;background-color: rgba(0, 0, 0, 0.5);}
</style>
