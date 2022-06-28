<template>
  <view>
    <view style="margin: 20rpx" v-for="item in routeStore" :key="item.id">
      <u-swipe-action
        :show="item.show"
        :index="item.id"
        btn-width="120"
        @click="swipeClick"
        @open="open"
        :options="options"
      >
        <view class="option-list" @click="openCollect(item)">
          <view class="option-title">
            <u-icon
              name="star-fill"
              :color="item.id === 1632488015398 ? '#FF960E' : '#2881FF'"
              size="40"
            ></u-icon>
            <view class="text-lg text-margin-l-sm" style="line-height: 45rpx">{{
              item.name
            }}</view>
          </view>
          <u-icon name="arrow-left-double" color="#ADAAAA" size="45"></u-icon>
        </view>
      </u-swipe-action>
    </view>
  </view>
</template>

<script>
// TODO: 收藏可重命名
export default {
  data () {
    return {
      options: [
        {
          text: '编辑',
          style: {
            backgroundColor: '#1F82FF'
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
  computed: {
    routeStore () {
      return this.$store.state.routeStore
    }
  },
  onShow () {
    this.$store.commit('LOAD_ROUTE_STORE')
  },
  methods: {
    openCollect (item) {
      console.log('[item]===>🚀', item)
      const payload = {
        id: item.id,
        home: item.home,
        target: item.target
      }
      const list = JSON.stringify(payload)
      uni.navigateTo({
        url: `../routePage/routePage?list=${encodeURIComponent(list)}`
      })
    },

    goRoute (item) {
      this.$store.commit('SET_CURRENT_ROUTE', item)
      uni.reLaunch({
        url: '../index/index'
      })
    },

    swipeClick (id, idx) {
      const importantId = 1632488015398
      const index = this.routeStore.findIndex((v) => v.id === id)
      const item = this.routeStore.find((f) => f.id === id)
      // 编辑
      if (idx === 0) {
        console.log('[item]===>🚀', item)
        this.goRoute(item)
        // 删除
      } else if (idx === 1) {
        if (this.routeStore[index].id === importantId) {
          uni.showToast({
            title: '这个不能删！ﾍ(;´Д｀ﾍ) ',
            icon: 'none',
            duration: 1500
          })
          this.routeStore[index].show = false
        } else {
          this.$store.commit('DELETE_ROUTE_STORE', index)
        }
      }
    },

    open (id) {
      const index = this.routeStore.findIndex((v) => v.id === id)
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.routeStore[index].show = true
      this.routeStore.forEach((v, idx) => {
        if (v.id !== id) this.routeStore[idx].show = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.option-list {
  width: 710rpx;
  height: 100rpx;
  box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(16, 105, 231, 0.2);
  border-radius: 12rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  align-items: center;
  .option-title {
    display: flex;
  }
}
</style>
