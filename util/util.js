/* 腾讯地图sdk */
import QQMapWX from './qqMapSDK/qqmap-wx-jssdk'
const qqMap = new QQMapWX({
  key: 'AJBBZ-OKE6X-HCO4Q-ZLXNO-466NH-EXFCR'
})
console.log(qqMap)
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