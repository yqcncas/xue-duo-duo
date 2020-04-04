<template>
	<view class="myStudyMoney">
		<view class="myStudyMoney-header">
			<view class="myStudyMoney-header-left">
				<view class="myStudyMoney-header-left-money">金币总额</view>
				<view class="price">{{myMoney}}</view>
			</view>
			<view class="myStudyMoney-header-right" @click="goToWithDraw">
				提现
			</view>
		</view>
		<view class="myStudyMoney-footer">
			<view class="myStudyMoney-footer-item" v-for="(item, index) in drawList" :key = "index">
				<view class="myStudyMoney-footer-item-left">
					<view class="myStudyMoney-time">{{item.createTime}}</view>
					<view class="myStudyMoney-handler">{{typeInfo[item.type]}}</view>
				</view>
				<view class="myStudyMoney-footer-item-right" :class="{fenyong: item.type == 4}">
					{{typeInfoSymbol[item.type]}}{{item.money}}
				</view>
			</view>
		</view>
		<uni-load-more  :status="hasFlag ? 'loading' : 'noMore'" ></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		data () {
			return {
				myMoney: 0,
				// type对应的值
				// typeInfo: ["待处理", '提现成功', '提现失败', '处理中'],
				typeInfo: ["后台分配", '充值', '消费', '提现', '分佣', '失败返还'],
				typeInfoSymbol: ['+', '+', '-', '-', '+', "+"],
				hasFlag: true,
				pageNum: 0,
				drawList: []
			}
		},
		components: {
			uniLoadMore
		},
		methods:{
			goToWithDraw () {
				uni.navigateTo({
					url: '../Withdraw/Withdraw?money=' + this.myMoney
				})
			},
			async getUserInfo(){
				console.log(uni.getStorageSync('token'))
				let res = await this.$fetch(this.$api.userInfo,{},'GET', 'form')
				this.myMoney = Number(res.data.reward).toFixed(2)
				
				if (!this.myMoney) {
					this.myMoney = 0
				}
			},
			async getDrawList () {
				if (!this.hasFlag) return
				this.pageNum++
				let res = await this.$fetch(this.$api.moneyList, {pageNum: this.pageNum, pageSize: 10,types:"3,4"}, 'GET', 'FORM')
				console.log(res)
				this.drawList = [...this.drawList, ...res.rows]
				console.log(this.drawList)
				this.hasFlag = this.pageNum * 10 < res.total
			}
		},
		onShow() {
			this.getUserInfo()
			this.getDrawList()
		},
		onReachBottom() {
			console.log(this.hasFlag)
			if (this.hasFlag) {
				this.getDrawList()
			}
		}
	}
</script>

<style lang="less" scoped>
	.myStudyMoney{
		.myStudyMoney-header{
			width: 750rpx;
			height: 210rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			.myStudyMoney-header-left{
				display: flex;
				align-items: center;
				.myStudyMoney-header-left-money{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #9B9B9B;
					letter-spacing: -0.34px;
				}
				.price{
					font-weight: bold;
					font-family: PingFangSC-Semibold;
					font-size: 28px;
					color: #FE5E50;
					letter-spacing: -0.68px;
					margin-left: 40rpx;
					box-sizing: border-box;
				}
			}
			.myStudyMoney-header-right{
				width: 150rpx;
				height: 60rpx;
				color: #FFFFFF;
				line-height: 60rpx;
				text-align: center;
				background: #FE5E50;
				border-radius: 4rpx;
			}
		}
		.myStudyMoney-footer{
			padding-top: 30rpx;
			box-sizing: border-box;
			.myStudyMoney-footer-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: #fff;
				padding: 30rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid #f6f6f6;
				.myStudyMoney-footer-item-left{
					display: flex;
					flex-direction: column;
					.myStudyMoney-time{
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #9B9B9B;
						letter-spacing: -0.29px;
					}
					.myStudyMoney-handler{
						padding-top: 10rpx;
						box-sizing: border-box;
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #333333;
						letter-spacing: -0.34px;
					}
				}
				.myStudyMoney-footer-item-right{
					font-family: PingFangSC-Semibold;
					font-size: 17px;
					color: #FE9B42;
					letter-spacing: -0.41px;
					font-weight: bold;
					&.fenyong{
						color: #518FFF;
					}
				}
				.myStudyMoney-footer-item-right-add{
					font-family: PingFangSC-Semibold;
					font-size: 17px;
					color: #518FFF;
					letter-spacing: -0.41px;
					font-weight: bold;
				}
			}
		}
	}
</style>
