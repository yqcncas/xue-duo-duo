<template>
	<view class="homeBanner">
		<swiper :indicator-dots="true" :autoplay="true" v-if="bannerList.length">
			<swiper-item v-for="bannerItem in bannerList" :key = "bannerItem.actId" @tap.stop="goToActivity(bannerItem, bannerItem.actId)">
				<view class="swiper-item">
					<image :src="bannerItem.pic" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="homeBanner-item-box">
			<view class="homeBanner-item-ui">
				<view class="homeBanner-item-li"  @click="bannergoTo(0)">
					<view class="homeBanner-item-li-bottom">
						<image src="../../static/image/index/dingzhi.png" mode=""></image>
					</view>
					<view class="homeBanner-item-li-top">
						定制
					</view>
					
				</view>
				<view class="homeBanner-item-li"  @click="bannergoTo(1)">
					<view class="homeBanner-item-li-bottom">
						<image src="../../static/image/index/pintuan.png" mode=""></image>
					</view>
					<view class="homeBanner-item-li-top">
						拼团
					</view>
					
				</view>
				<view class="homeBanner-item-li"  @click="bannergoTo(2)">
					<view class="homeBanner-item-li-bottom">
						<image src="../../static/image/index/zhuanti.png" mode=""></image>
					</view>
					<view class="homeBanner-item-li-top">
						专题
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			
		},
		mounted() {
			console.log(this.bannerList)
		},
		props: {
			bannerList: {
				type: Array,
				required: true
			}
		},
		data () {
			return{
				richText: ''
			}
		},
		methods: {
			bannergoTo (index) {
				this.$emit("bannergoTo", index)
			},
			goToActivity (bannerItem, actId) {
				if (bannerItem.type == 1) {
					uni.navigateTo({
						url: '../LessonDetail/LessonDetail?courseId=' + actId + '&grOrLes=' + 2
					})
				} else if (bannerItem.type == 2) {
					this.initChapterList(bannerItem.actId)
				}
				
			},
			async initChapterList (id) {
				let {data: res} = await this.$fetch(this.$api.articleList,{typeId: id})
				console.log(res)
				this.richText = res[0].articleContent
				uni.setStorageSync('richText', this.richText)
				uni.navigateTo({
					url: "../rich-text/rich-text"
				})
			}
			
		}
		
	}
</script>

<style lang="less">
	.homeBanner{
		width: 100%;
		// height: 520rpx;
		padding: 30rpx;
		padding-top: 90rpx;
		box-sizing: border-box;
		background-color: #fff;
		.swiper-item{
			// width: 690rpx;
			// height: 270rpx;
			width: 100%;
			height: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.homeBanner-item-box{
			padding-top: 30rpx;
			box-sizing: border-box;
			.homeBanner-item-ui{
				width: 100%;
				display: flex;
				
				.homeBanner-item-li{
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.homeBanner-item-li-top{
						padding-top: 20rpx;
						box-sizing: border-box;
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #9B9B9B;
						letter-spacing: -0.34px;
						text-align: center;
					}
					.homeBanner-item-li-bottom{
						image{
							width: 90rpx;
							height: 90rpx;
							border-radius: 20px;
						}
					}
				}
			}
		}
	}
</style>
