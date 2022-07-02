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
  mounted () {
    this.document = towxmlInstance(markdown, 'markdown')
  },
  onshow () {
  }
}
</script>

<style>
page {
  background-color: #fff;
}
</style>
