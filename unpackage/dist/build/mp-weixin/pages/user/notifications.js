(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/user/notifications"],{"1c08":function(t,n,i){},3576:function(t,n,i){"use strict";(function(t){i("ee7b"),i("921b");o(i("66fd"));var n=o(i("fd89"));function o(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,i("543d")["createPage"])},"949a":function(t,n,i){"use strict";var o=function(){var t=this,n=t.$createElement;t._self._c},e=[];i.d(n,"a",function(){return o}),i.d(n,"b",function(){return e})},abea:function(t,n,i){"use strict";i.r(n);var o=i("cacb"),e=i.n(o);for(var a in o)"default"!==a&&function(t){i.d(n,t,function(){return o[t]})}(a);n["default"]=e.a},cacb:function(t,n,i){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=i("2f62"),e=a(i("2e85"));function a(t){return t&&t.__esModule?t:{default:t}}function c(t){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{},o=Object.keys(i);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(i).filter(function(t){return Object.getOwnPropertyDescriptor(i,t).enumerable}))),o.forEach(function(n){s(t,n,i[n])})}return t}function s(t,n,i){return n in t?Object.defineProperty(t,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[n]=i,t}var r={computed:c({},(0,o.mapState)(["hasLogin","userInfo","system_config"])),data:function(){return{tabArr:["我的私信","我的通知"],flag:"notifications",TabCur:0,isBack:!1,reload:!1,isLoad:!0,isLastPage:!1,listData:[],page:-1,notifications_count:0}},onLoad:function(t){},onShow:function(){console.log("onShow"),this.intGetList()},onPullDownRefresh:function(){this.intGetList()},onReachBottom:function(){this.getList()},methods:c({},(0,o.mapMutations)(["login"]),{toRead:function(n,i){var o=this,a={};if(i);else{if(!(n>-1))return e.default.errorToast("系统出错"),!1;var c=this.listData[n];if(console.log("notification",c),1==c.read_flag)return this.clickNotification(c),!1;var s=c.notification_id;a.notification_id=s}var r=this.userInfo;a.access_token=r.access_token?r.access_token:"",this.$api.read_notification(a).then(function(e){console.log("read_notification",e);var a=o.notifications_count;i?a=0:0==o.listData[n].read_flag&&(o.listData[n].read_flag=1,o.notifications_count>0&&(a-=1,t.setTabBarBadge({index:2,text:a.toString()}))),a<1&&t.removeTabBarBadge({index:2}),o.notifications_count=a,r.user_info.notification_unread=a,o.login(r),i?setTimeout(function(){o.intGetList()},1200):o.clickNotification(c)}).catch(function(t){console.log("请求出错了，可以在这里做失败处理",t)})},clickNotification:function(t){if(console.log("clickNotification",t),t){var n=t.model_type,i=t.item_id,o=t.p_user_name;if(i>0||o)switch(n){case 1:this.toQuestion(i);break;case 4:this.topeople(o);break;case 8:this.toArticle(i);break;default:e.default.errorToast("暂不支持查看此类型的内容");break}}},intGetList:function(){this.reload=!0,this.page=-1,this.isLastPage=!1,this.getList()},getList:function(){var n=this,i={};if(this.isLastPage)return t.stopPullDownRefresh(),this.isLoad=!0,e.default.showToast("没有更多内容了...."),!1;var o=this.page+1;i.page=o,i.flag="";var a=this.userInfo;i.access_token=a.access_token?a.access_token:"",this.$api.load_notifications(i).then(function(i){console.log("load_notifications",i),n.page=o,n.isLoad=!1;var c=i.data.rsm.list;console.log("list",c),c.length>0?(n.listData=n.reload?c:n.listData.concat(c),n.reload=!1,c.length<10&&(n.isLoad=!0,n.isLastPage=!0),a.user_info.notification_unread>0&&(n.notifications_count=a.user_info.notification_unread,t.setTabBarBadge({index:2,text:n.notifications_count.toString()}))):(n.isLoad=!0,n.isLastPage=!0,0==o&&(n.listData=[],e.default.errorToast("暂无通知消息"))),c.length<1&&(n.footerTips="暂无数据")}).catch(function(t){console.log("请求出错了，可以在这里做失败处理",t)})},toInbox:function(){t.navigateTo({url:"/pages/inbox/inbox"})},toLogin:function(){t.navigateTo({url:"/pages/account/login"})},topeople:function(n){if(!n)return!1;t.navigateTo({url:"/pages/people/people?uid="+n})},toQuestion:function(n){if(!n||n<1)return!1;t.navigateTo({url:"/pages/question/detail?id="+n})},toArticle:function(n){if(!n||n<1)return!1;t.navigateTo({url:"/pages/article/detail?id="+n})}})};n.default=r}).call(this,i("543d")["default"])},fd89:function(t,n,i){"use strict";i.r(n);var o=i("949a"),e=i("abea");for(var a in e)"default"!==a&&function(t){i.d(n,t,function(){return e[t]})}(a);i("ffcf");var c=i("2877"),s=Object(c["a"])(e["default"],o["a"],o["b"],!1,null,null,null);n["default"]=s.exports},ffcf:function(t,n,i){"use strict";var o=i("1c08"),e=i.n(o);e.a}},[["3576","common/runtime","common/vendor"]]]);