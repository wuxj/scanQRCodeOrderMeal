<template>
	<view class="page-body">
		<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
			<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'c-red':''"
				v-for="(item,index) in categoryList">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
			<view v-for="(item,index) in subCategoryList" :key="index">
				<view class="nav-right-title text-ellipsis">{{item.key}}</view>
				<view class="nav-right-cont">
					<view class="nav-ritem text-ellipsis" :class="sitem.checked?'active':''" v-for="(sitem, sindex) in item.lists" :key="sindex" @click="onSelectItem(sitem.name, index)">
						{{sitem.name}}
						<view class="selected-markbox">
							<view class="mark-item">
								<view class="qpr-icon icon-correct c-red fs-20"></view>
							</view>
						</view> 
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="fixed-bottom-box" @click="onConfirm">
			<view class="bottom-content">
				<button type="warn">确定 ({{data[cate].length}} / {{data.maxnum}})</button>
			</view>
		</view>
	</view>
</template>

<script>
	import sourceCategoryDatas from '../../static-source/category-data'
	import selectItem from './select-item'
	export default {
		components:{},
		data() {
			return {
				levelType: 0, // 1:商用车,2:乘用车,3:工程机械
				cate: 'main', // main or second 主营或辅营
				categoryList: [],
				subCategoryList: [],
				selected: ['发动机总成'],
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
				data:{
					list: [],
					main: [],
					second: [],
					maxnum: 10
				}
			}
		},
		methods: {
			onConfirm () {
				let selectedSet = this.getSelectedSet();
				let item = this.data[this.cate];
				selectedSet[this.cate][this.levelType] = [...item];
				selectItem.setSelectedCategory(selectedSet);
				uni.navigateBack({
					delta: 1
				});
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
			},
			/**
			 * 组合name
			 */
			getNewName (name, ind) {
				return this.categoryList[this.categoryActive].name + '|' + this.subCategoryList[ind].key + '|' + name;
			},
			/**
			 * 点击某项
			 */
			onSelectItem (name, ind) {
				let newname = this.getNewName(name, ind);

				let item = this.data[this.cate];
				let index = item.indexOf(newname);
				let reload = false;
				let msg = '';
				if (index >=0 ) {
					item.splice(index, 1);
					reload = true;
				} else {
					if (item.length < this.data.maxnum) {
						let key = this.cate === 'main' ? 'second' : 'main';
						let item2 = this.data[key];
						if (item2.indexOf(newname) >=0) {
							msg = '已在' + (key === 'main' ? '主营' : '辅营') + '类目中选择'
						} else {
							item.push(newname);
							reload = true;
						}
					} else {
						msg = '最多能选择 ' + this.data.maxnum + ' 项';
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
					this.upSubCategoryList(name, ind)
				}
			},
			/**
			 *  点击某项时更新显示状态
			 */
			upSubCategoryList (name, ind) {
				let selected = this.data[this.cate];
				let index = this.categoryActive;
				let subCategoryList =  this.subCategoryList;
				let item = subCategoryList[ind];
				item.lists = item.lists.map((x) => {
					let tempName = this.getNewName(x.name, ind);
					if (selected.indexOf(tempName) >= 0) {
						x.checked = true;
					} else {
						x.checked = false;
					}
					return x;
				});
				subCategoryList[ind] = item;
				this.subCategoryList = subCategoryList;
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			// 切换左边类目
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.subCategoryList = categroy.subCategoryList;
				this.scrollTop = -this.scrollHeight * index;
			},
			/**
			 *  获取各个类型下选择的数据
			 * @returns {Object}
			 */
			getSelectedSet () {
				let temp = JSON.stringify(selectItem.getSelectedCategory());
				temp = JSON.parse(temp);
				return temp
			},
			// 组装列表数据
			getCategory() {
				this.categoryList = this.getCateDatesByPid(this.levelType).items;
				for (let i = 0; i < this.categoryList.length; i++) {
					let item = this.categoryList[i];
					let subList = this.getCateDatesByPid(item.id).items;
					
					let newSubList = [];
					for(let k = 0; k < subList.length; k++){
						let sonList =  this.getCateDatesByPid(subList[k].id).items;
						let newSub = {
							key: '',
							lists: []
						};
						let selected = this.data[this.cate];
						if(sonList.length){
							newSub.key = subList[k].name;
							newSub.lists = sonList.map((x) => {
								let newname = item.name + '|' + newSub.key + '|'+ x.name;
								x.checked = false;
								if (selected.indexOf(newname) >= 0) {
									x.checked = true
								}
								return x;
							});
							newSubList.push(newSub);
							
						} else {
							newSub.key = item.name;
							newSub.lists = subList.map((x) => {
								x.checked = false;
								if (selected.indexOf(x.name) >= 0) {
									x.checked = true
								}
								return x;
							});
							newSubList.push(newSub);
							break;
						}
					}
					item.subCategoryList = newSubList;
				}
				
				this.subCategoryList = this.categoryList[0].subCategoryList;
			},
			isSelected (item) {
				return this.selected.findIndex(t => t === item.name) != -1;
			},
			getCateNameByid(oid, fid, pid, id) {
				var data = sourceDatas;
				var res = {};
				for (var i = 0; i < data.items.length; i++) {
					var item = data.items[i];
					if (item.id == oid) {
						res['0'] = item;
					}

					if (item.id == pid) {
						res['2'] = item;
					}


					if (item.id == id) {
						res['3'] = item;
					}
				}
				for (var i = 0; i < data.items.length; i++) {
					var item = data.items[i];
					if (res['2'] && res['2'].pid == item.id) {
						res['1'] = item;
					}
				}
				return res;
			},
			getCateDatesByPid (pid) {
				var data = sourceCategoryDatas;
				var result = {
					items: []
				};
				pid = (typeof pid === 'object' ? pid[0] : pid.toString());
				for (var i = 0; i < data.items.length; i++) {
					var item = data.items[i];

					item.pid = (typeof item.pid === 'object' ? item.pid : item.pid.split(','));

					if (item.pid.findIndex(t => t  === pid) != -1) {
						result.items.push(item);
					}
				}
				return result;
			}
		},
		onLoad(option) {
			this.levelType = option.type;
			this.cate = option.cate;
			this.preData();
			uni.setNavigationBarTitle({
				title: option.name + '配件'
			});
			this.getCategory();
			this.height = uni.getSystemInfoSync().windowHeight - 50;
		}
	}
</script>

<style>
.page-body {display: flex;}
.nav {display: flex;width: 100%;}
.nav-left {width: 30%;}
.nav-left-item {height: 100upx;font-size: 30upx;display: flex;align-items: center;justify-content: center;position:relative;}
.nav-left-item:after{position:absolute; bottom:0; left:0; z-index:0; width:100%; border-bottom:1px solid #E4E4E4; content:""; -webkit-transform:scaleY(.5); transform:scaleY(.5); -webkit-transform-origin:0 0; transform-origin:0 0;}
.nav-right {width: 70%;background:#F5F5F5;position:relative;}
.nav-right:after{position:absolute; top:0; left:0; z-index:0; height:100%; border-left:1px solid #E4E4E4; content:" "; -webkit-transform:scaleX(.5); transform:scaleX(.5); -webkit-transform-origin:0 0; transform-origin:0 0;}
.nav-right .nav-right-title {padding:20upx;clear:both;}
.nav-right .nav-right-cont{overflow:hidden;background:#FFF;}
.nav-right .nav-right-cont .nav-ritem {height: 80upx;line-height:80upx;width: 33.333333%;float: left;text-align: center;font-size: 28upx;position:relative;margin-bottom:-1px;overflow:hidden;white-space:nowrap;}
.nav-right .nav-right-cont .nav-ritem:not(:nth-child(3n)):before{position:absolute; top:0; right:0; z-index:0; height:100%; border-right:1px solid #E4E4E4; content:" "; -webkit-transform:scaleX(.5); transform:scaleX(.5); -webkit-transform-origin:0 0; transform-origin:0 0;}
.nav-right .nav-right-cont .nav-ritem:after{position:absolute; bottom:0; left:0; z-index:0; width:100%; border-bottom:1px solid #E4E4E4; content:""; -webkit-transform:scaleY(.5); transform:scaleY(.5); -webkit-transform-origin:0 0; transform-origin:0 0;}

.nav-right .nav-right-cont .nav-ritem .selected-markbox{display:none;position:absolute; top:0upx; left:0upx; width:100%; height:100%; align-items:center; justify-content:center;}
.nav-right .nav-right-cont .nav-ritem .selected-markbox .mark-item{position:absolute; top:0upx; right:2upx;}
.nav-right .nav-right-cont .nav-ritem.active{color: #E73641;}
.nav-right .nav-right-cont .nav-ritem.active .selected-markbox{display:flex;}
</style>
