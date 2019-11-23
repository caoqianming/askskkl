<template>
	<view>
		<view class="cu-chat">
			<block v-for="(item,index) in listData" :key="index">
				<view class="cu-item self" v-if="item.uid == userInfo.uid">
					<view class="main">
						<view class="content bg-blue shadow">
							<text>{{item.message}}</text>
						</view>
					</view>
					<view class="cu-avatar radius" :style="'background-image:url('+userInfo.user_info.avatar_file+');'"></view>
					<view class="date">{{item.add_time}}</view>
				</view>
				<view class="cu-item" v-if="item.uid == recipient_user.uid">
					<view class="cu-avatar radius" :style="'background-image:url('+recipient_user.avatar_file+');'" @click="topeople(item.uid)"></view>
					<view class="main">
						<view class="content shadow">
							<text>{{item.message}}</text>
						</view>
					</view>
					<view class="date ">{{item.add_time}}</view>
				</view>
				
			</block>
		</view>
		<block v-if="system_config.system_verify != 'Y'">
			<form @submit="formSubmit">
				<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
					<view class="action">
						<!-- <text class="cuIcon-sound text-grey"></text> -->
					</view>
					<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
					 @focus="InputFocus" @blur="InputBlur" :value="chat_message_value" name="message" placeholder="请输入私信内容"></input>
					<view class="action">
						<!-- <text class="cuIcon-emojifill text-grey"></text> -->
					</view>
					<button class="cu-btn bg-blue shadow" formType="submit">发送</button>
				</view>
			</form>
		</block>

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
				InputBottom:0,
				isBack:false,
				reload:false,
				isLoad:true,
				isLastPage:false,
				listData:[],
				page:0,
				dialog_id:0,
				recipient_user:[],
				chat_username:'',
				last_message:'',
				chat_message_value:''
			}
		},		
		onLoad:function(e){
			var dialog_id = e.dialog_id
			var username = e.username
			
			if(username){
				this.chat_username = username
			}
			
			if(dialog_id){
				this.dialog_id = dialog_id
			}			
			
			if(dialog_id > 0){
				this.getList()
			}else if(username){
				this.showChat()
			}
			
		},
		methods: {
			...mapMutations(['login']),
			formSubmit(e){
				var value = e.detail.value
				var chat_message_value = value.message
				if(chat_message_value){
					this.inbox_send(chat_message_value)
				}
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0	
				// console.log('失去焦点',e)
				// var chat_message_value = e.detail.value
				// console.log('输入框的内容',chat_message_value)
				// this.chat_message_value = chat_message_value
				
			},
			submitChat(e){
				var chat_message_value = this.chat_message_value
				this.inbox_send(chat_message_value)
			},
			inbox_send:function(message){
				// console.log('inbox_send',e)
				var userInfo = this.userInfo
				if(!userInfo.uid || userInfo.uid < 1){
					this.toLogin()
					return false
				}	
				if(!message){
					message = this.chat_message_value
				}					
				// var message = e.detail.value.message
				if(!message || message == '' || message == 'undefined'){
					util.errorToast('内容不能为空')
					return false
				}	
				
				if(this.last_message == message){
					util.errorToast('请勿重复发送')
					return false
				}
				
				var data = {}
				data.recipient = this.chat_username
				data.message = message
				
				data.access_token = userInfo.access_token?userInfo.access_token:''
				
				this.$api.inbox_send(data).then(res => {
					console.log('inbox_send',res)
					
					//把本次发送的信息，显示在聊天框中
					var chat_message = {}
					chat_message.message = message
					chat_message.add_time = '刚刚'
					chat_message.uid = userInfo.uid
					
					var list = this.listData.concat(chat_message);
					this.listData = list
					console.log(this.listData)
					this.last_message = message
					setTimeout(() => { 
						this.chat_message_value = '' 
					}, 10)		
					this.chat_message_value = ' ' 
					// setTimeout(() => {
					// 	this.toBack()
					// }, 1200)					
				}).catch(err => {
					console.log('请求出错了，可以在这里做失败处理',err);
				})
			},
			//从个人主页跳转过来的私信聊天
			showChat:function(chat_username){
				if(!chat_username){
					chat_username = this.chat_username
				}
				if(chat_username == '' || !chat_username){
					this.toBack()
					return false
				}
				uni.setNavigationBarTitle({
					title:'给 ' + chat_username +' 发私信'
				})
				
			},
			intGetList:function(){
				this.reload = true;
				this.page = 0
				this.isLastPage = false
				this.getList();				
			},			
			//从私信页面进来的，有聊天记录
			getList:function(dialog_id){
				
				if(!dialog_id){
					dialog_id = this.dialog_id
				}
				if(dialog_id < 1){
					this.toBack()
					return false
				}				
				var data = {}

				if (this.isLastPage) { //说明已有数据，目前处于上拉加载
					uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page
				
				data.dialog_id = dialog_id
				var userInfo = this.userInfo
				
				data.access_token = userInfo.access_token?userInfo.access_token:''
				
				this.$api.chat_inbox(data).then(res => {
					console.log('chat_inbox',res)
					var recipient_user = res.data.rsm.recipient_user
					if(recipient_user){
						uni.setNavigationBarTitle({
							title:'来自 '+recipient_user.user_name+' 的私信'
						})
						this.recipient_user = recipient_user
						this.chat_username = recipient_user.user_name
					}
					
					if(page == 1){
						userInfo.user_info.inbox_unread = 0
						this.login(userInfo)
					}					
					
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
						
					}else{
						this.isLoad = true
						this.isLastPage = true
						if(page == 1){
							this.listData = []
							util.errorToast('暂无私信内容')
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
		}
	}
</script>

<style>
page{
  padding-bottom: 100upx;
}
</style>
