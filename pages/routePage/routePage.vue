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
// import api from '../../util/util'
import { RoutePlan } from '../../util/routePlan'
import RoadLine from '../../components/RoadLine/RoadLine.vue'
import RoadLineMap from '../../components/RoadLineMap/RoadLineMap.vue'
export default {

  data () {
    return {
      home: {},
      target: [],
      frame: 1,
      mode: 'driving',
      type: 'distance', // distance | duration
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
      routeLineCache: {
        // 路线的缓存
        driving: {
          distance: [],
          duration: []
        },
        bicycling: {
          distance: [],
          duration: []
        },
        walking: {
          distance: [],
          duration: []
        },
        transit: {
          distance: [],
          duration: []
        }
      },
      RLD: null // RoutePlan类的实例
    }
  },

  onLoad (option) {
    // const test = uni.getStorageSync('store')
    // this.target = test[0]?.target
    // this.home = test[0]?.home
    const { home, target } = JSON.parse(decodeURIComponent(option.list))
    this.home = home
    this.target = target
    this.RLD = new RoutePlan({
      home: this.home,
      target: this.target,
      mode: this.mode,
      type: this.type
    })
    uni.$on('indexChange', index => {
      this.frame = index
    })
    this.setOrderly(this.mode)
  },

  onUnload () {
    // 实例销毁
    this.RLD = null
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

    modeTabsChange (index) {
      this.RLD.unSubscribe()
      const table = ['driving', 'bicycling', 'walking', 'transit']
      this.modeTabsCurrent = index
      this.roadMounted = false
      if (!this.initApp(table[index], this.type)) {
        setTimeout(async () => {
          this.RLD.run = true
          await this.setOrderly(table[index])
          this.$refs.map.setIncludePoints()
        }, 2000)
      }
    },

    async setOrderly (mode, type = this.type) {
      if (this.initApp(mode, type)) return
      console.time('🕓 总耗时')
      const stand = await this.RLD.standardMode().catch(() => {})
      console.timeEnd('🕓 总耗时')
      if (stand?.status) { // 报错
        this.errorMsg = '路线规划失败：' + stand.message
        this.routeLineCache[mode][type] = stand
        this.roadMounted = true
      } else if (stand?.every(v => v?.id) && stand?.length === this.target.length) {
        this.target = stand
        this.routeLineCache[mode][type] = stand
        this.roadMounted = true
      }
    },

    initApp (mode, type) { // 应用初始化，并判断是否有缓存
      this.frame = 1
      this.errorMsg = null
      this.roadMounted = false
      this.mode = mode
      this.type = type
      this.RLD.mode = mode
      this.RLD.type = type
      // 判断是否存在缓存中。缓存中有就不请求了。直接用缓存数据
      if (this.routeLineCache[mode][type]?.length) {
        this.target = this.routeLineCache[mode][type]
        this.roadMounted = true
        return true
      } else if (this.routeLineCache[mode][type]?.status) { // 错误信息的缓存
        this.errorMsg = this.routeLineCache[mode][type]?.message
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
