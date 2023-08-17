<template>
  <ta-drawer title="更新自定义资源" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div  style="padding: 10px 10px 0 20px; overflow-y: auto;" v-html="this.msg" ></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showEditCustomResource',
  props: ['visible', 'rowData'],
  data () {
    return {
      msg: '',
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          const customResource = {
            resourceName: '资源名称',
            code: '自定义编码',
            resourceContent: '自定义资源内容',
            system: '所属系统',
          }
          // 构建table
          this.msg = '<table class=\'gridtable\' style=\'width: 100%; height: 100%\'>' +
            '<tr><th>数据项</th><th>原数据</th><th>更新后数据</th></tr>'
          Object.keys(customResource).forEach(field => {
            const beforeData = result.data.before[field] === undefined ? '' : result.data.before[field]
            const afterData = result.data.after[field] === undefined ? '' : result.data.after[field]
            // 突出显示
            if (beforeData !== afterData) {
              this.msg = this.msg + '<tr class="trstess"><td>' + customResource[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            } else {
              this.msg = this.msg + '<tr><td>' + customResource[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            }
          })
          this.msg = this.msg + '</table>'
        })
      }
    },
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
    },
  },
}
</script>
