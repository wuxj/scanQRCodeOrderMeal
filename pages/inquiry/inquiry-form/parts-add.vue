<template>
	<view class="content">
		<view class="search-box">
			<parts-search @input="inputChange" @add="doAdd" @focus="doFocus"></parts-search>
		</view>

		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-list-box" v-show="keywordList.length" scroll-y>
				<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="row in keywordList" :key="row.fullname">
					<view class="keyword-text" @tap="doChoose(row.name)">
						<text>{{row.fullname}}</text>
					</view>
				</view>
			</scroll-view>

			<scroll-view class="keyword-list-box" v-show="!keywordList.length" scroll-y>
				<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="row in oldKeywordList" :key="row">
					<view class="keyword-text uni-flex">
						<view class="uni-flex-item">{{row.name}}</view>
						<view @click="doDelete(row)">
							<uni-icon type="closeempty" size="22"></uni-icon>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="fixed-bottom-box">
				<view class="bottom-content">
					<view class="uni-flex uni-row">
						<view style="flex:1;" class="c-FFF" @click="doSubmit">
							<button type="primary">完成</button>
						</view>
					</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue'	
	import partsSearch from './parts-search';
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default {
		data() {
			return {
				keyword: "",
				keywordList: [],
				oldKeywordList: [{
					name:'',
					count:1,
					remark:''
				}]
			}
		},
		onLoad(options) {
			if(options.preciseParts){
				this.oldKeywordList = JSON.parse(options.preciseParts)
			}
		},
		methods: {
			blur(){
				// #ifdef MP-WEIXIN
				uni.hideKeyboard()
				// #endif
			},
			// 关标聚焦时查询接口 得到数据
			doFocus(event){
				this.inputChange(event)
			},
			GetData(){
				this.keywordList = []
				if(this.keyword.trim().length>0){
					ajax.uniajax({
						url: apiurl.geturl('XunBaoJia.GetPeiJianByKeyword'),
						data: {
							comid: app.globalData['mycomid'],
							keyword:this.keyword
						},
						showLoading:false,
						success: (res) => {
							if(res.success){
								let result = res.data.app.result
								this.keywordList = result
							}
						},
					})
				}
			},
			//监听输入
			inputChange(event) {
				this.keyword = event.detail ? event.detail.value : event;
				this.GetData()
			},
			// 添加按钮
			doAdd(){
				if(this.keyword.trim().length){
					this.doPushKeyWord(this.keyword);
					this.keywordList = []
				}
			},
			// 从搜索的结果-选择配件名称
			doChoose(text){
				this.doPushKeyWord(text);
				this.keywordList = []
			},
			doPushKeyWord(item){
				// 选择的一个配件
				let current = {
					name:item,
					count:1,
					remark:''
				}
				var idx = this.oldKeywordList.findIndex((value,index,arr) => {
					return value.name === current.name;
				});
				if(idx < 0){
					this.oldKeywordList.push(current)
				}else{
					uni.showToast({
					title: '此配件已存在',
					icon: 'none',
					duration: 3000,
					});
				}
			},
			doDelete(item){
				this.oldKeywordList = this.oldKeywordList.filter((value,index,arr)=>{
					return value.name !== item.name
				})
			},
			doSubmit(){
				let parts = this.oldKeywordList
				app.pageNavBack('pages/inquiry/inquiry-form/index', 'selPartBack', {
					partlist: parts ? parts : []
				}, this);
			}
		},
		components: {
			partsSearch,
			uniIcon
		}
	}
</script>
<style>
	.search-box {width:95%;background-color:rgb(242,242,242);padding:7.5px 2.5%;display:flex;justify-content:space-between;}
	.search-box > swan-template{width:100% !important;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:14px;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:30px;}
	.search-box .input-box>input {width:100%;height:30px;font-size:16px;border:0;border-radius:30px;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);}
	.keyword-list-box {height:calc(100vh - 55px);padding-top:5px;border-radius:10px 10px 0 0;background-color:#fff;}
	.keyword-entry-tap {background-color:#eee;}
	.keyword-entry {width:94%;height:40px;margin:0 3%;font-size:15px;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1px #e7e7e7;}
	.keyword-entry image {width:30px;height:30px;}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:40px;display:flex;align-items:center;}
	.keyword-entry .keyword-text {width:95%;}
	.keyword-entry .keyword-img {width:10%;justify-content:center;}
</style>
