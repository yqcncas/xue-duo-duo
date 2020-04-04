<template>
	<view class="container" v-show="showContainer">
		<image class="header-bg" :src="detail.course.pic" mode="aspectFill"></image>
		<!-- 课程信息 --> 
		<view class="course-info">
			<view class="type">
				<text>{{ detail.course.courseTypeName }}</text>
				<text>{{ detail.course.name }}</text>
			</view>
			<!-- <view class="address" v-if="!handleExist" style="margin-bottom: 20rpx;">
				<text style="margin-right: 22rpx;">上课地址</text>
				<text>{{ detail.course.address }}</text> 
			</view> -->
			<view class="time"> 
				<text>时间</text>
				<text class="time-timer">{{ detail.course.classTime }}</text>
			</view>
			<view class="level">
				<text>推荐</text>
				<image v-for="(item, startIndex) in detail.course.level" :key = "startIndex" src="../../static/image/icon/2.png" mode="aspectFill"></image>
			</view>
			
			<!-- 价格，收藏等 -->
			<view class="main">
				<view class="left">
					<text>共{{ detail.course.times }}名同学学习该课程</text>
				</view>
				<view class="detail-price">¥{{ detail.course.price }}</view>
			</view>
			<view class="group-line" v-if="grOrLes == 1">
				<view class="group-line-color" :style="{width: lineWidth + '%'}"></view>
			</view>
			<view class="group-main-item-bottom-footer" v-if="grOrLes == 1">
				<view class="group-main-item-bottom-footer-left">
					<view class="shengyushijian">剩余时间</view>
					<view class="shengyushijian-timer"><span>{{day}}天</span>{{hour}}小时{{minute}}分{{second}}秒</view>
				</view>
				<!-- <view class="group-main-item-bottom-footer-right manren" v-if="groupItem.actualNum / groupItem.estimateNum == 1">
					已满
				</view> -->
				<view class="group-main-item-bottom-footer-right" >
					<span class = "cantuan">{{detail.course.assemble.actualNum}}</span>/<span class="jietuan">{{detail.course.assemble.estimateNum}}</span>
				</view>
				
			</view>
			<!-- 过渡线 -->
		</view>
		<view class="line-30"></view>
		<!-- 授课老师 -->
		<view class="teachar">
			<view>授课老师</view>
			<scroll-view :scroll-x="true" class="teacher-list">
				<view class="teacher-item-new"  @click="handleOpenTeacherDetail(item.userId)" v-for="(item, index) in detail.course.teachers" :key = "index">
					<view class="teacher-item-new-left">
						<image class="avatar" :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="teacher-item-new-right">
						<view class="teacher-item-new-right-left">
							<view class="teacher-item-new-right-left-top">
								<view>授课老师</view>
								<view>{{item.userName }}</view>
							</view>
							<view class="teacher-item-new-right-left-bottom">
								<view>授课地点</view>
								<view>{{item.address}}</view>
							</view>
						</view>
						<view class="teacher-item-new-right-right">
							<image src="../../static/image/icon/right.png" mode=""></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 过渡线 -->
		<view class="line-30"></view>
		<!-- 讲课大纲 -->
		<view class="course-list">
			<view class="title">讲课大纲·共{{ detail.course.childNum }}讲</view>
			<view class="course-list-item" v-for="(item, index) in lessonOutline" :key="item.chapterId">
				<view class="course-list-item-left">
					<text>第{{index}}节</text>
				</view>
				<view class="course-list-item-right">
					<view class="course-list-item-right-top">
						<text>{{ item.name }}</text>
					</view>
					<view class="course-list-item-right-bottom">
						<text>{{ item.createTime }}</text>
					</view>
				</view>
			</view>
			<!-- 全部课程 -->
			<view class="total" @click="hanldeOpenTotal">查看全部课程</view>
		</view>
		<!-- 过渡线 -->
		<view class="line-30" v-if="detail.course.actId"></view>
		<!-- 课程详情 -->
		<view class="course-active" v-if="detail.course.actId">
			<view class="title">课程活动</view>
			<image @click="handleOpenActiveDetail" class="active-pic" :src="detail.course.actPic" mode="aspectFill"></image>
		</view>
		<!-- 过渡线 -->
		<view class="line-30"></view>
		<view class="course-detail">
			<view class="title">课程详情</view>
			<parser :html="detail.course.content" show-with-animation lazy-load>加载中...</parser>
		</view>
		
		<view style="height: 128rpx;background: #F7F7F7;"></view>
		<!-- 用户暂未购买时 -->
		<view class="no-buy" v-if="!detail.buy">
			<view class="cart" @click="handleOpenCart">
				<image src="../../static/image/index/shopcart.png"></image>
				<text>购物车</text>
			</view>
			<view class="add-card" @click="handleAddCart">加入购物车</view>
			<view class="sign" @click="handleOpenLive">立即报名</view>
		</view>
		<view class="already-buy" v-if="detail.buy" @click="hanldeOpenTotal">
			<view class="service" @click="handleOpenService">
				<image src="/static/icon/5.png"></image>
				<text>客服</text>
			</view>
			<view>{{ handleExist ? '立即学习' : '章节列表' }}</view>
		</view>
		
		<uni-popup ref="popupPay" type="bottom">
			<view class="popupPay-header-lessondetail">
				<view class="popupPay-header-left">授课老师</view>
				<view class="popupPay-header-right" @click.stop="closePopupPay">
					<image src="../../static/image/note/chacha.png" mode=""></image>
				</view>
			</view>
			<view class="popupPay-center-lessondetail" v-for="(item, index) in detail.course.teachers" :key = "index" @click.stop="handleTeacher(item, index)">
				<view class="popupPay-center-lessondetail-left">
					<view class="popupPay-center-lessondetail-left-avatar">
						<image :src="item.pic" mode=""></image>
					</view>
					<view class="popupPay-center-lessondetail-left-main">
						<view class="popupPay-center-lessondetail-left-main-item">
							<view class="popupPay-center-lessondetail-left-main-item-left">授课老师</view>
							<view class="popupPay-center-lessondetail-left-main-item-right">{{item.userName }}</view>
						</view>
						<view class="popupPay-center-lessondetail-left-main-item">
							<view class="popupPay-center-lessondetail-left-main-item-left">授课地点</view>
							<view class="popupPay-center-lessondetail-left-main-item-right">{{item.address}}</view>
						</view>
					</view>
				</view>
				<view class="popupPay-center-lessondetail-right-circle" >
					<view class="active-circle" v-if="circleIndex == index"></view>
				</view>
			</view>
			<view class="popupPay-button" @tap="choiceTeacher">确认</view>
		</uni-popup>
	</view>
</template> 

<script>
	import { baseURL } from '@/config'
	import parser from "@/components/jyf-Parser/index"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				showContainer: false, // 数据是否加载完毕
				baseURL: baseURL,
				courseId: null,
				detail: { course: {} },
				courseTypeList: [],
				collectFlag: true, // 默认是可以点击收藏的
				handleExist: false,
				lessonOutline: [], //课程大纲
				circleIndex: 0,
				teacherId: '',
				orderPayFlag: 0 ,// 判断是订单还是购物车弹框
				grOrLes: 0 ,// 1是拼团进来 2是课程进来
				day: 0,
				hour: 0,
				minute: 0,
				second: 0,
				diffTotal: 0,
				timer: null,
				allOutLine: []
			};
		},
		computed: {
			lineWidth () {
				if (this.grOrLes == 1) {
					let lineWidth = this.detail.course.assemble.actualNum / this.detail.course.assemble.estimateNum * 100
					return lineWidth
				}
			} 
		},
		components: {
			parser,
			uniPopup
		},
		methods: {
			// 获取课程详情
			async getCourseInfo () {
				let {data: res} = await this.$fetch(this.$api.getCourseInfo, { courseId: this.courseId}, 'GET')
				this.showContainer = true
				console.log(res.course)
				this.detail.course = res.course
				
				// 大纲
				if (res.chapterList.length > 3) {
					for(let i = 0; i < 3; i++) {
						this.lessonOutline.push(res.chapterList[i])
					}
				} else {
					this.lessonOutline = res.chapterList
				}		
				this.allOutLine = res.chapterList
				// 时间
				if (this.grOrLes == 1) {
					let diff1 = this.$dayjs(this.detail.course.assemble.estimateEndTime)
					let diff2 = this.$dayjs()
					this.diffTotal = diff1.diff(diff2, 'second')
					clearInterval(this.timer)
					this.timer = null
					this.cutDownTimer()
					this.timer = setInterval(() => {
						this.diffTotal--
						if (this.diffTotal <= 0) {
							this.day = 0
							this.hour = 0
							this.minute = 0
							this.second = 0
							this.endOfTime()
							return
						}
						this.cutDownTimer()
					}, 1000)
				}
			},
			// 查看全部课程
			hanldeOpenTotal () {
				uni.navigateTo({
					url:'../Outline/Outline?allLesson=' + JSON.stringify(this.allOutLine)
				})
			},
			// 前往购物车页面
			handleOpenCart () {
				uni.navigateTo({
					url: '../Shopcart/ShopCart'
				})
			},
			// 加入购物车
			async handleAddCart () {
				if (this.grOrLes == 1 && this.diffTotal <= 0) {
					return uni.showToast({
						icon: 'none',
						title: '该拼团时间已结束,请重新进行选择'
					})
				} 
				if (this.detail.course.teachers.length > 1) {
					this.orderPayFlag = 0
					this.$refs.popupPay.open()
				} else {
					let res = await this.$fetch(this.$api.addCart, { courseId: this.courseId, teacherId: this.detail.course.teacherId }, 'GET')
					if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
					uni.showToast({ title: '加入购物车成功~' })
				}
				
			},
			cutDownTimer(){
				this.day = parseInt((this.diffTotal / 60 / 60) / 24)
				this.hour = Math.floor(this.diffTotal / (60 * 60))
				this.minute = Math.floor(this.diffTotal / 60) - (this.hour * 60)
				this.second = Math.floor(this.diffTotal) - (this.hour * 60 * 60) - (this.minute * 60)
				if (this.hour < 10) {
					this.hour = "0" + this.hour
				}
				if (this.minute < 10) {
					this.minute = "0" + this.minute
				}
				if (this.second < 10) {
					this.second = "0" + this.second
				}
				if (this.diffTotal <= 0) {
					this.day = 0
					this.hour = 0
					this.minute = 0
					this.second = 0
					this.endOfTime()
				}
			},
			endOfTime () {
				clearInterval(this.timer)
				this.timer = null;
			},
			// 若多个老师 进行选择
			handleTeacher (item, index) {
				this.circleIndex = index
			},
			// 关闭弹窗
			closePopupPay () {
				this.$refs.popupPay.close()
			},
			// 多个老师下单
			async choiceTeacher () {
				this.teacherId = this.detail.course.teacherId.split(',')[this.circleIndex]
				if (this.orderPayFlag) {
					uni.showLoading({
						title: '加载中'
					})
					let res = await this.$fetch(this.$api.genOrderFromCourse, { courseId: this.courseId, teacherId: this.teacherId}, 'GET')
					if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
					uni.hideLoading()
					uni.navigateTo({
						url: '../orderDeatail/OrderDetail?orderId=' + res.data.orderId
					})
				} else {
					let res = await this.$fetch(this.$api.addCart, { courseId: this.courseId, teacherId: this.teacherId }, 'GET')
					if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
					uni.showToast({ title: '加入购物车成功~' })
					this.$refs.popupPay.close()
				}
				
			},
			// 课程直接生成订单
			async handleOpenLive () {
				if (this.grOrLes == 1 && this.diffTotal <= 0) {
					return uni.showToast({
						icon: 'none',
						title: '该拼团时间已结束,请重新进行选择'
					})
				} 
				
				if (this.detail.course.teachers.length > 1) {
					this.orderPayFlag = 1
					this.$refs.popupPay.open()
				} else {
					let res = await this.$fetch(this.$api.genOrderFromCourse, { courseId: this.courseId, teacherId: this.detail.course.teacherId}, 'GET')
					if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
					// 已生成订单之后 
					uni.navigateTo({
						url: '../orderDeatail/OrderDetail?orderId=' + res.data.orderId
					})
				}
				
			},

			// 打开教师详情
			handleOpenTeacherDetail (id) { 
				uni.navigateTo({ url:  '../TeacherDetail/TeacherDetail?teacherId='+ id })	
			},
			// 前往活动详情
			handleOpenActiveDetail () {
				if (this.detail.course.actId) uni.navigateTo({ url: '/pages/activity/activity?actId='+this.detail.course.actId })
			} 
		},
		onLoad(options) {
			this.courseTypeList = uni.getStorageSync('course_type_list') || []
			this.courseId = options.courseId
			this.grOrLes = options.grOrLes
			this.getCourseInfo() 
		},
		onShow() {
			this.getCourseInfo() 
		}
	}
</script>

<style lang="less">
	page::after{
		display: none;
	}
.container {
	
	.header-bg {
		width: 100vw;
		height: 430rpx;
	}
	
	.course-info {
		padding: 30rpx;
		background-color: #fff;
		.type {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			text:first-child {
				background: #FE5E50;
				padding: 2rpx 6rpx;
				margin-right: 22rpx;
				font-size: 12px;
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 4rpx;
			}
			
			text:last-child {
				font-size: 17px;
				color: #333333;
				font-weight: bold;
			}
		}
		.address{
			text{
				&:nth-child(1) {
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #9B9B9B;
					letter-spacing: -0.34px;
				}
				&:nth-child(2) {
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #333333;
					letter-spacing: -0.34px;
				}
			}
		}
		
		.time, .level {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			text:first-child {
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: -0.34px;
				margin-right: 30rpx;
			}
		}
		.time{
			.time-timer{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #333333;
				letter-spacing: -0.34px;
			}
		}
		.level {
			
			image {
				width: 24rpx;
				height: 24rpx;
				margin-right: 6rpx;
			}
		}
		.group-line{
			margin-top: 30rpx;
			margin-bottom: 20rpx;
			width: 100%;
			height: 8rpx;
			border-radius: 2px;
			box-sizing: border-box;
			background-color: #F0F0F0;
			position: relative;
			.group-line-color{
				width: 50%;
				height: 100%;
				border-radius: 2px;
				box-sizing: border-box;
				background-color: #FE5E50;;
				position: absolute;
			}
		}
		
		.main {
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			view:first-child {
				display: flex;
				align-items: center;
				
				text:first-child {
					font-size: 22px;
					color: #D0021B;
					margin-right: 20rpx;
				}
				
				text:last-child {
					font-size: 12px;
					color: #9B9B9B;
				}
			}
			.detail-price{
				font-family: PingFangSC-Semibold;
				font-size: 22px;
				color: #D0021B;
				letter-spacing: -0.53px;
			}
			image {
				width: 42rpx;
				height: 38rpx;
			}
		}
	}

	.teachar {
		padding: 30rpx;
		background-color: #fff;
		& > view:first-child {
			font-size: 17px;
			font-weight: bold;
		}
		
		.teacher-list {
			white-space: nowrap;
			margin-top: 20rpx;
			
			.teacher-item {
				display: inline-block;
				margin-right: 60rpx;
				& > view {
					height: 90rpx;
					
					image {
						width: 90rpx;
						height: 90rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}
					
					& > view {
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-right: 30rpx;
						
						text:first-child {
							font-size: 12px;
							color: #9B9B9B;
						}
					}
				}
			} 
		}
	}

	.course-list {
		padding: 30rpx;
		background-color: #fff;
		.title {
			font-size: 17px;
			font-weight: bold;
		}
		
		.item {
			padding: 30rpx 0;
			border-bottom: 1px solid #F7F7F7;
			
			& > view:first-child {
				
				text:first-child {
					color: #8987DF;
					margin-right: 30rpx;
				}
			}
			
			& > .vip-handle {
				display: flex;
				justify-content: flex-end;
				
				& > view {
					margin-top: 20rpx;
					width: 150rpx;
					height: 60rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 8rpx;
					color: #FFFFFF;
					
					&.recorded {
						background: #618FF0;
					}
					
					&.live {
						background: #8987DF;
					}
					
					&.not-started {
						background: #F7F7F7;
						color: #9B9B9B;
					}
				}
			}
		}
		
		.total {
			background: #F7F7F7;
			border-radius: 30rpx;
			width: 220rpx;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #9B9B9B;
			margin: 0 auto;
			margin-top: 40rpx;
			margin-bottom: 20rpx;
			font-size: 14px;
			color: #9B9B9B;
			box-sizing: border-box;
		}
	}
	
	.course-active {
		padding: 30rpx;
		
		.title {
			font-size: 17px;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		
		.active-pic {
			width: 690rpx;
			height: 300rpx;
			border-radius: 6rpx; 
		}
	}
	
	.course-detail {
		padding: 30rpx;
		background-color: #fff;
		.title {
			font-size: 17px;
			font-weight: bold;
		}
	}
	
	.no-buy {
		border-top: 1rpx solid #F6F6F6;
		position: fixed;
		background: #FFFFFF;
		bottom: 0;
		width: 100vw;
		height: 98rpx;
		display: flex;
		
		& > view {
			flex: 2;
			
			image {
				width: 40rpx;
				height: 40rpx;
				margin-bottom: 6rpx;
			}
		}
		
		.service, .cart {
			flex: 1;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center; 
			color: #9B9B9B;
		}
		
		.add-card, .sign{
			background: #FE9B42;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
		}
		
		.sign {
			background: #FE5E50;
		}
	}
	
	.already-buy {
		border-top: 1rpx solid #F6F6F6;
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 98rpx;
		display: flex;
		// justify-content: center;
		align-items: center;
		color: #FFFFFF; 
		background: #FFFFFF;
		
		.service {
			width: 125rpx;
			height: 98rpx;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center; 
			color: #9B9B9B;
			
			image {
				width: 46rpx;
				height: 46rpx;
				margin-bottom: 6rpx;
			}
		}
		
		&:active {
			opacity: .8;
		}
		
		view:last-child {
			flex: 1;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #8987DF;
		}
	}
	.course-list-item{
		padding-top: 30rpx;
		box-sizing: border-box;
		display: flex;
		.course-list-item-left{
			margin-right: 30rpx;
			box-sizing: border-box;
			text{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: -0.34px;
			}
		}
		.course-list-item-right{
			display: flex;
			flex-direction: column;
			.course-list-item-right-top{
				text{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #333333;
					letter-spacing: -0.34px;
				}
			}
			.course-list-item-right-bottom{
				padding-top: 20rpx;
				box-sizing: border-box;
				text{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #9B9B9B;
					letter-spacing: -0.34px;
				}
			}
		}
	}
	.teacher-item-new{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #F7F7F7;
		padding: 20rpx 30rpx;
		margin-top: 20rpx;
		box-sizing: border-box;
		border-radius: 2px;
		overflow: hidden;
		&:nth-child(1){
			margin-top: 0;
		}
		.teacher-item-new-left{
			image{
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
		}
		.teacher-item-new-right{
			flex: 1;
			display: flex;
			justify-content: space-between;
			.teacher-item-new-right-left{
				.teacher-item-new-right-left-top, .teacher-item-new-right-left-bottom{
					display: flex;
					view{
						&:nth-child(1) {
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #9B9B9B;
							letter-spacing: -0.29px;
							margin-right: 20rpx;
							box-sizing: border-box;
						}
						&:nth-child(2) {
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #333333;
							letter-spacing: -0.29px;
						}
					}
				}
				// .teacher-item-new-right-left-bottom{
				// 	display: flex;
				// }
			}
			.teacher-item-new-right-right{
				image{
					width: 16rpx;
					height: 26rpx;
				}
			}
		}
		
	}
	.group-main-item-bottom-footer{
		display: flex;
		justify-content: space-between;
		.group-main-item-bottom-footer-left{
			display: flex;
			.shengyushijian{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: -0.34px;
				text-align: justify;
			}
			.shengyushijian-timer{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #518FFF;
				letter-spacing: -0.34px;
				text-align: justify;
				padding-left: 30rpx;
				box-sizing: border-box;
			}
		}
		.group-main-item-bottom-footer-right{
			&.manren{
				width: 80rpx;
				height: 34rpx;
				background: rgba(254,94,80,0.30);
				border-radius: 2px;
				font-family: PingFangSC-Regular;
				font-size: 12px;
				color: #FE5E50;
				letter-spacing: -0.29px;
				text-align: justify;
				text-align: center;
			}
			.cantuan{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #FE9B42;
				letter-spacing: -0.34px;
				text-align: justify;
			}
			.jietuan{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #151515;
				letter-spacing: -0.34px;
				text-align: justify;
				
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
		.popupPay-header-lessondetail{
			height: 48rpx;
			display: flex;
			justify-content: space-between;
			.popupPay-header-left{
				font-family: PingFangSC-Semibold;
				font-size: 17px;
				color: #333333;
				letter-spacing: -0.41px;
				font-weight: bold;
			}
			.popupPay-header-right{
				flex: 1;
				text-align: right;
				color: #B2B2B2;
				image{
					width: 26rpx;
					height: 28rpx;
				}
			}
		}
		.popupPay-center-lessondetail{
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #F7F7F7;
			padding: 20rpx 30rpx;
			margin-top: 20rpx;
			box-sizing: border-box;
			.popupPay-center-lessondetail-left {
				display: flex;
				align-items: center;
				.popupPay-center-lessondetail-left-avatar{
					image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
				}
				.popupPay-center-lessondetail-left-main{
					padding-left: 30rpx;
					box-sizing: border-box;
					.popupPay-center-lessondetail-left-main-item{
						display: flex;
						padding-bottom: 10rpx;
						
						box-sizing: border-box;
						.popupPay-center-lessondetail-left-main-item-left{
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #9B9B9B;
							letter-spacing: -0.29px;
						}
						.popupPay-center-lessondetail-left-main-item-right{
							padding-left: 20rpx;
							box-sizing: border-box;
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #333333;
							letter-spacing: -0.29px;
							
							
						}
					}
				}
			}
			.popupPay-center-lessondetail-right-circle{
				width: 44rpx;
				height: 44rpx;
				border: 1rpx solid #B2B2B2;
				border-radius: 50%;
				box-sizing: border-box;
				position: relative;
				.active-circle{
					width: 29.4rpx;
					height: 29.4rpx;
					border-radius: 50%;
					box-sizing: border-box;
					background: #FE5E50;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-49%, -49%);
				}
			}
		}
		
		.popupPay-button {
			margin: 30rpx;
			border-radius: 20px;
			box-sizing: border-box;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: #FE5E50;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #FFFFFF;
			letter-spacing: -0.34px;
		}
		
	}
</style>
