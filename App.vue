<script>
import api from './util/util.js'
import { location2Address } from './util/routePlan.js'
import $store from './store/index.js'
export default {
  onLaunch () {
    this.appUpdate()
    api.mpLocation(this.getHome)
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  methods: {
    // 判断更新
    appUpdate () {
    // 获取小程序更新机制兼容
      if (uni.canIUse('getUpdateManager')) {
        const updateManager = uni.getUpdateManager()
        // 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备，是否重启应用？',
                showCancel: false, // 隐藏取消按钮
                confirmText: '确定更新', // 只保留确定更新按钮
                success: function (ret) {
                  if (ret.confirm) {
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
            // 新版本下载失败
              uni.showModal({
                title: '更新提示',
                content: '新版本下载失败，请重启微信或删除当前小程序，重新搜索打开。'
              })
            })
          }
        })
      } else {
      // 微信版本太低，无法版本更新。
        uni.showModal({
          title: '提示',
          content:
          '当前微信版本过低，可能无法使用最新功能，推荐更新微信版本！'
        })
      }
    },

    // 首次进入应用，获取用户当前位置
    getHome () {
      uni.$emit('initHomeLoading')
      uni
        .getLocation({ type: 'gcj02' })
        .then(async (l) => {
          const payload = await location2Address({
            latitude: l[1].latitude,
            longitude: l[1].longitude
          }).catch((err) => console.log(err))
          uni.$emit('initHomeLocation', {
            errMsg: '定位初始化成功',
            ...payload
          })
          $store.commit('SET_LOCATION_AUTH')
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
