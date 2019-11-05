<template>
	<view class="margin-t100">
		<cartype-choose-scanbtn v-if="!cartypeItem"></cartype-choose-scanbtn>

		<!-- 选择车型的效果 -->
		<view class="bg-FFF" v-else>
			<view class="uni-flex padded-20 ">
				<view class="text-ac">
					<image class="square-120 " :src="cartypeItem.logo" mode="aspectFit"></image>
				</view>
				<view class="uni-flex-item padded-20">
					<view v-text="cartypeItem.seriesname+ ' ' +cartypeItem.chexing"></view>
					<view class="fs-12" v-text="cartypeItem.cheliangname" v-if="cartypeItem.cheliangname"></view>
					<view class="fs-12 c-999" v-text="cartypeItem.vin" v-if="cartypeItem.vin"></view>
				</view>

				<view class="text-ac padded-t40" @click="changeCartype">
					<view><uni-icon type="loop" size="18" color="#666666"></uni-icon></view>
					<view class="padded-r10">切换车型</view>
				</view>
			</view>
		</view>

		<view class="margin-t6">
			<view class="border-bt1 bg-FFF" >
				<view class="uni-flex padded-20 margin-b10" @click="showPopup('quality')">
					<view class="uni-flex-item padded-r10">品质范围</view>
					<view class="c-999" >
						<text>{{quality.currentNames}}</text>
						<uni-icon stylecls="dis-inline" type="arrowright"></uni-icon> 
					</view>
				</view>
			</view>
			<precise-popup width="100%" height="480" :show="quality.visible" type="bottom" 
				selectType="checkbox"
				:title="quality.title"
				:sourcedata="quality.sourcedata"
				@handleChange="checkboxChangequality"
				@hidePopup="hidePopup('quality')"
				@surePopup="surePopup('quality')">
			</precise-popup>
			
			<view class="bg-FFF" >
				<view class="uni-flex padded-20 margin-t10" @click="showPopup('invoice')">
					<view class="uni-flex-item padded-r10">发票类型</view>
					<view class="c-999">
						<text>{{invoice.current.name}}</text>
						<uni-icon stylecls="dis-inline" type="arrowright"></uni-icon> 
					</view>
				</view>
			</view>
			
			<precise-popup width="100%" height="480" :show="invoice.visible" type="bottom" 
				selectType="radio"
				:title="invoice.title"
				:sourcedata="invoice.sourcedata"
				@handleChange="radioChangeInvoice"
				@hidePopup="hidePopup('invoice')"
				@surePopup="surePopup('invoice')">
			</precise-popup>
		</view>

		<view class="margin-t10">
			<view class="bg-FFF text-ac padded-20 uni-card-link" @click="partsadd">添加配件<uni-icon stylecls="dis-inline" size="22" type="plus-filled"></uni-icon></view>
		</view>
		
		<view class="margin-10" v-if="partlist.length">
			<view>已添加配件</view>
			<view class="bg-FFF uni-flex align-items-center margin-t10 padded-10 padded-r20" v-for="(item,i) in partlist">
				<view class="padded-l10 padded-r10" @click="doPartsDel(item)">
					<uni-icon type="minus" stylecls="c-red" size="22"></uni-icon>
				</view>
				<view class="uni-flex-item">
					<view class="uni-flex margin-b10">
						<view class="uni-flex-item text-ellipsis">
						{{item.name}}
						</view>
						<view class="margin-l10">
							<!-- count 动态删除 数量待调整 TODO... -->
							<uni-spinner :extra="item" :value="item.count" @change="partsCountChange"></uni-spinner>
						</view>
					</view>
					<view class="margin-t4 bg-F2F2F2 padded-10">
						<textarea class="w-per-100" v-model="item.remark" auto-height="true" placeholder="请输入OME号/该配件相关信息留言"></textarea>
					</view>
				</view>
			</view>
		</view>

		<view class="margin-t6">
			<view class="bg-FFF">
				<view class="padded-20">
					<text>照片附件</text>
					<view><uni-uploadImage count="9" :isLimit="true" @uploadimage="uploadImage"/></view>
				</view>
				<view class="padded-20">
					备注<text class="c-999 margin-l10">(选填)</text>
					<view class="uni-textarea margin-b40">
						<textarea class="h-100 border-b1 border-bc-E4E4E4" v-model="remark" maxlength="200" placeholder="请填写需要额外说明的信息,200字以内"/>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue'	
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import precisePopup from './precise-popup.vue';
	import uniUploadImage from '@/components/uni-upload-image.vue'
	import cartypeChooseScanbtn from './cartype-choose-scanbtn.vue'
	import uniSpinner from '@/components/uni-spinner.vue'

	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	
	import app from '@/tools/global-helper'
	export default{
		data(){
			return{
				kinds:0,
				count:0,
				image:[],
				//vin-scan-cartype-choose
				partlist:[],
				quality:{
					title: '选择品质',
					activeIndex: 0,
					visible: false,
					changed: false,
					currentNames: '请选择',
					currentVals:'',
					sourcedata:  [{
						value:1,
						name: '原厂'
					},
					{
						value: 2,
						name: '品牌'
					},
					{
						value: 3,
						name: '拆车'
					},
					{
						value: 4,
						name: '其他'
					}]
				},
				// 发票单选
				invoice: {
					title: '选择发票',
					visible: false,
					current: {
						name: '请选择',
						value: 0
					},
					sourcedata:  [{
						name: '不需要开发票',
						value: '1'
					}, {
						name: '普通发票',
						value: '2'
					}, {
						name: '增值税发票',
						value: '3'
					}]
				},				
				images:{},
				remark:'',
				submitLoading: false
			}
		},
		props:['cartypeData'],
		onShow(){
			// 配件
			let that = this;
			app.getPageParamByNavBack('selPartBack', function(data){
				let partlist = data.partlist;
				if(partlist){
					that.partlist = partlist;
				}
			}, that);
		},
		computed:{
			cartypeItem () {
				return this.cartypeData || ''
			}
		},
		watch:{
			partlist(){
				this.count = 0
				this.partlist.map((item)=>{
					this.count = parseInt(this.count)+parseInt(item.count)
				})
				this.kinds = this.partlist.length
			},
			kinds (){
				this.$emit('kindsChange', this.kinds, this.count);
			},
			count (){
				this.$emit('kindsChange', this.kinds, this.count);
			}
		},
		methods:{
			// Popup 相关
			showPopup (target) {
				this[target].visible = true
			},
			hidePopup (target) {
				this[target].visible = false
			},
			surePopup (target) {
				this.hidePopup(target)
			},
			// 多选
			checkboxChangequality (e) {
				this.checkboxChange(e, 'quality')
				let datasource = this.quality.sourcedata;
				let item =[];
				let vals = [];
				datasource.map(x=>{
					if(x.checked){
						item.push(x.name);
						vals.push(x.value);
					}
				})
				this.quality.currentNames = item.join(',');
				this.quality.currentVals = vals.join(',');
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
			// 单选 选中
			radioChangeInvoice (e){
				this.redioChange(e, 'invoice');
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
			},
			partsadd(){
				let partstr = JSON.stringify(this.partlist)
				uni.navigateTo({
					url: './parts-add?preciseParts='+ partstr
				});
			},
			doPartsDel(item){
				this.partlist.splice(this.partlist.findIndex((x) => {
					 return x.name === item.name;
					 }), 1)
			},
			partsCountChange(val, item){
				item.count = val;
				this.partlist.splice(this.partlist.findIndex((x) => {
									 return x.name === item.name;
						}), 1, item)
			},
			// 切换车型
			changeCartype(){
				uni.navigateTo({
					url: './cartype-rechoose'
				});
			},
			uploadImage(imgarr, isuploadcompleted){
				//获取所有图片地址
				this.images = {
					imgarr: imgarr,
					iscompleted: isuploadcompleted
				}
            },
			xunjiasubmit(){
				let that = this
				if (that.submitLoading) {
					return;
				}
				if(!that.cartypeItem){
					that.showToast('请选择车型');
					return false
				}else if(that.quality.current =='请选择'){
					that.showToast('请选择品质范围');
					return false
				} else if(!that.invoice.current.value){
					that.showToast('请选择发票类型');
					return false
				}else if(that.partlist.length==0){
					that.showToast('请选择配件');
					return false
				}
				if(that.images.imgarr && that.images.imgarr.length && !that.images.iscompleted){
					that.showToast('图片上传中...');
					return false
				}

				let xunjiainfo = {
					type:1,
					vin:that.cartypeItem.vin || '',
					pinpai:that.cartypeItem.pinpai,
					pinpaitype:that.cartypeItem.pinpaitype,
					pinpaiid:that.cartypeItem.pinpaiid,
					chexing:that.cartypeItem.chexing,
					niankuan:that.cartypeItem.niankuan,
					cheliangname:that.cartypeItem.cheliangname,
					pinzhi:that.quality.currentVals,
					fapiaotype:that.invoice.current.value,
					peijian:that.partlist,
					image:that.images.imgarr || [],
					remark:that.remark
				}
				that.submitLoading = true;
				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.XunjiaSubmit'),
					data: {
						comid: app.globalData['mycomid'],
						xunjiainfo: JSON.stringify(xunjiainfo)
					},
					success: (res) => {
						that.submitLoading = false;
						if (res.success) {
							uni.showModal({
								title: '发布成功',
								content:'您的询价信息已匹配给优质供应商，请在我的询价内查看',
								showCancel:false,
								confirmText:'确定',
								success: function (res) {
									if (res.confirm) {
										uni.redirectTo({
											url: '/pages/inquiry/inquiry-list'
										})
									}
								}
							});
							
						}
					},
				})
			},
			showToast (msg) {
				uni.showToast({
					title: msg,
					icon: 'none',
					duration: 2000
				});
			},
		},
		components:{
			uniIcon,
			uniNavBar,
			uniUploadImage,
			cartypeChooseScanbtn,
			precisePopup,
			uniSpinner
		}
	}
</script>

<style>
	@import '../../../common/biz-inquiry.css';
</style>
