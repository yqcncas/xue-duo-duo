<template>
	<view class="outline">
		<view class="outline-item" v-for="(item, index) in outlineLesson" :key = "index">
			<view class="outline-item-left">第{{index}}节</view>
			<view class="outline-item-right">
				<view class="outline-item-right-top">{{item.name}}</view>
				<view class="outline-item-right-bottom">{{item.createTime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			console.log(options.allLesson)
			this.outlineLesson = JSON.parse(options.allLesson)
		},
		data () {
			return {
				outlineLesson: []
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	.outline{
		background-color: #fff;
		.outline-item{
			display: flex;
			height: 160rpx;
			padding: 30rpx;
			// align-items: center;
			box-sizing: border-box;
			border-bottom:1rpx solid #F7F7F7;
			.outline-item-left{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: -0.34px;
			}
			.outline-item-right{
				display: flex;
				flex-direction: column;
				margin-left: 30rpx;
				box-sizing: border-box;
				.outline-item-right-top{
					// font-weight: bold;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #333333;
					letter-spacing: -0.34px;
				}
				.outline-item-right-bottom{
					margin-top: 20rpx;
					box-sizing: border-box;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #9B9B9B;
					letter-spacing: -0.34px;
				}
			}
		}
	}
</style>
