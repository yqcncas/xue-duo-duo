<template>
	<view class="homeheader">
		<view class="homeheader-left-box" @click="goToClassTrue" :class="{xialaWidth: homeHeaderClassTrue.name == undefined}">
			<view class="homeheader-left-box-text" style="font-size: 14px;">{{homeHeaderClassTrue.name}}</view>
			<image src="../../static/image/index/daosanjiao.png" mode=""></image>
		</view>
		<view class="homeheader-center" @click.stop="goToSearch">
			<input :disabled="true" type="text"  value="请输入关键字" placeholder-class= "ip-center">
			<image src="../../static/image/index/Search.png" mode=""></image>
		</view>
		<view class="homeheader-right" @click="goToShopCart">
			<image src="../../static/image/index/gouwuche2-copy.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				searchFlag: true
			}
		},
	
		methods: {
			goToClassTrue () {
				console.log(this.homeHeaderClassTrue.name == undefined)
				uni.navigateTo({
					url: '../../pages/ClassTrue/ClassTrue?infoOrindex=' + 2
				})
			},
			goToSearch () {
				if (this.searchFlag) {
					this.searchFlag = false
					setTimeout(() => {
						this.searchFlag = true
					}, 700)
					uni.navigateTo({
						url: '../../pages/search/search'
					})
				}
				
			},
			goToShopCart () {
				uni.navigateTo({
					url: '../../pages/Shopcart/ShopCart'
				})
			}
		},
		props: {
			homeHeaderClassTrue: {
				type: Object
			}
		}
	}
</script>

<style lang="less" scoped>
	.homeheader{
		width: 100%;
		// height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		padding: 0 30rpx;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		z-index: 999;
		.homeheader-left-box{
			// padding-right: 30rpx;
			box-sizing: border-box;
			width: 130rpx;
			height: 100%;
			display: flex;
			align-items: center;
			image{
				width: 32rpx;
				height: 32rpx;
				margin-left: 10rpx;
				box-sizing: border-box;
			}
			&.xialaWidth{
				// width: 80rpx;
			}
		}
		.homeheader-center{
			padding-left: 10rpx;
			flex: 1;
			display: flex;
			align-items: center;
			position: relative;
			input{
				flex: 1;
				// width: 482rpx;
				height: 60rpx;
				background: #F7F7F7;
				border-radius: 15px;
				opacity: 0.8;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				line-height: 22px;
				text-align:center;
				line-height: normal;
			}
		
			image{
				width: 28rpx;
				height: 28rpx;
				position: absolute;
				left: 120rpx;
			}
			
		}
		.homeheader-right{
			padding-left: 48rpx;
			box-sizing: border-box;
			image{
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
