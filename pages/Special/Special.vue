<template>
	<view class="special">
		<view class="special-header">
			<view class="special-header-left">
				<view class="special-header-left-text">
					<picker :range="lessonSelsect" @change = "handleLessons">
						<!-- <view>学科</view>
						<image src="../../static/image/index/downpush.png" mode=""></image> -->
						<view class="box">
							<view>学科</view>
							<image src="../../static/image/index/downpush.png" mode="aspectFill"></image>
						</view>
					</picker>
				</view>
				
				
			</view>
			<view class="special-header-right" @click="handleTimerIndex">
				<view class="special-header-right-text">
					时间
				<!-- 	<picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
						<view class="uni-input">{{time}}</view>
					</picker> -->
				</view>
				<view class="down-and-top-box">
					<image src="../../static/image/index/18.png" mode="" v-if="timerIndex === 0"></image>
					<image src="../../static/image/index/19.png" mode="" v-if="timerIndex === 1"></image>
					<image src="../../static/image/index/20.png" mode="" v-if="timerIndex === 2"></image>
				</view>
				
			</view>
			
		</view>
		<view class="special-main">
			<view class="homeMainList" v-for="(item, index) in LessonList" :key="index">
				<view class="swiper-item homeMain-scroll-swiper">
					<view class="homeMain-scroll-swiper-item" @click.stop="goToLessonDetail(item.courseId)">
						<view class="homeMain-scroll-swiper-item-top">
							<view class="homeMain-scroll-swiper-item-text">
								<image src="../../static/image/index/tip.png" mode=""></image>
								<view class="tip-text">{{item.courseTypeName}}</view>
							</view>
							<view class="homeMain-scroll-swiper-item-top-price">¥{{item.price}}</view>
						</view>
						<view class="homeMain-scroll-swiper-item-center">
							<h3 class="homeMain-scroll-swiper-item-center-title">{{item.name}}</h3>
							<view class="homeMain-scroll-swiper-item-center-time">{{item.classTime}}</view>
						</view>
						<view class="homeMain-scroll-swiper-item-bottom">
							<view class="homeMain-scroll-swiper-item-bottom-left-box">
								<view class="homeMain-scroll-swiper-item-bottom-left" v-for="teachers in item.teachers" :key = "teachers.userId">
									<image :src= "teachers.pic" mode=""></image>
									<view>{{teachers.userName}}</view>
								</view>
							</view>
						
							<view class="homeMain-scroll-swiper-item-bottom-right">
								<view class="homeMain-scroll-swiper-item-bottom-right-top">
									共{{item.childNum}}讲
								</view>
								<view class="homeMain-scroll-swiper-item-bottom-right-bottom">
									<view class="star">
										<image src="../../static/image/index/contextstar.png" mode="" v-for="(star,i) in item.level" :key = "i"></image>
										<!-- <image src="../../static/image/index/contextstar.png" mode=""></image>
										<image src="../../static/image/index/contextstar.png" mode=""></image> -->
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
			<view class="line-30"></view>
		</view>
		<uni-load-more :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
	</view>
</template>

<script>
	import baseURL from '@/config/index.js'
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue'
	import HomeMainList from '../../components/Home/HomeMainList.vue'
	export default {
		onLoad() {
			this.initLessonTab()
			this.initSpcecialList()
		},
		data () {
			return {
				headerLessonPicker: false,
				timerIndex: 0,
				lessonSelsect: [],
				lessonSelsectId: [],
				lessonPickerId: 0,
				LessonList: [],
				hasFlag: true,
				orderBy: '',
				pageNum: 0
			}
		},
		components:{
			HomeMainList,
			uniLoadMore
		},
		methods: {
			handleHeaderLessonPicker () {
				this.headerLessonPicker = !this.headerLessonPicker
			},
			handleLessons (e) {
				console.log(e)
				this.lessonPickerId = this.lessonSelsectId[e.detail.value]
				this.pageNum = 0
				this.hasFlag = true
				this.timerIndex = 0
				this.LessonList = []
				this.initSpcecialList()
			},
			async handleTimerIndex () {
				this.timerIndex++
				this.pageNum = 0
				this.hasFlag = true
				this.LessonList = []
				if (this.timerIndex > 2) {
					this.timerIndex = 0
				}
				if (this.timerIndex == 1) {
					this.orderBy = 'asc'
				} else {
					this.orderBy = "desc"
				}
				if (this.timerIndex == 0) {
					this.orderBy = 'asc'
				}
				this.initSpcecialList()
				
			},
			// 初始化列表
			async initSpcecialList () {
				// 进来初始化的列表
				if (!this.lessonPickerId) {
					if (!this.hasFlag) return
					this.pageNum = ++this.pageNum
					let res = await this.$fetch(this.$api.getCourseList, {isAssemble: 0, isAsc: this.orderBy, orderByColumn: 'courseId', pageSize: 10, pageNum: this.pageNum}, 'GET', 'FORM')
					this.LessonList = [...this.LessonList, ...res.rows]
					this.LessonList.forEach(item => {
						item.teachers.forEach(teachers => {
							teachers.avatar = baseURL.slice(0, baseURL.length - 1) + teachers.avatar
						})
					})
					this.hasFlag = this.pageNum * 10 < res.total
				} else {
					// 选择学科后的列表
					console.log(this.lessonPickerId)
					if (!this.hasFlag) return
					this.pageNum = ++this.pageNum
					let res = await this.$fetch(this.$api.getCourseList, {isAssemble: 0, courseTypeId: this.lessonPickerId, isAsc: this.orderBy, orderByColumn: 'courseId',pageSize: 10, pageNum: this.pageNum}, 'GET', 'FORM')
					this.LessonList = [...this.LessonList, ...res.rows]
					this.LessonList.forEach(item => {
						item.teachers.forEach(teachers => {
							teachers.avatar = baseURL.slice(0, baseURL.length - 1) + teachers.avatar
						})
					})
					this.hasFlag = this.pageNum * 10 < res.total
				}
				
			},
			// 初始化学科
			async initLessonTab () {
				let {data: res} = await this.$fetch(this.$api.getCourseType, {}, 'Get')
				this.lessonList = res
				for (let i = 0; i < this.lessonList.length; i++) {
					this.lessonSelsect.push(this.lessonList[i].dictLabel)
					this.lessonSelsectId.push(this.lessonList[i].dictValue)
				}
			},
			// 去课程详情
			goToLessonDetail (courseId) {
				uni.navigateTo({
					url: '../LessonDetail/LessonDetail?courseId=' + courseId
				})
			}
		},
		onReachBottom() {
			if (this.hasFlag) {
				this.initSpcecialList()
			}
		}
	}
</script>

<style lang="less">
	page::after{
		display: none;
	}
	.special{
		.special-header{
			height: 90rpx;
			line-height: 90rpx;
			background-color: #fff;
			display: flex;
			justify-content: center;
			text-align: center;
			.special-header-left{
				flex: 1;
				display: flex;
				align-items: center;
				text-align: center;
				justify-content: center;
				image{
					width: 24rpx;
					height: 24rpx;
					margin-left: 20rpx;
					margin-top: 35rpx;
					box-sizing: border-box;
				}
				.special-header-left-text{
					width: 100%;
				}
				.box{
					width: 100%;
					display: flex;
					align-content: center;
					justify-content: center;
					height: 100%;
				}
			}
			.special-header-right{
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				.down-and-top-box{
					display: flex;
					flex-direction: column;
					image{
						width: 16rpx;
						height: 24rpx;
						margin-left: 20rpx;
						box-sizing: border-box;
					}
				}
			}
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
