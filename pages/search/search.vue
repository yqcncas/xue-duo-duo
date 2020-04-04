<template>
	<view class="container">
		<view class="search-container">
			<view>
				<image src="/static/icon/27.png"></image>
				<input v-model="name" type="text" placeholder="请输入关键字" placeholder-style="opacity: 0.8;font-family: PingFangSC-Regular;font-size: 14px;color: #9B9B9B;"/>
			</view>
		</view>
		
		<view class="course-list">
			<view class="course-item" v-for="item in list" :key="item.courseId" @click="goToLessonDetail(item.courseId)">
				<!-- 课程名称 -->
				<view class="course-name">
					<image class="course-name-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAA8CAYAAAHXtD55AAAABGdBTUEAALGPC/xhBQAABSFJREFUeAHtXD1sHEUUnrdek8QWGOEqqUKaICOhpAwmFQYJCQefsVFC4TshQ0MRaJOGAqhSBEWhID+6swSJOMt3JFDFqVBImTRISZOkwkjGJgSRvzvv4721Jtrb3F3udqWb23kzxc3O3uy8933f/O3s7EIwN4UqRfBSXKsA1PV0BZSqexMX4C1Ugb1PXADmp26nKwDVTi4A0qrAhaQKqT1ITCK7zUokLgBGhkfCQpISACe+v5eqAG04MQQtf+ICtAdqcWI8VXNOXQ+eeJLgIFU1SGCv4ZLUvUFDaV0mtHG+LH0lSGHciAO6+mu/e84AG2Yn8KPcPj422gpAwQOjDhihn2nnYMy4sc4HwJs3hhxKS2eMGDfW43HzYsQ69LjCwZfaMMc9NY4q+MqYcTYc7ed7ilyjRsR0M35dUJIY87mArzOCnA2TA+fMGUc86P/y98bwowfr/80sXwl1YK96FYwOqb0C2cwOKO+o3+wP28/BVm8HfLe0Ig68sbHVZI2icX0jCpx9Mdbb9ZIIWkS7DAuVp2q59eDBGzgApepEM7KfYqNZpqyeg12DW+CL8uNW/lutPN6qPWoFnM9bDZ4Bbi5UzO7m43iwHjwDxnrtBhZyx0WCDwkI8DDO5f6KEiBCeQ0YFY5Gbyblzu1pJPCrf64WgkAVNTsm7q60baPx4sQbvxt1oMfG5VZ7gAuiOrxoxYJS5T2R4AH8cK4vDjytld2D0uJlrgXiwKt3B1/S1V8UeAA4DR+UN2SCL1U+1sA5FqM8eIN7o8DFgKf1uxUolq/LBL9Q2REHLkJ58ODrZsBlgC9WjooED97Wl1sBt1p5msndhOL5OyLB08bEpouWUTKsHudpv/CFKNj4sd3gUU3i57Pb4qB12mrwIci1+l0NNh5bD55WbJ+j6n8oDpzT1oNnkIjqB47jQQR4Bk0PLH6TC17hPvw0NxolQIzyIeh/cVUseJr4AM5NHdYEyFKeUBMBT57WigPPqpP6NziW+8SG7vj8ysrqfRoHh5gJDpIeVHrvX7oyrMArbUKX9Ru2+ZlLvxb8Qe9VWdAFt3lpQmu84Rsm3pYxkSOdJkFazCt7apf/Iq/uWb35VJqw7fDSI9pztB3jQ53HtXjNhMUxtfTPoqIzVNfi7RYclQ/jcLZyNQ7TCR9nxJI0TeLW1PNqN5ysrDWD5IRvxkrGz5HoV1VpaZzG9ZZfUXFjfMZFjrtPW1C+offnXm8nOl/jWnycuQynSfRDUKyc7wSCE74Tlvo8D3Xtj5XvvwZnyzc7ddV19Z0y1af56NXoO2qUFmW6EJ2huBbfp4J24haJfpFeCz/QSd54Htfi44xkJM0fOUkqOkN0wmdE6Kibm2vuA8ei57o9dsJ3y1gf5A93Et+q38XCwZ1J3XHCJ2XO8HW0lXQbBg9vY37ajfGGtTBiHjH4ib7/0fAtw04ccS2+E5b6PA8GeIQ2ki9346bYXXfdkJSVvLSQs6JGhl7RX21v57dr8e3Yydh/NO5vV//cX8fC7J5nue6EfxZDGfufxB/AoHYN56bn27nuhG/HTob/o49Xn6IPGJ9qBcEJ34oZC87Td7vnadJ3DX+cHYjDccLHGbEsTW+M7FE/19bxk+ntUWhO+Cgblh7TSt8L+DD4A/Mzb2qITnjNhIAYsb5Mk74jDNXdxwsQPA4xfJzLJ6vv7B+r17BMb1OOxTNJepMwjt3mND3hawxLb4/naULwrX6N1AnfyI/1qYuTk0OLb+0vWg9UKMD/AaY9V5KquW8fAAAAAElFTkSuQmCC"></image>
					<text class="course-name-text">{{ item.courseTypeName }}</text>
				</view> 
				<!-- 价格 -->
				<view class="price"><text class="price-text">¥{{ item.price }}</text></view>
				<!-- 课程标题 -->
				<text class="course-title">{{ item.name }}</text>
				<text class="course-time">{{ item.classTime }}</text>
				<!-- 课程难度 -->
				<view class="course-level">
					<text class="course-level-title">推荐</text>
					<image v-for="item in item.level" class="course-level-star" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAlFJREFUSA2dVU1LVUEYfuZeTdPyA+5O4kpUcMFbGiFEi36AVgvtmrRIilaS6xaB4V/QTdFeCP0BBS2Cyo8igoI+NlJguFDMrEVp9+2ZOdfDnDtHZ+4dGM7M+z7P887HO+8Bamgyhz55jP4aKMiEgmUeI8QukrHAQOOhPBUClAdoQQ5viC0YvGAVv3FG3cCGjx+2gxxKsbhWVOhCK276xCOoB8UzP8xjWaJoMQEVfMUf9Knr2EzYqyb+HWQw5IhrEYU8mjBWpedMD7wDrv5QZfW9DlMbBCsocxclbKX6aYwDyH1KHedVNqObowLJRX7PEXNxP3LFvkzsa44/8PuJnBWmwJqa4AGyKZnFMTTiHsdn2fMMmdN29vqa4CfZqwz2ngKTDRSfomGsPrUUlkIbrW3U1Cnd7L/kFI1gk6Cc4SVNcTvvgknhwI/UvpthBuhMGGSQV+FcL/It/mGA2p/NEXGgn/5lBnnipfoAgpf4i0tm4cTGd2Dqyhau0jbHLj6dVL/gKRd6RY3i+57fSUc+riPImhTr3gMFftd5LEWufM3GxzuwjO0cd1jz0OFRnofDcwNkcarOAE1MlqicW0tyAwhOW/7ahlmX6wYA0gtbSChdv6paIgAvOEt/TxUmmgrzA3jEPs0c2696FkwFtgQSAbBj6kje8uuE/WWEyzivhnCbfQK7/PELZlICddHXafOTARpNJXxWAWxT4CEJkXDJpK5xqWv4ooZxJw4E/IgceI6G5B/OfQf6B9+JCyR800+9EuzAD4/lBKvnSS7vhbqFbRv8HzgBjfYGEr3GAAAAAElFTkSuQmCC" mode="aspectFill"></image>
				</view>
				<!-- 讲师 -->
			<!-- 	<view class="teacher">
					<view class="teacher-left">
						<image class="teacher-avatar" :src="baseURL + item.avatar" mode="aspectFill"></image>
						<text class="teacher-name">{{ item.teacherName }}</text>
					</view>
					<text class="course-collection">共{{ item.childNum }}讲</text>
				</view> -->
				<view class="homeMain-scroll-swiper-item-bottom">
					<view class="homeMain-scroll-swiper-item-bottom-left-box">
						<view class="homeMain-scroll-swiper-item-bottom-left" v-for="lessonTeachers in item.teachers" :key = "lessonTeachers.userId">
							<image :src= "lessonTeachers.pic" mode=""></image>
							<view>{{lessonTeachers.userName}}</view>
						</view>
					</view>
					<view class="homeMain-scroll-swiper-item-bottom-right">
						<view class="homeMain-scroll-swiper-item-bottom-right-top">
							共{{item.childNum}}讲
						</view>
						<view class="homeMain-scroll-swiper-item-bottom-right-bottom">
							<view class="star">
								<image src="../../static/image/index/contextstar.png" mode="" v-for="(star, index) in item.level" :key = "index"></image>
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
		<uni-load-more :content-text="contentText" :showIcon="!firstSearch" :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
	</view>
</template> 

<script>
	import  baseURL  from '@/config/index.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{ uniLoadMore },
		data() {
			return {
				firstSearch: true, // 是否初次搜索
				baseURL: baseURL,
				name: '',
				timer: null,
				list: [],
				pageNum: 0,
				pageSize: 10,
				hasFlag: true,
				course_type_list: [],
				contentText: {
					contentrefresh: '请在搜索框中输入要搜索的课程~',
					contentnomore: '没有更多数据了~'
				}
			};
		},
		watch: {
			'name': function (newVal) {
				if (newVal.trim().length === 0) return
				clearTimeout(this.timer)
				setTimeout(() => {  
					this.firstSearch = false
					this.contentText.contentrefresh = '正在加载...'
					this.pageNum = 0
					this.pageSize = 10
					this.hasFlag = true
					this.list = []
					this.getSearchList()
				}, 500)
			}
		},
		methods: {
			// 获取搜索结果
			async getSearchList () {
				if (!this.hasFlag) return
				this.pageNum++
				let res = await this.$fetch(this.$api.getCourseList, { name: this.name, pageSize: this.pageSize, pageNum: this.pageNum }, 'GET')
				// res.rows.forEach(item => {
				// 	this.course_type_list.forEach(courseItem => {
				// 		if (item.courseTypeId === courseItem.id) item.courseName = courseItem.name
				// 	})
				// })
				this.list = res.rows
				this.hasFlag = this.pageSize * this.pageNum < res.total
			},
			// 去课程详情
			goToLessonDetail (courseId) {
				uni.navigateTo({
					url: '../LessonDetail/LessonDetail?courseId=' + courseId
				})
			}
		},
		onLoad() {
			// this.course_type_list = uni.getStorageSync('course_type_list')  
		} 
	}
</script>

<style lang="less">
page {
	background: #F7F7F7;
}
.container {
	
	& > .search-container {
		box-shadow: 0 0 0 0 rgba(0,0,0,0.05);
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 96rpx;
		background: #FFFFFF;
		z-index: 99;
		display: flex;
		justify-content: center;
		
		& > view {
			display: flex;
			align-items: center;
			width: 690rpx;
			height: 72rpx;
			background: #F7F7F7;
			border-radius: 36rpx;
			
			image {
				width: 28rpx;
				height: 28rpx;
				margin: 0 30rpx;
				margin-right: 20rpx;
			}
			
			input {
				flex: 1; 
			}
		}
	}
	
	.course-list {
		padding: 30rpx;
		padding-bottom: 0;
		margin-top: 96rpx;
		background: #F7F7F7; 
	}
	
	.course-item {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
		background-color: #FFF;
		border-radius: 7px;
		position: relative;
		margin-bottom: 30rpx;
		box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05), 0 4px 8px 0 rgba(0,0,0,0.03);
	}
	
	.course-name {
		position: absolute;
		top: 30rpx;
		left: -8rpx; 
		width: 126rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.course-name-bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 126rpx;
		height: 60rpx;
	}
	
	.course-name-text {
		font-size: 14px;
		color: #FFFFFF;
		position: absolute;
		z-index: 2;
		transform: translateY(-5rpx);
	}
	
	.price {
		text-align: right; 
	}
	
	.price-text {
		text-align: right;
		font-size: 22px;
		color: #D0021B;
	}
	
	.course-title {
		margin-top: 20rpx;
		font-size: 17px;
		font-weight: bold; 
		color: #333333;
	}
	
	.course-time {
		font-size: 14px;
		color: #9B9B9B;
		margin-top: 10rpx;
	}
	
	.course-level {
		margin-top: 16rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.course-level-title {
		font-size: 14px;
		color: #9B9B9B;
		margin-right: 20rpx;
	}
	
	.course-level-star {
		width: 24rpx;
		height: 24rpx;
		margin-right: 6rpx;
	}
	
	.teacher {
		margin-top: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
	.teacher-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.teacher-avatar {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	
	.teacher-name {
		font-size: 14px;
	}
	
	.course-collection {
		color: #8987DF;
		font-size: 14px;
	}
	.homeMain-scroll-swiper-item-bottom{
		// padding: 0 30rpx;
		padding-top: 30rpx;
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
</style>
