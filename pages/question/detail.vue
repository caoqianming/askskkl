<template>
	<view>
		<block v-if="CommentInput">
			<block v-if="hasLogin && userInfo.uid > 0">
				<!-- 评论区 -->
				<view class="cu-bar bg-white margin-top">
					<view class="action">
						<text class="cuIcon-titles text-blue"></text>
						<text>回复</text>
					</view>
				</view>			
				<view class="solid-top">
					<form @submit="AnswerFormSubmit" >
						<view class="cu-form-group">
							<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaAInput" placeholder="在这里输入你的回答内容" :style="'height:'+textareaHeight+'px;'" name="answer_content"></textarea>
						</view>	
						<view class="cu-form-group margin-top">
							<view class="title">匿名回复</view>
							<switch class='blue' @change="AnonymousChange" :class="post_anonymous?'checked':''" :checked="post_anonymous?true:false"></switch>
						</view>
						<view class="padding flex flex-direction">
							<button class="cu-btn bg-blue margin-tb-sm lg" formType="submit">提交回答</button>
							<button class="cu-btn bg-grey lg" @click="hideCommentInput">返回</button>
						</view>							
					</form>
				</view>
			</block>
			<block v-else>
				<pageTips tipsText="请先登录" iconClass="cuIcon-lock"></pageTips>
			</block>
		</block>
		<block v-else>
			<!-- 问题区 -->
			<view v-if="rf != '' && redirect_message">
				<view class="padding" v-if="redirect_message.title != ''">
					<navigator hover-class="none" :url="redirect_message.path" v-if="redirect_message.path !=''">
						<text>{{rf == 'false'?'此问题已重定向到：':'从问题'}}</text>
						<text class="text-blue padding-lr-xs">{{redirect_message.title}}</text>
						<text>{{rf == 'false'?'':'跳转而来'}}</text>
					</navigator>
					<text v-if="redirect_message.path == ''">{{redirect_message.title}}</text>
				</view>
			</view>
			<view class="bg-white ">
				<view class="padding-lr padding-top-xs" v-if="question_topics">
					<scroll-view scroll-x class=" nav" scroll-with-animation :scroll-left="scrollLeft">
						<block v-for="(item,index) in question_topics" :key="index">
							<text class='cu-tag text-blue line-blue' @click="toTopics" :data-topic_id="item.topic_id">{{item.topic_title}}</text>
						</block>
					</scroll-view>				
				</view>
				<view class="padding-top-xs" v-if="question_info">
					<view class="padding-lr">
						<view class="text-content text-xl text-black">
							{{question_info.question_content?question_info.question_content:'内容读取中...'}}
						</view>
					</view>		
					<view v-if="question_info.question_detail != question_info.question_content && question_info.question_detail != ''">
						<view class="padding-lr">
							<uParse :content="question_info.question_detail" @preview="preview" @navigate="navigate" />
						</view>
					</view>
					
				</view>

				<view class="flex padding justify-between text-gray text-sm ">
					<view class="radius" @click="toPeople" :data-anonymous="question_info.anonymous" :data-uid="question_info.anonymous!='1'?question_info.user_info.uid:0">
						<view class="cu-avatar round sm" :style="'background-image:url('+question_info.user_info.avatar_file+');'" v-if="question_info.user_info.avatar_file && question_info.anonymous!='1'"></view>
						<view class="cu-avatar round sm" v-else><text class="cuIcon-people"></text></view>								
						<text class="padding-left-sm" v-if="question_info.anonymous!='1'">{{question_info.user_info.user_name?question_info.user_info.user_name:'神秘用户'}}</text>
						<text class="padding-left-sm" v-else>匿名用户</text>						
						<text class="padding-left-sm">{{question_info.add_time}}</text>
					</view>
					<view class="radius">
						<text class="cuIcon-attentionfill margin-lr-xs"></text> {{question_info.view_count}}
					</view>
				</view>
				
				<view class="flex solid-top">
					<view class="flex-sub">
						<view class="share">
							<button open-type="share">
								<text class="cuIcon-friendadd">邀请回答</text>
							</button>
						</view>
					</view>
					<view class="flex-sub" v-if="system_config.system_verify == 'N'">
						<view class="share solid-left">
							<button @click="showCommentInput">
								<text class="cuIcon-edit">写回答</text>
							</button>
						</view>
					</view>
					<view class="flex-sub">
						<view class="share solid-left">
							<button v-if="question_info.user_question_focus == 1" @click="focus_question">
								<text class="cuIcon-check text-blue">已关注问题</text>
							</button>
							<button v-else @click="focus_question">
								<text class="cuIcon-add">关注问题</text>
							</button>							
						</view>
					</view>				
				</view>							
								
			</view>
			<!-- 广告位 -->
			<view class="margin-tb-sm" v-if="system_config.adunitid && system_config.adunitid != ''">
				<ad :unit-id="system_config.adunitid"></ad>		
			</view>			
			
			<!-- 回答区 -->
			<view>
				<view class="flex justify-between text-sm bg-white margin-tb-sm">
					<view class="padding-sm">
						<text>{{answer_count?answer_count:0}}个回答</text>
					</view>
					<view class="padding-sm" @click="SheetSort">
						<text>{{sort_name}}</text>
						<text class="padding-left-xs cuIcon-unfold"></text>
					</view>
				</view>
				<view class="cu-list">
					<view class="cu-item text-sm bg-white margin-bottom-sm padding" v-for="(answer,index) in listData" :key="index" v-if="answer.answer_content && answer.is_del == 0">
						<view class="" @click="toPeople" :data-anonymous="answer.anonymous" :data-uid="answer.anonymous!='1'?answer.uid:0">
							<view class="cu-avatar round sm" :style="'background-image:url('+answer.user_info.avatar_file+');'" v-if="answer.user_info.avatar_file && answer.anonymous!='1'"></view>
							<view class="cu-avatar round sm" v-else><text class="cuIcon-people"></text></view>	
							<block v-if="answer.anonymous!='1'">
								<text class="padding-lr-xs">{{answer.user_info.user_name?answer.user_info.user_name:'神秘用户'}}</text>
								<text v-if="answer.user_info.verified && answer.user_info.verified != ''" class="cuIcon-vip" :class="answer.user_info.verified=='personal'?'text-yellow':'text-blue'"></text>
							</block>
							<block v-else>
								<text class="padding-left-sm">匿名用户</text>	
							</block>
							<view class="cu-tag bg-blue light fr" v-if="answer.is_best == 1"><text class="cuIcon-upstagefill">最佳回答</text></view>					
						</view>
						<view class="padding-top" @click="toAnswerDetail" :data-answer_id="answer.answer_id" :data-idx="index">
							{{answer.answer_content}}
						</view>
						<view class="padding-top text-gray" @click="toAnswerDetail" :data-answer_id="answer.answer_id" :data-idx="index">
							<text>{{answer.agree_count}} 赞同</text>
							<text class="padding-left-xs"> · {{answer.thanks_count}} 感谢</text>
							<text class="padding-left-xs"> · {{answer.comment_count}} 评论</text>
							<text class="padding-left-xs"> · {{answer.add_time}}</text>
						</view>
					</view>
				</view>
				<view class="cu-load text-grey" :class="!isLoad?'loading':'over'" v-if="listData.length > 0"></view>		
				<pageTips v-if="listData.length < 1" tipsText="暂无回答" iconClass="cuIcon-comment text-gray">
					<block slot="button">
						<view class="padding text-center" v-if="system_config.system_verify == 'N'">
							<button class="cu-btn bg-blue" @click="showCommentInput">
								<text class="cuIcon-edit padding-right-xs"></text> 写回答
							</button>
						</view>
					</block>
				</pageTips>			
			</view>		
			<view class='cu-tabbar-height'></view>
		
			<view class="cu-bar foot input">
				<view class="action" @click="toBack">
					<text class="cuIcon-back text-gray"></text>
				</view>
				<input class="solid round text-sm padding-left-sm" disabled="true" :placeholder="system_config.system_verify == 'N'?'点击这里,开始回答':'小程序端暂不支持回复'" @click="showCommentInput"></input>
				<view class="action">
					<text class="cuIcon-flasebuyfill text-gray"></text>
				</view>
				<!-- <view class="action">
					<text :class="question_info.user_thanks==1?'cuIcon-likefill text-blue':'cuIcon-like text-gray'"></text>
				</view> -->
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
				CommentInput:false,
				page:0,
				sort:'DESC',
				sort_key:'add_time',
				sort_name:'按时间排序',
				InputBottom:0,
				isCard:true,
				listData:[],
				answers:[],
				question_info:[],
				question_topics:[],
				footerTips:'',
				isLoad:false,
                reload: false,
				isLastPage:false,
				commentDisabled:false,
				textareaHeight:100,
				post_anonymous:false,
				rf:'',
				redirect_message:false,
				answer_count:0
			}
		},
		onLoad:function(e){
			var userInfo = this.userInfo
			var hasLogin = this.hasLogin
			var id = e.id

			var rf = e.rf
			if(rf){
				this.rf = rf
			}else{
				this.rf = ''
			}
			this.getQuestionDetail(id)				
		},
		//下拉刷新
        onPullDownRefresh:function() {
			this.intGetList();
        },
		//上拉加载
        onReachBottom:function() {
            this.getQuestionAnswer();
        },		
		onShareAppMessage: function(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			return {
			  title: '感觉这个问题只有你能帮我解答。拜托了!'
			}			
		},					
		methods: {
			focus_question(){
				var userInfo = this.userInfo
				var data = {}
				
				data.access_token = userInfo.access_token?userInfo.access_token:''		
								
				data.question_id = this.question_id
				console.log('focus_question',data);

				this.$api.focus_question(data).then(res => {
					console.log('focus_question',res)

					var type = res.data.rsm.type
					if(type){
						if(type == 'add'){
							this.question_info.user_question_focus = 1
						}else{
							this.question_info.user_question_focus = 0
						}
					}else{
						util.showToast('问题不存在')
						return false;		
					}

					
				}).catch(err => {
					// uni.stopPullDownRefresh();
					console.log('请求出错了，可以在这里做失败处理',err);
				})	
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
			AnonymousChange(e) {
				this.post_anonymous = e.detail.value
			},			
			textareaAInput(e){
				console.log('已输入字数：',e.detail.cursor)
			},			
			hideCommentInput(e) {
				uni.setNavigationBarTitle({
					title:this.question_info.question_content
				})
				this.CommentInput = false

			},			
			showCommentInput(){
				var system_config = this.system_config
				if(!system_config || system_config.system_verify == 'Y'){
					util.errorToast('小程序端暂不支持回复功能')
					return false;
				}				
				
				var userInfo = this.userInfo
				if(userInfo.uid > 0 && this.hasLogin){
					this.CommentInput = true
					uni.setNavigationBarTitle({
						title:'回复'
					})
				}else{
					uni.navigateTo({
						url:'../account/login'
					})
				}
			},
			SheetSort(){
				var that = this
				var itemList = ['按时间排序','按赞同数排序','只看我关注的']
				uni.showActionSheet({
				  itemList: itemList,
				  success (res) {
					var sort_name = itemList[res.tapIndex]
					that.sort_name = sort_name
					switch (res.tapIndex){
						case 0:
							that.sort_key = 'add_time'
							break;
						case 1:
							that.sort_key = 'agree_count'
							break;
						case 2:
							that.sort_key = 'focus'
							break;														
						default:
							that.sort_key = 'add_time'
							break;
					}
					that.intGetList()
				  },
				  fail (res) {
					console.log(res.errMsg)
				  }
				})
			},
			toTopics(e){
				console.log('toTopics',e)
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
				util.errorToast('请先登录')
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/account/login',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}, 1200)				

			},
			toAnswerDetail(e){
				var answer_id = e.currentTarget.dataset.answer_id;
				var idx = e.currentTarget.dataset.idx;
				console.log('toAnswerDetail',answer_id)
				if(answer_id > 0){
					uni.navigateTo({
						url:'../question/answer?answer_id=' + answer_id + '&question_id=' + this.question_id+'&idx='+idx
					})
				}else{
					util.showToast('回答ID有误')
				}				
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
			InputBlur(e) {
				this.InputBottom = 0
			},			
			//获取详情
			getQuestionDetail:function(id){

				if(id > 0){
					this.question_id = id
					var userInfo = this.userInfo
					var data = []
					data.id = id
					
					data.access_token = userInfo.access_token?userInfo.access_token:''
					if(this.rf != ''){
						data.rf = this.rf
					}
					this.$api.getQuestionDetail(data).then(res => {
						
						var question_info = res.data.rsm.question_info
						
						if(question_info){
							var question_topics = res.data.rsm.question_topics
							
							this.question_info = question_info
							this.question_topics = question_topics
							if(question_info.question_content != '' && question_info.question_content){
								uni.setNavigationBarTitle({
									title:question_info.question_content
								})
							}
							
							var redirect_message = res.data.rsm.redirect_message
							if(redirect_message && redirect_message.title != '' && redirect_message.path != ''){
								this.redirect_message = redirect_message
								console.log('redirect_message',redirect_message)

							}
							
							this.getQuestionAnswer()
						}else{
							var redirect_target_id = res.data.rsm.redirect_target_id
							if(redirect_target_id && redirect_target_id > 0){
								console.log('跳转到'+redirect_target_id)
								uni.reLaunch({
									url:'detail?id='+redirect_target_id+'&rf='+this.question_id
								})
								return false;
							}
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
				this.getQuestionAnswer();				
			},			
			//获取回答列表
			getQuestionAnswer:function(){
				var question_id = this.question_id
				if(question_id > 0){
					var data = {}
					var userInfo = this.userInfo
					
					var page = this.page + 1
					data.page = page
					data.question_id = question_id				
					data.sort_key = this.sort_key
					
					
					data.access_token = userInfo.access_token?userInfo.access_token:''
					
					
					if (this.isLastPage) { //说明已有数据，目前处于上拉加载
						uni.stopPullDownRefresh();
						
						this.isLoad = true
						util.showToast('没有更多回答了....')
						return false;
					}
					this.$api.getQuestionAnswer(data).then(res => {
						this.isLoad = false
						this.page = page
						var list = res.data.rsm.list
						
						this.answer_count = res.data.rsm.answer_count
						
						if(list.length > 0){
							this.listData = this.reload ? list : this.listData.concat(list);
							console.log('listData',this.listData)
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
							this.footerTips = '暂无回答'
						}
						
					}).catch(err => {
						console.log('请求失败，可以在这里写处理代码',err);
					})						
				}else{
					util.errorToast('动态ID错误')
				}
			
			},
			//提交回答
			AnswerFormSubmit:function(e){
				
				var system_config = this.system_config
				if(!system_config || system_config.system_verify == 'Y'){
					util.errorToast('小程序端暂不支持回复功能')
					return false;
				}
				console.log('AnswerFormSubmit',e)
				
				var answer_content = e.detail.value.answer_content
				
				if(!answer_content || answer_content == ''){
					util.errorToast('回答内容不能为空')
					return false
				}
				var userInfo = this.userInfo
				
				if(userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
					return false
				}				
				
				var anonymous = this.post_anonymous?1:0
				var data = {}
				
				data.access_token = userInfo.access_token
				
				data.question_id = this.question_id
				data.answer_content = answer_content
				data.anonymous = anonymous
				data.attach_access_key = ''
				data.auto_focus = 1 //回答问题，默认：关注问题
				
				this.$api.post_answer(data).then(res => {
					var answer_id = res.data.rsm.answer_id
					if(answer_id > 0){
						// this.toAnswerDetail(answer_id)
						uni.redirectTo({
							url:'../question/detail?id='+ this.question_id
						})
					}else{
						util.errorToast('系统异常，请返回')
						
					}
				}).catch(err => {
					console.log('提交回答失败',err);
				})	
			}
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
