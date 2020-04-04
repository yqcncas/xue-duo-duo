<template>
	<view class="publish">
		<view class="publish-lesson">
			<view class="publish-lesson-left">
				学科
			</view>
			<view class="publish-lesson-right">
				<picker mode="selector" :range="showLessonList" @change="lessonSelecet">
					<view>{{lessonList[pickerIndex].dictLabel}}</view>
				</picker>
				
				<image src="../../static/image/icon/right.png" mode=""></image>
			</view>
		</view>
		<view class="publish-center">
			<textarea :show-confirm-bar = "false" placeholder="请写下你想说的话…" v-model="textarea" placeholder-class="textarea-style"/>
		</view>
		
		<view class="publish-image">
			<view class="imageList">
					<view class="image-item" v-for="(item,index) in richTextList" :key="index">
						<image :src="item" mode="aspectFill" @tap="previewImg" :data-url="item"></image>
						<image src="../../static/image/icon/delete.png" mode="aspectFill" class="icon" @tap.stop="DelImage" :data-index="index" ></image>
					</view>
				<view class="uploadImage" v-if="richTextList.length < 9" @click="uploadImage">
					<image src="../../static/image/icon/uploadImage.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="publish-submit" @tap="publishSubmit">发布</view>
	</view>
</template>

<script>
	import  baseURL  from '../../config/index.js'
	export default{
		data(){
			return{
				//文本框内容
				textarea: '',
				// 图片
				richTextList: [],
				imgList:[],
				token:'',
				userId:'',
				lessonList: [],
				showLessonList: [],
				pickerIndex: 0
			}
		},
		methods: {
			// 初始化可选学科
			async initMyLessonList () {
				let {data: res} = await this.$fetch(this.$api.getCourseType, {}, 'Get')
				
				this.lessonList = res
				console.log(this.lessonList)
				for (let i = 0 ; i < this.lessonList.length; i++) {
					this.showLessonList.push(this.lessonList[i].dictLabel)
				}
				
			},
			lessonSelecet (e) {
				this.pickerIndex = Number(e.detail.value)
			},
			// 七牛
			async uptoken () {
				let res = await this.$fetch(this.$api.uptoken, {}, 'GET')
				this.qiniutoken = res.data
			},
			//提交
			async publishSubmit(){
				if (this.textarea.trim() == '') {
					uni.showToast({
						icon:'none',
						title:'请确认您需要发布的信息'
					})
					return
				}
				
				console.log(this.lessonList[this.pickerIndex].dictValue)
				let richTextList = this.richTextList.join(',')
				
				let res = await this.$fetch(this.$api.addExperience,{courseTypeId: this.lessonList[this.pickerIndex].dictValue, content: this.textarea, pic: richTextList})
				uni.showToast({
					icon:'none',
					title:res.msg
				})
				if(res.code == 0){
					uni.setStorageSync('loadingNote', true)
					setTimeout(() => {
						uni.navigateBack({
							delta:1
						})
					},1000)
				}
			},
			//预览图片
			previewImg(e){
				uni.previewImage({
					urls:this.richTextList,
					current:e.currentTarget.dataset.url
				})
			},
			// 上传图片 
			uploadImage(){
				if(this.token){
					let token = uni.getStorageSync('token')
					let userId = uni.getStorageSync('userId')
					uni.chooseImage({
						count:9,
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						success: (res) => {
							for(let i = 0; i < res.tempFilePaths.length; i++){
								uni.uploadFile({
									url:this.$api.unloadLocation,
									filePath:res.tempFilePaths[i],
									header:{token,userId},
									name:'file',
									formData: {
										token: this.qiniutoken
									},
									success: (uploadFileRes) => {
										console.log(uploadFileRes);
										let imgInfo = JSON.parse(uploadFileRes.data)
										this.richTextList.push(this.$api.baseLocation + imgInfo.hash)
										this.imgList.push(imgInfo.fileName)
									}
								})
							}
						}
					})
				}else{
					uni.showToast({
						icon:'none',
						title:'请先登录'
					})
				}
				console.log(this.imgList);
			},
			// 删除图片
			DelImage(e) {
				uni.showModal({
					title: '是否删除图片',
					content: '确定要删除图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.richTextList.splice(e.currentTarget.dataset.index, 1)
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
		},
		onLoad() {
			if(uni.getStorageSync('token')){
				this.token = uni.getStorageSync('token')
				console.log(this.token);
			}
			if(uni.getStorageSync('userId')){
				this.userId = uni.getStorageSync('userId')
			}
			this.uptoken()
			this.initMyLessonList()
			
		}
	}
</script>

<style lang="less" scoped>
	.publish{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		
		.publish-lesson{
			width: 100%;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			padding: 0 32rpx;
			box-sizing: border-box;
			.publish-lesson-left{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #333333;
			}
			.publish-lesson-right{
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #333333;
				image{
					width: 16rpx;
					height: 26rpx;
					margin-left: 20rpx;
					box-sizing: border-box;
				}
			}
			
		}
		
		.publish-center{
			height: 560rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: #fff;
			textarea{
				width: 100%;
				height: 400rpx;
				padding-top: 3%;
				border-top: 1rpx solid #F4F4F4;
			}
		}
		.publish-image{
			width: 100%;
			padding: 0 30rpx;
			padding-bottom: 90rpx;
			box-sizing: border-box;
			background-color: #fff;
			.imageList{
				width: 100%;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.image-item{
					position: relative;
					margin-right: 2%;
					margin-top: 1.5%;
					box-sizing: border-box;
					image{
						width: 156rpx;
						height: 156rpx;
						margin-right: 2%;
						margin-top: 2%;
						box-sizing: border-box;
						&:last-child{
							margin-right: 0;
						}
					}
					.icon{
						width: 40rpx;
						height: 40rpx;
						position: absolute;
						right: 0;
						top:0;
						z-index: 999;
					}
				}
					
				.uploadImage{
					margin-top: 2%;
					box-sizing: border-box;
					image{
						width: 156rpx;
						height: 156rpx;
					}
				}
			}
		}
		.publish-submit{
			border: none;
			outline: none;
			width: 100%;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			background: #FE5E50;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #FFFFFF;
			letter-spacing: -0.34px;
			
		}
		picker{
			width: 100%;
			text-align: right;
		}
	}
</style>
