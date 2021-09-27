<template>
  <view>
    <view class="console-box">
      <view class="flex-se">
        <u-button type="primary" @click="getResolve('driving')">驾车</u-button>
        <u-button type="primary" @click="getResolve('walking')">步行</u-button>
        <u-button type="primary" @click="getResolve('bicycling')">骑行</u-button>
        <u-button type="primary" @click="getResolve('transit')">公交</u-button>
      </view>
    </view>
    <view class="time-line-box">
      <road-line></road-line>
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
      target: []
    }
  },
  onLoad () {
    // this.target = JSON.parse(option.target)
    // this.home = JSON.parse(option.home)
    const test = uni.getStorageSync('store')
    this.target = test[0].target
    this.home = test[0].home
    this.getResolve()
  },
  methods: {
    getResolve (mode = 'driving') {
      const routeLineData = {
        home: this.home,
        target: this.target,
        mode: mode
      }
      // const path = {
      //   mode: mode,
      //   from: `${this.home.latitude},${this.home.longitude}`,
      //   to: `${this.target[0].latitude},${this.target[0].longitude}`
      // }
      const RLD = new RoutePlan(routeLineData)
      this.target = RLD.simpleMode()
      console.log(RLD)
    //   const data = {
    //     mode: mode,
    //     from: `${this.home.latitude},${this.home.longitude}`,
    //     to: `${this.target[0].latitude},${this.target[0].longitude}`
    //   }
    //   RP.myDirection(data)
    //     .then((res) => {
    //       console.log(res)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // }
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
