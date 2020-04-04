<template>
	<view class="recharge">
		<!-- <view class="recharge-wrapper">
			<view class="recharge-title">充值金额</view>
			<view class="recharge-center">
				<view>¥</view>
				<input type="number" placeholder="请输入要充值的金额"/>
			</view>
			<view class="recharge-bottom">
				<image src="../../static/image/tabbar/star-active.png" mode=""></image>
				<input type="number" placeholder="请输入要充值的金额"/>
			</view>
		</view>
		 -->
		<view class="main">
			<text class="main-header">充值金额</text>
			<!-- <text>提现金额须为10的倍数</text> -->
			<view class="input">
				<text>¥</text>
				<input v-model="rechargePrice" type="number" maxlength="8" placeholder="000" @blur="checkPrice">
			</view>
			<view>
				<image src="/static/image/icon/warring.png"></image>
				<text>学币余额</text>
				<text>¥{{ myEduMoney }}</text>
			</view>
		</view>
		<view class="line-30"></view>
		<view class="recharge-tip-box">
			<view class="recharge-tip-header">
				充值说明
			</view>
			<view class="recharge-tip-item">
				1、学币与登入账号为绑定关系，请您确认账户是否正确。
			</view>
			<view class="recharge-tip-item">
				2、充值成功后不可退款/提现/转赠他人，请谨慎操作。
			</view>
			<view class="recharge-tip-item">
				3、因课程价格不同，会发生充值学币＞课程价格的情况。
			</view>
		</view>
		
		<uni-popup ref="popupPay" type="bottom">
			<view class="popupPay-header">
				<view class="popupPay-header-left">您需支付</view>
				<view class="popupPay-header-right">¥{{rechargePrice}}元</view>
			</view>
			<!-- 	<view class="popupPay-middle">
				<view class="popupPay-middle-left">支付剩余时间</view>
				<view class="popupPay-middle-right">{{minutes}}:{{seconds}}</view>
			</view> -->
			<view class="popupPay-item" v-for="(popPay,index) in payInfo" :key="index" @tap="handleCircle(index)">
				<view class="circle">
					<view class="n-circle" v-show="circleShow === index"></view>
				</view>
				<image :src="popPay.image" mode="aspectFill"></image>
				<view class="pay-way">
					{{popPay.text}}
					<view class="pay-way-sectext" v-if="popPay.sectext">{{popPay.sectext}}</view>
				</view>
			</view>
			<view class="popupPay-button" @tap="payOrder">确认支付</view>
		</uni-popup>
		
		<SubmitButton :submitText = "'确认充值'" @submitClick = "submitClick"></SubmitButton>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import SubmitButton from '../../components/SubmitButton/SubmitButton.vue'
	export default {
		data () {
			return {
				payInfo: [{
					image: '../../static/image/my/weixinzhifu.png',
					text: '微信支付',
					sectext: '',
				}], // 支付方式
				circleShow: 0 ,// 支付圆圈
				myEduMoney: 0 ,// 学币余额,
				rechargePrice: '',
				backFlag: 0
			}
		},
		onLoad(options) {
			if (options.rechargeIndex) {
				this.backFlag = options.rechargeIndex  // 判断要怎么样回到上一页 
			}
			this.getUserInfo()
		},
		components: {
			SubmitButton,
			uniPopup
		},
		methods: {
			// 个人信息
			async getUserInfo(){
				
				let {data: res} = await this.$fetch(this.$api.userInfo,{},'GET', 'form')
				this.myEduMoney = res.money
			},
			// 显示底部模态框
			submitClick () {
				this.$refs.popupPay.open()
			},
			// 更改支付方式
			handleCircle (index) {
				this.circleShow = index
			},
			// 修正金额
			checkPrice () {
				console.log(this.rechargePrice)
				this.rechargePrice = Number(this.rechargePrice).toFixed(2)
			},
			// 支付
			async payOrder () {
				let openId = uni.getStorageSync('openId')
				let res = await this.$fetch(this.$api.xcxPay, {totalAmount: this.rechargePrice,openId}, 'POST', 'FORM')
				console.log(res)
				let payInfo = JSON.parse(res.msg)
				console.log(payInfo)
			
				uni.requestPayment({
				    provider: 'wxpay',
				    timeStamp: payInfo.timeStamp,
				    nonceStr: payInfo.nonceStr,
				    package: payInfo.package,
				    signType: payInfo.signType,
				    paySign: payInfo.paySign,
				    success: (res) => {
						this.$refs.popupPay.close()
						uni.showToast({
							icon: 'success',
							title: '支付成功'
						})
						setTimeout(() => {
							
							if (this.backFlag) {
								uni.switchTab({
									url:'../my/my'
								})
							} else {
								uni.navigateBack({
									delta: 1
								})
							}
							
						},1000)
				        console.log('success:' + JSON.stringify(res));
				    },
				    fail: (err) => {
						this.$refs.popupPay.close()
						uni.showToast({
							icon: 'success',
							title: '支付失败'
						})
				        console.log('fail:' + JSON.stringify(err));
				    }
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		height: 100%;
		background-color: rgb(246,246,246);
	}
	.recharge{
		background-color: #fff;
		.recharge-wrapper{
			.recharge-title{
				
			}
			.recharge-center{
				display: flex;
				align-items: center;
			}
			.recharge-bottom{
				display: flex;
				align-items: center;
				image{
					width: 24rpx;
					height: 24rpx;
				}
			}
		}
		.main {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 30upx;
			padding-bottom: 0;
			box-sizing: border-box;
			
			text:first-child {
				font-family: PingFangSC-Semibold;
				font-size: 16px;
				color: #5B5B5B;
				letter-spacing: -0.39px;
				text-align: justify;
				font-weight: bold;
			}
			
			text:nth-child(2) {
				font-family: PingFangSC-Regular;
				font-size: 24px;
				color: #4A4A4A;
				letter-spacing: -0.58px;
				text-align: center;
			}
			
			.input {
				font-size: 30px;
				color: #4A4A4A;
				display: flex;
				align-items: center;
				padding: 40rpx 0;
				padding-bottom: 20rpx;
				border-bottom: 1upx solid #f6f6f6;
				box-sizing: border-box;
				text {
					font-size: 24px;
					margin-right: 20upx;
				}
				
				input {
					flex: 1;
					font-size: 30px;
					height: 30px;
				}
			}
			
			view:nth-child(3) {
				display: flex;
				align-items: center;
				margin-top: 20upx;
				
				image {
					width: 30upx;
					height: 30upx;
				}
				
				text:nth-child(2) {
					font-size: 24upx;
					color: #9B9B9B;
					margin: 0 10upx 0 10upx;
				}
				
				text:last-child {
					color: #fe5e50;
					font-weight: bold;
				}
			}
			
			view:last-child {
				// margin-top: 10rpx;
				padding-top: 24rpx;
				padding-bottom: 42rpx;
				box-sizing: border-box;
				font-size: 12px;
				color: #9B9B9B;
				// margin-left: 40rpx;
			}
		}
		.recharge-tip-box{
			padding: 30rpx;
			box-sizing: border-box;
			.recharge-tip-header{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: 0;
				text-align: justify;
			}
			.recharge-tip-item{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #333333;
				letter-spacing: 0;
				text-align: justify;
				padding-top: 30rpx;
				box-sizing: border-box;
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
		z-index: 999;
		.popupPay-header {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			padding-top: 60rpx;
			box-sizing: border-box;
	
			.popupPay-header-left {
				font-family: PingFangSC-Semibold;
				font-size: 17px;
				color: #09023E;
				letter-spacing: -0.41px;
				font-weight: bold;
				margin-right: 20rpx;
				box-sizing: border-box;
			}
	
			.popupPay-header-right {
				font-family: PingFangSC-Semibold;
				font-size: 24px;
				color: #FF8516;
				letter-spacing: -0.58px;

			}
		}
	
		.popupPay-middle {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			padding-top: 28rpx;
			box-sizing: border-box;
	
			.popupPay-middle-left {
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: rgba(9, 2, 62, 0.30);
				letter-spacing: -0.34px;
			}
	
			.popupPay-middle-right {
				margin-left: 20rpx;
				box-sizing: border-box;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #5468FF;
				letter-spacing: -0.34px;
			}
		}
	
		.popupPay-item {
			width: 100%;
			display: flex;
			margin-top: 60rpx;
			padding-left: 30rpx;
			box-sizing: border-box;
	
			.circle {
				width: 36rpx;
				height: 36rpx;
				border-radius: 50%;
				border: 1px solid rgba(9, 2, 62, 0.30);
				position: relative;
	
				.n-circle {
					width: 24rpx;
					height: 24rpx;
					border-radius: 50%;
					background: #5468FF;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
				}
			}
	
			image {
				width: 40rpx;
				height: 40rpx;
				margin-left: 30rpx;
				margin-right: 20rpx;
				box-sizing: border-box;
			}
	
			.pay-way {
				display: flex;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #333333;
				letter-spacing: -0.34px;
	
				.pay-way-sectext {
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: rgba(9, 2, 62, 0.30);
					letter-spacing: -0.34px;
				}
			}
		}
		
		.popupPay-button {
			margin: 30rpx;
			box-sizing: border-box;
			width: 690rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			background: #FE5E50;;
			border-radius: 4px;
			border-radius: 4px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #FFFFFF;
			letter-spacing: -0.34px;
		}
	}
</style>
