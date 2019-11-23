<template>
  <view>
		<view class="cu-list menu-avatar">
			<view class="cu-item">
				<view class="cu-avatar radius lg" :style="'background-image:url('+topic_info.topic_pic+');'" v-if="topic_info.topic_pic"></view>
				<view class="cu-avatar lg" v-if="!topic_info.topic_pic">#</view>
				<view class="content">
					<view><view class="text-cut">{{topic_info.topic_title}}</view>
						<!-- <view class="cu-tag round bg-blue sm">{{topic_info.focus_count+'人关注'}}</view> -->
					</view>
					<view class="text-gray text-sm flex"> 
						<view class="text-cut">{{topic_info.discuss_count+'个讨论 · '+topic_info.focus_count+'人关注'}}</view>
					</view>
				</view> 
				<view class="action">
					<button class="cu-btn sm" v-if="topic_info.has_focus == 0" @click="focus_topic">关注</button>
					<button class="cu-btn sm bg-blue" v-if="topic_info.has_focus == 1" @click="focus_topic">已关注</button>
				</view>
			</view>
		</view>	  
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
					{{item}}
				</view>
			</view>
		</scroll-view>	
		<block v-if="TabCur == 3">
			<view class="margin-top padding bg-white">
				{{topic_info.topic_description?topic_info.topic_description:'该话题未填写介绍内容'}}
			</view>
		</block>
		<block v-else>
			<wcCard :isCard="isCard" :listData="listData" v-if="listData.length > 0"></wcCard>
			<view class="cu-load text-grey" :class="!isLoad?'loading':'over'" v-if="listData.length > 0"></view>		
			<pageTips v-if="listData.length < 1">
				<block slot="button">
					<view class="padding text-center">
						<button class="cu-btn bg-blue" @click="intGetList">
							<text class="cuIcon-refresh"></text> 重载
						</button>
					</view>
				</block>
			</pageTips>	
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
				searchKeyword:'',
				tabArr:['全部','热门','推荐','话题详情'],
				isCard:true,
				isBack:false,
				isLoad:true,
				listData:[],
				page:0,
				res_count:0,
				TabCur:0,
				sort_type:0,
				topic_id:0,
				topic_info:[],
				best_answers_users:[],
			}
		},
		onLoad:function(e){
			console.log('topic detail onLoad',e)
			var topic_id = e.topic_id
			this.topic_id = topic_id
			this.getTopicDetail()
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
			  title: '这个话题有点意思，推荐你看看'
			}			
		},					
		methods: {
			focus_topic(){
				var userInfo = this.userInfo
				var data = {}

				
				data.access_token = userInfo.access_token?userInfo.access_token:''		
								
				data.topic_id = this.topic_id
				this.$api.focus_topic(data).then(res => {
					console.log('focus_topic',res)

					var type = res.data.rsm.type
					if(type){
						if(type == 'add'){
							this.topic_info.has_focus = 1
						}else{
							this.topic_info.has_focus = 0
						}
					}else{
						util.errorToast('话题不存在')
						return false;		
					}

					
				}).catch(err => {
					// uni.stopPullDownRefresh();
					console.log('请求出错了，可以在这里做失败处理',err);
				})	
			},
			getTopicDetail:function(){
				if(this.topic_id< 1){
					util.showToast('话题信息有误')
					return false;	
				}
				var userInfo = this.userInfo
				var data = {}

				data.access_token = userInfo.access_token?userInfo.access_token:''		
								
				data.topic_id = this.topic_id
	
				this.$api.getTopicDetail(data).then(res => {
					// uni.stopPullDownRefresh();
					console.log('getTopicDetail',res)

					var topic_info = res.data.rsm
					if(topic_info.topic_title !='' && topic_info.topic_title){
						this.topic_info = topic_info
						this.intGetList()
					}else{
						util.showToast('话题不存在')
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
				var data = {}
				if(this.topic_id< 1){
					util.showToast('话题信息有误')
					return false;	
				}
				data.sort_type = this.sort_type
				data.topic_id = this.topic_id
				// data.minId = this.last_id ? this.last_id : 0;
				if (this.isLastPage) { //说明已有数据，目前处于上拉加载
					uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page

				this.$api.getTopicList(data).then(res => {
					this.page = page
					this.isLoad = false
					var list = res.data.rsm.list
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
				var topic_id = e.currentTarget.dataset.topic_id;
				if(topic_id > 0){
					uni.navigateTo({
						url:'detail?topic_id='+topic_id
					})
				}else{
					util.showToast('话题id有误')
				}
			},	
			tabSelect(e){
				var TabCur = e.currentTarget.dataset.id;
				this.TabCur = TabCur
				this.sort_type = TabCur
				console.log('切换到',this.tabArr[TabCur]);
				this.intGetList()
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
