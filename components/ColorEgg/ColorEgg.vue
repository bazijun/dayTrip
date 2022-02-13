<template>
  <view>
    <u-modal
      v-model="show"
      @confirm="$emit('nextFn')"
      confirm-text="确定"
      :title="info.title"
    >
      <view class="img-box">
        <image :src="info.body" mode="widthFix"/>
      </view>
      <view class="msg-box">{{info.msg}}</view>
    </u-modal>
  </view>
</template>

<script>
// ✨✨✨ //
export default {
  props: {
    Keys: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      info: {},
      show: false,
      colorEggList: [
        {
          key: '红玫瑰',
          title: 'bingo！',
          msg: '为了传达这首歌，我们不停歌唱',
          body: '/static/colorEgg/red-rose.jpg'
        },
        {
          key: 'psy',
          title: 'bingo！',
          msg: '(ฅ´ω`ฅ)',
          body: '/static/colorEgg/love.jpg'
        }
      ]
    }
  },
  methods: {
    identify () {
      this.info = this.colorEggList.find((v) => v.key === this.Keys.trim())
      this.info?.key ? (this.show = true) : (this.show = false)
      return !!this.info?.key
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
  box-sizing: border-box;
  width: 500rpx;
  height: 500rpx;
  overflow: hidden;
  background-color: #F6F7F9;
  margin: 20rpx auto;
  padding: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  image{
    width: 350rpx;
  }
}
.msg-box {
    width: 450rpx;
    margin: auto;
    padding-bottom: 15rpx;
    text-align: center;
    font-size: 26rpx;
    color: #666666;
  }
</style>
