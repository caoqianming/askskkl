<template>
	<view>	
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view class="cu-avatar round lg bg-blue">
						<text class="cuIcon-new text-white"></text>
					</view>
					<view class="content" @click="toInbox">
						<view class="text-df">私信</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{userInfo.user_info.inbox_unread?'你有'+userInfo.user_info.inbox_unread+'条新私信':'暂无新私信'}}
							</view> 
						</view>
					</view>
					<view class="action" v-if="userInfo.user_info && userInfo.user_info.inbox_unread>0">
						<view class="cu-tag round bg-blue sm">{{userInfo.user_info.inbox_unread?userInfo.user_info.inbox_unread:0}}</view>
					</view>
				</view>	
			</view>		
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-notice text-blue "></text> 通知列表
				</view>
				<view class="action">
					<button class="cu-btn bg-blue shadow sm"  @click="toRead(-1,true)">全部已读</button>
				</view>				
			</view>			
			<view class="cu-list">
				<view class="flex flex-wrap bg-white padding" v-for="(item,index) in listData" :key="index"  @click="toRead(index,false)">
					<view class="notiy_left">
						<text>{{item.message}}</text>
					</view>
					<view class="notiy_right text-right">
						<text class="">{{item.add_time}}</text>
						<text class="padding-left-xs cuIcon-title" :class="item.read_flag==0?'text-blue light':'text-gary'"></text>						
					</view>
				</view>
			</view>
			<view class="bg-white text-center padding" v-if="listData.length <  1">暂无未读通知信息</view>
			<!-- 广告位 -->
			<view class="margin-tb-sm" v-if="system_config.adunitid && system_config.adunitid != ''">
				<ad :unit-id="system_config.adunitid"></ad>		
			</view>	
		<view class='cu-tabbar-height'></view>
	</view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
	import util from '@/utils/util.js';	
    export default {
        computed: {
            ...mapState(['hasLogin', 'userInfo','system_config'])
        },
		data() {
			return {
				tabArr:['我的私信','我的通知'],
				flag:'notifications',
				TabCur:0,
				isBack:false,
				reload:false,
				isLoad:true,
				isLastPage:false,
				listData:[],
				page:-1,
				notifications_count:0
			}
		},		
		onLoad:function(e){
			// this.getList();		
		},
		onShow:function(){
			console.log('onShow')
			this.intGetList()
		},
		//下拉刷新
        onPullDownRefresh:function() {
			this.intGetList()
        },
		//上拉加载
        onReachBottom:function() {
            this.getList();
        },		
        methods: {
            ...mapMutations(['login']),
			toRead(idx,is_all){
				var data = {}
				if(is_all){
					
				}else{
					if(idx > -1){
						var notification = this.listData[idx]
						console.log('notification',notification)
						if(notification.read_flag == 1){
							//直接跳转到页面
							this.clickNotification(notification)
							return false;
						}
						var notification_id = notification.notification_id
						data.notification_id = notification_id
					}else{
						util.errorToast('系统出错')
						return false;
					}
				}

				var userInfo = this.userInfo	
				
				data.access_token = userInfo.access_token?userInfo.access_token:''				
				this.$api.read_notification(data).then(res => {
					console.log('read_notification',res)
					var notifications_count = this.notifications_count

					if(!is_all){
						//更改页面显示
						if(this.listData[idx].read_flag == 0){
							this.listData[idx].read_flag = 1
							if(this.notifications_count > 0){
								
								notifications_count = notifications_count -1

								uni.setTabBarBadge({
								  index: 2,
								  text: (notifications_count).toString()
								})		
							}							
						}

						
					}else{
						notifications_count = 0
					}
					
					if(notifications_count < 1){
						uni.removeTabBarBadge({
						 index: 2,
						});	
					}					
					this.notifications_count = notifications_count
					
					userInfo.user_info.notification_unread = notifications_count
					this.login(userInfo)
					
					//先更新页面信息再跳转，免得返回上一页不会刷新数据
					if(is_all){
						setTimeout(() => {
							this.intGetList()
						}, 1200)		
					}else{
						//跳转对应的页面
						this.clickNotification(notification)
					}
					
				}).catch(err => {
					// uni.stopPullDownRefresh();
					console.log('请求出错了，可以在这里做失败处理',err);
				})						
				
				
			},
		
			clickNotification(notification){
				console.log('clickNotification',notification)
				if(notification){
					var model_type = notification.model_type
					var item_id = notification.item_id
					var p_user_name = notification.p_user_name
					if( item_id > 0 || p_user_name){
						switch (model_type){
							case 1:
								this.toQuestion(item_id)
								break;
							case 4:
								this.topeople(p_user_name)
								break;		
							// case 7:
							// 	this.toArticle(item_id)
							// 	break;	
							case 8:
								this.toArticle(item_id)
								break;																							
							default:
								util.errorToast('暂不支持查看此类型的内容')
								break;
						}
					}
				}
			},
			intGetList:function(){
				this.reload = true;
				this.page = -1
				this.isLastPage = false
				this.getList();				
			},
			getList:function(){
				var data = {}

				if (this.isLastPage) { //说明已有数据，目前处于上拉加载
					uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page
				data.flag = ''
				var userInfo = this.userInfo
				
				data.access_token = userInfo.access_token?userInfo.access_token:''
				
				this.$api.load_notifications(data).then(res => {
					console.log('load_notifications',res)
					this.page = page
					this.isLoad = false
					var list = res.data.rsm.list
					console.log('list',list)
					if(list.length > 0){
						this.listData = this.reload ? list : this.listData.concat(list);
						this.reload = false;
						if(list.length < 10){
							this.isLoad = true						
							this.isLastPage = true
						}
						
						if(userInfo.user_info.notification_unread > 0){
							this.notifications_count = userInfo.user_info.notification_unread
							uni.setTabBarBadge({
							  index: 2,
							  text: this.notifications_count.toString()
							})	
						}

					}else{
						this.isLoad = true
						this.isLastPage = true
						if(page == 0){
							this.listData = []
							util.errorToast('暂无通知消息')
						}
					}
					if(list.length < 1){
						this.footerTips = '暂无数据'
					}
					
				}).catch(err => {
					// uni.stopPullDownRefresh();
					console.log('请求出错了，可以在这里做失败处理',err);
				})						
			},
			toInbox(){
                uni.navigateTo({
                    url: '/pages/inbox/inbox',
                });	
			},
            toLogin() {
                uni.navigateTo({
                    url: '/pages/account/login',
                });
            },
			topeople(uid){
				if(!uid){
					return false;
				}
				uni.navigateTo({
					url:'/pages/people/people?uid='+uid
				})
			},
			toQuestion(id){
				if(!id || id < 1){
					return false;
				}
				uni.navigateTo({
					url:'/pages/question/detail?id='+id
				})
			},		
			toArticle(id){
				if(!id || id < 1){
					return false;
				}
				uni.navigateTo({
					url:'/pages/article/detail?id='+id
				})
			}
						
        }
    }
</script>

<style>
.notiy_left {
	-webkit-flex-basis: 75%;
	-ms-flex-preferred-size: 75%;
	flex-basis: 75%;
}
.notiy_right {
	-webkit-flex-basis: 25%;
	-ms-flex-preferred-size: 25%;
	flex-basis: 25%;
}

</style>
