<template>
  <view>
		<view class="cu-list menu-avatar">
			<view class="cu-item">
				<view class="cu-avatar radius lg" :style="'background-image:url('+column_info.column_pic+');'" v-if="column_info.column_pic"></view>
				<view class="cu-avatar lg" v-if="!column_info.column_pic">#</view>
				<view class="content">
					<view>
						<view class="text-cut">{{column_info.column_name?column_info.column_name:'读取中...'}}</view>
						<!-- <view class="cu-tag round bg-blue sm">{{column_info.focus_count+'人关注'}}</view> -->
					</view>
					<view class="text-gray text-sm flex"> 
						<view class="text-cut">{{column_info.article_num?column_info.article_num:0}}篇文章{{column_info.focus_count?column_info.focus_count:0}}人关注{{column_info.article_sum_count?column_info.article_sum_count:0}}总浏览</view>
					</view>
				</view> 
				<view class="action">
					<button class="cu-btn sm bg-blue" v-if="has_focus_column">已关注</button>
					<button class="cu-btn sm" v-else>关注</button>
				</view>
			</view>
		</view>	  
		<scroll-view scroll-x class="bg-white nav margin-bottom">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
					{{item}}
				</view>
			</view>
		</scroll-view>	
		<block v-if="TabCur == 0">
			<wcArticle :isCard="isCard" :listData="listData" v-if="listData.length > 0"></wcArticle>
			<view class="cu-load text-grey" :class="!isLoad?'loading':'over'" v-if="res_count != 0"></view>		
			<pageTips v-if="listData.length < 1">
				<block slot="button">
					<view class="padding text-center">
						<button class="cu-btn bg-blue" @click="toHome">
							<text class="cuIcon-home"></text> 返回首页
						</button>
					</view>
				</block>
			</pageTips>	
		</block>
		<block v-else>
			<view class="cu-bar bg-white margin-top solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>专栏介绍</text>
				</view>
			</view>
			<view class="padding bg-white">	
				<view>{{column_info.column_description}}</view>
			</view>
			<view class="cu-bar bg-white margin-top solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>专栏作者</text>
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view class="cu-avatar radius lg" :style="'background-image:url('+column_info.user_info.avatar_file+');'" v-if="column_info.user_info.avatar_file"></view>
					<view class="cu-avatar lg" v-if="!column_info.user_info.avatar_file"><text class="cuIcon-people"></text></view>
					<view class="content">
						<view>
							<view class="text-cut">{{column_info.user_info.user_name}}</view>
							<view class="cu-tag round bg-blue sm">{{column_info.user_info.fans_count}}人关注</view>
						</view>
						<view class="text-gray text-sm flex"> 
							<view class="text-cut">{{column_info.user_info.article_count+'篇文章 · '+column_info.user_info.answer_count+'次回答'+' · '+column_info.user_info.question_count+'个提问'}}</view>
						</view>
					</view> 
					<view class="action">
						<button class="cu-btn sm" @click="toPeople(column_info.user_info.uid)">查看</button>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white margin-top solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>Ta的热门文章</text>
				</view>
			</view>
			<view class="bg-white padding" v-if="hot_article_list.length < 1">
				<text class="text-center ">暂无文章</text>
			</view>
			<wcArticle :isCard="isCard" :listData="hot_article_list" v-if="hot_article_list.length > 0"></wcArticle>
			<view class="cu-load text-grey over"></view>	
		</block>			
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
				tabArr:['专栏文章','关于专栏'],
				TabCur:0,
				isCard:true,
				isBack:false,
				isLoad:true,
				listData:[],
				page:0,
				res_count:0,
				column_id:0,
				column_info:[],
				has_focus_column:false,
				hot_article_list:[],
			}
		},
		onLoad:function(e){
			console.log('column detail onLoad',e)
			var column_id = e.column_id
			// var column_id = 1
			this.column_id = column_id
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
		//分享到微信聊天
		onShareAppMessage: function(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			return {
			  title: '这个专栏写得不错，推荐你看看'
			}			
		},					
		methods: {
			toHome(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},	
			toPeople(uid){
				if(uid > 0){
					uni.navigateTo({
						url:'/pages/people/people?uid=' + uid
					})
				}		
			},	
			intGetList:function(){
				this.reload = true;
				this.last_id = 0
				this.page = 0
				this.isLastPage = false
				this.getList();				
			},
			getList:function(){
				var data = {}
				if(this.column_id< 1){
					util.showToast('话题信息有误')
					return false;	
				}

				data.column_id = this.column_id
				data.minId = this.last_id ? this.last_id : 0;
				if (this.last_id > 0 && this.isLastPage) { //说明已有数据，目前处于上拉加载
					uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page

				if(page == 1){
					var userInfo = this.userInfo
					
					data.access_token = userInfo.access_token?userInfo.access_token:''						
				}

				this.$api.getColumnDetail(data).then(res => {
					console.log('getColumnDetail',res)
					this.page = page
					this.isLoad = false
					
					if(page == 1){
						this.res_count = res.data.rsm.totals	
						this.column_info = res.data.rsm.column_info
						console.log('res.data.rsm.column_info',res.data.rsm.column_info)
						this.has_focus_column = res.data.rsm.has_focus_column
						this.hot_article_list = res.data.rsm.hot_article_list
					}
					var list = res.data.rsm.list						
					if(list.length > 0){
						this.listData = this.reload ? list : this.listData.concat(list);
						// console.log('listData',this.listData)
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
			toDetail:function(e){
				var column_id = e.currentTarget.dataset.column_id;
				if(column_id > 0){
					uni.navigateTo({
						url:'detail?column_id='+column_id
					})
				}else{
					util.showToast('话题id有误')
				}
			},	
			tabSelect(e){
				var TabCur = e.currentTarget.dataset.id;
				this.TabCur = TabCur
				console.log('切换到',this.tabArr[TabCur]);
			},				
		}
	}
</script>
<style>
.cu-card.no-card>.cu-item {
margin:0rpx 0rpx 20rpx 0rpx;
-webkit-border-radius:0rpx;
border-radius:0rpx;
}
</style>
