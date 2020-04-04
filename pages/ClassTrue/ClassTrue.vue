<template>
	<keep-alive>
	<view class="container">
		<view class="list">
			<!-- 此处渲染 -->
			<view v-for="item in gradeTree" :key="item.id">
				<view class="title">{{ item.name }}</view>
				<view class="items">
					<view :class="childItem.id === selectGrade ? 'select' : ''"  @click="handleChooseGrade(childItem.id, childItem.name)" v-for="childItem in item.child" :key="childItem.id">{{ childItem.name }}</view>
				</view>
			</view>
		</view>
		<!-- 确定 -->
		<view class="confirm" @click="handleConfirmGrade">确认</view>
	</view>
	</keep-alive>
</template>

<script>
	export default {
		data() {
			return {
				gradeTree: [],
				selectGrade: null,
				className: '',
				infoOrindex: 0 // 判断是哪个页面进来的 1 设置 2首页
			};
		},
		methods: {
			// 选择年级
			handleChooseGrade (id, item) {
				this.selectGrade = id
				this.className = item
			},
			// 确定修改年级
			async handleConfirmGrade () {
				let classTrue = {
					id: this.selectGrade,
					name: this.className
				}
				uni.setStorageSync('classTrue', JSON.stringify(classTrue))
				uni.setStorageSync('classTrueId', this.selectGrade)
				let res = await this.$fetch(this.$api.editUserInfo, { classTypeId: this.selectGrade }, 'POST', "FORM")
				// console.log(res)
				if (res.code) return uni.showToast({ title: res.msg, icon: 'none' })
				// let userInfo = uni.getStorageSync('user_info')
				// userInfo.classTypeId = this.selectGrade
				// uni.setStorageSync('user_info', userInfo)
				if (this.infoOrindex == 1) {
					uni.setStorageSync('classBackFresh',true)
					uni.navigateBack({
						delta: 1
					})
				} else {
					uni.reLaunch({ url: '/pages/index/index' })
				}
				
			},
			async initClassTrueInfo () {
				let res = await this.$fetch(this.$api.getClassType, {}, 'GET')
				console.log(res)
				if (res.code !== 0) return uni.showToast({
					icon: 'none',
					title: '请求失败'
				}) 
				this.gradeTree = res.data
			}
		},
		onLoad(options) {
			this.infoOrindex = options.infoOrIndex
			if (uni.getStorageSync('classTrue')) {
				this.selectGrade = JSON.parse(uni.getStorageSync('classTrue')).id
			} else {
				this.selectGrade = 7
			}
			
			// console.log(this.selectGrade)
			this.initClassTrueInfo()
		}
	}
</script>

<style lang="less">
.container {
	border-top: 1px solid #F0F0F0;
	background-color: #fff;
	.list {
		padding: 30rpx;
		margin-bottom: 90rpx;
		
		& > view {
			margin-bottom: 10rpx;
			
			.title {
				font-size: 17px;
				color: #333333;
				font-weight: bold;
				padding-bottom: 30rpx;
			}
			
			.items {
				display: flex;
				flex-wrap: wrap;
				
				& > view {
					width: 150rpx;
					height: 60rpx;
					margin-right: 30rpx;
					border-radius: 4rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #F6F6F6;
					color: #A6A6A6;
					margin-bottom: 30rpx;
					
					&.select {
						background: #fe5e50;
						color: #FFFFFF;
					}
					
					&:nth-child(4n) {
						margin-right: 0;
					}
				}
			}
		}
	}

	.confirm {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100vw;
		height: 90rpx;
		background: #fe5e50;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		
		&:active {
			opacity: .8;
		}
	}
}
</style>
