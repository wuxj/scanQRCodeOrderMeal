<template>
	<uni-popup width="80%" height="360" :show="visible" type="middle" :maskClosable="false"  @hidePopup="hidePopup">
		<view class="padded-b20 padded-l20 w-per-100 text-ac">请选择您要查看的站点</view>
		<view class="uni-flex uni-row w-per-100">
			<view class="flex-item text-ac w-per-50">
				<view class="square-100 margin-center bg-red text-ac border-circle">
					<uni-icon stylecls="line-h100 c-FFF fs-32" family="qpr-icon" type="commercialvehicle"></uni-icon>
				</view>
				<button class="margin-t40 padded-l30 padded-r30" type="primary" plain="true" size="mini" @click="selectOk(1)">商用车</button>
			</view>
			<view class="flex-item text-ac w-per-50">
				<view class="square-100 margin-center bg-green text-ac border-circle">
					<uni-icon stylecls="line-h100 c-FFF fs-32" family="qpr-icon" type="passengercar"></uni-icon>
				</view>
				<button class="margin-t40 padded-l30 padded-r30" type="primary" plain="true" size="mini" @click="selectOk(2)">乘用车</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue'
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		components:{
			uniIcon,
			uniPopup
		},
		data() {
			return {
				visible: false
			};
		},
		props:['time'],
		watch:{
			time () {
				this.showPopup();
			}
		},
		methods:{
			showPopup: function() {
				this.visible = true
				uni.hideTabBar();
			},
			hidePopup: function() {
				this.visible = false
				uni.showTabBar();
			},
			selectOk: function (type) {
				this.$emit('selectok', type);
				this.hidePopup();
			}
		}
	}
</script>
