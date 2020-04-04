<template>
	<view class="note">
		<view class="note-main">
			<view class="note-item" v-for="(item,index) in commentMainList" :key="index">
				<view class="note-avatar">
					<image :src="item.avatar" mode="aspectFill"></image>
				</view>
				<view class="note-right">
					<view class="note-right-header">
						<view class="note-right-header-left">
							<view class="username">{{item.userName}}</view>
						</view>
						<view class="note-right-header-right">
							<view class="note-lesson">{{item.courseTypeName}}</view>
						</view>
					</view>
					
					<view class="time">{{item.createTime}}</view>
					<view class="content">{{item.content}}</view>
					<view class="imageList" v-if="item.pic != ''">
						<image :src="img"  v-for="(img,idex) in item.pic" :key="idex" @click="checkImg(idex,index)"></image>
					</view>
					<view class="note-right-operation">
						<view class="note-right-operation-left" v-if="item.cid == userId">删除</view>
						<view class="note-right-operation-right">
							<view class="note-right-operation-right-comment">
								<image src="../../static/image/note/comment.png" mode="" lazy-load></image>
								<view>{{item.experienceEvaluates.length}}</view>
							</view>
							<view class="note-right-operation-right-collect" @click="collectMessage(item)">
								<image src="../../static/image/note/nocollection.png" mode="" v-show="!item.params.praiseFlag"></image>
								<image src="../../static/image/note/collection.png" mode="" v-show="item.params.praiseFlag"></image>
								<view>{{item.praisePoints}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="line-30"></view>
			
			<view class="note-comment" :class="{notecommentpadb: commentMainList[0].experienceEvaluates.length}">
				<view class="note-comment-top" v-if="commentMainList[0].experienceEvaluates.length || commentMainList[0].experienceEvaluates.length == 0">
					评论({{commentMainList[0].experienceEvaluates.length}})
				</view>
				<scroll-view scroll-y="true" >
					<view class="note-comment-bottom" v-for="(experience, index) in commentList" :key = "index">
						<view class="note-avatar">
							<image :src="experience.avatar" mode="aspectFill"></image>
						</view>
						<view class="note-right">
							<view class="username">{{experience.userName}}</view>
							<view class="time">{{experience.createTime}}</view>
							<view class="content">{{experience.content}}</view>
						</view>
					</view>
				</scroll-view>
				
			
			</view>
				
		</view>
	
		<view :style="'height:'+ sendHeight +'px;'"></view>
		
		<view class="sendComment">
			<view class="sendComment-left">
				<textarea :show-confirm-bar = "false" cursor-spacing="14" auto-height v-model="sendMsgCommain" ref = "sendCommentRef" style="height: 40rpx;"></textarea>
			</view>
			<view class="sendComment-right" @click.stop="sendMsg">
				<view class="submit" :style="{color: sendMsgCommain.length == 0 ? '#9B9B9B' : '#4A90E2'}">发送</view>
			</view>
		</view>
	</view>
</template>

<script>
	import  baseURL  from '../../config/index.js'
	export default {
		data(){
			return {
				page:0,
				hasFlag:true,
				commentMainList:[],
				sendMsgCommain: '',
				sendHeight: 84,
				commentList: [],
				userId: '',
				id: '',
				commentTotal: 0
			}
		},
		onLoad(options) {
			this.id = options.id
			this.experienceDetail()
			
		},
		methods: {
			goToPublish(){
				uni.navigateTo({
					url: '../publish/publish'
				})
			},
			// 获取发送消息框高度
			getSendHeight() {
				let view = uni.createSelectorQuery().select(".sendComment")
				view.boundingClientRect(res => {
					if (res.height <= 84) this.sendHeight = 84
					else this.sendHeight = res.height + 2
					
				}).exec()
			},
			// 获取发现列表
			async experienceDetail(){
				if (uni.getStorageSync('userId')) {
					this.userId = uni.getStorageSync('userId')
					let res = await this.$fetch(this.$api.experienceDetail, {id: this.id, userId: this.userId}, 'POST', 'FORM')
					console.log(res)
					res.data.pic = res.data.pic.split(',')
					this.commentMainList = [res.data]
					this.commentList = this.commentMainList[0].experienceEvaluates
					console.log(this.commentMainList)
				} else {
					let res = await this.$fetch(this.$api.experienceDetail, {id: this.id}, 'POST', 'FORM')
					console.log(res)
					// res.data.forEach(item => {
					// 	item.pic = item.pic.split(',')
					// })
					res.data.pic = res.data.pic.split(',')
					this.commentMainList = [res.data]
					this.commentList = this.commentMainList[0].experienceEvaluates
				}
				
			},
			// 查看图片
			checkImg(id,index){
				let imgList = this.commentMainList[index].pic
				uni.previewImage({
					urls:imgList,
					current:id
				})
			},
			// 发送消息
			async sendMsg () {
				if (!this.userId) {
					return uni.showToast({
						icon: 'none',
						title: '请先登录'
					})
				}
				if (this.sendMsgCommain.trim() == '') {
					return uni.showToast({
						icon: 'none',
						title: '请输入您的评论'
					})
				}
				let experienceEvaluate = {
					content: this.sendMsgCommain,
					experienceId: this.commentMainList[0].id
				}
				experienceEvaluate = JSON.stringify(experienceEvaluate)
				let res = await this.$fetch(this.$api.addExperienceEvaluate, {content: this.sendMsgCommain, experienceId: this.commentMainList[0].id})
				console.log(res)
				uni.showToast({
					icon: 'none',
					title: res.msg
				})
				
				if (!res.code) {
					let userInfo =  uni.getStorageSync('userInfo')
					let createTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
					let commentInfo = {
						avatar: userInfo.userAvatar,
						createTime: createTime,
						userName: userInfo.userName,
						content: this.sendMsgCommain
					}
					this.commentList.unshift(commentInfo)
					this.sendMsgCommain = ""
					
					this.commentTotal++
					let commentTotal = {
						id: this.commentMainList[0].id,
						total: this.commentTotal
					}
					uni.setStorageSync('commentTotal', commentTotal)
				}
			},
			// 点赞
			async collectMessage (item) {
				if (!this.userId) {
					return uni.showToast({
						icon: 'none',
						title: '请先登录'
					})
				}
				if (item.params.praiseFlag) {
					item.praisePoints--
				} else {
					item.praisePoints++
				}
				item.params.praiseFlag = !item.params.praiseFlag
				console.log(item.params.praiseFlag)
				
				let res = await this.$fetch(this.$api.updPraisePoints, {id: item.id, userId: this.userId}, 'POST', 'FORM')
				let praiseFlag = {
					id: item.id,
					collectFlag: item.params.praiseFlag
				}
				uni.setStorageSync('praiseFlag', praiseFlag)
			}
		},
		
		onShow() {
			// this.page = 0 
			// this.hasFlag = true
			// this.findList = []
			// this.getFindList()
			this.userId = uni.getStorageSync('userInfo').userId
		},
		watch:{
			sendMsgCommain: function(newal) {
				this.getSendHeight()
			}
		},
	}
</script>

<style lang="less" scoped>
	.note{
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		background-color: #F7F7F7;
		position: relative;
		
		.note-item {
			width: 100%;
			height: 29.5%;
			display: flex;
			// justify-content: space-between;
			padding: 30rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #F4F4F4;
			background-color: #fff;
			
			.note-avatar{
				width: 10.7%;
				height: 5.2%;
				margin-right: 4%;
				box-sizing: border-box;
				image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}
			.note-right{
				flex: 1;
				.note-right-header{
					display: flex;
					justify-content: space-between;
					.note-right-header-left{
						.username{
							font-family: PingFangSC-Regular;
							font-size: 14px;
							color: #5B5B5B;
							letter-spacing: -0.34px;
							text-align: justify;
						}
					}
					.note-right-header-right{
						width: 64rpx;
						height: 34rpx;
						background: #FE5E50;
						border-radius: 2px;
						text-align: center;
						line-height: 34rpx;
						box-sizing: border-box;
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #FFFFFF;
						letter-spacing: -0.29px;
					}
				}
				
				.content{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #000000;
				}
				.imageList{
					width: 580rpx;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					
					image{
						background: #f2f2f2;
						width: 180upx;
						height: 180upx;
						margin-top: 20rpx;
						margin-right: 20rpx;
						box-sizing: border-box;
						
						&:nth-child(3n){
							margin-right: 0;
						}
					}
				}
				.time{
					font-family: PingFangSC-Regular;
					font-size: 12px;
					color: #9B9B9B;
					padding-top: 10rpx;
					padding-bottom: 30rpx;
					box-sizing: border-box;
				}
				.note-right-operation{
					padding-top: 34rpx;
					box-sizing: border-box;
					display: flex;
					.note-right-operation-left{
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #9B9B9B;
					}
					.note-right-operation-right{
						display: flex;
						justify-content: flex-end;
						flex: 1;
						.note-right-operation-right-comment{
							display: flex;
							align-items: center;
							image{
								width: 34rpx;
								height: 30rpx;
								
							}
							view{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #9B9B9B;
								letter-spacing: -0.34px;
								text-align: justify;
								margin-right: 36rpx;
								margin-left: 16rpx;
								box-sizing: border-box;
							}
						}
						.note-right-operation-right-collect{
							display: flex;
							align-items: center;
							image{
								width: 34rpx;
								height: 30rpx;
								margin-right: 16rpx;
								box-sizing: border-box;
							}
							view{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #9B9B9B;
								letter-spacing: -0.34px;
								text-align: justify;
							}
						}
					}
				}
			}
			&:last-child{
				border-bottom: 1rpx solid none;
			}
		}
		.add{
			position: fixed;
			right: 30rpx;
			bottom: 38rpx;
			width: 90rpx;
			height: 90rpx;
			z-index: 10;
			image{
				width: 100%;
			}
		}
		.note-comment{
			&.notecommentpadb{
				padding-bottom: 110rpx;
				box-sizing: border-box;
			}
			.note-comment-top{
				width: 100%;
				height: 90rpx;
				background-color: #fff;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #9B9B9B;
				letter-spacing: -0.34px;
				line-height: 90rpx;
				padding-left: 30rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid #F0F1F1;
			}
			.note-comment-bottom{
				width: 100%;
				padding: 30rpx;
				background-color: #fff;
				display: flex;
				
				border-bottom: 1rpx solid #F0F1F1;
				box-sizing: border-box;
				.note-avatar{
					margin-right: 30rpx;
					box-sizing: border-box;
					image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
				}
				.note-right{
					
					.username{
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #5B5B5B;
						letter-spacing: -0.34px;
						text-align: justify;
					}
					.time{
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #9B9B9B;
						letter-spacing: 0;
						padding-top: 10rpx;
						padding-bottom: 30rpx;
						box-sizing: border-box;
					}
					.content{
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #4A4A4A;
						letter-spacing: 0;
						
					}
				}
			}
		}
		.sendComment{
			width: 100%;
			// height: 110rpx;
			padding: 30rpx;
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 999;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			background-color: #fff;
			.sendComment-left{
				textarea{
					width: 604rpx;
					height: 80rpx;
					background: #F8F8F8;
					border-radius: 4px;
					padding: 20rpx 0;
					font-size: 14px;
				}
			}
			.sendComment-right{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #4A90E2;
				letter-spacing: -0.34px;
				text-align: justify;
			}
		}
		
		
		// 新
		.send-container {
			// box-shadow: 0 -1px 4px 0 rgba(0,0,0,0.03);
			background: #f7f7f7;
			width: 750upx;
			padding-top: 16upx;
			padding-bottom: 14upx;
			display: flex;
			align-items: center;
			
			textarea {
				flex: 1;
				background: #fff;
				height: 80upx;
				font-size: 16px;
				border-radius: 8upx;
				width: 544upx;
				padding: 20upx 30upx;
				margin-left: 30upx;
			}
			
			.confirm {
				width: 116upx;
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.send-text {
					flex: 1;
					height: 100%;
					text-align: center;
					line-height: 80upx;
					color: #4A90E2;
					font-size: 14px;
				}
				.gray{
					color: #A2A2A2 !important;
				}
				
				.send-img {
					width: 52upx;
					height: 52upx;
					border-radius: 50%;
					border: 2upx solid #979797;
					position: relative;
					
					&::after {
						content: "";
						position: absolute;
						left: 50%;
						top: 50%;
						width: 28upx;
						height: 2upx;
						background: #979797;
						transform: translate(-50%, -50%);
					}
					
					&::before {
						content: "";
						position: absolute;
						left: 50%;
						top: 50%;
						width: 2upx;
						height: 28upx;
						background: #979797;
						transform: translate(-50%, -50%);
					}
					
					&:active {
						opacity: .5
					}
				}
			}
		}
	}
</style>
