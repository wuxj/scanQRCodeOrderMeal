import WxValidate from 'tools/WxValidate'
import apiurl from '@/tools/api-url.js'
import ajax from '@/tools/http-ajax.js'
import baseTools from '@/tools/base-tools.js'
import CollectFlow from '@/tools/collect-flow.js'

const GlobalHelper = {
	globalData: {
		location: {
			province: '',
			city: ''
		},
		isauthorized: false,
		userInfo: null,
		tokenuser: '',
		openId: '',
		unionId: '',
		mycomid: 0,
		hecomid: 0,
		comidtype: 'my',
		lbsqq: {
			key: '6SFBZ-KLRCJ-D4JFK-FTC3L-EWARK-QTBPI'
		},
		uuid: ''
	},
	/**
	 * 从服务器获取 用户信息
	 * @param res
	 */
	getloginid(uinfo) {
		let that = this;
		const userInfo = uni.getStorageSync('userInfo') || {};
		//未获取到unionId
		if (!userInfo.unionId) {
			//#ifdef MP-WEIXIN
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					uni.login({
						provider: res.provider,
						success: res => {
							let code = res.code;
							ajax.uniajax({
								serverurl: apiurl.getglobalurl('common.Image'),
								url: apiurl.geturl('login.GetUserInfo'),
								isunified: false,
								data: {
									code: code,
									rawdata: uinfo.rawData,
									signature: uinfo.signature,
									encrypteddata: uinfo.encryptedData,
									iv: uinfo.iv,
									sence: 2
								},
								success: res3 => {
									if (res3.success) {
										let appdata = res3.data.app;

										that.globalData.openId = appdata.openId;
										that.globalData.unionId = appdata.unionId;
										that.globalData.tokenuser = appdata.tokenuser;

										uni.setStorageSync('userInfo', {
											openId: appdata.openId,
											unionId: appdata.unionId,
											tokenuser: appdata.tokenuser
										});
										// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
										// 所以此处加入 callback 以防止这种情况
										that.setMycomid(function(){
											if (that.userInfoReadyCallback) {
												that.userInfoReadyCallback();
											}
										});
									}
								}
							});
						}
					});
				}
			});
			//#endif

			//#ifdef MP-BAIDU
			swan.getSwanId({
				success: function(res) {
					that.globalData.unionId = res.data.swanid

					uni.setStorageSync('userInfo', {
						openId: '',
						unionId: res.data.swanid,
						tokenuser: ''
					});

					that.setMycomid(function(){
						if (that.userInfoReadyCallback) {
							that.userInfoReadyCallback();
						}
					});
				}
			});
			//#endif
			
			// #ifdef MP-ALIPAY
			that.globalData.unionId = uinfo.authCode;
			uni.setStorageSync('userInfo', {
				openId: '',
				unionId: uinfo.authCode,
				tokenuser: ''
			});
			
			that.setMycomid(function(){
				if (that.userInfoReadyCallback) {
					that.userInfoReadyCallback();
				}
			});
			// #endif
		} else {
			that.globalData.openId = userInfo.openId;
			that.globalData.unionId = userInfo.unionId;
			that.globalData.tokenuser = userInfo.tokenuser;

			that.setMycomid(function(){
				// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				// 所以此处加入 callback 以防止这种情况
				if (that.userInfoReadyCallback) {
					that.userInfoReadyCallback();
				}
			});
		}
	},
	setMycomid(callback){
		let that = this;
		that.getMyComid(function(mycomid){
		    that.SetComidType('my', mycomid, 'comid');

			if(callback){
				callback();
			}
		});
	},
	/*
	 *  获取我的 comid
	 *
	 * */
	getMyComid(callback) {
		let that = this;
		ajax.uniajax({
			serverurl: apiurl.getglobalurl('common.Image'),
			url: apiurl.geturl('login.CheckUnionIdMember'),
			isunified: false,
			data: {
				unionid: that.globalData.unionId
			},
			success: res => {
				if (res.success) {
					let appdata = res.data.app;
					that.globalData.mycomid = appdata.mycomid;
					if (callback) {
						callback(appdata.mycomid)
					}
				}
			}
		});
	},
	/**
	 * 设置用户类型及comid
	 */
	SetComidType(comidtype, comid, settype) {
		let that = this;
		if (settype == 'comid') {
			that.globalData[comidtype + 'comid'] = comid;
		} else if (settype == 'type') {
			that.globalData.comidtype = comidtype;
		} else {
			that.globalData[comidtype + 'comid'] = comid;
			that.globalData.comidtype = comidtype;
		}
	},
	//判断用户是否授权
	getscopeuserinfo(callback) {
		let that = this;
		that.globalData.isauthorized = that.globalData.userInfo != null;
		if (typeof callback === 'function') {
			callback(that.globalData.isauthorized);
		}
		if (that.getscopeuserinfoCallback) {
			that.getscopeuserinfoCallback(that.globalData.isauthorized);
		}
	},
	userInfoReadyCallback: null,
	/**
	 * 用户授权登录
	 */
	bindGetUserInfo(event) {
		let that = this;
		if (event.detail.userInfo) {
			that.globalData.userInfo = event.detail.userInfo;

			//get login id
			that.getloginid(event.detail);
		} else {
			//拒绝授权登录
		}
	},
	getUserInfo(res0) {
		let that = this;
		// #ifdef MP-WEIXIN || MP-BAIDU
		// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		uni.getUserInfo({
			withCredentials: true,
			success: res2 => {
				// 可以将 res 发送给后台解码出 unionId
				that.globalData.userInfo = res2.userInfo;
				
				//get login id
				that.getloginid(res2);
			}
		});
		// #endif
		/**
		 * 由于用户头像昵称等信息并未用到，故可不弹框授权时，跳过
		 **/
		// #ifdef MP-ALIPAY
		that.globalData.userInfo = res0;
		//get login id
		that.getloginid(res0);
		// #endif
	},
	doNormalMyComid(callback) {
		if (this.globalData['unionId'] && this.globalData['mycomid']) {
			if (callback) {
				callback();
			}
		} else {
			uni.navigateTo({
				url: '/pages/user-center/verify-phone'
			})
		}
	},
	WxValidate: (rules, messages) => new WxValidate(rules, messages),
	/**
	 * 设置品类
	 * @param value
	 */
	setPinlei(value) {
		try {
			uni.setStorageSync('systempinlei', (value + ''));
		} catch (e) {}
	},
	/**
	 * 获取品类
	 * @returns {number}
	 */
	getPinlei() {
		let value = 0;
		let label = ['', '商用车', '乘用车'];
		try {
			value = uni.getStorageSync('systempinlei');
			if (value) {
				value = parseInt(value);
				if (isNaN(value)) {
					value = 0;
				}
			} else {
				value = 0
			}
		} catch (e) {}
		return {
			value: value,
			label: label[value]
		};
	},
	/**
	 * 获取位置信息
	 */
	getLocation() {
		let that = this;
		// #ifdef MP-WEIXIN || MP-BAIDU
		uni.getSetting({
			success: (res) => {
				if (res.authSetting && res.authSetting['scope.userLocation']) {
					that.getLocationPlant()
				} else {
					uni.authorize({
						scope: 'scope.userLocation',
						success: () => {
							that.getLocationPlant()
						}
					})
				}
			}
		});
		// #endif
		// #ifdef MP-ALIPAY
		that.getLocationPlant()
		// #endif
	},
	getLocationPlant() {
		let that = this;
		//#ifdef MP-WEIXIN
		uni.getLocation({
			type: 'wgs84',
			success: function(res) {
				let value = res.latitude + ',' + res.longitude;
				uni.request({
					url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + value + '&key=' + that.globalData.lbsqq.key,
					output: 'JSON',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.status === 0) {
							let component = res.data.result.address_component;
							that.globalData.location = {
								province: component.province,
								city: component.city
							};
						}
					}
				})
			}
		});
		//#endif

		// #ifdef MP-BAIDU
		swan.getLocation({
			type: 'wgs84',
			altitude: true,
			success: function(res) {
				that.globalData.location = {
					province: res.province,
					city: res.city
				};
			},
			fail: function(err) {}
		});
		// #endif
		
		// #ifdef MP-ALIPAY
			my.getLocation({
				type: 1,
				success(res) {
					console.log(res)
					that.globalData.location = {
						province: res.province,
						city: res.city
					};
				},
				fail() {},
		    });
		// #endif
	},
	getStorageUuid (){
		let uuid = uni.getStorageSync('uuid');
		if (uuid && uuid.length) {
			return uuid;
		}
		
		uuid = baseTools.getuuid(32);
		uni.setStorageSync('uuid', uuid);
		return uuid;
	},
	/**
	 * public methods 返回到指定的页面
	 * @param {Object} pageRouter
	 * @param {String} paramKey  eg. 'paramKey'
	 * @param {Object} paramVal  eg.{{} || [] || ''....}
	 * @param {Object} PAGE  当前页面对象 eg. this or that
	 * @param {Function} callback  当未找到返回页面时回调交由调用者自行处理
	 */
	pageNavBack(pageRouter, paramKey, paramVal, PAGE, callback) {
		var pages = getCurrentPages();
		var idx = pages.findIndex(function(value, index, array) {
			return pageRouter.indexOf(value.route) != -1;
		});
		if (idx != -1) {
			if (paramKey) {
				PAGE.$fire.fire(paramKey, paramVal);
			}
			uni.navigateBack({
				delta: pages.length - idx - 1
			});
		} else {
			if (callback) {
				callback();
			}
		}
	},
	/** 
	 * public methods 获取通过pageNavigateBack返回页面的数据
	 * @paramKey
	 **/
	getPageParamByNavBack(paramKey, callback, PAGE) {
		if (PAGE) {
			PAGE.$fire.on(paramKey, (data) => {
				if (callback) {
					callback(data)
				}
			});
		}
	},
	setPageInfo(param) {
		// #ifdef MP-BAIDU
		if (swan.setPageInfo) {
			swan.setPageInfo({
				title: param.title,
				keywords: param.keyword,
				description: param.desc,
				success: function() {
					console.log(JSON.stringify(param));
				}
			});
		}
		// #endif
	},
	BrowseFlow: CollectFlow.BrowseFlow
};

export default GlobalHelper;
