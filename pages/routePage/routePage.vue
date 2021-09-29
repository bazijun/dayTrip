<template>
  <view>
    <view class="console-box">
      <view class="flex-se">
        <u-button :type="mode === 'driving' ? 'warning' : 'primary'" :ripple="true" @click="setOrderly('driving', type)">驾车</u-button>
        <u-button :type="mode === 'bicycling' ? 'warning' : 'primary'" :ripple="true" @click="setOrderly('bicycling', type)">骑行</u-button>
        <u-button :type="mode === 'walking' ? 'warning' : 'primary'" :ripple="true" @click="setOrderly('walking', type)">步行</u-button>
        <u-button :type="mode === 'transit' ? 'warning' : 'primary'" :ripple="true"  @click="setOrderly('transit', type)">公交地铁</u-button>
      </view>
      <!-- test -->
      <view class="margin-top-lg"></view>
      <u-row gutter="20">
        <u-col span="6">
          <u-button :type="type === 'distance' ? 'success' : 'default'"  :ripple="true"  size="small" @click="setOrderly(mode, 'distance')" >距   离</u-button>
        </u-col>
        <u-col span="6">
          <u-button :type="type === 'duration' ? 'success' : 'default'" :ripple="true"  size="small" @click="setOrderly(mode, 'duration')">耗   时</u-button>
        </u-col>
      </u-row>
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
      mode: 'driving',
      type: 'distance', // distance or duration
      RLD: null // RoutePlan类的实例
    }
  },
  onLoad (option) {
    // const { home, target } = JSON.parse(decodeURIComponent(option.list))
    // this.home = home
    // this.target = target
    const test = uni.getStorageSync('store')
    this.target = test[0].target
    this.home = test[0].home
    const routeLineData = {
      home: this.home,
      target: this.target,
      mode: this.mode,
      type: this.type
    }
    this.RLD = new RoutePlan(routeLineData)
    this.setOrderly(this.mode, this.type)
  },
  onUnload () {
    console.log('instance destroy')
    // 实例销毁
    this.RLD = null
  },
  methods: {
    setOrderly (mode, type) {
      this.mode = mode
      this.type = type
      this.RLD.mode = mode
      this.RLD.type = type
      uni.showLoading({
        title: '会有点久，莫急',
        mask: true
      })
      console.time('总耗时')
      this.RLD.standardMode().then(res => {
        console.log(res)
        this.target = res
        console.table(res)
        uni.hideLoading()
        uni.showToast({
          title: '久等了',
          duration: 1000
        })
        console.timeEnd('总耗时')
      }).catch((err) => { console.log(err) })
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
