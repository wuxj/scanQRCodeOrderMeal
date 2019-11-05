<template>
	<view class="page-inner-header">
		<view class="uni-navbar">
			<view class="uni-navbar-header" :style="{color:'#333333'}">
				<view class="uni-navbar-container">
					<view class="input-view" @click="search()">
						<uni-icon type="search" size="22" color="#666666"></uni-icon>
						<input disabled="true" class="input" placeholder="输入搜索关键词" v-model="keyword"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import app from '@/tools/global-helper'
	
	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		props: ['keyword', 'type'],
		methods:{
			search () {
				let that = this;
				app.pageNavBack('/pages/search/filter-search-box', 'tabType', {
					type: that.type
				} , that, function(){
					uni.navigateTo({
						url: '/pages/search/filter-search-box?type=' + that.type
					});
				});
			},
		}
	}
</script>
<style>
	@import '../../common/biz-home.css';

    .uni-navbar {
        display: block;
        position: relative;
        width: 100%;
        background-color: #FFFFFF;
        overflow: hidden;
    }
	
	.uni-navbar view{
		line-height:88upx;
	}
    .uni-navbar-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        height:88upx;
        line-height:88upx;
        font-size: 32upx;
    }
	
	.uni-navbar-container{
		width:100%;
		margin:0 10upx;
	}
</style>
