import BaseConfig from './commonComponent/base-config'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'color-config',
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
        <ta-label-con label="水平位置">
          <ta-select vModel={this.config.panelPosition} placeholder="请输入弹出框水平位置" style="width: 100%">
            <ta-select-option value="left">左</ta-select-option>
            <ta-select-option value="right">右</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="垂直位置">
          <ta-select vModel={this.config.verticalPosition} placeholder="请输入弹出框垂直位置" style="width: 100%">
            <ta-select-option value="top">上</ta-select-option>
            <ta-select-option value="bottom">下</ta-select-option>
          </ta-select>
        </ta-label-con>
      </base-config>
    )
  }
}
