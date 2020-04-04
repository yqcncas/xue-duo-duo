<template>
	<view class="container">
		<view class="edit-info line">
			<view>
				<text>绑定手机</text>
				<text class="have" style="margin-right: 0;">{{ mobile }}</text>
			</view>
		</view>
		<!-- 用户协议，关于平台 -->
		<view style="padding: 30rpx;position: relative;" class="line right-arrow" @click="goToRichText(1)">用户协议</view>
		<view style="padding: 30rpx;position: relative;" class="right-arrow line" @click="goToRichText(2)">关于平台</view>
		<view style="padding: 30rpx;position: relative;" class="right-arrow" @click="clearStorage">清除缓存</view>
		<view class="line-30"></view>
		<!-- 退出 -->
		<view class="out-login" @click="handleOutLogin">退出当前帐号</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				platform: '',
				user: ''
			};
		},
		methods: {
			// 前往绑定手机号页面
			handleOpenBindMobile () {
				uni.navigateTo({
					url: '/pages/bind-mobile/bind-mobile'
				})
			},
			// 退出登录
			handleOutLogin () { 
				uni.showModal({
				    title: '退出登录',
				    content: '确定退出登录么',
				    success: function (res) {
				        if (res.confirm) {
							// 清除用户信息
							uni.removeStorageSync('userInfo')
							uni.removeStorageSync('token')
							uni.removeStorageSync('openId')
							uni.removeStorageSync('userId')
							uni.removeStorageSync('classTrue')
							uni.removeStorageSync('classTrueId')
				            uni.switchTab({
				            	url: '../index/index'
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			
				
			},
			// 前往富文本
			goToRichText (id) {
				if (id == 1) {
					this.titleName = '用户协议'
					uni.setStorageSync('richText', this.user)
				} else if (id == 2) {
					this.titleName = '关于平台'
					uni.setStorageSync('richText', this.platform)
				}
				uni.navigateTo({
					url: '../rich-text/rich-text?titleName=' + this.titleName
				})
			},
			clearStorage () {
				uni.showModal({
				    title: '清除缓存',
				    content: '确定清除缓存么',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showToast({
				            	icon: 'success',
								title: '清除成功'
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async getProtocol () {
				let res = await this.$fetch(this.$api.getProtocol)
				console.log(res)
				this.platform = res.data.platform
				this.user = res.data.user
			}
		},
		onLoad() {
			// this.mobile = uni.getStorageSync('user_info').phonenumber
			this.mobile = uni.getStorageSync('phone')
			this.getProtocol()
		}
	}
</script>

<style lang="less">
page {
	background: #F7F7F7;
}
.container {
	border-top: 1px solid #F0F0F0;
	background: #FFFFFF;
	
	.edit-info {
		position: relative;
		padding: 30rpx;
		font-size: 14px;
		color: #333333;
		& > view {
			flex: 1;
			justify-content: space-between;
			color: #9B9B9B;
			align-items: center;
			display: flex;
			
			text:first-child {
				color: #333333;
			}
			
			text:last-child {
				margin-right: 20rpx;
				
				&.have {
					color: #333333;
				}
			}
		}
		
	}
	.right-arrow{
		font-size: 14px;
		color: #333333;
	}
	.line {
		
		&::before {
			content: "";
			position: absolute;
			left: 30rpx;
			bottom: 0;
			width: 720rpx; 
			height: 1px;
			background: #F0F0F0;
		}
	}
	.line-30{
		width: 100%;
		height: 30rpx;
		background-color: #F0F0F0;
	}
	
	.out-login {
		
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: #D0021B;
	}
}
</style>
