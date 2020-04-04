<template>
	<view class="container" v-if="showContainer">
		<!-- 已支付 -->
		<view class="header">
			<!-- 待支付 -->
			<view class="wait-buy" v-if="orderDetail.status === 2">
				<view>
					<view>待支付</view>
					<view>
						<text>订单金额</text>
						<text>¥{{ orderDetail.money }}</text>
					</view>
					<view v-if="false">剩23小时59分自动关闭</view>
				</view>
				<image src="../../static/image/icon/24.png"></image>
			</view>
			<!-- 已支付 -->
			<view class="already-buy" v-if="orderDetail.status === 1">
				<view>
					<view>已支付</view>
					<view>
						<text>订单金额</text>
						<text>¥{{ orderDetail.money }}</text>
					</view>
				</view>
				<image src="../../static/image/icon/25.png"></image>
			</view>
			<!-- 订单已关闭 -->
			<view class="closed-buy" v-if="orderDetail.status === 3">
				<view>
					<view>已取消</view>
					<view>
						<text>订单金额</text>
						<text>¥{{ orderDetail.money }}</text>
					</view>
				</view>
				<image src="../../static/image/icon/26.png"></image>
			</view>
		</view>
		<view class="line-30"></view>
		<!-- 购买的课程列表 -->
		<view class="course-list">
			<view @click="handleOpenCourseDetail(courseItem)" class="order-course-item" v-for="(courseItem, courseIndex) in orderDetail.orderItems" :key = "courseIndex">
				<view class="order-course-item-header">
					<text class="order-course-type">{{ courseItem.course.courseTypeName }}</text>
					<text class="order-course-price">¥{{ courseItem.course.price }}</text>
				</view>
				<text class="order-course-name">{{ courseItem.course.name }}</text>
				<!-- 老师头像，姓名 -->
				<view class="order-course-base-info"> 
					<view class="order-course-base-info-left"> 
						<image class="teacher-avatar" :src="courseItem.teacher.pic" mode="aspectFill"></image>
						<view class="shouke-teacher">授课老师</view>
						<text class="teacher-name">{{ courseItem.teacher.userName }}</text>
					</view>
					<text class="order-course-base-info-level">共{{ courseItem.course.childNum }}讲</text>
				</view>
			</view>
		</view>
		<!-- 总价 -->
		<view class="order-total">
			<text class="total-count">共{{ orderDetail.num }}项，总计：</text>
			<text class="total-price">¥{{ totalPrice }}</text>
		</view>
		<view class="line-30"></view>
		<!-- 订单信息 -->
		<view class="order-info">
			<view>
				<text>订单编号</text>
				<text>{{ orderDetail.orderNo }}</text>
			</view>
			<view>
				<text>下单时间</text>
				<text>{{ orderDetail.createTime }}</text>
			</view>
		</view>
		<!-- 订单详情 --> 
		<view class="order-handle" v-if="orderDetail.status === 2">
			<view @click="handleCancelOrder">取消订单</view>
			<view @click="handleOrderBuy">立即支付</view>
		</view>
		
		<uni-popup ref="popupPay" type="bottom">
			<view class="popupPay-header-orderDetail">
				<view class="popupPay-header-orderDetail-left">您需支付</view>
				<view class="popupPay-header-orderDetail-right" @click.stop="closePopupPay">
					<image src="../../static/image/note/chacha.png" mode=""></image>
				</view>
			</view>
			<view class="popupPay-center-orderDetail">
				¥{{totalPrice}}
			</view>
			<view class="popupPay-main-orderDetail">
				<view class="popupPay-main-orderDetail-eduTotal">学币支付</view>
				<view class="popupPay-main-orderDetail-eduprice">¥{{myEduPrice == 0 ? 0 : myEduPrice}}</view>
				<view class="popupPay-main-orderDetail-rechange" @tap="goToRecharge">充值</view>
			</view>
			<view class="popupPay-button"  @click.stop="payOrder">确认支付</view>
		</uni-popup>
	</view>
</template>

<script>
	import  baseURL  from '@/config/index.js'
	export default {
		data () {
			return {
				totalPrice: 0, // 总价（未打折）
				baseURL: baseURL,
				showContainer: false, // 页面是否展示
				orderId: null,
				orderDetail: {}, // 订单详情数据
				course_type_list: [], // 学科列表
				handleExist: false, // 时间判断
				myEduPrice: '',
				goIndex: 0, // 判断是哪进来的 1是订单 2是拼团
				computedTotalPriceFlag: true
				
			}
		},
		onShow() {
			this.initUserInfo()
		},
		methods: {
			// 去充值
			goToRecharge () {
				uni.navigateTo({
					url: '../Recharge/Recharge'
				})
			},
			// 获取个人信息 拿到学币余额
			async initUserInfo () {
				let {data: res} = await this.$fetch(this.$api.userInfo,{},'GET', 'form')
				this.myEduPrice = Number(res.money)
				console.log(this.myEduPrice)
			},
			// 获取订单详情
			async getOrderDetail () {
				let res = await this.$fetch(this.$api.orderInfo, { orderId: this.orderId }, 'GET')
				if (this.computedTotalPriceFlag) {
					res.data.orderItems.forEach(item => {
						this.totalPrice += item.course.price
					})
				}
				
				this.showContainer = true
				this.orderDetail = res.data 
			},
			// 点击取消订单时触发
			handleCancelOrder () {
				uni.showModal({
				    title: '取消订单',
				    content: '确定取消该订单么?',
				    success: async (res) => {
				        if (res.confirm) {
				           let res = await this.$fetch(this.$api.cancelOrder, { orderId: this.orderId },"GET")
				           if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
				           uni.showToast({ title: '订单取消成功~' })
				           this.getOrderDetail()
				           this.goIndex = Number(this.goIndex)
				           if (this.goIndex == 2) {
				           	uni.setStorageSync('backFlag', 4)
				           } else if (this.goIndex == 1) {
				           	// 订单页面进来的
				           	uni.setStorageSync('backFlag', 3)
				           }
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
				
			},
			// 关闭弹窗
			closePopupPay () {
				this.$refs.popupPay.close()
			},
			async payOrder () {
				// this.handleExist = Date.now() > Date.parse(uni.getStorageSync('end_time')) ? true : false
				// this.$fetch(this.$api.pay, { orderId: this.orderId, pay: true, reward: true}, 'GET').then(res => {
				// 	if (res.code) return uni.showToast({ title: res.msg, icon: 'none' }) 
				// 	this.computedTotalPriceFlag = false 
				// 	this.getOrderDetail()
				// 	if (!this.handleExist) {
				// 		uni.showModal({
				// 			title: '报名成功',
				// 			content: '稍后客服会通过手机号码联系您，确定具体的上课时间及地点，请保持手机畅通！',
				// 			showCancel: false
				// 		});
				// 		this.$refs.popupPay.close()
				// 		this.goIndex = Number(this.goIndex)
				// 		if (this.goIndex) {
							
				// 		} else {
				// 			// 订单进来 下单成功
				// 			uni.setStorageSync('')
				// 		}
						
				// 	}
					
				// })
				let res = await this.$fetch(this.$api.pay, { orderId: this.orderId, pay: true, reward: true}, 'GET')
				console.log(res)
				this.computedTotalPriceFlag = false 
				this.getOrderDetail()
				if (!res.code) {
					// 成功
					uni.showModal({
						title: '报名成功',
						content: '稍后客服会通过手机号码联系您，确定具体的上课时间及地点，请保持手机畅通！',
						showCancel: false
					});
					this.$refs.popupPay.close()
					this.goIndex = Number(this.goIndex)
					if (this.goIndex == 2) {
						uni.setStorageSync('backFlag', 2)
					} else if (this.goIndex == 1) {
						uni.setStorageSync('backFlag', 1)
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
				}
			},
			// 订单支付界面
			async handleOrderBuy () {
				this.$refs.popupPay.open()
			},
			// 打开课程详情
			handleOpenCourseDetail ({ courseId }) {
				uni.navigateTo({ url: '/pages/course-detail/course-detail?courseId='+courseId }) 
			}
		},
		onLoad(options) {
			console.log(options)
			this.orderId = options.orderId
			this.goIndex = options.goIndex // 判断是从哪个页面进来 0订单 1拼团
			this.course_type_list = uni.getStorageSync('course_type_list')
			this.getOrderDetail()
		}
 	}
</script>

<style lang="less">
page {
	background: #F7F7F7;
}

/* 顶部阴影 */
page::after {
	content: "";
	position: fixed;
	top: 0;
	/*  #ifdef H5 */
	top: 44px;
	/*  #endif  */
	left: 0;
	box-shadow: inset 0 4upx 8upx 0 rgb(244, 244, 244);
	z-index: 9;
	width: 750upx;
	height: 8upx;
}

.container {
	
	.header {
		background: #FFFFFF;
		
		& > .wait-buy {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 60rpx;
			
			& > view {
				
				view:first-child {
					font-size: 20px;
					color: #4A90E2;
					margin-bottom: 30rpx;
				}
				
				view:nth-child(2) {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					
					text:first-child {
						margin-right: 20rpx;
					}
					
					text:last-child {
						font-size: 18px;
						color: #D0021B;
					}
				}
				
				view:last-child {
					color: #9B9B9B;
				}
			}
			
			& > image {
				width: 176rpx;
				height: 162rpx;
			}
		}
		
		& > .already-buy {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 60rpx;
			
			& > view {
				
				view:first-child {
					font-size: 20px;
					margin-bottom: 30rpx;
				}
				
				view:last-child {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					
					text:first-child {
						margin-right: 20rpx;
					}
					
					text:last-child {
						font-size: 18px;
						color: #D0021B;
					}
				}
			}
			
			& > image {
				width: 122rpx;
				height: 122rpx;
			}
		}
		
		& > .closed-buy {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 60rpx;
			
			& > view {
				 
				view:first-child {
					font-size: 20px;
					color: #9B9B9B; 
					margin-bottom: 30rpx;
				}
				
				view:last-child {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					
					text:first-child {
						font-family: PingFangSC-Regular;
						font-size: 13px;
						color: #4A4A4A;
						margin-right: 20rpx;
					}
					
					text:last-child {
						font-size: 18px;
						font-weight: bold;
						color: #D0021B;
					}
				}
			}
			
			& > image {
				width: 146rpx;
				height: 164rpx;
			}
		}
	}

	.course-list {
		background: #FFFFFF;
		padding: 30rpx;
		padding-bottom: 0;
		
		.order-course-item {
			padding-top: 30rpx;
			border-top: 1px solid #F6F6F6;
			
			&:first-child {
				padding-top: 0;
				border-top: none;
			}
		}
		
		.order-course-item-header {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
		}
		
		.order-course-type {
			background: rgba(254,94,80,0.20);
			border-radius: 2px;
			padding: 5rpx 14rpx;
			font-size: 12px;
			color: #FE5E50;
		}
		
		.order-course-name {
			margin-top: 20rpx;
			font-size: 17px;
			font-weight: bold;
			color: #333333;
		}
		
		.order-course-price {
			font-size: 14px;
			color: #333333;
			font-weight: bold;
		}
		
		.order-course-base-info {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;
			padding-bottom: 30rpx;
		}
		
		.last-order-course-base-info {
			padding-bottom: 30rpx;
			border-bottom-width: 0px;
		}
		
		.teacher-avatar {
			width: 56rpx;
			height: 56rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		
		.teacher-name {
			font-size: 14px;
			color: #333333;
		}
		
		.order-course-base-info-left {
			display: flex;
			flex-direction: row;
			align-items: center;
			.shouke-teacher{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: -0.34px;
				margin-right: 20rpx;
				box-sizing: border-box;
			}
		}
		
		.order-course-base-info-level {
			color: #FE5E50;
			font-size: 14px;
		}
	}
	
	.order-total {
		background: #FFFFFF;
		padding: 30rpx;
		padding-top: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		
		.total-count {
			color: #9B9B9B;
			font-size: 14px;
		}
		
		.total-price {
			font-weight: bold;
			font-size: 18px;
			color: #D0021B;
		}
	}
	
	.order-info {
		margin-bottom: 100rpx;
		background: #FFFFFF;
		padding: 30rpx;
		color: #9B9B9B;
		
		& > view {
			
			&:first-child {
				margin-bottom: 10rpx;
			} 
			
			text:first-child {
				margin-right: 30rpx;
			}
		}
	}

	.order-handle {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		height: 100rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		
		& > view {
			width: 160rpx;
			height: 60rpx;
			color: #FFFFFF;
			font-size: 14px;
			font-family: PingFangSC-Regular;
			border-radius: 30rpx;
			border: 1px solid #FE5E50;
			margin-right: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #FE5E50;
			&:first-child {
				border: 1px solid #9B9B9B;
				color: #9B9B9B; 
				background-color: #fff;
			}
		}
	}
}
</style>

<style lang="less">
	.uni-popup__wrapper-box {
		width: 750rpx;
		// height: 650rpx;
		background: #FFFFFF;
		border-radius: 7px 7px 0 0;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		position: fixed !important;
		left: 0;
		bottom: 0;
		padding: 30rpx;
		box-sizing: border-box;
		z-index: 999;
		.popupPay-header-orderDetail{
			height: 48rpx;
			display: flex;
			justify-content: space-between;
			.popupPay-header-orderDetail-left{
				transform: translateX(18rpx);
				flex: 1;
				text-align: center;
				font-family: PingFangSC-Semibold;
				font-size: 17px;
				color: #333333;
				letter-spacing: -0.41px;
				font-weight: bold;
			}
			.popupPay-header-orderDetail-right{
				color: #B2B2B2;
				padding: 0 30rpx;
				margin: 0 -30rpx;
				position: relative;
				z-index: 99;
				image{
					width: 26rpx;
					height: 28rpx;
				}
			}
		}
		.popupPay-center-orderDetail{
			padding-top: 30rpx;
			padding-bottom: 66rpx;
			box-sizing: border-box;
			width: 100%;
			text-align: center;
			font-family: PingFangSC-Medium;
			font-size: 24px;
			color: #D0021B;
			letter-spacing: -0.58px;
		}
		.popupPay-main-orderDetail{
			width: 100%;
			padding-bottom: 86rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.popupPay-main-orderDetail-eduTotal{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: -0.34px;
			}
			.popupPay-main-orderDetail-eduprice{
				font-weight: bold;
				font-family: PingFangSC-Semibold;
				font-size: 17px;
				color: #333333;
				letter-spacing: -0.41px;
				padding-left: 20rpx;
				padding-right: 50rpx;
				box-sizing: border-box;
			}
			.popupPay-main-orderDetail-rechange{
				width: 140rpx;
				height: 58rpx;
				line-height: 58rpx;
				text-align: center;
				background: #FE9B42;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #FFFFFF;
				letter-spacing: -0.34px;
				border-radius: 4px;
				box-sizing: border-box;
			}
		}
		
		.popupPay-button {
			// margin: 30rpx;
			box-sizing: border-box;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			background: #FE5E50;
			border-radius: 4px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #FFFFFF;
			letter-spacing: -0.34px;
		}
	}
</style>
