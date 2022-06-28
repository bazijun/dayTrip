<template>
  <view>
    <view class="console-box">
      <u-subsection
        :list="tabsList"
        activeColor="#1F82FF"
        inactiveColor="#fff"
        bgColor="#1F82FF"
        :current="tabsCurrent"
        @change="tabsChange"
      ></u-subsection>
      <view class="i-tabs-box">
        <view
          :class="modeTabsCurrent === index ? 'i-tabs-item active' : 'i-tabs-item'"
          v-for="(item, index) in modeTabsList"
          :key="index"
          @click="modeTabsChange(index)"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <view class="time-line-box">
      <view class="loading-box" v-if="errorMsg">
        <image style="width: 350rpx; height: 350rpx" src="/static/location-error.png" mode="widthFix" />
        <view>{{errorMsg}}</view>
      </view>
      <view class="loading-box" v-else-if="!roadMounted">
        <u-line-progress :percent="percent" show-percent striped striped-active active-color="#1F82FF"></u-line-progress>
        <text>请不要切换，玩命计算中... (●'◡'●)</text>
      </view>
      <road-line
        v-show="tabsCurrent && roadMounted && !errorMsg"
        :mode="mode"
        :home="home"
        :target="target"
        :roadMounted="roadMounted"
      ></road-line>
      <road-line-map
        v-show="!tabsCurrent && roadMounted && !errorMsg"
        ref="map"
        :mode="mode"
        :home="home"
        :target="target"
        :roadMounted="roadMounted"
      ></road-line-map>
    </view>
  </view>
</template>

<script>
// import { debounce } from 'lodash'
import { RoutePlan } from '../../util/routePlan'
import RoadLine from '../../components/RoadLine/RoadLine.vue'
import RoadLineMap from '../../components/RoadLineMap/RoadLineMap.vue'
export default {

  data () {
    return {
      home: {},
      target: [],
      currentId: 0,
      frame: 1,
      timer: null,
      mode: 'driving',
      // type: 'distance', // distance | duration
      roadMounted: false,
      errorMsg: null,
      tabsList: ['地图', '路线列表'],
      modeTabsList: [
        { name: '驾车' },
        { name: '骑行' },
        { name: '步行' },
        { name: '公交地铁' }
      ],
      tabsCurrent: 0,
      modeTabsCurrent: 0,
      // routeLineCache: {
      //   // 路线的缓存
      //   driving: {
      //     distance: [],
      //     duration: []
      //   },
      //   bicycling: {
      //     distance: [],
      //     duration: []
      //   },
      //   walking: {
      //     distance: [],
      //     duration: []
      //   },
      //   transit: {
      //     distance: [],
      //     duration: []
      //   }
      // },
      RLD: null // RoutePlan类的实例
    }
  },

  onLoad (option) {
    // const test = uni.getStorageSync('store')
    // this.target = test[0]?.target
    // this.home = test[0]?.home
    const { id, home, target } = JSON.parse(decodeURIComponent(option.list))
    this.currentId = id
    this.home = home
    this.target = target
    this.RLD = new RoutePlan({
      home: this.home,
      target: this.target,
      mode: this.mode
    })
    uni.$on('indexChange', index => {
      this.frame = index
    })
    this.setOrderly(this.mode)
  },

  onUnload () {
    this.RLD.unSubscribe()
    this.RLD = null
    this.clearTimer()
  },

  onHide () {
    this.RLD.unSubscribe()
    this.RLD = null
    this.clearTimer()
  },

  computed: {
    percent () {
      let num = 0
      for (let i = 1; i <= this.target.length; i++) {
        num = num + i
      }
      const percent = parseInt(100 / num)
      return (this.frame - 1) * percent > 100 ? 100 : (this.frame - 1) * percent
    }
  },

  methods: {
    tabsChange (index) {
      this.tabsCurrent = index
    },

    clearTimer () {
      clearInterval(this.timer)
      this.timer = null
    },

    modeTabsChange (index) {
      if (this.modeTabsCurrent === index) return
      const table = ['driving', 'bicycling', 'walking', 'transit']
      this.modeTabsCurrent = index
      const cacheStatus = this.initApp(table[index])
      if (cacheStatus) return
      // 路线规划没有计算完成 && 有某个请求正在请求中时 强制取消应用订阅
      if (!this.roadMounted && !this.RLD.requestAbort) this.RLD.unSubscribe()
      this.roadMounted = false
      this.timer = setInterval(() => {
        console.log('轮询.🎀', this.RLD.run)
        if (this.RLD.run) {
          this.clearTimer()
          this.RLD.setMode(table[index])
          this.setOrderly(table[index])
          console.log('轮询成功.🔮')
        }
      }, 201)
    },

    async setOrderly (mode) {
      const cacheStatus = this.initApp(mode)
      if (cacheStatus) return
      console.time('🕓 总耗时')
      const routeStore = uni.getStorageSync('store')
      const currentRouteInstance = routeStore.find(f => f.id === this.currentId)
      const stand = await this.RLD.standardMode().catch(() => {})
      console.timeEnd('🕓 总耗时')
      if (stand?.status) { // 报错
        this.errorMsg = '路线规划失败：' + stand.message
        currentRouteInstance.cache[mode] = { errorMsg: this.errorMsg }
        this.$store.commit('UPDATE_ROUTE_STORE', currentRouteInstance)
        // this.routeLineCache[mode][this.type] = stand
        this.roadMounted = true
      } else if (stand?.every(v => v?.id) && stand?.length === this.target.length) { // 成功
        // const routeSequence = stand?.map(m => m.id)
        currentRouteInstance.cache[mode] = stand
        this.$store.commit('UPDATE_ROUTE_STORE', currentRouteInstance)
        console.log('[stand]===>🚀', stand)
        this.target = stand
        // this.routeLineCache[mode][this.type] = stand
        this.roadMounted = true
      }
    },

    initApp (mode) { // 应用初始化，并判断是否有缓存
      // this.frame = 1
      this.errorMsg = null
      this.mode = mode
      this.clearTimer()
      const routeStore = uni.getStorageSync('store')
      const { cache: currentRouteInstanceCache } = routeStore.find(f => f.id === this.currentId)
      // 判断是否存在缓存中。缓存中有就不请求了。直接用缓存的排序序列计算
      if (Array.isArray(currentRouteInstanceCache?.[mode]) && currentRouteInstanceCache?.[mode]?.length) {
        // this.target = routeSequence.map(m => currentRouteInstanceTarget.find(f => f.id === m))
        this.target = currentRouteInstanceCache[mode]
        this.roadMounted = true
        return true
      } else if (currentRouteInstanceCache?.[mode]?.errorMsg) { // 错误信息的缓存
        this.errorMsg = currentRouteInstanceCache[mode]?.errorMsg
        this.roadMounted = true
        return true
      } else {
        return false
      }
    }
  },

  components: { RoadLine, RoadLineMap }
}
</script>

<style lang="scss">
.u-subsection{
  border-radius: 0 !important;
  height: 70rpx !important;
}
.u-subsection .u-item .u-item-text {
  text-align: center !important;
  font-size: 45rpx !important;
}
.console-box {
  width: 100%;
  height:150rpx;
  margin: 0 auto 10rpx auto;
  box-shadow: 0px 2px 8px 0px rgba(16, 105, 231, 0.2);
}
.time-line-box {
  width: 740rpx;
  overflow: auto;
  height: calc(100vh - 165rpx);
  margin: auto;
  .loading-box{
    padding: 30vh 30rpx 0 30rpx;
    color: #818181;
    text-align: center;
  }
}
.i-tabs-box {
  width: 100%;
  text-align: center;
  background: #fafcfd;
  display: flex;
  justify-content: space-around;
  align-content: center;
  height: 80rpx;
  .i-tabs-item {
    position: relative;
    width: 20%;
    color: #818181;
    padding: 20rpx 0;
  }
  .active {
    display: flex;
    justify-content: center;
    position: relative;
    width: 20%;
    font-weight: bold;
    color: #1A1A1A;
  }
  .active::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 50%;
    height: 7rpx;
    border-radius: 25%;
    background: $theme-color;
  }
}
</style>
