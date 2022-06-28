<template>
  <towxml :nodes="document"></towxml>
</template>

<script>
import { markdown } from './markdown.js'
import towxml from '../../static/towxml/towxml'
const towxmlInstance = require('../../static/towxml/index.js')
export default {
  data () {
    return {
      document: null
    }
  },
  components: { towxml },
  onshow () {
    console.log('[why??]===>🚀')
    this.document = towxmlInstance(markdown, 'markdown')
    console.log('[document]===>🚀', this.document)
  }
}
</script>

<style>
page {
  background-color: #fff;
}
</style>
