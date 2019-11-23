<template>
  <view>
		<scroll-view scroll-x class="bg-white nav text-center margin-bottom-sm">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect(index)" :data-id="index">
				{{item}}
			</view>
		</scroll-view>  
		<block v-if="TabCur == 0">
			
			<view class="cu-list menu">
				<view class="cu-item" v-for="(item,index) in listData" :key="index"  @click="toQuestionDetail" :data-id="item.question_id">
					<view class="content padding-tb-sm">
						<view>
							<text class="cuIcon-question text-block margin-right-xs"></text>{{item.question_content?item.question_content:'问题获取失败'}}</view>
						<view class="text-gray text-sm">
							{{item.answer_count}}回答 · {{item.view_count}}围观 
						</view>
					</view>
					<view class="action">
						<button class="cu-btn sm"  @click="toQuestionDetail" :data-id="item.question_id">查看</button>
					</view>
				</view>
			</view>

		</block>
		<block v-if="TabCur == 1">
			<view class="cu-list menu">
				<view class="cu-item" v-for="(item,index) in listData" :key="index"  @click="toQuestionDetail" :data-id="item.associate_id">
					<view class="content padding-tb-sm">
						<view>
							<text class="cuIcon-comment text-block margin-right-xs"></text>{{item.associate_content?item.associate_content:'问题获取失败'}}
						</view>
						<view class="padding-tb-sm" @click="toQuestionDetail" :data-id="item.associate_id">
							<view class="bg-grey light" style="height: 80upx;">
								<view class="padding-sm margin-xs text-sm">
									<text class="cuIcon-link">{{item.title}}</text>
								</view>
							</view>
						</view>	
					</view>
					<view class="action">
						
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
				tabArr:['我的问题','我的回答'],
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
				
				this.$api.getMyQuestion(data).then(res => {
					console.log('getMyQuestion',res)
					this.page = page
					this.isLoad = false
					var list = res.data.rsm.list
					if(list.length > 0){
						
						this.res_count = res.data.rsm.totals					
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
			toQuestionDetail:function(e){
				var id = e.currentTarget.dataset.id;
				if(id > 0){
					uni.navigateTo({
						url:'../question/detail?id='+id
					})
				}else{
					util.showToast('id有误')
				}
			},	
			tabSelect(TabCur){
				// var TabCur = e.currentTarget.dataset.id;
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
