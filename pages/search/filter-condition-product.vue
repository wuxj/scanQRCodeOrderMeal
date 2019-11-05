<template>
	<view>
		<view class="filter-box-zindex">
			<sham-search :keyword="data.keyword" type="0"></sham-search>
		</view>
				
		<view class="com-row bg-FFF filter-box filter-box-zindex">
			<view class="com-col-xs-3 text-ac filter-item" @click="switchFilter(0)">
				<view class="item-spot">
					<view class="spot-box">						
						<icon class="spot-icon"></icon>
						<text class="spot-text" v-text="labels[0]"></text>
					</view>
				</view>
			</view>
			<view class="com-col-xs-3 text-ac filter-item" @click="switchFilter(1)">
				<view class="item-spot">
					<view class="spot-box">						
						<icon class="spot-icon"></icon>
						<text class="spot-text" v-text="labels[1]"></text>
					</view>
				</view>
			</view>
			<view class="com-col-xs-3 text-ac filter-item" @click="switchFilter(2)">
				<view class="item-spot">
					<view class="spot-box">						
						<icon class="spot-icon"></icon>
						<text class="spot-text" v-text="labels[2]"></text>
					</view>
				</view>
			</view>
			<view class="com-col-xs-3 text-ac filter-item" @click="switchFilter(3)">
				<view class="item-spot">
					<view class="spot-box">						
						<icon class="spot-icon"></icon>
						<text class="spot-text" v-text="labels[3]"></text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="filter-fly-mark" v-show="filter.show" catchtouchmove="ture" @click="closeFilter"></view>
		<view class="filter-fly" v-show="filter.show">
			<view class="fly-box filter-box-active">
				<view class="fly-body">
					<view class="fly-left" v-if="filter.column > 1">
						<view class="left-box">
							<view class="fly-item left-item" :class="item.checked? 'fly-item-active':''" v-for="item in data.area" :key="item.value" @click="selectProvinice(item.label)">
								<text class="item-text" v-text="item.label"></text>
								<icon class="item-icon"></icon>
							</view>
						</view>
					</view>
					<view :class="filter.column == 1?'fly-rightonly':'fly-right'">
						<view class="right-box">
							<view class="fly-item right-item" :class="item.checked? 'fly-item-active':''" v-for="item in list" :key="item.value" @click="selectItem(item.value, item.label)">
								<text class="item-text" v-text="item.label"></text>
								<icon class="item-icon"></icon>
							</view>
						</view>
					</view>
				</view>
				<view class="fly-foot">
					<view class="uni-flex">
						<view class="uni-flex-item border-bt1 border-bc-E4E4E4" @click="resetFilter">
							<button class="bg-F5F5F5 c-444 border-b0 border-square">重置</button>
						</view>
						<view class="uni-flex-item border-bt1 border-bc-red" @click="setFilter">
							<button class="bg-red c-FFF border-b0 border-square">确定</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import shamSearch from './sham-search.vue'

	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import areaData from './district-data'
	import app from '@/tools/global-helper'
	export default {
		components: {
			uniNavBar,
			uniIcon,
			shamSearch
		},
		props: ['condition'],
		data() {
			return {
				labels: ['地区', '品类', '车型', '交易'],
				labelsTemp: ['地区', '品类', '车型', '交易'],
				list: [],
				data: {
					brandid: '',
					keyword: '',
					area: [],
					classify: [],
					cartype: [],
					other: []
				},
				filter: {
					column: 1, //页面分几列
                    data: {
						province: '',
						city: '',
						classify: 0,
						cartype: [],
						other: [],
					},
					dataTemp: {
						province: '',
						city: '',
						classify: 0,
						cartype: [],
						other: [],
					},
					show: false,
					type: 0 // 0: 选择省、市 1: 类别 2: 车型 3: 交易类型
				}
			};
		},
		methods:{
			upParam () {
				let filter = this.filter.data;
				let param = {
					isneedad: 1,
					resultflag: 2,
					datafromtype: 1
				};
				if (this.data.keyword) {
					param.keyword = this.data.keyword
				}
				if (filter.classify) {
					param.classid = filter.classify;
				}
				if (filter.province) {
					param.province = filter.province;
				}
				if (filter.city) {
					param.city = filter.city;
				}
				if (filter.cartype.length) {
					param.d = filter.cartype.join(',');
					param.e = 2;
				} else if (this.data.brandid){
					param.d = this.data.brandid;
					param.e = 1;
				}
				let other = filter.other;
				if (other.length) {
					if (other.indexOf('b') >= 0 ) {
						param.b = 'y';
					}
					if (other.indexOf('c') >=0 ) {
						param.c = 'y';
					}
				}
				let pinlei = app.getPinlei().value;
				if (!isNaN(pinlei) && pinlei > 0) {
					param.pinlei = pinlei;
				}
				this.upTabLabels();
				this.$emit('setok', param, true);
			},
			upTabLabels () {
				let filter = this.filter.data;
				let temp = filter.province;
                if (temp && filter.city) {
                	temp += ',' +filter.city;
                }
				let index = 0;
				if (temp) {
					this.labels[0] = temp;
				} else {
					this.labels[0] = this.labelsTemp[0]
				}

				// --------------------------------
				index = 1;
				if (filter.classify !== 0) {
					temp = this.data.classify.find((x) => {
						return filter.classify === x.value;
					});
					if (temp) {
						this.labels[index] = temp.label;
					} else {
						this.labels[index] = this.labelsTemp[index]
					}
				} else {
					this.labels[index] = this.labelsTemp[index]
				}
				// -------------------------------------
				index = 2;
				if (filter.cartype.length) {
					temp = [];
					this.data.cartype.forEach((x) => {
						if (filter.cartype.indexOf(x.value) >= 0) {
							temp.push(x.label);
						}
					});
					if (temp.length) {
						this.labels[index] = temp.join(',')
					} else {
						this.labels[index] = this.labelsTemp[index]
					}
				} else {
					this.labels[index] = this.labelsTemp[index]
				}
				// -------------------------------------
				index = 3;
				if (filter.other.length) {
					temp = [];
					this.data.other.forEach((x) => {
						if (filter.other.indexOf(x.value) >= 0) {
							temp.push(x.label);
						}
					});
					if (temp.length) {
						this.labels[index] = temp.join(',')
					} else {
						this.labels[index] = this.labelsTemp[index]
					}
				} else {
					this.labels[index] = this.labelsTemp[index]
				}
			},
			closeFilter () {
				this.filter.show = false;
			},
			/**
			 * 确认当前筛选条件
			 */
			setFilter () {
				this.filter.data.province = this.filter.dataTemp.province;
				this.filter.data.city = this.filter.dataTemp.city;

				this.filter.data.classify = this.filter.dataTemp.classify;

				this.filter.data.cartype = [...this.filter.dataTemp.cartype];

				this.filter.data.other = [...this.filter.dataTemp.other];

				this.filter.show = false;
				this.upParam();
			},
			/**
			 * 切换设置筛选条件
			 * @param type {number}
			 * 		0: 选择、省市
			 * 		1: 类别
			 * 		2: 车型
			 * 		3: 交易类型
			 */
			switchFilter (type) {
				this.filter.type = type;
				if (type === 0) {
					this.filter.column = 2;
                } else {
					this.filter.column = 1;
                }
				if(!this.filter.show) {
					this.filter.dataTemp = {...this.filter.data};
				}
                switch (type) {
					case 0:
						this.setListArea();
						break;
					case 1:
						this.setListClassify();
						break;
					case 2:
						this.setListCartype();
						break;
					case 3:
						this.setListOther();
						break;
				}
				this.filter.show = true;
			},

			/**
			 * 重置当前筛选条件
			 */
			resetFilter () {
				switch (this.filter.type) {
					case 0:
						this.filter.dataTemp.province = '';
						this.filter.dataTemp.city = '';
						this.setListArea();
						break;
					case 1:
						this.filter.dataTemp.classify = 0;
						this.setListClassify();
						break;
					case 2:
						this.filter.dataTemp.cartype = [];
						this.setListCartype();
						break;
					case 3:
						this.filter.dataTemp.other = [];
						this.setListOther();
						break;
				}
			},
			/**
			 * 设置地区的列表数据
			 */
			setListArea: function () {
				let province = this.filter.dataTemp.province;
				let city = this.filter.dataTemp.city;
				let haveChild = false;
				this.data.area = this.data.area.map((x) => {
					x.checked = (province.length && x.label.indexOf(province) != -1);
					if (x.checked) {
						x.children = x.children.map((z) => {
							z.checked = (city.length && z.label.indexOf(city) != -1);
							return z;
						});
						haveChild = true;
						this.list = x.children;
					}
					return x
				});
				if (!haveChild) {
					this.list = []
				}
			},
			/**
			 * 设置分类的列表数据
			 */
			setListClassify: function () {
				let classify = this.filter.dataTemp.classify;
				this.list = this.data.classify.map((x) => {
					x.checked = classify === x.value;
					return x;
				})
			},
			/**
			 * 设置其它的列表数据
			 */
			setListOther: function () {
				let other = [...this.filter.dataTemp.other];
				this.list = this.data.other.map((x) => {
					x.checked = other.indexOf(x.value) >= 0;
					return x;
				})
			},
			/**
			 * 设置车型的列表数据
			 */
			setListCartype: function () {
				let other = [...this.filter.dataTemp.cartype];
				this.list = this.data.cartype.map((x) => {
					x.checked = other.indexOf(x.value) >= 0;
					return x;
				})
			},
			/**
			 * 选择条件中的某一项，非省份
			 */
			selectItem (value) {
				switch (this.filter.type) {
					case 0:
						this.filter.dataTemp.city = value;
						this.setListArea();
						break;
					case 1:
						this.filter.dataTemp.classify = value;
						this.setListClassify();
						break;
					case 2:
						let cartype = this.filter.dataTemp.cartype;
						if (cartype.indexOf(value) >= 0) {
							cartype.splice(cartype.indexOf(value), 1);
						} else {
							cartype.push(value)
						}
						this.filter.dataTemp.cartype = cartype;
						this.setListCartype();
						break;
					case 3:
						let item = this.filter.dataTemp.other;
						if (item.indexOf(value) >= 0) {
							item.splice(item.indexOf(value), 1);
						} else {
							item.push(value)
						}
						this.filter.dataTemp.other = item;
						this.setListOther();
						break;
				}
			},

			/**
			 * 选择省份, 传入省份的名称
			 */
			selectProvinice (label) {
				let item = this.data.area.find((x) => {
					return x.label === x.label && !x.checked
				});
				if(item) {
					this.data.area = this.data.area.map((x) => {
						if (x.label !== label) {
							x.checked = false;
							x.children = x.children.map((z) => {
								z.checked = false;
								return z;
							})
						} else {
							x.checked = true;
							this.list = x.children;
						}
						return x;
					})
				}
				this.filter.dataTemp.province = label;
				this.filter.dataTemp.city = '';
			},
			/**
			 * 获取过滤数据
			 */
			getFilterData () {
				let url = 'search.chanpin';
				let param = {
					keyword: this.data.keyword,
					classid: this.filter.data.classify,
					province: this.filter.data.province,
					city: this.filter.data.city,
					resultflag: 1
				};
				if (this.data.brandid) {
					param.e = 1;
					param.d = this.data.brandid + ''
				}
				let pinlei = app.getPinlei().value;
				if (!isNaN(pinlei) && pinlei > 0) {
					param.pinlei = pinlei;
				}
				if (app.globalData.location.province) {
					param.ipprovince = app.globalData.location.province
				}
				ajax.uniajax({
					url: apiurl.geturl(url),
					data: param,
					success: (res) => {
						let appdata = res.data.app;
						if (res.success && appdata.filter) {
							let filter = appdata.filter;
							// this.filter.data.province = filter.shaixuan_diyu_province;
							this.data.classify = filter.json_supplyclass.map((x) => {
								return {
									value: x.id,
									label: x.name,
									checked: false
								}
							});
							this.data.cartype = filter.json_che.map((x) => {
								return {
									value: x.id,
									label: x.name,
									checked: false
								}
							})
							
							this.upParam();
						}
					}
				})
			},
			perload () {
				// 地区数据准备
				let area = areaData.map((x) => {
					let children = x.sub.map((z) => {
						return {
							value: z.name,
							label: z.name,
							checked: false
						}
					});
					let temp = {
						value: x.name,
						label: x.name,
						checked: false,
						children: children
					};
					return temp;
				});
				this.data.area = area;
				//其它数据准备
				this.data.other = [{
					label: '已认证商家',
					value: 'b',
					checked: false
				}, {
					label: '支持在线订购',
					value: 'c',
					checked: false
				}]
				let option = JSON.parse(this.condition);
				if (option.keyword) {
					this.data.keyword = option.keyword
				}
				if (option.brandid) {
					this.data.brandid = option.brandid;
				}
				if (option.province) {
					this.filter.data.province = option.province;
				}
				if (option.city) {
					this.filter.data.city = option.city;
				}
				if (option.classify) {
					this.filter.data.classify = option.classify;
				}
				this.getFilterData();
				this.upParam();
			}
		},
		onLoad() {
			// this.perload();
		},
		onShow() {
			// this.perload();
		},
		mounted() {
			this.perload();
		}
	}
</script>

<style>
	@import '../../common/filter-condition.css'
</style>
