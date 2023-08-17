import BaseConfig from './commonComponent/base-config'
import dataTabs from './commonComponent/dataTabs'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'radio-config',
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
        <div style="margin-bottom: 24px">
          <data-tabs vModel={this.config}/>
        </div>
      </base-config>
    )
  }
}
