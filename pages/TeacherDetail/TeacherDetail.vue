<template>
	<view class="container">
		<!-- 老师基本信息，所在照片 -->
		<view class="header">
			<image class="teacherPic" :src="teacherDetail.pic" mode="aspectFill"></image>
			<!-- 老师基本信息，标签 -->
			<view class="info">
				<view class="name">{{ teacherDetail.userName }}</view>
				<view class="type">{{ teacherDetail.lessons }}</view>
				<view class="labels">
					<text>{{ teacherDetail.edu }}</text>
					<text>教龄{{ teacherDetail.years }}年</text>
					<text>{{ teacherDetail.address }}</text>
				</view>
			</view>
		</view>
		<!-- 老师课程与老师富文本信息 -->
		<view class="teacher-tabs">
			<view @click="tabSelect = false" :class="!tabSelect ? 'select' : ''">介绍</view>
			<view @click="tabSelect = true" :class="tabSelect ? 'select' : ''">课程</view>
		</view>
		<view class="content">
			<view style="padding: 30rpx;" v-show="tabSelect === false">
				<parser :html="teacherDetail.remark" show-with-animation lazy-load>加载中...</parser>
			</view>
			<view class="course-list" v-show="tabSelect === true">
				<view class="course-item" v-for="item in courseList" :key="item.courseId" @click="handleOpenCourseDetail(item.courseId)">
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
						<image v-for="starItem in item.level" class="course-level-star" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAlFJREFUSA2dVU1LVUEYfuZeTdPyA+5O4kpUcMFbGiFEi36AVgvtmrRIilaS6xaB4V/QTdFeCP0BBS2Cyo8igoI+NlJguFDMrEVp9+2ZOdfDnDtHZ+4dGM7M+z7P887HO+8Bamgyhz55jP4aKMiEgmUeI8QukrHAQOOhPBUClAdoQQ5viC0YvGAVv3FG3cCGjx+2gxxKsbhWVOhCK276xCOoB8UzP8xjWaJoMQEVfMUf9Knr2EzYqyb+HWQw5IhrEYU8mjBWpedMD7wDrv5QZfW9DlMbBCsocxclbKX6aYwDyH1KHedVNqObowLJRX7PEXNxP3LFvkzsa44/8PuJnBWmwJqa4AGyKZnFMTTiHsdn2fMMmdN29vqa4CfZqwz2ngKTDRSfomGsPrUUlkIbrW3U1Cnd7L/kFI1gk6Cc4SVNcTvvgknhwI/UvpthBuhMGGSQV+FcL/It/mGA2p/NEXGgn/5lBnnipfoAgpf4i0tm4cTGd2Dqyhau0jbHLj6dVL/gKRd6RY3i+57fSUc+riPImhTr3gMFftd5LEWufM3GxzuwjO0cd1jz0OFRnofDcwNkcarOAE1MlqicW0tyAwhOW/7ahlmX6wYA0gtbSChdv6paIgAvOEt/TxUmmgrzA3jEPs0c2696FkwFtgQSAbBj6kje8uuE/WWEyzivhnCbfQK7/PELZlICddHXafOTARpNJXxWAWxT4CEJkXDJpK5xqWv4ooZxJw4E/IgceI6G5B/OfQf6B9+JCyR800+9EuzAD4/lBKvnSS7vhbqFbRv8HzgBjfYGEr3GAAAAAElFTkSuQmCC" mode="aspectFill"></image>
					</view>
					<!-- 讲师 -->
					<view class="teacher">
						<view class="teacher-left">
							<image class="teacher-avatar" :src="`${baseURL}${item.avatar}`" mode="aspectFill"></image>
							<text class="teacher-name">{{ item.teachers[0].userName }}</text>
						</view>
						<text class="course-collection">共{{ item.childNum }}讲</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import parser from "@/components/jyf-Parser/index"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import baseURL from '@/config/index.js'
	export default {
		components: { parser, uniLoadMore },
		data() {
			return {
				teacherId: null,
				teacherDetail: {},
				tabSelect: false, // 当前选中的是
				pageNum: 0, // 当前页码
				pageSize: 9999, // 每页数量
				hasFlag: true,
				courseList: [], // 课程列表
				course_type_list: [],
				baseURL: baseURL
			};
		},
		methods: {
			async getTeacherInfo () {
				let res = await this.$fetch(this.$api.getTeacherInfo, { teacherId: this.teacherId}, 'GET')
				console.log(res)
				this.teacherDetail = res.data
			},
			// 获取老师下面的课程列表
			async getCourseList () {
				// if (!this.hasFlag) return // 说明已经没有更多啦
				++this.pageNum
				let res = await this.$fetch(this.$api.getCourseList, { teacherId: this.teacherId, pageNum: this.pageNum, pageSize: this.pageSize}, 'GET')
				this.courseList = res.rows
				console.log(this.courseList)
			},
			// 前往课程详情页
			handleOpenCourseDetail (courseId) {
				uni.navigateTo({
					url: '../LessonDetail/LessonDetail?courseId=' + courseId
				})
			},
			
		},
		onLoad(options) {
			this.teacherId = options.teacherId
			this.course_type_list = uni.getStorageSync('course_type_list')
			this.getTeacherInfo()
			this.getCourseList()
		}
	}
</script>

<style lang="less">
.container {

	.header {
		width: calc(100vw - 60rpx);
		height: 470rpx;
		background: #FE5E50;
		padding-left: 30rpx;
		padding-right: 30rpx;
		position: relative;
		z-index: -1;
		display: flex;
		
		.teacherPic {
			margin-top: 84rpx;
			width: 300rpx;
			height: 386rpx;
			margin-right: 60rpx;
		}
		
		.info {
			margin-top: 140rpx;
			color: #FFFFFF;
			
			.name {
				font-size: 20px;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			
			.type {
				opacity: 0.7;
				font-size: 14px;
			}
			
			.labels {
				width: 300rpx;
				display: flex;
				flex-wrap: wrap;
				
				text {
					margin-top: 20rpx;
					padding: 0rpx 25rpx;
					font-size: 12px;
					color: #FFFFFF;
					height: 40rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: rgba(255, 255, 255, .2);
					margin-right: 20rpx;
					border-radius: 20px;
					opacity: 0.9;
				}
			}
		}
	}

	.teacher-tabs {
		background: #FFFFFF;
		border-radius: 20px 20px 0 0;
		display: flex;
		height: 90rpx;
		margin-top: -45rpx;
		
		view {
			flex: 375rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #9B9B9B;
			position: relative;
			
			&::before {
				content: "";
				width: 0rpx;
				height: 6rpx;
				position: absolute;
				transition: all .2s;
				background: #FE5E50;;
				bottom: 0;
			}
			
			&.select {
				font-size: 17px;
				color: #FE5E50;;
				font-weight: bold;
				
				&::before {
					width: 40rpx;
				}
			}
		}
	}
}

.course-list {
		padding: 30rpx;
		padding-bottom: 0;
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
		color: #FE5E50;;
		font-size: 14px;
	}
	
	.come-buy {
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 100rpx;
		box-sizing: border-box;
		border-top: 1rpx solid #eee;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		
		& > view:first-child {
			flex: 1;
			display: flex;
			justify-content: flex-end; 
			align-items: center;
			padding-right: 30rpx;
			
			text:first-child {
				font-size: 12px;
				color: #9B9B9B;
			}
			
			text:last-child {
				font-size: 18px;
				color: #D0021B;
			}
		}
		
		& > view:last-child {
			width: 260rpx;
			height: 100%;
			background: #FE5E50;;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
		}
	}
</style>
