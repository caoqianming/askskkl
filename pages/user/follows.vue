<template>
  <view>
		<scroll-view scroll-x class="bg-white nav text-center margin-bottom-sm">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect(index)" :data-id="index">
				{{item}}
			</view>
		</scroll-view>  
		<view class="cu-list menu-avatar">
			<view class="cu-item" v-for="(item,index) in listData" :key="index">
				<view class="cu-avatar round lg" :style="'background-image:url('+item.avatar_file+');'" v-if="item.avatar_file"></view>
				<view class="cu-avatar round lg" v-if="!item.avatar_file"><text class="cuIcon-people"></text></view>
				<view class="content">
					<view>
						<view class="text-cut">{{item.user_name}}</view>
					</view>					
					<view class="text-gray text-sm flex"> 
						<view class="text-cut">{{item.signature?item.signature:'这个人很懒，还未填写介绍'}}</view>
					</view>
				</view> 
				<view class="action">
					<button class="cu-btn sm bg-blue"v-if="!item.follow_check" @click="follow_people">关注</button>					
					<button class="cu-btn sm" v-if="item.follow_check" @click="follow_people">已关注</button>
					<!-- <button class="cu-btn sm" v-if="item.follow_check == 2">互相关注</button> -->

				</view>
			</view>
		</view>
		<view class="cu-load text-grey" :class="!isLoad?'loading':'over'" v-if="res_count != 0"></view>		
		<pageTips v-if="listData.length < 1">
			<block slot="button">
				<view class="padding text-center">
					<button class="cu-btn bg-blue" @click="intGetList">
						<text class="cuIcon-refresh"></text> 重载
					</button>
				</view>
			</block>
		</pageTips>				
  </view>
</template>

<script>
	import { mapState } from 'vuex'; 
	import util from '@/utils/util.js';
	export default {
		computed: {  
			...mapState(['userInfo','hasLogin'])  
		},
		data() {
			return {
				tabArr:['我的粉丝','我的关注'],
				type:'fans',
				isCard:true,
				isBack:false,
				isLoad:true,
				reload:false,
				listData:[],
				page:0,
				res_count:0,
				TabCur:0,
				topic_day:0,
				uid:0
			}
		},
		onLoad:function(e){
			var uid = e.uid
			if(!uid || uid == 'undefined' || uid < 1){
				this.toLogin()
				return false;
			}	
			this.uid = uid
			var tab = parseInt(e.tab)
			if(tab){
				this.tabSelect(tab)
			}else{
				this.getList()
			}			
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
			follow_people(){
				var uid = this.uid
				if(uid < 1){
					util.errorToast('系统出错')
					return false;
				}
				var userInfo = this.userInfo
				if(!userInfo.uid || userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
				}
				var data = []

				
				data.access_token = userInfo.access_token?userInfo.access_token:''		

				data.uid = uid
				
				this.$api.follow_people(data).then(res => {
					console.log('follow_people',res)

					var type = res.data.rsm.type
					if(type){
						if(type == 'add'){
							this.user_follow_check = true
						}else{
							this.user_follow_check = false
						}
					}else{
						util.errorToast('关注失败')
						return false;		
					}

					
				}).catch(err => {
					// uni.stopPullDownRefresh();
					console.log('请求出错了，可以在这里做失败处理',err);
				})	
			},			
			intGetList:function(){
				this.reload = true;
				this.last_id = 0
				this.page = 0
				this.isLastPage = false
				this.getList();				
			},
			getList:function(){
				var uid = this.uid
				if(uid < 1){
					util.errorToast('查看的用户不存在')
					return false;
				}
				
				var userInfo = this.userInfo
				if(!userInfo.uid || userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
				}				
				
				var data = {}
				data.type = this.type
				data.minId = this.last_id ? this.last_id : 0;
				if (this.last_id > 0 && this.isLastPage) { //说明已有数据，目前处于上拉加载
					uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page
				var userInfo = this.userInfo
				data.uid = uid
				
				data.access_token = userInfo.access_token?userInfo.access_token:''
				this.$api.getMyFollows(data).then(res => {
					this.page = page
					this.isLoad = false
					var list = res.data.rsm.list
					if(!list || list.length < 1){
						this.isLoad = true
						this.isLastPage = true
						if(page == 1){
							this.listData = []
							this.res_count = 0
							util.errorToast('未找到相关内容')
						}						
					}else{
						this.res_count = res.data.rsm.totals	
						
						this.listData = this.reload ? list : this.listData.concat(list);
						console.log('listData',this.listData)
						this.last_id = list[list.length - 1].id;
						this.reload = false;
						if(list.length < 10){
							this.isLoad = true						
							this.isLastPage = true
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
			toDetail:function(e){
				var article_id = e.currentTarget.dataset.article_id;
				if(article_id > 0){
					uni.navigateTo({
						url:'detail?article_id='+article_id
					})
				}else{
					util.showToast('文章id有误')
				}
			},	
			tabSelect(TabCur){
				// var TabCur = e.currentTarget.dataset.id;
				this.TabCur = TabCur
				if(TabCur == 1){
					this.type = 'follows'
				}else{
					this.type = 'fans'
				}
				console.log('切换到',this.type,'==-==',this.tabArr[TabCur]);
				this.intGetList()
			},
            toLogin() {
                uni.navigateTo({
                    url: '/pages/account/login',
                });
            },							
		}
	}
</script>
<style>

</style>
