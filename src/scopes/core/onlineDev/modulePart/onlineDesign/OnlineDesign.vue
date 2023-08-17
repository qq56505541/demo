<template>
  <div class="fit">
    <design @saveTemplate="saveTemplate" />
  </div>
</template>

<script>
import design from './packages/Design'

export default {
  name: 'OnlineDesign',
  components: { design, },
  data () {
    return {
      templateStorage: null,
      initData: {},
      modulePartInfo: null,
    }
  },
  created () {
    this.templateStorage = TaUtils.webStorage.createWebStorage('templateStorage')
    this.initData = JSON.parse(this.templateStorage.get('editTemplate').templateContent)
    this.modulePartInfo = JSON.parse(this.templateStorage.get('editTemplateModuleInfo'))
    this.initData.formTemplate && this.$store.dispatch('design/setFormTemplate', this.initData.formTemplate)
    this.initData.tableColumns && this.$store.dispatch('design/setTableColumns', this.initData.tableColumns)
    this.initData.apis && this.$store.dispatch('design/setApis', this.initData.apis)
    this.initData.tableName && this.$store.dispatch('design/setTableName', this.initData.tableName)
    this.initData.primaryKey && this.$store.dispatch('design/setPrimaryKey', this.initData.primaryKey)
    const chosenFeats = []
    if (this.initData.featData) {
      for (const [key, value] of Object.entries(this.initData.featData)) {
        if (value !== null) {
          chosenFeats.push(key)
        }
      }
    }
    chosenFeats && this.$store.dispatch('design/setChosenFeats', chosenFeats)
    this.initData.featData && this.$store.dispatch('design/setFeatData', this.initData.featData)
  },
  methods: {
    saveTemplate (data) {
      const editTemplate = this.templateStorage.get('editTemplate')
      Base.submit(null, {
        url: 'onlineForm/templateMg/templateMgRestService/updateTemplate',
        _modulePartId_: this.modulePartInfo.id,
        data: Object.assign({}, editTemplate, data),
      }).then(res => {
        this.templateStorage.remove('editTemplate')
        window.parent.indexTool.closeTabMenu('devTemplateModify')
        window.parent.indexTool.openTabMenu({ id: this.modulePartInfo.id, url: this.modulePartInfo.url, })
        top.window.message.success('定制模板成功')
      })
    },
  },
}
</script>
