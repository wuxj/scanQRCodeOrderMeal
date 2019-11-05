<template>
	<form class="form-box" @submit="formSubmit" bindreset="formReset">
		<view>
			<view class="com-form com-form-input com-form-vcode com-form-bb1">
				<view class="com-form-bd">
					<input name="mobile" v-model="mobile" class="filed-input" type="number" maxlength="11" placeholder="请输入您的手机号" />
				</view>
				<view class="com-form-ft">
					<button class="filed-vcode-btn" :disabled="disabled" @click="getMobileCode">{{timetxt}}</button>
				</view>
			</view>
			<view class="com-form com-form-input com-form-bb1">
				<view class="com-form-bd">
					<input name="mobilecode" v-model="mobilecode" class="filed-input" type="number" maxlength="6" placeholder="请输入手机验证码" />
				</view>
			</view>
			
			<view class="fixed-bottom-box">
				<view class="bottom-content">
					<button type="warn" formType="submit">确定</button>
				</view>
			</view>
		</view>
	</form>
</template>

<script>
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	const persistKey = 'count_down_verify_phone';
	import app from '@/tools/global-helper'

	export default {
		components: {
		},
		data() {
			return {
				disabled: false,
				timetxt:'获取手机验证码',
				mobile: ''
			};
		},
		onLoad: function () {
			this.WxValidatemobile = app.WxValidate({
				mobile: {
					required: true,
					tel: true
				}
			}, {
				mobile: {
					required: '请填写手机'
				}
			});

			this.WxValidate = app.WxValidate({
				mobile: {
					required: true,
					tel: true
				},
				mobilecode: {
					required: true,
					minlength: 6,
					maxlength: 6
				}
			}, {
				mobile: {
					required: '请填写手机号码'
				},
				mobilecode: {
					required: '请填写手机验证码',
					minlength: '请填写有效的验证码',
					maxlength: '请填写有效的验证码'
				}
			});
			try {
				let count_down_verify_phone = uni.getStorageSync(persistKey);
				if (count_down_verify_phone) {
					let old = parseInt(count_down_verify_phone);
					if(!isNaN(old)) {
						let now = (new Date()).getTime();
						let time = now - old;
						time = time / 1000;
						time = 120 - parseInt(time.toFixed(0));
						if (time > 0) {
							this.timetxt = this.initTimetxt(time);
							this.disabled = true;
							this.dogetCode(time)
						}
					}
				}
			} catch (e) {
				// error
			}

		},
		methods:{
			/**
			 * 获取验证码倒计时
			 */
			dogetCode: function(currenttime = 120) {
				let interval = setInterval(() => {
					currenttime--;
					this.timetxt = this.initTimetxt(currenttime);
					if (currenttime <= 0) {
						clearInterval(interval);
						this.timetxt = '获取验证码';
						this.disabled = false;
					}
				}, 1000);
			},
			initTimetxt (time) {
				return time + ' 秒后重新获取';
			},
			/**
			 * 获取验证码
			 */
			getMobileCode: function() {
				var regx = /^1[23456789]\d{9}$/;
				if(!regx.test(this.mobile)){
					uni.showToast({
						title: '请填写手机号码',
						icon: 'none',
						duration: 3000
					});
					return false;
				}
				ajax.uniajax({
					serverurl: apiurl.getglobalurl('common.Image'),
					url: apiurl.geturl('login.GetMobileCodeByMobile'),
					isunified: true,
					data: {
						mobile: this.mobile,
						smsscene: 1019
					},
					success: (res) => {
						if (res.success) {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 3000
							});
							try {
								uni.setStorageSync(persistKey, (new Date()).getTime());
							} catch (e) {
							}
							this.dogetCode();
							this.timetxt = this.initTimetxt(120)
							this.disabled = true;
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 3000
							});
						}
					}
				});
				
				return false;
			},
			/**
			 * 提交验证
			 */
			formSubmit: function(event) {
				let param = event.detail.value;
				if (!this.WxValidate.checkForm(param)) {
					const error = this.WxValidate.errorList[0];
					uni.showToast({
						title: error.msg,
						icon: 'none',
						duration: 3000
					});
					return false;
				}
				let ajaxdata = {
					unionid: app.globalData.unionId,
					mobile: param.mobile,
					mobilecode: param.mobilecode
				};
				// #ifdef MP-WEIXIN
					ajaxdata.sence = 3;
				// #endif
				// #ifdef MP-BAIDU
					ajaxdata.sence = 4;
				// #endif
				// #ifdef MP-ALIPAY
					ajaxdata.sence = 6;
				// #endif
				ajax.uniajax({
					serverurl: apiurl.getglobalurl('common.Image'),
					url: apiurl.geturl('login.ChuangJianMingPian'),
					data: ajaxdata,
					ishasmessagetips:true,
					success: (res, callback) => {
						if (res.success) {
							let appdata = res.data.app;
							if (appdata.issuccess == 1) {
								app.SetComidType('my', appdata.comid, 'comid');
								/*
								uni.switchTab({
									url: './my-index'
								});
								*/
							   
								uni.navigateBack({
									delta: 1
								})
								if (typeof callback == 'function') {
									callback();
								}
							} else {
								setTimeout(() => {
									uni.showToast({
										title: res.message,
										icon: 'none',
										duration: 3000
									});
									setTimeout(() => {
										if (typeof callback == 'function'){
											callback();
										}
									}, 3000);
								}, 0);
							}
						}
					}
				});
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
