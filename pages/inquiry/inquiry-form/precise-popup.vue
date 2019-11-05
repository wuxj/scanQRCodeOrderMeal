<template>
	<view>
		<view class="uni-mask" v-show="show" :style="{top:offsetTop + 'px;'}" @click="maskClosable ? hide() : null"></view>
		<view :class="['uni-popup','uni-popup-'+type]" v-show="show" :style="styleInline">
			<view class="uni-flex uni-row padded-20 border-bb1">
				<view class="uni-flex-item padded-l20 padded-r20 text-al c-999" @click="hide">取消</view>
				<view>{{title}}</view>
				<view class="uni-flex-item padded-l20 padded-r20 text-ar c-green" @click="sure">确定</view>
			</view>
			<view class="uni-card box-shadow-none overflow-y-auto margin-0" style="height:388upx;">
				<checkbox-group @change="handleChange" v-if="selectType=='checkbox'">
					<label class="uni-list-cell uni-list-cell-pd" :class="{'border-bb0': index === sourcedata.length - 1}" v-for="(item, index) in sourcedata" :key="item.index">
						<view>{{item.name}}</view>
						<view>
							<checkbox :value="item.value" :checked="item.checked" />
						</view>
					</label>
				</checkbox-group>
				
				<radio-group @change="handleChange" v-if="selectType=='radio'">
					<label class="uni-list-cell uni-list-cell-pd" :class="{'border-bb0': index === sourcedata.length - 1}" v-for="(item, index) in sourcedata" :key="item.index">
						<view>{{item.name}}</view>
						<view>
							<radio :value="item.value" :checked="item.checked" />
						</view>
					</label>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			width:{
				type: [Number, String],
				default: '380px'
			},
			height: {
				type: [Number, String],
				default: '380px'
			},
			show: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				//top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			// checkbox or radio
			selectType: {
				type: String,
				default: ''
			},
			sourcedata: {
				type: Array,
				default: []
			},
			title: {
				type: String,
				default: ''
			},
			maskClosable: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			styleInline () {
				var styleValue = [];
				if(parseFloat(this.width) > 0){
					styleValue.push('width:' + `${this.width}`);
				}
				if(parseFloat(this.height) > 0){
					var h = uni.upx2px(this.height);
					styleValue.push('height:' + `${h}px`);
			
				}
				return styleValue.join(';');
			}
		},
		data() {
			let offsetTop = 0;
			//#ifdef H5
			offsetTop = 44;
			//#endif
			return {
				offsetTop: offsetTop / 750 * 375
			}
		},
		methods: {
			hide() {
				this.$emit('hidePopup');
			},
			sure(){
				this.$emit('surePopup');
			},
			handleChange(e){
				this.$emit('handleChange', e);
			}
		}
	}
</script>
