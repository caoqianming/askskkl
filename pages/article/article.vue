<template>
  <view>
		<scroll-view scroll-x class="bg-white nav text-center margin-bottom-sm">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
				{{item}}
			</view>
		</scroll-view>  
		<wcArticle :isCard="isCard" :listData="listData" v-if="listData.length > 0"></wcArticle>
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
				tabArr:['最新','最热'],
				sort_type:0,
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
			  title: '这些文章写得不错，推荐你看看'
			}			
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
				var data = {}
				data.sort_type = this.sort_type
				data.minId = this.last_id ? this.last_id : 0;
				if (this.last_id > 0 && this.isLastPage) { //说明已有数据，目前处于上拉加载
					uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page

				this.$api.getArticle(data).then(res => {
					console.log('getArticle',res)
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
				var article_id = e.currentTarget.dataset.article_id;
				if(article_id > 0){
					uni.navigateTo({
						url:'detail?article_id='+article_id
					})
				}else{
					util.showToast('文章id有误')
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

</style>
