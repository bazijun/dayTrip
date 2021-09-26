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
  },
  /* 单位换算 */
  toKm (m) {
    if (m < 1000) return m + '米'
    if (m % 1000 === 0) return (m / 1000) + '公里'
    if ((m / 1000).toFixed(1).split('.')[1] === '0') return parseInt(m / 1000) + '公里'
    return (m / 1000).toFixed(1) + '公里'
  },
  toTime (m) {
    if (m < 60) return m + '分钟'
    if (m > 60 * 24) return `${parseInt(m / (60 * 24))}天${parseInt(m % (60 * 24) / 60)}小时${m % 60}分钟`
    if (m % 60 === 0) return `${parseInt(m / 60)}小时`
    return `${parseInt(m / 60)}小时${m % 60}分钟`
  }

}
