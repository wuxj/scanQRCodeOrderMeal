<template>
	 <view>
        <uni-fab
            :pattern="pattern"
            :content="content"
            :horizontal="horizontal"
            :vertical="vertical"
            :direction="direction"
            @trigger="trigger"
			triggerIconStyle="uni-icon uni-icon-home c-FFF fs-48"
        ></uni-fab>
    </view>
</template>

<script>
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	export default{
		data(){
			return{
			horizontal: 'right',
            vertical: 'bottom',
            direction: 'vertical',
            pattern: {
                color: '#7A7E83',
                backgroundColor: '#fff',
                selectedColor: '#007AFF',
                buttonColor:"#007AFF"
            },
			content:[
				{
					id: 'home',
                    text: '首页',
                    active: false
                },
                {
					id: 'find-out',
					text: '发现',
                    active: false
                }
			]
		}
	},
	methods:{
		trigger(e) {
			this.content[e.index].active = !e.item.active;
			let pageurl = this.content[e.index].id
			let urlstr = '/pages/'+pageurl+'/index'
			uni.switchTab({
				url: urlstr
			});
		}
       },
	 components: {
        uniFab
    }
	
}
</script>

<style>
</style>
