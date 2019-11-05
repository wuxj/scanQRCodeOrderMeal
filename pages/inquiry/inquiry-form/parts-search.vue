<template>
	<view class="serach">
		<view class="content" :style="{'border-radius':'60px'}">
			<!-- HM修改 增加进入输入状态的点击范围 -->
			<view class="content-box" @click="getFocus">
				<uni-icon class="icon" type="search" size="22" color="#666666"></uni-icon>
				<!-- HM修改 增加placeholder input confirm-type confirm-->
				<input placeholder="请输入您要查找的配件名称" @input="inputChange" confirm-type="search" class="input" @focus="focus"/>
			</view>
		</view>
		<view  class="button active" @click="add">
			<view class="button-item">添加</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue'	
export default {
	props: {},
	data() {
		return {
			inputVal: '',
		};
	},
	methods: {
		inputChange(event){
			this.inputVal = event.detail.value;
			this.$emit('input', this.inputVal);
		},
		focus() {
			// 增加获取焦点判断
			if (this.inputVal) {
				this.$emit('focus', this.inputVal);
			}
		},
		add(){
			if (this.inputVal) {
				this.$emit('add', this.inputVal);
			}
		}
	},
	components:{
		uniIcon
	}
};
</script>

<style lang="scss">
.serach {
	display: flex;
	width: 100%;
	box-sizing: border-box;
	font-size: $uni-font-size-base;
	.content {
		display: flex;
		align-items: center;
		width: 100%;
		height: 60upx;
		background: #fff;
		overflow: hidden;
		transition: all 0.2s linear;
		border-radius: 30px;

		.content-box {
			width: 100%;
			display: flex;
			align-items: center;
			&.center {
				justify-content: center;
			}
			.icon {
				padding: 0 15upx;
				&.icon-del {
					font-size: 38upx;
				}
			}
			.input {
				width: 100%;
				max-width: 100%;
				line-height: 60upx;
				height: 60upx;
				transition: all 0.2s linear;
				&.center {
					width: 200upx;
				}
				&.sub {
					width: auto;
					color: grey;
				}
			}
		}
		.serachBtn {
			height: 100%;
			flex-shrink: 0;
			padding: 0 30upx;
			background:linear-gradient(to right,#ff9801,#ff570a);
			line-height: 60upx;
			color: #fff;
			transition: all 0.3s;
		}
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		flex-shrink: 0;
		width: 0;
		transition: all 0.2s linear;
		white-space: nowrap;
		overflow: hidden;
		&.active {
			padding-left: 15upx;
			width: 100upx;
		}
	}
}
</style>
