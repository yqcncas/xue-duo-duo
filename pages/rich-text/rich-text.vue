<template>
	<view class="rich-text">
		<view>
			<parser :html="richTextMain"></parser>
			
		</view>
	</view>
</template>

<script>
	import parser from "@/components/jyf-Parser/index"
	export default {
		onLoad (options) {
			
			this.richTextMain = uni.getStorageSync('richText')
			if (options.titleName) {
				this.titleName = options.titleName
				uni.setNavigationBarTitle({
				    title: this.titleName
				});
			}
			uni.removeStorageSync('richText')
			
		},
		data () {
			return {
				id: null,
				richTextMain: '',
				titleName: ''
			}
		},
		components:{
			parser
		},
		methods:{
			
		}
	}
</script>

<style>
	/* page:after{
		display: none;
	} */
	.rich-text{
		padding: 30rpx;
		box-sizing: border-box;
		font-size: 14px;
	}
</style>
