<template>
  <div class="fit">
    <form-designer @saveTemplate="saveTemplate" :init-data="initData" :module-part-id="modulePartId">
      <template slot="customFields">
        <custom-fields-list />
      </template>
    </form-designer>
  </div>
</template>

<script>
import customFieldsList from './packages/custom/customFieldsList.vue'

export default {
  name: 'FormMaker',
  components: { customFieldsList, },
  data () {
    return {
      templateStorage: null,
      initData: {},
      isEdit: false,
      modulePartInfo: {
        id: '',
        url: '',
      },
    }
  },
  created () {
    this.templateStorage = TaUtils.webStorage.createWebStorage('templateStorage')
    this.initData = JSON.parse(this.templateStorage.get('editTemplate').templateContent)
    this.modulePartInfo = JSON.parse(this.templateStorage.get('editTemplateModuleInfo'))
  },
  activated () {
    this.initData = JSON.parse(this.templateStorage.get('editTemplate').templateContent)
  },
  computed: {
    modulePartId () {
      return this.modulePartInfo?.id || ''
    },
  },
  methods: {
    saveTemplate (data) {
      const editTemplate = this.templateStorage.get('editTemplate')
      Base.submit(null, {
        url: 'onlineForm/templateMg/templateMgRestService/updateTemplate',
        _modulePartId_: this.modulePartId,
        data: Object.assign({}, editTemplate, data),
      }).then(res => {
        this.templateStorage.remove('editTemplate')
        window.parent.indexTool.closeTabMenu('formTemplateModify')
        window.parent.indexTool.openTabMenu({ id: this.modulePartInfo.id, url: this.modulePartInfo.url, })
        this.$message.success('定制模板成功')
      })
    },
  },
}
</script>

<style scoped>

</style>
