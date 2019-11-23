<template>
	<view>	
		<!-- 用户信息 -->
		<block v-if="hasLogin">
			<view class="bg-blue user padding " >
				<!-- 头像 -->
				<view class="left">
					<image :src="userInfo.user_info.avatar_file?userInfo.user_info.avatar_file:userInfo.avatarUrl"></image>
				</view>
				<!-- 昵称,个性签名 -->
				<view class="right">
					<view class="username" @tap="topeople(userInfo.uid)">{{userInfo.user_info.user_name?userInfo.user_info.user_name:userInfo.nickName}}</view>
					<view class="signature margin-top" @tap="topeople(userInfo.uid)">查看个人主页</view>
				</view>
				<view class="cuIcon-settings text-white padding-right-xl" @tap="toSetting">
				</view>
			</view>
		</block>
		<block v-if="!hasLogin">
			<view class="bg-blue user padding" >
				<view class="left">
					<image src="../../static/img/avatar.png" @tap="toLogin"></image>
				</view>
				<view class="right">
					<view class="username" @tap="toLogin">请先点此登录</view>
				</view>
				<view class="cuIcon-right text-white padding-right-xl" @tap="toLogin">
				</view>				
			</view>
		</block>
		<view class='padding flex text-center text-grey bg-white shadow-warp'>
			<view class='flex flex-sub flex-direction solid-right' @tap="topeople(userInfo.uid)">
				<view class="text-xxl text-blue">{{userInfo.user_info.reputation > 0? userInfo.user_info.reputation:'0'}}</view>
				<view class="margin-top-sm">
					<text class='cuIcon-crown'></text> 威望</view>
			</view>		
			<view class='flex flex-sub flex-direction solid-right' @tap="topeople(userInfo.uid)">
				<view class="text-xxl text-blue">{{userInfo.user_info.integral > 0 ? userInfo.user_info.integral:'0'}}</view>
				<view class="margin-top-sm">
					<text class='cuIcon-coin'></text> 积分</view>
			</view>
			<view class='flex flex-sub flex-direction' @tap="topeople(userInfo.uid)">
				<view class="text-xxl text-blue">{{userInfo.user_info.agree_count ? userInfo.user_info.agree_count:'0'}}</view>
				<view class="margin-top-sm">
					<text class='cuIcon-appreciate'></text> 获赞</view>
			</view>				
		</view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
			<view class="cu-item arrow" @tap='toMyQuestion(userInfo.uid)' data-Wechat='chenxiaojun'>
				<view class='content'>
					<text class='cuIcon-question text-gray'></text>
					<text class='text-grey'>我的问答</text>
				</view>
			</view>	
			<view class="cu-item arrow" @tap='toMyArticle(userInfo.uid)' data-Wechat='chenxiaojun'>
				<view class='content'>
					<text class='cuIcon-write text-cyan'></text>
					<text class='text-grey'>我的文章</text>
				</view>
			</view>	
			<view class="cu-item arrow" @tap='toMyFollows(userInfo.uid)' data-Wechat='chenxiaojun'>
				<view class='content'>
					<text class='cuIcon-friendfavor text-pink'></text>
					<text class='text-grey'>我的粉丝</text>
				</view>
			</view>							
			<view class="cu-item arrow">
				<button class='cu-btn content' open-type='feedback'>
					<text class='cuIcon-write text-cyan'></text>
					<text class='text-grey'>Bug反馈</text>
				</button>
			</view>
		</view>
		<view class="text-Abc text-sm text-gray text-center" @click="showVersion">版本号</view>
		<!-- 广告位 -->
		<view class="margin-tb-sm" v-if="system_config.adunitid && system_config.adunitid != ''">
			<ad :unit-id="system_config.adunitid"></ad>		
		</view>			
		<view class='cu-tabbar-height'></view>
	</view>
</template>

<script>
	import appconfig from 'utils/config.js'
    import {mapState,mapMutations} from 'vuex'
    export default {
        computed: {
            ...mapState(['hasLogin', 'userInfo','system_config'])
        },
		onShow:function(){

		},
        methods: {
            ...mapMutations(['login']),
            toLogin() {
                uni.navigateTo({
                    url: '../account/login',
                });
            },
			toMyQuestion(uid){
				
				if(!uid || uid < 1){
					this.toLogin()
					return false;
				}
                uni.navigateTo({
                    url: 'question?uid='+uid
                });
			},
			toMyArticle(uid){
				if(!uid || uid < 1){
					this.toLogin()
					return false;
				}				
                uni.navigateTo({
                    url: 'article?uid='+uid
                });
			},
			toMyFollows(uid){
				if(!uid || uid < 1){
					this.toLogin()
					return false;
				}				
                uni.navigateTo({
                    url: 'follows?uid='+uid
                });
			},
			topeople(uid){
				if(!uid || uid < 1){
					this.toLogin()
					return false;
				}
				uni.navigateTo({
					url:'../people/people?uid='+uid
				})
			},
			toSetting(){
				if(!this.userInfo.uid || this.userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
					return false;
				}				
				uni.navigateTo({
					url:'/pages/user/setting'
				})	
			},
			showVersion(){
				uni.showToast({
					icon:'none',
					title:'版本号：'+appconfig.VERSION
				})
			}
						
        }
    }
</script>

<style>
.user {
  width: 100%;
  padding: 0 4%;
  display: flex;
  align-items: center;
  /* position: relative;*/
  /* background-color: #0081ff; */
  padding: 20upx 10upx 50upx 50upx;
}
.user .left {
  width: 20vw;
  height: 20vw;
  flex-shrink: 0;
  margin-right: 20upx;
  border: solid 1upx #fff;
  border-radius: 100%;
}
.user .left image {
  width: 20vw;
  height: 20vw;
  border-radius: 100%;
}
.user .right {
  width: 100%;
}
.user .right .username {
  font-size: 36upx;
  color: #fff;
}
.user .right .signature {
  color: #fff;
  font-size: 22upx;
}
.user .erweima {
  flex-shrink: 0;
  width: 10vw;
  height: 10vw;
  margin-left: 5vw;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to left, #fbbb37 0%, #fcf0d0 105%);
}
.user .erweima .icon {
  color: #7b6335;
  font-size: 42upx;
}

</style>
