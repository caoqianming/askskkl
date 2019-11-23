import Vue from 'vue'
import Vuex from 'vuex'
import wCachae from 'utils/wCache.js';
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		userInfo: {},
		hasLogin: false,
		system_config:{},
    },
    mutations: {
        login(state, provider) {
			console.log('store userInfo',provider)
			state.userInfo = provider
            state.hasLogin = true
			// state.forcedLogin = provider.forcedLogin;
            // uni.setStorage({//将用户信息保存在本地  
            //     key: 'userInfo',  
            //     data: provider  
            // })
			wCachae.put('userInfo',provider)
        },
        config(state, provider) {
			console.log('store system_config',provider)
			state.system_config = provider
        },		
        logout(state) {
			console.log('store logout')
			state.userInfo = {}
			state.hasLogin = false;
			// forcedLogin = false;
            // uni.removeStorage({  
            //     key: 'userInfo'  
            // }) 
			wCachae.remove('userInfo')			
        }
    }
})

export default store
