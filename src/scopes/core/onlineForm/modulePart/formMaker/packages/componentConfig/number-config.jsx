import BaseConfig from './commonComponent/base-config'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'number-config',
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
        <ta-label-con label="最小值">
          <ta-input-number style="width:100%" vModel={this.config.min} placeholder="请输入最小值"/>
        </ta-label-con>
        <ta-label-con label="最大值">
          <ta-input-number style="width:100%" vModel={this.config.max} placeholder="请输入最大值"/>
        </ta-label-con>
        <ta-label-con label="精度">
          <ta-input-number style="width:100%" vModel={this.config.precision} placeholder="请输入精度"/>
        </ta-label-con>
        <ta-label-con label="改变间距">
          <ta-input-number style="width:100%" vModel={this.config.step} placeholder="请输入改变间距"/>
        </ta-label-con>
        <ta-label-con label="小数点">
          <ta-input vModel={this.config.decimalSeparator} placeholder="请输入小数点"/>
        </ta-label-con>
        <ta-label-con label="是否为金额">
          <ta-switch vModel={this.config.asAmount}/>
        </ta-label-con>
        {this.config.asAmount && <ta-label-con label="金额前缀">
          <ta-input vModel={this.config.amountPre} plackholder="请输入金额前缀"/>
        </ta-label-con>}
        <ta-label-con label="右对齐">
          <ta-switch vModel={this.config.alignRight}/>
        </ta-label-con>
      </base-config>
    )
  }
}
