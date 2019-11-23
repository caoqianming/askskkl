<template>
	<view>
		<!-- 小程序登录界面 -->
		<view v-if="!showBind">
			<view class="userinfo margin-top">
			  <view class="userinfo-avatar">
				<open-data  type="userAvatarUrl"></open-data>
			  </view>
			</view>		
			<view class="padding solid-top">
				<text class="padding text-black text-xxl">{{is_register?'你正在注册账号':'申请获取以下权限'}}</text>
				<view class="padding text-gray">{{is_register?'绑定成功后，可以在小程序内无需密码快捷登录':'使用你的公开信息(昵称、头像等)用于页面上显示'}}</view>
			</view>
			<view class='padding-xl'>
			  <button class='cu-btn bg-blue round shadow lg block' open-type="getUserInfo" @getuserinfo="GetUserInfo">{{is_register?'立即注册':'立即登录'}}</button>
			  <button class='cu-btn bg-black round shadow lg block margin-top-sm' @click="toBack">返回</button>
			</view>		
		</view>
		<!-- 绑定 / 注册新账号 -->
		<view class="login" v-if="showBind">
			<view class="content">
				<!-- 头部logo -->
				<!-- <view class="header">
					<image :src="logoImage"></image>
				</view> -->
				<view class="text-center margin-top-xl">
					<view class="cu-avatar xl round">
						<text class="cuIcon-people"></text>
					</view>
				</view>
				<!-- 主体表单 -->
				<view class="main">
					<view class="main-list oBorder" v-if="is_register">
						<input class="main-input" v-model="email" type="text" maxlength="-1" placeholder="邮箱"/>
					</view>						
					<view class="main-list oBorder">
						<input class="main-input" v-model="phoneData" type="text" maxlength="32" placeholder="用户名"/>
					</view>
					<view class="main-list oBorder">
						<input class="main-input" v-model="passData" type="text" maxlength="32" placeholder="密码" password="true" />
					</view>
	
					<view class="main-list oBorder" v-if="use_icode && is_register">
						<input class="main-input" v-model="icode" type="text" maxlength="-1" placeholder="邀请码"/>
					</view>									
				</view>
				<button :class="['buttonBorder bg-blue',!isRotate?'dlbutton':'dlbutton_loading']" @tap="startLogin()">
					<view :class="isRotate?'rotate_loop':''">
						<text v-if="isRotate" class="cuIcon-loading1"></text>
						<text v-if="!isRotate">{{is_register?'注册账号':'登 录'}}</text>
					</view>
				</button>
				<!-- 底部信息 -->
				<view class="footer">
					<view @click="ChangOperate">{{is_register?'已有账号,去登录绑定':'注册一个新账号'}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	import wCache from '@/utils/wCache.js'
	import { mapState,mapMutations } from 'vuex';  	
	export default {
		computed: {  
			...mapState(['userInfo','hasLogin','system_config'])  
		},			
		data() {
			return {
				//logo图片 base64
				logoImage: 'http://wenda.wecenter.com/static/mobile/img/login-logo.png',
				phoneData:'', //用户/电话
				passData:'', //密码
				email:'', //邮箱
				icode:'', //邀请码	
				use_icode:false,
				isRotate: false, //是否加载旋转
				showBind:false,
                is_register: false,
				register_type:''
			};
		},
		onLoad:function(e){
			this.wxLogin()
			// this.isLogin();
			var system_config = this.system_config
			this.register_type = system_config.register_type
			if(system_config && system_config.register_type == 'invite' ){
				this.use_icode = true
			}
		},
		methods: {
			...mapMutations(['login']),	
			toBack(){
				uni.navigateBack() 
			},
			wxLogin(e){
				var that = this
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
					console.log('uni.loginRes',loginRes);
					// console.log('uni.loginRes.authResult',loginRes.authResult);
					if (loginRes.code) {
						var code = loginRes.code;
						// console.log('登录成功code：' + loginRes.code)
						that.login_code = code;
					} else {
					  console.log('获取用户登录态失败！' + loginRes.errMsg)
					}					
				  }
				});					
			
			},
			GetUserInfo(e) {
				console.log('GetUserInfo：',e);
					var errMsg = e.detail.errMsg
					if(errMsg == 'getUserInfo:ok'){
						if (e.detail.userInfo) {
							var encryptedData = encodeURIComponent(e.detail.encryptedData)
							var iv = e.detail.iv
							var rawData = e.detail.rawData
							var signature = e.detail.signature
							
							// var userInfo =  e.detail.userInfo;
							// app.globalData.userInfo = userInfo;
							var login_code = this.login_code

							var data = {}
							data.code = login_code
							data.encryptedData = encryptedData
							data.iv = iv
							data.rawData = rawData
							data.signature = signature
							this.$api.getUserInfo(data).then(res => {
								var errno = res.data.errno
								if(errno == 1){
									//解密成功
									var userInfo = res.data.rsm.userInfo
									this.login(userInfo);
									var signature_token = res.data.rsm.signature_token
									if(signature_token){
										wCache.put('signature_token',signature_token)
									}
									var uid = userInfo.uid
									if(uid > 0){
										//返回来源页面
										setTimeout(function(){
											uni.navigateBack() 
										},800)	
																			
									}else{
										
										if(this.register_type == 'close'){
											this.showBind = true
											this.is_register = false
											NavigationBarTitle = '登录账号'
										}else{
											uni.showModal({
												title: '小程序登录成功',
												content: '你需要绑定一个网站账号才可以继续操作',
												cancelText: '注册新号',
												confirmText: '绑定旧号',
												success: res => {
													this.showBind = true
													var NavigationBarTitle = ''
													if (res.confirm) {
														this.is_register = false
														NavigationBarTitle = '登录账号'
													}else{
														if(this.register_type == 'close'){
															util.errorToast('暂不支持新用户注册')
															return false;
														}else{
															this.is_register = true
															NavigationBarTitle = '注册账号'
														}
													}
													
													uni.setNavigationBarTitle({
														title:NavigationBarTitle
													})
												},
												fail: (fail) => {
													this.showBind = false
													this.is_register = false
												}
											})	
										}
	
									}

									
								}else{
									this.wxLogin()
									console.log('解密失败',res);
								}	
													
							}).catch(err => {
								console.log('返回错误',err);
								this.wxLogin()
							})
						}						
					}else{
						uni.showModal({
							title: '授权失败',
							content: '请允许授权！授权仅仅是使用你的头像和昵称作为登录显示，不会泄露你的隐私',
							showCancel: false,
							cancelText: '',
							confirmText: '好的',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}
			},
			//切换注册或者登陆
			ChangOperate(){
				if(this.is_register){
					this.is_register = false
					uni.setNavigationBarTitle({
						title:'登录账号'
					})						
					
				}else{
					if(this.register_type == 'close'){
						util.errorToast('已关闭新用户注册功能')
						return false;
					}else{
						this.is_register = true
						uni.setNavigationBarTitle({
							title:'注册账号'
						})							
					}
					
				}
			
				
			},
			//注册账号
			reg_account:function(user_name,password,email,icode=''){
				if(this.register_type == 'close'){
					util.errorToast('新用户注册功能已关闭')
					return false;
				}
				if(user_name && password && email){
					var userInfo = this.userInfo
					console.log('userInfo',userInfo)
					if(userInfo.nickName != '' && this.hasLogin){
						var data = {}
						data.user_name = user_name
						data.password = password
						data.email = email
						
						if(this.system_config.register_type == 'invite' && this.icode){
							data.icode = icode
						}
						
						data.userInfo = JSON.stringify(userInfo)
						data.access_token = userInfo.access_token
						this.$api.reg_account(data).then(res => {
							//注册成功，储存、更新用户信息
							console.log('注册成功 reg_account',res)
							var user_info = res.data.rsm.user_info
							if(user_info && user_info.uid > 0){
								userInfo.user_info = user_info
								userInfo.uid = user_info.uid
								userInfo.access_token = res.data.rsm.access_token
								var signature_token = res.data.rsm.signature_token
								if(signature_token){
									
									wCache.put('signature_token',signature_token)
								}								
								console.log('reg_account userInfo',userInfo)
								this.login(userInfo);
								uni.navigateBack({
									delta:1
								})
							}else{
								
								util.errorToast('注册失败')
							}
							
							
						}).catch(err => {
							this.isRotate = false;
							console.log('请求失败，可以在这里写处理代码',err);
							
						})							
					}else{
						util.showToast('请重新登录')
						this.wxLogin()
						this.showBind = false
					}					
			
				}else{
					util.errorToast('邮箱账号和密码不能为空')
				}				
			},
						
			//绑定账号
			bind_account:function(user_name,password){

				if(user_name && password){
					var userInfo = this.userInfo
					console.log('userInfo',userInfo)
					if(userInfo.nickName != '' && this.hasLogin){
						var data = {}
						// data.member_id = userInfo.member_id
						data.user_name = user_name
						data.password = password
						data.userInfo = JSON.stringify(userInfo)
						data.access_token = userInfo.access_token
						this.$api.bind_account(data).then(res => {
							// util.showToast('正在同步用户资料...')
							//绑定成功，储存、更新用户信息
							console.log('绑定成功 bind_account',res)
							userInfo.user_info = res.data.rsm.user_info
							userInfo.uid = res.data.rsm.user_info.uid
							userInfo.access_token = res.data.rsm.access_token
							var signature_token = res.data.rsm.signature_token
							if(signature_token){
								wCache.put('signature_token',signature_token)
							}								
							console.log('bind_account userInfo',userInfo)
							this.login(userInfo)
							setTimeout(function(){
								uni.navigateBack({
									delta:1
								})
							},1000)							
							
						}).catch(err => {
							this.isRotate = false;
							console.log('请求失败，可以在这里写处理代码',err);
						})							
					}else{
						util.showToast('请重新登录')
						this.wxLogin()
						this.showBind = false
					}					
			
				}else{
					util.errorToast('账号和密码不能为空')
				}				
			},
			
			isLogin(){
				//判断缓存中是否登录过，直接登录
				try {
					const value = uni.getStorageSync('setUserData');
					if (value) {
						//有登录信息
						console.log("已登录用户：",value);
						this.$store.dispatch("setUserData",value); //存入状态
						uni.reLaunch({
							url: '../../../pages/index',
						});
					}
				} catch (e) {
					// error
				}
			},
		    startLogin(){
				//登录
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				console.log('email',this.email)
				console.log('icode',this.icode)				
				if (this.phoneData.length == "") {
				     util.errorToast('用户名不能为空')
				    return;
				}
		        if (this.passData.length < 5) {
		            util.errorToast('密码不正确')
		            return;
		        }

				uni.showLoading({
					title: '登录中'
				});				
				this.isRotate=true
				if(this.is_register){
					this.reg_account(this.phoneData,this.passData,this.email,this.icode)
				}else{
					this.bind_account(this.phoneData,this.passData)
				}
				setTimeout(function(){
					uni.hideLoading()
					this.isRotate=false
				},1200)
				
		    }
		}
	}
</script>

<style>
	@import url("./css/main.css");
	page{
		background-color: #ffffff;
	}
	.userinfo {  
	  position: relative;  
	  /* width: 750rpx;  */
	  height: 320rpx;  
	  color: #ffffff;  
	  display: flex;  
	  flex-direction: column;  
	  align-items: center;  
	}  
	  
	.userinfo-avatar {  
	  overflow:hidden;  
	  display: block;  
	  width: 160rpx;  
	  height: 160rpx;  
	  margin: 20rpx;  
	  margin-top: 50rpx;  
	  border-radius: 50%;  
	  border: 2px solid #fff;  
	  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);  
	} 	
</style>
