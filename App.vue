<script>
import api from './util/util.js'
export default {
  onLaunch: function () {
    const res = api.mpLocation()
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // console.log('App Launch')
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
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
