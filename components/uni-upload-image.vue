<template>
	<view class="uploadImage">
		<view class="flex flex_wrap showImage">
			<view v-for="(item, index) in uploadTask" :key="index" class="image_view">
				<view class="relative">
					<uni-icon type="minus-filled" stylecls="absolute icon c-red" @click="deleteImage(index)" size="20"></uni-icon>
					<image :src="item.img" mode="" @tap="previewImage" :data-index="index" v-if="item.progress > 100"></image>
					<view class="progress_box" v-else>
						<view class="bar1"></view>
					</view>
				</view>
			</view>

			<view class="chooseImage margin-20 c-999 text-ac" :class="{'dis-none':uploadTask.length>=9}" style="" @click="selectImage">
				<view>
					<uni-icon type="image" size="22"></uni-icon>
				</view>
				<view>
					添加图片
				</view>
				<view> {{uploadTask.length}}/{{count}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue'

	import apiurl from '@/tools/api-url.js'
	import ajax from '@/tools/http-ajax.js'
	import basetools from '@/tools/base-tools.js'
	import app from '@/tools/global-helper'
	
	export default {
		data() {
			return {
				uploadTask: []
			};
		},
		props: {
			// 图片裁剪,缩放模式
			mode: {
				type: String,
				default: 'scaleToFill'
			},
			// 上传图片数量
			count: {
				type: [Number, String],
				default: 1
			},
			//是否限制图片数量，微信限制最多9张图片，true 最多可选取指定数量，false可多次选择，每次都可选择指定数量
			isLimit: {
				type: [Boolean, String],
				default: true
			}
		},
		watch: {
			uploadTask: {
				handler (){
					this.$emit('uploadimage', this.getImageArr(), this.uploadCompleted());
				},
				deep: true
			}
		},
		methods: {
			selectImage: async function() {
				let that = this,
					imageLength = that.uploadTask.length;
				if (imageLength >= that.count) {
					uni.showToast({
						title: `最多选取${that.count}张图片`,
						icon: 'none',
						duration: 1500
					});
					return;
				} else {
					let getR = await that.chooseImage();
					that.$emit('click', getR);
				}
			},
			deleteImage: async function(idx) {
				if (this.uploadTask[idx].progress > 0 && this.uploadTask[idx].progress < 100) {
					this.uploadTask[idx].task.abort()
					this.uploadTaskDoing()
				}
				this.uploadTask.splice(idx, 1);
				let getR = this.uploadTask;
				this.$emit('click', getR);
			},
			chooseImage() {
				let that = this,
				imageLength = that.uploadTask.length;
				uni.chooseImage({
					count: that.isLimit ? that.count - imageLength : that.count,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						let tempFiles = []
						res.tempFilePaths.forEach((value, index, arr) => {
							//初始图片对象，index标记，上传进度（上传中...），上传的图片
							let waitImg = {
								index: that.getnamebypath(value),
								progress: 0,
								img: value
							}
							tempFiles.push(waitImg)
						})
						// 图片Task
						that.uploadTask = that.uploadTask.concat(tempFiles)
						that.uploadTaskDoing();
					}
				});
			},
			uploadTaskDoing() {
				let that = this
				let item = that.uploadTask.find((value) => {
					return value.progress === 0
				});
				if (item) {
					item.task = ajax.uniUpload({
						url: apiurl.geturl('common.FileUpload'),
						filePath: item.img,
						name: item.index,
						data: {
							comid: app.globalData['mycomid'],
							type: 3,
							file_name: item.index
						},
						success: (res) => {
							let resdata = typeof(res.data) == 'string' ? JSON.parse(res.data) : res.data;
							if (resdata.success) {
								let appdata = resdata.data.app
								item.img = appdata.file_path
								item.progress = 101;
								that.uploadTaskDoing();
							}
						}
					})
					item.task.onProgressUpdate((res) => {
						item.progress = res.progress
					});
				}
			},
			uploadCompleted(){
				return this.uploadTask.every((x) => {
					return x.progress >= 100
				});
			},
			getImageArr (isBigImg){
				let imgArr = [];
				this.uploadTask.forEach((x) => {
					if(x.progress >= 100){
						imgArr.push(isBigImg ?　x.img.replace('_s', '') : x.img);
					}
				})
				return imgArr;
			},
			previewImage: function(e) {
				let imageIndex = e.currentTarget.dataset.index
				let previewImageArr = this.getImageArr(true);
				uni.previewImage({
					current: previewImageArr[imageIndex],
					indicator: "number",
					loop: "true",
					urls: previewImageArr
				})
			},
			// 每张图片名称的唯一标识 
			getnamebypath: function(path) {
				var patharr = path.split('/');
				return patharr[patharr.length - 1].split('.')[0].replace(/[\u4E00-\u9FA5]/g, '').replace(/[^a-zA-Z]/g, '') + '_' +
					basetools.getuuid(5);
			}
		},
		components: {
			uniIcon
		}
	};
</script>

<style lang="less">
	@borderWidth: 2upx;
	@borderColor: #ccc;
	@textColor: #ccc;
	@textColor1: #fff;
	@bgColor: #ccc;

	.flex {
		display: flex;

		&.flex_wrap {
			flex-wrap: wrap;
		}
	}

	.relative {
		position: relative;
	}

	.absolute {
		position: absolute;
	}

	.uploadImage {
		.border_left {
			border-left: @borderWidth solid @borderColor;
		}

		.border_right {
			border-right: @borderWidth solid @borderColor;
		}

		.border_top {
			border-top: @borderWidth solid @borderColor;
		}

		.border_bottom {
			border-bottom: @borderWidth solid @borderColor;
		}

		.showImage {

			// border: @borderWidth solid @borderColor;
			// 		width: 200upx;
			// 		height: 200upx;  20 28 8  12  20  8  4 12
			.image_view {
				padding: 20upx 0 0 20upx;
				max-width: 33%;
				height: 200upx;

				view.relative {
					width: 192upx;
					border: @borderWidth solid @borderColor;
					padding:4upx;
					font-size:0;
					
					image {
						width: 192upx;
						height: 192upx;
					}

					.icon {
						z-index: 99;
						top: -19upx;
						right: -19upx;
					}
				}
			}
		}

		.chooseImage {
			border: @borderWidth solid @borderColor;
			width: 120upx;
			height: 120upx;
			padding: 40upx;

			.flex {
				view {
					width: 60upx;
					height: 60upx;
				}
			}
		}

		// -------------------------
		/*外层box*/

		.progress_box {
			height: 10upx;
			width: 100upx;
			border-radius: 5upx;
			background-color: #ececec;
			margin: 90upx 50upx;
		}

		/* 动画 */
		@-webkit-keyframes progressbar {
			from {
				width: 0
			}

			to {
				width: 50%
			}
		}

		/* Standard syntax */
		@keyframes progressbar {
			from {
				width: 0
			}

			to {
				width: 50%
			}
		}

		/*进度条*/
		.bar1 {
			height: 10upx;
			background: #d9d9d9;
			width: 0;
			border-radius: 5upx;
			-webkit-transition: width .10s ease;
			transition: width .10s ease;
			-webkit-animation: progressbar 10s infinite both;
			animation: progressbar 10s infinite both;
		}
	}
</style>
