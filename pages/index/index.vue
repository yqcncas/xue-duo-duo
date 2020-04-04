<template>
	<view class="index">
		<scroll-view scroll-y="true" >
			<HomeHeader :homeHeaderClassTrue = "homeHeaderClassTrue"></HomeHeader>
			<HomeBanner @bannergoTo = "bannergoTo" :bannerList = "bannerList"></HomeBanner>
			<HomeMain :scrollTab = 'scrollTab' :LessonList = "LessonList" @handleCurrentIndex = "handleCurrentIndex" @goToLessonDetail = "goToLessonDetail"></HomeMain>
		</scroll-view>
	</view>
</template>

<script>
	import HomeHeader from '../../components/Home/HomeHeader.vue'
	import HomeBanner from '../../components/Home/HomeBanner.vue'
	import HomeMain from '../../components/Home/HomeMain.vue'
	import baseURL from '@/config/index.js'
	export default {
		data() {
			return {
				// 轮播图
				bannerList: [],
				// 课程头部
				scrollTab: [],
				// 获取选择的年纪和id
				homeHeaderClassTrue: {},
				// 初始课程列表
				LessonList: [],
				// 加载
				hasFlag: false,
				pageNum: 1
			}
		},
		components: {
			HomeHeader,
			HomeBanner,
			HomeMain
		},
		onLoad(options) {
			this.initBannerInfo ()
			this.initLessonTab()
			if (options.q) {
				// uni.setStorageSync('qrcode', options.qrCode)
				let q = decodeURIComponent(options.q)
				let index = q.indexOf('Code/')
				let qrCode = q.substring(index+5, q.length)
				console.log(qrCode)
				uni.setStorageSync('qrCode', qrCode)
			}
			
			
		},
		onShow() {
			if (uni.getStorageSync('classTrue')) {
				this.homeHeaderClassTrue = JSON.parse(uni.getStorageSync('classTrue'))
			}
			if (this.homeHeaderClassTrue.id != uni.getStorageSync('classTrueId')) {
				// this.handleCurrentIndex(0)
			}
			if (uni.getStorageSync('classBackFresh')) {
				this.initLessonList()
				uni.removeStorageSync('classBackFresh')
			}
		},
		methods: {
			bannergoTo (index) {
				if (index == 2) {
					uni.navigateTo({
						url: '../Special/Special'
					})
				}
				if(index == 1) {
					uni.navigateTo({
						url:'../Group/Group'
					})
				}
				if (index == 0) {
					uni.navigateTo({
						url:'../CustomMade/CustomMade'
					})
				}
				
			},
			// 初始化轮播图
			async initBannerInfo () {
				let {data: res} = await this.$fetch(this.$api.getRotationChart, {}, 'GET')
				// console.log(res)
				this.bannerList = res
			},
			// 初始化课程scrollTab列表
			async initLessonTab () {
				let {data: res} = await this.$fetch(this.$api.getCourseType, {}, 'Get')
				this.scrollTab = res
				console.log(this.scrollTab)
				for (let i = 0; i < this.scrollTab.length; i++) {
					this.scrollTab[i].childId = 'childId' + i
				}
				this.initLessonList()
			},
			// 初始化课程列表
			async initLessonList () {
				if (uni.getStorageSync('classTrueId')) {
					let classTrueId = uni.getStorageSync('classTrueId')
					let res = await this.$fetch(this.$api.getCourseList, { courseTypeId: this.scrollTab[0].dictValue, classTypeId: classTrueId, pageNum: this.pageNum, pageSize: 10 }, 'Get')
					this.LessonList = res.rows	
					this.LessonList.forEach(item => {
						item.teachers.forEach(teachers => {
							teachers.avatar = baseURL.slice(0, baseURL.length - 1) + teachers.avatar
						})
					})
				} else {
					let res = await this.$fetch(this.$api.getCourseList, {courseTypeId: this.scrollTab[0].dictValue, pageNum: this.pageNum, pageSize: 10}, 'Get')
					this.LessonList = res.rows	
					this.LessonList.forEach(item => {
						item.teachers.forEach(teachers => {
							teachers.avatar = baseURL.slice(0, baseURL.length - 1) + teachers.avatar
						})
					})
				}
				
			},
			// 点击tab切换数据
			async handleCurrentIndex (index) {
				if (uni.getStorageSync('classTrueId')) {
					let classTrueId = uni.getStorageSync('classTrueId')
					let res = await this.$fetch(this.$api.getCourseList, {courseTypeId: this.scrollTab[index].dictValue, classTypeId: classTrueId }, 'Get')
					console.log(res)
					this.LessonList = res.rows
					this.LessonList.forEach(item => {
						item.teachers.forEach(teachers => {
							teachers.avatar = baseURL.slice(0, baseURL.length - 1) + teachers.avatar
						})
					})
					console.log(this.LessonList)
				} else {
					let res = await this.$fetch(this.$api.getCourseList, {courseTypeId: this.scrollTab[index].dictValue}, 'Get')
					this.LessonList = res.rows
					this.LessonList.forEach(item => {
						item.teachers.forEach(teachers => {
							teachers.avatar = baseURL.slice(0, baseURL.length - 1) + teachers.avatar
						})
					})
					console.log(this.LessonList)
				}
				
			
			},
			// 去课程详情
			goToLessonDetail (courseId) {
				uni.navigateTo({
					url: '../LessonDetail/LessonDetail?courseId=' + courseId + '&grOrLes=' + 2
				})
			}
		}
	}
</script>

<style lang="less">
page::after {
		display: none;
	}
	.index{
		background-color: #F7F7F7;
	}
</style>
