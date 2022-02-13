// 腾讯地图sdk
import QQMapWX from './qqMapSDK/qqmap-wx-jssdk'
const qqMap = new QQMapWX({
  key: 'AJBBZ-OKE6X-HCO4Q-ZLXNO-466NH-EXFCR'
})

/** TODO --
 *
#使用建议
  1.不推荐 目标地之间距离太近，至少因当大于500米。若目标之间距离小于500米，请不要使用公交地铁进行行程规划了。（后续会进行优化）
  2.（待商榷）无论何种出行方式，都推荐使用[驾车]模式进行路线规划，然后通过点击[坐标点]再自由选择出行方式。

=新增
 1. ✅（以更好的方式解决了）只按距离排序后，每个点与点之间才进行交通工具选择；或根据所隔 距离智能推荐。
 2. 总距离和耗时，每点之间耗时距离。
 3. ✅ 修改滑动图标，使其更加具有用户引导性
 4. ui改动， 以及动画
 5. 自动定位起点(√)，初进入获取当前定位loading
=移除
 1.  取消 新建路线功能
=BUG

=优化
    1.贪婪算法，可以强制切换行程方式，强制取消订阅
    2.公交如何距离太近调用计算 相聚位置接口算距离。或者推荐 走路 或 骑行
    3. 驾车路线规划时，有路线相聚小于500米。就关闭公交地铁选择框。

=预计
    1.更详细的地图选点,
    2.对标点太近时，进行深度优化，太近时，调用距离计算接口，直接排序。或者再进行路线规划前就进行拦截。
      解决方案：
        1.新加页面，只算距离，相聚都大于某米时，才放行
        2.或就用简单经纬度算法。每次 添加坐标时都模糊计算哈，检查到太近，阻止添加。或者设置某阈值，
        不弹窗，但会再路线规划页面，禁用对应功能。
    3. 未来：
      混合模式，使用可自定义。多少m内选择某种交通工具
    4. 百分百弹窗

-- TODO **/

export class RoutePlan {
  constructor (routeLineData) {
    this.initApp()
    this.home = routeLineData.home
    this.target = routeLineData.target
    this.mode = routeLineData.mode
  }

  initApp () {
    this.frame = 1
    this.index = 1
    this.run = true // 整个应用的启动状态
    this.requestAbort = true // 单个请求是否发送结束
    this.targetSequence = [] // 优化后的目标序列
  }

  setMode (val) {
    this.mode = val
  }

  unSubscribe () {
    // this.run && qqMap.unRequestDirection()
    this.run = false
  }

  // 标准模式 <迪杰斯特拉算法(Dijkstra)> => 递归遍历 运算时间为 简单模式的targets.length倍
  async standardMode (start = this.home, targets = this.target) {
    if (!this.run) {
      console.log('💥over💥')
      // 1.当切换过快时，会出现 执行unSubscribe 引发的initApp()调用后，立即又再执行了 unSubscribe。导致 run 一直为 false,应用卡死。
      // 2.必须要在路线规划没有计算完成(this.roadMounted = false) && 有某个请求正在请求中时(this.RLD.requestAbort = false) 调用 unSubscribe
      this.initApp()
      uni.$emit('indexChange', this.frame)
      return
    }
    console.log(`⭐ 第${this.index}轮； 起点 ➡ ${start.name}`)
    let routeLine = []
    this.index++
    for (const v of targets) {
      const path = {
        mode: this.mode,
        from: `${start.latitude},${start.longitude}`,
        to: `${v.latitude},${v.longitude}`
      }
      // const distance = this.distance(path)
      const { route, duration, polyline, error } = await this.diffDistance(path).catch(() => { })
      this.requestAbort = true
      if (error) {
        this.initApp()
        uni.$emit('indexChange', this.frame)
        return { ...error }
      } else {
        routeLine = [...routeLine, { ...v, mode: this.mode, route, duration, polyline }]
      }
      this.frame++
      uni.$emit('indexChange', this.frame)
      // console.log(`🚀 ${this.frame}. ${start.name} ➡ ${v.name}: 云距离/耗时 ➡ ${route}m / ${duration}分 ； 本地距离 ➡ ${distance}m`)
    }
    const sortTarget = routeLine.sort((a, b) => a.route - b.route) // 排序后的 target 数组
    const mark = sortTarget[0] // 标记点对象 (以排序成功的第一位目标点)
    const noMark = sortTarget.slice(1) // 未标记点数组 (名次不为一的余下目标点)
    this.targetSequence = [...this.targetSequence, mark]
    if (this.targetSequence.length !== this.target.length) {
      return this.standardMode(mark, noMark)
    } else {
      const targetSequence = this.targetSequence
      this.initApp()
      setTimeout(() => uni.$emit('indexChange', this.frame), 0)
      console.log('✅完成✅', targetSequence)
      return targetSequence
    }
  }

  // 简单模式 => 只是单纯比较 起点和各目标点的耗时(距离)，然后排序
  async simpleMode () {
    let routeLine = []
    console.log(`\n 🔵 == ${this.mode}`)
    for (const v of this.target) {
      const path = {
        mode: this.mode,
        from: `${this.home.latitude},${this.home.longitude}`,
        to: `${v.latitude},${v.longitude}`
      }
      const { route, polyline } = await this.diffDistance(path).catch(() => { })
      routeLine = [...routeLine, { ...v, route, polyline }]
      console.log(`🚀 ${route}=>距离=>${v.name}`)
    }
    const simpleLine = routeLine.sort((a, b) => a.route - b.route)
    return simpleLine
  }

  // 两个位置的距离 (云计算)
  diffDistance (path) {
    if (!this.requestAbort) return
    this.requestAbort = false
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
                for (let j = 2; j < coors[i]?.length; j++) {
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
              route: res.result.routes[0].distance,
              duration: res.result.routes[0].duration,
              polyline
            })
          },
          fail: err => {
            const error = { ...err }
            error?.status !== 1000 && resolve({ error })
            console.log('⭕ 路线规划错误', err)
            reject(err)
          }
        })
      }, 201)
    })
  }

  // 两个位置的距离 (本地计算)
  distance (path) {
    const [la1, lo1] = path?.from?.split(',')
    const [la2, lo2] = path?.to?.split(',')
    const La1 = la1 * Math.PI / 180.0
    const La2 = la2 * Math.PI / 180.0
    const La3 = La1 - La2
    const Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)))
    s = s * 6378.137
    s = Math.round(s * 10000) / 10000
    s = s.toFixed(2)
    return s * 1000
  }
}

// 路线规划插件调用
export const routePlanPluginView = (endPoint, startPoint) => {
  requirePlugin('routePlan')
  const key = 'AJBBZ-OKE6X-HCO4Q-ZLXNO-466NH-EXFCR'
  const referer = 'dayTrip'
  const start = startPoint ? `&startPoint=${JSON.stringify(startPoint)}` : ''
  uni.navigateTo({
    url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + JSON.stringify(endPoint) + '&navigation=1' + start
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
