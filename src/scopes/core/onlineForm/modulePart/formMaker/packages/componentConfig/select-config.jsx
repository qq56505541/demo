import BaseConfig from './commonComponent/base-config'
import dataTabs from './commonComponent/dataTabs'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'select-config',
  components: { dataTabs, BaseConfig },
  mixins: [componentConfigMixin],
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
        'id',
        'initialValue',
        'placeholder',
        'extra',
        'required',
        'disabled',
        'display',
      ]
    }
  },
  render () {
    return (
      <base-config config={this.config} configNameList={this.getConfigNameList}>
        <div style={{ marginBottom: '24px' }}>
          <ta-label-con label="选择类型">
            <ta-select vModel={this.config.mode} placeholder="请选择选择类型" style="width: 100%">
              <ta-select-option value={'default'}>default</ta-select-option>
              <ta-select-option value={'multiple'}>multiple</ta-select-option>
              <ta-select-option value={'tags'}>tags</ta-select-option>
            </ta-select>
          </ta-label-con>
          <data-tabs vModel={this.config}/>
          <ta-label-con label="清除按钮">
            <ta-switch vModel={this.config.allowClear}/>
          </ta-label-con>
        </div>
      </base-config>
    )
  }
}
