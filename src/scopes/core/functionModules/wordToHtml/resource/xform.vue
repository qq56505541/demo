<template>
  <div v-html="str"></div>
</template>
<script>
require('./xform.css')
require('./bootstrap.min.css')
require('./jquery.min.js')
require('./bootstrap.min.js')
import xform from './xform.js'
export default {
  name: 'xform',
  props: {
    str: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: '{}',
    },
  },
  mounted () {
    this.setValue(this.defaultValue)
  },
  methods: {
    setValue (value) {
      xform.setFormValue(value)
    },
    getValue () {
      return xform.getFormValue()
    },
  },
}
</script>

<style scoped>

</style>
