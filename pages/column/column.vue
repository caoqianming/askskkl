<template>
	<view>
		<view class="cu-bar bg-white solid-bottom " v-if="recommend_column.length > 0">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text> 推荐专栏
			</view>
		</view>

		<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
		 duration="500" v-if="recommend_column.length > 0">
			<swiper-item v-for="(item,index) in recommend_column" :key="index" @click="toDetail" :data-column_id="item.column_id">
				<image :src="item.column_pic" mode="aspectFill"></image>
				<view class="swiper-title"><text class="text-white padding">{{item.column_name}}</text></view>
			</swiper-item>
		</swiper>

		<view class="cu-bar bg-white margin-top solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text> 热门专栏
			</view>
		</view>
		<view v-if="hot_column.length < 1" class="bg-white padding">
			<text class="text-center ">暂无专栏，请先在PC端创建专栏</text>
		</view>
		<view class="cu-list menu-avatar">
			<view class="cu-item" v-for="(item,index) in hot_column" :key="index" @tap="toDetail" :data-column_id="item.column_id">
				<view class="cu-avatar radius lg" :style="'background-image:url('+item.column_pic+');'" v-if="item.column_pic"></view>
				<view class="cu-avatar lg" v-if="!item.column_pic">#</view>
				<view class="content">
					<view>
						<view class="text-cut">{{item.column_name}}</view>
						<view class="cu-tag round bg-blue sm">{{item.focus_count+'人关注'}}</view>
					</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">{{item.column_description?item.column_description:'浏览数:'+item.views_count+' · 点赞数'+item.votes_count+' · 文章数'+item.article_count}}</view>
					</view>
					
				</view>
			</view>
		</view>

		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text> 最新文章
			</view>
		</view>
		<wcArticle :isCard="isCard" :listData="article_list" v-if="article_list.length > 0"></wcArticle>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-blue lg" @click="toArticle">更多文章>>></button>
		</view>	
		<publish v-if="system_config && system_config.system_verify != 'Y'  && hasLogin && userInfo.uid" btnText="发表" btnPath="/pages/publish/publish?type=article"  bgClass="bg-blue"></publish>	
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import util from '@/utils/util.js';
	import publish from "@/components/xmz/xmz-publishbotton.vue"		
	export default {
		components:{
			publish
		},	
		computed: {
			...mapState(['userInfo', 'hasLogin','system_config'])
		},
		data() {
			return {
				cardCur: 0,
				searchKeyword: '',
				isCard: true,
				isBack: false,
				isLoad: true,
				article_list: [],
				recommend_column: [],
				hot_column: [],
				page: 0,
				res_count: 0,
				TabCur: 0,
				topic_day: 0
			}
		},
		onLoad: function(e) {
			this.getIndex()
		},
		//下拉刷新
		onPullDownRefresh: function() {
			this.intGetList()
		},
		//上拉加载
		onReachBottom: function() {
			// this.getIndex();
		},
		//分享到微信聊天
		onShareAppMessage: function(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			return {
			  title: '这些专栏都很不错，推荐你看看'
			}			
		},	
		methods: {
			intGetList: function() {
				this.reload = true;
				this.last_id = 0
				this.page = 0
				this.isLastPage = false
				this.getIndex();
			},
			//获取首页
			getIndex: function() {
				var userInfo = this.userInfo
				var data = []
				// data.member_id = userInfo.member_id
				data.sort = 'sum'

				this.$api.getColumn(data).then(res => {

					var article_list = res.data.rsm.article_list
					var recommend_column = res.data.rsm.recommend_column
					var hot_column = res.data.rsm.hot_column

					if (recommend_column) {
						this.article_list = article_list
						this.recommend_column = recommend_column
						this.hot_column = hot_column

					} else {
						util.errorToast('专栏未开启')
					}

				}).catch(err => {
					console.log('请求失败，可以在这里写处理代码', err);
				})

			},
			toDetail: function(e) {
				var column_id = e.currentTarget.dataset.column_id;
				if (column_id > 0) {
					uni.navigateTo({
						url: 'detail?column_id=' + column_id
					})
				} else {
					util.showToast('专栏id有误')
				}
			},
			toArticle: function(e) {
				uni.navigateTo({
					url: '../article/article'
				})
			},
			tabSelect(e) {
				var TabCur = e.currentTarget.dataset.id;
				this.TabCur = TabCur
				this.topic_day = TabCur
				console.log('切换到', this.tabArr[TabCur]);
				this.intGetList()
			},
			toArticleDetail(e) {
				var article_id = e.currentTarget.dataset.article_id;
				if (article_id > 0) {
					uni.navigateTo({
						url: '../article/detail?article_id=' + article_id
					})
				} else {
					util.errorToast('文章ID出错')
				}
			}
		}
	}
</script>
<style>
	.swiper-title {
		position: absolute;
		left: 0px;
		bottom: 0;
		width: 460px;
		height: 44px;
		line-height: 44px;
		overflow: hidden;
		background-color: #000000;
		opacity: 0.5;
	}
</style>
