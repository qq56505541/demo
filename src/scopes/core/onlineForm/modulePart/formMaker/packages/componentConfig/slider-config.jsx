import BaseConfig from './commonComponent/base-config'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'slider-config',
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
        <ta-label-con label="最小值">
          <ta-input-number min={0} max={this.config.max - this.config.step} vModel={this.config.min}
                           placeholder="请输入滑动条最小值" style="width: 100%"/>
        </ta-label-con>
        <ta-label-con label="最大值">
          <ta-input-number min={this.config.min + this.config.step} vModel={this.config.max} placeholder="请输入滑动条最大值"
                           style="width: 100%"/>
        </ta-label-con>
        <ta-label-con label="步长">
          <ta-input-number min={1} max={this.config.max - this.config.min} vModel={this.config.step}
                           placeholder="请输入滑动条步长" style="width: 100%"/>
        </ta-label-con>
        <ta-label-con label="范围">
          <ta-switch vModel={this.config.range}/>
          <ta-popover
            width="220"
            placement="top"
            trigger="hover"
            content="此开关打开时，默认值需要输入两个值，使用逗号隔开">
            <ta-icon slot="reference" type="question-circle" style="cursor: pointer;margin-left: 10px;"/>
          </ta-popover>
        </ta-label-con>
      </base-config>
    )
  }
}
