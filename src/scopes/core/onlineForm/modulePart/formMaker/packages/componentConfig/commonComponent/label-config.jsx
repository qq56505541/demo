// "label" 配置项
export default {
  name: 'label-config',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  model: {
    prop: 'config',
    event: 'change',
  },
  render () {
    return (
      <ta-label-con label="Label">
        <ta-input disabled={'divider' === this.config.type} placeholder="请输入Label" vModel={this.config.label}/>
      </ta-label-con>
    )
  }
}
