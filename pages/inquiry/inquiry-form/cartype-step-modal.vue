<template>
	<view class="com-row border-bt1" :style="{'margin-top': titleHeight + 'px', 'height': scrollViewHeight + 'px'}">
		<scroll-view class="com-col-xs-5 bg-F9F9F9 h-per-100" scroll-y="true">
			<view  class="padded-10" v-for="(item,index) in modals" :key="index" @click="leftItemClick(index, item)">
				<text :class="{'c-F60':index == activeId}">{{item.yeartype}}</text>
			</view>
		</scroll-view>
		<scroll-view class="com-col-xs-7 h-per-100 bg-FFF" scroll-y="true">
			<view v-for="(item,index) in modals" :key="index" v-show="index == activeId">
				<view class="padded-10 padded-l30" v-for="(modal, idx) in item.sub" :key="idx" @click="rightItemClick(item, modal)">
					<text>{{modal.name}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	export default {
		data() {
			return {
				activeId:0
			}
		},
		props: ['titleHeight', 'type', 'modals'],
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
				// show right
				this.activeId = index;
			},
			rightItemClick(item, modal){
				this.$emit('itemBack', {
					yeartype:item.yeartype,
					id: modal.id,
					modalname: modal.name
				})
			},
			// back last
			itemBack(param){
				this.$emit('itemBack', param)
			}
		}
	}
</script>