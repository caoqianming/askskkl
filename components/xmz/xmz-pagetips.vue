<template>
    <view>
		<view class="margin-top padding-xs flex align-center">
			<view class="flex-sub text-center">
				<view class="text-xsl">
					<text :class="iconClass" :style="iconStyle"></text>
				</view>
				<view :class="textClass" :style="textStyle">{{tipsText}}</view>
			</view>
		</view>
		<view class="">
			<slot name="button"></slot>
		</view>
    </view>
</template>

<script>
export default {
	components:{

	},
	data() {
		return {

		}
	},
	props:{
		tipsText:{
			type: String,
			default: '暂无数据'
		},
		iconClass:{
			type: String,
			default: 'cuIcon-read text-gray'
		},
		iconStyle:{
			type: String,
			default: ''
		},					
		textClass:{
			type: String,
			default: 'text-gray'
		},
		textStyle:{
			type: String,
			default: ''
		},				
	},
	methods: {

	}
}
</script>

<style>

</style>