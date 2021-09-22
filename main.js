import App from './App'
import uView from 'uview-ui'
import store from './store'
import Vue from 'vue'

Vue.use(uView)
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
