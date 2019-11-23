<script>
    import {mapState,mapMutations} from 'vuex'
	import wCache from 'utils/wCache.js';
	export default {
        computed: {
            ...mapState(['hasLogin', 'userInfo'])
        },
		onLaunch: function() {
			var userInfo = wCache.get('userInfo')
			if(userInfo){
				console.log('userInfo',userInfo)
				// this.login(userInfo)
				//联网请求获取最新的用户信息
				this.checkUserToken(userInfo)
			}else{
				this.checkUserToken(false)
			}
		},
		onShow: function() {
		},
		onHide: function() {
		},
        methods: {
            ...mapMutations(['login','logout','config']),
			checkUserToken:function(userInfo){
				var data = {}
				if(userInfo){
					data.uid = userInfo.uid
					data.access_token = userInfo.access_token	
				}else{
					data.uid = 0
					data.access_token = ''	
				}

				this.$api.checkUserToken(data).then(res => {
					// console.log('checkUserToken',res)
					if(res){
						var new_userInfo = res.data.rsm.userInfo
						if(new_userInfo && new_userInfo.uid > 0){
							var signature_token = res.data.rsm.signature_token
							if(signature_token){
								wCache.put('signature_token',signature_token)
							}
							this.login(new_userInfo)
						}else{
							this.logout()
						}
						
						//系统配置
						var system_config = res.data.rsm.system_config
						if(system_config){
							this.config(system_config)
						}
						if(new_userInfo.user_info && new_userInfo.user_info.notification_unread){
							var notification_unread = new_userInfo.user_info.notification_unread
							if(notification_unread > 0){
								//角标文字
								uni.setTabBarBadge({
								  index: 2,
								  text: notification_unread.toString()
								})	
								//红点
								// uni.showTabBarRedDot({
								// 	index: 2,
								// });	
							}
						}else{
							if(new_userInfo.user_info){
								var inbox_unread = new_userInfo.user_info.inbox_unread
								if(inbox_unread && inbox_unread > 0){
									//角标文字
									uni.setTabBarBadge({
									  index: 2,
									  text: inbox_unread.toString()
									})										
								}
							}
						}


						
					}
				}).catch(err => {
					this.logout()
					// '请求失败，可以在这里写处理代码'
					console.log('err.data',err);
				})				
			}
		}		
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	
</style>
