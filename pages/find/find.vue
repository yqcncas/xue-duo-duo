<template>
	<view class="find">
		<view class="find-header">
			<view class="find-header-title">推荐课程</view>
			<view class="find-header-wrapper">
				<view class="find-header-wrapper-item" v-for="(item, index) in recommendLesson" :key = "index" @click="goToLessonDetail(item.courseId)">
					<view class="find-header-wrapper-item-top"> 
						<image :src="item.pic" mode=""></image>
					</view>
					<view class="find-header-wrapper-item-bottom">
						<view class="find-header-wrapper-item-bottom-left">{{item.courseTypeName}}</view>
						<view class="find-header-wrapper-item-bottom-right">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="find-bottom">
			<scroll-view scroll-x="true" >
				<view class="find-bottom-top">
					<!-- <view class="find-bottom-top-item active">招生信息</view>
					<view class="find-bottom-top-item">招生信息</view> -->
					<view class="find-bottom-top-item " :class="{active: handleChapterListIndex === index}" @click.stop="handleChapterListIndexFn(index)" v-for="(chapterListHeader, index) in ChapterList" :key = 'chapterListHeader.dictValue'>{{chapterListHeader.dictLabel}}</view>
				</view>
			</scroll-view>
			<view class="line-30"></view>
			<view class="find-bottom-bottom">
				<view class="find-botton-article" v-for="(articleList, index) in findList" :key = "index" @click="goToRichText(articleList.articleContent)">
					<view class="find-botton-article-left">
						<image :src="articleList.articleTitlePreview" mode=""></image>
					</view>
					<view class="find-botton-article-right">
						<view class="find-botton-article-right-top">
							{{articleList.articleTitle}}
						</view>
						<view class="find-botton-article-right-bottom">
							{{articleList.createTime}}
						</view>
					</view>
				</view>
			</view>
			<view class="line-30"></view>
			<uni-load-more  :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		onLoad() {
			// 推荐课程
			this.initRecommendLesson() 
			// 章节list头部
			this.initGetChapterList()
		},
		components:{
			uniLoadMore
		},
		data () {
			return {
				recommendLesson: [], // 推荐课程
				ChapterList: [], //文章头部
				handleChapterListIndex: 0, //选中的列表项
				findList: [],// 文章列表
				currentDictValue: 0 ,//选择的下标id
				pageNum: 0,
				hasFlag: true
			}
		},
		methods: {
			async initRecommendLesson () {
				let res = await this.$fetch(this.$api.getCourseList, {tj: 1}, "GET")
				console.log(res)
				this.recommendLesson = res.rows
				console.log(this.recommendLesson)
			},
			async initGetChapterList () {
				let {data: res} = await this.$fetch(this.$api.getArticleType,{},'GET')
				console.log(res)
				this.ChapterList = res
				this.currentDictValue = this.ChapterList[0].dictValue
				// 章节数据
				this.initChapterList()
			},
			async initChapterList () {
				console.log(this.ChapterList[0].dictValue)
				if (!this.hasFlag) return
				this.pageNum++
				let {data: res} = await this.$fetch(this.$api.articleList,{typeId: this.currentDictValue, pageNum: this.pageNum, pageSize: 10}, 'POST', 'FORM')
				console.log(res)
				this.findList = res
				this.hasFlag = this.pageNum * 10 < res.total
			},
			// 头部点击 去详情
			goToLessonDetail (index) {
				uni.navigateTo({
					url: '../LessonDetail/LessonDetail?courseId=' + index
				})
			},
			// 去富文本
			goToRichText (item) {
				uni.setStorageSync("richText", item)
				uni.navigateTo({
					url: "../rich-text/rich-text"
				})
			},
			// 更改头部下标
			handleChapterListIndexFn (index) {
				this.pageNum = 0,
				this.hasFlag = true
				// 切换下标
				this.handleChapterListIndex = index
				// 切换要请求的参数值
				this.currentDictValue = this.ChapterList[index].dictValue
				this.initChapterList()
			}
		},
		onReachBottom () {
			if (this.hasFlag) {
				this.initChapterList()
			}
		}
	}
</script>

<style lang="less" scoped>
	.find{
		.find-header{
			
			.find-header-title{
				padding: 30rpx;
				padding-bottom: 0;
				box-sizing: border-box;
				font-weight: bold;
			}
			.find-header-wrapper{
				padding: 30rpx;
				
				box-sizing: border-box;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				.find-header-wrapper-item{
					width: 48%;
					height: 292rpx;
					// flex: 1;
					overflow: hidden;
					background: #FFFFFF;
					box-shadow: 0 2px 7px 0 rgba(254,94,80,0.03), 0 5px 10px 0 rgba(254,94,80,0.05);
					border-radius: 7px;
					display: flex;
					flex-direction: column;
					&:nth-child(3), &:nth-child(4) {
						margin-top: 30rpx;
						box-sizing: border-box;
					}
					.find-header-wrapper-item-top{
						
						image{
							width: 330rpx;
							height: 178rpx;
						}
					}
					.find-header-wrapper-item-bottom{
						// height: 114rpx;
						padding: 20rpx;
						box-sizing: border-box;
						// display: flex;
						// align-items: center;
						.find-header-wrapper-item-bottom-left{
							float: left;
							width: 60rpx;
							height: 30rpx;
							text-align: center;
							// width: 30rpx;
							// height: 30rpx;
							border-radius: 2px;
							background-color: #FE5E50;
							font-family: PingFangSC-Regular;
							font-size: 9px;
							color: #FFFFFF;
							letter-spacing: -0.22px;
						}
						.find-header-wrapper-item-bottom-right{
							font-weight: bold;
							display: -webkit-box;    
							-webkit-box-orient: vertical;    
							-webkit-line-clamp: 2;    //控制行数
							overflow: hidden;
							transform: translate(10rpx,-2rpx);
							font-family: PingFangSC-Semibold;
							font-size: 12px;
							color: #333333;
							letter-spacing: -0.29px;
							margin-left: 10rpx;
							box-sizing: border-box;
						}
					}
				}
			}
		}
		.find-bottom{
			.find-bottom-top{
				display: flex;
				.find-bottom-top-item{
					height: 70rpx;
					
					flex: 1;
					text-align: center;
					position: relative;
					padding-top: 20rpx;
					// padding-bottom: 30rpx;
					background-color: #fff;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #9B9B9B;
					letter-spacing: -0.34px;
					
					&::after{
						content: '';
						width: 0;
						height: 0;
						border-bottom: 4rpx solid #fe5e50;
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translateX(-50%);
						transition: .5s;
					}
					&.active{
						font-family: PingFangSC-Semibold;
						font-size: 17px;
						color: #FE5E50;
						letter-spacing: -0.41px;
						font-weight: bold;
						&::after{
							width: 10%;
						}
					}
				}
			}
			.find-bottom-bottom{
				
				box-sizing: border-box;
				background-color: #f7f7f7;
				.find-botton-article{
					border-bottom: 1rpx solid #F7F7F7;
					box-sizing: border-box;
					padding: 30rpx;
					box-sizing: border-box;
					background-color: #fff;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.find-botton-article-left{
						image{
							width: 180rpx;
							height: 124rpx;
						}
					}
					.find-botton-article-right{
						margin-left: 30rpx;
						box-sizing: border-box;
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.find-botton-article-right-top{
							font-family: PingFangSC-Semibold;
							font-size: 14px;
							color: #333333;
							letter-spacing: 0;
							text-align: justify;
							font-weight: bold;
						}
						.find-botton-article-right-bottom{
							padding-top: 10rpx;
							box-sizing: border-box;
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #9B9B9B;
							letter-spacing: 0;
							text-align: justify;
						}
					}
				}
			}
			
		}
	}
</style>
