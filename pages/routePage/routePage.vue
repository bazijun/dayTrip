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
      <road-line
        v-show="tabsCurrent"
        :mode="mode"
        :home="home"
        :target="target"
        :roadMounted="roadMounted"
      ></road-line>
      <road-line-map
        v-show="!tabsCurrent"
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
      mode: 'driving',
      type: 'distance', // distance | duration
      roadMounted: false,
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
    this.setOrderly(this.mode)
  },
  onUnload () {
    console.log('instance destroy')
    // 实例销毁
    this.RLD = null
  },
  methods: {
    tabsChange (index) {
      this.tabsCurrent = index
    },

    modeTabsChange (index) {
      this.modeTabsCurrent = index
      const table = ['driving', 'bicycling', 'walking', 'transit']
      this.$refs.map.setIncludePoints()
      this.setOrderly(table[index])
    },

    async setOrderly (mode, type = this.type) {
      this.RLD.unSubscribe('standardMode')
      this.roadMounted = false
      this.mode = mode
      this.type = type
      this.RLD.mode = mode
      this.RLD.type = type
      // 判断是否存在缓存中。缓存中有就不请求了。直接用缓存数据
      if (this.routeLineCache[mode][type].length) {
        this.target = this.routeLineCache[mode][type]
        this.roadMounted = true
        // uni.showToast({
        //   title: '模式切换成功',
        //   duration: 1000
        // })
        return
      }
      // uni.showLoading({
      //   title: '会有点久，稍等',
      //   mask: true
      // })
      console.time('🕓 总耗时')
      // this.target = await this.RLD.subscribe('standardMode').catch(() => {})
      this.RLD.subscribe('standardMode', data => {
        console.log({ data })
      })
      this.routeLineCache[mode][type] = this.target
      this.roadMounted = true
      console.log('挂载成功！')
      console.timeEnd('🕓 总耗时')
      // uni.hideLoading()
      // uni.showToast({
      //   title: '久等了',
      //   duration: 1000
      // })
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
