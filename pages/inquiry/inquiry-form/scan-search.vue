<template>
	<view class="precise-inner-header">
		<view class="precise-navbar">
			<view class="precise-navbar-header">
				<view class="precise-navbar-container">
					<view class="input-view">
						<icon class="uni-icon uni-icon-search fs-40 c-666"></icon>
						<input class="input" confirm-type="search" type="text" placeholder="请输入17位车架号,精准定位配件" maxlength=17 v-model="curValue" @confirm="searchvin"/>
					</view>
				</view>
				<view class="precise-navbar-header-btns" @click="scanvin">
					<icon class="uni-icon uni-icon-scan fs-40 c-999"></icon>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
    export default {
		data(){
			return {
				curValue: this.defaultValue
			}
		},
        props: {
			defaultValue:{
				type: String,
				default: ''
			}
        },
		watch:{
			defaultValue(val){
				this.curValue = val;
			}
		},
        methods: {
            scanvin() {
                this.$emit('scanvin');
            },
			searchvin(){
				this.$emit('searchvin', this.curValue);
			}
        }
    }
</script>

<style scoped>
    .precise-navbar {
        display: block;
        position: relative;
        width: 100%;
        overflow: hidden;
    }
		
    .precise-navbar-header {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
	
	.precise-navbar-header .precise-navbar-header-btns{
		display:inline-flex;
		flex-wrap:nowrap;
		flex-shrink:0;
		width: 80upx;
		align-items:center;
		justify-content:center;
	}

	.precise-navbar-container{
		width:92%;
		margin:0 10upx;
	}
	.precise-inner-header{padding-top:10upx;background-color: #FFFFFF;}
	.precise-navbar-header .input-view {width: 92%;display: flex;align-items:center;
		justify-content:center;background-color: #FFF;height: 60upx; border:1px solid #E4E4E4; border-radius: 30upx;padding: 0 4%;flex-wrap:nowrap;margin:14upx 0;line-height:60upx;}
	.precise-navbar-header .input-view view{line-height:60upx !important;}
	.precise-navbar-header .input-view .input {height:60upx;line-height:60upx;width:94%;padding: 0 3%;}
	
	@import '../../../common/biz-inquiry.css';
</style>