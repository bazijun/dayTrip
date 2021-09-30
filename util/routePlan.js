/* 腾讯地图sdk */
import QQMapWX from './qqMapSDK/qqmap-wx-jssdk'
const qqMap = new QQMapWX({
  key: 'AJBBZ-OKE6X-HCO4Q-ZLXNO-466NH-EXFCR'
})
/* 需求分析 */
/*****

  已隐藏

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
    this.type = routeLineData.type // distance or duration
    this.targetSequence = [] // 优化后的目标序列
    this.index = 1
  }

  async standardMode (start = this.home, targets = this.target) { // 标准模式 <迪杰斯特拉算法(Dijkstra)> => 递归遍历 运算时间为 简单模式的targets.length倍
    console.log(`\n================ ${this.index}   ${this.mode}  《==》  ${this.type}   ================`)
    let routeLine = []
    this.index++
    for (const v of targets) {
      const path = {
        mode: this.mode,
        from: `${start.latitude},${start.longitude}`,
        to: `${v.latitude},${v.longitude}`
      }
      const route = await this.diffDistance(path).catch(() => {})
      routeLine = [...routeLine, { ...v, route: route }]
      console.log(`${route} ===> ${this.type === 'distance' ? '距离' : '耗时'} ===> ${v.name}`)
    }
    const sortTarget = routeLine.sort((a, b) => a.route - b.route) // 排序后的 target 数组
    const mark = sortTarget[0] // 标记点对象 (以排序成功的第一位目标点)
    const noMark = sortTarget.slice(1) // 未标记点数组 (名次不为一的余下目标点)
    this.targetSequence = [...this.targetSequence, mark]
    // console.table(sortTarget)
    if (this.targetSequence.length !== this.target.length) {
      return this.standardMode(mark, noMark)
    } else {
      const targetSequence = this.targetSequence
      this.targetSequence = []
      this.index = 1
      console.log('=====结束=====')
      return targetSequence
    }
  }

  async simpleMode () { // 简单模式 => 只是单纯比较 起点和各目标点的耗时(距离)，然后排序
    let routeLine = []
    console.log(`\n================   ${this.mode}  <==>  ${this.type}   ==============`)
    for (const v of this.target) {
      const path = {
        mode: this.mode,
        from: `${this.home.latitude},${this.home.longitude}`,
        to: `${v.latitude},${v.longitude}`
      }
      const route = await this.diffDistance(path).catch(() => {})
      routeLine = [...routeLine, { ...v, route: route }]
      console.log(`${route}===>${this.type === 'distance' ? '距离' : '耗时'}===>${v.name}`)
    }
    const simpleLine = routeLine.sort((a, b) => a.route - b.route)
    // console.table(simpleLine)
    return simpleLine
  }

  diffDistance (path) { // 两个位置的距离。
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        qqMap.direction({
          sig: 'SE8PZQLXM9vjdVWdsp6TSZdfz4BhVvOI',
          mode: path.mode,
          from: path.from,
          to: path.to,
          success: res => resolve(res.result.routes[0][this.type]),
          fail: err => reject(err)
        })
      }, 201)
    })
  }
}
