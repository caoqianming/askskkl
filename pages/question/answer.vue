<template>
<view>
		<block class="" v-if="!showCommentList">
			<view class="bg-white ">
				<view class="padding-top-xs " v-if="question_info">
					<view class="padding-lr">
						<view class="text-content text-xl text-black">
							{{question_info.question_content?question_info.question_content:'内容读取中...'}}
						</view>
					</view>	
					<view class="text-sm padding" @click="toQuestionDetail">查看全部{{question_info.answer_count}}个回答 > </view>	
				</view>			
			</view>
		</block>
		
		<block v-if="Answer.is_del == 0  && Answer.answer_id == answer_id">
			<view v-if="!showCommentList" class="margin-top bg-white">
				<view class="cu-list menu-avatar" >
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="'background-image:url('+Answer.user_info.avatar_file+');'" v-if="Answer.user_info.avatar_file && Answer.anonymous!='1'" @click="toPeople" :data-anonymous="Answer.anonymous" :data-uid="Answer.anonymous!='1'?Answer.uid:0"></view>
						<view class="cu-avatar round lg" v-else><text class="cuIcon-people"></text></view>	
						<view class="content" @click="toPeople" :data-anonymous="Answer.anonymous" :data-uid="Answer.anonymous!='1'?Answer.uid:0">
							<view class="text-df">{{Answer.anonymous!='1'?Answer.user_info.user_name:'匿名用户'}}</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									{{Answer.user_info.signature?Answer.user_info.signature:'这个人很懒，还没写自我介绍'}}
								</view>
							</view>
						</view>
						<view class="action" v-if="Answer.anonymous != '1'">
							<button class="cu-btn sm" @click="toPeople" :data-anonymous="Answer.anonymous" :data-uid="Answer.anonymous!='1'?Answer.uid:0">
								<!-- <text class="cuIcon-profile"></text> -->
								查看
							</button>
						</view>
					</view>
				</view>	
				<view class="padding">
					{{Answer.is_del == 1?'该内容已被删除':Answer.answer_content}}
				</view>
				<view class="flex justify-center">
					<view class="cu-capsule round">
						<view class='cu-tag' :class="Answer.agree_status==1?'bg-blue light':'light'" @click="answer_vote(1)">
							<text class='cuIcon-evaluate padding-right-xs'>赞同({{Answer.agree_count}})</text>
							<text class="solid-right padding-xs"></text>
						</view>
						<view class="cu-tag" :class="Answer.agree_status==-1?' bg-blue light':'light'" @click="answer_vote(-1)">
							<text class='cuIcon-bad padding-right-xs'>反对({{Answer.against_count}})</text>
						</view>
					</view>
				</view>					
				<view class="flex padding justify-between">
					<text class="text-sm text-gray">编辑于{{Answer.add_time}}</text>
					<text class="text-sm " :class="user_rated_thanks?'cuIcon-likefill text-blue light':'text-gray cuIcon-like'">{{user_rated_thanks?'已感谢':'感谢'}}({{Answer.thanks_count}})</text>
				</view>
				<!-- 广告位 -->
				<view class="margin-tb-sm padding-lr" v-if="system_config.adunitid && system_config.adunitid != ''">
					<ad :unit-id="system_config.adunitid"></ad>		
				</view>
			</view>
			<block v-if="!CommentInput">
			<!-- 评论区 -->
				<view class="padding margin-top bg-white solid-bottom">
					<text class="text-black text-bold">评论{{Answer.thanks_count>0?'('+Answer.thanks_count+')':''}}</text>
				</view>
				<view class="bg-white">
					<view class="flex padding-sm " v-for="(comment,index) in Comments" :key="index">
						<view class="radius" v-if="comment.uid > 0">
							<view class="cu-avatar round sm" :style="'background-image:url('+comment.avatar_file+');'"></view>
						</view>
						<view class="radius" v-else>
							<view class="cu-avatar round sm"><text class="cuIcon-people"></text></view>
						</view>
						<view class="padding-left-sm radius">
							<view class="flex justify-between">
								<text class="text-black">{{comment.user_name}}</text>
								<!-- <text class="cuIcon-appreciatefill text-red">2</text> -->
							</view>
							<view class="text-gray text-content text-df">
								{{comment.message}}
							</view>
						</view>
					</view>
					<view class="flex padding-sm text-gray" v-if="Answer.comment_count > 0 && !showCommentList">
						<view class="padding-left-xl"></view>
						<view class="padding-left-sm radius" @click="showComment">
							查看全部{{Answer.comment_count}}条评论 > 
						</view>
					</view>
					<view class="flex padding-sm">
						<view class="radius" v-if="userInfo.uid >0 && hasLogin">
							<view class="cu-avatar round sm" :style="'background-image:url('+userInfo.user_info.avatar_file+');'"></view>
						</view>
						<view class="radius" v-else>
							<view class="cu-avatar round sm"><text class="cuIcon-people"></text></view>
						</view>
						<!-- 评论框入口 -->
						<view class="radius commemt_input padding-left">
							<block v-if="system_config.system_verify != 'N'">
								<input class="solid round text-sm padding-left-sm" disabled="true" placeholder="小程序端暂不支持评论"></input>
							</block>
							<block v-else>
								<input class="solid round text-sm padding-left-sm" disabled="true" :placeholder="userInfo.uid > 0 && hasLogin?'点击这里写评论':'请先登录'" @click="showCommentInput"></input>					
							</block>
						</view>
					</view>
					<view class="padding-bottom"></view>
				</view>
			</block>
		</block>
		<block v-if="CommentInput && showCommentList">
			<block v-if="hasLogin && userInfo.uid > 0">
				<!-- 写评论 -->
				<view class="cu-bar bg-white margin-top">
					<view class="action">
						<text class="cuIcon-titles text-blue"></text>
						<text>评论</text>
					</view>
				</view>			
				<view class="solid-top">
					<form @submit="CommentFormSubmit" >
						<view class="cu-form-group">
							<textarea maxlength="-1" focus :disabled="modalName!=null" placeholder="在这里输入你的评论" :style="'height:'+textareaHeight+'px;'" name="message"></textarea>
						</view>	
						<view class="padding flex flex-direction">
							<button class="cu-btn bg-blue margin-tb-sm lg" formType="submit">提交评论</button>
							<button class="cu-btn bg-grey lg" @click="hideCommentInput">返回</button>
						</view>							
					</form>
				</view>
			</block>			
		</block>
		
		<view class="margin-top"></view>
		<view class='cu-tabbar-height'></view>
		<view class="cu-bar bg-white tabbar border shop foot">
			<view class="action" @click="toBack" v-if="!showCommentList">
				<view class="cuIcon-back text-black">
				</view>
				返回
			</view>
			<view class="action" @click="showComment" v-if="showCommentList">
				<view class="cuIcon-back text-black">
				</view>
				返回
			</view>			
			<view class="action" @click="toHome">
				<view class="cuIcon-home">
				</view>
				首页
			</view>
			<button class="bg-blue submit" open-type="share" style="border-radius:0px;">
				<text class=" cuIcon-share">分享给好友</text>
			</button>
		</view>			
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
				sort:'DESC',
				sort_key:'add_time',
				CommentInput:false,
				page:0,
				InputBottom:0,
				isCard:true,
				listData:[],
				Comments:[],
				Answer:[],
				question_info:[],
				answer_id:0,
				question_id:0,
				isLoad:false,
                reload: false,
				isLastPage:false,
				commentDisabled:false,
				textareaHeight:100,
				showCommentList:false,
				answer_idx:-1
			}
		},
		onLoad:function(e){
			var answer_id = e.answer_id
			var question_id = e.question_id
			if(answer_id){
				this.answer_id = answer_id
			}
			if(question_id){
				this.question_id = question_id
			}	

			if(e.idx){
				this.answer_idx = e.idx
			}

			this.getQuestionAnswer()
		},
		onShareAppMessage: function(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			var title = this.question_info.question_content?this.question_info.question_content:'这个问题终于有回答了！'
			return {
			  title: title
			}			
		},			
		//下拉刷新
        onPullDownRefresh:function() {
			this.intGetList();
        },
		//上拉加载
        onReachBottom:function() {
			//因为问题评论不会有很多，所以暂时不做分页查询，所以这里也用不到上拉加载
			// if(this.showCommentList){
			// 	this.getAnswerComments();
			// }
        },			
		methods: {
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
			//赞同 or 反对 回答
			answer_vote:function(agree_status){
				var userInfo = this.userInfo
				
				if(!userInfo.uid || userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
					return false
				}				
				if(agree_status == this.Answer.agree_status){
					util.errorToast('你已经投票过了')
					return false;
				}
				var data = {}
				
				data.access_token = userInfo.access_token?userInfo.access_token:''
				data.answer_id = this.answer_id
				data.agree_status = agree_status
				this.$api.answer_vote(data).then(res => {
					
					if(agree_status == 1){
						this.Answer.agree_count = this.Answer.agree_count + 1
						if(this.Answer.agree_status==-1){
							this.Answer.against_count = this.Answer.against_count - 1
							this.refreshAnswerList(this.answer_idx,'agree')
						}
						
					}else{
						this.Answer.against_count = this.Answer.against_count + 1
						if(this.Answer.agree_status==1){
							this.Answer.agree_count = this.Answer.agree_count - 1
							this.refreshAnswerList(this.answer_idx,'against')
						}
					}
					this.Answer.agree_status = agree_status
					
				}).catch(err => {
					console.log('赞同 or 反对 回答失败',err);
				})					
			},
			refreshAnswerList(idx,type){
				if(idx > -1){
					var pages = getCurrentPages()
					if(pages.length > 1){
						var prevPage = pages[pages.length - 2]
						var listData = prevPage.data.listData
						console.log('listData',listData);
						if(listData.length > 0){
							if(type == 'agree'){
								listData[idx].agree_count = listData[idx].agree_count + 1
							}else if(type == 'against'){
								listData[idx].agree_count = listData[idx].agree_count - 1
							}else if(type == 'comment'){
								listData[idx].comment_count = listData[idx].comment_count + 1
							}
							prevPage.setData({
								listData:listData
							})
						}
					}
				}
			},			
			//提交回答
			CommentFormSubmit:function(e){
				
				var system_config = this.system_config
				if(!system_config || system_config.system_verify == 'Y'){
					util.errorToast('小程序端暂不支持回复功能')
					return false;
				}
				console.log('CommentFormSubmit',e)
				
				var message = e.detail.value.message
				
				if(!message || message == ''){
					util.errorToast('回答内容不能为空')
					return false
				}
				var userInfo = this.userInfo
				
				if(!userInfo.uid || userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
					return false
				}				
				
				var data = {}
				
				data.access_token = userInfo.access_token
				
				data.answer_id = this.answer_id
				data.message = message
				
				this.$api.post_answer_comment(data).then(res => {
					var answer_id = res.data.rsm.item_id
					if(answer_id > 0){
						this.refreshAnswerList(this.answer_idx,'comment')
						this.toAnswerDetail(answer_id)
					}else{
						util.errorToast('系统异常，请返回')
						
					}
				}).catch(err => {
					console.log('提交回答失败',err);
				})	
			},
			toAnswerDetail(answer_id){
				console.log('toAnswerDetail',answer_id)
				if(answer_id > 0){
					
					uni.redirectTo({
						url:'../question/answer?question_id='+this.question_id+'&answer_id=' + answer_id
					})
				}else{
					util.showToast('回答ID有误')
				}				
			},							
			hideCommentInput(e) {
				uni.setNavigationBarTitle({
					title:'查看评论'
				})
				this.CommentInput = false
				this.showComment()
			},				
			showCommentInput(){
				var system_config = this.system_config
				if(!system_config || system_config.system_verify == 'Y'){
					util.errorToast('小程序端暂不支持回复功能')
					return false;
				}				
				
				var userInfo = this.userInfo
				if(userInfo.uid > 0 && this.hasLogin){
					
					if(!this.showCommentList){
						this.showComment()
					}
					
					this.CommentInput = true
					uni.setNavigationBarTitle({
						title:'写评论'
					})
					
				}else{
					uni.navigateTo({
						url:'../account/login'
					})
				}
			},			
			showComment(){
				var showCommentList = this.showCommentList
				var NavigationBarTitle = ''
				 if(showCommentList){
					 this.showCommentList = false
					 NavigationBarTitle = '回答详情'
				 }else{
					 this.Comments = this.listData
					 this.showCommentList = true
					 NavigationBarTitle = '查看评论'
				 }
				if(NavigationBarTitle != ''){
					 uni.setNavigationBarTitle({
						title:NavigationBarTitle
					 })
				}
				 
			},
			toQuestionDetail(){
				var question_id = this.question_id
				if(question_id > 0){
					uni.navigateTo({
						url:'detail?id=' + question_id
					})
				}else{
					util.errorToast('问题ID有误')
				}
			},
			toHome(){
				uni.switchTab({
					url:'../index/index'
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
			intGetList:function(){
				this.reload = true;
				this.last_id = 0
				this.page = 0
				this.isLastPage = false
				this.getAnswerComments();				
			},				
			//获取回答列表
			getQuestionAnswer:function(){
				var question_id = this.question_id
				var answer_id = this.answer_id
				
				if(question_id < 1 || answer_id < 1){
					console.log('answer_id',answer_id,'question_id',question_id)
					util.errorToast('获取问答信息失败')
					return false;
				}
					var data = {}
					var userInfo = this.userInfo
					
					var page = this.page + 1
					data.page = page
					data.question_id = question_id
					data.answer_id = answer_id
					data.single = true
					
					
					data.access_token = userInfo.access_token?userInfo.access_token:''
					
					data.sort_key = this.sort_key

					this.$api.getQuestionAnswer(data).then(res => {
						this.isLoad = false
						this.page = page
						var list = res.data.rsm.list
						console.log('list',list)
						if(list.length > 0){
							this.question_info = res.data.rsm.question_info
							// this.answer_list = this.reload ? list : this.answer_list.concat(list);
							this.Answer = list[0]
							
							this.getAnswerComments()
						}else{
							util.showToast('问答详情获取失败....')
							this.isLoad = true
							this.isLastPage = true					
						}

					}).catch(err => {
						console.log('请求失败，可以在这里写处理代码',err);
					})						

			},	
			//获取评论列表
			getAnswerComments:function(){
				var question_id = this.question_id
				var answer_id = this.answer_id
				
				if(question_id < 1 || answer_id < 1){
					util.errorToast('获取问答信息失败')
					return false;
				}				
					var data = {}
					var userInfo = this.userInfo
					
					var page = this.page + 1
					data.page = page
					data.answer_id = answer_id
					data.sort_key = this.sort_key
					if (this.isLastPage) { //说明已有数据，目前处于上拉加载
						uni.stopPullDownRefresh();
						
						this.isLoad = true
						util.showToast('没有更多回答了....')
						return false;
					}
					this.$api.getAnswerComments(data).then(res => {
						this.isLoad = false
						this.page = page
						var list = res.data.rsm.list

						if(list.length > 0){
							this.listData = this.reload ? list : this.listData.concat(list);
							
							if(this.showCommentList || this.listData.length < 2){
								this.Comments = this.listData
							}else{
								var listData = this.listData
								var Comments = []
								var i = 0
								for (i = 0; i < 2; i++) { 
									Comments[i]  = listData[i]
								 }
								this.Comments = Comments
								console.log('Comments',Comments)
							}
							
							this.reload = false;
							if(list.length < 10){
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
			},
		}		
	}			
</script>

<style>
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
	.commemt_input{
		width: 100%;
	}
	.commemt_input input{
		height: 1.3rem;
		width: 100%;
	}		
</style>
