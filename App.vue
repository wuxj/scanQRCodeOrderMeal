<script>
	import app from '@/tools/global-helper'
	export default {
		onLaunch () {
			// #ifdef MP-WEIXIN
			uni.getSetting({
				success: (res) => {
					if (res.authSetting && res.authSetting['scope.userInfo']) {
						app.getUserInfo();
					}
				}
			});
			// #endif
			
			// #ifdef MP-BAIDU
			uni.authorize({
				scope: 'scope.userInfo',
				success() {
					app.getUserInfo();
				}
			});
			// #endif
			
			// #ifdef MP-ALIPAY
				my.getAuthCode({
				  scopes: ['auth_base'],
				  success: (res) => {
					app.getUserInfo(res);
				  },
				});
			// #endif
	
			app.globalData.uuid = app.getStorageUuid();
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/base.css'
</style>
