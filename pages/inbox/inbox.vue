<template>
	<view>	
			<view class="cu-bar bg-white solid-bottom" v-if="listData.length > 1">
				<view class="action">
					<text class="cuIcon-new text-blue "></text> 私信列表
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in listData" :key="index"  @click="toChat(item.id)">
					<view class="cu-avatar round lg" :style="'background-image:url('+item.avatar_file+');'"></view>
					<view class="content">
						<view class="text-black">{{item.user_name}}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								<text class="text-blue margin-right-xs" v-if="item.unread > 0">[未读]</text>{{item.last_message}}
							</view> </view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{item.update_time}}</view>
						<view class="cu-tag round bg-blue sm" v-if="item.unread > 0">{{item.count}}</view>
					</view>
				</view>
			</view>			
			<pageTips tipsText="暂无私信" iconClass="cuIcon-new text-gray" v-if="listData.length < 1"></pageTips>
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
				page:0,
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
			toChat(dialog_id){
				if(dialog_id < 1){
					this.toBack()
					return false
				}
				uni.navigateTo({
					url:'/pages/inbox/chat?dialog_id='+dialog_id
					
				})
			},
			intGetList:function(){
				this.reload = true;
				this.page = 0
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
				
				this.$api.load_inbox(data).then(res => {
					console.log('load_inbox',res)
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
            toBack(){
				uni.navigateBack({
					delta:1
				})
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
			},					
        }
    }
</script>

<style>

</style>
