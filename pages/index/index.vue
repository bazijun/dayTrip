<template>
  <view ref="indexCom">
    <view class="home-box" @click="outSet">
      <view class="home-on-box" v-if="homeLoading">
        <u-loading
          color="#1F82FF"
          size="120"
          text="定位获取中"
          :show="homeLoading"
        >
        </u-loading>
        <image class="home-loading-img" src="/static/icon/road-click.png" />
      </view>
      <view v-else-if="JSON.stringify(home) === '{}'">
        <image class="theme-img" src="/static/img/home.png" />
        <view class="title-text">点击选择出发地点</view>
      </view>
      <view class="home-on-box" v-else>
        <image class="theme-img" src="/static/img/home-on.png" />
        <view class="width-sm text-center">
          <view class="t-name text-line-one">{{
            home.name || "我的位置"
          }}</view>
          <view class="t-address text-line-two" v-if="home.address"
            ><text class="text-l-bold">详细地址:</text>{{ home.address }}</view
          >
          <view class="flex-aic-jcc margin-top-lg">
            <image class="icon-img" src="/static/img/world.png" />
            <view class="text-sm">
              {{ home.latitude }} - {{ home.longitude }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 新建路线: 有点鸡肋，暂时取消 -->
    <!-- <u-button
      @click="newRoute"
      v-if="storeId"
      shape="circle"
      :custom-style="btnCustomStyle"
      type="primary"
      :ripple="true"
    >
      <u-icon name="plus" color="#fff" size="55"></u-icon>
    </u-button> -->
    <view class="target-box">
      <view class="target-head">
        <view class="flex">
          <u-icon name="map-fill" color="#fff" size="50"></u-icon>
          <view class="title-text" style="color: #fff">目的地-列表</view>
          <view style="width: 10rpx"></view>
        </view>
        <u-button
          @click="reloadTargetList"
          shape="circle"
          :custom-style="btnCustomStyle"
          type="primary"
          :ripple="true"
        >
          <u-icon name="reload" color="#fff" size="70"></u-icon>
        </u-button>
      </view>
      <view class="target-content">
        <u-button
          v-if="list.length !== 10"
          :custom-style="btnBlockCustomStyle"
          @click="targetAdd"
        >
          <u-icon name="plus" color="#1F82FF" size="85"></u-icon>
        </u-button>
        <view style="margin: 20rpx 0" v-for="(item, index) in list" :key="item.id">
          <u-swipe-action
            :show="item.show"
            :index="item.id"
            btn-width="120"
            @click="swipeClick"
            @open="open"
            :options="options"
          >
            <view class="target-list" @click="targetEdit(index)">
              <view>
                <view class="t-name width-lg text-line-one">{{
                  item.name || item.address
                }}</view>
                <view
                  class="t-address width-lg text-line-one"
                  v-if="item.address"
                  ><text class="text-l-bold">详细地址:</text
                  >{{ item.address }}</view
                >
              </view>
              <u-icon
                name="arrow-left-double"
                color="#1F82FF"
                size="60"
              ></u-icon>
            </view>
          </u-swipe-action>
        </view>
      </view>
    </view>
    <u-modal
      v-model="show"
      show-cancel-button
      @confirm="saveRouteGo"
      @cancel="isfocus = false"
      confirm-text="保存并启动"
      cancel-text="取消"
      title="路线保存"
    >
      <view class="input-box">
        <u-input
          v-model="storeName"
          :focus="isfocus"
          height="70"
          :border="true"
          input-align="center"
          placeholder="为该路线取个名字"
          border-color="#1F82FF"
          maxlength="15"
        />
      </view>
    </u-modal>
    <u-tabbar
      :list="tabbar"
      :mid-button="true"
      active-color="#1F82FF"
      :before-switch="goRoute"
    ></u-tabbar>
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
      homeLoading: false,
      homeButtonLoading: false, // 用于阻止 mpOptionLocation 被多次触发
      addButtonLoading: false,
      list: [],
      show: false,
      storeName: '',
      storeId: '',
      isfocus: false,
      btnCustomStyle: {
        width: '80rpx',
        height: '80rpx'
      },
      btnBlockCustomStyle: {
        margin: '20rpx 0',
        boxSizing: 'border-box',
        width: '100%',
        height: '100rpx',
        border: '5rpx dotted #1F82FF',
        color: '#fff',
        borderRadius: '10rpx',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
          iconPath: '/static/icon/option.png',
          selectedIconPath: '/static/icon/option-click.png',
          text: '工具',
          pagePath: '/pages/option/option'
        }
      ],
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: '#F56C6C'
          }
        }
      ]
    }
  },

  computed: {
    routeStore () {
      return this.$store.state.routeStore
    }
  },

  onLoad () {
    uni.$once('initHomeLoading', () => {
      this.homeLoading = true
      console.log('loading开始')
    })
    uni.$once('initHomeLocation', (data) => {
      this.home = data
      this.homeLoading = false
      console.log('loading结束')
      // console.log('监听到了', data)
    })
    this.getList()
  },
  methods: {
    newRoute () {
      uni.showModal({
        title: '提示',
        content: '是否重新打开空白路线页？',
        success: (res) => {
          if (res.confirm) {
            this.list = []
            this.home = {}
            this.storeId = ''
          } else if (res.cancel) {
          }
        }
      })
    },

    getList () {
      // 初次进入 app，currentRoute 数据是undefined, 赋值给 home 和 list，后面的条件会失效。
      const { home, target, id } = this.$store.state.currentRoute
      if (id) {
        this.home = home
        this.list = target
        this.storeId = id
      } else {
        //
      }
    },

    goRoute (index) {
      // const idPd = this.routeStore.some(v => v.name === this.storeName)
      if (index === 1) {
        if (!this.home.errMsg || this.list.length === 0) {
          uni.showToast({
            title: '请选择起点和目标地点！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        // 从路线收藏来的 就不用取名字了。隐式更新数据
        if (this.storeId) {
          uni.showModal({
            title: '提醒',
            content: '路线收藏的数据，若有修改会自动保存',
            cancelText: '取消',
            confirmText: '启动！',
            success: (res) => {
              if (res.confirm) {
                const payload = {
                  id: this.storeId,
                  home: this.home,
                  target: this.list
                }
                this.$store.commit('UPDATE_ROUTE_STORE', payload)
                const list = JSON.stringify(payload)
                // 数据太长 需要进行 encodeURIComponent 编码
                uni.navigateTo({
                  url: `../routePage/routePage?list=${encodeURIComponent(
                    list
                  )}`
                })
              }
            }
          })
        } else {
          this.show = true
          this.$nextTick(() => {
            this.isfocus = true
          })
        }
        return false
      }
      return true
    },

    saveRouteGo () {
      // 名字不能重复
      console.log(this.routeStore)
      const namePd = this.routeStore.some((v) => v.name === this.storeName)
      if (namePd) {
        this.show = true
        uni.showToast({
          title: '路线名不得重复！',
          icon: 'none',
          duration: 1500
        })
        return
      }
      // 名字不为空
      if (!this.storeName) {
        this.show = true
        uni.showToast({
          title: '路线名不能为空！',
          icon: 'none',
          duration: 1500
        })
        return
      }

      const payload = {
        id: new Date().getTime(),
        name: this.storeName,
        show: false,
        home: this.home,
        target: this.list
      }
      this.$store.commit('ADD_ROUTE_STORE', payload)
      const list = JSON.stringify(payload)
      // 数据太长 需要进行 encodeURIComponent 编码
      uni.navigateTo({
        url: `../routePage/routePage?list=${encodeURIComponent(list)}`
      })
      this.storeId = this.routeStore[0].id // 保存过一次 就不用保存了。
    },

    outSet () {
      if (this.homeButtonLoading) return
      this.homeButtonLoading = true
      if (!this.home.name) {
        uni
          .chooseLocation()
          .then((res) => {
            this.homeButtonLoading = false
            if (!res[1]?.errMsg) {
              api.mpOptionLocation(getApp().getHome)
              return
            }
            this.home = res[1]
          })
          .catch(() => {
            this.homeButtonLoading = false
            api.mpOptionLocation(getApp().getHome)
          })
      } else {
        uni
          .chooseLocation({
            latitude: this.home.latitude,
            longitude: this.home.longitude
          })
          .then((res) => {
            this.homeButtonLoading = false
            this.closeSwipe()
            if (!res[1]?.errMsg) return
            this.home = res[1]
          })
          .catch(() => {
            this.homeButtonLoading = false
            api.mpOptionLocation(getApp().getHome)
          })
      }
    },

    swipeClick (id) {
      const index = this.list.findIndex((v) => v.id === id)
      this.list.splice(index, 1)
    },

    open (id) {
      const index = this.list.findIndex((v) => v.id === id)
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.list[index].show = true
      this.list.forEach((v, idx) => {
        if (v.id !== id) this.list[idx].show = false
      })
    },

    targetAdd () {
      if (this.addButtonLoading) return
      this.addButtonLoading = true
      const vip = uni.getStorageSync('vip')
      if (this.list.length < 5 || vip) {
        uni
          .chooseLocation()
          .then((res) => {
            this.addButtonLoading = false
            this.closeSwipe()
            if (!res[1]?.errMsg) {
              api.mpOptionLocation(getApp().getHome)
              return
            }
            const targetList = {
              ...res[1],
              show: false,
              id: new Date().getTime()
            }
            if (this.home.address === targetList.address) {
              uni.showToast({
                title: '起点和目的地不能相同！',
                icon: 'none',
                duration: 1500
              })
              return
            }
            if (this.list.some(v => v.address === targetList.address)) {
              uni.showToast({
                title: '不能添加已有目的地！',
                icon: 'none',
                duration: 1500
              })
              return
            }
            this.list = [targetList, ...this.list]
          })
          .catch(() => {
            this.addButtonLoading = false
            api.mpOptionLocation(getApp().getHome)
          })
      } else {
        this.addButtonLoading = false
        uni.showModal({
          title: '提示',
          content:
            '普通用户目标地址，已达上线。升级为红宝石会员，即可解锁10个目标地址！',
          cancelText: '拒绝！',
          confirmText: '996元/天',
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: '你背叛了工人阶级 !!!',
                icon: 'none',
                duration: 2000
              })
            } else if (res.cancel) {
              // state 同 storage 同时生效
              this.$store.commit('SET_VIP')
              uni.showToast({
                title: '解锁成功！',
                duration: 1500
              })
            }
          }
        })
      }
    },

    targetEdit (index) {
      uni
        .chooseLocation({
          latitude: this.list[index].latitude,
          longitude: this.list[index].longitude
        })
        .then((res) => {
          this.closeSwipe()
          if (!res[1]?.errMsg) return
          const targetList = {
            ...this.list[index],
            ...res[1],
            show: false
          }
          this.list[index] = targetList
        })
        .catch(() => {
          api.mpOptionLocation(getApp().getHome)
        })
    },

    reloadTargetList () {
      if (this.list.length === 0) return
      uni.showModal({
        title: '提示',
        content: '是否确定重置目标列表 ？',
        success: (res) => {
          if (res.confirm) {
            this.list = []
          } else if (res.cancel) {
          }
        }
      })
    },

    closeSwipe () {
      this.list = this.list.map((v) => {
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
    position: relative;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
    .home-loading-img {
      position: absolute;
      width: 80rpx;
      height: 80rpx;
      z-index: 99;
      margin: auto;
    }
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
    position: sticky;
    top: 0;
    z-index: 99;
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
    .target-add {
      margin: 20rpx 0;
      box-sizing: border-box;
      width: 100%;
      height: 100rpx;
      border: 5rpx dotted $theme-color;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
.input-box {
  width: 500rpx;
  margin: 20rpx auto;
}
</style>
