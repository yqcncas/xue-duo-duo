<template>
	<view class="homeMain">
		<scroll-view scroll-x="true" :scroll-into-view = "tochildId" scroll-with-animation style="{height: 60rpx;}">
			<view class="scroll-item-wrapper">
				<view class="scroll-item-ul">
					<view class="scroll-item" :id="scrollList.childId" :class="{active: currentIndex === index}" @click="handleCurrentIndex(index)" v-for="(scrollList, index) in scrollTab" :key = "scrollList.dictValue">{{scrollList.dictLabel}}</view>
				</view>
			</view>
		</scroll-view>
		<!-- <swiper :style="{height: swiperHeight + 'rpx'}" :current="currentIndex" @change="swiperChange"> -->
		<!-- <swiper :current="currentIndex" @change="swiperChange" :style="{height: 100+ 'vh'}">
			<swiper-item v-for="(swiperBlock, index) in scrollItem" :key = 'index'> -->
				<!-- <HomeMainList></HomeMainList> -->
				<swiper :style="{height: newswiperHeight + 'rpx'}" @change="swiperChange" :current="currentIndex">
					<swiper-item v-for="(swiperItem, swiperItemIndex) in scrollTab" :key = "swiperItemIndex" style="background-color: #F7F7F7;">
						<view class="homeMainList" v-if="LessonList.length">
							<view class="swiper-item homeMain-scroll-swiper" v-for="(lesson, index) in LessonList" :key = "index" ref = "swiperRef" @click.stop="goToLessonDetail(lesson.courseId)">
								<view class="homeMain-scroll-swiper-item">
									<view class="homeMain-scroll-swiper-item-top">
										<view class="homeMain-scroll-swiper-item-text">
											<!-- <image src="../../static/image/index/tip.png" mode=""></image> -->
											<image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAA8CAYAAAHXtD55AAAABGdBTUEAALGPC/xhBQAABSFJREFUeAHtXD1sHEUUnrdek8QWGOEqqUKaICOhpAwmFQYJCQefsVFC4TshQ0MRaJOGAqhSBEWhID+6swSJOMt3JFDFqVBImTRISZOkwkjGJgSRvzvv4721Jtrb3F3udqWb23kzxc3O3uy8933f/O3s7EIwN4UqRfBSXKsA1PV0BZSqexMX4C1Ugb1PXADmp26nKwDVTi4A0qrAhaQKqT1ITCK7zUokLgBGhkfCQpISACe+v5eqAG04MQQtf+ICtAdqcWI8VXNOXQ+eeJLgIFU1SGCv4ZLUvUFDaV0mtHG+LH0lSGHciAO6+mu/e84AG2Yn8KPcPj422gpAwQOjDhihn2nnYMy4sc4HwJs3hhxKS2eMGDfW43HzYsQ69LjCwZfaMMc9NY4q+MqYcTYc7ed7ilyjRsR0M35dUJIY87mArzOCnA2TA+fMGUc86P/y98bwowfr/80sXwl1YK96FYwOqb0C2cwOKO+o3+wP28/BVm8HfLe0Ig68sbHVZI2icX0jCpx9Mdbb9ZIIWkS7DAuVp2q59eDBGzgApepEM7KfYqNZpqyeg12DW+CL8uNW/lutPN6qPWoFnM9bDZ4Bbi5UzO7m43iwHjwDxnrtBhZyx0WCDwkI8DDO5f6KEiBCeQ0YFY5Gbyblzu1pJPCrf64WgkAVNTsm7q60baPx4sQbvxt1oMfG5VZ7gAuiOrxoxYJS5T2R4AH8cK4vDjytld2D0uJlrgXiwKt3B1/S1V8UeAA4DR+UN2SCL1U+1sA5FqM8eIN7o8DFgKf1uxUolq/LBL9Q2REHLkJ58ODrZsBlgC9WjooED97Wl1sBt1p5msndhOL5OyLB08bEpouWUTKsHudpv/CFKNj4sd3gUU3i57Pb4qB12mrwIci1+l0NNh5bD55WbJ+j6n8oDpzT1oNnkIjqB47jQQR4Bk0PLH6TC17hPvw0NxolQIzyIeh/cVUseJr4AM5NHdYEyFKeUBMBT57WigPPqpP6NziW+8SG7vj8ysrqfRoHh5gJDpIeVHrvX7oyrMArbUKX9Ru2+ZlLvxb8Qe9VWdAFt3lpQmu84Rsm3pYxkSOdJkFazCt7apf/Iq/uWb35VJqw7fDSI9pztB3jQ53HtXjNhMUxtfTPoqIzVNfi7RYclQ/jcLZyNQ7TCR9nxJI0TeLW1PNqN5ysrDWD5IRvxkrGz5HoV1VpaZzG9ZZfUXFjfMZFjrtPW1C+offnXm8nOl/jWnycuQynSfRDUKyc7wSCE74Tlvo8D3Xtj5XvvwZnyzc7ddV19Z0y1af56NXoO2qUFmW6EJ2huBbfp4J24haJfpFeCz/QSd54Htfi44xkJM0fOUkqOkN0wmdE6Kibm2vuA8ei57o9dsJ3y1gf5A93Et+q38XCwZ1J3XHCJ2XO8HW0lXQbBg9vY37ajfGGtTBiHjH4ib7/0fAtw04ccS2+E5b6PA8GeIQ2ki9346bYXXfdkJSVvLSQs6JGhl7RX21v57dr8e3Yydh/NO5vV//cX8fC7J5nue6EfxZDGfufxB/AoHYN56bn27nuhG/HTob/o49Xn6IPGJ9qBcEJ34oZC87Td7vnadJ3DX+cHYjDccLHGbEsTW+M7FE/19bxk+ntUWhO+Cgblh7TSt8L+DD4A/Mzb2qITnjNhIAYsb5Mk74jDNXdxwsQPA4xfJzLJ6vv7B+r17BMb1OOxTNJepMwjt3mND3hawxLb4/naULwrX6N1AnfyI/1qYuTk0OLb+0vWg9UKMD/AaY9V5KquW8fAAAAAElFTkSuQmCC" mode=""></image>
											<view class="tip-text">{{scrollTab[currentIndex].dictLabel}}</view>
										</view>
										<view class="homeMain-scroll-swiper-item-top-price">¥{{lesson.price}}</view>
									</view>
									<view class="homeMain-scroll-swiper-item-center">
										<h3 class="homeMain-scroll-swiper-item-center-title">{{lesson.name}}</h3>
										<view class="homeMain-scroll-swiper-item-center-time">{{lesson.classTime}}</view>
									</view>
									<view class="homeMain-scroll-swiper-item-bottom">
										<view class="homeMain-scroll-swiper-item-bottom-left-box">
											<view class="homeMain-scroll-swiper-item-bottom-left" v-for="lessonTeachers in lesson.teachers" :key = "lessonTeachers.userId">
												<image :src= "lessonTeachers.pic" mode=""></image>
												<view>{{lessonTeachers.userName}}</view>
											</view>
										</view>
										<view class="homeMain-scroll-swiper-item-bottom-right">
											<view class="homeMain-scroll-swiper-item-bottom-right-top">
												共{{lesson.childNum}}讲
											</view>
											<view class="homeMain-scroll-swiper-item-bottom-right-bottom">
												<view class="star">
													<image src="../../static/image/index/contextstar.png" mode="" v-for="(star, index) in lesson.level" :key = "index"></image>
												</view>
												<view class="homeMain-scroll-swiper-item-bottom-right-bottom-text">
													推荐
												</view>
											</view>
										</view>
									</view>
									
								</view>
							</view>
						</view>
						<view class="homeMainList noList" v-else>暂无更多数据</view>
					</swiper-item>
					<!-- <uni-load-more bgColor="#f7f7f7" :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more> -->
				</swiper>
				
				
	<!-- 		</swiper-item>
		</swiper> -->
		<view class="line-30"></view>
	
	</view>
</template>

<script>
	// import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		
		computed:{
			newswiperHeight() {
				if (this.LessonList.length <= 0) {
					this.LessonList.length = 1
				}
				return this.LessonList.length * 400
			}
		},
		data () {
			return {
				scrollItem: ['作文', '英语', '数学', '奥数', '其他', '其他'],
				currentIndex: 0,
				swiperHeight: 0,
				tochildId: ''
			}
		},
		components: {
			// uniLoadMore
		},
		methods: {
			// 更改Scroll选中
			handleCurrentIndex (index) {
				this.currentIndex = index
				this.tochildId = this.scrollTab[this.currentIndex].childId
				this.$emit('handleCurrentIndex', this.currentIndex)
			},
			swiperChange (e) {
				this.currentIndex = e.mp.detail.current
				this.tochildId = this.scrollTab[this.currentIndex].childId
				this.$emit('handleCurrentIndex', this.currentIndex)
			},
			// 去课程详情
			goToLessonDetail (courseId) {
				this.$emit('goToLessonDetail', courseId)
			}
		},
		props: {
			scrollTab: {
				type: Array,
				required: true
			},
			LessonList: {
				type: Array,
				required: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.homeMain{
		width: 100%;
		min-height: 90rpx;
		background-color: #fff;
		.scroll-item-wrapper{
			// display: inline-block;
			// overflow: hidden;
			display: flex;
			justify-content: space-between;
			// align-items: center;
			// padding-top: 60rpx;
			box-sizing: border-box;
			.scroll-item-ul{
				display: inline-block;
				white-space: nowrap;
				.scroll-item{
					height: 60rpx;
					display: inline-block;
					text-align: center;
					width: 130rpx;
					font-size: 14px;
					color: #C0C0C0;
					opacity: 0.8;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #9B9B9B;
					letter-spacing: -0.34px;
					position: relative;
					&::after{
						content: '';
						width: 0;
						height: 0;
						border-bottom: 4rpx solid #f40;
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translateX(-50%);
						transition: all .5s;
					}
					&.active{
						font-size: 16px;
						color: #f40;
						font-weight: bold;
						&::after{
							width: 20%;
						}
					}
				}
			}
		}
		.noList{
			text-align: center;
			line-height: 160rpx;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #B0B2C6;
			letter-spacing: -0.34px;

		}
		.homeMain-scroll-swiper{
			padding: 30rpx;
			padding-bottom: 0;
			box-sizing: border-box;
			background-color: #f7f7f7;
			border-radius: 7rpx;
			.homeMain-scroll-swiper-item{
				width: 690rpx;
				height: 362rpx;
				border-radius: 7px;
				// padding: 30rpx;
				background-color: #fff;
				.homeMain-scroll-swiper-item-top{
					padding: 30rpx;
					padding-bottom: 0;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					.homeMain-scroll-swiper-item-text{
						position: relative;
						left: -40rpx;
						image{
							width: 126rpx;
							height: 54rpx;
							
						}
						.tip-text{
							position: absolute;
							font-size: 12px;
							color: #FFFFFF;
							left: 50%;
							top: 40%;
							transform: translate(-50%,-50%);
						}
					}
					.homeMain-scroll-swiper-item-top-price{
						font-family: PingFangSC-Semibold;
						font-size: 22px;
						color: #FF0000;
						letter-spacing: -0.53px;
					}
				}
				.homeMain-scroll-swiper-item-center{
					padding-top: 20rpx;
					padding-left: 30rpx;
					box-sizing: border-box;
					.homeMain-scroll-swiper-item-center-title{
						font-weight: bold;
						font-family: PingFangSC-Semibold;
						font-size: 17px;
						color: #0D1550;
						letter-spacing: -0.41px;
					}
					.homeMain-scroll-swiper-item-center-time{
						padding-bottom: 30rpx;
						padding-top: 10rpx;
						box-sizing: border-box;
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #B0B2C6;
						letter-spacing: -0.34px;
					}
				}
				.homeMain-scroll-swiper-item-bottom{
					padding: 0 30rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					.homeMain-scroll-swiper-item-bottom-left-box{
						flex: 1;
						display: flex;
						.homeMain-scroll-swiper-item-bottom-left{
							display: flex;
							flex-direction: column;
							align-items: center;
							padding-left: 40rpx;
							box-sizing: border-box;
							&:nth-child(1){
								padding-left: 0;
							}
							image{
								width: 56rpx;
								height: 56rpx;
								border-radius: 50%;
							}
							view{
								padding-top: 10rpx;
								box-sizing: border-box;
								font-family: PingFangSC-Regular;
								font-size: 12px;
								color: #0D1550;
								letter-spacing: -0.29px;
							}
						}
					}
					
					.homeMain-scroll-swiper-item-bottom-right{
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						.homeMain-scroll-swiper-item-bottom-right-top{
							padding-bottom: 20rpx;
							box-sizing: border-box;
							font-family: PingFangSC-Regular;
							font-size: 14px;
							color: #FE5E50;
							letter-spacing: -0.34px;
						}
						.homeMain-scroll-swiper-item-bottom-right-bottom{
							display: flex;
							.star{
								image{
									width: 28rpx;
									height: 28rpx;
									margin-left: 6rpx;
									box-sizing: border-box;
								}
							}
							.homeMain-scroll-swiper-item-bottom-right-bottom-text{
								margin-left: 20rpx;
								box-sizing: border-box;
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #B0B2C6;
								letter-spacing: -0.34px;
							}
						}
					}
				}
			}
		}
	}
</style>
