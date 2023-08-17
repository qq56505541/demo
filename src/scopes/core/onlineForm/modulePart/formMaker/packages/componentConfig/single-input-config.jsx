import BaseConfig from './commonComponent/base-config'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'SingleInputConfig',
  components: { BaseConfig, },
  mixins: [componentConfigMixin],
  model: {
    prop: 'config',
    event: 'change',
  },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      defaultConfigNameList: [
        'label',
        'id',
        'initialValue',
        'placeholder',
        'extra',
        'required',
        'disabled',
        'display',
        'validate'
      ],
    }
  },
  created () {
    this.sensitiveType = [{
      value: undefined,
      label: '不启用',
    }, {
      value: 'name',
      label: '姓名',
    }, {
      value: 'idcard',
      label: '身份证',
    }, {
      value: 'date',
      label: '日期',
    }, {
      value: 'email',
      label: '邮箱',
    },
    {
      value: 'zipcode',
      label: '邮编',
    },
    {
      value: 'telephone',
      label: '座机号码',
    },
    {
      value: 'mobile',
      label: '手机',
    }
    ]
  },
  render () {
    return (
      <BaseConfig
        config={this.config}
        configNameList={this.getConfigNameList}>
        <ta-label-con label="前置标签">
          <ta-input vModel={this.config.addonBefore} placeholder="请输入前置标签"/>
        </ta-label-con>
        <ta-label-con label="后置标签">
          <ta-input vModel={this.config.addonAfter} placeholder="请输入后置标签"/>
        </ta-label-con>
        <ta-label-con label="数据脱敏">
          <ta-select vModel={this.config.sensitive} options={this.sensitiveType} placeholder="请选择数据脱敏类型"/>
        </ta-label-con>
      </BaseConfig>
    )
  },
}
