(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/gaoyia-parse/components/wxParseTemplate2"],{"13d1":function(e,n,t){"use strict";t.r(n);var a=t("d90a"),o=t.n(a);for(var r in a)"default"!==r&&function(e){t.d(n,e,function(){return a[e]})}(r);n["default"]=o.a},"6c52":function(e,n,t){"use strict";var a=function(){var e=this,n=e.$createElement;e._self._c},o=[];t.d(n,"a",function(){return a}),t.d(n,"b",function(){return o})},b4ce:function(e,n,t){"use strict";t.r(n);var a=t("6c52"),o=t("13d1");for(var r in o)"default"!==r&&function(e){t.d(n,e,function(){return o[e]})}(r);var u=t("2877"),s=Object(u["a"])(o["default"],a["a"],a["b"],!1,null,null,null);n["default"]=s.exports},d90a:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=function(){return t.e("components/gaoyia-parse/components/wxParseTemplate3").then(t.bind(null,"3185"))},o=function(){return t.e("components/gaoyia-parse/components/wxParseImg").then(t.bind(null,"fab3"))},r=function(){return t.e("components/gaoyia-parse/components/wxParseVideo").then(t.bind(null,"1429"))},u=function(){return t.e("components/gaoyia-parse/components/wxParseAudio").then(t.bind(null,"6bb3"))},s=function(){return t.e("components/gaoyia-parse/components/wxParseTable").then(t.bind(null,"cf28"))},i={name:"wxParseTemplate2",props:{node:{}},components:{wxParseTemplate:a,wxParseImg:o,wxParseVideo:r,wxParseAudio:u,wxParseTable:s},methods:{wxParseATap:function(e){var n=e.currentTarget.dataset.href;if(n){var t=this.$parent;while(!t.preview||"function"!==typeof t.preview)t=t.$parent;t.navigate(n,e)}}}};n.default=i}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/gaoyia-parse/components/wxParseTemplate2-create-component',
    {
        'components/gaoyia-parse/components/wxParseTemplate2-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("b4ce"))
        })
    },
    [['components/gaoyia-parse/components/wxParseTemplate2-create-component']]
]);                