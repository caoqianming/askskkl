<template>
	<view>
		<block v-if="hasLogin && userInfo.uid > 0">
		<view class="cu-form-group">
			<view class="title">用户名</view>
			<input class="text-right" :placeholder="userInfo.user_info.user_name?userInfo.user_info.user_name:'未登录'" disabled></input>
		</view>			
		<form @submit="submit" >
			<view class="cu-bar bg-white margin-top-sm solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>基本信息</text>
				</view>
			</view>	
			
			<view class="cu-form-group" v-if="!userInfo.user_info.verified || userInfo.user_info.verified == ''">
				<view class="title">个人介绍</view>
				<input class="text-right" :placeholder="userInfo.user_info.signature?userInfo.user_info.signature:'请填写个人介绍'" :value="userInfo.user_info.signature?userInfo.user_info.signature:''" name="signature"></input>
			</view>				
			<view class="cu-form-group">
				<view class="title">性别</view>
				<picker @change="GenderChange" :value="gender_id" :range="gender" name="sex">
					<view class="picker">
						{{gender_id>-1?gender[gender_id]:'请选择性别'}}
					</view>
				</picker>
			</view>								
			<view class="cu-form-group">
				<view class="title">生日</view>
				<picker mode="date" :value="birthday" start="1950-01-01" @change="DateChange" name="birthday">
					<view class="picker">
						{{birthday}}
					</view>
				</picker>
			</view>	
			<!-- #ifndef H5 || APP-PLUS || MP-ALIPAY -->
			<view class="cu-form-group">
				<view class="title">现居城市</view>
				<picker mode="region" @change="RegionChange" :value="region" name="region">
					<view class="picker">
						{{region[0]}}，{{region[1]}}
					</view>
				</picker>
			</view>
			<!-- #endif -->	
	
		
			<view class="cu-bar bg-white margin-top-sm solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>联系方式</text>
				</view>
			</view>	
			<view class="cu-form-group">
				<view class="title">Ｑ　Ｑ</view>
				<input class="text-right" :placeholder="userInfo.user_info.qq?userInfo.user_info.qq:'请填写QQ'" :value="userInfo.user_info.qq?userInfo.user_info.qq:''"  type="number" maxlength="11" name="qq"></input>
			</view>									
			<view class="padding flex flex-direction">
				<button class='cu-btn bg-blue round lg' formType="submit">提交保存</button>	
			</view>	
		</form>
		</block>
		<block v-else>
			<pageTips tipsText="请先登录" iconClass="cuIcon-lock text-gray"></pageTips>
		</block>
	</view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
 	import util from '@/utils/util.js';
	export default {
		data() {
			return {
				birthday: '1990-01-01',
				region: ['广东省', '广州市'],	
				gender:['请选择','男','女','保密'],
				gender_id:0
			}
		},		
        computed: {
            ...mapState(['hasLogin', 'userInfo'])
        },
		onLoad:function(){
			var userInfo = this.userInfo
			if(!userInfo.uid || userInfo.uid < 1 || !this.hasLogin){
				this.toLogin()
			}
			
			if(userInfo.user_info.birthday){
				this.birthday = userInfo.user_info.birthday
			}

			if(userInfo.user_info.sex){
				this.gender_id = userInfo.user_info.sex
			}
			if(userInfo.user_info.city && userInfo.user_info.province ){
				this.region = [userInfo.user_info.province,userInfo.user_info.city]
			}			
		},
        methods: {
            ...mapMutations(['login']),
			toLogin(){
				uni.navigateTo({
					url:'/pages/account/login'
				})
			},

			DateChange(e) {
				this.birthday = e.detail.value
				console.log('birthday',e.detail.value)
				// birthday_y: 1970
				// birthday_m: 1
				// birthday_d: 1				
			},
			RegionChange(e) {
				this.region = e.detail.value
			},	
			GenderChange(e) {
				this.gender_id = e.detail.value
			},					
			submit(e){
				console.log('submit',e)
				var value = e.detail.value
				console.log('submit value',value)
				
				var data = {}

				if(value.sex < 1){
					util.errorToast('请选择性别')
					return false;
				}else{
					data.sex = value.sex
				}
				var province = ''
				var city = ''
				if( value.region){
					province =  value.region[0]
					city =  value.region[1]	
					
					data.province = province
					data.city = city
				}
				
				if(value.qq){
					data.qq = value.qq
				}
				if(value.birthday){
					data.birthday = value.birthday
				}
				
				if(value.signature){
					data.signature = value.signature
				}
				
				var userInfo = this.userInfo	
				
				data.access_token = userInfo.access_token
				
				this.$api.profile_setting(data).then(res => {
					console.log('修改资料 profile_setting',res)
					// var user_info = res.data.rsm.user_info
					// if(user_info){
					// 	userInfo.user_info = user_info
					// 	this.login(userInfo)
					// 	this.toBack()
					// }
					if(data.sex){
						userInfo.user_info.sex = data.sex
					}						
					if(data.province){
						userInfo.user_info.province = data.province
						userInfo.user_info.city = data.city
					}
					if(data.signature){
						userInfo.user_info.signature = data.signature
					}
					if(data.sex){
						userInfo.user_info.sex = data.sex
					}										
					if(data.birthday){
						userInfo.user_info.birthday = data.birthday
					}
					if(data.qq){
						userInfo.user_info.qq = data.qq
					}					
					
					this.login(userInfo)
					this.toBack()					
					
				}).catch(err => {
					console.log('请求失败，可以在这里写处理代码',err);
					
				})	

			},
			toBack(){
				uni.navigateBack({
					delta:1
				})
			}
						
        }
    }
</script>

<style>


</style>
