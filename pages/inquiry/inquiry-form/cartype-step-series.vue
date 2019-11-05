<template>
	<view class="com-row border-bt1" :style="{'margin-top': titleHeight + 'px', 'height': scrollViewHeight + 'px'}">
		<scroll-view class="com-col-xs-5 bg-F9F9F9 h-per-100" scroll-y="true">
			<view  class="padded-10" v-for="(item,index) in series" :key="index" @click="leftItemClick(index, item)">
				<text :class="{'c-F60':index == activeId}">{{item.name}}</text>
			</view>
		</scroll-view>
		<scroll-view class="com-col-xs-7 h-per-100 bg-FFF" scroll-y="true">
			<view v-for="(item,index) in series" :key="index" v-show="index == activeId">
				<view class="padded-10 padded-l30" v-for="(serie, idx) in item.sub" :key="idx" @click="rightItemClick(item, serie)">
					<text>{{serie.name}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import app from '@/tools/global-helper'
	export default {
		data() {
			return {
				activeId:0
			}
		},
		props: ['titleHeight', 'type', 'series'],
		computed:{
			scrollViewHeight (){
				return this.winHeight - this.titleHeight
			}
		},
		onReady() {
			this.winHeight = uni.getSystemInfoSync().windowHeight
		},
		methods:{
			tabClick(index){
				this.activeIndex = index;
			},
			leftItemClick(index, item){
				this.activeId = index;
				if(!item.sub.length){
					this.$emit('itemBack', {
						id: item.id,
						name: item.name
					})
				}
			},
			rightItemClick(series, serie){
				let that = this 
				if(that.type == 1){
					that.$emit('itemBack', {
						id: serie.id,
						name: serie.name,
						seriesname: series.name
					})
				}else if(that.type == 2){
					that.getCycModal(serie.id, function(appdata){
						if(Array.isArray(appdata.result) && appdata.result.length && appdata.resulttype == 2){
							that.$emit('itemClick', series.name, serie.id, serie.name, appdata.result)
						}else{
							that.$emit('itemBack', {
								id: serie.id,
								name: serie.name,
								seriesname: series.name
							})
						}
					});
				}
			},
			getCycModal: function(seriesid, callback){
				let that = this;
				ajax.uniajax({
					url: apiurl.geturl('XunBaoJia.GetCheXingById'),
					data: {
						comid: app.globalData['mycomid'],
						id: seriesid
					},
					showLoading: false,
					success: (res) => {
						if (res.success) {
							let appdata = res.data.app
							callback(appdata)
						}
					},
				})
				
			},
			// back last
			itemBack(param){
				this.$emit('itemBack', param)
			}
		}
	}
</script>