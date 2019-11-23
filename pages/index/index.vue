<template>
  <view>
		<scroll-view scroll-x class="bg-white nav text-center">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		<view class="bg-white padding-sm margin-top-sm" v-if="category_list">
			<scroll-view scroll-x class=" nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="padding-xs">
					<block v-for="(item,index) in category_list" :key="index">
						<text class='cu-tag round ' :class="item.id == category_id?'bg-blue':''" @click="categorySelect" :data-id="item.id">{{item.title}}</text>
					</block>
				</view>
			</scroll-view>			
		</view>
		<wcCard :isCard="isCard" :listData="listData" v-if="listData.length > 0"></wcCard>
		<publish v-if="system_config && system_config.system_verify != 'Y'  && hasLogin && userInfo.uid" bgClass="bg-blue"></publish>
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
	import publish from "@/components/xmz/xmz-publishbotton.vue"	
	export default {
		components:{
			publish
		},		
		computed: {  
			...mapState(['userInfo','hasLogin','system_config'])  
		},
		data() {
			return {
				searchKeyword:'',
				tabArr:['推荐','最新','最热'],
				category_list:[],
				category_id:0,
				isCard:true,
				isBack:false,
				isLoad:true,
				listData:[],
				page:0,
				res_count:0,
				TabCur:1,
				sort_type:1
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
			  title: '这个小程序有点意思，推荐你看看'
			}			
		},					
		methods: {
			exitSearch(){
				this.searchKeyword = ''
			},			
			searchInput:function(){
				var searchKeyword = this.searchKeyword?this.searchKeyword:''
				if(searchKeyword){
					uni.navigateBack({
						delta:1
					})
				}else{
					uni.navigateTo({
						url:'../search/index?searchKeyword='+searchKeyword
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
				data.sort_type = this.sort_type
				data.category_id = this.category_id
				data.minId = this.last_id ? this.last_id : 0;
				if (this.last_id > 0 && this.isLastPage) { //说明已有数据，目前处于上拉加载
					// uni.stopPullDownRefresh();
					this.isLoad = true
					util.showToast('没有更多内容了....')
					return false;
				}
				var page = this.page + 1
				data.page = page

				this.$api.getHome(data).then(res => {
					// uni.stopPullDownRefresh();
					this.page = page
					this.isLoad = false
					
					if(page  == 1){
						this.res_count = res.data.rsm.totals	
						this.category_list = res.data.rsm.category_list	
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
			toQuestionDetails:function(e){
				var id = e.currentTarget.dataset.id;
				if(id > 0){
					uni.navigateTo({
						url:'../question/detail?id=' + id
					})
				}else{
					util.showToast('id有误')
				}
			},	
			toArticleDetails:function(e){
				var id = e.currentTarget.dataset.id;
				if(id > 0){
					uni.navigateTo({
						url:'../article/detail?id=' + id
					})
				}else{
					util.showToast('有误')
				}
			},			
			tabSelect(e){
				var TabCur = e.currentTarget.dataset.id;
				this.TabCur = TabCur
				this.sort_type = TabCur
				console.log('切换到',this.tabArr[TabCur]);
				this.intGetList()
			},	
			categorySelect(e){
				var id = e.currentTarget.dataset.id;
				this.category_id = id
				console.log('切换到',this.category_list[id]);
				this.intGetList()
			}	
		}
	}
</script>
<style>

</style>
