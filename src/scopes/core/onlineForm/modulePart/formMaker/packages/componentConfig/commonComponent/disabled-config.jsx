// "禁用" 配置项
export default {
  name: 'disabled-config',
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
      <ta-label-con label="是否禁用">
        <ta-switch vModel={this.config.disabled}/>
      </ta-label-con>
    )
  }
}
