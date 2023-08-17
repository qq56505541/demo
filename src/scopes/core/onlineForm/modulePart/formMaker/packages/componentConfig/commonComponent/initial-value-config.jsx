// "默认值" 配置项
export default {
  name: 'initial-value-config',
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
      <ta-label-con label="默认值">
        <ta-input placeholder="请输入默认值" vModel={this.config.initialValue}/>
      </ta-label-con>
    )
  }
}
