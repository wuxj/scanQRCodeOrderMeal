let apiurl = {
	/* global URL */
	globalURL: {
		common: {
			Image: 'https://img.up.qipeiren.com/qpr_app_ceshi/', //dev 
			Unified: 'https://img.up.qipeiren.com/qpr_app_ceshi/XiaoChengXu/Unified', // dev
			// Image: 'https://img.up.qipeiren.com/qpr_app/',//prov 
			// Interface: 'https://order.qipeiren.com/qpr_app/', // prov
			// Unified: 'https://img.up.qipeiren.com/qpr_app/XiaoChengXu/Unified', // prov
		}
	},
	/* data URL */
	dataURL: {
		common: {
			RecommendList: 'Index/RecommendList',
			FileUpload:'proadd/FileUpload',
			Fileupload_Lujing:'proadd/fileupload_lujing',
			CaiJi: 'System/Caiji'
		},
		login: {
			GetUserInfo: 'WeiXin/GetUserInfo',
			CheckUnionIdMember: 'system/CheckUnionIdMember',
			GetMobileCodeByMobile: 'System/GetMobileCodeByMobile',
			ChuangJianMingPian: 'XiaoChengXu/ChuangJianMingPian'
		},
		center: {
			GetCompanyInfo: 'AutopartsArea/Mine/GetCompanyInfo',
			SubmitCompanyInfo: 'AutopartsArea/Mine/SubmitCompanyInfo',
			CollectShops: 'collection/shoplist',
			CheckMobileCodeByMobile: 'System/CheckMobileCodeByMobile',
			GetUserInfo: 'member/GetUserInfo',
			UserInfoSubmit: 'member/UserInfoSubmit'
		},
		home: {
			GetQualityCompany: 'AutopartsArea/Home/GetQualityCompany',
			GetAppSlideAds: 'home/getappslideads',
		},
		takebusinesscircle:{
			GetHomeSubscribeData: 'AutopartsArea/AreaSetting/GetHomeSubscribeData',
			GetSubscribeData: 'AutopartsArea/AreaSetting/GetSubscribeData',
			DeleteSubscribeData: 'AutopartsArea/AreaSetting/DeleteSubscribeData',
			GetAllData: 'AutopartsArea/AreaSetting/GetAllData',
			SubmitSubscribeData: 'AutopartsArea/AreaSetting/SubmitSubscribeData'
		},
		takecarbrand:{
			GetGoodBrand: 'AutopartsArea/BrandSetting/GetGoodBrand',
			GetSubscribeData: 'AutopartsArea/BrandSetting/GetSubscribeData',
			DeleteSubscribeData: 'AutopartsArea/BrandSetting/DeleteSubscribeData',
			SubmitSubscribeData: 'AutopartsArea/BrandSetting/SubmitSubscribeData'
		},
		search: {
			chanpin: 'search/chanpin',
			company: 'search/company',
			companySingle: 'search/companySingle',
			suggest: 'search/suggest',
			GetZhuYingCheXingByComids: 'search/GetZhuYingCheXingByComids'
		},
		shop: {
			QprShopContact: 'shop/QprShopContact', //联系方式
			QprShopCategory: 'shop/QprShopCategory', //店铺分类
			QprShopIntroduction: 'shop/QprShopIntroduction', //公司简介
			QprShopTopInfo: 'shop/QprShopTopInfo',
			QprShopProductList: 'shop/QprShopProductList',
			QprShopHome: 'shop/QprShopHome', // 旺铺首页
			AddShop: 'Collection/AddShop',
		},
		Product: {
			QprIndex: 'Product/QprIndex', //产品详情
			GetProductDescription: 'Product/GetProductDescription', //产品描述
		},
		AutopartsArea: {
			GetCompanyInfo: 'Mine/GetCompanyInfo',
			SubmitCompanyInfo: 'Mine/SubmitCompanyInfo'
		},
		XiaoChengXu: {
			GetWeiXinCard: 'XiaoChengXu/GetWeiXinCard'
		},
		XunBaoJia:{
			GetXunJiaList:'xunbaojia/GetXunJiaList',
			GetWeiBaiJiaDeXunJiaDetailById:'xunbaojia/GetWeiBaiJiaDeXunJiaDetailById',
			GetCheXingByVin:'xunbaojia/GetCheXingByVin',
			GetPeiJianByKeyword:'xunbaojia/GetPeiJianByKeyword',
			GetCheXingByVin:'xunbaojia/getchexingbyvin',
			GetHotBrand:'xunbaojia/GetHotBrand',
			GetChangYongPinPai:'xunbaojia/GetChangYongPinPai',
			GetCheXingByKeyword:'xunbaojia/GetCheXingByKeyword',
			GetCheXingById:'xunbaojia/GetCheXingById',
			XunjiaSubmit:'xunbaojia/XunjiaSubmit',
			Close:'xunbaojia/Close',
			CloseInquiry:'xunbaojia/CloseInquiry',
			GetBaoJiaDetailByEdit:'xunbaojia/GetBaoJiaDetailByEdit',
		},
	}
}

let exapiurl = {
	/**
	 * [geturl 获取配置的URL地址]
	 * @param  {[type]} param [Sring url配置]
	 * @param  {[type]} refer [String url类型 default: dataURL]
	 * @return {[type]}       [String]
	 */
	helper: {
		splitarr: function(str, mark) {
			if (str && str.length) {
				return str.split(mark)
			}
			return []
		},
		getdeepobjectkey: function(o, keys) {
			var keyarr = this.splitarr(keys, '.')
			for (var i = 0; i < keyarr.length; i++) {
				if (o.hasOwnProperty(keyarr[i])) {
					if (typeof o[keyarr[i]] === 'object') {
						o = o[keyarr[i]]
					} else {
						return o[keyarr[i]]
					}
				}
			}
		}
	},
	geturl(param, refer) {
		return this.helper.getdeepobjectkey(apiurl[refer || 'dataURL'], param)
	},
	getglobalurl: function(param) {
		return this.helper.getdeepobjectkey(apiurl['globalURL'], param)
	}
}

export default exapiurl

/**
 *eg. 使用示例
 */
// import apiurl from '@/utils/api-url';
// var SelectOrdertList = apiurl.geturl('order.SelectOrdertList');
