import apiurl from './api-url.js'
import encrypt from './SHA1.js'
import app from './global-helper'
/**
 * get ajax header
 */
const ajaxHelper = {
    getheader: ajaxdata => {
        let token = app.globalData.unionId ? app.globalData.unionId : '';
        let token_user = app.globalData.tokenuser ? app.globalData.tokenuser : '';
        let disturb_str = '6672caa2c46f4f5281d9865738ed8c6f6e8a8bad24064f859671ee3ec0ab7959';
        let sign_params = ajaxdata => {
            let newkey = Object.keys(ajaxdata).sort();
            let newObj = {
                oriobj: ajaxdata,
                newobj: {},
                strobj: []
            };
            for (let i in newkey) {
                newObj['newobj'][newkey[i]] = ajaxdata[newkey[i]];
                newObj['strobj'].push(newkey[i] + ajaxdata[newkey[i]]);
            }
            return newObj['strobj'].join('');
        };
        return {
			// #ifdef MP-BAIDU
			from_client: 'BDMINI-QUAN',
			// #endif
			// #ifdef MP-WEIXIN
			from_client: 'WXMINI-QUAN',
			// #endif
			// #ifdef MP-ALIPAY
			from_client: 'ALMINI-QUAN',
			// #endif
            token: token,
            token_user: token_user,
            sign_params: encrypt.sha1(sign_params(ajaxdata) + token_user + disturb_str)
        };
    },
    getdatastring: ajaxdata => {
        let params = ajaxdata => {
            let newkey = Object.keys(ajaxdata);
            let newObj = {
                oriobj: ajaxdata,
                strobj: []
            };
            for (let i in newkey) {
                newObj['strobj'].push(newkey[i] + '=' + ajaxdata[newkey[i]]);
            }
            return newObj['strobj'].join('&').replace(/url=/, '').replace(/\&/, '?');
        };
        return params(ajaxdata);
    }
};

/**
 * uni request ajax
 * options: ajax options
 */
const uniRequestAjax = (options) => {
    if (!options || !options.url) {
        uni.showToast({
            title: '请求地址有误'
        });
        return false;
    }

    if (typeof options.showLoading == 'undefined' || options.showLoading) {
       uni.showLoading({
            title: '加载中'
        });
    }

	let serverurl = options.serverurl ? options.serverurl : apiurl.getglobalurl('common.Image');
	options.url = serverurl + options.url;

	if (typeof options.isunified == 'undefined' || options.isunified) {
		options.data = {
			url: ajaxHelper.getdatastring(Object.assign({
				url: options.url
			}, options.data || {}))
        };
		options.url = apiurl.getglobalurl('common.Unified');
    }
	
	uni.request({
		url: options.url,
		data: options.data,
		header: ajaxHelper.getheader(options.data) || {},
		method: options.method || 'GET',
		dataType: options.dataType || 'json',
		// #ifdef MP-WEIXIN || MP-BAIDU
		responseType: options.responseType || 'text',
		// #endif
		success: function(res, status, header) {
			if (typeof options.success === 'function') {
			    options.success(res.data, function() {
			        uni.hideLoading();
			    });
			}
		},
		fail: function() {
		},
		complete: function() {			
			//是否有提示，则可以延时关闭提示框，解决微信提示框一闪就消失的问题
			if (!options.ishasmessagetips) {
			    uni.hideLoading();
			}
		}
	});
};


const uniUploadFile = (options) => {
	if (!options || !options.url) {
	    uni.showToast({
	        title: '请求地址有误'
	    });
	    return false;
	}
	
	let serverurl = options.serverurl ? options.serverurl : apiurl.getglobalurl('common.Image');
	options.url = serverurl + options.url;
	
	return uni.uploadFile({
		url:options.url,
		files:options.files || [],
		filePath: options.filePath || '',
		name: options.name || '',
		formData: options.data,
		success: function(uploadFileRes) {
			if (typeof options.success === 'function') {
			    options.success(uploadFileRes);
			}
		},
		fail: function() {
		},
		complete: function() {
		}
	});
};

export default {
	apiurl: apiurl,
	uniajax: uniRequestAjax,
	uniUpload: uniUploadFile
}