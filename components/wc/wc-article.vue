<template>
	<view>
		<view class="cu-card article" :class="isCard?'no-card':''">
			<view class="cu-item shadow" v-for="(item,index) in listData" :key="index" v-if="item.is_del != 1" @click="toArticleDetail" :data-id="item.id">
				<view class="title"><view class="text-cut">{{item.title}}</view></view>
				<view class="content">
					<image :src="item.article_img?item.article_img:'../../static/img/default-cover.jpg'" mode="aspectFill"></image>
					<view class="desc">
						<view class="text-content texts-ellipsis">{{item.message}}</view>
						<view>
							<view class="text-sm text-gray">{{item.user_info.user_name?item.user_info.user_name:''}} 发布于 {{item.add_time}}</view>
							<!-- <view class="cu-tag bg-red light sm round">标签话题</view> -->
						</view>
					</view>
				</view>
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
			toArticleDetail:function(e){
				var id = e.currentTarget.dataset.id;
				if(id > 0){
					uni.navigateTo({
						url:'../article/detail?id=' + id
					})
				}else{
					util.showToast('ID有误')
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
.screen-swiper .shadow{
	width:100%;
	position:absolute;
	bottom:1upx;
	left:0px;
	z-index:10;
	height:24px;
	background:rgba(0,0,0,0.6)
 }

.cu-card.article>.cu-item .content .text-content {
	font-size: 28rpx;
	color: #888;
	height: 4.8em;
	overflow: hidden;
}
.texts-ellipsis {
	text-overflow: ellipsis;
	display: -webkit-box;
	word-break: break-all;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2; 
}
</style>
