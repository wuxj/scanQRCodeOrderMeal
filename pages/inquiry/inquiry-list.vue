<template>
	<view class="bg-F2F2F2">
		<view class="com-tabbar">
			<view class="bg-FFF com-tabbar-nav">
				<block v-for="(item, index) in tabs" :key="index">
					<view class="com-tabbar-nav-item" :class="{ 'com-tabbar-nav-item-on': activeIndex === index }" @click="tabClick(index)">
						<view class="com-tabbar-nav-title" :class="{ 'c-F60': activeIndex === index }">{{ item }}</view>
					</view>
				</block>
			</view>
			
			<view class="com-tabbar-panel" v-if="inquiryList.length > 0">
				<view class="com-tips" v-if="activeIndex == 0">
					<view class="tips-cont">
						请使用汽配人APP查看报价详情，并联系报价商家
					</view>
				</view>

				<view class="bg-FFF padded-20 margin-b20 myinquiry-circle" v-for="(item, index) in inquiryList" :key="index">
					<view class="padded-t20 padded-b20">
						<view class="uni-flex">
							<view class="uni-flex-item fw-blod" v-text="item.xunjiatype === 1 ? item.peijianname : item.pinpai_name + '询价单'"></view>
							<view class="c-999" v-text="item.inputdate"></view>
						</view>
						<view class="c-999 text-ellipsis-1" v-text="item.xunjiatype === 1 ? item.chexing + item.niankuan + item.cheliangname : item.xunjiaremark"></view>

						<view class="padded-t10">
							<block v-for="(img, i) in item.xunjiaimage" :key="i">
								<view class="dis-inline margin-r10 margin-b10 border-b1 fs-0 padded-4" v-if="i < 3">
									<image class="square-100" @tap="previewImage(item.xunjiaimage.slice(0, 3), i)" :data-index="i" :src="img" mode="aspectFit"></image>
								</view>
							</block>	
						</view>
					</view>

					<view class="border-bt1">
						<view class="uni-flex padded-t20">
							<view class="uni-flex-item c-999" v-text="item.xunjiastateRemark"></view>
							<block v-for="(btn, btnidx) in item.btnstateRemark" :key="btnidx">
								<button type="primary" size="mini" v-if="btn.flag == 'quoteprice'" @click="fnQuotePrice(item)">{{ btn.text }}</button>
								<button class="margin-l10" type="default" size="mini" v-if="btn.flag == 'close'" @click="fnCloseInquiry(item)">{{ btn.text }}</button>
								<uni-icon class="margin-l10" stylecls="uni-icon" type="trash" size="22" v-if="btn.flag == 'delete'" @click="fnDeleteInquery(item)"></uni-icon>
								<button class="bg-F2F2F2 border-b0 margin-l10" plain="true" size="mini" v-if="btn.flag == 'detail'" @click="fnDetailInquery(item)">
									{{ btn.text }}
								</button>
							</block>
						</view>
					</view>

					<view class="myinquiry-circle-prosition" v-if="item.stateRemark">
						<view class="w-100 h-100 text-ac border-circle border-b1 border-bc-red">
							<view class="c-red myinquiry-transfrom padded-t30 padded-b20" v-text="item.stateRemark"></view>
						</view>
					</view>
				</view>
				<precise-popup
					width="100%"
					height="480"
					:show="closeInquiry.visible"
					type="bottom"
					selectType="radio"
					:title="closeInquiry.title"
					:sourcedata="closeInquiry.sourcedata"
					@handleChange="radioChangeInvoice"
					@hidePopup="hidePopup('closeInquiry')"
					@surePopup="surePopup('closeInquiry')"
				></precise-popup>
			</view>
			<view class="bg-FFF text-ac padded-30 c-999" v-else>暂无数据</view>
		</view>
	</view>
</template>

<script>
import uniIcon from '@/components/uni-icon.vue';
import apiurl from '@/tools/api-url.js';
import ajax from '@/tools/http-ajax.js';
import precisePopup from './inquiry-form/precise-popup.vue';
import app from '@/tools/global-helper';
export default {
	data() {
		return {
			tabs: ['已收到报价', '未收到报价'],
			activeIndex: 1,
			state: 1,

			inquiryList: [],
			pageindex: 1,
			pagesize: 10,
			page: {
				total: 0,
				page_size: 1,
				page_index_max: 6
			},
			// 发票单选
			closeInquiry: {
				title: '选择关闭询价单的原因',
				visible: false,
				current: {
					name: '',
					value: 0
				},
				sourcedata: [
					{
						name: '已达成购买',
						value: '121'
					},
					{
						name: '已线下采购',
						value: '122'
					},
					{
						name: '不想买了',
						value: '123'
					}
				]
			}
		};
	},
	onLoad() {
		// this.tabClick(0)
	},
	onShow() {
		this.loadData(true);
	},
	methods: {
		// Popup 相关
		showPopup(target, item) {
			this[target].visible = true;
			this[target].id = item.id;
		},
		hidePopup(target) {
			this[target].visible = false;
		},
		surePopup(target, id) {
			this.hidePopup(target);
			if (this.closeInquiry.current.value) {
				this.doCloseInquiry(this[target].id);
			}
		},
		// 单选 选中
		radioChangeInvoice(e) {
			this.redioChange(e, 'closeInquiry');
		},
		redioChange(e, target) {
			let that = this;
			let items = that[target].sourcedata;
			let value = null;
			for (let i = 0; i < items.length; i++) {
				if (items[i].value === e.target.value) {
					value = items[i].value;
					that[target].current = items[i];
					break;
				}
			}
		},

		tabClick(index) {
			let that = this;
			that.activeIndex = index;
			that.state = that.activeIndex === 0 ? 3 : 1;
			that.loadData(true);
		},
		loadData(isreload) {
			let that = this;

			if (isreload) {
				that.inquiryList = [];
				this.pageindex = 1;
			}

			ajax.uniajax({
				url: apiurl.geturl('XunBaoJia.GetXunJiaList'),
				data: {
					comid: app.globalData['mycomid'],
					state: that.state,
					pageindex: that.pageindex,
					pagesize: that.pagesize
				},
				success: res => {
					if (res.success) {
						let appdata = res.data.app;
						appdata.forEach(function(value) {
							let statemark = '';
							let xunjiastateRemark = '';
							let btnstateRemark = [];
							// 询价标记
							if (
								121 == value.xunjiastate ||
								122 == value.xunjiastate ||
								321 == value.xunjiastate ||
								322 == value.xunjiastate ||
								(43 == value.xunjiastate && value.haschengjiao)
							) {
								statemark = '已购买';
							} else if (123 == value.xunjiastate || 323 == value.xunjiastate) {
								statemark = '已完成';
							} else if (41 == value.xunjiastate || 43 == value.xunjiastate) {
								statemark = '已过期';
							}
							value.stateRemark = statemark;

							// 询价状态文字
							if (3 == value.xunjiastate || 321 == value.xunjiastate || 322 == value.xunjiastate || 323 == value.xunjiastate || 43 == value.xunjiastate) {
								xunjiastateRemark = '报价：' + value.yibaojia_count + '条';
							} else if (1 == value.xunjiastate) {
								xunjiastateRemark = '正在询价';
							} else if (121 == value.xunjiastate || 122 == value.xunjiastate || 123 == value.xunjiastate || 41 == value.xunjiastate) {
								xunjiastateRemark = '未报价';
							}
							value.xunjiastateRemark = xunjiastateRemark;

							if (3 == value.xunjiastate || 321 == value.xunjiastate || 321 == value.xunjiastate || 322 == value.xunjiastate || 43 == value.xunjiastate) {
								// btnstateRemark.push({
								// 	flag: 'quoteprice',
								// 	text: '查看报价'
								// });
							}

							if (1 == value.xunjiastate || 3 == value.xunjiastate) {
								btnstateRemark.push({
									flag: 'close',
									text: '关闭询价'
								});
							}
							if (
								121 == value.xunjiastate ||
								122 == value.xunjiastate ||
								123 == value.xunjiastate ||
								41 == value.xunjiastate ||
								321 == value.xunjiastate ||
								322 == value.xunjiastate ||
								323 == value.xunjiastate ||
								43 == value.xunjiastate
							) {
								btnstateRemark.push({
									flag: 'delete',
									text: ''
								});
							}
							btnstateRemark.push({
								flag: 'detail',
								text: '查看详情'
							});
							value.btnstateRemark = btnstateRemark;
						});
						that.page = res.data.page;
						that.inquiryList = [...that.inquiryList, ...appdata];
					}
				}
			});
		},
		fnQuotePrice(item) {
		},
		fnDetailInquery(item) {
			uni.navigateTo({
				url: './inquiry-detail?id=' + item.id
			});
		},
		fnDeleteInquery(item) {
			let that = this;

			uni.showModal({
				title: '提示',
				content: '确定删除询价单？',
				success: function(res) {
					if (res.confirm) {
						ajax.uniajax({
							url: apiurl.geturl('XunBaoJia.Close'),
							data: {
								comid: app.globalData['mycomid'],
								id: item.id
							},
							success: res => {
								uni.showToast({
									title: res.message,
									icon: 'none',
									duration: 2000
								});
								if (res.success) {
									that.inquiryList = that.inquiryList.filter(x => {
										return x.id != item.id;
									});
								}
							}
						});
					}
				}
			});
		},
		fnCloseInquiry(item) {
			this.showPopup('closeInquiry', item);
		},
		doCloseInquiry(id) {
			let that = this;
			ajax.uniajax({
				url: apiurl.geturl('XunBaoJia.CloseInquiry'),
				data: {
					comid: app.globalData['mycomid'],
					id: id,
					state: that.closeInquiry.current.value
				},
				success: res => {
					uni.showToast({
						title: res.message,
						duration: 2000
					});
					if (res.success) {
						that.loadData(true);
					}
				}
			});
		},
		previewImage(images, i){
			let that = this
			uni.previewImage({
				current: images[i],
				indicator: "number",
				loop: "true",
				urls:images.join(',').replace(/_s/g, '').split(',')
			})
		}
	},

	/**
	 * 监听用户下拉动作,一般用于下拉刷新
	 */
	onPullDownRefresh() {
		this.loadData(true);
		uni.stopPullDownRefresh();
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		this.pageindex++;
		if (this.pageindex > this.page.page_index_max) {
			uni.showToast({
				title: '没有更多数据了',
				icon: 'none'
			});
		} else {
			this.loadData(false);
		}
	},
	components: {
		uniIcon,
		precisePopup
	}
};
</script>

<style>
button::after {
	border: none;
}
.myinquiry-transfrom {
	transform: rotate(45deg);
}

.myinquiry-circle {
	position: relative;
}

.myinquiry-circle-prosition {
	position: absolute;
	right: 30upx;
	top: 20px;
	opacity: 0.8;
}
</style>
