// 请在此对象写后端的请求接口列表
export default {
	// 此处写开发调试地址--自动生效
	// dev:'http://192.168.8.4:8082/',
	// dev:'http://study.bajiaostar.com:8082/',
	// 此处写线上环境地址--自动生效
	// pro: 'http://study.bajiaostar.com:8082/',
	dev:'https://study.bajiaostar.com/',
	pro: 'https://study.bajiaostar.com/',
	//　上传头像地址
	baseLocation: 'https://img.bajiaostar.com/', 
	// 七牛
	unloadLocation: 'https://upload.qiniup.com/', 
	
	/**
	 * 支付
	 */
	appPay: "/api/aliPay/appPay", // 支付宝app支付
	alicodePay: "/api/aliPay/codePay", // 阿里扫码支付 flag：1.订单 2.充值
	xcxPay: "/api/wxPay/xcxPay", // 微信小程序支付
	wxcodePay:"/api/wxPay/codePay", // 微信扫码支付 flag：1.订单 2.充值
	
	
	
	
	/**
	 * 无token接口
	 */
	getClassType: "/api/no/getClassType", // 获取年级树
	articleList: "/api/no/articleList", // 获取咨询列表
	getArticleType: "/api/no/getArticleType", // 获取咨询类型
	getCourseType: '/api/no/getCourseType', //获取学科列表
	getOpenId: "/api/no/getOpenId",// 获取openId
	getRotationChart: "/api/no/getRotationChart", // 轮播图
	getUserDict: "/api/no/getUserDict", //用户查询，用户类型（00系统用户01.学生02.业务员03.老师）
	login: "/api/no/login", //登录
	register: "/api/no/register", //union >>> openid
	sms: "/api/no/sms", // 短信验证
	update: "/api/no/update", // 版本检测
	wxLogin: "/api/no/wxLogin", // 微信直接登录
	getProtocol: "/api/no/getProtocol", //获取用户协议和平台协议
	
	/**
	 * 我的模块
	 */
	cancelCollect: "/api/mine/cancelCollect", // 取消收藏
	collect: "/api/mine/collect", // 加入收藏
	collectList: "/api/mine/collectList", // 查看我的收藏
	draw: "/api/mine/draw", // 我要提现
	editUserInfo: "/api/mine/editUserInfo", // 修改个人信息 用户性别（0男 1女 2未知）
	get10086Info: "/api/mine/get10086Info", // 获取客服信息列表
	getPayConfig: "/api/mine/getPayConfig", // 充值面额
	getQrCode: "/api/mine/getQrCode", // 邀请好友
	joinUs: "/api/mine/joinUs", // 我要加盟
	moneyList: "/api/mine/moneyList", // 学币明细
	sendInfo: "/api/mine/sendInfo", // 客服：发送信息
	uptoken: "/api/mine/uptoken", // 七牛uptoken
	userInfo: "/api/mine/userInfo", // 用户信息
	drawList: "/api/mine/drawList", // 提现记录列表
	
	
	/**
	 * 选课模块
	 */
	addCart: "/api/course/addCart", // 加入购物车
	addCustomized: "/api/course/addCustomized", // 课程定制
	addExperience: "/api/course/addExperience", // 添加心得
	addExperienceEvaluate: "/api/course/addExperienceEvaluate", // 添加评论
	delExperience: "/api/course/delExperience", // 删除心得
	experienceDetail: "/api/course/experienceDetail", // 心得详情
	assembleList: "/api/course/assembleList", // 拼团列表
	cancelOrder: "/api/course/cancelOrder", // 取消订单
	delCart: "/api/course/delCart", // 删除购物车内课程
	experienceList: "/api/course/experienceList", // 心得列表
	genOrder: "/api/course/genOrder", // 购物车生成订单 orderItemIds用逗号隔开
	genOrderFromCourse: "/api/course/genOrderFromCourse", // 课程直接生成订单
	getCartList: "/api/course/getCartList", // 购物车list
	getChapterList: "/api/course/getChapterList", // 章节list
	getCourseInfo: "/api/course/getCourseInfo", // 课程info || childNum为章节数，buy=true 表示已购买(显示学习)，exist=true表示已存在于订单或购物车(不可加入购物车)
	getCourseList: "/api/course/getCourseList", // 课程list(团购课程 isAssemble传1 不团购 传0 name同时搜索课程老师关键字 tj 是否为推荐课程 0 否 1是) childNum为章节数
	getTeacherInfo: "/api/course/getTeacherInfo", // 老师详情
	orderInfo: "/api/course/orderInfo", // 订单详情
	orderList: "/api/course/orderList", // 订单列表
	pay: "/api/course/pay", // 支付接口 ||| reward默认为true表示使用积分支付 ||| pay=true表示正式支付，false表示预支付查询
	updPraisePoints: "/api/course/updPraisePoints", // 评论点赞

	
	
	
}
