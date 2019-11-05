<template>
	<view class="bg-F0F0F0">
		<view class="uni-card box-shadow-none margin-t0">
			<view class="uni-card-header">
				<view class="fs-32">
					<text>基本信息</text>
				</view>
			</view> 
			<shop-cardinfo :pagetype="detail" @cardImag="cardImag" :comid="comid"></shop-cardinfo>
		</view>
		<view class="uni-card box-shadow-none margin-t20" v-if="images && images.length > 0">
			<view class="uni-card-header">
				<view class="fs-32">
					<text>图片展示</text>
				</view>
			</view> 
			<view class="uni-card-content" v-for="img in images">
				<image class="w-per-100 h-per-100" mode="widthFix" :src="img"></image>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import shopCardinfo from './shop-cardinfo'
	export default {
		components:{
			shopCardinfo
		},
		data() {
			return {
				images:[],
				detail:'shopdetail',
				comid: 0
			};
		},
		created(){},
		onLoad(options){
			this.comid = options.comid
		},
		methods:{
			cardImag(val){
				this.images=val
			}
		}
	}
</script>
