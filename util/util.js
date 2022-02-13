
export default {

  homeInitialValue: null,

  mpLocation (callback) { // 初次位置授权
    uni.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
        // 用户位置授权
          uni.authorize({
            scope: 'scope.userLocation',
            success () {
              console.log('允许了')
              callback && callback()
            }
          })
        } else {
          callback && callback()
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  // TODO: 用户点快了，会多次调用此方法。
  mpOptionLocation (callback) { // 拒绝第一次系统授权后，必须用户手动开启位置授权了。
    console.log('mpOptionLocation-被调用乐')
    uni.getSetting({
      success: function (res) {
        const status = res.authSetting
        if (!status['scope.userLocation']) {
          uni.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.confirm) {
                uni.openSetting({
                  success: function (data) {
                    if (data.authSetting['scope.userLocation'] === true) {
                      uni.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      callback && callback()
                      // 授权成功之后，再调用chooseLocation选择地方
                      // uni.chooseLocation({
                      //   success: function (res) {
                      //     obj.setData({
                      //       addr: res.address
                      //     })
                      //   }
                      // })
                    } else {
                      uni.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
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

  // 传入的分钟数  转换成天、时、分
  toTime (StatusMinute) {
    var day = parseInt(StatusMinute / 60 / 24)
    var hour = parseInt(StatusMinute / 60 % 24)
    var min = parseInt(StatusMinute % 60)
    StatusMinute = ''
    if (day > 0) {
      StatusMinute = day + '天'
    }
    if (hour > 0) {
      StatusMinute += hour + '小时'
    }
    if (min > 0) {
      StatusMinute += parseFloat(min) + '分钟'
    }
    return StatusMinute || '627光年'
  },

  /**
 * @description 节流
 * @param fn  传入的回调
 * @param wait 间隔多少s执行
 * @immediate 是否立即执行还是
*/
  debounce (fn, wait, immediate = true) {
    let timer = null
    let res
    const debounceObj = function () {
      const _this = this
      const args = arguments
      clearTimeout(timer)
      // 立即执行
      if (immediate) {
        const callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        // 立即执行
        if (callNow) {
          res = fn.call(_this, ...args)
        }
        // 等待wait 以后才执行
      } else {
        timer = setTimeout(() => {
          fn.call(_this, ...args)
        }, wait)
      }
      return res
    }
    return debounceObj
  }

}
