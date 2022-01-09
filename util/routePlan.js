// 腾讯地图sdk
import QQMapWX from './qqMapSDK/qqmap-wx-jssdk'
const qqMap = new QQMapWX({
  key: 'AJBBZ-OKE6X-HCO4Q-ZLXNO-466NH-EXFCR'
})

/** TODO --
=新增
 1. ✅（以更好的方式解决了）只按距离排序后，每个点与点之间才进行交通工具选择；或根据所隔 距离智能推荐。
 2. 总距离和耗时，每点之间耗时距离。
 3. ✅ 修改滑动图标，使其更加具有用户引导性
 4. ui改动， 以及动画
 5. 自动定位起点(√)，初进入获取当前定位loading
=BUG

=优化
    1.贪婪算法，可以强制切换行程方式，强制取消订阅
    2.公交如何距离太近调用计算 相聚位置接口算距离。或者推荐 走路 或 骑行
=预计

-- TODO **/

export class RoutePlan {
  constructor (routeLineData) {
    this.home = routeLineData.home
    this.target = routeLineData.target
    this.mode = routeLineData.mode
    this.type = routeLineData.type // distance or duration
    this.targetSequence = [] // 优化后的目标序列
    this.index = 1
  }

  // 标准模式 <迪杰斯特拉算法(Dijkstra)> => 递归遍历 运算时间为 简单模式的targets.length倍
  async standardMode (start = this.home, targets = this.target) {
    console.log(`\n================ ${this.index}   ${this.mode}  《==》  ${this.type}   ================`)
    let routeLine = []
    this.index++
    for (const v of targets) {
      const path = {
        mode: this.mode,
        from: `${start.latitude},${start.longitude}`,
        to: `${v.latitude},${v.longitude}`
      }
      const { route, polyline } = await this.diffDistance(path).catch(() => { })
      routeLine = [...routeLine, { ...v, route, polyline }]
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

  // 简单模式 => 只是单纯比较 起点和各目标点的耗时(距离)，然后排序
  async simpleMode () {
    let routeLine = []
    console.log(`\n================   ${this.mode}  <==>  ${this.type}   ==============`)
    for (const v of this.target) {
      const path = {
        mode: this.mode,
        from: `${this.home.latitude},${this.home.longitude}`,
        to: `${v.latitude},${v.longitude}`
      }
      const { route, polyline } = await this.diffDistance(path).catch(() => { })
      routeLine = [...routeLine, { ...v, route, polyline }]
      console.log(`${route}===>${this.type === 'distance' ? '距离' : '耗时'}===>${v.name}`)
    }
    const simpleLine = routeLine.sort((a, b) => a.route - b.route)
    // console.table(simpleLine)
    return simpleLine
  }

  // 两个位置的距离
  diffDistance (path) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        qqMap.direction({
          // sig: 'SE8PZQLXM9vjdVWdsp6TSZdfz4BhVvOI',
          mode: path.mode,
          from: path.from,
          to: path.to,
          success: res => {
            // 解压路线
            const polyline = []
            // 公交路线分段式；
            if (path.mode === 'transit') {
              const ret = res.result?.routes[0]
              const count = ret.steps?.length
              const coors = []
              // 获取各个步骤的polyline
              for (let i = 0; i < count; i++) {
                if (ret.steps[i].mode === 'WALKING' && ret.steps[i].polyline) {
                  coors.push(ret.steps[i].polyline)
                }
                if (ret.steps[i].mode === 'TRANSIT' && ret.steps[i].lines[0].polyline) {
                  coors.push(ret.steps[i].lines[0].polyline)
                }
              }
              // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
              const kr = 1000000
              for (let i = 0; i < coors.length; i++) {
                for (let j = 2; j < coors[i].length; j++) {
                  coors[i][j] = Number(coors[i][j - 2]) + Number(coors[i][j]) / kr
                }
              }
              // 定义新数组，将coors中的数组合并为一个数组

              var coorsArr = []
              for (let i = 0; i < coors.length; i++) {
                coorsArr = coorsArr.concat(coors[i])
              }
              // 将解压后的坐标放入点串数组pl中
              for (let i = 0; i < coorsArr.length; i += 2) {
                polyline.push({ latitude: coorsArr[i], longitude: coorsArr[i + 1] })
              }
            } else {
              // 其余路线都是曲线方式；
              const coors = res.result.routes[0].polyline
              // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
              const kr = 1000000
              for (let i = 2; i < coors.length; i++) {
                coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
              }
              // 将解压后的坐标放入点串数组polyline中
              for (let j = 0; j < coors.length; j += 2) {
                polyline.push({ latitude: coors[j], longitude: coors[j + 1] })
              }
            }
            resolve({
              route: res.result.routes[0][this.type], polyline
            })
          },
          fail: err => reject(err)
        })
      }, 201)
    })
  }
}

// 路线规划插件调用
export const routePlanPluginView = (endPoint, startPoint) => {
  requirePlugin('routePlan')
  const key = 'AJBBZ-OKE6X-HCO4Q-ZLXNO-466NH-EXFCR'
  const referer = 'dayTrip'
  const start = startPoint ? `&startPoint=${JSON.stringify(startPoint)}` : ''
  uni.navigateTo({
    url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + JSON.stringify(endPoint) + start
  })
}

// 逆地理解析，经纬度转位置
export const location2Address = (location) => {
  return new Promise((resolve, reject) => {
    qqMap.reverseGeocoder({
      location: location,
      success: res => {
        const { address, location, formatted_addresses, address_reference } = res.result
        const info = {
          address: address,
          name: address_reference?.landmark_l2?.title || address_reference?.landmark_l1?.title || formatted_addresses.recommend,
          latitude: location.lat,
          longitude: location.lng,
          id: new Date().getTime()
        }
        resolve(info)
        // console.log(res.result, '地址全面')
      },
      fail: err => reject(err)
    })
  })
}

// TEST
export default {
  nextStand () {
  },
  myDirection (data) {
    return new Promise((resolve, reject) => {
      qqMap.direction({
        // sig: 'SE8PZQLXM9vjdVWdsp6TSZdfz4BhVvOI',
        mode: data.mode,
        from: data.from,
        to: data.to,
        success: res => resolve(res.result.routes[0]),
        fail: err => reject(err.message)
      })
    })
  }
}
