import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

//首页
export const getHome = (data) => {

    return http.request({
        url: 'miniapp/explore/',
		dataType: 'json',
        data,
    })
}

//问答详情
export const getQuestionDetail = (data) => {

    return http.request({
        url: 'miniapp/question/detail/',
		dataType: 'json',
        data,
    })
}

//问题答案
export const getQuestionAnswer = (data) => {

    return http.request({
        url: 'miniapp/question/getAnswer/',
		dataType: 'json',
        data,
    })
}


//专栏
export const getColumn = (data) => {

    return http.request({
        url: 'miniapp/column/column/',
		dataType: 'json',
        data,
    })
}
//专栏详情
export const getColumnDetail = (data) => {

    return http.request({
        url: 'miniapp/column/detail/',
		dataType: 'json',
        data,
    })
}


// 文章
export const getArticle = (data) => {

    return http.request({
        url: 'miniapp/article/article/',
		dataType: 'json',
        data,
    })
}

//文章详情
export const getArticleDetail = (data) => {

    return http.request({
        url: 'miniapp/article/detail/',
		dataType: 'json',
        data,
    })
}

//文章评论
export const getArticleComments = (data) => {
    return http.request({
        url: 'miniapp/article/comments/',
		dataType: 'json',
        data,
    })
}

//话题
export const getTopic = (data) => {

    return http.request({
        url: 'miniapp/topic/topic/',
		dataType: 'json',
        data,
    })
}


//话题详情
export const getTopicDetail = (data) => {

    return http.request({
        url: 'miniapp/topic/detail/',
		dataType: 'json',
        data,
    })
}
//话题下的主题
export const getTopicList = (data) => {

    return http.request({
        url: 'miniapp/topic/',
		dataType: 'json',
        data,
    })
}

//绑定账号
export const bind_account = (data) => {
    return http.post('miniapp/miniapp/bind_account/',data)
}

//注册账号
export const reg_account = (data) => {
    return http.post('miniapp/miniapp/reg_account/',data)
}

//获取最新用户信息
export const checkUserToken = (data) => {
    return http.post('miniapp/miniapp/checkUserToken/',data)
}

//获取小程序用户信息
export const getUserInfo = (data) => {
    return http.post('miniapp/miniapp/getUserInfo/',data)
}

//我的文章
export const getMyArticle = (data) => {
    return http.get('miniapp/people/getMyArticle/',data)
}
//我的问答
export const getMyQuestion = (data) => {
    return http.get('miniapp/people/getMyQuestion/',data)
}

//我的粉丝
export const getMyFollows = (data) => {
    return http.get('miniapp/people/getMyFollows/',data)
}

//获取答案下的评论
export const getAnswerComments = (data) => {
    return http.get('miniapp/question/getAnswerComments/',data)
}
//赞同 or 反对 答案
export const answer_vote = (data) => {
    return http.post('miniapp/question/answer_vote/',data)
}

//文章投票表态
export const article_vote = (data) => {
    return http.post('miniapp/article/article_vote/',data)
}

//关注话题
export const focus_topic = (data) => {
    return http.post('miniapp/topic/focus_topic/',data)
}

//关注问题
export const focus_question = (data) => {
    return http.post('miniapp/question/focus_question/',data)
}


//个人资料
export const getPeople = (data) => {
    return http.get('miniapp/people/index/',data)
}
//关注某人
export const follow_people = (data) => {
    return http.post('miniapp/people/follow_people/',data)
}

//修改个人资料
export const profile_setting = (data) => {
    return http.post('miniapp/people/profile_setting/',data)
}

//提交文章评论
export const post_article_comment = (data) => {
    return http.post('miniapp/publish/post_article_comment/',data)
}

//初始化问题发布页
export const intPublishQuestion = (data) => {
    return http.post('miniapp/publish/intQuestion/',data)
}
//发布问题
export const publish_question = (data) => {
    return http.post('miniapp/publish/publish_question/',data)
}

//初始化文章发布
export const intPublishArticle = (data) => {
    return http.post('miniapp/publish/intArticle/',data)
}

//发布问题
export const publish_article = (data) => {
    return http.post('miniapp/publish/publish_article/',data)
}

//提交问题答案
export const post_answer = (data) => {
    return http.post('miniapp/publish/post_answer/',data)
}

//提交答案下的评论
export const post_answer_comment = (data) => {
    return http.post('miniapp/publish/post_answer_comment/',data)
}

//读取通知信息
export const load_notifications = (data) => {
    return http.post('miniapp/notifications/load_notifications/',data)
}

//阅读通知
export const read_notification = (data) => {
    return http.post('miniapp/notifications/read_notification/',data)
}


//读取私信
export const load_inbox = (data) => {
    return http.post('miniapp/inbox/load_inbox/',data)
}

//私信聊天界面
export const chat_inbox = (data) => {
    return http.post('miniapp/inbox/chat_inbox/',data)
}

//发送私信
export const inbox_send = (data) => {
    return http.post('miniapp/inbox/inbox_send/',data)
}

//读取私信
export const search_topic = (data) => {
    return http.get('miniapp/topic/search/',data)
}

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	search_topic,
	getHome,
	getQuestionDetail,
	getQuestionAnswer,
    getArticle,
	getArticleDetail,
	getArticleComments,
	getTopic,
	getTopicDetail,
	getTopicList,
	getColumn,
	getColumnDetail,
	bind_account,
	reg_account,
	getUserInfo,
	getMyArticle,
	getMyQuestion,
	getMyFollows,
	checkUserToken,
	getAnswerComments,
	answer_vote,
	article_vote,
	focus_topic,
	focus_question,
	getPeople,
	follow_people,
	profile_setting,
	post_article_comment,
	intPublishQuestion,
	publish_question,
	intPublishArticle,
	publish_article,
	post_answer,
	post_answer_comment,
	load_notifications,
	read_notification,
	load_inbox,
	chat_inbox,
	inbox_send
}