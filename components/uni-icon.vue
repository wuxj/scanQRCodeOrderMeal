<template>
    <view :class="stylecls + ' ' + iconfontcls" :style="styleInline" @click="onClick()"></view>
</template>

<script>
    export default {
        props: {
			family: {
				type: String,
				default: 'uni-icon'
			},
            /**
             * 图标类型
             */
            type: String,
            /**
             * 图标颜色
             */
            color: String,
            /**
             * 图标大小
             */
            size: [Number, String],
			/**
			 *  图标style class
			 */
			stylecls: String,
        },
        computed: {
			iconfontcls () {
				return this.family === 'uni-icon' ? (this.family + ' uni-icon-' + this.type) : (this.family + ' icon-' + this.type)
			},
			styleInline () {
				var styleValue = [];
				if(this.color && this.color.length){
					styleValue.push('color:' + `${this.color}`);
				}
				if(parseFloat(this.size) > 0){
					styleValue.push('font-size:' + `${this.size}px`);

				}
				return styleValue.join(';');
			}
        },
        methods: {
            onClick() {
                this.$emit('click')
            }
        }
    }
</script>

