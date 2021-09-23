/* 腾讯地图sdk */
import wx from './qqMapSDK/qqmap-wx-jssdk'
console.log(wx)
export default {
  mpLocation () { // 是否位置授权
    uni.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
        // 用户位置授权
          uni.authorize({
            scope: 'scope.userLocation'
          })
          return false
        } else {
          return true
        }
      }
    })
  }
}
