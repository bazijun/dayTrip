<template>
 <view>
   <view v-html="document"></view>
 </view>
</template>

<script>
import { markdown } from './markdown.js'
export default {
  data () {
    return {
    }
  },
  computed: {
    document () {
      return markdown
    }
  }
}
</script>

<style>

</style>
