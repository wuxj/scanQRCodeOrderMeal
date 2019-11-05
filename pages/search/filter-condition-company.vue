<template>
	<view>
		<view class="filter-box-zindex">
			<sham-search :keyword="data.keyword" type="1"></sham-search>
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
				labels: ['地区'],
				labelsTemp: ['地区'],
				list: [],
				data: {
					keyword: '',
					area: []
				},
				filter: {
					column: 1, //页面分几列
                    data: {
						province: '',
						city: ''
					},
					dataTemp: {
						province: '',
						city: ''
					},
					show: false,
					type: 0 // 0: 选择省、市 
				}
			};
		},
		methods:{
			upParam () {
				let filter = this.filter.data;
				let param = {};
				if (this.data.keyword) {
					param.keyword = this.data.keyword
				}
				if (filter.province) {
					param.province = filter.province;
				}
				if (filter.city) {
					param.city = filter.city;
				}
				if(this.data.sqid){
					param.sqid = this.data.sqid;
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
				if (temp) {
					this.labels[0] = temp;
				} else {
					this.labels[0] = this.labelsTemp[0]
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
				this.filter.show = false;
				this.upParam();
			},
			/**
			 * 切换设置筛选条件
			 * @param type {number}
			 * 		0: 选择、省市
			 */
			switchFilter (type) {
				this.filter.type = type;
				if (type === 0) {
					this.filter.column = 2;
                }
				if(!this.filter.show) {
					this.filter.dataTemp = {...this.filter.data};
				}
                switch (type) {
					case 0:
						this.setListArea();
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
			 * 选择条件中的某一项，非省份
			 */
			selectItem (value) {
				switch (this.filter.type) {
					case 0:
						this.filter.dataTemp.city = value;
						this.setListArea();
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
			perload (){
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
				
				let option = JSON.parse(this.condition);
				console.log('--3332-')
				console.log(option)
				if (option.keyword) {
					this.data.keyword = option.keyword
				}
				if (option.province) {
					this.filter.data.province = option.province;
				}
				if (option.city) {
					this.filter.data.city = option.city;
				}
				if(option.sqid){
					this.data.sqid = option.sqid;
				}
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
	@import '../../common/filter-condition.css';
</style>
