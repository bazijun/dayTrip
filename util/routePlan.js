/* 腾讯地图sdk */
import QQMapWX from './qqMapSDK/qqmap-wx-jssdk'
const qqMap = new QQMapWX({
  key: 'AJBBZ-OKE6X-HCO4Q-ZLXNO-466NH-EXFCR'
})
/* 需求分析 */
/*****
问题1：Home 与 targetList 距离的规划
H => target1 (距离,时间) A
H => target2 (距离,时间) B
H => target3 (距离,时间) C
...
再冒泡排序 A B C
区别不在于home 和 targetList的距离，而在于 target 与 target的距离
*/
export default {

  nextStand () {

  },
  myDirection (data) {
    return new Promise((resolve, reject) => {
      qqMap.direction({
        sig: 'SE8PZQLXM9vjdVWdsp6TSZdfz4BhVvOI',
        mode: data.mode,
        from: data.from,
        to: data.to,
        success: res => resolve(res.result.routes[0]),
        fail: err => reject(err.message)
      })
    })
  }
}
export class RoutePlan {
  constructor (routeLineData) {
    this.home = routeLineData.home
    this.target = routeLineData.target
    this.mode = routeLineData.mode
    this.getFirstStation()
  }

  getFirstStation () {
    let routeLine = []
    this.target.forEach(v => {
      const path = {
        mode: this.mode,
        from: `${this.home.latitude},${this.home.longitude}`,
        to: `${v.latitude},${v.longitude}`
      }
      routeLine = [...routeLine, this.diffDistance(path)]
    })
    const firstLine = routeLine.sort((a, b) => a - b)
    console.log(firstLine, '相聚时间排序')
  }

  diffDistance (path, diff = 'duration') { // 两个位置的距离, 默认使用时间比较， distance 为距离
    qqMap.direction({
      sig: 'SE8PZQLXM9vjdVWdsp6TSZdfz4BhVvOI',
      mode: path.mode,
      from: path.from,
      to: path.to,
      success: res => {
        return res.result.routes[0][diff]
      }
    })
  }
}
