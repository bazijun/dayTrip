import Vue from 'vue'
import Vuex from 'vuex'
import { routeStore } from '../util/routeStore'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    vip: false,
    routeStore: routeStore,
    currentRoute: {}
  },
  getters: {
  },
  mutations: {
    SET_VIP (state) {
      state.vip = true
    },
    ADD_ROUTE_STORE (state, payload) {
      let arr = []
      const Store = uni.getStorageSync('store')
      if (Store.length) state.routeStore = Store
      arr = [payload, ...state.routeStore]
      state.routeStore = arr
      uni.setStorageSync('store', arr)
    },
    UPDATE_ROUTE_STORE (state, payload) {
      const Store = uni.getStorageSync('store')
      const { id, home, target } = payload
      if (Store.length) state.routeStore = Store
      const index = state.routeStore.findIndex(v => v.id === id)
      state.routeStore[index].home = home
      state.routeStore[index].target = target
      uni.setStorageSync('store', state.routeStore)
    },
    DELETE_ROUTE_STORE (state, index) {
      const Store = uni.getStorageSync('store')
      if (Store.length) state.routeStore = Store
      state.routeStore.splice(index, 1)
      uni.setStorageSync('store', state.routeStore)
    },
    LOAD_ROUTE_STORE (state) {
      const Store = uni.getStorageSync('store')
      if (Store.length) state.routeStore = Store
      uni.setStorageSync('store', state.routeStore)
    },
    SET_CURRENT_ROUTE (state, payload) {
      state.currentRoute = payload
    }
  },
  actions: {

  }
})
export default store
