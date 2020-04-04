<template>
	<view class="my">
		<view class="myheader" @click="goToMyInfo">
			<view class="avatar">
				<image src="../../static/image/my/toux.png" mode="" style="display: block;width: 100%; height: 100%;" v-if="avatar == ''"></image>
				<image :src="avatar" mode="widthFix" v-else></image>
			</view>
			<view class="user-info">
				<view class="user-name">{{userName}}</view>
				<image src="../../static/image/note/right.png" mode="" style="width: 16rpx;height: 26rpx;"></image>
			</view>
			
		</view>
		<view class="nav">
			<view class="nav-left" @click="goToMyMoney">
				<view class="nav-left-top">{{myMoney}}</view>
				<view class="nav-left-bottom">
					<image src="../../static/image/my/money.png" mode=""></image>
					<view>我的金币</view>
				</view>
			
			</view>
			<view class="my-line"></view>
			<view class="nav-right" @click="goToMyEduMoney">
				<view class="nav-right-top">{{myEduMoney}}</view>
				<view class="nav-right-bottom">
					<image src="../../static/image/my/eduMoney.png" mode=""></image>
					<view>我的学币</view>
				</view>
			</view>
		</view>
		
		<view class="my-main">
			<view class="my-main-header">常用工具</view>
			<view class="my-main-box">
				<view class="my-main-item" @click="goToMyOrder">
					<view class="my-main-item-left">
						<image src="../../static/image/my/order.png" mode=""></image>
						<view>我的订单</view>
					</view>
					<view class="my-main-item-right">
						<image src="../../static/image/icon/right.png" mode=""></image>
					</view>
				</view>
				<view class="my-main-item" @click="goToMyGroup">
					<view class="my-main-item-left">
						<image src="../../static/image/my/group.png" mode=""></image>
						<view>我的拼团</view>
					</view>
					<view class="my-main-item-right">
						<image src="../../static/image/icon/right.png" mode=""></image>
					</view>
				</view>
				<view class="my-main-item" @click="goToMyInvite(QRUrl)">
					<view class="my-main-item-left">
						<image src="../../static/image/my/invite.png" mode=""></image>
						<view>邀请好友</view>
					</view>
					<view class="my-main-item-right">
						<image src="../../static/image/icon/right.png" mode=""></image>
					</view>
				</view>
				<view class="my-main-item" @click="goToSetting">
					<view class="my-main-item-left">
						<image src="../../static/image/my/setting.png" mode=""></image>
						<view>平台设置</view>
					</view>
					<view class="my-main-item-right">
						<image src="../../static/image/icon/right.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="circle"></view> -->
		<!-- 授权弹窗 -->
		<loginModal :show="loginModalShow" @close="ModalClose" @fresh="getFresh"></loginModal>
	</view>
</template>

<script>
	import baseURL from '@/config/index.js'
	import loginModal from '../../components/Modal/loginModal.vue'
	export default {
		data() {
			return {
				privateObj: {
					searchHeight: 0, // 搜索框高度，单位px
					searchTop: 0, // 搜索框距离顶部距离
				},
				loginModalShow:false,
				payShow:false,
				userName:'未登录',
				mobile:'',
				avatar:'',
				myEduMoney: 0,
				myMoney: 0,
				QRUrl: ''
			}
		},
		components:{
			loginModal
		},
		methods:{
			// 我的订单
			goToMyOrder () {
				uni.navigateTo({
					url: '../order/order'
				})
			},
			// 我的拼团
			goToMyGroup () {
				uni.navigateTo({
					url: '../GroupOrder/GroupOrder'
				})
			},
			// 邀请好友
			goToMyInvite (QRUrl) {
				uni.navigateTo({
					url: '../invite/invite?QRUrl=' + QRUrl
				})
			},
			// 设置中心
			goToSetting () {
				uni.navigateTo({
					url: './SystemSetting'
				})
			},
			
			// 我的信息
			goToMyInfo () {
				uni.navigateTo({
					url: './MyInfo'
				})
			},
			// 我的金币
			goToMyMoney () {
				uni.navigateTo({
					url: '../MyMoney/Mymoney'
				})
			},
			// 我的学币
			goToMyEduMoney () {
				uni.navigateTo({
					url: '../MyStudyMoney/MyStudyMoney'
				})
			},
			// 关闭授权弹窗
			ModalClose(data){
				this.loginModalShow = data
				this.getUserInfo()
			},
			// 二维码
			async initGetQRCode () {
				let res = await this.$fetch(this.$api.getQrCode,{},'GET','FORM')
				this.QRUrl = baseURL +　res.data.slice(1)
				console.log(this.QRUrl)
			},
			// 获取个人信息
			async getUserInfo(){
				
				let res = await this.$fetch(this.$api.userInfo,{},'GET', 'form')
				this.userName = res.data.userName
				this.mobile = res.data.phonenumber
				this.avatar = res.data.avatar
				this.myEduMoney = Number(res.data.money).toFixed(2)
				this.myMoney = Number(res.data.reward).toFixed(2)
				
				if (!this.myMoney) {
					this.myMoney = 0
				}
				if (!this.myEduMoney) {
					this.myEduMoney = 0
				}
				let userInfo = {
					userAvatar: this.avatar,
					userName: this.userName,
					userId: res.data.userId
				}
				uni.setStorageSync('userInfo', userInfo)
				
				if (res.data.userId) {
					uni.setStorageSync('userId', res.data.userId)
				}
				let classTrue = {
					id: res.data.classTypeId,
					name: res.data.classType.name
				}
				uni.setStorageSync('classTrue', JSON.stringify(classTrue))
				uni.setStorageSync('classTrueId', res.data.classTypeId)
				uni.setStorageSync('classBackFresh',true)
				this.initGetQRCode()
				
				
			},
			// 注册完成后重新获取个人信息
			getFresh(data){
				console.log(data)
				if(data){
					this.getUserInfo()
				}
			},
			
		},
		onShow() {
			if(!uni.getStorageSync('token')){
				this.loginModalShow = true
			}else{
				this.getUserInfo()
			}
			setTimeout(() => {
				if(uni.getStorageSync('showLogin')) {
					this.loginModalShow = uni.getStorageSync('showLogin')
				}
			}, 300)
			
		},
		
		
	}
</script>

<style lang="less">
	page{
		width: 100%;
		height: 100%;
	}
	page::after {
		display: none;
	}
	.my{
		width: 100%;
		height: 100%;
		background-color: #fff;
		.myheader{
			width: 100%;
			height: 31.8%;
			background: #FE5E50;
			display: flex;
			padding: 9.7% 4% 0;
			// padding-top: 160rpx;
			box-sizing: border-box;
			position: relative;
			align-items: center;
			.avatar{
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;
				transform: translateY(-30rpx);
				image{
					width: 100%;
				}
			}
			.user-info{
				display: flex;
				align-items: center;
				margin-left: 4%;
				box-sizing: border-box;
				transform: translateY(-30rpx);
				.user-name{
					font-family: PingFangSC-Regular;
					font-size: 17px;
					color: #FFFFFF;
					margin-top: 0.3%;
					box-sizing: border-box;
					margin-bottom: 6rpx;
				}
				
				image{
					margin-left: 30rpx;
					box-sizing: border-box;
				}
			}
			.user-install{
				width: 166rpx;
				height: 60rpx;
				background-image: linear-gradient(221deg, #FADF64 0%, #F2BB34 100%);
				box-shadow: 0 4px 8px 0 rgba(0,0,0,0.03), 0 2px 4px 0 rgba(0,0,0,0.05);
				border-radius: 100px 0 0 100px;
				font-family: PingFangSC-Regular;
				font-size: 12px;
				color: #FFFFFF;
				text-align: center;
				line-height: 60rpx;
				position: absolute;
				right: 0;
				// top:28%;
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.icon{
					content: "";
					width: 15upx;
					height: 15upx;
					border-top: 4upx solid rgba(255,255,255,0.70);
					border-right: 4upx solid rgba(255,255,255,0.70);
					transform: rotate(45deg);
				}
			}
		}
		.nav{
			width: 690rpx;
			height: 206rpx;
			padding: 0 4%;
			box-sizing: border-box;
			position: absolute;
			top: 24%;
			left: 50%;
			transform: translateX(-50%);
			background: #FFFFFF;
			box-shadow: 0 4px 8px 0 rgba(0,0,0,0.03), 0 2px 4px 0 rgba(0,0,0,0.05);
			border-radius: 7px;
			border-radius: 7px;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.my-line{
				width: 2rpx;
				height: 90rpx;
				background: #F7F7F7;
			}
			.nav-left,.nav-right{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image{
					width: 30rpx;
					height: 30rpx;
				}
				.nav-left-bottom, .nav-right-bottom{
					display: flex;
					align-items: center;

					image{
						width: 32rpx;
						height: 32rpx;
					}
					view{
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #9B9B9B;
						text-align: center;
						margin-left: 18rpx;
						box-sizing: border-box;
					}
				}
				.nav-left-top, .nav-right-top{
					font-family: PingFangSC-Semibold;
					font-size: 24px;
					color: #333333;
					text-align: center;
				}
			}
		}
		.tool{
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #8E8E93;
			letter-spacing: 0;
			// margin-top: 20%;
			padding: 0 4% 0;
			font-weight: bold;
			box-sizing: border-box;
		}
		.detail{
			padding: 0 4%;
			box-sizing: border-box;
			width: 92%;
			margin-top: 3%;
			box-sizing: border-box;
			position: relative;
			left: 50%;
			transform: translateX(-50%);
			background: #FFFFFF;
			box-shadow: 0 4px 8px 0 rgba(0,0,0,0.03), 0 2px 4px 0 rgba(0,0,0,0.05);
			border-radius: 7px;
			border-radius: 7px;
			.detail-item{
				// padding: 2.7% 0% 6% 4%;
				height: 100rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #F4F4F4;
				.item-img{
					image{
						width: 30rpx;
						height: 30rpx;
						// vertical-align: middle;
					}
				}
				.item-right{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.item-right-right{
						image{
							width: 30rpx;
							height: 30rpx;
						}
					}
				}
			}
		}
		// .circle{
		// 	width: 20rpx;
		// 	height: 20rpx;
		// 	border-radius: 50%;
		// 	background-color: red;
		// 	position: relative;
		// 	right: 0;
		// 	bottom: 0;
		// }
		.my-main{
			position: relative;
			top: 160rpx;
			.my-main-header{
				padding-left: 30rpx;
				padding-bottom: 20rpx;
				box-sizing: border-box;
				font-family: PingFangSC-Semibold;
				font-size: 17px;
				color: #333333;
				letter-spacing: -0.41px;
				font-weight: bold;
			}
			.my-main-box{
				padding: 0 30rpx;
				box-sizing: border-box;
				background-color: #fff;
				box-shadow: 0 2px 7px 0 rgba(254,94,80,0.03), 0 5px 10px 0 rgba(254,94,80,0.05);
				border-radius: 4px;
				.my-main-item{
					height: 88rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx;
					box-sizing: border-box;
					border-bottom: 1rpx solid #f7f7f7;
					&:last-child{
						border: none;
					}
					.my-main-item-left{
						display: flex;
						align-items: center;
						image{
							width: 60rpx;
							height: 60rpx;
						}
						view{
							margin-left: 36rpx;
							font-family: PingFangSC-Regular;
							font-size: 14px;
							color: #4A4A4A;
							letter-spacing: 0;
						}
					}
					.my-main-item-right{
						image{
							width: 16rpx;
							height: 26rpx;
						}
					}
				}
			}
		}
	}
</style>
