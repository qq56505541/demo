// "额外内容"配置项
export default {
  name: 'extra-config',
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
      <ta-label-con label="额外信息">
        <ta-input placeholder="请输入额外信息" vModel={this.config.extra}/>
      </ta-label-con>
    )
  }
}
