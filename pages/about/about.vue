<template>
  <div class="about-box">
        <image class="theme-img" src="/static/logo.png" />
        <div>多路优选 v0.1 beta</div>
        <div class="theme-color">—— 一款单日多目的地， 行程规划APP ——</div>
        <div class="warn-box">
          免责声明: 现为测试的第一版，不要太迷信app给出的路程，目标过多请谨慎使用，还处于优化阶段。
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
  color: #666666;
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
