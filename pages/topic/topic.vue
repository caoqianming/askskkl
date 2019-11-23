<template>
  <view>
		<scroll-view scroll-x class="bg-white nav text-center margin-bottom-sm">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
				{{item}}
			</view>
		</scroll-view>	  
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in listData" :key="index" @tap="toDetail" :data-topic_id="item.topic_id">
					<view class="cu-avatar radius lg" :style="'background-image:url('+item.topic_pic+');'" v-if="item.topic_pic"></view>
					<view class="cu-avatar lg" v-if="!item.topic_pic">#</view>
					<view class="content">
						<view><view class="text-cut">{{item.topic_title}}</view>
							<view class="cu-tag round bg-blue sm">{{item.focus_count+'人关注'}}</view>
						</view>
						<view class="text-gray text-sm flex"> 
							<view class="text-cut" v-if="TabCur == 0">{{item.topic_description?item.topic_description:'7天内新增'+item.discuss_count_last_week+'个讨论，30天内新增'+item.discuss_count_last_month+'个讨论'}}</view>
							<view class="text-cut" v-if="TabCur == 1">{{'共有'+item.discuss_count+'个讨论，其中7天内新增'+item.discuss_count_last_week+'个讨论'}}</view>
							<view class="text-cut" v-if="TabCur == 2">{{'共有'+item.discuss_count+'个讨论，其中30天内新增'+item.discuss_count_last_month+'个讨论'}}</view>
						</view>
					</view> 
					<view class="action">
						<button class="cu-btn sm">查看</button>
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
				searchKeyword:'',
				tabArr:['全部','本周热门','本月热门'],
				isCard:true,
				isBack:false,
				isLoad:true,
				listData:[],
				page:0,
				res_count:0,
				TabCur:0,
				topic_day:0
			}
		},
		onLoad:function(e){
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
		//分享到微信聊天
		onShareAppMessage: function(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			return {
			  title: '这些话题太有意思了，推荐你看看'
			}			
		},				
		methods: {
			intGetList:function(){
				this.reload = true;
				this.last_id = 0
				this.page = 0
				this.isLastPage = false
				this.getList();				
			},
			getList:function(){
				var data = {}
				data.topic_day = this.topic_day
				data.minId = this.last_id ? this.last_id : 0;
				if (this.last_id > 0 && this.isLastPage) { //说明已有数据，目前处于上拉加载
					uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page

				this.$api.getTopic(data).then(res => {
					// uni.stopPullDownRefresh();
					console.log('getTopic',res)
					this.page = page
					this.isLoad = false
					var list = res.data.rsm.list
					if(list.length > 0){
						
						if(page  == 1){
							this.res_count = res.data.rsm.totals					
						}
						
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
				this.topic_day = TabCur
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
