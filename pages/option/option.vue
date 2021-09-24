<template>
  <view>
    <view v-for="item in list" :key="item.path" class="option-list" @click="goRoute(item.path)">
      <view class="option-title">
        <u-icon :name="item.icon" :color="item.color" size="40"></u-icon>
        <view class="text-lg text-margin-l-sm" style="line-height: 45rpx">{{item.title}}</view>
      </view>
      <u-icon name="arrow-right" color="#ADAAAA" size="45"></u-icon>
    </view>
    <u-tabbar :list="tabbar" active-color="#1F82FF"></u-tabbar>
  </view>
</template>
<script>
export default {
  data () {
    return {
      list: [
        {
          color: '#32B16C',
          title: '路线收藏',
          icon: 'star-fill',
          path: '../collect/collect'
        },
        {
          color: '#FFB30E',
          title: '关于',
          icon: 'question-circle-fill',
          path: '../about/about'
        }
      ],
      tabbar: [
        {
          iconPath: '/static/icon/road.png',
          selectedIconPath: '/static/icon/road-click.png',
          text: '路线',
          pagePath: '/pages/index/index'
        },
        {
          iconPath: '/static/icon/option.png',
          selectedIconPath: '/static/icon/option-click.png',
          text: '工具',
          pagePath: '/pages/option/option'
        }
      ]
    }
  },
  methods: {
    goRoute (path) {
      uni.navigateTo({
        url: path
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
  margin: 20rpx;
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  align-items: center;
  .option-title{
    display: flex;
  }

}
</style>
