import BaseConfig from './commonComponent/base-config'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'rate-config',
  components: { BaseConfig },
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
        <ta-label-con label="star 总数">
          <ta-input-number min={1} vModel={this.config.count} placeholder="请输入star总数" style="width: 100%"/>
        </ta-label-con>
        <ta-label-con label="点击清除">
          <ta-switch vModel={this.config.allowClear}/>
        </ta-label-con>
        <ta-label-con label="允许半选">
          <ta-switch vModel={this.config.allowHalf}/>
        </ta-label-con>
      </base-config>
    )
  }
}
