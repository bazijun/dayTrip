<template>
  <view v-html="document"></view>
</template>

<script>
import { markdown } from './markdown.js'
export default {
  computed: {
    document () {
      return markdown
    }
  }
}
</script>

<style>
  page {
    background-color: #fff;
  }
</style>
