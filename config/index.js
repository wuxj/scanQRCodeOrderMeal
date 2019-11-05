// var server={
//     api:"http://csapi.we99.net/public/",
// 	// host:"http://www.shop.com/api/",
// 	image:"http://csapi.we99.net/public/",
// 	// host:"https://gitee.com/wokaixin/data/raw/demo4/",
// 	// host:"https://gitee.com/wokaixin/a_fragrant_fly/raw/master/request/data/",
// 	host:"http://csapi.we99.net/public/index.php/api/"
// }
var api={
    api:"http://csapi.we99.net/api/",
    image:"http://csapi.we99.net/public/",
}
module.exports = {
    api:api,
	// host:server.host,
	// server:server,
	
	// app: app,//全局
// 	tokenInit:app.tokenInit,//token 有效期检测 自动请求服务器更新
// 	service:app.service,//服务器 地址等相关信息
// 	clientId:app.clientId,//客户端id 代替session_id
// 	makeID:app.makeID,//生成唯一id
// 	client:app.client,//返回数据是加密后的;默认返回内容是客户端id,即：clientId='er*****', 可传值obj格式,会被转成&id=4格式相加起来;服务器需解密
// 	tokenInfo:app.tokenInfo,//token缓存表数据源信息
// 	setToken:app.setToken,//新设置存入所有token,用于首次登陆时，存入返回的相关授权数据
// 	accessToken:app.accessToken,//鉴权accessToken
// 	refresh:app.refresh,//用户刷新token；可传值token或access;用于token有效期到期前，免登陆请求服务器更新相关token
// 	userInfo:app.userInfo,//用户信息 用于首次登陆时，存入返回的用户相关信息
}