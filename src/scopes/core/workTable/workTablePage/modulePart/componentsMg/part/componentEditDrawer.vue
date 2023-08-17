<template>
  <div>
    <ta-drawer
      :title="operateType?'新增组件':'编辑组件'"
      width="540"
      placement="right"
      :destroy-on-close="true"
      :closable="true"
      @close="$emit('update:visible', false)"
      :visible="visible"
    >
      <div id="restUrlSelectTagContainer">
        <ta-form :auto-form-create="(form1)=>{this.form = form1}">
          <ta-row>
            <ta-col :span="24">
              <ta-form-item
                label="组件名称"
                field-decorator-id="name"
                :init-value="formInitValue.name"
                :require="{message:'请输入组件名称!'}"
              >
                <ta-input placeholder="请输入组件名称" />
              </ta-form-item>
            </ta-col>
          </ta-row>
          <ta-row>
            <ta-col :span="24">
              <ta-form-item
                label="组件文件名称"
                field-decorator-id="url"
                :init-value="formInitValue.url"
                :require="{message:'请选择组件文件名称!'}"
              >
                <ta-select
                  show-search
                  allow-clear
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  placeholder="请输入组件名称"
                >
                  <ta-select-option v-for="item in files" :key="item.slice(2 , item.length - 4)">
                    {{ item.slice(2 , item.length - 4) }}
                  </ta-select-option>
                </ta-select>
              </ta-form-item>
            </ta-col>
          </ta-row>
          <ta-row>
            <ta-col :span="24">
              <ta-form-item
                label="后台RestURL"
                :init-value="formInitValue.restUrl"
                field-decorator-id="restUrl"
              >
                <rest-url-select-tag new-label="添加服务" />
              </ta-form-item>
            </ta-col>
          </ta-row>
          <ta-row>
            <ta-col :span="24">
              <ta-form-item
                label="组件类型"
                :init-value="formInitValue.resourceType"
                field-decorator-id="resourceType"
                :require="{message:'请选择组件类型!'}"
              >
                <ta-radio-group button-style="solid">
                  <ta-radio-button value="0">
                    普通组件
                  </ta-radio-button>
                  <ta-radio-button value="3">
                    审核组件
                  </ta-radio-button>
                  <ta-radio-button value="4">
                    审计组件
                  </ta-radio-button>
                </ta-radio-group>
              </ta-form-item>
            </ta-col>
          </ta-row>
          <ta-row>
            <ta-col :span="24">
              <ta-form-item
                label="安全策略"
                :init-value="formInitValue.securityPolicy"
                field-decorator-id="securityPolicy"
                :require="{message:'请选择安全策略!'}"
              >
                <ta-radio-group button-style="solid">
                  <ta-radio-button value="0">
                    无需登录可访问
                  </ta-radio-button>
                  <ta-radio-button value="1">
                    登录均可访问
                  </ta-radio-button>
                  <ta-radio-button value="2">
                    授权可访问
                  </ta-radio-button>
                </ta-radio-group>
              </ta-form-item>
            </ta-col>
          </ta-row>
          <ta-row>
            <ta-col :span="24">
              <ta-form-item
                label="安全认证级别"
                :init-value="`${formInitValue.securityLevel}`"
                field-decorator-id="securityLevel"
                :require="{message:'请选择安全认证级别!'}"
              >
                <ta-radio-group button-style="solid">
                  <ta-radio-button value="0">
                    无限制
                  </ta-radio-button>
                  <ta-radio-button value="1">
                    一级
                  </ta-radio-button>
                  <ta-radio-button value="2">
                    二级
                  </ta-radio-button>
                  <ta-radio-button value="3">
                    三级
                  </ta-radio-button>
                  <ta-radio-button value="4">
                    四级
                  </ta-radio-button>
                </ta-radio-group>
              </ta-form-item>
            </ta-col>
          </ta-row>
          <ta-row>
            <ta-col :span="24">
              <ta-form-item
                label="有效性"
                :field-decorator-options="{initialValue: formInitValue.effectiveFlag, valuePropName: 'checked'}"
                field-decorator-id="effectiveFlag"
              >
                <ta-switch checked-children="有效" un-checked-children="无效" />
              </ta-form-item>
            </ta-col>
          </ta-row>
        </ta-form>
      </div>
      <div slot="footer">
        <ta-button :style="{marginRight: 8}" @click="form.resetFields()">
          重置
        </ta-button>
        <ta-button @click="$emit('onSaveClick',form)" type="primary">
          保存
        </ta-button>
      </div>
    </ta-drawer>
  </div>
</template>

<script>

import restUrlSelectTag from '../../../../../systemModules/sysmg/modulePart/resourceManagement/part/restUrlSelectTag'

export default {
  name: 'ComponentEditDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
      require: true,
    },
    operateType: {
      type: Boolean,
      default: true,
      require: true,
    },
    formInitValue: {
      type: Object,
      default: () => {},
      require: true,
    },
  },
  data: function () {
    return {
      form: {},
      files: [],
    }
  },
  components: { restUrlSelectTag, },
  mounted () {
    this.files = require.context('@projectCommon/workTableComponents/', false, /.vue$/).keys()
  },
  methods: {
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>

<style scoped>

</style>
