(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["common/main"],{1614:function(e,n,t){"use strict";t.r(n);var o=t("fbea");for(var r in o)"default"!==r&&function(e){t.d(n,e,function(){return o[e]})}(r);t("b10e");var u,a,c=t("2877"),i=Object(c["a"])(o["default"],u,a,!1,null,null,null);n["default"]=i.exports},3143:function(e,n,t){},b10e:function(e,n,t){"use strict";var o=t("3143"),r=t.n(o);r.a},cab3:function(e,n,t){"use strict";(function(e){t("ee7b"),t("921b");t("2f62");var n=a(t("66fd")),o=a(t("1614")),r=a(t("9cf7")),u=a(t("cf67"));function a(e){return e&&e.__esModule?e:{default:e}}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},o=Object.keys(t);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(n){i(e,n,t[n])})}return e}function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}n.default.prototype.$api=r.default,n.default.prototype.$store=u.default;var f=function(){return t.e("components/xmz/xmz-pagetips").then(t.bind(null,"58a1"))};n.default.component("pageTips",f);var l=function(){return t.e("components/wc/wc-card").then(t.bind(null,"4e82"))};n.default.component("wcCard",l);var s=function(){return t.e("components/wc/wc-article").then(t.bind(null,"d1e3"))};n.default.component("wcArticle",s);var d=function(){return Promise.all([t.e("common/vendor"),t.e("components/gaoyia-parse/parse")]).then(t.bind(null,"aabf"))};n.default.component("uParse",d),n.default.config.productionTip=!1,o.default.mpType="app";var p=new n.default(c({store:u.default},o.default));e(p).$mount()}).call(this,t("543d")["createApp"])},dc30:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=t("2f62"),r=u(t("8efc"));function u(e){return e&&e.__esModule?e:{default:e}}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},o=Object.keys(t);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(n){c(e,n,t[n])})}return e}function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var i={computed:a({},(0,o.mapState)(["hasLogin","userInfo"])),onLaunch:function(){var e=r.default.get("userInfo");e?(console.log("userInfo",e),this.checkUserToken(e)):this.checkUserToken(!1)},onShow:function(){},onHide:function(){},methods:a({},(0,o.mapMutations)(["login","logout","config"]),{checkUserToken:function(n){var t=this,o={};n?(o.uid=n.uid,o.access_token=n.access_token):(o.uid=0,o.access_token=""),this.$api.checkUserToken(o).then(function(n){if(n){var o=n.data.rsm.userInfo;if(o&&o.uid>0){var u=n.data.rsm.signature_token;u&&r.default.put("signature_token",u),t.login(o)}else t.logout();var a=n.data.rsm.system_config;if(a&&t.config(a),o.user_info&&o.user_info.notification_unread){var c=o.user_info.notification_unread;c>0&&e.setTabBarBadge({index:2,text:c.toString()})}else if(o.user_info){var i=o.user_info.inbox_unread;i&&i>0&&e.setTabBarBadge({index:2,text:i.toString()})}}}).catch(function(e){t.logout(),console.log("err.data",e)})}})};n.default=i}).call(this,t("543d")["default"])},fbea:function(e,n,t){"use strict";t.r(n);var o=t("dc30"),r=t.n(o);for(var u in o)"default"!==u&&function(e){t.d(n,e,function(){return o[e]})}(u);n["default"]=r.a}},[["cab3","common/runtime","common/vendor"]]]);