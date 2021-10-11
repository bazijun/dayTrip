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
      <view class="control-box">
      <u-row gutter="20">
        <u-col span="6">
          <u-button :hair-line="false" :type="type === 'distance' ? 'success' : 'default'"  :ripple="true"
          @click="setOrderly(mode, 'distance')" >距离排序
          <u-badge :offset="[0,0]" type="error" count="推荐"></u-badge>
          </u-button>
        </u-col>
        <u-col span="6">
          <u-button :hair-line="false" :type="type === 'duration' ? 'success' : 'default'" :ripple="true"
          @click="setOrderly(mode, 'duration')">耗时排序</u-button>
        </u-col>
      </u-row>
      </view>
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
      routeLineCache: { // 路线的缓存
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
    const { home, target } = JSON.parse(decodeURIComponent(option.list))
    this.home = home
    this.target = target
    // const test = uni.getStorageSync('store')
    // this.target = test[0].target
    // this.home = test[0].home
    this.RLD = new RoutePlan({
      home: this.home,
      target: this.target,
      mode: this.mode,
      type: this.type
    })
    this.setOrderly(this.mode, this.type)
  },
  onUnload () {
    console.log('instance destroy')
    // 实例销毁
    this.RLD = null
  },
  methods: {
    async setOrderly (mode, type) {
      this.mode = mode
      this.type = type
      this.RLD.mode = mode
      this.RLD.type = type
      // 判断是否存在缓存中。缓存中有就不请求了。直接用缓存数据
      if (this.routeLineCache[mode][type].length) {
        this.target = this.routeLineCache[mode][type]
        uni.showToast({
          title: '模式切换成功',
          duration: 1000
        })
        return
      }
      uni.showLoading({
        title: '会有点久，莫急',
        mask: true
      })
      console.time('总耗时')
      this.target = await this.RLD.standardMode().catch(() => {})
      this.routeLineCache[mode][type] = this.target
      console.timeEnd('总耗时')
      // console.table(this.target)
      uni.hideLoading()
      uni.showToast({
        title: '久等了',
        duration: 1000
      })
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
.control-box {
  widows: 700rxp;
  border-radius: 20rpx;
  // border: 2rpx solid red;
  background: #f8e1e1;
  padding: 15rpx;
  margin: 20rpx
}
</style>
