<template>
  <view>
    <view class="console-box">
      <view class="flex-se">
        <u-button :type="mode === 'transit' ? 'warning' : 'primary'" @click="setOrderly('transit')">公交地铁</u-button>
        <u-button :type="mode === 'bicycling' ? 'warning' : 'primary'" @click="setOrderly('bicycling')">骑行</u-button>
        <u-button :type="mode === 'walking' ? 'warning' : 'primary'" @click="setOrderly('walking')">步行</u-button>
        <u-button :type="mode === 'driving' ? 'warning' : 'primary'" @click="setOrderly('driving')">驾车</u-button>
      </view>
      <view></view>
    </view>
    <view class="time-line-box">
      <road-line :mode="mode" :home="home" :target="target"></road-line>
    </view>
  </view>
</template>

<script>
// import api from '../../util/util'
import { RoutePlan } from '../../util/routePlan'
import RoadLine from '../../components/RoadLine/RoadLine.vue'
export default {
  data () {
    return {
      home: {},
      target: [],
      mode: 'transit'
    }
  },
  onLoad (option) {
    console.log(JSON.parse(decodeURIComponent(option.list)))
    const { home, target } = JSON.parse(decodeURIComponent(option.list))
    this.home = home
    this.target = target
    // const test = uni.getStorageSync('store')
    // this.target = test[0].target
    // this.home = test[0].home
    this.setOrderly(this.mode)
  },
  methods: {
    async setOrderly (mode) {
      this.mode = mode
      // const path = {
      //   mode: mode,
      //   from: `${this.home.latitude},${this.home.longitude}`,
      //   to: `${this.target[0].latitude},${this.target[0].longitude}`
      // }
      const routeLineData = {
        home: this.home,
        target: this.target,
        mode: mode
      }
      uni.showLoading({
        title: '玩命计算中...',
        mask: true
      })
      console.time()
      const RLD = new RoutePlan(routeLineData)
      this.target = await RLD.simpleMode().catch((err) => { console.log(err) })
      uni.hideLoading()
      console.timeEnd()
    }
  },
  components: { RoadLine }
}
</script>

<style lang="scss" scoped>
.console-box {
  width: 700rpx;
  height: 150 rpx;
  margin: 20rpx auto;
  // border: 1px solid;
}
.time-line-box {
  width: 680rpx;
  margin: auto;
}
</style>
