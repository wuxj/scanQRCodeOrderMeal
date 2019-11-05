<template>
	<form @submit="formSubmit" @reset="formReset">
		<view class="com-forms">
		    <view class="com-form com-form-input">
		        <view class="com-form-hd">
		            <view class="filed-label">公司名称</view>
		        </view>
		        <view class="com-form-bd">
		            <input class="filed-input" placeholder="请输入公司名称" name="comname" v-model="comname"/>
		        </view>
		    </view>
			<view class="com-form com-form-input">
		        <view class="com-form-hd">
		            <view class="filed-label">联系人</view>
		        </view>
		        <view class="com-form-bd">
		            <input class="filed-input" placeholder="请输入联系人" name="comperson" v-model="comperson"/>
		        </view>
		    </view>
		    <view class="com-form com-form-input">
		        <view class="com-form-hd">
		            <view class="filed-label">手机号</view>
		        </view>
		        <view class="com-form-bd">
		            <input class="filed-input" type="number" placeholder="请输入手机号" maxlength="11" name="comphone" v-model="comphone"/>
		        </view>
		    </view>
			<view class="com-form com-form-input com-form-bb1">
		        <view class="com-form-hd">
		            <view class="filed-label">所在地区</view>
		        </view>
		        <view class="com-form-bd">
					<picker
						mode="region"
						@change="bindRegionChange"
						:value="region"
						:custom-item="customItem"
					>
					<view class="filed-input" v-if="region.length">{{regionTxt}}</view>
					<view class="filed-input c-777" v-else>请选择所在地区</view>
					</picker>
		        </view>
		    </view>
		    <view class="fixed-bottom-box">
				<view class="bottom-content">
					<button type="warn"  formType="submit">确定</button>
				</view>
		    </view>
		</view>
	</form>
</template>

<script>
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'

	export default { 
		data() {
			return {
				regionTxt: '',
				region:[],
				customItem: '',
				comprovince:'',
				comcity:'',
				comxian:'',

				comname:'',
				comperson:'',
				comphone:''
			};
		},
		onLoad(){
			this.getData()
		},
		onShow(){this.getData()},
		methods:{
			/**
			 * 地区选择回调
			 */
			bindRegionChange(e) {
			    this.regionTxt = e.detail.value ? e.detail.value.slice(0, 2).join(' ') : ''
				this.region = e.detail.value
			},
			formSubmit(e){
				this.WxValidateBaseInfo = app.WxValidate({
					comname: {
						required: true
					},
					comperson: {
						required: true
					},
					comphone: {
						required: true,
						tel: true,
						minlength: 11,
						maxlength: 11
					},
					region:{
						required: this.region.length === 0
					}
				}, {
					comname: {
						required: '请输入公司名称'
					},
					comperson: {
						required: '请输入联系人'
					},
					comphone: {
						required: '请输入手机号',
						minlength: '请输入有效的手机号',
						maxlength: '请输入有效的手机号'
					},
					region: {
						required: '请选择所在地区'
					}
				});

				if (!this.WxValidateBaseInfo.checkForm(e.detail.value)) {
					const error = this.WxValidateBaseInfo.errorList[0];
					uni.showToast({
						title: error.msg,
						icon: 'none',
						duration: 3000
					});
					return false;
				}

				this.comprovince = this.region[0] || '';
				this.comcity = this.region[1] || '' 
				this.comxian = this.region[2] || '' 

				let param = Object.assign({
					comid: app.globalData['mycomid'],
					comname:e.detail.value.comname,
					comperson:e.detail.value.comperson,
					comphone:e.detail.value.comphone,
					comprovince:this.comprovince,
					comcity:this.comcity,
					comxian:this.comxian
				})

				ajax.uniajax({
					url:apiurl.geturl('AutopartsArea.SubmitCompanyInfo'),
					data: param,
					success:(res)=>{
						let appdata = res.data.app;
						uni.showToast({
						    title: res.message,
							icon: 'none',
							duration:2000
						});
						if (appdata.issuccess){
							uni.navigateBack({
								delta:1 
							});
						}
					}
				})
			},
			getData(){
				let that = this
				ajax.uniajax({
					url:apiurl.geturl('AutopartsArea.GetCompanyInfo'),
					data:{comid: app.globalData['mycomid']},
					success: (res) => {
						let appdata = res.data.app
						if(res.success){
							that.comname = appdata.info.comname
							that.comperson = appdata.info.comperson
							that.comphone = appdata.info.comphone
							that.region= [appdata.info.comprovince, appdata.info.comcity]
							that.regionTxt = (appdata.info.comprovince || appdata.info.comcity) ? [appdata.info.comprovince, appdata.info.comcity].join(' ') : ''
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
</style>