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
      <RoadLine></RoadLine>
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
      list: []
    }
  },
  onLoad () {
    // this.list = JSON.parse(option.list)
    // this.home = JSON.parse(option.home)
    const test = uni.getStorageSync('store')
    this.list = test[0].target
    this.home = test[0].home
    this.getResolve()
    console.log(this.list)
    console.log(this.home)
  },
  methods: {
    getResolve (mode = 'driving') {
      const routeLineData = {
        home: this.home,
        target: this.list,
        mode: mode
      }
      const ker = new RoutePlan(routeLineData)
      console.log(ker)
    //   const data = {
    //     mode: mode,
    //     from: `${this.home.latitude},${this.home.longitude}`,
    //     to: `${this.list[0].latitude},${this.list[0].longitude}`
    //   }
    //   RP.myDirection(data)
    //     .then((res) => {
    //       console.log(res)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // }
    },
    components: { RoadLine }
  }
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
.u-node {
  width: 44rpx;
  height: 44rpx;
  border-radius: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d0d0d0;
}

.u-order-title {
  color: #333333;
  font-weight: bold;
  font-size: 32rpx;
}

.u-order-desc {
  color: rgb(150, 150, 150);
  font-size: 28rpx;
  margin-bottom: 6rpx;
}

.u-order-time {
  color: rgb(200, 200, 200);
  font-size: 26rpx;
}
</style>
