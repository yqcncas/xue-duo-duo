<template>
	<view class="group">
		<view class="group-header">
			<view class="group-header-left">
				<picker mode="selector" :range="classSelect" @change="handleSelectClass">
					<view class="box">
						<view>年级</view>
						<image src="../../static/image/index/downpush.png" mode="aspectFill"></image>
					</view>
				</picker>
			</view>
			<view class="group-header-right">
				<picker mode="selector" :range="lessonSelsect" @change="handleSelectLesson">
					<!-- <view>科目</view> -->
					<view class="box">
						<view>科目</view>
						<image src="../../static/image/index/downpush.png" mode=""></image>
					</view>
				</picker>
				<!-- <image src="../../static/image/index/downpush.png" mode=""></image> -->
			</view>
		</view>
		<view class="group-main">
			<view class="group-main-item" v-for="(groupItem, index) in groupList" :key = "groupItem.id" @click="goToLessonDetail(groupItem.courseId)">
				<view class="group-main-item-top">
					<image :src="groupItem.pic" mode=""></image>
				</view>
				<view class="group-main-item-bottom">
					<view class="group-main-item-bottom-top">
						<view class="group-main-item-bottom-top-left">{{groupItem.courseTypeName}}</view>
						<view class="group-main-item-bottom-top-right">{{groupItem.name}}</view>
					</view>
					<view class="group-main-item-bottom-center">
						<div class="group-main-item-bottom-center-line" ref = "centerLine" :style = "{width:lineWidth[index] + '%'}"></div>
					</view>
					<view class="group-main-item-bottom-footer">
						<view class="group-main-item-bottom-footer-left">
							<view class="shengyushijian">剩余时间</view>
							<view class="shengyushijian-timer"><span>{{day[index]}}天</span>{{hour[index]}}小时{{minute[index]}}分{{second[index]}}秒</view>
						</view>
						<view class="group-main-item-bottom-footer-right manren" v-if="groupItem.actualNum / groupItem.estimateNum == 1">
							已满
						</view>
						<view class="group-main-item-bottom-footer-right" v-else>
							<span class = "cantuan">{{groupItem.actualNum}}</span>/<span class="jietuan">{{groupItem.estimateNum}}</span>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<uni-load-more bgColor="#FFFFFF" :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				classSelect: [], // 年级picker
				classSelectId: [], //年级pickerId
				lessonSelsect: [], // 科目picker
				lessonSelsectId: [], // 科目pickerID
				isLessonIndex: -1, // 判断是否曾选过科目
				isClassIndex: -1, // 判断是否曾选过年级
				pageNum: 1,
				groupList: [],
				surplusTime: [], // 剩余时间数组
				lineWidth: [], // 线长
				day: [], // 天数组
				hour: [], // 小时
				minute: [],// 分
				second: [] ,// 秒
				countDownTimer: [], // 定时器
				difftimes: [] ,// 时间差
				lessonList: [], // 所有的科目属性
				gradeTree: [], // 所有的年级
				hasFlag: false
			}
		},
		onShow () {
			
		},
		
		methods: {
			// 更换科目
			async handleSelectLesson(e) {
				let lessonIndex = e.detail.value
				this.isLessonIndex = lessonIndex
				console.log(this.lessonSelsectId[lessonIndex])
				if(this.isClassIndex) {
					let res = await this.$fetch(this.$api.assembleList, {classTypeId: this.classSelectId[this.isClassIndex] , courseTypeId: this.lessonSelsectId[this.isLessonIndex], pageNum: this.pageNum, pageSize: 10, assembleStatus: 0},'POST','FORM')
					this.groupList = res.data
					for (let i = 0; i < this.groupList.length; i++) {
						// 线长处理
						let lineWidth = this.groupList[i].actualNum / this.groupList[i].estimateNum * 100
						this.lineWidth.push(lineWidth)
						// 时间处理
						let date1 = this.$dayjs(this.groupList[i].estimateEndTime)
						let date2 = this.$dayjs()
						this.difftimes[i] = date1.diff(date2, 'second')
						this.countDown(this.difftimes[i])
						clearInterval(this.countDownTimer[i])
						this.countDownTimer[i] = null;
						this.countDownTimer[i] = setInterval(() => {
							this.difftimes[i]--
							if (this.difftimes[i] <= 0) {
								this.endOfTime(i)
								this.day[i] = 0
								this.hour[i] = 0
								this.minute[i] = 0
								this.second[i] = 0
								return
							}
							this.countDown(this.difftimes[i])
						}, 1000)
					}
				} else {
					let res = await this.$fetch(this.$api.assembleList, {courseTypeId: this.lessonSelsectId[this.isLessonIndex], pageNum: this.pageNum, pageSize: 10, assembleStatus: 0},'POST','FORM')
					this.groupList = res.data
					for (let i = 0; i < this.groupList.length; i++) {
						// 线长处理
						let lineWidth = this.groupList[i].actualNum / this.groupList[i].estimateNum * 100
						this.lineWidth.push(lineWidth)
						// 时间处理
						let date1 = this.$dayjs(this.groupList[i].estimateEndTime)
						let date2 = this.$dayjs()
						this.difftimes[i] = date1.diff(date2, 'second')
						this.countDown(this.difftimes[i])
						clearInterval(this.countDownTimer[i])
						this.countDownTimer[i] = null;
						this.countDownTimer[i] = setInterval(() => {
							this.difftimes[i]--
							if (this.difftimes[i] <= 0) {
								this.endOfTime(i)
								this.day[i] = 0
								this.hour[i] = 0
								this.minute[i] = 0
								this.second[i] = 0
								return
							}
							this.countDown(this.difftimes[i])
						}, 1000)
					}
				}
				
			},
			// 更换年级
			async handleSelectClass(e){
				let classIndex = e.detail.value
				this.isClassIndex = classIndex
				console.log(this.classSelectId[classIndex])
				if (this.isLessonIndex) {
					let res = await this.$fetch(this.$api.assembleList, {classTypeId: this.classSelectId[classIndex], courseTypeId: this.lessonSelsectId[this.isLessonIndex], pageNum: this.pageNum, pageSize: 10, assembleStatus: 0},'POST','FORM')
					this.groupList = res.data
					for (let i = 0; i < this.groupList.length; i++) {
						// 线长处理
						let lineWidth = this.groupList[i].actualNum / this.groupList[i].estimateNum * 100
						this.lineWidth.push(lineWidth)
						// 时间处理
						let date1 = this.$dayjs(this.groupList[i].estimateEndTime)
						let date2 = this.$dayjs()
						this.difftimes[i] = date1.diff(date2, 'second')
						this.countDown(this.difftimes[i])
						clearInterval(this.countDownTimer[i])
						this.countDownTimer[i] = null;
						this.countDownTimer[i] = setInterval(() => {
							this.difftimes[i]--
							if (this.difftimes[i] <= 0) {
								this.endOfTime(i)
								this.day[i] = 0
								this.hour[i] = 0
								this.minute[i] = 0
								this.second[i] = 0
								return
							}
							this.countDown(this.difftimes[i])
						}, 1000)
					}
				} else {
					let res = await this.$fetch(this.$api.assembleList, {classTypeId: this.classSelectId[this.isClassIndex], pageNum: this.pageNum, pageSize: 10, assembleStatus: 0},'POST','FORM')
					this.groupList = res.data
					for (let i = 0; i < this.groupList.length; i++) {
						// 线长处理
						let lineWidth = this.groupList[i].actualNum / this.groupList[i].estimateNum * 100
						this.lineWidth.push(lineWidth)
						// 时间处理
						let date1 = this.$dayjs(this.groupList[i].estimateEndTime)
						let date2 = this.$dayjs()
						this.difftimes[i] = date1.diff(date2, 'second')
						clearInterval(this.countDownTimer[i])
						this.countDownTimer[i] = null;
						this.countDownTimer[i] = null
						this.countDownTimer[i] = setInterval(() => {
							this.difftimes[i]--
							if (this.difftimes[i] <= 0) {
								this.endOfTime(i)
								this.day[i] = 0
								this.hour[i] = 0
								this.minute[i] = 0
								this.second[i] = 0
								return
							}
							this.countDown(this.difftimes[i])
						}, 1000)
					}
				}
				
			},
			// 列表数据
			async initGroupList () {
				let res = await this.$fetch(this.$api.assembleList, {pageNum: this.pageNum, pageSize: 10, assembleStatus: 0}, 'POST', 'FORM')
				this.groupList = res.data
				for (let i = 0; i < this.groupList.length; i++) {
					// 线长处理
					let lineWidth = this.groupList[i].actualNum / this.groupList[i].estimateNum * 100
					this.lineWidth.push(lineWidth)
					// 时间处理
					let date1 = this.$dayjs(this.groupList[i].estimateEndTime)
					let date2 = this.$dayjs()
					this.difftimes[i] = date1.diff(date2, 'second')
					this.countDown(this.difftimes[i])
					clearInterval(this.countDownTimer[i])
					this.countDownTimer[i] = null;
					this.countDownTimer[i] = setInterval(() => {
						this.difftimes[i]--
						if (this.difftimes[i] <= 0) {
							this.endOfTime(i)
							this.day[i] = 0
							this.hour[i] = 0
							this.minute[i] = 0
							this.second[i] = 0
							return
						}
						this.countDown(this.difftimes[i])
					}, 1000)
				}
			},
			// 倒计时处理
			countDown (difftimes) {	
				for (let i = 0; i < this.groupList.length; i++) {
					
					
					this.$set(this.day, i, parseInt((this.difftimes[i] / 60 / 60) / 24))
				
					this.$set(this.hour, i, Math.floor(this.difftimes[i] / (60 * 60)))
				
					this.$set(this.minute, i, Math.floor(this.difftimes[i] / 60) - (this.hour[i] * 60))
				
					this.$set(this.second, i, Math.floor(this.difftimes[i]) - (this.hour[i] * 60 * 60) - (this.minute[i] * 60))
			
					if (this.hour[i] < 10) {
						this.hour[i] = "0" + this.hour[i]
					}
					if (this.minute[i] < 10) {
						this.minute[i] = "0" + this.minute[i]
					}
					if (this.second[i] < 10) {
						this.second[i] = "0" + this.second[i]
					}
					if (this.difftimes[i] <= 0) {
						this.day[i] = 0
						this.hour[i] = 0
						this.minute[i] = 0
						this.second[i] = 0
						this.endOfTime(i)
					}
				}
				
				
				
			},
			// 清除定时器
			endOfTime (i) {
				clearInterval(this.countDownTimer[i])
				this.countDownTimer[i] = null;
			},
			// 科目列表
			async initLessonTab () {
				let {data: res} = await this.$fetch(this.$api.getCourseType, {}, 'Get')
				this.lessonList = res
				for (let i = 0; i < this.lessonList.length; i++) {
					this.lessonSelsect.push(this.lessonList[i].dictLabel)
					this.lessonSelsectId.push(this.lessonList[i].dictValue)
				}
			},
			// 获取年级
			async initClassTrueInfo () {
				let res = await this.$fetch(this.$api.getClassType, {}, 'GET')
				console.log(res)
				if (res.code !== 0) return uni.showToast({
					icon: 'none',
					title: '请求失败'
				}) 
				this.gradeTree = res.data
				console.log(this.gradeTree)
				for (let i = 0; i < this.gradeTree.length; i++) {
					for (let j = 0; j < this.gradeTree[i].child.length; j++) {
						this.classSelect.push(this.gradeTree[i].child[j].name) 
						this.classSelectId.push(this.gradeTree[i].child[j].id)
					}
					
				}
			},
			
			goToLessonDetail (index) {
				uni.navigateTo({
					url: '../LessonDetail/LessonDetail?courseId=' + index + '&grOrLes=' + 1
				})
			}
		},
		onLoad() {
			this.initLessonTab()
			this.initClassTrueInfo()
			this.initGroupList()
			
		},
		onHide() {
			
		}
	}
</script>

<style scoped lang="less">
	page::after{
		display: none;
	}
	.group{
		.group-header{
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			background-color: #fff;
			display: flex;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #9B9B9B;
			letter-spacing: -0.34px;
			.group-header-left,.group-header-right{
				width: 50%;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 24rpx;
					height: 24rpx;
					margin-left: 20rpx;
					margin-top: 35rpx;
					box-sizing: border-box;
				}
			}
			.box{
				width: 100%;
				display: flex;
				align-content: center;
				justify-content: center;
				height: 100%;
			}
		}
		.group-main{
			padding: 30rpx;
			box-sizing: border-box;
			.group-main-item{
				border-radius: 7px;
				overflow: hidden;
				margin-top: 30rpx;
				box-sizing: border-box;
				&:nth-child(1){
					margin-top: 0rpx;
				}
				.group-main-item-top{
					width: 690rpx;
					height: 272rpx;
					image{
						width: 100%;
						height: 100%;

					}
				}
				.group-main-item-bottom{
					width: 690rpx;
					height: 184rpx;
					padding: 30rpx;
					box-sizing: border-box;
					background-color: #fff;
					.group-main-item-bottom-top{
						
						.group-main-item-bottom-top-left{
							width: 64rpx;
							height: 34rpx;
							color: #FFFFFF;
							background-color: #f40;
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #FFFFFF;
							letter-spacing: -0.29px;
							text-align: center;
							border-radius: 2px;
							box-sizing: border-box;
							float: left;
						}
						.group-main-item-bottom-top-right{
							font-family: PingFangSC-Semibold;
							font-size: 17px;
							color: #333333;
							letter-spacing: -0.41px;
							font-weight: bold;
							transform: translate(20rpx,-7rpx);

						}
					}
					.group-main-item-bottom-center{
						width: 100%;
						height: 8rpx;
						border-radius: 2px;
						background-color: #F0F0F0;
						margin-top: 18rpx;
						margin-bottom:20rpx;
						box-sizing: border-box;
						.group-main-item-bottom-center-line{
							width: 50%;
							height: 100%;
							background-color: #FE5E50;
							position: relative;
							border-radius: 2px;
						}
					}
					.group-main-item-bottom-footer{
						display: flex;
						justify-content: space-between;
						.group-main-item-bottom-footer-left{
							display: flex;
							.shengyushijian{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #9B9B9B;
								letter-spacing: -0.34px;
								text-align: justify;
							}
							.shengyushijian-timer{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #518FFF;
								letter-spacing: -0.34px;
								text-align: justify;
								padding-left: 30rpx;
								box-sizing: border-box;
								
							}
						}
						.group-main-item-bottom-footer-right{
							&.manren{
								width: 80rpx;
								height: 34rpx;
								background: rgba(254,94,80,0.30);
								border-radius: 2px;
								font-family: PingFangSC-Regular;
								font-size: 12px;
								color: #FE5E50;
								letter-spacing: -0.29px;
								text-align: justify;
								text-align: center;
							}
							.cantuan{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #FE9B42;
								letter-spacing: -0.34px;
								text-align: justify;
							}
							.jietuan{
								font-family: PingFangSC-Regular;
								font-size: 14px;
								color: #151515;
								letter-spacing: -0.34px;
								text-align: justify;
								
							}
						}
					}
				}
			}
		}
		picker{
			width: 100%;
		}
	}
</style>

