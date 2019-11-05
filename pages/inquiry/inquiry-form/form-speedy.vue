<template>
	<view class="margin-t100">
		<view @click="chooseCartype">
			<view class="margin-0" v-if="!cartypeItem">
				<view class="bg-FFF text-ac padded-30 uni-card-link">选择品牌<uni-icon stylecls="dis-inline" size="22" type="plus-filled"></uni-icon></view>
			</view>

			<view class="margin-0" v-else>
				<view class="bg-FFF text-ac padded-20">
					<image class="square-120" :src="cartypeItem.logo" mode="aspectFit"></image>
					<view>
						<text>{{cartypeItem.pinpai}}</text><view class="dis-inline uni-icon uni-icon-arrowright c-999 margin-l4"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="bg-FFF margin-t10">
			<view class="margin-r10 margin-l10 padded-20">
				<view class="">铭牌图、车头图、旧件图、清单图片</view>
				<view><uni-uploadImage count="9" :isLimit="true" @uploadimage="uploadImage" /></view>
			</view>
		</view>

		<view class="bg-FFF margin-t10">
			<view class="margin-r10 margin-l10 padded-20">
				<view class="">所需配件信息</view>
				<view class="uni-textarea padded-b20">
					<textarea class="h-100 border-b1 border-bc-E4E4E4" v-model="remark" maxlength="200" placeholder="请填写车型和配件名称等说明的信息,200字以内"/>
				</view>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
		<view class="bg-FFF margin-r10 margin-l10" v-if="!isShowvoice">
			<view class="dis-inline padded-20">我的录音</view>
			<view class="dis-inline padded-r20 text-ac">
				<view @click="doPlay">
					 <view class="box">
						<view class="wifi-symbol">
							<view class="wifi-circle first"></view>
							<view class="wifi-circle second" :class="{'second-animation':isShow}"></view>
							<view class="wifi-circle third" :class="{'third-animation':isShow}"></view>
						</view>
						<view class="second-mins">{{voiceLength+'"'}}</view>
					</view>
				</view>
			</view>
			<view class="dis-inline c-F60" @click="doReset">
				重新录音
			</view>
		</view>
		<view class="bg-FFF padded-b30 text-ac" v-else>
			<speedy-recording @handlerecord="doRecord"></speedy-recording>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	
	import speedyRecording from './speedy-recording.vue'

	import uniIcon from '@/components/uni-icon.vue'
	import uniUploadImage from '@/components/uni-upload-image.vue'

	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default{
		data(){
			return{
				voicePath:'',
				voiceLength: 0,
				isShow:false, // 是否出现播放语音效果 true 显示
				isShowvoice:true, // 是否显示录音标志 true 显示
				images:{},
				remark:'',
				submitLoading: false
			}
		},
		props:['cartypeData'],
		computed:{
			cartypeItem (){
				return this.cartypeData || ''
			}
		},
		methods:{
			doReset(){
				let that = this
				uni.showModal({
					title: '提示',
					content: '重新录音之前会删除当前的录音,确定重录?',
					success: function (res) {
						if (res.confirm) {
							that.isShowvoice = true
						}
					}
				});
			},
			doRecord(record){
				this.voiceLength = Math.ceil(record.duration/1000)
				this.uploadImg(record.tempFilePath)
			},
			uploadImg(record){
				ajax.uniUpload({
					url: apiurl.geturl('common.FileUpload'),
					filePath: record,
					name: 'record',
					data: {
						comid: app.globalData['mycomid'],
						type: 2
					},
					success: (res) => {
						let resdata = JSON.parse(res.data);
						if(resdata.success){
							let appdata = resdata.data.app
							this.voicePath = appdata.file_path;
							this.isShowvoice =false
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
			doPlay(){
				let that = this
				that.isShow = true
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = this.voicePath;
				innerAudioContext.onPlay(()=>{
				});
				innerAudioContext.onError(()=>{
				});
				innerAudioContext.onEnded(()=>{
					that.isShow = false
				})
				innerAudioContext.onStop(()=>{
					that.isShow = false
				})
			},
			chooseCartype(){
				uni.navigateTo({
					url: './cartype-step-index?preciseOrSpeedy=speedy'
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
				}
				
				if((!that.images.imgarr || !that.images.imgarr.length) && !that.remark.length){
					that.showToast('请填写有效询价信息');
					return false
				}else if(that.images.imgarr && that.images.imgarr.length && !that.images.iscompleted){
					that.showToast('图片上传中...');
					return false
				}
			
				let xunjiainfo = {
					type:2,
					pinpai:that.cartypeItem.pinpai,
					pinpaitype:that.cartypeItem.pinpaitype,
					pinpaiid:that.cartypeItem.pinpaiid,
					image:that.images.imgarr || [],
					peijiancontent:that.remark,
					voiceurl:that.voicePath,
					voiceshichang:that.voiceLength
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
			showToast(msg){
				uni.showToast({
					title: msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		components:{
			uniIcon,
			uniUploadImage,
			speedyRecording
		}
	}
</script>

<style>
	*{
	    margin: 0;
	    padding: 0;
	}
	.border-voicepath{border-radius: 20upx;}
	.box {
	    box-sizing: border-box;
	    position: relative;
	    height:24px;
		line-height:24px;
		background:rgba(152,255,101,1);
		padding:0px 30px 0 10px;
		border-radius:3px;

	}
	.wifi-symbol {
	    width: 15px;
	    height: 15px;
	    box-sizing: border-box;
	    overflow: hidden;
	    transform: rotate(135deg);
		display:inline-block;
		vertical-align:middle;
		overflow:hidden;
	}
	.wifi-circle {
	    border: 2upx solid rgba(82,185,80,1);
	    border-radius: 50%;
	    position: absolute;
		overflow:hidden;
	}
	
	.first {
	    width: 5px;
	    height: 5px;
	    top: 12px;
	    left: 12px;
	}
	
	.second {
	    width: 15px;
	    height: 15px;
	    top: 7px;
	    left: 7px;
	}
	.second-animation{animation: fadeInOut 1s infinite 0.2s;}
	.third {
	    width: 25px;
	    height: 25px;
	    top: 2px;
	    left: 2px;
	}
	.third-animation{animation: fadeInOut 1s infinite 0.4s;}

	.second-mins{
		display:inline-block;
		vertical-align:middle;
		margin-left:5px;
		font-size:12px;
	}
	/* 录音时长 按钮背景颜色 */
	.bg-lightgreen{background-color: #68f77b;}
	
	/* 录音时长 按钮 radius */
	.border-recording{border-radius: 20upx;}
	@keyframes fadeInOut {
	    0% {
	        opacity: 0; /*初始状态 透明度为0*/
	    }
	    100% {
	        opacity: 1; /*结尾状态 透明度为1*/
	    }
	}
	
	
	
</style>
