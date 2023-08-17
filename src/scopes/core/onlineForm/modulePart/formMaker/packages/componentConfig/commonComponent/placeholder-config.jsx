// "占位符" 配置项
export default {
  name: 'placeholder-config',
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
      <ta-label-con label="占位内容">
        <ta-input placeholder="请输入占位内容" vModel={this.config.placeholder}/>
      </ta-label-con>
    )
  }
}
