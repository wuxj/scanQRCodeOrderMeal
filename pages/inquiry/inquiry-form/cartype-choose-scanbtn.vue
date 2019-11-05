<template>
	<view>
		<scan-search @scanvin="scanvin" @searchvin="searchvin"></scan-search>
		<view class="bg-FFF text-ac padded-20 padded-t10">
			<button class="bg-F2F2F2 border-b0" plain="true" size="mini" @click="chooseCartype">手动选择车型</button>
			<view class="fs-24 c-999">无车架号，请手动选择车型</view>
		</view>
	</view>
</template>

<script>
	import scanSearch from './scan-search.vue'
	export default{
		data(){
			return{}
		},
		methods:{
			chooseCartype(){
				uni.navigateTo({
					url: '/pages/inquiry/inquiry-form/cartype-step-index?preciseOrSpeedy=precise'
				});
			},
			scanvin(){
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						uni.navigateTo({
							url: '/pages/inquiry/inquiry-form/scan-result?&image='+ res.tempFilePaths
						});
					}
				});
			},
			searchvin(curValue){
				var patt = new RegExp(/^[A-Za-z0-9]{17}$/);
				if(patt.test(curValue)){
					 uni.navigateTo({
					 	url: '/pages/inquiry/inquiry-form/scan-result?vin='+ curValue
					 });
				}
				else{
					uni.showToast({
						title:'请输入正确的VIN码',
						icon: 'none',
						duration: 3000
					});
				}
			}
		},
		components:{
			scanSearch
		}
	}
</script>