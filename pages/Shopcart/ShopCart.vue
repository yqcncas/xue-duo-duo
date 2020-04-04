<template>
	<view class="container">
		<view class="list">
			<view v-for="(item, index) in cartList" :key="item.orderItemId" @click="handleToggle(item, index)" >
				<icon v-if="item.select" type="success" size="22"/>
				<icon v-if="!item.select" type="circle" size="22" /> 
				<view class="main" @click.stop="handleOpenCourseDetail(item.course.courseId)"> 
					<!-- 课程名称 -->
					<view class="course-name">
						<text class="course-name-text">{{ item.course.courseTypeName }}</text>
					</view>
					<!-- 价格 -->
					<view class="price"><text class="price-text">¥{{ item.course.price }}</text></view>
					<!-- 课程标题 -->
					<text class="course-title">{{ item.course.name }}</text>
					<!-- 讲师 -->
					<view class="teacher">
						<view class="teacher-left">
							<image class="teacher-avatar" :src="item.teacher.pic" mode="aspectFill"></image>
							<text class="teacher-name">{{ item.teacher.userName }}</text>
						</view>
						<text class="course-collection">共{{ item.course.childNum }}讲</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
		</view>
		<view class="settle-accounts">
			<view class="main">
				<view class="left">
					<!-- 全选/取消全选 -->
					<icon v-if="!totalSelect" type="circle" size="22" @click="handleTotalSelect"></icon>
					<icon v-if="totalSelect" type="success" size="22" @click="handleCancelTotalSelect"></icon>
					<text>全选</text>
					<view style="font-size: 14px;color: #9B9B9B;margin-left: 20rpx;" @click="handleDeleteCart">删除</view>
				</view>
				<view class="right">
					<text>合计：</text>
					<!-- 总价 -->
					<text>¥{{ totalSelectPrice }}</text> 
				</view>
			</view>
			<!-- 没有勾选时 -->
			<view v-if="!isExistSelectCart" class="confirm-no">结算</view>
			<!-- 勾选时 -->
			<view v-if="isExistSelectCart" class="confirm" @click="handleGenerateOrder">结算</view>
		</view>
	</view>
</template>

<script>
	import  baseURL  from '@/config/index.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{ uniLoadMore },
		data() {
			return {
				isExistSelectCart: false, // 判断购物车是否有选中商品
				baseURL: baseURL, // 基础地址
				cartList: [], // 购物车列表
				totalSelect: false, // 是否全选
				totalSelectPrice: 0, // 当前选中价格汇总
				hasFlag: true, // 是否还有更多
				pageNum: 0, // 当前页码
				pageSize: 10, // 每页数量
				course_type_list: [], // 学科列表
			};
		},
		watch: {
			'cartList': {
				handler: function (newVal) {
					this.isExistSelectCart = false
					this.totalSelectPrice = 0
					let selectTotalCount = 0 // 选中总数量
					newVal.forEach(item => {
						if (item.select) {
							this.isExistSelectCart = true
							selectTotalCount++
							this.totalSelectPrice += item.course.price
						}
					})
					// 判断选中数量是否等同于购物车数量
					this.totalSelect = selectTotalCount === newVal.length && newVal.length !== 0
				},
				deep: true
			}
		},
		methods: {
			// 获取购物车列表
			async getCartList () {
				if (!this.hasFlag) return // 说明已经没有更多啦
				console.log('进入')
				++this.pageNum
				let res = await this.$fetch(this.$api.getCartList, { pageNum: this.pageNum, pageSize: this.pageSize}, 'GET')
				console.log(res)
				this.hasFlag = this.pageNum * this.pageSize < res.total
				res.rows.forEach(item => {
					item.select = false // 默认全部没选中
					// this.course_type_list.forEach(course_type_item => {
					// 	if (item.course.courseTypeId === course_type_item.id) {
					// 		item.course.courseTypeName = course_type_item.name
					// 	}
					// })
				})
				
				this.cartList = [...this.cartList, ...res.rows]
			},
			// 切换购物车状态
			handleToggle (item, index) {
				console.log(item)
				if (item.select) {
					this.$set(item, 'select', false)
				} else {
					this.$set(item, 'select', true)
				}
	
			},
			// 全选
			handleTotalSelect () {
				if (!this.cartList.length) return uni.showToast({ title: '购物车中还没有课程~', icon: 'none' })
				this.totalSelect = true
				this.cartList.forEach(item => {
					item.select = true
				})
			},
			// 取消全选
			handleCancelTotalSelect () {
				this.totalSelect = false
				this.cartList.forEach(item => {
					item.select = false
				})
			},
			// 购物车生成订单
			async handleGenerateOrder () {
				uni.showLoading({ title: '订单生成中...' })
				let orderItemIds = []
				this.cartList.forEach(item => { if (item.select) orderItemIds.push(item.orderItemId) })
				let res = await this.$fetch(this.$api.genOrder, { orderItemIds: orderItemIds.join(',')}, 'GET') 
				uni.hideLoading()
				if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
				console.log(res)
				// 前往订单页面
				// uni.navigateTo({ url: '/pages/orderDeatail/OrderDetail?orderId=' + res.data.orderId })
				// uni.reLaunch({
				// 	url: '../orderDeatail/OrderDetail?orderId=' + res.data.orderId
				// })
				uni.navigateTo({
					url: '../orderDeatail/OrderDetail?orderId='  + res.data.orderId
				})
			},
			// 前往课程详情页面
			handleOpenCourseDetail (courseId) {
				// uni.navigateTo({ url: '/pages/course-detail/course-detail?courseId='+courseId })
				uni.navigateTo({
					url: '../LessonDetail/LessonDetail?courseId=' + courseId
				})
			},
			// 删除选中的购物车中的商品
			async handleDeleteCart () {
				let orderItemIds = []
				this.cartList.forEach(item => { if (item.select) orderItemIds.push(item.orderItemId) })
				if (!orderItemIds.length) return uni.showToast({ title: '您还没有选中要删除的课程~', icon: 'none' })
				let orderItemIdsClone = JSON.parse(JSON.stringify(orderItemIds))
				let res = await this.$fetch(this.$api.delCart, { orderItemIds: orderItemIdsClone.join(',')}, 'GET')
				if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
				// 重置数据
				this.hasFlag = true // 是否还有更多
				this.pageNum = 0 // 当前页码
				this.pageSize = 10 // 每页数量
				this.cartList = [] // 列表
				this.getCartList() // 获取最新的
			}
		},
		onLoad() {
			this.getCartList()
			this.course_type_list = uni.getStorageSync('course_type_list')
		},
		onReachBottom () {
			this.getCartList()
		}
	}
</script>

<style lang="less">
page {
	background: #F7F7F7;
}
.container {
	
	.list {
		margin-bottom: 110rpx;
		
		& > view {
			padding: 30rpx;
			display: flex;
			align-items: center;
			
			&:nth-last-child(2) {
				padding-bottom: 0;
			}
			
			&:last-child {
				padding: 0;
			}
			
			.icon {
				border-radius: 50%;
				box-sizing: border-box;
				width: 22px;
				height: 22px;
				border: 1px solid #ddd;
				margin-right: 22rpx;
			}
			
			icon {
				margin-right: 22rpx;
			}
			
			& > .main {
				flex: 1;
				background: #FFFFFF;
				padding: 30rpx;
				display: flex;
				position: relative;
				flex-direction: column;
				border-radius: 7px;
				
				.course-name {
					position: absolute;
					top: 30rpx;
					left: -8rpx; 
					width: 126rpx;
					height: 60rpx;
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAA8CAYAAAHXtD55AAAABGdBTUEAALGPC/xhBQAABSFJREFUeAHtXD1sHEUUnrdek8QWGOEqqUKaICOhpAwmFQYJCQefsVFC4TshQ0MRaJOGAqhSBEWhID+6swSJOMt3JFDFqVBImTRISZOkwkjGJgSRvzvv4721Jtrb3F3udqWb23kzxc3O3uy8933f/O3s7EIwN4UqRfBSXKsA1PV0BZSqexMX4C1Ugb1PXADmp26nKwDVTi4A0qrAhaQKqT1ITCK7zUokLgBGhkfCQpISACe+v5eqAG04MQQtf+ICtAdqcWI8VXNOXQ+eeJLgIFU1SGCv4ZLUvUFDaV0mtHG+LH0lSGHciAO6+mu/e84AG2Yn8KPcPj422gpAwQOjDhihn2nnYMy4sc4HwJs3hhxKS2eMGDfW43HzYsQ69LjCwZfaMMc9NY4q+MqYcTYc7ed7ilyjRsR0M35dUJIY87mArzOCnA2TA+fMGUc86P/y98bwowfr/80sXwl1YK96FYwOqb0C2cwOKO+o3+wP28/BVm8HfLe0Ig68sbHVZI2icX0jCpx9Mdbb9ZIIWkS7DAuVp2q59eDBGzgApepEM7KfYqNZpqyeg12DW+CL8uNW/lutPN6qPWoFnM9bDZ4Bbi5UzO7m43iwHjwDxnrtBhZyx0WCDwkI8DDO5f6KEiBCeQ0YFY5Gbyblzu1pJPCrf64WgkAVNTsm7q60baPx4sQbvxt1oMfG5VZ7gAuiOrxoxYJS5T2R4AH8cK4vDjytld2D0uJlrgXiwKt3B1/S1V8UeAA4DR+UN2SCL1U+1sA5FqM8eIN7o8DFgKf1uxUolq/LBL9Q2REHLkJ58ODrZsBlgC9WjooED97Wl1sBt1p5msndhOL5OyLB08bEpouWUTKsHudpv/CFKNj4sd3gUU3i57Pb4qB12mrwIci1+l0NNh5bD55WbJ+j6n8oDpzT1oNnkIjqB47jQQR4Bk0PLH6TC17hPvw0NxolQIzyIeh/cVUseJr4AM5NHdYEyFKeUBMBT57WigPPqpP6NziW+8SG7vj8ysrqfRoHh5gJDpIeVHrvX7oyrMArbUKX9Ru2+ZlLvxb8Qe9VWdAFt3lpQmu84Rsm3pYxkSOdJkFazCt7apf/Iq/uWb35VJqw7fDSI9pztB3jQ53HtXjNhMUxtfTPoqIzVNfi7RYclQ/jcLZyNQ7TCR9nxJI0TeLW1PNqN5ysrDWD5IRvxkrGz5HoV1VpaZzG9ZZfUXFjfMZFjrtPW1C+offnXm8nOl/jWnycuQynSfRDUKyc7wSCE74Tlvo8D3Xtj5XvvwZnyzc7ddV19Z0y1af56NXoO2qUFmW6EJ2huBbfp4J24haJfpFeCz/QSd54Htfi44xkJM0fOUkqOkN0wmdE6Kibm2vuA8ei57o9dsJ3y1gf5A93Et+q38XCwZ1J3XHCJ2XO8HW0lXQbBg9vY37ajfGGtTBiHjH4ib7/0fAtw04ccS2+E5b6PA8GeIQ2ki9346bYXXfdkJSVvLSQs6JGhl7RX21v57dr8e3Yydh/NO5vV//cX8fC7J5nue6EfxZDGfufxB/AoHYN56bn27nuhG/HTob/o49Xn6IPGJ9qBcEJ34oZC87Td7vnadJ3DX+cHYjDccLHGbEsTW+M7FE/19bxk+ntUWhO+Cgblh7TSt8L+DD4A/Mzb2qITnjNhIAYsb5Mk74jDNXdxwsQPA4xfJzLJ6vv7B+r17BMb1OOxTNJepMwjt3mND3hawxLb4/naULwrX6N1AnfyI/1qYuTk0OLb+0vWg9UKMD/AaY9V5KquW8fAAAAAElFTkSuQmCC');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				.course-name-text {
					font-size: 14px;
					color: #FFFFFF;
					transform: translateY(-4rpx);
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
					color: #FE5E50;
					font-size: 14px;
				}
			}
		}
	}
	
	.settle-accounts {
		box-shadow: 0px -5rpx 5rpx -5rpx rgba(0, 0, 0, .06);
		position: fixed;
		bottom: 0rpx;
		background: #fff;
		display: flex;
		align-items: center;
		width: calc(100vw - 60rpx);
		height: 110rpx;
		padding: 0 30rpx;
	}
	
	.settle-accounts > .main {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.settle-accounts > .main > .left {
		display: flex;
		align-items: center;
	}
	
	.settle-accounts > .main > .left > icon {
		margin-right: 20rpx;
	}
	
	.settle-accounts > .main > .right {
		display: flex;
		align-items: center;
	}
	
	.settle-accounts > .main > .right > text:last-child {
		font-size: 12px;
		color: #9B9B9B;
	}
	
	.settle-accounts > .main > .right > text:last-child {
		font-size: 18px;
		color: #D0021B;
	}
	
	.settle-accounts > .confirm {
		width: 160rpx;
		height: 70rpx;
		background: #FE5E50;
		border-radius: 35rpx;
		text-align: center;
		color: #fff;
		line-height: 70rpx;
		margin-left: 20rpx;
	}
	
	.settle-accounts > .confirm-no {
		width: 160rpx;
		height: 70rpx;
		background: #C1C1C1;
		border-radius: 35rpx;
		text-align: center;
		color: #fff;
		line-height: 70rpx;
		margin-left: 20rpx;
	}
}
</style>
