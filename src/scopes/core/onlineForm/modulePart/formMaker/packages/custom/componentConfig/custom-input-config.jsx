import BaseConfig from '../../componentConfig/commonComponent/base-config'
import componentConfigMixin from '../../mixin/componentConfigMixin'

export default {
  name: 'custom-input-config',
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
        <div style="margin: 30px 20px;color: orange">
          这是一个自定义组件的config
        </div>
      </base-config>
    )
  }
}
