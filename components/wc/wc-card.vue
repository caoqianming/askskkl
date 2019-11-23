<template>
	<view>
		<view class="cu-card dynamic margin-top-sm" :class="isCard?'no-card':''" >
			<view class="cu-item shadow" v-for="(item,index) in listData" :key="index" v-if="item.title || item.question_content">
				<block v-if="item.post_type == 'article'">
					
					<block v-if="item.set_top == 1">
						<view class="padding-sm" @click="toArticleDetails" :data-id="item.id">
							<text v-if="item.set_top == 1" class="cu-tag sm round line-orange margin-left-xs">置顶</text>
							<text class="padding-left-sm">{{item.title}}</text>
							<text class="cuIcon-right text-gray fr"></text>
						</view>
					</block>
					<block v-else>
						<view v-if="item.message" class="padding-lr">
							<view class="flex solid-bottom padding-tb-sm justify-between">
								<view class="radius" @click="toPeople":data-uid="item.user_info.uid?item.user_info.uid:0">
									<view class="flex justify-start">
										<view class="radius">
											<view class="cu-avatar round" :style="'background-image:url('+item.user_info.avatar_file+');'"></view>	
										</view>
										<view class="radius padding-left-sm">
											<view>{{item.user_info.user_name}} </view>
											<view class="text-gray text-sm flex justify-between">
												{{item.add_time}} 发表文章
											</view>
										</view>
									</view>
								</view>
								<view class="radius"></view>
							</view>
							<view class="text-content" @click="toArticleDetails" :data-id="item.id">
								<view class="padding-top-sm">
									{{item.title}}
									<text v-if="item.set_top == 1" class="cu-tag sm round line-orange margin-left-xs">置顶</text>
									<text v-if="item.is_recommend == 1" class="cu-tag sm round line-blue margin-left-xs">推荐</text>							
								</view>
								<view class="text-gray text-sm padding-tb-sm">{{item.message}}</view>
							</view>
							<view class="bg-white padding-sm solid-top">
								<view class="grid text-center col-3">
									<view class="cuIcon-attentionfill"><text style="margin-left: 8rpx;">{{item.views}}</text></view>
									<view class="cuIcon-comment padding-lr"><text style="margin-left: 8rpx;">{{item.comments}}</text></view>
									<view class="cuIcon-appreciatefill padding-lr"><text style="margin-left: 8rpx;">{{item.votes}}</text></view>
								</view>
							</view>		
						</view>
											
					</block>
	
				</block>
				<block v-if="item.post_type == 'question'">
					
					<block v-if="item.set_top == 1">
						<view class="padding-sm" @click="toQuestionDetail" :data-id="item.question_id">
							<text v-if="item.set_top == 1" class="cu-tag sm round line-orange margin-left-xs">置顶</text>
							<text class="padding-left-sm">{{item.question_content}}</text>
							<text class="cuIcon-right text-gray fr"></text>
						</view>
					</block>
					<block v-else>	
						<view class="padding-lr">
							<view class="flex solid-bottom padding-tb-sm justify-between">
								<view class="radius" @click="toPeople" :data-anonymous="item.anonymous" :data-uid="item.anonymous!='1'?item.user_info.uid:0">
									<view class="flex justify-start">
										<view class="radius">
											<view class="cu-avatar round" :style="'background-image:url('+item.user_info.avatar_file+');'" v-if="item.anonymous == '0'"></view>
											<view class="cu-avatar round" v-else><text class="cuIcon-people"></text></view>	
										</view>
										<view class="radius padding-left-sm">
											<view>{{item.anonymous=='0'?item.user_info.user_name:'匿名用户'}} </view>
											<view class="text-gray text-sm flex justify-between">
												{{item.add_time}} 发起提问
											</view>
										</view>
									</view>
								</view>
								<view class="radius"></view>
							</view>
							<view class="text-content" @click="toQuestionDetail" :data-id="item.question_id">
								<view class="padding-top-sm">
									{{item.question_content}}
									<text v-if="item.set_top == 1" class="cu-tag sm round line-orange margin-left-xs">置顶</text>
									<text v-if="item.is_recommend == 1" class="cu-tag sm round line-blue margin-left-xs">推荐</text>
								</view>
								<view class="text-gray text-sm padding-tb-sm" v-if="item.question_content != item.question_detail">{{item.question_detail}}</view>
							</view>
							<view class="bg-white padding-sm solid-top">
								<view class="grid text-center col-3">
									<view class="cuIcon-attentionfill"><text style="margin-left: 8rpx;">{{item.view_count}}</text></view>
									<view class="cuIcon-comment padding-lr"><text style="margin-left: 8rpx;">{{item.answer_count}}</text></view>
									<view class="cuIcon-appreciatefill padding-lr"><text style="margin-left: 8rpx;">{{item.agree_count}}</text></view>
								</view>
							</view>							
						</view>
					</block>
						
				</block>	
			</view>
			
		</view>		
	</view>
</template>

<script>
	import util from '@/utils/util.js';	
	export default {
		components:{

		},		
		data() {
			return {
				
			}
		},
		props:{
			isCard:{
				type: Boolean,
				default: false
			},
			listData:{
				type: Array,
				default: []
			},				
		},		
		methods: {
			toPeople:function(e){
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
			toQuestionDetail:function(e){
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
		}
	}
</script>

<style>
.cu-card.no-card>.cu-item {
margin:0rpx 0rpx 20rpx 0rpx;
-webkit-border-radius:0rpx;
border-radius:0rpx;
}
.cu-card.dynamic>.cu-item>.text-content {
padding:0 30rpx 0;
max-height:16.4em;
overflow:hidden;
font-size:30rpx;
margin-bottom:20rpx;

}

</style>
