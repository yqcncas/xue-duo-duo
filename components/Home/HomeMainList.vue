<template>
	<!-- <view class="homeMainList">
		<view class="swiper-item homeMain-scroll-swiper" v-for="(lesson, index) in 7" :key = "index">
			<view class="homeMain-scroll-swiper-item">
				<view class="homeMain-scroll-swiper-item-top">
					<view class="homeMain-scroll-swiper-item-text">
						<image src="../../static/image/index/tip.png" mode=""></image>
						<view class="tip-text">语文</view>
					</view>
					<view class="homeMain-scroll-swiper-item-top-price">$1200</view>
				</view>
				<view class="homeMain-scroll-swiper-item-center">
					<h3 class="homeMain-scroll-swiper-item-center-title">初中语文阅读写作直播班</h3>
					<view class="homeMain-scroll-swiper-item-center-time">10月7日至12月28日每周六</view>
				</view>
				<view class="homeMain-scroll-swiper-item-bottom">
					<view class="homeMain-scroll-swiper-item-bottom-left">
						<image src="../../static/image/tabbar/find-active.png" mode=""></image>
						<view>测试员</view>
					</view>
					<view class="homeMain-scroll-swiper-item-bottom-right">
						<view class="homeMain-scroll-swiper-item-bottom-right-top">
							共30讲
						</view>
						<view class="homeMain-scroll-swiper-item-bottom-right-bottom">
							<view class="star">
								<image src="../../static/image/index/contextstar.png" mode=""></image>
								<image src="../../static/image/index/contextstar.png" mode=""></image>
								<image src="../../static/image/index/contextstar.png" mode=""></image>
							</view>
							<view class="homeMain-scroll-swiper-item-bottom-right-bottom-text">
								推荐
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</view> -->
</template>

<script>
	export default {
		mounted () {
			const query = uni.createSelectorQuery().in(this);
			query.select('.homeMain-scroll-swiper-item').boundingClientRect(data => {
			  console.log("得到布局位置信息" + JSON.stringify(data));
			  // console.log("节点离页面顶部的距离为" + data.top);
			  console.log()
			  this.swiperHeight = (data.height * 2 + 60) * 7
			}).exec();
		},
		data () {
			return {
				swiperHeight: 0
			}
		}
		
	}
</script>

<style lang="less" scoped>
	.homeMain-scroll-swiper{
		padding: 30rpx;
		box-sizing: border-box;
		.homeMain-scroll-swiper-item{
			
			.homeMain-scroll-swiper-item-top{
				display: flex;
				justify-content: space-between;
				.homeMain-scroll-swiper-item-text{
					position: relative;
					image{
						width: 100rpx;
						height: 40rpx;
						
					}
					.tip-text{
						position: absolute;
						font-size: 12px;
						color: #f40;
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
					}
				}
			}
			.homeMain-scroll-swiper-item-center{
				.homeMain-scroll-swiper-item-center-title{
					font-weight: bold;
				}
				.homeMain-scroll-swiper-item-center-time{
					font-size: 14px;
					color: #333;
				}
			}
			.homeMain-scroll-swiper-item-bottom{
				display: flex;
				justify-content: space-between;
				.homeMain-scroll-swiper-item-bottom-left{
					display: flex;
					flex-direction: column;
					align-items: center;
					image{
						width: 32rpx;
						height: 32rpx;
					}
				}
				.homeMain-scroll-swiper-item-bottom-right{
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					.homeMain-scroll-swiper-item-bottom-right-bottom{
						display: flex;
						.star{
							image{
								width: 24rpx;
								height: 24rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
