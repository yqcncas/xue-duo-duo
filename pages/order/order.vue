<template>
	<view class="order">
		<view class="order-header">
			<view class="order-header-item" @click="handleheaderTab(index)" :class="{active:headerIndex == index}" v-for="(headerItem, index) in headerTitle" :key = "index">{{headerItem}}</view>
		</view>
			<view class="main">
				<view class="main-box">
					<swiper :style="{height: 100+ 'vh'}" :current="headerIndex" @change="swiperChange">
						<swiper-item v-for="(swiperItem, index) in headerTitle" :key = "index">
							<scroll-view scroll-y="true" :style="{height: 100+ 'vh'}" @scrolltolower = 'catchBottom' :lower-threshold = "150">
								<view class="main-box-item" v-for="(item, i) in orderList" :key = "i" @click.stop="handleOpenOrderDetail(item.orderId)">
									<view class="main-item-wrapper" v-for="(orderItem, ind) in item.orderItems" :key = "ind">
										<view class="disheader-box">
											<view class="item-header">
												<view class="item-header-left">
													<view class="item-header-left-order">订单编号</view>
													<view class="item-header-left-number">{{item.orderNo}}</view>
												</view>
												<view class="item-header-right" :class="{waitPay: item.status == 2, cancelPay: item.status == 3}">{{item.status === 1 ? '已支付' : item.status === 2 ? '待支付' : '已取消'}}</view>
											</view>
										</view>
									
										<view class="item-center">
											<view class="item-center-header">
												<view class="item-center-header-left">
													<view class="item-center-header-left-lesson">{{orderItem.course.courseTypeName}}</view>
													<view class="item-center-header-left-title">{{orderItem.course.name}}</view>
												</view>
												<view class="item-center-header-right">¥{{orderItem.course.price}}</view>
											</view>
											<view class="item-center-footer">
												<view class="item-center-footer-left">
													<view class="teacherAvatar">
														<image :src="orderItem.teacher.pic" mode=""></image>
													</view>
													<view class="teacherInfo">
														<view class = "teacherInfo-left">授课老师</view>
														<view class = "teacherInfo-right">{{orderItem.teacher.userName}}</view>
													</view>
												</view>
												<view class="item-center-footer-right">共{{orderItem.course.childNum}}讲</view>
											</view>
										</view>
										<view class="dis-bottom-item">
											<view class="item-bottom">
												<view class="item-bottom-left">
													共{{item.orderItems.length}}项,总计：
												</view>
												<view class="item-bottom-right">
													¥{{item.money}}
												</view>
											</view>
										</view>					
									</view>
									<view class="no-buy" v-if="item.status == 2">
										<view class="cancelButton" @click.stop="cancelOrder(item.orderId)">取消订单</view>
										<view class="nowPay" @click.stop="showPopWrap(item.orderId, item.money)">立即支付</view>
									</view>
								</view>
								<uni-load-more bgColor="rgba(244, 244, 244)" :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
							</scroll-view>
							
						</swiper-item>
					
					</swiper>
					
				
				</view>
			</view>
		<uni-popup ref="popupPay" type="bottom">
			<view class="popupPay-header-orderDetail">
				<view class="popupPay-header-orderDetail-left">您需支付</view>
				<view class="popupPay-header-orderDetail-right" @click.stop="closePopupPay">
					<image src="../../static/image/note/chacha.png" mode=""></image>
				</view>
			</view>
			<view class="popupPay-center-orderDetail">
				¥{{totalMoney}}
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
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue'
	export default {
		data () {
			return {
				headerTitle: ['全部订单', '已支付', '待付款', '已取消'],
				headerIndex: 0,
				hasFlag: true,
				pageNum: 0,
				orderList: [],
				status: '',
				swiperFlag: true,
				totalMoney: 0, // 总价
				buyOrderId: 0, // 要购买的ID
				myEduPrice: ''
				
			}
		},
		components:{
			uniLoadMore
		},
		methods: {
			// 更改TAB
			handleheaderTab (index) {
				this.headerIndex = index
				this.pageNum = 0
				this.hasFlag = true
				this.orderList = []
				this.swiperFlag = false
				if (index == 0) {
					this.status = ''
				} else if (index == 1) {
					this.status = 1
				}else if (index == 2) {
					this.status = 2
				}else if (index == 3) {
					this.status = 3
				}
				this.initOrderList()
			},
			// 个人信息
			async initUserInfo () {
				let {data: res} = await this.$fetch(this.$api.userInfo,{},'GET', 'form')
				this.myEduPrice = Number(res.money)
				console.log(this.myEduPrice)
			},
			// 初始化列表
			async initOrderList () {
				if (!this.hasFlag) return 
				this.pageNum++
				let res = await this.$fetch(this.$api.orderList,{pageNum: this.pageNum, pageSize: 10, status: this.status, isAssemble: 0}, 'GET', 'FORM')
				console.log(res)
				this.orderList = [...this.orderList, ...res.rows]
				console.log(this.orderList)
				this.swiperFlag = true
				this.hasFlag = this.pageNum * 10 < res.total
			},
			// 滑动
			swiperChange (e) {
				// this.headerIndex = e.mp.detail.current
				if (this.swiperFlag) {  // 若是点击 则不执行
					this.handleheaderTab(e.mp.detail.current)
				}
			},
			// 触底
			catchBottom () {
				if (this.hasFlag) {
					this.initOrderList()
				}
			},
			// 关闭弹窗
			closePopupPay () {
				this.$refs.popupPay.close()
			},
			goToRecharge () {
				uni.navigateTo({
					url: '../Recharge/Recharge'
				})
			},
			// 取消
			cancelOrder (id) {
				uni.showModal({
				    title: '提示',
				    content: '确定取消该订单么?',
				    success: async (res) =>  {
				        if (res.confirm) {
				            let msg = await this.$fetch(this.$api.cancelOrder,{orderId: id}, 'GET', 'FORM')
				            uni.showToast({
				            	icon: 'none',
								title: msg.msg
				            })
							if (!msg.code) {
								setTimeout(() => {
									uni.redirectTo({
										url: './order?orderTab=' + 3
									})
								}, 1000)
							}
							
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			},
			// 显示支付弹框
			showPopWrap (id, money) {
				uni.showModal({
				    title: '提示',
				    content: '确定购买该课程么?',
				    success: async (res) =>  {
				        if (res.confirm) {
							this.totalMoney = money
							this.buyOrderId = id
							this.$refs.popupPay.open()

				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			// 立即支付
			async payOrder () {
				 let msg = await this.$fetch(this.$api.pay,{orderId: this.buyOrderId, pay: true}, 'GET', 'FORM')
				 console.log(msg)
				 uni.showToast({
					icon: 'none',
					title: msg.msg
				 })
				 if (!msg.code) {
					 this.$refs.popupPay.close()
					 setTimeout(() => {
						uni.redirectTo({
							url: './order?orderTab=' + 1
						})
					 }, 1000)
				 }
				 
			},
			// 去课程详情
			handleOpenOrderDetail (id) {
				uni.navigateTo({ url: '../orderDeatail/OrderDetail?orderId=' + id + "&goIndex=" + 1})
			},
		},
		onLoad(options) {
			// 若是操作后的跳转 则默认是点击事件去请求  不是则初始化加载
			if (options.orderTab) {
				this.handleheaderTab(options.orderTab)
			} else {
				this.initOrderList()
			}
			
		},
		onShow() {
			this.initUserInfo()
			if (uni.getStorageSync("backFlag")) {
				let backIndex = uni.getStorageSync("backFlag")
				uni.removeStorageSync('backFlag')
				this.handleheaderTab(backIndex)
			}
		},
		onPullDownRefresh() {
			setTimeout(() => {
				this.pageNum = 0
				this.hasFlag = true
				this.orderList = []
				this.swiperFlag = false
				this.initOrderList()
				uni.stopPullDownRefresh()
			}, 1000)
		}
	}
</script>

<style lang="less">
	.order{
		overflow-y: hidden;
		.order-header{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 999;

			display: flex;
			background-color: #fff;
			height: 90rpx;
			line-height: 90rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			.order-header-item{
				flex: 1;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: 0;
				text-align: center;
				position: relative;
				&::after{
					content: '';
					width: 0;
					height: 0;
					border-bottom: 4rpx solid #FE5E50;
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
				}
				&.active{
					color: #FE5E50;
					&::after{
						width: 30%;
					}
				}
			}
		}
		.main{
			// padding: 30rpx;
			box-sizing: border-box;
			.main-box{
				padding-left: 30rpx;
				padding-right: 30rpx;
				padding-top: 90rpx;
				box-sizing: border-box;
				.main-box-item{
					margin-top: 30rpx;
					background-color: #fff;
					padding: 30rpx;
					border-radius: 7px;
					box-sizing: border-box;
					.main-item-wrapper{
						border-bottom: 1rpx solid #F6F6F6;
						padding-bottom: 30rpx;
						box-sizing: border-box;
						.disheader-box{
							display: none;
						}
						&:nth-child(1){
							.disheader-box{
								display: block;
							}
						}
						.dis-bottom-item{
							display: none;
						}
						&:nth-last-child(1){
							border-bottom: 0;
							.dis-bottom-item{
								display: block;
							}
						}
						
					}
					.disheader-box{
						
						.item-header{
							padding-bottom: 20rpx;
							display: flex;
							justify-content: space-between;
							border-bottom: 1rpx solid #F6F6F6;
							box-sizing: border-box;
							.item-header-left{
								display: flex;
								.item-header-left-order{
									font-family: PingFangSC-Regular;
									font-size: 14px;
									color: #9B9B9B;
									letter-spacing: 0;
								}
								.item-header-left-number{
									font-family: PingFangSC-Regular;
									font-size: 14px;
									color: #9B9B9B;
									padding-left: 30rpx;
									box-sizing: border-box;
								}
							}
							.item-header-right{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #4ECE8A;
								letter-spacing: 0;
								&.waitPay{
									color: #518FFF;
								}
								&.cancelPay{
									color: #9B9B9B;
								}
							}
						}
					}
					
					.item-center{
						padding-top: 28rpx;
						
						.item-center-header{
							display: flex;
							align-items: center;
							justify-content: space-between;
							.item-center-header-left{
								display: flex;
								align-items: center;
								.item-center-header-left-lesson{
									width: 76rpx;
									height: 34rpx;
									line-height: 34rpx;
									text-align: center;
									font-family: PingFangSC-Regular;
									font-size: 12px;
									color: #FE5E50;
									letter-spacing: -0.29px;
									border-radius: 2px;
									background: rgba(254,94,80,0.20);
								}
								.item-center-header-left-title{
									font-weight: bold;
									margin-left: 20rpx;
									box-sizing: border-box;
									font-family: PingFangSC-Semibold;
									font-size: 17px;
									color: #333333;
								}
							}
							.item-center-header-right{
								font-weight: bold;
								font-family: PingFangSC-Medium;
								font-size: 14px;
								color: #333333;
							}
						}
						.item-center-footer{
							padding-top: 38rpx;
							padding-bottom: 38rpx;
							box-sizing: border-box;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.item-center-footer-left{
								display: flex;
								align-items: center;
								.teacherAvatar{
									image{
										width: 56rpx;
										height: 56rpx;
										border-radius: 50%;
									}
								}
								.teacherInfo{
									display: flex;
									.teacherInfo-left{
										font-family: PingFangSC-Regular;
										font-size: 14px;
										color: #9B9B9B;
										letter-spacing: -0.34px;
										padding-left: 20rpx;
										box-sizing: border-box;
									}
									.teacherInfo-right{
										padding-left: 20rpx;
										box-sizing: border-box;
										font-family: PingFangSC-Regular;
										font-size: 14px;
										color: #333333;
									}
								}
							}
							.item-center-footer-right{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #FE5E50;
							}
						}
					}
					.dis-bottom-item{
						.item-bottom{
							display: flex;
							align-items: center;
							justify-content: flex-end;
							.item-bottom-left{
								font-family: PingFangSC-Regular;
								font-size: 12px;
								color: #9B9B9B;
								letter-spacing: -0.29px;
							}
							.item-bottom-right{
								font-weight: bold;
								font-family: PingFangSC-Medium;
								font-size: 18px;
								color: #D0021B;
							}
						}
					}
					
					.no-buy{
						display: flex;
						justify-content: flex-end;
						padding-top: 30rpx;
						box-sizing: border-box;
						.cancelButton, .nowPay{
							width: 160rpx;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							border-radius: 15px;
							box-sizing: border-box;
							font-family: PingFangSC-Regular;
							font-size: 14px;
							color: #9B9B9B;
						}
						.cancelButton{
							border: 1px solid #9B9B9B;
						}
						.nowPay{
							margin-left: 30rpx;
							box-sizing: ;
							background: #FE5E50;
							color: #FFFFFF;
						}
					}
				}
			}
		}
		::-webkit-scrollbar {
		  width: 0;
		  height: 0;
		  color: transparent;
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
		z-index: 999999 !important;
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
