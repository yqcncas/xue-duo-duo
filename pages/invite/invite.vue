<template>
	<view class="invite">
		<view class="invite-box">
			<view class="invite-header">我的推荐二维码</view>
			<view class="invite-center-box">
				<image src="../../static/image/my/inviteborder.png" mode="" class="invite-center-box-wrapper"></image>
				<image :src="QRUrl" mode="" class="qrcode"></image>
			</view>
		</view>
		<view class="save-image" @click="saveImage">保存二维码</view>
	</view>
</template>

<script>
	import baseURL from '../../config/index.js'
	export default {
		onLoad(options) {
			// this.initGetQRCode()
			this.QRUrl = options.QRUrl
		},
		data () {
			return {
				qrcode: '',
				avatar: '',
				userName: '',
				RichText: [],
				inviteCode: '',
				sharUrl:'',
				QRUrl: ''
			}
		},
		methods: {
			goToBack () {
				uni.navigateBack({
					delta:1
				})
			},
			// 初始化二维码
			// async initGetQRCode () {
			// 	let res = await this.$fetch(this.$api.getQrCode,{},'GET','FORM')
			// 	console.log(res.data)
			// 	this.QRUrl = baseURL +　res.data.slice(1)
			// 	console.log(this.QRUrl)
			// },
			//保存图片
			saveImage(){
				uni.authorize({
				    scope: 'scope.writePhotosAlbum',
				    success:() => {
				       uni.downloadFile({
				           url: this.QRUrl, //仅为示例，并非真实的资源
				           success: (res) => {
				               if (res.statusCode === 200) {
				       			uni.saveImageToPhotosAlbum({
				       				filePath: res.tempFilePath,
				       				success: function() {
				       					uni.showToast({
				       						icon: "success",
				       						title: "保存成功"
				       						
				       					});
				       				},
				       				fail: function() {
				       					uni.showToast({
				       						title: "保存失败，请稍后重试",
				       						icon: "none"
				       					});
				       				}
				       			});
				         
				               }
				           },
						   fail:() => {
						   	uni.showModal({
						   		title: '授权提示',
								content: '暂未授权, 是否授权',
								showCancel: false,
								success: res => {
									uni.openSetting()
								}
						   	})
						   }
				       });
				    }
				})
				
				
			}
		}
	}
</script>

<style lang="less">
	// page::after{
	// 	display: none;
	// }
	.invite{
		width: 100%;
		height: 100%;
		.invite-box{
			width: 570rpx;
			height: 714rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			background: #FE5E50;
			padding: 0 60rpx;
			padding-bottom: 142rpx;
			border-radius: 7px;
			box-sizing: border-box;
			.invite-header{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #FFFFFF;
				letter-spacing: -0.34px;
				text-align: center;
				padding-top: 60rpx;
				padding-bottom: 20rpx;
				box-sizing: border-box;
			}
			.invite-center-box{
				.invite-center-box-wrapper{
					width: 100%;
					position: relative;
				}
				.qrcode{
					width: 366rpx;
					height: 366rpx;
					position: absolute;
					left: 50%;
					top:50%;
					transform: translate(-50%, -50%);
				}
			}
		}
		.save-image{
			width: 100%;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #FFFFFF;
			letter-spacing: -0.34px;
			position: fixed;
			bottom: 0;
			left: 0;
			background: #FE5E50;
		}
	}
</style>
