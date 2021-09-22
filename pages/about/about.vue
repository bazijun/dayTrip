<template>
  <view>
    你好，这是关于
    <u-tabbar :list="tabbar" active-color="#1F82FF"></u-tabbar>
  </view>
</template>

<script>
export default {
  data () {
    return {
      tabbar: [
        {
          iconPath: '/static/icon/road.png',
          selectedIconPath: '/static/icon/road-click.png',
          text: '路线',
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
  methods: {}
}
</script>

<style>

</style>
