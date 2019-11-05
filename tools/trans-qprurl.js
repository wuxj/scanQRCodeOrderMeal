let transQprUrl = {
	/**
	 * MSARKS配置项
	 * 根据情况随时增加
	 */
	marks: [{
			mark: 'search-chanpin-byParams',
			examp: 'http://m.qipeiren.com/c/chanpin_wap?d=xxx&keywords=%E5%8D%9A%E4%B8%96',
			regx: /\/c\/chanpin_wap\?\.*?/,
			regxsole: /.*?\/c\/chanpin_wap\?(\S*)/,
			method: 'searchProduct',
			clickfn (paramstr) {
				// let param = that.exchangestrparamtoobject(paramstr); 将参数字符串转换成参数对象
				/**
				 * 跳转事件, 不同的端在此配置不同的跳转方式
				*/
				uni.navigateTo({
					url: '../search/product-list?' + paramstr.replace(/keywords=/, 'keyword=')
				});
			}
		}
	],
	/**
	 * 将参数字符串转换成参数对象
	 * paramStr: a=1&b=2&c=3
	 * return: {a:1,b:2,c:3}
	 */
	exchangestrparamtoobject: function(paramStr){
		let res = {};
		let paramArr = paramStr.split('&');
		for (let i = 0; i < paramArr.length; i++){
			let arr = paramArr[i].split('=');
			res[arr[0]] = arr[1];
		}
		return res;
	},
	/**
	 * 根据URl和配置的MARKS项，匹配出跳转相关参数
	 * url: string 要解析的url
	 * return: {
		originurl: 传入的参数url
		valid: boolen 是否有正确的配置项与之匹配
		mark: MARKS.mark 配置项标记
		param: string 跳转需要的参数
		clickfn: function 跳转的方法
		method: string 跳转的方法名称
	 }
	 */
	exchangebyurl: function(url = '') {
		let that = this;
		let res = {
			valid: !1
		};
		url = decodeURIComponent(url);
		for (let idx in that.marks) {
			let item = that.marks[idx];
			if (item.regx.test(url)) {
				res.originurl = url;
				res.valid = !0,
					res.mark = item.mark;
				res.param = (function() {
					let sole = url;
					// for (let jdx in item.regxsole) {
					// 	let xsole = item.regxsole[jdx];
					// 	sole = sole.replace(xsole, '');
					// }
					return sole.match(item.regxsole)[1];
				}());
				res.clickfn = item.clickfn;
				res.method = item.method;
			}
		}
		return res;
	}
};

export default transQprUrl;