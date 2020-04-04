<template>
	<view class="note">
		<view class="note-main">
			<view class="note-item" v-for="(item,index) in findList" :key="index" @click="goToNoteDeatail(item.id)">
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
						<image :src="img"  v-for="(img,idex) in item.pic" :key="idex" @click.stop="checkImg(idex,index)"></image>
					</view>
					<view class="note-right-operation">
						<view class="note-right-operation-left" v-if="item.cid == userId" @click.stop="deleteInfo(item, index)">删除</view>
						<view class="note-right-operation-right">
							<view class="note-right-operation-right-comment">
								<image src="../../static/image/note/comment.png" mode=""></image>
								<view>{{item.experienceEvaluates.length > 0 ? item.experienceEvaluates.length : 0}}</view>
							</view>
							<view class="note-right-operation-right-collect" @click.stop="myCollection(item, index)">
								<image src="../../static/image/note/nocollection.png" mode="" v-show="!item.params.praiseFlag"></image>
								<image src="../../static/image/note/collection.png" mode="" v-show="item.params.praiseFlag"></image>
								<view>{{item.praisePoints}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="add" @tap="goToPublish">
				<image src="../../static/image/note/addpush.png" mode="widthFix" lazy-load></image>
			</view>
		</view>
		<!-- 加载 -->
		<uni-load-more bgColor="#FFFFFF" :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
	</view>
</template>

<script>
	import  baseURL  from '../../config/index.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'	
	export default {
		data(){
			return {
				pageNum:1,
				hasFlag:true,
				// 列表
				findList:[],
				userId: ''
			}
		},
		components:{
			uniLoadMore
		},
		methods: {
			goToPublish(){
				uni.navigateTo({
					url: '../publish/publish'
				})
			},
			// 获取发现列表
			async getFindList(){
				
				if (!this.hasFlag) return; // 说明已经没有更多
				this.pageNum = ++this.pageNum;
				let res = await this.$fetch(this.$api.experienceList,{pageNum:this.pageNum, pageSize:10,userId: this.userId},'POST','form')
				// res.rows.forEach(item =>{
				// 	item.picContent = JSON.parse(item.picContent)
				// 	for(let i in item.picContent){
				// 		item.picContent[i] = baseURL.slice(0,baseURL.length - 1) + item.picContent[i]
				// 	}
				// 	item.createTime = this.$dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
				// 	if(!item.avatar){item.avatar = 'https://img.bajiaostar.com/FgkVAFlA5etvApeTeLEt2P0s822H'}
				// 	this.findList.push(item)
				// })
				res.data.forEach(item => {
					item.pic = item.pic.split(',')
					console.log(item.params.praiseFlag)
				})
				console.log(res)
				this.findList = res.data
				console.log(this.findList)
				// this.findList.push(...res.rows)
				this.hasFlag = 10 * this.pageNum < res.total;
			},
			// 查看图片
			checkImg(id,index){
				console.log(id, index)
				// let imgList = []
				// this.findList.forEach((item,idex) =>{
				// 	if(idex == index){
				// 		imgList = item.picContent
				// 	}
				// })
				let imgList = this.findList[index].pic
				uni.previewImage({
					urls:imgList,
					current:id
				})
			},
			// 去评论详情
			goToNoteDeatail (id) {
				uni.navigateTo({
					url: '../NoteDetail/NoteDeatail?id=' + id
				})
			},
			// 收藏
			async myCollection (item, index) {
				if (!this.userId) {
					return uni.showToast({
						icon: 'none',
						title: '请先登录'
					})
				}
				console.log(item)
				if (item.params.praiseFlag) {
					item.praisePoints--
				} else {
					item.praisePoints++
				}
				item.params.praiseFlag = !item.params.praiseFlag
				let res = await this.$fetch(this.$api.updPraisePoints, {id: item.id, userId: this.userId}, 'POST', 'FORM')
			},
			// 删除
			deleteInfo (item, index) {
				console.log(item)
				console.log(index)
				uni.showModal({
				    title: '提示',
				    content: '确定删除该条心得么?',
				    success: async (res) => {
				        if (res.confirm) {
				            let res = await this.$fetch(this.$api.delExperience,{id: item.id}, 'POST', 'FORM')
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
							if(!res.code) {
								for (let i = 0; i < this.findList.length; i++) {
									if (this.findList[i].id == item.id) {
										this.findList.splice(i, 1)
									}
								}
							}
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			}
		},
		onReachBottom() {
			if(this.hasFlag){
				this.getFindList()
			}
		},
		onPullDownRefresh() {
			this.pageNum = 1
			this.hasFlag = true
			this.findList = []
			uni.stopPullDownRefresh()
			setTimeout(()=>{
				this.getFindList()
			},500)
		},
		onShow() {
			// 处理发布消息后更新
			if (uni.getStorageSync('loadingNote')) {
				this.pageNum = 1
				this.hasFlag = true
				this.findList = []
				this.getFindList()
				uni.removeStorageSync('loadingNote')
			}
			// 处理详情里的点赞
			if (uni.getStorageSync("praiseFlag").id) {
				for (let i = 0; i < this.findList.length; i++) {
					if (this.findList[i].id == uni.getStorageSync("praiseFlag").id) {
						this.findList[i].params.praiseFlag = uni.getStorageSync("praiseFlag").collectFlag
						if (this.findList[i].params.praiseFlag) {
							this.findList[i].praisePoints++
						} else {
							if (this.findList[i].praisePoints != 0) {
								this.findList[i].praisePoints--
							}
						}
					}
				}
				uni.removeStorageSync('praiseFlag')
			}
			// 处理详情评论
			if (uni.getStorageSync("commentTotal").id) {
				for (let i = 0; i < this.findList.length; i++) {
					if (this.findList[i].id == uni.getStorageSync("commentTotal").id) {
						let total = uni.getStorageSync("commentTotal").total
						for (let j = 0; j < total; j++){
							this.findList[i].experienceEvaluates.push(j)
						}
						
					}
				}
				uni.removeStorageSync('commentTotal')
			}
		},
		onLoad() {
			if (uni.getStorageSync('userInfo')) {
				this.userId = uni.getStorageSync('userInfo').userId
				console.log(this.userId)
			} 
			this.pageNum = 1
			this.hasFlag = true
			this.findList = []
			this.getFindList()
		}
	}
</script>

<style lang="less" scoped>
	.note{
		width: 100%;
		background-color: #ccc;
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
					color: #4A4A4A;
					letter-spacing: 0;
					text-align: justify;
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
			left: 10rpx;
			bottom: 30rpx;
			// width: 100rpx;
			// height: 100rpx;
			z-index: 10;
			image{
				width: 140rpx;
				height: 140rpx;
			}
		}
	}
</style>
