(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/index"],{"431d":function(t,e,a){"use strict";a.r(e);var n=a("4ce7"),i=a.n(n);for(var o in n)"default"!==o&&function(t){a.d(e,t,function(){return n[t]})}(o);e["default"]=i.a},"4ce7":function(t,e,a){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a("2f62"),i=o(a("2e85"));function o(t){return t&&t.__esModule?t:{default:t}}function r(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},n=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter(function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable}))),n.forEach(function(e){s(t,e,a[e])})}return t}function s(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var c=function(){return a.e("components/xmz/xmz-publishbotton").then(a.bind(null,"f396"))},u={components:{publish:c},computed:r({},(0,n.mapState)(["userInfo","hasLogin","system_config"])),data:function(){return{searchKeyword:"",tabArr:["推荐","最新","最热"],category_list:[],category_id:0,isCard:!0,isBack:!1,isLoad:!0,listData:[],page:0,res_count:0,TabCur:1,sort_type:1}},onLoad:function(t){this.getList()},onPullDownRefresh:function(){this.intGetList()},onReachBottom:function(){this.getList()},onShareAppMessage:function(t){return"button"===t.from&&console.log(t.target),{title:"这个小程序有点意思，推荐你看看"}},methods:{exitSearch:function(){this.searchKeyword=""},searchInput:function(){var e=this.searchKeyword?this.searchKeyword:"";e?t.navigateBack({delta:1}):t.navigateTo({url:"../search/index?searchKeyword="+e})},intGetList:function(){this.reload=!0,this.last_id=0,this.page=0,this.isLastPage=!1,this.getList()},getList:function(){var t=this,e={};if(e.sort_type=this.sort_type,e.category_id=this.category_id,e.minId=this.last_id?this.last_id:0,this.last_id>0&&this.isLastPage)return this.isLoad=!0,i.default.showToast("没有更多内容了...."),!1;var a=this.page+1;e.page=a,this.$api.getHome(e).then(function(e){t.page=a,t.isLoad=!1,1==a&&(t.res_count=e.data.rsm.totals,t.category_list=e.data.rsm.category_list);var n=e.data.rsm.list;n.length>0?(t.listData=t.reload?n:t.listData.concat(n),t.last_id=n[n.length-1].id,t.reload=!1,n.length<10&&(t.isLoad=!0,t.isLastPage=!0)):(t.isLoad=!0,t.isLastPage=!0,1==a&&(t.listData=[],t.res_count=0,i.default.errorToast("未找到相关内容"))),n.length<1&&(t.footerTips="暂无数据")}).catch(function(t){console.log("请求出错了，可以在这里做失败处理",t)})},toQuestionDetails:function(e){var a=e.currentTarget.dataset.id;a>0?t.navigateTo({url:"../question/detail?id="+a}):i.default.showToast("id有误")},toArticleDetails:function(e){var a=e.currentTarget.dataset.id;a>0?t.navigateTo({url:"../article/detail?id="+a}):i.default.showToast("有误")},tabSelect:function(t){var e=t.currentTarget.dataset.id;this.TabCur=e,this.sort_type=e,console.log("切换到",this.tabArr[e]),this.intGetList()},categorySelect:function(t){var e=t.currentTarget.dataset.id;this.category_id=e,console.log("切换到",this.category_list[e]),this.intGetList()}}};e.default=u}).call(this,a("543d")["default"])},9341:function(t,e,a){"use strict";(function(t){a("ee7b"),a("921b");n(a("66fd"));var e=n(a("d2a5"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,a("543d")["createPage"])},"93a0":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement;t._self._c},i=[];a.d(e,"a",function(){return n}),a.d(e,"b",function(){return i})},d2a5:function(t,e,a){"use strict";a.r(e);var n=a("93a0"),i=a("431d");for(var o in i)"default"!==o&&function(t){a.d(e,t,function(){return i[t]})}(o);var r=a("2877"),s=Object(r["a"])(i["default"],n["a"],n["b"],!1,null,null,null);e["default"]=s.exports}},[["9341","common/runtime","common/vendor"]]]);