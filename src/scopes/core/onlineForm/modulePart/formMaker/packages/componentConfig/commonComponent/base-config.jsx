import DisabledConfig from './disabled-config'
import DisplayConfig from './display-config'
import ExtraConfig from './extra-config'
import IdConfig from './id-config'
import InitialValueConfig from './initial-value-config'
import LabelConfig from './label-config'
import PlaceholderConfig from './placeholder-config'
import RequiredConfig from './required-config'
import SpanConfig from './span-config'
import ValidateConfig from './validate-config'
import WidthConfig from './width-config'

export default {
  name: 'base-config',
  components: {
    DisabledConfig,
    DisplayConfig,
    ExtraConfig,
    IdConfig,
    InitialValueConfig,
    LabelConfig,
    PlaceholderConfig,
    RequiredConfig,
    SpanConfig,
    ValidateConfig,
    WidthConfig
  },
  // v-model属性配置
  model: {
    prop: 'config',
    event: 'change'
  },
  props: {
    // form-item的配置
    config: {
      type: Object,
      required: true
    },
    // 要渲染的配置项
    configNameList: {
      type: Array,
      required: true
    }
  },
  render () {
    return (
      <div>
        {this.configNameList.includes('label') && <label-config config={this.config}/>}
        {this.configNameList.includes('id') && <id-config config={this.config}/>}
        {this.configNameList.includes('width') && <width-config config={this.config}/>}
        {this.configNameList.includes('span') && <span-config config={this.config}/>}
        {this.configNameList.includes('initialValue') && <initial-value-config config={this.config}/>}
        {this.configNameList.includes('placeholder') && <placeholder-config config={this.config}/>}
        {this.configNameList.includes('extra') && <extra-config config={this.config}/>}
        {/* 默认匿名插槽，用于显示组件各自特有的配置 */}
        {this.$slots.default}
        {this.configNameList.includes('required') && <required-config config={this.config}/>}
        {this.configNameList.includes('disabled') && <disabled-config config={this.config}/>}
        {this.configNameList.includes('display') && <display-config config={this.config}/>}
        {this.configNameList.includes('validate') && <validate-config config={this.config}/>}
      </div>
    )
  }
}
