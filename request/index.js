// 模拟数据请求部分 ————————————————————————————————————————————————————————————————————
import ceshiData from './data/index.js';//测试数据代替远程服务器的请求返回数据
import API from './api.js';
var runLocal=true;//是否运行模式 本地测试数据=true。非本地=false
// 请求密钥
var configure={
	signature:{
		userId:'1234',
		sesionId:'12315465213',
		},
	
}
// 设置请求apiName对应的请求参数
var apiObj =API;
if(runLocal){
	apiObj=ceshiData	
}

/**
 * 修补请求方法
 * urlName			string 		请求地址 name
 * successFun 		function 	请求成功回调函数；
 * dataObj			object		请求参数数据requeObj.data
 * requeObj			object		请求参数全部参数(含 method,data,header,dataType,responseType,fail等更多) 
 */
function ajax(apiNameStr,successFun,dataObj,requeObj){
	var apiNameStr=apiNameStr || "index";
	var dataObj =dataObj || {};
	var requeObj =requeObj || {};
	var Obj=apiObj[apiNameStr];
	
	if(Obj){
			// 合并 用户请求参数+系统预置请求参数
			requeObj.header=requeObj.header || {};
			requeObj.data=requeObj.data || {};
			requeObj.method=Obj.method || "GET";
			requeObj.dataType=Obj.dataType || "json";

			if(Obj.header && typeof Obj.header==='object'){
				requeObj.header=Object.assign(requeObj.header,Obj.header)
			}
			
			if(Obj.data && typeof Obj.data==='object'){
				requeObj.data=Object.assign(requeObj.data,Obj.data)
			}
			
			requeObj.fail=requeObj.fail || Obj.fail || function(e){//请求接口失败返回值
			console.log("请求失败")
				console.log(e)
			};
			requeObj.complete=requeObj.complete|| Obj.complete || function(e){//请求结束返回，无论成功失败都返回
			uni.hideLoading();//关闭等等框
				console.log(e)
			}
			requeObj.success=successFun ||  requeObj.success || Obj.success || function(e){ console.log("请给ajax请求添加回调函数")};
			
			if(Obj.success && typeof Obj.success==='function'){
				requeObj.success=Obj.success;
			}
			requeObj.url=Obj.url;
		
		// 判断是不是本地测试模式，返回模拟数据
			if(runLocal){
				requeObj.success({header:'',data:{code:200,message:requeObj,data:Obj}});
				return true;
			}
			uni.request(requeObj)
	}
}

export default {
	ajax:ajax,
// 	post:post,
// 	get:get
}
// // 中断请求任务
// requestTask.abort();