<template>
  <div class="about-box">
        <image class="theme-img" src="/static/logo.png" />
        <div>多路优选<span class="edition">v1.5</span></div>
        <div class="theme-color">—— 一款单日多目的地， 行程规划APP ——</div>
        <div class="warn-box">
          <!-- 不免责声明: 不精准我全责。<br/> -->
          欢迎提需求与吐槽：ヾ(≧▽≦*)o
          <view class="margin-top-lg"></view>
          Wx：bazijunsd qq：1324022569
        </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.about-box{
  text-align: center;
  padding: 30rpx;
  position: relative;
  height: 100vh;
  color: rgb(184, 184, 184);
  .warn-box{
    padding: 30rpx;
    margin-top: 20rpx;
    position: absolute;
    bottom: 100rpx;
    left: 0;
    right:0;
  }
}

.edition {
  color: red;
  padding-left: 10rpx;
}

/* 工具类 */
.text-Focus {
  font-weight: bold;
}
.theme-color {
  margin-top: 40rpx;
  color: $theme-color;
}
</style>
