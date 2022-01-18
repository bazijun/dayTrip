<template>
  <view class="map-container">
    <map
      id="tripMap"
      class="tripMap"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :scale="scale"
      :polyline="polyline"
      @markertap="navigation"
      @callouttap="navigation"
      :enable-satellite="satellite"
      enable-traffic
      show-compass
      show-location
    >
      <view class="map-control">
        <button class="map-control-item" @click="setIncludePoints">
          <u-icon name="reload" size="40" color="#2B2B2B"></u-icon>
        </button>
        <button
          class="map-control-item"
          @click="markerCallout = !markerCallout"
        >
          <u-icon
            :name="markerCallout ? 'tags-fill' : 'tags'"
            :color="markerCallout ? '#2B2B2B' : '#818181'"
            size="40"
          ></u-icon>
        </button>
        <button class="map-control-item" @click="satellite = !satellite">
          <u-icon
            :name="satellite ? 'photo-fill' : 'photo'"
            :color="satellite ? '#2B2B2B' : '#818181'"
            size="40"
          ></u-icon>
        </button>
        <button class="map-control-item" @click="scaleMinus">
          <u-icon name="minus" size="40" color="#2B2B2B"></u-icon>
        </button>
        <button class="map-control-item" @click="scalePlus">
          <u-icon name="plus" size="40" color="#2B2B2B"></u-icon>
        </button>
      </view>
    </map>
    <!-- 地址详情 -->
    <u-popup v-model="detailShow" mode="bottom" height="30%"  closeable border-radius="14">
      <view class="location-detail">
        <view>
          <view class="t-name width-xl text-line-one">
            <text :class="'text-' +  currentDetail.color + ' text-margin-r'">
              {{currentDetail.title}}
            </text>
              {{currentDetail.name}}
          </view>
          <view class="t-address width-xl text-line-one">
            <text class="text-l-bold">详细地址：</text>{{currentDetail.address}}
          </view>
        </view>
        <view>
          <view class="margin-bottom" v-if="currentDetail.index">
            <text class="t-address text-l-bold">距上个目标：</text>
             {{mode2Emoji[mode]}}{{currentDetail.route}}
             <text class="text-margin-l15">{{' 🕒 '+ currentDetail.duration}}</text>
          </view>
          <view class="margin-bottom" v-else>
            <text class="t-address text-l-bold">总里程：</text>
           {{mode2Emoji[mode]}}{{sumDistance}}
            <text class="text-margin-l15">{{' 🕒 '+ sumDuration}}</text>
          </view>
          <u-button type="primary" plain ripple @click="navigationTo">
            <u-icon name="map-fill" color="#1F82FF"></u-icon>导航
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
/*
  map 控件：
    scale放大缩小，重置画面包含所有标点，隐藏气泡
*/
import { routePlanPluginView } from '../../util/routePlan'
import api from '../../util/util'

export default {
  props: {
    home: {
      type: Object,
      default: () => {}
    },
    target: {
      type: Array,
      default: () => []
    },
    roadMounted: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.mapCtx = uni.createMapContext('tripMap', this)
    this.setIncludePoints()
  },

  beforeDestroy () {
    this.mapCtx = null
  },

  data () {
    return {
      mapCtx: null,
      satellite: false,
      markerCallout: true,
      scale: 16,
      detailShow: false,
      currentDetail: {},
      mode2Emoji: {
        driving: '🚕 ',
        bicycling: '🚲 ',
        walking: '🚶‍♂️ ',
        transit: '🚌 '
      },
      T: {
        0: '起点：',
        1: '目标一：',
        2: '目标二：',
        3: '目标三：',
        4: '目标四：',
        5: '目标五：',
        6: '目标六：',
        7: '目标七：',
        8: '目标八：',
        9: '目标九：',
        10: '目标十：'
      }

    }
  },

  computed: {
    latitude () {
      return this.home?.latitude
    },

    longitude () {
      return this.home?.longitude
    },

    points () {
      const points = [this.home, ...this.target]
      return points?.map((v) => {
        return {
          latitude: v.latitude,
          longitude: v.longitude
        }
      })
    },

    sumDistance () {
      const distanceList = this.target?.map(v => v.route)
      return api.toKm(distanceList.reduce((pre, val) => pre + val, 0))
    },

    sumDuration () {
      const durationList = this.target?.map(v => v.duration)
      return api.toTime(durationList.reduce((pre, val) => pre + val, 0))
    },

    markers () {
      if (!this.roadMounted) return []
      const markers = [this.home, ...this.target]
      const getterMarkers = markers?.map((v, i) => {
        const index = i ? (i < markers.length - 1 ? i : 'end') : 'start'
        // const zIndex = 50 - i
        return {
          id: i,
          name: v.name,
          latitude: v.latitude,
          longitude: v.longitude,
          route: api.toKm(v.route) || undefined,
          duration: api.toTime(v.duration) || undefined,
          address: v.address,
          iconPath: `/static/icon/map/${index}.png`,
          width: ['end', 'start'].includes(index) ? 30 : 20,
          height: ['end', 'start'].includes(index) ? 30 : 20,
          // zIndex: index === 'start' ? 99 : index === 'end' ? 98 : zIndex, // uniApp-map暂无 zIndex属性
          callout: {
            display: 'ALWAYS',
            content:
              v.name?.length > 10 ? v.name.substring(0, 10) + '...' : v.name,
            borderRadius: 10,
            fontSize: 13,
            borderColor: '#fff',
            borderWidth: 1,
            bgColor:
              index === 'start'
                ? '#1296DB'
                : index === 'end'
                  ? '#FF6732'
                  : this.satellite
                    ? '#fff'
                    : '#00C562',
            color: ['end', 'start'].includes(index)
              ? '#fff'
              : this.satellite
                ? '#1A1A1A'
                : '#fff',
            padding: 6
          }
        }
      })
      if (this.markerCallout) return getterMarkers
      return getterMarkers.map((v) => {
        const { callout, ...payload } = v
        return payload
      })
    },

    polyline () {
      if (!this.roadMounted) return []
      return this.target?.map((v) => {
        return {
          points: v.polyline?.length <= 1 ? [] : v.polyline,
          width: 10,
          arrowLine: true,
          borderWidth: 1,
          color: '#1F82FF',
          borderColor: '#F1FCFC'
        }
      })
    },
    // 通过 改变scale实现：缩放视野以包含所有给定的坐标点, 用以解决uni-app-APP端 include-points无效
    getterScale () {
      const centralPoint = []
      centralPoint[0] = this.latitude
      centralPoint[1] = this.longitude
      const obj = {
        centralPoint: [this.latitude, this.longitude],
        otherPoint: this.points
      }
      return this.furthest(obj)
    }
  },

  methods: {
    setIncludePoints () {
      this.mapCtx.includePoints({
        points: this.points,
        padding: [100, 100, 90, 100]
      })
    },

    scaleMinus () {
      if (this.scale === 3) return
      this.mapCtx.getScale({
        success: (res) => {
          const val = res.scale - 1
          this.scale = val < 3 ? 3 : val
          console.log(res.scale, this.scale)
        },
        fail: (err) => console.log(err)
      })
    },

    scalePlus () {
      if (this.scale === 20) return
      this.mapCtx.getScale({
        success: (res) => {
          const val = res.scale + 1
          this.scale = val > 20 ? 20 : val
          console.log(res.scale, this.scale)
        },
        fail: (err) => console.log(err)
      })
    },

    navigation ({ markerId }) {
      this.detailShow = true
      const currentDetail = this.markers?.find((v) => v.id === markerId)
      const index = this.markers.findIndex(v => v.id === markerId)
      const title = (this.markers.length - 1) === index ? '终点站：' : this.T[index]
      this.currentDetail = {
        ...currentDetail,
        color: index === 0 ? 'primary' : (this.markers.length - 1) === index ? 'warning' : 'success',
        title,
        index
      }
    },

    navigationTo () {
      const endPoint = {
        name: this.currentDetail.name,
        latitude: this.currentDetail.latitude,
        longitude: this.currentDetail.longitude
      }
      routePlanPluginView(endPoint)
    },

    // 辅助 scale 版本的include-points实现：使用当前点和其余标点计算出缩放比例。
    furthest (obj) {
      var EARTH_RADIUS = 6378137.0 // 单位M
      var PI = Math.PI
      // 转为角度
      function getRad (d) {
        return (d * PI) / 180.0
      }

      const distance = {
        // 将地球按照圆形计算
        getGreatCircle: function (coordinate1, coordinate2) {
          var lat1 = coordinate1[0] // 纬度
          var lat2 = coordinate2[0]
          var lng1 = coordinate1[1] // 经度
          var lng2 = coordinate2[1]

          var radLat1 = getRad(lat1)
          var radLat2 = getRad(lat2)

          var a = radLat1 - radLat2
          var b = getRad(lng1) - getRad(lng2)

          var s =
            2 *
            Math.asin(
              Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) +
                  Math.cos(radLat1) *
                    Math.cos(radLat2) *
                    Math.pow(Math.sin(b / 2), 2)
              )
            )
          s = s * EARTH_RADIUS
          s = Math.round(s * 10000) / 10000.0

          return s
        },

        // 将地球按照椭圆进行计算
        getFlattern: function (coordinate1, coordinate2) {
          var lat1 = coordinate1[0] // 纬度
          var lat2 = coordinate2[0]
          var lng1 = coordinate1[1] // 经度
          var lng2 = coordinate2[1]

          var f = getRad((lat1 + lat2) / 2)
          var g = getRad((lat1 - lat2) / 2)
          var l = getRad((lng1 - lng2) / 2)

          var sg = Math.sin(g)
          var sl = Math.sin(l)
          var sf = Math.sin(f)

          var s, c, w, r, d, h1, h2
          var a = EARTH_RADIUS
          var fl = 1 / 298.257

          sg = sg * sg
          sl = sl * sl
          sf = sf * sf

          s = sg * (1 - sl) + (1 - sf) * sl
          c = (1 - sg) * (1 - sl) + sf * sl

          w = Math.atan(Math.sqrt(s / c))
          r = Math.sqrt(s * c) / w
          d = 2 * w * a
          h1 = (3 * r - 1) / 2 / c
          h2 = (3 * r + 1) / 2 / s

          return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
        }
      }

      // obj包含中心点坐标和其他所有的坐标位置
      // 处理obj传入的参数
      const centralPoint = obj.centralPoint // 中心点
      const otherPoint = obj.otherPoint // 二维数组存放其他坐标点

      // 循环遍历得出距离最远的1个坐标然后*2
      let farthestCoordinate = [] // 当前最远坐标
      let farthestDistance = 0 // 最远距离
      let dis = null // 存储当前距离
      console.log(farthestCoordinate)
      for (const i in otherPoint) {
        const newLocation = []
        newLocation[0] = otherPoint[i].latitude
        newLocation[1] = otherPoint[i].longitude

        dis = distance.getGreatCircle(centralPoint, newLocation)
        if (dis > farthestDistance) {
          farthestDistance = dis
          farthestCoordinate = newLocation
        }
      }

      farthestDistance = farthestDistance / 1000 // 转为km

      // 根据坐标计算出合理的比例尺寸
      const surface = [
        500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02
      ]

      for (const i in surface) {
        if (farthestDistance > surface[i]) {
          const scale = 5 + Number(i)
          return scale
        }
      }

      return 16
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
}
.tripMap {
  width: 100%;
  height: calc(100vh - 165rpx);
  position: relative;
}
.map-control {
  width: 90rpx;
  position: absolute;
  right: 20rpx;
  bottom: 80rpx;
  z-index: 99;
  .map-control-item {
    width: 90rpx;
    height: 90rpx;
    background: #fff;
    margin-top: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.location-detail {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 40rpx;
}
</style>
