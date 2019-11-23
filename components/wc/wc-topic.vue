<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input :adjust-position="false" type="text" placeholder="输入话题名称" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-blue shadow-blur round sm">搜索</button>
			</view>
		</view>
		<view class="">
			<slot name="addTopic"></slot>
		</view>
		
		<view>
			<view class="cu-bar bg-white margin-top solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text>
					<text>最近话题</text>
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in listData" :key="index" @tap="toDetail" :data-topic_id="item.topic_id">
					<view class="cu-avatar radius lg" :style="'background-image:url('+item.topic_pic+');'" v-if="item.topic_pic"></view>
					<view class="cu-avatar lg" v-if="!item.topic_pic">#</view>
					<view class="content">
						<view class="text-cut">{{item.topic_title}}</view>
					</view> 
					<view class="action">
						<button class="cu-btn sm">添加</button>
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
			isAdd:{
				type: Boolean,
				default: false
			},
			listData:{
				type: Array,
				default: []
			},				
		},		
		methods: {
					
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
