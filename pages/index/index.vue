<template>
  <view>
    <view class="home-box" @click="outSet">
      <view v-if="!home.errMsg">
        <image class="theme-img" src="/static/img/home.png" />
        <view class="title-text">点击选择出发地点</view>
      </view>
      <view class="home-on-box" v-else>
        <image class="theme-img" src="/static/img/home-on.png" />
        <view class="width-sm text-center">
          <view class="t-name text-line-one">{{home.name || 'Home'}}</view>
          <view class="t-address text-line-two" v-if="home.address"><text class="text-l-bold">详细地址:</text>{{home.address}}</view>
          <view class="flex-aic-jcc margin-top-lg">
            <image class="icon-img" src="/static/img/world.png" />
            <view class="text-sm">{{home.latitude}} - {{home.longitude}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="target-box">
      <view class="target-head">
        <view class="flex">
          <u-icon name="map-fill" color="#043963" size="50"></u-icon>
          <view class="title-text" style="color: #043963">目的地-列表</view>
          <view style="width:10rpx"></view>
          <u-icon name="reload" color="#fff" size="40" @click="reloadTargetList"></u-icon>
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
    <u-tabbar :list="tabbar" :mid-button="true" active-color="#1F82FF" :before-switch="goRoute"></u-tabbar>
  </view>
</template>

<script>
/******
  > bug列表
  1. uni.chooseLocation 地址切换，如果附近有距离相同的位置，默认选择的地址会匹配不准确
******/
import api from '../../util/util'
export default {
  data () {
    return {
      title: 'Hello',
      count: 5,
      value: 4,
      home: {},
      list: [],
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
      ],
      options: [
        {
          text: '编辑',
          style: {
            backgroundColor: '#409EFF'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#F56C6C'
          }
        }
      ]
    }
  },
  onLoad () {},
  methods: {
    goRoute (index) {
      if (index === 1) {
        if (!this.home.errMsg || (this.list.length === 0)) {
          uni.showToast({
            title: '请选择起点和目标地点！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        uni.showModal({
          title: '提示',
          content: '起点和目标列表确定好了吗？',
          cancelText: '没有',
          confirmText: '启动！',
          success: res => {
            if (res.confirm) {
              uni.navigateTo({
                url: `../routePage/routePage?list=${JSON.stringify(this.list)}&home=${JSON.stringify(this.home)}`
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
      if (!this.home.name) {
        uni
          .chooseLocation()
          .then((res) => {
            this.closeSwipe()
            if (!res[1].errMsg) return
            this.home = res[1]
          })
          .catch((err) => console.log(err))
        return
      }
      uni
        .chooseLocation({
          latitude: this.home.latitude,
          longitude: this.home.longitude
        })
        .then((res) => {
          this.closeSwipe()
          if (!res[1].errMsg) return
          this.home = res[1]
        })
        .catch((err) => console.log(err))
    },
    swipeClick (id, index1) {
      const index = this.list.findIndex(v => v.id === id)
      if (index1 === 1) {
        this.list.splice(index, 1)
      } else {
        this.targetEdit(index)
      }
    },
    open (id) {
      const index = this.list.findIndex(v => v.id === id)
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.list[index].show = true
      this.list.forEach((v, idx) => {
        if (v.id !== id) this.list[idx].show = false
      })
    },
    targetAdd () {
      const { vip } = this.$store.state
      if (this.list.length < 5 || vip) {
        if (this.list.length === 10) {
          uni.showToast({
            title: '已达目标上限，后续也许会升级~',
            icon: 'none',
            duration: 1500
          })
          return
        }
        uni.chooseLocation()
          .then((res) => {
            this.closeSwipe()
            if (!res[1].errMsg) return
            const targetList = {
              ...res[1],
              show: false,
              id: new Date().getTime()
            }
            this.list = [targetList, ...this.list]
          })
          .catch((err) => console.log(err))
      } else {
        uni.showModal({
          title: '提示',
          content: '普通用户目标地址，已达上线。升级荣耀会员，即可解锁10个目标地址！',
          cancelText: '拒绝！',
          confirmText: '996元/天',
          success: res => {
            if (res.confirm) {
              uni.showToast({
                title: '你背叛了工人阶级 !!!',
                icon: 'none',
                duration: 2000
              })
            } else if (res.cancel) {
              this.$store.commit('SET_VIP')
              uni.showToast({
                title: '',
                duration: 1500
              })
            }
          }
        })
      }
    },
    targetEdit (index) {
      uni.chooseLocation({
        latitude: this.list[index].latitude,
        longitude: this.list[index].longitude
      })
        .then((res) => {
          this.closeSwipe()
          if (!res[1].errMsg) return
          const targetList = {
            ...this.list[index],
            ...res[1],
            show: false
          }
          this.list[index] = targetList
        })
        .catch((err) => console.log(err))
    },
    reloadTargetList () {
      uni.showModal({
        title: '提示',
        content: '是否确定重置目标列表 ？',
        success: res => {
          if (res.confirm) {
            this.list = []
          } else if (res.cancel) {
          }
        }
      })
    },
    closeSwipe () {
      this.list = this.list.map(v => {
        return {
          ...v,
          show: false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-box {
  overflow: hidden;
  height: 320rpx;
  width: 710rpx;
  margin: 20rpx auto;
  position: relative;
  background-image: url("/static/img/origin-home.png");
  background-size: 100% 100%;
  text-align: center;
  border-radius: 20rpx;
  box-shadow: 0px 2px 8px 0px rgba(16, 105, 231, 0.2);
  .home-on-box {
    width: 690rpx;
    height: 300rpx;
    margin: 10rpx;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
  }
}

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
