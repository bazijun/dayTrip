<template>
  <view class="target-box">
      <view class="target-head">
        <view class="flex">
          <u-icon name="map-fill" color="#fff" size="50"></u-icon>
          <view class="title-text">目的地-列表</view>
        </view>
        <u-icon name="plus-circle-fill" color="#fff" size="75" @click="targetAdd"></u-icon>
      </view>
      <view class="target-content">
        <view style="margin: 20rpx 0;" v-for="(item, index) in list" :key="item.id">
          <u-swipe-action
          :show="item.show"
          :index="item.id"
          btn-width="120"
          @click="swipeClick" @open="open" :options="options">
            <view class="target-list">
              <view>
                <view class="t-name width-lg text-line-one">{{item.name || '目标-' + index }}</view>
                <view class="t-address width-lg text-line-one" v-if="item.address"><text class="text-l-bold">详细地址:</text>{{item.address}}</view>
              </view>
              <u-icon name="arrow-right-double" color="#1F82FF" size="60"></u-icon>
            </view>
          </u-swipe-action>
        </view>
      </view>
    </view>
</template>

<script>
export default {
  paros: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.target-box {
  width: 720rpx;
  min-height: 130rpx;
  padding-bottom: 10rpx;
  margin: 30rpx auto 20rpx auto;
  border-radius: 20rpx;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px rgba(16, 105, 231, 0.2);
  .target-head {
    height: 110rpx;
    width: 100%;
    background-image: url("/static/img/blue-column.png");
    background-size: 100% 100%;
    border-radius: 20rpx 20rpx 0 0;
    text-align: center;
    display: flex;
    padding: 0 25rpx;
    justify-content: space-between;
    align-items: center;
    .target-text {
      font-weight: 800;
      letter-spacing: 2rpx;
      color: #ffffff;
    }
  }
  .target-content {
    width: 690rpx;
    margin: auto;
    .target-list {
      box-sizing: border-box;
      background-color: $theme-light-color;
      width: 100%;
      height: 160rpx;
      border: 2rpx solid #e6e6e6;
      padding: 0 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
