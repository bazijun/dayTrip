<template>
  <view class="roadline-content">
    <!-- 家 -->
    <view class="home-box">
      <view class="home-on-box">
        <image v-if="mode === 'transit'" class="theme-img" src="/static/img/bus.png" mode="widthFix" />
        <image v-else-if="mode === 'driving'" class="theme-img" src="/static/img/car.png" mode="widthFix" />
        <image v-else-if="mode === 'walking'" class="theme-img" src="/static/img/walk.png" mode="widthFix" />
        <image v-else-if="mode === 'bicycling'" class="theme-img" src="/static/img/bike.png" mode="widthFix" />
        <view class="width-xs text-center">
          <view class="flex-aic-jcc margin-top-lg">
            <image class="icon-img" src="/static/img/world.png" />
            <view class="text-theme t-name">起 点</view>
            <!-- <view v-if="true" class="warning-btn">当前位置</view> -->
          </view>
          <view class="t-name text-line-one">{{home.name}}</view>
          <view class="t-address text-line-two"><text class="text-l-bold">详细地址:</text>{{home.address}}</view>
        </view>
      </view>
    </view>
    <view class="down-img-box">
      <image class="down-img" src="../../static/img/down/down-6.png" mode="widthFix" />
    </view>
    <!-- 目标列表 -->
    <view v-for="(item, index) in targetList" :key="item.id">
      <view class="roadline-list" @click="getLocation(item)">
        <!-- 定位时的当前位置 -->
        <view v-if="false" class="current-loaction">
          <view class="current-btn">当前位置</view>
        </view>
        <u-badge :offset="[-8,-8]" type="success" :count="index + 1"></u-badge>
        <view>
          <view class="t-name width-lg text-line-one"><text
              class="text-theme text-margin-r">{{(target.length - 1) === index ? '终点站：' : T[index]}}</text>{{item.name}}</view>
          <view class="t-address width-lg text-line-one"><text class="text-l-bold">详细地址:</text>{{item.address}}</view>
        </view>
        <u-icon name="map-fill" color="#1F82FF" size="65" ></u-icon>
      </view>
      <!-- 下个目标 指引图标 和 数据板 -->
      <view class="flex-aic-jcc">
        <view class="down-img-box">
          <image class="down-img" src="../../static/img/down/down-6.png" mode="widthFix" />
        </view>
        <!-- 数据板子 -->
        <!-- <view class="data-panel">

        </view> -->
      </view>
    </view>
    <!-- 返家 -->
    <u-button shape="circle" :custom-style="btnCustomStyle" type="info" :ripple="true" @click="goBack">
      回
      <u-icon name="home-fill" color="#fff" size="60" style="padding:15rpx"></u-icon>
      家
    </u-button>
  </view>
</template>

<script>
import { routePlanPluginView } from '../../util/routePlan'
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
    mode: {
      type: String,
      default: ''
    },
    roadMounted: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      T: {
        0: '目标一：',
        1: '目标二：',
        2: '目标三：',
        3: '目标四：',
        4: '目标五：',
        5: '目标六：',
        6: '目标七：',
        7: '目标八：',
        8: '目标九：',
        9: '目标十：'
      },
      btnCustomStyle: {
        width: '240rpx',
        height: '80rpx',
        backgroundColor: '#1F82FF',
        color: '#fff',
        margin: '20rpx auto 80rpx auto',
        fontSize: '35rpx'
      }
    }
  },
  computed: {
    targetList () {
      return this.roadMounted ? this.target : []
    }
  },
  methods: {
    goBack () {
      const endPoint = {
        name: this.home.name,
        latitude: this.home.latitude,
        longitude: this.home.longitude
      }
      routePlanPluginView(endPoint)
      // uni.openLocation({
      //   latitude: this.home.latitude,
      //   longitude: this.home.longitude,
      //   name: this.home.name,
      //   address: this.home.address,
      //   success: function () {
      //     console.log('success')
      //   },
      //   fail: function (err) {
      //     console.log(err)
      //   }
      // })
    },
    getLocation (location) {
      const endPoint = {
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude
      }
      routePlanPluginView(endPoint)
      // uni.openLocation({
      //   latitude: location.latitude,
      //   longitude: location.longitude,
      //   name: location.name,
      //   address: location.address,
      //   success: function () {
      //     console.log('success')
      //   },
      //   fail: function (err) {
      //     console.log(err)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-box {
  overflow: hidden;
  height: 240rpx;
  width: 650rpx;
  margin: 20rpx auto;
  position: relative;
  background-image: url("/static/img/blue-home.png");
  background-size: 100% 100%;
  text-align: center;
  border-radius: 20rpx;
  box-shadow: 0px 2px 8px 0px rgba(16, 105, 231, 0.2);
  .home-on-box {
    padding: 20rpx;
    width: 630rpx;
    height: 220rpx;
    margin: 10rpx;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }
}
.roadline-content {
  width: 95%;
  margin: auto;
  position: relative;
  .roadline-list {
    box-sizing: border-box;
    background-color: $theme-light-color;
    width: 100%;
    height: 160rpx;
    border: 2rpx solid #e6e6e6;
    margin: 20rpx auto;
    padding: 0 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20rpx;
    box-shadow: 0px 2px 8px 0px rgba(16, 105, 231, 0.2);
    position: relative;
    .current-loaction {
      box-sizing: border-box;
      z-index: 5;
      position: absolute;
      left: 0;
      width: 100%;
      height: 160rpx;
      border-radius: 20rpx;
      border: 10rpx solid $theme-warning;
      box-shadow: 0 8rpx 30rpx $theme-warning;
      .current-btn {
        width: 120rpx;
        position: absolute;
        top: -10rpx;
        left: 20rpx;
        text-align: center;
        background: $theme-warning;
        color: #fff;
        font-size: 25rpx;
        border-radius: 10rpx;
      }
    }
  }
  .data-panel {
    width: 400rpx;
    height: 200rpx;
    border: 1px solid;
  }
}
.down-img-box {
  display: flex;
  justify-content: center;
  .down-img {
    width: 80rpx;
  }
}
.home-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300rpx;
}
.warning-btn {
  margin-left: 10rpx;
  width: 120rpx;
  text-align: center;
  background: $theme-warning;
  color: #fff;
  font-size: 25rpx;
  border-radius: 10rpx;
}
</style>
