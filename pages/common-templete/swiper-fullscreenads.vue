<template>
	<view>
		<swiper :style="{height: getheight + 'px'}" indicator-dots="true" autoplay="true" interval="5000" duration="500"
				v-if="listArr.length">
			<swiper-item class="swiper-item" v-for="item in listArr"
						 @click="item.clickfn(item.param)" :key="index">
				<image class="w-per-100 h-per-100" mode="widthFix" :src="item.url"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import transQprUrl from '@/tools/trans-qprurl.js'
	export default {
		props:{
			initheight: {
				type: Number,
				default: 50
			},
			list: {
				type: Array,
				default: []
			}
		},
		onShow (){
		},
		computed:{
			getheight (){
				let height = this.initheight;
				uni.getImageInfo({
					src:this.list[0].pic.replace('http://img.qipeiren.com','https://img.up.qipeiren.com'),
					success: function (image) {
						height = image.height * (uni.getSystemInfoSync().windowWidth / image.width);
					}
				});
				return height;
			},
			listArr () {
				return this.transformAdsData(this.list);
			}
		},
		methods:{
			/**
			 * 转换广告数据
			 * @param data
			 */
			transformAdsData(data) {
				let ads = data.map(function (item) {
					let temp = {
						url: item.pic
					};
					let transRes = transQprUrl.exchangebyurl(item.urlwap);
					if(transRes.valid){
						temp.clickfn = transRes.clickfn
						temp.param = transRes.param
					}
					return temp
				});
				return ads;
			}
		}
	}
</script>
