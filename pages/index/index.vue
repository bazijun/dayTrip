<template>
  <view>
    <view class="home-box" @click="outSet">
      <image src="/static/img/home.png"/>
      <view class="title-text">点击选择出发地点</view>
    </view>
    <view class="target-box">
      <view class="target-head">
        <view class="title-text">目的地列表</view>
        <u-icon name="plus-circle-fill" color="#fff" size="75"></u-icon>
      </view>
      <view class="target-content">
        <view class="target-list">
          <view>
            <view class="t-name text-line-one">中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华</view>
            <view class="t-address text-line-one"><text class="text-l-bold">详细地址:</text>卢浮宫中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华中华</view>
          </view>
          <u-icon name="setting-fill" color="#333333" size="60"></u-icon>
        </view>
      </view>
    </view>
    <u-tabbar :list="tabbar" :mid-button="true" active-color="#1F82FF" :before-switch="goRoute"></u-tabbar>
  </view>
</template>

<script>
import api from '../../util/util'
export default {
  data () {
    return {
      title: 'Hello',
      count: 5,
      value: 4,
      home: {

      },
      list: {

      },
      tabbar: [
        {
          iconPath: '/static/icon/road.png',
          selectedIconPath: '/static/icon/road-click.png',
          text: '路线',
          pagePath: '/pages/index/index'
        },
        {
          iconPath: '/static/icon/home.png',
          selectedIconPath: '/static/icon/home.png',
          text: '启动',
          midButton: true,
          pagePath: '/pages/index/index'
        },
        {
          iconPath: '/static/icon/about.png',
          selectedIconPath: '/static/icon/about-click.png',
          text: '关于',
          pagePath: '/pages/about/about'
        }
      ]
    }
  },
  onLoad () {
    /**
     * 示例中为每个tabbar页面都写了一遍tabbar变量，您可以将tabbar数组写入到vuex中，这样可以全局引用
     */
  },
  methods: {
    goRoute (index) {
      if (index === 1) {
        uni.showModal({
          title: '提示',
          content: '起点和目标列表确定好了吗？',
          cancelText: '没有',
          confirmText: '启动！',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '../routePage/routePage'
              })
            }
          }
        })
        return false
      }
      return true
    },
    outSet () {
      const loaction = api.mpLocation()
      if (loaction) return
      uni.chooseLocation()
        .then(res => {
          this.home = res[1]
          console.log(res[1])
        }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss">
.home-box {
  height: 320rpx;
  width: 710rpx;
  margin: 20rpx auto;
  position: relative;
  background-image: url('/static/img/origin-home.png');
  background-size: 100% 100%;
  text-align: center;
  border-radius: 20rpx;
  box-shadow: 0px 2px 8px 0px rgba(16, 105, 231, 0.2);
  image{
    width: 170rpx;
    height: 170rpx;
    padding-top: 30rpx;
    padding-bottom: 20rpx;
  }
}
.target-box{
  width: 720rpx;
  min-height: 130rpx;
  padding-bottom: 10rpx;
  margin: 30rpx auto 20rpx auto;
  border-radius: 20rpx;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px rgba(16, 105, 231, 0.2);
  .target-head{
    height: 110rpx;
    width: 100%;
    background-image: url('/static/img/blue-column.png');
    background-size: 100% 100%;
    border-radius: 20rpx 20rpx 0 0;
    text-align: center;
    display: flex;
    padding: 0 25rpx;
    justify-content: space-between;
    align-items: center;
    .target-text{
      font-weight: 800;
      letter-spacing : 2rpx;
      color: #FFFFFF;
    }
  }
  .target-content{
    width: 690rpx;
    margin: auto;
    .target-list{
      background-color: $theme-light-color;
      width: 100%;
      height: 160rpx;
      border: 2rpx solid #E6E6E6;
      padding: 0 30rpx;
      margin: 20rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .t-name{
        width: 520rpx;
        font-size: 36rpx;
        font-weight: bold;
      }
      .t-address{
        width: 520rpx;
        color: #666666;
        font-size: 26rpx;
        margin-top: 10rpx;
      }
    }
  }
}
</style>
