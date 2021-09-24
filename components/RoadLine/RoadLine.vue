<template>
    <view class="roadline-content">
    <!-- 家 -->
    <view class="home-box">
      <view class="home-on-box">
        <image class="theme-img" src="/static/img/home-f.png" />
        <view class="width-xs text-center">
          <view class="flex-aic-jcc margin-top-lg">
            <image class="icon-img" src="/static/img/world.png" />
            <view class="text-sm">起 点</view>
            <view v-if="true" class="warning-btn">当前位置</view>
          </view>
          <view class="t-name text-line-one">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</view>
          <view class="t-address text-line-two"><text class="text-l-bold">详细地址:</text>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</view>
        </view>
      </view>
    </view>
    <view class="down-img">
        <image src="../../static/img/down/down-6.png" mode="widthFix"/>
    </view>
    <!-- 目标列表 -->
    <block>
        <view class="roadline-list">
        <!-- 定位时的当前位置 -->
        <view v-if="false" class="current-loaction">
          <view class="current-btn">当前位置</view>
        </view>
        <u-badge :offset="[-8,-8]" type="success" count="1"></u-badge>
        <view>
          <view class="t-name width-lg text-line-one"><text class="text-theme text-margin-r">目标一:</text>  xxxx</view>
          <view class="t-address width-lg text-line-one"><text class="text-l-bold">详细地址:</text>东街大路东山商下无级</view>
        </view>
        <u-icon name="map-fill" color="#1F82FF" size="65"></u-icon>
      </view>
      <!-- 下个目标 指引图标 -->
        <view class="down-img">
            <image src="../../static/img/down/down-6.png" mode="widthFix"/>
        </view>
    </block>
    <block>
        <view class="roadline-list">
        <!-- 定位时的当前位置 -->
        <view v-if="true" class="current-loaction">
          <view class="current-btn">当前位置</view>
        </view>
        <u-badge :offset="[-8,-8]" type="success" count="1"></u-badge>
        <view>
          <view class="t-name width-lg text-line-one"><text class="text-theme text-margin-r">目标一:</text></view>
          <view class="t-address width-lg text-line-one"><text class="text-l-bold">详细地址:</text>东街大路东山商下无级</view>
        </view>
        <u-icon name="map-fill" color="#1F82FF" size="65"></u-icon>
      </view>
      <!-- 下个目标 指引图标 -->
        <view class="down-img">
            <image src="../../static/img/down/down-6.png" mode="widthFix"/>
        </view>
    </block>
    <block>
        <view class="roadline-list">
        <!-- 定位时的当前位置 -->
        <view v-if="false" class="current-loaction">
          <view class="current-btn">当前位置</view>
        </view>
        <u-badge :offset="[-8,-8]" type="success" count="1"></u-badge>
        <view>
          <view class="t-name width-lg text-line-one"><text class="text-theme text-margin-r">目标一:</text></view>
          <view class="t-address width-lg text-line-one"><text class="text-l-bold">详细地址:</text>东街大路东山商下无级</view>
        </view>
        <u-icon name="map-fill" color="#1F82FF" size="65"></u-icon>
      </view>
      <!-- 下个目标 指引图标 -->
        <view class="down-img">
            <image src="../../static/img/down/down-6.png" mode="widthFix"/>
        </view>
    </block>
    <block>
        <view class="roadline-list">
        <!-- 定位时的当前位置 -->
        <view v-if="false" class="current-loaction">
          <view class="current-btn">当前位置</view>
        </view>
        <u-badge :offset="[-8,-8]" type="success" count="1"></u-badge>
        <view>
          <view class="t-name width-lg text-line-one"><text class="text-theme text-margin-r">目标一:</text></view>
          <view class="t-address width-lg text-line-one"><text class="text-l-bold">详细地址:</text>东街大路东山商下无级</view>
        </view>
        <u-icon name="map-fill" color="#1F82FF" size="65"></u-icon>
      </view>
      <!-- 下个目标 指引图标 -->
        <view class="down-img">
            <image src="../../static/img/down/down-6.png" mode="widthFix"/>
        </view>
    </block>
    <!-- 返家 -->
    <u-button shape="circle" :custom-style="btnCustomStyle" type="info" :ripple="true" @click="goBack">
        回
        <u-icon name="home-fill" color="#fff" size="60" style="padding:15rpx"></u-icon>
        家
    </u-button>
</view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      target: {
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
  methods: {
    goBack () {
      console.log('回家')
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
    padding:20rpx;
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
  width: 100%;
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
}
.down-img{
    display: flex;
    justify-content: center;
    image{
        width: 80rpx;
    }
}
.home-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300rpx;
}
.warning-btn{
    margin-left: 10rpx;
    width: 120rpx;
    text-align: center;
    background: $theme-warning;
    color: #fff;
    font-size: 25rpx;
    border-radius: 10rpx;
}
</style>
