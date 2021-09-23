import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    vip: false
  },
  getters: {
  },
  mutations: {
    SET_VIP (state) {
      state.vip = true
    }
  },
  actions: {

  }
})
export default store
