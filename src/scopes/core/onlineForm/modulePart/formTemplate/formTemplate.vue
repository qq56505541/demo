<template>
  <div class="fit">
    <ta-border-layout :layout="layout" :center-cfg="centerCfg" :footer-cfg="{showBorder: false}">
      <ta-input-search
        slot="header"
        placeholder="请输入模板信息"
        class="search-box"
        @search="onSearch"
        v-model="searchInfo"
        enter-button="搜索"
      />
      <div slot="centerExtraContent">
        <ta-tag-select
          title="有效性"
          :data="CollectionData('EFFECTIVE')"
          v-model="templateEffectiveList"
          @change="onSearch"
          class="filter-name"
        />
        <ta-tag-select
          title="模板类型"
          :data="CollectionData('TEMPLATETYPE')"
          v-model="templateTypeList"
          @change="onSearch"
          class="filter-name"
        />
        <div style="float: right">
          <ta-button type="primary" @click="initData = {}; operateType = '1'; editDrawerVisible = true">
            新增模板
          </ta-button>
          <ta-dropdown :trigger="['click']">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="btnDisable">
                <ta-popconfirm title="确认启用所选模板?" cancel-text="取消" ok-text="确认" @confirm="handleBatchEnableTemplates">
                  <ta-icon type="check-circle" />
                  <span style="margin-left: 12px">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider />
              <ta-menu-item :disabled="btnDisable">
                <ta-popconfirm title="确认禁用所选模板?" cancel-text="取消" ok-text="确认" @confirm="handleBatchDisableTemplates">
                  <ta-icon type="stop" />
                  <span style="margin-left: 12px">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider />
              <ta-menu-item :disabled="btnDisable" @click="deleteVisible = true">
                <ta-icon type="close-circle" />
                删除
              </ta-menu-item>
            </ta-menu>
            <ta-button>
              批量操作
              <ta-icon type="down" />
            </ta-button>
          </ta-dropdown>
        </div>
      </div>
      <ta-table
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: handleSelectChange}"
        :columns="columns"
        :data-source="templateData"
      >
        <span slot="effective" slot-scope="text">{{ CollectionLabel('EFFECTIVE', text) }}</span>
        <span slot="operate" slot-scope="text, record">
          <ta-tooltip placement="top">
            <span slot="title">{{ record.templateId }}</span>
            <a :class="`copy-${record.templateId}`" @click="handleCopyId(record)" style="user-select: none">复制ID</a>
          </ta-tooltip>
          <ta-divider type="vertical" />
          <ta-table-operate style="display: inline-block" :operate-menu="operateMenu" />
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right;margin-top: 10px"
          :data-source.sync="templateData"
          :params="params"
          url="onlineForm/templateMg/templateMgRestService/queryTemplate"
          ref="gridPager"
        />
      </div>
    </ta-border-layout>
    <ta-drawer
      width="500px"
      :title="`${getOperateType}模板`"
      :visible="editDrawerVisible"
      :destroy-on-close="true"
      @close="editDrawerVisible = false"
    >
      <ta-form :auto-form-create="(form)=>{this.form = form}">
        <ta-form-item
          label="模板名称"
          field-decorator-id="templateName"
          :init-value="this.initData.templateName ? this.initData.templateName : ''"
          :require="{message:'请输入模板名称'}"
        >
          <ta-input placeholder="请输入模板名称" />
        </ta-form-item>
        <ta-form-item
          label="模板类型"
          field-decorator-id="templateType"
          :init-value="this.initData.templateType ? this.initData.templateType : undefined"
          :require="{message:'请输入模板类型'}"
        >
          <ta-select :disabled="this.operateType === '2'" placeholder="请选择模板类型" collection-type="TEMPLATETYPE" style="width: 100%" mode="defaullt" />
        </ta-form-item>
        <ta-form-item
          label="模板介绍"
          field-decorator-id="templateIntro"
          :init-value="this.initData.templateIntro ? this.initData.templateIntro : ''"
          :require="{message:'请输入模板介绍'}"
        >
          <ta-textarea :rows="4" placeholder="请输入模板介绍" />
        </ta-form-item>
      </ta-form>
      <div slot="footer" style="text-align: center">
        <ta-button type="primary" @click="handleSaveTemplateInfo">
          保存
        </ta-button>
        <ta-button @click="editDrawerVisible = false">
          取消
        </ta-button>
      </div>
    </ta-drawer>
    <ta-drawer
      title="预览"
      :width="this.previewData && this.previewData.formConfig && this.previewData.formConfig.previewDrawerWidth ? this.previewData.formConfig.previewDrawerWidth : '800px'"
      placement="right"
      :closable="true"
      @close="previewDrawerVisible = false"
      :visible="previewDrawerVisible"
      v-if="previewDrawerVisible"
      :destroy-on-close="true"
    >
      <form-generator :init-data="this.previewData" />
    </ta-drawer>
    <ta-careful-delete
      :visible="deleteVisible"
      @close="deleteVisible = false"
      @delete="handleBatchDeleteTemplates"
      title="模板删除"
      description="选中模板"
    />
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import API from './api'
import formGenerator from '../formMaker/packages/formGenerator'

const columns = [{
  title: '模板名称',
  width: '20%',
  dataIndex: 'templateName',
}, {
  title: '模板类型',
  width: '20%',
  dataIndex: 'templateType',
  collectionType: 'TEMPLATETYPE',
}, {
  title: '说明',
  width: '20%',
  overflowTooltip: true,
  dataIndex: 'templateIntro',
}, {
  title: '有效性',
  width: '15%',
  dataIndex: 'effective',
  yesOrNoTag: true,
  scopedSlots: { customRender: 'effective', },
}, {
  title: '操作',
  width: '25%',
  dataIndex: 'operate',
  scopedSlots: { customRender: 'operate', },
}]
export default {
  name: 'FormTemplate',
  components: { formGenerator, },
  data () {
    return {
      templateData: [],
      columns,
      layout: {
        header: '70px',
        footer: '70px',
      },
      centerCfg: {
        showBar: true,
        toolBarStyle: { height: '50px', lineHeight: '48px', },
      },
      searchInfo: '',
      templateEffectiveList: [],
      templateTypeList: [],
      selectedRowKeys: [],
      selectedRows: [],
      deleteVisible: false,
      operateType: '1',
      editDrawerVisible: false,
      initData: {},
      form: {},
      previewData: {},
      previewDrawerVisible: false,
      operateMenu: [{
        name: '编辑',
        disabled: (record) => {
          return record.effective === '0'
        },
        title: (record) => record.effective === '0' ? '禁用的模板不允许编辑' : '',
        onClick: (record, index) => {
          this.operateType = '2'
          this.editDrawerVisible = true
          this.initData = record
        },
      }, {
        name: '定制',
        disabled: (record) => {
          return record.effective === '0'
        },
        title: (record) => record.effective === '0' ? '禁用的模板不允许定制' : '',
        onClick: (record, index) => {
          this.handleCustomMadeTemplate(record)
        },
      }, {
        name: '预览',
        onClick: (record, index) => {
          if (record.templateType === '1') {
            this.previewDrawerVisible = true
            this.previewData = JSON.parse(record.templateContent)
          }
          if (record.templateType === '2') {
            window.parent.indexTool.closeTabMenu('devTemplatePreview')
            window.parent.indexTool.openTabMenu({
              id: 'devTemplatePreview',
              name: '定制管理页面模板',
              url: `onlineDev.html#/onlinePage?id=${record.templateId}`,
            })
          }
        },
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该模板?',
          onOk: (record) => {
            if (record.effective === '1') {
              this.$message.warn('该模板已经是启用状态')
              return
            }
            this.handleEnableTemplates(record.templateId, 1)
          },
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该模板?',
          onOk: (record) => {
            if (record.effective === '0') {
              this.$message.warn('该模板已经是禁用状态')
              return
            }
            this.handleDisableTemplates(record.templateId, 1)
          },
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该模板？',
          onOk: (record) => {
            this.handleDeleteTemplate(record.templateId, 1)
          },
        }],
      }],
      templateStorage: null,
    }
  },
  created () {
    this.templateStorage = TaUtils.webStorage.createWebStorage('templateStorage')
  },
  mounted () {
    this.$refs.gridPager.loadData()
  },
  computed: {
    btnDisable () {
      return !this.selectedRowKeys.length
    },
    getOperateType () {
      if (this.operateType === '1') {
        return '新增'
      } else {
        return '编辑'
      }
    },
  },
  watch: {
    $route: {
      handler (val, oldVal) {
        const editTemplate = this.templateStorage.get('editTemplate')
        if (oldVal.query._modulePartId_ === 'formTemplateModify' && !editTemplate) {
          this.$refs.gridPager.loadData()
        }
      },
    },
  },
  methods: {
    params () {
      return {
        templateName: this.searchInfo || '',
        templateType: this.templateTypeList.join(','),
        effective: this.templateEffectiveList.join(','),
      }
    },
    onSearch () {
      this.$refs.gridPager.loadData()
    },
    handleSaveTemplateInfo () {
      this.form.validateFieldsAndScroll(error => {
        if (!error) {
          const formData = this.form.getFieldsValue()
          if (this.operateType === '1') {
            API.insertTemplate(Object.assign({}, formData, { templateContent: JSON.stringify({}), })).then(res => {
              this.$message.success('新增模板成功')
              this.editDrawerVisible = false
              this.$refs.gridPager.loadData()
            })
          } else {
            Base.submit(null, {
              url: 'onlineForm/templateMg/templateMgRestService/updateTemplate',
              data: Object.assign({}, this.initData, formData),
            }).then(res => {
              this.$message.success('修改模板信息成功')
              this.editDrawerVisible = false
              this.$refs.gridPager.loadData()
            })
          }
        }
      })
    },
    handleCustomMadeTemplate (record) {
      if (record.templateType === '2') {
        this.templateStorage.set('editTemplate', record)
        this.templateStorage.set('editTemplateModuleInfo', JSON.stringify({
          id: this.$route.query._modulePartId_,
          url: 'onlineForm.html#/formTemplate',
        }))
        window.parent.indexTool.closeTabMenu('devTemplateModify')
        window.parent.indexTool.openTabMenu({
          id: 'devTemplateModify',
          name: '定制管理页面模板',
          url: 'onlineDev.html#/onlineDesign',
        })
      }
      if (record.templateType === '1') {
        this.templateStorage.set('editTemplate', record)
        this.templateStorage.set('editTemplateModuleInfo', JSON.stringify({
          id: this.$route.query._modulePartId_,
          url: 'onlineForm.html#/formTemplate',
        }))
        window.parent.indexTool.closeTabMenu('formTemplateModify')
        window.parent.indexTool.openTabMenu({
          id: 'formTemplateModify',
          name: '定制表单模板',
          url: 'onlineForm.html#/formMaker',
        })
      }
    },
    handleBatchEnableTemplates () {
      const ids = this.selectedRows.map(item => item.templateId).join(',')
      this.handleEnableTemplates(ids, this.selectedRowKeys.length)
    },
    handleBatchDisableTemplates () {
      const ids = this.selectedRows.map(item => item.templateId).join(',')
      this.handleDisableTemplates(ids, this.selectedRowKeys.length)
    },
    handleBatchDeleteTemplates () {
      const ids = this.selectedRows.map(item => item.templateId).join(',')
      this.handleDeleteTemplate(ids, this.selectedRowKeys.length)
    },
    handleEnableTemplates (ids, operateNum) {
      API.updateTemplateEffective({ templateIds: ids, effective: '1', }).then(res => {
        if (res.data.resultData === operateNum) {
          this.$message.success('启用成功')
        } else if (res.data.resultData < operateNum && res.data.resultData > 0) {
          this.$message.warn('部分启用成功')
        } else {
          this.$message.error('启用失败')
        }
        this.$refs.gridPager.loadData()
      })
    },
    handleDisableTemplates (ids, operateNum) {
      API.updateTemplateEffective({ templateIds: ids, effective: '0', }).then(res => {
        if (res.data.resultData === operateNum) {
          this.$message.success('禁用成功')
        } else if (res.data.resultData < operateNum && res.data.resultData > 0) {
          this.$message.warn('部分禁用成功')
        } else {
          this.$message.warn('禁用失败')
        }
        this.$refs.gridPager.loadData()
      })
    },
    handleDeleteTemplate (ids, operateNum) {
      API.deleteTemplates({ templateIds: ids, }).then(res => {
        if (res.data.resultData === operateNum) {
          this.$message.success('删除成功')
        } else if (res.data.resultData < operateNum && res.data.resultData > 0) {
          this.$message.warn('部分删除成功')
        } else {
          this.$message.warn('禁用失败')
        }
        this.deleteVisible = false
        this.$refs.gridPager.loadData()
      })
    },
    handleSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleCopyId (record) {
      const clipboard = new Clipboard(`.copy-${record.templateId}`, {
        text: () => record.templateId,
      })
      clipboard.on('success', () => {
        this.$message.success('复制模板ID成功')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        this.$message.error('该浏览器不支持自动复制，请进入控制台手动复制模板ID')
        clipboard.destroy()
        console.log(`模板ID：${record.templateId}`)
      })
    },
  },
}
</script>
<style scoped lang="less" type="text/less">
.search-box {
  margin-top: 10px;
  width: 340px;
  margin-left: 50%;
  transform: translateX(-50%);
}

.filter-name {
  margin-left: 20px
}
</style>
