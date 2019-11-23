<template name="publish">
	<view>
		<block v-if="showTopicList">
			<view class="cu-bar bg-white">
				<view class="action" @click="showTopicLists">
					<text class="cuIcon-back text-gray"></text> 返回内容编辑
				</view>
			</view>
			
			<view class="cu-bar bg-white solid-bottom margin-top-sm">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>已添加的话题</text>
				</view>
			</view>
			<view class="bg-white margin-bottom-sm">
				<view v-if="SelectTopic.length > 0">
					<text v-for="(item,index) in SelectTopic" :key="index" class="" @click="delTopics(index)">
						<text class='cu-tag round margin-sm bg-blue'>{{item}}</text>
					</text>
					
				</view>
				<view class="text-center padding-tb" v-else>未添加话题</view>
			</view>
			
			<form @submit="searchTopic">
				<view class="cu-bar search bg-white margin-top-sm">
					<view class="search-form round">
						<text class="cuIcon-search"></text>
						<input :adjust-position="false" type="text" placeholder="搜索话题" confirm-type="search" name="searchTopicName"></input>
					</view>
					<view class="action">
						<button class="cu-btn bg-blue shadow-blur round" formType="submit">搜索</button>
					</view>
				</view>
			</form>
		
			<view class="cu-bar bg-white solid-bottom margin-top-sm">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>{{searchTopicName?'「'+searchTopicName+'」':''}}相关话题</text>
				</view>
			</view>
			<view class="bg-white margin-bottom-sm">
				<view v-if="search_topic.length > 0">
					<text class="" v-for="(item,index) in search_topic" :key="index" @click="selectTopic" :data-topic_name="item">
						<text class='cu-tag round margin-sm'>{{item}}</text>
					</text>
					<view class="text-center padding-tb">点击对应话题可以添加</view>
				</view>
				<view class="text-center padding-tb" v-else>
					未找到相关话题
				</view>
				<view class="text-center padding-tb" v-if="create_topic">
					如果找不到想要的话题，你可以<text class="padding-left-xs text-blue" @click="showAddTopic">新增话题</text>
				</view>
			</view>
			
			<view class="cu-bar bg-white margin-top solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>最近话题</text>
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in recent_topics" :key="index" >
					<view class="cu-avatar lg">#</view>
					<view class="content">
						<view class="text-cut">{{item}}</view>
					</view> 
					<view class="action">
						<button class="cu-btn sm" @click="selectTopic" :data-topic_name="item" :data-idx="index">{{SelectTopic.indexOf(item) != -1?'已添加':'添加'}}</button>
					</view>
				</view>
			</view>
			<view class="cu-modal" :class="AddTopicModal?'show':''">
				<view class="cu-dialog">
					<form @submit="addTopic" >
						<view class="cu-bar bg-white justify-end">
							<view class="content">添加话题</view>
							<view class="action" @tap="showAddTopic">
								<text class="cuIcon-close text-red"></text>
							</view>
						</view>
						<view class="padding-xl">
							<input placeholder="请输入话题名称" name="topic_name" class="bg-white round" :value="topic_name"></input>
						</view>
						<view class="cu-bar bg-white justify-end">
							<view class="action">
								<button class="cu-btn line-blue text-blue" @tap="showAddTopic">取消</button>
								<button class="cu-btn bg-blue margin-left" formType="submit">添加</button>
							</view>
						</view>
					</form>
				</view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg" @click="showTopicLists">继续编辑内容</button>
			</view>
		</block>
		<block v-else>
		<view v-if="hasLogin && userInfo.uid > 0">
			<form @submit="formSubmit" >
				
				<view class="cu-form-group solid-bottom">
					<input placeholder="请输入标题" name="title"></input>
				</view>				
				<view class="cu-form-group">
					<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaAInput" placeholder="在这里输入你的内容" :style="'height:'+textareaHeight+'px;'" name="content"></textarea>
				</view>
				<view class="cu-form-group" v-if="type == 'question' && system_config.anonymous_enable == 'Y'">
					<view class="title">匿名提问</view>
					<switch class='blue' @change="AnonymousChange" :class="post_anonymous?'checked':''" :checked="post_anonymous?true:false"></switch>
				</view>
				<view class="cu-form-group margin-top-xs" v-if="category_list.length > 0">
					<view class="title">分类</view>
					<picker @change="CategoryChange" :value="category_idx" :range="category">
						<view class="picker">
							{{category_idx>-1?category_list[category_idx].title:'请选择分类'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group margin-top-xs" v-if="column_list.length > 0 && type == 'article'">
					<view class="title">专栏</view>
					<picker @change="ColumnChange" :value="column_idx" :range="columns">
						<view class="picker">
							{{column_idx>-1?column_list[column_idx].column_name:'请选择专栏'}}
						</view>
					</picker>
				</view>				
				
				<view class="cu-form-group margin-top-xs" @click="showTopicLists">
					<view class="title">{{SelectTopic.length>0?'已添加的话题':'添加话题'}}</view>
					<view class="cuIcon-right"></view>
				</view>									
				<view class="bg-white padding-lr">
					<text v-for="(item,index) in SelectTopic" :key="index" class="" @click="delTopics(index)">
						<text class='cu-tag round margin-sm bg-blue'>{{item}}</text>
					</text>
				</view>
							
				<view class="padding flex flex-direction">
					<button class="cu-btn bg-blue margin-tb-sm lg" formType="submit" :disabled="isRotate" type="">
						<text :class="isRotate?'cuIcon-loading2 cuIconfont-spin':''"></text> 发布</button>
					</button>
					<button class="cu-btn bg-grey lg" @click="toHome">返回</button>
				</view>
				
			</form>
		</view>
		<view v-else>
			<pageTips tipsText="请先登录" iconClass="cuIcon-lock text-gray"></pageTips>
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
				textareaHeight:100,
				NavigationBarTitle:'',
				post_anonymous:false,
				type:'question',
				category_list:[],
				category:[],
				category_idx:-1,
				multiIndex:0,
				attach_access_key:'',
				isRotate:false,
				AddTopicModal:false,
				SelectTopic:[],
				topic_name:'',
				column_list:[],
				columns:[],
				column_idx:-1,
				showTopicList:false,
				create_topic:null,
				recent_topics:[],
				search_topic:[],
				searchTopicName:''
			}
		},
		onLoad:function(e){
			var userInfo = this.userInfo
			var hasLogin = this.hasLogin
			if(!userInfo.uid || userInfo.uid < 1 && !hasLogin){
				uni.navigateTo({
					url:'/pages/account/login'
				})
				return false;
			}
			var type = e.type
			var NavigationBarTitle = '发起提问'
			if(type == 'question'){
				NavigationBarTitle = '发起问题'
				this.type = type
			}else if(type == 'article'){
				NavigationBarTitle = '发表文章'
				this.type = type
			}
			uni.setNavigationBarTitle({
				title:NavigationBarTitle
			})
			// this.intPublish()
			
		},
		onShow:function(){
			this.intPublish()
		},
		onNavigationBarButtonTap: function(e) {
			var that = this;  
			//子组件的data
			var editData = this.$refs.edit.submit(); 
			
			console.log("内容为" + JSON.stringify(editData.editItems));
		},
		methods: {	
			searchTopic(e){
				console.log("searchTopicName" , e);
				var searchTopicName = e.detail.value.searchTopicName
				console.log("searchTopicName" , searchTopicName);
				if(!searchTopicName){
					util.errorToast('搜索内容不能为空')
					return false;
				}
				this.searchTopicName = searchTopicName
				var data = []
				data.type = 'topics'
				data.q = searchTopicName
				data.limit = 10
				
				this.$api.search_topic(data).then(res => {
					console.log('search_topic',res);
					var search_topic_data = res.data.rsm.topic_data
					if(search_topic_data.length > 0){
						var search_topic = []
						for (let i = 0; i < search_topic_data.length; i++) {
							search_topic.push(search_topic_data[i].name)
						}
						this.search_topic = search_topic
						
					}else{
						util.errorToast('未找到相关话题')
					}

				}).catch(err => {
					console.log('搜索话题失败',err);
				})					
			},
			MultiChange(e) {
				this.multiIndex = e.detail.value
				console.log('multiArray',this.multiArray)
			},
			delTopics(index){
				if(index > -1){
					console.log('删除话题'+index,this.SelectTopic[index])
					var SelectTopic = this.SelectTopic
					SelectTopic.splice(index, 1);
					this.SelectTopic = SelectTopic
				}
			},
			showTopicLists(){
				this.showTopicList = !this.showTopicList
			},
			showAddTopic(){
				console.log('showAddTopic')
				this.AddTopicModal = !this.AddTopicModal
			},
			selectTopic(e){
				console.log('selectTopic',e)
				
				var topic_name = e.currentTarget.dataset.topic_name
				if(!topic_name || topic_name == ''){
					util.errorToast('话题有误，请重新选择')
					return false;
				}
				
				if(this.SelectTopic.indexOf(topic_name) != -1){
					util.errorToast('该话题已经添加过了')
					return false;
				}
				this.SelectTopic = this.SelectTopic.concat(topic_name)
				
				
			},
			addTopic(e){
				console.log('addTopic',e.detail.value)
				var topic_name = e.detail.value.topic_name
				if(!topic_name || topic_name == ''){
					util.errorToast('话题名称不能为空')
					return false;
				}
				if(!create_topic){
					util.errorToast('你所在用户组无权新增话题')
					return false;
				}
				if(this.SelectTopic.indexOf(topic_name) != -1){
					util.errorToast('该话题已经添加过了')
					return false;
				}
				this.SelectTopic = this.SelectTopic.concat(topic_name)
				setTimeout(() => { 
					this.topic_name = '' 
				}, 10)	
				this.topic_name = ' ' 
				this.showAddTopic()
			},
			toBack(delta){
				uni.navigateBack({
					delta:1
				})
			},
			toHome(){
				uni.reLaunch({
					url:'/pages/index/index'
				})					
			},
			AnonymousChange(e) {
				this.post_anonymous = e.detail.value
			},					
			linechange(e){
				var lineCount = e.detail.lineCount
				if(lineCount > 4){
					//粗略的设置一下高度而已，没有参考值
					this.textareaHeight = lineCount * 20					
				}else{
					this.textareaHeight = 100
				}
			},
			textareaAInput(e){
				console.log('已输入字数：',e.detail.cursor)
			},
			CategoryChange(e) {
				console.log('已选择分类：',e.detail.value)
				if(e.detail.value > -1){
					this.category_idx = e.detail.value
					console.log('已选择分类标题：',this.category_list[e.detail.value].title)
				}
			},	
			ColumnChange(e) {
				console.log('已选择专栏：',e.detail.value)
				if(e.detail.value > -1){
					this.column_idx = e.detail.value
					console.log('已选择专栏标题：',this.column_list[e.detail.value].column_name)
				}
			},	
			intCategory(category_list){
				var category = []
				for(let index in category_list) {  
					category[index] = category_list[index].title

				}; 
				return category;

			},
			intColumn(column_list){
				var columns = []
				for(let index in column_list) {  
					columns[index] = column_list[index].column_name

				}; 
				return columns;

			},			
			//初始化发布
			intPublish:function(){
				var type = this.type
				var userInfo = this.userInfo
				if(!userInfo.uid || userInfo.uid < 1){
					uni.navigateTo({
						url:'/pages/account/login'
					})
				}
				var data = {}
				
				
				data.access_token = userInfo.access_token				
				if(type == 'question'){
					
					this.$api.intPublishQuestion(data).then(res => {
						console.log('初始化发布 intPublishQuestion',res);
						var question_category_list = res.data.rsm.question_category_list
						console.log('question_category_list',question_category_list);
						if(question_category_list){
							this.category_list = question_category_list
							this.category = this.intCategory(question_category_list)
							this.attach_access_key = res.data.rsm.attach_access_key
						}
						this.create_topic = res.data.rsm.create_topic
						this.recent_topics = res.data.rsm.recent_topics
					}).catch(err => {
						console.log('初始化发布失败',err);
					})	
				}else if(type == 'article'){
					
					this.$api.intPublishArticle(data).then(res => {
						console.log('初始化发布 intPublishArticle',res);
						var article_category_list = res.data.rsm.article_category_list
						console.log('article_category_list',article_category_list);
						if(article_category_list){
							this.category_list = article_category_list
							this.category = this.intCategory(article_category_list)
						}
						this.create_topic = res.data.rsm.create_topic
						this.recent_topics = res.data.rsm.recent_topics
						var column_list = res.data.rsm.column_list
						if(column_list){
							this.column_list = column_list
							this.columns = this.intColumn(column_list)
							this.attach_access_key = res.data.rsm.attach_access_key
						}

						
					}).catch(err => {
						console.log('初始化发布失败',err);
					})						
					
				}else{
					this.toBack()
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
			//提交发布
			formSubmit:function(e){
				this.isRotate = true
				console.log('formSubmit',e);	

				var userInfo = this.userInfo
				if(!userInfo.uid || userInfo.uid < 1 ){
					this.isRotate = false
					this.toLogin()
				}
				var type = this.type
				var value = e.detail.value
				if(!value.title){
					util.errorToast('标题不能为空')
					this.isRotate = false
					return false;					
				}					
				
				if(!value.content && type == 'article'){
					util.errorToast('文章内容不能为空')
					this.isRotate = false
					return false;					
				}	
				
				var data = {}

				if(this.category_list.length > 0 ){
					if(this.category_idx < 0){
						util.errorToast('请选择分类')
						this.isRotate = false
						return false;	
					}
					var category_id = this.category_list[this.category_idx].id
					console.log('分类 category_id',category_id);
					data.category_id = category_id
				}							

				
				data.access_token = userInfo.access_token

				if(this.SelectTopic.length > 0 ){

					data.topics = JSON.stringify(this.SelectTopic)
				}					
				
				
				if(type == 'question'){
					data.question_content = value.title
					data.question_detail = value.content					
					data.anonymous = this.post_anonymous?1:0
					data.attach_access_key = this.attach_access_key
					this.$api.publish_question(data).then(res => {
						if(!res.data.rsm){
							setTimeout(() => {
								this.toHome()
							}, 1200)
							return false
						}
						var question_id = res.data.rsm.question_id
						if(question_id && question_id > 0){
							uni.reLaunch({
								url:'/pages/question/detail?id='+question_id
							})
						}else{
							
							setTimeout(() => {
								this.toHome()
							}, 1300)		
						}
					}).catch(err => {
						this.isRotate = false
						console.log('发布问题失败',err);
					})						
					
				}else if(type == 'article'){
					// data.post_hash = e.post_hash
					data.title = value.title
					data.message = value.content		
								
					if(this.column_list.length > 0 ){
						if(this.column_idx < 0){
							//不强制选择专栏
							// util.errorToast('请选择专栏')
							// this.isRotate = false
							// return false;	
						}else{
							var column_id = this.column_list[this.column_idx].column_id
							console.log('专栏 column_id',column_id);
							data.column_id = column_id
						}

					}	

					data.attach_access_key = this.attach_access_key
					this.$api.publish_article(data).then(res => {
						if(!res.data.rsm){
							setTimeout(() => {
								this.toHome()
							}, 1200)	
							return false
						}						
						
						var article_id = res.data.rsm.article_id
						if(article_id && article_id > 0){
							uni.reLaunch({
								url:'/pages/article/detail?id='+article_id
							})
						}else{
							
							setTimeout(() => {
								this.toHome()
							}, 1300)		
						}
					}).catch(err => {
						console.log('发布文章失败',err);
					})						
				}else{
					util.errorToast('系统出错')
					return false;		
				}

			}			
		}
	}
</script>

<style>

</style>
