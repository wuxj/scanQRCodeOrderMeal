import app from '@/tools/global-helper'
import apiurl from '@/tools/api-url.js'
import ajax from '@/tools/http-ajax.js'
import baseTools from '@/tools/base-tools.js'
let Flowmethods = {
	logerr: function(ret) {
		console.log(JSON.stringify(ret));
	},
	record: function() {
		let that = this;
		return {
			/**
			 * cguid: 设备号
			 * dataformtype: 终端标记
			 * vpage: 当前页面路径
			 * tcomid: 被访问者
			 * vproid: 产品id
			 * referrer: 来源路径
			**/
			add: function(behavTag, exparams) {
				let param = {
					cguid: app.globalData.uuid.toLocaleLowerCase(),
					comid: app.globalData.mycomid,
					dataformtype: 2,
					vpage: 'url[http://m.qipeiren.com' + that.conf()[behavTag].vpage.replace(/{comid}/, exparams.tocomid).replace(/{proid}/, exparams.proid).replace(/{plant}/, this.plant()) + ']',
					tcomid: exparams.tocomid,
					vproid: exparams.proid || 0,
					referrer: ''
				};
				delete exparams.tocomid;
				delete exparams.proid;

				ajax.uniajax({
					url: apiurl.geturl('common.CaiJi'),
					data: Object.assign(param, exparams),
					success: function(ret, appdata) {
						// that.logerr(ret)
					},
					complete: function(ret, appdata) {
						// that.logerr(ret)
					}
				});
			},
			plant(){
				let plant = '';
				// #ifdef MP-WEIXIN
				plant = 'WXMINI-QUAN';
				// #endif
				
				// #ifdef MP-BAIDU
				plant = 'BDMINI-QUAN';
				// #endif
				
				// #ifdef MP-ALIPAY
				plant = 'ALMINI-QUAN';
				// #endif
				
				return plant;
			}
		};
	},
	conf: function() {
		return {
			shopindex: {
				key: 'shopindex',
				title: '店铺首页',
				vpage: '/company/{comid}.htm#{plant}/index'
			},
			shopproductlist: {
				key: 'shopproductlist',
				title: '店铺产品列表',
				vpage: '/company/{comid}.htm#{plant}/prolist'
			},
			shopclassify: {
				key: 'shopclassify',
				title: '店铺分类',
				vpage: '/company/{comid}.htm#{plant}/class'
			},
			shopbriefinfo: {
				key: 'shopbriefinfo',
				title: '店铺简介',
				vpage: '/company/{comid}.htm#{plant}/cominfo'
			},
			shopcontact: {
				key: 'shopcontact',
				title: '店铺联系方式',
				vpage: '/company/{comid}.htm#{plant}/contact'
			},
			productdetail: {
				key: 'productdetail',
				title: '产品详情',
				vpage: '/offer/{proid}.htm#{plant}'
			}
		}
	}
};

let BFlow = {
	behav: Flowmethods.conf(),
	/**
	 * behav 配置参数
	 * exparams 额外扩展字段
	 **/
	add: function(behav, exparams) {
		Flowmethods.record().add(behav, exparams);
	}
};

export default {
	BrowseFlow: BFlow
};
