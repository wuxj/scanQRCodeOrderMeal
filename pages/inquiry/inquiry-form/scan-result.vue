<template>
	<view class="padded-20">
		<view class="text-ac" v-if="image">
			<image class="square-160" :src="image" mode="aspectFit"></image>
		</view>
		<scan-search :defaultValue="vin" @scanvin="scanvin"  @searchvin="searchvin"></scan-search>
		<view class="padded-20">
			<view class="text-ac c-999"> {{datasource.length ? '查询到以下结果,请选择相符的车款' :'没有相关车型信息' }}</view>
			<view v-for="(item, index) in datasource" :key="index" @click="GetCartype(item)">
				<view>{{item.chexingbrandname}}</view>
				<view v-if="item.chexingtype == 2" class="c-999">
					{{(item.chexingniankuan || '') + ' ' + (item.chexingname || '') +' '+ (item.name || '')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import scanSearch from './scan-search.vue'
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import basetools from '@/tools/base-tools.js'
	import app from '@/tools/global-helper'
	export default{
		data(){
			return{
				vin:'',
				image:'',
				datasource:[]
			}
		},
		onLoad(options){
			this.vin = options.vin;
			this.image = options.image;
		},
		onShow(){
			if(this.vin){
				this.image =''
				this.getchexingByvin(1)
			}else if(this.image){
				this.vin =''
				this.doUploadImg(this.image)
			}
		},
		methods:{
			GetCartype(item){
				app.pageNavBack('pages/inquiry/inquiry-form/index', 'carTypeBack', {
					cartypeData: {
						logo:this.imagePath(item.chexingtype) + item.chexingbrandid+'.png',
						pinpaitype:item['chexingtype'],
						vin:item['vin'],
						pinpai:item['chexingbrandname'],
						pinpaiid:item['chexingbrandid'],
						seriesname:'',
						chexing:item['chexingname'],
						niankuan:item['chexingniankuan'],
						cheliangname:item['name']
					}
				}, this);
			},
			imagePath(type) {
				let imagepathArr = ['syc', 'cyc'];
				return 'http://img.qipeiren.com/qipeiren/images/brand-icon-' + imagepathArr[type - 1] + '/';
			},
			searchvin(curValue){
				var patt = new RegExp(/^[A-Za-z0-9]{17}$/);
				if(patt.test(curValue)){ 
					 uni.navigateTo({
					 	url: './scan-result?vin='+ curValue
					 });
				}
				else{
					uni.showToast({
						title:'请输入正确的VIN码',
						icon: 'none',
						duration: 3000
					});
				}
			},
			scanvin(){
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						that.image = res.tempFilePaths.toString()
						that.doUploadImg(that.image)
					}
				});
			},
			doUploadImg(image){
				ajax.uniUpload({
					url: apiurl.geturl('common.FileUpload'),
					filePath: image,
					name: this.getnamebypath(image),
					data: {
						comid: app.globalData['mycomid'],
						type: 2
					},
					success: (res) => {
						let resdata = typeof(res.data) == 'string' ? JSON.parse(res.data) : res.data;
						if(resdata.success){
							let appdata = resdata.data.app
							this.image = appdata.file_path;
							this.vin = '';
							this.getchexingByvin(2);
						}
						else{
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 3000,
							});
						}
					}
				})
			},
			getchexingByvin(type){
				this.datasource = []
				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.GetCheXingByVin'),
					data: {
						comid: app.globalData['mycomid'],
						querytype: type,
						vin: this.vin.toUpperCase(),
						imagepath: this.image
					},
					success: (res) => {
						if(res.success){
							let appdata = res.data.app
							this.vin = appdata.vin
							this.datasource = [appdata]
						}
					}
				})
			},
			// 每张图片名称的唯一标识 
			getnamebypath: function(path) {
				var patharr = path.split('/');
				return patharr[patharr.length - 1].split('.')[0].replace(/[\u4E00-\u9FA5]/g, '').replace(/[^a-zA-Z]/g, '') + '_' +
					basetools.getuuid(5);
			}
		},
		components:{
			scanSearch
		}
	}
</script>
<style>
	@import '../../../common/biz-inquiry.css';
</style>
