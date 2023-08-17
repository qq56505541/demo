<template>
  <ta-drawer title="更新自定义资源类型" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div  style="padding: 10px 10px 0 20px; overflow-y: auto;" v-html="this.msg" ></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showEditCustomResourceCategory',
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
          const customResourceCategory = {
            categoryName: '类别名称',
            code: '类别编码',
            categoryContent: '类别描述',
            effective: '有效标识',
          }
          // 构建table
          this.msg = '<table class=\'gridtable\' style=\'width: 100%; height: 100%\'>' +
            '<tr><th>数据项</th><th>原数据</th><th>更新后数据</th></tr>'
          Object.keys(customResourceCategory).forEach(field => {
            let beforeData = ''; let afterData = ''
            if (field === 'effective') {
              beforeData = result.data.before[field] === '1' ? '有效' : '无效'
              afterData = result.data.after[field] === '1' ? '有效' : '无效'
            } else {
              beforeData = result.data.before[field] === undefined ? '' : result.data.before[field]
              afterData = result.data.after[field] === undefined ? '' : result.data.after[field]
            }
            // 突出显示
            if (beforeData !== afterData) {
              this.msg = this.msg + '<tr class="trstess"><td>' + customResourceCategory[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            } else {
              this.msg = this.msg + '<tr><td>' + customResourceCategory[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
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
