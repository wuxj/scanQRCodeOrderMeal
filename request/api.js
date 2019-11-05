import config from '../config/index.js'
var API=config.api;

export default {
    goodsShop:{
    	url:API+"/goodsShop",
    	// header:{signature:configure.signature},
    	data:{
            assess_token:false
        }
    }
}