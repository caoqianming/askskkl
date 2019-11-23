<template>
	<view>
		<view class="publish_botton right_bottom" :class="bgClass" @click="toClick(btnPath)">
			<view class="text-xxl" :class="btnIcon"></view>
			<view class="text-sm">{{btnText}}</view>
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
			bgClass:{
				type: String,
				default: 'bg-blue'
			},			
			btnIcon:{
				type: String,
				default: 'cuIcon-write'
			},	
			btnText:{
				type: String,
				default: '提问'
			},	
			btnPath:{
				type: String,
				default: '/pages/publish/publish'
			},							
		},		
		methods: {
			toClick:function(btnPath){
				if(btnPath){
					// uni.navigateTo({
					// 	url:btnPath
					// })
					uni.redirectTo({
						url:btnPath
					})
				}else{
					console.warn('请配置跳转路径')
				}

			},			
		}
	}
</script>

<style>

.publish_botton{
overflow: hidden;
z-index: 9999;
position: fixed;
text-align:center;
width: 100upx;
height: 100upx;
border-radius: 50%;
padding:20upx 5px;
}
/*右上角*/
.publish_botton.right_top{
right: 10px;
top: 10px;
}


/*右下角*/
.publish_botton.right_bottom{
right: 10px;
bottom: 10px;
}


/*屏幕中间*/
.publish_botton.center_{
right: 45%;
top: 50%;
}


/*左上角*/
.publish_botton.left_top{
left: 10px;
top: 10px;
}


/*左下角*/
.publish_botton.left_bottom{
left: 10px;
bottom: 10px;
}
</style>
