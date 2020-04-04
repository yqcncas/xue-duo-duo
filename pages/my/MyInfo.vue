<template>
	<view class="container">
		<view class="edit-avatar right-arrow" @click="handleEditAvatar">
			<view>
				<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
				<text>修改头像</text>
			</view>
		</view>
		<!-- 文本信息 -->
		<view class="edit-info line right-arrow">
			<view>
				<text>姓名</text>
				<input type="text" ref = 'userNameInput' class="scrollInfo" v-model="userName" @blur="handleUserName"/>
			</view>
		</view>
		<picker mode="date" :value="userInfo.birthday" @change="handleEditBirthday">
			<view class="edit-info line right-arrow">
				<view>
					<text>生日</text>
					<text class="have">{{ userInfo.birthday }}</text>
				</view>
			</view>
		</picker>
		<picker range-key="type" :range="sexList" @change="handleSexChange">
			<view class="edit-info line right-arrow">
				<view>
					<text>性别</text>
					<text class="have">{{ userInfo.sex == 0 ? '男' : userInfo.sex == 1 ? '女' : '未知' }}</text>
				</view>
			</view>
		</picker>
		<view class="edit-info line right-arrow" @click="showPicker = true">
			<view>
				<text>地区</text> 
				<text :class="userInfo.provinceString ? 'have' : ''">{{ userInfo.provinceString ? userInfo.provinceString : '请选择' }}</text>
			</view>
		</view>
		<view class="edit-info line right-arrow" @click="handleOpenGrade">
			<view>
				<text>年级</text>
				<text class="have">{{ MyClass }}</text>
			</view>
		</view>
		<view class="edit-info line right-arrow">
			<view>
				<text>学校</text>
				<input type="text"  class="scrollInfo" v-model="scroll" @blur="handleScroll" placeholder="请填写" placeholder-style="opacity: 0.8;font-family: PingFangSC-Regular;font-size: 14px;color: #9B9B9B;"/>
			</view>
		</view>
		<mpvue-city-picker :showPicker="showPicker" :pickerValueDefault="pickerValueDefault" @onCancel="handleCancelCity" @onConfirm="handleConfirmCity"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/city-picker/mpvueCityPicker.vue'
	
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				pickerValueDefault: [0, 0, 1],
				userInfo: {},
				showPicker: false,
				sexList: [
					{
						id: 0,
						type: '男'
					},
					{
						id: 1,
						type: '女'
					},
					{
						id: 2,
						type: '未知'
					}
				],
				MyClass: '',
				scroll: '',
				userName: ''
			};
		},
		methods: {
			// 获取用户信息
			async getUserInfo () {
				let res = await this.$fetch(this.$api.userInfo, {}, 'GET')
				if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
				this.userInfo = res.data
				this.userName = res.data.userName
				this.userNameTwo = res.data.userName // 备用
				this.scroll = res.data.school
				this.scrollTwo = res.data.school // 备用
				if (res.data.classTypeId) {
					this.MyClass = res.data.classType.name
				}
			},
			// 修改用户昵称
			async handleUserName () {
				if (this.userName.trim() == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的用户昵称'
					})
					this.userName = this.userNameTwo
					return
				}
				let res = await this.$fetch(this.$api.editUserInfo, { userName: this.userName },'POST','FORM')
				uni.showToast({
					icon: 'none',
					title: res.msg
				})
			},
			async handleScroll () {
				if (this.scroll.trim() == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的学校名称'
					})
					this.scroll = this.scrollTwo
					return
				}
				let res = await this.$fetch(this.$api.editUserInfo, { school: this.scroll },'POST','FORM')
				uni.showToast({
					icon: 'none',
					title: res.msg
				})
			},
			// 修改用户性别
			async handleSexChange ({ detail: { value } }) { 
				let res = await this.$fetch(this.$api.editUserInfo, { sex: value },'POST','FORM')
				this.userInfo.sex = this.sexList[parseInt(value)].id 
			},
			// 修改用户头像
			handleEditAvatar () {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						if (res.tempFilePaths) {
							uni.uploadFile({
								url: this.$api.unloadLocation, //仅为示例，非真实的接口地址
								filePath: res.tempFilePaths[0],
								name: 'file',
								formData: {
									token: this.token
								},
								success: ({ data }) => {
									data = JSON.parse(data)
									this.$fetch(this.$api.editUserInfo, { avatar: this.$api.baseLocation+data.hash }, 'POST', 'FORM').then(avatarRes => {
										if (avatarRes.code) return uni.showToast({ title: res.msg, icon: 'none' })
										this.userInfo.avatar = this.$api.baseLocation+data.hash
									})
								}
							})
						}
					}
				})
			},
			// 修改生日
			async handleEditBirthday ({ detail: { value } }) {
				this.userInfo.birthday = value
				let res = await this.$fetch(this.$api.editUserInfo, { birthday: value }, 'POST','FORM')
				if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
				return uni.showToast({ title: '生日修改成功！', icon: 'none' })
			},
			// 获取七牛token
			async uptoken () {
				let res = await this.$fetch(this.$api.uptoken, {}, 'GET')
				this.token = res.data
			},
			// 修改地区
			async handleConfirmCity (e) {
				this.showPicker = false
				let res = await this.$fetch(this.$api.editUserInfo, { provinceString: e.label.replace(/-/g, ''), province: e.cityCode }, 'POST', 'FORM')
				if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
				this.userInfo.provinceString = e.label.replace(/-/g, '')
			},
			// 关闭地区选择器
			handleCancelCity () {
				this.showPicker = false
			},
			// 打开年级选择页面
			handleOpenGrade () {
				uni.navigateTo({ url: '../ClassTrue/ClassTrue?infoOrIndex=' + 1})
			}
		},
		onLoad() {
			this.uptoken()
			this.getUserInfo()
		},
		onShow() {
			if (uni.getStorageSync('classTrue')) {
				let res = JSON.parse(uni.getStorageSync('classTrue'))
				this.MyClass = res.name
			}
			
		}
	}
</script>

<style lang="less">
page {
	background: #F7F7F7;
}

.container {
	background: #FFFFFF;
	
	.edit-avatar {
		padding: 30rpx;
		border-top: 1px solid #F0F0F0;
		 
		& > view {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.avatar {
				width: 140rpx;
				height: 140rpx;
				background: #f2f2f2;
				border-radius: 50%;
			}
			
			text {
				font-size: 14px;
				color: #9B9B9B;
				margin-right: 30rpx;
			}
		}
	}
	
	.edit-info {
		position: relative;
		padding: 30rpx;
		.scrollInfo{
			flex: 1;
			font-size: 14px;
			color: #333333;
			text-align: right;
			margin-right: 20rpx;
			box-sizing: border-box;
		}
		& > view {
			flex: 1;
			justify-content: space-between;
			color: #9B9B9B;
			align-items: center;
			display: flex;
			
			text:first-child {
				font-size: 14px;
				color: #333333;
			}
			
			text:last-child {
				margin-right: 20rpx;
				
				&.have {
					font-size: 14px;
					color: #333333;
				}
			}
		}
		
		&.line::before {
			content: "";
			position: absolute;
			left: 30rpx;
			top: 0;
			width: 720rpx; 
			height: 1px;
			background: #F7F7F7;
		}
	}
}
</style>
