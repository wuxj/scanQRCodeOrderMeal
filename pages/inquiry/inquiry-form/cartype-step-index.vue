<template>
	<view class="bg-F2F2F2">
		<view class="inquiry-position w-per-100 bg-FFF" id="fixedTopBox">
			<cartype-tabbar :tabs="tabs" :type="type" @tabClick="tabClick"></cartype-tabbar>
			<view class="steps-search" v-if="preciseOrSpeedy =='precise'">
				<cartype-steps
					:titles="steps[type]['titles']" 
					:activeidx="steps[type]['activeidx']"
					@stepClick="stepClick"
					>
				</cartype-steps>
			</view>
		</view>
		
		<view :style="{'display': steps[type]['activeidx'] == 0 ? 'block' : 'none'}">
			<cartype-step-brand :type="type" :titleHeight="titleHeight" @itemClick="showSeries" @itemBack="itemBack"></cartype-step-brand>
		</view>
		<view :style="{'display': steps[type]['activeidx'] == 1 ? 'block' : 'none'}">
			<cartype-step-series :type="type" :series="series" :titleHeight="titleHeight" @itemClick="showModals" @itemBack="itemBack"></cartype-step-series>
		</view>
		<view :style="{'display': steps[type]['activeidx'] == 2 ? 'block' : 'none'}">
			<cartype-step-modal :type="type" :modals="modals" :titleHeight="titleHeight" @itemBack="itemBack"></cartype-step-modal>
		</view>
	</view>
</template>

<script>
	import cartypeSteps from './cartype-steps.vue'	
	import cartypeTabbar from './cartype-tabbar.vue'	
	import uniIcon from '@/components/uni-icon.vue'	
	import cartypeStepBrand from './cartype-step-brand.vue'	
	import cartypeStepSeries from './cartype-step-series.vue'	
	import cartypeStepModal from './cartype-step-modal.vue'	

	
	import dataInquiry from '../../../static-source/cartype-data-inquiry.js'

	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default {
		data() {
			return {
				tabs:['商用车','乘用车'],
				activeIndex: 0,
				type:1,
				steps:{
					1:{
						titles: [{title: '品', 'name': '', defaultname:'选择品牌'}, {title: '型', name:'', defaultname:'选择车系'}],
						activeidx: 0
					},
					2:{
						titles: [{title: '品', 'name': '', defaultname:'选择品牌'}, {title: '系', 'name': '', defaultname:'选择车系'}, {title: '型', 'name': '', defaultname:'选择车型'}],
						activeidx: 0
					}
				},
				dataSource: dataInquiry,

				titleHeight: 0,

				series: [],

				preciseOrSpeedy:''
			}
		},
		onLoad(options){
			this.preciseOrSpeedy = options.preciseOrSpeedy
		},
		computed:{
		},
		onReady() {
			this.caclSize();
		},
		onShow(){

		},
		watch:{
			activeIndex (){
				this.type = this.activeIndex + 1 // 1, 2
				this.series = []
			}
		},
		methods:{
			caclSize(){
				let that = this
				//获取顶部切换标题高度
				var viewTop = uni.createSelectorQuery().select('#fixedTopBox')			
				viewTop.boundingClientRect(resTop => {
					//计算得出滚动区域的高度
					that.titleHeight = resTop.height;
				}).exec();
			},
			// series、brand
			showSeries (brandid, brandname){
				if(this.preciseOrSpeedy === 'precise'){
					this.steps[this.type]['titles'][0]['name'] = brandname;
					this.steps[this.type]['titles'][0]['id'] = brandid;
					
					if(this.type == 1){
						this.getSycSeries(brandid);
					}else{
						this.getCycSeries(brandid);
					}
					this.steps[this.type]['activeidx'] = 1;
				}else if(this.preciseOrSpeedy === 'speedy'){
					this.itemBackSpeedy(brandid, brandname);
				}
			},
			getSycSeries (brandid){
				let result = this.dataSource[this.type]
				for(let i in result){ 
					for(let ii in result[i]){
						let item = result[i][ii]
						if(item.id == brandid){ // 找到了品牌的id 
							this.series = item.sub
							break;
						}
					}
				}
			},
			getCycSeries (brandid){
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.GetCheXingById'),
					data: {
						comid: app.globalData['mycomid'],
						id: brandid
					},
					showLoading: false,
					success: (res) => {
						if (res.success) {
							let appdata = res.data.app
							if(appdata.resulttype === 1){
								that.series = Array.isArray(appdata.result) ? appdata.result : [];
							}
						}
					},
				})
				
			},
			showModals (seriesname, chexingid, chexing, modalsData){
				this.steps[this.type]['titles'][1]['seriesname'] = seriesname;
				this.steps[this.type]['titles'][1]['name'] = chexing;
				this.steps[this.type]['titles'][1]['id'] = chexingid;
				this.steps[this.type]['activeidx'] = 2;
				this.modals = modalsData;
			},
			// item back precise
			itemBack(param){
				var carType = {
					pinpai: this.steps[this.type]['titles'][0]['name'] || param.brandname,
					pinpaitype: this.type,
					pinpaiid: this.steps[this.type]['titles'][0]['id'] || param.brandid,
					seriesname: param.seriesname || param.pname || param.changshang || this.steps[this.type]['titles'][1]['seriesname'] || '',
					chexing: param.name || param.chexing || param.chexingname || this.steps[this.type]['titles'][1]['name'],
					niankuan: param.yeartype || '',
					cheliangname: param.modalname || ''
				};
				
				app.pageNavBack('/pages/inquiry/inquiry-form/index', 'carTypeBack', {
					preciseOrSpeedyIdx: 0,
					cartypeData: carType
				}, this);
			},
			// item back speedy
			itemBackSpeedy(brandid, brandname){
				var carType = {
					pinpaitype: this.type,
					pinpaiid: brandid,
					pinpai: brandname
				};
				app.pageNavBack('/pages/inquiry/inquiry-form/index', 'carTypeBack', {
					preciseOrSpeedyIdx: 1,
					cartypeData: carType
				}, this);
			},
			tabClick(index){
				this.activeIndex = index;
			},
			stepClick(index){
				if(index < this.steps[this.type]['activeidx']){
					// 设置active
					this.steps[this.type]['activeidx'] = index
					
					// 清空数据
					var titles = this.steps[this.type]['titles'];
					for(var i = 0; i < titles.length; i++){
						if(i > index){
							for(var key in titles[i]){
								if(key != 'title' && key != 'defaultname'){
									delete titles[i][key];
								}
							}
						
						}
					}
				}
			}
		},
		components:{
			cartypeSteps,
			uniIcon,
			cartypeTabbar,
			cartypeStepBrand,
			cartypeStepSeries,
			cartypeStepModal
		}
	}
</script>