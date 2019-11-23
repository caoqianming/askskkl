<template>
	<view>
		<view class="bg-white">
			
			<view class="flex">
				<view class="basis-xs padding-sm radius">
					
					<view class="cu-avatar xl round" :style="'background-image:url('+user.avatar_file+');'" v-if="user.avatar_file">
						<view class="cu-tag badge "  :class="user.sex==2?'cuIcon-female bg-pink':'cuIcon-male bg-blue'" ></view>
					</view>
					<view class="cu-avatar xl round" v-else>
						<text class="cuIcon-people">
						</text>
						<view class="cu-tag badge " :class="user.sex==2?'cuIcon-female bg-pink':'cuIcon-male bg-blue'" ></view>
					</view>
					<!-- <view class="padding-top-sm text-center">{{user.user_name?user.user_name:''}}</view> -->
				</view>
				<view class="basis-xl padding-tb-sm padding-lr-xs radius ">
					<view class="grid text-center col-3">
						<view class="" @click="toMyFollows(uid)">
							<view>{{user.fans_count}}</view>
							<view>粉丝</view>						
						</view>
						<view class="" @click="toMyAnswer(uid)">
							<view>{{user_actions_answers_count}}</view>
							<view>回答</view>						
						</view>
						<view class="" @click="toMyArticle(uid)">
							<view>{{user_actions_articles_count}}</view>
							<view>文章</view>						
						</view>
					</view>
					<view class="flex p-xs mb-sm">
						<block  v-if="system_config.system_verify == 'N' && uid != userInfo.uid && hasLogin">
							<view class="flex-sub padding-lr-sm radius">
								<view class="padding-xs flex flex-direction">
									<button class="cu-btn sm line-blue " @click="toChat(user.user_name)">私信</button>
								</view>							
							</view>							
						</block>
						<block v-else>
							<view class="flex-sub padding-lr-sm radius">
								<view class="padding-xs flex flex-direction">
									<button class="cu-btn sm line-blue " open-type="share">分享</button>
								</view>							
							</view>
						</block>						

						<view class="flex-twice padding-lr-sm radius">
							<view class="padding-xs flex flex-direction" v-if="userInfo.uid == uid && uid > 0">
								<button class="cu-btn sm bg-blue "@click="toSetting">编辑资料</button>
							</view>
							<view class="padding-xs flex flex-direction" v-else>
								<button class="cu-btn sm bg-gray " v-if="user_follow_check" @click="follow_people">已关注</button>
								<button class="cu-btn sm bg-blue " v-else @click="follow_people">关注</button>
							</view>							
						</view>
					</view>					
					
				</view>
			</view>
			<view class="padding-lr padding-tb-sm  text-sm ">
				<text :class="user.verified=='personal'?'cuIcon-vip text-yellow':'cuIcon-vip text-blue'" v-if="user.verified && user.verified != ''"></text>
				<text class="text-gray">{{!user.verified ? '个人介绍：':'认证资料：'}}</text>				
				<text class="text-gray">
					{{user.signature?user.signature:'这个人很懒，未设置个人介绍'}}
				</text>
			</view>
			<view class="padding-lr padding-tb-sm  text-sm ">
					<text class='cuIcon-crown'>威望:{{user.reputation?user.reputation:0}}</text>
					<text class='cuIcon-coin padding-left'>积分:{{user.integral?user.integral:0}}</text>
					<text class='cuIcon-appreciate padding-left'>获赞:{{user.agree_count?user.agree_count:0}}</text>
			</view>			
		</view>	
		<view class="margin-top-sm">
			<scroll-view scroll-x class="bg-white nav text-center">
				<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in TabArr" :key="index" @tap="tabSelect" :data-id="index">
					{{item}}
				</view>
			</scroll-view>			
		</view>
		<view class="">
			<block v-if="TabCur == 0">
				<view class="margin-top-sm">
					<view class="cu-list menu">
						<view class="cu-item" v-for="(item,index) in user_actions_answers" :key="index"  @click="toQuestionDetail" :data-id="item.associate_id" v-if="item.anonymous != 1">
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
					<view class="padding text-center bg-white" v-if="user_actions_answers.length < 1">Ta还未进行任何回答</view>
					<view class="padding text-center text-gray margin-top-sm" v-else @click="toMyAnswer(uid)">查看更多></view>									
				</view>					
			</block>
			<block v-if="TabCur == 1">
				<view class="margin-top-sm">
					<view class="cu-list menu">
						<view class="cu-item" v-for="(item,index) in user_actions_questions" :key="index"  @click="toQuestionDetail" :data-id="item.question_id" v-if="item.anonymous != 1">
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
					<view class="padding text-center bg-white" v-if="user_actions_questions.length < 1">Ta还没有发起过任何提问</view>					
					<view class="padding text-center text-gray margin-top-sm" v-else @click="toMyQuestion(uid)">查看更多></view>
				</view>
			</block>
			<block v-if="TabCur == 2">
				<view class="margin-top-sm">
					<view class="cu-list menu">
						<view class="cu-item" v-for="(item,index) in user_actions_articles" :key="index"  @click="toArticleDetail" :data-id="item.id">
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
					<view class="padding text-center bg-white" v-if="user_actions_articles.length < 1">还没有发表过任何文章</view>
					<view class="padding text-center text-gray margin-top-sm" v-else @click="toMyArticle(uid)">查看更多></view>
				</view>
			</block>			
			<block v-if="TabCur == 3">
				<view class="margin">
					<view class="cu-bar bg-white margin-top solid-bottom head-border">
						<view class="action">
							<text class="cuIcon-friendfavor text-blue"></text>
							<text>Ta的关注</text>
						</view>
						<view class="action" @click="toMyFollows(uid)">
							<text>更多</text>
							<text class="cuIcon-right"></text>
						</view>							
					</view>
					<view class="bg-white">
						<view class="padding text-center" v-if="friends_list.length < 1">暂无关注</view>
						<view class="cu-avatar sm round margin-sm" :style="'background-image:url('+item.avatar_file+');'" v-for="(item,index) in friends_list" :key="index" @click="topeople(item.uid)"></view>
					</view>
				</view>
				<view class="margin">
					<view class="cu-bar bg-white margin-top solid-bottom head-border">
						<view class="action">
							<text class="cuIcon-friendfamous text-blue"></text>
							<text>Ta的粉丝</text>
						</view>
						<view class="action" @click="toMyFollows(uid,1)">
							<text>更多</text>
							<text class="cuIcon-right"></text>
						</view>						
					</view>
					<view class="bg-white footer-border">
						<view class="padding text-center" v-if="fans_list.length < 1">暂无粉丝</view>
						<view class="cu-avatar sm round margin-sm" :style="'background-image:url('+item.avatar_file+');'" v-if="item.avatar_file" v-for="(item,index) in fans_list" :key="index" @click="topeople(item.uid)"></view>
					</view>
				</view>				
				<view class="margin">
					<view class="cu-bar bg-white margin-top solid-bottom head-border">
						<view class="action">
							<text class="cuIcon-mark text-blue"></text>
							<text>关注的话题</text>
						</view>
					</view>
					<view class="bg-white footer-border">
						<view class="padding text-center" v-if="focus_topics.length < 1">暂无关注话题</view>
						<text class='cu-tag bg-blue margin-sm' v-for="(item,index) in focus_topics" :key="index" @click="totopicDetail(item.topic_id)">{{item.topic_title}}</text>
					</view>
				</view>					
			</block>
			<block v-if="TabCur == 4">
				<view class="cu-bar bg-white margin-top solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-blue"></text>
						<text>个人资料</text>
					</view>
				</view>				
				<view class="cu-list menu">
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-service text-grey"></text>
							<text class="text-grey">职业：{{user.job_name?user.job_name:'未设置'}}</text>
						</view>
					</view>	
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-location text-grey"></text>
							<text class="text-grey">现居：{{user.province?user.province+' '+user.city:'未设置'}}</text>
						</view>
					</view>	
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-profile text-grey"></text>
							<text class="text-grey">注册：{{user.reg_time}}</text>
						</view>
					</view>		
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-present text-grey"></text>
							<text class="text-grey">生日：{{user.birthday}}</text>
						</view>
					</view>																						
				</view>				
			</block>						
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import util from '@/utils/util.js';
	export default {
		data() {
			return {
				TabArr:['参与','提问','文章','关注','资料'],
				TabCur: 0,
				scrollLeft: 0,
				uid:'',
				user:[],
				user_follow_check:false,
				user_actions_questions:[],
				reputation_topics:[],
				fans_list:[],
				friends_list:[],
				focus_topics:[],
				user_actions_answers:[],
				user_actions_articles:[],
				user_actions_questions_count:0,
				user_actions_answers_count:0,
				user_actions_articles_count:0,
			};
		},		
		computed: {
			...mapState(['hasLogin', 'userInfo','system_config'])
		},
		onLoad:function(e){
			var uid = e.uid
			this.uid = uid
			this.getPeople()
		},
		onShareAppMessage: function(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			var user_name = this.user.user_name
			return {
			  title: user_name + '的个人主页'
			}			
		},			
		methods: {
			...mapMutations(['login']),
			toSetting(){
				uni.navigateTo({
					url:'/pages/user/setting'
				})
			},
			toChat(user_name){
				if(user_name && user_name != ''){
					uni.navigateTo({
						url:'../inbox/chat?username='+user_name
					})
				}else{
					util.errorToast('系统出错')
					return false;
				}
			},
			follow_people(){
				if(this.uid < 1){
					util.errorToast('系统出错')
					return false;
				}
				var userInfo = this.userInfo
				if(!userInfo.uid || userInfo.uid < 1 || !this.hasLogin){
					this.toLogin()
				}
				var data = []

				
				data.access_token = userInfo.access_token?userInfo.access_token:''		

				data.uid = this.uid
				
				this.$api.follow_people(data).then(res => {
					console.log('follow_people',res)

					var type = res.data.rsm.type
					if(type){
						if(type == 'add'){
							this.user_follow_check = true
						}else{
							this.user_follow_check = false
						}
					}else{
						util.errorToast('关注失败')
						return false;		
					}

					
				}).catch(err => {
					// uni.stopPullDownRefresh();
					console.log('请求出错了，可以在这里做失败处理',err);
				})	
			},			
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},			
			toLogin() {
				uni.navigateTo({
					url: '/pages/account/login',
				});
			},
			toMyAnswer(uid) {
				if(uid < 1){
					this.toLogin()
					return false;
				}	
				uni.navigateTo({
					url: '/pages/user/question?uid=' + uid+'&tab=1'
				});					
			},
			toMyQuestion(uid) {
				if(uid < 1){
					this.toLogin()
					return false;
				}				
				uni.navigateTo({
					url: '/pages/user/question?uid=' + uid
				});
			},
			toMyArticle(uid) {
				if(uid < 1){
					this.toLogin()
					return false;
				}				
				uni.navigateTo({
					url: '/pages/user/article?uid=' + uid
				});
			},
			toMyFollows(uid,tab) {
				if(uid < 1){
					this.toLogin()
					return false;
				}
				if(!tab){
					tab = 0
				}
				uni.navigateTo({
					url: '/pages/user/follows?uid=' + uid + '&tab=' + tab
				});
			},
			topeople(uid) {
				if (uid > 0) {
					uni.navigateTo({
						url: '/pages/people/people?uid=' + uid
					})
				}
			},
			totopicDetail(topic_id){
				// var topic_id = e.currentTarget.dataset.topic_id;
				if(topic_id > 0){
					uni.navigateTo({
						url:'/pages/topic/detail?topic_id='+topic_id
					})
				}else{
					util.showToast('话题id有误')
				}
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
			//获取详情
			getPeople:function(){
				
				var uid = this.uid
				if(uid){
					var userInfo = this.userInfo
					var data = []
					data.uid = uid
					
					data.access_token = userInfo.access_token?userInfo.access_token:''

					this.$api.getPeople(data).then(res => {
						console.log('getPeople',res)
						var user = res.data.rsm.user
						if(!user || !user.user_name){
							 util.errorToast('用户资料出错')
							return false;
						}
						
						uni.setNavigationBarTitle({
							title:user.user_name + '的主页'
						})
						this.user = user
						this.user_follow_check = res.data.rsm.user_follow_check
						this.user_actions_questions = res.data.rsm.user_actions_questions
						this.reputation_topics = res.data.rsm.reputation_topics
						this.fans_list = res.data.rsm.fans_list
						this.friends_list = res.data.rsm.friends_list
						this.focus_topics = res.data.rsm.focus_topics
						this.user_actions_answers = res.data.rsm.user_actions_answers
						this.user_actions_articles = res.data.rsm.user_actions_articles
						this.user_actions_questions_count = res.data.rsm.user_actions_questions_count
						this.user_actions_answers_count = res.data.rsm.user_actions_answers_count
						this.user_actions_articles_count = res.data.rsm.user_actions_articles_count
						
					}).catch(err => {
						console.log('请求失败，可以在这里写处理代码',err);
					})				
				}else{
					console.log('ID有误',uid)
					util.errorToast('ID有误')
					uni.navigateBack({
						delta:1
					})
				}				
			},			

		}
	}
</script>

<style>
.head-border {
	border-radius:20upx 20upx 0upx 0upx;
}
.footer-border{
	border-radius:0upx 0upx 20upx 20upx;	
}
</style>
