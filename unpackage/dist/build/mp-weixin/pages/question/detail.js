(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/question/detail"],{"2d64":function(t,e,o){"use strict";var n=function(){var t=this,e=t.$createElement;t._self._c},s=[];o.d(e,"a",function(){return n}),o.d(e,"b",function(){return s})},"5f82":function(t,e,o){"use strict";var n=o("b43e"),s=o.n(n);s.a},"920f":function(t,e,o){"use strict";o.r(e);var n=o("94a4"),s=o.n(n);for(var i in n)"default"!==i&&function(t){o.d(e,t,function(){return n[t]})}(i);e["default"]=s.a},"94a4":function(t,e,o){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=o("2f62"),s=i(o("2e85"));function i(t){return t&&t.__esModule?t:{default:t}}function a(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{},n=Object.keys(o);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(o).filter(function(t){return Object.getOwnPropertyDescriptor(o,t).enumerable}))),n.forEach(function(e){r(t,e,o[e])})}return t}function r(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}var u={computed:a({},(0,n.mapState)(["userInfo","hasLogin","system_config"])),data:function(){return{CommentInput:!1,page:0,sort:"DESC",sort_key:"add_time",sort_name:"按时间排序",InputBottom:0,isCard:!0,listData:[],answers:[],question_info:[],question_topics:[],footerTips:"",isLoad:!1,reload:!1,isLastPage:!1,commentDisabled:!1,textareaHeight:100,post_anonymous:!1,rf:"",redirect_message:!1,answer_count:0}},onLoad:function(t){this.userInfo,this.hasLogin;var e=t.id,o=t.rf;this.rf=o||"",this.getQuestionDetail(e)},onPullDownRefresh:function(){this.intGetList()},onReachBottom:function(){this.getQuestionAnswer()},onShareAppMessage:function(t){return"button"===t.from&&console.log(t.target),{title:"感觉这个问题只有你能帮我解答。拜托了!"}},methods:{focus_question:function(){var t=this,e=this.userInfo,o={};o.access_token=e.access_token?e.access_token:"",o.question_id=this.question_id,console.log("focus_question",o),this.$api.focus_question(o).then(function(e){console.log("focus_question",e);var o=e.data.rsm.type;if(!o)return s.default.showToast("问题不存在"),!1;t.question_info.user_question_focus="add"==o?1:0}).catch(function(t){console.log("请求出错了，可以在这里做失败处理",t)})},toHome:function(){t.switchTab({url:"/pages/index/index"})},toBack:function(){var e=getCurrentPages();e.length>1?t.navigateBack({delta:1}):this.toHome()},AnonymousChange:function(t){this.post_anonymous=t.detail.value},textareaAInput:function(t){console.log("已输入字数：",t.detail.cursor)},hideCommentInput:function(e){t.setNavigationBarTitle({title:this.question_info.question_content}),this.CommentInput=!1},showCommentInput:function(){var e=this.system_config;if(!e||"Y"==e.system_verify)return s.default.errorToast("小程序端暂不支持回复功能"),!1;var o=this.userInfo;o.uid>0&&this.hasLogin?(this.CommentInput=!0,t.setNavigationBarTitle({title:"回复"})):t.navigateTo({url:"../account/login"})},SheetSort:function(){var e=this,o=["按时间排序","按赞同数排序","只看我关注的"];t.showActionSheet({itemList:o,success:function(t){var n=o[t.tapIndex];switch(e.sort_name=n,t.tapIndex){case 0:e.sort_key="add_time";break;case 1:e.sort_key="agree_count";break;case 2:e.sort_key="focus";break;default:e.sort_key="add_time";break}e.intGetList()},fail:function(t){console.log(t.errMsg)}})},toTopics:function(e){console.log("toTopics",e);var o=e.currentTarget.dataset.topic_id;o>0?t.navigateTo({url:"../topic/detail?topic_id="+o}):s.default.showToast("话题ID有误")},toLogin:function(){s.default.errorToast("请先登录"),setTimeout(function(){t.navigateTo({url:"/pages/account/login",success:function(t){},fail:function(){},complete:function(){}})},1200)},toAnswerDetail:function(e){var o=e.currentTarget.dataset.answer_id,n=e.currentTarget.dataset.idx;console.log("toAnswerDetail",o),o>0?t.navigateTo({url:"../question/answer?answer_id="+o+"&question_id="+this.question_id+"&idx="+n}):s.default.showToast("回答ID有误")},toPeople:function(e){console.log("toPeople",e);var o=e.currentTarget.dataset.uid;if(o>0)t.navigateTo({url:"../people/people?uid="+o});else{var n=e.currentTarget.dataset.anonymous;1!=n&&s.default.showToast("会员ID有误")}},InputBlur:function(t){this.InputBottom=0},getQuestionDetail:function(e){var o=this;if(e>0){this.question_id=e;var n=this.userInfo,i=[];i.id=e,i.access_token=n.access_token?n.access_token:"",""!=this.rf&&(i.rf=this.rf),this.$api.getQuestionDetail(i).then(function(e){var n=e.data.rsm.question_info;if(n){var i=e.data.rsm.question_topics;o.question_info=n,o.question_topics=i,""!=n.question_content&&n.question_content&&t.setNavigationBarTitle({title:n.question_content});var a=e.data.rsm.redirect_message;a&&""!=a.title&&""!=a.path&&(o.redirect_message=a,console.log("redirect_message",a)),o.getQuestionAnswer()}else{var r=e.data.rsm.redirect_target_id;if(r&&r>0)return console.log("跳转到"+r),t.reLaunch({url:"detail?id="+r+"&rf="+o.question_id}),!1;s.default.errorToast("内容不存在")}}).catch(function(t){console.log("请求失败，可以在这里写处理代码",t)})}else s.default.errorToast("ID有误")},intGetList:function(){this.reload=!0,this.last_id=0,this.page=0,this.isLastPage=!1,this.getQuestionAnswer()},getQuestionAnswer:function(){var e=this,o=this.question_id;if(o>0){var n={},i=this.userInfo,a=this.page+1;if(n.page=a,n.question_id=o,n.sort_key=this.sort_key,n.access_token=i.access_token?i.access_token:"",this.isLastPage)return t.stopPullDownRefresh(),this.isLoad=!0,s.default.showToast("没有更多回答了...."),!1;this.$api.getQuestionAnswer(n).then(function(t){e.isLoad=!1,e.page=a;var o=t.data.rsm.list;e.answer_count=t.data.rsm.answer_count,o.length>0?(e.listData=e.reload?o:e.listData.concat(o),console.log("listData",e.listData),e.reload=!1,o.length<10&&(e.isLoad=!0,e.isLastPage=!0)):(e.isLoad=!0,e.isLastPage=!0),o.length<1&&(e.footerTips="暂无回答")}).catch(function(t){console.log("请求失败，可以在这里写处理代码",t)})}else s.default.errorToast("动态ID错误")},AnswerFormSubmit:function(e){var o=this,n=this.system_config;if(!n||"Y"==n.system_verify)return s.default.errorToast("小程序端暂不支持回复功能"),!1;console.log("AnswerFormSubmit",e);var i=e.detail.value.answer_content;if(!i||""==i)return s.default.errorToast("回答内容不能为空"),!1;var a=this.userInfo;if(a.uid<1||!this.hasLogin)return this.toLogin(),!1;var r=this.post_anonymous?1:0,u={};u.access_token=a.access_token,u.question_id=this.question_id,u.answer_content=i,u.anonymous=r,u.attach_access_key="",u.auto_focus=1,this.$api.post_answer(u).then(function(e){var n=e.data.rsm.answer_id;n>0?t.redirectTo({url:"../question/detail?id="+o.question_id}):s.default.errorToast("系统异常，请返回")}).catch(function(t){console.log("提交回答失败",t)})}}};e.default=u}).call(this,o("543d")["default"])},ab97:function(t,e,o){"use strict";o.r(e);var n=o("2d64"),s=o("920f");for(var i in s)"default"!==i&&function(t){o.d(e,t,function(){return s[t]})}(i);o("5f82");var a=o("2877"),r=Object(a["a"])(s["default"],n["a"],n["b"],!1,null,null,null);e["default"]=r.exports},b43e:function(t,e,o){},baa5:function(t,e,o){"use strict";(function(t){o("ee7b"),o("921b");n(o("66fd"));var e=n(o("ab97"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,o("543d")["createPage"])}},[["baa5","common/runtime","common/vendor"]]]);