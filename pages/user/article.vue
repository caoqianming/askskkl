<template>
  <view>
		<scroll-view scroll-x class="bg-white nav text-center margin-bottom-sm">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
				{{item}}
			</view>
		</scroll-view>  
		<block v-if="TabCur == 0">
			
			<view class="cu-list menu">
				<view class="cu-item" v-for="(item,index) in listData" :key="index"  @click="toArticleDetail" :data-id="item.id">
					<view class="content padding-tb-sm">
						<view>
							<text class="cuIcon-news text-block margin-right-xs"></text>{{item.title?item.title:'文章获取失败'}}</view>
						<view class="text-gray text-sm">
							{{item.votes}}赞同  · {{item.comments}}评论 · {{item.views}}围观 
						</view>
					</view>
					<view class="action">
						<button class="cu-btn sm"  @click="toArticleDetail" :data-id="item.id">查看</button>
					</view>
				</view>
			</view>

		</block>
		<block v-if="TabCur == 1">
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in listData" :key="index" @tap="toColumnDetail" :data-column_id="item.column_id" v-if="item">
					<view class="cu-avatar radius lg" :style="'background-image:url('+item.column_pic+');'" v-if="item.column_pic"></view>
					<view class="cu-avatar lg" v-if="!item.column_pic"><text class="cuIcon-pic"></text></view>
					<view class="content">
						<view><view class="text-cut">{{item.column_name}}</view>
							<view class="cu-tag round bg-blue sm">{{item.focus_count+'人关注'}}</view>
						</view>
						<view class="text-gray text-sm flex"> 
							<view class="text-cut">{{'文章数：'+item.article_count+' · 浏览数'+item.view_count+''}}</view>
						</view>
					</view> 
					<view class="action">
						<button class="cu-btn sm">查看</button>
					</view>
				</view>
			</view>			
		</block>		
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
				tabArr:['我的文章','我的专栏'],
				type:0,
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
			this.getList()
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
			categorySelect(e){
				var category_id = e.currentTarget.dataset.id;
				var name =  this.category[category_id]
				this.category_name = name
				// console.log('切换'+name);
				this.intGetList()
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
					util.errorToast('系统出错')
					return false;
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
				this.$api.getMyArticle(data).then(res => {
					console.log('getMyArticle',res)
					this.page = page
					this.isLoad = false
					var list = res.data.rsm.list
					if(list.length > 0){
						
						this.res_count = res.data.rsm.totals					
						this.listData = this.reload ? list : this.listData.concat(list);
						console.log('listData',this.listData)
						this.last_id = list[list.length - 1].id;
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
							this.res_count = 0
							util.errorToast('未找到相关内容')
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
			toArticleDetail:function(e){
				var id = e.currentTarget.dataset.id;
				if(id > 0){
					uni.navigateTo({
						url:'../article/detail?id='+id
					})
				}else{
					util.showToast('id有误')
				}
			},
			toColumnDetail:function(e){
				var column_id = e.currentTarget.dataset.column_id;
				if(column_id > 0){
					uni.navigateTo({
						url:'../column/detail?column_id='+column_id
					})
				}else{
					util.showToast('专栏id有误')
				}	
			},
			tabSelect(e){
				var TabCur = e.currentTarget.dataset.id;
				this.TabCur = TabCur
				this.type = TabCur
				console.log('切换到',this.tabArr[TabCur]);
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
