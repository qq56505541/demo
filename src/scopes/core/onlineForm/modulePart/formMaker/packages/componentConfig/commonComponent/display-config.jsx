// "是否可见" 配置项
export default {
  name: 'display-config',
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
      <ta-label-con label="是否可见">
        <ta-switch vModel={this.config.display}/>
      </ta-label-con>
    )
  }
}
