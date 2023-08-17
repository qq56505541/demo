<template>
  <div class="fit form-designer">
    <ta-border-layout
      :show-border="false"
      :layout="{left:'270px',right:'375px'}"
      :left-cfg="{showBorder: false,layoutConStyle:{padding: '0px'}}"
      :right-cfg="{showBorder: false, layoutConStyle: { borderLeft: '1px solid #dcdcdc' }, showBar: true, barHeight:'50px',toolBarStyle: {borderBottom: '1px solid #dcdcdc', borderLeft: '1px solid #dcdcdc'}}"
      :center-cfg="{showBar: true, layoutConStyle: { borderLeft: '1px solid #dcdcdc',minWidth:'450px' },barHeight:'50px',toolBarStyle: {borderBottom: '1px solid #dcdcdc',minWidth:'450px', borderLeft: '1px solid #dcdcdc'}}"
    >
      <div slot="left" class="fit">
        <div class="fields-list">
          <ta-tabs default-active-key="1" class="fit" :tab-bar-style="{height: '50px', borderBottom: '1px solid #dcdcdc'}">
            <ta-tab-pane tab="基础组件库" key="1">
              <div
                v-for="(field, index) in fields"
                :key="index"
              >
                <div v-if="!field.disabled">
                  <div class="field-title">
                    {{ field.title }}
                  </div>
                  <draggable
                    tag="ul"
                    :list="field.list"
                    :group="{ name: 'form', pull: 'clone', put: false }"
                    ghost-class="label-ghost"
                    :sort="false"
                  >
                    <li
                      class="field-label"
                      v-for="(item, index) in field.list"
                      :key="index"
                    >
                      <a>
                        <span v-if="!item.disabled">{{ item.label }}</span>
                        <span v-else>{{ item.label+'(UI未支持)' }}</span>
                      </a>
                    </li>
                  </draggable>
                </div>
                <div v-else>
                  <div class="field-title">
                    {{ field.title }}
                    <span class="danger">（开发中）</span>
                  </div>
                  <ul>
                    <li
                      class="field-label-disabled"
                      v-for="(item, index) in field.list"
                      :key="index"
                    >
                      <a>
                        <span>{{ item.label }}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </ta-tab-pane>
            <ta-tab-pane v-if="this.$slots.customFields" tab="Custom" key="custom" style="overflow: auto">
              <slot name="customFields" />
            </ta-tab-pane>
          </ta-tabs>
        </div>
      </div>
      <div slot="centerExtraContent">
        <span style="margin-left: 10px;font-weight: bold;line-height: 48px">工作区</span>
        <ta-button-group style="float: right;line-height: 48px">
          <ta-button @click="formConfigVisible = true">
            表单配置
          </ta-button>
          <ta-button @click="importDrawerVisible = true">
            导入
          </ta-button>
          <ta-dropdown>
            <ta-button>
              保存
            </ta-button>
            <ta-menu slot="overlay">
              <ta-menu-item @click="fnOnFormExport">
                <a href="javascript:;">操作JSON数据</a>
              </ta-menu-item>
              <ta-menu-item @click="fnOnFormExportGenerate">
                <a href="javascript:;">保存到后端</a>
              </ta-menu-item>
              <ta-menu-item @click="fnOnGenerateSourceCode">
                <a href="javascript:;">生成源文件</a>
              </ta-menu-item>
            </ta-menu>
          </ta-dropdown>
          <ta-button @click="fnOnFormPreview">
            预览
          </ta-button>
          <ta-button :ghost="true" type="danger" @click="fnOnFormReset">
            重置
          </ta-button>
        </ta-button-group>
      </div>
      <div>
        <form-widget
          :form-config.sync="formData.formConfig"
          :form-columns.sync="formData.formColumns"
          :select.sync="widgetFormSelect"
        />
      </div>
      <div slot="rightExtraContent">
        <span style="margin-left: 10px;font-weight: bold;line-height: 48px">属性</span>
      </div>
      <div slot="right">
        <form-item-config :form-item-config.sync="widgetFormSelect" />
      </div>
    </ta-border-layout>

    <ta-drawer
      title="表单设置"
      :width="'500px'"
      placement="right"
      :closable="false"
      @close="formConfigVisible = false"
      :visible="formConfigVisible"
      :destroy-on-close="true"
    >
      <form-config :form-config.sync="formData.formConfig" />
    </ta-drawer>

    <ta-drawer
      title="导入"
      :width="'800px'"
      placement="right"
      :closable="false"
      @close="importDrawerVisible = false"
      :visible="importDrawerVisible"
      :destroy-on-close="true"
    >
      <v-json-editor v-model="widgetFormImport" :options="{mainMenuBar: false,mode: 'code'}" height="100%" />
      <div slot="footer" style="text-align: center">
        <ta-button type="primary" style="width: 150px" @click="fnOnFormImport">
          导入
        </ta-button>
      </div>
    </ta-drawer>

    <ta-drawer
      title="查看JSON"
      :width="'800px'"
      placement="right"
      :closable="false"
      @close="exportDrawerVisible = false"
      :visible="exportDrawerVisible"
      :destroy-on-close="true"
    >
      <v-json-editor v-model="widgetFormPreview" :options="{mainMenuBar: false,mode: 'code'}" height="100%" />
      <div slot="footer" style="text-align: center">
        <ta-button type="primary" style="width: 150px" class="copy" @click="fnOnFormExportCopy">
          复制
        </ta-button>
      </div>
    </ta-drawer>

    <ta-drawer
      title="预览"
      :width="`${formConfig.previewDrawerWidth}px`"
      placement="right"
      :closable="true"
      @close="previewDrawerVisible = false"
      :visible="previewDrawerVisible"
      :destroy-on-close="true"
    >
      <form-generator :init-data="widgetFormPreview" :module-part-id="this.modulePartId" />
    </ta-drawer>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import VJsonEditor from 'v-jsoneditor'
import Clipboard from 'clipboard'
import formWidget from './formWidget'
import formConfig from './formConfig'
import formGenerator from './formGenerator'
import fields from './fieldsConfig.js'
import formItemConfig from './formItemConfig'
import { generateSourceFile, } from './generateCode'
import { isEmpty, } from '@yh/ta-utils'

export default {
  name: 'FormDesigner',
  components: { formGenerator, draggable, formWidget, formConfig, formItemConfig, VJsonEditor, },
  props: {
    // 初始化的数据
    initData: {
      type: Object,
    },
    // 请求的modulePartId
    modulePartId: {
      type: String,
      required: true,
    },
  },
  data () {
    // form整体默认config
    const formConfig = {
      layout: 'horizontal',
      labelCol: 6,
      wrapperCol: 18,
      gutter: 0,
      previewDrawerWidth: 800,
      showButton: true,
    }
    return {
      fields, // 基础组件配置list
      formConfigVisible: false, // form整体配置drawer的visible属性
      formConfig, // form整体默认config
      formData: isEmpty(this.initData) ? {
        formConfig,
        formColumns: [],
      } : JSON.parse(JSON.stringify(this.initData)), // 根据传入的initData进行初始化formData
      widgetFormSelect: {}, // 当前选中的form-item的config
      importDrawerVisible: false, // 导入drawer的visible属性
      widgetFormImport: {}, // 导入的formData
      exportDrawerVisible: false, // 导出drawer的visible属性
      widgetFormPreview: {}, // 预览时的formData
      previewDrawerVisible: false, // 预览drawer的visible属性
      clipboard: null, // 剪切板
    }
  },
  watch: {
    initData: {
      // 侦听接收的initData参数
      deep: true,
      immediate: true,
      handler (val) {
        // initData变化，重新设置formData
        this.formData = isEmpty(val) ? {
          formConfig: this.formConfig,
          formColumns: [],
        } : JSON.parse(JSON.stringify(val))
        // 重新请求formData中每一个form-item的远程数据
        this.initRemoteData()
        // 清除选中
        this.widgetFormSelect = {}
      },
    },
  },
  methods: {
    // 初始化远程数据
    initRemoteData () {
      // 递归寻找请求结果函数
      const getData = (obj, dataName) => {
        let res
        const tempArr = Object.getOwnPropertyNames(obj)
        if (tempArr.includes(dataName)) {
          return obj[dataName]
        } else {
          for (let i = 0; i < tempArr.length; i++) {
            if (res) return res
            res = getData(obj[tempArr[i]], dataName)
            if (res) return res
          }
        }
      }

      this.formData.formColumns.forEach(item => {
        // 将被转义字符替换回来
        if (item.params) {
          item.params = item.params.replace(/&#x27;/g, '\'')
        }
        if (item.rules) {
          item.rules = item.rules.replace(/&#x27;/g, '\'')
        }
        // 若存在远程数据，则请求
        if (item.dataType === 'remote') {
          Base.submit(null, {
            url: item.url,
            data: JSON.parse(item.params.replace(/'/g, '"')) || {}, // JSON字符串需要用"双引号
            _modulePartId_: this.modulePartId,
          }).then(res => {
            this.$nextTick(() => {
              item.remoteData = getData(res, item.resName)
            })
          }).catch(e => {
            this.$nextTick(() => {
              item.remoteData = []
            })
          })
        }
      })
    },
    // 导入
    fnOnFormImport () {
      this.formData = this.widgetFormImport
      this.widgetFormImport = {}
      this.importDrawerVisible = false
    },
    // 导出drawer展开，展示json数据
    fnOnFormExport () {
      const tempData = JSON.parse(JSON.stringify(this.formData))
      tempData.formColumns.forEach(item => {
        delete item.remoteData
      })
      this.widgetFormPreview = tempData
      this.exportDrawerVisible = true
    },
    // 隐藏导出drawer，emit保存事件
    fnOnFormExportGenerate () {
      this.exportDrawerVisible = false
      const tempData = JSON.parse(JSON.stringify(this.formData))
      tempData.formColumns.forEach(item => {
        delete item.remoteData
      })
      this.$emit('saveTemplate', { templateContent: JSON.stringify(tempData), })
    },
    // 导出drawer复制按钮回调函数，构造剪切板实例，复制JSON
    fnOnFormExportCopy () {
      this.clipboard = new Clipboard('.copy', {
        text: () => JSON.stringify(this.widgetFormPreview, null, 2),
      })
      this.clipboard.on('success', () => {
        this.$message.success('复制成功')
        this.clipboard.destroy()
      })
      this.clipboard.on('error', () => {
        this.$message.error('该浏览器不支持自动复制')
        this.clipboard.destroy()
      })
    },
    // 初始化数据，预览
    fnOnFormPreview () {
      this.initRemoteData()
      this.widgetFormPreview = JSON.parse(JSON.stringify(this.formData))
      this.previewDrawerVisible = true
    },
    // 清空工作区
    fnOnFormReset () {
      if (this.formData && this.formData.formColumns && this.formData.formColumns.length > 0) {
        this.$confirm({
          title: '警告',
          content: '确定要清空吗？',
          onOk: () => {
            this.formData = { formConfig: this.formConfig, formColumns: [], }
            this.widgetFormSelect = {}
          },
        })
      } else this.$message.warn('没有需要清空的内容')
    },
    fnOnGenerateSourceCode () {
      generateSourceFile(this.formData)
    },
  },
}
</script>

<style lang="less">
@import "./style/index";
</style>
