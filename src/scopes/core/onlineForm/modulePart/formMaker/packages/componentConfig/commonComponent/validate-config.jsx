// "校验时机" 配置项  引入了 "校验规则" 配置项
import ValidateRulesConfig from './validate-rules-config'
export default {
  name: 'validate-config',
  components: {ValidateRulesConfig},
  model: {
    prop: 'config',
    event: 'change',
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  render () {
    return (
      <div>
        <ta-label-con label="校验时机">
          <ta-select style="width: 100%" mode="multiple" vModel={this.config.validateTrigger} placeholder="请选择校验时机">
            <ta-select-option value="change">改变</ta-select-option>
            <ta-select-option value="blur">失去焦点</ta-select-option>
          </ta-select>
        </ta-label-con>
        {/* 包一层以使用v-model.lazy，减少设计阶段的校验次数 */}
        <ta-label-con label="校验规则">
          <validate-rules-config
            vModel_lazy={this.config.rules}/>
        </ta-label-con>
      </div>
    )
  }
}
