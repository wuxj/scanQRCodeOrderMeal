<template>
	<view class="bg-F0F0F0 perfectly-ident-main">
		<view class="ident-head padded-20">
			<view class="c-FFF">已完善身份</view>
			<view class="c-FFF fs-36">1.000.000<icon class="fs-28">+</icon></view>
			
			<!-- 用户身份 -->
			<view class="uni-list padded-t20 padded-b20 usertype-box">
				<view class="uni-list-cell">
					<view class="uni-media-list">
						<view class="uni-media-list-logo square-90">
							<image class="border-circle border-b1" v-if="userTypeLogo" :src="'../../static/userInfo/' + userTypeLogo"></image>
						</view>
						<view class="uni-media-list-body h-auto align-items-center">
							<!-- v-if -->
							<view class="usertype-cont" v-if="showData.userTypeA" @click="onSelectUserType">
								<view class="text-ac">
									<text class="fw-blod fs-28 margin-r4" v-text="showData.userTypeA"></text>—<text class="fs-24 margin-l4" v-text="showData.userTypeB"></text>
								</view>
								<view class="text-ac">
									<uni-icon family="qpr-icon" type="modify" stylecls="dis-inline fs-24"></uni-icon>
									<text class="margin-l8">编辑</text>
								</view>
							</view>
							<!-- v-else -->
							<view class="usertype-cont" v-else>
								<button type="warn" plain="true" size="mini" @click="onSelectUserType">选择用户类型</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mpvue-picker :title="userType.title" ref="userTypePicker" 
		:mode="userType.mode" :deepLength="userType.deepLength" 
		:pickerValueDefault="userType.defaultdata"
		 @onConfirm="userType.onConfirm" @onCancel="userType.onCancel" 
		 :pickerValueArray="userType.sourcedata">
		 </mpvue-picker>
		 
		<!-- 主营行业 -->
		<view class="com-tabbar bg-FFF padded-b20 margin-t20">
			<view class="com-tabbar-nav">
				<block v-for="(item, index) in mainTrade.tabs" :key="index">
					<view :id="index" class="com-tabbar-nav-item border-bb0" :class="{'com-tabbar-nav-item-on': mainTrade.activeIndex == index}" @click="tabClick(index, 'mainTrade')">
						<view class="com-tabbar-nav-title">{{item}}</view>
					</view>
				</block>
			</view>
			<view class="com-tabbar-panel">
				<view :hidden="mainTrade.activeIndex != 0">
					<view class="uni-card box-shadow-none margin-0">
						<block v-for="(item, index) in mainTrade.sourcedata" :key="item.value">
							<view class="uni-list-cell" v-if="item.checked">
								<view class="uni-list-cell-navigate">
									<text>{{item.name}}</text>
									<uni-icon family="qpr-icon" type="trash" stylecls="dis-inline fs-24 c-999" @click="deleteMainTrade(item)"></uni-icon>
								</view>
							</view>
						</block>
					</view>
					<view class="text-ac margin-t20"><button type="warn" plain="true" size="mini" @click="showPopup('mainTrade')">+ 添加主营行业</button></view>
				</view>
			</view>
		</view>
		<uni-popup width="100%" height="480" :show="mainTrade.visible" type="bottom" v-on:hidePopup="hidePopup('mainTrade')">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hidePopup('mainTrade')">取消</view>
				<view class="uni-flex-item">{{mainTrade.title}}</view>
				<view class="uni-flex-item padded-l20 padded-r20 text-ar" @click="surePopup('mainTrade')">确定</view>
			</view>
			<view class="uni-card box-shadow-none overflow-y-auto margin-0" style="height:388upx;">
				<checkbox-group @change="checkboxChangeMainTrade">
					<label class="uni-list-cell uni-list-cell-pd" :class="{'border-bb0': index === mainTrade.sourcedata.length - 1}" v-for="(item, index) in mainTrade.sourcedata" :key="item.value">
						<view>{{item.name}}</view>
						<view>
							<checkbox :value="item.value" :checked="item.checked" />
						</view>
					</label>
				</checkbox-group>
			</view>
		</uni-popup>
		
		<!-- 主营车型/品牌、辅营车型/品牌 -->
		<view class="com-tabbar bg-FFF padded-b20 margin-t20">
			<view class="com-tabbar-nav">
				<block v-for="(item, index) in carBrand.tabs" :key="index">
					<view class="com-divider com-divider-vertical" v-if="index > 0 && index < carBrand.tabs.length"></view>
					<view :id="index" class="com-tabbar-nav-item border-bb0" :class="{'com-tabbar-nav-item-on': carBrand.activeIndex == index}" @click="tabClick(index, 'carBrand')">
						<view class="com-tabbar-nav-title">{{item}}</view>
					</view>
				</block>
			</view>
			<view class="com-tabbar-panel">
				<view :hidden="carBrand.activeIndex != 0">
					<view class="uni-card box-shadow-none margin-0">
						<view class="uni-list-cell" v-for="(item, index) in carBrand.mainSelected" :key="item">
							<view class="uni-list-cell-navigate">
								<text>{{item}}</text>
								<uni-icon family="qpr-icon" type="trash" stylecls="dis-inline fs-24 c-999" @click="deleteCarBrand(item, 'mainSelected')"></uni-icon>
							</view>
						</view>
					</view>
					<view class="text-ac margin-t20"><button type="warn" plain="true" size="mini" @click="addCarBrand('main')" v-if="carBrand.mainSelected.length<10">+ 添加主营车型 / 品牌</button></view>
				</view>
				<view :hidden="carBrand.activeIndex != 1">
					<view class="uni-card box-shadow-none margin-0">
						<view class="uni-list-cell" v-for="(item, index) in carBrand.secondSelected" :key="item">
							<view class="uni-list-cell-navigate">
								<text>{{item}}</text>
								<uni-icon family="qpr-icon" type="trash" stylecls="dis-inline fs-24 c-999" @click="deleteCarBrand(item, 'secondSelected')"></uni-icon>
							</view>
						</view>
					</view>	
					<view class="text-ac margin-t20"><button type="warn" plain="true" size="mini" @click="addCarBrand('second')" v-if="carBrand.secondSelected.length<10">+ 添加辅营车型 / 品牌</button></view>
				</view>
			</view>
		</view>
		<uni-popup width="100%" height="400" :show="carBrand.visible" type="bottom" v-on:hidePopup="hidePopup('carBrand')">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hidePopup('carBrand')">取消</view>
				<view class="uni-flex-item text-nowrap">{{carBrand.title}}</view>
				<view class="uni-flex-item"></view>
			</view>
			<view class="uni-card box-shadow-none margin-0">
				<view class="uni-list-cell uni-list-cell-hd" :class="{'border-bb0': index === carBrand.firstLevel.length - 1}" v-for="(item, index) in carBrand.firstLevel" :key="item.value" @click="selectCarBrand(item)">
					<view class="uni-list-cell-navigate uni-navigate-right">
						{{item.name}}
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 主营类目、辅营类目 -->
		<view class="com-tabbar bg-FFF padded-b20 margin-t20">
			<view class="com-tabbar-nav">
				<block v-for="(item, index) in category.tabs" :key="index">
					<view class="com-divider com-divider-vertical" v-if="index > 0 && index < category.tabs.length"></view>
					<view :id="index" class="com-tabbar-nav-item border-bb0" :class="{'com-tabbar-nav-item-on': category.activeIndex == index}" @click="tabClick(index, 'category')">
						<view class="com-tabbar-nav-title">{{item}}</view>
					</view>
				</block>
			</view>
			<view class="com-tabbar-panel">
				<view :hidden="category.activeIndex != 0">
					<view class="uni-card box-shadow-none margin-0">
						<view class="uni-list-cell" v-for="(item, index) in category.mainSelected" :key="item">
							<view class="uni-list-cell-navigate">
								<text>{{item}}</text>
								<uni-icon family="qpr-icon" type="trash" stylecls="dis-inline fs-24 c-999" @click="deleteCategory(item, 'mainSelected')"></uni-icon>
							</view>
						</view>
					</view>
					<view class="text-ac margin-t20"><button type="warn" plain="true" size="mini" @click="addCategory('main')" v-if="category.mainSelected.length<10">+ 添加主营类目</button></view>
				</view>
				<view :hidden="category.activeIndex != 1">
					<view class="uni-card box-shadow-none margin-0">
						<view class="uni-list-cell" v-for="(item, index) in category.secondSelected" :key="item">
							<view class="uni-list-cell-navigate">
								<text>{{item}}</text>
								<uni-icon family="qpr-icon" type="trash" stylecls="dis-inline fs-24 c-999" @click="deleteCategory(item, 'secondSelected')"></uni-icon>
							</view>
						</view>
					</view>	
					<view class="text-ac margin-t20"><button type="warn" plain="true" size="mini" @click="addCategory('second')" v-if="category.secondSelected.length<10">+ 添加辅营类目</button></view>
				</view>
			</view>
		</view>
		<uni-popup width="100%" height="400" :show="category.visible" type="bottom" v-on:hidePopup="hidePopup('category')">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hidePopup('category')">取消</view>
				<view class="uni-flex-item text-nowrap">{{category.title}}</view>
				<view class="uni-flex-item"></view>
			</view>
			<view class="uni-card box-shadow-none margin-0">
				<view class="uni-list-cell uni-list-cell-hd" :class="{'border-bb0': index === category.firstLevel.length - 1}" v-for="(item, index) in category.firstLevel" :key="item.value" @click="selectCategory(item)">
					<view class="uni-list-cell-navigate uni-navigate-right">
						{{item.name}}
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 其他 -->
		<view class="uni-card box-shadow-none">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onSelectDistCity">
				<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
					所属地区
					<text class="margin-r4" v-text="showData.area? showData.area : '请选择'"></text>
				</view>
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="showPopup('tradeYear')">
				<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
					经营年限
					<text class="margin-r4">{{tradeYear.current.name}}</text>
				</view>
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="showPopup('teamMember')">
				<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
					团队人数
					<text class="margin-r4">{{teamMember.current.name}}</text>
				</view>
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="showPopup('sellMonth')">
				<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
					月销售额 (选填)
					<text class="margin-r4">{{sellMonth.current.name}}</text>
				</view>
			</view>
			<view class="uni-list-cell border-bb0" hover-class="uni-list-cell-hover" @click="showPopup('purchMonth')">
				<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
					月采购额 (选填)
					<text class="margin-r4">{{purchMonth.current.name}}</text>
				</view>
			</view>
		</view>
		
		<!-- 地区选择 -->
		<mpvue-city-picker ref="distCityPicker"
		:pickerValueDefault="distCity.defaultdata"
		 @onCancel="distCity.onCancel" @onConfirm="distCity.onConfirm"></mpvue-city-picker>
		
		<!-- 经营年限 -->
		<uni-popup width="100%" height="480" :show="tradeYear.visible" type="bottom" v-on:hidePopup="hidePopup('tradeYear')">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hidePopup('tradeYear')">取消</view>
				<view class="uni-flex-item">{{tradeYear.title}}</view>
				<view class="uni-flex-item padded-l20 padded-r20 text-ar c-green" @click="surePopup('tradeYear')">确定</view>
			</view>
			<view class="uni-card box-shadow-none overflow-y-auto margin-0" style="height:388upx;">
				<radio-group @change="radioChangeTradeYear">
					<label class="uni-list-cell uni-list-cell-pd" :class="{'border-bb0': index === tradeYear.sourcedata.length - 1}" v-for="(item, index) in tradeYear.sourcedata" :key="item.value">
						<view>{{item.name}}</view>
						<view>
							<radio :value="item.value" :checked="item.value === tradeYear.current.value" />
						</view>
					</label>
				</radio-group>
			</view>
		</uni-popup>
		
		<!-- 团队人数 -->
		<uni-popup width="100%" height="480" :show="teamMember.visible" type="bottom" v-on:hidePopup="hidePopup('teamMember')">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hidePopup('teamMember')">取消</view>
				<view class="uni-flex-item">{{teamMember.title}}</view>
				<view class="uni-flex-item padded-l20 padded-r20 text-ar c-green" @click="surePopup('teamMember')">确定</view>
			</view>
			<view class="uni-card box-shadow-none overflow-y-auto margin-0" style="height:388upx;">
				<radio-group @change="radioChangeTeamMember">
					<label class="uni-list-cell uni-list-cell-pd" :class="{'border-bb0': index === teamMember.sourcedata.length - 1}" v-for="(item, index) in teamMember.sourcedata" :key="item.value">
						<view>{{item.name}}</view>
						<view>
							<radio :value="item.value" :checked="item.value === teamMember.current.value" />
						</view>
					</label>
				</radio-group>
			</view>
		</uni-popup>
		
		<!-- 月销售额 -->
		<uni-popup width="100%" height="480" :show="sellMonth.visible" type="bottom" v-on:hidePopup="hidePopup('sellMonth')">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hidePopup('sellMonth')">取消</view>
				<view class="uni-flex-item">{{sellMonth.title}}</view>
				<view class="uni-flex-item padded-l20 padded-r20 text-ar c-green" @click="surePopup('sellMonth')">确定</view>
			</view>
			<view class="uni-card box-shadow-none overflow-y-auto margin-0" style="height:388upx;">
				<radio-group @change="radioChangeSellMonth">
					<label class="uni-list-cell uni-list-cell-pd" :class="{'border-bb0': index === sellMonth.sourcedata.length - 1}" v-for="(item, index) in sellMonth.sourcedata" :key="item.value">
						<view>{{item.name}}</view>
						<view>
							<radio :value="item.value" :checked="item.value === sellMonth.current.value" />
						</view>
					</label>
				</radio-group>
			</view>
		</uni-popup>
		
		<!-- 月采购额 -->
		<uni-popup width="100%" height="480" :show="purchMonth.visible" type="bottom" v-on:hidePopup="hidePopup('purchMonth')">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hidePopup('purchMonth')">取消</view>
				<view class="uni-flex-item">{{purchMonth.title}}</view>
				<view class="uni-flex-item padded-l20 padded-r20 text-ar c-green" @click="surePopup('purchMonth')">确定</view>
			</view>
			<view class="uni-card box-shadow-none overflow-y-auto margin-0" style="height:388upx;">
				<radio-group @change="radioChangePurchMonth">
					<label class="uni-list-cell uni-list-cell-pd" :class="{'border-bb0': index === purchMonth.sourcedata.length - 1}" v-for="(item, index) in purchMonth.sourcedata" :key="item.value">
						<view>{{item.name}}</view>
						<view>
							<radio :value="item.value" :checked="item.value === purchMonth.current.value" />
						</view>
					</label>
				</radio-group>
			</view>
		</uni-popup>
		
		<view class="fixed-bottom-box">
			<view class="bottom-content">
				<button type="warn" :loading="submitLoading"  @click="submitForm">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import mpvuePicker from '../../components/mpvuePicker.vue';
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	import uniPopup from '../../components/uni-popup.vue';
	import uniIcon from '../../components/uni-icon.vue'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import addrArea from '../../components/mpvue-citypicker/city-data/area'
	import addrCity from '../../components/mpvue-citypicker/city-data/city'
	import addrProvince from '../../components/mpvue-citypicker/city-data/province'
	import selectItem from './select-item'
	import app from '@/tools/global-helper'

	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker,
			uniPopup,
			uniIcon
		},
		onLoad () {
			ajax.uniajax({
				url: apiurl.geturl('center.GetUserInfo'),
				data: {
					comid: app.globalData.mycomid
				},
				success: (res) => {
					let appdata = res.data.app;
					if (res.success) {
						this.userInfo = {...appdata};
						this.preData();
						this.upSelectItemData();
						this.dataLoaded = true;
					}
				}
			})
		},
		onShow () {
			if (this.dataLoaded) {
				this.upSelectItemData();
			}
		},
		data() {
			return {
				submitLoading: false,
				dataLoaded: false,
				userInfo: {},
				showData: {
					userTypeA: '',
					userTypeB: '',
					area: ''
				},
				userType: {
					title: '选择用户类型',
					mode: 'multiLinkageSelector',
					deepLength: 2,
					defaultdata: [0, 0],
					sourcedata: [{
						value: '100',
						label: '商家',
						children: [{
							value: "1",
							label: "厂家"
						}, {
							value: "2",
							label: "经销商"
						}]
					}, {
						value: '200',
						label: '用户',
						children: [{
							value: "3",
							label: "修理厂"
						}, {
							value: "4",
							label: "4S店"
						}, {
							value: "5",
							label: "车队"
						}, {
							value: "6",
							label: "司机"
						},{
							value: "7",
							label: "其他"
						}]
					}],
					onConfirm: (e) => {
						if(e.value.length == 2) {
							this.userInfo.usertype = parseInt(e.value[1])
							let item = e.label.split('-');
							this.showData.userTypeA = item[0];
							this.showData.userTypeB = item[1];
						}
					}
				},
				mainTrade: {
					tabs: ["主营行业"],
					activeIndex: 0,
					title: '选择主营行业',
					visible: false,
					changed: false,
					sourcedata:  [{
						value: '商用车配件',
						name: '商用车配件'
					}, {
						value: '乘用车配件',
						name: '乘用车配件'
					}, {
						value: '工程机械配件',
						name: '工程机械配件'
					}, {
						value: '整车及专用车',
						name: '整车及专用车'
					}, {
						value: '其他',
						name: '其他'
					}]
				},
				carBrand: {
					tabs: ["主营车型 / 品牌", "辅营车型 / 品牌 (选填)"],
					activeIndex: 0,
					title: '添加主营车型 / 品牌',
					visible: false,
					changed: false,
					mainSelected: [],
					secondSelected:[],
					firstLevel:  [{
						value: '1',
						name: '商用车'
					}, {
						value: '2',
						name: '乘用车'
					}, {
						value: '3',
						name: '工程机械'
					}]
				},
				category: {
					tabs: ["主营类目", "辅营类目 (选填)"],
					activeIndex: 0,
					title: '添加主营类目',
					visible: false,
					changed: false,
					mainSelected: [],
					secondSelected:[],
					firstLevel:  [{
						value: '1',
						name: '商用车'
					}, {
						value: '2',
						name: '乘用车'
					}, {
						value: '3',
						name: '工程机械'
					}]
				},
				distCity: {
					title: '选择所属地区',
					defaultdata: [0, 0, 0],
					changed: false,
					onConfirm: (e) => {
						this.showData.area = e.label.replace(/-/g, ',');
					},
					onCancel: (e) => {
					}
				},
				tradeYear: {
					title: '选择经营年限',
					visible: false,
					current: {
						name: '请选择',
						value: 0
					},
					sourcedata:  [{
						name: '1年以内',
						value: '1'
					}, {
						name: '1年~3年',
						value: '2'
					}, {
						name: '3年~5年',
						value: '3'
					}, {
						name: '5年~10年',
						value: '4'
					}, {
						name: '10年以上',
						value: '5'
					}]
				},
				teamMember: {
					title: '选择团队人数',
					visible: false,
					current: {
						name: '请选择',
						value: 0
					},
					sourcedata:  [{
						name: '1人',
						value: '1'
					}, {
						name: '2~5人',
						value: '2'
					}, {
						name: '6~10人',
						value: '3'
					}, {
						name: '11~20人',
						value: '4'
					}, {
						name: '21~30人',
						value: '5'
					}, {
						name: '31~50人',
						value: '6'
					}, {
						name: '51~100人',
						value: '7'
					}, {
						name: '101~500人',
						value: '8'
					}, {
						name: '500人以上',
						value: '9'
					}]
				},
				sellMonth: {
					title: '选择月销售额',
					visible: false,
					current: {
						name: '请选择',
						value: 0
					},
					sourcedata:  [{
						name: '1万以下',
						value: '1'
					}, {
						name: '1~5万',
						value: '2'
					}, {
						name: '5~10万',
						value: '3'
					}, {
						name: '10~30万',
						value: '4'
					}, {
						name: '30~50万',
						value: '5'
					}, {
						name: '50~100万',
						value: '6'
					}, {
						name: '100万以上',
						value: '7'
					}]
				},
				purchMonth: {
					title: '选择月采购额',
					visible: false,
					current: {
						name: '请选择',
						value: '3'
					},
					sourcedata:  [{
						name: '1万以下',
						value: '1'
					}, {
						name: '1~5万',
						value: '2'
					}, {
						name: '5~10万',
						value: '3'
					}, {
						name: '10~30万',
						value: '4'
					}, {
						name: '30~50万',
						value: '5'
					}, {
						name: '50~100万',
						value: '6'
					}, {
						name: '100万以上',
						value: '7'
					}]
				}
			};
		},
		computed: {
			userTypeLogo () {
				let logo = '';
				switch (this.showData['userTypeA']){
					case '商家':
						logo = 'seller-tx.jpg';
						break;
					case '用户':
							logo = 'buyer-tx.jpg';
							break;
					default:
						logo = 'default-tx.jpg';
						break;
				}
				return logo;
			}
		},
		methods: {
			preData () {
				let info = this.userInfo;
				let keys = Object.keys(info);
				keys.forEach((x) => {
					let value = info[x];
					var temp = null;
					switch (x) {
						case 'usertype': // 用户类型 ok
							if (value) {
								value = value + '';
								var list = this.userType.sourcedata;
								for (let z = 0; z < list.length; z++) {
									let item = list[z];
									let index2 = 0;
									let temp = item.children.find((m, im) => {
										index2 = im;
										return m.value === value
									});
									if (temp) {
										this.showData.userTypeA = item.label;
										this.showData.userTypeB = temp.label;
										this.userType.defaultdata = [z, index2];
										break;
									}
								}
							}
							break;
						case 'zhuyinghangye': // 主营行业 ok
							var temp = value.split(',');
							if (temp.length) {
								let list = this.mainTrade.sourcedata;
								list = list.map((z) => {
									if (temp.indexOf(z.value) >=0) {
										z.checked = true
									} else {
										z.checked = false
									}
									return z;
								});
								this.mainTrade.sourcedata = list;
							}
							break;
						case 'zhuyingleimu': // 主营类目 ok
							selectItem.initCategory(value, 0);
							break;
						case 'fuyingleimu': //辅营类目 ok
							selectItem.initCategory(value, 1);
							break;
						case 'zhuyingpinpai': // 主营品牌 ok
							selectItem.initBrand(value, 0);
							break;
						case 'fuyingpinpai': // 辅营品牌 ok
							selectItem.initBrand(value, 1);
							break;
						case 'userdiqu': // 地区 ok
							let area = value.split(',');
							let item = [0, 0, 0];
							let i1 = addrProvince.findIndex((z) => {
								return z.label === area[0];
							});
							if (i1 >= 0) {
								item[0] = i1;
								if (area.length > 1) {
									temp = addrCity[i1];
									let i2 = temp.findIndex((z) => {
										return z.label === area[1]
									});
									if (i2 >= 0) {

										item[1] = i2;
										if (area.length > 2) {
											temp = addrArea[i1][i2];
											let i3 = temp.findIndex((y) => {
												return y.label === area[2]
											});
											if (i3 >= 0) {
												item[2] = i3;
											}
										}
									}
								}
							}
							this.distCity.defaultdata = [...item];
							this.showData.area = value;
							break;
						case 'jingyingnianxian': // 经营年限 ok
							var list = this.tradeYear.sourcedata;
							var name = this.getName(value, list);
							if (name) {
								this.tradeYear.current = {
									value: value + '',
									name: name
								}
							}
							break;
						case 'tuanduirenshu': // 团队人数 ok
							var list = this.teamMember.sourcedata;
							var name = this.getName(value, list);
							if (name) {
								this.teamMember.current = {
									value: value + '',
									name: name
								}
							}
							break;
						case 'yuexiaoshoue': // 月销售额 ok
							var list = this.sellMonth.sourcedata;
							var name = this.getName(value, list);
							if (name) {
								this.sellMonth.current = {
									value: value + '',
									name: name
								}
							}
							break;
						case 'yuecaigoue': // 月采购额 ok
							var list = this.purchMonth.sourcedata;
							var name = this.getName(value, list);
							if (name) {
								this.purchMonth.current = {
									value: value + '',
									name: name
								}
							}
							break;
					}
				})
			},
			/**
			 * 选择品牌、选择分类数据更新
			 */
			upSelectItemData () {
				let carBrand = selectItem.getSelectedCarBrand();
				var parseFun = function(data){
					let temp = [];
					for (var i in data) {
						let key = '';
						switch (i) {
							case '1':
								key = '商用车';
								break;
							case '2':
								key = '乘用车';
								break;
							case '3':
								key = '工程机械';
								break;
						}
						data[i].forEach((x) => {
							temp.push(key + ' > ' + x);
						})
					}
					return temp;
				};

				this.carBrand.mainSelected = parseFun(carBrand.main);
				this.carBrand.secondSelected = parseFun(carBrand.second);
				// ----------------------------------------------
				let category = selectItem.getSelectedCategory();
				var parseFun2 = function(data){
					let temp = [];
					for (var i in data) {
						let key = '';
						switch (i) {
							case '1':
								key = '商用车配件';
								break;
							case '2':
								key = '乘用车配件';
								break;
							case '3':
								key = '工程机械配件';
								break;
						}
						data[i].forEach((x) => {
							let z = x.split('|');
							temp.push(key + ' > ' + z.pop());
						})
					}
					return temp;
				};
				this.category.mainSelected = parseFun2(category.main);
				this.category.secondSelected = parseFun2(category.second);
			},
			/**
			 *
			 * @param value int or string 要查找的值
			 * @param list array 列表
			 */
			getName (value, list) {
				value += '';
				let item = list.find((x) => {
					return (x.value + '') === value
				});
				if (item) {
					return item.name
				} else {
					return ''
				}
			},
			// 选择用户类型
			onSelectUserType () {
				this.$refs.userTypePicker.show()
			},
			// 主营行业-选中
			checkboxChangeMainTrade (e) {
				this.checkboxChange(e, 'mainTrade')
			},
			// 主营行业-删除
			deleteMainTrade (item) {
				let that = this;
				that['mainTrade'].sourcedata = that['mainTrade'].sourcedata.map(x=>{
					if(x.value == item.value){
						x.checked = false;
					}
					return x;
				})
				// 触发视图更新
				that['mainTrade'].changed = !that['mainTrade'].changed;
			},
			
			// 车型品牌-添加
			addCarBrand (type) {
				switch(type){
					case 'main':
					this.carBrand.title = '添加主营车型 / 品牌';
					break;
					case 'second':
					this.carBrand.title = '添加辅营车型 / 品牌';
					break;
				}
				this.showPopup('carBrand');
			},
			// 车型品牌-选择
			selectCarBrand(firstLevel){
				let cate = this.carBrand.activeIndex === 0 ? 'main' : 'second';
				uni.navigateTo({
					url: 'ident-son-carbrand?type=' + firstLevel.value + '&name=' + firstLevel.name + '&cate=' + cate
				});
				this.carBrand.visible = false;
			},
			// 车型品牌-删除
			deleteCarBrand(item, target){
				let that = this;
				let items = that.carBrand[target];
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if(items[i] == item){
						items.splice(i, 1);
						break
					}
				}
				selectItem.initBrand(items.join(','), this.carBrand.activeIndex)
			},
			// 类目-添加
			addCategory (type){
				switch(type){
					case 'main':
					this.category.title = '添加主营类目'
					break;
					case 'second':
					this.category.title = '添加辅营类目'
					break;
				}
				this.showPopup('category');
			},
			// 类目-选择
			selectCategory(firstLevel){
				let cate = this.category.activeIndex === 0 ? 'main' : 'second';
				uni.navigateTo({
					url: 'ident-son-category?type=' + firstLevel.value + '&name=' + firstLevel.name + '&cate=' + cate
				});
				this.category.visible = false;
			},
			// 类目-删除
			deleteCategory(item, target){
				let that = this;
				let items = that.category[target];
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if(items[i] == item){
						items.splice(i, 1);
						break
					}
				}
				selectItem.initCategory(items.join(','), this.category.activeIndex);
			},
			// 选择地区
			onSelectDistCity () {
				this.$refs.distCityPicker.show()
			},
			// 经营年限选中
			radioChangeTradeYear (e){
				this.redioChange(e, 'tradeYear');
			},
			// 团队人数选中
			radioChangeTeamMember (e){
				this.redioChange(e, 'teamMember');
			},
			// 月销售额选中
			radioChangeSellMonth (e){
				this.redioChange(e, 'sellMonth');
			},
			// 月采购额选中
			radioChangePurchMonth (e){
				this.redioChange(e, 'purchMonth');
			},
			redioChange (e, target) {
				let that = this;
				let items = that[target].sourcedata;
				let value = null;
				for (let i = 0; i < items.length; i++) {
					if (items[i].value === e.target.value) {
						value = items[i].value;
						that[target].current = items[i];
						break;
					}
				}
				if (value) {
					switch (target) {
						case 'tradeYear':
							this.userInfo.jingyingnianxian = parseInt(value);
							break;
						case 'teamMember':
							this.userInfo.tuanduirenshu = parseInt(value);
							break;
						case 'sellMonth':
							this.userInfo.yuexiaoshoue = parseInt(value);
							break;
						case 'purchMonth':
							this.userInfo.yuecaigoue = parseInt(value);
							break;
					}
				}
			},
			checkboxChange (e, target) {
				let that = this;
				let items = that[target].sourcedata,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					items[i].checked = false;
					for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
						if (items[i].value == values[j]) {
							items[i].checked = true;
							break
						}
					}
				}
			},
			showPopup (target) {
				this[target].visible = true
			},
			hidePopup (target) {
				this[target].visible = false
			},
			surePopup (target) {
				this.hidePopup(target)
			},
			tabClick (index, target) {
				this[target].activeIndex = index
			},
			showToast (msg) {
				uni.showToast({
					title: msg,
					icon: 'none',
					duration: 2000
				});
			},
			submitForm () {
				if (this.submitLoading) {
					return;
				}
				let values = this.userInfo;
				let msg = '';
				if (values.usertype <= 0) {
					this.showToast('请选择用户类型');
					return
				}

				let temp = [];
				// ---------------------- 主营行业
				this.mainTrade.sourcedata.forEach((x) => {
					if (x.checked) {
						temp.push(x.value)
					}
				});
				if(!temp.length) {
					this.showToast('请选择主营行业');
					return
				}
				values.zhuyinghangye = temp.join(',');
				//----------------------
				temp = [];
				this.carBrand.mainSelected.forEach((x) => {
					temp.push(x.replace(/\s*>\s*/g, '|'));
				});
				if(!temp.length) {
					this.showToast('请选择主营车型/品牌');
					return
				}
				values.zhuyingpinpai = temp.join(','); // 主营类目
				temp = [];
				this.carBrand.secondSelected.forEach((x) => {
					temp.push(x.replace(/\s*>\s*/g, '|'));
				});
				values.fuyingpinpai = temp.join(','); // 辅营品牌
				//----------------------
				let category = selectItem.getSelectedCategory();
				var parseFun = function(data){
					let temp2 = [];
					for (var i in data) {
						let key = '';
						switch (i) {
							case '1':
								key = '商用车配件';
								break;
							case '2':
								key = '乘用车配件';
								break;
							case '3':
								key = '工程机械配件';
								break;
						}
						data[i].forEach((x) => {
							temp2.push(key + '|' + x);
						})
					}
					return temp2.join(',');
				};
				temp = parseFun(category.main);
				if (!temp) {
					this.showToast('请选择主营类目');
					return
				}
				values.zhuyingleimu = temp;
				values.fuyingleimu = parseFun(category.second);
				values.userdiqu = this.showData.area;
				delete  values.hassubmit;
				delete values.iswanshan;

				this.submitLoading = true;
				ajax.uniajax({
					url: apiurl.geturl('center.UserInfoSubmit'),
					showLoading: false,
					data: {
						comid: app.globalData.mycomid,
						userinfo: JSON.stringify(values),
						fromsite: 2
					},
					success: (res) => {
						this.submitLoading = false;
						this.showToast(res.message);
						if (res.success) {
							uni.navigateBack({
								delta: 1
							});
						}
					}
				})
			}
		}
	}
</script>

<style>
page{
	height:100%;
	background:#FFF;
}
.perfectly-ident-main{overflow:hidden;}
.perfectly-ident-main .ident-head{background:linear-gradient(145deg, #EB2D59 20%, #FD6E46 80%);}
.perfectly-ident-main .ident-head .usertype-box{border-radius:5upx;}
.perfectly-ident-main .ident-head .usertype-box .usertype-cont{margin-left:-90upx;}
</style>