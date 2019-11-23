import {  
	mapMutations  
} from 'vuex'; 
import Vue from 'vue'
import App from './App'
import api from '@/common/vmeitime-http/wecenter.js'
Vue.prototype.$api = api

import store from './store'  
Vue.prototype.$store = store 

import pageTips from "@/components/xmz/xmz-pagetips.vue"
Vue.component('pageTips',pageTips)

import wcCard from "@/components/wc/wc-card.vue"
Vue.component('wcCard',wcCard)

import wcArticle from "@/components/wc/wc-article.vue"
Vue.component('wcArticle',wcArticle)

// import toPic from "@/components/wc/wc-topic.vue"
// Vue.component('toPic',toPic)

import uParse from '@/components/gaoyia-parse/parse.vue'
Vue.component('uParse',uParse)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})

app.$mount()

 



