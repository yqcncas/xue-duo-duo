<template>
	<view class="submit" @click="submitClick">{{submitText}}</view>
</template>

<script>
	export default {
		props:{
			submitText:{
				type: String,
				required: true
			}
		},
		methods: {
			submitClick () {
				this.$emit('submitClick')
			}
		}
	}
</script>

<style lang="less">
	.submit{
		width: 100%;
		height: 100rpx;
		background-color: #f40;
		color: #FFFFFF;
		text-align: center;
		line-height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 0;
	}
</style>
