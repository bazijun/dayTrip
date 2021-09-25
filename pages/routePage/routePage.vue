<template>
  <view>
    <view class="console-box">
      控制台
    </view>
    <view class="time-line-box">
      <RoadLine></RoadLine>
    </view>
  </view>
</template>

<script>
import api from '../../util/util'
import RoadLine from '../../components/RoadLine/RoadLine.vue'
export default {
  data () {
    return {
      home: {},
      list: []
    }
  },
  onLoad (option) {
    this.list = JSON.parse(option.list)
    this.home = JSON.parse(option.home)
    this.getResolve()
    console.log(this.list)
    console.log(this.home)
  },
  methods: {
    getResolve () {
      const data = {
        mode: 'transit',
        from: `${this.home.latitude},${this.home.longitude}`,
        to: `${this.list[0].latitude},${this.list[0].longitude}`
      }
      api.myDirection(data).then(res => {
        console.log(res)
      }).catch(err => { console.log(err) })
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
  border: 1px solid;
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
