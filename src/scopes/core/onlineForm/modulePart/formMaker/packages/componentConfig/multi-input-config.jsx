import BaseConfig from './commonComponent/base-config'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'multi-input-config',
  components: { BaseConfig },
  mixins: [componentConfigMixin],
  model: {
    prop: 'config',
    event: 'change'
  },
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
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
        'validate'
      ]
    }
  },
  render () {
    return (
      <base-config config={this.config} configNameList={this.getConfigNameList}>
        <ta-label-con label="行数">
          <ta-input-number style="width: 100%" min={1} vModel={this.config.rows} placeholder="请输入文本域默认行数"/>
        </ta-label-con>
      </base-config>
    )
  }
}
