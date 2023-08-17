import BaseConfig from './commonComponent/base-config'

export default {
  name: 'dynamic-config',
  components: { BaseConfig },
  model: {
    prop: 'config',
    event: 'change'
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultConfigNameList: [
        'label',
        'id'
      ]
    }
  },
  render () {
    return (
      <base-config config={this.config} configNameList={this.defaultConfigNameList}>
        <ta-label-con label="表格宽度">
          <ta-input placeholder="请输入表格宽度" vModel={this.config.tableWidth}/>
        </ta-label-con>
      </base-config>
    )
  }
}
