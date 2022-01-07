<script>
import api from './util/util.js'
import { location2Address } from './util/routePlan.js'
export default {

  onLaunch () {
    api.mpLocation(this.getHome)
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // console.log('App Launch')
  },

  globalData: {
    homeInfo: { a: 1 }
  },

  methods: {
    getHome () { // 获取用户当前位置
      uni.getLocation({ type: 'gcj02' }).then(async (l) => {
        console.log(l[1], 'getLocation')
        const app = await location2Address({
          latitude: l[1].latitude,
          longitude: l[1].longitude
        }).catch(err => console.log(err))
        console.log('当前结果', app)
      })
    }
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
@import "./common.scss";
page {
  background-color: $theme-bg;
  font-family: PingFang SC;
  font-size: 32rpx;
  font-weight: normal;
  color: #222222;
  word-break: break-all;
}
</style>
