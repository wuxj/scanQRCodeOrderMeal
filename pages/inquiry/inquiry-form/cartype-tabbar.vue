<template>
	<view class="com-tabbar">
		<view class="bg-FFF com-tabbar-nav top-tabbar-nav">
			<block class="h-100" v-for="(item, index) in tabs" :key="index">
				<view class="com-tabbar-nav-item" :class="{'com-tabbar-nav-item-on': type === index+1}" @click="tabClick(index)">
					<view class="com-tabbar-nav-title" :class="{'c-F60':type === index+1}">{{item}}</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		tabs:Array,
		type:{ // 1cyc 2syc
			type: [Number, String],
			default: 1
		}
	},
	methods:{
		tabClick(index){
			this.$emit('tabClick',index)
		}
	}
}
</script>

<style>
</style>
