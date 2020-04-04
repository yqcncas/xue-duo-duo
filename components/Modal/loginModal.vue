<template>
	<view>
		<!-- 模态框 -->
		<view class="modal-dialog" :class="[show?'modal-dialog-show':'']">
		  <view class="modal-title">
		    <text>首次登录时，请完成以下<text style="color: #2E80E8;">2</text>步操作</text>
		  </view>
		  <view class="modal-content">
		    <text  :style="{color:(empowerFlag == true ? '#9B9B9B' : '#4A4A4A')}">1.授权学多多平台读取您的微信昵称和头像</text>
		    <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="GetUserInfo" :class=" empowerFlag == true ? 'empower-confirm' : 'empower-shortMessage' " :plain="empowerFlag">授权微信信息</button>
		    <text style="margin-top: -10rpx;" :style="{color:(empowerFlag != true ? '#9B9B9B' : '#4A4A4A')}">2.授权学多多平台读取您绑定的手机号</text>
		    <button open-type="getPhoneNumber" @getphonenumber="GetPhoneNumber" :class=" empowerFlag == false ? 'empower-confirm' : 'empower-shortMessage' " :plain="!empowerFlag">授权手机号码</button>
		  </view>
		</view>
		<!-- 遮罩 -->
		<view class="mask" :class="{ maskShow: show === true }" ></view>
	</view>
</template>

<script>
	var WXBizDataCrypt = require('../../crypto/WXBizDataCrypt.js');  
	export default {
		name:'loginModal',
		data(){
			return{
				empowerFlag:false,
				pwdArr: ["", "", "", "", "", ""],
				payShow:false,
				numberArr: [],
				temp: ["", "", "", "", "", ""],
				avatar:'',
				nickName:'',
				openid:'',
				session_key:'',
				phone:'',
				sex:'',
				appId:'wx6597547107ae5139',
				cancelShow:false,
				inviterCode:''
			}
		},
		props:['show'],
		methods:{
			// 关闭弹窗
			handleClose(){
				this.$emit('close',false)
			},
			closeKeyboard: function() {
				this.payShow = false;
				this.numberArr = [];
				this.pwdArr = this.temp
			},
			clearKeyboard(){
				this.numberArr = [];
				this.pwdArr = ["", "", "", "", "", ""]
			},
			getPwd: function() {
				//判断并取出密码
				if (this.numberArr.length === this.pwdArr.length) {
					let pwd = this.numberArr.join('')
					this.closeKeyboard();
					this.reg(pwd)
				}
			},
			keyboardClick: function(e) {
				let numberArr = this.numberArr;
				let pwdArr = this.pwdArr;
				let index = e.index;
				if (numberArr.length === pwdArr.length || index == undefined) {
					return;
				}
				if (index == 9) { //取消键
					this.clearKeyboard();
					return;
				} else if (index == 11) {
					//退格键
					let len = numberArr.length;
					if (len) {
						pwdArr.splice(len - 1, 1, "");
					} else {
						pwdArr = this.temp;
					}
					numberArr.pop()
				} else if (index == 10) {
					numberArr.push(0);
					pwdArr.splice(numberArr.length - 1, 1, "●");
				} else {
					numberArr.push(index + 1);
					pwdArr.splice(numberArr.length - 1, 1, "●");
				}
				this.numberArr = numberArr;
				this.pwdArr = pwdArr;
				this.getPwd();
			},
			// 微信登录
			wxlogin(){
				uni.login({
					provider:'weixin',
					success: (res) => {
						if(res.code){
							console.log(res.code)
							this.code = res.code
							this.getOpenId()
						}
					}
				})
			},
			// 获取openId根据是否有用户信息来判断是否去授权登录
			async getOpenId(){
				let res = await this.$fetch(this.$api.getOpenId,{js_code: this.code},'GET')
				console.log(res)
				if(res.code == 0){
				
				}else{
					uni.setStorageSync('token',res.data.token)
				}
				this.openid = res.data.openid
				uni.setStorageSync('openId', this.openid)
				this.session_key = res.data.session_key
			},
			// 授权昵称和头像
			GetUserInfo(e){
				console.log(e);
				if(e.detail.errMsg.indexOf('ok') === -1){
					uni.showModal({
						title:'提示',
						showCancel:false,
						content:'您取消了授权'
					})
				}else{
					this.avatar = e.detail.userInfo.avatarUrl;
					this.nickName = e.detail.userInfo.nickName;
					this.sex = e.detail.userInfo.gender - 1;
					if(this.avatar&&this.nickName){
						this.empowerFlag = true
					}	
				}
			},
			// 授权手机号码
			GetPhoneNumber(e){
				console.log(e);
				if(this.empowerFlag == false){
						uni.showToast({
							icon:'none',
							title:'授权失败,请先操作上一步'
						})
					}else{
						if(e.detail.errMsg.indexOf('ok') === -1){
							uni.showModal({
								title:'提示',
								showCancel:false,
								content:'您取消了授权'
							})
						}else{
							var pc = new WXBizDataCrypt(this.appId,this.session_key)
							var data = pc.decryptData(e.detail.encryptedData, e.detail.iv)
							console.log(data.phoneNumber)
							this.phone = data.phoneNumber;
							uni.setStorageSync('phone',this.phone)
							if(this.phone&&this.openid&&this.avatar&&this.nickName){
								this.$emit('close',false)
								this.payShow = true
								// 都拿到则注册
								this.reg()
							}
						}
				}
			},
			// 注册用户
			async reg(pwd){
				// 判断是否有邀请码
				if(uni.getStorageSync('qrCode')){
					this.inviterCode = uni.getStorageSync('qrCode')
				} else {
					this.inviterCode = ''
				}
				console.log(this.openid)
				console.log(this.nickName)
				console.log(this.phone)
				console.log(this.sex)
				console.log(this.avatar)
				if (this.inviterCode) {
					let res = await this.$fetch(this.$api.register,{
						openId: this.openid, userName:this.nickName,mobile:this.phone,sex:this.sex,avatar:this.avatar,qrcode: this.inviterCode
					}, 'GET')
					
					if(res.code === 0){
						uni.showToast({
							icon:'none',
							title:res.msg
						})
						let msg = await this.$fetch(this.$api.wxLogin, {openId: this.openid}, 'GET')
						uni.setStorageSync('token', msg.data.token)
						this.$emit('fresh',true)
						console.log(msg)
						uni.removeStorageSync('showLogin')
						// 注册成功清除邀请码缓存
						uni.removeStorageSync('qrCode')
					} else {
						let msg = await this.$fetch(this.$api.wxLogin, {openId: this.openid}, 'GET')
						uni.setStorageSync('token', msg.data.token)
						uni.removeStorageSync('showLogin')
						this.$emit('fresh',true)
						console.log(msg)
					}
				} else {
					let res = await this.$fetch(this.$api.register,{
						openId: this.openid, userName:this.nickName,mobile:this.phone,sex:this.sex,avatar:this.avatar
					}, 'GET')
					
					if(res.code === 0){
						uni.showToast({
							icon:'none',
							title:res.msg
						})
						let msg = await this.$fetch(this.$api.wxLogin, {openId: this.openid}, 'GET')
						uni.setStorageSync('token', msg.data.token)
						this.$emit('fresh',true)
						console.log(msg)
						uni.removeStorageSync('showLogin')
						// 注册成功清除邀请码缓存
						uni.removeStorageSync('qrCode')
					} else {
						let msg = await this.$fetch(this.$api.wxLogin, {openId: this.openid}, 'GET')
						uni.setStorageSync('token', msg.data.token)
						uni.removeStorageSync('showLogin')
						this.$emit('fresh',true)
						console.log(msg)
					}
				}
				

				
			}
		},
		watch:{
			show(){
				if(this.show == true){
					this.wxlogin()
				}
			}
		}
	}
</script>

<style lang="less">
	// 模态框
	.modal-dialog {
		width: 568rpx;
		overflow: hidden;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 9999;
		visibility: hidden;
		background: #fff;
		border-radius: 36rpx;
		transition: all 0.3s ease-in-out;
	}
	.modal-dialog-show{
		visibility: visible;
	}
	.modal-title {
		height: 90rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1rpx solid #b5b5b5;
	}
	.modal-title image{
		width: 50rpx;
		height: 50rpx;
		vertical-align: middle;
		margin-right: 10rpx;
	}
	.modal-title text{
		color: #4A4A4A;
		font-size: 16px;
		font-weight: bold;
		margin-left: 10rpxs;
	}
	.modal-content{
		height: 440rpx;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	.modal-content text{
		color: #9B9B9B;
		font-size: 14px;
		margin-top: 35rpx;
	}
	.empower-confirm{
		width: 445rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 14px;
		color: #9B9B9B!important;
		border: 1rpx solid #D9D9D9!important;
	}
	.empower-shortMessage{
		background: #FBD706;
		width: 445rpx;
		height: 80rpx;
		font-size: 16px;
		color: #4A4A4A;
	}
	// 遮罩
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 9;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.maskShow {
		opacity: 1;
		visibility: visible;
	}
	// 数字键盘
	.tui-keyboard-tips {
		width: 100%;
		height: 120upx;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30upx;
		background: #fff;
		position: relative;
		color: #333;
		border: 0;
	}
	
	.tui-digital-box {
		background: #fff;
		padding-bottom: 50upx;
		border: 0;
	}
</style>
