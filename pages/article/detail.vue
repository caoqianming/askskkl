<template>
	<view>
		<block v-if="CommentInput && userInfo.uid > 0">
			<view class="padding bg-white ">
				评论文章《<text class="text-blue" @click="hideCommentInput">{{article_info.title}}</text>》
			</view>			
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>评论内容</text>
				</view>
			</view>			
			<view class="solid-top">
				<form @submit="formSubmit" >
					<view class="cu-form-group">
						<textarea maxlength="-1" :disabled="!CommentInput" placeholder="在这里输入你的内容" :style="'height:'+textareaHeight+'px;'" name="comment"></textarea>
					</view>	
					<view class="padding flex flex-direction">
						<button class="cu-btn bg-blue margin-tb-sm lg" formType="submit">提交评论</button>
						<button class="cu-btn bg-grey lg" @click="hideCommentInput">返回</button>
					</view>							
				</form>
			</view>			
		</block>
		<block v-else>
			<view class="bg-white " v-if="article_info.is_del == '0'">
				<view class="padding">
					<view>
						<text v-if="article_info.is_recommend == 1" class="cu-tag sm round line-blue">荐</text>
						<text class="text-xl text-black">{{article_info.title}}</text>
					</view>
					<view class="padding-top-sm">
						<text class="text-blue" @click="toPeople" :data-uid="article_info.user_info.uid">{{article_info.user_info.user_name}}</text>
						<text class="padding-left-sm">{{article_info.add_time?article_info.add_time+' 发布':''}}</text>
					</view>

					<!-- 正文 -->
					<view class="padding-top">
						<uParse :content="article_info.message?article_info.message:'内容加载中...'" @preview="preview" @navigate="navigate" />
					</view>
					
					<!-- 文章投票 (表态) -->
					<view class="flex padding justify-center">
						<button class="margin-right cu-btn round" :class="article_info.vote_info.rating == 1?'lines-blue':'line-gray'">
							<text class="cuIcon-evaluate " :class="article_info.vote_info.rating == 1?'text-blue':'text-black'" @click="article_vote" data-type='article' :data-id="article_info.id" data-rating="1">赞一下{{article_info.votes>0?'('+article_info.votes+')':''}}</text>
						</button>
						<button class="cu-btn round" :class="article_info.vote_info.rating == -1?'lines-blue':'line-gray'">
							<text class="cuIcon-bad"  :class="article_info.vote_info.rating == -1?'text-blue':'text-black'" @click="article_vote" data-type='article' :data-id="article_info.id" data-rating="-1">不喜欢</text>
						</button>
					</view>			
					
					<!-- 话题 -->

					<view class="padding-top-xs" v-if="article_topics">
						<scroll-view scroll-x class=" nav" scroll-with-animation :scroll-left="scrollLeft">
							<block v-for="(topic,index) in article_topics" :key="index">
								<text class='cu-tag text-blue line-blue' @click="toTopicDetail" :data-topic_id="topic.topic_id">{{topic.topic_title}}</text>
							</block>
						</scroll-view>				
					</view>	
													
					<view class="flex padding-top-sm justify-between text-gray text-sm ">
						<view class="radius">
							<text class="cuIcon-comment padding-right-xs"></text> {{article_info.comments}}												
						</view>
						<view class="radius">
							<text class="cuIcon-attentionfill padding-right-xs"></text> {{article_info.views}}	
						</view>
					</view>									
				</view>
			</view>
			<view v-else>
				<pageTips tipsText='文章不存在' iconClass='cuIcon-news text-gray'></pageTips>
			</view>
			<!-- 广告位 -->
			<view class="margin-tb-sm" v-if="system_config.adunitid && system_config.adunitid != ''">
				<ad :unit-id="system_config.adunitid"></ad>		
			</view>			
			<!-- 评论区 -->
			<block v-if="article_info.is_del == '0'">
				<view class="cu-bar bg-white margin-top solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-blue"></text>
						<text>最新评论</text>
					</view>
				</view>	
				<view class="cu-list menu-avatar comment">
					<view class="cu-item solid-bottom" v-for="(comment,index) in comments" :key="index" v-if="item.is_del != 1">
						<view class="cu-avatar round" :style="'background-image:url('+comment.user_info.avatar_file+');'" v-if="comment.user_info.avatar_file" @click="toPeople" :data-uid="comment.user_info.uid"></view>
						<view class="cu-avatar round" v-if="!comment.user_info.avatar_file" @click="toPeople" :data-uid="comment.user_info.uid"><text class="cuIcon-people"></text></view>							
						<view class="content">
							<view class="text-df" @click="toPeople" :data-uid="comment.user_info.uid">
							{{comment.user_info.user_name}}
							</view>
							<view class="text-content text-df">
								<block v-if="comment.at_user_info && comment.at_uid > 0">
									<text>回复 </text>
									<text class="text-blue" @click="toPeople" :data-uid="comment.at_uid">@{{comment.at_user_info.user_name}}</text>
									<text> : </text>
								</block>
								{{comment.message}}
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">{{comment.add_time}}</view>
								<view>
									<text class="margin-left-sm" :class="comment.vote_info.rating == 1?'cuIcon-appreciatefill text-blue':'cuIcon-appreciate text-gray'" @click="article_vote" data-type='comment' :data-id="comment.id" :data-rating="comment.vote_info.rating == 1?0:1" :data-comment_idx='index'>{{comment.votes > 0?'('+comment.votes+')':''}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-load text-grey" :class="!isLoad?'loading':'over'" v-if="footerTips == '' && comments.length > 0"></view>
				<pageTips v-if="comments.length < 1" tipsText='暂无评论' iconClass='cuIcon-comment text-gray'>
					<block slot="button">
						<view class="padding text-center">
							<button class="cu-btn bg-blue" @click="intGetList">
								<text class="cuIcon-refresh"></text> 重载
							</button>
						</view>
					</block>
				</pageTips>	
			</block>
			
			<view class='cu-tabbar-height'></view>
			<view class="cu-bar foot input">
				<view class="action" @click="toBack">
					<text class="cuIcon-back text-gray"></text>
				</view>
				<input class="solid round text-sm padding-left-sm" disabled="true" :placeholder="system_config.system_verify == 'N'?'点击这里,开始回答':'小程序端暂不支持回复'" @click="showCommentInput"></input>
				<view class="action">
					<text class="cuIcon-flasebuyfill text-gray"></text>
				</view>

				<view class="action" @click="toHome">
					<text class="cuIcon-home text-gray"></text>
				</view>							
				<view class="action">
					<view class="share">
						<button open-type="share">
							<text class="cuIcon-share text-gray"></text>
						</button>
					</view>				
				</view>
			</view>				
		</block>
	</view>
</template>

<script>
	import { mapState } from 'vuex'; 	
	import util from '@/utils/util.js';
	export default {
		computed: {  
			...mapState(['userInfo','hasLogin','system_config'])  
		},			
		data() {
			return {
				InputBottom:0,
				isCard:true,
				article_info:[],
				comments:[],
				article_topics:[],
				footerTips:'',
				last_id: '',
				isLoad:false,
                reload: false,
				isLastPage:false,
				commentDisabled:false,
				article_id:0,
				post_hash:'',
				CommentInput:false
			}
		},
		onLoad:function(e){
			var userInfo = this.userInfo
			var hasLogin = this.hasLogin

			var article_id = e.id

			this.article_id = article_id
			this.getArticleDetail()				
		},
		//下拉刷新
        onPullDownRefresh:function() {
            this.reload = true;
			this.last_id = 0
			this.isLastPage = false
            // this.getArticleComments();
        },
		//上拉加载
        onReachBottom:function() {
            // this.getArticleComments();
        },		
		onShareAppMessage: function(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
		},					
		methods: {
			preview(src, e) {
			  // do something
			},
			navigate(href, e) {
			  // do something
			},
			showCommentInput(e){
				var system_config = this.system_config
				if(!system_config || system_config.system_verify == 'Y'){
					util.errorToast('小程序端暂不支持评论功能')
					return false;
				}	
				
				var userInfo = this.userInfo
				if(userInfo.uid > 0 && this.hasLogin){
					this.CommentInput = true
					uni.setNavigationBarTitle({
						title:'评论文章'
					})					
				}else{
					uni.navigateTo({
						url:'../account/login'
					})
				}								
								
			},
			hideCommentInput(e) {
				uni.setNavigationBarTitle({
					title:this.article_info.title
				})
				this.CommentInput = false

			},			
			//提交评论
			formSubmit:function(e){
				var system_config = this.system_config
				if(!system_config || system_config.system_verify == 'Y'){
					util.errorToast('小程序端暂不支持评论功能')
					return false;
				}
								
				var userInfo = this.userInfo
				if(!this.hasLogin || userInfo.uid < 1){
					util.errorToast('请先登录')
					uni.navigateTo({
						url:'../account/login'
					})
					return false;	
				}				
				console.log('formSubmit',e)
				var comment = e.detail.value.comment
				if(!comment || comment == ''){
					util.errorToast('内容不能为空')
					return false;
				}

				if(util.strlen(comment) < 10){
					util.errorToast('内容不能少于10个字')
					return false;
				}						

				var data = {}
				// if(!this.post_hash){
				// 	util.errorToast('操作异常，请刷新页面重试')
				// 	return false;					
				// }				
				// data.post_hash = this.post_hash				
				data.article_id = this.article_id
				data.message = comment
								
				
				data.access_token = userInfo.access_token

				this.$api.post_article_comment(data).then(res => {
					var comment_id = res.data.rsm.comment_info.id
					if(comment_id > 0){
						
						uni.reLaunch({
							url:'/pages/article/detail?id='+this.article_id
						})
						
					}else{
						util.errorToast('系统异常，请返回')
						
					}
				}).catch(err => {
					console.log('提交评论失败',err);
				})	
			},			
			toPeople(e){
				console.log('toPeople',e)
				var uid = e.currentTarget.dataset.uid;
				if(uid > 0){
					uni.navigateTo({
						url:'../people/people?uid=' + uid
					})
				}else{
					var anonymous = e.currentTarget.dataset.anonymous
					if(anonymous != 1){
						util.showToast('会员ID有误')
					}
				}		
			},			
			//文章投票
			article_vote:function(e){
				
				var item_id = e.currentTarget.dataset.id;
				var type =  e.currentTarget.dataset.type;
				var rating =  e.currentTarget.dataset.rating;
				
				var comment_idx =  e.currentTarget.dataset.comment_idx;
				console.log('rating',e)
				if(!type){
					type = 'article'
				}
				if(item_id < 1){
					util.errorToast('ID有误')
				}
								
				var userInfo = this.userInfo
				
				if(!userInfo.uid || userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
					return false
				}	
					
				if(this.article_info.vote_info && type == 'article'){
					if(rating == this.article_info.vote_info.rating){
						util.errorToast('你已经投票过了')
						return false;
					}
				}

				var data = {}
				
				data.access_token = userInfo.access_token?userInfo.access_token:''
				
				data.item_id = item_id
				data.rating = rating
				data.type = type
				console.log('article_vote',data)
				this.$api.article_vote(data).then(res => {
					
					if(type == 'article'){
						if(!this.article_info.vote_info){
							this.article_info.vote_info = {}
						}
						this.article_info.vote_info.rating = rating
						console.warn('rating',rating)
						
						if(rating == 1){
							this.article_info.votes = this.article_info.votes + 1
						}else{
							this.article_info.votes = this.article_info.votes - 1
						}
						
					}else{
						
						if(comment_idx){
							if(!this.comments[comment_idx].vote_info){
								this.comments[comment_idx].vote_info = {}
							}
							this.comments[comment_idx].vote_info.rating = rating
							if(rating == 1){
								this.comments[comment_idx].votes = this.comments[comment_idx].votes + 1
							}else{
								if(this.comments[comment_idx].votes > 0){
									this.comments[comment_idx].votes = this.comments[comment_idx].votes - 1
								}
							}							
						}
						
					}


				}).catch(err => {
					console.log('文章投票失败',err);
				})					
			},							
			toTopicDetail(e){
				console.log('toTopicDetail',e)
				var topic_id = e.currentTarget.dataset.topic_id;
				if(topic_id > 0){
					uni.navigateTo({
						url:'../topic/detail?topic_id=' + topic_id
					})
				}else{
					util.showToast('话题ID有误')
				}				
			},
			toLogin(){
				uni.navigateTo({
					url: '/pages/account/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toHome(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			toBack(){
				var pages = getCurrentPages();
				if(pages.length > 1){
					uni.navigateBack({
						delta: 1
					});					
				}else{
					this.toHome()
				}
			},			
			InputBlur(e) {
				this.InputBottom = 0
			},					
			//获取详情
			getArticleDetail:function(){
				var id = this.article_id
				if(id > 0){
					this.article_id = id
					var userInfo = this.userInfo
					var data = []
					data.id = id
					
					data.access_token = userInfo.access_token?userInfo.access_token:''
					this.$api.getArticleDetail(data).then(res => {
						console.log('getArticleDetail',res)
						var article_info = res.data.rsm.article_info
						// var comments = res.data.rsm.comments
						var article_topics = res.data.rsm.article_topics
						
						if(article_info){
							if(article_info.is_del == 1){
								util.errorToast('文章已被删除')
								setTimeout(() => {
									uni.navigateBack({
										delta:1
									})
								}, 1200)								
							}else{
								this.article_info = article_info
								this.article_topics = article_topics
								// this.post_hash = res.data.rsm.post_hash
								if(res.data.rsm.totals > 0){
									this.getArticleComments()
								}else{
									//没有评论
									this.isLastPage = true
								}
								
								if(article_info.title != ''){
									uni.setNavigationBarTitle({
										title:article_info.title
									})
								}
							}

							
						}else{
							util.errorToast('内容不存在')
						}
						
					}).catch(err => {
						console.log('请求失败，可以在这里写处理代码',err);
					})				
				}else{
					util.errorToast('ID有误')
				}				
			},
			intGetList:function(){
				this.reload = true;
				this.last_id = 0
				this.page = 0
				this.isLastPage = false
				this.getArticleComments();				
			},			
			//获取评论列表
			getArticleComments:function(){
				var article_id = this.article_id
				if(article_id > 0){
					var data = {}
					var userInfo = this.userInfo
					
					
					data.access_token = userInfo.access_token?userInfo.access_token:''

					data.article_id = article_id
					data.minId = this.last_id ? this.last_id : 0;
					if (this.isLastPage) { //说明已有数据，目前处于上拉加载
						uni.stopPullDownRefresh();
						this.isLoad = true
						util.showToast('没有更多评论了....')
						return false;
					}
					this.$api.getArticleComments(data).then(res => {
						console.log('getArticleComments',res)
						this.isLoad = false
						var list = res.data.rsm.list
						if(list.length > 0){
							this.comments = this.reload ? list : this.comments.concat(list);
							this.last_id = list[list.length - 1].id;
							this.reload = false;
							if(list.length < 20){
								this.isLoad = true								
								this.isLastPage = true
							}
						}else{
							this.isLoad = true
							this.isLastPage = true					
						}
						if(list.length < 1){
							this.footerTips = '暂无评论'
						}
						
					}).catch(err => {
						console.log('请求失败，可以在这里写处理代码',err);
					})						
				}else{
					util.errorToast('动态ID错误')
				}
			
			},
		}
	}
</script>

<style>
	@import "../../components/gaoyia-parse/parse.css";
	.share button {
	  font-size:18px;
	  background-color: #fff;
	  border: none;
	  padding: 0;
	  margin: 0;
	  line-height:2.5;
	}

	.share input {
	  outline: none;
	  border: none;
	  list-style: none;
	}

	.share button::after {
	  border: none;
	}	
	.commentInput{
		width: 100%;
		text-align:left;
	}	
</style>
