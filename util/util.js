export default {
  mpLocation () { // 初次位置授权
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
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  mpOptionLocation () { // 拒绝第一次系统授权后，必须用户手动开启位置授权了。
    // #ifdef MP
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
    // #endif
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
