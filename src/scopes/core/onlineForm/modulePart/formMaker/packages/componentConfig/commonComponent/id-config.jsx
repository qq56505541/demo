// "fieldDecoratorId" 配置项
export default {
  name: 'id-config',
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
      <ta-label-con label="ID">
        <ta-input placeholder="请输入ID" vModel={this.config.fieldDecoratorId}/>
      </ta-label-con>
    )
  }
}
