<template>
  <div class="about-box">
        <image class="theme-img" src="/static/logo.png" />
        <div>多路优选 v1.0 beta</div>
        <div class="theme-color">—— 一款单日多目的地， 行程规划APP ——</div>
        <div class="warn-box">
          不免责声明: 不精准我全责。<br/>
          <view class="margin-top-lg"></view>
          提需求和吐槽： <br/>
          qq：1324022569 Wx：bazijunsd
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
    position: absolute;
    bottom: 100rpx;
    left: 0;
    right:0;
  }
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
