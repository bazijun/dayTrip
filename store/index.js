import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    vip: false,
    routeStore: [
      {
        id: 1,
        name: '图书路线',
        home: {

        },
        target: [

        ]
      }
    ]
  },
  getters: {
  },
  mutations: {
    SET_VIP (state) {
      state.vip = true
    },
    ADD_ROUTE_STORE (state, payload) {
      let arr = []
      arr = [payload, ...state.routeStore]
      state.routeStore = arr
      uni.setStorageSync('store', arr)
    }
  },
  actions: {

  }
})
export default store
